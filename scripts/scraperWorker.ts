import { processNextQueuedJob } from "../lib/scrapeQueue";

const POLL_INTERVAL_MS = Number(process.env.SCRAPE_WORKER_INTERVAL_MS ?? 10000);

async function main() {
  await processNextQueuedJob();
  setInterval(() => {
    void processNextQueuedJob();
  }, POLL_INTERVAL_MS);
}

main().catch((error) => {
  console.error("Scrape worker crashed:", error);
  process.exit(1);
});
