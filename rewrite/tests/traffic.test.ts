import { describe, expect, test } from "bun:test";

import {
  captureOwnerHeaderName,
  createCaptureExecutionMetadata,
  encodeCaptureExecutionMetadata,
} from "../../src/describe-runtime/execution-owner.ts";

import {
  compareNormalizedTrafficRuns,
  createExchangeSignature,
  normalizeTrafficArtifact,
  startTrafficRecorder,
  type RawTrafficArtifact,
  type RawTrafficExchange,
} from "../traffic.ts";

type CreateExecutionMetadataInput = Parameters<typeof createCaptureExecutionMetadata>[0];

function createExecutionMetadata(
  overrides: Partial<Omit<CreateExecutionMetadataInput, "execution">> & {
    execution?: Partial<CreateExecutionMetadataInput["execution"]>;
  } = {},
) {
  const baseInput: CreateExecutionMetadataInput = {
    directory: "v1_0_3",
    execution: {
      casePath: ["Formatting Requirements (Data 2.2)", "default case"],
      hookTitle: null,
      phase: "case",
      suitePath: ["Formatting Requirements (Data 2.2)"],
    },
    sourceFilePath: "archive/deprecated-rewrite3/src/specs/v1_0_3/Data2.2-FormattingRequirements.ts",
    sourceSymbol: "registerFormattingRequirementsV103",
    unitKey: "test/v1_0_3/Data2.2-FormattingRequirements",
    version: "1.0.3",
  };

  return createCaptureExecutionMetadata({
    ...baseInput,
    ...overrides,
    execution: {
      ...baseInput.execution,
      ...overrides.execution,
    },
  });
}

function createRawExchange(overrides: Partial<RawTrafficExchange> = {}): RawTrafficExchange {
  return {
    durationMs: 5,
    endedAt: "2026-05-26T12:00:01.000Z",
    execution: null,
    request: {
      bodyBase64: Buffer.from(
        JSON.stringify({
          id: "11111111-1111-4111-8111-111111111111",
          timestamp: "2026-05-26T12:00:00.000Z",
        }),
      ).toString("base64"),
      headers: [
        ["content-type", "application/json"],
        ["x-experience-api-version", "2.0.0"],
      ],
      method: "POST",
      targetUrl: "http://localhost:8080/xapi/statements?statementId=11111111-1111-4111-8111-111111111111",
    },
    response: {
      bodyBase64: Buffer.from(
        JSON.stringify({
          stored: "2026-05-26T12:00:01.000Z",
          id: "11111111-1111-4111-8111-111111111111",
        }),
      ).toString("base64"),
      headers: [
        ["content-type", "application/json"],
        ["etag", '"abcd"'],
      ],
      status: 200,
    },
    sequence: 0,
    startedAt: "2026-05-26T12:00:00.000Z",
    ...overrides,
  };
}

function createArtifact(exchange: RawTrafficExchange): RawTrafficArtifact {
  return {
    captureBaseUrl: "http://127.0.0.1:8088/capture/xapi",
    compareMode: "bag",
    completedAt: "2026-05-26T12:00:02.000Z",
    exitCode: 0,
    exchanges: [exchange],
    generatedAt: "2026-05-26T12:00:00.000Z",
    runner: "rewrite",
    targetBaseUrl: "http://localhost:8080/xapi",
    version: "2.0.0",
  };
}

describe("traffic harness", () => {
  test("normalizes UUIDs and timestamps per exchange", () => {
    const left = normalizeTrafficArtifact(createArtifact(createRawExchange()));
    const right = normalizeTrafficArtifact(
      createArtifact(
        createRawExchange({
          request: {
            bodyBase64: Buffer.from(
              JSON.stringify({
                id: "22222222-2222-4222-8222-222222222222",
                timestamp: "2026-05-26T14:00:00.000Z",
              }),
            ).toString("base64"),
            headers: [
              ["content-type", "application/json"],
              ["x-experience-api-version", "2.0.0"],
            ],
            method: "POST",
            targetUrl: "http://localhost:8080/xapi/statements?statementId=22222222-2222-4222-8222-222222222222",
          },
          response: {
            bodyBase64: Buffer.from(
              JSON.stringify({
                stored: "2026-05-26T14:00:01.000Z",
                id: "22222222-2222-4222-8222-222222222222",
              }),
            ).toString("base64"),
            headers: [
              ["content-type", "application/json"],
              ["etag", '"efgh"'],
            ],
            status: 200,
          },
        }),
      ),
    );

    expect(createExchangeSignature(left.exchanges[0]!)).toBe(createExchangeSignature(right.exchanges[0]!));
  });

  test("normalizes UUID-like JSON object keys per exchange", () => {
    const left = normalizeTrafficArtifact(
      createArtifact(
        createRawExchange({
          request: {
            bodyBase64: Buffer.from(
              JSON.stringify({
                "11111111-1111-4111-8111-111111111111": "alpha",
                location: { name: "example" },
                name: "document",
              }),
            ).toString("base64"),
            headers: [["content-type", "application/json"]],
            method: "DELETE",
            targetUrl: "http://localhost:8080/xapi/activities/profile?profileId=1",
          },
          response: {
            bodyBase64: "",
            headers: [],
            status: 204,
          },
        }),
      ),
    );
    const right = normalizeTrafficArtifact(
      createArtifact(
        createRawExchange({
          request: {
            bodyBase64: Buffer.from(
              JSON.stringify({
                "22222222-2222-4222-8222-222222222222": "alpha",
                location: { name: "example" },
                name: "document",
              }),
            ).toString("base64"),
            headers: [["content-type", "application/json"]],
            method: "DELETE",
            targetUrl: "http://localhost:8080/xapi/activities/profile?profileId=1",
          },
          response: {
            bodyBase64: "",
            headers: [],
            status: 204,
          },
        }),
      ),
    );

    expect(createExchangeSignature(left.exchanges[0]!)).toBe(createExchangeSignature(right.exchanges[0]!));
  });

  test("normalizes UUIDs embedded inside larger scalar strings", () => {
    const left = normalizeTrafficArtifact(
      createArtifact(
        createRawExchange({
          request: {
            bodyBase64: "",
            headers: [["x-experience-api-version", "2.0.0"]],
            method: "GET",
            targetUrl:
              "http://localhost:8080/xapi/activities/profile?activityId=http://www.example.com/activityId/hashset11111111-1111-4111-8111-111111111111",
          },
          response: {
            bodyBase64: Buffer.from(
              JSON.stringify({
                activityId: "http://www.example.com/activityId/hashset11111111-1111-4111-8111-111111111111",
              }),
            ).toString("base64"),
            headers: [["content-type", "application/json"]],
            status: 200,
          },
        }),
      ),
    );
    const right = normalizeTrafficArtifact(
      createArtifact(
        createRawExchange({
          request: {
            bodyBase64: "",
            headers: [["x-experience-api-version", "2.0.0"]],
            method: "GET",
            targetUrl:
              "http://localhost:8080/xapi/activities/profile?activityId=http://www.example.com/activityId/hashset22222222-2222-4222-8222-222222222222",
          },
          response: {
            bodyBase64: Buffer.from(
              JSON.stringify({
                activityId: "http://www.example.com/activityId/hashset22222222-2222-4222-8222-222222222222",
              }),
            ).toString("base64"),
            headers: [["content-type", "application/json"]],
            status: 200,
          },
        }),
      ),
    );

    expect(createExchangeSignature(left.exchanges[0]!)).toBe(createExchangeSignature(right.exchanges[0]!));
  });

  test("normalizes UUIDs embedded inside hex-adjacent scalar strings", () => {
    const left = normalizeTrafficArtifact(
      createArtifact(
        createRawExchange({
          request: {
            bodyBase64: "",
            headers: [["x-experience-api-version", "2.0.0"]],
            method: "GET",
            targetUrl:
              "http://localhost:8080/xapi/statements?activity=http://www.example.com/meetings/occurances/3453411111111-1111-4111-8111-111111111111",
          },
          response: {
            bodyBase64: Buffer.from(
              JSON.stringify({
                activity: "http://www.example.com/meetings/occurances/3453411111111-1111-4111-8111-111111111111",
              }),
            ).toString("base64"),
            headers: [["content-type", "application/json"]],
            status: 200,
          },
        }),
      ),
    );
    const right = normalizeTrafficArtifact(
      createArtifact(
        createRawExchange({
          request: {
            bodyBase64: "",
            headers: [["x-experience-api-version", "2.0.0"]],
            method: "GET",
            targetUrl:
              "http://localhost:8080/xapi/statements?activity=http://www.example.com/meetings/occurances/3453422222222-2222-4222-8222-222222222222",
          },
          response: {
            bodyBase64: Buffer.from(
              JSON.stringify({
                activity: "http://www.example.com/meetings/occurances/3453422222222-2222-4222-8222-222222222222",
              }),
            ).toString("base64"),
            headers: [["content-type", "application/json"]],
            status: 200,
          },
        }),
      ),
    );

    expect(createExchangeSignature(left.exchanges[0]!)).toBe(createExchangeSignature(right.exchanges[0]!));
  });

  test("normalizes UUIDv8-style identifiers in nested JSON fields", () => {
    const left = normalizeTrafficArtifact(
      createArtifact(
        createRawExchange({
          response: {
            bodyBase64: Buffer.from(
              JSON.stringify({
                authority: {
                  account: {
                    homePage: "http://example.org",
                    name: "019e6450-12e7-8e6a-97a0-55d528ae6626",
                  },
                  objectType: "Agent",
                },
              }),
            ).toString("base64"),
            headers: [["content-type", "application/json"]],
            status: 200,
          },
        }),
      ),
    );
    const right = normalizeTrafficArtifact(
      createArtifact(
        createRawExchange({
          response: {
            bodyBase64: Buffer.from(
              JSON.stringify({
                authority: {
                  account: {
                    homePage: "http://example.org",
                    name: "019e6450-8c10-8d70-8d4a-57f11b613504",
                  },
                  objectType: "Agent",
                },
              }),
            ).toString("base64"),
            headers: [["content-type", "application/json"]],
            status: 200,
          },
        }),
      ),
    );

    expect(createExchangeSignature(left.exchanges[0]!)).toBe(createExchangeSignature(right.exchanges[0]!));
  });

  test("normalizes UUIDs in malformed application/json request bodies", () => {
    const left = normalizeTrafficArtifact(
      createArtifact(
        createRawExchange({
          request: {
            bodyBase64: Buffer.from(
              '{"activityId":"http://www.example.com/activityId/hashset","agent":{"objectType":"Agent","account":{"homePage":"http://www.example.com/agentId/1","name":"Rick James"}},"stateId":"33333333-3333-4333-8333-333333333333"}{',
            ).toString("base64"),
            headers: [
              ["content-type", "application/json"],
              ["x-experience-api-version", "1.0.3"],
            ],
            method: "POST",
            targetUrl:
              "http://localhost:8080/xapi/activities/state?activityId=http://www.example.com/activityId/hashset&agent=%7B%22objectType%22%3A%22Agent%22%2C%22account%22%3A%7B%22homePage%22%3A%22http%3A%2F%2Fwww.example.com%2FagentId%2F1%22%2C%22name%22%3A%22Rick%20James%22%7D%7D&stateId=11111111-1111-4111-8111-111111111111",
          },
          response: {
            bodyBase64: "",
            headers: [],
            status: 400,
          },
        }),
      ),
    );
    const right = normalizeTrafficArtifact(
      createArtifact(
        createRawExchange({
          request: {
            bodyBase64: Buffer.from(
              '{"activityId":"http://www.example.com/activityId/hashset","agent":{"objectType":"Agent","account":{"homePage":"http://www.example.com/agentId/1","name":"Rick James"}},"stateId":"44444444-4444-4444-8444-444444444444"}{',
            ).toString("base64"),
            headers: [
              ["content-type", "application/json"],
              ["x-experience-api-version", "1.0.3"],
            ],
            method: "POST",
            targetUrl:
              "http://localhost:8080/xapi/activities/state?activityId=http://www.example.com/activityId/hashset&agent=%7B%22objectType%22%3A%22Agent%22%2C%22account%22%3A%7B%22homePage%22%3A%22http%3A%2F%2Fwww.example.com%2FagentId%2F1%22%2C%22name%22%3A%22Rick%20James%22%7D%7D&stateId=22222222-2222-4222-8222-222222222222",
          },
          response: {
            bodyBase64: "",
            headers: [],
            status: 400,
          },
        }),
      ),
    );

    expect(left.exchanges[0]?.request.body.kind).toBe("text");
    expect(left.exchanges[0]?.request.body).toEqual(right.exchanges[0]?.request.body);
    expect(createExchangeSignature(left.exchanges[0]!)).toBe(createExchangeSignature(right.exchanges[0]!));
  });

  test("ignores charset parameters in content-type headers", () => {
    const bodyBase64 = Buffer.from("limit=1").toString("base64");
    const responseBodyBase64 = Buffer.from(
      JSON.stringify({
        more: "/xapi/statements?limit=1&from=11111111-1111-4111-8111-111111111111",
        statements: [],
      }),
    ).toString("base64");

    const left = normalizeTrafficArtifact(
      createArtifact(
        createRawExchange({
          request: {
            bodyBase64,
            headers: [
              ["content-type", "application/x-www-form-urlencoded"],
              ["x-experience-api-version", "1.0.3"],
            ],
            method: "POST",
            targetUrl: "http://localhost:8080/xapi/statements?method=GET",
          },
          response: {
            bodyBase64: responseBodyBase64,
            headers: [["content-type", "application/json"]],
            status: 200,
          },
        }),
      ),
    );
    const right = normalizeTrafficArtifact(
      createArtifact(
        createRawExchange({
          request: {
            bodyBase64,
            headers: [
              ["content-type", "application/x-www-form-urlencoded; charset=utf-8"],
              ["x-experience-api-version", "1.0.3"],
            ],
            method: "POST",
            targetUrl: "http://localhost:8080/xapi/statements?method=GET",
          },
          response: {
            bodyBase64: responseBodyBase64,
            headers: [["content-type", "application/json; charset=utf-8"]],
            status: 200,
          },
        }),
      ),
    );

    expect(createExchangeSignature(left.exchanges[0]!)).toBe(createExchangeSignature(right.exchanges[0]!));
  });

  test("normalizes UUIDs embedded in malformed form field names", () => {
    const left = normalizeTrafficArtifact(
      createArtifact(
        createRawExchange({
          request: {
            bodyBase64: Buffer.from(
              JSON.stringify({
                statementId: "11111111-1111-4111-8111-111111111111",
                content: '{"actor":{"objectType":"Agent","name":"xAPI mbox","mbox":"mailto:xapi@adlnet.gov"}}',
                "X-Experience-API-Version": "1.0.3",
              }),
            ).toString("base64"),
            headers: [
              ["content-type", "application/x-www-form-urlencoded"],
              ["x-experience-api-version", "1.0.3"],
            ],
            method: "POST",
            targetUrl: "http://localhost:8080/xapi/statements?method=PUT",
          },
          response: {
            bodyBase64: "",
            headers: [],
            status: 400,
          },
        }),
      ),
    );
    const right = normalizeTrafficArtifact(
      createArtifact(
        createRawExchange({
          request: {
            bodyBase64: Buffer.from(
              JSON.stringify({
                statementId: "22222222-2222-4222-8222-222222222222",
                content: '{"actor":{"objectType":"Agent","name":"xAPI mbox","mbox":"mailto:xapi@adlnet.gov"}}',
                "X-Experience-API-Version": "1.0.3",
              }),
            ).toString("base64"),
            headers: [
              ["content-type", "application/x-www-form-urlencoded; charset=utf-8"],
              ["x-experience-api-version", "1.0.3"],
            ],
            method: "POST",
            targetUrl: "http://localhost:8080/xapi/statements?method=PUT",
          },
          response: {
            bodyBase64: "",
            headers: [],
            status: 400,
          },
        }),
      ),
    );

    expect(left.exchanges[0]?.request.body).toEqual(right.exchanges[0]?.request.body);
    expect(createExchangeSignature(left.exchanges[0]!)).toBe(createExchangeSignature(right.exchanges[0]!));
  });

  test("ignores request content-type when the request body is empty", () => {
    const left = normalizeTrafficArtifact(
      createArtifact(
        createRawExchange({
          request: {
            bodyBase64: "",
            headers: [
              ["content-type", "application/json"],
              ["authorization", "Basic abc123"],
            ],
            method: "GET",
            targetUrl: "http://localhost:8080/xapi/about",
          },
          response: {
            bodyBase64: Buffer.from(JSON.stringify({ version: ["1.0.3"] })).toString("base64"),
            headers: [["content-type", "application/json; charset=utf-8"]],
            status: 200,
          },
        }),
      ),
    );
    const right = normalizeTrafficArtifact(
      createArtifact(
        createRawExchange({
          request: {
            bodyBase64: "",
            headers: [["authorization", "Basic def456"]],
            method: "GET",
            targetUrl: "http://localhost:8080/xapi/about",
          },
          response: {
            bodyBase64: Buffer.from(JSON.stringify({ version: ["1.0.3"] })).toString("base64"),
            headers: [["content-type", "application/json; charset=utf-8"]],
            status: 200,
          },
        }),
      ),
    );

    expect(createExchangeSignature(left.exchanges[0]!)).toBe(createExchangeSignature(right.exchanges[0]!));
  });

  test("ignores request authorization header presence differences", () => {
    const left = normalizeTrafficArtifact(
      createArtifact(
        createRawExchange({
          request: {
            bodyBase64: "",
            headers: [["authorization", "Basic abc123"]],
            method: "GET",
            targetUrl: "http://localhost:8080/xapi/about",
          },
          response: {
            bodyBase64: Buffer.from(JSON.stringify({ version: ["1.0.3"] })).toString("base64"),
            headers: [["content-type", "application/json; charset=utf-8"]],
            status: 200,
          },
        }),
      ),
    );
    const right = normalizeTrafficArtifact(
      createArtifact(
        createRawExchange({
          request: {
            bodyBase64: "",
            headers: [],
            method: "GET",
            targetUrl: "http://localhost:8080/xapi/about",
          },
          response: {
            bodyBase64: Buffer.from(JSON.stringify({ version: ["1.0.3"] })).toString("base64"),
            headers: [["content-type", "application/json; charset=utf-8"]],
            status: 200,
          },
        }),
      ),
    );

    expect(createExchangeSignature(left.exchanges[0]!)).toBe(createExchangeSignature(right.exchanges[0]!));
  });

  test("compresses consecutive equivalent exchanges before bag comparison", () => {
    const normalized = normalizeTrafficArtifact({
      ...createArtifact(createRawExchange()),
      exchanges: [createRawExchange(), createRawExchange({ sequence: 1 }), createRawExchange({ sequence: 2 })],
    });

    expect(normalized.exchanges).toHaveLength(1);
    expect(normalized.exchanges[0]?.attempts).toBe(3);

    const comparison = compareNormalizedTrafficRuns(normalized, normalized, "bag");
    expect(comparison.signatureMismatches).toHaveLength(0);
    expect(comparison.leftCount).toBe(3);
    expect(comparison.rightCount).toBe(3);
    expect(comparison.matchedCount).toBe(3);
  });

  test("does not compress equivalent exchanges across different execution metadata", () => {
    const leftExecution = createExecutionMetadata({
      execution: {
        casePath: ["Formatting Requirements (Data 2.2)", "left case"],
        hookTitle: null,
        phase: "case",
        suitePath: ["Formatting Requirements (Data 2.2)"],
      },
    });
    const rightExecution = createExecutionMetadata({
      execution: {
        casePath: ["Formatting Requirements (Data 2.2)", "right case"],
        hookTitle: null,
        phase: "case",
        suitePath: ["Formatting Requirements (Data 2.2)"],
      },
    });

    const normalized = normalizeTrafficArtifact({
      ...createArtifact(createRawExchange()),
      exchanges: [
        createRawExchange({ execution: leftExecution }),
        createRawExchange({ execution: leftExecution, sequence: 1 }),
        createRawExchange({ execution: rightExecution, sequence: 2 }),
      ],
    });

    expect(normalized.exchanges).toHaveLength(2);
    expect(normalized.exchanges[0]?.attempts).toBe(2);
    expect(normalized.exchanges[0]?.execution?.casePath?.at(-1)).toBe("left case");
    expect(normalized.exchanges[0]?.execution?.unitKey).toBe("test/v1_0_3/Data2.2-FormattingRequirements");
    expect(normalized.exchanges[0]?.sourceSequences).toEqual([0, 1]);
    expect(normalized.exchanges[1]?.attempts).toBe(1);
    expect(normalized.exchanges[1]?.execution?.casePath?.at(-1)).toBe("right case");
    expect(normalized.exchanges[1]?.sourceSequences).toEqual([2]);
  });

  test("bag comparison detects attempt-count drift after compression", () => {
    const left = normalizeTrafficArtifact({
      ...createArtifact(createRawExchange()),
      exchanges: [createRawExchange(), createRawExchange({ sequence: 1 }), createRawExchange({ sequence: 2 })],
    });
    const right = normalizeTrafficArtifact({
      ...createArtifact(createRawExchange()),
      exchanges: [createRawExchange(), createRawExchange({ sequence: 1 })],
    });

    const comparison = compareNormalizedTrafficRuns(left, right, "bag");
    expect(comparison.leftCount).toBe(3);
    expect(comparison.rightCount).toBe(2);
    expect(comparison.matchedCount).toBe(2);
    expect(comparison.signatureMismatches).toHaveLength(1);
  });

  test("records and forwards traffic through the proxy", async () => {
    const targetServer = Bun.serve({
      hostname: "127.0.0.1",
      port: 0,
      fetch(request) {
        return new Response(
          JSON.stringify({
            method: request.method,
            ownerHeader: request.headers.get(captureOwnerHeaderName),
            path: new URL(request.url).pathname,
          }),
          {
            headers: {
              "content-type": "application/json",
            },
            status: 201,
          },
        );
      },
    });

    const recorder = await startTrafficRecorder({
      targetBaseUrl: `http://127.0.0.1:${targetServer.port}/xapi`,
    });

    try {
      const execution = createExecutionMetadata({
        execution: {
          casePath: ["Statement Lifecycle Requirements", "probe case"],
          hookTitle: null,
          phase: "case",
          suitePath: ["Statement Lifecycle Requirements"],
        },
        sourceFilePath: "archive/deprecated-rewrite3/src/specs/v1_0_3/Data2.3-StatementLifecycle.ts",
        sourceSymbol: "registerStatementLifecycleRequirementsV103",
        unitKey: "test/v1_0_3/Data2.3-StatementLifecycle",
      });
      const response = await fetch(`${recorder.captureBaseUrl}/statements?limit=1`, {
        method: "GET",
        headers: {
          "X-Experience-API-Version": "2.0.0",
          [captureOwnerHeaderName]: encodeCaptureExecutionMetadata(execution),
        },
      });

      expect(response.status).toBe(201);
      expect((await response.json()) as { method: string; ownerHeader: string | null; path: string }).toEqual({
        ownerHeader: null,
        method: "GET",
        path: "/xapi/statements",
      });

      const artifact = recorder.takeArtifact({
        compareMode: "bag",
        exitCode: 0,
        runner: "rewrite",
        version: "2.0.0",
      });

      expect(artifact.exchanges).toHaveLength(1);
      expect(artifact.exchanges[0]?.request.method).toBe("GET");
      expect(artifact.exchanges[0]?.request.targetUrl).toBe(
        `http://127.0.0.1:${targetServer.port}/xapi/statements?limit=1`,
      );
      expect(artifact.exchanges[0]?.execution).toEqual(execution);
      expect(artifact.exchanges[0]?.execution?.unitKey).toBe("test/v1_0_3/Data2.3-StatementLifecycle");
      expect(artifact.exchanges[0]?.response.status).toBe(201);
    } finally {
      await recorder.stop();
      await targetServer.stop(true);
    }
  });
});
