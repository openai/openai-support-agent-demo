import { calculateNextRun, parseCadence } from "@/lib/scheduler";
import prisma from "@/lib/prisma";
import { AgentRole, Prisma, ScrapeJobCadence, ScrapeJobStatus } from "@/lib/generated/prisma";
import { ensureAuthenticated, serializeJob } from "./helpers";
import { triggerScrapeJob } from "@/lib/scrapeRunner";
import {
  mergeArgsWithTarget,
  normalizeArgsForScript,
  parseTargetUrlFromArgs,
  validateScriptArgs,
} from "./validation";

function parseStatus(value: string | null): ScrapeJobStatus | undefined {
  if (!value) return undefined;
  return (Object.values(ScrapeJobStatus) as string[]).includes(value)
    ? (value as ScrapeJobStatus)
    : undefined;
}

function parseLimit(value: string | null) {
  const parsed = Number(value ?? "");
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.min(parsed, 100);
}

function parseDate(value: unknown): { value: Date | null; error?: string } {
  if (!value) return { value: null };
  const date = new Date(value as string);
  if (Number.isNaN(date.getTime())) return { value: null, error: "Invalid date format" };
  return { value: date };
}

function parseBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return undefined;
}

export async function GET(request: Request) {
  const unauthorized = await ensureAuthenticated(request, { role: AgentRole.agent });
  if (unauthorized) return unauthorized;
  try {
    const { searchParams } = new URL(request.url);
    const status = parseStatus(searchParams.get("status"));
    const includeDetails = searchParams.get("detailed") === "true";
    const includeLogPreview = searchParams.get("logPreview") === "true";
    const limit = parseLimit(searchParams.get("limit"));
    const cursor = searchParams.get("cursor");
    const { value: createdAfter, error: createdAfterError } = parseDate(searchParams.get("from"));
    const { value: createdBefore, error: createdBeforeError } = parseDate(searchParams.get("to"));

    if (createdAfterError || createdBeforeError) {
      return new Response(
        JSON.stringify({ error: createdAfterError || createdBeforeError }),
        { status: 400 }
      );
    }

    const take = limit ?? undefined;
    const findManyArgs: Prisma.ScrapeJobFindManyArgs = {
      where: {
        ...(status ? { status } : {}),
        ...(createdAfter || createdBefore
          ? {
              createdAt: {
                ...(createdAfter ? { gte: createdAfter } : {}),
                ...(createdBefore ? { lte: createdBefore } : {}),
              },
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      take,
    };

    if (cursor) {
      findManyArgs.cursor = { id: cursor };
      findManyArgs.skip = 1;
    }

    const jobs = await prisma.scrapeJob.findMany(findManyArgs);

    if (includeDetails) {
      const detailed = await Promise.all(
        jobs.map((job) => serializeJob(job.id, { includeLog: includeLogPreview }))
      );
      const filtered = detailed.filter(Boolean);
      const nextCursor =
        take && filtered.length === take ? filtered[filtered.length - 1]?.job.id ?? null : null;
      return new Response(JSON.stringify({ jobs: filtered, nextCursor }), { status: 200 });
    }

    const nextCursor = take && jobs.length === take ? jobs[jobs.length - 1]?.id ?? null : null;
    return new Response(JSON.stringify({ jobs, nextCursor }), { status: 200 });
  } catch (error) {
    console.error("Error listing scrape jobs:", error);
    return new Response("Error listing jobs", { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await ensureAuthenticated(request, { role: AgentRole.admin, csrf: true });
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.script) {
      return new Response(JSON.stringify({ error: "script is required" }), {
        status: 400,
      });
    }

    const status = parseStatus(body.status ?? null) ?? ScrapeJobStatus.queued;
    const cadence = parseCadence(body.cadence) ?? ScrapeJobCadence.manual;
    const paused = parseBoolean(body.paused) ?? false;
    const autoRunManualWithNext =
      parseBoolean(body.autoRunManualWithNext) ??
      process.env.AUTO_RUN_MANUAL_WITH_NEXT === "true";
    const { value: nextRunAt, error: nextRunError } = parseDate(body.nextRunAt);
    const rawArgs = body.args ?? (body.targetUrl ? { url: body.targetUrl } : {});
    const { url: targetUrl, error: targetError } = parseTargetUrlFromArgs(rawArgs, {
      required: true,
    });

    if (nextRunError) {
      return new Response(JSON.stringify({ error: nextRunError }), { status: 400 });
    }

    if (
      nextRunAt &&
      cadence !== ScrapeJobCadence.manual &&
      nextRunAt.getTime() <= Date.now()
    ) {
      return new Response(
        JSON.stringify({ error: "nextRunAt must be in the future for scheduled cadences" }),
        { status: 400 }
      );
    }

    if (cadence === ScrapeJobCadence.manual && autoRunManualWithNext && !nextRunAt) {
      return new Response(
        JSON.stringify({ error: "nextRunAt is required to auto-run manual jobs" }),
        { status: 400 }
      );
    }

    if (targetError) {
      return new Response(JSON.stringify({ error: targetError }), { status: 400 });
    }

    const mergedArgs = mergeArgsWithTarget(rawArgs ?? {}, targetUrl);
    const normalizedArgs = normalizeArgsForScript(body.script, mergedArgs);
    const schemaError = validateScriptArgs(body.script, targetUrl, normalizedArgs);
    if (schemaError) {
      return new Response(JSON.stringify({ error: schemaError }), { status: 400 });
    }

    const data: Prisma.ScrapeJobCreateInput = {
      script: body.script,
      args: normalizedArgs,
      status,
      logPath: body.logPath ?? null,
      cadence,
      autoRunManualWithNext,
      paused,
      nextRunAt: nextRunAt ?? calculateNextRun(cadence),
      progress: 0,
    };

    const job = await prisma.scrapeJob.create({ data });

    void triggerScrapeJob(job.id);

    return new Response(
      JSON.stringify({
        job,
        ticket: job.id,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating scrape job:", error);
    return new Response("Error creating job", { status: 500 });
  }
}
