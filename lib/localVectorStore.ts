import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import ollama from "ollama";
import { KB_FOLDERS } from "@/config/demoData";
import { TEXT_SPLITTER_CONFIG } from "@/config/vectorStore";
import { DEFAULT_SEARCH_LIMIT } from "@/config/constants";
import cleanMarkdown from "./cleanMarkdown";
import { splitText } from "./textSplitter";
import pLimit from "p-limit";

const STORE_PATH = path.join(process.cwd(), "data", "local_vector_store.json");

interface Entry {
  id: string;
  embedding: number[];
  text: string;
  attributes: {
    type: string;
    filename: string;
    filepath: string;
    chunk?: number;
    overlap?: number;
  };
}

function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

class LocalVectorStore {
  private store: Entry[] = [];
  private loaded = false;

  private async ensureLoaded() {
    if (this.loaded) return;
    try {
      const data = await fs.readFile(STORE_PATH, "utf8");
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          this.store = parsed;
        } else {
          console.warn(
            `Unexpected format in ${STORE_PATH}, initializing empty store`
          );
          this.store = [];
        }
      } catch (err) {
        console.error(`Failed to parse ${STORE_PATH}:`, err);
        this.store = [];
      }
    } catch {
      this.store = [];
    }
    this.loaded = true;
  }

  private async embedding(text: string): Promise<number[]> {
    const model = "nomic-embed-text";
    const res = await ollama.embeddings({ model, prompt: text });
    return res.embedding;
  }

  async initialize(
    options: { force?: boolean; concurrency?: number; files?: string[] } = {},
  ) {
    const { force = false, concurrency = 5, files } = options;
    const concurrencyLimit = concurrency ?? 5;

    const hasTargets = Array.isArray(files) && files.length > 0;

    if (force) {
      this.store = [];
      this.loaded = true;
    } else {
      await this.ensureLoaded();
      if (!hasTargets && this.store.length > 0) return;
    }

    const filePaths = hasTargets
      ? files.map((filePath) =>
          path.isAbsolute(filePath)
            ? filePath
            : path.join(process.cwd(), filePath),
        )
      : await this.collectKnowledgeBaseFiles();

    if (filePaths.length === 0) {
      console.warn("No knowledge base files found for local vector store.");
      await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
      await fs.writeFile(STORE_PATH, JSON.stringify(this.store, null, 2));
      return;
    }

    if (hasTargets && !force) {
      const normalizedTargets = new Set(
        filePaths.map((filePath) => path.normalize(filePath)),
      );
      this.store = this.store.filter((entry) => {
        const storedPath = path.join(
          process.cwd(),
          this.stripLeadingSlash(entry.attributes.filepath),
        );
        return !normalizedTargets.has(path.normalize(storedPath));
      });
    }

    const { entries, filesProcessed, chunksProcessed } = await this.processFiles(
      filePaths,
      concurrencyLimit > 0 ? concurrencyLimit : 1,
    );

    this.store.push(...entries);

    await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
    console.log(
      `Processed ${filesProcessed} files and ${chunksProcessed} chunks in parallel. Writing local vector store...`,
    );
    await fs.writeFile(STORE_PATH, JSON.stringify(this.store, null, 2));
    console.log(
      `Local vector store written to ${STORE_PATH} with ${this.store.length} entries.`,
    );
  }

  private stripLeadingSlash(filePath: string) {
    return filePath.startsWith("/") ? filePath.slice(1) : filePath;
  }

  private async collectKnowledgeBaseFiles() {
    const files: string[] = [];
    for (const folder of KB_FOLDERS) {
      const dir = path.join(process.cwd(), "public", folder);
      try {
        const entries = await fs.readdir(dir);
        for (const entry of entries) {
          files.push(path.join(dir, entry));
        }
      } catch (err) {
        console.warn(`Skipping missing knowledge base folder: ${dir}`, err);
      }
    }
    return files;
  }

  private async processFiles(filePaths: string[], concurrency: number) {
    const filesData: {
      folder: string;
      file: string;
      joinedChunks: string[];
      overlap: number;
    }[] = [];

    for (const absolutePath of filePaths) {
      const relativeToPublic = path.relative(
        path.join(process.cwd(), "public"),
        absolutePath,
      );
      const [folder, ...rest] = relativeToPublic.split(path.sep);
      const file = rest.join(path.sep);

      if (!KB_FOLDERS.includes(folder)) {
        console.warn(
          `Skipping file outside configured KB folders: ${absolutePath}`,
        );
        continue;
      }

      try {
        const raw = await fs.readFile(absolutePath, "utf8");
        let cleaned: string;
        if (file.endsWith(".json")) {
          try {
            const parsed = JSON.parse(raw);
            cleaned =
              parsed && typeof parsed === "object"
                ? JSON.stringify(parsed)
                : raw;
          } catch (err) {
            console.error(`Failed to parse ${file}:`, err);
            cleaned = raw;
          }
        } else {
          cleaned = cleanMarkdown(raw);
        }

        const chunks = await splitText(cleaned);
        const overlap = TEXT_SPLITTER_CONFIG.chunkOverlap;
        const joinedChunks = chunks.map((chunk, i) => {
          if (i === 0) return chunk;
          const prevWords = chunks[i - 1].split(/\s+/);
          const overlapWords = prevWords.slice(-overlap).join(" ");
          return `${overlapWords} ${chunk}`.trim();
        });

        filesData.push({
          folder,
          file,
          joinedChunks,
          overlap,
        });
      } catch (err) {
        console.error(`Failed to read ${absolutePath}:`, err);
      }
    }

    let chunksProcessed = 0;
    const entries: Entry[] = [];
    const totalChunks = filesData.reduce(
      (total, file) => total + file.joinedChunks.length,
      0,
    );
    const limit = pLimit(concurrency > 0 ? concurrency : totalChunks || 1);
    const tasks: Promise<void>[] = [];

    for (const { folder, file, joinedChunks, overlap } of filesData) {
      joinedChunks.forEach((chunk, idx) => {
        tasks.push(
          limit(async () => {
            const current = ++chunksProcessed;
            console.log(
              `Embedding chunk ${current}/${totalChunks} from ${file}`,
            );
            try {
              const embedding = await this.embedding(chunk);
              entries.push({
                id: crypto.randomUUID(),
                embedding,
                text: chunk,
                attributes: {
                  type: folder,
                  filename: file.replace(/\.(md|json)$/, ""),
                  filepath: path
                    .join("public", folder, file)
                    .replace(/\\/g, "/"),
                  chunk: idx,
                  overlap,
                },
              });
            } catch (err) {
              console.error(
                `Failed to embed chunk ${current}/${totalChunks} from ${file}:`,
                err,
              );
            }
          }),
        );
      });
    }

    await Promise.allSettled(tasks);

    return {
      entries,
      filesProcessed: filesData.length,
      chunksProcessed,
      totalChunks,
    };
  }

  /**
   * Search the local vector store.
   *
   * By default, returns up to `limit` entries with a cosine similarity score
   * of at least `threshold` (defaults to `0.5`). When `limit` is omitted,
   * the search returns up to 10 results. Set `topKOnly` to `true` to ignore
   * the threshold and rely solely on the highest scoring `limit` matches.
   * Lowering the threshold increases recall, while raising it can improve
   * precision.
   */
  async search(
    query: string,
    {
      limit: rawLimit = DEFAULT_SEARCH_LIMIT,
      threshold: rawThreshold = 0.5,
      topKOnly = false,
    }: { limit?: number; threshold?: number; topKOnly?: boolean } = {},
  ) {
    await this.ensureLoaded();
    if (this.store.length === 0) {
      throw new Error("Local vector store is empty");
    }

    let limit = rawLimit;
    if (!Number.isInteger(limit) || limit <= 0) {
      console.warn(
        `Invalid limit ${rawLimit}; defaulting to ${DEFAULT_SEARCH_LIMIT}`
      );
      limit = DEFAULT_SEARCH_LIMIT;
    }

    let threshold = rawThreshold;
    if (typeof threshold !== "number" || Number.isNaN(threshold)) {
      throw new Error("threshold must be a number between -1 and 1");
    }
    if (threshold < -1) threshold = -1;
    if (threshold > 1) threshold = 1;

    console.log(`Searching ${this.store.length} stored entries...`);
    const qEmbed = await this.embedding(query);
    let results = this.store
      .map((e) => ({
        text: e.text,
        attributes: e.attributes,
        score: cosineSimilarity(qEmbed, e.embedding),
      }))
      .sort((a, b) => b.score - a.score);

    if (!topKOnly) {
      results = results.filter((r) => r.score >= threshold);
    }

    results = results.slice(0, limit);

    console.log(
      "Top scores:",
      results.map((r) => r.score.toFixed(3))
    );
    return results;
  }

  async getStatus() {
    await this.ensureLoaded();
    return { loaded: this.loaded, count: this.store.length };
  }
}

export const localVectorStore = new LocalVectorStore();
