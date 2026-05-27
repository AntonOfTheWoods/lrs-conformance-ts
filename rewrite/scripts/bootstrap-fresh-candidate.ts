import { access, cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";

import { resolveUpstreamRoot } from "../upstream-root.ts";

const repoRoot = resolve(import.meta.dir, "../..");

interface BootstrapConfig {
  force: boolean;
  sourceDir: string;
  targetDir: string;
}

function usage(): string {
  return [
    "Usage:",
    "  bun ./rewrite/scripts/bootstrap-fresh-candidate.ts [--source-dir <path>] [--target-dir <path>] [--force]",
    "",
    "Defaults:",
    "  --source-dir <resolved via LRS_UPSTREAM_ROOT or sibling upstream suite>",
    "  --target-dir rewrite4",
  ].join("\n");
}

function getFlagValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
}

function isWithinPath(basePath: string, candidatePath: string): boolean {
  const relativePath = relative(basePath, candidatePath);
  return relativePath === "" || (!relativePath.startsWith("..") && !isAbsolute(relativePath));
}

function resolveSafeTargetDirectory(pathValue: string): string {
  const absolutePath = resolve(pathValue);
  if (!isWithinPath(repoRoot, absolutePath)) {
    throw new Error(`Target directory ${absolutePath} must stay within ${repoRoot}.`);
  }

  if (relative(repoRoot, absolutePath).startsWith("archive/")) {
    throw new Error(`Target directory ${absolutePath} must not be placed under archive/.`);
  }

  return absolutePath;
}

function parseConfig(args: string[]): BootstrapConfig {
  if (args.includes("--help") || args.includes("-h")) {
    throw new Error(usage());
  }

  const sourceDirArg = getFlagValue(args, "--source-dir");
  const targetDirArg = getFlagValue(args, "--target-dir") ?? resolve(repoRoot, "rewrite4");

  return {
    force: args.includes("--force"),
    sourceDir: sourceDirArg ? resolve(sourceDirArg) : resolveUpstreamRoot(),
    targetDir: resolveSafeTargetDirectory(targetDirArg),
  };
}

async function pathExists(pathValue: string): Promise<boolean> {
  try {
    await access(pathValue);
    return true;
  } catch {
    return false;
  }
}

function shouldCopyPath(sourcePath: string): boolean {
  const normalized = sourcePath.replaceAll("\\", "/");
  return (
    !normalized.includes("/.git/") &&
    !normalized.endsWith("/.git") &&
    !normalized.includes("/node_modules/") &&
    !normalized.endsWith("/node_modules") &&
    !normalized.includes("/logs/") &&
    !normalized.endsWith("/logs")
  );
}

async function main(): Promise<void> {
  const config = parseConfig(process.argv.slice(2));

  if (!(await pathExists(config.sourceDir))) {
    throw new Error(`Source suite directory does not exist: ${config.sourceDir}`);
  }

  if (await pathExists(config.targetDir)) {
    if (!config.force) {
      throw new Error(`Target directory already exists: ${config.targetDir}. Re-run with --force to replace it.`);
    }

    await rm(config.targetDir, { force: true, recursive: true });
  }

  await mkdir(dirname(config.targetDir), { recursive: true });
  await cp(config.sourceDir, config.targetDir, {
    filter: shouldCopyPath,
    force: false,
    recursive: true,
  });

  const metadataPath = resolve(config.targetDir, ".rewrite4-origin.json");
  await writeFile(
    metadataPath,
    `${JSON.stringify(
      {
        copiedAt: new Date().toISOString(),
        sourceDir: config.sourceDir,
        targetDir: config.targetDir,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log(
    JSON.stringify(
      {
        metadataPath,
        sourceDir: config.sourceDir,
        targetDir: config.targetDir,
      },
      null,
      2,
    ),
  );
}

if (import.meta.main) {
  try {
    await main();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  }
}
