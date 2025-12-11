import cron from "node-cron";

import { enqueueScheduledJobs } from "@/lib/scheduler";
import { ScrapeJobCadence } from "@/lib/generated/prisma";
import { processNextQueuedJob } from "@/lib/scrapeQueue";

const TIMEZONE = process.env.SCHEDULER_TIMEZONE ?? "Africa/Accra";
const AUTO_RUN_MANUAL_WITH_NEXT = process.env.AUTO_RUN_MANUAL_WITH_NEXT === "true";
const MANUAL_CRON_EXPRESSION =
  process.env.MANUAL_CADENCE_CRON ?? process.env.MANUAL_CRON_EXPRESSION ?? "* * * * *";
const MIN_MANUAL_INTERVAL_MS = Number(process.env.MANUAL_MIN_INTERVAL_MS ?? 45_000);

const manualCadenceGuard = {
  inFlight: false,
  lastRun: 0,
};

async function runCadence(cadence: ScrapeJobCadence, autoRunManualWithNext: boolean) {
  try {
    const queued = await enqueueScheduledJobs({ cadence, autoRunManualWithNext });
    if (queued.length > 0) {
      console.log(`Queued ${queued.length} ${cadence} scrape job(s).`);
    }
    let processed = 0;
    while (await processNextQueuedJob()) {
      processed += 1;
    }

    if (processed > 0) {
      console.log(`Started ${processed} queued ${cadence} job(s).`);
    }
  } catch (error) {
    console.error(`Failed to enqueue ${cadence} scrape jobs:`, error);
  }
}

function scheduleCadence(
  cronExpression: string,
  cadence: ScrapeJobCadence,
  autoRunManualWithNext: boolean
) {
  const guardedRun = async () => {
    if (cadence !== ScrapeJobCadence.manual) {
      await runCadence(cadence, autoRunManualWithNext);
      return;
    }

    const now = Date.now();
    if (manualCadenceGuard.inFlight) return;
    if (Number.isFinite(MIN_MANUAL_INTERVAL_MS) && MIN_MANUAL_INTERVAL_MS > 0) {
      const delta = now - manualCadenceGuard.lastRun;
      if (delta < MIN_MANUAL_INTERVAL_MS) return;
    }

    manualCadenceGuard.inFlight = true;
    manualCadenceGuard.lastRun = now;
    try {
      await runCadence(cadence, autoRunManualWithNext);
    } finally {
      manualCadenceGuard.inFlight = false;
    }
  };

  cron.schedule(cronExpression, () => void guardedRun(), {
    timezone: TIMEZONE ?? undefined,
  });
}

async function main() {
  console.log(`Scheduler worker starting with timezone: ${TIMEZONE}`);
  // Catch up once on startup.
  await runCadence(ScrapeJobCadence.daily, AUTO_RUN_MANUAL_WITH_NEXT);
  await runCadence(ScrapeJobCadence.weekly, AUTO_RUN_MANUAL_WITH_NEXT);
  await runCadence(ScrapeJobCadence.monthly, AUTO_RUN_MANUAL_WITH_NEXT);
  await runCadence(ScrapeJobCadence.manual, AUTO_RUN_MANUAL_WITH_NEXT);

  scheduleCadence("0 0 * * *", ScrapeJobCadence.daily, AUTO_RUN_MANUAL_WITH_NEXT); // Midnight daily
  scheduleCadence("0 0 * * 0", ScrapeJobCadence.weekly, AUTO_RUN_MANUAL_WITH_NEXT); // Midnight Sunday
  scheduleCadence("0 0 1 * *", ScrapeJobCadence.monthly, AUTO_RUN_MANUAL_WITH_NEXT); // Midnight on the 1st
  scheduleCadence(MANUAL_CRON_EXPRESSION, ScrapeJobCadence.manual, AUTO_RUN_MANUAL_WITH_NEXT);
}

main().catch((error) => {
  console.error("Scheduler worker crashed:", error);
  process.exit(1);
});
