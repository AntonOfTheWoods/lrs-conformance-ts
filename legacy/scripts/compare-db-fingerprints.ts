import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

export type FingerprintTable = {
  columnNames: string[];
  rowCount: number;
  rowHash: string;
};

export type FingerprintArtifact = {
  tables: Record<string, FingerprintTable>;
};

export type TableDifference = {
  left?: FingerprintTable;
  right?: FingerprintTable;
  table: string;
};

export type ComparisonResult = {
  different: boolean;
  onlyLeft: string[];
  onlyRight: string[];
  rowHashOrCountDifferences: TableDifference[];
};

function usage(): string {
  return [
    "Usage:",
    "  bun ./legacy/scripts/compare-db-fingerprints.ts --left <path> --right <path> [--out <path>]",
  ].join("\n");
}

function getFlagValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
}

async function readJson(pathValue: string): Promise<FingerprintArtifact> {
  const raw = await readFile(pathValue, "utf8");
  return JSON.parse(raw) as FingerprintArtifact;
}

async function writeJson(pathValue: string, value: unknown): Promise<void> {
  await mkdir(dirname(pathValue), { recursive: true });
  await writeFile(pathValue, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function compareFingerprints(left: FingerprintArtifact, right: FingerprintArtifact): ComparisonResult {
  const leftTables = Object.keys(left.tables).sort();
  const rightTables = Object.keys(right.tables).sort();

  const leftSet = new Set(leftTables);
  const rightSet = new Set(rightTables);

  const onlyLeft = leftTables.filter((tableName) => !rightSet.has(tableName));
  const onlyRight = rightTables.filter((tableName) => !leftSet.has(tableName));

  const sharedTables = leftTables.filter((tableName) => rightSet.has(tableName));
  const rowHashOrCountDifferences: TableDifference[] = [];

  for (const tableName of sharedTables) {
    const leftTable = left.tables[tableName];
    const rightTable = right.tables[tableName];
    if (!leftTable || !rightTable) {
      continue;
    }

    if (leftTable.rowCount !== rightTable.rowCount || leftTable.rowHash !== rightTable.rowHash) {
      rowHashOrCountDifferences.push({
        left: leftTable,
        right: rightTable,
        table: tableName,
      });
    }
  }

  return {
    different: onlyLeft.length > 0 || onlyRight.length > 0 || rowHashOrCountDifferences.length > 0,
    onlyLeft,
    onlyRight,
    rowHashOrCountDifferences,
  };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    throw new Error(usage());
  }

  const leftPath = getFlagValue(args, "--left");
  const rightPath = getFlagValue(args, "--right");
  if (!leftPath || !rightPath) {
    throw new Error(`Both --left and --right are required.\n\n${usage()}`);
  }

  const outPath = getFlagValue(args, "--out");
  const left = await readJson(resolve(leftPath));
  const right = await readJson(resolve(rightPath));

  const result = compareFingerprints(left, right);
  if (outPath) {
    await writeJson(resolve(outPath), result);
  }

  console.log(JSON.stringify(result, null, 2));
  if (result.different) {
    process.exitCode = 1;
  }
}

if (import.meta.main) {
  await main();
}
