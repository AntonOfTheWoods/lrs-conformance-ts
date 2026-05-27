import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const repoRoot = resolve(import.meta.dir, "..");
const deprecatedArchivePaths = ["archive/deprecated-rewrite", "archive/deprecated-rewrite3"] as const;

interface BoundaryViolation {
  archivePath: string;
  filePath: string;
  reason: string;
  detail: string;
}

function escapeRegex(value: string): string {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findDeprecatedArchivePath(line: string): string | undefined {
  return deprecatedArchivePaths.find((archivePath) =>
    new RegExp(`${escapeRegex(archivePath)}(?=(?:/|\\b))`).test(line),
  );
}

function collectFiles(
  root: string,
  ignoredDirectories: Set<string> = new Set([".git", "node_modules", "tmp"]),
): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const filePath = join(root, entry.name);
    if (entry.isDirectory()) {
      if (ignoredDirectories.has(entry.name)) {
        return [];
      }

      return collectFiles(filePath, ignoredDirectories);
    }

    return [filePath];
  });
}

function isMarkdown(filePath: string): boolean {
  return filePath.endsWith(".md");
}

function isScriptLike(filePath: string): boolean {
  return filePath.endsWith(".ts") || filePath.endsWith(".js") || filePath.endsWith(".sh");
}

function isImportLike(filePath: string): boolean {
  return filePath.endsWith(".ts") || filePath.endsWith(".js") || filePath.endsWith(".sh");
}

function lineContainsActiveArchiveReference(line: string): string | undefined {
  const archivePath = findDeprecatedArchivePath(line);
  if (!archivePath) {
    return undefined;
  }

  return /\b(?:bun\s+run|bun\s+\.|node\s+|bash\s+|sh\s+|npm\s+run|yarn\s+run|pnpm\s+run|deno\s+|tsx\s+|tsgo\s+|run\s+|execute\s+|invoke\s+|start\s+|launch\s+)/i.test(
    line,
  )
    ? archivePath
    : undefined;
}

function lineContainsArchiveImportReference(line: string): string | undefined {
  const archivePath = findDeprecatedArchivePath(line);
  if (!archivePath) {
    return undefined;
  }

  return /\bimport\b|\bexport\b\s+.*\bfrom\b|\brequire\s*\(|\bsource\b|^\s*\.\s+|\bimport\s*\(/.test(line)
    ? archivePath
    : undefined;
}

function scanPackageScripts(): BoundaryViolation[] {
  const packageJsonPath = join(repoRoot, "package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as { scripts?: Record<string, string> };
  const scripts = packageJson.scripts ?? {};
  const violations: BoundaryViolation[] = [];

  for (const [scriptName, scriptValue] of Object.entries(scripts)) {
    const archivePath = findDeprecatedArchivePath(scriptValue);
    if (!archivePath) {
      continue;
    }

    violations.push({
      archivePath,
      filePath: packageJsonPath,
      reason: "package script points at deprecated archive path",
      detail: `${scriptName} = ${scriptValue}`,
    });
  }

  return violations;
}

function scanDocsAndScripts(): BoundaryViolation[] {
  const violations: BoundaryViolation[] = [];

  for (const filePath of collectFiles(repoRoot)) {
    if (relative(repoRoot, filePath).startsWith("archive")) {
      continue;
    }

    if (!isMarkdown(filePath) && !isScriptLike(filePath)) {
      continue;
    }

    const text = readFileSync(filePath, "utf8");
    const lines = text.split(/\r?\n/);

    lines.forEach((line, index) => {
      const archivePath = lineContainsActiveArchiveReference(line);
      if (!archivePath) {
        return;
      }

      violations.push({
        archivePath,
        filePath,
        reason: "documentation or script line presents archive path as runnable",
        detail: `${index + 1}: ${line.trim()}`,
      });
    });
  }

  return violations;
}

function scanArchiveImports(): BoundaryViolation[] {
  const violations: BoundaryViolation[] = [];

  for (const filePath of collectFiles(repoRoot)) {
    if (relative(repoRoot, filePath).startsWith("archive")) {
      continue;
    }

    if (!isImportLike(filePath)) {
      continue;
    }

    const text = readFileSync(filePath, "utf8");
    const lines = text.split(/\r?\n/);

    lines.forEach((line, index) => {
      const archivePath = lineContainsArchiveImportReference(line);
      if (!archivePath) {
        return;
      }

      violations.push({
        archivePath,
        filePath,
        reason: "active code imports or sources the deprecated archive path",
        detail: `${index + 1}: ${line.trim()}`,
      });
    });
  }

  return violations;
}

function formatViolation(violation: BoundaryViolation): string {
  return `${relative(repoRoot, violation.filePath)}\n  ${violation.reason} (${violation.archivePath})\n  ${violation.detail}`;
}

function main(): void {
  const violations = [...scanPackageScripts(), ...scanDocsAndScripts(), ...scanArchiveImports()];

  if (violations.length === 0) {
    console.log(`Archive boundary check passed: no active references to ${deprecatedArchivePaths.join(", ")}.`);
    return;
  }

  const message = [
    `Archive boundary check failed: active references to deprecated archive paths were found.`,
    ...violations.map(formatViolation),
  ].join("\n");

  console.error(message);
  process.exitCode = 1;
}

main();
