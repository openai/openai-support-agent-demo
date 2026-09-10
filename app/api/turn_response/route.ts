import {
  aiClient,
  aiModel,
  getResponseProviderOptions,
} from "@/ai/client";
import { NextResponse } from "next/server";
import { APIError } from "openai";

export async function POST(request: Request) {
  try {
    const { messages, tools } = await request.json();
    console.log("Received messages:", messages);

    const providerOptions = getResponseProviderOptions(tools);
    const events = await aiClient.responses.create({
      model: aiModel,
      input: messages,
      ...providerOptions,
      stream: true,
      parallel_tool_calls: false,
    });

    // Create a ReadableStream that emits SSE data
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of events) {
            // Sending all events to the client
            const data = JSON.stringify({
              event: event.type,
              data: event,
            });
            controller.enqueue(`data: ${data}\n\n`);
          }
          // End of stream
          controller.close();
        } catch (error) {
          console.error("Error in streaming loop:", error);
          controller.error(error);
        }
      },
    });

    // Return the ReadableStream as SSE
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in POST handler:", error);

    const status = error instanceof APIError ? error.status : 500;
    const providerMessage =
      error instanceof APIError &&
      error.error &&
      typeof error.error === "object" &&
      "message" in error.error &&
      typeof error.error.message === "string"
        ? error.error.message
        : undefined;

    return NextResponse.json(
      {
        error:
          providerMessage ??
          (error instanceof Error ? error.message : "Unknown error"),
      },
      { status }
    );
  }
}
