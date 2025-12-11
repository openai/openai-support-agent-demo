-- CreateTable
CREATE TABLE "public"."AgentAssignment" (
    "inboxId" INTEGER NOT NULL,
    "agentId" INTEGER,
    "lastAssignedAt" TIMESTAMP(3),
    "activeConversationId" INTEGER,

    CONSTRAINT "AgentAssignment_pkey" PRIMARY KEY ("inboxId")
);
