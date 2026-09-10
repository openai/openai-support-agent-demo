import { aiClient } from "@/ai/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vectorStoreId = searchParams.get("vectorStoreId") ?? "";
  const fileId = searchParams.get("fileId") ?? "";
  try {
    const fileContent = await aiClient.vectorStores.files.retrieve(
      vectorStoreId,
      fileId
    );
    return new Response(JSON.stringify(fileContent), { status: 200 });
  } catch (error) {
    console.error("Error retrieving file:", error);
    return new Response("Error retrieving file", { status: 500 });
  }
}
