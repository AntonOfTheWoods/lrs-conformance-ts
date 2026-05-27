import { expect, test } from "bun:test";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { createCaptureExecutionMetadata } from "../../src/describe-runtime/execution-owner.ts";
import type { NormalizedTrafficArtifact, RawTrafficArtifact } from "../traffic.ts";

import {
  buildCandidateArgs,
  buildTraceDbStateReplayPlan,
  buildUpstreamArgs,
  compareTraceDbStateManifests,
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
    sourceFilePath: "rewrite4/test/v1_0_3/Data2.2-FormattingRequirements.js",
    sourceSymbol: "Formatting Requirements (Data 2.2)",
    unitKey: "test/v1_0_3/Data2.2-FormattingRequirements",
    version: "1.0.3",
  });
}

function createRawArtifact(
  execution: ReturnType<typeof createExecutionMetadata> | null = createExecutionMetadata(),
): RawTrafficArtifact {
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
    runner: "candidate",
    targetBaseUrl: "http://localhost:8080/xapi",
    version: "1.0.3",
  };
}

function createNormalizedArtifact(
  execution: ReturnType<typeof createExecutionMetadata> | null = createExecutionMetadata(),
): NormalizedTrafficArtifact {
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
    runner: "candidate",
    targetBaseUrl: "http://localhost:8080/xapi",
    version: "1.0.3",
  };
}

test("resolveRunnerScope only treats supported optional suites as separate matrix dimensions", () => {
  expect(resolveRunnerScope("Multiplicity,v1_0_3", undefined, "1.0.3")).toEqual({
    directory: "v1_0_3",
    optional: "Multiplicity",
    grep: undefined,
  });

  expect(resolveRunnerScope("Parameters", "Actor", "2.0.0")).toEqual({
    directory: "v2_0",
    optional: undefined,
    grep: "(?=.*(?:Actor))(?=.*(?:\\b(?:Parameters)\\b))",
  });
});

test("buildCandidateArgs targets the active rewrite4 candidate tree", () => {
  const args = buildCandidateArgs(
    {
      candidateDir: "/tmp/rewrite4",
      compareMode: "bag",
      dbStateMode: "none",
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

  expect(args).toContain("--suite-dir");
  expect(args).toContain("/tmp/rewrite4");
  expect(args).toContain("--directory");
  expect(args).toContain("v1_0_3");
  expect(args).toContain("--grep");
  expect(args).toContain("\\b(?:Parameters)\\b");
  expect(args).not.toContain("--optional");
});

test("buildCandidateArgs uses stable unitKey selection for single-unit migration runs", () => {
  const args = buildCandidateArgs(
    {
      candidateDir: "/tmp/rewrite4",
      compareMode: "ordered",
      dbStateMode: "all",
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

  expect(args).toContain("--suite-dir");
  expect(args).toContain("/tmp/rewrite4");
  expect(args).toContain("--version");
  expect(args).toContain("1.0.3");
  expect(args).toContain("--unitKey");
  expect(args).toContain("test/v1_0_3/Data2.2-FormattingRequirements");
  expect(args).not.toContain("--directory");
  expect(args).not.toContain("--grep");
});

test("buildUpstreamArgs passes only supported optional suites separately from the version directory", () => {
  const args = buildUpstreamArgs(
    {
      candidateDir: "/tmp/rewrite4",
      compareMode: "bag",
      dbStateMode: "none",
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
      candidateDir: "/tmp/rewrite4",
      compareMode: "ordered",
      dbStateMode: "all",
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

test("buildTraceDbStateReplayPlan groups trace entries by terminal raw sequence", () => {
  const nodeIndex = createTraceNodeIndex(createRawArtifact(), createNormalizedArtifact(), [
    "test/v1_0_3/Data2.2-FormattingRequirements",
  ]);

  expect(buildTraceDbStateReplayPlan(nodeIndex, "all")).toEqual([
    {
      entryKinds: ["unit", "case"],
      nodeKeys: [
        "case:test/v1_0_3/Data2.2-FormattingRequirements:Formatting Requirements (Data 2.2) > default case",
        "unit:test/v1_0_3/Data2.2-FormattingRequirements",
      ],
      rawSequenceEnd: 1,
      unitKeys: ["test/v1_0_3/Data2.2-FormattingRequirements"],
    },
  ]);
  expect(buildTraceDbStateReplayPlan(nodeIndex, "unit")).toEqual([
    {
      entryKinds: ["unit"],
      nodeKeys: ["unit:test/v1_0_3/Data2.2-FormattingRequirements"],
      rawSequenceEnd: 1,
      unitKeys: ["test/v1_0_3/Data2.2-FormattingRequirements"],
    },
  ]);
});

test("compareTraceDbStateManifests reports the first divergent boundary", async () => {
  const tempDir = await mkdtemp(join(process.cwd(), "tmp/agents/db-state-compare-"));

  try {
    const matchingFingerprint = {
      tables: {
        statements: {
          columnNames: ["id"],
          rowCount: 1,
          rowHash: "same-row-hash",
        },
      },
    };
    const candidateDivergentFingerprint = {
      tables: {
        statements: {
          columnNames: ["id"],
          rowCount: 2,
          rowHash: "candidate-row-hash",
        },
      },
    };
    const upstreamDivergentFingerprint = {
      tables: {
        statements: {
          columnNames: ["id"],
          rowCount: 1,
          rowHash: "upstream-row-hash",
        },
      },
    };

    const candidateSeq1Path = join(tempDir, "candidate-sequence-000001.json");
    const candidateSeq2Path = join(tempDir, "candidate-sequence-000002.json");
    const upstreamSeq1Path = join(tempDir, "upstream-sequence-000001.json");
    const upstreamSeq2Path = join(tempDir, "upstream-sequence-000002.json");
    await writeFile(candidateSeq1Path, `${JSON.stringify(matchingFingerprint, null, 2)}\n`, "utf8");
    await writeFile(candidateSeq2Path, `${JSON.stringify(candidateDivergentFingerprint, null, 2)}\n`, "utf8");
    await writeFile(upstreamSeq1Path, `${JSON.stringify(matchingFingerprint, null, 2)}\n`, "utf8");
    await writeFile(upstreamSeq2Path, `${JSON.stringify(upstreamDivergentFingerprint, null, 2)}\n`, "utf8");

    const unitKey = "test/v1_0_3/Data2.2-FormattingRequirements";
    const candidateManifestPath = join(tempDir, "candidate-db-state-manifest.json");
    const upstreamManifestPath = join(tempDir, "upstream-db-state-manifest.json");
    await writeFile(
      candidateManifestPath,
      `${JSON.stringify(
        {
          capturedExchangeCount: 2,
          completedRawSequenceEnd: 2,
          entries: [
            {
              entryKind: "case",
              fingerprintPath: candidateSeq1Path,
              nodeKey: `case:${unitKey}:first case`,
              rawSequenceEnd: 1,
              runner: "candidate",
              selectionMode: "captured-execution",
              unitKey,
            },
            {
              entryKind: "case",
              fingerprintPath: candidateSeq2Path,
              nodeKey: `case:${unitKey}:second case`,
              rawSequenceEnd: 2,
              runner: "candidate",
              selectionMode: "captured-execution",
              unitKey,
            },
          ],
          mode: "all",
          rawArtifactPath: join(tempDir, "candidate-raw.json"),
          replayIssues: [],
          runner: "candidate",
          schemaVersion: "trace-node-db-state-manifest.v1",
          selectedUnitKeys: [unitKey],
          traceNodeIndexPath: join(tempDir, "candidate-node-index.json"),
          version: "1.0.3",
        },
        null,
        2,
      )}\n`,
      "utf8",
    );
    await writeFile(
      upstreamManifestPath,
      `${JSON.stringify(
        {
          capturedExchangeCount: 2,
          completedRawSequenceEnd: 2,
          entries: [
            {
              entryKind: "case",
              fingerprintPath: upstreamSeq1Path,
              nodeKey: `case:${unitKey}:first case`,
              rawSequenceEnd: 1,
              runner: "upstream",
              selectionMode: "captured-execution",
              unitKey,
            },
            {
              entryKind: "case",
              fingerprintPath: upstreamSeq2Path,
              nodeKey: `case:${unitKey}:second case`,
              rawSequenceEnd: 2,
              runner: "upstream",
              selectionMode: "captured-execution",
              unitKey,
            },
          ],
          mode: "all",
          rawArtifactPath: join(tempDir, "upstream-raw.json"),
          replayIssues: [],
          runner: "upstream",
          schemaVersion: "trace-node-db-state-manifest.v1",
          selectedUnitKeys: [unitKey],
          traceNodeIndexPath: join(tempDir, "upstream-node-index.json"),
          version: "1.0.3",
        },
        null,
        2,
      )}\n`,
      "utf8",
    );

    const report = await compareTraceDbStateManifests({
      candidateManifestPath,
      upstreamManifestPath,
    });

    expect(report.different).toBe(true);
    expect(report.firstReplayIssue).toBeNull();
    expect(report.firstDivergentBoundary?.rawSequenceEnd).toBe(2);
    expect(report.firstDivergentBoundary?.fingerprintComparison).toEqual(
      expect.objectContaining({
        different: true,
        rowHashOrCountDifferences: [
          expect.objectContaining({
            table: "statements",
          }),
        ],
      }),
    );
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
});

test("readEffectiveRunnerExitCode prefers the recorded upstream suite exit code", async () => {
  const tempDir = await mkdtemp(join(process.cwd(), "tmp/agents/traffic-exit-"));

  try {
    await writeFile(join(tempDir, "upstream-run.json"), `${JSON.stringify({ suiteExitCode: 2 })}\n`, "utf8");
    await writeFile(join(tempDir, "candidate-run.json"), `${JSON.stringify({ suiteExitCode: 3 })}\n`, "utf8");

    expect(await readEffectiveRunnerExitCode("upstream", tempDir, 0)).toBe(2);
    expect(await readEffectiveRunnerExitCode("candidate", tempDir, 0)).toBe(3);
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
});
