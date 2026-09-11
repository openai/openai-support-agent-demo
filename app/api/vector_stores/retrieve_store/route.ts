import { retrieveKnowledgeStore } from "@/ai/knowledge-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vectorStoreId = searchParams.get("vector_store_id");
  try {
    const vectorStore = await retrieveKnowledgeStore(vectorStoreId || "");
    return new Response(JSON.stringify(vectorStore), { status: 200 });
  } catch (error) {
    console.error("Error fetching vector store:", error);
    return new Response("Error fetching vector store", { status: 500 });
  }
}
