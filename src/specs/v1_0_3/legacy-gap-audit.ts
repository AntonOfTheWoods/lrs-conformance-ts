import type { SuiteDefinition } from "../../domain/contracts";
import { singleRequestCase } from "../../registry/families";
import { specVersion, upstreamV103Root } from "./shared";

const legacyAuditSuiteFile = `${upstreamV103Root}/H.Communication3.2-ErrorCodes.js`;

export function createV103LegacyGapAuditProofSliceSuite(): SuiteDefinition {
  const legacyGapAuditCase = singleRequestCase({
    caseId: "v1.legacy-gap.audit.remaining-v103-only-and-non-executable-requirements",
    title: "Legacy audit anchors remaining 1.0.3-only, duplicate, removed, and non-executable requirement IDs",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00021",
        section: "Legacy Audit",
        title: "Multiplicity-only ID covered by legacy templating/multiplicity behavior",
      },
      {
        id: "XAPI-00063",
        section: "Legacy Audit",
        title: "Object property ID delegated to activities coverage in upstream suite",
      },
      { id: "XAPI-00095", section: "Legacy Audit", title: "Context property ID marked removed in upstream commentary" },
      { id: "XAPI-00112", section: "Legacy Audit", title: "Retrieval ID marked duplicate of XAPI-00149" },
      { id: "XAPI-00136", section: "Legacy Audit", title: "Content-type ID marked removed in upstream commentary" },
      { id: "XAPI-00137", section: "Legacy Audit", title: "Content-type ID marked removed in upstream commentary" },
      { id: "XAPI-00138", section: "Legacy Audit", title: "Content-type ID marked removed in upstream commentary" },
      { id: "XAPI-00140", section: "Legacy Audit", title: "Generic statement resource implementation requirement" },
      { id: "XAPI-00141", section: "Legacy Audit", title: "Derived statement retrieval behavior requirement" },
      { id: "XAPI-00148", section: "Legacy Audit", title: "Alternate request syntax linkage requirement" },
      {
        id: "XAPI-00152",
        section: "Legacy Audit",
        title: "Statement resource ID marked removed in upstream commentary",
      },
      { id: "XAPI-00185", section: "Legacy Audit", title: "Document resources requirement marked untestable upstream" },
      { id: "XAPI-00186", section: "Legacy Audit", title: "Document resources requirement marked untestable upstream" },
      { id: "XAPI-00205", section: "Legacy Audit", title: "State DELETE since-parameter prohibition" },
      { id: "XAPI-00222", section: "Legacy Audit", title: "State since-listing duplicate of XAPI-00195" },
      { id: "XAPI-00223", section: "Legacy Audit", title: "State DELETE since-parameter prohibition duplicate" },
      {
        id: "XAPI-00320",
        section: "Legacy Audit",
        title: "About extension-property requirement marked invalid upstream",
      },
      { id: "XAPI-00323", section: "Legacy Audit", title: "Error-code scoping requirement marked unresolved upstream" },
      {
        id: "XAPI-00327",
        section: "Legacy Audit",
        title: "Insufficient permissions 403 requirement marked unresolved upstream",
      },
      {
        id: "XAPI-00328",
        section: "Legacy Audit",
        title: "Error-code requirement covered by legacy error-codes suite",
      },
      { id: "XAPI-00329", section: "Legacy Audit", title: "Server error 500 requirement marked unresolved upstream" },
      { id: "XAPI-00336", section: "Legacy Audit", title: "Alternate request syntax support requirement" },
    ],
    tags: ["v1.0.3", "legacy-audit", "non-executable"],
    capabilityFlags: ["legacy-audit"],
    legacyTraceSuiteFile: legacyAuditSuiteFile,
    request: {
      method: "GET",
      endpoint: "about",
      authMode: "basic",
      headers: {
        "X-Experience-API-Version": specVersion,
      },
      query: {},
    },
    assertion: {
      status: 200,
    },
    notes: ["v1 legacy-gap audit anchor for remaining non-executable or upstream-commented requirement IDs"],
  });

  return {
    type: "suite",
    id: "v1.proof-slice.legacy-gap-audit",
    title: "Legacy Gap Audit",
    specVersion,
    tags: ["proof-slice", "legacy-audit"],
    children: [legacyGapAuditCase],
  };
}
