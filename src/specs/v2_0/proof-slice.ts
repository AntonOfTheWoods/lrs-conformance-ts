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
const statementResourceLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.1.6.1-Statement-Resource.js";
const errorCodesLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/H.Communication3.2-ErrorCodes.js";
const stateResourceLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.1.6.2-State-Resource.js";
const agentProfileLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.1.6.5-Agent-Profile-Resource.js";
const activityProfileLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.1.6.6-Activity-Profile-Resource.js";
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

interface MultipartStatementAttachment {
  contentType: string;
  sha2: string;
  body: string;
}

function buildMultipartStatementRequestBody(
  statement: JsonObject,
  attachments: MultipartStatementAttachment[],
  boundary = multipartStatementRequestBoundary,
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

  body += `--${boundary}--\r\n`;
  return body;
}

function buildMultipartStatementPostRequest(
  statement: JsonObject,
  attachments: MultipartStatementAttachment[],
  extraHeaders: Record<string, string> = {},
): HttpRequest {
  return buildVersionedRequest(
    "POST",
    "statements",
    {},
    {
      kind: "text",
      value: buildMultipartStatementRequestBody(statement, attachments),
      contentType: `multipart/mixed; boundary=${multipartStatementRequestBoundary}`,
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

function buildVerbFixture(id: string, display: string): JsonObject {
  return {
    id,
    display: {
      "en-US": display,
    },
  };
}

function buildActivityObjectFixture(id: string): JsonObject {
  return {
    objectType: "Activity",
    id,
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

export function createProofSliceRegistry(): RegistryDefinition {
  const builder = new RegistryBuilder();
  builder.addSuite(specVersion, createV20ProofSliceSuite());
  builder.addSuite(specVersion, createV20StateResourceProofSliceSuite());
  builder.addSuite(specVersion, createV20ActivityProfileResourceProofSliceSuite());
  builder.addSuite(specVersion, createV20AgentProfileResourceProofSliceSuite());
  return builder.build();
}
