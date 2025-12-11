-- CreateEnum
CREATE TYPE "public"."ScrapeJobStatus" AS ENUM ('queued', 'running', 'completed', 'failed');

-- CreateTable
CREATE TABLE "public"."ScrapeJob" (
    "id" TEXT NOT NULL,
    "script" TEXT NOT NULL,
    "args" JSONB,
    "status" "public"."ScrapeJobStatus" NOT NULL DEFAULT 'queued',
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "logPath" TEXT,
    "nextRunAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScrapeJob_pkey" PRIMARY KEY ("id")
);

