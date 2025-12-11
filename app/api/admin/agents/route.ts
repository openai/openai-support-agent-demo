import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/server/auth";
import { hashPin } from "@/lib/vendor/bcrypt";
import { AgentRole } from "@/lib/generated/prisma";

function sanitizeAgent(agent: {
  userId: string;
  roles: AgentRole[];
  telegramChatId: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    userId: agent.userId,
    roles: agent.roles,
    telegramChatId: agent.telegramChatId,
    createdAt: agent.createdAt,
    updatedAt: agent.updatedAt,
  };
}

export async function GET(request: Request) {
  const result = await requireSession(request, { role: AgentRole.admin, csrfProtected: true });
  if ("response" in result) return result.response;

  const agents = await prisma.agentAccount.findMany({
    orderBy: { createdAt: "asc" },
  });

  return new Response(JSON.stringify({ agents: agents.map(sanitizeAgent) }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  const result = await requireSession(request, { role: AgentRole.admin, csrfProtected: true });
  if ("response" in result) return result.response;

  const payload = (await request.json().catch(() => null)) as {
    userId?: string;
    pin?: string;
    roles?: AgentRole[];
    telegramChatId?: string | null;
  } | null;

  if (!payload?.userId || !payload.pin || !Array.isArray(payload.roles)) {
    return new Response(JSON.stringify({ error: "userId, roles, and pin are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const agent = await prisma.agentAccount.create({
      data: {
        userId: payload.userId,
        hashedPin: hashPin(payload.pin),
        roles: payload.roles,
        telegramChatId: payload.telegramChatId ?? null,
      },
    });

    return new Response(JSON.stringify({ agent: sanitizeAgent(agent) }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to create agent", error);
    return new Response(JSON.stringify({ error: "Unable to create agent" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
