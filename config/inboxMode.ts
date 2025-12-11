/**
 * Map Chatwoot inbox IDs to reply modes.
 * "auto" posts replies publicly while "suggest" stores them as private notes.
 */
export const INBOX_MODE: Record<number, "auto" | "suggest"> = {
  1: "auto",
  2: "suggest",
};
