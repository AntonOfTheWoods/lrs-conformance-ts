#!/usr/bin/env bun

import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

import specs from "../specConfig.ts";

const cjsRequire = createRequire(import.meta.url);
const chai = cjsRequire("chai") as any;
const chaiThings = cjsRequire("chai-things") as (chaiValue: any, utils: unknown) => void;
const Mocha = cjsRequire("mocha") as new (options: Record<string, unknown>) => {
  addFile(file: string): void;
  loadFiles(): void;
  suite: MochaSuiteShape;
};

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

export function isSuiteDefinitionFile(fileName: string): boolean {
  return fileName.endsWith(".js") || fileName.endsWith(".ts");
}

export function listSuiteDefinitionFiles(testDirectory: string): string[] {
  return fs
    .readdirSync(testDirectory)
    .filter((file) => isSuiteDefinitionFile(file))
    .sort((left, right) => left.localeCompare(right));
}

function createBattery(version: string): BatteryInfo {
  const rewriteRoot = path.join(__dirname, "..");
  const directory = version === "1.0.3" ? "v1_0_3" : "v2_0";

  process.env["DIRECTORY"] = directory;
  process.env["LRS_ENDPOINT"] = "http://localhost:3001/xapi";
  process.env["BASIC_AUTH_ENABLED"] = "true";
  process.env["BASIC_AUTH_USER"] = "No:";
  process.env["BASIC_AUTH_PASSWORD"] = "User";
  process.env["XAPI_VERSION"] = version;

  chai.use(chaiThings);

  const mocha = new Mocha({
    timeout: "15000",
    ui: "bdd",
  });
  const testDirectory = path.join(rewriteRoot, "test", directory);

  listSuiteDefinitionFiles(testDirectory).forEach((file) => {
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

function serializeBatteriesModule(batteryOutput: Record<string, BatteryInfo>): string {
  return [
    "export type BatteryTreeNode = {",
    "  children: BatteryTreeNode[];",
    "  text: string;",
    "};",
    "",
    "export type BatteryInfo = {",
    "  conformanceTestCount: number | null;",
    "  tests: BatteryTreeNode;",
    "};",
    "",
    `const batteries = ${JSON.stringify(batteryOutput, null, 2)} as Record<string, BatteryInfo>;`,
    "",
    "export default batteries;",
    "",
  ].join("\n");
}

async function main(): Promise<void> {
  const batteryOutput = createBatteries();
  const batteryPath = path.join(__dirname, "../batteries.ts");
  const fileContents = serializeBatteriesModule(batteryOutput);

  fs.writeFileSync(batteryPath, fileContents);
}

if (import.meta.main) {
  void main();
}
