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

const allowedStatementKeys = new Set([
  "id",
  "actor",
  "verb",
  "object",
  "result",
  "context",
  "timestamp",
  "stored",
  "authority",
  "version",
  "attachments",
]);

const allowedInteractionTypes = new Set([
  "true-false",
  "choice",
  "fill-in",
  "long-fill-in",
  "matching",
  "performance",
  "sequencing",
  "likert",
  "numeric",
  "other",
]);

const allowedActorObjectTypes = new Set(["Agent", "Group"]);

const languageTagPattern =
  /^[A-Za-z]{2,3}(?:-[A-Za-z]{4})?(?:-(?:[A-Za-z]{2}|\d{3}))?(?:-(?:[A-Za-z0-9]{5,8}|\d[A-Za-z0-9]{3}))*$/;

const interactionComponentParents = new Set(["choices", "scale", "source", "target", "steps"]);

function determineStatementStatus(body: unknown): number {
  if (!isObjectRecord(body)) {
    return 400;
  }

  if (!("actor" in body) || !("verb" in body) || !("object" in body)) {
    return 400;
  }

  if ("id" in body && !isUuidLike(typeof body.id === "string" ? body.id : null)) {
    return 400;
  }

  if (Object.keys(body).some((key) => !allowedStatementKeys.has(key))) {
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

  if (hasInvalidNullOutsideExtensions(body, false)) {
    return 400;
  }

  if (hasInvalidAccountName(body)) {
    return 400;
  }

  if (hasInvalidInteractionType(body)) {
    return 400;
  }

  if (hasInvalidLanguageTag(body)) {
    return 400;
  }

  if (hasInvalidActorObjectType(body)) {
    return 400;
  }

  if (hasMissingIriScheme(body)) {
    return 400;
  }

  return 200;
}

function hasInvalidNullOutsideExtensions(value: unknown, insideExtensions: boolean): boolean {
  if (value === null) {
    return !insideExtensions;
  }

  if (Array.isArray(value)) {
    return value.some((item) => hasInvalidNullOutsideExtensions(item, insideExtensions));
  }

  if (!isObjectRecord(value)) {
    return false;
  }

  return Object.entries(value).some(([key, childValue]) => {
    const childInsideExtensions = insideExtensions || key === "extensions";
    return hasInvalidNullOutsideExtensions(childValue, childInsideExtensions);
  });
}

function hasInvalidAccountName(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some((item) => hasInvalidAccountName(item));
  }

  if (!isObjectRecord(value)) {
    return false;
  }

  const account = value.account;
  if (isObjectRecord(account) && "name" in account && typeof account.name !== "string") {
    return true;
  }

  return Object.values(value).some((childValue) => hasInvalidAccountName(childValue));
}

function hasInvalidInteractionType(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some((item) => hasInvalidInteractionType(item));
  }

  if (!isObjectRecord(value)) {
    return false;
  }

  const definition = value.definition;
  if (isObjectRecord(definition) && typeof definition.interactionType === "string") {
    if (!allowedInteractionTypes.has(definition.interactionType)) {
      return true;
    }
  }

  return Object.values(value).some((childValue) => hasInvalidInteractionType(childValue));
}

function isLanguageMapPath(path: readonly string[]): boolean {
  const last = path.at(-1);
  if (!last) {
    return false;
  }

  if (last === "display" && path.at(-2) === "verb") {
    return true;
  }

  if ((last === "display" || last === "description") && path.at(-3) === "attachments") {
    return true;
  }

  if ((last === "name" || last === "description") && path.at(-2) === "definition") {
    return true;
  }

  if (last === "description" && interactionComponentParents.has(path.at(-3) ?? "")) {
    return true;
  }

  return false;
}

function isValidLanguageTag(value: string): boolean {
  return languageTagPattern.test(value);
}

function hasInvalidLanguageTag(value: unknown, path: readonly string[] = []): boolean {
  if (typeof value === "string") {
    return path.at(-1) === "language" && path.at(-2) === "context" && !isValidLanguageTag(value);
  }

  if (Array.isArray(value)) {
    return value.some((item, index) => hasInvalidLanguageTag(item, [...path, String(index)]));
  }

  if (!isObjectRecord(value)) {
    return false;
  }

  if (isLanguageMapPath(path)) {
    return Object.keys(value).some((key) => !isValidLanguageTag(key));
  }

  return Object.entries(value).some(([key, childValue]) => hasInvalidLanguageTag(childValue, [...path, key]));
}

function hasInvalidActorObjectType(value: unknown, path: readonly string[] = []): boolean {
  if (Array.isArray(value)) {
    return value.some((item, index) => hasInvalidActorObjectType(item, [...path, String(index)]));
  }

  if (!isObjectRecord(value)) {
    return false;
  }

  if (isActorLikePath(path)) {
    const objectType = value.objectType;
    if (objectType !== undefined && (typeof objectType !== "string" || !allowedActorObjectTypes.has(objectType))) {
      return true;
    }
  }

  return Object.entries(value).some(([key, childValue]) => hasInvalidActorObjectType(childValue, [...path, key]));
}

function isActorLikePath(path: readonly string[]): boolean {
  const last = path.at(-1);
  return last === "actor" || last === "authority" || last === "instructor" || last === "team";
}

function hasMissingIriScheme(value: unknown, path: readonly string[] = []): boolean {
  if (typeof value === "string") {
    const last = path.at(-1);
    if (!last) {
      return false;
    }

    if (last === "openid") {
      return !hasScheme(value);
    }

    if (last === "homePage" && path.at(-2) === "account") {
      return !hasScheme(value);
    }

    if (last === "id" && path.at(-2) === "verb") {
      return !hasScheme(value);
    }

    if ((last === "type" || last === "moreInfo") && path.at(-2) === "definition") {
      return !hasScheme(value);
    }

    if ((last === "usageType" || last === "fileUrl") && path.at(-3) === "attachments") {
      return !hasScheme(value);
    }

    return false;
  }

  if (Array.isArray(value)) {
    return value.some((item, index) => hasMissingIriScheme(item, [...path, String(index)]));
  }

  if (!isObjectRecord(value)) {
    return false;
  }

  if (path.at(-1) === "object" && typeof value.id === "string") {
    const objectType = typeof value.objectType === "string" ? value.objectType : "Activity";
    if (objectType !== "StatementRef" && !hasScheme(value.id)) {
      return true;
    }
  }

  if (
    path.at(-1) === "extensions" &&
    (path.at(-2) === "definition" || path.at(-2) === "context" || path.at(-2) === "result")
  ) {
    return Object.keys(value).some((key) => !hasScheme(key));
  }

  return Object.entries(value).some(([key, childValue]) => hasMissingIriScheme(childValue, [...path, key]));
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

      if (request.method === "PUT" && url.pathname === "/xapi/statements") {
        if (!isUuidLike(url.searchParams.get("statementId"))) {
          return Response.json({ ok: false }, { status: 400 });
        }

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
        total: 155,
        passed: 155,
        failed: 0,
        version: "2.0.0",
      });
      expect(
        harness.requests.filter((request) => request.path === "/xapi/statements" && request.method === "POST"),
      ).toHaveLength(139);
      expect(
        harness.requests.filter((request) => request.path === "/xapi/statements" && request.method === "PUT"),
      ).toHaveLength(11);
      expect(
        harness.requests.filter((request) => request.path === "/xapi/statements" && request.method === "GET"),
      ).toHaveLength(7);
      expect(harness.requests.every((request) => request.version === "2.0.0")).toBe(true);

      const writtenRecord = JSON.parse(readFileSync(join(logDirectory, "run-v2.log"), "utf8")) as {
        log: { tests: Array<{ title: string; tests: Array<{ title: string }> }> };
        summary: { failed: number; passed: number; total: number; version: string };
      };

      expect(writtenRecord.summary).toEqual({
        total: 155,
        passed: 155,
        failed: 0,
        version: "2.0.0",
      });
      expect(writtenRecord.log.tests[0]?.title).toBe("Formatting Requirements (Data 2.2)");
      expect(writtenRecord.log.tests[0]?.tests.map((suite) => suite.title)).toEqual([
        'A Statement contains an "actor" property (Multiplicity, Data 2.2.s2.b3, XAPI-00003)',
        'A Statement contains a "verb" property (Multiplicity, Data 2.2.s2.b3, XAPI-00004)',
        'A Statement contains an "object" property (Multiplicity, Data 2.2.s2.b3, XAPI-00005)',
        'An LRS rejects with error code 400 Bad Request any Statement having a property whose value is set to "null", except in an "extensions" property (Data 2.2.s4.b1.b1, XAPI-00001)',
        "An LRS rejects with error code 400 Bad Request a Statement which uses the wrong data type (Data 2.2.s4.b2, XAPI-00006)",
        "An LRS rejects with error code 400 Bad Request a Statement which uses any non-format-following key or value, including the empty string, where a string with a particular format, such as mailto IRI, UUID, or IRI, is required. (Data 2.2.s4.b4, XAPI-00007)",
        "An LRS rejects with error code 400 Bad Request a Statement where the case of a key does not match the case specified in this specification. (Data 2.2.s4.b1.b5, XAPI-00008, XAPI-00010)",
        "An LRS rejects with error code 400 Bad Request a Statement where the case of a value restricted to enumerated values does not match an enumerated value given in this specification exactly. (Data 2.2.s4.b1.b6, XAPI-00009)",
        "The LRS rejects with error code 400 Bad Request a token with does not validate as matching the RFC 5646 standard in the sequence of token lengths for language map keys. (Format, Data 2.2.s4.b2, Data 2.4.6.s3.table1.row7, RFC5646, XAPI-00013)",
        "Statements Verify Templates",
        "Agents Verify Templates",
        "Groups Verify Templates",
        'A Group is defined by "objectType" of an "actor" property or "object" property with value "Group" (Data 2.4.2.2.s2.table2.row1)',
        'An Anonymous Group is defined by "objectType" of an "actor" or "object" with value "Group" and by none of "mbox", "mbox_sha1sum", "openid", or "account" being used (Data 2.4.2.2.s2.table1.row1)',
        "Verbs Verify Templates",
        "Objects Verify Templates",
        "Activities Verify Templates",
        "All Objects are well-created JSON Objects (Nature of binding, Data 2.1, XAPI-00014) **Implicit**",
        "An LRS rejects with error code 400 Bad Request a Statement containing IRL or IRI values without a scheme. (Data 2.2.s4.b1.b8, XAPI-00011)",
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
        total: 155,
        passed: 155,
        failed: 0,
        version: "1.0.3",
      });
      expect(harness.requests).toHaveLength(157);
      expect(harness.requests.every((request) => request.version === "1.0.3")).toBe(true);

      const writtenRecord = JSON.parse(readFileSync(join(logDirectory, "run-v103.log"), "utf8")) as {
        summary: { failed: number; passed: number; total: number; version: string };
      };

      expect(writtenRecord.summary).toEqual({
        total: 155,
        passed: 155,
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
        total: 183,
        passed: 183,
        failed: 0,
        version: "2.0.0",
      });
      expect(harness.requests.filter((request) => request.path === "/xapi/statements")).toHaveLength(157);
      expect(harness.requests.filter((request) => request.path === "/xapi/activities/state")).toHaveLength(13);
      expect(harness.requests.filter((request) => request.path === "/xapi/agents/profile")).toHaveLength(6);
      expect(harness.requests.filter((request) => request.path === "/xapi/activities/profile")).toHaveLength(9);
      expect(harness.requests.every((request) => request.version === "2.0.0")).toBe(true);

      const writtenRecord = JSON.parse(readFileSync(join(logDirectory, "run-parameters-v2.log"), "utf8")) as {
        summary: { failed: number; passed: number; total: number; version: string };
      };

      expect(writtenRecord.summary).toEqual({
        total: 183,
        passed: 183,
        failed: 0,
        version: "2.0.0",
      });
    } finally {
      await harness.server.stop(true);
    }
  });

  test("runs the Multiplicity slice alongside v2_0 without adding HTTP traffic", async () => {
    const harness = startMockLrs();
    const logDirectory = join(import.meta.dir, "..", "..", "tmp", "agents", crypto.randomUUID());

    try {
      const execution = await runConsoleRunnerArgv(
        ["--endpoint", harness.endpoint, "--directory", "Multiplicity,v2_0"],
        {
          createUuid: () => "run-multiplicity-v2",
          logDirectory,
          logger: silentLogger,
          now: createNowSequence([400, 470]),
        },
      );

      expect(execution.normalizedOptions.directory).toEqual(["Multiplicity", "v2_0"]);
      expect(execution.normalizedOptions.xapiVersion).toBe("2.0.0");
      expect(execution.runRecord.summary).toEqual({
        total: 237,
        passed: 237,
        failed: 0,
        version: "2.0.0",
      });
      expect(harness.requests.filter((request) => request.path === "/xapi/statements")).toHaveLength(157);
      expect(harness.requests.filter((request) => request.path !== "/xapi/statements")).toHaveLength(0);

      const writtenRecord = JSON.parse(readFileSync(join(logDirectory, "run-multiplicity-v2.log"), "utf8")) as {
        log: { tests: Array<{ title: string }> };
        summary: { failed: number; passed: number; total: number; version: string };
      };

      expect(writtenRecord.summary).toEqual({
        total: 237,
        passed: 237,
        failed: 0,
        version: "2.0.0",
      });
      expect(writtenRecord.log.tests.map((suite) => suite.title)).toEqual([
        "Welcome to Multiplicity Testing.  A Statement, Object or Verb's properties are used at most one time",
        "Formatting Requirements (Data 2.2)",
      ]);
    } finally {
      await harness.server.stop(true);
    }
  });
});
