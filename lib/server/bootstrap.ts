import prisma from "../prisma";

export async function getAgentBootstrapState() {
  const count = await prisma.agentAccount.count();
  return { hasAgents: count > 0 };
}
