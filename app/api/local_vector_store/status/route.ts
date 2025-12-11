import { NextResponse } from "next/server";
import { localVectorStore } from "@/lib/localVectorStore";

export async function GET() {
  try {
    const status = await localVectorStore.getStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error("Error fetching local vector store status:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
