ALTER TABLE "ChatSession" ADD COLUMN "lastSummarizedIndex" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "ChatSession" DROP COLUMN "summaryIndex";
