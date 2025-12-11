import OpenAI from "openai";
import type { EasyInputMessage } from "openai/resources/responses";
import cleanMarkdown from "../cleanMarkdown";

type SummaryMessage = {
  type: "message";
  role: "user" | "assistant";
  content: [{ type: "input_text" | "output_text"; text: string }];
};

export async function summarizeSession({
  priorSummary,
  newMessages,
}: {
  priorSummary?: string | null;
  newMessages: any[];
}): Promise<string> {
  if (!Array.isArray(newMessages) || newMessages.length === 0) {
    return "";
  }

  const openai = new OpenAI();
  const prompt =
    "Summarize the following new messages in 3–5 bullet points, capturing the user's issue/questions asked, actions taken, and pending follow-ups.";

  const summaryIntro: SummaryMessage[] = priorSummary
    ? [
        {
          type: "message",
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Previous conversation summary: ${priorSummary}`,
            },
          ],
        },
      ]
    : [];

  const filteredMessages: SummaryMessage[] = newMessages
    .filter(
      (m): m is { role: "user" | "assistant"; content: any } =>
        m && (m.role === "user" || m.role === "assistant"),
    )
    .map(({ role, content }): SummaryMessage => {
      const textContent = Array.isArray(content)
        ? content.map((p: any) => (typeof p === "string" ? p : p?.text ?? "")).join(" ")
        : typeof content === "string"
          ? content
          : content?.text ?? String(content ?? "");
      return {
        type: "message",
        role,
        content: [
          { type: role === "user" ? "input_text" : "output_text", text: textContent },
        ],
      };
    });

  const extraPrompt: EasyInputMessage = {
    type: "message",
    role: "user",
    content: [{ type: "input_text", text: prompt }],
  };

  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [...summaryIntro, ...filteredMessages, extraPrompt] as EasyInputMessage[],
  });

  const text = response.output_text ?? "";
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const cleaned = lines
    .map((line) => line.replace(/^[-*•]\s*/, ""))
    .map((line) => `- ${cleanMarkdown(line).trim()}`);

  return cleaned.join("\n");
}

