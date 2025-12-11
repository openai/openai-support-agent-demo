import crypto from "crypto";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { spawn } from "child_process";
import OpenAI from "openai";
import { NextResponse } from "next/server";

import { KB_FOLDERS } from "@/config/demoData";
import { VECTOR_STORE_ID } from "@/config/constants";
import { clearFileSearchCache } from "@/config/functions";
import { localVectorStore } from "@/lib/localVectorStore";
import prisma from "@/lib/prisma";
import { saveIngestionResult } from "@/lib/ingestionResults";
import { listScrapeArtifacts } from "../scrape_jobs/helpers";

const openai = new OpenAI();

interface MarkdownBlob {
  content: string;
  source?: string;
  filename?: string;
}

interface ManifestEntry {
  hash: string;
  fileId?: string;
  vectorStoreFileId?: string;
}

type Manifest = Record<string, ManifestEntry>;

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function normalizeManifestEntry(entry: unknown): ManifestEntry | null {
  if (!entry || typeof entry !== "object") {
    if (typeof entry === "string") {
      return { hash: entry };
    }
    return null;
  }

  const candidate = entry as Record<string, unknown>;
  if (typeof candidate.hash !== "string") return null;

  return {
    hash: candidate.hash,
    fileId: typeof candidate.fileId === "string" ? candidate.fileId : undefined,
    vectorStoreFileId:
      typeof candidate.vectorStoreFileId === "string"
        ? candidate.vectorStoreFileId
        : undefined,
  };
}

async function readManifest(manifestPath: string): Promise<Manifest> {
  try {
    const data = await fsp.readFile(manifestPath, "utf8");
    const parsed = JSON.parse(data);
    if (parsed && typeof parsed === "object") {
      const manifest: Manifest = {};
      for (const [filePath, entry] of Object.entries(parsed)) {
        const normalized = normalizeManifestEntry(entry);
        if (normalized) {
          manifest[filePath] = normalized;
        }
      }
      return manifest;
    }
  } catch {
    // No manifest yet
  }
  return {};
}

async function writeManifest(manifestPath: string, manifest: Manifest) {
  const tempPath = `${manifestPath}.tmp`;
  await fsp.writeFile(tempPath, JSON.stringify(manifest, null, 2));
  await fsp.rename(tempPath, manifestPath);
}

async function runIngestionService(
  markdown_blobs: MarkdownBlob[],
  chunkSize: number
) {
  return await new Promise<
    { result: any; stdout: string; stderr: string }
  >((resolve, reject) => {
    const python = spawn(
      "python",
      ["crawl4AI-agent-v2/ingest_service.py", "--chunk-size", String(chunkSize)],
      {
        cwd: process.cwd(),
      }
    );

    let stdout = "";
    let stderr = "";

    python.on("error", (error) => {
      reject(
        new Error(
          `Failed to start ingestion service: ${(error as Error).message}`
        )
      );
    });

    python.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    python.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    python.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(`Ingestion service exited with code ${code}: ${stderr}`)
        );
        return;
      }
      try {
        const parsed = JSON.parse(stdout || "{}");
        resolve({ result: parsed, stdout, stderr });
      } catch (error) {
        reject(
          new Error(
            `Failed to parse ingestion output: ${(error as Error).message}`
          )
        );
      }
    });

    python.stdin.write(
      JSON.stringify({
        markdown_blobs,
        chunk_size: chunkSize,
      })
    );
    python.stdin.end();
  });
}

async function uploadToVectorStore(
  filePath: string,
  vectorStoreId: string,
  destinationFolder: string
) {
  const stream = fs.createReadStream(filePath);
  const file = await openai.files.create({
    file: stream,
    purpose: "assistants",
  });

  const vectorStoreFile = await openai.vectorStores.files.create(vectorStoreId, {
    file_id: file.id,
    attributes: {
      source: path.basename(filePath),
      destination: destinationFolder,
    },
  });

  return { fileId: file.id, vectorStoreFile };
}

export async function POST(request: Request) {
  let jobId: string | undefined;
  let vectorStoreId = VECTOR_STORE_ID;
  const changedFiles: string[] = [];
  const unchangedFiles: string[] = [];
  const deletedVectorStoreFiles: Record<string, string> = {};
  const ingestedDocuments: string[] = [];
  const fileHashes: Record<string, string> = {};

  try {
    const body = await request.json();
    let markdownBlobs: MarkdownBlob[] = body.markdownBlobs || [];
    const destinationFolder: string = body.destinationFolder || "knowledge_base";
    const chunkSize: number = body.chunkSize || 1000;
    vectorStoreId = body.vectorStoreId || VECTOR_STORE_ID;
    const forceLocalRebuild: boolean = body.forceLocalRebuild === true;
    const artifactPaths: string[] = Array.isArray(body.artifactPaths)
      ? body.artifactPaths.filter((entry: unknown) => typeof entry === "string")
      : [];
    jobId = typeof body.jobId === "string" ? body.jobId : undefined;

    if (artifactPaths.length === 0 && jobId) {
      const job = await prisma.scrapeJob.findUnique({ where: { id: jobId } });
      if (!job) {
        return NextResponse.json({ error: `No scrape job found for id ${jobId}` }, { status: 404 });
      }
      const discovered = await listScrapeArtifacts(job);
      artifactPaths.push(...discovered);
      if (markdownBlobs.length === 0) {
        markdownBlobs = markdownBlobs.concat(
          discovered.map((relativePath) => ({
            content: "",
            source: relativePath,
            filename: path.basename(relativePath),
          }))
        );
      }
    }

    if (artifactPaths.length > 0) {
      const artifactBlobs: MarkdownBlob[] = [];
      for (const artifactPath of artifactPaths) {
        const absolutePath = path.isAbsolute(artifactPath)
          ? artifactPath
          : path.join(process.cwd(), artifactPath);
        const content = await fsp.readFile(absolutePath, "utf8");
        artifactBlobs.push({
          content,
          source: path.relative(process.cwd(), absolutePath),
          filename: path.basename(absolutePath),
        });
      }
      markdownBlobs = [...artifactBlobs, ...markdownBlobs];
    }

    if (!Array.isArray(markdownBlobs) || markdownBlobs.length === 0) {
      return NextResponse.json(
        { error: "markdownBlobs array is required" },
        { status: 400 }
      );
    }

    if (!KB_FOLDERS.includes(destinationFolder)) {
      return NextResponse.json(
        { error: `destinationFolder must be one of: ${KB_FOLDERS.join(", ")}` },
        { status: 400 }
      );
    }

    const baseDir = path.join(process.cwd(), "public", destinationFolder);
    await fsp.mkdir(baseDir, { recursive: true });

    const manifestPath = path.join(baseDir, ".ingest-manifest.json");
    const manifest = await readManifest(manifestPath);

    const manifestUpdates: Manifest = {};

    const timestamp = Date.now();
    const normalizedBlobs: MarkdownBlob[] = [];

    for (let i = 0; i < markdownBlobs.length; i++) {
      const blob = markdownBlobs[i];
      const content = (blob.content || "").trim();
      if (!content) continue;

      const filename = sanitizeFilename(
        blob.filename || blob.source || `ingest-${timestamp}-${i}.md`
      );
      const normalizedFilename = filename.endsWith(".md")
        ? filename
        : `${filename}.md`;

      const filePath = path.join(baseDir, normalizedFilename);
      const relativeFilePath = path.relative(process.cwd(), filePath);
      const contentHash = crypto
        .createHash("sha256")
        .update(content, "utf8")
        .digest("hex");

      const manifestEntry = manifest[relativeFilePath];
      if (manifestEntry?.hash === contentHash) {
        unchangedFiles.push(relativeFilePath);
        try {
          await fsp.access(filePath);
        } catch {
          await fsp.writeFile(filePath, content, "utf8");
        }
        continue;
      }

      await fsp.writeFile(filePath, content, "utf8");
      changedFiles.push(relativeFilePath);
      manifestUpdates[relativeFilePath] = { hash: contentHash };
      fileHashes[relativeFilePath] = contentHash;
      normalizedBlobs.push({
        content,
        source: blob.source || relativeFilePath,
        filename: normalizedFilename,
      });
      ingestedDocuments.push(blob.source || relativeFilePath);
    }

    if (normalizedBlobs.length === 0 && !forceLocalRebuild) {
      const payload = {
        message: "No new or changed files detected; ingestion skipped",
        unchangedFiles,
        vectorStoreId,
        uploadedFiles: [],
        ingestion: null,
        ingestionLogs: null,
        deletedVectorStoreFiles,
        ingestedDocuments,
        changedFiles,
      };

      if (jobId) {
        await saveIngestionResult(jobId, {
          status: "skipped",
          timestamp: Date.now(),
          message: payload.message,
          changedFiles,
          unchangedFiles,
          uploadedFiles: [],
          deletedVectorStoreFiles,
          ingestedDocuments,
          vectorStoreId,
          ingestionLogs: null,
        });
      }

      return NextResponse.json(payload);
    }

    let ingestion = null;
    const uploadedFiles = [] as Array<{
      filePath: string;
      fileId: string;
      vectorStoreFile: any;
    }>;

    if (normalizedBlobs.length > 0) {
      ingestion = await runIngestionService(normalizedBlobs, chunkSize);

      for (const filePath of changedFiles) {
        const absolutePath = path.join(process.cwd(), filePath);

        const previousEntry = manifest[filePath];
        if (previousEntry?.vectorStoreFileId) {
          try {
            await openai.vectorStores.files.delete(
              previousEntry.vectorStoreFileId,
              { vector_store_id: vectorStoreId }
            );
            deletedVectorStoreFiles[filePath] = previousEntry.vectorStoreFileId;
          } catch (err) {
            throw new Error(
              `Failed to delete prior vector store file for ${filePath}: ${(err as Error).message}`
            );
          }
        }

        const uploaded = await uploadToVectorStore(
          absolutePath,
          vectorStoreId,
          destinationFolder
        );
        uploadedFiles.push({
          filePath,
          fileId: uploaded.fileId,
          vectorStoreFile: uploaded.vectorStoreFile,
        });

        const hash =
          manifestUpdates[filePath]?.hash ||
          fileHashes[filePath] ||
          manifest[filePath]?.hash ||
          "";

        if (!hash) {
          throw new Error(`Missing hash for ${filePath}; manifest update aborted`);
        }
        manifestUpdates[filePath] = {
          hash,
          fileId: uploaded.fileId,
          vectorStoreFileId: uploaded.vectorStoreFile.id,
        };
      }
    }

    const nextManifest: Manifest = { ...manifest, ...manifestUpdates };
    await writeManifest(manifestPath, nextManifest);

    if (forceLocalRebuild || changedFiles.length > 0) {
      await localVectorStore.initialize(
        forceLocalRebuild
          ? { force: true }
          : { files: changedFiles }
      );
      clearFileSearchCache();
    }

    const responsePayload = {
      changedFiles,
      unchangedFiles,
      ingestion: ingestion?.result ?? ingestion,
      ingestionLogs: ingestion
        ? { stdout: ingestion.stdout, stderr: ingestion.stderr }
        : null,
      vectorStoreId,
      uploadedFiles: uploadedFiles.map((item) => ({
        ...item,
        vectorStoreFileId: item.vectorStoreFile.id,
      })),
      deletedVectorStoreFiles,
      ingestedDocuments,
      message:
        ingestedDocuments.length > 0
          ? `Ingestion completed for ${ingestedDocuments.length} document(s): ${ingestedDocuments.join(", ")}`
          : "Ingestion completed",
    };

    if (jobId) {
      await saveIngestionResult(jobId, {
        status: "success",
        timestamp: Date.now(),
        message: responsePayload.message,
        changedFiles,
        unchangedFiles,
        uploadedFiles: responsePayload.uploadedFiles.map((item) => ({
          filePath: item.filePath,
          fileId: item.fileId,
          vectorStoreFileId: item.vectorStoreFileId,
        })),
        deletedVectorStoreFiles,
        ingestedDocuments,
        vectorStoreId,
        ingestionLogs: responsePayload.ingestionLogs,
      });
    }

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("Error running scraper ingestion:", error);
    const message = (error as Error).message;

    if (jobId) {
      await saveIngestionResult(jobId, {
        status: "error",
        timestamp: Date.now(),
        message,
        changedFiles,
        unchangedFiles,
        uploadedFiles: [],
        deletedVectorStoreFiles,
        ingestedDocuments,
        vectorStoreId,
        ingestionLogs: null,
        error: message,
      });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
