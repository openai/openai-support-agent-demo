import fs from "fs";
import path from "path";

import prisma from "@/lib/prisma";
import { AgentRole, ScrapeJobStatus } from "@/lib/generated/prisma";
import { ensureAuthenticated } from "../../helpers";

const LOG_DIR = path.join(process.cwd(), "logs", "scrape_jobs");
const KNOWLEDGE_BASE_DIR = path.join(process.cwd(), "public", "knowledge_base");

async function removeIfWithinBase(target: string | null | undefined, base: string, options?: fs.RmOptions) {
  if (!target) return;
  const resolved = path.resolve(target);
  if (!resolved.startsWith(path.resolve(base))) return;

  try {
    await fs.promises.rm(resolved, { force: true, ...options });
  } catch (error) {
    console.warn(`Failed to remove ${resolved}:`, error);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await ensureAuthenticated(request, { role: AgentRole.admin, csrf: true });
  if (unauthorized) return unauthorized;

  const { id } = await params;

  const job = await prisma.scrapeJob.findUnique({ where: { id } });
  if (!job) {
    return new Response(JSON.stringify({ error: "Job not found" }), { status: 404 });
  }

  const defaultLogPath = path.join(LOG_DIR, `${job.id}.log`);
  const knowledgeBaseJobDir = path.join(KNOWLEDGE_BASE_DIR, job.id);

  await prisma.scrapeJob.delete({ where: { id } });

  await Promise.all([
    removeIfWithinBase(job.logPath, LOG_DIR),
    removeIfWithinBase(defaultLogPath, LOG_DIR),
    removeIfWithinBase(knowledgeBaseJobDir, KNOWLEDGE_BASE_DIR, { recursive: true }),
  ]);

  return new Response(
    JSON.stringify({ status: ScrapeJobStatus.canceled, deleted: true, id: job.id }),
    { status: 200 }
  );
}
