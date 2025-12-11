import {
  CHATWOOT_COMPLAINT_TYPES,
  CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS,
} from "./chatwootAttributes";

const {
  customerName: CHATWOOT_CUSTOMER_NAME,
  companyName: CHATWOOT_COMPANY_NAME,
  companyLocation: CHATWOOT_COMPANY_LOCATION,
  contact: CHATWOOT_CONTACT,
  complaintType: CHATWOOT_COMPLAINT_TYPE,
  issueDescription: CHATWOOT_ISSUE_DESCRIPTION,
} = CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS;

// List of tools available to the agent
// No need to include the top-level wrapper object as it is added in lib/tools/tools.ts
// More information on function calling: https://platform.openai.com/docs/guides/function-calling

export const toolsList = [
  {
    type: "function",
    function: {
      name: "search_knowledge_base",
      description: "Query the knowledge base to retrieve relevant info on a topic.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The user question or search query.",
          },
          queries: {
            type: "array",
            description:
              "Optional list of search queries derived from the user question.",
            items: { type: "string" },
          },
          limit: {
            type: "number",
            description: "Maximum number of results to return. Defaults to 10.",
          },
          threshold: {
            type: "number",
            description:
              "Minimum cosine similarity score. Ignored when topKOnly is true.",
          },
          topKOnly: {
            type: "boolean",
            description:
              "Return only the top `limit` matches, bypassing the threshold.",
          },
        },
        required: ["query"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_order",
      description: "Fetch details for a specific order",
      parameters: {
        type: "object",
        properties: {
          order_id: {
            type: "string",
            description: "Order ID to get details for",
          },
        },
        required: ["order_id"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_order_history",
      description: "Retrieve a user's past orders",
      parameters: {
        type: "object",
        properties: {
          user_id: {
            type: "string",
            description: "User ID to get order history for",
          },
        },
        required: ["user_id"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "cancel_order",
      description: "Cancel a customer's order",
      parameters: {
        type: "object",
        properties: {
          order_id: {
            type: "string",
            description: "Order ID to cancel",
          },
        },
        required: ["order_id"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "reset_password",
      description: "Send a password reset email to a user",
      parameters: {
        type: "object",
        properties: {
          user_id: {
            type: "string",
            description: "User ID to send password reset email to",
          },
        },
        required: ["user_id"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "send_replacement",
      description: "Ship a replacement product for an order",
      parameters: {
        type: "object",
        properties: {
          product_id: {
            type: "string",
            description: "Product ID to send replacement for",
          },
          order_id: {
            type: "string",
            description: "Order ID to send replacement for",
          },
        },
        required: ["product_id", "order_id"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_refund",
      description: "Issue a refund for an order",
      parameters: {
        type: "object",
        properties: {
          order_id: {
            type: "string",
            description: "Order ID to create refund for",
          },
          amount: {
            type: "number",
            description: "Amount to refund",
          },
          reason: {
            type: "string",
            description: "Reason for refund",
          },
        },
        required: ["order_id", "amount", "reason"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "issue_voucher",
      description: "Provide a voucher credit to a user",
      parameters: {
        type: "object",
        properties: {
          user_id: {
            type: "string",
            description: "User ID to issue voucher for",
          },
          amount: {
            type: "number",
            description: "Amount to issue voucher for",
          },
          reason: {
            type: "string",
            description: "Reason for issuing voucher",
          },
        },
        required: ["user_id", "amount", "reason"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_return",
      description: "Initiate a product return",
      parameters: {
        type: "object",
        properties: {
          order_id: {
            type: "string",
            description: "Order ID to create return for",
          },
          product_ids: {
            type: "array",
            description: "Product IDs to create return for",
            items: { type: "string" },
          },
        },
        required: ["order_id", "product_ids"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_complaint",
      description: "Register a customer complaint",
      parameters: {
        type: "object",
        properties: {
          [CHATWOOT_CUSTOMER_NAME]: {
            type: "string",
            description: "Customer's full name",
          },
          [CHATWOOT_COMPANY_NAME]: {
            type: "string",
            description: "Company or organization name",
          },
          [CHATWOOT_COMPANY_LOCATION]: {
            type: "string",
            description: "Company location or branch",
          },
          [CHATWOOT_CONTACT]: {
            type: "string",
            description: "Preferred contact method (email or phone)",
          },
          [CHATWOOT_COMPLAINT_TYPE]: {
            type: "string",
            description: "Complaint category selected by the customer",
            enum: [...CHATWOOT_COMPLAINT_TYPES],
          },
          [CHATWOOT_ISSUE_DESCRIPTION]: {
            type: "string",
            description: "Detailed description of the reported issue",
          },
        },
        required: [
          CHATWOOT_CUSTOMER_NAME,
          CHATWOOT_COMPANY_NAME,
          CHATWOOT_COMPANY_LOCATION,
          CHATWOOT_CONTACT,
          CHATWOOT_COMPLAINT_TYPE,
          CHATWOOT_ISSUE_DESCRIPTION,
        ],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "send_complaint_form",
      description:
        "Send the Chatwoot complaint intake form so the customer can populate the configured conversation attributes.",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description:
              "Optional heading to display at the top of the form. Defaults to \"Complaint intake form\".",
          },
          defaults: {
            type: "object",
            description:
              "Prefill any known values. Keys must match the Chatwoot conversation attribute names for the complaint form.",
            properties: {
              [CHATWOOT_CUSTOMER_NAME]: {
                type: "string",
                description: "Customer's full name.",
              },
              [CHATWOOT_COMPANY_NAME]: {
                type: "string",
                description: "Company or organization name.",
              },
              [CHATWOOT_COMPANY_LOCATION]: {
                type: "string",
                description: "Company location or region.",
              },
              [CHATWOOT_CONTACT]: {
                type: "string",
                description: "Primary contact method (email or phone).",
              },
              [CHATWOOT_COMPLAINT_TYPE]: {
                type: "string",
                description: "Complaint category to preselect, if known.",
                enum: [...CHATWOOT_COMPLAINT_TYPES],
              },
              [CHATWOOT_ISSUE_DESCRIPTION]: {
                type: "string",
                description: "Details of the reported issue.",
              },
            },
            additionalProperties: false,
          },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_ticket",
      description:
        "Generate a session ticket for customers without an email.",
      parameters: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_info",
      description: "Update stored user information",
      parameters: {
        type: "object",
        properties: {
          user_id: {
            type: "string",
            description: "User ID to update information for",
          },
          email: { type: "string", description: "New email", nullable: true },
          phone: { type: "string", description: "New phone", nullable: true },
          address: { type: "string", description: "New address", nullable: true },
          name: { type: "string", description: "New name", nullable: true },
        },
        required: ["user_id", "email", "phone", "address", "name"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_user_profile",
      description: "Look up an existing customer profile by email",
      parameters: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "Email address of the customer",
          },
        },
        required: ["email"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_user_profile",
      description: "Create a new customer profile",
      parameters: {
        type: "object",
        properties: {
          email: { type: "string", description: "Email address of the customer" },
          name: { type: "string", description: "Full name of the customer" },
          phone: { type: "string", description: "Phone number" },
          address: { type: "string", description: "Street address" },
        },
        required: ["email", "name", "phone", "address"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "start_chat_session",
      description:
        "Reconnect to an existing chat session using either the customer's email or a ticket ID, or create a new one",
      parameters: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description:
              "Email address of the customer (required if ticket_id is not provided)",
          },
          ticket_id: {
            type: "string",
            description:
              "Ticket ID of an existing session (required if email is not provided)",
          },
          name: { type: "string", description: "Full name of the customer" },
          phone: { type: "string", description: "Phone number" },
          address: { type: "string", description: "Street address" },
        },
        // At least one of email or ticket_id must be provided
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "set_reply_reference",
      description:
        "Control whether the next reply quotes a specific customer message. When use_quotes is false and no message_id is provided, quoting is skipped entirely.",
      parameters: {
        type: "object",
        properties: {
          message_id: {
            type: "number",
            description:
              "ID of the customer message to quote. Omit to clear any existing reference.",
          },
          use_quotes: {
            type: "boolean",
            description:
              "Set to false to disable quoting. When false and message_id is omitted, the assistant will not quote any message.",
          },
          reason: {
            type: "string",
            description: "Optional explanation for updating the reply reference.",
          },
        },
        additionalProperties: false,
      },
    },
  },
  // add more tools as needed
];

// Tools that will need to be confirmed by the human representative before execution
// Ex: "get_order" and "create_ticket" are low-risk so they can be automatically executed
export const agentTools = [
  "cancel_order",
  "reset_password",
  "send_replacement",
  "create_refund",
  "issue_voucher",
  "create_return",
  "create_complaint",
  "update_info",
  "create_user_profile",
  "start_chat_session",
];
