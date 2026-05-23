import { describe, expect, test } from "bun:test";

import { runRegistryVersion } from "../src/execution/runner";
import { createProofSliceRegistry } from "../src/specs/v2_0/proof-slice";
import { startMockLrs } from "../src/testing/mock-lrs";

describe("runtime executor", () => {
  test("runs the 2.0 proof slice end to end against the mock LRS", async () => {
    const registry = createProofSliceRegistry();
    const mockLrs = startMockLrs();

    try {
      const result = await runRegistryVersion(registry, "2.0.0", {
        baseUrl: mockLrs.baseUrl,
      });

      expect(result.status).toBe("passed");
      expect(result.root.children).toHaveLength(2);
      expect(result.root.children[0]?.status).toBe("passed");
      expect(result.root.children[1]?.status).toBe("passed");
      expect(mockLrs.requests).toHaveLength(12);
      expect(mockLrs.requests.map((request) => request.method)).toEqual([
        "POST",
        "POST",
        "POST",
        "POST",
        "POST",
        "POST",
        "POST",
        "GET",
        "POST",
        "GET",
        "PUT",
        "GET",
      ]);
      expect(mockLrs.requests.slice(-2).map((request) => request.path)).toEqual([
        "/xapi/activities/state",
        "/xapi/activities/state",
      ]);
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
      expect(result.events.filter((event) => event.kind === "suite-start")).toHaveLength(4);
      expect(result.events.filter((event) => event.kind === "case-start")).toHaveLength(9);
      expect(result.events.filter((event) => event.kind === "case-finish")).toHaveLength(9);
      expect(
        result.events.filter((event) => event.kind === "case-finish").every((event) => event.status === "passed"),
      ).toBe(true);
    } finally {
      mockLrs.stop();
    }
  });
});
