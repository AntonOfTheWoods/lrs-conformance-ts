import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "bun:test";

import { runConsoleRunnerArgv } from "../../src/describe-runtime/console-runner.ts";

interface CapturedRequest {
  body: unknown;
  method: string;
  path: string;
  version: string | null;
}

const silentLogger = {
  log: (..._args: unknown[]) => {},
  error: (..._args: unknown[]) => {},
};

function createNowSequence(sequence: number[]): () => number {
  return () => sequence.shift() ?? 0;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function determineStatementStatus(body: unknown): number {
  if (!isObjectRecord(body)) {
    return 400;
  }

  if (!("actor" in body) || !("verb" in body) || !("object" in body)) {
    return 400;
  }

  return 200;
}

function startMockLrs() {
  const requests: CapturedRequest[] = [];

  const server = Bun.serve({
    port: 0,
    async fetch(request) {
      const url = new URL(request.url);
      if (request.method === "POST" && url.pathname === "/xapi/statements") {
        const body = await request.json();
        requests.push({
          body,
          method: request.method,
          path: url.pathname,
          version: request.headers.get("X-Experience-API-Version"),
        });

        return Response.json(
          { ok: true },
          {
            status: determineStatementStatus(body),
          },
        );
      }

      return new Response("Not found", { status: 404 });
    },
  });

  return {
    endpoint: `http://127.0.0.1:${server.port}/xapi`,
    requests,
    server,
  };
}

describe("console runner entrypoint", () => {
  test("runs the v2 formatting slice end to end and writes an upstream-style log", async () => {
    const harness = startMockLrs();
    const logDirectory = join(import.meta.dir, "..", "..", "tmp", "agents", crypto.randomUUID());

    try {
      const execution = await runConsoleRunnerArgv(["--endpoint", harness.endpoint], {
        createUuid: () => "run-v2",
        logDirectory,
        logger: silentLogger,
        now: createNowSequence([100, 160]),
      });

      expect(execution.normalizedOptions.xapiVersion).toBe("2.0.0");
      expect(execution.runRecord.summary).toEqual({
        total: 3,
        passed: 3,
        failed: 0,
        version: "2.0.0",
      });
      expect(harness.requests).toHaveLength(3);
      expect(harness.requests.every((request) => request.method === "POST")).toBe(true);
      expect(harness.requests.every((request) => request.path === "/xapi/statements")).toBe(true);
      expect(harness.requests.every((request) => request.version === "2.0.0")).toBe(true);

      const writtenRecord = JSON.parse(readFileSync(join(logDirectory, "run-v2.log"), "utf8")) as {
        log: { tests: Array<{ title: string; tests: Array<{ title: string }> }> };
        summary: { failed: number; passed: number; total: number; version: string };
      };

      expect(writtenRecord.summary).toEqual({
        total: 3,
        passed: 3,
        failed: 0,
        version: "2.0.0",
      });
      expect(writtenRecord.log.tests[0]?.title).toBe("Formatting Requirements (Data 2.2)");
      expect(writtenRecord.log.tests[0]?.tests.map((suite) => suite.title)).toEqual([
        'A Statement contains an "actor" property (Multiplicity, Data 2.2.s2.b3, XAPI-00003)',
        'A Statement contains a "verb" property (Multiplicity, Data 2.2.s2.b3, XAPI-00004)',
        'A Statement contains an "object" property (Multiplicity, Data 2.2.s2.b3, XAPI-00005)',
      ]);
    } finally {
      await harness.server.stop(true);
    }
  });

  test("runs the v1 formatting slice through the same console runner path", async () => {
    const harness = startMockLrs();
    const logDirectory = join(import.meta.dir, "..", "..", "tmp", "agents", crypto.randomUUID());

    try {
      const execution = await runConsoleRunnerArgv(["-e", harness.endpoint, "-x", "1.0.3"], {
        createUuid: () => "run-v103",
        logDirectory,
        logger: silentLogger,
        now: createNowSequence([200, 250]),
      });

      expect(execution.normalizedOptions.xapiVersion).toBe("1.0.3");
      expect(execution.runRecord.summary).toEqual({
        total: 3,
        passed: 3,
        failed: 0,
        version: "1.0.3",
      });
      expect(harness.requests).toHaveLength(3);
      expect(harness.requests.every((request) => request.version === "1.0.3")).toBe(true);

      const writtenRecord = JSON.parse(readFileSync(join(logDirectory, "run-v103.log"), "utf8")) as {
        summary: { failed: number; passed: number; total: number; version: string };
      };

      expect(writtenRecord.summary).toEqual({
        total: 3,
        passed: 3,
        failed: 0,
        version: "1.0.3",
      });
    } finally {
      await harness.server.stop(true);
    }
  });
});
