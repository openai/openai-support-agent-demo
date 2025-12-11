import { search_knowledge_base } from "@/lib/server/searchFiles";

export async function POST(request: Request) {
  try {
    const params = await request.json();
    const result = await search_knowledge_base(params);
    return Response.json(result);
  } catch (error) {
    console.error("Error searching knowledge base:", error);
    return new Response("Failed to search knowledge base", { status: 500 });
  }
}
