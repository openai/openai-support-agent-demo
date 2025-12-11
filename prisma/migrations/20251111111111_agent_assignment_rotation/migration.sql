-- AlterTable
ALTER TABLE "AgentAssignment" DROP CONSTRAINT "AgentAssignment_pkey";
ALTER TABLE "AgentAssignment" ALTER COLUMN "agentId" SET NOT NULL;
ALTER TABLE "AgentAssignment" ADD CONSTRAINT "AgentAssignment_pkey" PRIMARY KEY ("inboxId", "agentId");
