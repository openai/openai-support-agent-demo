ALTER TABLE "public"."ScrapeJob"
  ADD COLUMN "durationSeconds" DOUBLE PRECISION,
  ADD COLUMN "documentsIngested" INTEGER;
