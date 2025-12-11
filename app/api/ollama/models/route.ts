import { NextResponse } from "next/server";
import ollama from "ollama";

const host = process.env.OLLAMA_HOST || process.env.OLLAMA_OPENAI_BASE_URL;
if (host) {
  try {
    (ollama as any).defaults = { ...(ollama as any).defaults, host };
  } catch {
    try {
      (ollama as any).config.host = host;
    } catch {}
  }
}

export async function GET() {
  try {
    const models = await ollama.list();
    return NextResponse.json(models);
  } catch (error) {
    console.error("Error listing models:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
