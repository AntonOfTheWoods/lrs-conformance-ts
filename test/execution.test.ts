import { describe, expect, test } from "bun:test";

import type {
  CaseDefinition,
  EndpointKind,
  HttpRequest,
  RegistryDefinition,
  SuiteDefinition,
} from "../src/domain/contracts";
import { runRegistryVersion } from "../src/execution/runner";
import { createProofSliceRegistry } from "../src/specs/v2_0/proof-slice";
import { startMockLrs } from "../src/testing/mock-lrs";

const proofSliceExecutionTimeoutMs = 10_000;

function countBy<T>(items: readonly T[], toKey: (item: T) => string): Map<string, number> {
  const counts = new Map<string, number>();

  for (const item of items) {
    const key = toKey(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return counts;
}

interface ExecutionSummary {
  suites: number;
  cases: number;
  requests: number;
  methods: Map<string, number>;
  paths: Map<string, number>;
}

function emptyExecutionSummary(): ExecutionSummary {
  return {
    suites: 0,
    cases: 0,
    requests: 0,
    methods: new Map(),
    paths: new Map(),
  };
}

function incrementCount(counts: Map<string, number>, key: string): void {
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

function endpointPath(endpoint: EndpointKind): string {
  switch (endpoint) {
    case "about":
      return "/xapi/about";
    case "activities":
      return "/xapi/activities";
    case "activities-profile":
      return "/xapi/activities/profile";
    case "activities-state":
      return "/xapi/activities/state";
    case "agents":
      return "/xapi/agents";
    case "agents-profile":
      return "/xapi/agents/profile";
    case "statements":
      return "/xapi/statements";
  }
}

function addRequest(summary: ExecutionSummary, request: HttpRequest): void {
  summary.requests += 1;
  incrementCount(summary.methods, request.method);
  incrementCount(summary.paths, endpointPath(request.endpoint));
}

function addCase(summary: ExecutionSummary, testCase: CaseDefinition): void {
  summary.cases += 1;

  switch (testCase.execution.kind) {
    case "single-request":
      addRequest(summary, testCase.execution.request);
      return;
    case "submit-and-query":
      addRequest(summary, testCase.execution.submit);
      addRequest(summary, testCase.execution.query);
      return;
    case "request-sequence":
      for (const request of testCase.execution.steps) {
        addRequest(summary, request);
      }
      return;
  }
}

function addSuite(summary: ExecutionSummary, suite: SuiteDefinition): void {
  summary.suites += 1;

  for (const child of suite.children) {
    if (child.type === "suite") {
      addSuite(summary, child);
      continue;
    }

    addCase(summary, child);
  }
}

function summarizeRegistryVersion(registry: RegistryDefinition, version: "2.0.0" | "1.0.3"): ExecutionSummary {
  const summary = emptyExecutionSummary();

  for (const suite of registry.versions[version]) {
    addSuite(summary, suite);
  }

  return summary;
}

describe("runtime executor", () => {
  test("applies authMode Authorization headers and preserves explicit overrides", async () => {
    const seenAuthorizationHeaders: string[] = [];
    const registry: RegistryDefinition = {
      versions: {
        "2.0.0": [
          {
            type: "suite",
            id: "auth-proof-suite",
            title: "Auth Proof Suite",
            specVersion: "2.0.0",
            tags: [],
            children: [
              {
                type: "case",
                id: "auth-proof-basic",
                title: "basic auth header",
                specVersion: "2.0.0",
                requirementRefs: [
                  {
                    id: "AUTH-1",
                    section: "Execution",
                    title: "basic auth header is applied",
                  },
                ],
                tags: [],
                capabilityFlags: [],
                execution: {
                  kind: "single-request",
                  request: {
                    method: "GET",
                    endpoint: "statements",
                    authMode: "basic",
                    headers: {
                      "X-Experience-API-Version": "2.0.0",
                    },
                    query: {},
                  },
                },
                assertion: {
                  kind: "single-request",
                  status: 200,
                  expectedHeaders: [],
                  expectedHeaderPatterns: [],
                  jsonPathEquals: [],
                  textContains: [],
                  notes: [],
                },
              },
              {
                type: "case",
                id: "auth-proof-oauth1",
                title: "oauth1 auth header",
                specVersion: "2.0.0",
                requirementRefs: [
                  {
                    id: "AUTH-2",
                    section: "Execution",
                    title: "oauth1 auth header is applied",
                  },
                ],
                tags: [],
                capabilityFlags: [],
                execution: {
                  kind: "single-request",
                  request: {
                    method: "GET",
                    endpoint: "statements",
                    authMode: "oauth1",
                    headers: {
                      "X-Experience-API-Version": "2.0.0",
                    },
                    query: {},
                  },
                },
                assertion: {
                  kind: "single-request",
                  status: 200,
                  expectedHeaders: [],
                  expectedHeaderPatterns: [],
                  jsonPathEquals: [],
                  textContains: [],
                  notes: [],
                },
              },
              {
                type: "case",
                id: "auth-proof-override",
                title: "explicit auth header override",
                specVersion: "2.0.0",
                requirementRefs: [
                  {
                    id: "AUTH-3",
                    section: "Execution",
                    title: "explicit auth header is preserved",
                  },
                ],
                tags: [],
                capabilityFlags: [],
                execution: {
                  kind: "single-request",
                  request: {
                    method: "GET",
                    endpoint: "statements",
                    authMode: "basic",
                    headers: {
                      "X-Experience-API-Version": "2.0.0",
                      Authorization: "Basic ZXhwbGljaXQ6b3ZlcnJpZGU=",
                    },
                    query: {},
                  },
                },
                assertion: {
                  kind: "single-request",
                  status: 200,
                  expectedHeaders: [],
                  expectedHeaderPatterns: [],
                  jsonPathEquals: [],
                  textContains: [],
                  notes: [],
                },
              },
            ],
          },
        ],
        "1.0.3": [],
      },
    };

    const result = await runRegistryVersion(registry, "2.0.0", {
      baseUrl: "http://example.test/xapi",
      fetchImpl: async (_input, init) => {
        const headers = new Headers(init?.headers);
        seenAuthorizationHeaders.push(headers.get("authorization") ?? "<missing>");

        return new Response("{}", {
          status: 200,
          headers: {
            "content-type": "application/json",
            "x-experience-api-version": "2.0.0",
          },
        });
      },
    });

    expect(result.status).toBe("passed");
    expect(seenAuthorizationHeaders).toEqual([
      "Basic cHJvb2YtYmFzaWMtdXNlcjpwcm9vZi1iYXNpYy1wYXNzd29yZA==",
      'OAuth oauth_consumer_key="proof-consumer-key"',
      "Basic ZXhwbGljaXQ6b3ZlcnJpZGU=",
    ]);
  });

  test(
    "runs the 2.0 proof slice end to end against the mock LRS",
    async () => {
      const registry = createProofSliceRegistry();
      const expected = summarizeRegistryVersion(registry, "2.0.0");
      const mockLrs = startMockLrs();

      try {
        const result = await runRegistryVersion(registry, "2.0.0", {
          baseUrl: mockLrs.baseUrl,
        });

        expect(result.status).toBe("passed");
        expect(result.root.children).toHaveLength(8);
        expect(result.root.children.every((child) => child.status === "passed")).toBe(true);

        const methodCounts = countBy(mockLrs.requests, (request) => request.method);
        const pathCounts = countBy(mockLrs.requests, (request) => request.path);

        expect(mockLrs.requests).toHaveLength(expected.requests);
        expect(methodCounts.get("POST")).toBe(expected.methods.get("POST"));
        expect(methodCounts.get("GET")).toBe(expected.methods.get("GET"));
        expect(methodCounts.get("HEAD")).toBe(expected.methods.get("HEAD"));
        expect(methodCounts.get("DELETE")).toBe(expected.methods.get("DELETE"));
        expect(methodCounts.get("PUT")).toBe(expected.methods.get("PUT"));
        expect(pathCounts.get("/xapi/statements")).toBe(expected.paths.get("/xapi/statements"));
        expect(pathCounts.get("/xapi/about")).toBe(expected.paths.get("/xapi/about"));
        expect(pathCounts.get("/xapi/activities")).toBe(expected.paths.get("/xapi/activities"));
        expect(pathCounts.get("/xapi/activities/state")).toBe(expected.paths.get("/xapi/activities/state"));
        expect(pathCounts.get("/xapi/activities/profile")).toBe(expected.paths.get("/xapi/activities/profile"));
        expect(pathCounts.get("/xapi/agents")).toBe(expected.paths.get("/xapi/agents"));
        expect(pathCounts.get("/xapi/agents/profile")).toBe(expected.paths.get("/xapi/agents/profile"));
        expect(mockLrs.requests.some((request) => request.method === "GET" && request.path === "/xapi/about")).toBe(
          true,
        );
        expect(
          mockLrs.requests.some(
            (request) =>
              request.method === "GET" && request.path === "/xapi/activities" && "activityId" in request.query,
          ),
        ).toBe(true);
        expect(
          mockLrs.requests.some(
            (request) => request.method === "GET" && request.path === "/xapi/agents" && "agent" in request.query,
          ),
        ).toBe(true);
        expect(
          mockLrs.requests.some(
            (request) =>
              request.method === "DELETE" && request.path === "/xapi/activities/state" && !("stateId" in request.query),
          ),
        ).toBe(true);
        expect(
          mockLrs.requests.some(
            (request) =>
              request.method === "GET" &&
              request.path === "/xapi/activities/profile" &&
              !("profileId" in request.query),
          ),
        ).toBe(true);
        expect(
          mockLrs.requests.some(
            (request) =>
              request.method === "GET" && request.path === "/xapi/agents/profile" && !("profileId" in request.query),
          ),
        ).toBe(true);
        expect(
          mockLrs.requests.some(
            (request) =>
              request.method === "GET" && request.path === "/xapi/activities/state" && "since" in request.query,
          ),
        ).toBe(true);
        expect(
          mockLrs.requests.some(
            (request) =>
              request.method === "GET" && request.path === "/xapi/activities/profile" && "since" in request.query,
          ),
        ).toBe(true);
        expect(
          mockLrs.requests.some(
            (request) =>
              request.method === "GET" && request.path === "/xapi/agents/profile" && "since" in request.query,
          ),
        ).toBe(true);
        expect(mockLrs.requests.some((request) => request.method === "HEAD")).toBe(true);
      } finally {
        mockLrs.stop();
      }
    },
    proofSliceExecutionTimeoutMs,
  );

  test(
    "emits run, suite, and case events for the proof slice",
    async () => {
      const registry = createProofSliceRegistry();
      const expected = summarizeRegistryVersion(registry, "2.0.0");
      const mockLrs = startMockLrs();

      try {
        const result = await runRegistryVersion(registry, "2.0.0", {
          baseUrl: mockLrs.baseUrl,
        });

        expect(result.events[0]?.kind).toBe("run-start");
        expect(result.events.at(-1)?.kind).toBe("run-finish");
        expect(result.events.filter((event) => event.kind === "suite-start")).toHaveLength(expected.suites);
        expect(result.events.filter((event) => event.kind === "case-start")).toHaveLength(expected.cases);
        expect(result.events.filter((event) => event.kind === "case-finish")).toHaveLength(expected.cases);
        expect(
          result.events.filter((event) => event.kind === "case-finish").every((event) => event.status === "passed"),
        ).toBe(true);
      } finally {
        mockLrs.stop();
      }
    },
    proofSliceExecutionTimeoutMs,
  );
});
