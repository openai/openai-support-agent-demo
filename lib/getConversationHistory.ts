import prisma from "@/lib/prisma";
import redis from "@/lib/redis";
import { toResponseMessage, type ResponseMessage } from "@/lib/utils/toResponseMessage";

export async function getConversationHistory(
  conversationKey: string,
  limit = 20
): Promise<ResponseMessage[]> {
  try {
    if (typeof (redis as any)?.lrange === "function") {
      const entries = await redis.lrange(conversationKey, -limit, -1);
      if (Array.isArray(entries) && entries.length) {
        return entries
          .map((e: string) => {
            try {
              const m = JSON.parse(e);
              return toResponseMessage(
                m.sender === "bot" ? "assistant" : "user",
                m.content
              );
            } catch {
              return null;
            }
          })
          .filter(Boolean) as ResponseMessage[];
      }
    }
  } catch {
    // ignore redis errors
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const messages = await prisma.conversationMessage.findMany({
    where: { conversationKey, createdAt: { gte: since } },
    orderBy: { messageId: "desc" },
    take: limit,
  });
  return messages
    .reverse()
    .map((m) =>
      toResponseMessage(m.sender === "bot" ? "assistant" : "user", m.content)
    );
}
