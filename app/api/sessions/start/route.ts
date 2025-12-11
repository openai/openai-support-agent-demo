import prisma from "@/lib/prisma";
import redis from "@/lib/redis";
import { MAX_SESSION_MESSAGES } from "@/config/constants";
import { summarizeSession } from "@/lib/server/summarizeSession";

// Session message caches expire after 24 hours for cleanup.

export async function POST(request: Request) {
  try {
    const { email, ticket_id, name, phone, address } = await request.json();

    const identifier = email || ticket_id;

    if (!identifier) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
      });
    }

    const user = await prisma.user.upsert({
      where: { email: identifier },
      update: { name, phone, address },
      create: { email: identifier, name, phone, address },
      include: { orders: true },
    });

    const sessionSelect = {
      id: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      endedAt: true,
      summary: true,
      lastSummarizedIndex: true,
      unsummarizedLimit: true,
    } as const;

    let session = await prisma.chatSession.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: sessionSelect,
    });

    if (!session) {
      session = await prisma.chatSession.create({
        data: { userId: user.id, messages: [] },
        select: sessionSelect,
      });
      await redis.set(
        `session:${session.id}:messages`,
        JSON.stringify([]),
        "EX",
        86400
      );
    }

    let messages: any[] = [];
    const cachedMessages = await redis.get(`session:${session.id}:messages`);
    if (cachedMessages) {
      messages = JSON.parse(cachedMessages);
    } else {
      const sessionWithMessages = await prisma.chatSession.findUnique({
        where: { id: session.id },
        select: { messages: true },
      });
      messages = (sessionWithMessages?.messages as any[]) || [];
      await redis.set(
        `session:${session.id}:messages`,
        JSON.stringify(messages),
        "EX",
        86400
      );
    }

    let summary = session.summary;
    if (!summary) {
      summary = await redis.get(`session:${session.id}:summary`);
    }

    let lastSummarizedIndex = (session as any)?.lastSummarizedIndex ?? 0;
    const unsummarized = messages.slice(lastSummarizedIndex);
    const contextMessages = unsummarized.slice(-MAX_SESSION_MESSAGES);
    const messagesToSummarize = unsummarized.slice(0, unsummarized.length - contextMessages.length);
    if (messagesToSummarize.length > 0) {
      const newSummary = await summarizeSession({
        priorSummary: summary,
        newMessages: messagesToSummarize,
      });
      summary = [summary, newSummary].filter(Boolean).join("\n");
      lastSummarizedIndex = messages.length - contextMessages.length;
      await prisma.chatSession.update({
        where: { id: session.id },
        data: { summary, lastSummarizedIndex },
      });
      await redis.set(`session:${session.id}:summary`, summary, "EX", 86400);
      await redis.set(
        `session:${session.id}:messages`,
        JSON.stringify(messages),
        "EX",
        86400
      );
    }

    if (summary) {
      await redis.set(identifier, summary, "EX", 86400);
    } else {
      summary = await redis.get(identifier);
    }

    const trimmedSession = {
      ...session,
      summary,
      messages: contextMessages,
    };

    return new Response(
      JSON.stringify({
        user,
        session: trimmedSession,
        summary,
        longSummary: user.longSummary ?? null,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error starting session:", error);
    return new Response("Error starting session", { status: 500 });
  }
}
