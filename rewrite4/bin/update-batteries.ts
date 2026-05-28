#!/usr/bin/env bun

"use strict";

type BatteryTreeNode = {
  children: BatteryTreeNode[];
  text: string;
};

type BatteryInfo = {
  conformanceTestCount: number | null;
  tests: BatteryTreeNode;
};

type MochaSuiteShape = {
  suites: MochaSuiteShape[];
  tests: Array<{
    title: string;
  }>;
  title?: string;
};

const fs = require("fs") as typeof import("fs");
const path = require("path") as typeof import("path");
const Mocha = require("mocha") as new (options: Record<string, unknown>) => {
  addFile(file: string): void;
  loadFiles(): void;
  suite: MochaSuiteShape;
};
const specs = require("../specConfig.ts") as { availableVersions: string[] };

function clearRewriteModuleCache(rootDirectory: string): void {
  for (const cacheKey of Object.keys(require.cache)) {
    if (!cacheKey.startsWith(rootDirectory)) {
      continue;
    }
    if (cacheKey.includes(`${path.sep}node_modules${path.sep}`)) {
      continue;
    }

    delete require.cache[cacheKey];
  }
}

function cleanLog(log: MochaSuiteShape): BatteryTreeNode {
  return {
    text: log.title ?? "",
    children: [
      ...log.suites.map(cleanLog),
      ...log.tests.map((test) => ({
        text: test.title,
        children: [],
      })),
    ],
  };
}

function countTests(suite: MochaSuiteShape): number {
  return suite.tests.length + suite.suites.reduce((sum, childSuite) => sum + countTests(childSuite), 0);
}

function createBattery(version: string): BatteryInfo {
  const rewriteRoot = path.join(__dirname, "..");
  const directory = version === "1.0.3" ? "v1_0_3" : "v2_0";

  process.env.DIRECTORY = directory;
  process.env.LRS_ENDPOINT = "http://localhost:3001/xapi";
  process.env.BASIC_AUTH_ENABLED = "true";
  process.env.BASIC_AUTH_USER = "No:";
  process.env.BASIC_AUTH_PASSWORD = "User";
  process.env.XAPI_VERSION = version;

  clearRewriteModuleCache(rewriteRoot);
  require("chai").use(require("chai-things"));

  const mocha = new Mocha({
    timeout: "15000",
    ui: "bdd",
  });
  const testDirectory = path.join(rewriteRoot, "test", directory);

  fs.readdirSync(testDirectory)
    .filter((file) => file.endsWith(".js"))
    .forEach((file) => {
      mocha.addFile(path.join(testDirectory, file));
    });

  mocha.loadFiles();

  const info = {
    conformanceTestCount: countTests(mocha.suite),
    tests: cleanLog(mocha.suite),
  };

  console.log(`[${version}] found ${info.conformanceTestCount} tests.`);

  return info;
}

function createBatteries(): Record<string, BatteryInfo> {
  const output: Record<string, BatteryInfo> = {};
  for (const version of specs.availableVersions) {
    output[version] = createBattery(version);
  }

  return output;
}

async function main(): Promise<void> {
  const batteryOutput = createBatteries();
  const batteryPath = path.join(__dirname, "../batteries.js");
  const fileContents = `module.exports = ${JSON.stringify(batteryOutput, null, 2)}`;

  fs.writeFileSync(batteryPath, fileContents);
}

void main();
