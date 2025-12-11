import fs from "fs/promises";
import path from "path";

const BENCHMARK_DIR = path.join(
  process.cwd(),
  "crawl4AI-agent",
  "crawl4AI-examples",
  "output",
  "benchmarks"
);

export type BenchmarkEntry = {
  duration_seconds?: number;
  total_output_files?: number;
  urls_processed?: number;
  script?: string;
  script_path?: string;
};

export async function readLatestBenchmark(script: string): Promise<BenchmarkEntry | null> {
  try {
    const entries = await fs.readdir(BENCHMARK_DIR);
    const candidates = entries
      .filter((name) => name.startsWith("benchmarks_") && name.endsWith(".json"))
      .map((name) => path.join(BENCHMARK_DIR, name));

    if (candidates.length === 0) return null;

    const withStats = await Promise.all(
      candidates.map(async (filePath) => {
        const stats = await fs.stat(filePath);
        return { filePath, mtimeMs: stats.mtimeMs };
      })
    );

    const sorted = withStats.sort((a, b) => b.mtimeMs - a.mtimeMs);
    for (const candidate of sorted) {
      const raw = await fs.readFile(candidate.filePath, "utf8");
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) continue;
      const match = parsed.find(
        (entry: BenchmarkEntry) =>
          entry &&
          typeof entry === "object" &&
          (entry.script === script || entry.script_path?.includes(script))
      );
      if (match) return match;
    }
    return null;
  } catch (error) {
    console.warn("Unable to read benchmark results for scrape job", error);
    return null;
  }
}
