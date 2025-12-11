import prisma from "./prisma";
import { Prisma, ScrapeJob, ScrapeJobStatus } from "./generated/prisma";
import { runScrapeJob } from "./scrapeRunner";

const ADVISORY_LOCK_ID = Number(process.env.SCRAPE_WORKER_LOCK_ID ?? "68001");
const LOCK_TRANSACTION_TIMEOUT_MS = Number(
  process.env.SCRAPE_WORKER_LOCK_TIMEOUT_MS ?? 15 * 60 * 1000
);

async function withAdvisoryLock<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T | undefined> {
  return prisma.$transaction(
    async (tx) => {
      const result = await tx.$queryRaw<{ acquired: boolean }[]>`
        SELECT pg_try_advisory_lock(${ADVISORY_LOCK_ID}) as acquired
      `;

      if (!result[0]?.acquired) {
        return undefined;
      }

      try {
        return await fn(tx);
      } finally {
        const unlockResult = await tx.$queryRaw<{ released: boolean }[]>`
          SELECT pg_advisory_unlock(${ADVISORY_LOCK_ID}) as released
        `;

        if (!unlockResult[0]?.released) {
          console.warn(
            `Failed to release advisory lock ${ADVISORY_LOCK_ID}; lock may remain held.`
          );
        }
      }
    },
    { timeout: LOCK_TRANSACTION_TIMEOUT_MS }
  );
}

async function claimNextJob(
  client: Prisma.TransactionClient
): Promise<ScrapeJob | null> {
  return client.scrapeJob.findFirst({
    where: {
      status: ScrapeJobStatus.queued,
      paused: false,
      OR: [{ nextRunAt: null }, { nextRunAt: { lte: new Date() } }],
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function reserveNextJob() {
  return withAdvisoryLock(async (tx) => {
    const job = await claimNextJob(tx);
    if (!job) return null;

    const updated = await tx.scrapeJob.updateMany({
      where: {
        id: job.id,
        status: ScrapeJobStatus.queued,
        paused: false,
      },
      data: { status: ScrapeJobStatus.running },
    });

    if (updated.count === 0) return null;

    const freshJob = await tx.scrapeJob.findUnique({ where: { id: job.id } });
    if (!freshJob) return null;

    return freshJob;
  });
}

export async function processNextQueuedJob() {
  const job = await reserveNextJob();
  if (!job) return null;

  try {
    await runScrapeJob(job);
  } catch (error) {
    console.error(`Job ${job.id} failed:`, error);
    await prisma.scrapeJob.update({
      where: { id: job.id },
      data: {
        status: ScrapeJobStatus.failed,
        finishedAt: new Date(),
      },
    });
  }

  return job;
}
