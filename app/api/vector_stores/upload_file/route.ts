import { aiClient } from "@/ai/client";
import fs from "fs";
import path from "path";
export async function POST(request: Request) {
  const { filePath } = await request.json();

  try {
    const workingDir = process.cwd();
    const fileContent = fs.createReadStream(path.join(workingDir, filePath));
    const file = await aiClient.files.create({
      file: fileContent,
      purpose: "assistants",
    });

    return new Response(JSON.stringify(file), { status: 200 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return new Response("Error uploading file", { status: 500 });
  }
}
