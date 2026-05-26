import { describe, expect, test } from "bun:test";

import {
  compareNormalizedTrafficRuns,
  createExchangeSignature,
  normalizeTrafficArtifact,
  startTrafficRecorder,
  type RawTrafficArtifact,
  type RawTrafficExchange,
} from "../traffic.ts";

function createRawExchange(overrides: Partial<RawTrafficExchange> = {}): RawTrafficExchange {
  return {
    durationMs: 5,
    endedAt: "2026-05-26T12:00:01.000Z",
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
      const response = await fetch(`${recorder.captureBaseUrl}/statements?limit=1`, {
        method: "GET",
        headers: {
          "X-Experience-API-Version": "2.0.0",
        },
      });

      expect(response.status).toBe(201);

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
      expect(artifact.exchanges[0]?.response.status).toBe(201);
    } finally {
      await recorder.stop();
      await targetServer.stop(true);
    }
  });
});
