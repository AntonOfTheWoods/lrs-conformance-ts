import type { RegistryDefinition, RequirementRef, SuiteDefinition } from "../../domain/contracts";
import { RegistryBuilder } from "../../registry/builder";
import { queryRetrievalFamily, requiredFieldFamily } from "../../registry/families";

const formattingRequirements: RequirementRef[] = [
  {
    id: "XAPI-00001",
    section: "Data 2.4.1",
    title: "Statement actor is required",
  },
];

export function createV20ProofSliceSuite(): SuiteDefinition {
  const formattingCases = requiredFieldFamily({
    familyId: "v2.statements.required-fields",
    suiteTitle: "Statement Formatting",
    specVersion: "2.0.0",
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting"],
    legacyTraceSuiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/Data2.4.1-StatementProperty.js",
    variants: [
      {
        idSuffix: "missing-actor",
        title: 'A Statement contains an "actor" property',
        missingPath: ["actor"],
        requirementRefs: formattingRequirements,
      },
      {
        idSuffix: "missing-verb",
        title: 'A Statement contains a "verb" property',
        missingPath: ["verb"],
        requirementRefs: [
          {
            id: "XAPI-00002",
            section: "Data 2.4.2",
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
            id: "XAPI-00003",
            section: "Data 2.4.4",
            title: "Statement object is required",
          },
        ],
      },
    ],
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
        children: formattingCases,
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

export function createProofSliceRegistry(): RegistryDefinition {
  const builder = new RegistryBuilder();
  builder.addSuite("2.0.0", createV20ProofSliceSuite());
  return builder.build();
}
