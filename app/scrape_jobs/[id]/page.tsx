"use client";

import Link from "next/link";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Copy,
  Loader2,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  Send,
  Info,
  ChevronDown,
  ExternalLink,
  Trash2,
  XCircle,
  Zap,
} from "lucide-react";
import useSWR from "swr";

import { ScrapeJobAuthPrompt } from "@/components/ScrapeJobAuthPrompt";
import { ScrapeJobCadence, ScrapeJobStatus } from "@/lib/generated/prisma";
import type { StoredIngestionResult } from "@/lib/ingestionResults";
import { SCRIPT_SCHEMA_MAP, validateTargetForSchema } from "@/config/scrapeScripts";

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: "same-origin" });

  if (res.status === 401) {
    const error = new Error("Unauthorized");
    (error as Error & { status?: number }).status = 401;
    throw error;
  }

  if (!res.ok) {
    const error = new Error("Failed to load scrape job");
    (error as Error & { status?: number; info?: unknown }).status = res.status;
    (error as Error & { status?: number; info?: unknown }).info = await res
      .text()
      .catch(() => null);
    throw error;
  }

  return res.json();
};

const KNOWLEDGE_BASE_PATH = "public/knowledge_base";
const AUTO_RUN_MANUAL_WITH_NEXT_DEFAULT =
  process.env.NEXT_PUBLIC_AUTO_RUN_MANUAL_WITH_NEXT === "true";

type JobStats = {
  status: ScrapeJobStatus;
  durationSeconds: number | null;
  documentsIngested: number | null;
  progress: number | null;
};

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

type SerializedJob = {
  job: ScrapeJob;
  log: string | null;
  stats: JobStats;
  artifacts: string[];
  ingestionResult?: (StoredIngestionResult & { jobId: string }) | null;
};

type LogRun = {
  id: string;
  path: string;
  startedAt: string;
  size: number;
  content: string | null;
  contentStart?: number;
  contentEnd?: number;
  hasMoreBefore?: boolean;
  hasMoreAfter?: boolean;
  fullyLoaded?: boolean;
};

type LogResponse = { logs: LogRun[]; nextCursor: string | null; exhaustive: boolean };
const LOG_CONTENT_CHUNK = 40000;

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
  if (Number.isNaN(parsed.getTime()))
    return { iso: null, date: null, error: "Enter a valid date/time" } as const;
  return { iso: parsed.toISOString(), date: parsed, error: undefined } as const;
}

function formatDuration(seconds: number | null) {
  if (seconds === null) return "—";
  if (seconds < 90) return `${seconds.toFixed(0)}s`;
  const minutes = seconds / 60;
  return `${minutes.toFixed(1)}m`;
}

function formatTimestamp(value: number | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
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

export default function ScrapeJobDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string | null>(null);
  const [copiedTarget, setCopiedTarget] = useState(false);
  const [copiedLog, setCopiedLog] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isDocumentVisible, setIsDocumentVisible] = useState(
    typeof document === "undefined" ? true : document.visibilityState === "visible"
  );
  const [showResume, setShowResume] = useState(false);
  const [ingesting, setIngesting] = useState<string | null>(null);
  const [actionState, setActionState] = useState<string | null>(null);
  const [runFeedback, setRunFeedback] = useState<string | null>(null);
  const [openActivity, setOpenActivity] = useState(false);
  const [copiedVectorIds, setCopiedVectorIds] = useState<Record<string, boolean>>({});
  const [scheduleDraft, setScheduleDraft] = useState<
    {
      cadence: ScrapeJobCadence;
      nextRunAt: string;
      autoRunManualWithNext: boolean;
    } | null
  >(null);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [targetDraft, setTargetDraft] = useState("");
  const [requiredArgDrafts, setRequiredArgDrafts] = useState<Record<string, string>>({});
  const [targetError, setTargetError] = useState<string | null>(null);
  const [argErrors, setArgErrors] = useState<Record<string, string>>({});
  const [savingTarget, setSavingTarget] = useState(false);
  const [targetMessage, setTargetMessage] = useState<string | null>(null);
  const [authTokenInput, setAuthTokenInput] = useState("");
  const [authenticating, setAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [logFilterDraft, setLogFilterDraft] = useState<{ start: string; end: string; anchor: string }>({
    start: "",
    end: "",
    anchor: "",
  });
  const [appliedLogFilter, setAppliedLogFilter] = useState<{ start: string; end: string; anchor: string }>({
    start: "",
    end: "",
    anchor: "",
  });
  const [logViewMode, setLogViewMode] = useState<"single" | "all">("single");
  const [logsExhaustive, setLogsExhaustive] = useState(true);
  const [latestLogCursor, setLatestLogCursor] = useState<string | null>(null);
  const [manualLogCursor, setManualLogCursor] = useState<string | null>(null);
  const [logCache, setLogCache] = useState<LogRun[]>([]);
  const [loadingOlderLogs, setLoadingOlderLogs] = useState(false);
  const [logChunkRanges, setLogChunkRanges] = useState<Record<string, { offset: number | null; direction?: "before" | "after" | null }>>(
    {}
  );
  const logContainerRef = useRef<HTMLDivElement | null>(null);
  const logContentRef = useRef<HTMLPreElement | null>(null);
  const userInteractedRef = useRef(false);

  const copy = async (value: string, onCopied?: (flag: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(value);
      onCopied?.(true);
      setTimeout(() => onCopied?.(false), 1200);
    } catch {
      onCopied?.(false);
    }
  };

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
      headers: { "Content-Type": "application/json" },
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

  const loadOlderLogs = async () => {
    if (!id || !effectiveLogCursor) return;
    setLoadingOlderLogs(true);
    try {
      const contentRangesParam =
        Object.keys(logChunkRanges).length > 0
          ? `&contentRanges=${encodeURIComponent(JSON.stringify(logChunkRanges))}`
          : "";
      const payload = (await fetcher(
        `/api/scrape_jobs/${id}/logs?all=true&cursor=${effectiveLogCursor}&contentLimit=${LOG_CONTENT_CHUNK}${contentRangesParam}`
      )) as LogResponse;

      setManualLogCursor(payload.nextCursor ?? null);
      setLogsExhaustive(Boolean(payload.exhaustive));
      setLogCache((previous) => {
        const merged = new Map(previous.map((log) => [log.id, log] as const));
        for (const log of payload.logs) {
          merged.set(log.id, log);
        }
        return Array.from(merged.values()).sort(
          (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
        );
      });
    } catch (error) {
      console.error("Failed to load older logs", error);
    } finally {
      setLoadingOlderLogs(false);
    }
  };

  const clearSelectedLog = async () => {
    if (!id || !selectedLog) return;
    const res = await fetch(`/api/scrape_jobs/${id}/logs`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logId: selectedLog.id }),
    });

    if (handleAuthFailure(res)) return;
    if (res.ok) {
      await mutateLogs();
      setLogCache((previous) => previous.filter((log) => log.id !== selectedLog.id));
    }
  };

  const applyLogFilters = () => {
    setAppliedLogFilter(logFilterDraft);
    setSelectedLogId(null);
    setLogChunkRanges({});
  };

  const clearLogFilters = () => {
    const cleared = { start: "", end: "", anchor: "" };
    setLogFilterDraft(cleared);
    setAppliedLogFilter(cleared);
    setSelectedLogId(null);
    setLogChunkRanges({});
  };

  const shiftLogContent = (direction: "earlier" | "later") => {
    const target = selectedLog ?? filteredLogs[0];
    if (!target) return;

    const currentStart = typeof target.contentStart === "number" ? target.contentStart : 0;
    if (direction === "earlier" && target.hasMoreBefore) {
      const nextStart = Math.max(0, currentStart - LOG_CONTENT_CHUNK);
      setLogChunkRanges((prev) => ({ ...prev, [target.id]: { offset: nextStart, direction: "before" } }));
      return;
    }

    if (direction === "later" && target.hasMoreAfter) {
      const nextStart = Math.max(
        0,
        Math.min(target.size - LOG_CONTENT_CHUNK, target.contentEnd ?? currentStart + LOG_CONTENT_CHUNK)
      );
      setLogChunkRanges((prev) => ({ ...prev, [target.id]: { offset: nextStart, direction: "after" } }));
    }
  };

  const resetSelectedLogRange = () => {
    const target = selectedLog ?? filteredLogs[0];
    if (!target) return;
    setLogChunkRanges((prev) => {
      if (!(target.id in prev)) return prev;
      const next = { ...prev };
      delete next[target.id];
      return next;
    });
  };

  useEffect(() => {
    let active = true;
    void params
      .then((resolved) => {
        if (active) setId(resolved.id);
      })
      .catch(() => {
        if (active) setId(null);
      });
    return () => {
      active = false;
    };
  }, [params]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsDocumentVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const { data, error, isLoading, mutate } = useSWR<SerializedJob>(
    id ? `/api/scrape_jobs/${id}` : null,
    fetcher,
    { refreshInterval: 15000 }
  );

  useEffect(() => {
    setLogCache([]);
    setLatestLogCursor(null);
    setManualLogCursor(null);
    setLogsExhaustive(true);
    setSelectedLogId(null);
    setLogChunkRanges({});
  }, [id]);

  const logQueryKey = useMemo(() => {
    if (!id) return null;
    const chunkLimitParam = `&contentLimit=${LOG_CONTENT_CHUNK}`;
    const contentRangesParam =
      Object.keys(logChunkRanges).length > 0
        ? `&contentRanges=${encodeURIComponent(JSON.stringify(logChunkRanges))}`
        : "";
    return `/api/scrape_jobs/${id}/logs?all=true${chunkLimitParam}${contentRangesParam}`;
  }, [id, logChunkRanges]);

  const {
    data: logResponse,
    isLoading: logsLoading,
    error: logError,
    mutate: mutateLogs,
  } = useSWR<LogResponse>(
    logQueryKey,
    fetcher,
    {
      refreshWhenHidden: false,
      isPaused: () => !isDocumentVisible,
      revalidateOnFocus: true,
    }
  );

  useEffect(() => {
    if (!logResponse) return;
    setLatestLogCursor(logResponse.nextCursor ?? null);
    setLogsExhaustive(Boolean(logResponse.exhaustive));

    setLogCache((previous) => {
      const merged = new Map(previous.map((log) => [log.id, log] as const));
      for (const log of logResponse.logs) {
        merged.set(log.id, log);
      }
      return Array.from(merged.values()).sort(
        (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      );
    });
  }, [logResponse]);

  const effectiveLogCursor = useMemo(
    () => manualLogCursor ?? latestLogCursor,
    [latestLogCursor, manualLogCursor]
  );

  useEffect(() => {
    if (!data?.job) return;
    setScheduleDraft({
      cadence: data.job.cadence,
      nextRunAt: toLocalDateTimeInput(data.job.nextRunAt),
      autoRunManualWithNext:
        data.job.cadence === ScrapeJobCadence.manual
          ? data.job.autoRunManualWithNext
          : false,
    });
    setScheduleError(null);
  }, [data?.job]);

  const targetValue = useMemo(() => {
    const args = data?.job.args as Record<string, unknown> | undefined;
    if (!args) return "";
    const value = (args.url as string | undefined) ?? (args.targetUrl as string | undefined);
    return typeof value === "string" ? value : "";
  }, [data?.job.args]);

  const scriptSchema = useMemo(
    () => (data?.job.script ? SCRIPT_SCHEMA_MAP.get(data.job.script) : undefined),
    [data?.job.script]
  );

  const scriptSpecificArgs = useMemo(() => {
    if (!scriptSchema || !data?.job.args) return [] as { key: string; label: string; value: string }[];
    const args = data.job.args as Record<string, unknown>;
    return (scriptSchema.requiredArgs ?? [])
      .map((req) => {
        const value = args[req.key];
        if (value === undefined || value === null) return null;
        const stringValue = Array.isArray(value) ? value.join(", ") : String(value);
        return { key: req.key, label: req.description, value: stringValue };
      })
      .filter(Boolean) as { key: string; label: string; value: string }[];
  }, [data?.job.args, scriptSchema]);

  const canEditTarget = useMemo(() => {
    if (!data?.job) return false;
    return (
      data.job.status !== ScrapeJobStatus.running &&
      (data.job.status === ScrapeJobStatus.queued || data.job.cadence !== ScrapeJobCadence.manual)
    );
  }, [data?.job]);

  useEffect(() => {
    if (!data?.job) return;

    setTargetDraft(targetValue);
    const nextRequiredDrafts: Record<string, string> = {};
    (scriptSchema?.requiredArgs ?? []).forEach((req) => {
      const value = (data.job.args as Record<string, unknown> | null | undefined)?.[req.key];
      if (Array.isArray(value)) {
        nextRequiredDrafts[req.key] = value.join(", ");
      } else if (value !== undefined && value !== null) {
        nextRequiredDrafts[req.key] = String(value);
      } else {
        nextRequiredDrafts[req.key] = "";
      }
    });

    setRequiredArgDrafts(nextRequiredDrafts);
    setTargetError(null);
    setArgErrors({});
    setTargetMessage(null);
  }, [data?.job, scriptSchema, targetValue]);

  const filteredLogs = useMemo(() => {
    const startDate = appliedLogFilter.start ? new Date(appliedLogFilter.start) : null;
    const endDate = appliedLogFilter.end ? new Date(appliedLogFilter.end) : null;
    const anchorDate = appliedLogFilter.anchor ? new Date(appliedLogFilter.anchor) : null;

    const startTime = startDate && !Number.isNaN(startDate.getTime()) ? startDate.getTime() : null;
    const endTime = endDate && !Number.isNaN(endDate.getTime()) ? endDate.getTime() : null;
    const anchorTime = anchorDate && !Number.isNaN(anchorDate.getTime()) ? anchorDate.getTime() : null;

    if (!startTime && !endTime && !anchorTime) return logCache;

    return logCache.filter((log: LogRun) => {
      const startedAt = new Date(log.startedAt).getTime();
      if (Number.isNaN(startedAt)) return false;

      if (startTime && startedAt < startTime) return false;
      if (endTime && startedAt > endTime) return false;
      if (anchorTime && startedAt > anchorTime) return false;
      return true;
    });
  }, [appliedLogFilter.anchor, appliedLogFilter.end, appliedLogFilter.start, logCache]);

  useEffect(() => {
    if (!filteredLogs.length) {
      setSelectedLogId(null);
      return;
    }

    if (!selectedLogId || !filteredLogs.some((log: LogRun) => log.id === selectedLogId)) {
      setSelectedLogId(filteredLogs[0].id);
    }
  }, [filteredLogs, selectedLogId]);

  useEffect(() => {
    if (!selectedLogId) return;
    setLogChunkRanges((prev) => {
      if (!(selectedLogId in prev)) return prev;
      const next = { ...prev };
      delete next[selectedLogId];
      return next;
    });
  }, [selectedLogId]);

  const selectedLog = useMemo(
    () => filteredLogs.find((log: LogRun) => log.id === selectedLogId) ?? filteredLogs[0] ?? null,
    [filteredLogs, selectedLogId]
  );
  const logContent = useMemo(() => {
    if (logViewMode === "all") {
      if (!filteredLogs.length) return null;
      return filteredLogs
        .map((log: LogRun) => {
          const timestamp = new Date(log.startedAt).toLocaleString();
          return `[${timestamp}]\n${log.content ?? ""}`;
        })
        .join("\n\n———\n\n");
    }

    return selectedLog?.content ?? null;
  }, [filteredLogs, logViewMode, selectedLog]);

  const logsLoadingState = logsLoading || loadingOlderLogs;

  const logSnippet = useMemo(() => {
    const firstLine = (logContent || "").split("\n").find(Boolean) || "No log yet.";
    return firstLine.length > 160 ? `${firstLine.slice(0, 160)}…` : firstLine;
  }, [logContent]);

  useEffect(() => {
    if (!id) return undefined;
    const source = new EventSource("/api/scrape_jobs/updates");
    source.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload?.jobId === id) {
          void Promise.all([mutate(), mutateLogs()]);
        }
      } catch {
        // ignore parse errors
      }
    };
    source.onerror = () => {
      setTimeout(() => void Promise.all([mutate(), mutateLogs()]), 1000);
    };

    return () => source.close();
  }, [id, mutate, mutateLogs]);

  useEffect(() => {
    const container = logContainerRef.current;
    if (!container) return undefined;

    const markUserInteracted = () => {
      if (!autoScrollEnabled) return;
      userInteractedRef.current = true;
      setAutoScroll(false);
      setShowResume(true);
    };

    container.addEventListener("wheel", markUserInteracted, { passive: true });
    container.addEventListener("touchstart", markUserInteracted, {
      passive: true,
    });
    container.addEventListener("pointerdown", markUserInteracted);
    container.addEventListener("keydown", markUserInteracted);

    return () => {
      container.removeEventListener("wheel", markUserInteracted);
      container.removeEventListener("touchstart", markUserInteracted);
      container.removeEventListener("pointerdown", markUserInteracted);
      container.removeEventListener("keydown", markUserInteracted);
    };
  }, [autoScrollEnabled]);

  useEffect(() => {
    const container = logContainerRef.current;
    const bottomTolerance = 16;

    if (!container) return;

    const handleScroll = () => {
      if (!container || !autoScrollEnabled) return;
      const atBottom =
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - bottomTolerance;

      if (!autoScroll && atBottom) {
        userInteractedRef.current = false;
        setShowResume(false);
        setAutoScroll(true);
        return;
      }

      if (userInteractedRef.current) {
        setAutoScroll(false);
        setShowResume(true);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => container.removeEventListener("scroll", handleScroll);
  }, [autoScroll, autoScrollEnabled]);

  useLayoutEffect(() => {
    if (!autoScrollEnabled || !autoScroll || userInteractedRef.current) return;
    const container = logContainerRef.current;
    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    });
  }, [logContent, autoScroll, autoScrollEnabled]);

  useEffect(() => {
    if (!autoScrollEnabled || !autoScroll) return;
    const content = logContentRef.current;
    const container = logContainerRef.current;
    if (!content || !container) return;

    const resizeObserver = new ResizeObserver(() => {
      if (!autoScrollEnabled || !autoScroll || userInteractedRef.current) return;
      requestAnimationFrame(() => {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      });
    });

    resizeObserver.observe(content);
    return () => resizeObserver.disconnect();
  }, [autoScrollEnabled, autoScroll]);

  useEffect(() => {
    const container = logContainerRef.current;
    if (!autoScrollEnabled || !container) return;
    const bottomTolerance = 16;
    const atBottom =
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - bottomTolerance;

    if (atBottom) {
      userInteractedRef.current = false;
      setShowResume(false);
      setAutoScroll(true);
    } else {
      userInteractedRef.current = true;
      setAutoScroll(false);
      setShowResume(true);
    }
  }, [autoScrollEnabled]);

  const activeSchedule = scheduleDraft ?? {
    cadence: data?.job.cadence ?? ScrapeJobCadence.manual,
    nextRunAt: toLocalDateTimeInput(data?.job?.nextRunAt ?? null),
    autoRunManualWithNext:
      (data?.job.cadence ?? ScrapeJobCadence.manual) === ScrapeJobCadence.manual
        ? data?.job.autoRunManualWithNext ?? AUTO_RUN_MANUAL_WITH_NEXT_DEFAULT
        : false,
  };

  const validateScheduleDraft = () => {
    const parsed = parseLocalDateTimeInput(activeSchedule.nextRunAt);

    if (parsed.error) {
      return { iso: null as string | null, error: parsed.error };
    }

    if (activeSchedule.cadence === ScrapeJobCadence.manual && activeSchedule.autoRunManualWithNext) {
      if (!parsed.date) {
        return { iso: null as string | null, error: "Set a next run time to auto-run manual jobs." };
      }
      if (parsed.date.getTime() <= Date.now()) {
        return {
          iso: parsed.iso,
          error: "Next run time must be in the future for scheduled cadences.",
        } as const;
      }
    } else if (parsed.date && activeSchedule.cadence !== ScrapeJobCadence.manual && parsed.date.getTime() <= Date.now()) {
      return {
        iso: parsed.iso,
        error: "Next run time must be in the future for scheduled cadences.",
      } as const;
    }

    return { iso: parsed.iso, error: null } as const;
  };

  const resetScheduleDraft = () => {
    if (!data?.job) return;
    setScheduleDraft({
      cadence: data.job.cadence,
      nextRunAt: toLocalDateTimeInput(data.job.nextRunAt),
      autoRunManualWithNext:
        data.job.cadence === ScrapeJobCadence.manual
          ? data.job.autoRunManualWithNext
          : false,
    });
    setScheduleError(null);
  };

  const resetTargetForm = () => {
    if (!data?.job) return;

    setTargetDraft(targetValue);
    const nextArgs: Record<string, string> = {};
    (scriptSchema?.requiredArgs ?? []).forEach((req) => {
      const value = (data.job.args as Record<string, unknown> | null | undefined)?.[req.key];
      if (Array.isArray(value)) {
        nextArgs[req.key] = value.join(", ");
      } else if (value !== undefined && value !== null) {
        nextArgs[req.key] = String(value);
      } else {
        nextArgs[req.key] = "";
      }
    });
    setRequiredArgDrafts(nextArgs);
    setTargetError(null);
    setArgErrors({});
    setTargetMessage(null);
  };

  const saveTargetUpdates = async () => {
    if (!data?.job) return;
    const schema = scriptSchema;
    const trimmedTarget = targetDraft.trim();
    setTargetMessage(null);
    setTargetError(null);

    if (!trimmedTarget) {
      setTargetError("Enter a target URL");
      return;
    }

    if (schema) {
      const targetValidation = validateTargetForSchema(schema, trimmedTarget);
      if (targetValidation) {
        setTargetError(targetValidation);
        return;
      }
    }

    const nextArgErrors: Record<string, string> = {};
    const nextArgs: Record<string, unknown> = {};

    (schema?.requiredArgs ?? []).forEach((req) => {
      const rawValue = (requiredArgDrafts[req.key] ?? "").trim();
      let parsedValue: unknown = rawValue;

      if (req.key === "categories") {
        parsedValue = rawValue
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean);
      }

      const error = req.validate(parsedValue);
      if (error) {
        nextArgErrors[req.key] = error;
      } else if (rawValue || Array.isArray(parsedValue)) {
        nextArgs[req.key] = parsedValue;
      }
    });

    setArgErrors(nextArgErrors);
    if (Object.keys(nextArgErrors).length) return;

    const payloadArgs: Record<string, unknown> = {
      ...(data.job.args ?? {}),
      ...nextArgs,
      url: trimmedTarget,
      targetUrl: trimmedTarget,
    };

    setSavingTarget(true);
    try {
      const res = await fetch(`/api/scrape_jobs/${data.job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ args: payloadArgs }),
      });

      if (handleAuthFailure(res)) return;

      const payload = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setTargetError(payload?.error ?? "Failed to update target");
        return;
      }

      setTargetError(null);
      setArgErrors({});
      setTargetMessage("Saved target and parameters for the next run.");
      await mutate();
    } catch (error) {
      console.error("Error updating target", error);
      setTargetError("Unable to update target or parameters");
    } finally {
      setSavingTarget(false);
    }
  };

  const saveSchedule = async () => {
    if (!data?.job) return;
    setSavingSchedule(true);
    const validation = validateScheduleDraft();

    if (validation.error) {
      setScheduleError(validation.error);
      setSavingSchedule(false);
      return;
    }

    try {
      const res = await fetch(`/api/scrape_jobs/${data.job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cadence: activeSchedule.cadence,
          nextRunAt: validation.iso,
          autoRunManualWithNext:
            activeSchedule.cadence === ScrapeJobCadence.manual
              ? activeSchedule.autoRunManualWithNext
              : false,
        }),
      });

      if (handleAuthFailure(res)) return;

      const payload = (await res.json().catch(() => null)) as { error?: string } | null;

      if (!res.ok) {
        setScheduleError(payload?.error || "Failed to update schedule.");
        return;
      }

      setScheduleError(null);
      setScheduleDraft({
        cadence: activeSchedule.cadence,
        nextRunAt: activeSchedule.nextRunAt,
        autoRunManualWithNext: activeSchedule.autoRunManualWithNext,
      });
      await mutate();
    } finally {
      setSavingSchedule(false);
    }
  };

  const togglePauseJob = async () => {
    if (!data) return;
    const targetPaused = !data.job.paused;
    setActionState(targetPaused ? "pause" : "resume");
    try {
      const res = await fetch(`/api/scrape_jobs/${data.job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paused: targetPaused }),
      });

      if (handleAuthFailure(res)) return;

      if (res.ok) {
        await mutate();
      }
    } finally {
      setActionState(null);
    }
  };

  const requeueJob = async () => {
    if (!data) return;
    setActionState("requeue");
    try {
      const res = await fetch(`/api/scrape_jobs/${data.job.id}/trigger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (handleAuthFailure(res)) return;

      if (res.ok) {
        await mutate();
      }
    } finally {
      setActionState(null);
    }
  };

  const runJobNow = async () => {
    if (!data) return;
    setActionState("run-now");
    setRunFeedback(null);
    try {
      const res = await fetch(`/api/scrape_jobs/${data.job.id}/clone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (handleAuthFailure(res)) return;

      if (res.ok) {
        const payload = (await res.json().catch(() => null)) as
          | { job?: { id?: string } }
          | null;
        setRunFeedback(
          payload?.job?.id
            ? `New run created from this job (ID: ${payload.job.id})`
            : "New run created from this job"
        );
        await mutate();
      } else {
        setRunFeedback("Failed to queue run now.");
      }
    } finally {
      setActionState(null);
    }
  };

  const cancelJob = async () => {
    if (!data) return;
    setActionState("cancel");
    try {
      const res = await fetch(`/api/scrape_jobs/${data.job.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (handleAuthFailure(res)) return;

      const payload = (await res.json().catch(() => null)) as
        | { message?: string; error?: string; cancellation?: { message?: string } }
        | null;
      const feedback =
        payload?.message || payload?.cancellation?.message || payload?.error;

      if (feedback) {
        setRunFeedback(feedback);
      }

      if (res.ok) {
        await mutate();
      }
    } finally {
      setActionState(null);
    }
  };

  const deleteJob = async () => {
    if (!data) return;
    const confirmDelete = window.confirm(
      "Delete this job and its artifacts permanently? This cannot be undone."
    );
    if (!confirmDelete) return;

    setActionState("delete");
    try {
      const res = await fetch(`/api/scrape_jobs/${data.job.id}/hard`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (handleAuthFailure(res)) return;

      if (res.ok) {
        await mutate();
        window.location.href = "/scrape_jobs";
      }
    } finally {
      setActionState(null);
    }
  };

  const sendToVectorStore = async () => {
    if (!data) return;
    setIngesting("working");
    const artifactPaths = data.artifacts || [];

    if (artifactPaths.length === 0) {
      setRunFeedback("No scraped artifacts were found for this run.");
      setIngesting("error");
      return;
    }

    try {
      const res = await fetch("/api/scraper_ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: data.job.id,
          artifactPaths,
          destinationFolder: "knowledge_base",
        }),
      });

      const result = await res.json().catch(() => ({}));

      if (res.ok) {
        setIngesting("done");
        const docs = (result.ingestedDocuments as string[]) || artifactPaths;
        setRunFeedback(
          typeof result.message === "string"
            ? result.message
            : `Ingestion triggered for ${docs.length} document(s).`
        );
        await mutate();
      } else {
        setIngesting("error");
        const error = typeof result?.error === "string" ? result.error : "Failed to start ingestion.";
        setRunFeedback(error);
      }
    } catch (err) {
      console.error("Error sending to vector store", err);
      setIngesting("error");
      setRunFeedback("Unexpected error while sending to vector store.");
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

  if (!id) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-sm text-zinc-600">
        Loading job…
      </div>
    );
  }

  const unauthorized = authRequired || (error as { status?: number } | null)?.status === 401;

  if (unauthorized) {
    return (
      <ScrapeJobAuthPrompt
        token={authTokenInput}
        busy={authenticating}
        error={authError || "Authentication required"}
        onTokenChange={setAuthTokenInput}
        onSubmit={authenticate}
        description="Authenticate to view and manage this scrape job."
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-sm text-zinc-600">
        Loading job…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-sm text-red-600">
        Failed to load job details.
      </div>
    );
  }

  const progressValue = deriveProgress(data.job);

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center pt-10 md:pt-14 px-4 pb-16 md:pb-20">
      <div className="w-full max-w-4xl flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
          <div className="flex flex-col gap-1">
            <div className="text-[11px] uppercase tracking-wide text-zinc-500">Scrape job</div>
            <div className="text-2xl font-semibold text-zinc-900">{data.job.script}</div>
            <div className="text-sm text-zinc-500">Job ID: {data.job.id}</div>
            <div className="text-xs text-zinc-500">Output: {KNOWLEDGE_BASE_PATH}</div>
            <div className="text-[11px] text-zinc-400">{logSnippet}</div>
          </div>
          <Link href="/scrape_jobs" className="text-sm text-[#2B83F6] hover:underline">
            ← Back to jobs
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm flex flex-col gap-2">
            <div className="text-sm text-zinc-500">Status</div>
            <div className="flex items-center gap-2 text-lg font-semibold text-zinc-800">
              {renderStatusPill(data.job.status, data.job.paused)}
            </div>
            <div className="flex flex-col gap-2 text-xs text-zinc-700">
              <div className="flex flex-wrap items-center gap-2">
                <select
                  className="w-32 rounded-lg border border-zinc-200 px-2 py-1 capitalize"
                  value={activeSchedule.cadence}
                  onChange={(event) => {
                    setScheduleError(null);
                    const nextCadence = event.target.value as ScrapeJobCadence;
                    setScheduleDraft({
                      cadence: nextCadence,
                      nextRunAt: activeSchedule.nextRunAt,
                      autoRunManualWithNext:
                        nextCadence === ScrapeJobCadence.manual
                          ? activeSchedule.cadence === ScrapeJobCadence.manual
                            ? activeSchedule.autoRunManualWithNext
                            : data.job.autoRunManualWithNext ?? AUTO_RUN_MANUAL_WITH_NEXT_DEFAULT
                          : false,
                    });
                  }}
                  disabled={Boolean(actionState) || savingSchedule}
                >
                  {Object.values(ScrapeJobCadence).map((cadence) => (
                    <option key={cadence} value={cadence} className="capitalize">
                      {cadence}
                    </option>
                  ))}
                </select>
                <input
                  type="datetime-local"
                  className="rounded-lg border border-zinc-200 px-2 py-1"
                  value={activeSchedule.nextRunAt}
                  onChange={(event) => {
                    setScheduleError(null);
                    setScheduleDraft({
                      cadence: activeSchedule.cadence,
                      nextRunAt: event.target.value,
                      autoRunManualWithNext: activeSchedule.autoRunManualWithNext,
                    });
                  }}
                  disabled={Boolean(actionState) || savingSchedule}
                />
              </div>
              {activeSchedule.cadence === ScrapeJobCadence.manual ? (
                <label className="flex items-center gap-2 text-[12px] text-zinc-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-zinc-300"
                    checked={activeSchedule.autoRunManualWithNext}
                    onChange={(event) => {
                      setScheduleError(null);
                      setScheduleDraft({
                        cadence: activeSchedule.cadence,
                        nextRunAt: activeSchedule.nextRunAt,
                        autoRunManualWithNext: event.target.checked,
                      });
                    }}
                    disabled={Boolean(actionState) || savingSchedule}
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
              {activeSchedule.cadence === ScrapeJobCadence.manual && !AUTO_RUN_MANUAL_WITH_NEXT_DEFAULT ? (
                <div
                  className="flex items-center gap-1 text-[11px] text-amber-600"
                  title="Deployment setting AUTO_RUN_MANUAL_WITH_NEXT is off; enable the toggle to opt this job into scheduled manual runs."
                >
                  <Info size={12} />
                  Manual cadences stay paused unless explicitly enabled for this job.
                </div>
              ) : null}
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-600">
                <button
                  type="button"
                  onClick={saveSchedule}
                  disabled={Boolean(actionState) || savingSchedule}
                  className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 text-[11px] font-medium text-zinc-800 hover:border-[#2B83F6] disabled:opacity-60"
                >
                  {savingSchedule ? <Loader2 size={12} className="animate-spin" /> : null}
                  Save
                </button>
                <button
                  type="button"
                  onClick={resetScheduleDraft}
                  disabled={Boolean(actionState) || savingSchedule}
                  className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 text-[11px] font-medium text-zinc-700 hover:border-zinc-300 disabled:opacity-60"
                >
                  Cancel
                </button>
                <span className="text-[11px] text-zinc-500">Upcoming: {formatDate(data.job.nextRunAt)}</span>
              </div>
              {scheduleError ? (
                <div className="flex items-center gap-1 text-[11px] text-red-600">
                  <XCircle size={12} />
                  {scheduleError}
                </div>
              ) : null}
              <span className="text-[10px] text-zinc-400">Duration: {formatDuration(data.stats.durationSeconds)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className={`h-2 ${progressColor(data.job.status, data.job.paused)}`}
                    style={{ width: `${progressValue}%` }}
                />
              </div>
              <span className="text-[10px] text-zinc-500 tabular-nums">{progressValue}%</span>
            </div>
            <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-zinc-800">Target &amp; required parameters</span>
                  <span className="text-[11px] text-zinc-500">Updates apply to upcoming runs.</span>
                </div>
                {targetValue ? (
                  <button
                    type="button"
                    className="flex items-center gap-1 text-[#2B83F6] hover:underline text-xs"
                    onClick={() => copy(targetValue, setCopiedTarget)}
                  >
                    <Copy size={14} />
                    {copiedTarget ? "Copied" : "Copy target"}
                  </button>
                ) : null}
              </div>

              <label className="flex flex-col gap-1 text-xs text-zinc-700">
                Target URL
                <input
                  value={targetDraft}
                  onChange={(event) => {
                    setTargetDraft(event.target.value);
                    setTargetError(null);
                  }}
                  className="rounded-lg border border-zinc-200 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#2B83F6]"
                  placeholder={scriptSchema?.target.example ?? "https://example.com"}
                  disabled={!canEditTarget || savingTarget || Boolean(actionState)}
                />
              </label>
              {targetError ? (
                <div className="flex items-center gap-1 text-[11px] text-red-600">
                  <XCircle size={12} />
                  {targetError}
                </div>
              ) : null}

              {(scriptSchema?.requiredArgs ?? []).map((req) => (
                <label key={req.key} className="flex flex-col gap-1 text-xs text-zinc-700">
                  {req.description}
                  <input
                    value={requiredArgDrafts[req.key] ?? ""}
                    onChange={(event) => {
                      setRequiredArgDrafts((current) => ({ ...current, [req.key]: event.target.value }));
                      setArgErrors((current) => {
                        const next = { ...current };
                        delete next[req.key];
                        return next;
                      });
                    }}
                    className="rounded-lg border border-zinc-200 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#2B83F6]"
                    placeholder={req.key === "categories" ? "slug-one,slug-two" : undefined}
                    disabled={!canEditTarget || savingTarget || Boolean(actionState)}
                  />
                  {argErrors[req.key] ? (
                    <span className="text-[11px] text-red-600 flex items-center gap-1">
                      <XCircle size={12} />
                      {argErrors[req.key]}
                    </span>
                  ) : null}
                </label>
              ))}

              <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-600">
                <button
                  type="button"
                  onClick={() => void saveTargetUpdates()}
                  disabled={!canEditTarget || savingTarget || Boolean(actionState)}
                  className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 font-medium text-zinc-800 hover:border-[#2B83F6] disabled:opacity-60"
                >
                  {savingTarget ? <Loader2 size={12} className="animate-spin" /> : null}
                  Save
                </button>
                <button
                  type="button"
                  onClick={resetTargetForm}
                  disabled={savingTarget || Boolean(actionState)}
                  className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 font-medium text-zinc-700 hover:border-zinc-300 disabled:opacity-60"
                >
                  Reset
                </button>
                {!canEditTarget ? (
                  <span className="flex items-center gap-1 text-amber-700">
                    <Info size={12} />
                    Targets can be edited for queued or scheduled jobs.
                  </span>
                ) : null}
                {targetMessage ? (
                  <span className="text-emerald-700">{targetMessage}</span>
                ) : null}
              </div>

              {scriptSchema ? (
                <div className="text-[11px] text-zinc-600 flex flex-col gap-0.5">
                  <span>{scriptSchema.target.description}</span>
                  {scriptSchema.target.example ? (
                    <span className="text-[11px] text-zinc-500">Example: {scriptSchema.target.example}</span>
                  ) : null}
                  {scriptSchema.requiredArgs?.length ? (
                    <span className="text-[11px] text-amber-700">
                      Requires: {scriptSchema.requiredArgs.map((req) => req.description).join("; ")}
                    </span>
                  ) : null}
                </div>
              ) : null}

              {scriptSpecificArgs.length ? (
                <div className="flex flex-col gap-0.5 text-[11px] text-zinc-700">
                  {scriptSpecificArgs.map((arg) => (
                    <span key={arg.key} className="break-all">
                      {arg.label}: {arg.value}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="text-xs text-zinc-500">Started: {formatDate(data.job.startedAt)}</div>
            <div className="text-xs text-zinc-500">Finished: {formatDate(data.job.finishedAt)}</div>
            <div className="text-xs text-zinc-500">Log path: {data.job.logPath ?? "—"}</div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm flex flex-col gap-2">
            <div className="text-sm text-zinc-500">Stats</div>
            <div className="text-xs text-zinc-600">Duration: {data.stats.durationSeconds ?? "—"}s</div>
            <div className="text-xs text-zinc-600">Docs ingested: {data.stats.documentsIngested ?? "—"}</div>
            <div className="text-xs text-zinc-600">Last update: {formatDate(data.job.createdAt)}</div>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={sendToVectorStore}
                disabled={ingesting === "working"}
                className="flex items-center gap-2 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs font-medium hover:border-[#2B83F6] disabled:opacity-60"
              >
                {ingesting === "working" ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                Send to vector stores
              </button>
              <button
                onClick={togglePauseJob}
                disabled={Boolean(actionState)}
                className="flex items-center gap-2 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs font-medium hover:border-[#2B83F6] disabled:opacity-60"
              >
                {actionState === "pause" || actionState === "resume" ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : data.job.paused ? (
                  <PlayCircle size={14} />
                ) : (
                  <PauseCircle size={14} />
                )}
                {data.job.paused ? "Resume" : "Pause"}
              </button>
              <button
                onClick={runJobNow}
                disabled={Boolean(actionState)}
                className="flex items-center gap-2 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs font-medium hover:border-[#2B83F6] disabled:opacity-60"
              >
                {actionState === "run-now" ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                Run now
              </button>
              <button
                onClick={requeueJob}
                disabled={Boolean(actionState)}
                className="flex items-center gap-2 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs font-medium hover:border-[#2B83F6] disabled:opacity-60"
              >
                {actionState === "requeue" ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                Requeue
              </button>
              <button
                onClick={cancelJob}
                disabled={Boolean(actionState)}
                className="flex items-center gap-2 border border-red-200 rounded-lg px-3 py-1.5 text-xs font-medium text-red-700 hover:border-red-300 disabled:opacity-60"
              >
                {actionState === "cancel" ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                Cancel
              </button>
              <button
                onClick={deleteJob}
                disabled={Boolean(actionState)}
                className="flex items-center gap-2 border border-red-200 rounded-lg px-3 py-1.5 text-xs font-medium text-red-700 hover:border-red-300 disabled:opacity-60"
              >
                {actionState === "delete" ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Delete
              </button>
            </div>
            {ingesting === "done" && (
              <div className="text-[11px] text-emerald-600">
                {runFeedback || "Ingestion triggered."}
              </div>
            )}
            {ingesting === "error" && (
              <div className="text-[11px] text-red-600">Failed to send; retry?</div>
            )}
          {runFeedback && (
            <div className="text-[11px] text-zinc-600">{runFeedback}</div>
          )}
        </div>
      </div>

      {data.ingestionResult && (
        <div className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm">
          <button
            type="button"
            onClick={() => setOpenActivity((prev) => !prev)}
            className="flex w-full flex-col gap-3 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-left hover:border-zinc-300 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-start gap-2 sm:items-center">
              <ChevronDown
                size={14}
                className={`transition-transform ${openActivity ? "rotate-180" : "rotate-0"}`}
              />
              <div className="flex min-w-0 flex-col leading-tight">
                <span className="text-sm font-semibold text-zinc-800">Ingestion activity</span>
                <span
                  className={`text-[11px] break-words ${
                    data.ingestionResult.status === "success"
                      ? "text-emerald-700"
                      : data.ingestionResult.status === "skipped"
                        ? "text-amber-700"
                        : "text-red-600"
                  }`}
                >
                  {data.ingestionResult.status.toUpperCase()} — {data.ingestionResult.message}
                </span>
              </div>
            </div>
            <div className="min-w-0 text-[10px] text-zinc-500 sm:text-right">
              <div className="break-words">{formatTimestamp(data.ingestionResult.timestamp)}</div>
              <div className="break-words">
                {(data.ingestionResult.uploadedFiles?.length ?? 0)} uploaded · {data.ingestionResult.changedFiles.length} changed · {data.ingestionResult.unchangedFiles.length} unchanged
              </div>
            </div>
          </button>

          {openActivity && (
            <div className="mt-3 space-y-3 text-[11px] text-zinc-700">
              <div className="break-words text-[11px] text-zinc-700 sm:text-[11px]">
                {data.ingestionResult.message}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <div className="font-semibold text-zinc-800">Changed files</div>
                  {data.ingestionResult.changedFiles.length === 0 ? (
                    <div className="text-zinc-500">None</div>
                  ) : (
                    <ul className="list-disc pl-4 space-y-1 break-words">
                      {data.ingestionResult.changedFiles.map((file) => (
                        <li key={file}>{file}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-zinc-800">Unchanged files</div>
                  {data.ingestionResult.unchangedFiles.length === 0 ? (
                    <div className="text-zinc-500">None</div>
                  ) : (
                    <ul className="list-disc pl-4 space-y-1 break-words">
                      {data.ingestionResult.unchangedFiles.map((file) => (
                        <li key={file}>{file}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {data.ingestionResult.uploadedFiles?.length ? (
                <div className="text-[11px] text-zinc-700">
                  <div className="font-semibold text-zinc-800">Vector store uploads</div>
                  <div className="text-[10px] text-zinc-500 mb-1">
                    {data.ingestionResult.vectorStoreId ? (
                      <a
                        href={`https://platform.openai.com/storage/vector-stores/${data.ingestionResult.vectorStoreId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <ExternalLink size={12} />
                        Open vector store
                      </a>
                    ) : (
                      "Vector store ID not available"
                    )}
                  </div>
                  <ul className="flex flex-col gap-2">
                    {data.ingestionResult.uploadedFiles.map((file) => (
                      <li
                        key={`${file.filePath}-${file.vectorStoreFileId}`}
                        className="rounded border border-zinc-200 bg-zinc-50 px-3 py-2 space-y-1 break-words"
                      >
                        <div className="text-[11px] font-semibold text-zinc-800 break-words">{file.filePath}</div>
                        <div className="flex flex-col gap-1 text-[10px] text-zinc-600 sm:flex-row sm:flex-wrap sm:items-center">
                          <span className="min-w-0 break-all sm:break-words">OpenAI file: {file.fileId ?? "—"}</span>
                          {file.fileId && (
                            <button
                              type="button"
                              className="text-blue-600 hover:underline shrink-0"
                              onClick={() =>
                                copy(file.fileId!, () => {
                                  setCopiedVectorIds((state) => ({
                                    ...state,
                                    [file.fileId as string]: true,
                                  }));
                                  setTimeout(
                                    () =>
                                      setCopiedVectorIds((state) => ({
                                        ...state,
                                        [file.fileId as string]: false,
                                      })),
                                    1200
                                  );
                                })
                              }
                            >
                              {copiedVectorIds[file.fileId] ? "Copied" : "Copy"}
                            </button>
                          )}
                        </div>
                        <div className="flex flex-col gap-1 text-[10px] text-zinc-600 sm:flex-row sm:flex-wrap sm:items-center">
                          <span className="min-w-0 break-all sm:break-words">Vector store file: {file.vectorStoreFileId ?? "—"}</span>
                          {file.vectorStoreFileId && (
                            <button
                              type="button"
                              className="text-blue-600 hover:underline shrink-0"
                              onClick={() =>
                                copy(file.vectorStoreFileId!, () => {
                                  setCopiedVectorIds((state) => ({
                                    ...state,
                                    [file.vectorStoreFileId as string]: true,
                                  }));
                                  setTimeout(
                                    () =>
                                      setCopiedVectorIds((state) => ({
                                        ...state,
                                        [file.vectorStoreFileId as string]: false,
                                      })),
                                    1200
                                  );
                                })
                              }
                            >
                              {copiedVectorIds[file.vectorStoreFileId] ? "Copied" : "Copy"}
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {data.ingestionResult.deletedVectorStoreFiles &&
                Object.keys(data.ingestionResult.deletedVectorStoreFiles).length > 0 && (
                  <div className="text-[11px] text-zinc-700">
                    <div className="font-semibold text-zinc-800">Replaced vector store files</div>
                    <ul className="list-disc pl-4 space-y-1">
                      {Object.entries(data.ingestionResult.deletedVectorStoreFiles).map(([filePath, vectorId]) => (
                        <li
                          key={filePath}
                          className="flex flex-col gap-1 break-words sm:flex-row sm:items-start sm:gap-2"
                        >
                          <span className="min-w-0 break-all sm:break-words">{filePath}</span>
                          <span className="text-zinc-500 min-w-0 break-all sm:break-words">({vectorId})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {data.ingestionResult.ingestionLogs &&
                (data.ingestionResult.ingestionLogs.stdout || data.ingestionResult.ingestionLogs.stderr) && (
                  <div className="text-[11px] text-zinc-700">
                    <div className="font-semibold text-zinc-800">Ingestion logs</div>
                    {data.ingestionResult.ingestionLogs.stdout && (
                      <pre className="mt-1 max-h-40 overflow-auto rounded bg-zinc-900 p-2 text-[10px] text-zinc-100">
                        {data.ingestionResult.ingestionLogs.stdout}
                      </pre>
                    )}
                    {data.ingestionResult.ingestionLogs.stderr && (
                      <pre className="mt-1 max-h-40 overflow-auto rounded bg-red-900/80 p-2 text-[10px] text-red-50">
                        {data.ingestionResult.ingestionLogs.stderr}
                      </pre>
                    )}
                  </div>
                )}
            </div>
          )}
        </div>
      )}

      <div className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm">
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="text-sm font-semibold text-zinc-800">Log output</div>
            {logError && <div className="text-[11px] text-red-600">Failed to load logs.</div>}
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-zinc-600">
            <div className="flex flex-wrap items-end gap-2">
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-zinc-500">From</span>
                <input
                  type="datetime-local"
                  className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700"
                  value={logFilterDraft.start}
                  onChange={(event) =>
                    setLogFilterDraft((prev) => ({ ...prev, start: event.target.value }))
                  }
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-zinc-500">To</span>
                <input
                  type="datetime-local"
                  className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700"
                  value={logFilterDraft.end}
                  onChange={(event) => setLogFilterDraft((prev) => ({ ...prev, end: event.target.value }))}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-zinc-500">Jump to before</span>
                <input
                  type="datetime-local"
                  className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700"
                  value={logFilterDraft.anchor}
                  onChange={(event) => setLogFilterDraft((prev) => ({ ...prev, anchor: event.target.value }))}
                  placeholder="Load runs before…"
                />
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded border border-zinc-200 px-3 py-1.5 font-medium text-[#2B83F6] hover:border-[#2B83F6]"
                  onClick={applyLogFilters}
                  disabled={logsLoadingState}
                >
                  Apply
                </button>
                <button
                  type="button"
                  className="rounded border border-zinc-200 px-3 py-1.5 font-medium text-zinc-600 hover:border-zinc-300"
                  onClick={clearLogFilters}
                  disabled={logsLoadingState}
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="sr-only" htmlFor="log-run-picker">
                Select log run
              </label>
              <select
                id="log-run-picker"
                className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700"
                value={selectedLogId ?? filteredLogs[0]?.id ?? ""}
                onChange={(event) => setSelectedLogId(event.target.value)}
                disabled={filteredLogs.length === 0 || logViewMode === "all"}
              >
                {filteredLogs.map((log: LogRun) => (
                  <option key={log.id} value={log.id}>
                    {new Date(log.startedAt).toLocaleString()} ({Math.max(0, Math.round(log.size / 1024))} KB)
                  </option>
                ))}
                {!filteredLogs.length ? <option value="">No logs yet</option> : null}
              </select>
              {!logsExhaustive && effectiveLogCursor ? (
                <button
                  type="button"
                  className="text-[#2B83F6] hover:underline"
                  onClick={loadOlderLogs}
                  disabled={logsLoadingState}
                >
                  Load older logs
                </button>
              ) : null}
              <label className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-500">View</span>
                <select
                  className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700"
                  value={logViewMode}
                  onChange={(event) => setLogViewMode(event.target.value as "single" | "all")}
                >
                  <option value="single">Selected run</option>
                  <option value="all">All loaded runs</option>
                </select>
              </label>
              {selectedLog ? (
                <span className="text-[11px] text-zinc-500">
                  Showing bytes {selectedLog.contentStart ?? 0}
                  {typeof selectedLog.contentEnd === "number"
                    ? `–${selectedLog.contentEnd}`
                    : selectedLog.size > 0
                      ? `–${selectedLog.size}`
                      : ""}
                  {selectedLog.size ? ` of ${selectedLog.size}` : ""}
                </span>
              ) : null}
              {selectedLog && selectedLog.fullyLoaded === false ? (
                <span className="text-[11px] text-amber-600">
                  Showing a recent chunk. Use the load controls to fetch the rest of this log.
                </span>
              ) : null}
              {selectedLog?.hasMoreBefore ? (
                <button
                  type="button"
                  className="text-[#2B83F6] hover:underline"
                  onClick={() => shiftLogContent("earlier")}
                  disabled={logsLoadingState}
                >
                  Load earlier content
                </button>
              ) : null}
              {selectedLog?.hasMoreAfter ? (
                <button
                  type="button"
                  className="text-[#2B83F6] hover:underline"
                  onClick={() => shiftLogContent("later")}
                  disabled={logsLoadingState}
                >
                  Load later content
                </button>
              ) : null}
              {selectedLog && logChunkRanges[selectedLog.id] ? (
                <button
                  type="button"
                  className="text-zinc-600 hover:underline"
                  onClick={resetSelectedLogRange}
                  disabled={logsLoadingState}
                >
                  Jump to newest chunk
                </button>
              ) : null}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-zinc-300 text-[#2B83F6] focus:ring-[#2B83F6]"
                  checked={autoScrollEnabled}
                  onChange={(event) => {
                    const enabled = event.target.checked;
                    setAutoScrollEnabled(enabled);
                    if (!enabled) {
                      userInteractedRef.current = true;
                      setAutoScroll(false);
                      setShowResume(false);
                    }
                  }}
                  aria-label="Toggle auto-scroll"
                />
                Auto-scroll
              </label>
              {logContent ? (
                <button
                  type="button"
                  className="flex items-center gap-1 text-[#2B83F6] hover:underline"
                  onClick={() => copy(logContent ?? "", setCopiedLog)}
                >
                  <Copy size={14} />
                  {copiedLog ? "Copied" : "Copy log"}
                </button>
              ) : null}
              <button
                type="button"
                className="flex items-center gap-1 text-red-600 hover:underline disabled:opacity-50"
                onClick={clearSelectedLog}
                disabled={!selectedLog}
              >
                <Trash2 size={14} />
                Clear log
              </button>
            </div>
          </div>
        </div>
          <div
            ref={logContainerRef}
            tabIndex={0}
            className="bg-zinc-50 border border-zinc-100 rounded-lg max-h-[500px] overflow-y-auto"
          >
            <pre ref={logContentRef} className="whitespace-pre-wrap text-xs p-3">
              {logContent ?? (logsLoadingState ? "Loading logs..." : "No log available yet.")}
            </pre>
            {autoScrollEnabled && !autoScroll && showResume ? (
              <div className="sticky bottom-0 w-full bg-gradient-to-t from-zinc-50 to-transparent px-3 pb-3 flex justify-end">
                <button
                  type="button"
                  className="text-xs text-white bg-[#2B83F6] hover:bg-[#1d6ccd] transition-colors px-3 py-1 rounded"
                  onClick={() => {
                    userInteractedRef.current = false;
                    setAutoScroll(true);
                    setShowResume(false);
                    const container = logContainerRef.current;
                    if (container) {
                      requestAnimationFrame(() => {
                        container.scrollTo({
                          top: container.scrollHeight,
                          behavior: "smooth",
                        });
                      });
                    }
                  }}
                >
                  Resume live logs
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
