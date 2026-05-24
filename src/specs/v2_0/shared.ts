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
  statementGeneratedIdRoundTripCase,
  statementMutationFamily,
  statementQueryValidationFamily,
  statementRoundTripCase,
} from "../../registry/families";

export const specVersion = "2.0.0" as const;
export const formattingLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/Data2.2-FormattingRequirements.js";
export const formattingLegacyConfigFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/formatting.js";
export const verifyLegacyConfigFile = "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/verify.js";
export const actorRequirementsLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.1-Actor-Requirements.js";
export const verbRequirementsLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.2-Verb-Requirements.js";
export const contextLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js";
export const contextsLegacyConfigFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contexts.js";
export const contextActivitiesLegacyConfigFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contextactivities.js";
export const objectRequirementsLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.3-Object-Requirements.js";
export const resultRequirementsLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.4-Result-Requirements.js";
export const attachmentRequirementsLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.6-Attachment-Requirements.js";
export const idRequirementsLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-ID-Requirements.js";
export const storedRequirementsLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Stored-Requirements.js";
export const timestampRequirementsLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Timestamp-Requirements.js";
export const versionRequirementsLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.3-Version-Requirements.js";
export const additionalDataTypesLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.7-Additional-Requirements-for-Data-Types.js";
export const retrievalOfStatementsLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/E.Data2.5-RetrievalofStatements.js";
export const signedStatementsLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/E.Data2.6-SignedStatements.js";
export const specialDataTypesLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/E.Data4.0-SpecialDataTypesAndRules.js";
export const statementResourceLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.1.6.1-Statement-Resource.js";
export const errorCodesLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/H.Communication3.2-ErrorCodes.js";
export const stateResourceLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.1.6.2-State-Resource.js";
export const agentsResourceLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.1.6.3-Agents-Resource.js";
export const activitiesResourceLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.1.6.4-Activity-Resource.js";
export const agentProfileLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.1.6.5-Agent-Profile-Resource.js";
export const activityProfileLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.1.6.6-Activity-Profile-Resource.js";
export const aboutResourceLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.1.6.7-About-Resource.js";
export const headRequestsLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/H.Communication1.1-HeadRequestImplementation.js";
export const contentTypesLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.1.3-Content-Types.js";
export const concurrencyLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.1.4-Concurrency.js";
export const encodingLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/H.Communication1.4-Encoding.js";
export const versioningLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/H.Communication3.3-Versioning.js";
export const authenticationLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/H.Communication4.0-Authentication.js";
export const documentResourcesLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/H.Communication2.2-DocumentResources.js";
export const parametersLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/Parameters/testing.js";
export const ifisLegacyConfigFile = "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/ifis.js";
export const actorsLegacyConfigFile = "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/actors.js";
export const agentsLegacyConfigFile = "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/agents.js";
export const attachmentsLegacyConfigFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/attachments.js";
export const groupsLegacyConfigFile = "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/groups.js";
export const verbsLegacyConfigFile = "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/verbs.js";
export const voidingLegacyConfigFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/voiding.js";
export const authoritiesLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Authority-Requirements.js";
export const authoritiesLegacyConfigFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/authorities.js";
export const statementLifecycleLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.5-Statement-Voiding.js";
export const accountObjectsLegacyConfigFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/accountobjects.js";
export const activitiesLegacyConfigFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/activities.js";
export const objectsLegacyConfigFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/objects.js";
export const resultsLegacyConfigFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/results.js";
export const durationsLegacyConfigFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/durations.js";
export const scoresLegacyConfigFile = "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/scores.js";
export const timestampPropertyLegacyConfigFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/timestamp_property.js";
export const timestampsLegacyConfigFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/timestamps.js";
export const uuidsLegacyConfigFile = "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/uuids.js";
export const versionPropertyLegacyConfigFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/version.js";
export const statementRefsLegacyConfigFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/statementrefs.js";
export const subStatementsLegacyConfigFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/substatements.js";
export const extensionsLegacyConfigFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/extensions.js";
export const languagesLegacyConfigFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/languages.js";

export const proofUuidPrefix = "33333333-3333-4333-8333-";
export const multipartStatementRequestBoundary = "mock-proof-statement-request";
export const multipartStatementResponseContentType = "multipart/mixed; boundary=mock-xapi-statement-attachments";
export const signatureAttachmentUsageType = "http://adlnet.gov/expapi/attachments/signature";
export const signatureAttachmentContentType = "application/octet-stream";
export const isoTimestampHeaderPattern = "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3,9}Z$";
export const rfc1123HeaderPattern = "^[A-Z][a-z]{2}, \\d{2} [A-Z][a-z]{2} \\d{4} \\d{2}:\\d{2}:\\d{2} GMT$";
export const invalidUuidNumeric = 12345;
export const invalidUuidObject = { key: "should fail" };
export const invalidUuidTooManyDigits = "AA97B177-9383-4934-8543-0F91A7A028368";
export const invalidUuidInvalidLetter = "MA97B177-9383-4934-8543-0F91A7A02836";
export const invalidLegacyDate = "01/011/2015";
export const invalidLegacyString = "should fail";
export const invalidNegativeZeroTimestamp = "2008-09-15T15:53:00.601-00";
export const invalidNegativeZeroTimestampCompact = "2008-09-15T15:53:00.601-0000";
export const invalidNegativeZeroTimestampExtended = "2008-09-15T15:53:00.601-00:00";
export const validRfc3339Timestamp = "2008-09-15T15:53:00.601+00:00";
export const futureAcceptedTimestamp = "2031-05-23T12:00:00.000Z";
export const overwrittenStoredTimestamp = "2011-07-15T00:00:00.000Z";
export const invalidSerializedQueryNumeric = "1";
export const invalidSerializedQueryBoolean = "true";
export const invalidSerializedQueryObject = JSON.stringify({ key: "value" });

export function buildVersionedHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  return {
    "X-Experience-API-Version": specVersion,
    ...extraHeaders,
  };
}

export function buildVersionedRequest(
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

export function omitQueryParam(query: Record<string, string>, key: string): Record<string, string> {
  const nextQuery = { ...query };
  delete nextQuery[key];
  return nextQuery;
}

export function buildDocumentResourceValidationCase(options: {
  caseId: string;
  title: string;
  specVersion: typeof specVersion;
  endpoint: EndpointKind;
  method: HttpMethod;
  query: Record<string, string>;
  body?: Parameters<typeof buildVersionedRequest>[3];
  requirementRefs: RequirementRef[];
  tags: string[];
  capabilityFlags: string[];
  legacyTraceSuiteFile: string;
  legacyTraceConfigFile?: string;
  notes?: string[];
  expectedStatus?: number;
}): CaseDefinition {
  return singleRequestCase({
    caseId: options.caseId,
    title: options.title,
    specVersion: options.specVersion,
    requirementRefs: options.requirementRefs,
    tags: options.tags,
    capabilityFlags: options.capabilityFlags,
    legacyTraceSuiteFile: options.legacyTraceSuiteFile,
    legacyTraceConfigFile: options.legacyTraceConfigFile,
    request: buildVersionedRequest(options.method, options.endpoint, options.query, options.body),
    assertion: {
      status: options.expectedStatus ?? 400,
    },
    notes: options.notes ?? [],
  });
}

export function buildStatementBody(body: JsonObject): NonNullable<HttpRequest["body"]> {
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

export function buildStatementBatchBody(body: unknown[]): NonNullable<HttpRequest["body"]> {
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

export function buildStatementPostRequest(body: JsonObject, extraHeaders: Record<string, string> = {}): HttpRequest {
  return {
    method: "POST",
    endpoint: "statements",
    authMode: "basic",
    headers: buildVersionedHeaders(extraHeaders),
    query: {},
    body: buildStatementBody(body),
  };
}

export function buildStatementBatchPostRequest(
  body: unknown[],
  extraHeaders: Record<string, string> = {},
): HttpRequest {
  return {
    method: "POST",
    endpoint: "statements",
    authMode: "basic",
    headers: buildVersionedHeaders(extraHeaders),
    query: {},
    body: buildStatementBatchBody(body),
  };
}

export function buildStatementLookupRequest(
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

export function buildStatementGetRequest(statementId: string, extraHeaders: Record<string, string> = {}): HttpRequest {
  return buildStatementLookupRequest("statementId", statementId, extraHeaders);
}

export function buildVoidedStatementGetRequest(
  statementId: string,
  extraHeaders: Record<string, string> = {},
): HttpRequest {
  return buildStatementLookupRequest("voidedStatementId", statementId, extraHeaders);
}

export function buildStatementPutRequest(
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

export function buildStatementCollectionRequest(
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

export function buildRequestWithoutVersionHeader(
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

export function buildUnversionedGetRequest(endpoint: EndpointKind, query: Record<string, string>): HttpRequest {
  return buildRequestWithoutVersionHeader("GET", endpoint, query);
}

export function buildHeadRequest(
  endpoint: EndpointKind,
  query: Record<string, string>,
  includeVersionHeader = true,
  extraHeaders: Record<string, string> = {},
): HttpRequest {
  return includeVersionHeader
    ? buildVersionedRequest("HEAD", endpoint, query, undefined, extraHeaders)
    : buildRequestWithoutVersionHeader("HEAD", endpoint, query, undefined, extraHeaders);
}

export function buildAboutGetRequest(includeVersionHeader = true): HttpRequest {
  return includeVersionHeader ? buildVersionedRequest("GET", "about", {}) : buildUnversionedGetRequest("about", {});
}

export function buildAgentsGetRequest(agent: JsonObject | string, includeVersionHeader = true): HttpRequest {
  const query = {
    agent: typeof agent === "string" ? agent : JSON.stringify(agent),
  };

  return includeVersionHeader
    ? buildVersionedRequest("GET", "agents", query)
    : buildUnversionedGetRequest("agents", query);
}

export function buildActivitiesGetRequest(activityId: string, includeVersionHeader = true): HttpRequest {
  const query = {
    activityId,
  };

  return includeVersionHeader
    ? buildVersionedRequest("GET", "activities", query)
    : buildUnversionedGetRequest("activities", query);
}

export interface MultipartStatementAttachment {
  contentType: string;
  sha2: string;
  body: string;
  contentTransferEncoding?: string;
}

export interface MultipartStatementExtraPart {
  contentType: string;
  sha2?: string;
  body: string;
  contentTransferEncoding?: string;
}

export interface SignedStatementAttachment {
  metadata: JsonObject;
  part: MultipartStatementAttachment;
}

export interface SignedStatementRequestOptions {
  algorithm?: string;
  signaturePayload?: JsonObject | string;
  signatureContentType?: string;
  signatureUsageType?: string;
  boundary?: string;
  contentType?: string;
  extraHeaders?: Record<string, string>;
  extraParts?: MultipartStatementExtraPart[];
}

export function buildMultipartStatementRequestBody(
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
    body += `Content-Transfer-Encoding: ${attachment.contentTransferEncoding ?? "binary"}\r\n`;
    body += `X-Experience-API-Hash: ${attachment.sha2}\r\n\r\n`;
    body += `${attachment.body}\r\n`;
  }

  for (const part of extraParts) {
    body += `--${boundary}\r\n`;
    body += `Content-Type: ${part.contentType}\r\n`;
    body += `Content-Transfer-Encoding: ${part.contentTransferEncoding ?? "binary"}\r\n`;
    if (part.sha2) {
      body += `X-Experience-API-Hash: ${part.sha2}\r\n`;
    }
    body += "\r\n";
    body += `${part.body}\r\n`;
  }

  body += `--${boundary}--\r\n`;
  return body;
}

export function buildMultipartStatementPostRequest(
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

export function buildMalformedMultipartStatementRequest(body: string, contentType: string): HttpRequest {
  return buildVersionedRequest(
    "POST",
    "statements",
    {},
    {
      kind: "text",
      value: body,
      contentType,
    },
  );
}

export function buildMockJws(payload: JsonObject | string, algorithm = "RS256"): string {
  const header = Buffer.from(JSON.stringify({ alg: algorithm }), "utf8").toString("base64url");
  const payloadText = typeof payload === "string" ? payload : JSON.stringify(payload);
  const encodedPayload = Buffer.from(payloadText, "utf8").toString("base64url");
  const signature = Buffer.from(`proof-signature:${algorithm}`, "utf8").toString("base64url");
  return `${header}.${encodedPayload}.${signature}`;
}

export function buildSignedStatementAttachment(
  signatureBody: string,
  contentType = signatureAttachmentContentType,
  usageType = signatureAttachmentUsageType,
): SignedStatementAttachment {
  const sha2 = createHash("sha256").update(signatureBody).digest("hex");

  return {
    metadata: {
      usageType,
      display: {
        "en-US": "Signed by the Proof Slice",
      },
      description: {
        "en-US": "Signed by the Proof Slice",
      },
      contentType,
      length: signatureBody.length,
      sha2,
    },
    part: {
      contentType,
      sha2,
      body: signatureBody,
    },
  };
}

export function buildSignedStatementPostRequest(
  statement: JsonObject,
  options: SignedStatementRequestOptions = {},
): HttpRequest {
  const signatureBody = buildMockJws(options.signaturePayload ?? statement, options.algorithm ?? "RS256");
  const signatureAttachment = buildSignedStatementAttachment(
    signatureBody,
    options.signatureContentType ?? signatureAttachmentContentType,
    options.signatureUsageType ?? signatureAttachmentUsageType,
  );

  return buildMultipartStatementPostRequest(
    {
      ...statement,
      attachments: [signatureAttachment.metadata],
    },
    [signatureAttachment.part],
    options.extraHeaders ?? {},
    {
      boundary: options.boundary,
      contentType: options.contentType,
      extraParts: options.extraParts,
    },
  );
}

export function listEquals(expected: string[]) {
  return [
    {
      path: [],
      equals: expected,
    },
  ];
}

export function buildProofUuid(sequence: number): string {
  return `${proofUuidPrefix}${sequence.toString().padStart(12, "0")}`;
}

export function buildProofTimestamp(second: number): string {
  return new Date(Date.UTC(2026, 4, 23, 12, 0, second)).toISOString();
}

export function buildProofStoredTimestamp(second: number): string {
  return new Date(buildProofTimestamp(second)).toISOString();
}

export function buildProofDocumentEtag(body: unknown, mediaType = "application/json"): string {
  const serialized = typeof body === "string" ? body : (JSON.stringify(body) ?? "");
  return `"${createHash("sha1").update(`${mediaType}:${serialized}`).digest("hex")}"`;
}

export function buildFormatProofStatement(sequence: number, actorMbox: string): StatementFixture {
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

export function buildMultipartAttachmentMetadata(attachment: MultipartStatementAttachment): JsonObject {
  return buildAttachmentFixture({
    contentType: attachment.contentType,
    sha2: attachment.sha2,
    length: attachment.body.length,
    fileUrl: "https://example.test/files/proof-attachment.txt",
  });
}

export function buildProofStatement(sequence: number, transforms: FixtureTransform[] = []): StatementFixture {
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

export function buildAgentQuery(mbox: string): string {
  return JSON.stringify({
    objectType: "Agent",
    mbox,
  });
}

export function buildStatementCollectionExpectations(expectedStatementIds: string[]): JsonPathExpectation[] {
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

export function buildStatementCollectionMorePath(query: Record<string, string>): string {
  return `/xapi/statements?${new URLSearchParams(query).toString()}`;
}

export interface StatementCollectionQueryCaseOptions {
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

export function buildStatementCollectionQueryCase(options: StatementCollectionQueryCaseOptions): CaseDefinition {
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
          jsonPathEquals: listEquals([statement.id]),
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

export function buildStatementCollectionTextCase(options: {
  caseId: string;
  title: string;
  requirementRefs: RequirementRef[];
  tags: string[];
  query: Record<string, string>;
  legacyTraceSuiteFile: string;
  notes?: string[];
  capabilityFlags?: string[];
  extraHeaders?: Record<string, string>;
}): CaseDefinition {
  return singleRequestCase({
    caseId: options.caseId,
    title: options.title,
    specVersion,
    requirementRefs: options.requirementRefs,
    tags: options.tags,
    capabilityFlags: options.capabilityFlags ?? ["query", "retrieval"],
    legacyTraceSuiteFile: options.legacyTraceSuiteFile,
    request: buildStatementCollectionRequest(options.query, options.extraHeaders),
    assertion: {
      status: 200,
      textContains: ['"statements"'],
    },
    notes: options.notes ?? ["proof-slice statement collection direct trace"],
  });
}

export function buildQueryRecord(query: Record<string, string | undefined>): Record<string, string> {
  return Object.fromEntries(Object.entries(query).filter(([, value]) => value !== undefined)) as Record<string, string>;
}

export function buildStatementQueryExclusivityCases(options: {
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

export const validSinceTimestamp = "2020-01-01T00:00:00.000Z";
export const invalidSinceTimestamp = "not-a-timestamp";
export const validGroupMemberMbox = "mailto:proof-group-member@example.test";
export const validNestedAgentMbox = "mailto:proof-nested-agent@example.test";
export const validMboxSha1sum = "495395e777cd98da653df9615d09c0fd6bb2f8d4";
export const validAccountHomePage = "https://example.test/xapi/accounts/proof";
export const validAccountName = "proof-account";
export const validAuthorityAccountHomePage = "http://example.com/xAPI/OAuth/Token";
export const validAuthorityAccountName = "oauth_consumer_x75db";
export const validAuthorityMemberMbox = "mailto:bob@example.com";
export const validAuthorityThirdMemberMbox = "mailto:james@example.com";
export const explicitNonOauthAuthorityMemberMbox = "mailto:agent-a@example.com";
export const explicitNonOauthAuthoritySecondMemberMbox = "mailto:agent-b@example.com";
export const populatedAuthorityAccountHomePage = "https://example.test/xapi/auth/basic";
export const populatedAuthorityUserName = "proof-basic-user";
export const populatedAuthorityAuthorization = "Basic cHJvb2YtYmFzaWMtdXNlcjpwcm9vZi1iYXNpYy1wYXNzd29yZA==";
export const invalidMailtoIri = "http://should.fail.com";
export const invalidMailtoEmail = "mailto:should.fail.com";
export const invalidOpenId = "ab=c://should.fail.com";
export const invalidAccountHomePage = "ab=c://should.fail.com";
export const nonJsonDocumentBody = "abcdefg";
export const existingNonJsonDocumentBody = "/ asdf / undefined";
export const invalidAgentQuery = '{"objectType":"Agent"';
export const invalidJsonDocumentBody = '{"name":"Broken profile document"[';
export const validScoreDecimal = 0.6767676;
export const validScoreMaxDecimal = 100.6767676;

export function buildVerbFixture(id: string, display: string): JsonObject {
  return {
    id,
    display: {
      "en-US": display,
    },
  };
}

export function buildActivityObjectFixture(
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

export function buildActivityDefinitionFixture(overrides: Partial<JsonObject> = {}): JsonObject {
  return {
    ...overrides,
  };
}

export function buildInteractionComponentFixture(id: string, description = "Proof interaction component"): JsonObject {
  return {
    id,
    description: {
      "en-US": description,
    },
  };
}

export function buildAgentWithMbox(mbox: string): JsonObject {
  return {
    objectType: "Agent",
    mbox,
    name: "Proof Agent",
  };
}

export function buildGroupWithMbox(mbox: string, includeMember = true): JsonObject {
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

export function buildAgentWithOpenId(openid: string): JsonObject {
  return {
    objectType: "Agent",
    openid,
    name: "Proof Agent",
  };
}

export function buildGroupWithOpenId(openid: string, includeMember = true): JsonObject {
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

export function buildAgentWithMboxSha1sum(mboxSha1sum: unknown): JsonObject {
  return {
    objectType: "Agent",
    mbox_sha1sum: mboxSha1sum,
    name: "Proof Agent",
  };
}

export function buildGroupWithMboxSha1sum(mboxSha1sum: unknown, includeMember = true): JsonObject {
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

export function buildAccount(homePage?: string, name?: string): JsonObject {
  const account: JsonObject = {};

  if (homePage !== undefined) {
    account.homePage = homePage;
  }

  if (name !== undefined) {
    account.name = name;
  }

  return account;
}

export function buildAgentWithAccount(account: JsonObject): JsonObject {
  return {
    objectType: "Agent",
    account,
    name: "Proof Agent",
  };
}

export function buildGroupWithAccount(account: JsonObject, includeMember = true): JsonObject {
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

export function buildAgentWithoutIfi(): JsonObject {
  return {
    objectType: "Agent",
    name: "Proof Agent",
  };
}

export function buildGroupWithoutIfiOrMember(): JsonObject {
  return {
    objectType: "Group",
    name: "Proof Group",
  };
}

export function buildAuthorityAccountAgent(): JsonObject {
  return {
    account: buildAccount(validAuthorityAccountHomePage, validAuthorityAccountName),
  };
}

export function buildAuthorityMboxAgent(mbox = validAuthorityMemberMbox): JsonObject {
  return {
    mbox,
  };
}

export function buildAnonymousAuthorityGroup(
  members: JsonObject[] = [buildAuthorityAccountAgent(), buildAuthorityMboxAgent()],
): JsonObject {
  return {
    objectType: "Group",
    member: members,
  };
}

export function buildIdentifiedAuthorityGroup(overrides: Partial<JsonObject>): JsonObject {
  return {
    ...buildAnonymousAuthorityGroup(),
    ...overrides,
  };
}

export function buildSubStatementFixture(overrides: Partial<JsonObject> = {}): JsonObject {
  return {
    objectType: "SubStatement",
    actor: buildAgentWithMbox(validNestedAgentMbox),
    verb: buildVerbFixture("https://example.test/xapi/verbs/experienced", "experienced"),
    object: buildActivityObjectFixture("https://example.test/xapi/activities/substatement"),
    ...overrides,
  };
}

export function buildAttachmentFixture(overrides: Partial<JsonObject> = {}): JsonObject {
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

export function buildResultFixture(overrides: Partial<JsonObject> = {}): JsonObject {
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

export function buildStatementRefFixture(id = buildProofUuid(960)): JsonObject {
  return {
    objectType: "StatementRef",
    id,
  };
}

export type ContextActivityKind = "parent" | "grouping" | "category" | "other";
export type InteractionComponentField = "choices" | "scale" | "source" | "target" | "steps";

export interface ResultPlacement {
  idSuffix: string;
  title: string;
  buildTransforms(result: JsonObject): FixtureTransform[];
}

export const resultPlacements: ResultPlacement[] = [
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

export interface StatementRefPlacement {
  idSuffix: string;
  title: string;
  buildTransforms(statementRef: JsonObject): FixtureTransform[];
}

export const statementRefPlacements: StatementRefPlacement[] = [
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

export interface TimestampPlacement {
  idSuffix: string;
  title: string;
  buildTransforms(timestamp: string): FixtureTransform[];
}

export const timestampPlacements: TimestampPlacement[] = [
  {
    idSuffix: "statement",
    title: "a statement timestamp",
    buildTransforms(timestamp) {
      return [
        {
          operation: "set",
          path: ["timestamp"],
          value: timestamp,
        },
      ];
    },
  },
  {
    idSuffix: "substatement",
    title: "a substatement timestamp",
    buildTransforms(timestamp) {
      return [
        {
          operation: "set",
          path: ["object"],
          value: buildSubStatementFixture({
            timestamp,
          }),
        },
      ];
    },
  },
];

export interface ActivityObjectPlacement {
  idSuffix: string;
  title: string;
  buildTransforms(activityObject: JsonObject): FixtureTransform[];
}

export const activityObjectPlacements: ActivityObjectPlacement[] = [
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

export interface InteractionComponentTarget {
  idSuffix: string;
  title: string;
  field: InteractionComponentField;
  interactionType: string;
  correctResponsesPattern: string[];
  components: JsonObject[];
}

export const interactionComponentTargets: InteractionComponentTarget[] = [
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

export interface ContextPlacement {
  idSuffix: string;
  title: string;
  buildTransforms(context: JsonObject): FixtureTransform[];
}

export const contextPlacements: ContextPlacement[] = [
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

export const contextActivityKinds: ContextActivityKind[] = ["parent", "grouping", "category", "other"];

export function buildContextStatementRefFixture(id: string): JsonObject {
  return {
    objectType: "StatementRef",
    id,
  };
}

export function buildContextActivityFixture(id: string, includeObjectType = true): JsonObject {
  return includeObjectType
    ? {
        objectType: "Activity",
        id,
      }
    : {
        id,
      };
}

export function buildContextActivitiesFixture(activities: JsonObject): JsonObject {
  return {
    contextActivities: activities,
  };
}

export function buildContextPropertyFixture(name: "revision" | "platform", value: string): JsonObject {
  return {
    [name]: value,
  } as JsonObject;
}

export function buildContextPropertyConstraintTransforms(
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

export function buildContextActivitiesRoundTripPath(placementId: string, kind: ContextActivityKind): string[] {
  return placementId === "statement"
    ? ["context", "contextActivities", kind]
    : ["object", "context", "contextActivities", kind];
}

export function buildActivityObjectRoundTripPath(placementId: string, propertyPath: string[]): string[] {
  return placementId === "statement" ? ["object", ...propertyPath] : ["object", "object", ...propertyPath];
}

export function buildActivityDefinitionWithInteractionField(options: {
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

export interface ActorLikePlacement {
  idSuffix: string;
  title: string;
  kind: "agent" | "group";
  buildTransforms(value: JsonObject): FixtureTransform[];
}

export const actorLikePlacements: ActorLikePlacement[] = [
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

export const agentActorPlacements = actorLikePlacements.filter((placement) => placement.kind === "agent");
export const groupActorPlacements = actorLikePlacements.filter((placement) => placement.kind === "group");

export interface VerbPlacement {
  idSuffix: string;
  title: string;
  buildTransforms(verb: JsonObject): FixtureTransform[];
}

export const verbPlacements: VerbPlacement[] = [
  {
    idSuffix: "statement",
    title: "a statement verb",
    buildTransforms(verb) {
      return [
        {
          operation: "set",
          path: ["verb"],
          value: verb,
        },
      ];
    },
  },
  {
    idSuffix: "substatement",
    title: "a substatement verb",
    buildTransforms(verb) {
      return [
        {
          operation: "set",
          path: ["object"],
          value: buildSubStatementFixture({
            verb,
          }),
        },
      ];
    },
  },
];

export interface IfiSpec {
  idToken: string;
  label: string;
  buildAgent(): JsonObject;
  buildGroup(includeMember?: boolean): JsonObject;
}

export const ifiSpecs: IfiSpec[] = [
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

export function mergeActorLikeValues(primary: JsonObject, secondary: JsonObject): JsonObject {
  return {
    ...primary,
    ...secondary,
  };
}

export function buildRepeatedActorMutationVariants(options: {
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

export function buildIfiExclusivityVariants(options: {
  placements: ActorLikePlacement[];
  requirementRefs: RequirementRef[];
}) {
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

export function buildIfiAcceptanceVariants(options: {
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

export function buildMissingIfiVariants(options: {
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

export {
  RegistryBuilder,
  buildActivityProfileDocumentFixture,
  buildActivityProfileIdentityFixture,
  buildActivityStateDocumentFixture,
  buildActivityStateIdentityFixture,
  buildAgentProfileDocumentFixture,
  buildAgentProfileIdentityFixture,
  buildStatementFixture,
  createHash,
  documentRoundTripCase,
  queryRetrievalFamily,
  requestSequenceCase,
  requiredFieldFamily,
  singleRequestCase,
  statementGeneratedIdRoundTripCase,
  statementMutationFamily,
  statementQueryValidationFamily,
  statementRoundTripCase,
};

export type {
  CaseDefinition,
  EndpointKind,
  FixtureTransform,
  HttpMethod,
  HttpRequest,
  JsonObject,
  JsonPathExpectation,
  RegistryDefinition,
  RequirementRef,
  StatementFixture,
  SuiteDefinition,
};
