type QuoteHeuristicsTurn = { role: string; content: string };

const SHORT_ACKNOWLEDGEMENT_PATTERNS = [
  /^(yes|yep|yeah|ya)$/i,
  /^(same question|same issue|same problem)$/i,
  /^(same here|me too)$/i,
  /^following$/i,
];

const PRONOUN_PHRASES = [
  "this issue",
  "this problem",
  "this question",
  "this request",
  "this one",
  "that issue",
  "that problem",
  "that question",
  "that one",
  "same issue",
  "same problem",
  "same question",
];

const PRONOUN_WORDS = ["this", "that", "it", "those", "these"];

function normalizeText(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().replace(/\s+/g, " ");
}

function hasShortAcknowledgement(message: string): boolean {
  return SHORT_ACKNOWLEDGEMENT_PATTERNS.some((pattern) => pattern.test(message));
}

function hasPronounIndicator(message: string): boolean {
  const lower = message.toLowerCase();
  if (PRONOUN_PHRASES.some((phrase) => lower.includes(phrase))) {
    return true;
  }

  const words = lower.split(/\s+/).filter(Boolean);
  if (!words.length || words.length > 6) {
    return false;
  }
  const pronounMatches = words.filter((word) => PRONOUN_WORDS.includes(word)).length;
  return pronounMatches >= 1;
}

function isDuplicateOfTurn(message: string, history: QuoteHeuristicsTurn[]): boolean {
  if (!message) {
    return false;
  }
  const normalizedMessage = message.toLowerCase();
  return history.some((turn) => {
    if (!turn || turn.role !== "user") {
      return false;
    }
    const normalizedTurn = normalizeText(turn.content).toLowerCase();
    return normalizedTurn.length > 0 && normalizedTurn === normalizedMessage;
  });
}

export type QuoteHeuristicsInput = {
  messageText?: string | null;
  referencedMessageId?: number;
  referencedMessageContent?: string | null;
  history?: QuoteHeuristicsTurn[];
};

export function shouldQuoteInboundMessage({
  messageText,
  referencedMessageContent,
  history = [],
}: QuoteHeuristicsInput): boolean {
  const normalizedMessage = normalizeText(messageText);
  if (!normalizedMessage) {
    return false;
  }

  if (hasShortAcknowledgement(normalizedMessage)) {
    return true;
  }

  if (hasPronounIndicator(normalizedMessage)) {
    return true;
  }

  const normalizedReference = normalizeText(referencedMessageContent);
  if (normalizedReference && normalizedReference.toLowerCase() === normalizedMessage.toLowerCase()) {
    return true;
  }

  if (Array.isArray(history) && isDuplicateOfTurn(normalizedMessage, history)) {
    return true;
  }

  return false;
}

export type { QuoteHeuristicsTurn };
