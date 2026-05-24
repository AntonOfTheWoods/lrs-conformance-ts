import type { CaseDefinition, RegistryNode, SuiteDefinition } from "../../../domain/contracts";
import { buildActivityProfileIdentityFixture } from "../../../fixtures/v2_0/documents";
import { singleRequestCase } from "../../../registry/families";
import { createV20ActivityProfileResourceProofSliceSuite } from "../../v2_0/activity-profile-resource";
import { specVersion, upstreamV103Root } from "../shared";

const includeCaseIds = new Set([
  "v1.activities-profile.validation.invalid-profileId.delete",
  "v1.activities-profile.validation.invalid-profileId.post",
  "v1.activities-profile.validation.invalid-profileId.put",
  "v1.activities-profile.document-merge-rejects-non-json-type",
  "v1.activities-profile.document-merge-rejects-invalid-json-body",
]);

const activityProfileLegacySuiteFile = `${upstreamV103Root}/H.Communication2.7-ActivityProfileResource.js`;

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
  if (cloned.id.startsWith("v1.proof-slice.activities-profile.")) {
    cloned.id = cloned.id.replace(
      "v1.proof-slice.activities-profile.",
      "v1.proof-slice.activities-profile.validation-pack-b.",
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

function createInvalidAgentParameterCase(): CaseDefinition {
  const profileIdentity = buildActivityProfileIdentityFixture({
    activityId: "https://example.test/xapi/activities/profile-v1-invalid-agent-param",
    profileId: "proof-activity-profile-invalid-agent-param",
  });

  return singleRequestCase({
    caseId: "v1.activities-profile.validation.invalid-agent-parameter",
    title: "The Activity Profile Resource rejects requests that include the agent parameter",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00304",
        section: "Communication 2.7",
        title: "agent is not a valid parameter in the Activity Profile Resource",
      },
    ],
    tags: ["v1.0.3", "activities-profile", "validation"],
    capabilityFlags: ["activity-profile", "validation"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    request: {
      method: "GET",
      endpoint: "activities-profile",
      authMode: "basic",
      headers: {
        "X-Experience-API-Version": specVersion,
      },
      query: {
        activityId: profileIdentity.activityId,
        profileId: profileIdentity.profileId,
        agent: '{"mbox":"mailto:profile-agent@example.test"}',
      },
    },
    assertion: {
      status: 400,
    },
    notes: ["v1 activity-profile rejects invalid agent parameter"],
  });
}

export function createV103ActivityProfileValidationPackBProofSliceSuite(): SuiteDefinition {
  const adapted = rewriteNodeFromV2(createV20ActivityProfileResourceProofSliceSuite() as unknown as RegistryNode);
  if (adapted?.type !== "suite") {
    throw new Error("expected activities-profile root to be a suite");
  }

  adapted.id = "v1.proof-slice.activities-profile.validation-pack-b";
  adapted.title = "Activities Profile Validation Pack B";
  adapted.tags = ["proof-slice", "activities-profile", "validation", "parity-pack"];
  adapted.children.push(createInvalidAgentParameterCase());
  return adapted;
}
