import prisma from "@/lib/prisma";
import { AgentRole, Prisma, ScrapeJobCadence, ScrapeJobStatus } from "@/lib/generated/prisma";
import { parseCadence } from "@/lib/scheduler";
import { ensureAuthenticated } from "../../helpers";
import {
  mergeArgsWithTarget,
  normalizeArgsForScript,
  parseTargetUrlFromArgs,
  validateScriptArgs,
} from "../../validation";

function parseDate(value: unknown): { value: Date | null; error?: string } {
  if (!value) return { value: null };
  const date = new Date(value as string);
  if (Number.isNaN(date.getTime())) return { value: null, error: "Invalid date format" };
  return { value: date };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await ensureAuthenticated(request, { role: AgentRole.admin, csrf: true });
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { value: nextRunAt, error: nextRunError } = parseDate(body.nextRunAt);
    const cadence = parseCadence(body.cadence ?? null);

    try {
      const existing = await prisma.scrapeJob.findUnique({
        where: { id },
        select: { id: true, cadence: true, args: true, script: true },
      });

      if (!existing) {
        return new Response(JSON.stringify({ error: "Job not found" }), {
          status: 404,
        });
      }

      const effectiveCadence = cadence ?? existing.cadence ?? ScrapeJobCadence.manual;

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

      const { url: targetUrl, error: targetError } = parseTargetUrlFromArgs(existing.args ?? {}, {
        required: true,
      });

      if (targetError) {
        return new Response(JSON.stringify({ error: targetError }), { status: 400 });
      }

      const mergedArgs = mergeArgsWithTarget(existing.args ?? {}, targetUrl);
      const normalizedArgs = normalizeArgsForScript(existing.script, mergedArgs);
      const schemaError = validateScriptArgs(existing.script, targetUrl, normalizedArgs);
      if (schemaError) {
        return new Response(JSON.stringify({ error: schemaError }), { status: 400 });
      }

      const job = await prisma.scrapeJob.update({
        where: { id },
        data: {
          status: ScrapeJobStatus.queued,
          startedAt: null,
          finishedAt: null,
          paused: false,
          args: normalizedArgs,
          cadence: cadence ?? undefined,
          nextRunAt,
          progress: 0,
          logPath: null,
          durationSeconds: null,
          documentsIngested: null,
        },
      });

      return new Response(JSON.stringify(job), { status: 200 });
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
    console.error("Error triggering scrape job:", error);
    return new Response("Error triggering job", { status: 500 });
  }
}
