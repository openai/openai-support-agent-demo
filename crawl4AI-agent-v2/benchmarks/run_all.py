#!/usr/bin/env python3
"""
Benchmark harness for Crawl4AI example scripts.

- Activates (or prepends) a provided virtualenv for subprocess execution.
- Runs a set of crawler scripts via asyncio.create_subprocess_exec.
- Measures duration, URLs processed (based on new/changed Markdown outputs), and output sizes.
- Emits JSON and CSV reports to crawl4AI-agent/crawl4AI-examples/output/benchmarks/.

CLI examples:
    python crawl4AI-agent-v2/benchmarks/run_all.py
    python crawl4AI-agent-v2/benchmarks/run_all.py --script sitemap-parallel --domain automationghana.com
    python crawl4AI-agent-v2/benchmarks/run_all.py --venv ./crawl4AI-agent-v2/venv
"""
from __future__ import annotations

import argparse
import asyncio
import csv
import hashlib
import json
import os
import sys
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Iterable, List, Sequence
from urllib.parse import urlparse

REPO_ROOT = Path(__file__).resolve().parents[2]
BENCHMARK_DIR = REPO_ROOT / "crawl4AI-agent" / "crawl4AI-examples" / "output" / "benchmarks"


@dataclass
class ScriptJob:
    key: str
    script_path: Path
    output_dir: Path
    description: str
    default_args: Sequence[str]
    domain_hint: str | None = None


@dataclass
class BenchmarkResult:
    script: str
    script_path: str
    output_dir: str
    start_time: str
    end_time: str
    duration_seconds: float
    urls_processed: int
    total_bytes: int
    throughput_pages_per_min: float
    total_output_files: int
    total_output_bytes: int
    status: str
    return_code: int | None
    error: str | None
    stdout_log: str | None = None
    stderr_log: str | None = None


def resolve_python(venv_path: Path | None) -> str:
    """Return a python executable, preferring the provided virtualenv when it exists."""
    candidates: List[Path] = []
    if venv_path:
        candidates.append(venv_path / "bin" / "python")
        candidates.append(venv_path / "Scripts" / "python.exe")
    env_python = os.environ.get("PYTHON")
    if env_python:
        candidates.append(Path(env_python))
    env_venv = os.environ.get("VIRTUAL_ENV")
    if env_venv:
        env_venv_path = Path(env_venv)
        candidates.append(env_venv_path / "bin" / "python")
        candidates.append(env_venv_path / "Scripts" / "python.exe")
        candidates.append(env_venv_path / "Scripts" / "python")
    candidates.append(Path("python"))
    for candidate in candidates:
        if candidate and candidate.exists():
            return str(candidate)
    return "python"


@dataclass(frozen=True)
class FileSnapshot:
    size: int
    mtime: float
    sha256: str


def hash_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            digest.update(chunk)
    return digest.hexdigest()


def snapshot_markdown(output_dir: Path, reuse: Dict[Path, FileSnapshot] | None = None) -> Dict[Path, FileSnapshot]:
    """Return a mapping of markdown file path to size/mtime/hash, reusing hashes when unchanged."""
    if not output_dir.exists():
        return {}

    reuse = reuse or {}
    snapshot: Dict[Path, FileSnapshot] = {}
    for p in output_dir.glob("*.md"):
        if not p.is_file():
            continue
        stat = p.stat()
        previous = reuse.get(p)
        if previous and previous.size == stat.st_size and previous.mtime == stat.st_mtime:
            snapshot[p] = previous
        else:
            snapshot[p] = FileSnapshot(size=stat.st_size, mtime=stat.st_mtime, sha256=hash_file(p))
    return snapshot


def diff_outputs(before: Dict[Path, FileSnapshot], after: Dict[Path, FileSnapshot]) -> Dict[Path, FileSnapshot]:
    """Return files that are new or content-changed since the snapshot."""
    changed: Dict[Path, FileSnapshot] = {}
    for path, meta in after.items():
        previous = before.get(path)
        if previous is None or previous.sha256 != meta.sha256:
            changed[path] = meta
    return changed


def ensure_benchmark_dir() -> None:
    BENCHMARK_DIR.mkdir(parents=True, exist_ok=True)


def iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()


async def run_job(
    job: ScriptJob,
    python_cmd: str,
    env: Dict[str, str],
    log_timestamp: str,
    verbose_logs: bool,
) -> BenchmarkResult:
    before_snapshot = snapshot_markdown(job.output_dir)
    start_ts = iso_now()
    start_time = datetime.now(timezone.utc)
    try:
        process = await asyncio.create_subprocess_exec(
            python_cmd,
            str(job.script_path),
            *job.default_args,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=REPO_ROOT,
            env=env,
        )
    except FileNotFoundError as exc:
        end_ts = iso_now()
        return BenchmarkResult(
            script=job.key,
            script_path=str(job.script_path),
            output_dir=str(job.output_dir),
            start_time=start_ts,
            end_time=end_ts,
            duration_seconds=0.0,
            urls_processed=0,
            total_bytes=0,
            throughput_pages_per_min=0.0,
            total_output_files=len(before_snapshot),
            total_output_bytes=sum(meta.size for meta in before_snapshot.values()),
            status="error",
            return_code=None,
            error=str(exc),
        )

    stdout_chunks: list[bytes] = []
    stderr_chunks: list[bytes] = []

    async def stream_reader(stream: asyncio.StreamReader | None, sink: list[bytes], forward):
        if stream is None:
            return
        while True:
            chunk = await stream.read(1024)
            if not chunk:
                break
            sink.append(chunk)
            forward.buffer.write(chunk)
            forward.flush()

    await asyncio.gather(
        stream_reader(process.stdout, stdout_chunks, sys.stdout),
        stream_reader(process.stderr, stderr_chunks, sys.stderr),
    )

    await process.wait()
    end_time = datetime.now(timezone.utc)
    end_ts = end_time.isoformat()

    stdout_bytes = b"".join(stdout_chunks)
    stderr_bytes = b"".join(stderr_chunks)

    after_snapshot = snapshot_markdown(job.output_dir, reuse=before_snapshot)
    changed = diff_outputs(before_snapshot, after_snapshot)
    duration = max((end_time - start_time).total_seconds(), 0.0)
    urls_processed = len(changed)
    total_bytes = sum(meta.size for meta in changed.values())
    throughput = (urls_processed / (duration / 60.0)) if duration > 0 else 0.0
    total_output_bytes = sum(meta.size for meta in after_snapshot.values())

    status = "success" if process.returncode == 0 else "failed"
    error_message = None
    if process.returncode != 0:
        error_message = stderr_bytes.decode("utf-8", errors="ignore")[:2000] or stdout_bytes.decode("utf-8", errors="ignore")[:2000]

    stdout_log: str | None = None
    stderr_log: str | None = None
    if verbose_logs:
        ensure_benchmark_dir()
        stdout_text = stdout_bytes.decode("utf-8", errors="ignore")[:8000]
        stderr_text = stderr_bytes.decode("utf-8", errors="ignore")[:8000]
        if stdout_text:
            stdout_log = str(BENCHMARK_DIR / f"{log_timestamp}_{job.key}_stdout.log")
            Path(stdout_log).write_text(stdout_text, encoding="utf-8")
        if stderr_text:
            stderr_log = str(BENCHMARK_DIR / f"{log_timestamp}_{job.key}_stderr.log")
            Path(stderr_log).write_text(stderr_text, encoding="utf-8")

    return BenchmarkResult(
        script=job.key,
        script_path=str(job.script_path),
        output_dir=str(job.output_dir),
        start_time=start_ts,
        end_time=end_ts,
        duration_seconds=duration,
        urls_processed=urls_processed,
        total_bytes=total_bytes,
        throughput_pages_per_min=throughput,
        total_output_files=len(after_snapshot),
        total_output_bytes=total_output_bytes,
        status=status,
        return_code=process.returncode,
        error=error_message,
        stdout_log=stdout_log,
        stderr_log=stderr_log,
    )


async def check_crawl4ai_dependency(
    python_cmd: str,
    env: Dict[str, str],
    log_timestamp: str,
    verbose_logs: bool,
) -> BenchmarkResult | None:
    """Ensure crawl4ai is importable before launching jobs."""

    start_ts = iso_now()
    start_time = datetime.now(timezone.utc)
    try:
        process = await asyncio.create_subprocess_exec(
            python_cmd,
            "-c",
            "import crawl4ai",  # simple import gate
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=REPO_ROOT,
            env=env,
        )
    except FileNotFoundError as exc:
        end_ts = iso_now()
        return BenchmarkResult(
            script="dependency-check",
            script_path="import crawl4ai",
            output_dir=str(REPO_ROOT / "public" / "knowledge_base"),
            start_time=start_ts,
            end_time=end_ts,
            duration_seconds=0.0,
            urls_processed=0,
            total_bytes=0,
            throughput_pages_per_min=0.0,
            total_output_files=0,
            total_output_bytes=0,
            status="error",
            return_code=None,
            error=f"Failed to launch python at {python_cmd}: {exc}",
        )

    stdout_bytes, stderr_bytes = await process.communicate()
    end_time = datetime.now(timezone.utc)
    end_ts = end_time.isoformat()
    duration = max((end_time - start_time).total_seconds(), 0.0)

    if process.returncode == 0:
        return None

    stderr_text = stderr_bytes.decode("utf-8", errors="ignore")
    stdout_text = stdout_bytes.decode("utf-8", errors="ignore")
    hint = "Install crawl4ai in the selected environment (e.g., pip install crawl4ai)."
    error_message = (stderr_text or stdout_text or "Import failed")[:2000]
    error_message = f"{error_message}\n{hint}"

    stdout_log: str | None = None
    stderr_log: str | None = None
    if verbose_logs:
        ensure_benchmark_dir()
        if stdout_text:
            stdout_log = str(BENCHMARK_DIR / f"{log_timestamp}_dependency-check_stdout.log")
            Path(stdout_log).write_text(stdout_text[:8000], encoding="utf-8")
        if stderr_text:
            stderr_log = str(BENCHMARK_DIR / f"{log_timestamp}_dependency-check_stderr.log")
            Path(stderr_log).write_text(stderr_text[:8000], encoding="utf-8")

    return BenchmarkResult(
        script="dependency-check",
        script_path="import crawl4ai",
        output_dir=str(REPO_ROOT / "public" / "knowledge_base"),
        start_time=start_ts,
        end_time=end_ts,
        duration_seconds=duration,
        urls_processed=0,
        total_bytes=0,
        throughput_pages_per_min=0.0,
        total_output_files=0,
        total_output_bytes=0,
        status="error",
        return_code=process.returncode,
        error=error_message,
        stdout_log=stdout_log,
        stderr_log=stderr_log,
    )


def write_reports(results: Iterable[BenchmarkResult], timestamp: str) -> None:
    ensure_benchmark_dir()
    # Clean up older benchmark summary files so each run leaves only the latest reports
    for old_report in BENCHMARK_DIR.glob("benchmarks_*.json"):
        try:
            old_report.unlink()
        except OSError:
            pass
    for old_report in BENCHMARK_DIR.glob("benchmarks_*.csv"):
        try:
            old_report.unlink()
        except OSError:
            pass
    json_path = BENCHMARK_DIR / f"benchmarks_{timestamp}.json"
    csv_path = BENCHMARK_DIR / f"benchmarks_{timestamp}.csv"

    data = [asdict(r) for r in results]
    json_path.write_text(json.dumps(data, indent=2), encoding="utf-8")

    if data:
        fieldnames = list(data[0].keys())
        with csv_path.open("w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(data)


def build_jobs() -> List[ScriptJob]:
    kb_dir = REPO_ROOT / "public" / "knowledge_base"
    return [
        ScriptJob(
            key="docs-sequential-v1",
            script_path=REPO_ROOT / "crawl4AI-agent" / "crawl4AI-examples" / "2-crawl_docs_sequential.py",
            output_dir=kb_dir,
            description="Legacy sequential crawler (v1)",
            default_args=[],
            domain_hint="automationghana.com",
        ),
        ScriptJob(
            key="docs-fast-v1",
            script_path=REPO_ROOT / "crawl4AI-agent" / "crawl4AI-examples" / "3-crawl_docs_FAST.py",
            output_dir=kb_dir,
            description="Legacy parallel crawler (v1)",
            default_args=[],
            domain_hint="automationghana.com",
        ),
        ScriptJob(
            key="woocommerce",
            script_path=REPO_ROOT / "crawl4AI-agent" / "crawl4AI-examples" / "crawl_woocommerce_products.py",
            output_dir=kb_dir,
            description="WooCommerce product crawler",
            default_args=[],
            domain_hint="store.automationghana.com",
        ),
        ScriptJob(
            key="docs-sequential-v2",
            script_path=REPO_ROOT / "crawl4AI-agent-v2" / "crawl4AI-examples" / "2-crawl_docs_sequential.py",
            output_dir=kb_dir,
            description="Sequential crawler (v2)",
            default_args=[],
            domain_hint="automationghana.com",
        ),
        ScriptJob(
            key="sitemap-parallel",
            script_path=REPO_ROOT / "crawl4AI-agent-v2" / "crawl4AI-examples" / "3-crawl_sitemap_in_parallel.py",
            output_dir=kb_dir,
            description="Parallel sitemap crawler (v2)",
            default_args=[],
            domain_hint="automationghana.com",
        ),
        ScriptJob(
            key="llms-txt",
            script_path=REPO_ROOT / "crawl4AI-agent-v2" / "crawl4AI-examples" / "4-crawl_llms_txt.py",
            output_dir=kb_dir,
            description="LLMs.txt / Markdown crawler (v2)",
            default_args=[],
            domain_hint="automationghana.com",
        ),
        ScriptJob(
            key="recursive-v2",
            script_path=REPO_ROOT / "crawl4AI-agent-v2" / "crawl4AI-examples" / "5-crawl_site_recursively.py",
            output_dir=kb_dir,
            description="Recursive site crawler (v2)",
            default_args=[],
            domain_hint="automationghana.com",
        ),
    ]


def normalize_domain_filter(raw_target_url: str | None, domain_filter: str | None) -> str | None:
    if domain_filter:
        return domain_filter

    if not raw_target_url:
        return None

    parsed = urlparse(raw_target_url)
    if parsed.hostname:
        return parsed.hostname

    # If the user passed a bare domain without scheme, treat it as the filter directly.
    return raw_target_url


def filter_jobs(
    jobs: List[ScriptJob], script_keys: Sequence[str], target_url: str | None, domain_filter: str | None
) -> List[ScriptJob]:
    filtered = jobs
    if script_keys:
        wanted = {k.lower() for k in script_keys}
        filtered = [job for job in filtered if job.key.lower() in wanted]
        return filtered

    normalized_filter = normalize_domain_filter(target_url, domain_filter)
    if normalized_filter:
        filtered = [job for job in filtered if job.domain_hint and normalized_filter.lower() in job.domain_hint.lower()]
    return filtered


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run Crawl4AI benchmark scripts")
    parser.add_argument(
        "--script",
        action="append",
        help="Limit to specific script key (e.g., sitemap-parallel). Can be repeated.",
    )
    parser.add_argument(
        "--domain",
        help="Filter scripts whose domain hint contains this substring (e.g., automationghana.com)",
    )
    parser.add_argument(
        "--target-url",
        help="Explicit target URL (sitemap or page) passed through to crawler scripts.",
    )
    parser.add_argument(
        "--venv",
        type=Path,
        help="Path to a virtualenv to use for subprocess execution.",
    )
    parser.add_argument(
        "--verbose-logs",
        action="store_true",
        help="Persist truncated stdout/stderr for each run in the benchmarks output directory.",
    )
    return parser.parse_args()


def build_env(venv: Path | None) -> Dict[str, str]:
    env = os.environ.copy()
    env["PYTHONUTF8"] = "1"
    env["PYTHONIOENCODING"] = "utf-8"
    # Ensure crawlers know where to persist markdown outputs when invoked via the harness.
    env.setdefault(
        "CRAWL_OUTPUT_DIR",
        str(REPO_ROOT / "public" / "knowledge_base"),
    )
    if venv:
        bin_path = venv / "bin"
        scripts_path = venv / "Scripts"
        if bin_path.exists():
            env["PATH"] = f"{bin_path}{os.pathsep}" + env.get("PATH", "")
            env["VIRTUAL_ENV"] = str(venv)
        elif scripts_path.exists():
            env["PATH"] = f"{scripts_path}{os.pathsep}" + env.get("PATH", "")
            env["VIRTUAL_ENV"] = str(venv)
    return env


async def main() -> None:
    args = parse_args()
    jobs = filter_jobs(build_jobs(), args.script or [], args.target_url, args.domain)
    if not jobs:
        raise SystemExit("No scripts matched the provided filters.")

    python_cmd = resolve_python(args.venv)
    env = build_env(args.venv)
    if args.target_url:
        env["CRAWL_TARGET_URL"] = args.target_url

    bench_timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")

    dependency_result = await check_crawl4ai_dependency(
        python_cmd, env, bench_timestamp, args.verbose_logs
    )
    if dependency_result:
        write_reports([dependency_result], bench_timestamp)
        print(
            "crawl4ai is not available in the selected environment. "
            "Install it and rerun the benchmark."
        )
        print(f"Reports written to {BENCHMARK_DIR}")
        return

    results: List[BenchmarkResult] = []
    for job in jobs:
        print(f"Running {job.key} via {python_cmd}...")
        result = await run_job(job, python_cmd, env, bench_timestamp, args.verbose_logs)
        results.append(result)
        print(
            f"Completed {job.key}: status={result.status}, urls={result.urls_processed}, "
            f"bytes={result.total_bytes}, throughput={result.throughput_pages_per_min:.2f} pages/min"
        )

    write_reports(results, bench_timestamp)
    print(f"Reports written to {BENCHMARK_DIR}")


if __name__ == "__main__":
    asyncio.run(main())
