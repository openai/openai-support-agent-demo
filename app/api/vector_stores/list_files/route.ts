import { listKnowledgeFiles } from "@/ai/knowledge-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vectorStoreId = searchParams.get("vectorStoreId");

  try {
    const vectorStore = await listKnowledgeFiles(vectorStoreId || "");
    return new Response(JSON.stringify(vectorStore), { status: 200 });
  } catch (error) {
    console.error("Error fetching files:", error);
    return new Response("Error fetching files", { status: 500 });
  }
}
