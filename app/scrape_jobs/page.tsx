"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import {
  CalendarClock,
  CalendarRange,
  Copy,
  Loader2,
  MoreVertical,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  Send,
  Info,
  Zap,
  Trash2,
  XCircle,
} from "lucide-react";

import { ScrapeJobAuthPrompt } from "@/components/ScrapeJobAuthPrompt";
import { AppPageShell } from "@/components/app-page-shell";
import { defaultRouteForRoles } from "@/lib/auth/routes";
import { ScrapeJobCadence, ScrapeJobStatus } from "@/lib/generated/prisma";
import type { StoredIngestionResult } from "@/lib/ingestionResults";
import {
  SCRIPT_SCHEMA_MAP,
  SCRIPT_SCHEMAS,
  validateArgsForSchema,
  validateTargetForSchema,
} from "@/config/scrapeScripts";
import { useSessionStore } from "@/stores/useSessionStore";

type ScrapeJob = {
  id: string;
  script: string;
  args: Record<string, unknown> | null;
  status: ScrapeJobStatus;
  cadence: ScrapeJobCadence;
  autoRunManualWithNext: boolean;
  paused: boolean;
  progress?: number;
  startedAt: string | null;
  finishedAt: string | null;
  logPath: string | null;
  nextRunAt: string | null;
  durationSeconds: number | null;
  documentsIngested: number | null;
  createdAt: string;
};

type JobStats = {
  status: ScrapeJobStatus;
  durationSeconds: number | null;
  documentsIngested: number | null;
  progress: number | null;
};

type SerializedJob = {
  job: ScrapeJob;
  log: string | null;
  stats: JobStats;
  artifacts: string[];
  ingestionResult?: (StoredIngestionResult & { jobId: string }) | null;
};

type JobsPage = { jobs: SerializedJob[]; nextCursor: string | null };
const JOB_PAGE_SIZE = 40;

const fetcher = async (url: string) => {
  const maxAttempts = process.env.NODE_ENV === "production" ? 2 : 3;
  const timeoutMs = process.env.NODE_ENV === "production" ? 12000 : 25000;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, { credentials: "same-origin", signal: controller.signal });

      if (res.status === 401) {
        const error = new Error("Unauthorized");
        (error as Error & { status?: number }).status = 401;
        throw error;
      }

      if (!res.ok) {
        const error = new Error("Failed to load scrape jobs");
        (error as Error & { status?: number; info?: unknown }).status = res.status;
        (error as Error & { status?: number; info?: unknown }).info = await res
          .text()
          .catch(() => null);
        throw error;
      }

      return res.json();
    } catch (error) {
      const isLastAttempt = attempt === maxAttempts;
      const isAbortError = (error as Error)?.name === "AbortError";
      const message = isAbortError
        ? `Scrape jobs request timed out after ${timeoutMs / 1000}s; will retry automatically.`
        : "Error fetching scrape jobs";

      if (isAbortError) {
        console.warn(message, error);
      } else {
        console.error(message, error);
      }

      if (isLastAttempt) {
        const finalError = new Error(message);
        (finalError as Error & { cause?: unknown; name?: string }).cause = error;
        if (isAbortError) {
          finalError.name = "TimeoutError";
        }
        throw finalError;
      }

      await new Promise((resolve) => setTimeout(resolve, attempt * 500));
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error("Unexpected fetcher exhaustion");
};

const paginatedFetcher = async (url: string): Promise<JobsPage> => {
  const payload = await fetcher(url);
  if (Array.isArray(payload)) {
    return { jobs: payload as SerializedJob[], nextCursor: null };
  }
  return payload as JobsPage;
};

const SCRIPT_PRESETS = SCRIPT_SCHEMAS;

const KNOWLEDGE_BASE_PATH = "public/knowledge_base";
const AUTO_RUN_MANUAL_WITH_NEXT_DEFAULT =
  process.env.NEXT_PUBLIC_AUTO_RUN_MANUAL_WITH_NEXT === "true";

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleString();
}

function toLocalDateTimeInput(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function parseLocalDateTimeInput(value: string | null) {
  if (!value) return { iso: null, date: null, error: undefined } as const;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return { iso: null, date: null, error: "Enter a valid date/time" } as const;
  return { iso: parsed.toISOString(), date: parsed, error: undefined } as const;
}

function formatDuration(seconds: number | null) {
  if (seconds === null) return "—";
  if (seconds < 90) return `${seconds.toFixed(0)}s`;
  const minutes = seconds / 60;
  return `${minutes.toFixed(1)}m`;
}

function deriveProgress(job: ScrapeJob) {
  if (typeof job.progress === "number") {
    return Math.max(0, Math.min(100, Math.round(job.progress)));
  }
  if (job.paused) return 0;
  if (job.status === ScrapeJobStatus.completed || job.status === ScrapeJobStatus.failed) return 100;
  if (job.status === ScrapeJobStatus.canceled) return 100;
  if (job.status === ScrapeJobStatus.running) return 70;
  if (job.status === ScrapeJobStatus.queued) return 25;
  return 40;
}

function progressColor(status: ScrapeJobStatus, paused: boolean) {
  if (paused) return "bg-zinc-300";
  if (status === ScrapeJobStatus.canceled) return "bg-zinc-400";
  if (status === ScrapeJobStatus.failed) return "bg-red-500";
  if (status === ScrapeJobStatus.completed) return "bg-emerald-500";
  return "bg-[#2B83F6]";
}

function getJobTarget(job: ScrapeJob) {
  const args = job.args as Record<string, unknown> | null;
  if (!args) return "";
  const value = (args.url as string | undefined) ?? (args.targetUrl as string | undefined);
  return typeof value === "string" ? value : "";
}

export default function ScrapeJobsPage() {
  const [isDocumentVisible, setIsDocumentVisible] = useState(
    typeof document === "undefined" ? true : document.visibilityState === "visible"
  );
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const [detailedPolling, setDetailedPolling] = useState(true);
  const [historyFilters, setHistoryFilters] = useState<{
    status: ScrapeJobStatus | "";
    from: string;
    to: string;
  }>({ status: "", from: "", to: "" });
  const [appliedHistoryFilters, setAppliedHistoryFilters] = useState<{
    status: ScrapeJobStatus | "";
    from: string;
    to: string;
  }>({ status: "", from: "", to: "" });

  const roles = useSessionStore((state) => state.roles);
  const isAdmin = roles?.includes("admin");
  const defaultRedirect = useMemo(() => defaultRouteForRoles(roles), [roles]);

  const csrfToken = useSessionStore((state) => state.csrfToken);
  const csrfHeaders = useMemo<HeadersInit | undefined>(
    () => (csrfToken ? { "x-csrf-token": csrfToken } : undefined),
    [csrfToken]
  );
  const eventSourceRef = useRef<EventSource | null>(null);
  const eventSourceRetryRef = useRef<{ attempt: number; timer: NodeJS.Timeout | null }>({
    attempt: 0,
    timer: null,
  });

  const { data, error, isLoading, mutate, setSize: setPageCount } = useSWRInfinite<JobsPage>(
    (index: number, previousPage: JobsPage | null) => {
      if (!isAdmin) return null;
      if (previousPage && !previousPage.nextCursor) return null;
      const cursorParam = index === 0 ? "" : `&cursor=${previousPage?.nextCursor ?? ""}`;
      const statusParam = appliedHistoryFilters.status
        ? `&status=${appliedHistoryFilters.status}`
        : "";
      const fromParam = appliedHistoryFilters.from
        ? `&from=${encodeURIComponent(appliedHistoryFilters.from)}`
        : "";
      const toParam = appliedHistoryFilters.to
        ? `&to=${encodeURIComponent(appliedHistoryFilters.to)}`
        : "";
      return `/api/scrape_jobs?detailed=${detailedPolling ? "true" : "false"}&logPreview=true&limit=${JOB_PAGE_SIZE}${cursorParam}${statusParam}${fromParam}${toParam}`;
    },
    paginatedFetcher,
    {
      refreshInterval: (latestPages: JobsPage[] | undefined) => {
        if (!isDocumentVisible) return 0;

        const merged = latestPages?.flatMap((page: JobsPage) => page.jobs ?? []) ?? [];
        const hasActiveJobs = merged.some(
          (job: SerializedJob) =>
            job.job.status === ScrapeJobStatus.running || job.job.status === ScrapeJobStatus.queued
        );
        const jobCount = merged.length;

        const baseInterval = hasActiveJobs
          ? detailedPolling
            ? 20000
            : 35000
          : jobCount > 75
            ? 60000
            : 45000;

        const backoffFactor = Math.min(consecutiveErrors + 1, 5);
        return baseInterval * backoffFactor;
      },
      revalidateOnFocus: true,
      dedupingInterval: 5000,
      refreshWhenHidden: false,
      isPaused: () => !isDocumentVisible || !isAdmin,
      onSuccess: () => setConsecutiveErrors(0),
      onError: () => setConsecutiveErrors((count: number) => count + 1),
    }
  );

  const applyHistoryFilters = () => {
    setAppliedHistoryFilters(historyFilters);
    setPageCount(1);
  };

  const clearHistoryFilters = () => {
    const cleared = { status: "" as ScrapeJobStatus | "", from: "", to: "" };
    setHistoryFilters(cleared);
    setAppliedHistoryFilters(cleared);
    setPageCount(1);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsDocumentVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (isDocumentVisible && isAdmin) {
      void mutate();
    }
  }, [isDocumentVisible, mutate, isAdmin]);

  const jobs = useMemo(
    () => (data ?? []).flatMap((page: JobsPage) => page.jobs ?? []),
    [data]
  );
  const nextCursor = useMemo(
    () => data?.[data.length - 1]?.nextCursor ?? null,
    [data]
  );

  useEffect(() => {
    if (!jobs.length) return;

    const jobCount = jobs.length;

    if (detailedPolling && jobCount > 60) {
      setDetailedPolling(false);
    } else if (!detailedPolling && jobCount < 50) {
      setDetailedPolling(true);
    }
  }, [jobs, detailedPolling]);

  const [selectedPreset, setSelectedPreset] = useState(SCRIPT_PRESETS[0].key);
  const [targetUrl, setTargetUrl] = useState(SCRIPT_PRESETS[0].defaultTarget);
  const [createTargetError, setCreateTargetError] = useState<string | null>(null);
  const [createArgError, setCreateArgError] = useState<string | null>(null);
  const [requiredArgDrafts, setRequiredArgDrafts] = useState<Record<string, string>>({});
  const [creating, setCreating] = useState<string | null>(null);
  const [ingesting, setIngesting] = useState<Record<string, string>>({});
  const [copiedTarget, setCopiedTarget] = useState(false);
  const [copiedLog, setCopiedLog] = useState<Record<string, boolean>>({});
  const [rowActions, setRowActions] = useState<Record<string, string>>({});
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [runMessages, setRunMessages] = useState<Record<string, string>>({});
  const [scheduleErrors, setScheduleErrors] = useState<Record<string, string>>({});
  const [scheduleDrafts, setScheduleDrafts] = useState<
    Record<
      string,
      {
        cadence: ScrapeJobCadence;
        nextRunAt: string;
        autoRunManualWithNext: boolean;
      }
    >
  >({});
  const [authTokenInput, setAuthTokenInput] = useState("");
  const [authenticating, setAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState(false);

  useEffect(() => {
    const retryState = eventSourceRetryRef.current;

    const cleanupTimers = () => {
      if (retryState.timer) {
        clearTimeout(retryState.timer);
        retryState.timer = null;
      }
    };

    const resetRetry = () => {
      cleanupTimers();
      retryState.attempt = 0;
    };

    const closeStream = () => {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    };

    const scheduleReconnect = () => {
      retryState.attempt += 1;
      const delay = Math.min(30000, 1000 * 2 ** (retryState.attempt - 1));

      cleanupTimers();
      retryState.timer = setTimeout(() => {
        retryState.timer = null;
        if (isDocumentVisible) {
          connect();
        }
      }, delay);
    };

    const connect = () => {
      closeStream();
      if (!isDocumentVisible) return;

      const source = new EventSource("/api/scrape_jobs/updates");
      eventSourceRef.current = source;

      source.onmessage = () => {
        resetRetry();
        void mutate();
      };

      source.onerror = () => {
        closeStream();
        scheduleReconnect();
      };
    };

    connect();

    return () => {
      cleanupTimers();
      closeStream();
      retryState.attempt = 0;
    };
  }, [isDocumentVisible, mutate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest(".job-actions-menu")) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const markAuthRequired = () => {
    setAuthRequired(true);
    setAuthError("Authentication required");
  };

  const handleAuthFailure = (response: Response) => {
    if (response.status === 401) {
      markAuthRequired();
      return true;
    }
    return false;
  };

  const authenticate = async (event?: React.FormEvent) => {
    event?.preventDefault();
    setAuthenticating(true);
    setAuthError(null);

    const res = await fetch("/api/scrape_jobs/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(csrfHeaders ?? {}) },
      body: JSON.stringify({ token: authTokenInput }),
    });

    const payload = (await res.json().catch(() => null)) as { error?: string } | null;

    if (res.ok) {
      setAuthRequired(false);
      setAuthTokenInput("");
      setAuthError(null);
      await mutate();
    } else {
      setAuthError(payload?.error || "Authentication failed");
    }

    setAuthenticating(false);
  };

  const handlePresetChange = (key: string) => {
    setSelectedPreset(key);
    const preset = SCRIPT_PRESETS.find((p) => p.key === key);
    if (preset?.defaultTarget) {
      setTargetUrl(preset.defaultTarget);
    }
    setCreateTargetError(null);
    setCreateArgError(null);
    const schema = SCRIPT_SCHEMA_MAP.get(key);
    if (schema?.requiredArgs?.length) {
      setRequiredArgDrafts((current) => {
        const next: Record<string, string> = {};
        schema.requiredArgs?.forEach((req) => {
          next[req.key] = current[req.key] ?? "";
        });
        return next;
      });
    } else {
      setRequiredArgDrafts({});
    }
  };

  const createJob = async (cadence: ScrapeJobCadence) => {
    const schema = activeSchema;
    const trimmedTarget = targetUrl.trim();
    setCreateTargetError(null);
    setCreateArgError(null);

    if (!trimmedTarget) {
      setCreateTargetError("Enter a target URL");
      return;
    }

    if (schema) {
      const targetError = validateTargetForSchema(schema, trimmedTarget);
      if (targetError) {
        setCreateTargetError(targetError);
        return;
      }
    }

    const argsPayload: Record<string, unknown> = trimmedTarget
      ? { url: trimmedTarget, targetUrl: trimmedTarget }
      : {};

    if (schema?.requiredArgs?.length) {
      schema.requiredArgs.forEach((req) => {
        const draft = (requiredArgDrafts[req.key] ?? "").trim();
        if (draft) {
          const parts = draft.split(",").map((part) => part.trim()).filter(Boolean);
          argsPayload[req.key] = parts.length > 1 ? parts : parts[0];
        }
      });

      const argError = validateArgsForSchema(schema, argsPayload);
      if (argError) {
        setCreateArgError(argError);
        return;
      }
    }

    try {
      setCreating(cadence);
      const response = await fetch("/api/scrape_jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(csrfHeaders ?? {}) },
        body: JSON.stringify({
          script: selectedPreset,
          args: argsPayload,
          cadence,
          status: ScrapeJobStatus.queued,
        }),
      });

      if (handleAuthFailure(response)) return;

      if (!response.ok) {
        console.error("Failed to create job", await response.text());
      } else {
        await mutate();
        setCreateArgError(null);
        setCreateTargetError(null);
      }
    } finally {
      setCreating(null);
    }
  };

  const enqueueManual = () => createJob(ScrapeJobCadence.manual);
  const scheduleDaily = () => createJob(ScrapeJobCadence.daily);
  const scheduleWeekly = () => createJob(ScrapeJobCadence.weekly);
  const scheduleMonthly = () => createJob(ScrapeJobCadence.monthly);

  const copyText = async (value: string, onCopied: () => void) => {
    try {
      await navigator.clipboard.writeText(value);
      onCopied();
    } catch {
      // ignore
    }
  };

  const activeSchema = SCRIPT_SCHEMA_MAP.get(selectedPreset);

  const getScheduleDraft = (job: ScrapeJob) =>
    scheduleDrafts[job.id] ?? {
      cadence: job.cadence,
      nextRunAt: toLocalDateTimeInput(job.nextRunAt),
      autoRunManualWithNext:
        job.cadence === ScrapeJobCadence.manual
          ? job.autoRunManualWithNext ?? AUTO_RUN_MANUAL_WITH_NEXT_DEFAULT
          : false,
    };

  const updateScheduleDraft = (
    job: ScrapeJob,
    updates: Partial<{
      cadence: ScrapeJobCadence;
      nextRunAt: string;
      autoRunManualWithNext: boolean;
    }>
  ) => {
    setScheduleDrafts((state) => ({
      ...state,
      [job.id]: (() => {
        const current = getScheduleDraft(job);
        const nextCadence = updates.cadence ?? current.cadence;
        const nextAutoRunManualWithNext = (() => {
          if (nextCadence !== ScrapeJobCadence.manual) return false;
          if (current.cadence !== ScrapeJobCadence.manual && updates.cadence === ScrapeJobCadence.manual)
            return job.autoRunManualWithNext ?? AUTO_RUN_MANUAL_WITH_NEXT_DEFAULT;
          return updates.autoRunManualWithNext ?? current.autoRunManualWithNext;
        })();

        return {
          ...current,
          ...updates,
          cadence: nextCadence,
          autoRunManualWithNext: nextAutoRunManualWithNext,
        };
      })(),
    }));
    if (scheduleErrors[job.id]) {
      setScheduleErrors((current) => {
        const next = { ...current };
        delete next[job.id];
        return next;
      });
    }
  };

  const sendToVectorStore = async (job: SerializedJob) => {
    setIngesting((state) => ({ ...state, [job.job.id]: "working" }));
    const artifactPaths = job.artifacts || [];

    if (artifactPaths.length === 0) {
      setRunMessages((state) => ({
        ...state,
        [job.job.id]: "No scraped artifacts were found for this run.",
      }));
      setIngesting((state) => ({ ...state, [job.job.id]: "error" }));
      return;
    }

    try {
      const res = await fetch("/api/scraper_ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(csrfHeaders ?? {}) },
        body: JSON.stringify({
          jobId: job.job.id,
          artifactPaths,
          destinationFolder: "knowledge_base",
        }),
      });

      const result = await res.json().catch(() => ({}));

      if (res.ok) {
        setIngesting((state) => ({ ...state, [job.job.id]: "done" }));
        const docs = (result.ingestedDocuments as string[]) || artifactPaths;
        const message =
          typeof result.message === "string"
            ? result.message
            : `Ingestion triggered for ${docs.length} document(s).`;
        setRunMessages((state) => ({ ...state, [job.job.id]: message }));
        await mutate();
      } else {
        setIngesting((state) => ({ ...state, [job.job.id]: "error" }));
        const error = typeof result?.error === "string" ? result.error : "Failed to start ingestion.";
        setRunMessages((state) => ({ ...state, [job.job.id]: error }));
      }
    } catch (err) {
      console.error("Error sending to vector store", err);
      setIngesting((state) => ({ ...state, [job.job.id]: "error" }));
      setRunMessages((state) => ({ ...state, [job.job.id]: "Unexpected error while sending to vector store." }));
    }
  };

  const validateScheduleDraft = (
    job: ScrapeJob
  ): { isoNextRunAt: string | null; error: string | null } => {
    const draft = getScheduleDraft(job);
    const parsed = parseLocalDateTimeInput(draft.nextRunAt);

    if (parsed.error) {
      return { isoNextRunAt: null, error: parsed.error };
    }

    if (draft.cadence === ScrapeJobCadence.manual && draft.autoRunManualWithNext) {
      if (!parsed.date) {
        return { isoNextRunAt: null, error: "Set a next run time to auto-run manual jobs." };
      }
      if (parsed.date.getTime() <= Date.now()) {
        return {
          isoNextRunAt: parsed.iso,
          error: "Next run time must be in the future for scheduled cadences.",
        };
      }
    } else if (parsed.date && draft.cadence !== ScrapeJobCadence.manual && parsed.date.getTime() <= Date.now()) {
      return {
        isoNextRunAt: parsed.iso,
        error: "Next run time must be in the future for scheduled cadences.",
      };
    }

    return { isoNextRunAt: parsed.iso, error: null };
  };

  const markRowAction = (jobId: string, action: string | null) => {
    setRowActions((state) => {
      const next = { ...state } as Record<string, string>;
      if (action) {
        next[jobId] = action;
      } else {
        delete next[jobId];
      }
      return next;
    });
  };

  const togglePauseJob = async (job: SerializedJob) => {
    const targetPaused = !job.job.paused;
    markRowAction(job.job.id, targetPaused ? "pause" : "resume");
    try {
      const res = await fetch(`/api/scrape_jobs/${job.job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...(csrfHeaders ?? {}) },
        body: JSON.stringify({ paused: targetPaused }),
      });

      if (handleAuthFailure(res)) return;

      if (res.ok) {
        await mutate();
      } else {
        console.error("Failed to toggle pause", await res.text());
      }
    } catch (error) {
      console.error("Error toggling pause", error);
    } finally {
      markRowAction(job.job.id, null);
    }
  };

  const cancelJob = async (jobId: string) => {
    markRowAction(jobId, "cancel");
    try {
      const res = await fetch(`/api/scrape_jobs/${jobId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...(csrfHeaders ?? {}) },
      });

      if (handleAuthFailure(res)) return;

      const payload = (await res.json().catch(() => null)) as
        | { message?: string; error?: string; cancellation?: { message?: string } }
        | null;

      if (payload?.message || payload?.cancellation?.message) {
        setRunMessages((state) => ({
          ...state,
          [jobId]: payload.message || payload.cancellation?.message || "",
        }));
      }

      if (res.ok) {
        await mutate();
      } else {
        console.error(
          "Failed to cancel job",
          payload?.error || payload?.message || (await res.text())
        );
      }
    } catch (error) {
      console.error("Error canceling job", error);
    } finally {
      markRowAction(jobId, null);
    }
  };

  const deleteJob = async (jobId: string) => {
    const confirmDelete = window.confirm(
      "Delete this job and its artifacts permanently? This cannot be undone."
    );
    if (!confirmDelete) return;

    markRowAction(jobId, "delete");
    try {
      const res = await fetch(`/api/scrape_jobs/${jobId}/hard`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...(csrfHeaders ?? {}) },
      });

      if (handleAuthFailure(res)) return;

      if (res.ok) {
        await mutate();
      } else {
        console.error("Failed to delete job", await res.text());
      }
    } catch (error) {
      console.error("Error deleting job", error);
    } finally {
      markRowAction(jobId, null);
      setOpenMenu(null);
    }
  };

  const requeueJob = async (jobId: string) => {
    markRowAction(jobId, "requeue");
    try {
      const res = await fetch(`/api/scrape_jobs/${jobId}/trigger`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(csrfHeaders ?? {}) },
      });

      if (handleAuthFailure(res)) return;

      if (res.ok) {
        await mutate();
      } else {
        console.error("Failed to requeue job", await res.text());
      }
    } catch (error) {
      console.error("Error requeuing job", error);
    } finally {
      markRowAction(jobId, null);
    }
  };

  const runJobNow = async (jobId: string) => {
    markRowAction(jobId, "run-now");
    try {
      const res = await fetch(`/api/scrape_jobs/${jobId}/clone`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(csrfHeaders ?? {}) },
      });

      if (handleAuthFailure(res)) return;

      if (res.ok) {
        const payload = (await res.json().catch(() => null)) as
          | { job?: { id?: string } }
          | null;
        const newJobId = payload?.job?.id;
        if (newJobId) {
          setRunMessages((current) => ({
            ...current,
            [jobId]: `New run created (${newJobId})`,
          }));
        }
        await mutate();
      } else {
        console.error("Failed to run job immediately", await res.text());
      }
    } catch (error) {
      console.error("Error triggering run", error);
    } finally {
      markRowAction(jobId, null);
    }
  };

  const saveSchedule = async (job: SerializedJob) => {
    markRowAction(job.job.id, "schedule");
    const draft = getScheduleDraft(job.job);
    const { isoNextRunAt, error } = validateScheduleDraft(job.job);

    if (error) {
      setScheduleErrors((current) => ({ ...current, [job.job.id]: error }));
      markRowAction(job.job.id, null);
      return;
    }

    try {
      const res = await fetch(`/api/scrape_jobs/${job.job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...(csrfHeaders ?? {}) },
        body: JSON.stringify({
          cadence: draft.cadence,
          nextRunAt: isoNextRunAt,
          autoRunManualWithNext:
            draft.cadence === ScrapeJobCadence.manual ? draft.autoRunManualWithNext : false,
        }),
      });

      if (handleAuthFailure(res)) return;

      if (res.ok) {
        setRunMessages((current) => ({
          ...current,
          [job.job.id]: "Schedule updated.",
        }));
        setScheduleErrors((current) => {
          const next = { ...current };
          delete next[job.job.id];
          return next;
        });
        await mutate();
      } else {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        const message = payload?.error || "Failed to update schedule";
        setScheduleErrors((current) => ({ ...current, [job.job.id]: message }));
        console.error("Failed to update schedule", message);
      }
    } catch (error) {
      console.error("Error updating schedule", error);
    } finally {
      markRowAction(job.job.id, null);
    }
  };

  const renderStatusPill = (status: ScrapeJobStatus, paused: boolean) => {
    const labels: Partial<Record<ScrapeJobStatus, string>> = {
      [ScrapeJobStatus.queued]: "Queued",
      [ScrapeJobStatus.running]: "Running",
      [ScrapeJobStatus.completed]: "Completed",
      [ScrapeJobStatus.failed]: "Failed",
      [ScrapeJobStatus.canceled]: "Canceled",
    };

    const label = paused ? `Paused — ${labels[status] ?? status}` : labels[status] ?? status;

    const colors: Partial<Record<ScrapeJobStatus, string>> = {
      [ScrapeJobStatus.queued]: "bg-amber-50 text-amber-700 border border-amber-200",
      [ScrapeJobStatus.running]: "bg-blue-50 text-blue-700 border border-blue-200",
      [ScrapeJobStatus.completed]: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      [ScrapeJobStatus.failed]: "bg-red-50 text-red-700 border border-red-200",
      [ScrapeJobStatus.canceled]: "bg-zinc-100 text-zinc-700 border border-zinc-200",
    };

    const baseColor = paused ? "bg-amber-50 text-amber-700 border border-amber-200" : colors[status];

    return (
      <span
        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
          baseColor ?? "bg-zinc-100 text-zinc-700 border border-zinc-200"
        }`}
      >
        {label}
      </span>
    );
  };

  if (!roles) {
    return (
      <AppPageShell>
        <div className="p-6 text-sm text-muted-foreground">Checking your access…</div>
      </AppPageShell>
    );
  }

  if (!isAdmin) {
    return (
      <AppPageShell>
        <div className="p-6">
          <p className="rounded bg-destructive/10 p-4 text-destructive">
            You are not authorized to manage scrape jobs. Return to {defaultRedirect}.
          </p>
        </div>
      </AppPageShell>
    );
  }

  const unauthorized = authRequired || (error as { status?: number } | null)?.status === 401;

  if (unauthorized) {
    return (
      <AppPageShell>
        <ScrapeJobAuthPrompt
          token={authTokenInput}
          busy={authenticating}
          error={authError || "Authentication required"}
          onTokenChange={setAuthTokenInput}
          onSubmit={authenticate}
          description="Authenticate to view and manage scrape jobs."
        />
      </AppPageShell>
    );
  }

  return (
    <AppPageShell>
      <div className="w-full flex flex-col gap-5">
        <div className="flex flex-col gap-1 max-w-3xl border-b border-border pb-3">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Scrape jobs</div>
          <div className="text-2xl font-bold">Scrape job control panel</div>
          <p className="text-sm text-muted-foreground">
            Mirror the vector store setup flow: pick a crawler preset, send it now or schedule it, then ship logs to
            vector stores for embeddings in one click.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {SCRIPT_PRESETS.map((preset) => (
            <button
              key={preset.key}
              title={preset.hint}
              onClick={() => handlePresetChange(preset.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                selectedPreset === preset.key
                  ? "bg-[#2B83F6] text-white border-[#2B83F6]"
                  : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <Copy size={14} />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <PlayCircle size={18} className="text-[#2B83F6]" />
              Scrape now
            </div>
            <label className="flex flex-col gap-1 text-sm text-zinc-600">
              Target URL or domain
              <div className="flex gap-2">
                <input
                  value={targetUrl}
                  onChange={(e) => {
                    setTargetUrl(e.target.value);
                    if (createTargetError) setCreateTargetError(null);
                    if (createArgError) setCreateArgError(null);
                  }}
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#2B83F6]"
                  placeholder="https://example.com/sitemap.xml"
                />
                <button
                  type="button"
                  onClick={() =>
                    copyText(targetUrl, () => {
                      setCopiedTarget(true);
                      setTimeout(() => setCopiedTarget(false), 1200);
                    })
                  }
                  className="shrink-0 px-3 py-2 border border-zinc-200 rounded-lg text-xs text-zinc-700 hover:border-[#2B83F6]"
                  aria-label="Copy target URL"
                >
                  {copiedTarget ? "Copied" : "Copy"}
                </button>
              </div>
            </label>
            {activeSchema ? (
              <div className="text-[11px] text-zinc-600 flex flex-col gap-1">
                <div>{activeSchema.target.description}</div>
                {activeSchema.target.example ? (
                  <div className="text-[11px] text-zinc-500">
                    Example: {activeSchema.target.example}
                  </div>
                ) : null}
                {activeSchema.requiredArgs?.length ? (
                  <div className="text-[11px] text-amber-700">
                    Requires: {activeSchema.requiredArgs.map((req) => req.description).join("; ")}
                  </div>
                ) : null}
              </div>
            ) : null}
            {activeSchema?.requiredArgs?.map((req) => (
              <label key={req.key} className="flex flex-col gap-1 text-sm text-zinc-600">
                {req.description}
                <input
                  value={requiredArgDrafts[req.key] ?? ""}
                  onChange={(event) => {
                    setRequiredArgDrafts((current) => ({
                      ...current,
                      [req.key]: event.target.value,
                    }));
                    setCreateArgError(null);
                  }}
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#2B83F6]"
                  placeholder={req.description}
                />
              </label>
            ))}
            {createTargetError ? (
              <div className="text-[11px] text-red-600">{createTargetError}</div>
            ) : null}
            {createArgError ? <div className="text-[11px] text-red-600">{createArgError}</div> : null}
            <button
              onClick={enqueueManual}
              disabled={creating !== null}
              className="flex items-center justify-center gap-2 bg-[#2B83F6] text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-[#2B83F6]/90 disabled:opacity-60"
            >
              {creating === ScrapeJobCadence.manual ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <PlayCircle size={16} />
              )}
              Run immediately
            </button>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <CalendarRange size={18} className="text-[#2B83F6]" />
              Schedule daily/weekly/monthly
            </div>
            <p className="text-sm text-zinc-600">
              Keep high-value sources fresh by enrolling them in the scheduler. We will enqueue runs at the start of the next
              interval.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={scheduleDaily}
                disabled={creating !== null}
                className="flex items-center justify-center gap-2 border border-zinc-200 rounded-lg py-2 text-sm font-medium hover:border-[#2B83F6] disabled:opacity-60"
              >
                {creating === ScrapeJobCadence.daily ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <CalendarClock size={16} />
                )}
                Daily
              </button>
              <button
                onClick={scheduleWeekly}
                disabled={creating !== null}
                className="flex items-center justify-center gap-2 border border-zinc-200 rounded-lg py-2 text-sm font-medium hover:border-[#2B83F6] disabled:opacity-60"
              >
                {creating === ScrapeJobCadence.weekly ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <CalendarClock size={16} />
                )}
                Weekly
              </button>
              <button
                onClick={scheduleMonthly}
                disabled={creating !== null}
                className="flex items-center justify-center gap-2 border border-zinc-200 rounded-lg py-2 text-sm font-medium hover:border-[#2B83F6] disabled:opacity-60"
              >
                {creating === ScrapeJobCadence.monthly ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <CalendarClock size={16} />
                )}
                Monthly
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm">
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-zinc-200">
              <div className="flex flex-col gap-1">
                <div className="text-lg font-semibold">Past jobs</div>
              </div>
              {isLoading && <Loader2 size={18} className="animate-spin text-zinc-400" />}
            </div>
            <div className="grid w-full gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-700 sm:grid-cols-2 md:grid-cols-4">
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-zinc-500">Status</span>
                <select
                  className="rounded-lg border border-zinc-200 px-2 py-1 min-w-[150px] bg-white"
                  value={historyFilters.status}
                  onChange={(event) =>
                    setHistoryFilters((prev) => ({ ...prev, status: event.target.value as ScrapeJobStatus | "" }))
                  }
                >
                  <option value="">All statuses</option>
                  {Object.values(ScrapeJobStatus).map((value) => (
                    <option key={value} value={value} className="capitalize">
                      {value}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-zinc-500">Created after</span>
                <input
                  type="datetime-local"
                  className="rounded-lg border border-zinc-200 px-2 py-1 bg-white"
                  value={historyFilters.from}
                  onChange={(event) => setHistoryFilters((prev) => ({ ...prev, from: event.target.value }))}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-zinc-500">Created before</span>
                <input
                  type="datetime-local"
                  className="rounded-lg border border-zinc-200 px-2 py-1 bg-white"
                  value={historyFilters.to}
                  onChange={(event) => setHistoryFilters((prev) => ({ ...prev, to: event.target.value }))}
                />
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="w-full rounded-lg border border-[#2B83F6] bg-white px-3 py-1.5 font-medium text-[#2B83F6] hover:bg-[#f1f5ff]"
                  onClick={applyHistoryFilters}
                  disabled={isLoading}
                >
                  Apply filters
                </button>
                <button
                  type="button"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-1.5 font-medium text-zinc-600 hover:border-zinc-300"
                  onClick={clearHistoryFilters}
                  disabled={isLoading}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
          {error && (
            <div className="flex items-center justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              <span>
                Failed to load jobs. {error.message}
              </span>
              <button
                type="button"
                className="rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                onClick={() => void mutate()}
              >
                Retry
              </button>
            </div>
          )}
          {jobs.length === 0 && !isLoading && !error && (
            <div className="text-sm text-zinc-500">No jobs available yet.</div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-500">
                  <th className="py-2 pr-3">Script</th>
                  <th className="py-2 pr-3">Target</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Cadence &amp; schedule</th>
                  <th className="py-2 pr-3">Timing</th>
                  <th className="py-2 pr-3">Docs</th>
                  <th className="py-2 pr-3">Log snippet</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {jobs.map((item: SerializedJob) => {
                  const logSnippet = (item.log || "").split("\n").find(Boolean) || "No log yet.";
                  const progress = deriveProgress(item.job);
                  const actionState = rowActions[item.job.id];
                  const schema = SCRIPT_SCHEMA_MAP.get(item.job.script);
                  return (
                    <tr key={item.job.id} className="align-top">
                      <td className="py-3 pr-3">
                        <div className="font-medium text-zinc-800">
                          <Link href={`/scrape_jobs/${item.job.id}`} className="hover:underline text-[#2B83F6]">
                            {item.job.script}
                          </Link>
                        </div>
                        <div className="text-xs text-zinc-500">{formatDate(item.job.createdAt)}</div>
                      </td>
                      <td className="py-3 pr-3 w-60 align-top">
                        <div className="text-xs text-zinc-700 break-all max-w-xs">{getJobTarget(item.job) || "—"}</div>
                        <div className="text-[11px] text-zinc-500 flex flex-col gap-0.5 pt-1">
                          <span>{schema?.target.description ?? "Applies to the next run"}</span>
                          {schema?.target.example ? (
                            <span className="text-[11px] text-zinc-500">Example: {schema.target.example}</span>
                          ) : null}
                          {schema?.requiredArgs?.length ? (
                            <span className="text-[11px] text-amber-700">
                              Requires: {schema.requiredArgs.map((req) => req.description).join("; ")}
                            </span>
                          ) : null}
                          <Link
                            href={`/scrape_jobs/${item.job.id}`}
                            className="text-[11px] text-[#2B83F6] hover:underline"
                          >
                            Edit target in job details
                          </Link>
                        </div>
                      </td>
                      <td className="py-3 pr-3">{renderStatusPill(item.job.status, item.job.paused)}</td>
                      <td className="py-3 pr-3 w-64 align-top">
                        <div className="flex flex-col gap-2 text-xs text-zinc-700">
                          <div className="flex items-center gap-2">
                            <select
                              className="w-28 rounded-lg border border-zinc-200 px-2 py-1 capitalize"
                              value={getScheduleDraft(item.job).cadence}
                              onChange={(event) =>
                                updateScheduleDraft(item.job, {
                                  cadence: event.target.value as ScrapeJobCadence,
                                })
                              }
                              disabled={Boolean(actionState)}
                            >
                              {Object.values(ScrapeJobCadence).map((cadence) => (
                                <option key={cadence} value={cadence} className="capitalize">
                                  {cadence}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              className="rounded-lg border border-zinc-200 px-2 py-1 text-[11px] font-medium hover:border-[#2B83F6] disabled:opacity-60"
                              onClick={() => void saveSchedule(item)}
                              disabled={Boolean(actionState)}
                            >
                              {actionState === "schedule" ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                "Save"
                              )}
                            </button>
                          </div>
                          <label className="flex flex-col gap-1 text-[11px] text-zinc-600">
                            Next run at
                            <input
                              type="datetime-local"
                              className="rounded-lg border border-zinc-200 px-2 py-1"
                              value={getScheduleDraft(item.job).nextRunAt}
                              onChange={(event) =>
                                updateScheduleDraft(item.job, { nextRunAt: event.target.value })
                              }
                              disabled={Boolean(actionState)}
                            />
                          </label>
                          {getScheduleDraft(item.job).cadence === ScrapeJobCadence.manual ? (
                            <label className="flex items-center gap-2 text-[11px] text-zinc-700">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-zinc-300"
                                checked={getScheduleDraft(item.job).autoRunManualWithNext}
                                onChange={(event) =>
                                  updateScheduleDraft(item.job, {
                                    autoRunManualWithNext: event.target.checked,
                                  })
                                }
                                disabled={Boolean(actionState)}
                              />
                              <span>
                                Auto-run manual jobs at next run time
                                <span className="text-zinc-500"> (scheduler default: </span>
                                <span className="font-semibold text-zinc-700">
                                  {AUTO_RUN_MANUAL_WITH_NEXT_DEFAULT ? "enabled" : "disabled"}
                                </span>
                                <span className="text-zinc-500">)</span>
                              </span>
                            </label>
                          ) : null}
                          {getScheduleDraft(item.job).cadence === ScrapeJobCadence.manual &&
                          !AUTO_RUN_MANUAL_WITH_NEXT_DEFAULT ? (
                            <div
                              className="flex items-center gap-1 text-[11px] text-amber-600"
                              title="Deployment setting AUTO_RUN_MANUAL_WITH_NEXT is off; enable the toggle to opt this job into scheduled manual runs."
                            >
                              <Info size={12} />
                              Manual cadences stay paused unless explicitly enabled for this job.
                            </div>
                          ) : null}
                          {scheduleErrors[item.job.id] && (
                            <div className="text-[11px] text-red-600">{scheduleErrors[item.job.id]}</div>
                          )}
                          <div className="text-[11px] text-zinc-500">
                            Upcoming: {formatDate(item.job.nextRunAt)}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-2 text-xs text-zinc-600">
                          <span>{formatDuration(item.stats.durationSeconds)}</span>
                          <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                            <div
                              className={`h-2 ${progressColor(item.job.status, item.job.paused)}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="tabular-nums text-[11px] text-zinc-500">{progress}%</span>
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          Started {formatDate(item.job.startedAt)} · Finished {formatDate(item.job.finishedAt)}
                        </div>
                        <div className="text-[11px] text-zinc-500">Next run: {formatDate(item.job.nextRunAt)}</div>
                      </td>
                      <td className="py-3 pr-3 text-xs text-zinc-700">
                        {item.stats.documentsIngested ?? "—"}
                      </td>
                  <td className="py-3 pr-3 w-64 max-w-xs">
                    <div
                      className={`text-xs rounded-md border px-2 py-1 ${
                        item.job.status === ScrapeJobStatus.failed
                          ? "border-red-200 bg-red-50 text-red-700"
                          : item.job.status === ScrapeJobStatus.canceled
                            ? "border-zinc-200 bg-zinc-50 text-zinc-700"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700"
                      }`}
                      title={item.log || ""}
                    >
                      {logSnippet.length > 140
                        ? `${logSnippet.slice(0, 140)}…`
                        : logSnippet}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-zinc-500 mt-1">
                      <span>Output: {KNOWLEDGE_BASE_PATH}</span>
                      <button
                        type="button"
                        className="text-[#2B83F6] hover:underline"
                        onClick={() =>
                          copyText(KNOWLEDGE_BASE_PATH, () => {
                            setCopiedLog((state) => ({ ...state, [item.job.id]: true }));
                            setTimeout(
                              () => setCopiedLog((state) => ({ ...state, [item.job.id]: false })),
                              1200
                            );
                          })
                        }
                        aria-label="Copy output path"
                      >
                        {copiedLog[item.job.id] ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </td>
                      <td className="py-3">
                        <div className="relative job-actions-menu inline-block text-left">
                          <button
                            type="button"
                            className="flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1 text-xs font-medium hover:border-[#2B83F6] disabled:opacity-60"
                            onClick={(event) => {
                              event.stopPropagation();
                              setOpenMenu((current) =>
                                current === item.job.id ? null : item.job.id
                              );
                            }}
                            disabled={Boolean(actionState)}
                            aria-haspopup="menu"
                            aria-expanded={openMenu === item.job.id}
                          >
                            <MoreVertical size={14} />
                            Actions
                          </button>

                          {openMenu === item.job.id && (
                            <div className="absolute right-0 z-10 mt-2 w-56 rounded-lg border border-zinc-200 bg-white shadow-lg">
                              <div className="py-1 text-xs text-zinc-700">
                                <button
                                  className="flex w-full items-center gap-2 px-3 py-2 hover:bg-zinc-50 disabled:opacity-60"
                                  onClick={() => {
                                    setOpenMenu(null);
                                    void sendToVectorStore(item);
                                  }}
                                  disabled={ingesting[item.job.id] === "working"}
                                >
                                  {ingesting[item.job.id] === "working" ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : (
                                    <Send size={14} />
                                  )}
                                  <span>Send to vector stores</span>
                                </button>
                                <button
                                  className="flex w-full items-center gap-2 px-3 py-2 hover:bg-zinc-50 disabled:opacity-60"
                                  onClick={() => {
                                    setOpenMenu(null);
                                    void togglePauseJob(item);
                                  }}
                                  disabled={Boolean(actionState)}
                                >
                                  {actionState === "pause" || actionState === "resume" ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : item.job.paused ? (
                                    <PlayCircle size={14} />
                                  ) : (
                                    <PauseCircle size={14} />
                                  )}
                                  <span>{item.job.paused ? "Resume" : "Pause"}</span>
                                </button>
                                <button
                                  className="flex w-full items-center gap-2 px-3 py-2 hover:bg-zinc-50 disabled:opacity-60"
                                  onClick={() => {
                                    setOpenMenu(null);
                                    void runJobNow(item.job.id);
                                  }}
                                  disabled={Boolean(actionState)}
                                >
                                  {actionState === "run-now" ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : (
                                    <Zap size={14} />
                                  )}
                                  <span>Run now</span>
                                </button>
                                <button
                                  className="flex w-full items-center gap-2 px-3 py-2 hover:bg-zinc-50 disabled:opacity-60"
                                  onClick={() => {
                                    setOpenMenu(null);
                                    void requeueJob(item.job.id);
                                  }}
                                  disabled={Boolean(actionState)}
                                >
                                  {actionState === "requeue" ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : (
                                    <RotateCcw size={14} />
                                  )}
                                  <span>Requeue</span>
                                </button>
                                <button
                                  className="flex w-full items-center gap-2 px-3 py-2 text-red-700 hover:bg-red-50 disabled:opacity-60"
                                  onClick={() => {
                                    setOpenMenu(null);
                                    void cancelJob(item.job.id);
                                  }}
                                  disabled={Boolean(actionState)}
                                >
                                  {actionState === "cancel" ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : (
                                    <XCircle size={14} />
                                  )}
                                  <span>Cancel</span>
                                </button>
                                <button
                                  className="flex w-full items-center gap-2 px-3 py-2 text-red-700 hover:bg-red-50 disabled:opacity-60"
                                  onClick={() => {
                                    setOpenMenu(null);
                                    void deleteJob(item.job.id);
                                  }}
                                  disabled={Boolean(actionState)}
                                >
                                  {actionState === "delete" ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : (
                                    <Trash2 size={14} />
                                  )}
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        {runMessages[item.job.id] && (
                          <div className="text-[11px] text-blue-600 mt-1">
                            {runMessages[item.job.id]}
                          </div>
                        )}
                                        {ingesting[item.job.id] === "done" && (
                          <div className="text-[11px] text-emerald-600 mt-1">
                            {runMessages[item.job.id] || "Ingestion triggered."}
                          </div>
                        )}
                        {ingesting[item.job.id] === "error" && (
                          <div className="text-[11px] text-red-600 mt-1">Failed to send; retry?</div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-zinc-600">
            <button
              type="button"
              className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-[#2B83F6] hover:bg-zinc-50 disabled:opacity-60"
              disabled={!nextCursor || isLoading}
              onClick={() => setPageCount((count: number) => count + 1)}
            >
              {nextCursor ? "Load more" : "All history loaded"}
            </button>
            <div className="text-[11px] text-zinc-500">{jobs.length} job(s) loaded</div>
          </div>
        </div>
      </div>
    </AppPageShell>
  );
}
