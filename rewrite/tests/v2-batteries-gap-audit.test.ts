import { describe, expect, test } from "bun:test";
import { createRequire } from "node:module";
import { resolveUpstreamPath } from "../../src/specs/migration/upstream-root";

import type { RegistryNode } from "../../src/domain/contracts";
import { createProofSliceRegistry } from "../../src/specs/v2_0/proof-slice";

interface BatteryNode {
  text: string;
  children: BatteryNode[];
}

interface UpstreamBatteryArtifact {
  "2.0.0": {
    conformanceTestCount: number;
    tests: BatteryNode;
  };
}

const require = createRequire(import.meta.url);
const upstreamBatteries = require(resolveUpstreamPath("batteries.js")) as UpstreamBatteryArtifact;

const upstreamV20ResourceKeys = new Set<string>([
  "Content Type Requirements",
  "Concurrency Requirements",
  "State Resource Requirements",
  "Agents Resource Requirements",
  "Activities Resource Requirements",
  "Agent Profile Resource Requirements",
  "Activity Profile Resource Requirements",
  "About Resource Requirements",
  "HEAD Request Implementation Requirements",
  "Alternate Request Syntax Requirements",
  "Encoding Requirements",
  "Document Resource Requirements",
  "Error Codes Requirements",
  "Versioning Requirements",
  "Authentication Requirements",
]);

function countBatteryLeaves(node: BatteryNode): number {
  if (node.children.length === 0) {
    return 1;
  }

  return node.children.reduce((total, child) => total + countBatteryLeaves(child), 0);
}

function collectBatteryLeafPaths(node: BatteryNode, trail: string[] = []): string[] {
  const nextTrail = node.text.trim().length > 0 ? [...trail, node.text] : trail;

  if (node.children.length === 0) {
    return [nextTrail.join(" > ")];
  }

  return node.children.flatMap((child) => collectBatteryLeafPaths(child, nextTrail));
}

function countRegistryCases(node: RegistryNode): number {
  if (node.type === "case") {
    return 1;
  }

  return node.children.reduce((total, child) => total + countRegistryCases(child), 0);
}

function getUpstreamTopLevelKey(node: BatteryNode): string {
  if (node.text.trim().length > 0) {
    return node.text;
  }

  const firstChildText = node.children[0]?.text ?? "";
  if (firstChildText.startsWith("xAPI uses HTTP 1.1 entity tags")) {
    return "Concurrency Requirements";
  }

  if (firstChildText === "IRIs") {
    return "Additional Data Types Requirements";
  }

  return `Unnamed: ${firstChildText}`;
}

function collectRewriteTopLevelCounts(): Record<string, number> {
  const registry = createProofSliceRegistry();

  return Object.fromEntries(registry.versions["2.0.0"].map((suite) => [suite.title, countRegistryCases(suite)]));
}

describe("xAPI 2.0 batteries gap audit", () => {
  test("pins the upstream-original 2.0 batteries leaf delta", () => {
    const upstreamV20Batteries = upstreamBatteries["2.0.0"];
    const upstreamLeafCount = countBatteryLeaves(upstreamV20Batteries.tests);

    expect({
      conformanceCount: upstreamV20Batteries.conformanceTestCount,
      leafCount: upstreamLeafCount,
      summaryDelta: upstreamV20Batteries.conformanceTestCount - upstreamLeafCount,
    }).toEqual({
      conformanceCount: 1435,
      leafCount: 1429,
      summaryDelta: 6,
    });
  });

  test("pins the three serialized upstream concurrency placeholder leaves behind the summary delta", () => {
    const upstreamLeafPaths = collectBatteryLeafPaths(upstreamBatteries["2.0.0"].tests).filter((path) =>
      path.includes("If a PUT request is received without either header for a resource that already exists"),
    );

    expect(upstreamLeafPaths).toEqual([
      "xAPI uses HTTP 1.1 entity tags (ETags) to implement optimistic concurrency control in the following resources, where PUT, POST or DELETE are allowed to overwrite or remove existing data. > Concurrency for the Activity State Resource. > If a PUT request is received without either header for a resource that already exists",
      "xAPI uses HTTP 1.1 entity tags (ETags) to implement optimistic concurrency control in the following resources, where PUT, POST or DELETE are allowed to overwrite or remove existing data. > Concurrency for the Activity Profile Resource. > If a PUT request is received without either header for a resource that already exists",
      "xAPI uses HTTP 1.1 entity tags (ETags) to implement optimistic concurrency control in the following resources, where PUT, POST or DELETE are allowed to overwrite or remove existing data. > Concurrency for the Agents Profile Resource. > If a PUT request is received without either header for a resource that already exists",
    ]);
  });

  test("pins the current 2.0 count-gap breakdown between upstream batteries and the proof slice", () => {
    const upstreamV20Batteries = upstreamBatteries["2.0.0"];
    const upstreamTopLevelCounts = Object.fromEntries(
      upstreamV20Batteries.tests.children.map((node) => [getUpstreamTopLevelKey(node), countBatteryLeaves(node)]),
    );
    const rewriteTopLevelCounts = collectRewriteTopLevelCounts();

    const upstreamStatements = Object.entries(upstreamTopLevelCounts)
      .filter(([key]) => !upstreamV20ResourceKeys.has(key))
      .reduce((total, [, count]) => total + count, 0);
    const upstreamResources = Object.entries(upstreamTopLevelCounts)
      .filter(([key]) => upstreamV20ResourceKeys.has(key))
      .reduce((total, [, count]) => total + count, 0);
    const rewriteStatements = rewriteTopLevelCounts.Statements ?? 0;
    const rewriteResources = Object.entries(rewriteTopLevelCounts)
      .filter(([title]) => title !== "Statements")
      .reduce((total, [, count]) => total + count, 0);
    const rewriteCaseCount = rewriteStatements + rewriteResources;
    const upstreamLeafCount = upstreamStatements + upstreamResources;

    expect({
      upstreamStatements,
      rewriteStatements,
      statementGap: upstreamStatements - rewriteStatements,
      upstreamResources,
      rewriteResources,
      resourceSurplus: rewriteResources - upstreamResources,
      upstreamLeafCount,
      rewriteCaseCount,
      leafGap: upstreamLeafCount - rewriteCaseCount,
      conformanceGap: upstreamV20Batteries.conformanceTestCount - rewriteCaseCount,
    }).toEqual({
      upstreamStatements: 1195,
      rewriteStatements: 1184,
      statementGap: 11,
      upstreamResources: 234,
      rewriteResources: 245,
      resourceSurplus: 11,
      upstreamLeafCount: 1429,
      rewriteCaseCount: 1429,
      leafGap: 0,
      conformanceGap: 6,
    });
  });
});
