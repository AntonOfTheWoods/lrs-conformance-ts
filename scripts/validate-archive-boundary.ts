import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const repoRoot = resolve(import.meta.dir, "..");
const archivePath = "archive/deprecated-rewrite";

interface BoundaryViolation {
  filePath: string;
  reason: string;
  detail: string;
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

function lineContainsActiveArchiveReference(line: string): boolean {
  if (!line.includes(archivePath)) {
    return false;
  }

  return /\b(?:bun\s+run|bun\s+\.|node\s+|bash\s+|sh\s+|npm\s+run|yarn\s+run|pnpm\s+run|deno\s+|tsx\s+|tsgo\s+|run\s+|execute\s+|invoke\s+|start\s+|launch\s+)/i.test(
    line,
  );
}

function lineContainsArchiveImportReference(line: string): boolean {
  if (!line.includes(archivePath)) {
    return false;
  }

  return /\bimport\b|\bexport\b\s+.*\bfrom\b|\brequire\s*\(|\bsource\b|^\s*\.\s+|\bimport\s*\(/.test(line);
}

function scanPackageScripts(): BoundaryViolation[] {
  const packageJsonPath = join(repoRoot, "package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as { scripts?: Record<string, string> };
  const scripts = packageJson.scripts ?? {};
  const violations: BoundaryViolation[] = [];

  for (const [scriptName, scriptValue] of Object.entries(scripts)) {
    if (!scriptValue.includes(archivePath)) {
      continue;
    }

    violations.push({
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
      if (!lineContainsActiveArchiveReference(line)) {
        return;
      }

      violations.push({
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
      if (!lineContainsArchiveImportReference(line)) {
        return;
      }

      violations.push({
        filePath,
        reason: "active code imports or sources the deprecated archive path",
        detail: `${index + 1}: ${line.trim()}`,
      });
    });
  }

  return violations;
}

function formatViolation(violation: BoundaryViolation): string {
  return `${relative(repoRoot, violation.filePath)}\n  ${violation.reason}\n  ${violation.detail}`;
}

function main(): void {
  const violations = [...scanPackageScripts(), ...scanDocsAndScripts(), ...scanArchiveImports()];

  if (violations.length === 0) {
    console.log(`Archive boundary check passed: no active references to ${archivePath}.`);
    return;
  }

  const message = [
    `Archive boundary check failed: active references to ${archivePath} were found.`,
    ...violations.map(formatViolation),
  ].join("\n");

  console.error(message);
  process.exitCode = 1;
}

main();
