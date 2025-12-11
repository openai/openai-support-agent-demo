import fs from "fs";
import path from "path";
import { spawn, type ChildProcess } from "child_process";

import prisma from "./prisma";
import { calculateNextRun } from "./scheduler";
import { Prisma, ScrapeJob, ScrapeJobStatus } from "./generated/prisma";
import { emitJobUpdate } from "./scrapeJobEvents";
import { readLatestBenchmark } from "./scrapeMetrics";

type PythonResolution = {
  bin: string;
  notes: string[];
};

function deriveVirtualEnvRoot(pythonBin: string) {
  const normalized = path.resolve(pythonBin);
  const binDir = path.dirname(normalized);
  const binBasename = path.basename(binDir).toLowerCase();

  if (binBasename === "bin" || binBasename === "scripts") {
    const root = path.dirname(binDir);
    const expectedBinDir = binBasename === "bin" ? path.join(root, "bin") : path.join(root, "Scripts");
    if (fs.existsSync(expectedBinDir)) {
      return { root, binDir: expectedBinDir } as const;
    }
  }

  return { root: null, binDir: null } as const;
}

function buildPythonEnv(pythonBin: string) {
  const env = {
    ...process.env,
    PYTHONUTF8: "1",
    PYTHONIOENCODING: "utf-8",
    PYTHONUNBUFFERED: "1",
  } as NodeJS.ProcessEnv;

  const { root, binDir } = deriveVirtualEnvRoot(pythonBin);

  if (root && binDir) {
    env.VIRTUAL_ENV = env.VIRTUAL_ENV ?? root;
    env.PATH = [binDir, env.PATH ?? ""].filter(Boolean).join(path.delimiter);
  }

  return { env, virtualEnvRoot: root, virtualEnvBinDir: binDir } as const;
}

function looksLikeActivationScript(candidate: string) {
  const lower = path.basename(candidate).toLowerCase();
  return lower.startsWith("activate") || lower === "activate.ps1" || lower === "activate.bat";
}

function resolvePythonBin(): PythonResolution {
  const notes: string[] = [];
  const candidates: Array<{ value: string | undefined; source: string }> = [
    { value: process.env.SCRAPE_WORKER_PYTHON, source: "SCRAPE_WORKER_PYTHON" },
    { value: process.env.PYTHON, source: "PYTHON" },
    { value: "python", source: "default" },
  ];

  for (const { value, source } of candidates) {
    if (!value) {
      notes.push(`${source} not set; skipping`);
      continue;
    }

    if (looksLikeActivationScript(value)) {
      notes.push(
        `${source} points to an activation script (${value}). Set it to the Python interpreter (e.g., ".venv-c4ai-v1/Script(s)/python.exe" or ".venv-c4ai-v1/bin/python").`
      );
      continue;
    }

    try {
      const stat = fs.statSync(value);
      if (stat.isDirectory()) {
        notes.push(`${source} points to a directory (${value}); expected the python executable.`);
        continue;
      }

      return { bin: value, notes };
    } catch (error) {
      const message = error instanceof Error ? error.message : `${error}`;
      notes.push(`${source} candidate ${value} is not usable: ${message}`);
    }
  }

  return { bin: "python", notes };
}

const PYTHON_RESOLUTION = resolvePythonBin();
const PYTHON_BIN = PYTHON_RESOLUTION.bin;

if (PYTHON_RESOLUTION.notes.length) {
  console.info(
    `[scrapeRunner] Using python candidate "${PYTHON_BIN}". Notes: ${PYTHON_RESOLUTION.notes.join(" | ")}`
  );
} else {
  console.info(`[scrapeRunner] Using python candidate "${PYTHON_BIN}".`);
}
const HARNESS_PATH = path.join(
  process.cwd(),
  "crawl4AI-agent-v2",
  "benchmarks",
  "run_all.py"
);
const KNOWLEDGE_BASE_DIR = path.join(process.cwd(), "public", "knowledge_base");
const SCRAPE_TIMEOUT_MS = (() => {
  const raw = process.env.SCRAPE_TIMEOUT_MS;
  const parsed = raw === undefined ? 2 * 60 * 60 * 1000 : Number(raw);
  return Number.isFinite(parsed) ? parsed : 2 * 60 * 60 * 1000;
})();
const SCRAPE_SKIP_DEP_CHECK = process.env.SCRAPE_SKIP_DEP_CHECK === "true";
const SCRAPE_AUTO_INSTALL_DEPS =
  process.env.SCRAPE_AUTO_INSTALL_DEPS !== "false";
const LOG_DIR = path.join(process.cwd(), "logs", "scrape_jobs");

function buildRunLogPath(jobId: string, startedAt: Date) {
  const stamp = startedAt.toISOString().replace(/[:.]/g, "-");
  const relative = path.join("logs", "scrape_jobs", jobId, `${stamp}.log`);
  const absolute = path.join(process.cwd(), relative);
  return { relative, absolute };
}

type RunningProcess = {
  child: ChildProcess;
  logStream?: fs.WriteStream | null;
  markCanceled: () => void;
};

const RUNNING_PROCESSES = new Map<string, RunningProcess>();

type PrismaClientLike = Prisma.TransactionClient | typeof prisma;

async function installDependencies(
  pythonBin: string,
  env: NodeJS.ProcessEnv,
  logStream: fs.WriteStream
) {
  const requirementsPath = path.join(
    process.cwd(),
    "crawl4AI-agent-v2",
    "requirements.txt"
  );

  logStream.write(
    `[${new Date().toISOString()}] crawl4ai missing; attempting pip install from ${requirementsPath}.\n`
  );

  const installProc = spawn(
    pythonBin,
    ["-m", "pip", "install", "--user", "-r", requirementsPath],
    { env, cwd: process.cwd(), stdio: "pipe" }
  );

  const chunks: Buffer[] = [];
  return new Promise<{ ok: boolean; message?: string }>((resolve) => {
    installProc.stdout?.on("data", (chunk) => chunks.push(chunk));
    installProc.stderr?.on("data", (chunk) => chunks.push(chunk));

    installProc.on("error", (err) => {
      resolve({ ok: false, message: err.message });
    });

    installProc.on("close", (code) => {
      const output = Buffer.concat(chunks).toString();
      logStream.write(output);

      if (code === 0) {
        logStream.write(
          `[${new Date().toISOString()}] pip install completed successfully.\n`
        );
        resolve({ ok: true });
      } else {
        resolve({
          ok: false,
          message: `pip install exited with code ${code}. See above for output.`,
        });
      }
    });
  });
}

async function runDependencyCheck(
  pythonBin: string,
  logStream: fs.WriteStream,
  env: NodeJS.ProcessEnv
) {
  const interpreterProbe = spawn(
    pythonBin,
    [
      "-c",
      [
        "import json, sys",
        "print(json.dumps({",
        "  'executable': sys.executable,",
        "  'version': sys.version,",
        "  'sys_path': sys.path,",
        "}, indent=2))",
      ].join("\n"),
    ],
    { env, cwd: process.cwd(), stdio: "pipe" }
  );

  const interpreterChunks: Buffer[] = [];
  interpreterProbe.stdout?.on("data", (chunk) => interpreterChunks.push(chunk));
  interpreterProbe.stderr?.on("data", (chunk) => interpreterChunks.push(chunk));

  const interpreterReady = new Promise<void>((resolve) => {
    interpreterProbe.on("close", (code) => {
      const output = interpreterChunks.length
        ? Buffer.concat(interpreterChunks).toString()
        : "(no interpreter details)";
      logStream.write(`Interpreter probe via ${pythonBin} (exit ${code ?? -1}):\n${output}\n`);
      resolve();
    });
  });

  if (SCRAPE_SKIP_DEP_CHECK) {
    logStream.write(
      "Skipping crawl4ai dependency check because SCRAPE_SKIP_DEP_CHECK=true (trusted interpreter).\n"
    );
    await interpreterReady;
    return { ok: true } as const;
  }

  const importProbe = spawn(pythonBin, ["-c", "import crawl4ai"], {
    env,
    cwd: process.cwd(),
    stdio: "pipe",
  });

  const chunks: Buffer[] = [];
  return new Promise<{ ok: boolean; message?: string }>((resolve) => {
    importProbe.stdout?.on("data", (chunk) => chunks.push(chunk));
    importProbe.stderr?.on("data", (chunk) => chunks.push(chunk));

    importProbe.on("error", (err) => {
      resolve({ ok: false, message: err.message });
    });

    importProbe.on("close", async (code) => {
      await interpreterReady;

      if (code === 0) {
        resolve({ ok: true });
        return;
      }

      const pipProbe = spawn(pythonBin, ["-m", "pip", "show", "crawl4ai"], {
        env,
        cwd: process.cwd(),
        stdio: "pipe",
      });
      const pipChunks: Buffer[] = [];

      pipProbe.stdout?.on("data", (chunk) => pipChunks.push(chunk));
      pipProbe.stderr?.on("data", (chunk) => pipChunks.push(chunk));

      pipProbe.on("close", async (pipCode) => {
        const baseMessage = chunks.length ? Buffer.concat(chunks).toString() : "import failed";
        const pipMessage = pipChunks.length ? Buffer.concat(pipChunks).toString() : "pip show returned no output";

        logStream.write(`crawl4ai import probe failed (exit ${code}). Output: ${baseMessage}\n`);
        logStream.write(`pip show crawl4ai (exit ${pipCode ?? -1}): ${pipMessage}\n`);

        if (pipCode !== 0 && SCRAPE_AUTO_INSTALL_DEPS) {
          const installResult = await installDependencies(pythonBin, env, logStream);
          if (!installResult.ok) {
            resolve({ ok: false, message: installResult.message });
            return;
          }

          const retry = spawn(pythonBin, ["-c", "import crawl4ai"], {
            env,
            cwd: process.cwd(),
            stdio: "ignore",
          });

          retry.on("close", (retryCode) => {
            if (retryCode === 0) {
              resolve({ ok: true });
            } else {
              resolve({
                ok: false,
                message:
                  "crawl4ai is still unavailable after auto-install. Check interpreter configuration.",
              });
            }
          });

          return;
        }

        resolve({ ok: false, message: `${baseMessage}\n${pipMessage}` });
      });
    });
  });
}

function normalizeArgs(args: unknown): string[] {
  if (Array.isArray(args)) {
    return args.map((value) => `${value}`);
  }

  if (args && typeof args === "object") {
    const obj = args as Record<string, unknown>;
    const entries = Object.entries(obj);
    return entries.flatMap(([key, value]) => {
      if (key === "url" || key === "targetUrl") {
        return value === undefined || value === null
          ? ["--target-url"]
          : ["--target-url", `${value}`];
      }

      if (value === undefined || value === null) return [`--${key}`];
      return [`--${key}`, `${value}`];
    });
  }

  if (typeof args === "string" || typeof args === "number" || typeof args === "boolean") {
    return [`${args}`];
  }

  return [];
}

async function updateJob(
  client: PrismaClientLike,
  id: string,
  data: Partial<
    Pick<
      ScrapeJob,
      | "status"
      | "finishedAt"
      | "startedAt"
      | "logPath"
      | "nextRunAt"
      | "durationSeconds"
      | "documentsIngested"
      | "paused"
      | "progress"
    >
  >
) {
  const job = await client.scrapeJob.update({
    where: { id },
    data,
  });

  emitJobUpdate({
    jobId: id,
    status: job.status,
    startedAt: job.startedAt?.toISOString() ?? null,
    finishedAt: job.finishedAt?.toISOString() ?? null,
    logPath: job.logPath,
    progress: job.progress,
  });

  return job;
}

async function isJobCanceled(client: PrismaClientLike, id: string) {
  const job = await client.scrapeJob.findUnique({
    where: { id },
    select: { status: true },
  });

  return job?.status === ScrapeJobStatus.canceled;
}

async function markFailed(
  client: PrismaClientLike,
  job: ScrapeJob,
  message: string,
  logStream: fs.WriteStream | null
) {
  const finishedAt = new Date();
  logStream?.write(`[${finishedAt.toISOString()}] Job ${job.id} failed: ${message}\n`);
  logStream?.end();

  await updateJob(client, job.id, {
    status: ScrapeJobStatus.failed,
    finishedAt,
    progress: 100,
  });
}

export function cancelRunningScrape(jobId: string) {
  const running = RUNNING_PROCESSES.get(jobId);

  if (!running) {
    return {
      found: false,
      signaled: false,
      forceKillPlanned: false,
      message: "Job marked canceled; no active worker to terminate.",
    } as const;
  }

  running.markCanceled();
  const signaled = running.child.kill("SIGTERM");
  const killTimeoutMs = Number(process.env.SCRAPE_CANCEL_KILL_TIMEOUT_MS ?? 8000);
  let forceKillPlanned = false;
  let forceTimer: NodeJS.Timeout | null = null;

  if (signaled && Number.isFinite(killTimeoutMs) && killTimeoutMs > 0) {
    forceKillPlanned = true;
    forceTimer = setTimeout(() => {
      if (!running.child.killed) {
        running.child.kill("SIGKILL");
      }
    }, killTimeoutMs);

    running.child.once("close", () => {
      if (forceTimer) clearTimeout(forceTimer);
    });
  }

  const message = signaled
    ? "Cancellation requested; worker is being terminated."
    : "Failed to signal running worker; it may continue until completion.";

  running.logStream?.write(
    `[${new Date().toISOString()}] ${message} (job ${jobId}).\n`
  );

  return { found: true, signaled, forceKillPlanned, message } as const;
}

export async function runScrapeJob(
  job: ScrapeJob,
  client: PrismaClientLike = prisma
): Promise<{ exitCode: number } | undefined> {
  await fs.promises.mkdir(LOG_DIR, { recursive: true });
  await fs.promises.mkdir(KNOWLEDGE_BASE_DIR, { recursive: true }).catch(() => {});
  const startedAt = new Date();
  const { absolute: defaultLogPath } = buildRunLogPath(job.id, startedAt);
  const candidateLogPath = job.logPath ? path.resolve(job.logPath) : defaultLogPath;
  const normalizedLogPath = candidateLogPath.startsWith(LOG_DIR)
    ? candidateLogPath
    : defaultLogPath;
  const storedLogPath = path.relative(process.cwd(), normalizedLogPath);
  await fs.promises.mkdir(path.dirname(normalizedLogPath), { recursive: true });
  const logFilePath = path.resolve(storedLogPath);
  const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

  const { env: pythonEnv, virtualEnvRoot } = buildPythonEnv(PYTHON_BIN);

  let progress = Math.max(0, Math.min(100, job.progress ?? 0));
  let lastProgressPersist = 0;
  let phaseCap = 70;

  const clampForPhase = (next: number, cap?: number) => {
    const ceiling = typeof cap === "number" ? cap : phaseCap;
    const bounded = Math.min(ceiling, Math.max(0, Math.min(100, Math.round(next))));
    return Math.max(progress, bounded);
  };

  const maybeAdvancePhase = () => {
    if (phaseCap === 70 && progress >= 68) {
      phaseCap = 90;
      return;
    }
    if (phaseCap === 90 && progress >= 88) {
      phaseCap = 95;
    }
  };

  const setProgress = async (value: number, options?: { cap?: number; force?: boolean }) => {
    const target = clampForPhase(value, options?.cap);
    const elapsed = Date.now() - lastProgressPersist;

    if (!options?.force && target === progress) {
      return;
    }

    if (!options?.force && elapsed < 750) {
      progress = target;
      maybeAdvancePhase();
      return;
    }

    progress = target;
    lastProgressPersist = Date.now();
    maybeAdvancePhase();
    try {
      await updateJob(client, job.id, { progress });
    } catch (error) {
      console.warn(`[scrapeRunner] failed to persist progress for ${job.id}:`, error);
    }
  };

  if (await isJobCanceled(client, job.id)) {
    logStream.write(`[${startedAt.toISOString()}] Job ${job.id} is canceled; skipping run.\n`);
    logStream.end();
    return { exitCode: -1 };
  }

  await updateJob(client, job.id, {
    status: ScrapeJobStatus.running,
    startedAt,
    finishedAt: null,
    logPath: storedLogPath,
    progress: 0,
  });
  progress = 0;
  lastProgressPersist = Date.now();

  const args = [
    "-u",
    HARNESS_PATH,
    "--script",
    job.script,
    "--verbose-logs",
    ...normalizeArgs(job.args),
  ];
  if (virtualEnvRoot) {
    args.push("--venv", virtualEnvRoot);
  }
  logStream.write(`[${startedAt.toISOString()}] Starting job ${job.id} with script ${job.script}.\n`);
  logStream.write(`Using python: ${PYTHON_BIN}\n`);
  if (PYTHON_RESOLUTION.notes.length) {
    PYTHON_RESOLUTION.notes.forEach((note) => logStream.write(`PYTHON_RESOLUTION: ${note}\n`));
  }
  logStream.write(`Virtual env root: ${virtualEnvRoot ?? "(not detected)"}\n`);
  logStream.write(`Knowledge base output directory: ${KNOWLEDGE_BASE_DIR}\n`);
  logStream.write(`Timeout (ms): ${SCRAPE_TIMEOUT_MS}\n`);

  const depCheck = await runDependencyCheck(PYTHON_BIN, logStream, pythonEnv);
  if (!depCheck.ok) {
    await markFailed(
      client,
      job,
      depCheck.message ?? "crawl4ai dependency check failed. Install crawl4ai in the selected interpreter.",
      logStream
    );
    return { exitCode: 1 };
  }

  await setProgress(10, { force: true });

  let exitCode = -1;
  let missingCrawlDependency = false;
  let canceled = false;

  try {
    const child = spawn(PYTHON_BIN, args, {
      cwd: process.cwd(),
      env: pythonEnv,
    });

    const markCanceled = () => {
      canceled = true;
      logStream.write(
        `[${new Date().toISOString()}] Cancellation requested; signaling worker.\n`
      );
    };

    RUNNING_PROCESSES.set(job.id, { child, logStream, markCanceled });

    let lastOutputAt = Date.now();
    let timeoutId: NodeJS.Timeout | null = null;
    const resetTimeout = () => {
      if (!Number.isFinite(SCRAPE_TIMEOUT_MS)) return;
      const remaining = SCRAPE_TIMEOUT_MS - (Date.now() - lastOutputAt);
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logStream.write(
          `[${new Date().toISOString()}] Timeout exceeded (${SCRAPE_TIMEOUT_MS} ms since last output). Terminating job ${job.id}.\n`
        );
        child.kill("SIGKILL");
      }, Math.max(1, remaining));
    };

    const heartbeat = setInterval(() => {
      logStream.write(`[${new Date().toISOString()}] heartbeat: job ${job.id} still running...\n`);
        emitJobUpdate({
          jobId: job.id,
          status: ScrapeJobStatus.running,
          startedAt: startedAt.toISOString(),
          logPath: storedLogPath,
        });
        void setProgress(Math.min(90, progress + 1));
    }, 60_000);

    const cancellationProbe = setInterval(async () => {
      if (canceled) return;
      const now = new Date();
      const isCanceled = await isJobCanceled(client, job.id).catch(() => false);
      if (isCanceled) {
        canceled = true;
        logStream.write(`[${now.toISOString()}] Job ${job.id} canceled; terminating worker.\n`);
        child.kill("SIGTERM");
      }
    }, 5_000);

    const activityProbe = setInterval(() => {
      logStream.write(
        `[${new Date().toISOString()}] activity probe: last output ${(Date.now() - lastOutputAt) / 1000}s ago.\n`
      );
      resetTimeout();
    }, 30 * 60 * 1000);

    const handleChunk = (chunk: Buffer) => {
      lastOutputAt = Date.now();
      resetTimeout();
      logStream.write(chunk);
      const text = chunk.toString();
      if (
        text.toLowerCase().includes("crawl4ai is not available") ||
        text.toLowerCase().includes("no module named 'crawl4ai'")
      ) {
        missingCrawlDependency = true;
      }
      emitJobUpdate({
        jobId: job.id,
        status: ScrapeJobStatus.running,
        startedAt: startedAt.toISOString(),
        logPath: storedLogPath,
      });
      void setProgress(Math.min(95, progress + 2));
    };

    child.stdout.on("data", handleChunk);
    child.stderr.on("data", handleChunk);

    resetTimeout();

    exitCode = await new Promise((resolve) => {
      child.on("close", (code) => {
        if (timeoutId) clearTimeout(timeoutId);
        clearInterval(heartbeat);
        clearInterval(cancellationProbe);
        clearInterval(activityProbe);
        RUNNING_PROCESSES.delete(job.id);
        resolve(code ?? -1);
      });
      child.on("error", (err) => {
        if (timeoutId) clearTimeout(timeoutId);
        clearInterval(heartbeat);
        clearInterval(cancellationProbe);
        clearInterval(activityProbe);
        RUNNING_PROCESSES.delete(job.id);
        logStream.write(`Worker failed to spawn: ${err.message}\n`);
        resolve(-1);
      });
    });
  } catch (error) {
    RUNNING_PROCESSES.delete(job.id);
    const message = error instanceof Error ? error.message : "Unknown error";
    await markFailed(client, job, message, logStream);
    return undefined;
  }

  RUNNING_PROCESSES.delete(job.id);

  if (missingCrawlDependency && exitCode === 0) {
    exitCode = 1;
    logStream.write(
      "crawl4ai dependency missing in the selected interpreter. Install it in this environment and rerun.\n"
    );
  }

  const finishedAt = new Date();
  logStream.write(`[${finishedAt.toISOString()}] Job ${job.id} completed with code ${exitCode}.\n`);
  logStream.end();

  if (canceled || (await isJobCanceled(client, job.id))) {
    await updateJob(client, job.id, {
      status: ScrapeJobStatus.canceled,
      finishedAt,
      logPath: storedLogPath,
      nextRunAt: null,
      paused: false,
      progress: 100,
    });
  } else {
    const status = exitCode === 0 ? ScrapeJobStatus.completed : ScrapeJobStatus.failed;
    const benchmark = await readLatestBenchmark(job.script);
    const durationSeconds =
      typeof benchmark?.duration_seconds === "number"
        ? benchmark.duration_seconds
        : Math.max(0, (finishedAt.getTime() - startedAt.getTime()) / 1000);
    const documentsIngested =
      typeof benchmark?.total_output_files === "number"
        ? benchmark.total_output_files
        : typeof benchmark?.urls_processed === "number"
          ? benchmark.urls_processed
          : null;

    await updateJob(client, job.id, {
      status,
      finishedAt,
      logPath: storedLogPath,
      nextRunAt: calculateNextRun(job.cadence, finishedAt),
      durationSeconds,
      documentsIngested,
      progress: 100,
    });
  }

  return { exitCode };
}

export async function triggerScrapeJob(jobId: string) {
  const job = await prisma.scrapeJob.findUnique({ where: { id: jobId } });
  if (!job) return null;

  void runScrapeJob(job).catch((error) => {
    console.error(`Failed to run job ${jobId}:`, error);
  });

  return { jobId, logPath: job.logPath ?? path.join("logs", "scrape_jobs", `${job.id}.log`) };
}
