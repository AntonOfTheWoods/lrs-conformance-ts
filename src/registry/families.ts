import type {
  CaseDefinition,
  EndpointKind,
  HeaderDateAfterStepExpectation,
  HeaderExpectation,
  HeaderPatternExpectation,
  HttpMethod,
  HttpRequest,
  JsonPathExpectation,
  PollingPlan,
  RequestAssertion,
  RequirementRef,
  SpecVersion,
} from "../domain/contracts";
import { buildStatementFixture, type FixtureTransform, type StatementFixture } from "../fixtures/v2_0/statements";

const versionHeaderKey = "X-Experience-API-Version";

type BasicRequestAssertion = Omit<RequestAssertion, "expectedHeaderDateAfterStep">;

interface LegacyTraceOptions {
  legacyTraceSuiteFile: string;
  legacyTraceConfigFile?: string;
}

interface StatementMutationVariant {
  idSuffix: string;
  title: string;
  transforms: FixtureTransform[];
  requirementRefs: RequirementRef[];
  capabilityFlags?: string[];
}

interface RequiredFieldVariant {
  idSuffix: string;
  title: string;
  missingPath: string[];
  requirementRefs: RequirementRef[];
}

interface StatementMutationFamilyOptions extends LegacyTraceOptions {
  familyId: string;
  suiteTitle: string;
  specVersion: SpecVersion;
  endpoint: EndpointKind;
  tags: string[];
  expectedStatus?: number;
  variants: StatementMutationVariant[];
}

interface RequiredFieldFamilyOptions extends LegacyTraceOptions {
  familyId: string;
  suiteTitle: string;
  specVersion: SpecVersion;
  endpoint: EndpointKind;
  tags: string[];
  variants: RequiredFieldVariant[];
}

interface QueryRetrievalFamilyOptions extends LegacyTraceOptions {
  caseId: string;
  title: string;
  specVersion: SpecVersion;
  queryParam: string;
  requirementRefs: RequirementRef[];
  tags: string[];
  transforms?: FixtureTransform[];
}

interface StatementRoundTripCaseOptions extends LegacyTraceOptions {
  caseId: string;
  title: string;
  specVersion: SpecVersion;
  queryParam: string;
  requirementRefs: RequirementRef[];
  tags: string[];
  transforms?: FixtureTransform[];
  queryJsonPathEquals: JsonPathExpectation[] | ((statement: StatementFixture) => JsonPathExpectation[]);
  capabilityFlags?: string[];
  notes?: string[];
  polling?: PollingPlan;
}

interface StatementGeneratedIdRoundTripCaseOptions extends LegacyTraceOptions {
  caseId: string;
  title: string;
  specVersion: SpecVersion;
  requirementRefs: RequirementRef[];
  tags: string[];
  transforms?: FixtureTransform[];
  capabilityFlags?: string[];
  notes?: string[];
  polling?: PollingPlan;
}

interface DocumentRoundTripCaseOptions extends LegacyTraceOptions {
  caseId: string;
  title: string;
  specVersion: SpecVersion;
  endpoint: EndpointKind;
  submitMethod: Extract<HttpMethod, "POST" | "PUT">;
  requirementRefs: RequirementRef[];
  tags: string[];
  query: Record<string, string>;
  body: unknown;
  queryJsonPathEquals: JsonPathExpectation[];
  capabilityFlags?: string[];
  notes?: string[];
  polling?: PollingPlan;
  submitStatus?: number;
  queryStatus?: number;
  bodyFixtureName?: string;
}

interface RequestAssertionDefinition {
  status: number;
  expectedHeaders?: HeaderExpectation[];
  expectedHeaderPatterns?: HeaderPatternExpectation[];
  expectedHeaderDateAfterStep?: HeaderDateAfterStepExpectation[];
  jsonPathEquals?: JsonPathExpectation[];
  jsonPathNotEquals?: JsonPathExpectation[];
  textContains?: string[];
}

interface SingleRequestCaseOptions extends LegacyTraceOptions {
  caseId: string;
  title: string;
  specVersion: SpecVersion;
  requirementRefs: RequirementRef[];
  tags: string[];
  capabilityFlags?: string[];
  request: HttpRequest;
  assertion: RequestAssertionDefinition;
  notes?: string[];
}

interface RequestSequenceStepOptions {
  request: HttpRequest;
  assertion: RequestAssertionDefinition;
}

interface RequestSequenceCaseOptions extends LegacyTraceOptions {
  caseId: string;
  title: string;
  specVersion: SpecVersion;
  requirementRefs: RequirementRef[];
  tags: string[];
  capabilityFlags?: string[];
  steps: RequestSequenceStepOptions[];
  notes?: string[];
}

interface StatementQueryValidationVariant {
  idSuffix: string;
  title: string;
  query: Record<string, string>;
  requirementRefs: RequirementRef[];
  capabilityFlags?: string[];
}

interface StatementQueryValidationFamilyOptions extends LegacyTraceOptions {
  familyId: string;
  suiteTitle: string;
  specVersion: SpecVersion;
  tags: string[];
  expectedStatus?: number;
  variants: StatementQueryValidationVariant[];
}

function withAssertionDefaults(assertion: RequestAssertionDefinition): BasicRequestAssertion {
  return {
    status: assertion.status,
    expectedHeaders: assertion.expectedHeaders ?? [],
    expectedHeaderPatterns: assertion.expectedHeaderPatterns ?? [],
    jsonPathEquals: assertion.jsonPathEquals ?? [],
    jsonPathNotEquals: assertion.jsonPathNotEquals ?? [],
    textContains: assertion.textContains ?? [],
  };
}

function withSequenceAssertionDefaults(assertion: RequestAssertionDefinition): RequestAssertion {
  return {
    ...withAssertionDefaults(assertion),
    expectedHeaderDateAfterStep: assertion.expectedHeaderDateAfterStep ?? [],
  };
}

function versionHeaders(specVersion: SpecVersion): Record<string, string> {
  return {
    [versionHeaderKey]: specVersion,
  };
}

function versionHeaderExpectations(specVersion: SpecVersion): Array<{ key: string; equals: string }> {
  return [
    {
      key: versionHeaderKey,
      equals: specVersion,
    },
  ];
}

function buildLegacyTrace(options: LegacyTraceOptions): CaseDefinition["legacyTrace"] {
  if (!options.legacyTraceConfigFile) {
    return {
      suiteFile: options.legacyTraceSuiteFile,
    };
  }

  return {
    suiteFile: options.legacyTraceSuiteFile,
    configFile: options.legacyTraceConfigFile,
  };
}

export function singleRequestCase(options: SingleRequestCaseOptions): CaseDefinition {
  return {
    type: "case",
    id: options.caseId,
    title: options.title,
    specVersion: options.specVersion,
    requirementRefs: options.requirementRefs,
    tags: options.tags,
    capabilityFlags: options.capabilityFlags ?? [],
    legacyTrace: buildLegacyTrace(options),
    execution: {
      kind: "single-request",
      request: options.request,
    },
    assertion: {
      kind: "single-request",
      ...withAssertionDefaults(options.assertion),
      notes: options.notes ?? [],
    },
  };
}

export function requestSequenceCase(options: RequestSequenceCaseOptions): CaseDefinition {
  return {
    type: "case",
    id: options.caseId,
    title: options.title,
    specVersion: options.specVersion,
    requirementRefs: options.requirementRefs,
    tags: options.tags,
    capabilityFlags: options.capabilityFlags ?? [],
    legacyTrace: buildLegacyTrace(options),
    execution: {
      kind: "request-sequence",
      steps: options.steps.map((step) => step.request),
    },
    assertion: {
      kind: "request-sequence",
      steps: options.steps.map((step) => withSequenceAssertionDefaults(step.assertion)),
      notes: options.notes ?? [],
    },
  };
}

function buildStatementSingleRequestCase(
  options: {
    id: string;
    title: string;
    specVersion: SpecVersion;
    endpoint: EndpointKind;
    requirementRefs: RequirementRef[];
    tags: string[];
    capabilityFlags: string[];
    transforms: FixtureTransform[];
    status: number;
    notes: string[];
  } & LegacyTraceOptions,
): CaseDefinition {
  return singleRequestCase({
    caseId: options.id,
    title: options.title,
    specVersion: options.specVersion,
    requirementRefs: options.requirementRefs,
    tags: options.tags,
    capabilityFlags: options.capabilityFlags,
    legacyTraceSuiteFile: options.legacyTraceSuiteFile,
    legacyTraceConfigFile: options.legacyTraceConfigFile,
    request: {
      method: "POST",
      endpoint: options.endpoint,
      authMode: "basic",
      headers: versionHeaders(options.specVersion),
      query: {},
      body: {
        kind: "json",
        value: buildStatementFixture(options.transforms),
        sourceFixture: {
          version: options.specVersion,
          domain: "statements",
          name: "default",
        },
      },
    },
    assertion: {
      status: options.status,
    },
    notes: options.notes,
  });
}

function buildSubmitAndQueryCase(
  options: {
    caseId: string;
    title: string;
    specVersion: SpecVersion;
    endpoint: EndpointKind;
    submitMethod: Extract<HttpMethod, "POST" | "PUT">;
    submitQuery: Record<string, string>;
    submitBody: unknown;
    query: Record<string, string>;
    requirementRefs: RequirementRef[];
    tags: string[];
    capabilityFlags: string[];
    queryJsonPathEquals: JsonPathExpectation[];
    queryJsonPathEqualsCaptured?: Array<{ queryPath: string[]; fromSubmitJsonPath: string[] }>;
    capturedQueryParam?: { toQueryParam: string; fromSubmitJsonPath: string[] };
    notes: string[];
    polling?: PollingPlan;
    submitStatus: number;
    queryStatus: number;
    submitBodySource?: {
      domain: string;
      name: string;
    };
  } & LegacyTraceOptions,
): CaseDefinition {
  return {
    type: "case",
    id: options.caseId,
    title: options.title,
    specVersion: options.specVersion,
    requirementRefs: options.requirementRefs,
    tags: options.tags,
    capabilityFlags: options.capabilityFlags,
    legacyTrace: buildLegacyTrace(options),
    execution: {
      kind: "submit-and-query",
      submit: {
        method: options.submitMethod,
        endpoint: options.endpoint,
        authMode: "basic",
        headers: versionHeaders(options.specVersion),
        query: options.submitQuery,
        body: {
          kind: "json",
          value: options.submitBody,
          sourceFixture: options.submitBodySource
            ? {
                version: options.specVersion,
                domain: options.submitBodySource.domain,
                name: options.submitBodySource.name,
              }
            : undefined,
        },
      },
      query: {
        method: "GET",
        endpoint: options.endpoint,
        authMode: "basic",
        headers: versionHeaders(options.specVersion),
        query: options.query,
      },
      capture: options.capturedQueryParam,
      polling: options.polling,
    },
    assertion: {
      kind: "submit-and-query",
      submitStatus: options.submitStatus,
      queryStatus: options.queryStatus,
      expectedHeaders: versionHeaderExpectations(options.specVersion),
      expectedHeaderPatterns: [],
      queryJsonPathEquals: options.queryJsonPathEquals,
      queryJsonPathEqualsCaptured: options.queryJsonPathEqualsCaptured ?? [],
      queryTextContains: [],
      notes: options.notes,
    },
  };
}

export function statementMutationFamily(options: StatementMutationFamilyOptions): CaseDefinition[] {
  return options.variants.map((variant) =>
    buildStatementSingleRequestCase({
      id: `${options.familyId}.${variant.idSuffix}`,
      title: variant.title,
      specVersion: options.specVersion,
      endpoint: options.endpoint,
      requirementRefs: variant.requirementRefs,
      tags: options.tags,
      capabilityFlags: variant.capabilityFlags ?? [],
      legacyTraceSuiteFile: options.legacyTraceSuiteFile,
      legacyTraceConfigFile: options.legacyTraceConfigFile,
      transforms: variant.transforms,
      status: options.expectedStatus ?? 400,
      notes: [options.suiteTitle],
    }),
  );
}

export function requiredFieldFamily(options: RequiredFieldFamilyOptions): CaseDefinition[] {
  return statementMutationFamily({
    familyId: options.familyId,
    suiteTitle: options.suiteTitle,
    specVersion: options.specVersion,
    endpoint: options.endpoint,
    tags: options.tags,
    legacyTraceSuiteFile: options.legacyTraceSuiteFile,
    legacyTraceConfigFile: options.legacyTraceConfigFile,
    variants: options.variants.map((variant) => ({
      idSuffix: variant.idSuffix,
      title: variant.title,
      requirementRefs: variant.requirementRefs,
      transforms: [
        {
          operation: "remove",
          path: variant.missingPath,
        },
      ],
    })),
  });
}

export function statementRoundTripCase(options: StatementRoundTripCaseOptions): CaseDefinition {
  const statement = buildStatementFixture(options.transforms ?? []);
  const expectations =
    typeof options.queryJsonPathEquals === "function"
      ? options.queryJsonPathEquals(statement)
      : options.queryJsonPathEquals;

  return buildSubmitAndQueryCase({
    caseId: options.caseId,
    title: options.title,
    specVersion: options.specVersion,
    endpoint: "statements",
    submitMethod: "POST",
    submitQuery: {},
    submitBody: statement,
    submitBodySource: {
      domain: "statements",
      name: "default",
    },
    query: {
      [options.queryParam]: statement.id,
    },
    requirementRefs: options.requirementRefs,
    tags: options.tags,
    capabilityFlags: options.capabilityFlags ?? ["query", "retrieval"],
    legacyTraceSuiteFile: options.legacyTraceSuiteFile,
    legacyTraceConfigFile: options.legacyTraceConfigFile,
    queryJsonPathEquals: expectations,
    notes: options.notes ?? ["proof-slice statement roundtrip"],
    polling: options.polling ?? {
      strategy: "consistent-through",
      maxAttempts: 5,
      intervalMs: 250,
    },
    submitStatus: 200,
    queryStatus: 200,
  });
}

export function statementGeneratedIdRoundTripCase(options: StatementGeneratedIdRoundTripCaseOptions): CaseDefinition {
  const statement = buildStatementFixture([
    ...(options.transforms ?? []),
    {
      operation: "remove",
      path: ["id"],
    },
  ]);

  return buildSubmitAndQueryCase({
    caseId: options.caseId,
    title: options.title,
    specVersion: options.specVersion,
    endpoint: "statements",
    submitMethod: "POST",
    submitQuery: {},
    submitBody: statement,
    submitBodySource: {
      domain: "statements",
      name: "default",
    },
    query: {},
    requirementRefs: options.requirementRefs,
    tags: options.tags,
    capabilityFlags: options.capabilityFlags ?? ["query", "retrieval", "id-generation"],
    legacyTraceSuiteFile: options.legacyTraceSuiteFile,
    legacyTraceConfigFile: options.legacyTraceConfigFile,
    capturedQueryParam: {
      toQueryParam: "statementId",
      fromSubmitJsonPath: ["0"],
    },
    queryJsonPathEquals: [],
    queryJsonPathEqualsCaptured: [
      {
        queryPath: ["id"],
        fromSubmitJsonPath: ["0"],
      },
    ],
    notes: options.notes ?? ["proof-slice generated statement id roundtrip"],
    polling: options.polling ?? {
      strategy: "consistent-through",
      maxAttempts: 5,
      intervalMs: 250,
    },
    submitStatus: 200,
    queryStatus: 200,
  });
}

export function documentRoundTripCase(options: DocumentRoundTripCaseOptions): CaseDefinition {
  return buildSubmitAndQueryCase({
    caseId: options.caseId,
    title: options.title,
    specVersion: options.specVersion,
    endpoint: options.endpoint,
    submitMethod: options.submitMethod,
    submitQuery: options.query,
    submitBody: options.body,
    submitBodySource: options.bodyFixtureName
      ? {
          domain: "documents",
          name: options.bodyFixtureName,
        }
      : undefined,
    query: options.query,
    requirementRefs: options.requirementRefs,
    tags: options.tags,
    capabilityFlags: options.capabilityFlags ?? ["document", "retrieval"],
    legacyTraceSuiteFile: options.legacyTraceSuiteFile,
    legacyTraceConfigFile: options.legacyTraceConfigFile,
    queryJsonPathEquals: options.queryJsonPathEquals,
    notes: options.notes ?? ["proof-slice document roundtrip"],
    polling: options.polling,
    submitStatus: options.submitStatus ?? 204,
    queryStatus: options.queryStatus ?? 200,
  });
}

export function queryRetrievalFamily(options: QueryRetrievalFamilyOptions): CaseDefinition {
  return statementRoundTripCase({
    caseId: options.caseId,
    title: options.title,
    specVersion: options.specVersion,
    queryParam: options.queryParam,
    requirementRefs: options.requirementRefs,
    tags: options.tags,
    transforms: options.transforms,
    legacyTraceSuiteFile: options.legacyTraceSuiteFile,
    legacyTraceConfigFile: options.legacyTraceConfigFile,
    queryJsonPathEquals: (statement) => [
      {
        path: ["id"],
        equals: statement.id,
      },
    ],
    capabilityFlags: ["query", "retrieval"],
    notes: ["proof-slice query retrieval"],
  });
}

export function statementQueryValidationFamily(options: StatementQueryValidationFamilyOptions): CaseDefinition[] {
  return options.variants.map((variant) =>
    singleRequestCase({
      caseId: `${options.familyId}.${variant.idSuffix}`,
      title: variant.title,
      specVersion: options.specVersion,
      requirementRefs: variant.requirementRefs,
      tags: options.tags,
      capabilityFlags: variant.capabilityFlags ?? ["query", "validation"],
      legacyTraceSuiteFile: options.legacyTraceSuiteFile,
      legacyTraceConfigFile: options.legacyTraceConfigFile,
      request: {
        method: "GET",
        endpoint: "statements",
        authMode: "basic",
        headers: versionHeaders(options.specVersion),
        query: variant.query,
      },
      assertion: {
        status: options.expectedStatus ?? 400,
      },
      notes: [options.suiteTitle],
    }),
  );
}
