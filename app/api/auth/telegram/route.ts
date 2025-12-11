import crypto from "crypto";

import prisma from "@/lib/prisma";
import { SESSION_LIFETIME_MS, verifySignedVerificationToken } from "@/lib/server/auth";

function extractTokenFromText(raw: string | undefined | null) {
  if (!raw) return null;
  // Accept `/start <token>`, `/start\n<token>`, tolerate whitespace/newlines, and also
  // scan the text for a token-like pattern if the command isn't present (e.g., user
  // pastes the full message).
  const trimmed = raw.trim();
  const afterCommand = trimmed.replace(/^\/start\s*/i, "").trim();
  if (afterCommand) {
    return afterCommand.split(/\s+/)[0];
  }

  const tokenMatch = trimmed.match(
    /[0-9a-f]{8}-[0-9a-f-]{27}\.[0-9a-f]{32,}\.[0-9a-f]{32,}/i
  );
  return tokenMatch?.[0] ?? null;
}

function extractTokenFromUpdate(update: any) {
  const message = update?.message ?? update?.edited_message ?? update?.callback_query?.message;

  const tokenCandidates = [
    message?.text,
    message?.caption,
    message?.reply_to_message?.text,
    message?.reply_to_message?.caption,
    update?.callback_query?.data,
  ];

  for (const candidate of tokenCandidates) {
    const token = extractTokenFromText(candidate);
    if (token) return token;
  }

  return null;
}

export async function POST(request: Request) {
  let chatId: string | null = null;
  let tokenId: string | null = null;

  try {
    const update = await request.json().catch(() => null);
    const message = update?.message ?? update?.edited_message ?? update?.callback_query?.message;

    const chatIdValue = message?.chat?.id ?? update?.callback_query?.from?.id;
    chatId = chatIdValue ? chatIdValue.toString() : null;
    const tokenPart = extractTokenFromUpdate(update);
    if (!chatId || !tokenPart) {
      const messageText = message?.text ?? message?.caption ?? update?.callback_query?.data ?? "";
      console.warn("[telegram] Missing token or chat in update", {
        chatId,
        messageText,
        hasCallback: !!update?.callback_query,
      });
      return new Response("ignored", { status: 200 });
    }

    const parsed = verifySignedVerificationToken(tokenPart);
    tokenId = parsed?.tokenId ?? null;
    if (!parsed) {
      console.warn("[telegram] Token failed signature/format check", { chatId });
      return new Response("ignored", { status: 200 });
    }

    const tokenHash = crypto.createHash("sha256").update(parsed.token).digest("hex");
    const loginToken = await prisma.loginToken.findUnique({ include: { agent: true }, where: { id: parsed.tokenId } });
    if (!loginToken || !loginToken.agent) {
      console.warn("[telegram] Token not found", { chatId, tokenId: parsed.tokenId });
      return new Response("ignored", { status: 200 });
    }

    if (loginToken.tokenHash !== tokenHash) {
      console.warn("[telegram] Token hash mismatch", { chatId, tokenId: parsed.tokenId });
      return new Response("ignored", { status: 200 });
    }

    if (loginToken.expiresAt.getTime() < Date.now()) {
      console.warn("[telegram] Token expired", { chatId, tokenId: parsed.tokenId });
      return new Response("ignored", { status: 200 });
    }

    await prisma.$transaction([
      prisma.loginToken.update({
        where: { id: loginToken.id },
        data: { consumedAt: new Date(), expiresAt: new Date(Date.now() + SESSION_LIFETIME_MS) },
      }),
      prisma.agentAccount.update({
        where: { userId: loginToken.agentId },
        data: { telegramChatId: chatId },
      }),
      prisma.loginAudit.create({
        data: {
          agentId: loginToken.agentId,
          status: "verified",
          note: `chat:${chatId}`,
        },
      }),
    ]);

    console.info("[telegram] Token verified", { chatId, tokenId: parsed.tokenId, agentId: loginToken.agentId });
    return new Response("ok", { status: 200 });
  } catch (error) {
    console.error("[telegram] Error handling update", { chatId, tokenId, error });
    return new Response("ignored", { status: 200 });
  }
}
