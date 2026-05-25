import type { CaseDefinition, RegistryNode, SuiteDefinition } from "../../../domain/contracts";
import { v2ProofSliceStatementsTransportSuite } from "../../v2_0/statements/root/transport";
import { specVersion, upstreamV103Root } from "../shared";

const statementResourceLegacySuiteFile = `${upstreamV103Root}/H.Communication2.1-StatementResource.js`;

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
  cloned.legacyTrace = {
    suiteFile: statementResourceLegacySuiteFile,
  };

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

function rewriteNodeFromV2(node: RegistryNode): RegistryNode {
  if (node.type === "case") {
    return rewriteCaseFromV2(node);
  }

  const cloned = structuredClone(node) as SuiteDefinition;
  cloned.id = cloned.id.replace(/^v2\./, "v1.");
  cloned.specVersion = specVersion;
  cloned.tags = rewriteTags(cloned.tags);
  cloned.children = cloned.children.map(rewriteNodeFromV2);
  return cloned;
}

export function createV103StatementResourceProofSliceSuite(): SuiteDefinition {
  const adapted = rewriteNodeFromV2(v2ProofSliceStatementsTransportSuite as unknown as RegistryNode);
  if (adapted.type !== "suite") {
    throw new Error("expected statement transport root to be a suite");
  }

  adapted.id = "v1.proof-slice.statements";
  adapted.title = "Statement Resource";
  adapted.tags = ["proof-slice", "statements", "transport"];
  return adapted;
}
