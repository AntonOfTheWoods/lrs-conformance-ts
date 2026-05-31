import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

type FileInventory = {
  file: string;
  hasBunTestImport: boolean;
  usesGlobals: boolean;
  usesGlobalExpect: boolean;
  usesDone: number;
  usesThisTimeout: number;
  importInjectionCandidate: boolean;
};

type InventoryReport = {
  generatedAt: string;
  root: string;
  totals: {
    files: number;
    hasBunTestImport: number;
    importInjectionCandidates: number;
    usesDone: number;
    usesThisTimeout: number;
  };
  topByDone: FileInventory[];
  topByTimeout: FileInventory[];
  importInjectionCandidates: FileInventory[];
};

const repoRoot = resolve(import.meta.dir, "..", "..");
const suiteRoots = [join(repoRoot, "rewrite4", "test", "v1_0_3"), join(repoRoot, "rewrite4", "test", "v2_0")];
const outputPath = join(repoRoot, "tmp", "agents", "phase1-codemod-inventory.json");

function relativePath(pathValue: string): string {
  return relative(repoRoot, pathValue).replaceAll("\\", "/");
}

function walkTsFiles(root: string): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(root, entry.name);
    if (entry.isDirectory()) {
      return walkTsFiles(fullPath);
    }

    if (entry.isFile() && fullPath.endsWith(".ts")) {
      return [fullPath];
    }

    return [];
  });
}

function countMatches(text: string, pattern: RegExp): number {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

function buildFileInventory(filePath: string): FileInventory {
  const text = readFileSync(filePath, "utf8");
  const hasBunTestImport = /from\s+["']bun:test["']/.test(text);
  const usesGlobals = /\b(?:describe|context|it|specify|before)\s*\(/.test(text);
  const usesGlobalExpect = /(^|[^.$\w])expect\s*\(/m.test(text);
  const usesDone = countMatches(text, /\bdone\b/g);
  const usesThisTimeout = countMatches(text, /\bthis\.timeout\s*\(/g);

  return {
    file: relativePath(filePath),
    hasBunTestImport,
    usesGlobals,
    usesGlobalExpect,
    usesDone,
    usesThisTimeout,
    importInjectionCandidate: usesGlobalExpect && !hasBunTestImport,
  };
}

function main(): void {
  const files = suiteRoots.flatMap(walkTsFiles).sort((left, right) => left.localeCompare(right));
  const inventory = files.map(buildFileInventory);

  const report: InventoryReport = {
    generatedAt: new Date().toISOString(),
    root: relativePath(repoRoot),
    totals: {
      files: inventory.length,
      hasBunTestImport: inventory.filter((entry) => entry.hasBunTestImport).length,
      importInjectionCandidates: inventory.filter((entry) => entry.importInjectionCandidate).length,
      usesDone: inventory.reduce((sum, entry) => sum + entry.usesDone, 0),
      usesThisTimeout: inventory.reduce((sum, entry) => sum + entry.usesThisTimeout, 0),
    },
    topByDone: inventory
      .filter((entry) => entry.usesDone > 0)
      .sort((left, right) => right.usesDone - left.usesDone || left.file.localeCompare(right.file))
      .slice(0, 25),
    topByTimeout: inventory
      .filter((entry) => entry.usesThisTimeout > 0)
      .sort((left, right) => right.usesThisTimeout - left.usesThisTimeout || left.file.localeCompare(right.file))
      .slice(0, 25),
    importInjectionCandidates: inventory.filter((entry) => entry.importInjectionCandidate),
  };

  mkdirSync(resolve(outputPath, ".."), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(`Phase-1 codemod inventory written to ${relativePath(outputPath)}.`);
  console.log(JSON.stringify(report.totals, null, 2));
}

main();
