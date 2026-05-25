import { describe, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { RegistryNode } from "../../src/domain/contracts";
import { createProofSliceRegistry } from "../../src/specs/v2_0/proof-slice";

const validateArtifactPath = resolve(import.meta.dir, "../../tmp/agents/validate-run-2.0.0.json");
const upstreamArtifactPath = resolve(import.meta.dir, "../../tmp/agents/upstream-run-2.0.0.json");

interface FailedCaseRecord {
  caseId: string;
  requirementIds: string[];
}

interface OverlapReport {
  comparable: FailedCaseRecord[];
  nonComparable: Array<FailedCaseRecord & { reason: string }>;
  upstreamRequirementIds: string[];
  failedCaseIds: string[];
}

function collectCaseRequirementMap(): Map<string, string[]> {
  const registry = createProofSliceRegistry();
  const map = new Map<string, string[]>();

  const walk = (node: RegistryNode): void => {
    if (node.type === "case") {
      const ids = node.requirementRefs.map((ref) => ref.id).filter((id) => /^XAPI-\d{5}$/.test(id));
      map.set(node.id, ids);
      return;
    }

    for (const child of node.children) {
      walk(child);
    }
  };

  for (const suite of registry.versions["2.0.0"]) {
    walk(suite);
  }

  return map;
}

function collectFailedCaseIds(validatePath: string): string[] {
  const payload = JSON.parse(readFileSync(validatePath, "utf8"));
  const run = payload.run ?? payload;
  const events: Array<{ kind?: unknown; status?: unknown; caseId?: unknown }> = Array.isArray(run.events)
    ? run.events
    : [];

  return events
    .filter(
      (event): event is { kind: "case-finish"; status: "failed"; caseId: string } =>
        event?.kind === "case-finish" && event?.status === "failed" && typeof event?.caseId === "string",
    )
    .map((event) => event.caseId)
    .sort();
}

function collectUpstreamRequirementIds(upstreamPath: string): string[] {
  const text = readFileSync(upstreamPath, "utf8");
  const ids = text.match(/XAPI-\d{5}/g) ?? [];
  return [...new Set(ids)].sort();
}

function buildOverlapReport(validatePath: string, upstreamPath: string): OverlapReport {
  const caseRequirementMap = collectCaseRequirementMap();
  const failedCaseIds = collectFailedCaseIds(validatePath);
  const upstreamRequirementIds = collectUpstreamRequirementIds(upstreamPath);
  const upstreamIdSet = new Set(upstreamRequirementIds);

  const comparable: FailedCaseRecord[] = [];
  const nonComparable: Array<FailedCaseRecord & { reason: string }> = [];

  for (const caseId of failedCaseIds) {
    const requirementIds = caseRequirementMap.get(caseId) ?? [];

    if (requirementIds.length === 0) {
      nonComparable.push({ caseId, requirementIds, reason: "no XAPI requirement IDs on rewrite case" });
      continue;
    }

    const overlap = requirementIds.some((id) => upstreamIdSet.has(id));
    if (overlap) {
      comparable.push({ caseId, requirementIds });
      continue;
    }

    nonComparable.push({
      caseId,
      requirementIds,
      reason: "none of the rewrite case requirement IDs are present in upstream-run artifact",
    });
  }

  return {
    comparable,
    nonComparable,
    upstreamRequirementIds,
    failedCaseIds,
  };
}

describe("live id overlap audit", () => {
  test("classifies failed rewrite cases by upstream requirement-id overlap", () => {
    if (!existsSync(validateArtifactPath)) {
      throw new Error(`Missing validate artifact: ${validateArtifactPath}`);
    }

    if (!existsSync(upstreamArtifactPath)) {
      throw new Error(`Missing upstream artifact: ${upstreamArtifactPath}`);
    }

    const report = buildOverlapReport(validateArtifactPath, upstreamArtifactPath);

    const summary = {
      validateArtifactPath,
      upstreamArtifactPath,
      failedCaseCount: report.failedCaseIds.length,
      upstreamRequirementIdCount: report.upstreamRequirementIds.length,
      comparableCount: report.comparable.length,
      nonComparableCount: report.nonComparable.length,
      nonComparable: report.nonComparable,
    };

    if (report.nonComparable.length > 0) {
      throw new Error(
        [
          "ID overlap audit failed: one or more failed rewrite cases are non-comparable against upstream artifact.",
          JSON.stringify(summary, null, 2),
        ].join("\n"),
      );
    }
  });
});
