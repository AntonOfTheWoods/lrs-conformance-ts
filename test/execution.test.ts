import { describe, expect, test } from "bun:test";

import { runRegistryVersion } from "../src/execution/runner";
import { createProofSliceRegistry } from "../src/specs/v2_0/proof-slice";
import { startMockLrs } from "../src/testing/mock-lrs";

function countBy<T>(items: readonly T[], toKey: (item: T) => string): Map<string, number> {
  const counts = new Map<string, number>();

  for (const item of items) {
    const key = toKey(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return counts;
}

describe("runtime executor", () => {
  test("runs the 2.0 proof slice end to end against the mock LRS", async () => {
    const registry = createProofSliceRegistry();
    const mockLrs = startMockLrs();

    try {
      const result = await runRegistryVersion(registry, "2.0.0", {
        baseUrl: mockLrs.baseUrl,
      });

      expect(result.status).toBe("passed");
      expect(result.root.children).toHaveLength(4);
      expect(result.root.children.every((child) => child.status === "passed")).toBe(true);

      const methodCounts = countBy(mockLrs.requests, (request) => request.method);
      const pathCounts = countBy(mockLrs.requests, (request) => request.path);

      expect(mockLrs.requests).toHaveLength(37);
      expect(methodCounts.get("POST")).toBe(16);
      expect(methodCounts.get("GET")).toBe(17);
      expect(methodCounts.get("DELETE")).toBe(3);
      expect(methodCounts.get("PUT")).toBe(1);
      expect(pathCounts.get("/xapi/statements")).toBe(16);
      expect(pathCounts.get("/xapi/activities/state")).toBe(7);
      expect(pathCounts.get("/xapi/activities/profile")).toBe(7);
      expect(pathCounts.get("/xapi/agents/profile")).toBe(7);
      expect(
        mockLrs.requests.some(
          (request) => request.method === "DELETE" && request.path === "/xapi/activities/state" && !("stateId" in request.query),
        ),
      ).toBe(true);
      expect(
        mockLrs.requests.some(
          (request) =>
            request.method === "GET" && request.path === "/xapi/activities/profile" && !("profileId" in request.query),
        ),
      ).toBe(true);
      expect(
        mockLrs.requests.some(
          (request) => request.method === "GET" && request.path === "/xapi/agents/profile" && !("profileId" in request.query),
        ),
      ).toBe(true);
    } finally {
      mockLrs.stop();
    }
  });

  test("emits run, suite, and case events for the proof slice", async () => {
    const registry = createProofSliceRegistry();
    const mockLrs = startMockLrs();

    try {
      const result = await runRegistryVersion(registry, "2.0.0", {
        baseUrl: mockLrs.baseUrl,
      });

      expect(result.events[0]?.kind).toBe("run-start");
      expect(result.events.at(-1)?.kind).toBe("run-finish");
      expect(result.events.filter((event) => event.kind === "suite-start")).toHaveLength(16);
      expect(result.events.filter((event) => event.kind === "case-start")).toHaveLength(23);
      expect(result.events.filter((event) => event.kind === "case-finish")).toHaveLength(23);
      expect(
        result.events.filter((event) => event.kind === "case-finish").every((event) => event.status === "passed"),
      ).toBe(true);
    } finally {
      mockLrs.stop();
    }
  });
});
