import { addKnowledgeFile } from "@/ai/knowledge-store";

export async function POST(request: Request) {
  const { vectorStoreId, fileId, attributes } = await request.json();
  console.log(
    `Adding file ${fileId} with attributes ${JSON.stringify(attributes)}`
  );
  try {
    const vectorStore = await addKnowledgeFile(
      vectorStoreId,
      fileId,
      attributes
    );
    return new Response(JSON.stringify(vectorStore), { status: 200 });
  } catch (error) {
    console.error("Error adding file:", error);
    return new Response(
      error instanceof Error ? error.message : "Error adding file",
      { status: 500 }
    );
  }
}
