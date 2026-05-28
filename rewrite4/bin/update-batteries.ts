#!/usr/bin/env bun

"use strict";

type RunnerMessage = {
  action?: string;
};

type BatteryTreeNode = {
  children: BatteryTreeNode[];
  text: string;
};

type BatteryInfo = {
  conformanceTestCount: number | null;
  tests: BatteryTreeNode;
};

type CleanRunRecord = {
  log?: {
    name: string;
    tests: Array<CleanRunRecord["log"] extends infer T ? (T extends undefined ? never : T) : never>;
  };
  summary: {
    total: number | null;
  };
};

type RunnerInstance = {
  getCleanRecord(): CleanRunRecord;
  on(event: "message", listener: (message: RunnerMessage) => void): void;
  start(): void;
};

type TestRunnerConstructor = new (
  name: string,
  owner: string,
  flags: Record<string, unknown>,
  lrsSettingsUUID?: string | null,
  options?: Record<string, unknown>,
) => RunnerInstance;

type MockResponse = {
  send(body: unknown): void;
  set(headerName: string, value: string): void;
};

type MockApp = {
  all(route: string, handler: (req: unknown, res: MockResponse, next: () => void) => void): void;
  listen(port: number): {
    close(): void;
  };
};

const fs = require("fs") as typeof import("fs");
const path = require("path") as typeof import("path");
const express = require("express") as () => MockApp;
const TestRunner = require("./testRunner.ts").testRunner as TestRunnerConstructor;
const specs = require("../specConfig") as { availableVersions: string[] };

function createMockApp(): MockApp {
  const mockApp = express();

  mockApp.all("/xapi/*", function (_req, res) {
    res.set("Content-Type", "text/plain");
    res.set("x-experience-api-consistent-through", new Date(Date.now() + 100).toISOString());
    res.set("x-experience-api-version", "1.0.3");
    res.send({
      verb: {
        id: "http://adlnet.gov/expapi/verbs/attended",
        display: {
          "en-GB": "attended",
          "en-US": "attended",
        },
      },
      version: "1.0.0",
      timestamp: new Date(Date.now() + 100).toISOString(),
      object: {
        id: "http://www.example.com/meetings/occurances/34534",
        objectType: "Activity",
      },
      actor: {
        mbox: "mailto:xapi@adlnet.gov",
        name: "xAPI mbox",
        objectType: "Agent",
      },
      stored: new Date(Date.now() + 100).toISOString(),
      authority: {
        mbox: "mailto:lou.wolford.ctr@adlnet.gov",
        name: "lou",
        objectType: "Agent",
      },
      id: "0be2bf9f-cb7f-4d06-9987-22a9ac406edd",
    });
  });

  return mockApp;
}

function cleanLog(log: CleanRunRecord["log"]): BatteryTreeNode {
  if (!log) {
    return {
      text: "",
      children: [],
    };
  }

  return {
    text: log.name,
    children: log.tests.map(cleanLog),
  };
}

async function createBattery(version: string): Promise<BatteryInfo> {
  const runnerFlags: Record<string, unknown> = {
    endpoint: "http://localhost:3001/xapi",
    basicAuth: true,
    authPass: "User",
    authUser: "No:",
    xapiVersion: version,
  };

  const runner = new TestRunner("batteryInfo", "Admin", runnerFlags, null, {});

  return await new Promise((resolve) => {
    runner.on("message", function (message) {
      if (message.action !== "end") {
        return;
      }

      const record = runner.getCleanRecord();
      const info = {
        conformanceTestCount: record.summary.total,
        tests: cleanLog(record.log),
      };

      console.log(`[${version}] found ${record.summary.total} tests.`);

      resolve(info);
    });

    runner.start();
  });
}

async function createBatteries(): Promise<Record<string, BatteryInfo>> {
  const app = createMockApp();
  const server = app.listen(3001);

  try {
    const output: Record<string, BatteryInfo> = {};
    for (const version of specs.availableVersions) {
      output[version] = await createBattery(version);
    }

    return output;
  } finally {
    server.close();
  }
}

async function main(): Promise<void> {
  const batteryOutput = await createBatteries();
  const batteryPath = path.join(__dirname, "../batteries.js");
  const fileContents = `module.exports = ${JSON.stringify(batteryOutput, null, 2)}`;

  fs.writeFileSync(batteryPath, fileContents);
}

void main();
