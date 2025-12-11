import redis from "@/lib/redis";
import {
  ProviderRetryError,
  getOpenAIRateLimitInfo,
} from "@/lib/providers/retry";
import type { ChatwootWebhookPayload } from "@/types/chatwoot";

type JobMetadata = {
  jobId?: number;
  accountId?: number | string;
  conversationId?: number | string;
  payload?: ChatwootWebhookPayload;
};

type PendingJob = {
  id: number;
  run: () => Promise<unknown>;
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
  metadata?: JobMetadata;
  storageHandle?: string;
  conversationKey?: string;
  attempt: number;
  maxAttempts: number;
  retryDelayMs: number;
  timeoutMs: number;
  queuedAt: number;
  startedAt?: number;
};

type EnqueueOptions = {
  id?: number;
  storageHandle?: string;
  persist?: boolean;
  attempt?: number;
  maxAttempts?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
  queuedAt?: number;
};

let queueEnabled = true;

const pendingJobs: PendingJob[] = [];
const activeJobs = new Set<PendingJob>();
const activeConversations = new Map<string, number>();
let nextJobId = 1;
const idleResolvers: Array<() => void> = [];
const retryTimers = new Set<ReturnType<typeof setTimeout>>();

class ChatwootJobTimeoutError extends Error {
  readonly timeoutMs: number;

  constructor(timeoutMs: number) {
    super(`Chatwoot webhook job timed out after ${timeoutMs}ms`);
    this.name = "ChatwootJobTimeoutError";
    this.timeoutMs = timeoutMs;
  }
}

type FailureReporter = (context: {
  jobId: number;
  metadata?: JobMetadata;
  attempts: number;
  maxAttempts: number;
  error: unknown;
  queueLength: number;
  activeWorkers: number;
  waitMs?: number;
  runtimeMs?: number;
  delayMs?: number;
}) => void;

let failureReporter: FailureReporter | undefined;

function parseConcurrency(raw: string | undefined): number {
  if (!raw) {
    return 1;
  }
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }
  return Math.floor(parsed);
}

const defaultConcurrency = parseConcurrency(
  process.env.CHATWOOT_QUEUE_CONCURRENCY
);
let queueConcurrency = defaultConcurrency;

function parsePositiveInt(raw: string | undefined, fallback: number): number {
  if (!raw) {
    return fallback;
  }
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  return Math.floor(parsed);
}

function parseNonNegativeInt(raw: string | undefined, fallback: number): number {
  if (!raw) {
    return fallback;
  }
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback;
  }
  return Math.floor(parsed);
}

function parseBackoffFactor(raw: string | undefined, fallback: number): number {
  if (!raw) {
    return fallback;
  }
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

const defaultJobTimeoutMs = parseNonNegativeInt(
  process.env.CHATWOOT_QUEUE_JOB_TIMEOUT_MS,
  120_000
);
let queueJobTimeoutMs = defaultJobTimeoutMs;

const defaultMaxAttempts = parsePositiveInt(
  process.env.CHATWOOT_QUEUE_MAX_ATTEMPTS,
  3
);
let queueMaxAttempts = defaultMaxAttempts;

const defaultRetryBaseDelayMs = parseNonNegativeInt(
  process.env.CHATWOOT_QUEUE_RETRY_BASE_DELAY_MS,
  1_000
);
let queueRetryBaseDelayMs = defaultRetryBaseDelayMs;

const defaultRetryMaxDelayMs = Math.max(
  defaultRetryBaseDelayMs,
  parseNonNegativeInt(
    process.env.CHATWOOT_QUEUE_RETRY_MAX_DELAY_MS,
    30_000
  )
);
let queueRetryMaxDelayMs = defaultRetryMaxDelayMs;

const defaultRetryBackoffFactor = parseBackoffFactor(
  process.env.CHATWOOT_QUEUE_RETRY_BACKOFF_FACTOR,
  2
);
let queueRetryBackoffFactor = defaultRetryBackoffFactor;

const REDIS_QUEUE_KEY = "chatwoot:webhook:jobs";
let durableQueueEnabled =
  process.env.CHATWOOT_QUEUE_USE_REDIS === "true" &&
  typeof (redis as any)?.rpush === "function" &&
  typeof (redis as any)?.lrange === "function";

let jobRunner:
  | ((metadata: JobMetadata) => Promise<unknown>)
  | undefined;
let hydrating = false;
const hydratedHandles = new Set<string>();

type JobEventPhase = "queued" | "started" | "completed" | "failed" | "retried";

type JobLogDetails = {
  phase: JobEventPhase;
  jobId: number;
  attempt: number;
  maxAttempts: number;
  queueLength: number;
  activeWorkers: number;
  waitMs?: number;
  runtimeMs?: number;
  delayMs?: number;
  accountId?: number | string;
  conversationId?: number | string;
  metadata?: JobMetadata;
  error?: unknown;
  timestamp: number;
};

function calculateWaitMs(job: PendingJob): number | undefined {
  if (!Number.isFinite(job.startedAt) || job.startedAt === undefined) {
    return undefined;
  }
  const wait = job.startedAt - job.queuedAt;
  return Number.isFinite(wait) && wait >= 0 ? wait : undefined;
}

function calculateRuntimeMs(job: PendingJob, timestamp: number): number | undefined {
  if (!Number.isFinite(job.startedAt) || job.startedAt === undefined) {
    return undefined;
  }
  const runtime = timestamp - job.startedAt;
  return Number.isFinite(runtime) && runtime >= 0 ? runtime : undefined;
}

function buildJobLogDetails(
  job: PendingJob,
  phase: JobEventPhase,
  overrides: Partial<JobLogDetails> = {}
): JobLogDetails {
  const timestamp = overrides.timestamp ?? Date.now();
  return {
    phase,
    jobId: job.id,
    attempt: job.attempt,
    maxAttempts: job.maxAttempts,
    queueLength: overrides.queueLength ?? pendingJobs.length,
    activeWorkers: overrides.activeWorkers ?? activeJobs.size,
    waitMs:
      overrides.waitMs !== undefined ? overrides.waitMs : calculateWaitMs(job),
    runtimeMs:
      overrides.runtimeMs !== undefined
        ? overrides.runtimeMs
        : calculateRuntimeMs(job, timestamp),
    delayMs: overrides.delayMs,
    accountId: overrides.accountId ?? job.metadata?.accountId,
    conversationId: overrides.conversationId ?? job.metadata?.conversationId,
    metadata: overrides.metadata ?? job.metadata,
    error: overrides.error,
    timestamp,
  };
}

function logJobEvent(
  job: PendingJob,
  phase: JobEventPhase,
  overrides: Partial<JobLogDetails> = {}
) {
  const details = buildJobLogDetails(job, phase, overrides);
  console.info("chatwoot webhook job event", details);
  return details;
}

async function persistJob(storageHandle: string) {
  if (!durableQueueEnabled) {
    return;
  }
  try {
    await (redis as any)?.rpush?.(REDIS_QUEUE_KEY, storageHandle);
  } catch (error) {
    console.error("chatwoot webhook job persistence failure", error);
  }
}

async function removePersistedJob(storageHandle?: string) {
  if (!durableQueueEnabled || !storageHandle) {
    return;
  }
  try {
    await (redis as any)?.lrem?.(REDIS_QUEUE_KEY, 1, storageHandle);
  } catch (error) {
    console.error("chatwoot webhook job cleanup failure", error);
  } finally {
    hydratedHandles.delete(storageHandle);
  }
}

async function hydrateDurableJobs() {
  const runner = jobRunner;
  if (!durableQueueEnabled || hydrating || !runner) {
    return;
  }
  hydrating = true;
  try {
    const entries: string[] =
      (await (redis as any)?.lrange?.(REDIS_QUEUE_KEY, 0, -1)) ?? [];
    for (const entry of entries) {
      if (hydratedHandles.has(entry)) {
        continue;
      }
      let parsed:
        | {
            id?: number;
            metadata?: JobMetadata;
            options?: {
              attempt?: number;
              maxAttempts?: number;
              retryDelayMs?: number;
              timeoutMs?: number;
              queuedAt?: number;
            };
          }
        | undefined;
      try {
        parsed = JSON.parse(entry) as typeof parsed;
      } catch (error) {
        console.error("chatwoot webhook job hydration parse failure", error);
        continue;
      }
      if (!parsed?.metadata || typeof parsed.id !== "number") {
        continue;
      }
      hydratedHandles.add(entry);
      enqueueChatwootJob(
        () => runner(parsed!.metadata!),
        parsed.metadata,
        {
          id: parsed.id,
          storageHandle: entry,
          persist: false,
          attempt: parsed.options?.attempt,
          maxAttempts: parsed.options?.maxAttempts,
          retryDelayMs: parsed.options?.retryDelayMs,
          timeoutMs: parsed.options?.timeoutMs,
          queuedAt: parsed.options?.queuedAt,
        }
      );
    }
  } catch (error) {
    console.error("chatwoot webhook job hydration failure", error);
  } finally {
    hydrating = false;
  }
}

function resolveIdle() {
  if (activeJobs.size === 0 && pendingJobs.length === 0) {
    while (idleResolvers.length) {
      const resolve = idleResolvers.shift();
      try {
        resolve?.();
      } catch {
        // ignore resolver errors
      }
    }
  }
}

function getConversationKey(metadata?: JobMetadata): string | undefined {
  const conversationId = metadata?.conversationId;
  if (conversationId === undefined || conversationId === null) {
    return undefined;
  }
  return String(conversationId);
}

function canStartMoreJobs(): boolean {
  return queueConcurrency <= 0 || activeJobs.size < queueConcurrency;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    return promise;
  }

  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new ChatwootJobTimeoutError(timeoutMs));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

function getRetryDelayMs(job: PendingJob): number {
  const baseDelay = Math.max(0, job.retryDelayMs ?? queueRetryBaseDelayMs);
  const attemptIndex = Math.max(0, job.attempt - 1);
  const computed = baseDelay * Math.pow(queueRetryBackoffFactor, attemptIndex);
  const capped = Math.min(
    Math.max(baseDelay, queueRetryMaxDelayMs),
    computed
  );
  return Number.isFinite(capped) ? Math.max(0, Math.floor(capped)) : baseDelay;
}

function shouldRetryJob(job: PendingJob, error: unknown): boolean {
  if (job.attempt >= job.maxAttempts) {
    return false;
  }

  if (error instanceof ProviderRetryError) {
    return error.retryable && !error.retriesExhausted;
  }

  if (error instanceof ChatwootJobTimeoutError) {
    return true;
  }

  const openAiInfo = getOpenAIRateLimitInfo(error);
  if (openAiInfo.isRateLimit) {
    return true;
  }

  if (error && typeof error === "object" && "retryable" in error) {
    try {
      return Boolean((error as { retryable?: unknown }).retryable);
    } catch {
      return false;
    }
  }

  return false;
}

function scheduleRetry(job: PendingJob, error: unknown, delayMs: number) {
  logJobEvent(job, "retried", {
    delayMs,
    error,
    queueLength: pendingJobs.length,
    activeWorkers: activeJobs.size,
  });

  const timer = setTimeout(() => {
    retryTimers.delete(timer);
    job.startedAt = undefined;
    job.queuedAt = Date.now();
    pendingJobs.push(job);
    logJobEvent(job, "queued", {
      queueLength: pendingJobs.length,
      activeWorkers: activeJobs.size,
    });
    queueMicrotask(processQueue);
  }, delayMs);
  retryTimers.add(timer);
}

function notifyJobFailure(
  job: PendingJob,
  error: unknown,
  failureDetails?: JobLogDetails
) {
  if (!failureReporter) {
    return;
  }
  try {
    const details =
      failureDetails ??
      buildJobLogDetails(job, "failed", {
        error,
        delayMs: 0,
        queueLength: pendingJobs.length,
        activeWorkers: activeJobs.size,
      });
    failureReporter({
      jobId: details.jobId,
      metadata: details.metadata,
      attempts: details.attempt,
      maxAttempts: details.maxAttempts,
      error,
      queueLength: details.queueLength,
      activeWorkers: details.activeWorkers,
      waitMs: details.waitMs,
      runtimeMs: details.runtimeMs,
      delayMs: details.delayMs ?? 0,
    });
  } catch (reportError) {
    console.error("chatwoot webhook failure reporter error", reportError);
  }
}

function startJob(job: PendingJob) {
  const conversationKey = job.conversationKey;
  if (conversationKey) {
    const activeCount = activeConversations.get(conversationKey) ?? 0;
    activeConversations.set(conversationKey, activeCount + 1);
  }
  activeJobs.add(job);

  job.startedAt = Date.now();
  job.attempt += 1;
  logJobEvent(job, "started", {
    queueLength: pendingJobs.length,
    activeWorkers: activeJobs.size,
  });

  (async () => {
    let result: unknown;
    let retryScheduled = false;
    let failure: unknown;
    try {
      const timeoutMs = Number.isFinite(job.timeoutMs) && job.timeoutMs >= 0
        ? job.timeoutMs
        : queueJobTimeoutMs;
      result = await withTimeout(job.run(), timeoutMs);
      logJobEvent(job, "completed", {
        queueLength: pendingJobs.length,
        activeWorkers: activeJobs.size,
      });
    } catch (error) {
      const openAiInfo = getOpenAIRateLimitInfo(error);
      const willRetry = shouldRetryJob(job, error);
      const delayMs = willRetry
        ? openAiInfo.retryAfterMs ?? getRetryDelayMs(job)
        : 0;
      const failureDetails = logJobEvent(job, "failed", {
        delayMs: willRetry ? delayMs : 0,
        error,
        queueLength: pendingJobs.length,
        activeWorkers: activeJobs.size,
      });
      console.error("chatwoot webhook job failure", {
        jobId: job.id,
        metadata: job.metadata,
        attempts: job.attempt,
        maxAttempts: job.maxAttempts,
        delayMs,
        waitMs: failureDetails.waitMs,
        runtimeMs: failureDetails.runtimeMs,
        error,
      });
      if (willRetry) {
        retryScheduled = true;
        scheduleRetry(job, error, delayMs);
      } else {
        failure = error;
        notifyJobFailure(job, error, failureDetails);
      }
    } finally {
      if (job.conversationKey) {
        const remaining = (activeConversations.get(job.conversationKey) ?? 1) - 1;
        if (remaining > 0) {
          activeConversations.set(job.conversationKey, remaining);
        } else {
          activeConversations.delete(job.conversationKey);
        }
      }
      activeJobs.delete(job);
      if (retryScheduled) {
        processQueue();
        return;
      }

      await removePersistedJob(job.storageHandle);

      if (failure !== undefined) {
        job.reject(failure);
      } else {
        job.resolve(result);
      }
      processQueue();
    }
  })().catch((error) => {
    console.error("chatwoot webhook job unhandled error", error);
    const failureDetails = logJobEvent(job, "failed", {
      error,
      delayMs: 0,
      queueLength: pendingJobs.length,
      activeWorkers: activeJobs.size,
    });
    if (job.conversationKey) {
      const remaining = (activeConversations.get(job.conversationKey) ?? 1) - 1;
      if (remaining > 0) {
        activeConversations.set(job.conversationKey, remaining);
      } else {
        activeConversations.delete(job.conversationKey);
      }
    }
    activeJobs.delete(job);
    notifyJobFailure(job, error, failureDetails);
    void removePersistedJob(job.storageHandle);
    processQueue();
  });
}

function processQueue() {
  if (pendingJobs.length === 0) {
    resolveIdle();
    return;
  }

  let startedJob = false;
  while (pendingJobs.length > 0 && canStartMoreJobs()) {
    const nextIndex = pendingJobs.findIndex((job) => {
      if (job.conversationKey && activeConversations.has(job.conversationKey)) {
        return false;
      }
      return true;
    });
    if (nextIndex === -1) {
      break;
    }
    const [job] = pendingJobs.splice(nextIndex, 1);
    if (!job) {
      break;
    }
    startJob(job);
    startedJob = true;
  }

  if (!startedJob) {
    resolveIdle();
  }
}

export function enqueueChatwootJob<T>(
  run: () => Promise<T>,
  metadata?: JobMetadata,
  options: EnqueueOptions = {}
): { id: number; done: Promise<T> } {
  const id = typeof options.id === "number" ? options.id : nextJobId++;
  if (id >= nextJobId) {
    nextJobId = id + 1;
  }

  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const basePromise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  const monitoredPromise = basePromise.catch((error) => {
    // Ensure consumers can still observe the rejection after logging.
    throw error;
  });

  const maxAttempts = Number.isFinite(options.maxAttempts ?? queueMaxAttempts)
    ? Math.max(1, Math.floor(options.maxAttempts ?? queueMaxAttempts))
    : queueMaxAttempts;
  const retryDelayMs = Number.isFinite(options.retryDelayMs ?? queueRetryBaseDelayMs)
    ? Math.max(0, Math.floor(options.retryDelayMs ?? queueRetryBaseDelayMs))
    : queueRetryBaseDelayMs;
  const timeoutMs = Number.isFinite(options.timeoutMs ?? queueJobTimeoutMs)
    ? Math.max(0, Math.floor(options.timeoutMs ?? queueJobTimeoutMs))
    : queueJobTimeoutMs;

  const queuedAt = Number.isFinite(options.queuedAt)
    ? Math.floor(options.queuedAt as number)
    : Date.now();

  const job: PendingJob = {
    id,
    run: () => run(),
    resolve: (value) => {
      resolve(value as T);
    },
    reject,
    metadata,
    storageHandle: options.storageHandle,
    conversationKey: getConversationKey(metadata),
    attempt: Math.max(0, Math.floor(options.attempt ?? 0)),
    maxAttempts,
    retryDelayMs,
    timeoutMs,
    queuedAt,
    startedAt: undefined,
  };

  if (metadata) {
    if (metadata.jobId === undefined) {
      metadata.jobId = id;
    }
  }

  const shouldPersist =
    durableQueueEnabled && options.persist !== false && metadata?.payload;
  if (shouldPersist) {
    try {
      job.storageHandle = JSON.stringify({
        id,
        metadata,
        options: {
          maxAttempts: job.maxAttempts,
          retryDelayMs: job.retryDelayMs,
          timeoutMs: job.timeoutMs,
          queuedAt: job.queuedAt,
        },
      });
      void persistJob(job.storageHandle);
    } catch (error) {
      console.error("chatwoot webhook job serialization failure", error);
    }
  }

  pendingJobs.push(job);
  logJobEvent(job, "queued", {
    queueLength: pendingJobs.length,
    activeWorkers: activeJobs.size,
  });
  queueMicrotask(processQueue);

  monitoredPromise.catch(() => {});

  return { id, done: monitoredPromise };
}

export function waitForChatwootQueueIdle(): Promise<void> {
  if (activeJobs.size === 0 && pendingJobs.length === 0) {
    return Promise.resolve();
  }
  return new Promise<void>((resolve) => {
    idleResolvers.push(resolve);
  });
}

export function isChatwootQueueEnabled(): boolean {
  return queueEnabled;
}

export function setChatwootQueueEnabledForTesting(enabled: boolean) {
  queueEnabled = enabled;
}

export function resetChatwootQueueForTesting() {
  pendingJobs.splice(0, pendingJobs.length);
  activeJobs.clear();
  activeConversations.clear();
  for (const timer of retryTimers) {
    clearTimeout(timer);
  }
  retryTimers.clear();
  hydrating = false;
  hydratedHandles.clear();
  nextJobId = 1;
  queueConcurrency = defaultConcurrency;
  queueMaxAttempts = defaultMaxAttempts;
  queueRetryBaseDelayMs = defaultRetryBaseDelayMs;
  queueRetryMaxDelayMs = defaultRetryMaxDelayMs;
  queueRetryBackoffFactor = defaultRetryBackoffFactor;
  queueJobTimeoutMs = defaultJobTimeoutMs;
  failureReporter = undefined;
  resolveIdle();
}

export function setChatwootJobRunner(
  runner: (metadata: JobMetadata) => Promise<unknown>
) {
  jobRunner = runner;
  if (durableQueueEnabled) {
    queueMicrotask(() => {
      void hydrateDurableJobs();
    });
  }
}

// NOTE: Currently unused by the application; kept for manual diagnostics when
// verifying whether Redis-backed persistence is active during local debugging.
export function isChatwootQueuePersistenceEnabled(): boolean {
  return durableQueueEnabled;
}

export function setChatwootQueuePersistenceEnabledForTesting(enabled: boolean) {
  durableQueueEnabled = enabled;
  if (!enabled) {
    hydratedHandles.clear();
  } else {
    queueMicrotask(() => {
      void hydrateDurableJobs();
    });
  }
}

export async function hydrateChatwootQueueFromStorageForTesting() {
  await hydrateDurableJobs();
}

export function getChatwootQueueConcurrency(): number {
  return queueConcurrency;
}

export function setChatwootQueueConcurrencyForTesting(limit: number) {
  if (Number.isFinite(limit) && limit >= 1) {
    queueConcurrency = Math.floor(limit);
  } else {
    queueConcurrency = defaultConcurrency;
  }
  queueMicrotask(processQueue);
}

// NOTE: Exposed for potential future assertions in tests, but no suite relies on
// it today. Retained to make it easy to validate runner registration manually.
export function getChatwootJobRunnerForTesting() {
  return jobRunner;
}

export function setChatwootQueueRetryConfigForTesting(config: {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  backoffFactor?: number;
}) {
  if (Number.isFinite(config.maxAttempts) && (config.maxAttempts as number) >= 1) {
    queueMaxAttempts = Math.floor(config.maxAttempts as number);
  }
  if (Number.isFinite(config.baseDelayMs) && (config.baseDelayMs as number) >= 0) {
    queueRetryBaseDelayMs = Math.floor(config.baseDelayMs as number);
  }
  if (Number.isFinite(config.maxDelayMs) && (config.maxDelayMs as number) >= 0) {
    queueRetryMaxDelayMs = Math.floor(config.maxDelayMs as number);
  }
  if (Number.isFinite(config.backoffFactor) && (config.backoffFactor as number) > 0) {
    queueRetryBackoffFactor = config.backoffFactor as number;
  }
}

export function setChatwootQueueJobTimeoutForTesting(timeoutMs: number) {
  if (Number.isFinite(timeoutMs) && timeoutMs >= 0) {
    queueJobTimeoutMs = Math.floor(timeoutMs);
  }
}

export function setChatwootQueueFailureReporter(
  reporter: FailureReporter | undefined
) {
  failureReporter = reporter;
}

// NOTE: This helper exposes the registered failure reporter even though nothing
// references it yet; retained for debugging queue instrumentation when needed.
export function getChatwootQueueFailureReporterForTesting() {
  return failureReporter;
}
