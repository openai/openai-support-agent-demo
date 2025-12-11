import asyncio
import os
import sys
from pathlib import Path
from typing import List
from urllib.parse import urlparse

from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig
from crawl4ai.markdown_generation_strategy import DefaultMarkdownGenerator

# Import sitemap parser from insert_docs
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)
from insert_docs import parse_sitemap

REPO_ROOT = Path(__file__).resolve().parents[2]
OUTPUT_DIR = Path(os.environ.get("CRAWL_OUTPUT_DIR", REPO_ROOT / "public" / "knowledge_base"))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def _slugify(url: str) -> str:
    parsed = urlparse(url)
    path = parsed.path.strip("/") or "index"
    filename = f"{parsed.netloc}_{path}".replace("/", "_")
    return filename


def _save_markdown(url: str, markdown: str) -> None:
    file_path = OUTPUT_DIR / f"{_slugify(url)}.md"
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(markdown)

async def crawl_sequential(urls: List[str]):
    print("\n=== Sequential Crawling with Session Reuse ===")

    browser_config = BrowserConfig(
        headless=True,
        # For better performance in Docker or low-memory environments:
        extra_args=["--disable-gpu", "--disable-dev-shm-usage", "--no-sandbox"],
    )

    crawl_config = CrawlerRunConfig(
        markdown_generator=DefaultMarkdownGenerator()
    )

    # Create the crawler (opens the browser)
    crawler = AsyncWebCrawler(config=browser_config)
    await crawler.start()

    try:
        session_id = "session1"  # Reuse the same session across all URLs
        for url in urls:
            result = await crawler.arun(
                url=url,
                config=crawl_config,
                session_id=session_id
            )
            if result.success:
                print(f"Successfully crawled: {url}")
                markdown = getattr(
                    getattr(result, "markdown", None),
                    "raw_markdown",
                    getattr(result, "markdown", ""),
                )
                print(f"Markdown length: {len(markdown)}")
                _save_markdown(url, markdown)
            else:
                print(f"Failed: {url} - Error: {result.error_message}")
    finally:
        # After all URLs are done, close the crawler (and the browser)
        await crawler.close()

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
        await crawl_sequential(urls)
    else:
        print("No URLs found to crawl")

if __name__ == "__main__":
    asyncio.run(main())
