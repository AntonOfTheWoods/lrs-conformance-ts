import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

interface Summary {
  strategy?: string;
  matched?: number;
  statusMismatches?: number;
  leftOnly?: number;
  rightOnly?: number;
}

interface Report {
  generatedAt: string;
  sourceFile: string;
  summary: Summary;
  statusMismatches: string[];
  leftOnly: string[];
  rightOnly: string[];
  leftOnlyGroups: Array<{ group: string; count: number }>;
  rightOnlyGroups: Array<{ group: string; count: number }>;
}

function usage(): string {
  return [
    "Usage:",
    "  bun ./rewrite/scripts/analyze-compare-output.ts --in <compare-output.txt> [--json <report.json>] [--md <report.md>]",
    "",
    "Defaults:",
    "  --in tmp/agents/compare-live-valid-output.txt",
    "  --json tmp/agents/compare-live-diff-report.json",
    "  --md tmp/agents/compare-live-diff-report.md",
  ].join("\n");
}

function getFlagValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
}

function parseList(lines: string[], startMarker: string, endMarkers: string[]): string[] {
  const startIndex = lines.findIndex((line) => line.trim() === startMarker);
  if (startIndex === -1) {
    return [];
  }

  const items: string[] = [];
  for (let i = startIndex + 1; i < lines.length; i += 1) {
    const line = lines[i]?.trim() ?? "";
    if (!line) {
      continue;
    }

    if (endMarkers.includes(line)) {
      break;
    }

    if (line.startsWith("error: script")) {
      break;
    }

    if (line.startsWith("- ")) {
      items.push(line.slice(2).trim());
    }
  }

  return items;
}

function parseSummary(text: string): Summary {
  const strategy = text.match(/"strategy":\s*"([^"]+)"/)?.[1];
  const matched = Number(text.match(/"matched":\s*(\d+)/)?.[1] ?? "0");
  const statusMismatches = Number(text.match(/"statusMismatches":\s*(\d+)/)?.[1] ?? "0");
  const leftOnly = Number(text.match(/"leftOnly":\s*(\d+)/)?.[1] ?? "0");
  const rightOnly = Number(text.match(/"rightOnly":\s*(\d+)/)?.[1] ?? "0");

  return {
    strategy,
    matched,
    statusMismatches,
    leftOnly,
    rightOnly,
  };
}

function groupKey(key: string): string {
  const segments = key
    .split(" / ")
    .map((segment) => segment.trim())
    .filter(Boolean);
  if (segments.length === 0) {
    return "(unknown)";
  }

  if (segments.length === 1) {
    return segments[0] ?? "(unknown)";
  }

  return `${segments[0]} / ${segments[1]}`;
}

function buildGroupedCounts(items: string[]): Array<{ group: string; count: number }> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = groupKey(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([group, count]) => ({ group, count }))
    .sort((a, b) => b.count - a.count || a.group.localeCompare(b.group));
}

function renderMarkdown(report: Report): string {
  const lines: string[] = [];
  lines.push("# Behavior Differences Report");
  lines.push("");
  lines.push(`- generatedAt: ${report.generatedAt}`);
  lines.push(`- sourceFile: ${report.sourceFile}`);
  lines.push(`- strategy: ${report.summary.strategy ?? "unknown"}`);
  lines.push(`- matched: ${report.summary.matched ?? 0}`);
  lines.push(`- statusMismatches: ${report.summary.statusMismatches ?? 0}`);
  lines.push(`- leftOnly: ${report.summary.leftOnly ?? 0}`);
  lines.push(`- rightOnly: ${report.summary.rightOnly ?? 0}`);
  lines.push("");

  lines.push("## Status Mismatches");
  lines.push("");
  if (report.statusMismatches.length === 0) {
    lines.push("- none");
  } else {
    for (const item of report.statusMismatches) {
      lines.push(`- ${item}`);
    }
  }
  lines.push("");

  lines.push("## Left-only Groups");
  lines.push("");
  if (report.leftOnlyGroups.length === 0) {
    lines.push("- none");
  } else {
    for (const group of report.leftOnlyGroups) {
      lines.push(`- ${group.group}: ${group.count}`);
    }
  }
  lines.push("");

  lines.push("## Right-only Groups");
  lines.push("");
  if (report.rightOnlyGroups.length === 0) {
    lines.push("- none");
  } else {
    for (const group of report.rightOnlyGroups) {
      lines.push(`- ${group.group}: ${group.count}`);
    }
  }
  lines.push("");

  lines.push("## Left-only Full List");
  lines.push("");
  if (report.leftOnly.length === 0) {
    lines.push("- none");
  } else {
    for (const item of report.leftOnly) {
      lines.push(`- ${item}`);
    }
  }
  lines.push("");

  lines.push("## Right-only Full List");
  lines.push("");
  if (report.rightOnly.length === 0) {
    lines.push("- none");
  } else {
    for (const item of report.rightOnly) {
      lines.push(`- ${item}`);
    }
  }
  lines.push("");

  return `${lines.join("\n")}\n`;
}

async function main(): Promise<number> {
  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    console.log(usage());
    return 0;
  }

  const inputPath = resolve(getFlagValue(args, "--in") ?? "tmp/agents/compare-live-valid-output.txt");
  const jsonPath = resolve(getFlagValue(args, "--json") ?? "tmp/agents/compare-live-diff-report.json");
  const mdPath = resolve(getFlagValue(args, "--md") ?? "tmp/agents/compare-live-diff-report.md");

  const text = await readFile(inputPath, "utf8");
  const lines = text.split(/\r?\n/);

  const statusMismatches = parseList(lines, "Status mismatches:", ["Left-only cases:", "Right-only cases:"]);
  const leftOnly = parseList(lines, "Left-only cases:", ["Right-only cases:"]);
  const rightOnly = parseList(lines, "Right-only cases:", []);

  const report: Report = {
    generatedAt: new Date().toISOString(),
    sourceFile: inputPath,
    summary: parseSummary(text),
    statusMismatches,
    leftOnly,
    rightOnly,
    leftOnlyGroups: buildGroupedCounts(leftOnly),
    rightOnlyGroups: buildGroupedCounts(rightOnly),
  };

  await mkdir(dirname(jsonPath), { recursive: true });
  await mkdir(dirname(mdPath), { recursive: true });

  await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  await writeFile(mdPath, renderMarkdown(report), "utf8");

  console.log(
    JSON.stringify(
      {
        inputPath,
        jsonPath,
        mdPath,
        summary: report.summary,
      },
      null,
      2,
    ),
  );

  return 0;
}

try {
  process.exitCode = await main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
}
