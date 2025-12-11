-- AlterTable
CREATE SEQUENCE "public".conversationmessage_id_seq;
ALTER TABLE "public"."ConversationMessage"
    ADD COLUMN "messageId" INTEGER,
    ALTER COLUMN "id" SET DEFAULT nextval('"public".conversationmessage_id_seq');
ALTER SEQUENCE "public".conversationmessage_id_seq OWNED BY "public"."ConversationMessage"."id";

-- Populate existing rows with sequential messageIds per conversation
WITH ordered AS (
    SELECT "id", ROW_NUMBER() OVER (PARTITION BY "conversationKey" ORDER BY "id") AS rn
    FROM "public"."ConversationMessage"
)
UPDATE "public"."ConversationMessage" cm
SET "messageId" = ordered.rn
FROM ordered
WHERE cm.id = ordered.id;

-- Make messageId required
ALTER TABLE "public"."ConversationMessage"
    ALTER COLUMN "messageId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ConversationMessage_conversationKey_messageId_key" ON "public"."ConversationMessage"("conversationKey", "messageId");

