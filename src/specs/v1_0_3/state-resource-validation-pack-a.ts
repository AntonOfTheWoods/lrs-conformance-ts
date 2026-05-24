import type { CaseDefinition, RegistryNode, SuiteDefinition } from "../../domain/contracts";
import { createV20StateResourceProofSliceSuite } from "../v2_0/state-resource";
import { specVersion } from "./shared";

const includeCaseIds = new Set([
  "v1.activities-state.accepts.delete-with-state-id",
  "v1.activities-state.accepts.get-with-state-id",
  "v1.activities-state.delete-context-documents",
  "v1.activities-state.document-post-as-put",
  "v1.activities-state.document-merge-rejects-non-json-post",
  "v1.activities-state.document-merge-rejects-non-json-type",
  "v1.activities-state.registration.put",
  "v1.activities-state.registration.post",
  "v1.activities-state.registration.get",
  "v1.activities-state.registration.delete",
  "v1.activities-state.validation.invalid-agent.delete",
  "v1.activities-state.validation.invalid-agent.get",
  "v1.activities-state.validation.invalid-agent.post",
  "v1.activities-state.validation.invalid-registration.delete",
  "v1.activities-state.validation.invalid-registration.get",
  "v1.activities-state.validation.invalid-registration.post",
  "v1.activities-state.validation.invalid-registration.put",
  "v1.activities-state.validation.invalid-stateId.delete",
  "v1.activities-state.validation.invalid-stateId.get",
  "v1.activities-state.validation.invalid-stateId.post",
  "v1.activities-state.validation.invalid-stateId.put",
  "v1.activities-state.validation.missing-agent.delete",
  "v1.activities-state.validation.missing-agent.get",
  "v1.activities-state.validation.missing-stateId.post",
  "v1.activities-state.validation.missing-stateId.put",
]);

function rewriteTags(tags: string[]): string[] {
  const next = tags.map((tag) => (tag === "v2.0.0" ? "v1.0.3" : tag));
  if (!next.includes("v1.0.3")) {
    next.unshift("v1.0.3");
  }
  return next;
}

function rewriteCaseFromV2(caseNode: CaseDefinition): CaseDefinition {
  const cloned = structuredClone(caseNode) as CaseDefinition;
  cloned.id = cloned.id.replace(/^v2\./, "v1.");
  cloned.specVersion = specVersion;
  cloned.tags = rewriteTags(cloned.tags);

  if (cloned.legacyTrace?.suiteFile) {
    cloned.legacyTrace.suiteFile = cloned.legacyTrace.suiteFile.replace("/test/v2_0/", "/test/v1_0_3/");
  }

  if (cloned.execution.kind === "single-request") {
    cloned.execution.request.headers["X-Experience-API-Version"] = specVersion;
    if (cloned.execution.request.body?.kind === "json" && cloned.execution.request.body.sourceFixture) {
      cloned.execution.request.body.sourceFixture.version = specVersion;
    }
  } else if (cloned.execution.kind === "request-sequence") {
    for (const request of cloned.execution.steps) {
      request.headers["X-Experience-API-Version"] = specVersion;
      if (request.body?.kind === "json" && request.body.sourceFixture) {
        request.body.sourceFixture.version = specVersion;
      }
    }
  } else {
    cloned.execution.submit.headers["X-Experience-API-Version"] = specVersion;
    cloned.execution.query.headers["X-Experience-API-Version"] = specVersion;
    if (cloned.execution.submit.body?.kind === "json" && cloned.execution.submit.body.sourceFixture) {
      cloned.execution.submit.body.sourceFixture.version = specVersion;
    }
    if (cloned.execution.query.body?.kind === "json" && cloned.execution.query.body.sourceFixture) {
      cloned.execution.query.body.sourceFixture.version = specVersion;
    }
  }

  return cloned;
}

function rewriteNodeFromV2(node: RegistryNode): RegistryNode | null {
  if (node.type === "case") {
    const rewritten = rewriteCaseFromV2(node);
    if (!includeCaseIds.has(rewritten.id)) {
      return null;
    }
    return rewritten;
  }

  const cloned = structuredClone(node) as SuiteDefinition;
  cloned.id = cloned.id.replace(/^v2\./, "v1.");
  if (cloned.id.startsWith("v1.proof-slice.activities-state.")) {
    cloned.id = cloned.id.replace(
      "v1.proof-slice.activities-state.",
      "v1.proof-slice.activities-state.validation-pack-a.",
    );
  }
  cloned.specVersion = specVersion;
  cloned.tags = rewriteTags(cloned.tags);
  cloned.children = cloned.children.map(rewriteNodeFromV2).filter((child): child is RegistryNode => child !== null);
  if (cloned.children.length === 0) {
    return null;
  }
  return cloned;
}

export function createV103StateResourceValidationPackAProofSliceSuite(): SuiteDefinition {
  const adapted = rewriteNodeFromV2(createV20StateResourceProofSliceSuite() as unknown as RegistryNode);
  if (adapted?.type !== "suite") {
    throw new Error("expected activities-state root to be a suite");
  }

  adapted.id = "v1.proof-slice.activities-state.validation-pack-a";
  adapted.title = "Activities State Validation Pack A";
  adapted.tags = ["proof-slice", "activities-state", "validation", "parity-pack"];
  return adapted;
}
