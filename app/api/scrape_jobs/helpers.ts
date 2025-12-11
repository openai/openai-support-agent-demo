import fs from "fs/promises";
import path from "path";

import prisma from "../../../lib/prisma";
import { AgentRole, ScrapeJob } from "../../../lib/generated/prisma";
import { BenchmarkEntry } from "@/lib/scrapeMetrics";
import { readIngestionResult, StoredIngestionResult } from "@/lib/ingestionResults";
import { requireSession } from "@/lib/server/auth";

const KNOWLEDGE_BASE_DIR = path.join(process.cwd(), "public", "knowledge_base");
const JOB_LOG_ROOT = path.join(process.cwd(), "logs", "scrape_jobs");
const DEBUG_LOG_INTERVAL_MS = 5000;
let lastArtifactDebugLog = 0;

function shouldLogArtifactsVerbose() {
  if (process.env.SCRAPE_ARTIFACT_DEBUG !== "true") return false;
  const now = Date.now();
  if (now - lastArtifactDebugLog < DEBUG_LOG_INTERVAL_MS) {
    return false;
  }
  lastArtifactDebugLog = now;
  return true;
}

export async function readJobLog(logPath: string | null | undefined, opts?: { maxBytes?: number }) {
  if (!logPath) return null;
  try {
    const stat = await fs.stat(logPath);
    if (opts?.maxBytes && stat.size > opts.maxBytes) {
      const start = Math.max(0, stat.size - opts.maxBytes);
      const handle = await fs.open(logPath, "r");
      try {
        const buffer = Buffer.alloc(Math.min(opts.maxBytes, stat.size));
        const { bytesRead } = await handle.read(buffer, 0, buffer.length, start);
        return buffer.subarray(0, bytesRead).toString("utf8");
      } finally {
        await handle.close();
      }
    }
    const content = await fs.readFile(logPath, "utf8");
    return content;
  } catch (error) {
    console.warn("Unable to read scrape job log", { logPath, error });
    return null;
  }
}

export async function readJobLogChunk(
  logPath: string | null | undefined,
  opts: { start?: number | null; anchor?: number | null; direction?: "before" | "after" | null; maxBytes?: number } = {}
) {
  if (!logPath) return null;
  const limit = opts.maxBytes && opts.maxBytes > 0 ? Math.min(opts.maxBytes, 50000) : 20000;

  try {
    const stat = await fs.stat(logPath);
    const size = stat.size;
    const anchor =
      typeof opts.anchor === "number" && Number.isFinite(opts.anchor)
        ? Math.max(0, Math.min(opts.anchor, Math.max(0, size - 1)))
        : null;
    const start = (() => {
      if (typeof opts.start === "number" && Number.isFinite(opts.start)) {
        return Math.max(0, Math.min(opts.start, Math.max(0, size - 1)));
      }

      if (anchor !== null && opts.direction === "before") {
        return Math.max(0, anchor - limit);
      }

      if (anchor !== null && opts.direction === "after") {
        return Math.max(0, Math.min(Math.max(0, size - limit), anchor + limit));
      }

      return Math.max(0, size - limit);
    })();

    const handle = await fs.open(logPath, "r");
    try {
      const buffer = Buffer.alloc(Math.min(limit, size));
      const { bytesRead } = await handle.read(buffer, 0, buffer.length, start);
      const end = start + bytesRead;
      return {
        content: buffer.subarray(0, bytesRead).toString("utf8"),
        start,
        end,
        size,
        hasMoreBefore: start > 0,
        hasMoreAfter: end < size,
      } as const;
    } finally {
      await handle.close();
    }
  } catch (error) {
    console.warn("Unable to read scrape job log chunk", { logPath, error });
    return null;
  }
}

type LogRun = {
  id: string;
  path: string;
  startedAt: Date;
  size: number;
  content?: string | null;
  contentStart?: number;
  contentEnd?: number;
  hasMoreBefore?: boolean;
  hasMoreAfter?: boolean;
  fullyLoaded?: boolean;
};

export async function listJobLogRuns(
  jobId: string,
  options: {
    limit?: number;
    cursor?: string;
    fetchAll?: boolean;
    maxRuns?: number | null;
    includeContent?: boolean;
    start?: Date | null;
    end?: Date | null;
    before?: Date | null;
    after?: Date | null;
    contentStart?: number | null;
    contentLimit?: number | null;
    contentByLogId?: Record<
      string,
      {
        offset?: number | null;
        direction?: "before" | "after" | null;
        limit?: number | null;
      }
    >;
  } = {}
) {
  const limit = Math.max(1, Math.min(options.limit ?? 10, 50));
  const logDir = path.join(JOB_LOG_ROOT, jobId);
  const legacyLogPath = path.join(JOB_LOG_ROOT, `${jobId}.log`);

  let entries: { path: string; startedAt: Date; size: number }[] = [];

  try {
    const files = await fs.readdir(logDir);
    const stats = await Promise.allSettled(
      files
        .filter((file) => file.endsWith(".log"))
        .map(async (file) => {
          const fullPath = path.join(logDir, file);
          const stat = await fs.stat(fullPath);
          const startedAt = stat.birthtimeMs && stat.birthtimeMs > 0 ? stat.birthtime : stat.mtime;
          return { path: fullPath, startedAt, size: stat.size };
        })
    );

    entries = stats
      .filter((entry): entry is PromiseFulfilledResult<{ path: string; startedAt: Date; size: number }> =>
        entry.status === "fulfilled"
      )
      .map((entry) => entry.value);
  } catch {
    // directory might not exist yet
  }

  try {
    const stat = await fs.stat(legacyLogPath);
    const startedAt = stat.birthtimeMs && stat.birthtimeMs > 0 ? stat.birthtime : stat.mtime;
    entries.push({ path: legacyLogPath, startedAt, size: stat.size });
  } catch {
    // ignore if missing
  }

  const filteredEntries = entries.filter((entry) => {
    const withinStart = options.start ? entry.startedAt >= options.start : true;
    const withinEnd = options.end ? entry.startedAt <= options.end : true;
    const withinBefore = options.before ? entry.startedAt <= options.before : true;
    const withinAfter = options.after ? entry.startedAt >= options.after : true;
    return withinStart && withinEnd && withinBefore && withinAfter;
  });

  const sorted = filteredEntries.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
  const cursorIndex = options.cursor
    ? sorted.findIndex((entry) => path.basename(entry.path) === options.cursor)
    : -1;

  const anchorIndex = (() => {
    if (cursorIndex > -1) return cursorIndex + 1;
    if (options.before) {
      const idx = sorted.findIndex((entry) => entry.startedAt <= options.before!);
      return idx === -1 ? sorted.length : idx;
    }
    if (options.after) {
      const idx = sorted.findIndex((entry) => entry.startedAt < options.after!);
      return Math.max(0, idx - 1);
    }
    return 0;
  })();

  const startIndex = Math.max(0, anchorIndex);
  const effectiveLimit = (() => {
    if (options.fetchAll) {
      const cap = typeof options.maxRuns === "number" && options.maxRuns > 0 ? options.maxRuns : Infinity;
      return Math.min(cap, sorted.length - startIndex);
    }
    return limit;
  })();

  const sliced = sorted.slice(startIndex, startIndex + effectiveLimit);
  const nextCursor =
    sorted.length > startIndex + effectiveLimit && sliced.length > 0
      ? path.basename(sliced[sliced.length - 1].path)
      : null;

  const MAX_FULL_LOG_BYTES = 500_000;

  const logs: LogRun[] = await Promise.all(
    sliced.map(async (entry) => ({
      id: path.basename(entry.path),
      path: entry.path,
      startedAt: entry.startedAt,
      size: entry.size,
      ...(options.includeContent
        ? await (async () => {
            if (options.fetchAll && entry.size <= MAX_FULL_LOG_BYTES) {
              const fullContent = await readJobLog(entry.path);
              return {
                content: fullContent,
                contentStart: 0,
                contentEnd: fullContent?.length ?? 0,
                hasMoreBefore: false,
                hasMoreAfter: false,
                fullyLoaded: true,
              };
            }

            const perLogRange = options.contentByLogId?.[path.basename(entry.path)];
            const chunk = await readJobLogChunk(entry.path, {
              start: typeof perLogRange?.offset === "number" ? null : options.contentStart ?? null,
              anchor: typeof perLogRange?.offset === "number" ? perLogRange.offset : options.contentStart ?? null,
              direction: perLogRange?.direction ?? null,
              maxBytes: perLogRange?.limit ?? options.contentLimit ?? (options.fetchAll ? MAX_FULL_LOG_BYTES : undefined),
            });
            if (!chunk)
              return {
                content: null,
                contentStart: 0,
                contentEnd: 0,
                hasMoreBefore: false,
                hasMoreAfter: false,
                fullyLoaded: false,
              };
            return {
              content: chunk.content,
              contentStart: chunk.start,
              contentEnd: chunk.end,
              hasMoreBefore: chunk.hasMoreBefore,
              hasMoreAfter: chunk.hasMoreAfter,
              fullyLoaded: options.fetchAll ? chunk.end >= entry.size && !chunk.hasMoreBefore : false,
            };
          })()
        : {}),
    }))
  );

  return { logs, nextCursor, exhaustive: options.fetchAll ? !nextCursor : !nextCursor } as const;
}

function deriveDurationSeconds(job: ScrapeJob, benchmark: BenchmarkEntry | null) {
  if (typeof job.durationSeconds === "number") return job.durationSeconds;
  if (typeof benchmark?.duration_seconds === "number") return benchmark.duration_seconds;
  if (job.startedAt && job.finishedAt) {
    return (job.finishedAt.getTime() - job.startedAt.getTime()) / 1000;
  }
  return null;
}

function deriveDocumentsIngested(job: ScrapeJob, benchmark: BenchmarkEntry | null) {
  if (typeof job.documentsIngested === "number") return job.documentsIngested;
  if (typeof benchmark?.total_output_files === "number") return benchmark.total_output_files;
  if (typeof benchmark?.urls_processed === "number") return benchmark.urls_processed;
  return null;
}

function deriveProgress(job: ScrapeJob) {
  if (typeof (job as { progress?: unknown }).progress === "number") {
    const { progress } = job as { progress?: number };
    return Math.max(0, Math.min(100, Math.round(progress ?? 0)));
  }
  return null;
}

export function buildJobStats(job: ScrapeJob, benchmark: BenchmarkEntry | null = null) {
  return {
    status: job.status,
    durationSeconds: deriveDurationSeconds(job, benchmark),
    documentsIngested: deriveDocumentsIngested(job, benchmark),
    progress: deriveProgress(job),
  };
}

export async function listScrapeArtifacts(job: ScrapeJob) {
  if (!job.startedAt && !job.finishedAt) return [] as string[];

  // Set SCRAPE_ARTIFACT_DEBUG=true to log inclusion/skip decisions for artifacts.
  const debugArtifacts = process.env.SCRAPE_ARTIFACT_DEBUG === "true";
  const logVerbose = shouldLogArtifactsVerbose();

  try {
    const entries = await fs.readdir(KNOWLEDGE_BASE_DIR);
    const evaluations = await Promise.allSettled(
      entries.map(async (entry) => {
        const skipReasons: string[] = [];
        const includeReasons: string[] = [];
        const isMarkdown = entry.toLowerCase().endsWith(".md");
        if (!isMarkdown) {
          skipReasons.push("non-markdown file");
        }

        const fullPath = path.join(KNOWLEDGE_BASE_DIR, entry);
        const debugPayload: Record<string, unknown> = { path: fullPath };

        try {
          const stats = await fs.stat(fullPath);

          const createdAt = stats.birthtime ?? stats.mtime;
          const modifiedAt = stats.mtime;

          const createdInWindow =
            (!job.startedAt || createdAt >= job.startedAt) &&
            (!job.finishedAt || createdAt <= job.finishedAt);
          const modifiedInWindow =
            (!job.startedAt || modifiedAt >= job.startedAt) &&
            (!job.finishedAt || modifiedAt <= job.finishedAt);

          if (!createdInWindow) {
            if (job.startedAt && createdAt < job.startedAt) {
              skipReasons.push("created before job start");
            }
            if (job.finishedAt && createdAt > job.finishedAt) {
              skipReasons.push("created after job finish");
            }
          } else {
            includeReasons.push("creation within window");
          }

          if (!modifiedInWindow) {
            if (job.startedAt && modifiedAt < job.startedAt) {
              skipReasons.push("modified before job start");
            }
            if (job.finishedAt && modifiedAt > job.finishedAt) {
              skipReasons.push("modified after job finish");
            }
          } else {
            includeReasons.push("modified within window");
          }

          const shouldInclude = isMarkdown && (createdInWindow || modifiedInWindow);

          return {
            action: shouldInclude ? "include" : "skip", 
            artifactPath: shouldInclude ? path.relative(process.cwd(), fullPath) : null,
            debug: {
              ...debugPayload,
              createdAt,
              mtime: modifiedAt,
              startedAt: job.startedAt,
              finishedAt: job.finishedAt,
              includeReasons,
              skipReasons,
            },
          } as const;
        } catch (error) {
          return {
            action: "error" as const,
            artifactPath: null,
            debug: { ...debugPayload, error },
          };
        }
      })
    );

    const artifacts: string[] = [];
    const debugRecords: { action: string; payload: Record<string, unknown> }[] = [];

    for (const evaluation of evaluations) {
      if (evaluation.status === "fulfilled") {
        const value = evaluation.value;
        if (value.artifactPath) {
          artifacts.push(value.artifactPath);
        }
        if (debugArtifacts && logVerbose) {
          debugRecords.push({ action: value.action, payload: value.debug });
        }
      } else if (debugArtifacts && logVerbose) {
        debugRecords.push({ action: "error", payload: { reason: evaluation.reason } });
      }
    }

    if (debugArtifacts) {
      if (logVerbose) {
        for (const record of debugRecords) {
          const label =
            record.action === "include"
              ? "including"
              : record.action === "skip"
                ? "skipping"
                : "error";
          console.debug(`listScrapeArtifacts: ${label}` as const, record.payload);
        }
      } else {
        console.debug("listScrapeArtifacts: debug output suppressed to reduce log volume", {
          entries: entries.length,
        });
      }
    }

    return artifacts.sort();
  } catch (error) {
    console.warn("Unable to list scrape artifacts", { error });
    return [] as string[];
  }
}

export async function ensureAuthenticated(
  request: Request,
  options: { role?: AgentRole; csrf?: boolean } = {}
) {
  const result = await requireSession(request, {
    role: options.role,
    csrfProtected: options.csrf,
    requireVerified: true,
  });
  if ("response" in result) return result.response;
  return null;
}

export async function serializeJob(jobId: string, options: { includeLog?: boolean } = {}) {
  const job = await prisma.scrapeJob.findUnique({ where: { id: jobId } });
  if (!job) return null;

  const log = options.includeLog !== false ? await readJobLog(job.logPath, { maxBytes: 4000 }) : null;
  const artifacts = await listScrapeArtifacts(job);
  const ingestionResult = await readIngestionResult(job.id);

  return {
    job,
    log,
    stats: buildJobStats(job),
    artifacts,
    ingestionResult,
  };
}

export type SerializedScrapeJob = NonNullable<Awaited<ReturnType<typeof serializeJob>>>;
export type SerializedIngestionResult = StoredIngestionResult & { jobId: string };
