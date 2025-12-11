import crypto from "crypto";
import { EventEmitter } from "events";
import Redis from "ioredis";

import { ScrapeJobStatus } from "./generated/prisma";

type JobUpdatePayload = {
  jobId: string;
  status: ScrapeJobStatus;
  startedAt?: string | null;
  finishedAt?: string | null;
  logPath?: string | null;
  progress?: number;
};

type CrossProcessMessage = {
  sourceId: string;
  update: JobUpdatePayload;
};

declare global {
  var __scrapeJobEmitter: EventEmitter | undefined;
}

const emitter = globalThis.__scrapeJobEmitter ?? new EventEmitter();
if (!globalThis.__scrapeJobEmitter) {
  globalThis.__scrapeJobEmitter = emitter;
}

emitter.setMaxListeners(100);

const CHANNEL = "scrape_job_updates";
const PROCESS_ID = crypto.randomUUID();

const redisUrl = process.env.REDIS_URL;

const publisher = redisUrl
  ? new Redis(redisUrl, { lazyConnect: true, maxRetriesPerRequest: 0 })
  : null;
const subscriber = redisUrl
  ? new Redis(redisUrl, { lazyConnect: true, maxRetriesPerRequest: 0 })
  : null;

publisher?.on("error", () => {});
subscriber?.on("error", () => {});

publisher?.connect().catch(() => {});
subscriber?.connect().catch(() => {});

if (subscriber) {
  subscriber
    .subscribe(CHANNEL)
    .then(() => {
      subscriber.on("message", (_channel, message) => {
        try {
          const parsed = JSON.parse(message) as CrossProcessMessage;
          if (!parsed?.update || parsed.sourceId === PROCESS_ID) return;
          emitter.emit("job_update", parsed.update);
        } catch {
          // ignore invalid messages
        }
      });
    })
    .catch(() => {});
}

export function emitJobUpdate(update: JobUpdatePayload) {
  emitter.emit("job_update", update);

  if (publisher) {
    const payload: CrossProcessMessage = { sourceId: PROCESS_ID, update };
    publisher.publish(CHANNEL, JSON.stringify(payload)).catch(() => {});
  }
}

export function onJobUpdate(listener: (update: JobUpdatePayload) => void) {
  emitter.on("job_update", listener);
  return () => emitter.off("job_update", listener);
}

export type { JobUpdatePayload };
