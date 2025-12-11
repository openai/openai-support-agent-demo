import { updateConversationCustomAttributes } from "@/lib/chatwoot";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object") {
      return new Response("Invalid complaint payload", { status: 400 });
    }

    const customAttributesRaw =
      "custom_attributes" in body
        ? (body as Record<string, unknown>).custom_attributes
        : undefined;
    if (!customAttributesRaw || typeof customAttributesRaw !== "object") {
      return new Response("Missing custom_attributes", { status: 400 });
    }

    const customAttributes = customAttributesRaw as Record<string, unknown>;

    const accountId = Number((body as Record<string, unknown>).account_id);
    const conversationId = Number(
      (body as Record<string, unknown>).conversation_id
    );
    const hasAccountId = Number.isFinite(accountId);
    const hasConversationId = Number.isFinite(conversationId);

    if (!hasAccountId || !hasConversationId) {
      console.warn(
        "[chatwoot] complaints API missing identifiers; returning payload without Chatwoot update"
      );
      return new Response(
        JSON.stringify({
          status: "pending",
          custom_attributes: customAttributes,
        }),
        { status: 200 }
      );
    }

    const chatwootResponse = await updateConversationCustomAttributes(
      accountId,
      conversationId,
      customAttributes
    );

    const responseAttributes =
      chatwootResponse &&
      typeof chatwootResponse === "object" &&
      "custom_attributes" in chatwootResponse &&
      chatwootResponse.custom_attributes &&
      typeof chatwootResponse.custom_attributes === "object"
        ? (chatwootResponse.custom_attributes as Record<string, unknown>)
        : customAttributes;

    return new Response(
      JSON.stringify({
        status: "updated",
        custom_attributes: responseAttributes,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating complaint:", error);
    return new Response("Error creating complaint", { status: 500 });
  }
}
