import "dotenv/config";
import prisma from "@/lib/prisma";
import { summarizeSession } from "@/lib/server/summarizeSession";
import { MAX_UNSUMMARIZED_MESSAGES } from "@/config/constants";

export async function run() {
  const sessions = await prisma.chatSession.findMany({ include: { user: true } });
  for (const s of sessions) {
    const messages = Array.isArray(s.messages) ? (s.messages as any[]) : [];
    const startIndex = (s as any)?.lastSummarizedIndex ?? 0;
    let summary = (s as any)?.summary ?? null;
    let unsummarized = messages.slice(startIndex);
    const limit =
      (s as any)?.unsummarizedLimit ?? MAX_UNSUMMARIZED_MESSAGES;
    let summaryUpdated = false;
    if (startIndex > 0 || unsummarized.length > limit) {
      if (unsummarized.length > limit) {
        const toSummarize = unsummarized.slice(0, unsummarized.length - limit);
        if (toSummarize.length > 0) {
          const fragment = await summarizeSession({
            priorSummary: summary,
            newMessages: toSummarize,
          });
          summary = [summary, fragment].filter(Boolean).join("\n");
          summaryUpdated = true;
          unsummarized = unsummarized.slice(-limit);
        }
      }
      await prisma.chatSession.update({
        where: { id: s.id },
        data: { messages: unsummarized, summary, lastSummarizedIndex: 0 },
      });
      if (summaryUpdated) {
        const longFragment = await summarizeSession({
          priorSummary: (s as any)?.user?.longSummary,
          newMessages: [
            {
              role: "assistant",
              content: [{ type: "output_text", text: summary }],
            },
          ],
        });
        const longSummary = [
          (s as any)?.user?.longSummary,
          longFragment,
        ]
          .filter(Boolean)
          .join("\n");
        await prisma.user.update({
          where: { id: s.userId },
          data: { longSummary },
        });
      }
    }
  }
}

if (require.main === module) {
  run()
    .catch((err) => {
      console.error("Prune failed", err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
