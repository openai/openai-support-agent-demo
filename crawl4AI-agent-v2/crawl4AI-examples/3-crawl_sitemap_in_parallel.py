"""
3-crawl_docs_FAST.py
--------------------
Batch-crawls a list of documentation URLs in parallel using Crawl4AI's arun_many and a memory-adaptive dispatcher.
Tracks memory usage, prints a summary of successes/failures, and is suitable for large-scale doc scraping jobs.
Usage: Call main() or run as a script. Adjust max_concurrent for parallelism.
"""
import os
import sys
from pathlib import Path
import psutil
import asyncio
from typing import List
from urllib.parse import urlparse

# Use sitemap parser from insert_docs
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)
from insert_docs import parse_sitemap

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
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode, MemoryAdaptiveDispatcher

async def crawl_parallel(urls: List[str], max_concurrent: int = 10):
    print("\n=== Parallel Crawling with arun_many + Dispatcher ===")

    # Track the peak memory usage for observability
    peak_memory = 0
    process = psutil.Process(os.getpid())
    def log_memory(prefix: str = ""):
        nonlocal peak_memory
        current_mem = process.memory_info().rss  # in bytes
        if current_mem > peak_memory:
            peak_memory = current_mem
        print(f"{prefix} Current Memory: {current_mem // (1024 * 1024)} MB, Peak: {peak_memory // (1024 * 1024)} MB")

    # Configure the browser for headless operation and resource limits
    browser_config = BrowserConfig(
        headless=True,
        verbose=False,
        extra_args=["--disable-gpu", "--disable-dev-shm-usage", "--no-sandbox"],
    )
    # Set up crawl config and dispatcher for batch crawling
    crawl_config = CrawlerRunConfig(cache_mode=CacheMode.BYPASS, stream=False)
    dispatcher = MemoryAdaptiveDispatcher(
        memory_threshold_percent=70.0,  # Don't exceed 70% memory usage
        check_interval=1.0,             # Check memory every second
        max_session_permit=max_concurrent  # Max parallel browser sessions
    )

    async with AsyncWebCrawler(config=browser_config) as crawler:
        log_memory("Before crawl: ")
        # arun_many handles all URLs in parallel, batching and resource management handled by dispatcher
        results = await crawler.arun_many(
            urls=urls,
            config=crawl_config,
            dispatcher=dispatcher
        )
        success_count = 0
        fail_count = 0
        # Loop through all crawl results and tally success/failure
        for result in results:
            if result.success:
                success_count += 1
                markdown = getattr(
                    getattr(result, "markdown", None),
                    "raw_markdown",
                    getattr(result, "markdown", ""),
                )
                _save_markdown(result.url, markdown)
            else:
                print(f"Error crawling {result.url}: {result.error_message}")
                fail_count += 1

        print(f"\nSummary:")
        print(f"  - Successfully crawled: {success_count}")
        print(f"  - Failed: {fail_count}")
        log_memory("After crawl: ")
        print(f"\nPeak memory usage (MB): {peak_memory // (1024 * 1024)}")

def get_pydantic_ai_docs_urls():
    """
    Fetches all URLs from the Pydantic AI documentation.
    Uses the sitemap (https://automationghana.com/sitemap_index.xml) to get these URLs.
    
    Returns:
        List[str]: List of URLs
    """            
    sitemap_url = os.environ.get("CRAWL_TARGET_URL", "https://automationghana.com/sitemap_index.xml")
    return parse_sitemap(sitemap_url)

async def main():
    urls = get_pydantic_ai_docs_urls()
    if urls:
        print(f"Found {len(urls)} URLs to crawl")
        await crawl_parallel(urls, max_concurrent=10)
    else:
        print("No URLs found to crawl")    

if __name__ == "__main__":
    asyncio.run(main())
