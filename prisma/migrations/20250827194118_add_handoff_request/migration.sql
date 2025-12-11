-- CreateEnum
CREATE TYPE "public"."HandoffRequestStatus" AS ENUM ('pending', 'awaiting_confirmation', 'assigned');

-- CreateTable
CREATE TABLE "public"."HandoffRequest" (
    "conversationId" INTEGER NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."HandoffRequestStatus" NOT NULL DEFAULT 'pending',
    "agentId" INTEGER,

    CONSTRAINT "HandoffRequest_pkey" PRIMARY KEY ("conversationId")
);

