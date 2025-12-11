import { AgentRole, Prisma, ScrapeJobCadence, ScrapeJobStatus } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { calculateNextRun } from "@/lib/scheduler";
import { cancelRunningScrape } from "@/lib/scrapeRunner";
import { ensureAuthenticated, serializeJob } from "../helpers";
import {
  mergeArgObjects,
  mergeArgsWithTarget,
  normalizeArgsForScript,
  parseTargetUrlFromArgs,
  validateScriptArgs,
} from "../validation";

function parseCadence(value: unknown): ScrapeJobCadence | undefined {
  if (typeof value !== "string") return undefined;
  return (Object.values(ScrapeJobCadence) as string[]).includes(value)
    ? (value as ScrapeJobCadence)
    : undefined;
}

function parseBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return undefined;
}

function parseDate(value: unknown): { value: Date | null | undefined; error?: string } {
  if (value === undefined) return { value: undefined };
  if (value === null) return { value: null };
  const date = new Date(value as string);
  if (Number.isNaN(date.getTime())) {
    return { value: null, error: "Invalid date format" };
  }
  return { value: date };
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await ensureAuthenticated(request, { role: AgentRole.agent });
  if (unauthorized) return unauthorized;
  const { id } = await params;
  const job = await serializeJob(id);
  if (!job) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(JSON.stringify(job), { status: 200 });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await ensureAuthenticated(request, { role: AgentRole.admin, csrf: true });
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const cadence = parseCadence(body.cadence);
    const paused = parseBoolean(body.paused);
    const autoRunManualWithNext = parseBoolean(body.autoRunManualWithNext);
    const { value: nextRunAt, error: nextRunError } = parseDate(body.nextRunAt);
    const argsProvided = Object.prototype.hasOwnProperty.call(body, "args");
    const argsResult = argsProvided
      ? parseTargetUrlFromArgs(body.args, { required: true })
      : { provided: false, url: null as string | null, error: undefined };

    const existing = await prisma.scrapeJob.findUnique({ where: { id } });
    if (!existing) {
      return new Response(JSON.stringify({ error: "Job not found" }), { status: 404 });
    }

    const effectiveCadence = cadence ?? existing.cadence;
    const effectiveAutoRunManualWithNext =
      autoRunManualWithNext ?? existing.autoRunManualWithNext;
    const effectiveNextRunAt = nextRunAt ?? existing.nextRunAt;
    const effectivePaused = paused ?? existing.paused;

    if (nextRunError) {
      return new Response(JSON.stringify({ error: nextRunError }), { status: 400 });
    }

    if (
      nextRunAt &&
      effectiveCadence !== ScrapeJobCadence.manual &&
      nextRunAt.getTime() <= Date.now()
    ) {
      return new Response(
        JSON.stringify({ error: "nextRunAt must be in the future for scheduled cadences" }),
        { status: 400 }
      );
    }

    if (
      effectiveCadence === ScrapeJobCadence.manual &&
      effectiveAutoRunManualWithNext &&
      !effectiveNextRunAt
    ) {
      return new Response(
        JSON.stringify({ error: "nextRunAt is required to auto-run manual jobs" }),
        { status: 400 }
      );
    }

    if (argsResult.error) {
      return new Response(JSON.stringify({ error: argsResult.error }), { status: 400 });
    }

    const data: Prisma.ScrapeJobUpdateInput = {};

    if (cadence) {
      data.cadence = cadence;
      data.nextRunAt = nextRunAt ?? calculateNextRun(cadence);
    }

    if (paused !== undefined) {
      data.paused = paused;
      if (!paused) {
        data.nextRunAt =
          nextRunAt ?? calculateNextRun(cadence ?? existing.cadence);
      } else if (nextRunAt !== undefined) {
        data.nextRunAt = nextRunAt;
      } else {
        data.nextRunAt = null;
      }
    } else if (nextRunAt !== undefined) {
      data.nextRunAt = nextRunAt;
    }

    if (autoRunManualWithNext !== undefined) {
      data.autoRunManualWithNext = autoRunManualWithNext;
    }

    if (argsProvided) {
      const mergedArgs = mergeArgObjects(existing.args, body.args);
      const normalizedArgs = normalizeArgsForScript(
        body.script ?? existing.script,
        mergeArgsWithTarget(mergedArgs, argsResult.url),
      );
      const schemaError = validateScriptArgs(body.script ?? existing.script, argsResult.url, normalizedArgs);
      if (schemaError) {
        return new Response(JSON.stringify({ error: schemaError }), { status: 400 });
      }
      data.args = normalizedArgs;
    }

    if (
      argsProvided &&
      !effectivePaused &&
      data.nextRunAt === undefined &&
      effectiveCadence !== ScrapeJobCadence.manual
    ) {
      data.nextRunAt = calculateNextRun(effectiveCadence);
    }

    if (Object.keys(data).length === 0) {
      return new Response(JSON.stringify({ error: "No fields to update" }), {
        status: 400,
      });
    }

    const job = await prisma.scrapeJob.update({ where: { id }, data });
    return new Response(JSON.stringify(job), { status: 200 });
  } catch (error) {
    console.error("Error updating scrape job:", error);
    return new Response("Error updating job", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await ensureAuthenticated(request, { role: AgentRole.admin, csrf: true });
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;

    const finishedAt = new Date();

    try {
      const job = await prisma.scrapeJob.update({
        where: { id },
        data: {
          status: ScrapeJobStatus.canceled,
          paused: false,
          finishedAt,
          nextRunAt: null,
          progress: 100,
        },
      });

      const cancellation = cancelRunningScrape(id);
      const message = cancellation.message;

      return new Response(
        JSON.stringify({ job, cancellation, message }),
        { status: cancellation.found && !cancellation.signaled ? 500 : 200 }
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return new Response(JSON.stringify({ error: "Job not found" }), {
          status: 404,
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error deleting scrape job:", error);
    return new Response("Error deleting job", { status: 500 });
  }
}
