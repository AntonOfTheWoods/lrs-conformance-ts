import type { CaseDefinition, RegistryNode, SuiteDefinition } from "../../../domain/contracts";
import { statementsFormattingSuite } from "../../v2_0/statements/areas/formatting";
import { specVersion } from "../shared";

const excludedCaseIds = new Set([
  "v1.statements.invalid-mbox-iri.actor-agent",
  "v1.statements.invalid-mbox-iri.actor-group",
  "v1.statements.invalid-mbox-iri.authority-agent",
  "v1.statements.invalid-mbox-iri.authority-group",
  "v1.statements.invalid-mbox-iri.context-instructor-agent",
  "v1.statements.invalid-mbox-iri.context-instructor-group",
  "v1.statements.invalid-mbox-iri.context-team-group",
  "v1.statements.invalid-mbox-iri.object-agent",
  "v1.statements.invalid-mbox-iri.object-group",
  "v1.statements.invalid-mbox-iri.substatement-actor-agent",
  "v1.statements.invalid-mbox-iri.substatement-actor-group",
  "v1.statements.invalid-mbox-iri.substatement-context-instructor-agent",
  "v1.statements.invalid-mbox-iri.substatement-context-instructor-group",
  "v1.statements.invalid-mbox-iri.substatement-context-team-group",
  "v1.statements.invalid-mbox-mailto.actor-agent",
  "v1.statements.invalid-mbox-mailto.actor-group",
  "v1.statements.invalid-mbox-mailto.authority-agent",
]);

function rewriteTags(tags: string[]): string[] {
  const next = tags.map((tag) => (tag === "v2.0.0" ? "v1.0.3" : tag));
  if (!next.includes("v1.0.3")) {
    next.unshift("v1.0.3");
  }
  return next;
}

function rewriteCaseFromV2(caseNode: CaseDefinition): CaseDefinition | null {
  const cloned = structuredClone(caseNode) as CaseDefinition;
  cloned.id = cloned.id.replace(/^v2\./, "v1.");
  if (excludedCaseIds.has(cloned.id)) {
    return null;
  }
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
    return rewriteCaseFromV2(node);
  }

  const cloned = structuredClone(node) as SuiteDefinition;
  cloned.id = cloned.id.replace(/^v2\./, "v1.");
  cloned.specVersion = specVersion;
  cloned.tags = rewriteTags(cloned.tags);
  cloned.children = cloned.children.map(rewriteNodeFromV2).filter((child): child is RegistryNode => child !== null);
  if (cloned.children.length === 0) {
    return null;
  }
  return cloned;
}

export function createV103StatementsFormattingProofSliceSuite(): SuiteDefinition {
  const adapted = rewriteNodeFromV2(statementsFormattingSuite as unknown as RegistryNode);
  if (adapted?.type !== "suite") {
    throw new Error("expected statements formatting root to be a suite");
  }

  adapted.id = "v1.proof-slice.statements.formatting";
  adapted.title = "Statements Formatting";
  adapted.tags = ["proof-slice", "statements", "formatting"];
  return adapted;
}
