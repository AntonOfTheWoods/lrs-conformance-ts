import type { AssertionPlan, CaseDefinition, EndpointKind, RequirementRef, SpecVersion } from "../domain/contracts";
import { buildStatementFixture, type FixtureTransform } from "../fixtures/v2_0/statements";

interface RequiredFieldVariant {
  idSuffix: string;
  title: string;
  missingPath: string[];
  requirementRefs: RequirementRef[];
}

interface RequiredFieldFamilyOptions {
  familyId: string;
  suiteTitle: string;
  specVersion: SpecVersion;
  endpoint: EndpointKind;
  tags: string[];
  legacyTraceSuiteFile: string;
  variants: RequiredFieldVariant[];
}

interface QueryRetrievalFamilyOptions {
  caseId: string;
  title: string;
  specVersion: SpecVersion;
  queryParam: string;
  requirementRefs: RequirementRef[];
  tags: string[];
  legacyTraceSuiteFile: string;
}

function singleRequestAssertion(status: number, notes: string[] = []): AssertionPlan {
  return {
    kind: "single-request",
    status,
    expectedHeaders: [],
    jsonPathEquals: [],
    notes,
  };
}

export function requiredFieldFamily(options: RequiredFieldFamilyOptions): CaseDefinition[] {
  return options.variants.map((variant) => {
    const transforms: FixtureTransform[] = [
      {
        operation: "remove",
        path: variant.missingPath,
      },
    ];

    return {
      type: "case",
      id: `${options.familyId}.${variant.idSuffix}`,
      title: variant.title,
      specVersion: options.specVersion,
      requirementRefs: variant.requirementRefs,
      tags: options.tags,
      capabilityFlags: [],
      legacyTrace: {
        suiteFile: options.legacyTraceSuiteFile,
      },
      execution: {
        kind: "single-request",
        request: {
          method: "POST",
          endpoint: options.endpoint,
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": options.specVersion,
          },
          query: {},
          body: {
            kind: "json",
            value: buildStatementFixture(transforms),
            sourceFixture: {
              version: options.specVersion,
              domain: "statements",
              name: "default",
            },
          },
        },
      },
      assertion: singleRequestAssertion(400, [options.suiteTitle]),
    };
  });
}

export function queryRetrievalFamily(options: QueryRetrievalFamilyOptions): CaseDefinition {
  const statement = buildStatementFixture();

  return {
    type: "case",
    id: options.caseId,
    title: options.title,
    specVersion: options.specVersion,
    requirementRefs: options.requirementRefs,
    tags: options.tags,
    capabilityFlags: ["query", "retrieval"],
    legacyTrace: {
      suiteFile: options.legacyTraceSuiteFile,
    },
    execution: {
      kind: "submit-and-query",
      submit: {
        method: "POST",
        endpoint: "statements",
        authMode: "basic",
        headers: {
          "X-Experience-API-Version": options.specVersion,
        },
        query: {},
        body: {
          kind: "json",
          value: statement,
          sourceFixture: {
            version: options.specVersion,
            domain: "statements",
            name: "default",
          },
        },
      },
      query: {
        method: "GET",
        endpoint: "statements",
        authMode: "basic",
        headers: {
          "X-Experience-API-Version": options.specVersion,
        },
        query: {
          [options.queryParam]: statement.id,
        },
      },
      polling: {
        strategy: "consistent-through",
        maxAttempts: 5,
        intervalMs: 250,
      },
    },
    assertion: {
      kind: "submit-and-query",
      submitStatus: 200,
      queryStatus: 200,
      expectedHeaders: [
        {
          key: "X-Experience-API-Version",
          equals: options.specVersion,
        },
      ],
      queryJsonPathEquals: [
        {
          path: ["id"],
          equals: statement.id,
        },
      ],
      notes: ["proof-slice query retrieval"],
    },
  };
}
