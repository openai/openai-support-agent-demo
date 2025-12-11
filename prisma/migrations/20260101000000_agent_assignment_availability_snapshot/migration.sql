-- CreateEnum
CREATE TYPE "AgentAvailability" AS ENUM ('online', 'busy', 'offline');

-- AlterTable
ALTER TABLE "AgentAssignment" ADD COLUMN "availabilityBeforeBusy" "AgentAvailability";
