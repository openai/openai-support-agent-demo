"""Reusable ingestion service for transforming Markdown blobs into structured payloads.

This module wraps the chunking logic from ``insert_docs.py`` so it can be
reused by other services (e.g., the Next.js API layer). It accepts a list of
Markdown strings, chunks them with ``smart_chunk_markdown``, and emits payloads
that work for both Chroma/OpenAI ingestion and the local vector store.

When executed as a script, the service reads a JSON document from STDIN with the
following shape::

    {
        "markdown_blobs": [
            {"content": "# Title...", "source": "optional-source"},
            ...
        ],
        "chunk_size": 1000
    }

The script writes the resulting payloads to STDOUT as JSON so callers can pipe
it directly into other systems.
"""

from __future__ import annotations

import argparse
import json
import sys
from typing import Any, Dict, List

from insert_docs import extract_section_info, smart_chunk_markdown


def build_ingestion_payloads(
    markdown_blobs: List[Dict[str, Any]], chunk_size: int = 1000
) -> Dict[str, Any]:
    """Chunk Markdown blobs and prepare payloads for downstream ingestion.

    Args:
        markdown_blobs: A list of objects with ``content`` (Markdown text) and
            an optional ``source`` label used in metadata.
        chunk_size: Maximum characters per chunk when splitting Markdown.

    Returns:
        A dictionary containing normalized chunks, Chroma/OpenAI payloads, and
        simplified entries suitable for the local vector store.
    """

    chroma_payload = {"ids": [], "documents": [], "metadatas": []}
    chunks: List[Dict[str, Any]] = []
    local_store_entries: List[Dict[str, Any]] = []

    chunk_idx = 0
    for idx, blob in enumerate(markdown_blobs):
        content = (blob.get("content") or blob.get("markdown") or "").strip()
        if not content:
            continue
        source = blob.get("source") or f"blob-{idx}"
        split_chunks = smart_chunk_markdown(content, max_len=chunk_size)
        for chunk in split_chunks:
            metadata = extract_section_info(chunk)
            metadata.update({"chunk_index": chunk_idx, "source": source})
            chunk_id = f"chunk-{chunk_idx}"

            chroma_payload["ids"].append(chunk_id)
            chroma_payload["documents"].append(chunk)
            chroma_payload["metadatas"].append(metadata)

            chunks.append({"id": chunk_id, "text": chunk, "metadata": metadata})
            local_store_entries.append(
                {"text": chunk, "attributes": {"source": source, "chunk_index": chunk_idx}}
            )
            chunk_idx += 1

    return {
        "chunks": chunks,
        "chroma": chroma_payload,
        "local": local_store_entries,
        "counts": {"documents": len(markdown_blobs), "chunks": len(chroma_payload["documents"])},
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Chunk Markdown blobs and emit ingestion payloads as JSON.")
    parser.add_argument("--chunk-size", type=int, default=1000, help="Maximum characters per chunk")
    args = parser.parse_args()

    try:
        input_data = json.load(sys.stdin)
    except json.JSONDecodeError as exc:  # pragma: no cover - defensive guard
        raise SystemExit(f"Invalid JSON input: {exc}")

    markdown_blobs = input_data.get("markdown_blobs") or []
    if not isinstance(markdown_blobs, list):
        raise SystemExit("Input must include a 'markdown_blobs' array")

    payloads = build_ingestion_payloads(markdown_blobs, chunk_size=args.chunk_size)
    json.dump(payloads, sys.stdout)


if __name__ == "__main__":
    main()
