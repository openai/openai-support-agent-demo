-- CreateEnum
CREATE TYPE "public"."AgentRole" AS ENUM ('admin', 'agent');

-- CreateEnum
CREATE TYPE "public"."LoginAuditStatus" AS ENUM ('token_sent', 'verified', 'failure', 'success');

-- CreateTable
CREATE TABLE "public"."AgentAccount" (
    "userId" TEXT NOT NULL,
    "hashedPin" TEXT NOT NULL,
    "telegramChatId" TEXT,
    "roles" "public"."AgentRole"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentAccount_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "public"."LoginToken" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LoginAudit" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "status" "public"."LoginAuditStatus" NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginAudit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."LoginToken" ADD CONSTRAINT "LoginToken_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."AgentAccount"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LoginAudit" ADD CONSTRAINT "LoginAudit_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."AgentAccount"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
