"""
4-crawl_and_chunk_markdown.py
-----------------------------
Scrapes a Markdown (.md or .txt) page using Crawl4AI, then splits the content into chunks based on # and ## headers.
Prints each chunk for further processing or inspection and persists the raw markdown for ingestion.
"""
import asyncio
import os
from pathlib import Path
import re
from urllib.parse import urlparse

from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig

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

async def scrape_and_chunk_markdown(url: str):
    """
    Scrape a Markdown page and split into chunks by # and ## headers.
    """
    browser_config = BrowserConfig(headless=True)
    crawl_config = CrawlerRunConfig()
    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun(url=url, config=crawl_config)
        if not result.success:
            print(f"Failed to crawl {url}: {result.error_message}")
            return
        markdown = getattr(
            getattr(result, "markdown", None),
            "raw_markdown",
            getattr(result, "markdown", ""),
        )
        _save_markdown(url, markdown)
        # Split by headers (#, ##)
        # Find all # and ## headers to use as chunk boundaries
        header_pattern = re.compile(r'^(# .+|## .+)$', re.MULTILINE)
        headers = [m.start() for m in header_pattern.finditer(markdown)] + [len(markdown)]
        chunks = []
        # Split the markdown into chunks between headers
        for i in range(len(headers)-1):
            chunk = markdown[headers[i]:headers[i+1]].strip()
            if chunk:
                chunks.append(chunk)
        print(f"Split into {len(chunks)} chunks:")
        for idx, chunk in enumerate(chunks):
            print(f"\n--- Chunk {idx+1} ---\n{chunk}\n")

if __name__ == "__main__":
    url = os.environ.get("CRAWL_TARGET_URL", "https://automationghana.com/llms.txt")
    asyncio.run(scrape_and_chunk_markdown(url))
