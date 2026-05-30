import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

type GlobalSymbol = "before" | "context" | "describe" | "expect" | "it" | "specify";

type Candidate = {
  file: string;
  importsAdded: GlobalSymbol[];
};

const repoRoot = resolve(import.meta.dir, "..", "..");
const suiteRoots = [join(repoRoot, "rewrite4", "test", "v1_0_3"), join(repoRoot, "rewrite4", "test", "v2_0")];
const orderedSymbols: GlobalSymbol[] = ["before", "context", "describe", "expect", "it", "specify"];

function toRelative(filePath: string): string {
  return relative(repoRoot, filePath).replaceAll("\\", "/");
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

function usesSymbol(source: string, symbol: GlobalSymbol): boolean {
  if (symbol === "expect") {
    return /\bexpect\s*\(/.test(source);
  }

  return new RegExp(`\\b${symbol}\\s*\\(`).test(source);
}

function hasBunTestImport(source: string): boolean {
  return /from\s+["']bun:test["']/.test(source);
}

function findInsertionOffset(source: string): number {
  const importPattern = /^(?:import\s[^;]+;\s*\n)+/m;
  const match = source.match(importPattern);
  if (!match || typeof match.index !== "number") {
    return 0;
  }

  return match.index + match[0].length;
}

function buildImportLine(symbols: GlobalSymbol[]): string {
  const sorted = orderedSymbols.filter((symbol) => symbols.includes(symbol));
  return `import { ${sorted.join(", ")} } from "bun:test";\n`;
}

function transformFile(source: string): { changed: boolean; next: string; symbols: GlobalSymbol[] } {
  if (hasBunTestImport(source)) {
    return { changed: false, next: source, symbols: [] };
  }

  const symbols = orderedSymbols.filter((symbol) => usesSymbol(source, symbol));
  if (symbols.length === 0) {
    return { changed: false, next: source, symbols: [] };
  }

  const importLine = buildImportLine(symbols);
  const offset = findInsertionOffset(source);
  const prefix = source.slice(0, offset);
  const suffix = source.slice(offset);
  const separator = offset === 0 ? "\n" : "";
  const next = `${prefix}${importLine}${separator}${suffix}`;

  return { changed: true, next, symbols };
}

function main(): void {
  const args = process.argv.slice(2);
  const writeChanges = args.includes("--write");

  const files = suiteRoots.flatMap(walkTsFiles).sort((left, right) => left.localeCompare(right));
  const candidates: Candidate[] = [];

  for (const filePath of files) {
    const source = readFileSync(filePath, "utf8");
    const transformed = transformFile(source);
    if (!transformed.changed) {
      continue;
    }

    if (writeChanges) {
      writeFileSync(filePath, transformed.next, "utf8");
    }

    candidates.push({
      file: toRelative(filePath),
      importsAdded: transformed.symbols,
    });
  }

  console.log(
    JSON.stringify(
      {
        mode: writeChanges ? "write" : "dry-run",
        filesChanged: candidates.length,
        candidates,
      },
      null,
      2,
    ),
  );
}

main();
