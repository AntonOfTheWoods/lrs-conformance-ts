import { expect, test } from "bun:test";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { createCaptureExecutionMetadata } from "../../src/describe-runtime/execution-owner.ts";
import {
  compareNormalizedTrafficRuns,
  type NormalizedExchange,
  type NormalizedTrafficArtifact,
  type RawTrafficArtifact,
} from "../traffic.ts";

import {
  buildCandidateArgs,
  buildTraceDbStateReplayPlan,
  buildUpstreamArgs,
  compareTraceDbStateManifests,
  createTraceNodeIndex,
  readEffectiveRunnerExitCode,
  resolveRunnerScope,
  stabilizeSignedStatementAttachments,
  suppressSignedStatementAttachmentDbDifferences,
  suppressSequenceOnlyDbStateDifferences,
  stabilizeTimingDrivenStatementPolls,
  suppressTimingDrivenStatementPollMismatches,
  type TraceDbStateComparisonReport,
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

async function createAgentsTempDir(prefix: string): Promise<string> {
  const agentsDir = join(process.cwd(), "tmp/agents");
  await mkdir(agentsDir, { recursive: true });
  return mkdtemp(join(agentsDir, prefix));
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

function createStatementPollExecutionMetadata(caseName: string) {
  return createCaptureExecutionMetadata({
    directory: "v1_0_3",
    execution: {
      casePath: ["Retrieval of Statements (Data 2.5)", caseName],
      hookTitle: null,
      phase: "case",
      suitePath: ["Retrieval of Statements (Data 2.5)"],
    },
    sourceFilePath: "rewrite4/test/v1_0_3/E.Data2.5-RetrievalofStatements.js",
    sourceSymbol: "Retrieval of Statements (Data 2.5)",
    unitKey: "test/v1_0_3/E.Data2.5-RetrievalofStatements",
    version: "1.0.3",
  });
}

function createStatementPollExchange(
  execution: ReturnType<typeof createStatementPollExecutionMetadata>,
  attempts: number,
): NormalizedExchange {
  return {
    attempts,
    execution,
    method: "GET",
    path: "/xapi/statements",
    query: [["limit", "1"]],
    request: {
      body: { kind: "empty" as const },
      headers: {
        "x-experience-api-version": "1.0.3",
      },
    },
    response: {
      body: {
        body: {
          more: "/xapi/statements?limit=1&from=next-page",
          statements: [{ id: "statement-1" }],
        },
        kind: "json" as const,
      },
      headers: {
        "content-type": "application/json",
      },
      status: 200,
    },
    sourceSequences: Array.from({ length: attempts }, (_, index) => index),
  };
}

function createInvalidStatementParamExecutionMetadata(caseName: string) {
  return createCaptureExecutionMetadata({
    directory: "v1_0_3",
    execution: {
      casePath: ["Statement Resource Requirements (Communication 2.1)", caseName],
      hookTitle: null,
      phase: "case",
      suitePath: ["Statement Resource Requirements (Communication 2.1)"],
    },
    sourceFilePath: "rewrite4/test/v1_0_3/H.Communication2.1-StatementResource.js",
    sourceSymbol: "Statement Resource Requirements (Communication 2.1)",
    unitKey: "test/v1_0_3/H.Communication2.1-StatementResource",
    version: "1.0.3",
  });
}

function createInvalidStatementParamExchange(
  execution: ReturnType<typeof createInvalidStatementParamExecutionMetadata>,
  attempts: number,
): NormalizedExchange {
  return {
    attempts,
    execution,
    method: "GET",
    path: "/xapi/statements",
    query: [
      ["activity", "http://www.example.com/meetings/occurances/12345"],
      ["statementId", "statement-1"],
    ],
    request: {
      body: { kind: "empty" as const },
      headers: {
        "x-experience-api-version": "1.0.3",
      },
    },
    response: {
      body: {
        body: {
          error: {
            message: "Invalid Params for path: /xapi/statements",
            params: {
              activity: "http://www.example.com/meetings/occurances/12345",
              statementId: "statement-1",
            },
          },
        },
        kind: "json" as const,
      },
      headers: {
        "content-type": "application/json",
        "x-experience-api-consistent-through": "2026-05-27T12:00:00.000Z",
      },
      status: 400,
    },
    sourceSequences: Array.from({ length: attempts }, (_, index) => index),
  };
}

function createSignedStatementExecutionMetadata(caseName: string) {
  return createCaptureExecutionMetadata({
    directory: "v1_0_3",
    execution: {
      casePath: [
        "Signed Statements (Data 2.6)",
        'The JWS signature MUST use an algorithm of "RS256", "RS384", or "RS512". (Data 2.6.s4.b4, XAPI-00117)',
        caseName,
      ],
      hookTitle: null,
      phase: "case",
      suitePath: [
        "Signed Statements (Data 2.6)",
        'The JWS signature MUST use an algorithm of "RS256", "RS384", or "RS512". (Data 2.6.s4.b4, XAPI-00117)',
      ],
    },
    sourceFilePath: "rewrite4/test/v1_0_3/E.Data2.6-SignedStatements.js",
    sourceSymbol: "Signed Statements (Data 2.6)",
    unitKey: "test/v1_0_3/E.Data2.6-SignedStatements",
    version: "1.0.3",
  });
}

function createSignedStatementExchange(
  execution: ReturnType<typeof createSignedStatementExecutionMetadata>,
  signatureSha: string,
) {
  return {
    attempts: 1,
    execution,
    method: "POST",
    path: "/xapi/statements",
    query: [],
    request: {
      body: {
        body: [
          {
            body: {
              body: {
                actor: {
                  mbox: "mailto:xapi@adlnet.gov",
                  name: "xAPI mbox",
                  objectType: "Agent",
                },
                attachments: [
                  {
                    contentType: "application/octet-stream",
                    description: { "en-US": "Signed by the Test Suite" },
                    display: { "en-US": "Signed by the Test Suite" },
                    length: 796,
                    sha2: signatureSha,
                    usageType: "http://adlnet.gov/expapi/attachments/signature",
                  },
                ],
                id: "{{uuid:0}}",
                object: {
                  id: "http://www.example.com/meetings/occurances/34534",
                  objectType: "Activity",
                },
                verb: {
                  display: { "en-GB": "attended", "en-US": "attended" },
                  id: "http://adlnet.gov/expapi/verbs/attended",
                },
              },
              kind: "json" as const,
            },
            headers: {
              "content-type": "application/json",
            },
          },
          {
            body: {
              byteLength: 796,
              kind: "binary" as const,
              sha256: signatureSha,
            },
            headers: {
              "content-type": "application/octet-stream",
            },
          },
        ],
        kind: "multipart" as const,
      },
      headers: {
        "content-type": "multipart/mixed",
        "x-experience-api-version": "1.0.3",
      },
    },
    response: {
      body: {
        body: ["{{uuid:0}}"],
        kind: "json" as const,
      },
      headers: {
        "content-type": "application/json",
      },
      status: 200,
    },
    sourceSequences: [0],
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

test("suppressTimingDrivenStatementPollMismatches ignores wait-loop retry drift for identical statement polls", () => {
  const xapi113 = createStatementPollExecutionMetadata(
    `An LRS's Statement API, upon processing a successful GET request, will return a single "statements" property and a single "more" property. (Data 2.5.s2.table1, XAPI-00113) > will return single statements property and may return`,
  );
  const xapi114 = createStatementPollExecutionMetadata(
    `A "statements" property which is too large for a single page will create a container for each additional page (Data 2.5.s2.table1.row1, XAPI-00114)`,
  );

  const candidate: NormalizedTrafficArtifact = {
    ...createNormalizedArtifact(xapi113),
    compareMode: "bag",
    exchanges: [createStatementPollExchange(xapi113, 4), createStatementPollExchange(xapi114, 12)],
  };
  const upstream: NormalizedTrafficArtifact = {
    ...createNormalizedArtifact(xapi113),
    compareMode: "bag",
    exchanges: [createStatementPollExchange(xapi113, 5), createStatementPollExchange(xapi114, 12)],
    runner: "upstream",
  };

  const comparison = compareNormalizedTrafficRuns(candidate, upstream, "bag");
  expect(comparison.signatureMismatches).toHaveLength(1);

  const effective = suppressTimingDrivenStatementPollMismatches(candidate, upstream, comparison);
  expect(effective.leftCount).toBe(16);
  expect(effective.rightCount).toBe(16);
  expect(effective.matchedCount).toBe(16);
  expect(effective.signatureMismatches).toHaveLength(0);
  expect(effective.ignoredSignatureMismatches).toHaveLength(1);
});

test("suppressTimingDrivenStatementPollMismatches ignores multi-owner invalid statementId retry drift", () => {
  const xapi151 = createInvalidStatementParamExecutionMetadata(
    `An LRS's Statement Resource rejects with error code 400 a GET request with both "statementId" and anything other than "attachments" or "format" as parameters (Communication 2.1.3.s2.b2, XAPI-00151) > should fail when using "statementId" with "activity"`,
  );
  const xapi150 = createInvalidStatementParamExecutionMetadata(
    `An LRS's Statement Resource rejects with error code 400 a GET request with both "voidedStatementId" and anything other than "attachments" or "format" as parameters (Communication 2.1.3.s2.b2, XAPI-00150) > should fail when using "voidedStatementId" with "activity"`,
  );

  const candidate: NormalizedTrafficArtifact = {
    ...createNormalizedArtifact(xapi151),
    compareMode: "bag",
    exchanges: [createInvalidStatementParamExchange(xapi151, 8), createInvalidStatementParamExchange(xapi150, 5)],
  };
  const upstream: NormalizedTrafficArtifact = {
    ...createNormalizedArtifact(xapi151),
    compareMode: "bag",
    exchanges: [createInvalidStatementParamExchange(xapi151, 7), createInvalidStatementParamExchange(xapi150, 3)],
    runner: "upstream",
  };

  const comparison = compareNormalizedTrafficRuns(candidate, upstream, "bag");
  expect(comparison.leftCount).toBe(13);
  expect(comparison.rightCount).toBe(10);
  expect(comparison.signatureMismatches).toHaveLength(1);

  const effective = suppressTimingDrivenStatementPollMismatches(candidate, upstream, comparison);
  expect(effective.leftCount).toBe(10);
  expect(effective.rightCount).toBe(10);
  expect(effective.matchedCount).toBe(10);
  expect(effective.signatureMismatches).toHaveLength(0);
  expect(effective.ignoredSignatureMismatches).toHaveLength(1);
});

test("stabilizeTimingDrivenStatementPolls strips volatile statement timestamps from repeated poll bursts", () => {
  const xapi110 = createStatementPollExecutionMetadata(
    'A "statements" property is an Array of Statements (Type, Data 2.5.s2.table1.row1, XAPI-00110) > should return StatementResult with statements as array using GET without "statementId" or "voidedStatementId"',
  );

  const candidate: NormalizedTrafficArtifact = {
    ...createNormalizedArtifact(xapi110),
    compareMode: "bag",
    exchanges: [
      {
        ...createStatementPollExchange(xapi110, 8),
        response: {
          body: {
            body: {
              more: "",
              statements: [
                { id: "statement-1", stored: "2026-05-27T12:00:01.000Z", timestamp: "2026-05-27T12:00:01.000Z" },
                { id: "statement-2", stored: "2026-05-27T12:00:02.000Z", timestamp: "2026-05-27T12:00:02.000Z" },
              ],
            },
            kind: "json",
          },
          headers: {
            "content-type": "application/json",
          },
          status: 200,
        },
      },
    ],
  };
  const upstream: NormalizedTrafficArtifact = {
    ...createNormalizedArtifact(xapi110),
    compareMode: "bag",
    exchanges: [
      {
        ...createStatementPollExchange(xapi110, 4),
        response: {
          body: {
            body: {
              more: "",
              statements: [
                { id: "statement-1", stored: "2026-05-27T12:10:01.000Z", timestamp: "2026-05-27T12:10:01.000Z" },
                { id: "statement-2", stored: "2026-05-27T12:10:02.000Z", timestamp: "2026-05-27T12:10:02.000Z" },
              ],
            },
            kind: "json",
          },
          headers: {
            "content-type": "application/json",
          },
          status: 200,
        },
      },
    ],
    runner: "upstream",
  };

  const rawComparison = compareNormalizedTrafficRuns(candidate, upstream, "bag");
  expect(rawComparison.signatureMismatches).toHaveLength(2);

  const comparison = compareNormalizedTrafficRuns(
    stabilizeTimingDrivenStatementPolls(candidate),
    stabilizeTimingDrivenStatementPolls(upstream),
    "bag",
  );
  expect(comparison.leftCount).toBe(1);
  expect(comparison.rightCount).toBe(1);
  expect(comparison.matchedCount).toBe(1);
  expect(comparison.signatureMismatches).toHaveLength(0);
});

test("stabilizeSignedStatementAttachments strips volatile signature hashes from signed multipart requests", () => {
  const execution = createSignedStatementExecutionMetadata('Accepts signed statement with "RS256"');

  const candidate: NormalizedTrafficArtifact = {
    ...createNormalizedArtifact(execution),
    compareMode: "bag",
    exchanges: [
      createSignedStatementExchange(execution, "2da56d1f2a7c58a9e695381b7ef892e522a68df551207b30151944d6016a4b51"),
    ],
  };
  const upstream: NormalizedTrafficArtifact = {
    ...createNormalizedArtifact(execution),
    compareMode: "bag",
    exchanges: [
      createSignedStatementExchange(execution, "4f0a646fd358f88cb60575a1c3f82b4ec47ac6cbda613daa50f25996041f0fd0"),
    ],
    runner: "upstream",
  };

  const rawComparison = compareNormalizedTrafficRuns(candidate, upstream, "bag");
  expect(rawComparison.signatureMismatches).toHaveLength(2);

  const comparison = compareNormalizedTrafficRuns(
    stabilizeSignedStatementAttachments(candidate),
    stabilizeSignedStatementAttachments(upstream),
    "bag",
  );
  expect(comparison.leftCount).toBe(1);
  expect(comparison.rightCount).toBe(1);
  expect(comparison.matchedCount).toBe(1);
  expect(comparison.signatureMismatches).toHaveLength(0);
});

test("suppressSequenceOnlyDbStateDifferences ignores aligned-boundary sequence drift in diagnostic reports", () => {
  const report: TraceDbStateComparisonReport = {
    candidateCapturedExchangeCount: 21,
    candidateCompletedRawSequenceEnd: 14,
    candidateManifestPath: "/tmp/candidate-manifest.json",
    candidateReplayIssues: [],
    comparedBoundaryCount: 2,
    different: true,
    divergentBoundaries: [],
    firstDivergentBoundary: null,
    firstReplayIssue: null,
    upstreamCapturedExchangeCount: 19,
    upstreamCompletedRawSequenceEnd: 12,
    upstreamManifestPath: "/tmp/upstream-manifest.json",
    upstreamReplayIssues: [],
  };

  const effective = suppressSequenceOnlyDbStateDifferences(report);
  expect(effective.different).toBe(false);
  expect(effective.candidateCompletedRawSequenceEnd).toBe(14);
  expect(effective.upstreamCompletedRawSequenceEnd).toBe(12);
});

test("suppressSignedStatementAttachmentDbDifferences ignores hash-only signed statement storage drift", () => {
  const report: TraceDbStateComparisonReport = {
    candidateCapturedExchangeCount: 7,
    candidateCompletedRawSequenceEnd: 6,
    candidateManifestPath: "/tmp/candidate-manifest.json",
    candidateReplayIssues: [],
    comparedBoundaryCount: 7,
    different: true,
    divergentBoundaries: [
      {
        candidate: {
          entryKinds: ["case"],
          fingerprintPath: "/tmp/candidate-sequence-3.json",
          nodeKeys: [
            'case:test/v1_0_3/E.Data2.6-SignedStatements:Signed Statements (Data 2.6) > The JWS signature MUST use an algorithm of "RS256", "RS384", or "RS512". (Data 2.6.s4.b4, XAPI-00117) > Accepts signed statement with "RS256"',
          ],
          rawSequenceEnd: 3,
          unitKeys: ["test/v1_0_3/E.Data2.6-SignedStatements"],
        },
        different: true,
        fingerprintComparison: {
          different: true,
          onlyLeft: [],
          onlyRight: [],
          rowHashOrCountDifferences: [
            {
              left: {
                columnNames: ["id", "statement_id", "attachment_sha", "content_type", "content_length", "contents"],
                rowCount: 1,
                rowHash: "candidate-attachment-hash",
              },
              right: {
                columnNames: ["id", "statement_id", "attachment_sha", "content_type", "content_length", "contents"],
                rowCount: 1,
                rowHash: "upstream-attachment-hash",
              },
              table: "attachment",
            },
            {
              left: {
                columnNames: [
                  "id",
                  "statement_id",
                  "registration",
                  "verb_iri",
                  "is_voided",
                  "payload",
                  "timestamp",
                  "stored",
                  "reaction_id",
                  "trigger_id",
                ],
                rowCount: 1,
                rowHash: "candidate-statement-hash",
              },
              right: {
                columnNames: [
                  "id",
                  "statement_id",
                  "registration",
                  "verb_iri",
                  "is_voided",
                  "payload",
                  "timestamp",
                  "stored",
                  "reaction_id",
                  "trigger_id",
                ],
                rowCount: 1,
                rowHash: "upstream-statement-hash",
              },
              table: "xapi_statement",
            },
          ],
        },
        rawSequenceEnd: 3,
        upstream: {
          entryKinds: ["case"],
          fingerprintPath: "/tmp/upstream-sequence-3.json",
          nodeKeys: [
            'case:test/v1_0_3/E.Data2.6-SignedStatements:Signed Statements (Data 2.6) > The JWS signature MUST use an algorithm of "RS256", "RS384", or "RS512". (Data 2.6.s4.b4, XAPI-00117) > Accepts signed statement with "RS256"',
          ],
          rawSequenceEnd: 3,
          unitKeys: ["test/v1_0_3/E.Data2.6-SignedStatements"],
        },
      },
    ],
    firstDivergentBoundary: {
      candidate: {
        entryKinds: ["case"],
        fingerprintPath: "/tmp/candidate-sequence-3.json",
        nodeKeys: [
          'case:test/v1_0_3/E.Data2.6-SignedStatements:Signed Statements (Data 2.6) > The JWS signature MUST use an algorithm of "RS256", "RS384", or "RS512". (Data 2.6.s4.b4, XAPI-00117) > Accepts signed statement with "RS256"',
        ],
        rawSequenceEnd: 3,
        unitKeys: ["test/v1_0_3/E.Data2.6-SignedStatements"],
      },
      different: true,
      fingerprintComparison: {
        different: true,
        onlyLeft: [],
        onlyRight: [],
        rowHashOrCountDifferences: [
          {
            left: {
              columnNames: ["id", "statement_id", "attachment_sha", "content_type", "content_length", "contents"],
              rowCount: 1,
              rowHash: "candidate-attachment-hash",
            },
            right: {
              columnNames: ["id", "statement_id", "attachment_sha", "content_type", "content_length", "contents"],
              rowCount: 1,
              rowHash: "upstream-attachment-hash",
            },
            table: "attachment",
          },
          {
            left: {
              columnNames: [
                "id",
                "statement_id",
                "registration",
                "verb_iri",
                "is_voided",
                "payload",
                "timestamp",
                "stored",
                "reaction_id",
                "trigger_id",
              ],
              rowCount: 1,
              rowHash: "candidate-statement-hash",
            },
            right: {
              columnNames: [
                "id",
                "statement_id",
                "registration",
                "verb_iri",
                "is_voided",
                "payload",
                "timestamp",
                "stored",
                "reaction_id",
                "trigger_id",
              ],
              rowCount: 1,
              rowHash: "upstream-statement-hash",
            },
            table: "xapi_statement",
          },
        ],
      },
      rawSequenceEnd: 3,
      upstream: {
        entryKinds: ["case"],
        fingerprintPath: "/tmp/upstream-sequence-3.json",
        nodeKeys: [
          'case:test/v1_0_3/E.Data2.6-SignedStatements:Signed Statements (Data 2.6) > The JWS signature MUST use an algorithm of "RS256", "RS384", or "RS512". (Data 2.6.s4.b4, XAPI-00117) > Accepts signed statement with "RS256"',
        ],
        rawSequenceEnd: 3,
        unitKeys: ["test/v1_0_3/E.Data2.6-SignedStatements"],
      },
    },
    firstReplayIssue: null,
    upstreamCapturedExchangeCount: 7,
    upstreamCompletedRawSequenceEnd: 6,
    upstreamManifestPath: "/tmp/upstream-manifest.json",
    upstreamReplayIssues: [],
  };

  const effective = suppressSignedStatementAttachmentDbDifferences(report);
  expect(effective.different).toBe(false);
  expect(effective.divergentBoundaries).toHaveLength(0);
  expect(effective.firstDivergentBoundary).toBeNull();
});

test("writeTraceArtifacts emits per-unit manifests and filtered slices", async () => {
  const tempDir = await createAgentsTempDir("traffic-trace-");

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
  const tempDir = await createAgentsTempDir("db-state-compare-");

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

test("compareTraceDbStateManifests ignores raw-sequence shifts when node-aligned snapshots still match", async () => {
  const tempDir = await createAgentsTempDir("db-state-align-");

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

    const candidateCasePath = join(tempDir, "candidate-sequence-000012.json");
    const candidateHookPath = join(tempDir, "candidate-sequence-000014.json");
    const upstreamCasePath = join(tempDir, "upstream-sequence-000010.json");
    const upstreamHookPath = join(tempDir, "upstream-sequence-000012.json");
    await writeFile(candidateCasePath, `${JSON.stringify(matchingFingerprint, null, 2)}\n`, "utf8");
    await writeFile(candidateHookPath, `${JSON.stringify(matchingFingerprint, null, 2)}\n`, "utf8");
    await writeFile(upstreamCasePath, `${JSON.stringify(matchingFingerprint, null, 2)}\n`, "utf8");
    await writeFile(upstreamHookPath, `${JSON.stringify(matchingFingerprint, null, 2)}\n`, "utf8");

    const unitKey = "test/v1_0_3/Data2.3-StatementLifecycle";
    const candidateManifestPath = join(tempDir, "candidate-db-state-manifest.json");
    const upstreamManifestPath = join(tempDir, "upstream-db-state-manifest.json");
    await writeFile(
      candidateManifestPath,
      `${JSON.stringify(
        {
          capturedExchangeCount: 21,
          completedRawSequenceEnd: 14,
          entries: [
            {
              entryKind: "case",
              fingerprintPath: candidateCasePath,
              nodeKey: `case:${unitKey}:voided statement 404 lookup`,
              rawSequenceEnd: 12,
              runner: "candidate",
              selectionMode: "captured-execution",
              unitKey,
            },
            {
              entryKind: "hook",
              fingerprintPath: candidateHookPath,
              nodeKey: `hook:${unitKey}:voiding statement guard:`,
              rawSequenceEnd: 14,
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
          capturedExchangeCount: 19,
          completedRawSequenceEnd: 12,
          entries: [
            {
              entryKind: "case",
              fingerprintPath: upstreamCasePath,
              nodeKey: `case:${unitKey}:voided statement 404 lookup`,
              rawSequenceEnd: 10,
              runner: "upstream",
              selectionMode: "captured-execution",
              unitKey,
            },
            {
              entryKind: "hook",
              fingerprintPath: upstreamHookPath,
              nodeKey: `hook:${unitKey}:voiding statement guard:`,
              rawSequenceEnd: 12,
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
    expect(report.comparedBoundaryCount).toBe(2);
    expect(report.divergentBoundaries).toHaveLength(0);
    expect(report.firstDivergentBoundary).toBeNull();
    expect(report.firstReplayIssue).toBeNull();
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
});

test("compareTraceDbStateManifests treats mirrored replay issues as non-divergent", async () => {
  const tempDir = await createAgentsTempDir("db-state-replay-");

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

    const candidatePath = join(tempDir, "candidate-sequence-000018.json");
    const upstreamPath = join(tempDir, "upstream-sequence-000018.json");
    await writeFile(candidatePath, `${JSON.stringify(matchingFingerprint, null, 2)}\n`, "utf8");
    await writeFile(upstreamPath, `${JSON.stringify(matchingFingerprint, null, 2)}\n`, "utf8");

    const unitKey = "test/v1_0_3/Data2.4.1-IDProperty";
    const candidateManifestPath = join(tempDir, "candidate-db-state-manifest.json");
    const upstreamManifestPath = join(tempDir, "upstream-db-state-manifest.json");
    await writeFile(
      candidateManifestPath,
      `${JSON.stringify(
        {
          capturedExchangeCount: 19,
          completedRawSequenceEnd: 18,
          entries: [
            {
              entryKind: "unit",
              fingerprintPath: candidatePath,
              nodeKey: `unit:${unitKey}`,
              rawSequenceEnd: 18,
              runner: "candidate",
              selectionMode: "captured-execution",
              unitKey,
            },
          ],
          mode: "all",
          rawArtifactPath: join(tempDir, "candidate-raw.json"),
          replayIssues: [
            {
              actualStatus: 404,
              expectedStatus: 200,
              method: "GET",
              rawSequence: 17,
              targetUrl: "http://localhost:8080/xapi/statements?statementId=c92ba9f7-8e3b-4cba-a678-bf8cf29f976e",
            },
            {
              actualStatus: 404,
              expectedStatus: 200,
              method: "GET",
              rawSequence: 18,
              targetUrl: "http://localhost:8080/xapi/statements?statementId=c92ba9f7-8e3b-4cba-a678-bf8cf29f976e",
            },
          ],
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
          capturedExchangeCount: 19,
          completedRawSequenceEnd: 18,
          entries: [
            {
              entryKind: "unit",
              fingerprintPath: upstreamPath,
              nodeKey: `unit:${unitKey}`,
              rawSequenceEnd: 18,
              runner: "upstream",
              selectionMode: "captured-execution",
              unitKey,
            },
          ],
          mode: "all",
          rawArtifactPath: join(tempDir, "upstream-raw.json"),
          replayIssues: [
            {
              actualStatus: 404,
              expectedStatus: 200,
              method: "GET",
              rawSequence: 17,
              targetUrl: "http://localhost:8080/xapi/statements?statementId=441a8f66-ffab-4a36-b0bc-bd0e50da5e14",
            },
            {
              actualStatus: 404,
              expectedStatus: 200,
              method: "GET",
              rawSequence: 18,
              targetUrl: "http://localhost:8080/xapi/statements?statementId=441a8f66-ffab-4a36-b0bc-bd0e50da5e14",
            },
          ],
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

    expect(report.different).toBe(false);
    expect(report.divergentBoundaries).toHaveLength(0);
    expect(report.firstDivergentBoundary).toBeNull();
    expect(report.firstReplayIssue).toEqual(
      expect.objectContaining({
        runner: "candidate",
      }),
    );
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
});

test("readEffectiveRunnerExitCode prefers the recorded upstream suite exit code", async () => {
  const tempDir = await createAgentsTempDir("traffic-exit-");

  try {
    await writeFile(join(tempDir, "upstream-run.json"), `${JSON.stringify({ suiteExitCode: 2 })}\n`, "utf8");
    await writeFile(join(tempDir, "candidate-run.json"), `${JSON.stringify({ suiteExitCode: 3 })}\n`, "utf8");

    expect(await readEffectiveRunnerExitCode("upstream", tempDir, 0)).toBe(2);
    expect(await readEffectiveRunnerExitCode("candidate", tempDir, 0)).toBe(3);
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
});
