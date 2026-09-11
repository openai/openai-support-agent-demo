import "server-only";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { APIError } from "openai";
import { getAIConfig, getOpenRouterEmbeddingModel } from "./config";
import { aiClient, getVectorStoreClient } from "./client";

type FileAttributes = Record<string, string>;

export interface KnowledgeSearchResult {
  text: string;
  attributes: FileAttributes;
  score: number;
}

interface LocalFile {
  id: string;
  filename: string;
  content: string;
}

interface LocalChunk {
  id: string;
  text: string;
  embedding: number[];
}

interface LocalVectorStoreFile {
  id: string;
  fileId: string;
  attributes: FileAttributes;
  chunks: LocalChunk[];
}

interface LocalVectorStore {
  id: string;
  object: "vector_store";
  name: string;
  created_at: number;
  embeddingModel?: string;
  files: LocalVectorStoreFile[];
}

interface LocalVectorStoreDatabase {
  files: Record<string, LocalFile>;
  stores: Record<string, LocalVectorStore>;
}

const databasePath = path.join(
  process.cwd(),
  ".data",
  "openrouter-vector-stores.json"
);

const emptyDatabase = (): LocalVectorStoreDatabase => ({
  files: {},
  stores: {},
});

export function usesLocalVectorStore(): boolean {
  return getAIConfig().provider === "openrouter";
}

async function readDatabase(): Promise<LocalVectorStoreDatabase> {
  try {
    return JSON.parse(await fs.readFile(databasePath, "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return emptyDatabase();
    }
    throw error;
  }
}

async function writeDatabase(database: LocalVectorStoreDatabase): Promise<void> {
  await fs.mkdir(path.dirname(databasePath), { recursive: true });
  const temporaryPath = `${databasePath}.${randomUUID()}.tmp`;
  await fs.writeFile(temporaryPath, JSON.stringify(database), "utf8");
  await fs.rename(temporaryPath, databasePath);
}

function splitIntoChunks(content: string): string[] {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const chunks: string[] = [];
  let chunk = "";

  for (const paragraph of paragraphs) {
    if (chunk && chunk.length + paragraph.length + 2 > 1_500) {
      chunks.push(chunk);
      chunk = paragraph;
    } else {
      chunk = chunk ? `${chunk}\n\n${paragraph}` : paragraph;
    }
  }

  if (chunk) chunks.push(chunk);
  return chunks.length > 0 ? chunks : [content.slice(0, 1_500)];
}

function cosineSimilarity(left: number[], right: number[]): number {
  let dotProduct = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (let index = 0; index < left.length; index += 1) {
    dotProduct += left[index] * right[index];
    leftMagnitude += left[index] ** 2;
    rightMagnitude += right[index] ** 2;
  }

  if (leftMagnitude === 0 || rightMagnitude === 0) return 0;
  return dotProduct / Math.sqrt(leftMagnitude * rightMagnitude);
}

function getSafePublicFilePath(filePath: string): string {
  const publicDirectory = path.resolve(process.cwd(), "public");
  const resolvedFilePath = path.resolve(
    process.cwd(),
    filePath.replace(/^[/\\]+/, "")
  );

  if (!resolvedFilePath.startsWith(`${publicDirectory}${path.sep}`)) {
    throw new Error("Only files inside the public directory can be indexed.");
  }

  return resolvedFilePath;
}

async function createLocalEmbedding(
  texts: string[],
  model = getOpenRouterEmbeddingModel()
): Promise<number[][]> {
  try {
    const response = await aiClient.embeddings.create({
      model,
      input: texts,
    });

    return response.data.map((item) => item.embedding);
  } catch (error) {
    if (error instanceof APIError && error.status === 404) {
      throw new Error(
        `No OpenRouter endpoint is available for embedding model ${model}. Set OPENROUTER_EMBEDDING_MODEL to an available embeddings model, for example openai/text-embedding-3-small.`
      );
    }
    throw error;
  }
}

function requireLocalStore(
  database: LocalVectorStoreDatabase,
  vectorStoreId: string
): LocalVectorStore {
  const store = database.stores[vectorStoreId];
  if (!store) throw new Error(`Vector store not found: ${vectorStoreId}`);
  return store;
}

export async function createKnowledgeStore(name: string) {
  if (!usesLocalVectorStore()) {
    return getVectorStoreClient().vectorStores.create({ name });
  }

  const database = await readDatabase();
  const store: LocalVectorStore = {
    id: `vs_local_${randomUUID()}`,
    object: "vector_store",
    name,
    created_at: Math.floor(Date.now() / 1_000),
    files: [],
  };
  database.stores[store.id] = store;
  await writeDatabase(database);
  return store;
}

export async function uploadKnowledgeFile(filePath: string) {
  if (!usesLocalVectorStore()) {
    const file = await getVectorStoreClient().files.create({
      file: (await import("fs")).createReadStream(
        path.join(process.cwd(), filePath)
      ),
      purpose: "assistants",
    });
    return file;
  }

  const resolvedFilePath = getSafePublicFilePath(filePath);
  const database = await readDatabase();
  const id = `file_local_${randomUUID()}`;
  const file: LocalFile = {
    id,
    filename: path.basename(resolvedFilePath),
    content: await fs.readFile(resolvedFilePath, "utf8"),
  };
  database.files[id] = file;
  await writeDatabase(database);
  return { id, filename: file.filename, object: "file" };
}

export async function addKnowledgeFile(
  vectorStoreId: string,
  fileId: string,
  attributes: FileAttributes
) {
  if (!usesLocalVectorStore()) {
    return getVectorStoreClient().vectorStores.files.create(vectorStoreId, {
      file_id: fileId,
      attributes,
    });
  }

  const database = await readDatabase();
  const store = requireLocalStore(database, vectorStoreId);
  const file = database.files[fileId];
  if (!file) throw new Error(`Uploaded file not found: ${fileId}`);

  const embeddingModel = getOpenRouterEmbeddingModel();
  if (store.embeddingModel && store.embeddingModel !== embeddingModel) {
    throw new Error(
      `Vector store ${vectorStoreId} was indexed with ${store.embeddingModel}. Re-initialize it before using ${embeddingModel}.`
    );
  }

  const texts = splitIntoChunks(file.content);
  const embeddings = await createLocalEmbedding(texts, embeddingModel);
  const storedFile: LocalVectorStoreFile = {
    id: `vsf_local_${randomUUID()}`,
    fileId,
    attributes,
    chunks: texts.map((text, index) => ({
      id: `chunk_local_${randomUUID()}`,
      text,
      embedding: embeddings[index],
    })),
  };
  store.embeddingModel = embeddingModel;
  store.files.push(storedFile);
  await writeDatabase(database);
  return { id: storedFile.id, file_id: fileId, status: "completed" };
}

export async function listKnowledgeFiles(vectorStoreId: string) {
  if (!usesLocalVectorStore()) {
    return getVectorStoreClient().vectorStores.files.list(vectorStoreId);
  }

  const store = requireLocalStore(await readDatabase(), vectorStoreId);
  return {
    object: "list",
    data: store.files.map((file) => ({
      id: file.id,
      file_id: file.fileId,
      attributes: file.attributes,
      status: "completed",
    })),
  };
}

export async function retrieveKnowledgeFile(
  vectorStoreId: string,
  fileId: string
) {
  if (!usesLocalVectorStore()) {
    return getVectorStoreClient().vectorStores.files.retrieve(vectorStoreId, fileId);
  }

  const store = requireLocalStore(await readDatabase(), vectorStoreId);
  const file = store.files.find((item) => item.id === fileId);
  if (!file) throw new Error(`Vector store file not found: ${fileId}`);
  return { id: file.id, file_id: file.fileId, attributes: file.attributes };
}

export async function retrieveKnowledgeStore(vectorStoreId: string) {
  if (!usesLocalVectorStore()) {
    return getVectorStoreClient().vectorStores.retrieve(vectorStoreId);
  }

  return requireLocalStore(await readDatabase(), vectorStoreId);
}

export async function searchLocalKnowledge(
  vectorStoreId: string,
  query: string,
  limit = 5
): Promise<KnowledgeSearchResult[]> {
  if (!usesLocalVectorStore() || !query.trim()) return [];

  const database = await readDatabase();
  const store = requireLocalStore(database, vectorStoreId);
  if (!store.embeddingModel && store.files.length > 0) {
    throw new Error(
      "This local vector store was created before embedding model metadata was recorded. Re-initialize the vector store."
    );
  }
  const [queryEmbedding] = await createLocalEmbedding(
    [query],
    store.embeddingModel
  );

  return store.files
    .flatMap((file) =>
      file.chunks.map((chunk) => ({
        text: chunk.text,
        attributes: file.attributes,
        score: cosineSimilarity(queryEmbedding, chunk.embedding),
      }))
    )
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}
