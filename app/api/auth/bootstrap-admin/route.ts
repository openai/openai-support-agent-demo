import { AgentRole } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { getAgentBootstrapState } from "@/lib/server/bootstrap";
import { hashPin } from "@/lib/vendor/bcrypt";

const SECRET = process.env.BOOTSTRAP_ADMIN_SECRET;

function badRequest(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  const { hasAgents } = await getAgentBootstrapState();
  if (hasAgents) {
    return badRequest("Bootstrap is disabled because agents already exist", 403);
  }

  if (!SECRET) {
    return badRequest("Bootstrap secret is not configured", 503);
  }

  const body = (await request.json().catch(() => null)) as {
    userId?: string;
    pin?: string;
    telegramChatId?: string | null;
    secret?: string;
  } | null;

  if (!body?.secret || body.secret !== SECRET) {
    return badRequest("Invalid bootstrap secret", 403);
  }

  if (!body.userId || !body.pin) {
    return badRequest("userId and pin are required");
  }

  try {
    const agent = await prisma.agentAccount.create({
      data: {
        userId: body.userId,
        hashedPin: hashPin(body.pin),
        roles: [AgentRole.admin, AgentRole.agent],
        telegramChatId: body.telegramChatId ?? null,
      },
    });

    return new Response(
      JSON.stringify({
        agent: {
          userId: agent.userId,
          roles: agent.roles,
          telegramChatId: agent.telegramChatId,
          createdAt: agent.createdAt,
        },
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Failed to bootstrap admin", error);
    return badRequest("Unable to create admin account", 500);
  }
}
