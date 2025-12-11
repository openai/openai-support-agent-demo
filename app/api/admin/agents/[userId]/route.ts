import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { AgentRole } from "@/lib/generated/prisma";
import { requireSession } from "@/lib/server/auth";
import { hashPin } from "@/lib/vendor/bcrypt";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const result = await requireSession(request, { role: AgentRole.admin, csrfProtected: true });
  if ("response" in result) return result.response;

  try {
    await prisma.agentAccount.delete({ where: { userId } });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete agent", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("Record to delete does not exist") ? 404 : 500;
    return new Response(JSON.stringify({ error: "Unable to delete agent" }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const result = await requireSession(request, { role: AgentRole.admin, csrfProtected: true });
  if ("response" in result) return result.response;

  const payload = (await request.json().catch(() => null)) as {
    roles?: AgentRole[];
    pin?: string;
    telegramChatId?: string | null;
  } | null;

  if (!payload) {
    return new Response(JSON.stringify({ error: "No update payload provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data: Record<string, unknown> = {};

  if (payload.roles) data.roles = payload.roles;
  if (payload.telegramChatId !== undefined) data.telegramChatId = payload.telegramChatId ?? null;
  if (payload.pin) data.hashedPin = hashPin(payload.pin);

  if (Object.keys(data).length === 0) {
    return new Response(JSON.stringify({ error: "No changes provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const agent = await prisma.agentAccount.update({
      where: { userId },
      data,
    });

    return new Response(
      JSON.stringify({
        agent: {
          userId: agent.userId,
          roles: agent.roles,
          telegramChatId: agent.telegramChatId,
          createdAt: agent.createdAt,
          updatedAt: agent.updatedAt,
        },
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Failed to update agent", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("Record to update not found") ? 404 : 500;
    return new Response(JSON.stringify({ error: "Unable to update agent" }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}
