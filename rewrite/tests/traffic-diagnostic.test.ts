import { expect, test } from "bun:test";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { createCaptureExecutionMetadata } from "../../src/describe-runtime/execution-owner.ts";
import type { NormalizedTrafficArtifact, RawTrafficArtifact } from "../traffic.ts";

import {
  buildRewriteArgs,
  buildUpstreamArgs,
  createTraceNodeIndex,
  readEffectiveRunnerExitCode,
  resolveRunnerScope,
  writeTraceArtifacts,
} from "../scripts/traffic-diagnostic.ts";

function createExecutionMetadata() {
  return createCaptureExecutionMetadata({
    directory: "v1_0_3",
    execution: {
      casePath: ["Formatting Requirements (Data 2.2)", "default case"],
      hookTitle: null,
      phase: "case",
      suitePath: ["Formatting Requirements (Data 2.2)"],
    },
    sourceFilePath: "src/specs/v1_0_3/Data2.2-FormattingRequirements.ts",
    sourceSymbol: "registerFormattingRequirementsV103",
    unitKey: "test/v1_0_3/Data2.2-FormattingRequirements",
    version: "1.0.3",
  });
}

function createRawArtifact(execution = createExecutionMetadata()): RawTrafficArtifact {
  return {
    captureBaseUrl: "http://127.0.0.1:12345/capture/xapi",
    compareMode: "ordered",
    completedAt: "2026-05-27T12:00:02.000Z",
    exitCode: 0,
    exchanges: [
      {
        durationMs: 5,
        endedAt: "2026-05-27T12:00:01.000Z",
        execution,
        request: {
          bodyBase64: "",
          headers: [],
          method: "GET",
          targetUrl: "http://localhost:8080/xapi/statements?statementId=1",
        },
        response: {
          bodyBase64: "",
          headers: [],
          status: 404,
        },
        sequence: 0,
        startedAt: "2026-05-27T12:00:00.000Z",
      },
      {
        durationMs: 5,
        endedAt: "2026-05-27T12:00:02.000Z",
        execution,
        request: {
          bodyBase64: "",
          headers: [],
          method: "GET",
          targetUrl: "http://localhost:8080/xapi/statements?statementId=1",
        },
        response: {
          bodyBase64: "",
          headers: [],
          status: 404,
        },
        sequence: 1,
        startedAt: "2026-05-27T12:00:01.000Z",
      },
    ],
    generatedAt: "2026-05-27T12:00:00.000Z",
    runner: "rewrite",
    targetBaseUrl: "http://localhost:8080/xapi",
    version: "1.0.3",
  };
}

function createNormalizedArtifact(execution = createExecutionMetadata()): NormalizedTrafficArtifact {
  return {
    captureBaseUrl: "http://127.0.0.1:12345/capture/xapi",
    compareMode: "ordered",
    completedAt: "2026-05-27T12:00:02.000Z",
    exitCode: 0,
    exchanges: [
      {
        attempts: 2,
        execution,
        method: "GET",
        path: "/xapi/statements",
        query: [["statementId", "1"]],
        request: {
          body: { kind: "empty" },
          headers: {},
        },
        response: {
          body: { kind: "empty" },
          headers: {},
          status: 404,
        },
        sourceSequences: [0, 1],
      },
    ],
    generatedAt: "2026-05-27T12:00:00.000Z",
    runner: "rewrite",
    targetBaseUrl: "http://localhost:8080/xapi",
    version: "1.0.3",
  };
}

test("resolveRunnerScope only treats supported optional suites as separate matrix dimensions", () => {
  expect(resolveRunnerScope("Multiplicity,v1_0_3", undefined, "1.0.3")).toEqual({
    rewriteDirectory: "Multiplicity,v1_0_3",
    upstreamDirectory: "v1_0_3",
    upstreamOptional: "Multiplicity",
    grep: undefined,
  });

  expect(resolveRunnerScope("Parameters", "Actor", "2.0.0")).toEqual({
    rewriteDirectory: "Parameters,v2_0",
    upstreamDirectory: "v2_0",
    upstreamOptional: undefined,
    grep: "(?=.*(?:Actor))(?=.*(?:\\b(?:Parameters)\\b))",
  });
});

test("buildRewriteArgs omits explicit version when directory scope already implies it", () => {
  const args = buildRewriteArgs(
    {
      compareMode: "bag",
      directory: "Parameters,v1_0_3",
      grep: undefined,
      keepClone: false,
      outDir: "/tmp/unused",
      password: "supersecret",
      targetBaseUrl: "http://localhost:8080/xapi",
      username: "janedoe",
      version: "1.0.3",
    },
    "http://127.0.0.1:12345/capture/xapi",
    "1.0.3",
  );

  expect(args).toContain("--directory");
  expect(args).toContain("Parameters,v1_0_3");
  expect(args).not.toContain("--optional");
  expect(args).not.toContain("--xapiVersion");
});

test("buildRewriteArgs uses stable unitKey selection for single-unit migration runs", () => {
  const args = buildRewriteArgs(
    {
      compareMode: "ordered",
      keepClone: false,
      outDir: "/tmp/unused",
      password: "supersecret",
      targetBaseUrl: "http://localhost:8080/xapi",
      unitKeys: ["test/v1_0_3/Data2.2-FormattingRequirements"],
      username: "janedoe",
      version: "1.0.3",
    },
    "http://127.0.0.1:12345/capture/xapi",
    "1.0.3",
  );

  expect(args).toContain("--xapiVersion");
  expect(args).toContain("1.0.3");
  expect(args).toContain("--unitKey");
  expect(args).toContain("test/v1_0_3/Data2.2-FormattingRequirements");
  expect(args).not.toContain("--directory");
  expect(args).not.toContain("--grep");
});

test("buildUpstreamArgs passes only supported optional suites separately from the version directory", () => {
  const args = buildUpstreamArgs(
    {
      compareMode: "bag",
      directory: "Parameters,v1_0_3",
      grep: undefined,
      keepClone: false,
      outDir: "/tmp/unused",
      password: "supersecret",
      targetBaseUrl: "http://localhost:8080/xapi",
      username: "janedoe",
      version: "1.0.3",
    },
    "http://127.0.0.1:12345/capture/xapi",
    "1.0.3",
    "/tmp/unused/1.0.3",
  );

  expect(args).toContain("--directory");
  expect(args).toContain("v1_0_3");
  expect(args).not.toContain("--optional");
});

test("buildUpstreamArgs forwards unitKey selection to the upstream export wrapper", () => {
  const args = buildUpstreamArgs(
    {
      compareMode: "ordered",
      keepClone: false,
      outDir: "/tmp/unused",
      password: "supersecret",
      targetBaseUrl: "http://localhost:8080/xapi",
      unitKeys: ["test/v1_0_3/Data2.2-FormattingRequirements"],
      username: "janedoe",
      version: "1.0.3",
    },
    "http://127.0.0.1:12345/capture/xapi",
    "1.0.3",
    "/tmp/unused/1.0.3",
  );

  expect(args).toContain("--unitKey");
  expect(args).toContain("test/v1_0_3/Data2.2-FormattingRequirements");
  expect(args).not.toContain("--directory");
  expect(args).not.toContain("--grep");
});

test("createTraceNodeIndex falls back to the requested unitKey when upstream metadata is unavailable", () => {
  const rawArtifact: RawTrafficArtifact = {
    ...createRawArtifact(null),
    exchanges: createRawArtifact(null).exchanges.map((exchange) => ({
      ...exchange,
      execution: null,
    })),
    runner: "upstream",
  };
  const normalizedArtifact: NormalizedTrafficArtifact = {
    ...createNormalizedArtifact(null),
    exchanges: createNormalizedArtifact(null).exchanges.map((exchange) => ({
      ...exchange,
      execution: null,
    })),
    runner: "upstream",
  };

  const traceNodeIndex = createTraceNodeIndex(rawArtifact, normalizedArtifact, [
    "test/v1_0_3/Data2.2-FormattingRequirements",
  ]);

  expect(traceNodeIndex.entries).toEqual([
    expect.objectContaining({
      attemptCount: 2,
      entryKind: "unit",
      nodeKey: "unit:test/v1_0_3/Data2.2-FormattingRequirements",
      normalizedExchangeCount: 1,
      rawExchangeCount: 2,
      selectionMode: "requested-unit-fallback",
      unitKey: "test/v1_0_3/Data2.2-FormattingRequirements",
    }),
  ]);
});

test("writeTraceArtifacts emits per-unit manifests and filtered slices", async () => {
  const tempDir = await mkdtemp(join(process.cwd(), "tmp/agents/traffic-trace-"));

  try {
    const rawArtifact = createRawArtifact();
    const normalizedArtifact = createNormalizedArtifact();
    const result = await writeTraceArtifacts(tempDir, rawArtifact, normalizedArtifact, [
      "test/v1_0_3/Data2.2-FormattingRequirements",
    ]);
    const runManifest = JSON.parse(await readFile(result.traceManifestPath, "utf8")) as {
      unitManifests: Array<{ manifestPath: string; unitKey: string }>;
    };
    const unitManifestPath = runManifest.unitManifests[0]?.manifestPath;
    if (!unitManifestPath) {
      throw new Error("Expected a unit manifest path to be written.");
    }

    const unitManifest = JSON.parse(await readFile(unitManifestPath, "utf8")) as {
      normalizedExchangeCount: number;
      rawArtifactPath: string;
      rawExchangeCount: number;
      unitKey: string;
    };
    const unitRawArtifact = JSON.parse(await readFile(unitManifest.rawArtifactPath, "utf8")) as {
      exchanges: unknown[];
    };

    expect(result.nodeIndex.entries).toEqual([
      expect.objectContaining({
        attemptCount: 2,
        entryKind: "unit",
        unitKey: "test/v1_0_3/Data2.2-FormattingRequirements",
      }),
      expect.objectContaining({
        attemptCount: 2,
        entryKind: "case",
        unitKey: "test/v1_0_3/Data2.2-FormattingRequirements",
      }),
    ]);
    expect(unitManifest).toEqual(
      expect.objectContaining({
        normalizedExchangeCount: 1,
        rawExchangeCount: 2,
        unitKey: "test/v1_0_3/Data2.2-FormattingRequirements",
      }),
    );
    expect(unitRawArtifact.exchanges).toHaveLength(2);
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
});

test("readEffectiveRunnerExitCode prefers the recorded upstream suite exit code", async () => {
  const tempDir = await mkdtemp(join(process.cwd(), "tmp/agents/traffic-exit-"));

  try {
    await writeFile(join(tempDir, "upstream-run.json"), `${JSON.stringify({ upstreamExitCode: 2 })}\n`, "utf8");

    expect(await readEffectiveRunnerExitCode("upstream", tempDir, 0)).toBe(2);
    expect(await readEffectiveRunnerExitCode("rewrite", tempDir, 0)).toBe(0);
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
});
