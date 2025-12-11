import prisma from "./prisma";
import { listAgents } from "./chatwoot";

export type AgentAvailability = "online" | "busy" | "offline";

export interface AgentRecord {
  id: number;
  availability_status: AgentAvailability;
  role?: "agent" | "administrator";
  [key: string]: any;
}

export interface AgentAvailabilitySummary {
  online: number;
  busy: number;
  offline: number;
}

export interface AgentSelectionResult {
  agent: AgentRecord | null;
  availabilitySummary: AgentAvailabilitySummary;
}

export async function getNextAgent(
  accountId: number
): Promise<AgentSelectionResult> {
  const agents: AgentRecord[] = await listAgents(accountId);

  const availabilitySummary: AgentAvailabilitySummary = {
    online: 0,
    busy: 0,
    offline: 0,
  };

  for (const agent of agents) {
    switch (agent.availability_status) {
      case "online":
        availabilitySummary.online += 1;
        break;
      case "busy":
        availabilitySummary.busy += 1;
        break;
      case "offline":
        availabilitySummary.offline += 1;
        break;
      default:
        break;
    }
  }

  const onlineAgents = agents.filter(
    (a) => a.availability_status === "online"
  );
  console.info(
    "[agentRotation] fetched agents",
    {
      accountId,
      availabilitySummary,
      agents: onlineAgents.map((a) => ({
        id: a.id,
        availability_status: a.availability_status,
      })),
    }
  );
  if (onlineAgents.length === 0) {
    return { agent: null, availabilitySummary };
  }

  const existing = await prisma.agentAssignment.findMany({
    where: { inboxId: accountId },
  });
  const onlineIds = new Set(onlineAgents.map((a) => a.id));
  const existingIds = new Set(existing.map((a) => a.agentId));

  const newAgents = onlineAgents.filter((a) => !existingIds.has(a.id));
  if (newAgents.length > 0) {
    await prisma.agentAssignment.createMany({
      data: newAgents.map((a) => ({
        inboxId: accountId,
        agentId: a.id,
        lastAssignedAt: new Date(0),
      })),
    });
  }

  const offlineIds = existing
    .filter((a) => !onlineIds.has(a.agentId))
    .map((a) => a.agentId);
  if (offlineIds.length > 0) {
    await prisma.agentAssignment.deleteMany({
      where: {
        inboxId: accountId,
        agentId: { in: offlineIds },
      },
    });
  }

  const nextAssignment = await prisma.agentAssignment.findFirst({
    where: { inboxId: accountId },
    orderBy: { lastAssignedAt: "asc" },
  });
  if (!nextAssignment) {
    return { agent: null, availabilitySummary };
  }

  const nextAgent = onlineAgents.find(
    (a) => a.id === nextAssignment.agentId
  );
  if (!nextAgent) {
    return { agent: null, availabilitySummary };
  }

  await prisma.agentAssignment.update({
    where: {
      inboxId_agentId: {
        inboxId: accountId,
        agentId: nextAssignment.agentId,
      },
    },
    data: { lastAssignedAt: new Date() },
  });

  return { agent: nextAgent, availabilitySummary };
}

export async function setActiveConversation(
  agentId: number,
  conversationId: number,
  availabilityBeforeBusy?: AgentAvailability | null
) {
  await prisma.agentAssignment.updateMany({
    where: { agentId },
    data: {
      activeConversationId: conversationId,
      availabilityBeforeBusy: availabilityBeforeBusy ?? null,
    },
  });
}

export async function clearActiveConversation(agentId: number) {
  const assignments = await prisma.agentAssignment.findMany({
    where: {
      agentId,
      activeConversationId: { not: null },
    },
    select: { availabilityBeforeBusy: true },
  });
  await prisma.agentAssignment.updateMany({
    where: {
      agentId,
      activeConversationId: { not: null },
    },
    data: {
      activeConversationId: null,
      availabilityBeforeBusy: null,
    },
  });
  return assignments.length > 0
    ? assignments[0].availabilityBeforeBusy ?? null
    : null;
}
