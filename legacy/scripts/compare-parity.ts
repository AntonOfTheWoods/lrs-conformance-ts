import { readFile } from "node:fs/promises";

import { compareRuntimeRunOutputs } from "../comparison";

function getFlagValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
}

function getBooleanFlag(args: string[], flag: string, fallback: boolean): boolean {
  const value = getFlagValue(args, flag);
  if (value === undefined) {
    return fallback;
  }

  return value !== "false";
}

function usage(): string {
  return [
    "Usage:",
    "  bun run legacy:compare -- --left <left-run.json> --right <right-run.json>",
    "",
    "Saved exported run artifacts strip both top-level runtime wrappers by default.",
    "Use --left-include-root and --right-include-root to compare those wrappers explicitly.",
  ].join("\n");
}

async function loadJson(path: string): Promise<unknown> {
  const text = await readFile(path, "utf8");
  return JSON.parse(text);
}

async function main(): Promise<number> {
  const args = process.argv.slice(2);
  const leftPath = getFlagValue(args, "--left");
  const rightPath = getFlagValue(args, "--right");
  const leftIncludeRoot = getBooleanFlag(args, "--left-include-root", false);
  const rightIncludeRoot = getBooleanFlag(args, "--right-include-root", false);

  if (!leftPath || !rightPath) {
    console.error(usage());
    return 1;
  }

  const [leftRun, rightRun] = await Promise.all([loadJson(leftPath), loadJson(rightPath)]);
  const comparison = compareRuntimeRunOutputs(
    leftRun as { root?: unknown; log?: unknown },
    rightRun as {
      root?: unknown;
      log?: unknown;
    },
    {
      leftIncludeRoot,
      rightIncludeRoot,
    },
  );

  const summary = {
    matched: comparison.matched.length,
    statusMismatches: comparison.statusMismatches.length,
    leftOnly: comparison.leftOnly.length,
    rightOnly: comparison.rightOnly.length,
  };

  console.log(JSON.stringify(summary, null, 2));

  if (comparison.statusMismatches.length > 0) {
    console.log("\nStatus mismatches:");
    for (const mismatch of comparison.statusMismatches) {
      console.log(`- ${mismatch.key}: ${mismatch.leftStatus} vs ${mismatch.rightStatus}`);
    }
  }

  if (comparison.leftOnly.length > 0) {
    console.log("\nLeft-only cases:");
    for (const record of comparison.leftOnly) {
      console.log(`- ${record.key}`);
    }
  }

  if (comparison.rightOnly.length > 0) {
    console.log("\nRight-only cases:");
    for (const record of comparison.rightOnly) {
      console.log(`- ${record.key}`);
    }
  }

  return comparison.statusMismatches.length === 0 &&
    comparison.leftOnly.length === 0 &&
    comparison.rightOnly.length === 0
    ? 0
    : 1;
}

const exitCode = await main();
process.exitCode = exitCode;
