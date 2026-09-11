import { createKnowledgeStore } from "@/ai/knowledge-store";

export async function POST(request: Request) {
  const { name } = await request.json();
  try {
    const vectorStore = await createKnowledgeStore(name);
    console.log("Vector store created:", vectorStore);
    return new Response(JSON.stringify(vectorStore), { status: 200 });
  } catch (error) {
    console.error("Error creating vector store:", error);
    return new Response(
      error instanceof Error ? error.message : "Error creating vector store",
      { status: 500 }
    );
  }
}
