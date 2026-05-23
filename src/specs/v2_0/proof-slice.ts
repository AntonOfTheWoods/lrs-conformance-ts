import { createHash } from "node:crypto";

import type {
  CaseDefinition,
  EndpointKind,
  HttpMethod,
  HttpRequest,
  JsonPathExpectation,
  JsonObject,
  RegistryDefinition,
  RequirementRef,
  SuiteDefinition,
} from "../../domain/contracts";
import {
  buildActivityProfileDocumentFixture,
  buildActivityProfileIdentityFixture,
  buildActivityStateDocumentFixture,
  buildActivityStateIdentityFixture,
  buildAgentProfileDocumentFixture,
  buildAgentProfileIdentityFixture,
} from "../../fixtures/v2_0/documents";
import { buildStatementFixture, type FixtureTransform, type StatementFixture } from "../../fixtures/v2_0/statements";
import { RegistryBuilder } from "../../registry/builder";
import {
  documentRoundTripCase,
  queryRetrievalFamily,
  requestSequenceCase,
  requiredFieldFamily,
  singleRequestCase,
  statementMutationFamily,
  statementQueryValidationFamily,
  statementRoundTripCase,
} from "../../registry/families";

const specVersion = "2.0.0" as const;
const formattingLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/Data2.2-FormattingRequirements.js";
const formattingLegacyConfigFile = "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/configs/formatting.js";
const contextLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.2.2.5-Context-Requirements.js";
const contextsLegacyConfigFile = "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/configs/contexts.js";
const contextActivitiesLegacyConfigFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/configs/contextactivities.js";
const objectRequirementsLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.2.2.3-Object-Requirements.js";
const resultRequirementsLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.2.2.4-Result-Requirements.js";
const statementResourceLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.1.6.1-Statement-Resource.js";
const errorCodesLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/H.Communication3.2-ErrorCodes.js";
const stateResourceLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.1.6.2-State-Resource.js";
const agentsResourceLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.1.6.3-Agents-Resource.js";
const activitiesResourceLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.1.6.4-Activity-Resource.js";
const agentProfileLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.1.6.5-Agent-Profile-Resource.js";
const activityProfileLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.1.6.6-Activity-Profile-Resource.js";
const aboutResourceLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.1.6.7-About-Resource.js";
const headRequestsLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/H.Communication1.1-HeadRequestImplementation.js";
const contentTypesLegacySuiteFile = "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.1.3-Content-Types.js";
const concurrencyLegacySuiteFile = "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.1.4-Concurrency.js";
const encodingLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/H.Communication1.4-Encoding.js";
const versioningLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/H.Communication3.3-Versioning.js";
const authenticationLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/H.Communication4.0-Authentication.js";
const ifisLegacyConfigFile = "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/configs/ifis.js";
const agentsLegacyConfigFile = "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/configs/agents.js";
const groupsLegacyConfigFile = "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/configs/groups.js";
const authoritiesLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.2.4.2-Authority-Requirements.js";
const authoritiesLegacyConfigFile = "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/configs/authorities.js";
const statementLifecycleLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v1_0_3/Data2.3-StatementLifecycle.js";
const accountObjectsLegacyConfigFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/configs/accountobjects.js";
const activitiesLegacyConfigFile = "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/configs/activities.js";
const objectsLegacyConfigFile = "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/configs/objects.js";
const resultsLegacyConfigFile = "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/configs/results.js";
const scoresLegacyConfigFile = "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/configs/scores.js";
const statementRefsLegacyConfigFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/configs/statementrefs.js";
const subStatementsLegacyConfigFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/configs/substatements.js";

const proofUuidPrefix = "33333333-3333-4333-8333-";
const multipartStatementRequestBoundary = "mock-proof-statement-request";
const multipartStatementResponseContentType = "multipart/mixed; boundary=mock-xapi-statement-attachments";
const isoTimestampHeaderPattern = "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$";

function buildVersionedHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  return {
    "X-Experience-API-Version": specVersion,
    ...extraHeaders,
  };
}

function buildVersionedRequest(
  method: HttpMethod,
  endpoint: EndpointKind,
  query: Record<string, string>,
  body?:
    | { kind?: "json"; value: unknown; fixtureName?: string; contentType?: string }
    | { kind: "text"; value: string; fixtureName?: string; contentType?: string },
  extraHeaders: Record<string, string> = {},
): HttpRequest {
  const headers = buildVersionedHeaders(extraHeaders);

  if (body?.contentType) {
    headers["content-type"] = body.contentType;
  }

  return {
    method,
    endpoint,
    authMode: "basic",
    headers,
    query,
    body: body
      ? body.kind === "text"
        ? {
            kind: "text",
            value: body.value,
            sourceFixture: body.fixtureName
              ? {
                  version: specVersion,
                  domain: "documents",
                  name: body.fixtureName,
                }
              : undefined,
          }
        : {
            kind: "json",
            value: body.value,
            sourceFixture: body.fixtureName
              ? {
                  version: specVersion,
                  domain: "documents",
                  name: body.fixtureName,
                }
              : undefined,
          }
      : undefined,
  };
}

function buildStatementBody(body: JsonObject): NonNullable<HttpRequest["body"]> {
  return {
    kind: "json",
    value: body,
    sourceFixture: {
      version: specVersion,
      domain: "statements",
      name: "default",
    },
  };
}

function buildStatementBatchBody(body: unknown[]): NonNullable<HttpRequest["body"]> {
  return {
    kind: "json",
    value: body,
    sourceFixture: {
      version: specVersion,
      domain: "statements",
      name: "default",
    },
  };
}

function buildStatementPostRequest(body: JsonObject, extraHeaders: Record<string, string> = {}): HttpRequest {
  return {
    method: "POST",
    endpoint: "statements",
    authMode: "basic",
    headers: buildVersionedHeaders(extraHeaders),
    query: {},
    body: buildStatementBody(body),
  };
}

function buildStatementBatchPostRequest(body: unknown[], extraHeaders: Record<string, string> = {}): HttpRequest {
  return {
    method: "POST",
    endpoint: "statements",
    authMode: "basic",
    headers: buildVersionedHeaders(extraHeaders),
    query: {},
    body: buildStatementBatchBody(body),
  };
}

function buildStatementLookupRequest(
  queryKey: "statementId" | "voidedStatementId",
  statementId: string,
  extraHeaders: Record<string, string> = {},
): HttpRequest {
  return {
    method: "GET",
    endpoint: "statements",
    authMode: "basic",
    headers: buildVersionedHeaders(extraHeaders),
    query: {
      [queryKey]: statementId,
    },
  };
}

function buildStatementGetRequest(statementId: string, extraHeaders: Record<string, string> = {}): HttpRequest {
  return buildStatementLookupRequest("statementId", statementId, extraHeaders);
}

function buildVoidedStatementGetRequest(statementId: string, extraHeaders: Record<string, string> = {}): HttpRequest {
  return buildStatementLookupRequest("voidedStatementId", statementId, extraHeaders);
}

function buildStatementPutRequest(
  statementId: string,
  body: JsonObject,
  extraHeaders: Record<string, string> = {},
): HttpRequest {
  return {
    method: "PUT",
    endpoint: "statements",
    authMode: "basic",
    headers: buildVersionedHeaders(extraHeaders),
    query: {
      statementId,
    },
    body: buildStatementBody(body),
  };
}

function buildStatementCollectionRequest(
  query: Record<string, string>,
  extraHeaders: Record<string, string> = {},
): HttpRequest {
  return {
    method: "GET",
    endpoint: "statements",
    authMode: "basic",
    headers: buildVersionedHeaders(extraHeaders),
    query,
  };
}

function buildRequestWithoutVersionHeader(
  method: HttpMethod,
  endpoint: EndpointKind,
  query: Record<string, string>,
  body?:
    | { kind?: "json"; value: unknown; fixtureName?: string; contentType?: string }
    | { kind: "text"; value: string; fixtureName?: string; contentType?: string },
  extraHeaders: Record<string, string> = {},
): HttpRequest {
  const headers = { ...extraHeaders };

  if (body?.contentType) {
    headers["content-type"] = body.contentType;
  }

  return {
    method,
    endpoint,
    authMode: "basic",
    headers,
    query,
    body: body
      ? body.kind === "text"
        ? {
            kind: "text",
            value: body.value,
            sourceFixture: body.fixtureName
              ? {
                  version: specVersion,
                  domain: "documents",
                  name: body.fixtureName,
                }
              : undefined,
          }
        : {
            kind: "json",
            value: body.value,
            sourceFixture: body.fixtureName
              ? {
                  version: specVersion,
                  domain: "documents",
                  name: body.fixtureName,
                }
              : undefined,
          }
      : undefined,
  };
}

function buildUnversionedGetRequest(endpoint: EndpointKind, query: Record<string, string>): HttpRequest {
  return buildRequestWithoutVersionHeader("GET", endpoint, query);
}

function buildHeadRequest(
  endpoint: EndpointKind,
  query: Record<string, string>,
  includeVersionHeader = true,
  extraHeaders: Record<string, string> = {},
): HttpRequest {
  return includeVersionHeader
    ? buildVersionedRequest("HEAD", endpoint, query, undefined, extraHeaders)
    : buildRequestWithoutVersionHeader("HEAD", endpoint, query, undefined, extraHeaders);
}

function buildAboutGetRequest(includeVersionHeader = true): HttpRequest {
  return includeVersionHeader ? buildVersionedRequest("GET", "about", {}) : buildUnversionedGetRequest("about", {});
}

function buildAgentsGetRequest(agent: JsonObject | string, includeVersionHeader = true): HttpRequest {
  const query = {
    agent: typeof agent === "string" ? agent : JSON.stringify(agent),
  };

  return includeVersionHeader
    ? buildVersionedRequest("GET", "agents", query)
    : buildUnversionedGetRequest("agents", query);
}

function buildActivitiesGetRequest(activityId: string, includeVersionHeader = true): HttpRequest {
  const query = {
    activityId,
  };

  return includeVersionHeader
    ? buildVersionedRequest("GET", "activities", query)
    : buildUnversionedGetRequest("activities", query);
}

interface MultipartStatementAttachment {
  contentType: string;
  sha2: string;
  body: string;
}

interface MultipartStatementExtraPart {
  contentType: string;
  sha2?: string;
  body: string;
}

function buildMultipartStatementRequestBody(
  statement: JsonObject,
  attachments: MultipartStatementAttachment[],
  boundary = multipartStatementRequestBoundary,
  extraParts: MultipartStatementExtraPart[] = [],
): string {
  let body = `--${boundary}\r\n`;
  body += "Content-Type: application/json\r\n\r\n";
  body += `${JSON.stringify(statement)}\r\n`;

  for (const attachment of attachments) {
    body += `--${boundary}\r\n`;
    body += `Content-Type: ${attachment.contentType}\r\n`;
    body += `X-Experience-API-Hash: ${attachment.sha2}\r\n\r\n`;
    body += `${attachment.body}\r\n`;
  }

  for (const part of extraParts) {
    body += `--${boundary}\r\n`;
    body += `Content-Type: ${part.contentType}\r\n`;
    if (part.sha2) {
      body += `X-Experience-API-Hash: ${part.sha2}\r\n`;
    }
    body += "\r\n";
    body += `${part.body}\r\n`;
  }

  body += `--${boundary}--\r\n`;
  return body;
}

function buildMultipartStatementPostRequest(
  statement: JsonObject,
  attachments: MultipartStatementAttachment[],
  extraHeaders: Record<string, string> = {},
  options: {
    boundary?: string;
    contentType?: string;
    extraParts?: MultipartStatementExtraPart[];
  } = {},
): HttpRequest {
  const boundary = options.boundary ?? multipartStatementRequestBoundary;

  return buildVersionedRequest(
    "POST",
    "statements",
    {},
    {
      kind: "text",
      value: buildMultipartStatementRequestBody(statement, attachments, boundary, options.extraParts ?? []),
      contentType: options.contentType ?? `multipart/mixed; boundary=${boundary}`,
    },
    extraHeaders,
  );
}

function listEquals(expected: string[]) {
  return [
    {
      path: [],
      equals: expected,
    },
  ];
}

function buildProofUuid(sequence: number): string {
  return `${proofUuidPrefix}${sequence.toString().padStart(12, "0")}`;
}

function buildProofTimestamp(second: number): string {
  return new Date(Date.UTC(2026, 4, 23, 12, 0, second)).toISOString();
}

function buildProofStoredTimestamp(second: number): string {
  return new Date(buildProofTimestamp(second)).toISOString();
}

function buildProofDocumentEtag(body: unknown, mediaType = "application/json"): string {
  const serialized = typeof body === "string" ? body : (JSON.stringify(body) ?? "");
  return `"${createHash("sha1").update(`${mediaType}:${serialized}`).digest("hex")}"`;
}

function buildFormatProofStatement(sequence: number, actorMbox: string): StatementFixture {
  return buildProofStatement(sequence, [
    {
      operation: "set",
      path: ["actor"],
      value: {
        objectType: "Agent",
        mbox: actorMbox,
        name: "Format Proof Agent",
      },
    },
    {
      operation: "set",
      path: ["verb"],
      value: {
        id: "https://example.test/xapi/verbs/format-proof",
        display: {
          "en-US": "format-proof-us",
          "en-GB": "format-proof-gb",
        },
      },
    },
    {
      operation: "set",
      path: ["object"],
      value: {
        objectType: "Activity",
        id: "https://example.test/xapi/activities/format-proof",
        definition: {
          name: {
            "en-US": "Format Proof US",
            "en-GB": "Format Proof GB",
          },
          description: {
            "en-US": "Format description US",
            "en-GB": "Format description GB",
          },
          type: "https://example.test/xapi/activity-types/format-proof",
        },
      },
    },
  ]);
}

function buildMultipartAttachmentMetadata(attachment: MultipartStatementAttachment): JsonObject {
  return buildAttachmentFixture({
    contentType: attachment.contentType,
    sha2: attachment.sha2,
    length: attachment.body.length,
    fileUrl: "https://example.test/files/proof-attachment.txt",
  });
}

function buildProofStatement(sequence: number, transforms: FixtureTransform[] = []): StatementFixture {
  return buildStatementFixture([
    {
      operation: "set",
      path: ["id"],
      value: buildProofUuid(sequence),
    },
    {
      operation: "set",
      path: ["timestamp"],
      value: buildProofTimestamp(sequence),
    },
    ...transforms,
  ]);
}

function buildAgentQuery(mbox: string): string {
  return JSON.stringify({
    objectType: "Agent",
    mbox,
  });
}

function buildStatementCollectionExpectations(expectedStatementIds: string[]): JsonPathExpectation[] {
  return [
    {
      path: ["statements", "length"],
      equals: expectedStatementIds.length,
    },
    ...expectedStatementIds.map((statementId, index) => ({
      path: ["statements", String(index), "id"],
      equals: statementId,
    })),
  ];
}

interface StatementCollectionQueryCaseOptions {
  caseId: string;
  title: string;
  requirementRefs: RequirementRef[];
  tags: string[];
  setupStatements: StatementFixture[];
  query: Record<string, string>;
  expectedStatementIds: string[];
  legacyTraceSuiteFile: string;
  notes?: string[];
  capabilityFlags?: string[];
}

function buildStatementCollectionQueryCase(options: StatementCollectionQueryCaseOptions): CaseDefinition {
  return requestSequenceCase({
    caseId: options.caseId,
    title: options.title,
    specVersion,
    requirementRefs: options.requirementRefs,
    tags: options.tags,
    capabilityFlags: options.capabilityFlags ?? ["query", "retrieval"],
    legacyTraceSuiteFile: options.legacyTraceSuiteFile,
    notes: options.notes ?? ["proof-slice statement collection query"],
    steps: [
      ...options.setupStatements.map((statement) => ({
        request: buildStatementPostRequest(statement),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["id"],
              equals: statement.id,
            },
          ],
        },
      })),
      {
        request: buildStatementCollectionRequest(options.query),
        assertion: {
          status: 200,
          expectedHeaders: [
            {
              key: "X-Experience-API-Version",
              equals: specVersion,
            },
          ],
          jsonPathEquals: buildStatementCollectionExpectations(options.expectedStatementIds),
        },
      },
    ],
  });
}

function buildStatementQueryExclusivityCases(options: {
  familyId: string;
  baseQueryKey: "statementId" | "voidedStatementId";
  baseQueryValue: string;
  requirementRef: RequirementRef;
}): CaseDefinition[] {
  const queryVariants: Array<{ idSuffix: string; label: string; query: Record<string, string> }> = [
    {
      idSuffix: "with-agent",
      label: "agent",
      query: {
        agent: buildAgentQuery("mailto:statement-query-exclusive@example.test"),
      },
    },
    {
      idSuffix: "with-verb",
      label: "verb",
      query: {
        verb: "https://example.test/xapi/verbs/query-exclusive",
      },
    },
    {
      idSuffix: "with-activity",
      label: "activity",
      query: {
        activity: "https://example.test/xapi/activities/query-exclusive",
      },
    },
    {
      idSuffix: "with-registration",
      label: "registration",
      query: {
        registration: buildProofUuid(900),
      },
    },
    {
      idSuffix: "with-related-activities",
      label: "related_activities",
      query: {
        related_activities: "true",
      },
    },
    {
      idSuffix: "with-related-agents",
      label: "related_agents",
      query: {
        related_agents: "true",
      },
    },
    {
      idSuffix: "with-since",
      label: "since",
      query: {
        since: buildProofTimestamp(50),
      },
    },
    {
      idSuffix: "with-until",
      label: "until",
      query: {
        until: buildProofTimestamp(51),
      },
    },
    {
      idSuffix: "with-limit",
      label: "limit",
      query: {
        limit: "1",
      },
    },
    {
      idSuffix: "with-ascending",
      label: "ascending",
      query: {
        ascending: "true",
      },
    },
  ];

  return queryVariants.map((variant) =>
    singleRequestCase({
      caseId: `${options.familyId}.${variant.idSuffix}`,
      title: `The Statements resource rejects a GET request that combines ${options.baseQueryKey} with ${variant.label}`,
      specVersion,
      requirementRefs: [options.requirementRef],
      tags: ["v2.0.0", "statements", "query", "validation", "exclusive"],
      capabilityFlags: ["query", "validation"],
      legacyTraceSuiteFile: statementResourceLegacySuiteFile,
      request: buildStatementCollectionRequest({
        [options.baseQueryKey]: options.baseQueryValue,
        ...variant.query,
      }),
      assertion: {
        status: 400,
      },
      notes: ["proof-slice statement query exclusivity"],
    }),
  );
}

const validSinceTimestamp = "2020-01-01T00:00:00.000Z";
const invalidSinceTimestamp = "not-a-timestamp";
const validGroupMemberMbox = "mailto:proof-group-member@example.test";
const validNestedAgentMbox = "mailto:proof-nested-agent@example.test";
const validMboxSha1sum = "495395e777cd98da653df9615d09c0fd6bb2f8d4";
const validAccountHomePage = "https://example.test/xapi/accounts/proof";
const validAccountName = "proof-account";
const validAuthorityAccountHomePage = "http://example.com/xAPI/OAuth/Token";
const validAuthorityAccountName = "oauth_consumer_x75db";
const validAuthorityMemberMbox = "mailto:bob@example.com";
const validAuthorityThirdMemberMbox = "mailto:james@example.com";
const explicitNonOauthAuthorityMemberMbox = "mailto:agent-a@example.com";
const explicitNonOauthAuthoritySecondMemberMbox = "mailto:agent-b@example.com";
const populatedAuthorityAccountHomePage = "https://example.test/xapi/auth/basic";
const populatedAuthorityUserName = "proof-basic-user";
const populatedAuthorityAuthorization = "Basic cHJvb2YtYmFzaWMtdXNlcjpwcm9vZi1iYXNpYy1wYXNzd29yZA==";
const invalidMailtoIri = "http://should.fail.com";
const invalidMailtoEmail = "mailto:should.fail.com";
const invalidOpenId = "ab=c://should.fail.com";
const invalidAccountHomePage = "ab=c://should.fail.com";
const nonJsonDocumentBody = "abcdefg";
const existingNonJsonDocumentBody = "/ asdf / undefined";
const invalidAgentQuery = '{"objectType":"Agent"';
const invalidJsonDocumentBody = '{"name":"Broken profile document"[';
const validScoreDecimal = 0.6767676;
const validScoreMaxDecimal = 100.6767676;

function buildVerbFixture(id: string, display: string): JsonObject {
  return {
    id,
    display: {
      "en-US": display,
    },
  };
}

function buildActivityObjectFixture(
  id: string,
  overrides: Partial<JsonObject> = {},
  includeObjectType = true,
): JsonObject {
  return {
    ...(includeObjectType
      ? {
          objectType: "Activity",
        }
      : {}),
    id,
    ...overrides,
  };
}

function buildActivityDefinitionFixture(overrides: Partial<JsonObject> = {}): JsonObject {
  return {
    ...overrides,
  };
}

function buildInteractionComponentFixture(id: string, description = "Proof interaction component"): JsonObject {
  return {
    id,
    description: {
      "en-US": description,
    },
  };
}

function buildAgentWithMbox(mbox: string): JsonObject {
  return {
    objectType: "Agent",
    mbox,
    name: "Proof Agent",
  };
}

function buildGroupWithMbox(mbox: string, includeMember = true): JsonObject {
  return {
    objectType: "Group",
    mbox,
    name: "Proof Group",
    ...(includeMember
      ? {
          member: [buildAgentWithMbox(validGroupMemberMbox)],
        }
      : {}),
  };
}

function buildAgentWithOpenId(openid: string): JsonObject {
  return {
    objectType: "Agent",
    openid,
    name: "Proof Agent",
  };
}

function buildGroupWithOpenId(openid: string, includeMember = true): JsonObject {
  return {
    objectType: "Group",
    openid,
    name: "Proof Group",
    ...(includeMember
      ? {
          member: [buildAgentWithMbox(validGroupMemberMbox)],
        }
      : {}),
  };
}

function buildAgentWithMboxSha1sum(mboxSha1sum: unknown): JsonObject {
  return {
    objectType: "Agent",
    mbox_sha1sum: mboxSha1sum,
    name: "Proof Agent",
  };
}

function buildGroupWithMboxSha1sum(mboxSha1sum: unknown, includeMember = true): JsonObject {
  return {
    objectType: "Group",
    mbox_sha1sum: mboxSha1sum,
    name: "Proof Group",
    ...(includeMember
      ? {
          member: [buildAgentWithMbox(validGroupMemberMbox)],
        }
      : {}),
  };
}

function buildAccount(homePage?: string, name?: string): JsonObject {
  const account: JsonObject = {};

  if (homePage !== undefined) {
    account.homePage = homePage;
  }

  if (name !== undefined) {
    account.name = name;
  }

  return account;
}

function buildAgentWithAccount(account: JsonObject): JsonObject {
  return {
    objectType: "Agent",
    account,
    name: "Proof Agent",
  };
}

function buildGroupWithAccount(account: JsonObject, includeMember = true): JsonObject {
  return {
    objectType: "Group",
    account,
    name: "Proof Group",
    ...(includeMember
      ? {
          member: [buildAgentWithMbox(validGroupMemberMbox)],
        }
      : {}),
  };
}

function buildAgentWithoutIfi(): JsonObject {
  return {
    objectType: "Agent",
    name: "Proof Agent",
  };
}

function buildGroupWithoutIfiOrMember(): JsonObject {
  return {
    objectType: "Group",
    name: "Proof Group",
  };
}

function buildAuthorityAccountAgent(): JsonObject {
  return {
    account: buildAccount(validAuthorityAccountHomePage, validAuthorityAccountName),
  };
}

function buildAuthorityMboxAgent(mbox = validAuthorityMemberMbox): JsonObject {
  return {
    mbox,
  };
}

function buildAnonymousAuthorityGroup(
  members: JsonObject[] = [buildAuthorityAccountAgent(), buildAuthorityMboxAgent()],
): JsonObject {
  return {
    objectType: "Group",
    member: members,
  };
}

function buildIdentifiedAuthorityGroup(overrides: Partial<JsonObject>): JsonObject {
  return {
    ...buildAnonymousAuthorityGroup(),
    ...overrides,
  };
}

function buildSubStatementFixture(overrides: Partial<JsonObject> = {}): JsonObject {
  return {
    objectType: "SubStatement",
    actor: buildAgentWithMbox(validNestedAgentMbox),
    verb: buildVerbFixture("https://example.test/xapi/verbs/experienced", "experienced"),
    object: buildActivityObjectFixture("https://example.test/xapi/activities/substatement"),
    ...overrides,
  };
}

function buildAttachmentFixture(overrides: Partial<JsonObject> = {}): JsonObject {
  return {
    usageType: "https://example.test/xapi/attachments/proof",
    display: {
      "en-US": "Proof Attachment",
    },
    description: {
      "en-US": "Proof Attachment Description",
    },
    contentType: "text/plain; charset=ascii",
    length: 27,
    sha2: "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
    fileUrl: "https://example.test/files/proof.txt",
    ...overrides,
  };
}

function buildResultFixture(overrides: Partial<JsonObject> = {}): JsonObject {
  return {
    score: {
      scaled: validScoreDecimal,
      raw: validScoreDecimal,
      min: -1,
      max: 1,
    },
    success: true,
    completion: true,
    response: "proof result response",
    duration: "PT1H0M0.1S",
    extensions: {
      "https://example.test/xapi/results/extensions/proof": true,
    },
    ...overrides,
  };
}

function buildStatementRefFixture(id = buildProofUuid(960)): JsonObject {
  return {
    objectType: "StatementRef",
    id,
  };
}

type ContextActivityKind = "parent" | "grouping" | "category" | "other";
type InteractionComponentField = "choices" | "scale" | "source" | "target" | "steps";

interface ResultPlacement {
  idSuffix: string;
  title: string;
  buildTransforms(result: JsonObject): FixtureTransform[];
}

const resultPlacements: ResultPlacement[] = [
  {
    idSuffix: "statement",
    title: "a statement result",
    buildTransforms(result) {
      return [
        {
          operation: "set",
          path: ["result"],
          value: result,
        },
      ];
    },
  },
  {
    idSuffix: "substatement",
    title: "a substatement result",
    buildTransforms(result) {
      return [
        {
          operation: "set",
          path: ["object"],
          value: buildSubStatementFixture({
            result,
          }),
        },
      ];
    },
  },
];

interface StatementRefPlacement {
  idSuffix: string;
  title: string;
  buildTransforms(statementRef: JsonObject): FixtureTransform[];
}

const statementRefPlacements: StatementRefPlacement[] = [
  {
    idSuffix: "statement",
    title: "a statement object",
    buildTransforms(statementRef) {
      return [
        {
          operation: "set",
          path: ["object"],
          value: statementRef,
        },
      ];
    },
  },
  {
    idSuffix: "substatement",
    title: "a substatement object",
    buildTransforms(statementRef) {
      return [
        {
          operation: "set",
          path: ["object"],
          value: buildSubStatementFixture({
            object: statementRef,
          }),
        },
      ];
    },
  },
];

interface ActivityObjectPlacement {
  idSuffix: string;
  title: string;
  buildTransforms(activityObject: JsonObject): FixtureTransform[];
}

const activityObjectPlacements: ActivityObjectPlacement[] = [
  {
    idSuffix: "statement",
    title: "a statement Activity object",
    buildTransforms(activityObject) {
      return [
        {
          operation: "set",
          path: ["object"],
          value: activityObject,
        },
      ];
    },
  },
  {
    idSuffix: "substatement",
    title: "a substatement Activity object",
    buildTransforms(activityObject) {
      return [
        {
          operation: "set",
          path: ["object"],
          value: buildSubStatementFixture({
            object: activityObject,
          }),
        },
      ];
    },
  },
];

interface InteractionComponentTarget {
  idSuffix: string;
  title: string;
  field: InteractionComponentField;
  interactionType: string;
  correctResponsesPattern: string[];
  components: JsonObject[];
}

const interactionComponentTargets: InteractionComponentTarget[] = [
  {
    idSuffix: "choice-choices",
    title: 'choice "choices"',
    field: "choices",
    interactionType: "choice",
    correctResponsesPattern: ["choice-a[,]choice-b"],
    components: [
      buildInteractionComponentFixture("choice-a", "Choice A"),
      buildInteractionComponentFixture("choice-b", "Choice B"),
    ],
  },
  {
    idSuffix: "sequencing-choices",
    title: 'sequencing "choices"',
    field: "choices",
    interactionType: "sequencing",
    correctResponsesPattern: ["sequence-a[,]sequence-b"],
    components: [
      buildInteractionComponentFixture("sequence-a", "Sequence A"),
      buildInteractionComponentFixture("sequence-b", "Sequence B"),
    ],
  },
  {
    idSuffix: "likert-scale",
    title: 'likert "scale"',
    field: "scale",
    interactionType: "likert",
    correctResponsesPattern: ["likert-1"],
    components: [
      buildInteractionComponentFixture("likert-0", "Likert zero"),
      buildInteractionComponentFixture("likert-1", "Likert one"),
    ],
  },
  {
    idSuffix: "matching-source",
    title: 'matching "source"',
    field: "source",
    interactionType: "matching",
    correctResponsesPattern: ["source-a[.]target-a"],
    components: [
      buildInteractionComponentFixture("source-a", "Source A"),
      buildInteractionComponentFixture("source-b", "Source B"),
    ],
  },
  {
    idSuffix: "matching-target",
    title: 'matching "target"',
    field: "target",
    interactionType: "matching",
    correctResponsesPattern: ["source-a[.]target-a"],
    components: [
      buildInteractionComponentFixture("target-a", "Target A"),
      buildInteractionComponentFixture("target-b", "Target B"),
    ],
  },
  {
    idSuffix: "performance-steps",
    title: 'performance "steps"',
    field: "steps",
    interactionType: "performance",
    correctResponsesPattern: ["step-a[.]complete"],
    components: [
      buildInteractionComponentFixture("step-a", "Step A"),
      buildInteractionComponentFixture("step-b", "Step B"),
    ],
  },
];

interface ContextPlacement {
  idSuffix: string;
  title: string;
  buildTransforms(context: JsonObject): FixtureTransform[];
}

const contextPlacements: ContextPlacement[] = [
  {
    idSuffix: "statement",
    title: "a statement context",
    buildTransforms(context) {
      return [
        {
          operation: "set",
          path: ["context"],
          value: context,
        },
      ];
    },
  },
  {
    idSuffix: "substatement",
    title: "a substatement context",
    buildTransforms(context) {
      return [
        {
          operation: "set",
          path: ["object"],
          value: buildSubStatementFixture(),
        },
        {
          operation: "set",
          path: ["object", "context"],
          value: context,
        },
      ];
    },
  },
];

const contextActivityKinds: ContextActivityKind[] = ["parent", "grouping", "category", "other"];

function buildContextStatementRefFixture(id: string): JsonObject {
  return {
    objectType: "StatementRef",
    id,
  };
}

function buildContextActivityFixture(id: string, includeObjectType = true): JsonObject {
  return includeObjectType
    ? {
        objectType: "Activity",
        id,
      }
    : {
        id,
      };
}

function buildContextActivitiesFixture(activities: JsonObject): JsonObject {
  return {
    contextActivities: activities,
  };
}

function buildContextPropertyFixture(name: "revision" | "platform", value: string): JsonObject {
  return {
    [name]: value,
  } as JsonObject;
}

function buildContextPropertyConstraintTransforms(
  propertyName: "revision" | "platform",
  value: string,
  object: JsonObject,
  placement: "statement" | "substatement",
): FixtureTransform[] {
  const context = buildContextPropertyFixture(propertyName, value);

  if (placement === "statement") {
    return [
      {
        operation: "set",
        path: ["context"],
        value: context,
      },
      {
        operation: "set",
        path: ["object"],
        value: object,
      },
    ];
  }

  return [
    {
      operation: "set",
      path: ["object"],
      value: buildSubStatementFixture(),
    },
    {
      operation: "set",
      path: ["object", "context"],
      value: context,
    },
    {
      operation: "set",
      path: ["object", "object"],
      value: object,
    },
  ];
}

function buildContextActivitiesRoundTripPath(placementId: string, kind: ContextActivityKind): string[] {
  return placementId === "statement"
    ? ["context", "contextActivities", kind]
    : ["object", "context", "contextActivities", kind];
}

function buildActivityObjectRoundTripPath(placementId: string, propertyPath: string[]): string[] {
  return placementId === "statement" ? ["object", ...propertyPath] : ["object", "object", ...propertyPath];
}

function buildActivityDefinitionWithInteractionField(options: {
  field: InteractionComponentField;
  interactionType: string;
  correctResponsesPattern: string[];
  value: unknown;
}): JsonObject {
  const definition = buildActivityDefinitionFixture({
    interactionType: options.interactionType,
    correctResponsesPattern: options.correctResponsesPattern,
  });
  definition[options.field] = options.value;
  return definition;
}

interface ActorLikePlacement {
  idSuffix: string;
  title: string;
  kind: "agent" | "group";
  buildTransforms(value: JsonObject): FixtureTransform[];
}

const actorLikePlacements: ActorLikePlacement[] = [
  {
    idSuffix: "actor-agent",
    title: 'statement actor "agent"',
    kind: "agent",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["actor"],
          value,
        },
      ];
    },
  },
  {
    idSuffix: "actor-group",
    title: 'statement actor "group"',
    kind: "group",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["actor"],
          value,
        },
      ];
    },
  },
  {
    idSuffix: "authority-agent",
    title: 'statement authority "agent"',
    kind: "agent",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["authority"],
          value,
        },
      ];
    },
  },
  {
    idSuffix: "authority-group",
    title: 'statement authority "group"',
    kind: "group",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["authority"],
          value,
        },
      ];
    },
  },
  {
    idSuffix: "context-instructor-agent",
    title: 'statement context instructor "agent"',
    kind: "agent",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["context"],
          value: {
            instructor: value,
          },
        },
      ];
    },
  },
  {
    idSuffix: "context-instructor-group",
    title: 'statement context instructor "group"',
    kind: "group",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["context"],
          value: {
            instructor: value,
          },
        },
      ];
    },
  },
  {
    idSuffix: "context-team-group",
    title: 'statement context team "group"',
    kind: "group",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["context"],
          value: {
            team: value,
          },
        },
      ];
    },
  },
  {
    idSuffix: "object-agent",
    title: 'statement object "agent"',
    kind: "agent",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["object"],
          value,
        },
      ];
    },
  },
  {
    idSuffix: "object-group",
    title: 'statement object "group"',
    kind: "group",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["object"],
          value,
        },
      ];
    },
  },
  {
    idSuffix: "substatement-actor-agent",
    title: 'statement substatement actor "agent"',
    kind: "agent",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["object"],
          value: buildSubStatementFixture({
            actor: value,
          }),
        },
      ];
    },
  },
  {
    idSuffix: "substatement-actor-group",
    title: 'statement substatement actor "group"',
    kind: "group",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["object"],
          value: buildSubStatementFixture({
            actor: value,
          }),
        },
      ];
    },
  },
  {
    idSuffix: "substatement-context-instructor-agent",
    title: 'statement substatement context instructor "agent"',
    kind: "agent",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["object"],
          value: buildSubStatementFixture({
            context: {
              instructor: value,
            },
          }),
        },
      ];
    },
  },
  {
    idSuffix: "substatement-context-instructor-group",
    title: 'statement substatement context instructor "group"',
    kind: "group",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["object"],
          value: buildSubStatementFixture({
            context: {
              instructor: value,
            },
          }),
        },
      ];
    },
  },
  {
    idSuffix: "substatement-context-team-group",
    title: 'statement substatement context team "group"',
    kind: "group",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["object"],
          value: buildSubStatementFixture({
            context: {
              team: value,
            },
          }),
        },
      ];
    },
  },
];

interface IfiSpec {
  idToken: string;
  label: string;
  buildAgent(): JsonObject;
  buildGroup(includeMember?: boolean): JsonObject;
}

const ifiSpecs: IfiSpec[] = [
  {
    idToken: "mbox",
    label: "mbox",
    buildAgent: () => buildAgentWithMbox("mailto:proof-agent@example.test"),
    buildGroup: (includeMember = true) => buildGroupWithMbox("mailto:proof-group@example.test", includeMember),
  },
  {
    idToken: "mbox-sha1sum",
    label: "mbox_sha1sum",
    buildAgent: () => buildAgentWithMboxSha1sum(validMboxSha1sum),
    buildGroup: (includeMember = true) => buildGroupWithMboxSha1sum(validMboxSha1sum, includeMember),
  },
  {
    idToken: "openid",
    label: "openid",
    buildAgent: () => buildAgentWithOpenId("https://openid.example.test/proof-agent"),
    buildGroup: (includeMember = true) =>
      buildGroupWithOpenId("https://openid.example.test/proof-group", includeMember),
  },
  {
    idToken: "account",
    label: "account",
    buildAgent: () => buildAgentWithAccount(buildAccount(validAccountHomePage, validAccountName)),
    buildGroup: (includeMember = true) =>
      buildGroupWithAccount(buildAccount(validAccountHomePage, validAccountName), includeMember),
  },
];

function mergeActorLikeValues(primary: JsonObject, secondary: JsonObject): JsonObject {
  return {
    ...primary,
    ...secondary,
  };
}

function buildRepeatedActorMutationVariants(options: {
  description: string;
  requirementRefs: RequirementRef[];
  buildAgent(): JsonObject;
  buildGroup(): JsonObject;
}) {
  return actorLikePlacements.map((placement) => ({
    idSuffix: placement.idSuffix,
    title: `A Statement rejects ${placement.title} when ${options.description}`,
    transforms: placement.buildTransforms(placement.kind === "agent" ? options.buildAgent() : options.buildGroup()),
    requirementRefs: options.requirementRefs,
  }));
}

function buildIfiExclusivityVariants(options: { placements: ActorLikePlacement[]; requirementRefs: RequirementRef[] }) {
  return options.placements.flatMap((placement) =>
    ifiSpecs.flatMap((primary) =>
      ifiSpecs
        .filter((secondary) => secondary.idToken !== primary.idToken)
        .map((secondary) => ({
          idSuffix: `${placement.idSuffix}-${primary.idToken}-with-${secondary.idToken}`,
          title: `A Statement rejects ${placement.title} when ${primary.label} is used with ${secondary.label}`,
          transforms: placement.buildTransforms(
            mergeActorLikeValues(
              placement.kind === "agent" ? primary.buildAgent() : primary.buildGroup(),
              placement.kind === "agent" ? secondary.buildAgent() : secondary.buildGroup(),
            ),
          ),
          requirementRefs: options.requirementRefs,
        })),
    ),
  );
}

function buildIfiAcceptanceVariants(options: {
  placements: ActorLikePlacement[];
  requirementRefs: RequirementRef[];
  includeMember?: boolean;
}) {
  return options.placements.flatMap((placement) =>
    ifiSpecs.map((ifi) => ({
      idSuffix: `${placement.idSuffix}-${ifi.idToken}${options.includeMember === false ? "-no-member" : ""}`,
      title: `A Statement accepts ${placement.title} when ${ifi.label} is the sole IFI${
        options.includeMember === false ? " and no member is present" : ""
      }`,
      transforms: placement.buildTransforms(
        placement.kind === "agent" ? ifi.buildAgent() : ifi.buildGroup(options.includeMember),
      ),
      requirementRefs: options.requirementRefs,
    })),
  );
}

function buildMissingIfiVariants(options: {
  placements: ActorLikePlacement[];
  requirementRefs: RequirementRef[];
  buildValue(placement: ActorLikePlacement): JsonObject;
  description: string;
}) {
  return options.placements.map((placement) => ({
    idSuffix: placement.idSuffix,
    title: `A Statement rejects ${placement.title} when ${options.description}`,
    transforms: placement.buildTransforms(options.buildValue(placement)),
    requirementRefs: options.requirementRefs,
  }));
}

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

  const wrongTypeCases = statementMutationFamily({
    familyId: "v2.statements.invalid-types",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "types"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: formattingLegacyConfigFile,
    variants: [
      {
        idSuffix: "score-max-string",
        title: "A Statement rejects a string where result.score.max requires a number",
        transforms: [
          {
            operation: "set",
            path: ["result", "score", "max"],
            value: "one hundred",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00006",
            section: "Data 2.2.s4.b2",
            title: "Statements reject wrong data types",
          },
        ],
      },
      {
        idSuffix: "score-max-numeric-string",
        title: "A Statement rejects a numeric string where result.score.max requires a number",
        transforms: [
          {
            operation: "set",
            path: ["result", "score", "max"],
            value: "100",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00006",
            section: "Data 2.2.s4.b2",
            title: "Statements reject wrong data types",
          },
        ],
      },
      {
        idSuffix: "result-success-string",
        title: "A Statement rejects a string where result.success requires a boolean",
        transforms: [
          {
            operation: "set",
            path: ["result", "success"],
            value: "We regret to inform you that your effort was unsuccessful.",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00006",
            section: "Data 2.2.s4.b2",
            title: "Statements reject wrong data types",
          },
        ],
      },
      {
        idSuffix: "result-completion-string",
        title: "A Statement rejects a string where result.completion requires a boolean",
        transforms: [
          {
            operation: "set",
            path: ["result", "completion"],
            value: "false",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00006",
            section: "Data 2.2.s4.b2",
            title: "Statements reject wrong data types",
          },
        ],
      },
    ],
  });

  const invalidFormatCases = statementMutationFamily({
    familyId: "v2.statements.invalid-format",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "invalid-format"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: formattingLegacyConfigFile,
    variants: [
      {
        idSuffix: "statement-id-numeric",
        title: 'A Statement rejects a numeric value for the "id" field',
        transforms: [
          {
            operation: "set",
            path: ["id"],
            value: 42,
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00007",
            section: "Data 2.2.s4.b4",
            title: "Statements reject invalid formatted values",
          },
        ],
      },
      {
        idSuffix: "statement-id-object",
        title: 'A Statement rejects an object value for the "id" field',
        transforms: [
          {
            operation: "set",
            path: ["id"],
            value: { key: "value" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00007",
            section: "Data 2.2.s4.b4",
            title: "Statements reject invalid formatted values",
          },
        ],
      },
      {
        idSuffix: "statement-id-too-many-digits",
        title: 'A Statement rejects a UUID with too many digits in the "id" field',
        transforms: [
          {
            operation: "set",
            path: ["id"],
            value: "111111111-1111-4111-8111-111111111111",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00007",
            section: "Data 2.2.s4.b4",
            title: "Statements reject invalid formatted values",
          },
        ],
      },
      {
        idSuffix: "statement-id-invalid-letter",
        title: 'A Statement rejects a UUID with invalid hexadecimal letters in the "id" field',
        transforms: [
          {
            operation: "set",
            path: ["id"],
            value: "11111111-1111-4111-8111-11111111111G",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00007",
            section: "Data 2.2.s4.b4",
            title: "Statements reject invalid formatted values",
          },
        ],
      },
    ],
  });

  const iriSchemeCases = statementMutationFamily({
    familyId: "v2.statements.invalid-iri-schemes",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "iri"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: formattingLegacyConfigFile,
    variants: [
      {
        idSuffix: "verb-id-no-scheme",
        title: "A Statement rejects a verb id without an IRI scheme",
        transforms: [
          {
            operation: "set",
            path: ["verb", "id"],
            value: "example.test/xapi/verbs/completed",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00011",
            section: "Data 2.2.s4.b1.b8",
            title: "Statements reject IRIs without schemes",
          },
        ],
      },
      {
        idSuffix: "object-id-no-scheme",
        title: "A Statement rejects an object id without an IRI scheme",
        transforms: [
          {
            operation: "set",
            path: ["object", "id"],
            value: "example.test/xapi/activities/first-proof-slice",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00011",
            section: "Data 2.2.s4.b1.b8",
            title: "Statements reject IRIs without schemes",
          },
        ],
      },
      {
        idSuffix: "definition-type-no-scheme",
        title: "A Statement rejects an object definition type without an IRI scheme",
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "type"],
            value: "example.test/xapi/activity-type",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00011",
            section: "Data 2.2.s4.b1.b8",
            title: "Statements reject IRIs without schemes",
          },
        ],
      },
      {
        idSuffix: "definition-more-info-no-scheme",
        title: "A Statement rejects an object definition moreInfo value without an IRI scheme",
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "moreInfo"],
            value: "example.test/xapi/more-info",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00011",
            section: "Data 2.2.s4.b1.b8",
            title: "Statements reject IRIs without schemes",
          },
        ],
      },
    ],
  });

  const mboxIriCases = statementMutationFamily({
    familyId: "v2.statements.invalid-mbox-iri",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "mbox"],
    legacyTraceSuiteFile: ifisLegacyConfigFile,
    variants: buildRepeatedActorMutationVariants({
      description: "mbox is not a valid mailto IRI",
      requirementRefs: [
        {
          id: "XAPI-00038",
          section: "Data 2.4.2.3.s3.table1.row1",
          title: "mbox values must be mailto IRIs",
        },
      ],
      buildAgent: () => buildAgentWithMbox(invalidMailtoIri),
      buildGroup: () => buildGroupWithMbox(invalidMailtoIri),
    }),
  });

  const mboxMailtoCases = statementMutationFamily({
    familyId: "v2.statements.invalid-mbox-mailto",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "mbox"],
    legacyTraceSuiteFile: ifisLegacyConfigFile,
    variants: buildRepeatedActorMutationVariants({
      description: "mbox is not a valid mailto email address",
      requirementRefs: [
        {
          id: "XAPI-00038",
          section: "Data 2.4.2.3.s3.table1.row1",
          title: "mbox values must be mailto IRIs",
        },
      ],
      buildAgent: () => buildAgentWithMbox(invalidMailtoEmail),
      buildGroup: () => buildGroupWithMbox(invalidMailtoEmail),
    }),
  });

  const mboxSha1sumCases = statementMutationFamily({
    familyId: "v2.statements.invalid-mbox-sha1sum",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "mbox-sha1sum"],
    legacyTraceSuiteFile: ifisLegacyConfigFile,
    variants: buildRepeatedActorMutationVariants({
      description: "mbox_sha1sum is not a string",
      requirementRefs: [
        {
          id: "XAPI-00039",
          section: "Data 2.4.2.3.s3.table1.row2",
          title: "mbox_sha1sum values must be strings",
        },
      ],
      buildAgent: () => buildAgentWithMboxSha1sum({ key: "value" }),
      buildGroup: () => buildGroupWithMboxSha1sum({ key: "value" }),
    }),
  });

  const openIdCases = statementMutationFamily({
    familyId: "v2.statements.invalid-openid",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "openid"],
    legacyTraceSuiteFile: ifisLegacyConfigFile,
    variants: buildRepeatedActorMutationVariants({
      description: "openid is not a valid URI",
      requirementRefs: [
        {
          id: "XAPI-00040",
          section: "Data 2.4.2.3.s3.table1.row3",
          title: "openid values must be URIs",
        },
      ],
      buildAgent: () => buildAgentWithOpenId(invalidOpenId),
      buildGroup: () => buildGroupWithOpenId(invalidOpenId),
    }),
  });

  const accountHomePageMissingCases = statementMutationFamily({
    familyId: "v2.statements.account-home-page-missing",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "account"],
    legacyTraceSuiteFile: accountObjectsLegacyConfigFile,
    variants: buildRepeatedActorMutationVariants({
      description: "account.homePage is missing",
      requirementRefs: [
        {
          id: "XAPI-00042",
          section: "Data 2.4.2.4.s2.table1.row1",
          title: "Account objects require homePage",
        },
      ],
      buildAgent: () => buildAgentWithAccount(buildAccount(undefined, validAccountName)),
      buildGroup: () => buildGroupWithAccount(buildAccount(undefined, validAccountName)),
    }),
  });

  const accountHomePageInvalidCases = statementMutationFamily({
    familyId: "v2.statements.account-home-page-invalid",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "account"],
    legacyTraceSuiteFile: accountObjectsLegacyConfigFile,
    variants: buildRepeatedActorMutationVariants({
      description: "account.homePage is not a valid URI",
      requirementRefs: [
        {
          id: "XAPI-00042",
          section: "Data 2.4.2.4.s2.table1.row1",
          title: "Account objects require valid homePage IRIs",
        },
      ],
      buildAgent: () => buildAgentWithAccount(buildAccount(invalidAccountHomePage, validAccountName)),
      buildGroup: () => buildGroupWithAccount(buildAccount(invalidAccountHomePage, validAccountName)),
    }),
  });

  const accountNameMissingCases = statementMutationFamily({
    familyId: "v2.statements.account-name-missing",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "account"],
    legacyTraceSuiteFile: accountObjectsLegacyConfigFile,
    variants: buildRepeatedActorMutationVariants({
      description: "account.name is missing",
      requirementRefs: [
        {
          id: "XAPI-00043",
          section: "Data 2.4.2.4.s2.table1.row2",
          title: "Account objects require name",
        },
      ],
      buildAgent: () => buildAgentWithAccount(buildAccount(validAccountHomePage)),
      buildGroup: () => buildGroupWithAccount(buildAccount(validAccountHomePage)),
    }),
  });

  const attachmentIriCases = statementMutationFamily({
    familyId: "v2.statements.invalid-attachment-iri",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "attachment", "iri"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    variants: [
      {
        idSuffix: "usage-type-no-scheme",
        title: "A Statement rejects an attachment usageType without an IRI scheme",
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [
              buildAttachmentFixture({
                usageType: "example.test/xapi/attachments/proof",
              }),
            ],
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00011",
            section: "Data 2.2.s4.b1.b8",
            title: "Attachment usageType values must be IRIs",
          },
        ],
      },
      {
        idSuffix: "file-url-no-scheme",
        title: "A Statement rejects an attachment fileUrl without an IRI scheme",
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [
              buildAttachmentFixture({
                fileUrl: "example.test/files/proof.txt",
              }),
            ],
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00011",
            section: "Data 2.2.s4.b1.b8",
            title: "Attachment fileUrl values must be IRIs",
          },
        ],
      },
    ],
  });

  const agentIfiExclusivityCases = statementMutationFamily({
    familyId: "v2.statements.agent-ifi-exclusivity",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "exclusivity", "agent"],
    legacyTraceSuiteFile: agentsLegacyConfigFile,
    variants: buildIfiExclusivityVariants({
      placements: actorLikePlacements.filter((placement) => placement.kind === "agent"),
      requirementRefs: [
        {
          id: "XAPI-00034",
          section: "Data 2.4.2.1.s2.b2",
          title: "Agents must use only one IFI",
        },
      ],
    }),
  });

  const groupIfiExclusivityCases = statementMutationFamily({
    familyId: "v2.statements.group-ifi-exclusivity",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "exclusivity", "group"],
    legacyTraceSuiteFile: groupsLegacyConfigFile,
    variants: buildIfiExclusivityVariants({
      placements: actorLikePlacements.filter((placement) => placement.kind === "group"),
      requirementRefs: [
        {
          id: "XAPI-00037",
          section: "Data 2.4.2.2.s5.b1",
          title: "Identified Groups must use only one IFI",
        },
      ],
    }),
  });

  const identifiedGroupPlacements = actorLikePlacements.filter(
    (placement) => placement.kind === "group" && placement.idSuffix !== "authority-group",
  );

  const agentIfiRequiredCases = statementMutationFamily({
    familyId: "v2.statements.agent-ifi-required",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "required", "agent"],
    legacyTraceSuiteFile: agentsLegacyConfigFile,
    variants: buildMissingIfiVariants({
      placements: actorLikePlacements.filter((placement) => placement.kind === "agent"),
      description: "no IFI is present",
      buildValue: () => buildAgentWithoutIfi(),
      requirementRefs: [
        {
          id: "XAPI-00034",
          section: "Data 2.4.2.1.s2.b1",
          title: "Agents must include exactly one IFI",
        },
      ],
    }),
  });

  const groupIfiOrMemberRequiredCases = statementMutationFamily({
    familyId: "v2.statements.group-ifi-or-member-required",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "required", "group"],
    legacyTraceSuiteFile: groupsLegacyConfigFile,
    variants: buildMissingIfiVariants({
      placements: identifiedGroupPlacements,
      description: "no IFI and no member are present",
      buildValue: () => buildGroupWithoutIfiOrMember(),
      requirementRefs: [
        {
          id: "XAPI-00037",
          section: "Data 2.4.2.2.s2.table2.row1",
          title: "Groups without members must include an IFI",
        },
      ],
    }),
  });

  const groupIfiAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.group-ifi-acceptance",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "acceptance", "group"],
    expectedStatus: 200,
    legacyTraceSuiteFile: groupsLegacyConfigFile,
    variants: buildIfiAcceptanceVariants({
      placements: identifiedGroupPlacements,
      requirementRefs: [
        {
          id: "XAPI-00037",
          section: "Data 2.4.2.2.s2.table2.row1",
          title: "Identified Groups accept exactly one IFI",
        },
      ],
    }),
  });

  const groupIfiAcceptanceNoMemberCases = statementMutationFamily({
    familyId: "v2.statements.group-ifi-acceptance-no-member",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "acceptance", "group", "no-member"],
    expectedStatus: 200,
    legacyTraceSuiteFile: groupsLegacyConfigFile,
    variants: buildIfiAcceptanceVariants({
      placements: identifiedGroupPlacements,
      includeMember: false,
      requirementRefs: [
        {
          id: "XAPI-00037",
          section: "Data 2.4.2.2.s2.table2.row4",
          title: "Identified Groups accept a sole IFI without members",
        },
      ],
    }),
  });

  const agentIfiAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.agent-ifi-acceptance",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "acceptance", "agent"],
    expectedStatus: 200,
    legacyTraceSuiteFile: agentsLegacyConfigFile,
    variants: buildIfiAcceptanceVariants({
      placements: actorLikePlacements.filter((placement) => placement.kind === "agent"),
      requirementRefs: [
        {
          id: "XAPI-00034",
          section: "Data 2.4.2.1.s2.b1",
          title: "Agents accept exactly one IFI",
        },
      ],
    }),
  });

  const authorityGroupAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.authority-group-acceptance",
    suiteTitle: "Statement Authority",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "authority", "group", "acceptance"],
    expectedStatus: 200,
    legacyTraceSuiteFile: authoritiesLegacySuiteFile,
    legacyTraceConfigFile: authoritiesLegacyConfigFile,
    variants: [
      {
        idSuffix: "anonymous-two-member",
        title: "A Statement accepts an authority anonymous group with exactly two members",
        transforms: [
          {
            operation: "set",
            path: ["authority"],
            value: buildAnonymousAuthorityGroup(),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00098",
            section: "Data 2.4.9.s3.b1",
            title: "Authority groups are anonymous groups with exactly two members",
          },
        ],
      },
    ],
  });

  const authorityPopulationStatement = buildStatementFixture([
    {
      operation: "set",
      path: ["id"],
      value: "22222222-2222-4222-8222-222222222222",
    },
  ]);

  const authorityPopulationCase = requestSequenceCase({
    caseId: "v2.statements.authority-populates-when-missing",
    title: "The Statements resource populates authority from header information when authority is omitted",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00099",
        section: "Data 2.4.9.s3.b4",
        title: "Statements populate authority from header information",
      },
    ],
    tags: ["v2.0.0", "statements", "authority", "population"],
    capabilityFlags: ["authority", "query", "retrieval"],
    legacyTraceSuiteFile: authoritiesLegacySuiteFile,
    notes: ["proof-slice statement authority population"],
    steps: [
      {
        request: buildStatementPostRequest(authorityPopulationStatement, {
          Authorization: populatedAuthorityAuthorization,
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["id"],
              equals: authorityPopulationStatement.id,
            },
          ],
        },
      },
      {
        request: buildStatementGetRequest(authorityPopulationStatement.id),
        assertion: {
          status: 200,
          expectedHeaders: [
            {
              key: "X-Experience-API-Version",
              equals: specVersion,
            },
          ],
          jsonPathEquals: [
            {
              path: ["authority", "objectType"],
              equals: "Agent",
            },
            {
              path: ["authority", "account", "homePage"],
              equals: populatedAuthorityAccountHomePage,
            },
            {
              path: ["authority", "account", "name"],
              equals: populatedAuthorityUserName,
            },
          ],
        },
      },
    ],
  });

  const authorityNonOauthMembersCase = singleRequestCase({
    caseId: "v2.statements.authority-group-rejection.non-oauth-members",
    title: "A Statement rejects an authority group composed only of non-OAuth Agents",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00100",
        section: "Data 2.4.9.s3.b3",
        title: "Authority groups reject non-O-Auth Agents",
      },
    ],
    tags: ["v2.0.0", "statements", "authority", "group", "rejection", "non-oauth"],
    capabilityFlags: ["authority"],
    legacyTraceSuiteFile: authoritiesLegacySuiteFile,
    request: buildStatementPostRequest(
      buildStatementFixture([
        {
          operation: "set",
          path: ["authority"],
          value: buildAnonymousAuthorityGroup([
            buildAuthorityMboxAgent(explicitNonOauthAuthorityMemberMbox),
            buildAuthorityMboxAgent(explicitNonOauthAuthoritySecondMemberMbox),
          ]),
        },
      ]),
    ),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice statement authority non-oauth rejection"],
  });

  const authorityGroupRejectionCases = statementMutationFamily({
    familyId: "v2.statements.authority-group-rejection",
    suiteTitle: "Statement Authority",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "authority", "group", "rejection"],
    legacyTraceSuiteFile: authoritiesLegacySuiteFile,
    legacyTraceConfigFile: authoritiesLegacyConfigFile,
    variants: [
      {
        idSuffix: "identified-mbox",
        title: "A Statement rejects an authority identified group that uses mbox",
        transforms: [
          {
            operation: "set",
            path: ["authority"],
            value: buildIdentifiedAuthorityGroup({
              mbox: "mailto:bob@example.com",
            }),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00024",
            section: "Data 2.4.s1.table1.row9",
            title: "Authority groups do not use identified group IFIs",
          },
        ],
      },
      {
        idSuffix: "identified-mbox-sha1sum",
        title: "A Statement rejects an authority identified group that uses mbox_sha1sum",
        transforms: [
          {
            operation: "set",
            path: ["authority"],
            value: buildIdentifiedAuthorityGroup({
              mbox_sha1sum: validMboxSha1sum,
            }),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00024",
            section: "Data 2.4.s1.table1.row9",
            title: "Authority groups do not use identified group IFIs",
          },
        ],
      },
      {
        idSuffix: "identified-openid",
        title: "A Statement rejects an authority identified group that uses openid",
        transforms: [
          {
            operation: "set",
            path: ["authority"],
            value: buildIdentifiedAuthorityGroup({
              openid: "http://openid.example.org/12345",
            }),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00024",
            section: "Data 2.4.s1.table1.row9",
            title: "Authority groups do not use identified group IFIs",
          },
        ],
      },
      {
        idSuffix: "identified-account",
        title: "A Statement rejects an authority identified group that uses account",
        transforms: [
          {
            operation: "set",
            path: ["authority"],
            value: buildIdentifiedAuthorityGroup({
              account: buildAccount(validAuthorityAccountHomePage, validAuthorityAccountName),
            }),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00024",
            section: "Data 2.4.s1.table1.row9",
            title: "Authority groups do not use identified group IFIs",
          },
        ],
      },
      {
        idSuffix: "anonymous-no-member",
        title: "A Statement rejects an authority anonymous group without two members",
        transforms: [
          {
            operation: "set",
            path: ["authority"],
            value: buildGroupWithoutIfiOrMember(),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00098",
            section: "Data 2.4.9.s3.b1",
            title: "Authority groups require exactly two members",
          },
        ],
      },
      {
        idSuffix: "anonymous-one-member",
        title: "A Statement rejects an authority anonymous group with one member",
        transforms: [
          {
            operation: "set",
            path: ["authority"],
            value: buildAnonymousAuthorityGroup([buildAuthorityMboxAgent()]),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00098",
            section: "Data 2.4.9.s3.b1",
            title: "Authority groups require exactly two members",
          },
        ],
      },
      {
        idSuffix: "anonymous-three-member",
        title: "A Statement rejects an authority anonymous group with three members",
        transforms: [
          {
            operation: "set",
            path: ["authority"],
            value: buildAnonymousAuthorityGroup([
              buildAuthorityAccountAgent(),
              buildAuthorityMboxAgent(),
              buildAuthorityMboxAgent(validAuthorityThirdMemberMbox),
            ]),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00098",
            section: "Data 2.4.9.s3.b1",
            title: "Authority groups require exactly two members",
          },
        ],
      },
    ],
  });

  const caseSensitiveKeyCases = statementMutationFamily({
    familyId: "v2.statements.case-sensitive-keys",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "keys"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: formattingLegacyConfigFile,
    variants: [
      {
        idSuffix: "id",
        title: 'A Statement rejects a case-mismatched top-level key for "id"',
        transforms: [
          {
            operation: "set",
            path: ["iD"],
            value: buildProofUuid(201),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00008",
            section: "Data 2.2.s4.b1.b5",
            title: "Statement keys are case-sensitive",
          },
          {
            id: "XAPI-00010",
            section: "Data 2.2.s4.b1.b5",
            title: "Statements reject unsupported keys",
          },
        ],
      },
      {
        idSuffix: "actor",
        title: 'A Statement rejects a case-mismatched top-level key for "actor"',
        transforms: [
          {
            operation: "set",
            path: ["Actor"],
            value: buildAgentWithMbox("mailto:case-sensitive-actor@example.test"),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00008",
            section: "Data 2.2.s4.b1.b5",
            title: "Statement keys are case-sensitive",
          },
          {
            id: "XAPI-00010",
            section: "Data 2.2.s4.b1.b5",
            title: "Statements reject unsupported keys",
          },
        ],
      },
      {
        idSuffix: "verb",
        title: 'A Statement rejects a case-mismatched top-level key for "verb"',
        transforms: [
          {
            operation: "set",
            path: ["veRb"],
            value: buildVerbFixture("https://example.test/xapi/verbs/case-sensitive", "case-sensitive"),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00008",
            section: "Data 2.2.s4.b1.b5",
            title: "Statement keys are case-sensitive",
          },
          {
            id: "XAPI-00010",
            section: "Data 2.2.s4.b1.b5",
            title: "Statements reject unsupported keys",
          },
        ],
      },
      {
        idSuffix: "object",
        title: 'A Statement rejects a case-mismatched top-level key for "object"',
        transforms: [
          {
            operation: "set",
            path: ["oBject"],
            value: buildActivityObjectFixture("https://example.test/xapi/activities/case-sensitive-object"),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00008",
            section: "Data 2.2.s4.b1.b5",
            title: "Statement keys are case-sensitive",
          },
          {
            id: "XAPI-00010",
            section: "Data 2.2.s4.b1.b5",
            title: "Statements reject unsupported keys",
          },
        ],
      },
      {
        idSuffix: "result",
        title: 'A Statement rejects a case-mismatched top-level key for "result"',
        transforms: [
          {
            operation: "set",
            path: ["RESULT"],
            value: {
              completion: true,
            },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00008",
            section: "Data 2.2.s4.b1.b5",
            title: "Statement keys are case-sensitive",
          },
          {
            id: "XAPI-00010",
            section: "Data 2.2.s4.b1.b5",
            title: "Statements reject unsupported keys",
          },
        ],
      },
      {
        idSuffix: "context",
        title: 'A Statement rejects a case-mismatched top-level key for "context"',
        transforms: [
          {
            operation: "set",
            path: ["conText"],
            value: {
              language: "en-US",
            },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00008",
            section: "Data 2.2.s4.b1.b5",
            title: "Statement keys are case-sensitive",
          },
          {
            id: "XAPI-00010",
            section: "Data 2.2.s4.b1.b5",
            title: "Statements reject unsupported keys",
          },
        ],
      },
      {
        idSuffix: "timestamp",
        title: 'A Statement rejects a case-mismatched top-level key for "timestamp"',
        transforms: [
          {
            operation: "set",
            path: ["timeStamp"],
            value: buildProofTimestamp(202),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00008",
            section: "Data 2.2.s4.b1.b5",
            title: "Statement keys are case-sensitive",
          },
          {
            id: "XAPI-00010",
            section: "Data 2.2.s4.b1.b5",
            title: "Statements reject unsupported keys",
          },
        ],
      },
      {
        idSuffix: "stored",
        title: 'A Statement rejects a case-mismatched top-level key for "stored"',
        transforms: [
          {
            operation: "set",
            path: ["STOred"],
            value: buildProofStoredTimestamp(202),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00008",
            section: "Data 2.2.s4.b1.b5",
            title: "Statement keys are case-sensitive",
          },
          {
            id: "XAPI-00010",
            section: "Data 2.2.s4.b1.b5",
            title: "Statements reject unsupported keys",
          },
        ],
      },
      {
        idSuffix: "authority",
        title: 'A Statement rejects a case-mismatched top-level key for "authority"',
        transforms: [
          {
            operation: "set",
            path: ["auTHORity"],
            value: buildAgentWithMbox("mailto:case-sensitive-authority@example.test"),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00008",
            section: "Data 2.2.s4.b1.b5",
            title: "Statement keys are case-sensitive",
          },
          {
            id: "XAPI-00010",
            section: "Data 2.2.s4.b1.b5",
            title: "Statements reject unsupported keys",
          },
        ],
      },
      {
        idSuffix: "version",
        title: 'A Statement rejects a case-mismatched top-level key for "version"',
        transforms: [
          {
            operation: "set",
            path: ["Version"],
            value: specVersion,
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00008",
            section: "Data 2.2.s4.b1.b5",
            title: "Statement keys are case-sensitive",
          },
          {
            id: "XAPI-00010",
            section: "Data 2.2.s4.b1.b5",
            title: "Statements reject unsupported keys",
          },
        ],
      },
      {
        idSuffix: "attachments",
        title: 'A Statement rejects a case-mismatched top-level key for "attachments"',
        transforms: [
          {
            operation: "set",
            path: ["attachmentS"],
            value: [buildAttachmentFixture()],
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00008",
            section: "Data 2.2.s4.b1.b5",
            title: "Statement keys are case-sensitive",
          },
          {
            id: "XAPI-00010",
            section: "Data 2.2.s4.b1.b5",
            title: "Statements reject unsupported keys",
          },
        ],
      },
    ],
  });

  const interactionTypeCaseCases = statementMutationFamily({
    familyId: "v2.statements.interaction-type-case",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "interaction-type"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: formattingLegacyConfigFile,
    variants: [
      {
        idSuffix: "true-false",
        title: 'A Statement rejects an interactionType value whose case does not exactly match "true-false"',
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "interactionType"],
            value: "true-faLse",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00009",
            section: "Data 2.2.s4.b1.b6",
            title: "Enumerated values are case-sensitive",
          },
        ],
      },
      {
        idSuffix: "choice",
        title: 'A Statement rejects an interactionType value whose case does not exactly match "choice"',
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "interactionType"],
            value: "choiCe",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00009",
            section: "Data 2.2.s4.b1.b6",
            title: "Enumerated values are case-sensitive",
          },
        ],
      },
      {
        idSuffix: "fill-in",
        title: 'A Statement rejects an interactionType value whose case does not exactly match "fill-in"',
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "interactionType"],
            value: "fill-iN",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00009",
            section: "Data 2.2.s4.b1.b6",
            title: "Enumerated values are case-sensitive",
          },
        ],
      },
      {
        idSuffix: "long-fill-in",
        title: 'A Statement rejects an interactionType value whose case does not exactly match "long-fill-in"',
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "interactionType"],
            value: "long-fiLl-in",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00009",
            section: "Data 2.2.s4.b1.b6",
            title: "Enumerated values are case-sensitive",
          },
        ],
      },
      {
        idSuffix: "matching",
        title: 'A Statement rejects an interactionType value whose case does not exactly match "matching"',
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "interactionType"],
            value: "matchIng",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00009",
            section: "Data 2.2.s4.b1.b6",
            title: "Enumerated values are case-sensitive",
          },
        ],
      },
      {
        idSuffix: "performance",
        title: 'A Statement rejects an interactionType value whose case does not exactly match "performance"',
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "interactionType"],
            value: "perfOrmance",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00009",
            section: "Data 2.2.s4.b1.b6",
            title: "Enumerated values are case-sensitive",
          },
        ],
      },
      {
        idSuffix: "sequencing",
        title: 'A Statement rejects an interactionType value whose case does not exactly match "sequencing"',
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "interactionType"],
            value: "seqUencing",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00009",
            section: "Data 2.2.s4.b1.b6",
            title: "Enumerated values are case-sensitive",
          },
        ],
      },
      {
        idSuffix: "likert",
        title: 'A Statement rejects an interactionType value whose case does not exactly match "likert"',
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "interactionType"],
            value: "liKert",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00009",
            section: "Data 2.2.s4.b1.b6",
            title: "Enumerated values are case-sensitive",
          },
        ],
      },
      {
        idSuffix: "numeric",
        title: 'A Statement rejects an interactionType value whose case does not exactly match "numeric"',
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "interactionType"],
            value: "nUmeric",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00009",
            section: "Data 2.2.s4.b1.b6",
            title: "Enumerated values are case-sensitive",
          },
        ],
      },
      {
        idSuffix: "other",
        title: 'A Statement rejects an interactionType value whose case does not exactly match "other"',
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "interactionType"],
            value: "Other",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00009",
            section: "Data 2.2.s4.b1.b6",
            title: "Enumerated values are case-sensitive",
          },
        ],
      },
    ],
  });

  const extensionKeyCases = statementMutationFamily({
    familyId: "v2.statements.invalid-extension-iri",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "extensions", "iri"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: formattingLegacyConfigFile,
    variants: [
      {
        idSuffix: "object-definition",
        title: "A Statement rejects an object definition extension key without an IRI scheme",
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "extensions"],
            value: {
              "not.valid.com/extension": 1234,
            },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00011",
            section: "Data 2.2.s4.b1.b8",
            title: "Extension keys must be IRIs",
          },
        ],
      },
      {
        idSuffix: "context",
        title: "A Statement rejects a context extension key without an IRI scheme",
        transforms: [
          {
            operation: "set",
            path: ["context", "extensions"],
            value: {
              "example.com/extension/wrong": 1234,
            },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00011",
            section: "Data 2.2.s4.b1.b8",
            title: "Extension keys must be IRIs",
          },
        ],
      },
      {
        idSuffix: "result",
        title: "A Statement rejects a result extension key without an IRI scheme",
        transforms: [
          {
            operation: "set",
            path: ["result", "extensions"],
            value: {
              "example.com/extension/wrong": 1234,
            },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00011",
            section: "Data 2.2.s4.b1.b8",
            title: "Extension keys must be IRIs",
          },
        ],
      },
    ],
  });

  const languageTagAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.language-tags.accepted",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    expectedStatus: 200,
    tags: ["v2.0.0", "statements", "formatting", "language-tags", "acceptance"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: formattingLegacyConfigFile,
    variants: [
      {
        idSuffix: "verb-display",
        title: "A Statement accepts a valid RFC 5646 language key in verb.display",
        transforms: [
          {
            operation: "set",
            path: ["verb", "display"],
            value: { de: "besucht" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "object-name",
        title: "A Statement accepts a valid RFC 5646 language key in object.definition.name",
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "name"],
            value: { "de-DE": "Beweis Aktivitat" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "object-description",
        title: "A Statement accepts a valid RFC 5646 language key in object.definition.description",
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "description"],
            value: { "zh-Hant": "證明描述" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "context-language",
        title: "A Statement accepts a valid RFC 5646 context.language value",
        transforms: [
          {
            operation: "set",
            path: ["context", "language"],
            value: "cmn",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language values follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "attachment-display",
        title: "A Statement accepts a valid RFC 5646 language key in attachment.display",
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [
              buildAttachmentFixture({
                display: {
                  "en-US": "Proof Attachment",
                  es: "Adjunto de prueba",
                },
              }),
            ],
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "attachment-description",
        title: "A Statement accepts a valid RFC 5646 language key in attachment.description",
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [
              buildAttachmentFixture({
                description: {
                  "en-US": "Proof Attachment Description",
                  "es-MX": "Descripcion del adjunto de prueba",
                },
              }),
            ],
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "substatement-verb-display",
        title: "A Statement accepts a valid RFC 5646 language key in a substatement verb.display",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "set",
            path: ["object", "verb", "display"],
            value: { "sr-Cyrl": "искусити" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "substatement-object-name",
        title: "A Statement accepts a valid RFC 5646 language key in a substatement activity name",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "set",
            path: ["object", "object", "definition", "name"],
            value: { "zh-Hans-CN": "子活动" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "substatement-object-description",
        title: "A Statement accepts a valid RFC 5646 language key in a substatement activity description",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "set",
            path: ["object", "object", "definition", "description"],
            value: { ase: "Substatement activity description" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "substatement-context-language",
        title: "A Statement accepts a valid RFC 5646 context.language value in a substatement",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "set",
            path: ["object", "context", "language"],
            value: "fr-CA",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language values follow RFC 5646",
          },
        ],
      },
    ],
  });

  const languageTagRejectionCases = statementMutationFamily({
    familyId: "v2.statements.language-tags.rejected",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "language-tags", "rejection"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: formattingLegacyConfigFile,
    variants: [
      {
        idSuffix: "verb-display",
        title: "A Statement rejects an invalid RFC 5646 language key in verb.display",
        transforms: [
          {
            operation: "set",
            path: ["verb", "display"],
            value: { something: "besucht" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "object-name",
        title: "A Statement rejects an invalid RFC 5646 language key in object.definition.name",
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "name"],
            value: { something: "Bad activity name" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "object-description",
        title: "A Statement rejects an invalid RFC 5646 language key in object.definition.description",
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "description"],
            value: { something: "Bad activity description" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "context-language",
        title: "A Statement rejects an invalid RFC 5646 context.language value",
        transforms: [
          {
            operation: "set",
            path: ["context", "language"],
            value: "something",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language values follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "attachment-display",
        title: "A Statement rejects an invalid RFC 5646 language key in attachment.display",
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [
              buildAttachmentFixture({
                display: {
                  "en-US": "Proof Attachment",
                  something: "Adjunto de prueba",
                },
              }),
            ],
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "attachment-description",
        title: "A Statement rejects an invalid RFC 5646 language key in attachment.description",
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [
              buildAttachmentFixture({
                description: {
                  "en-US": "Proof Attachment Description",
                  something: "Descripcion del adjunto de prueba",
                },
              }),
            ],
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "substatement-verb-display",
        title: "A Statement rejects an invalid RFC 5646 language key in a substatement verb.display",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "set",
            path: ["object", "verb", "display"],
            value: { something: "bad" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "substatement-object-name",
        title: "A Statement rejects an invalid RFC 5646 language key in a substatement activity name",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "set",
            path: ["object", "object", "definition", "name"],
            value: { "zh-z-aaa-z-bbb-c-ccc": "Invalid language tag" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "substatement-object-description",
        title: "A Statement rejects an invalid RFC 5646 language key in a substatement activity description",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "set",
            path: ["object", "object", "definition", "description"],
            value: { something: "Invalid language tag" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "substatement-context-language",
        title: "A Statement rejects an invalid RFC 5646 context.language value in a substatement",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "set",
            path: ["object", "context", "language"],
            value: "something",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language values follow RFC 5646",
          },
        ],
      },
    ],
  });

  const malformedObjectTypeCases = statementMutationFamily({
    familyId: "v2.statements.malformed-object-type",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "object-type"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    variants: [
      {
        idSuffix: "actor",
        title: "A Statement rejects an actor objectType value that does not exactly match Agent",
        transforms: [
          {
            operation: "set",
            path: ["actor", "objectType"],
            value: '"objectType": "Agent"',
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00014",
            section: "Data 2.1",
            title: "All Objects are well-created JSON Objects",
          },
        ],
      },
      {
        idSuffix: "substatement-actor",
        title: "A Statement rejects a substatement actor objectType value that does not exactly match Agent",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "set",
            path: ["object", "actor", "objectType"],
            value: '"objectType": "Agent"',
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00014",
            section: "Data 2.1",
            title: "All Objects are well-created JSON Objects",
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
    specVersion,
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
        path: ["id"],
        value: buildProofUuid(200),
      },
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

  const putRoundTripStatement = buildProofStatement(201, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/transport-put-roundtrip",
    },
  ]);

  const putRoundTripCase = requestSequenceCase({
    caseId: "v2.statements.transport.put-roundtrip",
    title: "The Statements resource persists a statement written with PUT and retrieves it by statementId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00143",
        section: "Communication 2.1.1.s1",
        title: "Successful Statement PUT returns 204 No Content",
      },
    ],
    tags: ["v2.0.0", "statements", "transport", "put"],
    capabilityFlags: ["transport", "query", "retrieval"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice statement PUT roundtrip"],
    steps: [
      {
        request: buildStatementPutRequest(putRoundTripStatement.id, putRoundTripStatement),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildStatementGetRequest(putRoundTripStatement.id),
        assertion: {
          status: 200,
          expectedHeaders: [
            {
              key: "X-Experience-API-Version",
              equals: specVersion,
            },
          ],
          jsonPathEquals: [
            {
              path: ["id"],
              equals: putRoundTripStatement.id,
            },
            {
              path: ["verb", "id"],
              equals: "https://example.test/xapi/verbs/transport-put-roundtrip",
            },
          ],
        },
      },
    ],
  });

  const putRequiresStatementIdStatement = buildProofStatement(202, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/transport-put-missing-id",
    },
  ]);

  const putRequiresStatementIdCase = singleRequestCase({
    caseId: "v2.statements.transport.put-requires-statement-id",
    title: "The Statements resource rejects PUT without a statementId query parameter",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00145",
        section: "Communication 2.1.1.s1.table1.row1",
        title: "Statement PUT rejects requests without statementId",
      },
    ],
    tags: ["v2.0.0", "statements", "transport", "put"],
    capabilityFlags: ["transport", "validation"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    request: {
      method: "PUT",
      endpoint: "statements",
      authMode: "basic",
      headers: buildVersionedHeaders(),
      query: {},
      body: buildStatementBody(putRequiresStatementIdStatement),
    },
    assertion: {
      status: 400,
    },
    notes: ["proof-slice statement PUT requires statementId"],
  });

  const immutableOriginalVerbId = "https://example.test/xapi/verbs/transport-put-original";
  const immutableReplacementVerbId = "https://example.test/xapi/verbs/transport-put-replacement";
  const immutableOriginalStatement = buildProofStatement(203, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: immutableOriginalVerbId,
    },
  ]);
  const immutableReplacementStatement = buildProofStatement(203, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: immutableReplacementVerbId,
    },
  ]);

  const putImmutableCase = requestSequenceCase({
    caseId: "v2.statements.transport.put-is-immutable",
    title:
      "The Statements resource does not modify an existing statement when the same statementId is written again with PUT",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00142",
        section: "Communication 2.1.1.s2.b2",
        title: "Statement PUT cannot modify an existing Statement",
      },
    ],
    tags: ["v2.0.0", "statements", "transport", "put", "immutability"],
    capabilityFlags: ["transport", "query", "retrieval"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice statement PUT immutability"],
    steps: [
      {
        request: buildStatementPutRequest(immutableOriginalStatement.id, immutableOriginalStatement),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildStatementPutRequest(immutableReplacementStatement.id, immutableReplacementStatement),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildStatementGetRequest(immutableOriginalStatement.id),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["verb", "id"],
              equals: immutableOriginalVerbId,
            },
          ],
        },
      },
    ],
  });

  const voidedStatement = buildProofStatement(204, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/voiding-target",
    },
  ]);
  const voidingStatement = buildProofStatement(205, [
    {
      operation: "set",
      path: ["verb"],
      value: buildVerbFixture("http://adlnet.gov/expapi/verbs/voided", "voided"),
    },
    {
      operation: "set",
      path: ["object"],
      value: {
        objectType: "StatementRef",
        id: voidedStatement.id,
      },
    },
  ]);

  const voidedStatementQueryCase = requestSequenceCase({
    caseId: "v2.statements.voiding.voided-statement-id-roundtrip",
    title: "The Statements resource returns a voided statement when queried by voidedStatementId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00155",
        section: "Communication 2.1.3.s1",
        title: "GET with voidedStatementId returns the corresponding Statement",
      },
    ],
    tags: ["v2.0.0", "statements", "voiding", "query"],
    capabilityFlags: ["transport", "query", "retrieval", "voiding"],
    legacyTraceSuiteFile: statementLifecycleLegacySuiteFile,
    notes: ["proof-slice voided statement retrieval"],
    steps: [
      {
        request: buildStatementPostRequest(voidedStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementPostRequest(voidingStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildVoidedStatementGetRequest(voidedStatement.id),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["id"],
              equals: voidedStatement.id,
            },
          ],
        },
      },
    ],
  });

  const hiddenVoidedStatement = buildProofStatement(206, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/voiding-hidden-target",
    },
  ]);
  const hidingVoidingStatement = buildProofStatement(207, [
    {
      operation: "set",
      path: ["verb"],
      value: buildVerbFixture("http://adlnet.gov/expapi/verbs/voided", "voided"),
    },
    {
      operation: "set",
      path: ["object"],
      value: {
        objectType: "StatementRef",
        id: hiddenVoidedStatement.id,
      },
    },
  ]);

  const hiddenVoidedStatementCase = requestSequenceCase({
    caseId: "v2.statements.voiding.statement-id-hides-voided",
    title: "The Statements resource does not return a voided statement when queried by statementId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00163",
        section: "Communication 2.1.4.s1.b1",
        title: "Voided Statements are only returned for voidedStatementId lookups",
      },
    ],
    tags: ["v2.0.0", "statements", "voiding", "query"],
    capabilityFlags: ["transport", "query", "retrieval", "voiding"],
    legacyTraceSuiteFile: statementLifecycleLegacySuiteFile,
    notes: ["proof-slice hidden voided statement lookup"],
    steps: [
      {
        request: buildStatementPostRequest(hiddenVoidedStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementPostRequest(hidingVoidingStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementGetRequest(hiddenVoidedStatement.id),
        assertion: {
          status: 404,
        },
      },
    ],
  });

  const batchSuccessStatementOne = buildProofStatement(220, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/batch-success-one",
    },
  ]);
  const batchSuccessStatementTwo = buildProofStatement(221, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/batch-success-two",
    },
  ]);

  const batchSuccessCase = singleRequestCase({
    caseId: "v2.statements.transport.post-batch-success",
    title: "The Statements resource accepts a valid POST batch and returns the submitted statement ids",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00146",
        section: "Communication 2.1.2.s1",
        title: "Successful Statement POST returns all submitted statement ids",
      },
    ],
    tags: ["v2.0.0", "statements", "transport", "batch"],
    capabilityFlags: ["transport", "batch"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    request: buildStatementBatchPostRequest([batchSuccessStatementOne, batchSuccessStatementTwo]),
    assertion: {
      status: 200,
      jsonPathEquals: [
        {
          path: [],
          equals: [batchSuccessStatementOne.id, batchSuccessStatementTwo.id],
        },
      ],
    },
    notes: ["proof-slice statement batch success"],
  });

  const duplicateBatchStatement = buildProofStatement(222, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/batch-duplicate-original",
    },
  ]);
  const duplicateBatchConflictingStatement = buildProofStatement(223, [
    {
      operation: "set",
      path: ["id"],
      value: duplicateBatchStatement.id,
    },
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/batch-duplicate-conflict",
    },
  ]);

  const duplicateBatchCase = singleRequestCase({
    caseId: "v2.statements.transport.post-batch-rejects-duplicate-ids",
    title: "The Statements resource rejects a POST batch that contains duplicate statement ids",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00326",
        section: "Communication 3.2.s3.b9",
        title: "Rejected Statement batches return 400 Bad Request",
      },
    ],
    tags: ["v2.0.0", "statements", "transport", "batch", "validation"],
    capabilityFlags: ["transport", "batch", "validation"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    request: buildStatementBatchPostRequest([duplicateBatchStatement, duplicateBatchConflictingStatement]),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice statement batch duplicate-id rejection"],
  });

  const rollbackBatchValidStatement = buildProofStatement(224, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/batch-rollback-valid",
    },
  ]);
  const rollbackBatchInvalidStatement = buildProofStatement(225, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "not-a-valid-iri",
    },
  ]);

  const batchRollbackCase = requestSequenceCase({
    caseId: "v2.statements.transport.post-batch-atomic-rollback",
    title: "The Statements resource does not persist any statements from a rejected POST batch",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00326",
        section: "Communication 3.2.s3.b9",
        title: "Rejected Statement batches do not partially persist",
      },
    ],
    tags: ["v2.0.0", "statements", "transport", "batch", "rollback"],
    capabilityFlags: ["transport", "batch", "validation"],
    legacyTraceSuiteFile: errorCodesLegacySuiteFile,
    notes: ["proof-slice statement batch rollback"],
    steps: [
      {
        request: buildStatementBatchPostRequest([rollbackBatchValidStatement, rollbackBatchInvalidStatement]),
        assertion: {
          status: 400,
        },
      },
      {
        request: buildStatementGetRequest(rollbackBatchValidStatement.id),
        assertion: {
          status: 404,
        },
      },
    ],
  });

  const exactFormatStatement = buildFormatProofStatement(226, "mailto:format-exact@example.test");
  const canonicalFormatStatement = buildFormatProofStatement(227, "mailto:format-canonical@example.test");
  const idsFormatStatement = buildFormatProofStatement(228, "mailto:format-ids@example.test");

  const exactFormatCase = requestSequenceCase({
    caseId: "v2.statements.representation.format-exact",
    title: "The Statements resource returns exact statement representations when format is exact",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00170",
        section: "Communication 2.1.3.s1.table1.row12",
        title: "GET with format exact returns statement content exactly as submitted",
      },
    ],
    tags: ["v2.0.0", "statements", "representation", "format"],
    capabilityFlags: ["query", "retrieval", "format"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice statement exact format"],
    steps: [
      {
        request: buildStatementPostRequest(exactFormatStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementCollectionRequest({
          statementId: exactFormatStatement.id,
          format: "exact",
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["actor"],
              equals: exactFormatStatement.actor,
            },
            {
              path: ["verb", "display"],
              equals: {
                "en-US": "format-proof-us",
                "en-GB": "format-proof-gb",
              },
            },
            {
              path: ["object", "definition", "name"],
              equals: {
                "en-US": "Format Proof US",
                "en-GB": "Format Proof GB",
              },
            },
          ],
        },
      },
    ],
  });

  const canonicalFormatCase = requestSequenceCase({
    caseId: "v2.statements.representation.format-canonical-accept-language",
    title: "The Statements resource applies Accept-Language when format is canonical",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00169",
        section: "Communication 2.1.3.s1.table1.row12",
        title: "GET with format canonical returns canonicalized statement values",
      },
      {
        id: "XAPI-00172",
        section: "Communication 2.1.3.s1.table1.row11",
        title: "GET with format canonical applies Accept-Language",
      },
    ],
    tags: ["v2.0.0", "statements", "representation", "format", "canonical"],
    capabilityFlags: ["query", "retrieval", "format"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice statement canonical format"],
    steps: [
      {
        request: buildStatementPostRequest(canonicalFormatStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementCollectionRequest(
          {
            statementId: canonicalFormatStatement.id,
            format: "canonical",
          },
          {
            "Accept-Language": "en-GB",
          },
        ),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["verb", "display"],
              equals: {
                "en-GB": "format-proof-gb",
              },
            },
            {
              path: ["object", "definition", "name"],
              equals: {
                "en-GB": "Format Proof GB",
              },
            },
            {
              path: ["object", "definition", "description"],
              equals: {
                "en-GB": "Format description GB",
              },
            },
          ],
        },
      },
    ],
  });

  const idsFormatCase = requestSequenceCase({
    caseId: "v2.statements.representation.format-ids",
    title: "The Statements resource returns identifier-only statement representations when format is ids",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00171",
        section: "Communication 2.1.3.s1.table1.row12",
        title: "GET with format ids returns only identifying statement data",
      },
    ],
    tags: ["v2.0.0", "statements", "representation", "format", "ids"],
    capabilityFlags: ["query", "retrieval", "format"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice statement ids format"],
    steps: [
      {
        request: buildStatementPostRequest(idsFormatStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementCollectionRequest({
          statementId: idsFormatStatement.id,
          format: "ids",
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["actor"],
              equals: {
                objectType: "Agent",
                mbox: "mailto:format-ids@example.test",
              },
            },
            {
              path: ["verb"],
              equals: {
                id: "https://example.test/xapi/verbs/format-proof",
              },
            },
            {
              path: ["object"],
              equals: {
                id: "https://example.test/xapi/activities/format-proof",
              },
            },
          ],
        },
      },
    ],
  });

  const multipartAttachment: MultipartStatementAttachment = {
    contentType: "text/plain",
    sha2: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    body: "here is a proof attachment",
  };
  const multipartAttachmentStatement = buildProofStatement(229, [
    {
      operation: "set",
      path: ["attachments"],
      value: [buildMultipartAttachmentMetadata(multipartAttachment)],
    },
  ]);
  const multipartFallbackStatement = buildProofStatement(230, [
    {
      operation: "set",
      path: ["attachments"],
      value: [buildMultipartAttachmentMetadata(multipartAttachment)],
    },
  ]);

  const attachmentsMultipartCase = requestSequenceCase({
    caseId: "v2.statements.representation.attachments-multipart",
    title: "The Statements resource returns multipart attachment data when attachments is true",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00167",
        section: "Communication 2.1.3.s1.table1.row13",
        title: "GET with attachments true returns multipart attachment data",
      },
    ],
    tags: ["v2.0.0", "statements", "representation", "attachments"],
    capabilityFlags: ["query", "retrieval", "attachments"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice statement multipart attachments"],
    steps: [
      {
        request: buildMultipartStatementPostRequest(multipartAttachmentStatement, [multipartAttachment]),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["id"],
              equals: multipartAttachmentStatement.id,
            },
          ],
        },
      },
      {
        request: buildStatementCollectionRequest({
          statementId: multipartAttachmentStatement.id,
          attachments: "true",
        }),
        assertion: {
          status: 200,
          expectedHeaders: [
            {
              key: "content-type",
              equals: multipartStatementResponseContentType,
            },
          ],
          textContains: [multipartAttachmentStatement.id, multipartAttachment.sha2, multipartAttachment.body],
        },
      },
    ],
  });

  const attachmentsJsonFallbackCase = requestSequenceCase({
    caseId: "v2.statements.representation.attachments-json-fallback",
    title: "The Statements resource falls back to application/json when attachments is absent or false",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00161",
        section: "Communication 2.1.3.s1.b1",
        title: "GET without attachments data returns application/json",
      },
    ],
    tags: ["v2.0.0", "statements", "representation", "attachments"],
    capabilityFlags: ["query", "retrieval", "attachments"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice statement attachment json fallback"],
    steps: [
      {
        request: buildMultipartStatementPostRequest(multipartFallbackStatement, [multipartAttachment]),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["id"],
              equals: multipartFallbackStatement.id,
            },
          ],
        },
      },
      {
        request: buildStatementGetRequest(multipartFallbackStatement.id),
        assertion: {
          status: 200,
          expectedHeaders: [
            {
              key: "content-type",
              equals: "application/json",
            },
          ],
          jsonPathEquals: [
            {
              path: ["id"],
              equals: multipartFallbackStatement.id,
            },
          ],
        },
      },
      {
        request: buildStatementCollectionRequest({
          statementId: multipartFallbackStatement.id,
          attachments: "false",
        }),
        assertion: {
          status: 200,
          expectedHeaders: [
            {
              key: "content-type",
              equals: "application/json",
            },
          ],
          jsonPathEquals: [
            {
              path: ["id"],
              equals: multipartFallbackStatement.id,
            },
          ],
        },
      },
    ],
  });

  const lastModifiedStatement = buildProofStatement(231, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/header-last-modified",
    },
  ]);

  const lastModifiedCase = requestSequenceCase({
    caseId: "v2.statements.headers.last-modified-matches-stored",
    title: "The Statements resource returns Last-Modified that matches the stored timestamp",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-01002",
        section: "Communication 2.1.1",
        title: "Statement GET Last-Modified matches the stored timestamp",
      },
    ],
    tags: ["v2.0.0", "statements", "headers"],
    capabilityFlags: ["query", "retrieval", "headers"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice statement last-modified header"],
    steps: [
      {
        request: buildStatementPostRequest(lastModifiedStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementGetRequest(lastModifiedStatement.id),
        assertion: {
          status: 200,
          expectedHeaders: [
            {
              key: "last-modified",
              equals: buildProofStoredTimestamp(231),
            },
          ],
          jsonPathEquals: [
            {
              path: ["stored"],
              equals: buildProofStoredTimestamp(231),
            },
          ],
        },
      },
    ],
  });

  const consistentThroughSuccessCase = singleRequestCase({
    caseId: "v2.statements.headers.consistent-through-success",
    title: "The Statements resource returns X-Experience-API-Consistent-Through on successful GET responses",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00153",
        section: "Communication 2.1.3.s2.b5",
        title: "GET returns X-Experience-API-Consistent-Through regardless of successful code",
      },
      {
        id: "XAPI-00160",
        section: "Communication 2.1.3.s2.b5",
        title: "X-Experience-API-Consistent-Through is an ISO 8601 timestamp",
      },
    ],
    tags: ["v2.0.0", "statements", "headers"],
    capabilityFlags: ["headers", "query"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    request: buildStatementCollectionRequest({
      verb: "https://example.test/xapi/verbs/non-existent-consistent-through",
    }),
    assertion: {
      status: 200,
      expectedHeaderPatterns: [
        {
          key: "x-experience-api-consistent-through",
          pattern: isoTimestampHeaderPattern,
        },
      ],
    },
    notes: ["proof-slice statement consistent-through success header"],
  });

  const consistentThroughErrorCase = singleRequestCase({
    caseId: "v2.statements.headers.consistent-through-error",
    title: "The Statements resource returns X-Experience-API-Consistent-Through on invalid GET responses",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00153",
        section: "Communication 2.1.3.s2.b5",
        title: "GET returns X-Experience-API-Consistent-Through regardless of returned code",
      },
    ],
    tags: ["v2.0.0", "statements", "headers", "validation"],
    capabilityFlags: ["headers", "query", "validation"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    request: buildStatementCollectionRequest({
      LIMIT: "1",
    }),
    assertion: {
      status: 400,
      expectedHeaderPatterns: [
        {
          key: "x-experience-api-consistent-through",
          pattern: isoTimestampHeaderPattern,
        },
      ],
    },
    notes: ["proof-slice statement consistent-through error header"],
  });

  const emptyResultCase = singleRequestCase({
    caseId: "v2.statements.query.empty-result",
    title: "The Statements resource returns 200 with an empty StatementResult when a collection query matches nothing",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00149",
        section: "Communication 2.1.3.s2.b4",
        title: "GET returns an empty StatementResult instead of rejecting the request",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "retrieval"],
    capabilityFlags: ["query", "retrieval"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    request: buildStatementCollectionRequest({
      verb: "https://example.test/xapi/verbs/non-existent-proof-query",
    }),
    assertion: {
      status: 200,
      jsonPathEquals: [
        {
          path: ["statements"],
          equals: [],
        },
      ],
    },
    notes: ["proof-slice empty statement query result"],
  });

  const exactAgentStatement = buildProofStatement(21, [
    {
      operation: "set",
      path: ["actor"],
      value: buildAgentWithMbox("mailto:query-agent-match@example.test"),
    },
  ]);
  const exactAgentNoiseStatement = buildProofStatement(22, [
    {
      operation: "set",
      path: ["actor"],
      value: buildAgentWithMbox("mailto:query-agent-noise@example.test"),
    },
  ]);

  const agentQueryCase = buildStatementCollectionQueryCase({
    caseId: "v2.statements.query.agent",
    title: "The Statements resource returns exact actor matches for an agent query",
    requirementRefs: [
      {
        id: "XAPI-00181",
        section: "Communication 2.1.3.s1.table1.row3",
        title: "GET with agent returns exact agent matches",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "agent"],
    setupStatements: [exactAgentStatement, exactAgentNoiseStatement],
    query: {
      agent: buildAgentQuery("mailto:query-agent-match@example.test"),
    },
    expectedStatementIds: [exactAgentStatement.id],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
  });

  const exactVerbStatement = buildProofStatement(23, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/query-verb-match",
    },
  ]);
  const exactVerbNoiseStatement = buildProofStatement(24, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/query-verb-noise",
    },
  ]);

  const verbQueryCase = buildStatementCollectionQueryCase({
    caseId: "v2.statements.query.verb",
    title: "The Statements resource returns exact verb matches for a verb query",
    requirementRefs: [
      {
        id: "XAPI-00180",
        section: "Communication 2.1.3.s1.table1.row4",
        title: "GET with verb returns exact verb matches",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "verb"],
    setupStatements: [exactVerbStatement, exactVerbNoiseStatement],
    query: {
      verb: "https://example.test/xapi/verbs/query-verb-match",
    },
    expectedStatementIds: [exactVerbStatement.id],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
  });

  const exactActivityStatement = buildProofStatement(25, [
    {
      operation: "set",
      path: ["object"],
      value: buildActivityObjectFixture("https://example.test/xapi/activities/query-activity-match"),
    },
  ]);
  const exactActivityNoiseStatement = buildProofStatement(26, [
    {
      operation: "set",
      path: ["object"],
      value: buildActivityObjectFixture("https://example.test/xapi/activities/query-activity-noise"),
    },
  ]);

  const activityQueryCase = buildStatementCollectionQueryCase({
    caseId: "v2.statements.query.activity",
    title: "The Statements resource returns exact activity matches for an activity query",
    requirementRefs: [
      {
        id: "XAPI-00179",
        section: "Communication 2.1.3.s1.table1.row5",
        title: "GET with activity returns exact activity matches",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "activity"],
    setupStatements: [exactActivityStatement, exactActivityNoiseStatement],
    query: {
      activity: "https://example.test/xapi/activities/query-activity-match",
    },
    expectedStatementIds: [exactActivityStatement.id],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
  });

  const exactRegistrationId = buildProofUuid(901);
  const exactRegistrationNoiseId = buildProofUuid(902);
  const exactRegistrationStatement = buildProofStatement(27, [
    {
      operation: "set",
      path: ["context", "registration"],
      value: exactRegistrationId,
    },
  ]);
  const exactRegistrationNoiseStatement = buildProofStatement(28, [
    {
      operation: "set",
      path: ["context", "registration"],
      value: exactRegistrationNoiseId,
    },
  ]);

  const registrationQueryCase = buildStatementCollectionQueryCase({
    caseId: "v2.statements.query.registration",
    title: "The Statements resource returns exact registration matches for a registration query",
    requirementRefs: [
      {
        id: "XAPI-00178",
        section: "Communication 2.1.3.s1.table1.row6",
        title: "GET with registration returns exact registration matches",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "registration"],
    setupStatements: [exactRegistrationStatement, exactRegistrationNoiseStatement],
    query: {
      registration: exactRegistrationId,
    },
    expectedStatementIds: [exactRegistrationStatement.id],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
  });

  const relatedActivityId = "https://example.test/xapi/activities/query-related-activity";
  const relatedActivityNoiseId = "https://example.test/xapi/activities/query-related-activity-noise";
  const relatedActivityStatement = buildProofStatement(29, [
    {
      operation: "set",
      path: ["context", "contextActivities", "category"],
      value: [buildActivityObjectFixture(relatedActivityId)],
    },
  ]);
  const relatedActivityNoiseStatement = buildProofStatement(30, [
    {
      operation: "set",
      path: ["context", "contextActivities", "category"],
      value: [buildActivityObjectFixture(relatedActivityNoiseId)],
    },
  ]);

  const relatedActivitiesQueryCase = buildStatementCollectionQueryCase({
    caseId: "v2.statements.query.related-activities",
    title: "The Statements resource returns related activity matches from nested Activity objects",
    requirementRefs: [
      {
        id: "XAPI-00177",
        section: "Communication 2.1.3.s1.table1.row7",
        title: "GET with related_activities returns nested activity matches",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "related-activities"],
    setupStatements: [relatedActivityStatement, relatedActivityNoiseStatement],
    query: {
      activity: relatedActivityId,
      related_activities: "true",
    },
    expectedStatementIds: [relatedActivityStatement.id],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
  });

  const relatedAgentMbox = "mailto:query-related-agent@example.test";
  const relatedAgentNoiseMbox = "mailto:query-related-agent-noise@example.test";
  const relatedAgentStatement = buildProofStatement(31, [
    {
      operation: "set",
      path: ["context", "instructor"],
      value: buildAgentWithMbox(relatedAgentMbox),
    },
  ]);
  const relatedAgentNoiseStatement = buildProofStatement(32, [
    {
      operation: "set",
      path: ["context", "instructor"],
      value: buildAgentWithMbox(relatedAgentNoiseMbox),
    },
  ]);

  const relatedAgentsQueryCase = buildStatementCollectionQueryCase({
    caseId: "v2.statements.query.related-agents",
    title: "The Statements resource returns related agent matches from nested actor-like values",
    requirementRefs: [
      {
        id: "XAPI-00176",
        section: "Communication 2.1.3.s1.table1.row8",
        title: "GET with related_agents returns nested agent matches",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "related-agents"],
    setupStatements: [relatedAgentStatement, relatedAgentNoiseStatement],
    query: {
      agent: buildAgentQuery(relatedAgentMbox),
      related_agents: "true",
    },
    expectedStatementIds: [relatedAgentStatement.id],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
  });

  const sinceVerbId = "https://example.test/xapi/verbs/query-since";
  const sinceOlderStatement = buildProofStatement(33, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: sinceVerbId,
    },
  ]);
  const sinceNewerStatement = buildProofStatement(34, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: sinceVerbId,
    },
  ]);

  const sinceQueryCase = buildStatementCollectionQueryCase({
    caseId: "v2.statements.query.since",
    title: "The Statements resource filters collection results to statements stored after the since value",
    requirementRefs: [
      {
        id: "XAPI-00175",
        section: "Communication 2.1.3.s1.table1.row9",
        title: "GET with since returns statements stored after the provided timestamp",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "since"],
    setupStatements: [sinceOlderStatement, sinceNewerStatement],
    query: {
      verb: sinceVerbId,
      since: buildProofTimestamp(33),
    },
    expectedStatementIds: [sinceNewerStatement.id],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
  });

  const untilVerbId = "https://example.test/xapi/verbs/query-until";
  const untilOlderStatement = buildProofStatement(35, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: untilVerbId,
    },
  ]);
  const untilNewerStatement = buildProofStatement(36, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: untilVerbId,
    },
  ]);

  const untilQueryCase = buildStatementCollectionQueryCase({
    caseId: "v2.statements.query.until",
    title: "The Statements resource filters collection results to statements stored at or before the until value",
    requirementRefs: [
      {
        id: "XAPI-00174",
        section: "Communication 2.1.3.s1.table1.row10",
        title: "GET with until returns statements stored at or before the provided timestamp",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "until"],
    setupStatements: [untilOlderStatement, untilNewerStatement],
    query: {
      verb: untilVerbId,
      until: buildProofTimestamp(35),
    },
    expectedStatementIds: [untilOlderStatement.id],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
  });

  const limitVerbId = "https://example.test/xapi/verbs/query-limit";
  const limitOlderStatement = buildProofStatement(37, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: limitVerbId,
    },
  ]);
  const limitNewerStatement = buildProofStatement(38, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: limitVerbId,
    },
  ]);

  const limitQueryCase = buildStatementCollectionQueryCase({
    caseId: "v2.statements.query.limit",
    title: "The Statements resource limits collection results to the requested maximum number of statements",
    requirementRefs: [
      {
        id: "XAPI-00173",
        section: "Communication 2.1.3.s1.table1.row11",
        title: "GET with limit returns no more than the requested number of statements",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "limit"],
    setupStatements: [limitOlderStatement, limitNewerStatement],
    query: {
      verb: limitVerbId,
      limit: "1",
    },
    expectedStatementIds: [limitNewerStatement.id],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
  });

  const ascendingVerbId = "https://example.test/xapi/verbs/query-ascending";
  const ascendingOlderStatement = buildProofStatement(39, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: ascendingVerbId,
    },
  ]);
  const ascendingNewerStatement = buildProofStatement(40, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: ascendingVerbId,
    },
  ]);

  const ascendingQueryCase = buildStatementCollectionQueryCase({
    caseId: "v2.statements.query.ascending",
    title: "The Statements resource orders collection results by stored time when ascending is true",
    requirementRefs: [
      {
        id: "XAPI-00166",
        section: "Communication 2.1.3.s1.table1.row14",
        title: "GET with ascending returns results in ascending stored order",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "ascending"],
    setupStatements: [ascendingOlderStatement, ascendingNewerStatement],
    query: {
      verb: ascendingVerbId,
      ascending: "true",
    },
    expectedStatementIds: [ascendingOlderStatement.id, ascendingNewerStatement.id],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
  });

  const statementIdExclusivityCases = buildStatementQueryExclusivityCases({
    familyId: "v2.statements.query.exclusive.statement-id",
    baseQueryKey: "statementId",
    baseQueryValue: buildProofUuid(950),
    requirementRef: {
      id: "XAPI-00151",
      section: "Communication 2.1.3.s2.b2",
      title: "GET rejects statementId combined with collection query parameters",
    },
  });

  const voidedStatementIdExclusivityCases = buildStatementQueryExclusivityCases({
    familyId: "v2.statements.query.exclusive.voided-statement-id",
    baseQueryKey: "voidedStatementId",
    baseQueryValue: buildProofUuid(951),
    requirementRef: {
      id: "XAPI-00150",
      section: "Communication 2.1.3.s2.b2",
      title: "GET rejects voidedStatementId combined with collection query parameters",
    },
  });

  const queryValidationCases = statementQueryValidationFamily({
    familyId: "v2.statements.query-validation",
    suiteTitle: "Statement Query Validation",
    specVersion,
    tags: ["v2.0.0", "statements", "query", "validation"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    variants: [
      {
        idSuffix: "invalid-statement-id",
        title: "The Statements resource rejects an invalid statementId query value",
        query: {
          statementId: "wrong",
        },
        requirementRefs: [
          {
            id: "XAPI-00012",
            section: "Data 2.2.s4.b4",
            title: "Statement query parameters follow statement value validation rules",
          },
        ],
      },
      {
        idSuffix: "invalid-voided-statement-id",
        title: "The Statements resource rejects an invalid voidedStatementId query value",
        query: {
          voidedStatementId: "wrong",
        },
        requirementRefs: [
          {
            id: "XAPI-00012",
            section: "Data 2.2.s4.b4",
            title: "Statement query parameters follow statement value validation rules",
          },
        ],
      },
      {
        idSuffix: "invalid-agent",
        title: "The Statements resource rejects an invalid agent query value",
        query: {
          agent: "wrong",
        },
        requirementRefs: [
          {
            id: "XAPI-00012",
            section: "Data 2.2.s4.b4",
            title: "Statement query parameters follow statement value validation rules",
          },
        ],
      },
      {
        idSuffix: "invalid-verb",
        title: "The Statements resource rejects an invalid verb query value",
        query: {
          verb: "not.a.valid.iri.com/verb",
        },
        requirementRefs: [
          {
            id: "XAPI-00012",
            section: "Data 2.2.s4.b4",
            title: "Statement query parameters follow statement value validation rules",
          },
        ],
      },
      {
        idSuffix: "invalid-activity",
        title: "The Statements resource rejects an invalid activity query value",
        query: {
          activity: "not.a.valid.iri.com/activity",
        },
        requirementRefs: [
          {
            id: "XAPI-00012",
            section: "Data 2.2.s4.b4",
            title: "Statement query parameters follow statement value validation rules",
          },
        ],
      },
      {
        idSuffix: "invalid-registration",
        title: "The Statements resource rejects an invalid registration query value",
        query: {
          registration: "wrong",
        },
        requirementRefs: [
          {
            id: "XAPI-00012",
            section: "Data 2.2.s4.b4",
            title: "Statement query parameters follow statement value validation rules",
          },
        ],
      },
    ],
  });

  const queryCase = queryRetrievalFamily({
    caseId: "v2.statements.query.statement-id-roundtrip",
    title: "The Statements resource returns a submitted statement when queried by statementId",
    specVersion,
    queryParam: "statementId",
    requirementRefs: [
      {
        id: "XAPI-01001",
        section: "Communication 4.1.6.1",
        title: "Statements can be queried by statementId",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "retrieval"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    transforms: [
      {
        operation: "set",
        path: ["id"],
        value: buildProofUuid(208),
      },
    ],
  });

  const resultSuccessRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00074",
      section: "Data 2.4.5.s2.table1.row1",
      title: "Result success values are Booleans",
    },
  ];
  const resultCompletionRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00075",
      section: "Data 2.4.5.s2.table1.row2",
      title: "Result completion values are Booleans",
    },
  ];
  const resultResponseRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00076",
      section: "Data 2.4.5.s2.table1.row3",
      title: "Result response values are Strings",
    },
  ];
  const resultDurationRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00077",
      section: "Data 2.4.5.s2.table1.row4",
      title: "Result duration values are ISO 8601 durations",
    },
  ];
  const resultExtensionsRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00078",
      section: "Data 2.4.5.s2.table1.row6",
      title: "Result extensions values are Objects",
    },
  ];
  const scoreObjectRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00079",
      section: "Data 2.4.5.1",
      title: "Result score values are Objects",
    },
  ];
  const scoreMaxRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00080",
      section: "Data 2.4.5.1.s2.table1.row4",
      title: "Result score max values are greater than min when min is present",
    },
  ];
  const scoreMinRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00081",
      section: "Data 2.4.5.1.s2.table1.row3",
      title: "Result score min values are less than max when max is present",
    },
  ];
  const scoreRawRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00082",
      section: "Data 2.4.5.1.s2.table1.row2",
      title: "Result score raw values stay within min and max when present",
    },
  ];
  const scoreScaledRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00083",
      section: "Data 2.4.5.1.s2.table1.row1",
      title: "Result score scaled values are between -1 and 1 inclusive",
    },
  ];
  const objectTypeVocabularyRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00046",
      section: "Data 2.4.4.s2",
      title: "Object objectType values are Activity, Agent, Group, SubStatement, or StatementRef",
    },
  ];
  const activityIdRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00047",
      section: "Data 2.4.4.1.s1.table1.row2",
      title: "Activity objects require id and the id must be an IRI",
    },
  ];
  const activityDefinitionRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00048",
      section: "Data 2.4.4.1.s1.table1.row3",
      title: "Activity definition values are Objects",
    },
  ];
  const activityObjectTypeGenerationRequirementRefs: RequirementRef[] = [
    {
      id: "DATA-2.4.4.s2.activity-objecttype-generation",
      section: "Data 2.4.4.s2",
      title: "LRSs generate an Activity objectType for statement objects when it is omitted",
    },
  ];
  const activityDefinitionNameRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00056",
      section: "Data 2.4.4.1.s2.table1.row1",
      title: "Activity definition name values are Language Maps",
    },
  ];
  const activityDefinitionDescriptionRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00059",
      section: "Data 2.4.4.1.s2.table1.row2",
      title: "Activity definition description values are Language Maps",
    },
  ];
  const activityDefinitionExtensionsRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00057",
      section: "Data 2.4.4.1.s2.table1.row5",
      title: "Activity definition extensions values are Objects with IRI keys",
    },
  ];
  const activityInteractionTypeValueRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00049",
      section: "Data 2.4.4.1.s8.table1.row1",
      title:
        "Activity definition interactionType values are one of true-false, choice, fill-in, long-fill-in, matching, performance, sequencing, likert, numeric, or other",
    },
  ];
  const activityCorrectResponsesPatternRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00050",
      section: "Data 2.4.4.1.s8.table1.row2",
      title: "Activity definition correctResponsesPattern values are arrays of strings",
    },
  ];
  const activityInteractionComponentRequirementRefsByField: Record<InteractionComponentField, RequirementRef[]> = {
    choices: [
      {
        id: "XAPI-00051",
        section: "Data 2.4.4.1.s8.table1.row3",
        title: "Activity definition choices values are arrays of Interaction Components",
      },
    ],
    scale: [
      {
        id: "XAPI-00052",
        section: "Data 2.4.4.1.s8.table1.row3",
        title: "Activity definition scale values are arrays of Interaction Components",
      },
    ],
    source: [
      {
        id: "XAPI-00053",
        section: "Data 2.4.4.1.s8.table1.row3",
        title: "Activity definition source values are arrays of Interaction Components",
      },
    ],
    target: [
      {
        id: "XAPI-00054",
        section: "Data 2.4.4.1.s8.table1.row3",
        title: "Activity definition target values are arrays of Interaction Components",
      },
    ],
    steps: [
      {
        id: "XAPI-00055",
        section: "Data 2.4.4.1.s8.table1.row3",
        title: "Activity definition steps values are arrays of Interaction Components",
      },
    ],
  };
  const interactionComponentObjectRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00058",
      section: "Data 2.4.4.1.s14",
      title: "Interaction Components are Objects",
    },
  ];
  const interactionComponentIdRequirementRefs: RequirementRef[] = [
    {
      id: "DATA-2.4.4.1.s15.table1.row1",
      section: "Data 2.4.4.1.s15.table1.row1",
      title: "Interaction Components include string ids",
    },
  ];
  const interactionComponentDescriptionRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00062",
      section: "Data 2.4.4.1.s15.table1.row2",
      title: "Interaction Component descriptions are Language Maps",
    },
  ];
  const interactionComponentUniqueIdRequirementRefs: RequirementRef[] = [
    {
      id: "DATA-2.4.4.1.s16.b1",
      section: "Data 2.4.4.1.s16.b1",
      title: "Interaction Component ids are unique within their arrays",
    },
  ];
  const activityInteractionTypeRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00064",
      section: "Data 2.4.4.1.s8",
      title:
        "Activity definitions require interactionType when correctResponsesPattern or interaction component arrays are used",
    },
  ];
  const objectActorTypeRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00065",
      section: "Data 2.4.4.2.s1.b1",
      title: "Agent and Group statement objects require objectType",
    },
  ];
  const statementRefRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00072",
      section: "Data 2.4.4.3.s4.table1.row2",
      title: "StatementRef id values are UUIDs",
    },
    {
      id: "XAPI-00073",
      section: "Data 2.4.4.3.s4.b1",
      title: "StatementRef objectType values are StatementRef",
    },
  ];
  const subStatementObjectTypeRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-01002",
      section: "Data 2.4.4.3.s8.b1",
      title: "SubStatement objectType values are SubStatement",
    },
  ];
  const subStatementRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00066",
      section: "Data 2.4.4.3.s8.b2",
      title: "SubStatements follow Statement requirements",
    },
  ];

  const resultSuccessTypeCases = statementMutationFamily({
    familyId: "v2.statements.result.success-type",
    suiteTitle: "Statement Result",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "validation", "success"],
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: resultsLegacyConfigFile,
    variants: resultPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-true-string`,
        title: `A Statement rejects ${placement.title} when success is the string true`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            success: "true",
          }),
        ),
        requirementRefs: resultSuccessRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-false-string`,
        title: `A Statement rejects ${placement.title} when success is the string false`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            success: "false",
          }),
        ),
        requirementRefs: resultSuccessRequirementRefs,
      },
    ]),
  });

  const resultCompletionTypeCases = statementMutationFamily({
    familyId: "v2.statements.result.completion-type",
    suiteTitle: "Statement Result",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "validation", "completion"],
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: resultsLegacyConfigFile,
    variants: resultPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-true-string`,
        title: `A Statement rejects ${placement.title} when completion is the string true`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            completion: "true",
          }),
        ),
        requirementRefs: resultCompletionRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-false-string`,
        title: `A Statement rejects ${placement.title} when completion is the string false`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            completion: "false",
          }),
        ),
        requirementRefs: resultCompletionRequirementRefs,
      },
    ]),
  });

  const resultResponseTypeCases = statementMutationFamily({
    familyId: "v2.statements.result.response-type",
    suiteTitle: "Statement Result",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "validation", "response"],
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: resultsLegacyConfigFile,
    variants: resultPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-numeric`,
        title: `A Statement rejects ${placement.title} when response is numeric`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            response: 12345,
          }),
        ),
        requirementRefs: resultResponseRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-object`,
        title: `A Statement rejects ${placement.title} when response is an object`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            response: {
              invalid: true,
            },
          }),
        ),
        requirementRefs: resultResponseRequirementRefs,
      },
    ]),
  });

  const resultDurationInvalidCases = statementMutationFamily({
    familyId: "v2.statements.result.duration-invalid",
    suiteTitle: "Statement Result",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "validation", "duration"],
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: resultsLegacyConfigFile,
    variants: resultPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement rejects ${placement.title} when duration is not a valid ISO 8601 duration`,
      transforms: placement.buildTransforms(
        buildResultFixture({
          duration: "PA1H0M0S",
        }),
      ),
      requirementRefs: resultDurationRequirementRefs,
    })),
  });

  const validDurationVariants = [
    {
      idSuffix: "hours-minutes-seconds",
      label: "PT1H0M0.1S",
      value: "PT1H0M0.1S",
    },
    {
      idSuffix: "time-only",
      label: "PT4H35M59.14S",
      value: "PT4H35M59.14S",
    },
    {
      idSuffix: "seconds-only",
      label: "PT16559.14S",
      value: "PT16559.14S",
    },
    {
      idSuffix: "date-time",
      label: "P3Y1M29DT4H35M59.14S",
      value: "P3Y1M29DT4H35M59.14S",
    },
    {
      idSuffix: "weeks",
      label: "P4W",
      value: "P4W",
    },
  ] as const;

  const resultDurationAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.result.duration-valid",
    suiteTitle: "Statement Result",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "duration"],
    expectedStatus: 200,
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: resultsLegacyConfigFile,
    variants: resultPlacements.flatMap((placement) =>
      validDurationVariants.map((variant) => ({
        idSuffix: `${placement.idSuffix}-${variant.idSuffix}`,
        title: `A Statement accepts ${placement.title} when duration is ${variant.label}`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            duration: variant.value,
          }),
        ),
        requirementRefs: resultDurationRequirementRefs,
      })),
    ),
  });

  const resultExtensionsTypeCases = statementMutationFamily({
    familyId: "v2.statements.result.extensions-type",
    suiteTitle: "Statement Result",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "validation", "extensions"],
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: resultsLegacyConfigFile,
    variants: resultPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-numeric`,
        title: `A Statement rejects ${placement.title} when extensions is numeric`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            extensions: 12345,
          }),
        ),
        requirementRefs: resultExtensionsRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-string`,
        title: `A Statement rejects ${placement.title} when extensions is a string`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            extensions: "should fail",
          }),
        ),
        requirementRefs: resultExtensionsRequirementRefs,
      },
    ]),
  });

  const scoreObjectTypeCases = statementMutationFamily({
    familyId: "v2.statements.score.type",
    suiteTitle: "Statement Score",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "score", "validation"],
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: scoresLegacyConfigFile,
    variants: resultPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-numeric`,
        title: `A Statement rejects ${placement.title} when score is numeric`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            score: 12345,
          }),
        ),
        requirementRefs: scoreObjectRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-string`,
        title: `A Statement rejects ${placement.title} when score is a string`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            score: "should fail",
          }),
        ),
        requirementRefs: scoreObjectRequirementRefs,
      },
    ]),
  });

  const scoreScaledAcceptanceVariants = [
    {
      idSuffix: "decimal",
      label: "a decimal within range",
      score: { scaled: validScoreDecimal },
    },
    {
      idSuffix: "upper-bound",
      label: "the inclusive upper bound 1.0",
      score: { scaled: 1.0 },
    },
    {
      idSuffix: "lower-bound",
      label: "the inclusive lower bound -1.0",
      score: { scaled: -1.0 },
    },
  ] as const;

  const scoreScaledAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.score.scaled-valid",
    suiteTitle: "Statement Score",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "score", "scaled"],
    expectedStatus: 200,
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: scoresLegacyConfigFile,
    variants: resultPlacements.flatMap((placement) =>
      scoreScaledAcceptanceVariants.map((variant) => ({
        idSuffix: `${placement.idSuffix}-${variant.idSuffix}`,
        title: `A Statement accepts ${placement.title} when scaled uses ${variant.label}`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            score: variant.score,
          }),
        ),
        requirementRefs: scoreScaledRequirementRefs,
      })),
    ),
  });

  const scoreScaledRejectionVariants = [
    {
      idSuffix: "above-one",
      label: "1.01",
      score: { scaled: 1.01 },
    },
    {
      idSuffix: "below-negative-one",
      label: "-1.00001",
      score: { scaled: -1.00001 },
    },
  ] as const;

  const scoreScaledRejectionCases = statementMutationFamily({
    familyId: "v2.statements.score.scaled-invalid",
    suiteTitle: "Statement Score",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "score", "scaled", "validation"],
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: scoresLegacyConfigFile,
    variants: resultPlacements.flatMap((placement) =>
      scoreScaledRejectionVariants.map((variant) => ({
        idSuffix: `${placement.idSuffix}-${variant.idSuffix}`,
        title: `A Statement rejects ${placement.title} when scaled is ${variant.label}`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            score: variant.score,
          }),
        ),
        requirementRefs: scoreScaledRequirementRefs,
      })),
    ),
  });

  const scoreRawAcceptanceVariants = [
    {
      idSuffix: "unrestricted",
      label: "raw without min or max",
      score: { raw: validScoreDecimal },
    },
    {
      idSuffix: "bounded",
      label: "raw between min and max",
      score: { raw: validScoreDecimal, min: validScoreDecimal - 1, max: validScoreDecimal + 1 },
    },
  ] as const;

  const scoreRawAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.score.raw-valid",
    suiteTitle: "Statement Score",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "score", "raw"],
    expectedStatus: 200,
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: scoresLegacyConfigFile,
    variants: resultPlacements.flatMap((placement) =>
      scoreRawAcceptanceVariants.map((variant) => ({
        idSuffix: `${placement.idSuffix}-${variant.idSuffix}`,
        title: `A Statement accepts ${placement.title} when score uses ${variant.label}`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            score: variant.score,
          }),
        ),
        requirementRefs: scoreRawRequirementRefs,
      })),
    ),
  });

  const scoreRawRejectionVariants = [
    {
      idSuffix: "above-max",
      label: "raw greater than max",
      score: { raw: validScoreDecimal, max: validScoreDecimal - 0.02 },
    },
    {
      idSuffix: "below-min",
      label: "raw less than min",
      score: { raw: validScoreDecimal, min: validScoreDecimal + 0.73 },
    },
  ] as const;

  const scoreRawRejectionCases = statementMutationFamily({
    familyId: "v2.statements.score.raw-invalid",
    suiteTitle: "Statement Score",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "score", "raw", "validation"],
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: scoresLegacyConfigFile,
    variants: resultPlacements.flatMap((placement) =>
      scoreRawRejectionVariants.map((variant) => ({
        idSuffix: `${placement.idSuffix}-${variant.idSuffix}`,
        title: `A Statement rejects ${placement.title} when score uses ${variant.label}`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            score: variant.score,
          }),
        ),
        requirementRefs: scoreRawRequirementRefs,
      })),
    ),
  });

  const scoreMinAcceptanceVariants = [
    {
      idSuffix: "unrestricted",
      label: "min without max",
      score: { min: validScoreDecimal },
    },
    {
      idSuffix: "bounded",
      label: "min below max with raw between them",
      score: { min: validScoreDecimal, max: validScoreDecimal + 1, raw: validScoreDecimal + 0.5 },
    },
  ] as const;

  const scoreMinAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.score.min-valid",
    suiteTitle: "Statement Score",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "score", "min"],
    expectedStatus: 200,
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: scoresLegacyConfigFile,
    variants: resultPlacements.flatMap((placement) =>
      scoreMinAcceptanceVariants.map((variant) => ({
        idSuffix: `${placement.idSuffix}-${variant.idSuffix}`,
        title: `A Statement accepts ${placement.title} when score uses ${variant.label}`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            score: variant.score,
          }),
        ),
        requirementRefs: scoreMinRequirementRefs,
      })),
    ),
  });

  const scoreMinRejectionCases = statementMutationFamily({
    familyId: "v2.statements.score.min-invalid",
    suiteTitle: "Statement Score",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "score", "min", "validation"],
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: scoresLegacyConfigFile,
    variants: resultPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement rejects ${placement.title} when min is greater than max`,
      transforms: placement.buildTransforms(
        buildResultFixture({
          score: {
            min: validScoreDecimal,
            max: validScoreDecimal - 0.0000321,
            raw: validScoreDecimal - 0.0000033,
          },
        }),
      ),
      requirementRefs: scoreMinRequirementRefs,
    })),
  });

  const scoreMaxAcceptanceVariants = [
    {
      idSuffix: "unrestricted",
      label: "max without min",
      score: { max: validScoreMaxDecimal },
    },
    {
      idSuffix: "bounded",
      label: "max above min with raw between them",
      score: { max: validScoreMaxDecimal, min: validScoreMaxDecimal - 4, raw: validScoreMaxDecimal - 1 },
    },
  ] as const;

  const scoreMaxAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.score.max-valid",
    suiteTitle: "Statement Score",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "score", "max"],
    expectedStatus: 200,
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: scoresLegacyConfigFile,
    variants: resultPlacements.flatMap((placement) =>
      scoreMaxAcceptanceVariants.map((variant) => ({
        idSuffix: `${placement.idSuffix}-${variant.idSuffix}`,
        title: `A Statement accepts ${placement.title} when score uses ${variant.label}`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            score: variant.score,
          }),
        ),
        requirementRefs: scoreMaxRequirementRefs,
      })),
    ),
  });

  const scoreMaxRejectionCases = statementMutationFamily({
    familyId: "v2.statements.score.max-invalid",
    suiteTitle: "Statement Score",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "score", "max", "validation"],
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: scoresLegacyConfigFile,
    variants: resultPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement rejects ${placement.title} when max is less than min`,
      transforms: placement.buildTransforms(
        buildResultFixture({
          score: {
            max: validScoreMaxDecimal,
            raw: validScoreMaxDecimal + 1,
            min: validScoreMaxDecimal + 4,
          },
        }),
      ),
      requirementRefs: scoreMaxRequirementRefs,
    })),
  });

  const objectTypeVocabularyCases = statementMutationFamily({
    familyId: "v2.statements.object-type-vocabulary",
    suiteTitle: "Statement Activity And Object Typing",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "object", "object-type", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: objectsLegacyConfigFile,
    variants: [
      ...activityObjectPlacements.map((placement) => ({
        idSuffix: `${placement.idSuffix}-activity`,
        title: `A Statement rejects ${placement.title} when objectType does not exactly match Activity`,
        transforms: placement.buildTransforms({
          ...buildActivityObjectFixture("https://example.test/xapi/activities/invalid-object-type"),
          objectType: "activity",
        }),
        requirementRefs: objectTypeVocabularyRequirementRefs,
      })),
      {
        idSuffix: "statement-agent",
        title: "A Statement rejects a statement Agent object when objectType does not exactly match Agent",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: {
              ...buildAgentWithMbox("mailto:proof-object-type-agent@example.test"),
              objectType: "agent",
            },
          },
        ],
        requirementRefs: objectTypeVocabularyRequirementRefs,
      },
      {
        idSuffix: "substatement-agent",
        title: "A Statement rejects a substatement Agent object when objectType does not exactly match Agent",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              object: {
                ...buildAgentWithMbox("mailto:proof-object-type-substatement-agent@example.test"),
                objectType: "agent",
              },
            }),
          },
        ],
        requirementRefs: objectTypeVocabularyRequirementRefs,
      },
      {
        idSuffix: "statement-group",
        title: "A Statement rejects a statement Group object when objectType does not exactly match Group",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: {
              ...buildGroupWithMbox("mailto:proof-object-type-group@example.test"),
              objectType: "group",
            },
          },
        ],
        requirementRefs: objectTypeVocabularyRequirementRefs,
      },
      {
        idSuffix: "substatement-group",
        title: "A Statement rejects a substatement Group object when objectType does not exactly match Group",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              object: {
                ...buildGroupWithMbox("mailto:proof-object-type-substatement-group@example.test"),
                objectType: "group",
              },
            }),
          },
        ],
        requirementRefs: objectTypeVocabularyRequirementRefs,
      },
      ...statementRefPlacements.map((placement) => ({
        idSuffix: `${placement.idSuffix}-statement-ref`,
        title: `A Statement rejects ${placement.title} when objectType does not exactly match StatementRef`,
        transforms: placement.buildTransforms({
          objectType: "statementref",
          id: buildProofUuid(975),
        }),
        requirementRefs: objectTypeVocabularyRequirementRefs,
      })),
    ],
  });

  const activityMissingIdCases = statementMutationFamily({
    familyId: "v2.statements.activity.missing-id",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "object", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: activitiesLegacyConfigFile,
    variants: activityObjectPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement rejects ${placement.title} when id is missing`,
      transforms: placement.buildTransforms({
        objectType: "Activity",
      }),
      requirementRefs: activityIdRequirementRefs,
    })),
  });

  const activityInvalidIdCases = statementMutationFamily({
    familyId: "v2.statements.activity.invalid-id",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "object", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: activitiesLegacyConfigFile,
    variants: activityObjectPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement rejects ${placement.title} when id is not an IRI`,
      transforms: placement.buildTransforms(buildActivityObjectFixture(invalidOpenId)),
      requirementRefs: activityIdRequirementRefs,
    })),
  });

  const activityDefinitionTypeCases = statementMutationFamily({
    familyId: "v2.statements.activity.definition-type",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: activitiesLegacyConfigFile,
    variants: activityObjectPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement rejects ${placement.title} when definition is not an object`,
      transforms: placement.buildTransforms(
        buildActivityObjectFixture(`https://example.test/xapi/activities/${placement.idSuffix}-definition-not-object`, {
          definition: "not-an-object",
        }),
      ),
      requirementRefs: activityDefinitionRequirementRefs,
    })),
  });

  const activityObjectTypeGeneratedCases = activityObjectPlacements.map((placement, index) =>
    statementRoundTripCase({
      caseId: `v2.statements.activity.object-type-generated.${placement.idSuffix}`,
      title: `The Statements resource generates objectType Activity for ${placement.title} when it is omitted`,
      specVersion,
      queryParam: "statementId",
      requirementRefs: activityObjectTypeGenerationRequirementRefs,
      tags: ["v2.0.0", "statements", "activity", "object", "retrieval"],
      capabilityFlags: ["query", "retrieval", "activity"],
      legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
      transforms: [
        {
          operation: "set",
          path: ["id"],
          value: buildProofUuid(1100 + index),
        },
        ...placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-generated-object-type`,
            {},
            false,
          ),
        ),
      ],
      queryJsonPathEquals: [
        {
          path: buildActivityObjectRoundTripPath(placement.idSuffix, ["objectType"]),
          equals: "Activity",
        },
      ],
      notes: ["proof-slice statement activity objectType generation"],
    }),
  );

  const activityDefinitionNameTypeCases = statementMutationFamily({
    familyId: "v2.statements.activity.definition-name-type",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "name", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: activitiesLegacyConfigFile,
    variants: activityObjectPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-numeric`,
        title: `A Statement rejects ${placement.title} when definition.name is numeric`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(`https://example.test/xapi/activities/${placement.idSuffix}-name-numeric`, {
            definition: buildActivityDefinitionFixture({
              name: 12345,
            }),
          }),
        ),
        requirementRefs: activityDefinitionNameRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-string`,
        title: `A Statement rejects ${placement.title} when definition.name is a string`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(`https://example.test/xapi/activities/${placement.idSuffix}-name-string`, {
            definition: buildActivityDefinitionFixture({
              name: "not-a-language-map",
            }),
          }),
        ),
        requirementRefs: activityDefinitionNameRequirementRefs,
      },
    ]),
  });

  const activityDefinitionDescriptionTypeCases = statementMutationFamily({
    familyId: "v2.statements.activity.definition-description-type",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "description", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: activitiesLegacyConfigFile,
    variants: activityObjectPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-numeric`,
        title: `A Statement rejects ${placement.title} when definition.description is numeric`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(`https://example.test/xapi/activities/${placement.idSuffix}-description-numeric`, {
            definition: buildActivityDefinitionFixture({
              description: 12345,
            }),
          }),
        ),
        requirementRefs: activityDefinitionDescriptionRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-string`,
        title: `A Statement rejects ${placement.title} when definition.description is a string`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(`https://example.test/xapi/activities/${placement.idSuffix}-description-string`, {
            definition: buildActivityDefinitionFixture({
              description: "not-a-language-map",
            }),
          }),
        ),
        requirementRefs: activityDefinitionDescriptionRequirementRefs,
      },
    ]),
  });

  const scalarInteractionTypeAcceptanceVariants = [
    {
      idSuffix: "true-false",
      label: '"true-false"',
      definition: buildActivityDefinitionFixture({
        interactionType: "true-false",
        correctResponsesPattern: ["true"],
      }),
    },
    {
      idSuffix: "fill-in",
      label: '"fill-in"',
      definition: buildActivityDefinitionFixture({
        interactionType: "fill-in",
        correctResponsesPattern: ["proof fill in"],
      }),
    },
    {
      idSuffix: "long-fill-in",
      label: '"long-fill-in"',
      definition: buildActivityDefinitionFixture({
        interactionType: "long-fill-in",
        correctResponsesPattern: ["proof long fill in"],
      }),
    },
    {
      idSuffix: "numeric",
      label: '"numeric"',
      definition: buildActivityDefinitionFixture({
        interactionType: "numeric",
        correctResponsesPattern: ["4[:]"],
      }),
    },
    {
      idSuffix: "other",
      label: '"other"',
      definition: buildActivityDefinitionFixture({
        interactionType: "other",
        correctResponsesPattern: ["(35.937432,-86.868896)"],
      }),
    },
  ] as const;

  const activityInteractionTypeAcceptanceVariants = [
    ...scalarInteractionTypeAcceptanceVariants,
    {
      idSuffix: "choice",
      label: '"choice"',
      definition: buildActivityDefinitionWithInteractionField({
        field: "choices",
        interactionType: "choice",
        correctResponsesPattern: ["choice-a[,]choice-b"],
        value: [
          buildInteractionComponentFixture("choice-a", "Choice A"),
          buildInteractionComponentFixture("choice-b", "Choice B"),
        ],
      }),
    },
    {
      idSuffix: "matching",
      label: '"matching"',
      definition: buildActivityDefinitionFixture({
        interactionType: "matching",
        correctResponsesPattern: ["source-a[.]target-a"],
        source: [
          buildInteractionComponentFixture("source-a", "Source A"),
          buildInteractionComponentFixture("source-b", "Source B"),
        ],
        target: [
          buildInteractionComponentFixture("target-a", "Target A"),
          buildInteractionComponentFixture("target-b", "Target B"),
        ],
      }),
    },
    {
      idSuffix: "performance",
      label: '"performance"',
      definition: buildActivityDefinitionWithInteractionField({
        field: "steps",
        interactionType: "performance",
        correctResponsesPattern: ["step-a[.]complete"],
        value: [
          buildInteractionComponentFixture("step-a", "Step A"),
          buildInteractionComponentFixture("step-b", "Step B"),
        ],
      }),
    },
    {
      idSuffix: "sequencing",
      label: '"sequencing"',
      definition: buildActivityDefinitionWithInteractionField({
        field: "choices",
        interactionType: "sequencing",
        correctResponsesPattern: ["sequence-a[,]sequence-b"],
        value: [
          buildInteractionComponentFixture("sequence-a", "Sequence A"),
          buildInteractionComponentFixture("sequence-b", "Sequence B"),
        ],
      }),
    },
    {
      idSuffix: "likert",
      label: '"likert"',
      definition: buildActivityDefinitionWithInteractionField({
        field: "scale",
        interactionType: "likert",
        correctResponsesPattern: ["likert-1"],
        value: [
          buildInteractionComponentFixture("likert-0", "Likert zero"),
          buildInteractionComponentFixture("likert-1", "Likert one"),
        ],
      }),
    },
  ];

  const activityInteractionTypeAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.activity.interaction-type.acceptance",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "interaction-type"],
    expectedStatus: 200,
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: activitiesLegacyConfigFile,
    variants: activityObjectPlacements.flatMap((placement) =>
      activityInteractionTypeAcceptanceVariants.map((variant) => ({
        idSuffix: `${placement.idSuffix}-${variant.idSuffix}`,
        title: `A Statement accepts ${placement.title} when definition.interactionType uses ${variant.label}`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-interaction-type-${variant.idSuffix}`,
            {
              definition: variant.definition,
            },
          ),
        ),
        requirementRefs: activityInteractionTypeValueRequirementRefs,
      })),
    ),
  });

  const invalidInteractionTypeVariants = [
    {
      idSuffix: "iri",
      label: "an IRI",
      value: invalidOpenId,
    },
    {
      idSuffix: "numeric",
      label: "a number",
      value: 12345,
    },
    {
      idSuffix: "object",
      label: "an object",
      value: {
        invalid: true,
      },
    },
    {
      idSuffix: "string",
      label: "an unsupported string",
      value: "should error",
    },
  ] as const;

  const activityInteractionTypeInvalidCases = statementMutationFamily({
    familyId: "v2.statements.activity.interaction-type.invalid",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "interaction-type", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: activitiesLegacyConfigFile,
    variants: activityObjectPlacements.flatMap((placement) =>
      invalidInteractionTypeVariants.map((variant) => ({
        idSuffix: `${placement.idSuffix}-${variant.idSuffix}`,
        title: `A Statement rejects ${placement.title} when definition.interactionType uses ${variant.label}`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-invalid-interaction-type-${variant.idSuffix}`,
            {
              definition: buildActivityDefinitionFixture({
                interactionType: variant.value,
                correctResponsesPattern: ["proof-response"],
              }),
            },
          ),
        ),
        requirementRefs: activityInteractionTypeValueRequirementRefs,
      })),
    ),
  });

  const activityCorrectResponsesPatternCases = statementMutationFamily({
    familyId: "v2.statements.activity.correct-responses-pattern",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "correct-responses-pattern"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    variants: activityObjectPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-valid`,
        title: `A Statement accepts ${placement.title} when definition.correctResponsesPattern is an array of strings`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-correct-responses-pattern-valid`,
            {
              definition: buildActivityDefinitionFixture({
                interactionType: "other",
                correctResponsesPattern: ["proof-response"],
              }),
            },
          ),
        ),
        requirementRefs: activityCorrectResponsesPatternRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-object`,
        title: `A Statement rejects ${placement.title} when definition.correctResponsesPattern is an object`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-correct-responses-pattern-object`,
            {
              definition: buildActivityDefinitionFixture({
                interactionType: "other",
                correctResponsesPattern: {
                  invalid: true,
                },
              }),
            },
          ),
        ),
        requirementRefs: activityCorrectResponsesPatternRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-array-object`,
        title: `A Statement rejects ${placement.title} when definition.correctResponsesPattern contains objects`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-correct-responses-pattern-array-object`,
            {
              definition: buildActivityDefinitionFixture({
                interactionType: "other",
                correctResponsesPattern: [
                  {
                    invalid: true,
                  },
                ],
              }),
            },
          ),
        ),
        requirementRefs: activityCorrectResponsesPatternRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-array-number`,
        title: `A Statement rejects ${placement.title} when definition.correctResponsesPattern contains numbers`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-correct-responses-pattern-array-number`,
            {
              definition: buildActivityDefinitionFixture({
                interactionType: "other",
                correctResponsesPattern: [12345],
              }),
            },
          ),
        ),
        requirementRefs: activityCorrectResponsesPatternRequirementRefs,
      },
    ]),
    expectedStatus: 200,
  }).map((testCase) =>
    testCase.id.endsWith("-object") || testCase.id.endsWith("-array-object") || testCase.id.endsWith("-array-number")
      ? {
          ...testCase,
          assertion: {
            ...testCase.assertion,
            status: 400,
          },
        }
      : testCase,
  );

  const activityExtensionsTypeCases = statementMutationFamily({
    familyId: "v2.statements.activity.extensions-type",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "extensions", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: activitiesLegacyConfigFile,
    variants: activityObjectPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-string`,
        title: `A Statement rejects ${placement.title} when definition.extensions is a string`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(`https://example.test/xapi/activities/${placement.idSuffix}-extensions-string`, {
            definition: buildActivityDefinitionFixture({
              extensions: "not-an-object",
            }),
          }),
        ),
        requirementRefs: activityDefinitionExtensionsRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-invalid-key`,
        title: `A Statement rejects ${placement.title} when definition.extensions uses a non-IRI key`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-extensions-invalid-key`,
            {
              definition: buildActivityDefinitionFixture({
                extensions: {
                  id: "valid",
                },
              }),
            },
          ),
        ),
        requirementRefs: activityDefinitionExtensionsRequirementRefs,
      },
    ]),
  });

  const activityInteractionComponentAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.activity.interaction-components.acceptance",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "interaction-components"],
    expectedStatus: 200,
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    variants: activityObjectPlacements.flatMap((placement) =>
      interactionComponentTargets.map((target) => ({
        idSuffix: `${placement.idSuffix}-${target.idSuffix}`,
        title: `A Statement accepts ${placement.title} when ${target.title} uses interaction components`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-${target.idSuffix}-acceptance`,
            {
              definition: buildActivityDefinitionWithInteractionField({
                field: target.field,
                interactionType: target.interactionType,
                correctResponsesPattern: target.correctResponsesPattern,
                value: target.components,
              }),
            },
          ),
        ),
        requirementRefs: activityInteractionComponentRequirementRefsByField[target.field],
      })),
    ),
  });

  const activityInteractionComponentNotArrayCases = statementMutationFamily({
    familyId: "v2.statements.activity.interaction-components.not-array",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "interaction-components", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    variants: activityObjectPlacements.flatMap((placement) =>
      interactionComponentTargets.map((target) => ({
        idSuffix: `${placement.idSuffix}-${target.idSuffix}`,
        title: `A Statement rejects ${placement.title} when ${target.title} is not an array`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-${target.idSuffix}-not-array`,
            {
              definition: buildActivityDefinitionWithInteractionField({
                field: target.field,
                interactionType: target.interactionType,
                correctResponsesPattern: target.correctResponsesPattern,
                value: {
                  invalid: true,
                },
              }),
            },
          ),
        ),
        requirementRefs: activityInteractionComponentRequirementRefsByField[target.field],
      })),
    ),
  });

  const activityInteractionComponentEntryNotObjectCases = statementMutationFamily({
    familyId: "v2.statements.activity.interaction-components.entry-not-object",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "interaction-components", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    variants: activityObjectPlacements.flatMap((placement) =>
      interactionComponentTargets.map((target) => ({
        idSuffix: `${placement.idSuffix}-${target.idSuffix}`,
        title: `A Statement rejects ${placement.title} when ${target.title} contains a non-object entry`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-${target.idSuffix}-entry-not-object`,
            {
              definition: buildActivityDefinitionWithInteractionField({
                field: target.field,
                interactionType: target.interactionType,
                correctResponsesPattern: target.correctResponsesPattern,
                value: ["not-an-object"],
              }),
            },
          ),
        ),
        requirementRefs: [
          ...activityInteractionComponentRequirementRefsByField[target.field],
          ...interactionComponentObjectRequirementRefs,
        ],
      })),
    ),
  });

  const activityInteractionComponentIdMissingCases = statementMutationFamily({
    familyId: "v2.statements.activity.interaction-components.id-missing",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "interaction-components", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    variants: activityObjectPlacements.flatMap((placement) =>
      interactionComponentTargets.map((target) => ({
        idSuffix: `${placement.idSuffix}-${target.idSuffix}`,
        title: `A Statement rejects ${placement.title} when ${target.title} omits an interaction component id`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-${target.idSuffix}-id-missing`,
            {
              definition: buildActivityDefinitionWithInteractionField({
                field: target.field,
                interactionType: target.interactionType,
                correctResponsesPattern: target.correctResponsesPattern,
                value: [
                  {
                    description: {
                      "en-US": "Proof interaction component",
                    },
                  },
                ],
              }),
            },
          ),
        ),
        requirementRefs: [
          ...activityInteractionComponentRequirementRefsByField[target.field],
          ...interactionComponentIdRequirementRefs,
        ],
      })),
    ),
  });

  const activityInteractionComponentIdInvalidCases = statementMutationFamily({
    familyId: "v2.statements.activity.interaction-components.id-invalid",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "interaction-components", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    variants: activityObjectPlacements.flatMap((placement) =>
      interactionComponentTargets.map((target) => ({
        idSuffix: `${placement.idSuffix}-${target.idSuffix}`,
        title: `A Statement rejects ${placement.title} when ${target.title} uses a non-string interaction component id`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-${target.idSuffix}-id-invalid`,
            {
              definition: buildActivityDefinitionWithInteractionField({
                field: target.field,
                interactionType: target.interactionType,
                correctResponsesPattern: target.correctResponsesPattern,
                value: [
                  {
                    id: 12345,
                    description: {
                      "en-US": "Proof interaction component",
                    },
                  },
                ],
              }),
            },
          ),
        ),
        requirementRefs: [
          ...activityInteractionComponentRequirementRefsByField[target.field],
          ...interactionComponentIdRequirementRefs,
        ],
      })),
    ),
  });

  const activityInteractionComponentDescriptionTypeCases = statementMutationFamily({
    familyId: "v2.statements.activity.interaction-components.description-type",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "interaction-components", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    variants: activityObjectPlacements.flatMap((placement) =>
      interactionComponentTargets.map((target) => ({
        idSuffix: `${placement.idSuffix}-${target.idSuffix}`,
        title: `A Statement rejects ${placement.title} when ${target.title} uses a non-object description`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-${target.idSuffix}-description-type`,
            {
              definition: buildActivityDefinitionWithInteractionField({
                field: target.field,
                interactionType: target.interactionType,
                correctResponsesPattern: target.correctResponsesPattern,
                value: [
                  {
                    id: `${target.idSuffix}-description-type`,
                    description: "not-a-language-map",
                  },
                ],
              }),
            },
          ),
        ),
        requirementRefs: [
          ...activityInteractionComponentRequirementRefsByField[target.field],
          ...interactionComponentDescriptionRequirementRefs,
        ],
      })),
    ),
  });

  const activityInteractionComponentDescriptionLanguageCases = statementMutationFamily({
    familyId: "v2.statements.activity.interaction-components.description-language",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "interaction-components", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    variants: activityObjectPlacements.flatMap((placement) =>
      interactionComponentTargets.map((target) => ({
        idSuffix: `${placement.idSuffix}-${target.idSuffix}`,
        title: `A Statement rejects ${placement.title} when ${target.title} uses an invalid description language key`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-${target.idSuffix}-description-language`,
            {
              definition: buildActivityDefinitionWithInteractionField({
                field: target.field,
                interactionType: target.interactionType,
                correctResponsesPattern: target.correctResponsesPattern,
                value: [
                  {
                    id: `${target.idSuffix}-description-language`,
                    description: {
                      something: "invalid-language-key",
                    },
                  },
                ],
              }),
            },
          ),
        ),
        requirementRefs: [
          ...activityInteractionComponentRequirementRefsByField[target.field],
          ...interactionComponentDescriptionRequirementRefs,
        ],
      })),
    ),
  });

  const activityInteractionComponentDuplicateIdCases = statementMutationFamily({
    familyId: "v2.statements.activity.interaction-components.duplicate-ids",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "interaction-components", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    variants: activityObjectPlacements.flatMap((placement) =>
      interactionComponentTargets.map((target) => ({
        idSuffix: `${placement.idSuffix}-${target.idSuffix}`,
        title: `A Statement rejects ${placement.title} when ${target.title} reuses an interaction component id`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-${target.idSuffix}-duplicate-ids`,
            {
              definition: buildActivityDefinitionWithInteractionField({
                field: target.field,
                interactionType: target.interactionType,
                correctResponsesPattern: target.correctResponsesPattern,
                value: [
                  buildInteractionComponentFixture(`${target.idSuffix}-duplicate`, "Duplicate A"),
                  buildInteractionComponentFixture(`${target.idSuffix}-duplicate`, "Duplicate B"),
                ],
              }),
            },
          ),
        ),
        requirementRefs: [
          ...activityInteractionComponentRequirementRefsByField[target.field],
          ...interactionComponentUniqueIdRequirementRefs,
        ],
      })),
    ),
  });

  const interactionCarrierVariants = [
    {
      idSuffix: "correct-responses-pattern",
      label: "correctResponsesPattern",
      definition: buildActivityDefinitionFixture({
        correctResponsesPattern: ["proof-response"],
      }),
    },
    {
      idSuffix: "choices",
      label: "choices",
      definition: buildActivityDefinitionFixture({
        choices: [buildInteractionComponentFixture("choice-a", "Proof choice")],
      }),
    },
    {
      idSuffix: "scale",
      label: "scale",
      definition: buildActivityDefinitionFixture({
        scale: [buildInteractionComponentFixture("scale-a", "Proof scale")],
      }),
    },
    {
      idSuffix: "source",
      label: "source",
      definition: buildActivityDefinitionFixture({
        source: [buildInteractionComponentFixture("source-a", "Proof source")],
      }),
    },
    {
      idSuffix: "target",
      label: "target",
      definition: buildActivityDefinitionFixture({
        target: [buildInteractionComponentFixture("target-a", "Proof target")],
      }),
    },
    {
      idSuffix: "steps",
      label: "steps",
      definition: buildActivityDefinitionFixture({
        steps: [buildInteractionComponentFixture("step-a", "Proof step")],
      }),
    },
  ] as const;

  const activityInteractionTypeRequiredCases = statementMutationFamily({
    familyId: "v2.statements.activity.interaction-type-required",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "interaction-type", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    variants: activityObjectPlacements.flatMap((placement) =>
      interactionCarrierVariants.map((variant) => ({
        idSuffix: `${placement.idSuffix}-${variant.idSuffix}`,
        title: `A Statement rejects ${placement.title} when ${variant.label} is used without interactionType`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-${variant.idSuffix}-without-interaction-type`,
            {
              definition: variant.definition,
            },
          ),
        ),
        requirementRefs: activityInteractionTypeRequirementRefs,
      })),
    ),
  });

  const objectActorTypeRequiredCases = statementMutationFamily({
    familyId: "v2.statements.object-agent-group.requires-object-type",
    suiteTitle: "Statement Activity And Object Typing",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "object", "agent", "group", "object-type", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    variants: [
      {
        idSuffix: "statement-agent",
        title: "A Statement rejects a statement Agent object when objectType is omitted",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: {
              mbox: "mailto:proof-object-agent-without-type@example.test",
              name: "Proof Agent",
            },
          },
        ],
        requirementRefs: objectActorTypeRequirementRefs,
      },
      {
        idSuffix: "statement-group",
        title: "A Statement rejects a statement Group object when objectType is omitted",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: {
              mbox: "mailto:proof-object-group-without-type@example.test",
              name: "Proof Group",
              member: [buildAgentWithMbox(validGroupMemberMbox)],
            },
          },
        ],
        requirementRefs: objectActorTypeRequirementRefs,
      },
      {
        idSuffix: "substatement-agent",
        title: "A Statement rejects a substatement Agent object when objectType is omitted",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              object: {
                mbox: "mailto:proof-substatement-object-agent-without-type@example.test",
                name: "Proof Agent",
              },
            }),
          },
        ],
        requirementRefs: objectActorTypeRequirementRefs,
      },
      {
        idSuffix: "substatement-group",
        title: "A Statement rejects a substatement Group object when objectType is omitted",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              object: {
                mbox: "mailto:proof-substatement-object-group-without-type@example.test",
                name: "Proof Group",
                member: [buildAgentWithMbox(validGroupMemberMbox)],
              },
            }),
          },
        ],
        requirementRefs: objectActorTypeRequirementRefs,
      },
    ],
  });

  const statementRefAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.statement-ref.acceptance",
    suiteTitle: "Statement References",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "object", "statement-ref"],
    expectedStatus: 200,
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: statementRefsLegacyConfigFile,
    variants: statementRefPlacements.map((placement, index) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement accepts ${placement.title} when it is a valid StatementRef`,
      transforms: placement.buildTransforms(buildStatementRefFixture(buildProofUuid(970 + index))),
      requirementRefs: statementRefRequirementRefs,
    })),
  });

  const statementRefObjectTypeCases = statementMutationFamily({
    familyId: "v2.statements.statement-ref.object-type",
    suiteTitle: "Statement References",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "object", "statement-ref", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: statementRefsLegacyConfigFile,
    variants: statementRefPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement rejects ${placement.title} when objectType does not exactly match StatementRef`,
      transforms: placement.buildTransforms({
        objectType: "statementref",
        id: buildProofUuid(972),
      }),
      requirementRefs: statementRefRequirementRefs,
    })),
  });

  const statementRefMissingIdCases = statementMutationFamily({
    familyId: "v2.statements.statement-ref.missing-id",
    suiteTitle: "Statement References",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "object", "statement-ref", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: statementRefsLegacyConfigFile,
    variants: statementRefPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement rejects ${placement.title} when id is missing`,
      transforms: placement.buildTransforms({
        objectType: "StatementRef",
      }),
      requirementRefs: statementRefRequirementRefs,
    })),
  });

  const statementRefInvalidIdCases = statementMutationFamily({
    familyId: "v2.statements.statement-ref.invalid-id",
    suiteTitle: "Statement References",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "object", "statement-ref", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: statementRefsLegacyConfigFile,
    variants: statementRefPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement rejects ${placement.title} when id is not a UUID`,
      transforms: placement.buildTransforms(buildStatementRefFixture("should fail")),
      requirementRefs: statementRefRequirementRefs,
    })),
  });

  const subStatementAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.substatement.acceptance",
    suiteTitle: "SubStatements",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "object", "substatement"],
    expectedStatus: 200,
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: subStatementsLegacyConfigFile,
    variants: [
      {
        idSuffix: "default",
        title: "A Statement accepts a valid SubStatement object",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
        ],
        requirementRefs: subStatementRequirementRefs,
      },
      {
        idSuffix: "context",
        title: "A Statement accepts a SubStatement that contains context",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              context: {
                language: "en-US",
              },
            }),
          },
        ],
        requirementRefs: subStatementRequirementRefs,
      },
      {
        idSuffix: "result",
        title: "A Statement accepts a SubStatement that contains result",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              result: buildResultFixture(),
            }),
          },
        ],
        requirementRefs: subStatementRequirementRefs,
      },
      {
        idSuffix: "statement-ref",
        title: "A Statement accepts a SubStatement whose object is a StatementRef",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              object: buildStatementRefFixture(buildProofUuid(973)),
            }),
          },
        ],
        requirementRefs: subStatementRequirementRefs,
      },
      {
        idSuffix: "agent",
        title: "A Statement accepts a SubStatement whose object is an Agent",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              object: buildAgentWithMbox("mailto:proof-substatement-agent@example.test"),
            }),
          },
        ],
        requirementRefs: subStatementRequirementRefs,
      },
      {
        idSuffix: "group",
        title: "A Statement accepts a SubStatement whose object is a Group",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              object: buildGroupWithMbox("mailto:proof-substatement-group@example.test"),
            }),
          },
        ],
        requirementRefs: subStatementRequirementRefs,
      },
    ],
  });

  const subStatementObjectTypeCases = statementMutationFamily({
    familyId: "v2.statements.substatement.object-type",
    suiteTitle: "SubStatements",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "object", "substatement", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: subStatementsLegacyConfigFile,
    variants: [
      {
        idSuffix: "statement",
        title: "A Statement rejects an objectType value that does not exactly match SubStatement",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              objectType: "substatement",
            }),
          },
        ],
        requirementRefs: subStatementObjectTypeRequirementRefs,
      },
    ],
  });

  const subStatementMissingFieldCases = statementMutationFamily({
    familyId: "v2.statements.substatement.missing-fields",
    suiteTitle: "SubStatements",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "object", "substatement", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: subStatementsLegacyConfigFile,
    variants: [
      {
        idSuffix: "actor",
        title: "A Statement rejects a SubStatement that omits actor",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "remove",
            path: ["object", "actor"],
          },
        ],
        requirementRefs: subStatementRequirementRefs,
      },
      {
        idSuffix: "verb",
        title: "A Statement rejects a SubStatement that omits verb",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "remove",
            path: ["object", "verb"],
          },
        ],
        requirementRefs: subStatementRequirementRefs,
      },
      {
        idSuffix: "object",
        title: "A Statement rejects a SubStatement that omits object",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "remove",
            path: ["object", "object"],
          },
        ],
        requirementRefs: subStatementRequirementRefs,
      },
    ],
  });

  const subStatementForbiddenPropertyCases = statementMutationFamily({
    familyId: "v2.statements.substatement.forbidden-properties",
    suiteTitle: "SubStatements",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "object", "substatement", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: subStatementsLegacyConfigFile,
    variants: [
      {
        idSuffix: "authority",
        title: "A Statement rejects a SubStatement that contains authority",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              authority: buildAgentWithMbox("mailto:proof-substatement-authority@example.test"),
            }),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00067",
            section: "Data 2.4.4.3.s8.b3",
            title: "SubStatements cannot use authority",
          },
        ],
      },
      {
        idSuffix: "version",
        title: "A Statement rejects a SubStatement that contains version",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              version: "1.0.0",
            }),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00068",
            section: "Data 2.4.4.3.s8.b3",
            title: "SubStatements cannot use version",
          },
        ],
      },
      {
        idSuffix: "stored",
        title: "A Statement rejects a SubStatement that contains stored",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              stored: "2013-05-18T05:32:34.804Z",
            }),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00069",
            section: "Data 2.4.4.3.s8.b3",
            title: "SubStatements cannot use stored",
          },
        ],
      },
      {
        idSuffix: "id",
        title: "A Statement rejects a SubStatement that contains id",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              id: buildProofUuid(974),
            }),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00070",
            section: "Data 2.4.4.3.s8.b3",
            title: "SubStatements cannot use id",
          },
        ],
      },
    ],
  });

  const subStatementNestedCase = statementMutationFamily({
    familyId: "v2.statements.substatement.nested",
    suiteTitle: "SubStatements",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "object", "substatement", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: subStatementsLegacyConfigFile,
    variants: [
      {
        idSuffix: "substatement",
        title: "A Statement rejects a SubStatement whose object is another SubStatement",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              object: buildSubStatementFixture(),
            }),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00071",
            section: "Data 2.4.4.3.s8.b4",
            title: "SubStatements cannot contain SubStatements",
          },
        ],
      },
    ],
  });

  const contextRegistrationRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00086",
      section: "Data 2.4.6",
      title: "Context registration values are UUIDs",
    },
  ];
  const contextTeamRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00087",
      section: "Data 2.4.6",
      title: "Context team values are Groups",
    },
  ];
  const contextActivitiesRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00088",
      section: "Data 2.4.6",
      title: "ContextActivities values are objects",
    },
  ];
  const contextRevisionRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00084",
      section: "Data 2.4.6",
      title: "Context revision values are strings and only apply to Activity objects",
    },
  ];
  const contextPlatformRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00085",
      section: "Data 2.4.6",
      title: "Context platform values are strings and only apply to Activity objects",
    },
  ];
  const contextStatementRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00092",
      section: "Data 2.4.6",
      title: "Context statement values are StatementRefs",
    },
  ];
  const contextActivityKeyRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00093",
      section: "Data 2.4.6.2",
      title: "ContextActivities only use parent, grouping, category, and other keys",
    },
  ];
  const contextActivityValueRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00094",
      section: "Data 2.4.6.2",
      title: "ContextActivities values are Activities or arrays of Activities",
    },
  ];
  const contextActivityRoundTripRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00096",
      section: "Data 2.4.6.2",
      title: "Retrieved ContextActivities values are arrays",
    },
  ];

  const invalidRegistrationCases = statementMutationFamily({
    familyId: "v2.statements.context.invalid-registration",
    suiteTitle: "Statement Context",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "registration", "validation"],
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextsLegacyConfigFile,
    variants: contextPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-object`,
        title: `A Statement rejects ${placement.title} registration when it is an object`,
        transforms: placement.buildTransforms({
          registration: {
            invalid: true,
          },
        }),
        requirementRefs: contextRegistrationRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-string`,
        title: `A Statement rejects ${placement.title} registration when it is not a UUID`,
        transforms: placement.buildTransforms({
          registration: "not-a-uuid",
        }),
        requirementRefs: contextRegistrationRequirementRefs,
      },
    ]),
  });

  const invalidTeamCases = statementMutationFamily({
    familyId: "v2.statements.context.invalid-team",
    suiteTitle: "Statement Context",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "team", "validation"],
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextsLegacyConfigFile,
    variants: contextPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-agent`,
        title: `A Statement rejects ${placement.title} team when it is an Agent`,
        transforms: placement.buildTransforms({
          team: buildAgentWithMbox(`mailto:${placement.idSuffix}-context-team-agent@example.test`),
        }),
        requirementRefs: contextTeamRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-object`,
        title: `A Statement rejects ${placement.title} team when it is not a Group`,
        transforms: placement.buildTransforms({
          team: {
            name: "not-a-group",
          },
        }),
        requirementRefs: contextTeamRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-string`,
        title: `A Statement rejects ${placement.title} team when it is a string`,
        transforms: placement.buildTransforms({
          team: "not-a-group",
        }),
        requirementRefs: contextTeamRequirementRefs,
      },
    ]),
  });

  const invalidContextActivitiesTypeCases = statementMutationFamily({
    familyId: "v2.statements.context.invalid-context-activities-type",
    suiteTitle: "Statement Context",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "context-activities", "validation"],
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextsLegacyConfigFile,
    variants: contextPlacements.map((placement) => ({
      idSuffix: `${placement.idSuffix}-string`,
      title: `A Statement rejects ${placement.title} contextActivities when it is not an object`,
      transforms: placement.buildTransforms({
        contextActivities: "not-an-object",
      }),
      requirementRefs: contextActivitiesRequirementRefs,
    })),
  });

  const invalidRevisionTypeCases = statementMutationFamily({
    familyId: "v2.statements.context.invalid-revision-type",
    suiteTitle: "Statement Context",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "revision", "validation"],
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextsLegacyConfigFile,
    variants: contextPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-number`,
        title: `A Statement rejects ${placement.title} revision when it is a number`,
        transforms: placement.buildTransforms({
          revision: 12,
        }),
        requirementRefs: contextRevisionRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-object`,
        title: `A Statement rejects ${placement.title} revision when it is an object`,
        transforms: placement.buildTransforms({
          revision: {
            invalid: true,
          },
        }),
        requirementRefs: contextRevisionRequirementRefs,
      },
    ]),
  });

  const revisionConstraintTargets = [
    {
      idSuffix: "statement-agent",
      title: "A Statement rejects a statement context revision when the statement object is an Agent",
      placement: "statement" as const,
      object: buildAgentWithMbox("mailto:context-revision-statement-agent@example.test"),
    },
    {
      idSuffix: "statement-group",
      title: "A Statement rejects a statement context revision when the statement object is a Group",
      placement: "statement" as const,
      object: buildGroupWithMbox("mailto:context-revision-statement-group@example.test"),
    },
    {
      idSuffix: "statement-statement-ref",
      title: "A Statement rejects a statement context revision when the statement object is a StatementRef",
      placement: "statement" as const,
      object: buildContextStatementRefFixture(buildProofUuid(929)),
    },
    {
      idSuffix: "statement-substatement",
      title: "A Statement rejects a statement context revision when the statement object is a SubStatement",
      placement: "statement" as const,
      object: buildSubStatementFixture(),
    },
    {
      idSuffix: "substatement-agent",
      title: "A Statement rejects a substatement context revision when the substatement object is an Agent",
      placement: "substatement" as const,
      object: buildAgentWithMbox("mailto:context-revision-substatement-agent@example.test"),
    },
    {
      idSuffix: "substatement-group",
      title: "A Statement rejects a substatement context revision when the substatement object is a Group",
      placement: "substatement" as const,
      object: buildGroupWithMbox("mailto:context-revision-substatement-group@example.test"),
    },
    {
      idSuffix: "substatement-statement-ref",
      title: "A Statement rejects a substatement context revision when the substatement object is a StatementRef",
      placement: "substatement" as const,
      object: buildContextStatementRefFixture(buildProofUuid(930)),
    },
  ];

  const revisionActivityOnlyRejectionCases = statementMutationFamily({
    familyId: "v2.statements.context.revision-activity-only",
    suiteTitle: "Statement Context",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "revision", "validation"],
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextsLegacyConfigFile,
    variants: revisionConstraintTargets.map((target) => ({
      idSuffix: target.idSuffix,
      title: target.title,
      transforms: buildContextPropertyConstraintTransforms(
        "revision",
        "proof-revision",
        target.object,
        target.placement,
      ),
      requirementRefs: contextRevisionRequirementRefs,
    })),
  });

  const revisionNoObjectTypeCases = statementMutationFamily({
    familyId: "v2.statements.context.revision-no-object-type",
    suiteTitle: "Statement Context",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "revision"],
    expectedStatus: 200,
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextsLegacyConfigFile,
    variants: [
      {
        idSuffix: "statement",
        title: "A Statement accepts a statement context revision when the statement object omits objectType",
        transforms: buildContextPropertyConstraintTransforms(
          "revision",
          "proof-revision",
          buildContextActivityFixture("https://example.test/xapi/activities/context-revision-no-object-type", false),
          "statement",
        ),
        requirementRefs: contextRevisionRequirementRefs,
      },
      {
        idSuffix: "substatement",
        title: "A Statement accepts a substatement context revision when the substatement object omits objectType",
        transforms: buildContextPropertyConstraintTransforms(
          "revision",
          "proof-revision",
          buildContextActivityFixture(
            "https://example.test/xapi/activities/context-substatement-revision-no-object-type",
            false,
          ),
          "substatement",
        ),
        requirementRefs: contextRevisionRequirementRefs,
      },
    ],
  });

  const invalidPlatformTypeCases = statementMutationFamily({
    familyId: "v2.statements.context.invalid-platform-type",
    suiteTitle: "Statement Context",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "platform", "validation"],
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextsLegacyConfigFile,
    variants: contextPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-number`,
        title: `A Statement rejects ${placement.title} platform when it is a number`,
        transforms: placement.buildTransforms({
          platform: 12,
        }),
        requirementRefs: contextPlatformRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-object`,
        title: `A Statement rejects ${placement.title} platform when it is an object`,
        transforms: placement.buildTransforms({
          platform: {
            invalid: true,
          },
        }),
        requirementRefs: contextPlatformRequirementRefs,
      },
    ]),
  });

  const platformConstraintTargets = [
    {
      idSuffix: "statement-agent",
      title: "A Statement rejects a statement context platform when the statement object is an Agent",
      placement: "statement" as const,
      object: buildAgentWithMbox("mailto:context-platform-statement-agent@example.test"),
    },
    {
      idSuffix: "statement-group",
      title: "A Statement rejects a statement context platform when the statement object is a Group",
      placement: "statement" as const,
      object: buildGroupWithMbox("mailto:context-platform-statement-group@example.test"),
    },
    {
      idSuffix: "statement-statement-ref",
      title: "A Statement rejects a statement context platform when the statement object is a StatementRef",
      placement: "statement" as const,
      object: buildContextStatementRefFixture(buildProofUuid(931)),
    },
    {
      idSuffix: "statement-substatement",
      title: "A Statement rejects a statement context platform when the statement object is a SubStatement",
      placement: "statement" as const,
      object: buildSubStatementFixture(),
    },
    {
      idSuffix: "substatement-agent",
      title: "A Statement rejects a substatement context platform when the substatement object is an Agent",
      placement: "substatement" as const,
      object: buildAgentWithMbox("mailto:context-platform-substatement-agent@example.test"),
    },
    {
      idSuffix: "substatement-group",
      title: "A Statement rejects a substatement context platform when the substatement object is a Group",
      placement: "substatement" as const,
      object: buildGroupWithMbox("mailto:context-platform-substatement-group@example.test"),
    },
    {
      idSuffix: "substatement-statement-ref",
      title: "A Statement rejects a substatement context platform when the substatement object is a StatementRef",
      placement: "substatement" as const,
      object: buildContextStatementRefFixture(buildProofUuid(932)),
    },
  ];

  const platformActivityOnlyRejectionCases = statementMutationFamily({
    familyId: "v2.statements.context.platform-activity-only",
    suiteTitle: "Statement Context",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "platform", "validation"],
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextsLegacyConfigFile,
    variants: platformConstraintTargets.map((target) => ({
      idSuffix: target.idSuffix,
      title: target.title,
      transforms: buildContextPropertyConstraintTransforms(
        "platform",
        "proof-platform",
        target.object,
        target.placement,
      ),
      requirementRefs: contextPlatformRequirementRefs,
    })),
  });

  const platformNoObjectTypeCases = statementMutationFamily({
    familyId: "v2.statements.context.platform-no-object-type",
    suiteTitle: "Statement Context",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "platform"],
    expectedStatus: 200,
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextsLegacyConfigFile,
    variants: [
      {
        idSuffix: "statement",
        title: "A Statement accepts a statement context platform when the statement object omits objectType",
        transforms: buildContextPropertyConstraintTransforms(
          "platform",
          "proof-platform",
          buildContextActivityFixture("https://example.test/xapi/activities/context-platform-no-object-type", false),
          "statement",
        ),
        requirementRefs: contextPlatformRequirementRefs,
      },
      {
        idSuffix: "substatement",
        title: "A Statement accepts a substatement context platform when the substatement object omits objectType",
        transforms: buildContextPropertyConstraintTransforms(
          "platform",
          "proof-platform",
          buildContextActivityFixture(
            "https://example.test/xapi/activities/context-substatement-platform-no-object-type",
            false,
          ),
          "substatement",
        ),
        requirementRefs: contextPlatformRequirementRefs,
      },
    ],
  });

  const invalidContextStatementRefCases = statementMutationFamily({
    familyId: "v2.statements.context.invalid-statement-ref",
    suiteTitle: "Statement Context",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "statement-ref", "validation"],
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextsLegacyConfigFile,
    variants: contextPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-object-type`,
        title: `A Statement rejects ${placement.title} statement when objectType does not exactly match StatementRef`,
        transforms: placement.buildTransforms({
          statement: {
            objectType: "statementref",
            id: buildProofUuid(933),
          },
        }),
        requirementRefs: contextStatementRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-id`,
        title: `A Statement rejects ${placement.title} statement when its id is not a UUID`,
        transforms: placement.buildTransforms({
          statement: buildContextStatementRefFixture("not-a-uuid"),
        }),
        requirementRefs: contextStatementRequirementRefs,
      },
    ]),
  });

  const contextActivityKeyAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.context.context-activities-keys",
    suiteTitle: "Statement Context Activities",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "context-activities", "keys"],
    expectedStatus: 200,
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextActivitiesLegacyConfigFile,
    variants: [
      ...contextPlacements.flatMap((placement) =>
        contextActivityKinds.map((kind) => ({
          idSuffix: `${placement.idSuffix}-${kind}`,
          title: `A Statement accepts ${placement.title} contextActivities ${kind} values`,
          transforms: placement.buildTransforms(
            buildContextActivitiesFixture({
              [kind]: buildContextActivityFixture(
                `https://example.test/xapi/activities/${placement.idSuffix}-context-${kind}`,
              ),
            } as JsonObject),
          ),
          requirementRefs: contextActivityKeyRequirementRefs,
        })),
      ),
      ...contextPlacements.map((placement) => ({
        idSuffix: `${placement.idSuffix}-all`,
        title: `A Statement accepts ${placement.title} contextActivities with parent, grouping, category, and other`,
        transforms: placement.buildTransforms(
          buildContextActivitiesFixture({
            parent: buildContextActivityFixture(
              `https://example.test/xapi/activities/${placement.idSuffix}-context-parent-all`,
            ),
            grouping: buildContextActivityFixture(
              `https://example.test/xapi/activities/${placement.idSuffix}-context-grouping-all`,
            ),
            category: buildContextActivityFixture(
              `https://example.test/xapi/activities/${placement.idSuffix}-context-category-all`,
            ),
            other: buildContextActivityFixture(
              `https://example.test/xapi/activities/${placement.idSuffix}-context-other-all`,
            ),
          }),
        ),
        requirementRefs: contextActivityKeyRequirementRefs,
      })),
    ],
  });

  const contextActivityInvalidKeyCases = statementMutationFamily({
    familyId: "v2.statements.context.context-activities-invalid-key",
    suiteTitle: "Statement Context Activities",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "context-activities", "keys", "validation"],
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextActivitiesLegacyConfigFile,
    variants: contextPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement rejects ${placement.title} contextActivities keys outside parent, grouping, category, and other`,
      transforms: placement.buildTransforms(
        buildContextActivitiesFixture({
          invalid: buildContextActivityFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-context-invalid-key`,
          ),
        }),
      ),
      requirementRefs: contextActivityKeyRequirementRefs,
    })),
  });

  const contextActivityArrayValueCases = statementMutationFamily({
    familyId: "v2.statements.context.context-activities-values",
    suiteTitle: "Statement Context Activities",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "context-activities", "values"],
    expectedStatus: 200,
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextActivitiesLegacyConfigFile,
    variants: contextPlacements.flatMap((placement) =>
      contextActivityKinds.map((kind) => ({
        idSuffix: `${placement.idSuffix}-${kind}-array`,
        title: `A Statement accepts ${placement.title} contextActivities ${kind} arrays of Activities`,
        transforms: placement.buildTransforms(
          buildContextActivitiesFixture({
            [kind]: [
              buildContextActivityFixture(
                `https://example.test/xapi/activities/${placement.idSuffix}-context-${kind}-array`,
              ),
            ],
          } as JsonObject),
        ),
        requirementRefs: contextActivityValueRequirementRefs,
      })),
    ),
  });

  const contextActivityInvalidValueCases = statementMutationFamily({
    familyId: "v2.statements.context.context-activities-invalid-value",
    suiteTitle: "Statement Context Activities",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "context-activities", "values", "validation"],
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextActivitiesLegacyConfigFile,
    variants: contextPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement rejects ${placement.title} contextActivities arrays when they contain non-Activity values`,
      transforms: placement.buildTransforms(
        buildContextActivitiesFixture({
          category: [
            buildContextActivityFixture(
              `https://example.test/xapi/activities/${placement.idSuffix}-context-category-invalid-array`,
            ),
            "not-an-activity",
          ],
        }),
      ),
      requirementRefs: contextActivityValueRequirementRefs,
    })),
  });

  const contextActivitiesRoundTripCases = contextPlacements.flatMap((placement) =>
    contextActivityKinds.map((kind) => {
      const activityId = `https://example.test/xapi/activities/${placement.idSuffix}-context-roundtrip-${kind}`;
      const statementId = buildProofUuid(
        placement.idSuffix === "statement"
          ? 934 + contextActivityKinds.indexOf(kind)
          : 938 + contextActivityKinds.indexOf(kind),
      );

      return statementRoundTripCase({
        caseId: `v2.statements.context.context-activities-roundtrip.${placement.idSuffix}-${kind}`,
        title: `The Statements resource returns ${placement.title} contextActivities ${kind} values as arrays`,
        specVersion,
        queryParam: "statementId",
        requirementRefs: contextActivityRoundTripRequirementRefs,
        tags: ["v2.0.0", "statements", "context", "context-activities", "retrieval"],
        capabilityFlags: ["query", "retrieval", "context-activities"],
        legacyTraceSuiteFile: contextLegacySuiteFile,
        legacyTraceConfigFile: contextActivitiesLegacyConfigFile,
        transforms: [
          {
            operation: "set",
            path: ["id"],
            value: statementId,
          },
          ...placement.buildTransforms(
            buildContextActivitiesFixture({
              [kind]: buildContextActivityFixture(activityId),
            } as JsonObject),
          ),
        ],
        queryJsonPathEquals: [
          {
            path: buildContextActivitiesRoundTripPath(placement.idSuffix, kind),
            equals: [buildContextActivityFixture(activityId)],
          },
        ],
        notes: ["proof-slice contextActivities retrieval returns arrays"],
      });
    }),
  );

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
        children: [
          ...formattingCases,
          ...nullValueCases,
          ...wrongTypeCases,
          ...invalidFormatCases,
          ...iriSchemeCases,
          ...mboxIriCases,
          ...mboxMailtoCases,
          ...mboxSha1sumCases,
          ...openIdCases,
          ...accountHomePageMissingCases,
          ...accountHomePageInvalidCases,
          ...accountNameMissingCases,
          ...agentIfiAcceptanceCases,
          ...agentIfiRequiredCases,
          ...groupIfiOrMemberRequiredCases,
          ...groupIfiAcceptanceCases,
          ...groupIfiAcceptanceNoMemberCases,
          ...agentIfiExclusivityCases,
          ...groupIfiExclusivityCases,
          ...attachmentIriCases,
          ...caseSensitiveKeyCases,
          ...interactionTypeCaseCases,
          ...extensionKeyCases,
          ...languageTagAcceptanceCases,
          ...languageTagRejectionCases,
          ...malformedObjectTypeCases,
          precisionCase,
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.statements.authority",
        title: "Statement Authority",
        specVersion,
        tags: ["authority"],
        children: [
          ...authorityGroupAcceptanceCases,
          authorityPopulationCase,
          authorityNonOauthMembersCase,
          ...authorityGroupRejectionCases,
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.statements.result-and-objects",
        title: "Statement Result And Object Requirements",
        specVersion,
        tags: ["result", "object"],
        children: [
          {
            type: "suite",
            id: "v2.proof-slice.statements.result-and-objects.result",
            title: "Result",
            specVersion,
            tags: ["result"],
            children: [
              ...resultSuccessTypeCases,
              ...resultCompletionTypeCases,
              ...resultResponseTypeCases,
              ...resultDurationInvalidCases,
              ...resultDurationAcceptanceCases,
              ...resultExtensionsTypeCases,
              ...scoreObjectTypeCases,
              ...scoreScaledAcceptanceCases,
              ...scoreScaledRejectionCases,
              ...scoreRawAcceptanceCases,
              ...scoreRawRejectionCases,
              ...scoreMinAcceptanceCases,
              ...scoreMinRejectionCases,
              ...scoreMaxAcceptanceCases,
              ...scoreMaxRejectionCases,
            ],
          },
          {
            type: "suite",
            id: "v2.proof-slice.statements.result-and-objects.activity-object",
            title: "Activity And Object Typing",
            specVersion,
            tags: ["activity", "object"],
            children: [
              ...objectTypeVocabularyCases,
              ...activityMissingIdCases,
              ...activityInvalidIdCases,
              ...activityObjectTypeGeneratedCases,
              ...activityDefinitionTypeCases,
              ...activityDefinitionNameTypeCases,
              ...activityDefinitionDescriptionTypeCases,
              ...activityInteractionTypeAcceptanceCases,
              ...activityInteractionTypeInvalidCases,
              ...activityCorrectResponsesPatternCases,
              ...activityExtensionsTypeCases,
              ...activityInteractionComponentAcceptanceCases,
              ...activityInteractionComponentNotArrayCases,
              ...activityInteractionComponentEntryNotObjectCases,
              ...activityInteractionComponentIdMissingCases,
              ...activityInteractionComponentIdInvalidCases,
              ...activityInteractionComponentDescriptionTypeCases,
              ...activityInteractionComponentDescriptionLanguageCases,
              ...activityInteractionComponentDuplicateIdCases,
              ...activityInteractionTypeRequiredCases,
              ...objectActorTypeRequiredCases,
            ],
          },
          {
            type: "suite",
            id: "v2.proof-slice.statements.result-and-objects.statement-ref",
            title: "Statement References",
            specVersion,
            tags: ["statement-ref"],
            children: [
              ...statementRefAcceptanceCases,
              ...statementRefObjectTypeCases,
              ...statementRefMissingIdCases,
              ...statementRefInvalidIdCases,
            ],
          },
          {
            type: "suite",
            id: "v2.proof-slice.statements.result-and-objects.substatement",
            title: "SubStatements",
            specVersion,
            tags: ["substatement"],
            children: [
              ...subStatementAcceptanceCases,
              ...subStatementObjectTypeCases,
              ...subStatementMissingFieldCases,
              ...subStatementForbiddenPropertyCases,
              ...subStatementNestedCase,
            ],
          },
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.statements.context",
        title: "Statement Context",
        specVersion,
        tags: ["context"],
        children: [
          {
            type: "suite",
            id: "v2.proof-slice.statements.context.validation",
            title: "Context Validation",
            specVersion,
            tags: ["validation"],
            children: [
              ...invalidRegistrationCases,
              ...invalidTeamCases,
              ...invalidContextActivitiesTypeCases,
              ...invalidRevisionTypeCases,
              ...revisionActivityOnlyRejectionCases,
              ...revisionNoObjectTypeCases,
              ...invalidPlatformTypeCases,
              ...platformActivityOnlyRejectionCases,
              ...platformNoObjectTypeCases,
              ...invalidContextStatementRefCases,
            ],
          },
          {
            type: "suite",
            id: "v2.proof-slice.statements.context.activities",
            title: "Context Activities",
            specVersion,
            tags: ["context-activities"],
            children: [
              ...contextActivityKeyAcceptanceCases,
              ...contextActivityInvalidKeyCases,
              ...contextActivityArrayValueCases,
              ...contextActivityInvalidValueCases,
            ],
          },
          {
            type: "suite",
            id: "v2.proof-slice.statements.context.roundtrip",
            title: "Context Roundtrip",
            specVersion,
            tags: ["retrieval"],
            children: contextActivitiesRoundTripCases,
          },
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.statements.transport",
        title: "Statement Transport",
        specVersion,
        tags: ["transport"],
        children: [
          putRoundTripCase,
          putRequiresStatementIdCase,
          putImmutableCase,
          batchSuccessCase,
          duplicateBatchCase,
          batchRollbackCase,
          voidedStatementQueryCase,
          hiddenVoidedStatementCase,
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.statements.representation",
        title: "Statement Representation",
        specVersion,
        tags: ["representation"],
        children: [
          exactFormatCase,
          canonicalFormatCase,
          idsFormatCase,
          attachmentsMultipartCase,
          attachmentsJsonFallbackCase,
          lastModifiedCase,
          consistentThroughSuccessCase,
          consistentThroughErrorCase,
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.statements.query-validation",
        title: "Statement Query Validation",
        specVersion,
        tags: ["query", "validation"],
        children: queryValidationCases,
      },
      {
        type: "suite",
        id: "v2.proof-slice.statements.query",
        title: "Statement Query",
        specVersion,
        tags: ["query"],
        children: [
          queryCase,
          emptyResultCase,
          agentQueryCase,
          verbQueryCase,
          activityQueryCase,
          registrationQueryCase,
          relatedActivitiesQueryCase,
          relatedAgentsQueryCase,
          sinceQueryCase,
          untilQueryCase,
          limitQueryCase,
          ascendingQueryCase,
          ...statementIdExclusivityCases,
          ...voidedStatementIdExclusivityCases,
        ],
      },
    ],
  };
}

export function createV20StateResourceProofSliceSuite(): SuiteDefinition {
  const stateDocument = buildActivityStateDocumentFixture();
  const stateIdentity = buildActivityStateIdentityFixture();
  const stateListIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/state-proof-slice/list",
    stateId: "proof-state-list",
  });
  const stateSinceIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/state-proof-slice/since",
    stateId: "proof-state-since",
  });
  const stateMergeIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/state-proof-slice/merge",
    stateId: "proof-state-merge",
  });
  const stateNonJsonPostRejectIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/state-proof-slice/merge-reject-post",
    stateId: "proof-state-merge-reject-post",
  });
  const stateExistingNonJsonRejectIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/state-proof-slice/merge-reject-existing",
    stateId: "proof-state-merge-reject-existing",
  });
  const stateDeleteIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/state-proof-slice/delete",
    stateId: "proof-state-delete",
  });
  const stateListQuery = {
    activityId: stateListIdentity.activityId,
    agent: stateListIdentity.agent,
  };
  const stateSinceQuery = {
    activityId: stateSinceIdentity.activityId,
    agent: stateSinceIdentity.agent,
  };
  const stateDeleteQuery = {
    activityId: stateDeleteIdentity.activityId,
    agent: stateDeleteIdentity.agent,
  };

  const stateRoundTripCase = documentRoundTripCase({
    caseId: "v2.activities-state.document-roundtrip",
    title: "The State Resource returns a stored document when queried by stateId",
    specVersion,
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
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
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

  const stateListCase = requestSequenceCase({
    caseId: "v2.activities-state.document-list",
    title: "The State Resource lists stored state ids when queried without stateId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00193",
        section: "Communication 2.3.s4",
        title: "State Resource GET without stateId returns matching ids",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "list"],
    capabilityFlags: ["document", "list", "state"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: ["proof-slice activity state list"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", stateListIdentity, {
          value: buildActivityStateDocumentFixture(),
          fixtureName: "activity-state-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-state", stateListQuery),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([stateListIdentity.stateId]),
        },
      },
    ],
  });

  const stateSinceCase = requestSequenceCase({
    caseId: "v2.activities-state.document-list-since",
    title: "The State Resource filters listed state ids using the since parameter",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00221",
        section: "Communication 2.3.s4",
        title: "State Resource GET without stateId accepts since",
      },
      {
        id: "XAPI-00195",
        section: "Communication 2.3.s4",
        title: "State Resource list results can be filtered by since",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "list", "since"],
    capabilityFlags: ["document", "list", "state", "since"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: ["proof-slice activity state since filtering"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", stateSinceIdentity, {
          value: buildActivityStateDocumentFixture(),
          fixtureName: "activity-state-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-state", {
          ...stateSinceQuery,
          since: validSinceTimestamp,
        }),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([stateSinceIdentity.stateId]),
        },
      },
    ],
  });

  const stateInvalidSinceCase = singleRequestCase({
    caseId: "v2.activities-state.invalid-since",
    title: "The State Resource rejects an invalid since value when listing state ids",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00204",
        section: "Communication 2.3.s4",
        title: "State Resource rejects invalid since values",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "list", "since"],
    capabilityFlags: ["document", "list", "state", "since"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    request: buildVersionedRequest("GET", "activities-state", {
      activityId: stateSinceIdentity.activityId,
      agent: stateSinceIdentity.agent,
      since: invalidSinceTimestamp,
    }),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice activity state invalid since"],
  });

  const stateInvalidAgentQueryCase = singleRequestCase({
    caseId: "v2.activities-state.document-invalid-agent-query",
    title: "The State Resource rejects a POST request whose agent query value is not valid JSON",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00235",
        section: "Communication 2.3",
        title: "State Resource rejects invalid JSON agent query values",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "invalid", "agent-query"],
    capabilityFlags: ["document", "state", "invalid", "agent-query"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    request: buildVersionedRequest(
      "POST",
      "activities-state",
      {
        ...stateMergeIdentity,
        stateId: `${stateMergeIdentity.stateId}-invalid-agent`,
        agent: invalidAgentQuery,
      },
      {
        value: {
          car: "Honda",
        },
      },
    ),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice activity state invalid agent query"],
  });

  const stateMergeCase = requestSequenceCase({
    caseId: "v2.activities-state.document-merge",
    title: "The State Resource merges JSON documents on POST when a state document already exists",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00234",
        section: "Communication 2.2.s7",
        title: "State Resource performs JSON document merge",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "merge"],
    capabilityFlags: ["document", "merge", "state"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: ["proof-slice activity state merge"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", stateMergeIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "activities-state", stateMergeIdentity, {
          value: {
            type: "Civic",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-state", stateMergeIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["car"],
              equals: "Honda",
            },
            {
              path: ["type"],
              equals: "Civic",
            },
          ],
        },
      },
    ],
  });

  const stateNonJsonPostRejectCase = requestSequenceCase({
    caseId: "v2.activities-state.document-merge-rejects-non-json-post",
    title: "The State Resource rejects a POST merge when the incoming document is not application/json",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00229",
        section: "Communication 2.3.s3.table1.row3",
        title: "State Resource rejects non-JSON POST merges without mutation",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "merge", "invalid"],
    capabilityFlags: ["document", "merge", "state", "invalid"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: ["proof-slice activity state non-json incoming merge rejection"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", stateNonJsonPostRejectIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "activities-state", stateNonJsonPostRejectIdentity, {
          kind: "text",
          value: nonJsonDocumentBody,
          contentType: "not/json",
        }),
        assertion: {
          status: 400,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-state", stateNonJsonPostRejectIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["car"],
              equals: "Honda",
            },
          ],
        },
      },
    ],
  });

  const stateExistingNonJsonRejectCase = requestSequenceCase({
    caseId: "v2.activities-state.document-merge-rejects-existing-non-json",
    title: "The State Resource rejects a POST merge when the existing document is not application/json",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00229",
        section: "Communication 2.3.s3.table1.row3",
        title: "State Resource rejects merges against non-JSON stored documents",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "merge", "invalid"],
    capabilityFlags: ["document", "merge", "state", "invalid"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: ["proof-slice activity state existing non-json merge rejection"],
    steps: [
      {
        request: buildVersionedRequest("PUT", "activities-state", stateExistingNonJsonRejectIdentity, {
          kind: "text",
          value: existingNonJsonDocumentBody,
          contentType: "application/octet-stream",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "activities-state", stateExistingNonJsonRejectIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 400,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-state", stateExistingNonJsonRejectIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: [],
              equals: existingNonJsonDocumentBody,
            },
          ],
        },
      },
    ],
  });

  const stateDeleteCase = requestSequenceCase({
    caseId: "v2.activities-state.delete-context-documents",
    title: "The State Resource deletes matching documents when DELETE omits stateId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00194",
        section: "Communication 2.3.s5",
        title: "State Resource DELETE without stateId deletes matching documents",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "delete"],
    capabilityFlags: ["document", "delete", "state"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: ["proof-slice activity state delete"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", stateDeleteIdentity, {
          value: buildActivityStateDocumentFixture(),
          fixtureName: "activity-state-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("DELETE", "activities-state", stateDeleteQuery),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-state", stateDeleteQuery),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([]),
        },
      },
    ],
  });

  return {
    type: "suite",
    id: "v2.proof-slice.activities-state",
    title: "State Resource",
    specVersion,
    tags: ["proof-slice", "activities-state"],
    children: [
      {
        type: "suite",
        id: "v2.proof-slice.activities-state.roundtrip",
        title: "State Document Roundtrip",
        specVersion,
        tags: ["roundtrip"],
        children: [stateRoundTripCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-state.listing",
        title: "State Document Listing",
        specVersion,
        tags: ["list"],
        children: [stateListCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-state.since",
        title: "State Document Since",
        specVersion,
        tags: ["list", "since"],
        children: [stateSinceCase, stateInvalidSinceCase, stateInvalidAgentQueryCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-state.merge",
        title: "State Document Merge",
        specVersion,
        tags: ["merge"],
        children: [stateMergeCase, stateNonJsonPostRejectCase, stateExistingNonJsonRejectCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-state.deletion",
        title: "State Document Deletion",
        specVersion,
        tags: ["delete"],
        children: [stateDeleteCase],
      },
    ],
  };
}

export function createV20ActivityProfileResourceProofSliceSuite(): SuiteDefinition {
  const profileDocument = buildActivityProfileDocumentFixture();
  const profileIdentity = buildActivityProfileIdentityFixture();
  const profileListIdentity = buildActivityProfileIdentityFixture({
    activityId: "https://example.test/xapi/activities/profile-proof-slice/list",
    profileId: "proof-activity-profile-list",
  });
  const profileSinceIdentity = buildActivityProfileIdentityFixture({
    activityId: "https://example.test/xapi/activities/profile-proof-slice/since",
    profileId: "proof-activity-profile-since",
  });
  const profileMergeIdentity = buildActivityProfileIdentityFixture({
    activityId: "https://example.test/xapi/activities/profile-proof-slice/merge",
    profileId: "proof-activity-profile-merge",
  });
  const profileNonJsonPostRejectIdentity = buildActivityProfileIdentityFixture({
    activityId: "https://example.test/xapi/activities/profile-proof-slice/merge-reject-post",
    profileId: "proof-activity-profile-merge-reject-post",
  });
  const profileExistingNonJsonRejectIdentity = buildActivityProfileIdentityFixture({
    activityId: "https://example.test/xapi/activities/profile-proof-slice/merge-reject-existing",
    profileId: "proof-activity-profile-merge-reject-existing",
  });
  const profileDeleteIdentity = buildActivityProfileIdentityFixture({
    activityId: "https://example.test/xapi/activities/profile-proof-slice/delete",
    profileId: "proof-activity-profile-delete",
  });
  const profileListQuery = {
    activityId: profileListIdentity.activityId,
  };
  const profileSinceQuery = {
    activityId: profileSinceIdentity.activityId,
  };
  const profileDeleteListQuery = {
    activityId: profileDeleteIdentity.activityId,
  };

  const roundTripCase = documentRoundTripCase({
    caseId: "v2.activities-profile.document-roundtrip",
    title: "The Activity Profile Resource returns a stored document when queried by profileId",
    specVersion,
    endpoint: "activities-profile",
    submitMethod: "POST",
    requirementRefs: [
      {
        id: "XAPI-00288",
        section: "Communication 2.7.s3",
        title: "Activity Profile GET with profileId returns the stored document",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "roundtrip"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    query: profileIdentity,
    body: profileDocument,
    bodyFixtureName: "activity-profile-default",
    queryJsonPathEquals: [
      {
        path: ["summary"],
        equals: profileDocument.summary,
      },
      {
        path: ["metadata", "audience"],
        equals: profileDocument.metadata.audience,
      },
      {
        path: ["metadata", "level"],
        equals: profileDocument.metadata.level,
      },
    ],
    capabilityFlags: ["document", "retrieval", "activity-profile"],
    notes: ["proof-slice activity profile roundtrip"],
  });

  const listCase = requestSequenceCase({
    caseId: "v2.activities-profile.document-list",
    title: "The Activity Profile Resource lists stored profile ids when queried without profileId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00289",
        section: "Communication 2.7.s4",
        title: "Activity Profile GET without profileId returns matching ids",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "list"],
    capabilityFlags: ["document", "list", "activity-profile"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: ["proof-slice activity profile list"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-profile", profileListIdentity, {
          value: buildActivityProfileDocumentFixture(),
          fixtureName: "activity-profile-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-profile", profileListQuery),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([profileListIdentity.profileId]),
        },
      },
    ],
  });

  const sinceCase = requestSequenceCase({
    caseId: "v2.activities-profile.document-list-since",
    title: "The Activity Profile Resource filters listed profile ids using the since parameter",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00303",
        section: "Communication 2.7.s4",
        title: "Activity Profile GET without profileId accepts since",
      },
      {
        id: "XAPI-00294",
        section: "Communication 2.7.s4",
        title: "Activity Profile list results can be filtered by since",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "list", "since"],
    capabilityFlags: ["document", "list", "activity-profile", "since"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: ["proof-slice activity profile since filtering"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-profile", profileSinceIdentity, {
          value: buildActivityProfileDocumentFixture(),
          fixtureName: "activity-profile-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-profile", {
          ...profileSinceQuery,
          since: validSinceTimestamp,
        }),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([profileSinceIdentity.profileId]),
        },
      },
    ],
  });

  const invalidSinceCase = singleRequestCase({
    caseId: "v2.activities-profile.invalid-since",
    title: "The Activity Profile Resource rejects an invalid since value when listing profile ids",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00295",
        section: "Communication 2.7.s4",
        title: "Activity Profile rejects invalid since values",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "list", "since"],
    capabilityFlags: ["document", "list", "activity-profile", "since"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    request: buildVersionedRequest("GET", "activities-profile", {
      activityId: profileSinceIdentity.activityId,
      since: invalidSinceTimestamp,
    }),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice activity profile invalid since"],
  });

  const invalidJsonPostCase = singleRequestCase({
    caseId: "v2.activities-profile.document-invalid-json-post",
    title: "The Activity Profile Resource rejects a POST request with an invalid JSON document body",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00314",
        section: "Communication 2.7.s4.table1.row2",
        title: "Activity Profile rejects invalid JSON document bodies",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "invalid", "json"],
    capabilityFlags: ["document", "activity-profile", "invalid", "json"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    request: buildVersionedRequest(
      "POST",
      "activities-profile",
      {
        ...profileMergeIdentity,
        profileId: `${profileMergeIdentity.profileId}-invalid-json`,
      },
      {
        kind: "text",
        value: invalidJsonDocumentBody,
        contentType: "application/json",
      },
    ),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice activity profile invalid JSON document body"],
  });

  const mergeCase = requestSequenceCase({
    caseId: "v2.activities-profile.document-merge",
    title: "The Activity Profile Resource merges JSON documents on POST when a profile already exists",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00308",
        section: "Communication 2.2.s7",
        title: "Activity Profile performs JSON document merge",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "merge"],
    capabilityFlags: ["document", "merge", "activity-profile"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: ["proof-slice activity profile merge"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-profile", profileMergeIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "activities-profile", profileMergeIdentity, {
          value: {
            type: "Civic",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-profile", profileMergeIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["car"],
              equals: "Honda",
            },
            {
              path: ["type"],
              equals: "Civic",
            },
          ],
        },
      },
    ],
  });

  const nonJsonPostRejectCase = requestSequenceCase({
    caseId: "v2.activities-profile.document-merge-rejects-non-json-post",
    title: "The Activity Profile Resource rejects a POST merge when the incoming document is not application/json",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00313",
        section: "Communication 2.7.s3.table1.row3",
        title: "Activity Profile rejects non-JSON POST merges without mutation",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "merge", "invalid"],
    capabilityFlags: ["document", "merge", "activity-profile", "invalid"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: ["proof-slice activity profile non-json incoming merge rejection"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-profile", profileNonJsonPostRejectIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "activities-profile", profileNonJsonPostRejectIdentity, {
          kind: "text",
          value: nonJsonDocumentBody,
          contentType: "application/octet-stream",
        }),
        assertion: {
          status: 400,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-profile", profileNonJsonPostRejectIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["car"],
              equals: "Honda",
            },
          ],
        },
      },
    ],
  });

  const existingNonJsonRejectCase = requestSequenceCase({
    caseId: "v2.activities-profile.document-merge-rejects-existing-non-json",
    title: "The Activity Profile Resource rejects a POST merge when the existing document is not application/json",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00313",
        section: "Communication 2.7.s3.table1.row3",
        title: "Activity Profile rejects merges against non-JSON stored documents",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "merge", "invalid"],
    capabilityFlags: ["document", "merge", "activity-profile", "invalid"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: ["proof-slice activity profile existing non-json merge rejection"],
    steps: [
      {
        request: buildVersionedRequest("PUT", "activities-profile", profileExistingNonJsonRejectIdentity, {
          kind: "text",
          value: existingNonJsonDocumentBody,
          contentType: "application/octet-stream",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "activities-profile", profileExistingNonJsonRejectIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 400,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-profile", profileExistingNonJsonRejectIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: [],
              equals: existingNonJsonDocumentBody,
            },
          ],
        },
      },
    ],
  });

  const deleteCase = requestSequenceCase({
    caseId: "v2.activities-profile.delete-document",
    title: "The Activity Profile Resource deletes a stored document and removes it from profile listings",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00285",
        section: "Communication 2.7.s3",
        title: "Activity Profile DELETE removes the associated profile",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "delete"],
    capabilityFlags: ["document", "delete", "activity-profile"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: ["proof-slice activity profile delete"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-profile", profileDeleteIdentity, {
          value: buildActivityProfileDocumentFixture(),
          fixtureName: "activity-profile-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("DELETE", "activities-profile", profileDeleteIdentity),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-profile", profileDeleteListQuery),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([]),
        },
      },
    ],
  });

  return {
    type: "suite",
    id: "v2.proof-slice.activities-profile",
    title: "Activity Profile Resource",
    specVersion,
    tags: ["proof-slice", "activities-profile"],
    children: [
      {
        type: "suite",
        id: "v2.proof-slice.activities-profile.roundtrip",
        title: "Activity Profile Roundtrip",
        specVersion,
        tags: ["roundtrip"],
        children: [roundTripCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-profile.listing",
        title: "Activity Profile Listing",
        specVersion,
        tags: ["list"],
        children: [listCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-profile.since",
        title: "Activity Profile Since",
        specVersion,
        tags: ["list", "since"],
        children: [sinceCase, invalidSinceCase, invalidJsonPostCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-profile.merge",
        title: "Activity Profile Merge",
        specVersion,
        tags: ["merge"],
        children: [mergeCase, nonJsonPostRejectCase, existingNonJsonRejectCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-profile.deletion",
        title: "Activity Profile Deletion",
        specVersion,
        tags: ["delete"],
        children: [deleteCase],
      },
    ],
  };
}

export function createV20AgentProfileResourceProofSliceSuite(): SuiteDefinition {
  const profileDocument = buildAgentProfileDocumentFixture();
  const profileIdentity = buildAgentProfileIdentityFixture();
  const profileListIdentity = buildAgentProfileIdentityFixture({
    agent: JSON.stringify({
      objectType: "Agent",
      mbox: "mailto:agent-profile-list@example.test",
      name: "Agent Profile List",
    }),
    profileId: "proof-agent-profile-list",
  });
  const profileSinceIdentity = buildAgentProfileIdentityFixture({
    agent: JSON.stringify({
      objectType: "Agent",
      mbox: "mailto:agent-profile-since@example.test",
      name: "Agent Profile Since",
    }),
    profileId: "proof-agent-profile-since",
  });
  const profileMergeIdentity = buildAgentProfileIdentityFixture({
    agent: JSON.stringify({
      objectType: "Agent",
      mbox: "mailto:agent-profile-merge@example.test",
      name: "Agent Profile Merge",
    }),
    profileId: "proof-agent-profile-merge",
  });
  const profileNonJsonPostRejectIdentity = buildAgentProfileIdentityFixture({
    agent: JSON.stringify({
      objectType: "Agent",
      mbox: "mailto:agent-profile-merge-reject-post@example.test",
      name: "Agent Profile Merge Reject Post",
    }),
    profileId: "proof-agent-profile-merge-reject-post",
  });
  const profileExistingNonJsonRejectIdentity = buildAgentProfileIdentityFixture({
    agent: JSON.stringify({
      objectType: "Agent",
      mbox: "mailto:agent-profile-merge-reject-existing@example.test",
      name: "Agent Profile Merge Reject Existing",
    }),
    profileId: "proof-agent-profile-merge-reject-existing",
  });
  const profileDeleteIdentity = buildAgentProfileIdentityFixture({
    agent: JSON.stringify({
      objectType: "Agent",
      mbox: "mailto:agent-profile-delete@example.test",
      name: "Agent Profile Delete",
    }),
    profileId: "proof-agent-profile-delete",
  });
  const profileListQuery = {
    agent: profileListIdentity.agent,
  };
  const profileSinceQuery = {
    agent: profileSinceIdentity.agent,
  };
  const profileDeleteListQuery = {
    agent: profileDeleteIdentity.agent,
  };

  const roundTripCase = documentRoundTripCase({
    caseId: "v2.agents-profile.document-roundtrip",
    title: "The Agent Profile Resource returns a stored document when queried by profileId",
    specVersion,
    endpoint: "agents-profile",
    submitMethod: "POST",
    requirementRefs: [
      {
        id: "XAPI-00269",
        section: "Communication 2.6.s3",
        title: "Agent Profile GET with profileId returns the stored document",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "roundtrip"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    query: profileIdentity,
    body: profileDocument,
    bodyFixtureName: "agent-profile-default",
    queryJsonPathEquals: [
      {
        path: ["preference"],
        equals: profileDocument.preference,
      },
      {
        path: ["notifications", "email"],
        equals: profileDocument.notifications.email,
      },
      {
        path: ["notifications", "digest"],
        equals: profileDocument.notifications.digest,
      },
    ],
    capabilityFlags: ["document", "retrieval", "agent-profile"],
    notes: ["proof-slice agent profile roundtrip"],
  });

  const listCase = requestSequenceCase({
    caseId: "v2.agents-profile.document-list",
    title: "The Agent Profile Resource lists stored profile ids when queried without profileId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00270",
        section: "Communication 2.6.s4",
        title: "Agent Profile GET without profileId returns matching ids",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "list"],
    capabilityFlags: ["document", "list", "agent-profile"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: ["proof-slice agent profile list"],
    steps: [
      {
        request: buildVersionedRequest("POST", "agents-profile", profileListIdentity, {
          value: buildAgentProfileDocumentFixture(),
          fixtureName: "agent-profile-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "agents-profile", profileListQuery),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([profileListIdentity.profileId]),
        },
      },
    ],
  });

  const sinceCase = requestSequenceCase({
    caseId: "v2.agents-profile.document-list-since",
    title: "The Agent Profile Resource filters listed profile ids using the since parameter",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00268",
        section: "Communication 2.6.s4",
        title: "Agent Profile GET without profileId accepts since",
      },
      {
        id: "XAPI-00275",
        section: "Communication 2.6.s4",
        title: "Agent Profile list results can be filtered by since",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "list", "since"],
    capabilityFlags: ["document", "list", "agent-profile", "since"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: ["proof-slice agent profile since filtering"],
    steps: [
      {
        request: buildVersionedRequest("POST", "agents-profile", profileSinceIdentity, {
          value: buildAgentProfileDocumentFixture(),
          fixtureName: "agent-profile-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "agents-profile", {
          ...profileSinceQuery,
          since: validSinceTimestamp,
        }),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([profileSinceIdentity.profileId]),
        },
      },
    ],
  });

  const invalidSinceCase = singleRequestCase({
    caseId: "v2.agents-profile.invalid-since",
    title: "The Agent Profile Resource rejects an invalid since value when listing profile ids",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00260",
        section: "Communication 2.6.s4",
        title: "Agent Profile rejects invalid since values",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "list", "since"],
    capabilityFlags: ["document", "list", "agent-profile", "since"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    request: buildVersionedRequest("GET", "agents-profile", {
      agent: profileSinceIdentity.agent,
      since: invalidSinceTimestamp,
    }),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice agent profile invalid since"],
  });

  const invalidAgentQueryCase = singleRequestCase({
    caseId: "v2.agents-profile.document-invalid-agent-query",
    title: "The Agent Profile Resource rejects a POST request whose agent query value is not valid JSON",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00284",
        section: "Communication 2.6",
        title: "Agent Profile rejects invalid JSON agent query values",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "invalid", "agent-query"],
    capabilityFlags: ["document", "agent-profile", "invalid", "agent-query"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    request: buildVersionedRequest(
      "POST",
      "agents-profile",
      {
        ...profileMergeIdentity,
        profileId: `${profileMergeIdentity.profileId}-invalid-agent`,
        agent: invalidAgentQuery,
      },
      {
        value: {
          car: "Honda",
        },
      },
    ),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice agent profile invalid agent query"],
  });

  const mergeCase = requestSequenceCase({
    caseId: "v2.agents-profile.document-merge",
    title: "The Agent Profile Resource merges JSON documents on POST when a profile already exists",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00279",
        section: "Communication 2.2.s7",
        title: "Agent Profile performs JSON document merge",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "merge"],
    capabilityFlags: ["document", "merge", "agent-profile"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: ["proof-slice agent profile merge"],
    steps: [
      {
        request: buildVersionedRequest("POST", "agents-profile", profileMergeIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "agents-profile", profileMergeIdentity, {
          value: {
            type: "Civic",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "agents-profile", profileMergeIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["car"],
              equals: "Honda",
            },
            {
              path: ["type"],
              equals: "Civic",
            },
          ],
        },
      },
    ],
  });

  const nonJsonPostRejectCase = requestSequenceCase({
    caseId: "v2.agents-profile.document-merge-rejects-non-json-post",
    title: "The Agent Profile Resource rejects a POST merge when the incoming document is not application/json",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00278",
        section: "Communication 2.3.s3.table1.row3",
        title: "Agent Profile rejects non-JSON POST merges without mutation",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "merge", "invalid"],
    capabilityFlags: ["document", "merge", "agent-profile", "invalid"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: ["proof-slice agent profile non-json incoming merge rejection"],
    steps: [
      {
        request: buildVersionedRequest("POST", "agents-profile", profileNonJsonPostRejectIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "agents-profile", profileNonJsonPostRejectIdentity, {
          kind: "text",
          value: nonJsonDocumentBody,
          contentType: "application/octet-stream",
        }),
        assertion: {
          status: 400,
        },
      },
      {
        request: buildVersionedRequest("GET", "agents-profile", profileNonJsonPostRejectIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["car"],
              equals: "Honda",
            },
          ],
        },
      },
    ],
  });

  const existingNonJsonRejectCase = requestSequenceCase({
    caseId: "v2.agents-profile.document-merge-rejects-existing-non-json",
    title: "The Agent Profile Resource rejects a POST merge when the existing document is not application/json",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00278",
        section: "Communication 2.3.s3.table1.row3",
        title: "Agent Profile rejects merges against non-JSON stored documents",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "merge", "invalid"],
    capabilityFlags: ["document", "merge", "agent-profile", "invalid"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: ["proof-slice agent profile existing non-json merge rejection"],
    steps: [
      {
        request: buildVersionedRequest("PUT", "agents-profile", profileExistingNonJsonRejectIdentity, {
          kind: "text",
          value: existingNonJsonDocumentBody,
          contentType: "application/octet-stream",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "agents-profile", profileExistingNonJsonRejectIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 400,
        },
      },
      {
        request: buildVersionedRequest("GET", "agents-profile", profileExistingNonJsonRejectIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: [],
              equals: existingNonJsonDocumentBody,
            },
          ],
        },
      },
    ],
  });

  const deleteCase = requestSequenceCase({
    caseId: "v2.agents-profile.delete-document",
    title: "The Agent Profile Resource deletes a stored document and removes it from profile listings",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00271",
        section: "Communication 2.6.s3",
        title: "Agent Profile DELETE removes the associated profile",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "delete"],
    capabilityFlags: ["document", "delete", "agent-profile"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: ["proof-slice agent profile delete"],
    steps: [
      {
        request: buildVersionedRequest("POST", "agents-profile", profileDeleteIdentity, {
          value: buildAgentProfileDocumentFixture(),
          fixtureName: "agent-profile-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("DELETE", "agents-profile", profileDeleteIdentity),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "agents-profile", profileDeleteListQuery),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([]),
        },
      },
    ],
  });

  return {
    type: "suite",
    id: "v2.proof-slice.agents-profile",
    title: "Agent Profile Resource",
    specVersion,
    tags: ["proof-slice", "agents-profile"],
    children: [
      {
        type: "suite",
        id: "v2.proof-slice.agents-profile.roundtrip",
        title: "Agent Profile Roundtrip",
        specVersion,
        tags: ["roundtrip"],
        children: [roundTripCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.agents-profile.listing",
        title: "Agent Profile Listing",
        specVersion,
        tags: ["list"],
        children: [listCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.agents-profile.since",
        title: "Agent Profile Since",
        specVersion,
        tags: ["list", "since"],
        children: [sinceCase, invalidSinceCase, invalidAgentQueryCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.agents-profile.merge",
        title: "Agent Profile Merge",
        specVersion,
        tags: ["merge"],
        children: [mergeCase, nonJsonPostRejectCase, existingNonJsonRejectCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.agents-profile.deletion",
        title: "Agent Profile Deletion",
        specVersion,
        tags: ["delete"],
        children: [deleteCase],
      },
    ],
  };
}

export function createV20AgentsResourceProofSliceSuite(): SuiteDefinition {
  const roundTripMbox = "mailto:agents-resource-roundtrip@example.test";
  const nameMergeMbox = "mailto:agents-resource-name-merge@example.test";
  const mboxResourceValue = "mailto:agents-resource-mbox@example.test";
  const mboxSha1sumValue = "0123456789abcdef0123456789abcdef01234567";
  const openIdValue = "https://example.test/agents/openid-resource";
  const accountHomePage = "https://example.test/agents/account-homepage";
  const accountName = "resource-account";
  const unknownAgentMbox = "mailto:agents-resource-unknown@example.test";

  const roundTripStatement = buildProofStatement(240, [
    {
      operation: "set",
      path: ["actor"],
      value: {
        objectType: "Agent",
        mbox: roundTripMbox,
        name: "Roundtrip Agent",
      },
    },
  ]);
  const nameMergeStatementOne = buildProofStatement(241, [
    {
      operation: "set",
      path: ["actor"],
      value: {
        objectType: "Agent",
        mbox: nameMergeMbox,
        name: "Alpha Name",
      },
    },
  ]);
  const nameMergeStatementTwo = buildProofStatement(242, [
    {
      operation: "set",
      path: ["actor"],
      value: {
        objectType: "Agent",
        mbox: nameMergeMbox,
        name: "Beta Name",
      },
    },
  ]);
  const mboxStatement = buildProofStatement(243, [
    {
      operation: "set",
      path: ["actor"],
      value: {
        objectType: "Agent",
        mbox: mboxResourceValue,
        name: "Mailbox Agent",
      },
    },
  ]);
  const mboxSha1sumStatement = buildProofStatement(244, [
    {
      operation: "set",
      path: ["actor"],
      value: buildAgentWithMboxSha1sum(mboxSha1sumValue),
    },
  ]);
  const openIdStatement = buildProofStatement(245, [
    {
      operation: "set",
      path: ["actor"],
      value: buildAgentWithOpenId(openIdValue),
    },
  ]);
  const accountStatement = buildProofStatement(246, [
    {
      operation: "set",
      path: ["actor"],
      value: buildAgentWithAccount(buildAccount(accountHomePage, accountName)),
    },
  ]);

  const roundTripCase = requestSequenceCase({
    caseId: "v2.agents.resource.roundtrip",
    title: "The Agents Resource accepts GET requests and returns a Person Object for a stored Agent",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00245",
        section: "Communication 2.4",
        title: "The Agents Resource exists at /agents",
      },
      {
        id: "XAPI-00236",
        section: "Communication 2.4.s2",
        title: "The Agents Resource accepts GET requests",
      },
      {
        id: "XAPI-00248",
        section: "Communication 2.4.s2.table1.row1",
        title: "The Agents Resource returns a Person Object for the queried Agent",
      },
    ],
    tags: ["v2.0.0", "agents", "resource", "roundtrip"],
    capabilityFlags: ["agents", "retrieval"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    notes: ["proof-slice agents resource roundtrip"],
    steps: [
      {
        request: buildStatementPostRequest(roundTripStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildAgentsGetRequest({
          objectType: "Agent",
          mbox: roundTripMbox,
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["objectType"],
              equals: "Person",
            },
            {
              path: ["mbox"],
              equals: [roundTripMbox],
            },
          ],
        },
      },
    ],
  });

  const missingAgentCase = singleRequestCase({
    caseId: "v2.agents.resource.missing-agent",
    title: "The Agents Resource rejects a GET request without the agent parameter",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00243",
        section: "Communication 2.4.s2.table1.row1",
        title: "The Agents Resource rejects requests without agent",
      },
    ],
    tags: ["v2.0.0", "agents", "resource", "validation"],
    capabilityFlags: ["agents", "validation"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    request: buildVersionedRequest("GET", "agents", {}),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice agents resource missing agent"],
  });

  const invalidAgentCase = singleRequestCase({
    caseId: "v2.agents.resource.invalid-agent",
    title: "The Agents Resource rejects a GET request whose agent parameter is not a valid Agent",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00249",
        section: "Communication 2.4",
        title: "The Agents Resource rejects invalid agent query values",
      },
    ],
    tags: ["v2.0.0", "agents", "resource", "validation"],
    capabilityFlags: ["agents", "validation"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    request: buildAgentsGetRequest(invalidAgentQuery),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice agents resource invalid agent query"],
  });

  const nameArrayCase = requestSequenceCase({
    caseId: "v2.agents.resource.name-array",
    title: "The Agents Resource returns a Person name array merged from matching Agent data",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00238",
        section: "Communication 2.4.s5.table1.row2",
        title: "A Person name property is an array of strings",
      },
    ],
    tags: ["v2.0.0", "agents", "resource", "person"],
    capabilityFlags: ["agents", "retrieval", "person"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    notes: ["proof-slice agents resource name array"],
    steps: [
      {
        request: buildStatementPostRequest(nameMergeStatementOne),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementPostRequest(nameMergeStatementTwo),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildAgentsGetRequest({
          objectType: "Agent",
          mbox: nameMergeMbox,
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["name"],
              equals: ["Alpha Name", "Beta Name"],
            },
          ],
        },
      },
    ],
  });

  const mboxCase = requestSequenceCase({
    caseId: "v2.agents.resource.mbox-array",
    title: "The Agents Resource returns Person mbox values as a mailto IRI array",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00239",
        section: "Communication 2.4.s5.table1.row3",
        title: "A Person mbox property is an array of IRIs",
      },
      {
        id: "XAPI-00244",
        section: "Communication 2.4.s5.table1.row3",
        title: "A Person mbox value has the form mailto:emailaddress",
      },
    ],
    tags: ["v2.0.0", "agents", "resource", "person"],
    capabilityFlags: ["agents", "retrieval", "person"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    notes: ["proof-slice agents resource mbox array"],
    steps: [
      {
        request: buildStatementPostRequest(mboxStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildAgentsGetRequest({
          objectType: "Agent",
          mbox: mboxResourceValue,
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["mbox"],
              equals: [mboxResourceValue],
            },
          ],
        },
      },
    ],
  });

  const mboxSha1sumCase = requestSequenceCase({
    caseId: "v2.agents.resource.mbox-sha1sum-array",
    title: "The Agents Resource returns Person mbox_sha1sum values as a string array",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00240",
        section: "Communication 2.4.s5.table1.row4",
        title: "A Person mbox_sha1sum property is an array of strings",
      },
    ],
    tags: ["v2.0.0", "agents", "resource", "person"],
    capabilityFlags: ["agents", "retrieval", "person"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    notes: ["proof-slice agents resource mbox_sha1sum array"],
    steps: [
      {
        request: buildStatementPostRequest(mboxSha1sumStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildAgentsGetRequest({
          objectType: "Agent",
          mbox_sha1sum: mboxSha1sumValue,
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["mbox_sha1sum"],
              equals: [mboxSha1sumValue],
            },
          ],
        },
      },
    ],
  });

  const openIdCase = requestSequenceCase({
    caseId: "v2.agents.resource.openid-array",
    title: "The Agents Resource returns Person openid values as a string array",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00241",
        section: "Communication 2.4.s5.table1.row5",
        title: "A Person openid property is an array of strings",
      },
    ],
    tags: ["v2.0.0", "agents", "resource", "person"],
    capabilityFlags: ["agents", "retrieval", "person"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    notes: ["proof-slice agents resource openid array"],
    steps: [
      {
        request: buildStatementPostRequest(openIdStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildAgentsGetRequest({
          objectType: "Agent",
          openid: openIdValue,
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["openid"],
              equals: [openIdValue],
            },
          ],
        },
      },
    ],
  });

  const accountCase = requestSequenceCase({
    caseId: "v2.agents.resource.account-array",
    title: "The Agents Resource returns Person account values as an array of Account objects",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00242",
        section: "Communication 2.4.s5.table1.row6",
        title: "A Person account property is an array of Account objects",
      },
    ],
    tags: ["v2.0.0", "agents", "resource", "person"],
    capabilityFlags: ["agents", "retrieval", "person"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    notes: ["proof-slice agents resource account array"],
    steps: [
      {
        request: buildStatementPostRequest(accountStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildAgentsGetRequest({
          objectType: "Agent",
          account: buildAccount(accountHomePage, accountName),
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["account"],
              equals: [buildAccount(accountHomePage, accountName)],
            },
          ],
        },
      },
    ],
  });

  const unknownAgentFallbackCase = singleRequestCase({
    caseId: "v2.agents.resource.unknown-agent-fallback",
    title: "The Agents Resource still returns a Person Object when no additional Agent data is known",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00247",
        section: "Communication 2.4.s2.table1.row1",
        title: "The Agents Resource still returns a Person when no additional data is known",
      },
    ],
    tags: ["v2.0.0", "agents", "resource", "fallback"],
    capabilityFlags: ["agents", "retrieval", "person"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    request: buildAgentsGetRequest({
      objectType: "Agent",
      mbox: unknownAgentMbox,
    }),
    assertion: {
      status: 200,
      jsonPathEquals: [
        {
          path: ["objectType"],
          equals: "Person",
        },
        {
          path: ["mbox"],
          equals: [unknownAgentMbox],
        },
      ],
    },
    notes: ["proof-slice agents resource unknown agent fallback"],
  });

  return {
    type: "suite",
    id: "v2.proof-slice.agents",
    title: "Agents Resource",
    specVersion,
    tags: ["proof-slice", "agents"],
    children: [
      {
        type: "suite",
        id: "v2.proof-slice.agents.basics",
        title: "Agents Basics",
        specVersion,
        tags: ["agents", "basics"],
        children: [roundTripCase, missingAgentCase, invalidAgentCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.agents.person-shape",
        title: "Agents Person Shape",
        specVersion,
        tags: ["agents", "person"],
        children: [nameArrayCase, mboxCase, mboxSha1sumCase, openIdCase, accountCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.agents.fallback",
        title: "Agents Fallback",
        specVersion,
        tags: ["agents", "fallback"],
        children: [unknownAgentFallbackCase],
      },
    ],
  };
}

export function createV20ActivitiesResourceProofSliceSuite(): SuiteDefinition {
  const completeActivityId = "https://example.test/xapi/activities/resource-complete";
  const mergedActivityId = "https://example.test/xapi/activities/resource-merged";
  const unknownActivityId = "https://example.test/xapi/activities/resource-unknown";

  const completeActivityObject = {
    objectType: "Activity",
    id: completeActivityId,
    definition: {
      name: {
        "en-US": "Complete Activity",
      },
      description: {
        "en-US": "Complete activity description",
      },
      type: "https://example.test/xapi/activity-types/resource-complete",
    },
  } satisfies JsonObject;

  const completeActivityStatement = buildProofStatement(247, [
    {
      operation: "set",
      path: ["object"],
      value: completeActivityObject,
    },
  ]);
  const mergedActivityStatementOne = buildProofStatement(248, [
    {
      operation: "set",
      path: ["object"],
      value: {
        objectType: "Activity",
        id: mergedActivityId,
        definition: {
          name: {
            "en-US": "Merged Activity",
          },
          description: {
            "en-US": "Merged activity description",
          },
        },
      },
    },
  ]);
  const mergedActivityStatementTwo = buildProofStatement(249, [
    {
      operation: "set",
      path: ["object"],
      value: {
        objectType: "Activity",
        id: mergedActivityId,
        definition: {
          name: {
            "fr-FR": "Activite Fusionnee",
          },
          description: {
            "fr-FR": "Description fusionnee",
          },
          type: "https://example.test/xapi/activity-types/resource-merged",
        },
      },
    },
  ]);

  const completeActivityCase = requestSequenceCase({
    caseId: "v2.activities.resource.complete-object",
    title: "The Activities Resource returns the complete Activity Object for a stored activityId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00252",
        section: "Communication 2.5",
        title: "The Activities Resource exists at /activities",
      },
      {
        id: "XAPI-00253",
        section: "Communication 2.5",
        title: "The Activities Resource accepts GET requests",
      },
      {
        id: "XAPI-00251",
        section: "Communication 2.5.s1",
        title: "The Activities Resource returns the complete Activity Object",
      },
    ],
    tags: ["v2.0.0", "activities", "resource", "roundtrip"],
    capabilityFlags: ["activities", "retrieval"],
    legacyTraceSuiteFile: activitiesResourceLegacySuiteFile,
    notes: ["proof-slice activities resource complete object"],
    steps: [
      {
        request: buildStatementPostRequest(completeActivityStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildActivitiesGetRequest(completeActivityId),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: [],
              equals: completeActivityObject,
            },
          ],
        },
      },
    ],
  });

  const missingActivityIdCase = singleRequestCase({
    caseId: "v2.activities.resource.missing-activity-id",
    title: "The Activities Resource rejects a GET request without activityId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00250",
        section: "Communication 2.5.s1.table1.row1",
        title: "The Activities Resource rejects requests without activityId",
      },
    ],
    tags: ["v2.0.0", "activities", "resource", "validation"],
    capabilityFlags: ["activities", "validation"],
    legacyTraceSuiteFile: activitiesResourceLegacySuiteFile,
    request: buildVersionedRequest("GET", "activities", {}),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice activities resource missing activityId"],
  });

  const mergedDefinitionCase = requestSequenceCase({
    caseId: "v2.activities.resource.definition-merge",
    title: "The Activities Resource merges available definition data across statements with the same activityId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00254",
        section: "Communication 2.5.s1.table1.row1",
        title: "The Activities Resource returns all available information for an activityId",
      },
    ],
    tags: ["v2.0.0", "activities", "resource", "merge"],
    capabilityFlags: ["activities", "retrieval", "merge"],
    legacyTraceSuiteFile: activitiesResourceLegacySuiteFile,
    notes: ["proof-slice activities resource definition merge"],
    steps: [
      {
        request: buildStatementPostRequest(mergedActivityStatementOne),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementPostRequest(mergedActivityStatementTwo),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildActivitiesGetRequest(mergedActivityId),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["definition", "name"],
              equals: {
                "en-US": "Merged Activity",
                "fr-FR": "Activite Fusionnee",
              },
            },
            {
              path: ["definition", "description"],
              equals: {
                "en-US": "Merged activity description",
                "fr-FR": "Description fusionnee",
              },
            },
          ],
        },
      },
    ],
  });

  const unknownActivityFallbackCase = singleRequestCase({
    caseId: "v2.activities.resource.unknown-activity-fallback",
    title: "The Activities Resource still returns an Activity Object when no canonical definition is known",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00251",
        section: "Communication 2.5.s1",
        title: "The Activities Resource returns an Activity Object for successful GET requests",
      },
    ],
    tags: ["v2.0.0", "activities", "resource", "fallback"],
    capabilityFlags: ["activities", "retrieval"],
    legacyTraceSuiteFile: activitiesResourceLegacySuiteFile,
    request: buildActivitiesGetRequest(unknownActivityId),
    assertion: {
      status: 200,
      jsonPathEquals: [
        {
          path: ["objectType"],
          equals: "Activity",
        },
        {
          path: ["id"],
          equals: unknownActivityId,
        },
      ],
    },
    notes: ["proof-slice activities resource unknown activity fallback"],
  });

  return {
    type: "suite",
    id: "v2.proof-slice.activities",
    title: "Activities Resource",
    specVersion,
    tags: ["proof-slice", "activities"],
    children: [
      {
        type: "suite",
        id: "v2.proof-slice.activities.basics",
        title: "Activities Basics",
        specVersion,
        tags: ["activities", "basics"],
        children: [completeActivityCase, missingActivityIdCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities.definition",
        title: "Activities Definition",
        specVersion,
        tags: ["activities", "definition"],
        children: [mergedDefinitionCase, unknownActivityFallbackCase],
      },
    ],
  };
}

export function createV20AboutResourceProofSliceSuite(): SuiteDefinition {
  const aboutGetCase = singleRequestCase({
    caseId: "v2.about.resource.version-array",
    title: "The About Resource returns a version array that includes 2.0.0",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00315",
        section: "Communication 2.8",
        title: "The About Resource exists at /about",
      },
      {
        id: "XAPI-00319",
        section: "Communication 2.8.s4",
        title: "A successful About GET returns 200 OK and a version property",
      },
      {
        id: "XAPI-00318",
        section: "Communication 2.8.s4.table1.row1",
        title: "The About version property is an array of strings",
      },
      {
        id: "XAPI-00317",
        section: "Communication 2.8.s5.b1.b1",
        title: "The About version property contains 2.0.0",
      },
    ],
    tags: ["v2.0.0", "about", "resource"],
    capabilityFlags: ["about", "retrieval"],
    legacyTraceSuiteFile: aboutResourceLegacySuiteFile,
    request: buildAboutGetRequest(),
    assertion: {
      status: 200,
      jsonPathEquals: [
        {
          path: ["version"],
          equals: [specVersion],
        },
      ],
    },
    notes: ["proof-slice about resource version array"],
  });

  const aboutWithoutVersionHeaderCase = singleRequestCase({
    caseId: "v2.about.resource.version-header-exempt",
    title: "The About Resource accepts GET requests without an X-Experience-API-Version header",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00321",
        section: "Communication 2.8.s4.table1.row2",
        title: "The About Resource is exempt from the X-Experience-API-Version request-header requirement",
      },
    ],
    tags: ["v2.0.0", "about", "resource", "versioning"],
    capabilityFlags: ["about", "retrieval", "versioning"],
    legacyTraceSuiteFile: aboutResourceLegacySuiteFile,
    request: buildAboutGetRequest(false),
    assertion: {
      status: 200,
      jsonPathEquals: [
        {
          path: ["version"],
          equals: [specVersion],
        },
      ],
    },
    notes: ["proof-slice about resource version header exemption"],
  });

  const nonAboutRequiresVersionHeaderCase = singleRequestCase({
    caseId: "v2.about.resource.non-about-requires-version-header",
    title: "Non-About resources reject requests that omit X-Experience-API-Version",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00321",
        section: "Communication 2.8.s4.table1.row2",
        title: "Resources other than About reject requests without X-Experience-API-Version",
      },
    ],
    tags: ["v2.0.0", "about", "resource", "versioning"],
    capabilityFlags: ["versioning", "validation"],
    legacyTraceSuiteFile: aboutResourceLegacySuiteFile,
    request: buildActivitiesGetRequest("https://example.test/xapi/activities/missing-version-header", false),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice version header required outside about"],
  });

  return {
    type: "suite",
    id: "v2.proof-slice.about",
    title: "About Resource",
    specVersion,
    tags: ["proof-slice", "about"],
    children: [
      {
        type: "suite",
        id: "v2.proof-slice.about.basics",
        title: "About Basics",
        specVersion,
        tags: ["about", "basics"],
        children: [aboutGetCase, aboutWithoutVersionHeaderCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.about.versioning",
        title: "About Versioning",
        specVersion,
        tags: ["about", "versioning"],
        children: [nonAboutRequiresVersionHeaderCase],
      },
    ],
  };
}

interface DocumentConcurrencySuiteOptions {
  suiteId: string;
  title: string;
  endpoint: EndpointKind;
  bodyFixtureName: string;
  buildQuery(idSuffix: string): Record<string, string>;
  initialBody: JsonObject;
  replacementBody: JsonObject;
  resourceTag: string;
}

function buildDocumentConcurrencyResourceSuite(options: DocumentConcurrencySuiteOptions): SuiteDefinition {
  const baseTags = ["v2.0.0", "communication", "concurrency", options.resourceTag];
  const staleEtag = '"stale-proof-etag"';
  const initialEtag = buildProofDocumentEtag(options.initialBody);
  const mergeBody = {
    proofMerge: true,
  } satisfies JsonObject;

  const etagQuery = options.buildQuery("etag");
  const putStaleQuery = options.buildQuery("put-stale");
  const putCurrentQuery = options.buildQuery("put-current");
  const putMissingQuery = options.buildQuery("put-missing");
  const postStaleQuery = options.buildQuery("post-stale");
  const deleteStaleQuery = options.buildQuery("delete-stale");
  const deleteCurrentQuery = options.buildQuery("delete-current");

  return {
    type: "suite",
    id: options.suiteId,
    title: options.title,
    specVersion,
    tags: ["communication", "concurrency", options.resourceTag],
    children: [
      requestSequenceCase({
        caseId: `${options.suiteId}.etag-header`,
        title: `${options.title} GET responses include a quoted ETag header`,
        specVersion,
        requirementRefs: [
          {
            id: "XAPI-00322",
            section: "Communication 3.1",
            title: "Document resources return ETag headers for optimistic concurrency",
          },
        ],
        tags: baseTags,
        capabilityFlags: ["communication", "concurrency", options.resourceTag],
        legacyTraceSuiteFile: concurrencyLegacySuiteFile,
        notes: [`proof-slice ${options.resourceTag} etag header`],
        steps: [
          {
            request: buildVersionedRequest("POST", options.endpoint, etagQuery, {
              value: options.initialBody,
              fixtureName: options.bodyFixtureName,
            }),
            assertion: {
              status: 204,
            },
          },
          {
            request: buildVersionedRequest("GET", options.endpoint, etagQuery),
            assertion: {
              status: 200,
              expectedHeaders: [
                {
                  key: "etag",
                  equals: initialEtag,
                },
              ],
              jsonPathEquals: [
                {
                  path: [],
                  equals: options.initialBody,
                },
              ],
            },
          },
        ],
      }),
      requestSequenceCase({
        caseId: `${options.suiteId}.put-rejects-stale-if-match`,
        title: `${options.title} rejects PUT requests with a stale If-Match header`,
        specVersion,
        requirementRefs: [
          {
            id: "XAPI-00322",
            section: "Communication 3.1",
            title: "Document resources reject stale If-Match values for PUT",
          },
        ],
        tags: baseTags,
        capabilityFlags: ["communication", "concurrency", options.resourceTag],
        legacyTraceSuiteFile: concurrencyLegacySuiteFile,
        notes: [`proof-slice ${options.resourceTag} put stale if-match`],
        steps: [
          {
            request: buildVersionedRequest("POST", options.endpoint, putStaleQuery, {
              value: options.initialBody,
              fixtureName: options.bodyFixtureName,
            }),
            assertion: {
              status: 204,
            },
          },
          {
            request: buildVersionedRequest(
              "PUT",
              options.endpoint,
              putStaleQuery,
              {
                value: options.replacementBody,
                fixtureName: options.bodyFixtureName,
              },
              {
                "If-Match": staleEtag,
              },
            ),
            assertion: {
              status: 412,
            },
          },
          {
            request: buildVersionedRequest("GET", options.endpoint, putStaleQuery),
            assertion: {
              status: 200,
              jsonPathEquals: [
                {
                  path: [],
                  equals: options.initialBody,
                },
              ],
            },
          },
        ],
      }),
      requestSequenceCase({
        caseId: `${options.suiteId}.put-accepts-current-if-match`,
        title: `${options.title} accepts PUT requests with the current If-Match header`,
        specVersion,
        requirementRefs: [
          {
            id: "XAPI-00322",
            section: "Communication 3.1",
            title: "Document resources accept current If-Match values for PUT",
          },
        ],
        tags: baseTags,
        capabilityFlags: ["communication", "concurrency", options.resourceTag],
        legacyTraceSuiteFile: concurrencyLegacySuiteFile,
        notes: [`proof-slice ${options.resourceTag} put current if-match`],
        steps: [
          {
            request: buildVersionedRequest("POST", options.endpoint, putCurrentQuery, {
              value: options.initialBody,
              fixtureName: options.bodyFixtureName,
            }),
            assertion: {
              status: 204,
            },
          },
          {
            request: buildVersionedRequest(
              "PUT",
              options.endpoint,
              putCurrentQuery,
              {
                value: options.replacementBody,
                fixtureName: options.bodyFixtureName,
              },
              {
                "If-Match": initialEtag,
              },
            ),
            assertion: {
              status: 204,
            },
          },
          {
            request: buildVersionedRequest("GET", options.endpoint, putCurrentQuery),
            assertion: {
              status: 200,
              jsonPathEquals: [
                {
                  path: [],
                  equals: options.replacementBody,
                },
              ],
            },
          },
        ],
      }),
      requestSequenceCase({
        caseId: `${options.suiteId}.put-requires-if-match`,
        title: `${options.title} returns 409 when PUT overwrites an existing document without If-Match`,
        specVersion,
        requirementRefs: [
          {
            id: "XAPI-00322",
            section: "Communication 3.1",
            title: "Document resources require If-Match for overwriting PUT requests",
          },
        ],
        tags: baseTags,
        capabilityFlags: ["communication", "concurrency", options.resourceTag],
        legacyTraceSuiteFile: concurrencyLegacySuiteFile,
        notes: [`proof-slice ${options.resourceTag} put requires if-match`],
        steps: [
          {
            request: buildVersionedRequest("POST", options.endpoint, putMissingQuery, {
              value: options.initialBody,
              fixtureName: options.bodyFixtureName,
            }),
            assertion: {
              status: 204,
            },
          },
          {
            request: buildVersionedRequest("PUT", options.endpoint, putMissingQuery, {
              value: options.replacementBody,
              fixtureName: options.bodyFixtureName,
            }),
            assertion: {
              status: 409,
            },
          },
          {
            request: buildVersionedRequest("GET", options.endpoint, putMissingQuery),
            assertion: {
              status: 200,
              jsonPathEquals: [
                {
                  path: [],
                  equals: options.initialBody,
                },
              ],
            },
          },
        ],
      }),
      requestSequenceCase({
        caseId: `${options.suiteId}.post-rejects-stale-if-match`,
        title: `${options.title} rejects POST merge requests with a stale If-Match header`,
        specVersion,
        requirementRefs: [
          {
            id: "XAPI-00322",
            section: "Communication 3.1",
            title: "Document resources reject stale If-Match values for POST",
          },
        ],
        tags: baseTags,
        capabilityFlags: ["communication", "concurrency", options.resourceTag],
        legacyTraceSuiteFile: concurrencyLegacySuiteFile,
        notes: [`proof-slice ${options.resourceTag} post stale if-match`],
        steps: [
          {
            request: buildVersionedRequest("POST", options.endpoint, postStaleQuery, {
              value: options.initialBody,
              fixtureName: options.bodyFixtureName,
            }),
            assertion: {
              status: 204,
            },
          },
          {
            request: buildVersionedRequest(
              "POST",
              options.endpoint,
              postStaleQuery,
              {
                value: mergeBody,
              },
              {
                "If-Match": staleEtag,
              },
            ),
            assertion: {
              status: 412,
            },
          },
          {
            request: buildVersionedRequest("GET", options.endpoint, postStaleQuery),
            assertion: {
              status: 200,
              jsonPathEquals: [
                {
                  path: [],
                  equals: options.initialBody,
                },
              ],
            },
          },
        ],
      }),
      requestSequenceCase({
        caseId: `${options.suiteId}.delete-rejects-stale-if-match`,
        title: `${options.title} rejects DELETE requests with a stale If-Match header`,
        specVersion,
        requirementRefs: [
          {
            id: "XAPI-00322",
            section: "Communication 3.1",
            title: "Document resources reject stale If-Match values for DELETE",
          },
        ],
        tags: baseTags,
        capabilityFlags: ["communication", "concurrency", options.resourceTag],
        legacyTraceSuiteFile: concurrencyLegacySuiteFile,
        notes: [`proof-slice ${options.resourceTag} delete stale if-match`],
        steps: [
          {
            request: buildVersionedRequest("POST", options.endpoint, deleteStaleQuery, {
              value: options.initialBody,
              fixtureName: options.bodyFixtureName,
            }),
            assertion: {
              status: 204,
            },
          },
          {
            request: buildVersionedRequest("DELETE", options.endpoint, deleteStaleQuery, undefined, {
              "If-Match": staleEtag,
            }),
            assertion: {
              status: 412,
            },
          },
          {
            request: buildVersionedRequest("GET", options.endpoint, deleteStaleQuery),
            assertion: {
              status: 200,
              jsonPathEquals: [
                {
                  path: [],
                  equals: options.initialBody,
                },
              ],
            },
          },
        ],
      }),
      requestSequenceCase({
        caseId: `${options.suiteId}.delete-accepts-current-if-match`,
        title: `${options.title} accepts DELETE requests with the current If-Match header`,
        specVersion,
        requirementRefs: [
          {
            id: "XAPI-00322",
            section: "Communication 3.1",
            title: "Document resources accept current If-Match values for DELETE",
          },
        ],
        tags: baseTags,
        capabilityFlags: ["communication", "concurrency", options.resourceTag],
        legacyTraceSuiteFile: concurrencyLegacySuiteFile,
        notes: [`proof-slice ${options.resourceTag} delete current if-match`],
        steps: [
          {
            request: buildVersionedRequest("POST", options.endpoint, deleteCurrentQuery, {
              value: options.initialBody,
              fixtureName: options.bodyFixtureName,
            }),
            assertion: {
              status: 204,
            },
          },
          {
            request: buildVersionedRequest("DELETE", options.endpoint, deleteCurrentQuery, undefined, {
              "If-Match": initialEtag,
            }),
            assertion: {
              status: 204,
            },
          },
          {
            request: buildVersionedRequest("GET", options.endpoint, deleteCurrentQuery),
            assertion: {
              status: 404,
            },
          },
        ],
      }),
    ],
  };
}

export function createV20CommunicationProofSliceSuite(): SuiteDefinition {
  const headNoBodyExpectation: JsonPathExpectation[] = [
    {
      path: [],
      equals: undefined,
    },
  ];

  const headActivityId = "https://example.test/xapi/activities/head-proof";
  const headAgentMbox = "mailto:head-proof-agent@example.test";
  const headActivityStatement = buildProofStatement(260, [
    {
      operation: "set",
      path: ["object"],
      value: buildActivityObjectFixture(headActivityId),
    },
  ]);
  const headAgentStatement = buildProofStatement(261, [
    {
      operation: "set",
      path: ["actor"],
      value: buildAgentWithMbox(headAgentMbox),
    },
  ]);
  const headStateIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/head-state",
    stateId: "head-state-document",
  });
  const headActivityProfileIdentity = buildActivityProfileIdentityFixture({
    activityId: "https://example.test/xapi/activities/head-activity-profile",
    profileId: "head-activity-profile-document",
  });
  const headAgentProfileIdentity = buildAgentProfileIdentityFixture({
    agent: JSON.stringify({
      objectType: "Agent",
      mbox: "mailto:head-agent-profile@example.test",
      name: "Head Agent Profile",
    }),
    profileId: "head-agent-profile-document",
  });

  const headActivitiesCase = requestSequenceCase({
    caseId: "v2.communication.head.activities",
    title: "The Activities Resource responds to HEAD in the same way as GET but without a message body",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00126",
        section: "Communication 1.1",
        title: "An LRS accepts HEAD requests",
      },
      {
        id: "XAPI-00125",
        section: "Communication 1.1.s3.b1",
        title: "HEAD responses mirror GET without a message body",
      },
    ],
    tags: ["v2.0.0", "communication", "head", "activities"],
    capabilityFlags: ["communication", "head", "activities"],
    legacyTraceSuiteFile: headRequestsLegacySuiteFile,
    notes: ["proof-slice head activities"],
    steps: [
      {
        request: buildStatementPostRequest(headActivityStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildHeadRequest("activities", {
          activityId: headActivityId,
        }),
        assertion: {
          status: 200,
          expectedHeaders: [
            {
              key: "X-Experience-API-Version",
              equals: specVersion,
            },
          ],
          jsonPathEquals: headNoBodyExpectation,
        },
      },
    ],
  });

  const headActivityProfileCase = requestSequenceCase({
    caseId: "v2.communication.head.activities-profile",
    title: "The Activity Profile Resource supports HEAD without returning a message body",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00126",
        section: "Communication 1.1",
        title: "An LRS accepts HEAD requests",
      },
      {
        id: "XAPI-00125",
        section: "Communication 1.1.s3.b1",
        title: "HEAD responses mirror GET without a message body",
      },
    ],
    tags: ["v2.0.0", "communication", "head", "activities-profile"],
    capabilityFlags: ["communication", "head", "activities-profile"],
    legacyTraceSuiteFile: headRequestsLegacySuiteFile,
    notes: ["proof-slice head activities profile"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-profile", headActivityProfileIdentity, {
          value: buildActivityProfileDocumentFixture(),
          fixtureName: "activity-profile-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildHeadRequest("activities-profile", headActivityProfileIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: headNoBodyExpectation,
        },
      },
    ],
  });

  const headStateCase = requestSequenceCase({
    caseId: "v2.communication.head.activities-state",
    title: "The State Resource supports HEAD without returning a message body",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00126",
        section: "Communication 1.1",
        title: "An LRS accepts HEAD requests",
      },
      {
        id: "XAPI-00125",
        section: "Communication 1.1.s3.b1",
        title: "HEAD responses mirror GET without a message body",
      },
    ],
    tags: ["v2.0.0", "communication", "head", "activities-state"],
    capabilityFlags: ["communication", "head", "activities-state"],
    legacyTraceSuiteFile: headRequestsLegacySuiteFile,
    notes: ["proof-slice head activities state"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", headStateIdentity, {
          value: buildActivityStateDocumentFixture(),
          fixtureName: "activity-state-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildHeadRequest("activities-state", headStateIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: headNoBodyExpectation,
        },
      },
    ],
  });

  const headAgentsCase = requestSequenceCase({
    caseId: "v2.communication.head.agents",
    title: "The Agents Resource supports HEAD without returning a message body",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00126",
        section: "Communication 1.1",
        title: "An LRS accepts HEAD requests",
      },
      {
        id: "XAPI-00125",
        section: "Communication 1.1.s3.b1",
        title: "HEAD responses mirror GET without a message body",
      },
    ],
    tags: ["v2.0.0", "communication", "head", "agents"],
    capabilityFlags: ["communication", "head", "agents"],
    legacyTraceSuiteFile: headRequestsLegacySuiteFile,
    notes: ["proof-slice head agents"],
    steps: [
      {
        request: buildStatementPostRequest(headAgentStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildHeadRequest("agents", {
          agent: buildAgentQuery(headAgentMbox),
        }),
        assertion: {
          status: 200,
          jsonPathEquals: headNoBodyExpectation,
        },
      },
    ],
  });

  const headAgentProfileCase = requestSequenceCase({
    caseId: "v2.communication.head.agents-profile",
    title: "The Agent Profile Resource supports HEAD without returning a message body",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00126",
        section: "Communication 1.1",
        title: "An LRS accepts HEAD requests",
      },
      {
        id: "XAPI-00125",
        section: "Communication 1.1.s3.b1",
        title: "HEAD responses mirror GET without a message body",
      },
    ],
    tags: ["v2.0.0", "communication", "head", "agents-profile"],
    capabilityFlags: ["communication", "head", "agents-profile"],
    legacyTraceSuiteFile: headRequestsLegacySuiteFile,
    notes: ["proof-slice head agents profile"],
    steps: [
      {
        request: buildVersionedRequest("POST", "agents-profile", headAgentProfileIdentity, {
          value: buildAgentProfileDocumentFixture(),
          fixtureName: "agent-profile-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildHeadRequest("agents-profile", headAgentProfileIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: headNoBodyExpectation,
        },
      },
    ],
  });

  const headStatementsCase = singleRequestCase({
    caseId: "v2.communication.head.statements",
    title: "The Statements Resource accepts HEAD without returning a message body",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00126",
        section: "Communication 1.1",
        title: "An LRS accepts HEAD requests",
      },
      {
        id: "XAPI-00125",
        section: "Communication 1.1.s3.b1",
        title: "HEAD responses mirror GET without a message body",
      },
    ],
    tags: ["v2.0.0", "communication", "head", "statements"],
    capabilityFlags: ["communication", "head", "statements"],
    legacyTraceSuiteFile: headRequestsLegacySuiteFile,
    request: buildHeadRequest("statements", {}),
    assertion: {
      status: 200,
      jsonPathEquals: headNoBodyExpectation,
    },
    notes: ["proof-slice head statements"],
  });

  const versionHeaderStatement = buildProofStatement(262);
  const missingHeaderGetStatement = buildProofStatement(263);
  const missingHeaderPostStatement = buildProofStatement(264);
  const missingHeaderPutStatement = buildProofStatement(265);
  const invalidHeaderGetStatement = buildProofStatement(266);
  const invalidHeaderPostStatement = buildProofStatement(267);
  const invalidHeaderPutStatement = buildProofStatement(268);

  const versionHeaderResponseCase = requestSequenceCase({
    caseId: "v2.communication.versioning.response-header",
    title: "Statement responses include the X-Experience-API-Version response header",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00333",
        section: "Communication 3.3.s3.b1",
        title: "Statement responses include X-Experience-API-Version",
      },
    ],
    tags: ["v2.0.0", "communication", "versioning"],
    capabilityFlags: ["communication", "versioning"],
    legacyTraceSuiteFile: versioningLegacySuiteFile,
    notes: ["proof-slice versioning response header"],
    steps: [
      {
        request: buildStatementPostRequest(versionHeaderStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementGetRequest(versionHeaderStatement.id),
        assertion: {
          status: 200,
          expectedHeaders: [
            {
              key: "X-Experience-API-Version",
              equals: specVersion,
            },
          ],
        },
      },
    ],
  });

  const missingGetHeaderCase = requestSequenceCase({
    caseId: "v2.communication.versioning.get-missing-request-header",
    title: "The Statements Resource rejects GET requests that omit X-Experience-API-Version",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00331",
        section: "Communication 3.3.s4.b1",
        title: "Non-About GET requests require X-Experience-API-Version",
      },
    ],
    tags: ["v2.0.0", "communication", "versioning", "validation"],
    capabilityFlags: ["communication", "versioning", "validation"],
    legacyTraceSuiteFile: versioningLegacySuiteFile,
    notes: ["proof-slice versioning missing header get"],
    steps: [
      {
        request: buildStatementPostRequest(missingHeaderGetStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildRequestWithoutVersionHeader("GET", "statements", {
          statementId: missingHeaderGetStatement.id,
        }),
        assertion: {
          status: 400,
        },
      },
    ],
  });

  const missingPostHeaderCase = singleRequestCase({
    caseId: "v2.communication.versioning.post-missing-request-header",
    title: "The Statements Resource rejects POST requests that omit X-Experience-API-Version",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00331",
        section: "Communication 3.3.s4.b1",
        title: "Non-About POST requests require X-Experience-API-Version",
      },
    ],
    tags: ["v2.0.0", "communication", "versioning", "validation"],
    capabilityFlags: ["communication", "versioning", "validation"],
    legacyTraceSuiteFile: versioningLegacySuiteFile,
    request: buildRequestWithoutVersionHeader(
      "POST",
      "statements",
      {},
      {
        value: missingHeaderPostStatement,
      },
    ),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice versioning missing header post"],
  });

  const missingPutHeaderCase = singleRequestCase({
    caseId: "v2.communication.versioning.put-missing-request-header",
    title: "The Statements Resource rejects PUT requests that omit X-Experience-API-Version",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00331",
        section: "Communication 3.3.s4.b1",
        title: "Non-About PUT requests require X-Experience-API-Version",
      },
    ],
    tags: ["v2.0.0", "communication", "versioning", "validation"],
    capabilityFlags: ["communication", "versioning", "validation"],
    legacyTraceSuiteFile: versioningLegacySuiteFile,
    request: buildRequestWithoutVersionHeader(
      "PUT",
      "statements",
      {
        statementId: missingHeaderPutStatement.id,
      },
      {
        value: missingHeaderPutStatement,
      },
    ),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice versioning missing header put"],
  });

  const invalidGetHeaderCase = requestSequenceCase({
    caseId: "v2.communication.versioning.get-invalid-request-header",
    title: "The Statements Resource rejects GET requests with an invalid X-Experience-API-Version value",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00331",
        section: "Communication 3.3.s4.b1",
        title: "Non-About GET requests reject invalid X-Experience-API-Version values",
      },
    ],
    tags: ["v2.0.0", "communication", "versioning", "validation"],
    capabilityFlags: ["communication", "versioning", "validation"],
    legacyTraceSuiteFile: versioningLegacySuiteFile,
    notes: ["proof-slice versioning invalid header get"],
    steps: [
      {
        request: buildStatementPostRequest(invalidHeaderGetStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementGetRequest(invalidHeaderGetStatement.id, {
          "X-Experience-API-Version": "BAD",
        }),
        assertion: {
          status: 400,
        },
      },
    ],
  });

  const invalidPostHeaderCase = singleRequestCase({
    caseId: "v2.communication.versioning.post-invalid-request-header",
    title: "The Statements Resource rejects POST requests with an invalid X-Experience-API-Version value",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00331",
        section: "Communication 3.3.s4.b1",
        title: "Non-About POST requests reject invalid X-Experience-API-Version values",
      },
    ],
    tags: ["v2.0.0", "communication", "versioning", "validation"],
    capabilityFlags: ["communication", "versioning", "validation"],
    legacyTraceSuiteFile: versioningLegacySuiteFile,
    request: buildStatementPostRequest(invalidHeaderPostStatement, {
      "X-Experience-API-Version": "BAD",
    }),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice versioning invalid header post"],
  });

  const invalidPutHeaderCase = singleRequestCase({
    caseId: "v2.communication.versioning.put-invalid-request-header",
    title: "The Statements Resource rejects PUT requests with an invalid X-Experience-API-Version value",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00331",
        section: "Communication 3.3.s4.b1",
        title: "Non-About PUT requests reject invalid X-Experience-API-Version values",
      },
    ],
    tags: ["v2.0.0", "communication", "versioning", "validation"],
    capabilityFlags: ["communication", "versioning", "validation"],
    legacyTraceSuiteFile: versioningLegacySuiteFile,
    request: buildStatementPutRequest(invalidHeaderPutStatement.id, invalidHeaderPutStatement, {
      "X-Experience-API-Version": "BAD",
    }),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice versioning invalid header put"],
  });

  const authenticationSuccessStatement = buildProofStatement(269);
  const authenticationBadStatement = buildProofStatement(270);
  const authenticationMalformedStatement = buildProofStatement(271);

  const basicAuthenticationCase = singleRequestCase({
    caseId: "v2.communication.authentication.basic-accepted",
    title: "The Statements Resource accepts requests authenticated with valid HTTP Basic credentials",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00335",
        section: "Communication 4.0",
        title: "An LRS supports HTTP Basic Authentication",
      },
    ],
    tags: ["v2.0.0", "communication", "authentication"],
    capabilityFlags: ["communication", "authentication"],
    legacyTraceSuiteFile: authenticationLegacySuiteFile,
    request: buildStatementPutRequest(authenticationSuccessStatement.id, authenticationSuccessStatement),
    assertion: {
      status: 204,
    },
    notes: ["proof-slice authentication basic accepted"],
  });

  const badAuthenticationCase = singleRequestCase({
    caseId: "v2.communication.authentication.bad-basic-rejected",
    title: "The Statements Resource rejects requests authenticated with invalid HTTP Basic credentials",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00334",
        section: "Communication 4.0",
        title: "Bad authorization is rejected with 401 Unauthorized",
      },
    ],
    tags: ["v2.0.0", "communication", "authentication", "validation"],
    capabilityFlags: ["communication", "authentication", "validation"],
    legacyTraceSuiteFile: authenticationLegacySuiteFile,
    request: buildStatementPutRequest(authenticationBadStatement.id, authenticationBadStatement, {
      Authorization: `Basic ${Buffer.from("bad:credentials").toString("base64")}`,
    }),
    assertion: {
      status: 401,
    },
    notes: ["proof-slice authentication bad basic rejected"],
  });

  const malformedAuthenticationCase = singleRequestCase({
    caseId: "v2.communication.authentication.malformed-basic-rejected",
    title: "The Statements Resource rejects malformed Authorization headers with 401 Unauthorized",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00334",
        section: "Communication 4.0",
        title: "Malformed authorization is rejected with 401 Unauthorized",
      },
    ],
    tags: ["v2.0.0", "communication", "authentication", "validation"],
    capabilityFlags: ["communication", "authentication", "validation"],
    legacyTraceSuiteFile: authenticationLegacySuiteFile,
    request: buildStatementPutRequest(authenticationMalformedStatement.id, authenticationMalformedStatement, {
      Authorization: "Basic:not-base64",
    }),
    assertion: {
      status: 401,
    },
    notes: ["proof-slice authentication malformed basic rejected"],
  });

  const unicodeVerbId = "https://example.test/xapi/verbs/unicode-proof";
  const unicodeStatement = buildProofStatement(272, [
    {
      operation: "set",
      path: ["verb"],
      value: {
        id: unicodeVerbId,
        display: {
          "en-US": "snowman ☃",
          "ja-JP": "学習完了",
        },
      },
    },
  ]);

  const utf8EncodingCase = requestSequenceCase({
    caseId: "v2.communication.encoding.utf8-roundtrip",
    title: "The Statements Resource preserves UTF-8 string content across submit and retrieval",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00015",
        section: "Communication 1.4.s1.b1",
        title: "All strings are encoded and interpreted as UTF-8",
      },
    ],
    tags: ["v2.0.0", "communication", "encoding"],
    capabilityFlags: ["communication", "encoding"],
    legacyTraceSuiteFile: encodingLegacySuiteFile,
    notes: ["proof-slice utf8 roundtrip"],
    steps: [
      {
        request: buildStatementPostRequest(unicodeStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementGetRequest(unicodeStatement.id),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["verb", "display"],
              equals: {
                "en-US": "snowman ☃",
                "ja-JP": "学習完了",
              },
            },
          ],
        },
      },
    ],
  });

  const contentTypeBoundary = "mock-proof-content-types";
  const rawAttachmentBody = "proof raw attachment";
  const rawAttachmentSha = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const extraAttachmentSha = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
  const fileUrlAttachmentStatement = buildProofStatement(273, [
    {
      operation: "set",
      path: ["attachments"],
      value: [
        buildAttachmentFixture({
          fileUrl: "https://example.test/files/content-type-proof.txt",
        }),
      ],
    },
  ]);
  const rawAttachmentStatement = buildProofStatement(274, [
    {
      operation: "set",
      path: ["attachments"],
      value: [
        buildAttachmentFixture({
          contentType: "text/plain",
          length: rawAttachmentBody.length,
          sha2: rawAttachmentSha,
          fileUrl: undefined,
        }),
      ],
    },
  ]);

  const jsonFileUrlContentTypeCase = singleRequestCase({
    caseId: "v2.communication.content-types.json-file-url",
    title: "Statement POST accepts application/json when attachments only use fileUrl",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00127",
        section: "Communication 1.5.1",
        title: "Statement writes accept application/json for fileUrl attachments",
      },
    ],
    tags: ["v2.0.0", "communication", "content-types"],
    capabilityFlags: ["communication", "content-types"],
    legacyTraceSuiteFile: contentTypesLegacySuiteFile,
    request: buildStatementPostRequest(fileUrlAttachmentStatement),
    assertion: {
      status: 200,
    },
    notes: ["proof-slice content types json fileUrl"],
  });

  const multipartFileUrlContentTypeCase = singleRequestCase({
    caseId: "v2.communication.content-types.multipart-file-url",
    title: "Statement POST accepts multipart or mixed when attachments only use fileUrl",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00127",
        section: "Communication 1.5.1",
        title: "Statement writes accept multipart or mixed for fileUrl attachments",
      },
    ],
    tags: ["v2.0.0", "communication", "content-types"],
    capabilityFlags: ["communication", "content-types"],
    legacyTraceSuiteFile: contentTypesLegacySuiteFile,
    request: buildMultipartStatementPostRequest(
      fileUrlAttachmentStatement,
      [],
      {},
      {
        boundary: contentTypeBoundary,
      },
    ),
    assertion: {
      status: 200,
    },
    notes: ["proof-slice content types multipart fileUrl"],
  });

  const multipartRawAttachmentContentTypeCase = singleRequestCase({
    caseId: "v2.communication.content-types.multipart-raw-attachment",
    title: "Statement POST accepts multipart or mixed when raw attachment parts are present",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00127",
        section: "Communication 1.5.1",
        title: "Statement writes accept multipart or mixed for raw attachment data",
      },
    ],
    tags: ["v2.0.0", "communication", "content-types"],
    capabilityFlags: ["communication", "content-types"],
    legacyTraceSuiteFile: contentTypesLegacySuiteFile,
    request: buildMultipartStatementPostRequest(
      rawAttachmentStatement,
      [
        {
          contentType: "text/plain",
          sha2: rawAttachmentSha,
          body: rawAttachmentBody,
        },
      ],
      {},
      {
        boundary: contentTypeBoundary,
      },
    ),
    assertion: {
      status: 200,
    },
    notes: ["proof-slice content types multipart raw attachment"],
  });

  const jsonRawAttachmentRejectedCase = singleRequestCase({
    caseId: "v2.communication.content-types.json-raw-attachment-rejected",
    title: "Statement POST rejects application or json when raw attachment parts are missing",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00129",
        section: "Communication 1.5.1.s1.b2",
        title: "Statement writes reject application or json when raw attachment parts are missing",
      },
    ],
    tags: ["v2.0.0", "communication", "content-types", "validation"],
    capabilityFlags: ["communication", "content-types", "validation"],
    legacyTraceSuiteFile: contentTypesLegacySuiteFile,
    request: buildStatementPostRequest(rawAttachmentStatement),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice content types json raw attachment rejected"],
  });

  const formDataFileUrlRejectedCase = singleRequestCase({
    caseId: "v2.communication.content-types.form-data-file-url-rejected",
    title: "Statement POST rejects multipart or form-data when attachments are submitted with fileUrl metadata",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00127",
        section: "Communication 1.5.1",
        title: "Statement writes reject multipart or form-data for attachment submission",
      },
    ],
    tags: ["v2.0.0", "communication", "content-types", "validation"],
    capabilityFlags: ["communication", "content-types", "validation"],
    legacyTraceSuiteFile: contentTypesLegacySuiteFile,
    request: buildMultipartStatementPostRequest(
      fileUrlAttachmentStatement,
      [],
      {},
      {
        boundary: contentTypeBoundary,
        contentType: `multipart/form-data; boundary=${contentTypeBoundary}`,
      },
    ),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice content types form-data fileUrl rejected"],
  });

  const formDataRawRejectedCase = singleRequestCase({
    caseId: "v2.communication.content-types.form-data-raw-rejected",
    title: "Statement POST rejects multipart or form-data when raw attachment parts are submitted",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00127",
        section: "Communication 1.5.1",
        title: "Statement writes reject multipart or form-data for raw attachment submission",
      },
    ],
    tags: ["v2.0.0", "communication", "content-types", "validation"],
    capabilityFlags: ["communication", "content-types", "validation"],
    legacyTraceSuiteFile: contentTypesLegacySuiteFile,
    request: buildMultipartStatementPostRequest(
      rawAttachmentStatement,
      [
        {
          contentType: "text/plain",
          sha2: rawAttachmentSha,
          body: rawAttachmentBody,
        },
      ],
      {},
      {
        boundary: contentTypeBoundary,
        contentType: `multipart/form-data; boundary=${contentTypeBoundary}`,
      },
    ),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice content types form-data raw rejected"],
  });

  const extraMultipartSectionRejectedCase = singleRequestCase({
    caseId: "v2.communication.content-types.extra-multipart-section-rejected",
    title: "Statement POST rejects multipart or mixed requests with excess attachment sections",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00128",
        section: "Communication 1.5.1.s1.b2",
        title: "Statement writes reject excess multipart sections that are not attachments",
      },
    ],
    tags: ["v2.0.0", "communication", "content-types", "validation"],
    capabilityFlags: ["communication", "content-types", "validation"],
    legacyTraceSuiteFile: contentTypesLegacySuiteFile,
    request: buildMultipartStatementPostRequest(
      rawAttachmentStatement,
      [
        {
          contentType: "text/plain",
          sha2: rawAttachmentSha,
          body: rawAttachmentBody,
        },
      ],
      {},
      {
        boundary: contentTypeBoundary,
        extraParts: [
          {
            contentType: "text/plain",
            sha2: extraAttachmentSha,
            body: "extra multipart section",
          },
        ],
      },
    ),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice content types extra multipart section rejected"],
  });

  const stateConcurrencySuite = buildDocumentConcurrencyResourceSuite({
    suiteId: "v2.communication.concurrency.activities-state",
    title: "State Resource Concurrency",
    endpoint: "activities-state",
    bodyFixtureName: "activity-state-default",
    buildQuery: (idSuffix) =>
      buildActivityStateIdentityFixture({
        activityId: `https://example.test/xapi/activities/concurrency-state-${idSuffix}`,
        stateId: `proof-concurrency-state-${idSuffix}`,
      }),
    initialBody: buildActivityStateDocumentFixture(),
    replacementBody: {
      bookmark: "chapter-9",
      progress: {
        attempts: 9,
        complete: false,
      },
      context: {
        location: "lab-9",
      },
    },
    resourceTag: "activities-state",
  });

  const activityProfileConcurrencySuite = buildDocumentConcurrencyResourceSuite({
    suiteId: "v2.communication.concurrency.activities-profile",
    title: "Activity Profile Resource Concurrency",
    endpoint: "activities-profile",
    bodyFixtureName: "activity-profile-default",
    buildQuery: (idSuffix) =>
      buildActivityProfileIdentityFixture({
        activityId: `https://example.test/xapi/activities/concurrency-activity-profile-${idSuffix}`,
        profileId: `proof-concurrency-activity-profile-${idSuffix}`,
      }),
    initialBody: buildActivityProfileDocumentFixture(),
    replacementBody: {
      summary: "activity-profile-updated",
      metadata: {
        audience: "engineering",
        level: "advanced",
      },
    },
    resourceTag: "activities-profile",
  });

  const agentProfileConcurrencySuite = buildDocumentConcurrencyResourceSuite({
    suiteId: "v2.communication.concurrency.agents-profile",
    title: "Agent Profile Resource Concurrency",
    endpoint: "agents-profile",
    bodyFixtureName: "agent-profile-default",
    buildQuery: (idSuffix) =>
      buildAgentProfileIdentityFixture({
        agent: JSON.stringify({
          objectType: "Agent",
          mbox: `mailto:concurrency-agent-profile-${idSuffix}@example.test`,
          name: `Concurrency Agent ${idSuffix}`,
        }),
        profileId: `proof-concurrency-agent-profile-${idSuffix}`,
      }),
    initialBody: buildAgentProfileDocumentFixture(),
    replacementBody: {
      preference: "expanded",
      notifications: {
        email: false,
        digest: "weekly",
      },
    },
    resourceTag: "agents-profile",
  });

  return {
    type: "suite",
    id: "v2.proof-slice.communication",
    title: "Communication",
    specVersion,
    tags: ["proof-slice", "communication"],
    children: [
      {
        type: "suite",
        id: "v2.proof-slice.communication.head",
        title: "HEAD Requests",
        specVersion,
        tags: ["communication", "head"],
        children: [
          headActivitiesCase,
          headActivityProfileCase,
          headStateCase,
          headAgentsCase,
          headAgentProfileCase,
          headStatementsCase,
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.communication.versioning",
        title: "Versioning",
        specVersion,
        tags: ["communication", "versioning"],
        children: [
          versionHeaderResponseCase,
          missingGetHeaderCase,
          missingPostHeaderCase,
          missingPutHeaderCase,
          invalidGetHeaderCase,
          invalidPostHeaderCase,
          invalidPutHeaderCase,
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.communication.authentication",
        title: "Authentication",
        specVersion,
        tags: ["communication", "authentication"],
        children: [basicAuthenticationCase, badAuthenticationCase, malformedAuthenticationCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.communication.encoding",
        title: "Encoding",
        specVersion,
        tags: ["communication", "encoding"],
        children: [utf8EncodingCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.communication.content-types",
        title: "Content Types",
        specVersion,
        tags: ["communication", "content-types"],
        children: [
          jsonFileUrlContentTypeCase,
          multipartFileUrlContentTypeCase,
          multipartRawAttachmentContentTypeCase,
          jsonRawAttachmentRejectedCase,
          formDataFileUrlRejectedCase,
          formDataRawRejectedCase,
          extraMultipartSectionRejectedCase,
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.communication.concurrency",
        title: "Concurrency",
        specVersion,
        tags: ["communication", "concurrency"],
        children: [stateConcurrencySuite, activityProfileConcurrencySuite, agentProfileConcurrencySuite],
      },
    ],
  };
}

export function createProofSliceRegistry(): RegistryDefinition {
  const builder = new RegistryBuilder();
  builder.addSuite(specVersion, createV20ProofSliceSuite());
  builder.addSuite(specVersion, createV20StateResourceProofSliceSuite());
  builder.addSuite(specVersion, createV20ActivityProfileResourceProofSliceSuite());
  builder.addSuite(specVersion, createV20AgentProfileResourceProofSliceSuite());
  builder.addSuite(specVersion, createV20AgentsResourceProofSliceSuite());
  builder.addSuite(specVersion, createV20ActivitiesResourceProofSliceSuite());
  builder.addSuite(specVersion, createV20AboutResourceProofSliceSuite());
  builder.addSuite(specVersion, createV20CommunicationProofSliceSuite());
  return builder.build();
}
