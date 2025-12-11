import { Prisma } from "@/lib/generated/prisma";
import { getScriptSchema, validateArgsForSchema, validateTargetForSchema } from "@/config/scrapeScripts";

function toInputJsonObject(value: unknown): Prisma.InputJsonObject {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const entries: [string, Prisma.InputJsonValue | null][] = [];

  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    if (val !== undefined) {
      entries.push([key, val as Prisma.InputJsonValue]);
    }
  }

  return Object.fromEntries(entries);
}

export function parseTargetUrlFromArgs(
  args: unknown,
  options: { required?: boolean } = {},
): { url: string | null; provided: boolean; error?: string } {
  const record = toInputJsonObject(args);
  const provided = "url" in record || "targetUrl" in record;
  const raw = (record as Record<string, unknown>).url ?? (record as Record<string, unknown>).targetUrl;

  if (!provided) {
    if (options.required) {
      return { url: null, provided: false, error: "args.url is required" };
    }
    return { url: null, provided: false };
  }

  if (typeof raw !== "string") {
    return { url: null, provided: true, error: "args.url must be a string" };
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    return { url: null, provided: true, error: "args.url cannot be empty" };
  }

  try {
    const parsed = new URL(trimmed);
    if (!parsed.protocol.startsWith("http")) {
      return { url: null, provided: true, error: "args.url must start with http or https" };
    }
    return { url: parsed.toString(), provided: true };
  } catch {
    return { url: null, provided: true, error: "Enter a valid URL for args.url" };
  }
}

export function mergeArgsWithTarget(args: unknown, targetUrl: string | null): Prisma.InputJsonObject {
  const base = { ...toInputJsonObject(args) } as Record<string, Prisma.InputJsonValue | null>;
  if (targetUrl !== null) {
    base.url = targetUrl;
    base.targetUrl = targetUrl;
  }
  return base as Prisma.InputJsonObject;
}

export function mergeArgObjects(existing: unknown, incoming: unknown): Prisma.InputJsonObject {
  return { ...toInputJsonObject(existing), ...toInputJsonObject(incoming) };
}

export function normalizeArgsForScript(
  script: string,
  args: Prisma.InputJsonObject,
): Prisma.InputJsonObject {
  const schema = getScriptSchema(script);
  if (!schema) return args;

  const next: Record<string, Prisma.InputJsonValue | null> = {};
  Object.entries(args).forEach(([key, value]) => {
    if (value !== undefined) {
      next[key] = value as Prisma.InputJsonValue;
    }
  });

  if (schema.key === "woocommerce") {
    const categories = args.categories;
    if (typeof categories === "string") {
      const parts = categories
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);
      next.categories = parts as Prisma.InputJsonValue;
    }
    if (Array.isArray(categories)) {
      const filtered = categories.filter((entry) => typeof entry === "string" && entry.trim());
      next.categories = filtered as Prisma.InputJsonValue;
    }
  }

  return next as Prisma.InputJsonObject;
}

export function deriveTargetFromArgs(args: Record<string, unknown> | null | undefined) {
  if (!args) return "";
  const candidate = (args as Record<string, unknown>).url ?? (args as Record<string, unknown>).targetUrl;
  return typeof candidate === "string" ? candidate : "";
}

export function validateScriptArgs(
  script: string,
  targetUrl: string | null,
  args: Prisma.InputJsonObject,
): string | null {
  const normalizedArgs = normalizeArgsForScript(script, args);
  if (!targetUrl) return null;
  const schema = getScriptSchema(script);
  if (!schema) return null;

  const targetError = validateTargetForSchema(schema, targetUrl);
  if (targetError) return targetError;

  return validateArgsForSchema(schema, normalizedArgs);
}

export { toInputJsonObject };
