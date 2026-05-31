import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";

type Violation = {
  file: string;
  line: number;
  content: string;
};

const repoRoot = resolve(import.meta.dir, "..");
const allowedFiles = new Set<string>([
  "bun.lock",
  "package.json",
  "scripts/mocha-migration-baseline.ts",
  "scripts/check-mocha-oracle-boundary.ts",
  "rewrite/scripts/export-upstream-run.ts",
  "rewrite/tests/export-upstream-run.test.ts",
]);

function ignoreLine(relPath: string, line: string): boolean {
  if (relPath !== "package.json") {
    return false;
  }

  return /"migration:mocha:(?:baseline|check-boundary)"/.test(line);
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

function findViolations(): Violation[] {
  const ignoredDirectories = new Set([".git", "node_modules", "tmp"]);
  const files = collectFiles(repoRoot, ignoredDirectories).filter((filePath) =>
    /\.(?:ts|tsx|js|mjs|cjs|json|lock)$/i.test(filePath),
  );

  const violations: Violation[] = [];

  for (const filePath of files) {
    const relPath = relativePath(filePath);
    if (allowedFiles.has(relPath)) {
      continue;
    }

    const text = readFileSync(filePath, "utf8");
    const lines = text.split(/\r?\n/);

    lines.forEach((line, index) => {
      if (!/\bmocha\b/.test(line)) {
        return;
      }

      if (ignoreLine(relPath, line)) {
        return;
      }

      violations.push({
        file: relPath,
        line: index + 1,
        content: line.trim(),
      });
    });
  }

  return violations;
}

function main(): void {
  const violations = findViolations();

  if (violations.length === 0) {
    console.log("Mocha oracle boundary check passed: only approved oracle paths reference mocha.");
    return;
  }

  console.error("Mocha oracle boundary check failed: non-oracle references found.");
  for (const violation of violations) {
    console.error(`${violation.file}:${violation.line} ${violation.content}`);
  }

  process.exitCode = 1;
}

main();
