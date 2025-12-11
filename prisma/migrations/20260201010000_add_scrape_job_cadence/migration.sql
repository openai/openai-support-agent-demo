CREATE TYPE "public"."ScrapeJobCadence" AS ENUM ('manual', 'daily', 'weekly', 'monthly');

ALTER TABLE "public"."ScrapeJob"
  ADD COLUMN "cadence" "public"."ScrapeJobCadence" NOT NULL DEFAULT 'manual',
  ADD COLUMN "paused" BOOLEAN NOT NULL DEFAULT false;
