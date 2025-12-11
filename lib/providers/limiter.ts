import { estimateMessageTokens, type TiktokenModel } from "@/lib/utils/tokenCounter";

export type ProviderType = "openai" | "ollama" | "ollama-openai";

export interface LimiterTokens {
  input?: number;
  output?: number;
}

export interface ProviderLimiterConfig {
  concurrency: number;
  tokensPerInterval: number;
  intervalMs: number;
  maxTokens?: number;
}

interface QueueTask<T> {
  fn: () => Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
  tokens: number;
  enqueuedAt: number;
  startedAt?: number;
  waitMs?: number;
}

const PROVIDERS: ProviderType[] = ["openai", "ollama", "ollama-openai"];

const DEFAULT_INTERVAL_MS = 60_000;

function parseEnvNumber(name: string | undefined, fallback: number): number {
  if (!name) return fallback;
  const raw = process.env[name];
  if (typeof raw !== "string") return fallback;
  const trimmed = raw.trim();
  if (!trimmed) return fallback;
  const parsed = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function buildDefaultConfig(): Record<ProviderType, ProviderLimiterConfig> {
  const make = (
    provider: ProviderType,
    defaults: { concurrency: number; tokens: number; interval: number }
  ): ProviderLimiterConfig => {
    const upper = provider.toUpperCase().replace(/[^A-Z0-9]+/g, "_");
    const concurrency = parseEnvNumber(
      `CHATWOOT_${upper}_CONCURRENCY`,
      defaults.concurrency
    );
    const tokensPerInterval = parseEnvNumber(
      `CHATWOOT_${upper}_TOKENS_PER_INTERVAL`,
      defaults.tokens
    );
    const intervalMs = parseEnvNumber(
      `CHATWOOT_${upper}_TOKENS_INTERVAL_MS`,
      defaults.interval
    );
    const maxTokens = parseEnvNumber(
      `CHATWOOT_${upper}_MAX_TOKENS`,
      tokensPerInterval
    );
    return {
      concurrency,
      tokensPerInterval,
      intervalMs,
      maxTokens,
    };
  };

  return {
    openai: make("openai", { concurrency: 3, tokens: 300_000, interval: DEFAULT_INTERVAL_MS }),
    ollama: make("ollama", { concurrency: 2, tokens: 120_000, interval: DEFAULT_INTERVAL_MS }),
    "ollama-openai": make("ollama-openai", {
      concurrency: 2,
      tokens: 200_000,
      interval: DEFAULT_INTERVAL_MS,
    }),
  };
}

class TokenBucket {
  private tokens: number;
  private readonly capacity: number;
  private readonly refillPerMs: number;
  private lastRefill: number;
  private readonly unlimited: boolean;

  constructor(tokensPerInterval: number, intervalMs: number, maxTokens?: number) {
    if (!Number.isFinite(tokensPerInterval) || tokensPerInterval <= 0) {
      this.unlimited = true;
      this.tokens = Number.POSITIVE_INFINITY;
      this.capacity = Number.POSITIVE_INFINITY;
      this.refillPerMs = 0;
      this.lastRefill = Date.now();
      return;
    }

    const safeInterval = intervalMs > 0 ? intervalMs : DEFAULT_INTERVAL_MS;
    this.unlimited = false;
    this.capacity = Number.isFinite(maxTokens) && maxTokens! > 0 ? (maxTokens as number) : tokensPerInterval;
    this.tokens = this.capacity;
    this.refillPerMs = tokensPerInterval / safeInterval;
    this.lastRefill = Date.now();
  }

  private refill(now = Date.now()) {
    if (this.unlimited) return;
    if (now <= this.lastRefill) {
      this.lastRefill = now;
      return;
    }
    const delta = now - this.lastRefill;
    this.lastRefill = now;
    this.tokens = Math.min(this.capacity, this.tokens + delta * this.refillPerMs);
  }

  tryRemove(amount: number, now = Date.now()): boolean {
    if (this.unlimited || amount <= 0) {
      return true;
    }
    const normalized = Math.min(amount, this.capacity);
    this.refill(now);
    if (this.tokens >= normalized) {
      this.tokens -= normalized;
      return true;
    }
    return false;
  }

  timeUntilAvailable(amount: number, now = Date.now()): number {
    if (this.unlimited || amount <= 0) {
      return 0;
    }
    const normalized = Math.min(amount, this.capacity);
    this.refill(now);
    if (this.tokens >= normalized) {
      return 0;
    }
    if (this.refillPerMs <= 0) {
      return Number.POSITIVE_INFINITY;
    }
    const deficit = normalized - this.tokens;
    return Math.ceil(deficit / this.refillPerMs);
  }
}

interface ProviderState {
  config: ProviderLimiterConfig;
  queue: QueueTask<any>[];
  running: number;
  bucket: TokenBucket;
  timer?: ReturnType<typeof setTimeout>;
  timerDelay?: number;
  queueLength: number;
  lastWaitTimeMs: number;
}

type LimiterMetricsEventType =
  | "enqueued"
  | "started"
  | "completed"
  | "throttled";

export interface LimiterMetricsEvent {
  provider: ProviderType;
  type: LimiterMetricsEventType;
  timestamp: number;
  queueLength: number;
  running: number;
  tokens: number;
  waitMs?: number;
  delayMs?: number;
  durationMs?: number;
  error?: boolean;
}

type LimiterObserver = (event: LimiterMetricsEvent) => void;

let metricsObserver: LimiterObserver | undefined;

function emitMetrics(
  provider: ProviderType,
  type: LimiterMetricsEventType,
  details: Omit<LimiterMetricsEvent, "provider" | "type" | "timestamp">
) {
  if (!metricsObserver) return;
  try {
    metricsObserver({
      provider,
      type,
      timestamp: Date.now(),
      ...details,
    });
  } catch {
    // observer errors should not break limiter execution
  }
}

export function setLimiterObserver(observer?: LimiterObserver) {
  metricsObserver = observer;
}

let config: Record<ProviderType, ProviderLimiterConfig> = buildDefaultConfig();

const state: Record<ProviderType, ProviderState> = {
  openai: createState("openai"),
  ollama: createState("ollama"),
  "ollama-openai": createState("ollama-openai"),
};

function createState(provider: ProviderType): ProviderState {
  const conf = config[provider];
  return {
    config: conf,
    queue: [],
    running: 0,
    bucket: new TokenBucket(conf.tokensPerInterval, conf.intervalMs, conf.maxTokens),
    queueLength: 0,
    lastWaitTimeMs: 0,
  };
}

function normalizeConcurrency(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    return Number.POSITIVE_INFINITY;
  }
  return Math.max(1, Math.floor(value));
}

function computeTokenCost(tokens?: LimiterTokens): number {
  if (!tokens) return 0;
  const input = Number.isFinite(tokens.input) ? Math.max(tokens.input ?? 0, 0) : 0;
  const output = Number.isFinite(tokens.output) ? Math.max(tokens.output ?? 0, 0) : 0;
  const total = input + output;
  if (!Number.isFinite(total) || total <= 0) return 0;
  return Math.max(1, Math.ceil(total));
}

function scheduleTimer(provider: ProviderType, delay: number) {
  const providerState = state[provider];
  if (!Number.isFinite(delay) || delay <= 0) {
    queueMicrotask(() => processQueue(provider));
    return;
  }
  if (providerState.timer && providerState.timerDelay && providerState.timerDelay <= delay) {
    return;
  }
  if (providerState.timer) {
    clearTimeout(providerState.timer);
  }
  providerState.timerDelay = delay;
  providerState.timer = setTimeout(() => {
    providerState.timer = undefined;
    providerState.timerDelay = undefined;
    processQueue(provider);
  }, delay);
}

function processQueue(provider: ProviderType) {
  const providerState = state[provider];
  const concurrency = normalizeConcurrency(providerState.config.concurrency);
  const fairnessThreshold = Math.max(
    50,
    Math.floor(providerState.config.intervalMs / 2) || 0
  );

  while (
    providerState.queue.length > 0 &&
    providerState.running < concurrency
  ) {
    const now = Date.now();
    let candidateIndex = -1;
    let candidateWait = -1;
    let minDelay = Number.POSITIVE_INFINITY;
    let throttleJob: QueueTask<any> | undefined;
    let throttleWait = 0;
    let oldestJob: QueueTask<any> | undefined;
    let oldestWait = -1;
    let oldestDelay = Number.POSITIVE_INFINITY;

    for (let index = 0; index < providerState.queue.length; index += 1) {
      const job = providerState.queue[index];
      const waitSoFar = Math.max(0, now - job.enqueuedAt);
      const delay = providerState.bucket.timeUntilAvailable(job.tokens, now);

      if (delay === 0 && waitSoFar > candidateWait) {
        candidateIndex = index;
        candidateWait = waitSoFar;
      }

      if (delay < minDelay) {
        minDelay = delay;
        throttleJob = job;
        throttleWait = waitSoFar;
      }

      if (waitSoFar > oldestWait) {
        oldestWait = waitSoFar;
        oldestJob = job;
        oldestDelay = delay;
      }
    }

    if (
      oldestJob &&
      oldestJob !== providerState.queue[candidateIndex] &&
      oldestDelay > 0 &&
      oldestWait >= fairnessThreshold
    ) {
      providerState.lastWaitTimeMs = oldestWait;
      providerState.queueLength = providerState.queue.length;
      const wait = Number.isFinite(oldestDelay) ? oldestDelay : minDelay;
      scheduleTimer(provider, wait);
      emitMetrics(provider, "throttled", {
        queueLength: providerState.queue.length,
        running: providerState.running,
        tokens: oldestJob.tokens,
        waitMs: oldestWait,
        delayMs: wait,
      });
      break;
    }

    if (candidateIndex >= 0) {
      const job = providerState.queue.splice(candidateIndex, 1)[0];
      const waitSoFar = Math.max(0, now - job.enqueuedAt);
      providerState.queueLength = providerState.queue.length;
      providerState.lastWaitTimeMs = waitSoFar;

      if (!providerState.bucket.tryRemove(job.tokens, now)) {
        providerState.queue.splice(candidateIndex, 0, job);
        providerState.queueLength = providerState.queue.length;
        const wait = providerState.bucket.timeUntilAvailable(job.tokens, now);
        providerState.lastWaitTimeMs = waitSoFar;
        scheduleTimer(provider, wait);
        emitMetrics(provider, "throttled", {
          queueLength: providerState.queue.length,
          running: providerState.running,
          tokens: job.tokens,
          waitMs: waitSoFar,
          delayMs: wait,
        });
        break;
      }

      startTask(provider, job, waitSoFar);
      continue;
    }

    providerState.lastWaitTimeMs = Math.max(0, oldestWait);
    providerState.queueLength = providerState.queue.length;
    if (!Number.isFinite(minDelay)) {
      minDelay = providerState.bucket.timeUntilAvailable(
        providerState.queue[0]?.tokens ?? 0
      );
    }
    scheduleTimer(provider, minDelay);
    if (throttleJob) {
      emitMetrics(provider, "throttled", {
        queueLength: providerState.queue.length,
        running: providerState.running,
        tokens: throttleJob.tokens,
        waitMs: throttleWait,
        delayMs: minDelay,
      });
    }
    break;
  }
}

function isAsyncIterable<T>(value: T): value is T & AsyncIterable<unknown> {
  return !!value && typeof (value as any)[Symbol.asyncIterator] === "function";
}

function prepareResult<T>(result: T, finalize: () => void): T {
  if (isAsyncIterable(result)) {
    // The wrapped async iterable preserves the original result shape while
    // deferring finalization until iteration completes.
    return wrapAsyncIterable(result, finalize) as T;
  }
  finalize();
  return result;
}

function startTask<T>(provider: ProviderType, job: QueueTask<T>, waitMs: number) {
  const providerState = state[provider];
  providerState.running += 1;
  job.waitMs = waitMs;
  job.startedAt = Date.now();

  emitMetrics(provider, "started", {
    queueLength: providerState.queueLength,
    running: providerState.running,
    tokens: job.tokens,
    waitMs,
  });

  let finalized = false;
  const finalizeInternal = (error: boolean) => {
    if (finalized) return;
    finalized = true;
    providerState.running = Math.max(0, providerState.running - 1);
    const durationMs = job.startedAt ? Math.max(0, Date.now() - job.startedAt) : undefined;
    emitMetrics(provider, "completed", {
      queueLength: providerState.queueLength,
      running: providerState.running,
      tokens: job.tokens,
      waitMs: job.waitMs,
      durationMs,
      error,
    });
    processQueue(provider);
  };

  const finalize = () => finalizeInternal(false);
  const finalizeWithError = () => finalizeInternal(true);

  (async () => {
    try {
      const result = await job.fn();
      const prepared = prepareResult(result, finalize);
      job.resolve(prepared);
    } catch (error) {
      finalizeWithError();
      job.reject(error);
    }
  })().catch((error) => {
    finalizeWithError();
    job.reject(error);
  });
}

function wrapAsyncIterable<T>(iterable: AsyncIterable<T>, onFinally: () => void): AsyncIterable<T> {
  const iterator = iterable[Symbol.asyncIterator]();
  let finished = false;

  const finalizeOnce = async () => {
    if (finished) return;
    finished = true;
    try {
      if (typeof iterator.return === "function") {
        await iterator.return();
      }
    } catch {
      // ignore
    }
    onFinally();
  };

  return {
    async *[Symbol.asyncIterator]() {
      try {
        while (true) {
          const { value, done } = await iterator.next();
          if (done) break;
          yield value;
        }
      } catch (error) {
        if (typeof iterator.throw === "function") {
          try {
            await iterator.throw(error);
          } catch {
            // ignore
          }
        }
        throw error;
      } finally {
        await finalizeOnce();
      }
    },
  };
}

function enqueueTask<T>(provider: ProviderType, task: QueueTask<T>) {
  const providerState = state[provider];
  providerState.queue.push(task);
  providerState.queueLength = providerState.queue.length;
  providerState.lastWaitTimeMs = 0;
  emitMetrics(provider, "enqueued", {
    queueLength: providerState.queueLength,
    running: providerState.running,
    tokens: task.tokens,
    waitMs: 0,
  });
  processQueue(provider);
}

export function scheduleProviderCall<T>(
  provider: ProviderType,
  tokens: LimiterTokens | undefined,
  fn: () => Promise<T>
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const tokenCost = computeTokenCost(tokens);
    enqueueTask(provider, {
      fn,
      resolve,
      reject,
      tokens: tokenCost,
      enqueuedAt: Date.now(),
    });
  });
}

export function deriveLimiterTokens(
  messages: any[],
  model?: string | undefined,
  additionalOutputTokens = 0
): LimiterTokens {
  const modelName = (model ?? "") as TiktokenModel;
  const inputTokens = estimateMessageTokens(messages, modelName);
  return {
    input: inputTokens,
    output: Math.max(0, Math.ceil(additionalOutputTokens)),
  };
}

export function setLimiterConfigForTesting(
  overrides: Partial<Record<ProviderType, Partial<ProviderLimiterConfig>>>
) {
  for (const provider of PROVIDERS) {
    const override = overrides[provider];
    if (!override) continue;
    const current = config[provider];
    config[provider] = {
      concurrency: override.concurrency ?? current.concurrency,
      tokensPerInterval: override.tokensPerInterval ?? current.tokensPerInterval,
      intervalMs: override.intervalMs ?? current.intervalMs,
      maxTokens: override.maxTokens ?? current.maxTokens,
    };
    state[provider].config = config[provider];
    state[provider].bucket = new TokenBucket(
      config[provider].tokensPerInterval,
      config[provider].intervalMs,
      config[provider].maxTokens
    );
  }
  for (const provider of PROVIDERS) {
    processQueue(provider);
  }
}

export function resetLimiterForTesting() {
  for (const provider of PROVIDERS) {
    const providerState = state[provider];
    if (providerState.timer) {
      clearTimeout(providerState.timer);
      providerState.timer = undefined;
      providerState.timerDelay = undefined;
    }
    providerState.queue = [];
    providerState.running = 0;
    providerState.queueLength = 0;
    providerState.lastWaitTimeMs = 0;
  }
  config = buildDefaultConfig();
  for (const provider of PROVIDERS) {
    state[provider].config = config[provider];
    state[provider].bucket = new TokenBucket(
      config[provider].tokensPerInterval,
      config[provider].intervalMs,
      config[provider].maxTokens
    );
  }
}
