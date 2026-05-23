import type { RegistryDefinition, SuiteDefinition } from "../../domain/contracts";
import { buildActivityStateDocumentFixture, buildActivityStateIdentityFixture } from "../../fixtures/v2_0/documents";
import { RegistryBuilder } from "../../registry/builder";
import {
  documentRoundTripCase,
  queryRetrievalFamily,
  requiredFieldFamily,
  statementMutationFamily,
  statementRoundTripCase,
} from "../../registry/families";

const formattingLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/Data2.2-FormattingRequirements.js";
const formattingLegacyConfigFile = "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/configs/formatting.js";

export function createV20ProofSliceSuite(): SuiteDefinition {
  const formattingCases = requiredFieldFamily({
    familyId: "v2.statements.required-fields",
    suiteTitle: "Statement Formatting",
    specVersion: "2.0.0",
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: formattingLegacyConfigFile,
    variants: [
      {
        idSuffix: "missing-actor",
        title: 'A Statement contains an "actor" property',
        missingPath: ["actor"],
        requirementRefs: [
          {
            id: "XAPI-00003",
            section: "Data 2.2.s2.b3",
            title: "Statement actor is required",
          },
        ],
      },
      {
        idSuffix: "missing-verb",
        title: 'A Statement contains a "verb" property',
        missingPath: ["verb"],
        requirementRefs: [
          {
            id: "XAPI-00004",
            section: "Data 2.2.s2.b3",
            title: "Statement verb is required",
          },
        ],
      },
      {
        idSuffix: "missing-object",
        title: 'A Statement contains an "object" property',
        missingPath: ["object"],
        requirementRefs: [
          {
            id: "XAPI-00005",
            section: "Data 2.2.s2.b3",
            title: "Statement object is required",
          },
        ],
      },
    ],
  });

  const nullValueCases = statementMutationFamily({
    familyId: "v2.statements.invalid-values",
    suiteTitle: "Statement Formatting",
    specVersion: "2.0.0",
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "null-values"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: formattingLegacyConfigFile,
    variants: [
      {
        idSuffix: "actor-name-null",
        title: 'A Statement rejects "null" for actor.name',
        transforms: [
          {
            operation: "set",
            path: ["actor", "name"],
            value: null,
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00001",
            section: "Data 2.2.s4.b1.b1",
            title: "Statements reject null values outside extensions",
          },
        ],
      },
      {
        idSuffix: "verb-display-null",
        title: 'A Statement rejects "null" for verb.display.en-US',
        transforms: [
          {
            operation: "set",
            path: ["verb", "display", "en-US"],
            value: null,
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00001",
            section: "Data 2.2.s4.b1.b1",
            title: "Statements reject null values outside extensions",
          },
        ],
      },
      {
        idSuffix: "object-id-null",
        title: 'A Statement rejects "null" for object.id',
        transforms: [
          {
            operation: "set",
            path: ["object", "id"],
            value: null,
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00001",
            section: "Data 2.2.s4.b1.b1",
            title: "Statements reject null values outside extensions",
          },
        ],
      },
    ],
  });

  const min = 0.12123434;
  const raw = 12.125;
  const max = 45.45;
  const precisionCase = statementRoundTripCase({
    caseId: "v2.statements.numeric-precision.score-roundtrip",
    title: "The Statements resource preserves IEEE 754 score precision across submit and query",
    specVersion: "2.0.0",
    queryParam: "statementId",
    requirementRefs: [
      {
        id: "XAPI-00002",
        section: "Data 2.2.s4.b3",
        title: "Statements preserve IEEE 754 score precision",
      },
    ],
    tags: ["v2.0.0", "statements", "formatting", "precision"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    transforms: [
      {
        operation: "set",
        path: ["result", "score", "min"],
        value: min,
      },
      {
        operation: "set",
        path: ["result", "score", "raw"],
        value: raw,
      },
      {
        operation: "set",
        path: ["result", "score", "max"],
        value: max,
      },
      {
        operation: "set",
        path: ["result", "score", "scaled"],
        value: min,
      },
    ],
    queryJsonPathEquals: [
      {
        path: ["result", "score", "min"],
        equals: min,
      },
      {
        path: ["result", "score", "raw"],
        equals: raw,
      },
      {
        path: ["result", "score", "max"],
        equals: max,
      },
      {
        path: ["result", "score", "scaled"],
        equals: min,
      },
    ],
    capabilityFlags: ["query", "retrieval", "precision"],
    notes: ["proof-slice numeric precision"],
  });

  const queryCase = queryRetrievalFamily({
    caseId: "v2.statements.query.statement-id-roundtrip",
    title: "The Statements resource returns a submitted statement when queried by statementId",
    specVersion: "2.0.0",
    queryParam: "statementId",
    requirementRefs: [
      {
        id: "XAPI-01001",
        section: "Communication 4.1.6.1",
        title: "Statements can be queried by statementId",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "retrieval"],
    legacyTraceSuiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.1.6.1-Statement-Resource.js",
  });

  return {
    type: "suite",
    id: "v2.proof-slice.statements",
    title: "Statements",
    specVersion: "2.0.0",
    tags: ["proof-slice", "statements"],
    children: [
      {
        type: "suite",
        id: "v2.proof-slice.statements.formatting",
        title: "Statement Formatting",
        specVersion: "2.0.0",
        tags: ["formatting"],
        children: [...formattingCases, ...nullValueCases, precisionCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.statements.query",
        title: "Statement Query",
        specVersion: "2.0.0",
        tags: ["query"],
        children: [queryCase],
      },
    ],
  };
}

export function createV20StateResourceProofSliceSuite(): SuiteDefinition {
  const stateDocument = buildActivityStateDocumentFixture();
  const stateIdentity = buildActivityStateIdentityFixture();
  const stateRoundTripCase = documentRoundTripCase({
    caseId: "v2.activities-state.document-roundtrip",
    title: "The State Resource returns a stored document when queried by stateId",
    specVersion: "2.0.0",
    endpoint: "activities-state",
    submitMethod: "PUT",
    requirementRefs: [
      {
        id: "XAPI-00192",
        section: "Communication 2.3.s3",
        title: "State Resource GET with stateId returns the stored document",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "roundtrip"],
    legacyTraceSuiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.1.6.2-State-Resource.js",
    query: stateIdentity,
    body: stateDocument,
    bodyFixtureName: "activity-state-default",
    queryJsonPathEquals: [
      {
        path: ["bookmark"],
        equals: stateDocument.bookmark,
      },
      {
        path: ["progress", "attempts"],
        equals: stateDocument.progress.attempts,
      },
      {
        path: ["progress", "complete"],
        equals: stateDocument.progress.complete,
      },
      {
        path: ["context", "location"],
        equals: stateDocument.context.location,
      },
    ],
    capabilityFlags: ["document", "retrieval", "state"],
    notes: ["proof-slice activity state roundtrip"],
  });

  return {
    type: "suite",
    id: "v2.proof-slice.activities-state",
    title: "State Resource",
    specVersion: "2.0.0",
    tags: ["proof-slice", "activities-state"],
    children: [stateRoundTripCase],
  };
}

export function createProofSliceRegistry(): RegistryDefinition {
  const builder = new RegistryBuilder();
  builder.addSuite("2.0.0", createV20ProofSliceSuite());
  builder.addSuite("2.0.0", createV20StateResourceProofSliceSuite());
  return builder.build();
}
