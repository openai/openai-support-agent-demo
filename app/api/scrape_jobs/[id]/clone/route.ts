import { AgentRole, ScrapeJobStatus } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { triggerScrapeJob } from "@/lib/scrapeRunner";
import { ensureAuthenticated } from "../../helpers";
import {
  mergeArgsWithTarget,
  normalizeArgsForScript,
  parseTargetUrlFromArgs,
  validateScriptArgs,
} from "../../validation";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await ensureAuthenticated(request, { role: AgentRole.admin, csrf: true });
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const source = await prisma.scrapeJob.findUnique({
      where: { id },
      select: {
        id: true,
        script: true,
        args: true,
        cadence: true,
      },
    });

    if (!source) {
      return new Response(JSON.stringify({ error: "Job not found" }), {
        status: 404,
      });
    }

    const { url: targetUrl, error: targetError } = parseTargetUrlFromArgs(source.args ?? {}, {
      required: true,
    });

    if (targetError) {
      return new Response(JSON.stringify({ error: targetError }), { status: 400 });
    }

    const mergedArgs = mergeArgsWithTarget(source.args ?? {}, targetUrl);
    const args = normalizeArgsForScript(source.script, mergedArgs);

    const schemaError = validateScriptArgs(source.script, targetUrl, args);
    if (schemaError) {
      return new Response(JSON.stringify({ error: schemaError }), { status: 400 });
    }

    const job = await prisma.scrapeJob.create({
      data: {
        script: source.script,
        args,
        cadence: source.cadence,
        status: ScrapeJobStatus.queued,
        paused: false,
        nextRunAt: null,
        progress: 0,
      },
    });

    void triggerScrapeJob(job.id);

    return new Response(
      JSON.stringify({
        sourceJobId: source.id,
        job,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error cloning scrape job:", error);
    return new Response("Error cloning job", { status: 500 });
  }
}
