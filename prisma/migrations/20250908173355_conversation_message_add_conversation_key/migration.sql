-- Add conversationKey columns and update primary key for HandoffRequest
ALTER TABLE "ConversationMessage" ADD COLUMN "conversationKey" TEXT NOT NULL DEFAULT '';
ALTER TABLE "ConversationMessage" ALTER COLUMN "conversationKey" DROP DEFAULT;

ALTER TABLE "HandoffRequest" ADD COLUMN "conversationKey" TEXT NOT NULL DEFAULT '';
ALTER TABLE "HandoffRequest" DROP CONSTRAINT "HandoffRequest_pkey";
ALTER TABLE "HandoffRequest" ADD CONSTRAINT "HandoffRequest_pkey" PRIMARY KEY ("conversationKey");
ALTER TABLE "HandoffRequest" ALTER COLUMN "conversationKey" DROP DEFAULT;
