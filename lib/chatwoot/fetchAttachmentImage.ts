const IMAGE_EXTENSION_MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".bmp": "image/bmp",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".heic": "image/heic",
  ".heif": "image/heif",
  ".tif": "image/tiff",
  ".tiff": "image/tiff",
};

function normalizeMime(mime?: string | null): string | undefined {
  if (!mime || typeof mime !== "string") {
    return undefined;
  }
  const primary = mime.split(";")[0]?.trim().toLowerCase();
  return primary || undefined;
}

function inferMimeFromUrl(url: string): string | undefined {
  try {
    const { pathname } = new URL(url);
    const match = pathname.match(/\.([^.\/?#]+)(?:$|[?#])/i);
    if (!match) {
      return undefined;
    }
    const ext = `.${match[1].toLowerCase()}`;
    return IMAGE_EXTENSION_MIME_MAP[ext];
  } catch (error) {
    void error;
    return undefined;
  }
}

export async function fetchAttachmentImage(
  url: string,
  mimeType?: string
): Promise<string | undefined> {
  if (!url) {
    return undefined;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return undefined;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const headerMime = normalizeMime(response.headers.get("content-type"));

    let resolvedMime = normalizeMime(mimeType);
    if (!resolvedMime || !resolvedMime.startsWith("image/")) {
      if (headerMime && headerMime.startsWith("image/")) {
        resolvedMime = headerMime;
      } else {
        const inferred = inferMimeFromUrl(url);
        if (inferred) {
          resolvedMime = inferred;
        }
      }
    }

    if (!resolvedMime || !resolvedMime.startsWith("image/")) {
      resolvedMime = "image/*";
    }

    const base64 = buffer.toString("base64");
    return `data:${resolvedMime};base64,${base64}`;
  } catch (error) {
    void error;
    return undefined;
  }
}
