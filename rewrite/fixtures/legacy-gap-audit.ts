import type { SuiteDefinition } from "../../src/domain/contracts";
import { singleRequestCase } from "../../src/registry/families";
import { specVersion, upstreamV103Root } from "../../src/specs/v1_0_3/shared";

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
    notes: [
      "v1 legacy-gap audit anchor for remaining non-executable or upstream-commented requirement IDs",
      "legacy note: XAPI-00021 upstream comment - these are all in Multiplicity folder, the community said this won't be a problem and do not test it. some are also covered in templating tests, usually in these cases post and 200 or 400.",
      "legacy note: XAPI-00063 upstream comment - in activities.js",
      "legacy note: XAPI-00095 upstream comment - removed per 02/08/2017 spec call",
      "legacy note: XAPI-00112 upstream comment - duplicate of XAPI-00149 Communication 2.1.3 Statements GET",
      "legacy note: XAPI-00136 upstream comment - there is no XAPI-00136",
      "legacy note: XAPI-00137 upstream comment - removed",
      "legacy note: XAPI-00138 upstream comment - removed",
      "legacy note: XAPI-00140 upstream comment - generic and covered by other files - An LRS implements all of the Statement, State, Agent, and Activity Profile sub-APIs",
      "legacy note: XAPI-00141 upstream comment - covered by XAPI-00195, XAPI-00275, XAPI-00294",
      "legacy note: XAPI-00148 upstream comment - in H.Communication1.3-AlternateRequestSyntax.js",
      "legacy note: XAPI-00152 upstream comment - removed per spec call 2/8/17",
      "legacy note: XAPI-00185 upstream comment - untestable",
      "legacy note: XAPI-00186 upstream comment - untestable",
      "legacy note: XAPI-00205 upstream comment - No 'since' property with DELETE in the State Resource",
      "legacy note: XAPI-00222 upstream comment - duplicate of XAPI-00195",
      "legacy note: XAPI-00223 upstream comment - No 'since' property with DELETE in the State Resource",
      "legacy note: XAPI-00320 upstream comment - bad test - extesion property is optional in spec",
      "legacy note: XAPI-00323 upstream comment - not found yet - An LRS can only reject Statements using the error codes in this specification - what are we to test here??",
      "legacy note: XAPI-00327 upstream comment - not found yet - An LRS rejects a Statement of insufficient permissions (credentials are valid, but not adequate) with error code 403 Forbidden",
      "legacy note: XAPI-00328 upstream comment - An LRS rejects a Statement due to size if the Statement exceeds the size limit the LRS is configured to with error code 413 Request Entity Too Large. Held out for now. No upper limit constraint.",
      "legacy note: XAPI-00329 upstream comment - not found yet - An LRS rejects a Statement due to network/server issues with an error code of 500 Internal Server Error",
      "legacy note: XAPI-00336 upstream comment - The LRS MUST support the Alternate Request Syntax.",
      "legacy note: XAPI-00336 upstream describe - The LRS MUST support the Alternate Request Syntax",
    ],
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
