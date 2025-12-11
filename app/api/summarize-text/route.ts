import { NextResponse } from "next/server";
import { summarizeText } from "@/lib/server/summarizeText";

export async function POST(request: Request) {
  try {
    const { text, maxTokens } = await request.json();
    if (typeof text !== "string") {
      return NextResponse.json({ error: "Invalid text" }, { status: 400 });
    }
    const summary = await summarizeText(text, maxTokens);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error summarizing text:", error);
    return NextResponse.json(
      { error: "Failed to summarize text" },
      { status: 500 }
    );
  }
}
