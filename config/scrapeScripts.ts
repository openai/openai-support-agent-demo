export type ScriptSchema = {
  key: string;
  label: string;
  hint: string;
  defaultTarget: string;
  target: {
    description: string;
    example?: string;
    validate?: (value: string) => string | null;
  };
  requiredArgs?: {
    key: string;
    description: string;
    validate: (value: unknown) => string | null;
  }[];
};

function sitemapValidator(value: string) {
  if (!value) return "Enter a sitemap URL";
  try {
    const url = new URL(value);
    if (!url.pathname.toLowerCase().includes("sitemap") && !url.pathname.toLowerCase().endsWith(".xml")) {
      return "Provide a sitemap XML URL";
    }
  } catch {
    return "Enter a valid sitemap URL";
  }
  return null;
}

function recursiveValidator(value: string) {
  if (!value) return "Enter a starting URL";
  try {
    const url = new URL(value);
    if (url.pathname.toLowerCase().endsWith(".xml")) {
      return "Use a root page URL (not a sitemap) for recursive crawling";
    }
  } catch {
    return "Enter a valid URL";
  }
  return null;
}

function llmsTxtValidator(value: string) {
  if (!value) return "Enter the llms.txt URL";
  try {
    const url = new URL(value);
    if (!url.pathname.toLowerCase().endsWith(".txt")) {
      return "llms.txt crawler expects a .txt feed URL";
    }
  } catch {
    return "Enter a valid llms.txt URL";
  }
  return null;
}

function wooCategoriesValidator(value: unknown) {
  if (value === undefined || value === null) {
    return "WooCommerce crawler requires at least one category";
  }
  if (Array.isArray(value)) {
    const cleaned = value.filter((entry) => typeof entry === "string" && entry.trim());
    if (!cleaned.length) return "WooCommerce crawler requires at least one category";
    const hasInvalid = value.some((entry) => typeof entry !== "string" || !entry.trim());
    return hasInvalid ? "Categories must be non-empty strings" : null;
  }
  if (typeof value === "string") {
    const parts = value
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    return parts.length ? null : "Categories must be non-empty strings";
  }
  return "Categories must be strings";
}

export const SCRIPT_SCHEMAS: ScriptSchema[] = [
  {
    key: "docs-sequential-v2",
    label: "Sequential sitemap",
    hint: "Best for stable sitemaps; walks URLs in order with predictable pacing.",
    defaultTarget: "https://automationghana.com/sitemap_index.xml",
    target: {
      description: "Provide a sitemap XML (index or leaf) URL.",
      example: "https://example.com/sitemap_index.xml",
      validate: sitemapValidator,
    },
  },
  {
    key: "docs-sequential-v1",
    label: "Sequential sitemap (v1)",
    hint: "Legacy sequential crawler tuned for sitemap-driven docs.",
    defaultTarget: "https://automationghana.com/sitemap_index.xml",
    target: {
      description: "Provide a sitemap XML (index or leaf) URL.",
      example: "https://example.com/sitemap.xml",
      validate: sitemapValidator,
    },
  },
  {
    key: "sitemap-parallel",
    label: "Parallel sitemap",
    hint: "Fan-out crawler that accelerates large sitemaps with concurrency controls.",
    defaultTarget: "https://automationghana.com/sitemap_index.xml",
    target: {
      description: "Provide a sitemap XML (index or leaf) URL.",
      example: "https://example.com/sitemap_index.xml",
      validate: sitemapValidator,
    },
  },
  {
    key: "woocommerce",
    label: "WooCommerce",
    hint: "Tailored product crawler that keeps variant and pricing metadata intact.",
    defaultTarget: "https://store.automationghana.com",
    target: {
      description: "Provide the base store URL (home or catalog page).",
      example: "https://store.example.com",
    },
    requiredArgs: [
      {
        key: "categories",
        description:
          "Comma-separated category slugs to crawl (e.g., electronics,tools-and-measuring-equipment).",
        validate: wooCategoriesValidator,
      },
    ],
  },
  {
    key: "docs-fast-v1",
    label: "FAST docs (v1)",
    hint: "Legacy concurrent docs crawler optimized for speed.",
    defaultTarget: "https://automationghana.com/sitemap_index.xml",
    target: {
      description: "Provide a sitemap XML (index or leaf) URL.",
      example: "https://example.com/sitemap.xml",
      validate: sitemapValidator,
    },
  },
  {
    key: "recursive-v2",
    label: "Recursive",
    hint: "Discovers deep links from a root URL—good for docs without sitemaps.",
    defaultTarget: "https://automationghana.com",
    target: {
      description: "Provide a root page to begin discovery (not a sitemap).",
      example: "https://example.com/docs",
      validate: recursiveValidator,
    },
  },
  {
    key: "llms-txt",
    label: "LLM text",
    hint: "Optimized for llms.txt / Markdown feeds with minimal boilerplate noise.",
    defaultTarget: "https://automationghana.com/llms.txt",
    target: {
      description: "Provide the llms.txt feed URL.",
      example: "https://example.com/llms.txt",
      validate: llmsTxtValidator,
    },
  },
];

export const SCRIPT_SCHEMA_MAP = new Map(SCRIPT_SCHEMAS.map((schema) => [schema.key, schema] as const));

export function getScriptSchema(key: string) {
  return SCRIPT_SCHEMA_MAP.get(key);
}

export function validateTargetForSchema(schema: ScriptSchema, target: string): string | null {
  if (schema.target.validate) {
    return schema.target.validate(target);
  }
  return null;
}

export function validateArgsForSchema(schema: ScriptSchema, args: Record<string, unknown>): string | null {
  if (!schema.requiredArgs?.length) return null;
  for (const requirement of schema.requiredArgs) {
    const error = requirement.validate(args?.[requirement.key]);
    if (error) {
      return `${requirement.description}: ${error}`;
    }
  }
  return null;
}
