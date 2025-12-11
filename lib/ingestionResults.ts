import fs from "fs/promises";
import path from "path";

export type StoredIngestionResult = {
  status: "success" | "error" | "skipped";
  timestamp: number;
  message: string;
  changedFiles: string[];
  unchangedFiles: string[];
  uploadedFiles: Array<{ filePath: string; fileId?: string; vectorStoreFileId?: string }>;
  deletedVectorStoreFiles: Record<string, string>;
  ingestedDocuments: string[];
  vectorStoreId?: string;
  ingestionLogs: { stdout?: string; stderr?: string } | null;
  error?: string;
};

const RESULTS_DIR = path.join(process.cwd(), "data", "ingestion_results");

export async function saveIngestionResult(
  jobId: string,
  result: StoredIngestionResult
) {
  try {
    await fs.mkdir(RESULTS_DIR, { recursive: true });
    const filePath = path.join(RESULTS_DIR, `${jobId}.json`);
    const payload = { ...result, jobId };
    await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
  } catch (error) {
    console.warn("Failed to persist ingestion result", { jobId, error });
  }
}

export async function readIngestionResult(jobId: string) {
  try {
    const filePath = path.join(RESULTS_DIR, `${jobId}.json`);
    const data = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(data);
    if (!parsed || typeof parsed !== "object") return null;

    return parsed as StoredIngestionResult & { jobId: string };
  } catch {
    return null;
  }
}
