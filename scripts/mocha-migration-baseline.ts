import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

type CountMetrics = {
  doneCallbacks: number;
  mochaWordRefs: number;
  mochaGlobals: number;
  thisTimeoutCalls: number;
};

type FileMetrics = CountMetrics & {
  file: string;
};

type BaselineReport = {
  generatedAt: string;
  root: string;
  totals: CountMetrics;
  filesByMochaRefs: FileMetrics[];
  filesByTimeoutCalls: FileMetrics[];
  filesByDoneCallbacks: FileMetrics[];
};

const repoRoot = resolve(import.meta.dir, "..");
const rewriteTestsRoot = join(repoRoot, "rewrite4", "test");
const defaultOutPath = join(repoRoot, "tmp", "agents", "mocha-migration-baseline.json");

function countMatches(text: string, pattern: RegExp): number {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

function collectFiles(root: string, ignoredDirectories: Set<string>): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(root, entry.name);
    if (entry.isDirectory()) {
      if (ignoredDirectories.has(entry.name)) {
        return [];
      }

      return collectFiles(fullPath, ignoredDirectories);
    }

    return [fullPath];
  });
}

function relativePath(pathValue: string): string {
  return relative(repoRoot, pathValue).replaceAll("\\", "/");
}

function buildReport(): BaselineReport {
  const ignoredDirectories = new Set([".git", "node_modules", "tmp"]);
  const files = collectFiles(repoRoot, ignoredDirectories).filter((filePath) =>
    /\.(?:ts|tsx|js|mjs|cjs|json)$/i.test(filePath),
  );

  const fileMetrics: FileMetrics[] = files.map((filePath) => {
    const text = readFileSync(filePath, "utf8");
    return {
      file: relativePath(filePath),
      mochaWordRefs: countMatches(text, /\bmocha\b/g),
      mochaGlobals: countMatches(text, /\b(?:describe|context|it|specify|before)\s*\(/g),
      doneCallbacks: countMatches(text, /\bdone\b/g),
      thisTimeoutCalls: countMatches(text, /\bthis\.timeout\s*\(/g),
    };
  });

  const totals = fileMetrics.reduce<CountMetrics>(
    (acc, file) => {
      acc.mochaWordRefs += file.mochaWordRefs;
      acc.mochaGlobals += file.mochaGlobals;
      acc.doneCallbacks += file.doneCallbacks;
      acc.thisTimeoutCalls += file.thisTimeoutCalls;
      return acc;
    },
    {
      mochaWordRefs: 0,
      mochaGlobals: 0,
      doneCallbacks: 0,
      thisTimeoutCalls: 0,
    },
  );

  const inRewriteTests = fileMetrics.filter((file) => file.file.startsWith(relativePath(rewriteTestsRoot)));

  const byMochaRefs = fileMetrics
    .filter((file) => file.mochaWordRefs > 0)
    .sort((left, right) => right.mochaWordRefs - left.mochaWordRefs || left.file.localeCompare(right.file));

  const byTimeoutCalls = inRewriteTests
    .filter((file) => file.thisTimeoutCalls > 0)
    .sort((left, right) => right.thisTimeoutCalls - left.thisTimeoutCalls || left.file.localeCompare(right.file));

  const byDoneCallbacks = inRewriteTests
    .filter((file) => file.doneCallbacks > 0)
    .sort((left, right) => right.doneCallbacks - left.doneCallbacks || left.file.localeCompare(right.file));

  return {
    generatedAt: new Date().toISOString(),
    root: relativePath(repoRoot),
    totals,
    filesByMochaRefs: byMochaRefs,
    filesByTimeoutCalls: byTimeoutCalls,
    filesByDoneCallbacks: byDoneCallbacks,
  };
}

function parseOutputPath(args: string[]): string {
  const outIndex = args.indexOf("--out");
  if (outIndex === -1) {
    return defaultOutPath;
  }

  const value = args[outIndex + 1];
  if (!value) {
    throw new Error("Missing value for --out");
  }

  return resolve(repoRoot, value);
}

function main(): void {
  const args = process.argv.slice(2);
  const outputPath = parseOutputPath(args);
  const report = buildReport();

  mkdirSync(resolve(outputPath, ".."), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(`Mocha migration baseline written to ${relativePath(outputPath)}.`);
  console.log(JSON.stringify(report.totals, null, 2));
}

main();
