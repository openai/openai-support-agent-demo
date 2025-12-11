import { FAQExtract } from "@/stores/useDataStore";
import { Action } from "@/stores/useConversationStore";

export const AGENT_NAME = "Blossom";

export const CUSTOMER_DETAILS = {
  name: "Janet Deer",
  id: "cus_28X44",
  orderNb: 8,
  signupDate: "2023-11-28",
  email: "janet.deer@gmail.com",
  phone: "+1234567890",
  address: "123 Main St, Anytown, USA",
};

export const DEFAULT_ACTION: Action = {
  name: "create_ticket",
  parameters: {},
};

export const DEFAULT_ARTICLES: FAQExtract[] = [
  {
    title: "Interactions guidelines",
    content: `Tone, Empathy, and Professionalism:
      As a representative, you are the voice of our brand. Always:
      - Be polite, patient, and empathetic.
      - Assume the customer's intent is positive, even if they express frustration.
      - Acknowledge and validate their concerns before providing solutions.
      `,
    link: "/kb?section=interactions_guidelines",
    type: "knowledge_base",
    score: 0.9,
  },
  {
    title: "Customer support chat",
    content: `If you have any questions or need any help, you can contact us through the customer support chat.
    A customer support representative will help you with your questions or concerns.
    Please note that our agents are available from Monday to Saturday, 9am to 6pm.
    `,
    link: "/faq?section=help_chat",
    type: "faq",
    score: 0.8,
  },
];

export const KB_FOLDERS = ["knowledge_base", "faq"];

const getDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

export const USER_INFO = {
  name: "Janet Deer",
  email: "janet.deer@gmail.com",
  phone: "+1234567890",
  address: "123 Main St, Anytown, USA",
  order_history: [
    "ORD1001",
    "ORD1002",
    "ORD1003",
    "ORD1004",
    "ORD1005",
    "ORD1006",
    "ORD1007",
  ],
};

export const DEMO_ORDERS = [
  {
    id: "ORD1001",
    date: getDate(1),
    status: "pending",
    items: [
      { product_id: "P003", name: "Smart Watch", quantity: 1, price: 149.99 },
    ],
  },
  {
    id: "ORD1002",
    date: getDate(8),
    status: "completed",
    items: [
      {
        product_id: "P001",
        name: "Wireless Headphones",
        quantity: 1,
        price: 99.99,
      },
      {
        product_id: "P002",
        name: "Portable Charger",
        quantity: 1,
        price: 39.99,
      },
    ],
  },
  {
    id: "ORD1003",
    date: getDate(24),
    status: "shipped",
    tracking_number: "TRK123456789",
    items: [
      {
        product_id: "P004",
        name: "Bluetooth Speaker",
        quantity: 2,
        price: 59.99,
      },
    ],
  },
  {
    id: "ORD1004",
    date: getDate(28),
    status: "cancelled",
    cancellation_reason: "Customer requested cancellation before processing",
  },
  {
    id: "ORD1005",
    date: getDate(44),
    status: "refunded",
    refund_status: "processing",
    refund_amount: 149.99,
    items: [
      { product_id: "P005", name: "Laptop Stand", quantity: 1, price: 149.99 },
    ],
  },
  {
    id: "ORD1006",
    date: getDate(96),
    status: "delivered",
    return_initiated: true,
    items: [
      {
        product_id: "P006",
        name: "Ergonomic Keyboard",
        quantity: 1,
        price: 89.99,
      },
    ],
  },
  {
    id: "ORD1007",
    date: getDate(108),
    status: "completed",
    complaint: "Order delivered with damaged product",
    items: [
      {
        product_id: "P007",
        name: "Noise Cancelling Earbuds",
        quantity: 1,
        price: 129.99,
      },
    ],
  },
];
