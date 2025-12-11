"""
5-crawl_recursive_internal_links.py
----------------------------------
Recursively crawls a site starting from a root URL, using Crawl4AI's arun_many and a memory-adaptive dispatcher.
At each depth, all internal links are discovered and crawled in parallel, up to a specified depth, with deduplication.
Persists crawled markdown to the knowledge base directory for ingestion.
"""
import asyncio
import os
from pathlib import Path
from urllib.parse import urldefrag, urlparse

from crawl4ai import (
    AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode,
    MemoryAdaptiveDispatcher
)

REPO_ROOT = Path(__file__).resolve().parents[2]
OUTPUT_DIR = Path(os.environ.get("CRAWL_OUTPUT_DIR", REPO_ROOT / "public" / "knowledge_base"))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def _slugify(url: str) -> str:
    parsed = urlparse(url)
    path = parsed.path.strip("/") or "index"
    return f"{parsed.netloc}_{path}".replace("/", "_")


def _save_markdown(url: str, markdown: str) -> None:
    file_path = OUTPUT_DIR / f"{_slugify(url)}.md"
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(markdown)

async def crawl_recursive_batch(start_urls, max_depth=3, max_concurrent=10):
    browser_config = BrowserConfig(headless=True, verbose=False)
    run_config = CrawlerRunConfig(
        cache_mode=CacheMode.BYPASS,
        stream=False
    )
    dispatcher = MemoryAdaptiveDispatcher(
        memory_threshold_percent=70.0,      # Don't exceed 70% memory usage
        check_interval=1.0,                 # Check memory every second
        max_session_permit=max_concurrent   # Max parallel browser sessions
    )

    # Track visited URLs to prevent revisiting and infinite loops (ignoring fragments)
    visited = set()
    def normalize_url(url):
        # Remove fragment (part after #)
        return urldefrag(url)[0]
    current_urls = set([normalize_url(u) for u in start_urls])

    async with AsyncWebCrawler(config=browser_config) as crawler:
        for depth in range(max_depth):
            print(f"\n=== Crawling Depth {depth+1} ===")
            # Only crawl URLs we haven't seen yet (ignoring fragments)
            urls_to_crawl = [normalize_url(url) for url in current_urls if normalize_url(url) not in visited]

            if not urls_to_crawl:
                break

            # Batch-crawl all URLs at this depth in parallel
            results = await crawler.arun_many(
                urls=urls_to_crawl,
                config=run_config,
                dispatcher=dispatcher
            )

            next_level_urls = set()

            for result in results:
                norm_url = normalize_url(result.url)
                visited.add(norm_url)  # Mark as visited (no fragment)
                if result.success:
                    markdown = getattr(
                        getattr(result, "markdown", None),
                        "raw_markdown",
                        getattr(result, "markdown", ""),
                    )
                    print(f"[OK] {result.url} | Markdown: {len(markdown) if markdown else 0} chars")
                    _save_markdown(result.url, markdown)
                    # Collect all new internal links for the next depth
                    for link in result.links.get("internal", []):
                        next_url = normalize_url(link["href"])
                        if next_url not in visited:
                            next_level_urls.add(next_url)
                else:
                    print(f"[ERROR] {result.url}: {result.error_message}")
                    
            # Move to the next set of URLs for the next recursion depth
            current_urls = next_level_urls

if __name__ == "__main__":
    target = os.environ.get("CRAWL_TARGET_URL", "https://automationghana.com/")
    asyncio.run(crawl_recursive_batch([target], max_depth=3, max_concurrent=10))
