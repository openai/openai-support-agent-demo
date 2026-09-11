import { uploadKnowledgeFile } from "@/ai/knowledge-store";

export async function POST(request: Request) {
  const { filePath } = await request.json();

  try {
    const file = await uploadKnowledgeFile(filePath);

    return new Response(JSON.stringify(file), { status: 200 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return new Response("Error uploading file", { status: 500 });
  }
}
