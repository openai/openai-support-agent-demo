"""
insert_docs.py
--------------
Command-line utility to crawl any URL using Crawl4AI, detect content type (sitemap, .txt, or regular page),
use the appropriate crawl method, chunk the resulting Markdown into <1000 character blocks by header hierarchy,
and insert all chunks into ChromaDB with metadata.

Usage:
    python insert_docs.py <URL> [--collection ...] [--db-dir ...] [--embedding-model ...]
"""
import argparse
import sys
import re
import os as _os
import asyncio
from typing import List, Dict, Any
from urllib.parse import urlparse, urldefrag
from xml.etree import ElementTree
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode, MemoryAdaptiveDispatcher
import requests
from utils import get_chroma_client, get_or_create_collection, add_documents_to_collection

def smart_chunk_markdown(markdown: str, max_len: int = 1000) -> List[str]:
    """Hierarchically splits markdown by #, ##, ### headers, then by characters, to ensure all chunks < max_len."""
    def split_by_header(md, header_pattern):
        indices = [m.start() for m in re.finditer(header_pattern, md, re.MULTILINE)]
        indices.append(len(md))
        return [md[indices[i]:indices[i+1]].strip() for i in range(len(indices)-1) if md[indices[i]:indices[i+1]].strip()]

    chunks = []

    for h1 in split_by_header(markdown, r'^# .+$'):
        if len(h1) > max_len:
            for h2 in split_by_header(h1, r'^## .+$'):
                if len(h2) > max_len:
                    for h3 in split_by_header(h2, r'^### .+$'):
                        if len(h3) > max_len:
                            for i in range(0, len(h3), max_len):
                                chunks.append(h3[i:i+max_len].strip())
                        else:
                            chunks.append(h3)
                else:
                    chunks.append(h2)
        else:
            chunks.append(h1)

    final_chunks = []

    for c in chunks:
        if len(c) > max_len:
            final_chunks.extend([c[i:i+max_len].strip() for i in range(0, len(c), max_len)])
        else:
            final_chunks.append(c)

    return [c for c in final_chunks if c]

def is_sitemap(url: str) -> bool:
    return url.endswith('sitemap.xml') or 'sitemap' in urlparse(url).path

def is_txt(url: str) -> bool:
    return url.endswith('.txt')

async def crawl_recursive_internal_links(start_urls, max_depth=3, max_concurrent=10) -> List[Dict[str,Any]]:
    """Recursive crawl using logic from 5-crawl_recursive_internal_links.py. Returns list of dicts with url and markdown."""
    browser_config = BrowserConfig(headless=True, verbose=False)
    run_config = CrawlerRunConfig(cache_mode=CacheMode.BYPASS, stream=False)
    dispatcher = MemoryAdaptiveDispatcher(
        memory_threshold_percent=70.0,
        check_interval=1.0,
        max_session_permit=max_concurrent
    )

    visited = set()

    def normalize_url(url):
        return urldefrag(url)[0]

    current_urls = set([normalize_url(u) for u in start_urls])
    results_all = []

    async with AsyncWebCrawler(config=browser_config) as crawler:
        for depth in range(max_depth):
            urls_to_crawl = [normalize_url(url) for url in current_urls if normalize_url(url) not in visited]
            if not urls_to_crawl:
                break

            results = await crawler.arun_many(urls=urls_to_crawl, config=run_config, dispatcher=dispatcher)
            next_level_urls = set()

            for result in results:
                norm_url = normalize_url(result.url)
                visited.add(norm_url)

                if result.success and result.markdown:
                    results_all.append({'url': result.url, 'markdown': result.markdown})
                    for link in result.links.get("internal", []):
                        next_url = normalize_url(link["href"])
                        if next_url not in visited:
                            next_level_urls.add(next_url)

            current_urls = next_level_urls

    return results_all

async def crawl_markdown_file(url: str) -> List[Dict[str,Any]]:
    """Crawl a .txt or markdown file using logic from 4-crawl_and_chunk_markdown.py."""
    browser_config = BrowserConfig(headless=True)
    crawl_config = CrawlerRunConfig()

    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun(url=url, config=crawl_config)
        if result.success and result.markdown:
            return [{'url': url, 'markdown': result.markdown}]
        else:
            print(f"Failed to crawl {url}: {result.error_message}")
            return []

def parse_sitemap(
    sitemap_url: str,
    *,
    max_depth: int = 5,
    request_timeout: float | tuple[float, float] | None = (20, 40),
) -> List[str]:
    """Return all URLs contained in a sitemap or sitemap index without unbounded recursion.

    If CRAWL_TARGET_URL is set, it overrides the provided sitemap_url so callers don't
    need to modify their scripts to target a different site.
    """

    override_url = _os.environ.get("CRAWL_TARGET_URL")
    if override_url:
        sitemap_url = override_url

    session = requests.Session()
    to_visit = [(sitemap_url, 0)]
    visited = set()
    collected: list[str] = []

    while to_visit:
        current_url, depth = to_visit.pop(0)
        if current_url in visited or depth > max_depth:
            continue
        visited.add(current_url)

        try:
            resp = session.get(current_url, timeout=request_timeout)
        except Exception as exc:
            print(f"Failed to fetch sitemap {current_url}: {exc}")
            continue

        if resp.status_code != 200:
            print(f"Failed to fetch sitemap {current_url}: {resp.status_code}")
            continue

        try:
            tree = ElementTree.fromstring(resp.content)
        except Exception as exc:  # noqa: BLE001
            print(f"Error parsing sitemap XML from {current_url}: {exc}")
            continue

        if tree.tag.endswith("sitemapindex"):
            child_sitemaps = [loc.text for loc in tree.findall('.//{*}loc') if loc.text]
            for child in child_sitemaps:
                if child not in visited:
                    to_visit.append((child, depth + 1))
        else:
            collected.extend(loc.text for loc in tree.findall('.//{*}loc') if loc.text)

    return collected

async def crawl_batch(urls: List[str], max_concurrent: int = 10) -> List[Dict[str,Any]]:
    """Batch crawl using logic from 3-crawl_sitemap_in_parallel.py."""
    browser_config = BrowserConfig(headless=True, verbose=False)
    crawl_config = CrawlerRunConfig(cache_mode=CacheMode.BYPASS, stream=False)
    dispatcher = MemoryAdaptiveDispatcher(
        memory_threshold_percent=70.0,
        check_interval=1.0,
        max_session_permit=max_concurrent
    )

    async with AsyncWebCrawler(config=browser_config) as crawler:
        results = await crawler.arun_many(urls=urls, config=crawl_config, dispatcher=dispatcher)
        return [{'url': r.url, 'markdown': r.markdown} for r in results if r.success and r.markdown]

def extract_section_info(chunk: str) -> Dict[str, Any]:
    """Extracts headers and stats from a chunk."""
    headers = re.findall(r'^(#+)\s+(.+)$', chunk, re.MULTILINE)
    header_str = '; '.join([f'{h[0]} {h[1]}' for h in headers]) if headers else ''

    return {
        "headers": header_str,
        "char_count": len(chunk),
        "word_count": len(chunk.split())
    }

def main():
    parser = argparse.ArgumentParser(description="Insert crawled docs into ChromaDB")
    parser.add_argument("url", help="URL to crawl (regular, .txt, or sitemap)")
    parser.add_argument("--collection", default="docs", help="ChromaDB collection name")
    parser.add_argument("--db-dir", default="./chroma_db", help="ChromaDB directory")
    parser.add_argument("--embedding-model", default="all-MiniLM-L6-v2", help="Embedding model name")
    parser.add_argument("--chunk-size", type=int, default=1000, help="Max chunk size (chars)")
    parser.add_argument("--max-depth", type=int, default=3, help="Recursion depth for regular URLs")
    parser.add_argument("--max-concurrent", type=int, default=10, help="Max parallel browser sessions")
    parser.add_argument("--batch-size", type=int, default=100, help="ChromaDB insert batch size")
    args = parser.parse_args()

    # Detect URL type
    url = args.url
    if is_txt(url):
        print(f"Detected .txt/markdown file: {url}")
        crawl_results = asyncio.run(crawl_markdown_file(url))
    elif is_sitemap(url):
        print(f"Detected sitemap: {url}")
        sitemap_urls = parse_sitemap(url)
        if not sitemap_urls:
            print("No URLs found in sitemap.")
            sys.exit(1)
        crawl_results = asyncio.run(crawl_batch(sitemap_urls, max_concurrent=args.max_concurrent))
    else:
        print(f"Detected regular URL: {url}")
        crawl_results = asyncio.run(crawl_recursive_internal_links([url], max_depth=args.max_depth, max_concurrent=args.max_concurrent))

    # Chunk and collect metadata
    ids, documents, metadatas = [], [], []
    chunk_idx = 0
    for doc in crawl_results:
        url = doc['url']
        md = doc['markdown']
        chunks = smart_chunk_markdown(md, max_len=args.chunk_size)
        for chunk in chunks:
            ids.append(f"chunk-{chunk_idx}")
            documents.append(chunk)
            meta = extract_section_info(chunk)
            meta["chunk_index"] = chunk_idx
            meta["source"] = url
            metadatas.append(meta)
            chunk_idx += 1

    if not documents:
        print("No documents found to insert.")
        sys.exit(1)

    print(f"Inserting {len(documents)} chunks into ChromaDB collection '{args.collection}'...")

    client = get_chroma_client(args.db_dir)
    collection = get_or_create_collection(client, args.collection, embedding_model_name=args.embedding_model)
    add_documents_to_collection(collection, ids, documents, metadatas, batch_size=args.batch_size)

    print(f"Successfully added {len(documents)} chunks to ChromaDB collection '{args.collection}'.")

if __name__ == "__main__":
    main()
