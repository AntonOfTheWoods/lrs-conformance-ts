#!/usr/bin/env bun

import fs from "node:fs";
import path from "node:path";

type Counters = {
  chaiImports: number;
  doneCallbacks: number;
  mochaTimeoutCalls: number;
  mochaGlobalDescribe: number;
  mochaGlobalIt: number;
  chaiExpectChains: number;
};

const root = path.resolve(import.meta.dir, "..");
const testRoot = path.join(root, "test");

function walkFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.name === "node_modules") {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
      continue;
    }

    if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx") || entry.name.endsWith(".js"))) {
      files.push(fullPath);
    }
  }

  return files;
}

function countMatches(text: string, pattern: RegExp): number {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

function toRelative(filePath: string): string {
  return path.relative(root, filePath).replaceAll(path.sep, "/");
}

function runAudit(): void {
  const counters: Counters = {
    chaiImports: 0,
    doneCallbacks: 0,
    mochaTimeoutCalls: 0,
    mochaGlobalDescribe: 0,
    mochaGlobalIt: 0,
    chaiExpectChains: 0,
  };

  const perFile: Array<{ file: string; doneCallbacks: number; timeoutCalls: number }> = [];

  const files = walkFiles(testRoot);
  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");

    const chaiImportCount = countMatches(source, /from\s+["']chai["']/g);
    const doneCount = countMatches(source, /\bdone\b/g);
    const timeoutCount = countMatches(source, /\bthis\.timeout\s*\(/g);

    counters.chaiImports += chaiImportCount;
    counters.doneCallbacks += doneCount;
    counters.mochaTimeoutCalls += timeoutCount;
    counters.mochaGlobalDescribe += countMatches(source, /\bdescribe\s*\(/g);
    counters.mochaGlobalIt += countMatches(source, /\bit\s*\(/g);
    counters.chaiExpectChains += countMatches(source, /\bexpect\s*\(.*?\)\s*\.to\b/g);

    if (doneCount > 0 || timeoutCount > 0) {
      perFile.push({
        file: toRelative(file),
        doneCallbacks: doneCount,
        timeoutCalls: timeoutCount,
      });
    }
  }

  perFile.sort((left, right) => {
    const leftScore = left.doneCallbacks * 10 + left.timeoutCalls;
    const rightScore = right.doneCallbacks * 10 + right.timeoutCalls;
    return rightScore - leftScore;
  });

  const report = {
    generatedAt: new Date().toISOString(),
    root: toRelative(testRoot),
    totals: counters,
    highestRiskFiles: perFile.slice(0, 15),
  };

  console.log(JSON.stringify(report, null, 2));
}

runAudit();
