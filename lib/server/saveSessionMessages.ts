import prisma from "@/lib/prisma";
import redis from "@/lib/redis";
import { summarizeSession } from "@/lib/server/summarizeSession";
import {
  MAX_UNSUMMARIZED_MESSAGES,
  LARGE_MESSAGE_THRESHOLD,
} from "@/config/constants";

// Cached session messages expire after 24 hours to allow cleanup.

export async function saveSessionMessages(
  session_id: string,
  messages: any[]
) {
  if (!Array.isArray(messages)) {
    return { error: "Messages must be an array" };
  }
  try {
    const session = await prisma.chatSession.findUnique({
      where: { id: session_id },
      select: {
        messages: true,
        summary: true,
        lastSummarizedIndex: true,
        unsummarizedLimit: true,
      },
    });
    if (!session) {
      return { error: "Session not found" };
    }

    const lastSummarizedIndex = (session as any)?.lastSummarizedIndex ?? 0;
    const existingMessages = Array.isArray(session.messages)
      ? (session.messages as any[]).slice(lastSummarizedIndex)
      : [];
    let summary = (session as any)?.summary ?? null;
    let unsummarizedLimit =
      (session as any)?.unsummarizedLimit ?? MAX_UNSUMMARIZED_MESSAGES;

    const existingIds = new Set(
      existingMessages.map((m: any) => m.id).filter(Boolean)
    );

    const dedupedMessages: any[] = [];
    let lastMessage = existingMessages[existingMessages.length - 1];
    let duplicateDetected = false;

    const messageSize = (msg: any) =>
      Array.isArray(msg?.content)
        ? msg.content.reduce(
            (t: number, c: any) => t + (c.text ? c.text.length : 0),
            0
          )
        : 0;
    let lastSize = lastMessage ? messageSize(lastMessage) : 0;

    for (const msg of messages) {
      if (msg.id && existingIds.has(msg.id)) {
        duplicateDetected = true;
        continue;
      }
      if (
        lastMessage &&
        msg.role === lastMessage.role &&
        JSON.stringify(msg.content) === JSON.stringify(lastMessage.content)
      ) {
        duplicateDetected = true;
        continue;
      }
      const size = messageSize(msg);
      if (lastSize > LARGE_MESSAGE_THRESHOLD && size > LARGE_MESSAGE_THRESHOLD) {
        unsummarizedLimit = Math.max(1, unsummarizedLimit - 1);
      }
      dedupedMessages.push(msg);
      lastMessage = msg;
      lastSize = size;
      if (msg.id) {
        existingIds.add(msg.id);
      }
    }

    let updatedMessages = [...existingMessages, ...dedupedMessages];

    if (updatedMessages.length > unsummarizedLimit) {
      const overflow = updatedMessages.length - unsummarizedLimit;
      const messagesToSummarize = updatedMessages.slice(0, overflow);
      const summaryFragment = await summarizeSession({
        priorSummary: summary,
        newMessages: messagesToSummarize,
      });
      summary = [summary, summaryFragment].filter(Boolean).join("\n");
      updatedMessages = updatedMessages.slice(-unsummarizedLimit);
      await redis.set(
        `session:${session_id}:summary`,
        summary,
        "EX",
        86400
      );
    }

    await prisma.chatSession.update({
      where: { id: session_id },
      data: {
        messages: updatedMessages,
        summary,
        lastSummarizedIndex: 0,
        unsummarizedLimit,
      },
    });

    await redis.set(
      `session:${session_id}:messages`,
      JSON.stringify(updatedMessages),
      "EX",
      86400
    );

    if (duplicateDetected) {
      return { error: "Duplicate messages detected" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error saving session messages:", error);
    throw error;
  }
}
