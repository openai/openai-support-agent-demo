"use client";
import { KB_FOLDERS } from "@/config/demoData";
import { Copy } from "lucide-react";
import { useMemo, useState } from "react";

import { AppPageShell } from "@/components/app-page-shell";
import { defaultRouteForRoles } from "@/lib/auth/routes";
import { useSessionStore } from "@/stores/useSessionStore";

interface KBFile {
  type: string;
  filename: string;
  filepath: string;
}

export default function InitVS() {
  const roles = useSessionStore((state) => state.roles);
  const defaultRedirect = useMemo(() => defaultRouteForRoles(roles), [roles]);
  const [loadingOpenAI, setLoadingOpenAI] = useState(false);
  const [vectorStoreId, setVectorStoreId] = useState<string | null>(null);
  const [statusOpenAI, setStatusOpenAI] = useState<string>("");
  const [errorOpenAI, setErrorOpenAI] = useState<string | null>(null);
  const [successOpenAI, setSuccessOpenAI] = useState<boolean>(false);

  const [loadingOllama, setLoadingOllama] = useState(false);
  const [statusOllama, setStatusOllama] = useState<string>("");
  const [errorOllama, setErrorOllama] = useState<string | null>(null);
  const [successOllama, setSuccessOllama] = useState(false);

  if (!roles) {
    return (
      <AppPageShell>
        <div className="p-6 text-sm text-muted-foreground">Checking your access…</div>
      </AppPageShell>
    );
  }

  if (!roles.includes("admin")) {
    return (
      <AppPageShell>
        <div className="p-6">
          <p className="rounded bg-destructive/10 p-4 text-destructive">
            You are not authorized to manage the vector store. Return to {defaultRedirect}.
          </p>
        </div>
      </AppPageShell>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleInitializeOpenAI = async () => {
    setLoadingOpenAI(true);
    setSuccessOpenAI(false);
    setErrorOpenAI(null);
    setStatusOpenAI("Creating vector store...");
    const response = await fetch("/api/vector_stores/create_store", {
      method: "POST",
      body: JSON.stringify({ name: "CS Knowledge Base" }),
    });
    if (response.status === 200) {
      const vs = await response.json();
      setVectorStoreId(vs.id);
      setStatusOpenAI("Fetching files...");
      const filesList: KBFile[] = [];
      for (const folder of KB_FOLDERS) {
        const folderFiles = await fetch(`/api/list_files?folder=${folder}`).then((res) => res.json());
        filesList.push(
          ...folderFiles.map((file: string) => ({
            type: folder,
            filename: file.split(".")[0],
            filepath: `/public/${folder}/${file}`,
          }))
        );
      }
      setStatusOpenAI(`Uploading ${filesList.length} files to vector store...`);
      for (const file of filesList) {
        const uploadRes = await fetch("/api/vector_stores/upload_file", {
          method: "POST",
          body: JSON.stringify({ filePath: file.filepath }),
        });
        if (uploadRes.status === 200) {
          const fileData = await uploadRes.json();
          const fileId = fileData.id;
          const attributes = {
            type: file.type,
            filename: file.filename,
            filepath: file.filepath,
          };
          const addFileResponse = await fetch("/api/vector_stores/add_file", {
            method: "POST",
            body: JSON.stringify({ vectorStoreId: vs.id, fileId, attributes }),
          });
          if (addFileResponse.status === 200) {
            setStatusOpenAI(`Uploaded ${file.type}/${file.filename}`);
          } else {
            setErrorOpenAI(`Failed to add file ${file.filename} to vector store`);
          }
        } else {
          setErrorOpenAI(`Failed to upload file ${file.filename} to vector store`);
        }
      }
      setStatusOpenAI("Uploaded all files to vector store.");
      setLoadingOpenAI(false);
      setSuccessOpenAI(true);
    } else {
      setErrorOpenAI("Failed to create vector store");
      setLoadingOpenAI(false);
    }
  };

  const handleInitializeOllama = async () => {
    setLoadingOllama(true);
    setSuccessOllama(false);
    setErrorOllama(null);
    setStatusOllama("Initializing local vector store...");
    const res = await fetch("/api/local_vector_store/init", {
      method: "POST",
    });
    if (res.ok) {
      setStatusOllama("Local vector store initialized.");
      setSuccessOllama(true);
    } else {
      setErrorOllama("Failed to initialize local vector store");
    }
    setLoadingOllama(false);
  };

  const handleRebuildOllama = async () => {
    setLoadingOllama(true);
    setSuccessOllama(false);
    setErrorOllama(null);
    setStatusOllama("Rebuilding embeddings...");
    const res = await fetch("/api/local_vector_store/init?force=true", {
      method: "POST",
    });
    if (res.ok) {
      setStatusOllama("Knowledge base rebuilt.");
      setSuccessOllama(true);
    } else {
      setErrorOllama("Failed to rebuild vector store");
    }
    setLoadingOllama(false);
  };

  return (
    <AppPageShell>
      <div className="flex flex-col gap-6">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-start md:justify-between md:gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="text-2xl font-bold">Initialize the Vector Store</div>
              <p className="text-sm text-muted-foreground">
                Load knowledge base content into a vector store so your agents can search and retrieve it. Content in
                <span className="font-mono rounded-md bg-accent px-1 py-0.5">/public/knowledge_base</span> and
                <span className="font-mono rounded-md bg-accent px-1 py-0.5">/public/faq</span> will be embedded using
                Ollama and stored locally.
              </p>
              <p className="text-sm text-muted-foreground">
                Update these articles anytime and re-run initialization to rebuild embeddings. All controls below work in
                dev and production without changing backend logic.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {statusOpenAI ? <div className="rounded-lg bg-accent px-3 py-2">{statusOpenAI}</div> : null}
              {statusOllama ? <div className="rounded-lg bg-accent px-3 py-2">{statusOllama}</div> : null}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm">
            <div className="text-sm font-semibold">OpenAI-managed vector store</div>
            <p className="text-xs text-muted-foreground">
              Creates a hosted vector store and uploads all demo files. Use this path when you want OpenAI to manage
              storage.
            </p>
            {!loadingOpenAI ? (
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:brightness-110"
                onClick={handleInitializeOpenAI}
              >
                Initialize with OpenAI
              </button>
            ) : (
              <div className="text-sm text-muted-foreground">{statusOpenAI || "Preparing OpenAI vector store..."}</div>
            )}
            {errorOpenAI && <div className="text-sm text-destructive">{errorOpenAI}</div>}
            {successOpenAI && !errorOpenAI && (
              <div className="rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">
                <div className="font-medium text-foreground">Knowledge base updated.</div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground">Vector Store ID:</span>
                  <span className="font-mono rounded-md bg-accent px-2 py-1 text-xs text-foreground">
                    {vectorStoreId ?? ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(vectorStoreId ?? "")}
                    className="inline-flex items-center gap-1 rounded border px-2 py-1 text-xs text-foreground transition hover:border-primary"
                  >
                    <Copy size={14} /> Copy
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm">
            <div className="text-sm font-semibold">Local Ollama vector store</div>
            <p className="text-xs text-muted-foreground">
              Generates embeddings locally. Use “Rebuild” after changing files to refresh the embeddings without altering
              backend APIs.
            </p>
            <div className="flex flex-wrap gap-2">
              {!loadingOllama ? (
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:brightness-110"
                  onClick={handleInitializeOllama}
                >
                  Initialize with Ollama
                </button>
              ) : (
                <div className="text-sm text-muted-foreground">{statusOllama || "Preparing Ollama vector store..."}</div>
              )}
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary shadow-sm transition hover:bg-primary hover:text-primary-foreground"
                onClick={handleRebuildOllama}
                disabled={loadingOllama}
              >
                Rebuild
              </button>
            </div>
            {errorOllama && <div className="text-sm text-destructive">{errorOllama}</div>}
            {successOllama && !errorOllama && (
              <div className="rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">
                <div className="font-medium text-foreground">Knowledge base refreshed.</div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground">Vector Store ID:</span>
                  <span className="font-mono rounded-md bg-accent px-2 py-1 text-xs text-foreground">local-ollama</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-1">
            <div className="text-lg font-semibold">Files included</div>
            <p className="text-sm text-muted-foreground">Each item below is sent to the vector store during initialization.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {KB_FOLDERS.map((folder) => (
              <div key={folder} className="rounded-lg border bg-muted/40 p-4 shadow-sm">
                <div className="text-sm font-semibold">{folder}</div>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <li>
                    Files will be fetched from <span className="font-mono text-[11px]">/public/{folder}</span>.
                  </li>
                  <li>Each file is uploaded with its type and filename metadata.</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppPageShell>
  );
}
