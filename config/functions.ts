// Functions mapping to tool calls
// Define one function per tool call - each tool call should have a matching function
// Parameters for a tool call are passed as an object to the corresponding function
import useDataStore from "@/stores/useDataStore";
import useConversationStore from "@/stores/useConversationStore";
import {
  submitChatwootComplaint,
  type CreateComplaintArgs,
} from "@/lib/chatwoot/complaintSubmission";
interface SearchKnowledgeBaseResponse {
  results?: any[] | string[];
  error?: string;
}

// simple in-memory cache for file search results
const fileSearchCache = new Map<string, SearchKnowledgeBaseResponse["results"]>();

export function clearFileSearchCache() {
  fileSearchCache.clear();
}

const setDetailsFromUser = (user: any) => ({
  id: user.id,
  name: user.name ?? "",
  email: user.email ?? "",
  phone: user.phone ?? "",
  address: user.address ?? "",
  signupDate: user.createdAt
    ? new Date(user.createdAt).toISOString().split("T")[0]
    : "",
  orderNb: user.orders ? user.orders.length : 0,
});

export const get_order = async ({ order_id }: { order_id: string }) => {
  try {
    const res = await fetch(`/api/orders/${order_id}`).then((res) =>
      res.json()
    );
    return res;
  } catch (error) {
    console.error(error);
    return { error: "Failed to get order" };
  }
};

export const get_order_history = async ({ user_id }: { user_id: string }) => {
  try {
    const res = await fetch(`/api/users/${user_id}/order_history`).then((res) =>
      res.json()
    );
    return res;
  } catch (error) {
    console.error(error);
    return { error: "Failed to get order history" };
  }
};

export const cancel_order = async ({ order_id }: { order_id: string }) => {
  try {
    const res = await fetch(`/api/orders/${order_id}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
    return res;
  } catch (error) {
    console.error(error);
    return { error: "Failed to cancel order" };
  }
};

export const reset_password = async ({ user_id }: { user_id: string }) => {
  try {
    const res = await fetch(`/api/users/${user_id}/reset_password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }).then((res) => res.json());
    return res;
  } catch (error) {
    console.error(error);
    return { error: "Failed to reset password" };
  }
};

export const send_replacement = async ({
  product_id,
  order_id,
}: {
  product_id: string;
  order_id: string;
}) => {
  try {
    const res = await fetch(`/api/orders/${order_id}/send_replacement`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id }),
    }).then((res) => res.json());
    return res;
  } catch (error) {
    console.error(error);
    return { error: "Failed to send replacement" };
  }
};

export const create_refund = async ({
  order_id,
  amount,
  reason,
}: {
  order_id: string;
  amount: number;
  reason: string;
}) => {
  try {
    const res = await fetch(`/api/orders/${order_id}/create_refund`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, reason }),
    }).then((res) => res.json());
    return res;
  } catch (error) {
    console.error(error);
    return { error: "Failed to create refund" };
  }
};

export const issue_voucher = async ({
  user_id,
  amount,
  reason,
}: {
  user_id: string;
  reason: string;
  amount: number;
}) => {
  try {
    const res = await fetch(`/api/vouchers/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, reason, amount }),
    }).then((res) => res.json());
    return res;
  } catch (error) {
    console.error(error);
    return { error: "Failed to issue voucher" };
  }
};

export const create_return = async ({
  order_id,
  product_ids,
}: {
  order_id: string;
  product_ids: string[];
}) => {
  try {
    const res = await fetch(`/api/orders/${order_id}/create_return`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_ids }),
    }).then((res) => res.json());
    return res;
  } catch (error) {
    console.error(error);
    return { error: "Failed to create return" };
  }
};

export const create_complaint = async (args: CreateComplaintArgs) => {
  try {
    return await submitChatwootComplaint(args);
  } catch (error) {
    console.error(error);
    return {
      error:
        error instanceof Error && error.message
          ? error.message
          : "Failed to create complaint",
    };
  }
};

export const create_ticket = async () => {
  try {
    const response = await fetch(`/api/tickets/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      let message = `Request failed with status ${response.status}`;
      try {
        const err = await response.json();
        if (err?.error) message = err.error;
      } catch {
        // ignore JSON parsing errors
      }
      throw new Error(message);
    }

    const res = await response.json();
    const { setContact } = useDataStore.getState();
    if (res?.ticket_id) {
      setContact({ contactType: "ticket", contactId: res.ticket_id });
      await start_chat_session({ ticket_id: res.ticket_id });
      return `Your ticket ID is ${res.ticket_id}`;
    }
    return { error: "Failed to create ticket" };
  } catch (error: any) {
    console.error(error);
    return { error: error?.message || "Failed to create ticket" };
  }
};

export const update_info = async ({
  user_id,
  email,
  phone,
  address,
  name,
}: {
  user_id: string;
  email?: string;
  phone?: string;
  address?: string;
  name?: string;
}) => {
  try {
    const res = await fetch(`/api/users/${user_id}/update_info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, phone, address, name }),
    }).then((res) => res.json());

    if (res && res.updated) {
      const {
        customerDetails,
        setCustomerDetails,
        setContact,
      } = useDataStore.getState();
      setCustomerDetails({ ...customerDetails, ...res.updated });
      if (email) {
        setContact({ contactType: "email", contactId: email });
      }
    }

    return res;
  } catch (error) {
    console.error(error);
    return { error: "Failed to update info" };
  }
};



export const get_user_profile = async ({ email }: { email: string }) => {
  try {
    const user = await fetch(`/api/users?email=${encodeURIComponent(email)}`).then(
      (res) => res.json()
    );
    if (!user.error) {
      const { setCustomerDetails, setContact } = useDataStore.getState();
      setCustomerDetails(setDetailsFromUser(user));
      setContact({ contactType: "email", contactId: email });
    }
    return user;
  } catch (error) {
    console.error(error);
    return { error: "Failed to get user profile" };
  }
};

export const create_user_profile = async ({
  email,
  name,
  phone,
  address,
}: {
  email: string;
  name?: string;
  phone?: string;
  address?: string;
}) => {
  try {
    const user = await fetch(`/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name, phone, address }),
    }).then((res) => res.json());
    if (!user.error) {
      const { setCustomerDetails, setContact } = useDataStore.getState();
      setCustomerDetails(setDetailsFromUser(user));
      setContact({ contactType: "email", contactId: email });
    }
    return user;
  } catch (error) {
    console.error(error);
    return { error: "Failed to create user profile" };
  }
};

export const start_chat_session = async ({
  email,
  ticket_id,
  name,
  phone,
  address,
}: {
  email?: string;
  ticket_id?: string;
  name?: string;
  phone?: string;
  address?: string;
}) => {
  try {
    const identifier = email || ticket_id;

    const res = await fetch(`/api/sessions/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: identifier, ticket_id, name, phone, address }),
    }).then((res) => res.json());
    const {
      setCustomerDetails,
      setContact,
      setSummary,
      setSessionId,
      setLongSummary,
    } = useDataStore.getState();
    const { setConversationItems } =
      useConversationStore.getState();
    if (res.session?.id) {
      setSessionId(res.session.id);
    }
    if (Array.isArray(res.session?.messages) && res.session.messages.length > 0) {
      setConversationItems(res.session.messages);
      // const chatMsgs = res.session.messages
      //   .filter((m: any) => m.role === "user" || m.role === "assistant")
      //   .map((m: any) => ({
      //     type: "message",
      //     role: m.role === "assistant" ? "agent" : "user",
      //     content: Array.isArray(m.content)
      //       ? m.content
      //       : [
      //           {
      //             type: m.role === "assistant" ? "output_text" : "input_text",
      //             text: m.content,
      //           },
      //         ],
      //   }));
      // setChatMessages(chatMsgs);
    }
    if (res.user && !res.user.error) {
      setCustomerDetails(setDetailsFromUser(res.user));
      if (identifier) {
        setContact({
          contactType: email ? "email" : "ticket",
          contactId: identifier,
        });
      }
      setSummary(res.summary ?? res.session?.summary ?? null);
      setLongSummary(res.longSummary ?? res.user?.longSummary ?? null);
    }
    return {
      user: res.user,
      session: { id: res.session?.id },
      summary: res.summary ?? res.session?.summary,
      unsummarizedMessages: res.session?.messages || [],
      longSummary: res.longSummary ?? res.user?.longSummary ?? null,
    };
  } catch (error) {
    console.error(error);
    return { error: "Failed to start chat session" };
  }
};

export const set_reply_reference = async (args: {
  message_id?: number;
  use_quotes?: boolean;
  reason?: string;
}) => {
  return { ...args };
};

export const search_knowledge_base = async ({
  query,
  queries,
  limit,
  threshold,
  topKOnly,
}: {
  query: string;
  queries?: string[];
  limit?: number | string;
  threshold?: number | string;
  topKOnly?: boolean;
}): Promise<SearchKnowledgeBaseResponse> => {
  const {
    modelProvider: provider,
    lastSearchQuery,
    lastSearchResults,
    setLastSearchQuery,
    setLastSearchResults,
  } = useConversationStore.getState();
  const {
    setFAQExtracts,
    setRelevantArticlesError,
    setRelevantArticlesLoading,
  } = useDataStore.getState();

  try {
    setRelevantArticlesLoading(true);
    // Use all provided queries plus search params to build a stable cache key
    const queryKeyBase =
      Array.isArray(queries) && queries.length > 0 ? queries.join("|") : query;
    const limitNum =
      typeof limit === "string" ? parseInt(limit, 10) : limit;
    const thresholdNum =
      typeof threshold === "string" ? parseFloat(threshold) : threshold;
    const queryKey = [
      queryKeyBase,
      limitNum,
      thresholdNum,
      topKOnly,
    ]
      .filter((v) => v !== undefined)
      .join("|");
    if (lastSearchQuery === queryKey && lastSearchResults) {
      setFAQExtracts(lastSearchResults, provider);
      setRelevantArticlesError(null);
      return { results: lastSearchResults };
    }

    if (fileSearchCache.has(queryKey)) {
      const cached = fileSearchCache.get(queryKey)!;
      setFAQExtracts(cached, provider);
      setLastSearchQuery(queryKey);
      setLastSearchResults(cached);
      setRelevantArticlesError(null);
      return { results: cached };
    }

    const result: SearchKnowledgeBaseResponse = await fetch(
      "/api/search-knowledge-base",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          queries,
          provider,
          limit: limitNum,
          threshold: thresholdNum,
          topKOnly,
        }),
      }
    ).then((res) => res.json());
    if (result.results) {
      setFAQExtracts(result.results, provider);
      setLastSearchQuery(queryKey);
      setLastSearchResults(result.results);
      fileSearchCache.set(queryKey, result.results);
      setRelevantArticlesError(null);
    } else if (result.error) {
      setRelevantArticlesError(result.error);
    }
    return result;
  } finally {
    setRelevantArticlesLoading(false);
  }
};

export const functionsMap = {
  get_order: get_order,
  get_order_history: get_order_history,
  cancel_order: cancel_order,
  reset_password: reset_password,
  send_replacement: send_replacement,
  create_refund: create_refund,
  issue_voucher: issue_voucher,
  create_return: create_return,
  create_complaint: create_complaint,
  update_info: update_info,
  create_ticket: create_ticket,
  get_user_profile: get_user_profile,
  create_user_profile: create_user_profile,
  start_chat_session: start_chat_session,
  set_reply_reference: set_reply_reference,
  search_knowledge_base: search_knowledge_base,
  // add more functions as needed
};
