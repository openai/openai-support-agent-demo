import { NextResponse } from "next/server";
import { localVectorStore } from "@/lib/localVectorStore";
import { clearFileSearchCache } from "@/config/functions";

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const force = url.searchParams.get("force") === "true";
    await localVectorStore.initialize({ force });
    clearFileSearchCache();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error initializing local vector store:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
