import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "bun:test";

import { runConsoleRunnerArgv } from "../../src/describe-runtime/console-runner.ts";

interface CapturedRequest {
  body: unknown;
  method: string;
  path: string;
  query: string;
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

  const result = body.result;
  if (isObjectRecord(result)) {
    const score = result.score;
    if (isObjectRecord(score) && typeof score.max === "string") {
      return 400;
    }

    if (typeof result.success === "string") {
      return 400;
    }

    if (typeof result.completion === "string") {
      return 400;
    }
  }

  return 200;
}

function isUuidLike(value: string | null): boolean {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  );
}

function hasScheme(value: string | null): boolean {
  return typeof value === "string" && /^[a-zA-Z][a-zA-Z0-9+.-]*:.+/.test(value);
}

function isAgentQueryValid(value: string | null): boolean {
  if (typeof value !== "string") {
    return false;
  }

  try {
    const parsed = JSON.parse(value) as { objectType?: string };
    return isObjectRecord(parsed) && parsed.objectType === "Agent";
  } catch {
    return false;
  }
}

function validateStatementQuery(searchParams: URLSearchParams): number | undefined {
  if (searchParams.has("statementId") && !isUuidLike(searchParams.get("statementId"))) {
    return 400;
  }

  if (searchParams.has("voidedStatementId") && !isUuidLike(searchParams.get("voidedStatementId"))) {
    return 400;
  }

  if (searchParams.has("agent") && !isAgentQueryValid(searchParams.get("agent"))) {
    return 400;
  }

  if (searchParams.has("verb") && !hasScheme(searchParams.get("verb"))) {
    return 400;
  }

  if (searchParams.has("activity") && !hasScheme(searchParams.get("activity"))) {
    return 400;
  }

  if (searchParams.has("registration") && !isUuidLike(searchParams.get("registration"))) {
    return 400;
  }

  return undefined;
}

function validateStateResourceQuery(searchParams: URLSearchParams): number {
  if (searchParams.has("activityId") && !hasScheme(searchParams.get("activityId"))) {
    return 400;
  }

  if (searchParams.has("stateId") && !isUuidLike(searchParams.get("stateId"))) {
    return 400;
  }

  if (searchParams.has("agent") && !isAgentQueryValid(searchParams.get("agent"))) {
    return 400;
  }

  return 200;
}

function validateActivityProfileQuery(searchParams: URLSearchParams): number {
  if (searchParams.has("activityId") && !hasScheme(searchParams.get("activityId"))) {
    return 400;
  }

  if (searchParams.has("profileId") && !isUuidLike(searchParams.get("profileId"))) {
    return 400;
  }

  if (searchParams.has("agent") && !isAgentQueryValid(searchParams.get("agent"))) {
    return 400;
  }

  return 200;
}

function validateAgentProfileQuery(searchParams: URLSearchParams): number {
  if (searchParams.has("profileId") && !isUuidLike(searchParams.get("profileId"))) {
    return 400;
  }

  if (searchParams.has("agent") && !isAgentQueryValid(searchParams.get("agent"))) {
    return 400;
  }

  return 200;
}

function startMockLrs() {
  const requests: CapturedRequest[] = [];
  const storedStatements = new Map<string, Record<string, unknown>>();

  const server = Bun.serve({
    port: 0,
    async fetch(request) {
      const url = new URL(request.url);
      const requestText = await request.text();
      const body = requestText.length > 0 ? (JSON.parse(requestText) as unknown) : undefined;

      requests.push({
        body,
        method: request.method,
        path: url.pathname,
        query: url.search,
        version: request.headers.get("X-Experience-API-Version"),
      });

      if (request.method === "POST" && url.pathname === "/xapi/statements") {
        const status = determineStatementStatus(body);
        if (status === 200 && isObjectRecord(body) && typeof body.id === "string") {
          storedStatements.set(body.id, {
            ...body,
            stored: new Date().toISOString(),
          });
        }

        return Response.json(
          { ok: true },
          {
            status,
          },
        );
      }

      if (request.method === "GET" && url.pathname === "/xapi/statements") {
        const validationStatus = validateStatementQuery(url.searchParams);
        if (validationStatus) {
          return Response.json({ ok: false }, { status: validationStatus });
        }

        const statementId = url.searchParams.get("statementId");
        if (statementId) {
          const storedStatement = storedStatements.get(statementId);
          if (storedStatement) {
            return Response.json(storedStatement, { status: 200 });
          }

          return Response.json({ ok: false }, { status: 404 });
        }

        return Response.json({ ok: true }, { status: 200 });
      }

      if (url.pathname === "/xapi/activities/state") {
        return Response.json({ ok: true }, { status: validateStateResourceQuery(url.searchParams) });
      }

      if (url.pathname === "/xapi/agents/profile") {
        return Response.json({ ok: true }, { status: validateAgentProfileQuery(url.searchParams) });
      }

      if (url.pathname === "/xapi/activities/profile") {
        return Response.json({ ok: true }, { status: validateActivityProfileQuery(url.searchParams) });
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
        total: 13,
        passed: 13,
        failed: 0,
        version: "2.0.0",
      });
      expect(
        harness.requests.filter((request) => request.path === "/xapi/statements" && request.method === "POST"),
      ).toHaveLength(8);
      expect(
        harness.requests.filter((request) => request.path === "/xapi/statements" && request.method === "GET"),
      ).toHaveLength(7);
      expect(harness.requests.every((request) => request.version === "2.0.0")).toBe(true);

      const writtenRecord = JSON.parse(readFileSync(join(logDirectory, "run-v2.log"), "utf8")) as {
        log: { tests: Array<{ title: string; tests: Array<{ title: string }> }> };
        summary: { failed: number; passed: number; total: number; version: string };
      };

      expect(writtenRecord.summary).toEqual({
        total: 13,
        passed: 13,
        failed: 0,
        version: "2.0.0",
      });
      expect(writtenRecord.log.tests[0]?.title).toBe("Formatting Requirements (Data 2.2)");
      expect(writtenRecord.log.tests[0]?.tests.map((suite) => suite.title)).toEqual([
        'A Statement contains an "actor" property (Multiplicity, Data 2.2.s2.b3, XAPI-00003)',
        'A Statement contains a "verb" property (Multiplicity, Data 2.2.s2.b3, XAPI-00004)',
        'A Statement contains an "object" property (Multiplicity, Data 2.2.s2.b3, XAPI-00005)',
        "An LRS rejects with error code 400 Bad Request a Statement which uses the wrong data type (Data 2.2.s4.b2, XAPI-00006)",
        "The LRS rejects with error code 400 Bad Request parameter values which do not validate to the same standards required for values of the same types in Statements (Data 2.2.s4.b4, XAPI-00012)",
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
        total: 13,
        passed: 13,
        failed: 0,
        version: "1.0.3",
      });
      expect(harness.requests).toHaveLength(15);
      expect(harness.requests.every((request) => request.version === "1.0.3")).toBe(true);

      const writtenRecord = JSON.parse(readFileSync(join(logDirectory, "run-v103.log"), "utf8")) as {
        summary: { failed: number; passed: number; total: number; version: string };
      };

      expect(writtenRecord.summary).toEqual({
        total: 13,
        passed: 13,
        failed: 0,
        version: "1.0.3",
      });
    } finally {
      await harness.server.stop(true);
    }
  });

  test("runs the Parameters slice alongside v2_0 through directory selection", async () => {
    const harness = startMockLrs();
    const logDirectory = join(import.meta.dir, "..", "..", "tmp", "agents", crypto.randomUUID());

    try {
      const execution = await runConsoleRunnerArgv(["--endpoint", harness.endpoint, "--directory", "Parameters,v2_0"], {
        createUuid: () => "run-parameters-v2",
        logDirectory,
        logger: silentLogger,
        now: createNowSequence([300, 360]),
      });

      expect(execution.normalizedOptions.directory).toEqual(["Parameters", "v2_0"]);
      expect(execution.normalizedOptions.xapiVersion).toBe("2.0.0");
      expect(execution.runRecord.summary).toEqual({
        total: 41,
        passed: 41,
        failed: 0,
        version: "2.0.0",
      });
      expect(harness.requests.filter((request) => request.path === "/xapi/statements")).toHaveLength(15);
      expect(harness.requests.filter((request) => request.path === "/xapi/activities/state")).toHaveLength(13);
      expect(harness.requests.filter((request) => request.path === "/xapi/agents/profile")).toHaveLength(6);
      expect(harness.requests.filter((request) => request.path === "/xapi/activities/profile")).toHaveLength(9);
      expect(harness.requests.every((request) => request.version === "2.0.0")).toBe(true);

      const writtenRecord = JSON.parse(readFileSync(join(logDirectory, "run-parameters-v2.log"), "utf8")) as {
        summary: { failed: number; passed: number; total: number; version: string };
      };

      expect(writtenRecord.summary).toEqual({
        total: 41,
        passed: 41,
        failed: 0,
        version: "2.0.0",
      });
    } finally {
      await harness.server.stop(true);
    }
  });
});
