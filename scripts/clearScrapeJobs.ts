import "dotenv/config";

import prisma from "@/lib/prisma";

async function run() {
  if (process.env.ALLOW_SCRAPE_PURGE !== "true") {
    console.error(
      "Refusing to purge scrape jobs: set ALLOW_SCRAPE_PURGE=true to enable this command."
    );
    process.exit(1);
  }

  const result = await prisma.scrapeJob.deleteMany();
  console.log(`Deleted ${result.count} scrape job(s).`);
}

run()
  .catch((err) => {
    console.error("Failed to purge scrape jobs", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
