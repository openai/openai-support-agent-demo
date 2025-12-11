import prisma from "@/lib/prisma";
import redis from "@/lib/redis";
import { saveSessionMessages } from "@/lib/server/saveSessionMessages";
import { summarizeSession } from "@/lib/server/summarizeSession";
import { MAX_UNSUMMARIZED_MESSAGES } from "@/config/constants";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ session_id: string }> }
) {
  try {
    const { session_id } = await params;
    const { messages = [], identifier } = await request.json();

    if (Array.isArray(messages) && messages.length > 0) {
      const result = await saveSessionMessages(session_id, messages);
      if (result && "error" in result) {
        return new Response(JSON.stringify({ error: result.error }), {
          status: 400,
        });
      }
    }

    const session = await prisma.chatSession.findUnique({
      where: { id: session_id },
      include: { user: true },
    });
    const sessionMessages = Array.isArray(session?.messages)
      ? (session!.messages as any[])
      : [];
    const startIndex = (session as any)?.lastSummarizedIndex ?? 0;
    const newMessages = sessionMessages.slice(startIndex);
    const newSummary = await summarizeSession({
      priorSummary: (session as any)?.summary ?? null,
      newMessages,
    });
    const summary = [(session as any)?.summary, newSummary]
      .filter(Boolean)
      .join("\n");

    await redis.set(`session:${session_id}:summary`, summary, "EX", 86400);

    const limit =
      (session as any)?.unsummarizedLimit ?? MAX_UNSUMMARIZED_MESSAGES;
    const remainingMessages: any[] = sessionMessages
      .slice(startIndex + newMessages.length)
      .slice(-limit);
    await prisma.chatSession.update({
      where: { id: session_id },
      data: {
        endedAt: new Date(),
        summary,
        lastSummarizedIndex: 0,
        messages: remainingMessages,
        unsummarizedLimit: MAX_UNSUMMARIZED_MESSAGES,
      },
    });
    await redis.set(
      `session:${session_id}:messages`,
      JSON.stringify(remainingMessages),
      "EX",
      86400
    );

    const longSummaryFragment = await summarizeSession({
      priorSummary: (session as any)?.user?.longSummary ?? null,
      newMessages: [
        {
          role: "assistant",
          content: [{ type: "output_text", text: newSummary }],
        },
      ],
    });
    const longSummary = [(session as any)?.user?.longSummary, longSummaryFragment]
      .filter(Boolean)
      .join("\n");

    await prisma.user.update({
      where: { id: (session as any)?.userId },
      data: { longSummary },
    });

    if (identifier) {
      await redis.set(identifier, summary, "EX", 86400);
    }

    return new Response(JSON.stringify({ success: true, summary, longSummary }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error ending session:", error);
    return new Response("Error ending session", { status: 500 });
  }
}
