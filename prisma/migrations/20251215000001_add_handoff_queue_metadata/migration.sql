-- Add metadata columns for queue segmentation and notifications
ALTER TABLE "HandoffRequest"
  ADD COLUMN "accountId" INTEGER,
  ADD COLUMN "inboxId" INTEGER,
  ADD COLUMN "lastPositionNotified" INTEGER;

UPDATE "HandoffRequest"
SET
  "accountId" = split_part("conversationKey", ':', 2)::INTEGER,
  "inboxId" = CASE
    WHEN array_length(string_to_array("conversationKey", ':'), 1) >= 4
      THEN split_part("conversationKey", ':', 3)::INTEGER
    ELSE split_part("conversationKey", ':', 3)::INTEGER
  END
WHERE "accountId" IS NULL OR "inboxId" IS NULL;

ALTER TABLE "HandoffRequest"
  ALTER COLUMN "accountId" SET NOT NULL,
  ALTER COLUMN "inboxId" SET NOT NULL;

CREATE INDEX IF NOT EXISTS "HandoffRequest_pending_queue_idx"
  ON "HandoffRequest" ("accountId", "inboxId", "status", "requestedAt");
