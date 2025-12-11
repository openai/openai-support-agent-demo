import asyncio
import json
import os
from typing import List, Tuple
from urllib.parse import urlparse
import requests

from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig
from crawl4ai.markdown_generation_strategy import DefaultMarkdownGenerator

DEFAULT_BASE_URL = "https://store.automationghana.com"
DEFAULT_CATEGORIES = [
    "building-essentials",
    "cables-cable-management",
    "electrical-power-distribution",
    "enclosures-and-junction-boxes",
    "hiok",
    "industrial-automation",
    "industrial-controls",
    "invisible-category",
    "legacy-items",
    "lighting-switches-and-sockets",
    "ppes",
    "renewables",
    "sinova-siemens",
    "smart-home",
    "special-promotions",
    "tools-and-measuring-equipment",
]

PROJECT_ROOT = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "public", "knowledge_base")
os.makedirs(OUTPUT_DIR, exist_ok=True)


def _slugify(url: str) -> str:
    parsed = urlparse(url)
    path = parsed.path.strip("/") or "index"
    filename = f"{parsed.netloc}_{path}".replace("/", "_")
    return filename


def _save_markdown(url: str, markdown: str) -> None:
    file_path = os.path.join(OUTPUT_DIR, f"{_slugify(url)}.md")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(markdown)

def normalize_slug(value: str) -> str:
    parsed = urlparse(value)
    if parsed.scheme and parsed.netloc:
        slug = parsed.path.rstrip("/").split("/")[-1]
        return slug
    return value.strip().strip("/")


def load_job_args() -> Tuple[str, List[str], str]:
    raw_target = os.getenv("SCRAPE_TARGET_URL") or os.getenv("TARGET_URL")
    base_url = raw_target.strip() if raw_target else DEFAULT_BASE_URL
    try:
        parsed = urlparse(base_url)
        if not parsed.scheme or not parsed.netloc:
            base_url = DEFAULT_BASE_URL
    except Exception:
        base_url = DEFAULT_BASE_URL

    api_base_override = os.getenv("WOOCOMMERCE_API_BASE")
    api_base = (api_base_override.strip() if api_base_override else f"{base_url.rstrip('/')}/wp-json/wp/v2")

    raw_categories = (
        os.getenv("SCRAPE_WOOCOMMERCE_CATEGORIES")
        or os.getenv("SCRAPE_CATEGORIES")
        or os.getenv("CATEGORIES")
    )

    parsed_categories: List[str] = []
    if raw_categories:
        try:
            loaded = json.loads(raw_categories)
            if isinstance(loaded, list):
                parsed_categories = [normalize_slug(str(item)) for item in loaded if str(item).strip()]
            elif isinstance(loaded, str):
                parsed_categories = [normalize_slug(part) for part in loaded.split(",") if part.strip()]
        except json.JSONDecodeError:
            parsed_categories = [normalize_slug(part) for part in raw_categories.split(",") if part.strip()]

    categories = parsed_categories or DEFAULT_CATEGORIES
    return base_url.rstrip("/"), categories, api_base.rstrip("/")


def get_category_id(slug: str, api_base: str) -> int:
    resp = requests.get(f"{api_base}/product_cat", params={"slug": slug}, timeout=20)
    resp.raise_for_status()
    data = resp.json()
    if not data:
        raise ValueError(f"Category not found for slug: {slug}")
    return data[0]["id"]


def fetch_product_urls(cat_id: int, api_base: str) -> List[str]:
    urls: List[str] = []
    page = 1
    while True:
        resp = requests.get(
            f"{api_base}/product",
            params={"product_cat": cat_id, "per_page": 100, "page": page},
            timeout=20,
        )
        if resp.status_code != 200:
            break
        data = resp.json()
        if not data:
            break
        urls.extend(item.get("link") for item in data if item.get("link"))
        page += 1
    return urls


async def crawl_products(urls: List[str]):
    browser_config = BrowserConfig(
        headless=True,
        extra_args=["--disable-gpu", "--disable-dev-shm-usage", "--no-sandbox"],
    )
    crawl_config = CrawlerRunConfig(markdown_generator=DefaultMarkdownGenerator())

    crawler = AsyncWebCrawler(config=browser_config)
    await crawler.start()

    try:
        session_id = "woocommerce_session"
        for url in urls:
            result = await crawler.arun(url=url, config=crawl_config, session_id=session_id)
            if result.success:
                markdown = getattr(getattr(result, "markdown", None), "raw_markdown", getattr(result, "markdown", ""))
                _save_markdown(url, markdown)
                print(f"Saved markdown for {url}")
            else:
                print(f"Failed to crawl {url}: {result.error_message}")
    finally:
        await crawler.close()


async def main():
    base_url, categories, api_base = load_job_args()
    category_urls = [f"{base_url}/product-category/{slug.strip('/')}/" for slug in categories]
    product_urls: List[str] = []
    for cat_url in category_urls:
        slug = cat_url.rstrip("/").split("/")[-1]
        try:
            cat_id = get_category_id(slug, api_base)
        except Exception as e:
            print(f"Could not find ID for {slug}: {e}")
            continue
        urls = fetch_product_urls(cat_id, api_base)
        print(f"{slug}: found {len(urls)} products")
        product_urls.extend(urls)

    if product_urls:
        await crawl_products(product_urls)
    else:
        print("No product URLs found")


if __name__ == "__main__":
    asyncio.run(main())
