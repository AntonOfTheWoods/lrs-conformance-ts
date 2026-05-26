import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "bun:test";

import { runConsoleRunnerArgv } from "../../src/describe-runtime/console-runner.ts";

interface CapturedRequest {
  body: unknown;
  method: string;
  path: string;
  query: string;
  version: string | null;
}

interface ParsedMultipartPart {
  bodyText: string;
  headers: Record<string, string>;
}

type ParsedMultipartStatementRequest = {
  attachments: Map<string, StoredAttachmentBody>;
  body: unknown;
  parts: ParsedMultipartPart[];
};

type ParsedAlternateStatementRequest = {
  body: unknown;
  contentType: string | null;
  headers: Headers;
  method: "DELETE" | "GET" | "HEAD" | "POST" | "PUT";
  searchParams: URLSearchParams;
};

interface StoredAttachmentBody {
  bodyText: string;
  contentType: string;
}

interface StoredDocument {
  body: unknown;
  contextKey: string;
  id: string;
  mediaType: string;
  storedAt: number;
}

const versionHeaderExemptPaths = new Set(["/xapi/about"]);
const versionedApiPaths = new Set([
  "/xapi/statements",
  "/xapi/activities",
  "/xapi/activities/profile",
  "/xapi/activities/state",
  "/xapi/agents",
  "/xapi/agents/profile",
]);
const validBasicUserName = "proof-basic-user";
const validBasicPassword = "proof-basic-password";
const validOauthAuthorizationPrefix = "OAuth ";
const signatureUsageType = "http://adlnet.gov/expapi/attachments/signature";
const allowedSignatureAlgorithms = new Set(["RS256", "RS384", "RS512"]);
const alternateHeaderParameters = new Set([
  "Authorization",
  "Content-Length",
  "Content-Type",
  "If-Match",
  "If-None-Match",
  "X-Experience-API-Version",
]);

const silentLogger = {
  log: (..._args: unknown[]) => {},
  error: (..._args: unknown[]) => {},
};

function createNowSequence(sequence: number[]): () => number {
  return () => sequence.shift() ?? 0;
}

function createMockHeaders(
  version: string,
  contentType = "application/json",
  extraHeaders: Record<string, string> = {},
): Headers {
  return new Headers({
    "content-type": contentType,
    "x-experience-api-version": version,
    ...extraHeaders,
  });
}

function withoutBody(response: Response): Response {
  return new Response(null, {
    status: response.status,
    headers: new Headers(response.headers),
  });
}

function validateVersionHeader(request: Request, path: string, version: string): Response | undefined {
  if (!versionedApiPaths.has(path) || versionHeaderExemptPaths.has(path)) {
    return undefined;
  }

  if (request.headers.get("x-experience-api-version") === version) {
    return undefined;
  }

  return new Response(JSON.stringify({ error: "X-Experience-API-Version header is required" }), {
    status: 400,
    headers: createMockHeaders(version),
  });
}

function parseBasicAuthCredentials(headerValue: string | null): { password: string; username: string } | undefined {
  if (!headerValue) {
    return undefined;
  }

  const [scheme, encoded] = headerValue.split(" ", 2);
  if (!scheme || scheme.toLowerCase() !== "basic" || !encoded) {
    return undefined;
  }

  try {
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex <= 0) {
      return undefined;
    }

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return undefined;
  }
}

function validateAuthorizationHeader(request: Request, version: string): Response | undefined {
  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return new Response(JSON.stringify({ error: "authorization is required" }), {
      status: 401,
      headers: createMockHeaders(version),
    });
  }

  if (authorization.startsWith(validOauthAuthorizationPrefix)) {
    return undefined;
  }

  const credentials = parseBasicAuthCredentials(authorization);
  if (credentials && credentials.username === validBasicUserName && credentials.password === validBasicPassword) {
    return undefined;
  }

  return new Response(JSON.stringify({ error: "unauthorized" }), {
    status: 401,
    headers: createMockHeaders(version),
  });
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const allowedStatementKeys = new Set([
  "id",
  "actor",
  "verb",
  "object",
  "result",
  "context",
  "timestamp",
  "stored",
  "authority",
  "version",
  "attachments",
]);

const allowedInteractionTypes = new Set([
  "true-false",
  "choice",
  "fill-in",
  "long-fill-in",
  "matching",
  "performance",
  "sequencing",
  "likert",
  "numeric",
  "other",
]);

const allowedActorObjectTypes = new Set(["Agent", "Group"]);
const allowedObjectObjectTypes = new Set(["Activity", "Agent", "Group", "SubStatement", "StatementRef"]);
const contextActivityTypes = ["parent", "grouping", "category", "other"] as const;
const allowedContextActivityKeys = new Set(contextActivityTypes);
const allowedStatementQueryKeys = new Set([
  "activity",
  "agent",
  "ascending",
  "attachments",
  "format",
  "limit",
  "offset",
  "registration",
  "related_activities",
  "related_agents",
  "since",
  "statementId",
  "until",
  "verb",
  "voidedStatementId",
]);
const singleStatementAllowedKeys = new Set(["attachments", "format", "statementId", "voidedStatementId"]);

const languageTagPattern =
  /^[A-Za-z]{2,3}(?:-[A-Za-z]{4})?(?:-(?:[A-Za-z]{2}|\d{3}))?(?:-(?:[A-Za-z0-9]{5,8}|\d[A-Za-z0-9]{3}))*$/;
const allowedVersionPattern = /^(?:1\.0(?:\.\d+)?|2\.0\.0)$/;
const isoDurationPattern =
  /^P(?=.)(?:\d+(?:\.\d+)?W|(?:(?:\d+(?:\.\d+)?Y)?(?:\d+(?:\.\d+)?M)?(?:\d+(?:\.\d+)?D)?(?:T(?=\d)(?:\d+(?:\.\d+)?H)?(?:\d+(?:\.\d+)?M)?(?:\d+(?:\.\d+)?S)?)?))$/;

const interactionComponentParents = new Set(["choices", "scale", "source", "target", "steps"]);

const isoTimestampPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
const voidedVerbSuffix = "voided";
const statementAttachmentResponseBoundary = "mock-xapi-statement-attachments";

type StatementResponseFormat = "canonical" | "exact" | "ids";

type ActorRole = "Agent" | "Group" | "Either";

function determineStatementStatus(body: unknown): number {
  if (!isObjectRecord(body)) {
    return 400;
  }

  if (!("actor" in body) || !("verb" in body) || !("object" in body)) {
    return 400;
  }

  if ("id" in body && !isUuidLike(typeof body.id === "string" ? body.id : null)) {
    return 400;
  }

  if (Object.keys(body).some((key) => !allowedStatementKeys.has(key))) {
    return 400;
  }

  const result = body.result;
  if (isObjectRecord(result)) {
    const score = result.score;
    if (isObjectRecord(score) && typeof score.max === "string") {
      return 400;
    }

    if (typeof result.success === "string") {
      return 400;
    }

    if (typeof result.completion === "string") {
      return 400;
    }
  }

  if (hasInvalidNullOutsideExtensions(body, false)) {
    return 400;
  }

  if (hasInvalidAccountName(body)) {
    return 400;
  }

  if (hasInvalidInteractionType(body)) {
    return 400;
  }

  if (hasInvalidLanguageTag(body)) {
    return 400;
  }

  if (hasInvalidLanguageMapShape(body)) {
    return 400;
  }

  if (hasInvalidVerb(body)) {
    return 400;
  }

  if (hasInvalidVersion(body)) {
    return 400;
  }

  if (hasInvalidActor(body)) {
    return 400;
  }

  if (hasInvalidObject(body)) {
    return 400;
  }

  if (hasInvalidContext(body)) {
    return 400;
  }

  if (hasInvalidAuthority(body)) {
    return 400;
  }

  if (hasInvalidAttachments(body)) {
    return 400;
  }

  if (hasInvalidStatementLifecycle(body)) {
    return 400;
  }

  if (hasInvalidResultProperties(body)) {
    return 400;
  }

  if (hasInvalidTimestamp(body)) {
    return 400;
  }

  if (hasInvalidActorObjectType(body)) {
    return 400;
  }

  if (hasMissingIriScheme(body)) {
    return 400;
  }

  return 200;
}

function hasInvalidNullOutsideExtensions(value: unknown, insideExtensions: boolean): boolean {
  if (value === null) {
    return !insideExtensions;
  }

  if (Array.isArray(value)) {
    return value.some((item) => hasInvalidNullOutsideExtensions(item, insideExtensions));
  }

  if (!isObjectRecord(value)) {
    return false;
  }

  return Object.entries(value).some(([key, childValue]) => {
    const childInsideExtensions = insideExtensions || key === "extensions";
    return hasInvalidNullOutsideExtensions(childValue, childInsideExtensions);
  });
}

function hasInvalidAccountName(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some((item) => hasInvalidAccountName(item));
  }

  if (!isObjectRecord(value)) {
    return false;
  }

  const account = value.account;
  if (isObjectRecord(account) && "name" in account && typeof account.name !== "string") {
    return true;
  }

  return Object.values(value).some((childValue) => hasInvalidAccountName(childValue));
}

function hasInvalidInteractionType(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some((item) => hasInvalidInteractionType(item));
  }

  if (!isObjectRecord(value)) {
    return false;
  }

  const definition = value.definition;
  if (isObjectRecord(definition) && typeof definition.interactionType === "string") {
    if (!allowedInteractionTypes.has(definition.interactionType)) {
      return true;
    }
  }

  return Object.values(value).some((childValue) => hasInvalidInteractionType(childValue));
}

function isLanguageMapPath(path: readonly string[]): boolean {
  const last = path.at(-1);
  if (!last) {
    return false;
  }

  if (last === "display" && path.at(-2) === "verb") {
    return true;
  }

  if ((last === "display" || last === "description") && path.at(-3) === "attachments") {
    return true;
  }

  if ((last === "name" || last === "description") && path.at(-2) === "definition") {
    return true;
  }

  if (last === "description" && interactionComponentParents.has(path.at(-3) ?? "")) {
    return true;
  }

  return false;
}

function isValidLanguageTag(value: string): boolean {
  return languageTagPattern.test(value);
}

function hasInvalidLanguageTag(value: unknown, path: readonly string[] = []): boolean {
  if (typeof value === "string") {
    return path.at(-1) === "language" && path.at(-2) === "context" && !isValidLanguageTag(value);
  }

  if (Array.isArray(value)) {
    return value.some((item, index) => hasInvalidLanguageTag(item, [...path, String(index)]));
  }

  if (!isObjectRecord(value)) {
    return false;
  }

  if (isLanguageMapPath(path)) {
    return Object.keys(value).some((key) => !isValidLanguageTag(key));
  }

  return Object.entries(value).some(([key, childValue]) => hasInvalidLanguageTag(childValue, [...path, key]));
}

function hasInvalidLanguageMapShape(value: unknown, path: readonly string[] = []): boolean {
  if (isLanguageMapPath(path)) {
    return !isObjectRecord(value);
  }

  if (Array.isArray(value)) {
    return value.some((item, index) => hasInvalidLanguageMapShape(item, [...path, String(index)]));
  }

  if (!isObjectRecord(value)) {
    return false;
  }

  return Object.entries(value).some(([key, childValue]) => hasInvalidLanguageMapShape(childValue, [...path, key]));
}

function hasInvalidVerb(value: unknown, path: readonly string[] = []): boolean {
  if (path.at(-1) === "verb") {
    if (!isObjectRecord(value)) {
      return true;
    }

    if (typeof value.id !== "string") {
      return true;
    }
  }

  if (Array.isArray(value)) {
    return value.some((item, index) => hasInvalidVerb(item, [...path, String(index)]));
  }

  if (!isObjectRecord(value)) {
    return false;
  }

  return Object.entries(value).some(([key, childValue]) => hasInvalidVerb(childValue, [...path, key]));
}

function hasInvalidVersion(value: unknown, path: readonly string[] = []): boolean {
  if (typeof value === "string") {
    return path.at(-1) === "version" && !allowedVersionPattern.test(value);
  }

  if (Array.isArray(value)) {
    return value.some((item, index) => hasInvalidVersion(item, [...path, String(index)]));
  }

  if (!isObjectRecord(value)) {
    return false;
  }

  return Object.entries(value).some(([key, childValue]) => hasInvalidVersion(childValue, [...path, key]));
}

function hasInvalidActor(value: unknown, path: readonly string[] = []): boolean {
  if (Array.isArray(value)) {
    return value.some((item, index) => hasInvalidActor(item, [...path, String(index)]));
  }

  if (!isObjectRecord(value)) {
    return false;
  }

  const expectedRole = getExpectedActorRole(value, path);
  if (expectedRole && hasInvalidActorRecord(value, expectedRole)) {
    return true;
  }

  return Object.entries(value).some(([key, childValue]) => hasInvalidActor(childValue, [...path, key]));
}

function getExpectedActorRole(value: Record<string, unknown>, path: readonly string[]): ActorRole | undefined {
  if (path.at(-2) === "member") {
    return "Agent";
  }

  const last = path.at(-1);
  if (last === "team") {
    return "Group";
  }

  if (last === "actor" || last === "authority" || last === "instructor") {
    return "Either";
  }

  if (last === "object" && isActorCandidateRecord(value)) {
    return "Either";
  }

  return undefined;
}

function isActorCandidateRecord(value: Record<string, unknown>): boolean {
  if (value.objectType === "Agent" || value.objectType === "Group") {
    return true;
  }

  return "mbox" in value || "mbox_sha1sum" in value || "openid" in value || "account" in value || "member" in value;
}

function hasInvalidActorRecord(value: Record<string, unknown>, expectedRole: ActorRole): boolean {
  const objectType = value.objectType;
  if (objectType !== undefined && (typeof objectType !== "string" || !allowedActorObjectTypes.has(objectType))) {
    return true;
  }

  if (value.name !== undefined && typeof value.name !== "string") {
    return true;
  }

  if ("mbox" in value && !isValidActorMbox(value.mbox)) {
    return true;
  }

  if ("mbox_sha1sum" in value && !isValidActorMboxSha1sum(value.mbox_sha1sum)) {
    return true;
  }

  if ("openid" in value && !isValidActorOpenId(value.openid)) {
    return true;
  }

  if ("account" in value && !isValidActorAccount(value.account)) {
    return true;
  }

  const actorRole = inferActorRole(value, expectedRole);
  const ifiCount = countActorIfis(value);

  if (actorRole === "Group") {
    if (value.objectType !== "Group") {
      return true;
    }

    if ("member" in value) {
      if (!Array.isArray(value.member) || value.member.length === 0) {
        return true;
      }
    }

    if (ifiCount > 1) {
      return true;
    }

    if (ifiCount === 0 && (!Array.isArray(value.member) || value.member.length === 0)) {
      return true;
    }

    return false;
  }

  if ("member" in value) {
    return true;
  }

  if (value.objectType !== undefined && value.objectType !== "Agent") {
    return true;
  }

  return ifiCount !== 1;
}

function inferActorRole(value: Record<string, unknown>, expectedRole: ActorRole): Exclude<ActorRole, "Either"> {
  if (expectedRole !== "Either") {
    return expectedRole;
  }

  if (value.objectType === "Group" || "member" in value) {
    return "Group";
  }

  return "Agent";
}

function countActorIfis(value: Record<string, unknown>): number {
  let count = 0;

  if ("mbox" in value) {
    count += 1;
  }

  if ("mbox_sha1sum" in value) {
    count += 1;
  }

  if ("openid" in value) {
    count += 1;
  }

  if ("account" in value) {
    count += 1;
  }

  return count;
}

function isValidActorMbox(value: unknown): boolean {
  return typeof value === "string" && /^mailto:[^@\s]+@[^@\s]+$/.test(value);
}

function isValidActorMboxSha1sum(value: unknown): boolean {
  return typeof value === "string" && /^[0-9a-f]{40}$/i.test(value);
}

function isValidActorOpenId(value: unknown): boolean {
  if (typeof value !== "string" || !hasScheme(value)) {
    return false;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function isValidActorAccount(value: unknown): boolean {
  if (!isObjectRecord(value)) {
    return false;
  }

  return typeof value.homePage === "string" && hasScheme(value.homePage) && typeof value.name === "string";
}

function hasInvalidObject(value: unknown, path: readonly string[] = []): boolean {
  if (Array.isArray(value)) {
    return value.some((item, index) => hasInvalidObject(item, [...path, String(index)]));
  }

  if (!isObjectRecord(value)) {
    return false;
  }

  if (path.at(-1) === "object" && hasInvalidObjectRecord(value, path)) {
    return true;
  }

  return Object.entries(value).some(([key, childValue]) => hasInvalidObject(childValue, [...path, key]));
}

function hasInvalidObjectRecord(value: Record<string, unknown>, path: readonly string[]): boolean {
  const objectType = value.objectType;
  if (objectType !== undefined && (typeof objectType !== "string" || !allowedObjectObjectTypes.has(objectType))) {
    return true;
  }

  if (isSubStatementRecord(value)) {
    return hasInvalidSubStatementRecord(value, path);
  }

  if (objectType === "StatementRef") {
    return hasInvalidStatementRefRecord(value);
  }

  if (isActorCandidateRecord(value)) {
    return objectType === undefined;
  }

  return hasInvalidActivityRecord(value);
}

function isSubStatementRecord(value: Record<string, unknown>): boolean {
  return value.objectType === "SubStatement" || ("actor" in value && "verb" in value && "object" in value);
}

function hasInvalidSubStatementRecord(value: Record<string, unknown>, path: readonly string[]): boolean {
  if (value.objectType !== "SubStatement") {
    return true;
  }

  if (!("actor" in value) || !("verb" in value) || !("object" in value)) {
    return true;
  }

  if ("id" in value || "stored" in value || "version" in value || "authority" in value) {
    return true;
  }

  if (path.slice(0, -1).includes("object")) {
    return true;
  }

  const nestedObject = value.object;
  if (!isObjectRecord(nestedObject)) {
    return true;
  }

  return isSubStatementRecord(nestedObject);
}

function hasInvalidStatementRefRecord(value: Record<string, unknown>): boolean {
  return typeof value.id !== "string" || !isUuidLike(value.id);
}

function hasInvalidActivityRecord(value: Record<string, unknown>): boolean {
  if (typeof value.id !== "string" || !hasScheme(value.id)) {
    return true;
  }

  const definition = value.definition;
  if (definition === undefined) {
    return false;
  }

  if (!isObjectRecord(definition)) {
    return true;
  }

  if (definition.type !== undefined && typeof definition.type !== "string") {
    return true;
  }

  if (definition.moreInfo !== undefined && typeof definition.moreInfo !== "string") {
    return true;
  }

  if (definition.interactionType !== undefined && typeof definition.interactionType !== "string") {
    return true;
  }

  if (definition.extensions !== undefined && !isObjectRecord(definition.extensions)) {
    return true;
  }

  return usesInteractionComponents(definition) && typeof definition.interactionType !== "string";
}

function hasInvalidContext(statement: Record<string, unknown>): boolean {
  if (hasInvalidContextContainer(statement)) {
    return true;
  }

  const object = statement.object;
  return isObjectRecord(object) && isSubStatementRecord(object) && hasInvalidContextContainer(object);
}

function hasInvalidContextContainer(container: Record<string, unknown>): boolean {
  const context = container.context;
  if (typeof context === "undefined") {
    return false;
  }

  if (!isObjectRecord(context)) {
    return true;
  }

  return hasInvalidContextRecord(context, container.object);
}

function hasInvalidContextRecord(context: Record<string, unknown>, object: unknown): boolean {
  if (
    context.registration !== undefined &&
    (typeof context.registration !== "string" || !isUuidLike(context.registration))
  ) {
    return true;
  }

  if (
    context.instructor !== undefined &&
    (!isObjectRecord(context.instructor) || hasInvalidActorRecord(context.instructor, "Either"))
  ) {
    return true;
  }

  if (context.team !== undefined && (!isObjectRecord(context.team) || hasInvalidActorRecord(context.team, "Group"))) {
    return true;
  }

  if (context.contextActivities !== undefined && hasInvalidContextActivities(context.contextActivities)) {
    return true;
  }

  if (context.revision !== undefined && typeof context.revision !== "string") {
    return true;
  }

  if (context.platform !== undefined && typeof context.platform !== "string") {
    return true;
  }

  if (context.language !== undefined && typeof context.language !== "string") {
    return true;
  }

  if (
    context.statement !== undefined &&
    (!isObjectRecord(context.statement) ||
      context.statement.objectType !== "StatementRef" ||
      hasInvalidStatementRefRecord(context.statement))
  ) {
    return true;
  }

  if ((context.revision !== undefined || context.platform !== undefined) && !isActivityObjectOrOmittedType(object)) {
    return true;
  }

  if (context.contextAgents !== undefined && hasInvalidContextAgents(context.contextAgents)) {
    return true;
  }

  if (context.contextGroups !== undefined && hasInvalidContextGroups(context.contextGroups)) {
    return true;
  }

  return false;
}

function hasInvalidContextActivities(value: unknown): boolean {
  if (!isObjectRecord(value)) {
    return true;
  }

  return Object.entries(value).some(([key, activityValue]) => {
    return (
      !allowedContextActivityKeys.has(key as (typeof contextActivityTypes)[number]) ||
      hasInvalidContextActivityValue(activityValue)
    );
  });
}

function hasInvalidContextActivityValue(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some((item) => hasInvalidContextActivityValue(item));
  }

  if (!isObjectRecord(value)) {
    return true;
  }

  if (value.objectType !== undefined && value.objectType !== "Activity") {
    return true;
  }

  return hasInvalidActivityRecord(value);
}

function hasInvalidContextAgents(value: unknown): boolean {
  return !Array.isArray(value) || value.some((item) => hasInvalidContextAgentRecord(item));
}

function hasInvalidContextAgentRecord(value: unknown): boolean {
  if (!isObjectRecord(value) || value.objectType !== "contextAgent") {
    return true;
  }

  return (
    !isObjectRecord(value.agent) ||
    hasInvalidActorRecord(value.agent, "Agent") ||
    hasInvalidRelevantTypes(value.relevantTypes)
  );
}

function hasInvalidContextGroups(value: unknown): boolean {
  return !Array.isArray(value) || value.some((item) => hasInvalidContextGroupRecord(item));
}

function hasInvalidContextGroupRecord(value: unknown): boolean {
  if (!isObjectRecord(value) || value.objectType !== "contextGroup") {
    return true;
  }

  return (
    !isObjectRecord(value.group) ||
    hasInvalidActorRecord(value.group, "Group") ||
    hasInvalidRelevantTypes(value.relevantTypes)
  );
}

function hasInvalidRelevantTypes(value: unknown): boolean {
  if (typeof value === "undefined") {
    return false;
  }

  return (
    !Array.isArray(value) || value.length === 0 || value.some((item) => typeof item !== "string" || !hasScheme(item))
  );
}

function isActivityObjectOrOmittedType(value: unknown): boolean {
  if (!isObjectRecord(value)) {
    return false;
  }

  if (isSubStatementRecord(value) || isActorCandidateRecord(value)) {
    return false;
  }

  return value.objectType === undefined || value.objectType === "Activity";
}

function hasInvalidAuthority(statement: Record<string, unknown>): boolean {
  const authority = statement.authority;
  if (typeof authority === "undefined") {
    return false;
  }

  return !isObjectRecord(authority) || hasInvalidAuthorityRecord(authority);
}

function hasInvalidAuthorityRecord(value: Record<string, unknown>): boolean {
  const role = inferActorRole(value, "Either");
  if (role === "Agent") {
    return hasInvalidActorRecord(value, "Agent");
  }

  if (hasInvalidActorRecord(value, "Group")) {
    return true;
  }

  if (countActorIfis(value) !== 0) {
    return true;
  }

  if (!Array.isArray(value.member) || value.member.length !== 2) {
    return true;
  }

  return value.member.some((member) => !isObjectRecord(member) || hasInvalidActorRecord(member, "Agent"));
}

function hasInvalidAttachments(statement: Record<string, unknown>): boolean {
  const attachments = statement.attachments;
  if (typeof attachments === "undefined") {
    return false;
  }

  return !Array.isArray(attachments) || attachments.some((attachment) => hasInvalidAttachmentRecord(attachment));
}

function hasInvalidAttachmentRecord(value: unknown): boolean {
  if (!isObjectRecord(value)) {
    return true;
  }

  if (typeof value.usageType !== "string" || !hasScheme(value.usageType)) {
    return true;
  }

  if (!isObjectRecord(value.display)) {
    return true;
  }

  if (value.description !== undefined && !isObjectRecord(value.description)) {
    return true;
  }

  if (!isValidContentType(value.contentType)) {
    return true;
  }

  if (typeof value.length !== "number" || !Number.isInteger(value.length) || value.length < 0) {
    return true;
  }

  if (typeof value.sha2 !== "string") {
    return true;
  }

  if (value.fileUrl !== undefined && (typeof value.fileUrl !== "string" || !hasScheme(value.fileUrl))) {
    return true;
  }

  return false;
}

function hasInvalidStatementLifecycle(statement: Record<string, unknown>): boolean {
  if (!isVoidingStatement(statement)) {
    return false;
  }

  const object = statement.object;
  return !isObjectRecord(object) || object.objectType !== "StatementRef";
}

function isVoidingStatement(statement: Record<string, unknown>): boolean {
  const verb = statement.verb;
  return isObjectRecord(verb) && typeof verb.id === "string" && verb.id.endsWith(voidedVerbSuffix);
}

function isValidContentType(value: unknown): value is string {
  return typeof value === "string" && /^[^\s/;]+\/[^\s/;]+(?:\s*;.+)?$/.test(value);
}

function usesInteractionComponents(definition: Record<string, unknown>): boolean {
  return (
    "correctResponsesPattern" in definition ||
    "choices" in definition ||
    "scale" in definition ||
    "source" in definition ||
    "target" in definition ||
    "steps" in definition
  );
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isIsoDuration(value: string): boolean {
  return isoDurationPattern.test(value);
}

function hasInvalidResultProperties(value: unknown, path: readonly string[] = []): boolean {
  if (path.at(-1) === "result") {
    if (!isObjectRecord(value)) {
      return true;
    }

    if (value.success !== undefined && typeof value.success !== "boolean") {
      return true;
    }

    if (value.completion !== undefined && typeof value.completion !== "boolean") {
      return true;
    }

    if (value.response !== undefined && typeof value.response !== "string") {
      return true;
    }

    if (value.duration !== undefined && (typeof value.duration !== "string" || !isIsoDuration(value.duration))) {
      return true;
    }

    if (value.extensions !== undefined && !isObjectRecord(value.extensions)) {
      return true;
    }
  }

  if (path.at(-1) === "score") {
    if (!isObjectRecord(value)) {
      return true;
    }

    if (value.scaled !== undefined && (!isFiniteNumber(value.scaled) || value.scaled < -1 || value.scaled > 1)) {
      return true;
    }

    if (value.raw !== undefined && !isFiniteNumber(value.raw)) {
      return true;
    }

    if (value.min !== undefined && !isFiniteNumber(value.min)) {
      return true;
    }

    if (value.max !== undefined && !isFiniteNumber(value.max)) {
      return true;
    }

    if (isFiniteNumber(value.min) && isFiniteNumber(value.max) && value.min >= value.max) {
      return true;
    }

    if (isFiniteNumber(value.raw) && isFiniteNumber(value.min) && value.raw < value.min) {
      return true;
    }

    if (isFiniteNumber(value.raw) && isFiniteNumber(value.max) && value.raw > value.max) {
      return true;
    }
  }

  if (Array.isArray(value)) {
    return value.some((item, index) => hasInvalidResultProperties(item, [...path, String(index)]));
  }

  if (!isObjectRecord(value)) {
    return false;
  }

  return Object.entries(value).some(([key, childValue]) => hasInvalidResultProperties(childValue, [...path, key]));
}

function hasInvalidActorObjectType(value: unknown, path: readonly string[] = []): boolean {
  if (Array.isArray(value)) {
    return value.some((item, index) => hasInvalidActorObjectType(item, [...path, String(index)]));
  }

  if (!isObjectRecord(value)) {
    return false;
  }

  if (isActorLikePath(path)) {
    const objectType = value.objectType;
    if (objectType !== undefined && (typeof objectType !== "string" || !allowedActorObjectTypes.has(objectType))) {
      return true;
    }
  }

  return Object.entries(value).some(([key, childValue]) => hasInvalidActorObjectType(childValue, [...path, key]));
}

function isActorLikePath(path: readonly string[]): boolean {
  const last = path.at(-1);
  return last === "actor" || last === "authority" || last === "instructor" || last === "team";
}

function isIsoTimestamp(value: string): boolean {
  return isoTimestampPattern.test(value) && !value.endsWith("-00:00") && !Number.isNaN(Date.parse(value));
}

function normalizeIncomingTimestamp(value: string): string {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return value;
  }

  return new Date(parsed).toISOString();
}

function hasInvalidTimestamp(value: unknown, path: readonly string[] = []): boolean {
  if (typeof value === "string") {
    return path.at(-1) === "timestamp" && !isIsoTimestamp(value);
  }

  if (Array.isArray(value)) {
    return value.some((item, index) => hasInvalidTimestamp(item, [...path, String(index)]));
  }

  if (!isObjectRecord(value)) {
    return false;
  }

  return Object.entries(value).some(([key, childValue]) => hasInvalidTimestamp(childValue, [...path, key]));
}

function createStoredTimestamp(): string {
  const timestamp = new Date();
  if (timestamp.getMilliseconds() % 10 === 0) {
    timestamp.setMilliseconds(timestamp.getMilliseconds() + 7);
  }

  return `${timestamp.toISOString().slice(0, -1)}000000Z`;
}

function createDefaultAuthority(): Record<string, unknown> {
  return {
    objectType: "Agent",
    mbox: "mailto:default-authority@example.com",
  };
}

function normalizeContextActivitiesInContainer(container: Record<string, unknown>): void {
  const context = container.context;
  if (!isObjectRecord(context) || !isObjectRecord(context.contextActivities)) {
    return;
  }

  for (const type of contextActivityTypes) {
    const value = context.contextActivities[type];
    if (typeof value !== "undefined" && !Array.isArray(value)) {
      context.contextActivities[type] = [structuredClone(value)];
    }
  }
}

function createStoredStatement(statement: Record<string, unknown>, statementId: string): Record<string, unknown> {
  const storedStatement: Record<string, unknown> = structuredClone({
    ...statement,
    id: statementId,
    stored: createStoredTimestamp(),
  });

  if (typeof storedStatement.timestamp === "string" && isIsoTimestamp(storedStatement.timestamp)) {
    storedStatement.timestamp = normalizeIncomingTimestamp(storedStatement.timestamp);
  } else if (typeof storedStatement.timestamp === "undefined") {
    storedStatement.timestamp = storedStatement.stored;
  }

  if (typeof storedStatement.authority === "undefined") {
    storedStatement.authority = createDefaultAuthority();
  }

  normalizeContextActivitiesInContainer(storedStatement);

  if (isObjectRecord(storedStatement.object) && isSubStatementRecord(storedStatement.object)) {
    normalizeContextActivitiesInContainer(storedStatement.object);
  }

  return storedStatement;
}

function recomputeVoidedStatementIds(storedStatements: Map<string, Record<string, unknown>>): Set<string> {
  const voidedStatementIds = new Set<string>();

  for (const statement of storedStatements.values()) {
    if (!isVoidingStatement(statement)) {
      continue;
    }

    const statementObject = statement.object;
    if (
      !isObjectRecord(statementObject) ||
      statementObject.objectType !== "StatementRef" ||
      typeof statementObject.id !== "string"
    ) {
      continue;
    }

    const target = storedStatements.get(statementObject.id);
    if (!target || isVoidingStatement(target) || voidedStatementIds.has(statementObject.id)) {
      continue;
    }

    voidedStatementIds.add(statementObject.id);
  }

  return voidedStatementIds;
}

function hasMissingIriScheme(value: unknown, path: readonly string[] = []): boolean {
  if (typeof value === "string") {
    const last = path.at(-1);
    if (!last) {
      return false;
    }

    if (last === "openid") {
      return !hasScheme(value);
    }

    if (last === "homePage" && path.at(-2) === "account") {
      return !hasScheme(value);
    }

    if (last === "id" && path.at(-2) === "verb") {
      return !hasScheme(value);
    }

    if ((last === "type" || last === "moreInfo") && path.at(-2) === "definition") {
      return !hasScheme(value);
    }

    if ((last === "usageType" || last === "fileUrl") && path.at(-3) === "attachments") {
      return !hasScheme(value);
    }

    return false;
  }

  if (Array.isArray(value)) {
    return value.some((item, index) => hasMissingIriScheme(item, [...path, String(index)]));
  }

  if (!isObjectRecord(value)) {
    return false;
  }

  if (path.at(-1) === "object" && typeof value.id === "string") {
    const objectType = typeof value.objectType === "string" ? value.objectType : "Activity";
    if (objectType !== "StatementRef" && !hasScheme(value.id)) {
      return true;
    }
  }

  if (
    path.at(-1) === "extensions" &&
    (path.at(-2) === "definition" || path.at(-2) === "context" || path.at(-2) === "result")
  ) {
    return Object.keys(value).some((key) => !hasScheme(key));
  }

  return Object.entries(value).some(([key, childValue]) => hasMissingIriScheme(childValue, [...path, key]));
}

function isUuidLike(value: string | null): boolean {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  );
}

function hasScheme(value: string | null): boolean {
  return typeof value === "string" && /^[a-zA-Z][a-zA-Z0-9+.-]*:.+/.test(value);
}

function parseBooleanQuery(value: string | null): boolean | undefined {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
}

function normalizeStoredTimestampForDate(value: string): string {
  return value.replace(/\.(\d{3})\d+Z$/, ".$1Z");
}

function parseStoredDate(value: unknown): number | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const parsed = Date.parse(normalizeStoredTimestampForDate(value));
  return Number.isNaN(parsed) ? undefined : parsed;
}

function createConsistentThroughHeader(): string {
  return new Date().toISOString();
}

function parseMultipartBoundary(contentType: string | null): string | undefined {
  if (!contentType) {
    return undefined;
  }

  const match = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType);
  return match?.[1] ?? match?.[2]?.trim();
}

function parseMultipartHeaders(rawHeaders: string): Record<string, string> {
  const headers: Record<string, string> = {};
  for (const line of rawHeaders.split(/\r?\n/)) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex < 0) {
      continue;
    }

    headers[line.slice(0, separatorIndex).trim().toLowerCase()] = line.slice(separatorIndex + 1).trim();
  }

  return headers;
}

function parseMultipartParts(bodyText: string, boundary: string): ParsedMultipartPart[] {
  const parts: ParsedMultipartPart[] = [];
  const marker = `--${boundary}`;
  for (const rawPart of bodyText.split(marker)) {
    let normalized = rawPart;
    if (normalized.startsWith("\r\n")) {
      normalized = normalized.slice(2);
    } else if (normalized.startsWith("\n")) {
      normalized = normalized.slice(1);
    }

    if (normalized.endsWith("--\r\n")) {
      normalized = normalized.slice(0, -4);
    } else if (normalized.endsWith("--")) {
      normalized = normalized.slice(0, -2);
    }

    normalized = normalized.replace(/\r?\n$/, "");
    if (normalized.trim().length === 0) {
      continue;
    }

    const separatorIndex = normalized.indexOf("\r\n\r\n");
    const separatorLength = separatorIndex >= 0 ? 4 : 0;
    const fallbackSeparatorIndex = separatorIndex >= 0 ? separatorIndex : normalized.indexOf("\n\n");
    if (fallbackSeparatorIndex < 0) {
      continue;
    }

    const bodyStart = fallbackSeparatorIndex + (separatorIndex >= 0 ? separatorLength : 2);
    parts.push({
      bodyText: normalized.slice(bodyStart),
      headers: parseMultipartHeaders(normalized.slice(0, fallbackSeparatorIndex)),
    });
  }

  return parts;
}

function parseMultipartStatementRequest(
  bodyText: string,
  contentType: string | null,
): ParsedMultipartStatementRequest | undefined {
  const boundary = parseMultipartBoundary(contentType);
  if (!boundary) {
    return undefined;
  }

  if (!bodyText.trimStart().startsWith(`--${boundary}`)) {
    return undefined;
  }

  const parts = parseMultipartParts(bodyText, boundary);
  const firstPart = parts[0];
  if (!firstPart || firstPart.headers["content-type"] !== "application/json") {
    return undefined;
  }

  let body: unknown;
  try {
    body = JSON.parse(firstPart.bodyText) as unknown;
  } catch {
    return undefined;
  }

  const attachments = new Map<string, StoredAttachmentBody>();
  for (const part of parts.slice(1)) {
    const hash = part.headers["x-experience-api-hash"];
    if (typeof hash !== "string") {
      continue;
    }

    attachments.set(hash, {
      bodyText: part.bodyText,
      contentType: part.headers["content-type"] ?? "application/octet-stream",
    });
  }

  return { attachments, body, parts };
}

function isFormUrlEncodedContentType(contentType: string | null): boolean {
  return normalizeRequestMediaType(contentType) === "application/x-www-form-urlencoded";
}

function parseAlternateStatementRequest(
  request: Request,
  url: URL,
  requestText: string,
  contentType: string | null,
): ParsedAlternateStatementRequest | { errorStatus: number } | undefined {
  if (url.pathname !== "/xapi/statements") {
    return undefined;
  }

  const overrideMethod = url.searchParams.get("method");
  if (!overrideMethod) {
    return undefined;
  }

  if (request.method !== "POST") {
    return { errorStatus: 400 };
  }

  if (!isFormUrlEncodedContentType(contentType)) {
    return { errorStatus: 400 };
  }

  const normalizedMethod = overrideMethod.toUpperCase();
  if (
    normalizedMethod !== "DELETE" &&
    normalizedMethod !== "GET" &&
    normalizedMethod !== "HEAD" &&
    normalizedMethod !== "POST" &&
    normalizedMethod !== "PUT"
  ) {
    return { errorStatus: 400 };
  }

  const formEntries = new URLSearchParams(requestText);
  const effectiveHeaders = new Headers(request.headers);
  const effectiveSearchParams = new URLSearchParams(url.search);
  effectiveSearchParams.delete("method");

  let contentBodyText: string | undefined;
  for (const [key, value] of formEntries.entries()) {
    if (alternateHeaderParameters.has(key)) {
      effectiveHeaders.set(key, value);
      continue;
    }

    if (key === "content") {
      contentBodyText = value;
      continue;
    }

    if (effectiveSearchParams.has(key)) {
      return { errorStatus: 400 };
    }

    effectiveSearchParams.set(key, value);
  }

  let effectiveBody: unknown;
  if (normalizedMethod === "POST" || normalizedMethod === "PUT") {
    if (typeof contentBodyText !== "string" || contentBodyText.length === 0) {
      return { errorStatus: 400 };
    }

    try {
      effectiveBody = JSON.parse(contentBodyText) as unknown;
    } catch {
      return { errorStatus: 400 };
    }

    const headerContentType = effectiveHeaders.get("Content-Type");
    if (!headerContentType || isFormUrlEncodedContentType(headerContentType)) {
      effectiveHeaders.set("Content-Type", "application/json");
    }
  } else if (typeof contentBodyText === "string") {
    return { errorStatus: 400 };
  }

  return {
    body: effectiveBody,
    contentType: effectiveHeaders.get("Content-Type"),
    headers: effectiveHeaders,
    method: normalizedMethod,
    searchParams: effectiveSearchParams,
  };
}

function normalizeRequestMediaType(contentType: string | null): string | undefined {
  const mediaType = contentType?.split(";", 1)[0]?.trim().toLowerCase();
  return mediaType && mediaType.length > 0 ? mediaType : undefined;
}

function getStatementAttachmentRecords(body: unknown): Record<string, unknown>[] {
  if (!isObjectRecord(body) || !Array.isArray(body.attachments)) {
    return [];
  }

  return body.attachments.filter((attachment): attachment is Record<string, unknown> => isObjectRecord(attachment));
}

function validateMultipartAttachmentPayload(
  body: unknown,
  parsedMultipart: ParsedMultipartStatementRequest | undefined,
): number | undefined {
  const attachmentRecords = getStatementAttachmentRecords(body);
  if (attachmentRecords.length === 0) {
    return undefined;
  }

  const allowedHashes = attachmentRecords.flatMap((attachment) => {
    return typeof attachment.sha2 === "string" ? [attachment.sha2] : [];
  });

  const requiredHashes = attachmentRecords.flatMap((attachment) => {
    if (typeof attachment.fileUrl === "string") {
      return [];
    }

    return typeof attachment.sha2 === "string" ? [attachment.sha2] : [];
  });

  if (!parsedMultipart) {
    return requiredHashes.length > 0 ? 400 : undefined;
  }

  const seenHashes = new Set<string>();
  for (const part of parsedMultipart.parts.slice(1)) {
    const hash = part.headers["x-experience-api-hash"];
    if (typeof hash !== "string") {
      return 400;
    }

    if (part.headers["content-transfer-encoding"] !== "binary") {
      return 400;
    }

    if (!allowedHashes.includes(hash) || seenHashes.has(hash)) {
      return 400;
    }

    seenHashes.add(hash);
  }

  return requiredHashes.every((hash) => seenHashes.has(hash)) ? undefined : 400;
}

function decodeBase64Url(value: string): string | undefined {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const remainder = normalized.length % 4;
  const padding = remainder === 0 ? "" : "=".repeat(4 - remainder);

  try {
    return Buffer.from(`${normalized}${padding}`, "base64").toString("utf8");
  } catch {
    return undefined;
  }
}

function parseJwsSignature(value: string): { algorithm: string } | undefined {
  const parts = value.split(".");
  if (parts.length !== 3 || parts.some((part) => part.length === 0)) {
    return undefined;
  }

  const headerText = decodeBase64Url(parts[0] ?? "");
  const payloadText = decodeBase64Url(parts[1] ?? "");
  if (!headerText || !payloadText) {
    return undefined;
  }

  try {
    const header = JSON.parse(headerText) as unknown;
    if (!isObjectRecord(header) || typeof header.alg !== "string") {
      return undefined;
    }

    JSON.parse(payloadText);
    return { algorithm: header.alg };
  } catch {
    return undefined;
  }
}

function validateSignedStatementPayload(
  body: unknown,
  parsedMultipart: ParsedMultipartStatementRequest | undefined,
): number | undefined {
  const signatureAttachments = getStatementAttachmentRecords(body).filter((attachment) => {
    return attachment.usageType === signatureUsageType;
  });
  if (signatureAttachments.length === 0) {
    return undefined;
  }

  if (!parsedMultipart) {
    return 400;
  }

  for (const attachment of signatureAttachments) {
    if (attachment.contentType !== "application/octet-stream" || typeof attachment.sha2 !== "string") {
      return 400;
    }

    const signatureBody = parsedMultipart.attachments.get(attachment.sha2);
    if (!signatureBody || normalizeRequestMediaType(signatureBody.contentType) !== "application/octet-stream") {
      return 400;
    }

    const parsedSignature = parseJwsSignature(signatureBody.bodyText.trim());
    if (!parsedSignature || !allowedSignatureAlgorithms.has(parsedSignature.algorithm)) {
      return 400;
    }
  }

  return undefined;
}

function validateStatementWriteContentType(
  body: unknown,
  contentType: string | null,
  parsedMultipart: ParsedMultipartStatementRequest | undefined,
): number | undefined {
  const mediaType = normalizeRequestMediaType(contentType);
  const attachmentRecords = getStatementAttachmentRecords(body);

  if (attachmentRecords.length === 0) {
    if (mediaType === "multipart/mixed" && !parsedMultipart) {
      return 400;
    }

    return undefined;
  }

  if (mediaType !== "application/json" && mediaType !== "multipart/mixed") {
    return 400;
  }

  if (mediaType === "application/json") {
    const requiresBinaryParts = attachmentRecords.some((attachment) => typeof attachment.fileUrl !== "string");
    if (requiresBinaryParts) {
      return 400;
    }

    return validateSignedStatementPayload(body, parsedMultipart);
  }

  const multipartStatus = validateMultipartAttachmentPayload(body, parsedMultipart);
  if (multipartStatus) {
    return multipartStatus;
  }

  return validateSignedStatementPayload(body, parsedMultipart);
}

function createLastModifiedHeader(statement: Record<string, unknown>): string | undefined {
  const stored = statement.stored;
  if (typeof stored !== "string") {
    return undefined;
  }

  return new Date(normalizeStoredTimestampForDate(stored)).toUTCString();
}

function createStatementGetHeaders(version: string, statement?: Record<string, unknown>): Record<string, string> {
  const headers: Record<string, string> = {
    "X-Experience-API-Consistent-Through": createConsistentThroughHeader(),
    "X-Experience-API-Version": version,
  };

  if (statement) {
    const lastModified = createLastModifiedHeader(statement);
    if (lastModified) {
      headers["Last-Modified"] = lastModified;
    }
  }

  return headers;
}

function createStatementJsonResponse(
  version: string,
  body: unknown,
  status: number,
  statement?: Record<string, unknown>,
): Response {
  return Response.json(body, {
    status,
    headers: createStatementGetHeaders(version, statement),
  });
}

function collectAttachmentParts(
  statements: readonly Record<string, unknown>[],
  storedAttachmentBodies: Map<string, StoredAttachmentBody>,
): Array<StoredAttachmentBody & { hash: string }> {
  const parts: Array<StoredAttachmentBody & { hash: string }> = [];
  const seenHashes = new Set<string>();

  for (const statement of statements) {
    const attachments = statement.attachments;
    if (!Array.isArray(attachments)) {
      continue;
    }

    for (const attachment of attachments) {
      if (!isObjectRecord(attachment) || typeof attachment.sha2 !== "string" || seenHashes.has(attachment.sha2)) {
        continue;
      }

      const storedAttachment = storedAttachmentBodies.get(attachment.sha2);
      if (!storedAttachment) {
        continue;
      }

      seenHashes.add(attachment.sha2);
      parts.push({
        hash: attachment.sha2,
        bodyText: storedAttachment.bodyText,
        contentType: typeof attachment.contentType === "string" ? attachment.contentType : storedAttachment.contentType,
      });
    }
  }

  return parts;
}

function buildMultipartStatementResponseBody(
  body: unknown,
  attachmentParts: Array<StoredAttachmentBody & { hash: string }>,
): string {
  const lines: string[] = [];
  lines.push(`--${statementAttachmentResponseBoundary}`);
  lines.push("Content-Type: application/json");
  lines.push("");
  lines.push(JSON.stringify(body));

  for (const attachmentPart of attachmentParts) {
    lines.push(`--${statementAttachmentResponseBoundary}`);
    lines.push(`Content-Type: ${attachmentPart.contentType}`);
    lines.push("Content-Transfer-Encoding: binary");
    lines.push(`X-Experience-API-Hash: ${attachmentPart.hash}`);
    lines.push("");
    lines.push(attachmentPart.bodyText);
  }

  lines.push(`--${statementAttachmentResponseBoundary}--`);
  lines.push("");

  return lines.join("\r\n");
}

function createMultipartStatementResponse(
  version: string,
  body: unknown,
  status: number,
  attachmentParts: Array<StoredAttachmentBody & { hash: string }>,
  statement?: Record<string, unknown>,
): Response {
  const headers = new Headers(createStatementGetHeaders(version, statement));
  headers.set("Content-Type", `multipart/mixed; boundary=${statementAttachmentResponseBoundary}`);

  return new Response(buildMultipartStatementResponseBody(body, attachmentParts), {
    status,
    headers,
  });
}

function selectLanguageKey(keys: string[], acceptLanguage: string | null): string | undefined {
  const normalizedKeys = new Set(keys);
  const preferredLanguages = (acceptLanguage ?? "")
    .split(",")
    .map((entry) => entry.split(";")[0]?.trim())
    .filter((entry): entry is string => Boolean(entry));

  for (const preferredLanguage of preferredLanguages) {
    if (normalizedKeys.has(preferredLanguage)) {
      return preferredLanguage;
    }

    const baseLanguage = preferredLanguage.split("-")[0];
    if (!baseLanguage) {
      continue;
    }

    const fallback = keys.find((key) => key.toLowerCase().startsWith(`${baseLanguage.toLowerCase()}-`));
    if (fallback) {
      return fallback;
    }
  }

  return keys[0];
}

function applyCanonicalFormat(value: unknown, acceptLanguage: string | null, path: readonly string[] = []): unknown {
  if (Array.isArray(value)) {
    return value.map((item, index) => applyCanonicalFormat(item, acceptLanguage, [...path, String(index)]));
  }

  if (!isObjectRecord(value)) {
    return value;
  }

  if (isLanguageMapPath(path)) {
    const selectedKey = selectLanguageKey(Object.keys(value), acceptLanguage);
    if (!selectedKey) {
      return {};
    }

    return { [selectedKey]: value[selectedKey] };
  }

  const formatted: Record<string, unknown> = {};
  for (const [key, childValue] of Object.entries(value)) {
    formatted[key] = applyCanonicalFormat(childValue, acceptLanguage, [...path, key]);
  }

  return formatted;
}

function isActivityLikeRecord(value: Record<string, unknown>): boolean {
  if (isActorCandidateRecord(value) || isSubStatementRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    (value.objectType === undefined || value.objectType === "Activity" || "definition" in value)
  );
}

function createIdsActor(value: Record<string, unknown>): Record<string, unknown> {
  if (value.objectType === "Group") {
    const group: Record<string, unknown> = { objectType: "Group" };

    if (typeof value.mbox === "string") {
      group.mbox = value.mbox;
      return group;
    }

    if (typeof value.mbox_sha1sum === "string") {
      group.mbox_sha1sum = value.mbox_sha1sum;
      return group;
    }

    if (typeof value.openid === "string") {
      group.openid = value.openid;
      return group;
    }

    if (isObjectRecord(value.account)) {
      group.account = structuredClone(value.account);
      return group;
    }

    if (Array.isArray(value.member)) {
      group.member = value.member.map((member) => {
        return isObjectRecord(member) ? createIdsActor(member) : member;
      });
    }

    return group;
  }

  const actor: Record<string, unknown> = {};
  if (value.objectType === "Agent") {
    actor.objectType = "Agent";
  }

  if (typeof value.mbox === "string") {
    actor.mbox = value.mbox;
  } else if (typeof value.mbox_sha1sum === "string") {
    actor.mbox_sha1sum = value.mbox_sha1sum;
  } else if (typeof value.openid === "string") {
    actor.openid = value.openid;
  } else if (isObjectRecord(value.account)) {
    actor.account = structuredClone(value.account);
  }

  return actor;
}

function applyIdsFormat(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => applyIdsFormat(item));
  }

  if (!isObjectRecord(value)) {
    return value;
  }

  if (isActorCandidateRecord(value)) {
    return createIdsActor(value);
  }

  if (isSubStatementRecord(value)) {
    const formatted: Record<string, unknown> = {
      objectType: "SubStatement",
    };

    for (const [key, childValue] of Object.entries(value)) {
      if (key === "objectType") {
        continue;
      }

      formatted[key] = applyIdsFormat(childValue);
    }

    return formatted;
  }

  if (value.objectType === "StatementRef") {
    return {
      objectType: "StatementRef",
      id: value.id,
    };
  }

  if (isActivityLikeRecord(value)) {
    return {
      id: value.id,
    };
  }

  if (typeof value.id === "string" && isObjectRecord(value.display)) {
    return {
      id: value.id,
    };
  }

  const formatted: Record<string, unknown> = {};
  for (const [key, childValue] of Object.entries(value)) {
    formatted[key] = applyIdsFormat(childValue);
  }

  return formatted;
}

function getStatementResponseFormat(searchParams: URLSearchParams): StatementResponseFormat {
  const format = searchParams.get("format");
  if (format === "canonical" || format === "ids") {
    return format;
  }

  return "exact";
}

function formatStatementForResponse(
  statement: Record<string, unknown>,
  format: StatementResponseFormat,
  acceptLanguage: string | null,
): Record<string, unknown> {
  const cloned = structuredClone(statement);
  if (format === "canonical") {
    return applyCanonicalFormat(cloned, acceptLanguage) as Record<string, unknown>;
  }

  if (format === "ids") {
    return applyIdsFormat(cloned) as Record<string, unknown>;
  }

  return cloned;
}

function isMatchingAgent(candidate: Record<string, unknown>, queryAgent: Record<string, unknown>): boolean {
  if (typeof queryAgent.mbox === "string") {
    return candidate.mbox === queryAgent.mbox;
  }

  if (typeof queryAgent.mbox_sha1sum === "string") {
    return candidate.mbox_sha1sum === queryAgent.mbox_sha1sum;
  }

  if (typeof queryAgent.openid === "string") {
    return candidate.openid === queryAgent.openid;
  }

  if (isObjectRecord(queryAgent.account) && isObjectRecord(candidate.account)) {
    return (
      candidate.account.homePage === queryAgent.account.homePage && candidate.account.name === queryAgent.account.name
    );
  }

  return false;
}

function isValidAgentAccount(value: unknown): value is Record<string, unknown> {
  return isObjectRecord(value) && typeof value.homePage === "string" && typeof value.name === "string";
}

function parseAgentQueryObject(value: string | null): Record<string, unknown> | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    if (!isObjectRecord(parsed) || parsed.objectType !== "Agent") {
      return undefined;
    }

    if ("name" in parsed && typeof parsed.name !== "string") {
      return undefined;
    }

    if ("mbox" in parsed && typeof parsed.mbox !== "string") {
      return undefined;
    }

    if ("mbox_sha1sum" in parsed && typeof parsed.mbox_sha1sum !== "string") {
      return undefined;
    }

    if ("openid" in parsed && typeof parsed.openid !== "string") {
      return undefined;
    }

    if ("account" in parsed && !isValidAgentAccount(parsed.account)) {
      return undefined;
    }

    const identifiers = [
      typeof parsed.mbox === "string",
      typeof parsed.mbox_sha1sum === "string",
      typeof parsed.openid === "string",
      isValidAgentAccount(parsed.account),
    ].filter(Boolean);

    if (identifiers.length !== 1) {
      return undefined;
    }

    return parsed;
  } catch {
    return undefined;
  }
}

function addContextActors(context: unknown, actors: Record<string, unknown>[]): void {
  if (!isObjectRecord(context)) {
    return;
  }

  if (isObjectRecord(context.instructor)) {
    actors.push(context.instructor);
  }

  if (isObjectRecord(context.team)) {
    actors.push(context.team);
  }
}

function collectAgentCandidates(
  statement: Record<string, unknown>,
  includeRelated: boolean,
): Record<string, unknown>[] {
  const actors: Record<string, unknown>[] = [];

  if (isObjectRecord(statement.actor)) {
    actors.push(statement.actor);
  }

  if (isObjectRecord(statement.object) && isActorCandidateRecord(statement.object)) {
    actors.push(statement.object);
  }

  if (isObjectRecord(statement.authority)) {
    actors.push(statement.authority);
  }

  if (includeRelated) {
    addContextActors(statement.context, actors);

    if (isObjectRecord(statement.object) && isSubStatementRecord(statement.object)) {
      if (isObjectRecord(statement.object.actor)) {
        actors.push(statement.object.actor);
      }

      if (isObjectRecord(statement.object.object) && isActorCandidateRecord(statement.object.object)) {
        actors.push(statement.object.object);
      }

      addContextActors(statement.object.context, actors);
    }
  }

  return actors;
}

function collectContextActivities(context: unknown, activities: Record<string, unknown>[]): void {
  if (!isObjectRecord(context) || !isObjectRecord(context.contextActivities)) {
    return;
  }

  for (const activityValue of Object.values(context.contextActivities)) {
    if (Array.isArray(activityValue)) {
      for (const item of activityValue) {
        if (isObjectRecord(item)) {
          activities.push(item);
        }
      }
      continue;
    }

    if (isObjectRecord(activityValue)) {
      activities.push(activityValue);
    }
  }
}

function collectActivityCandidates(
  statement: Record<string, unknown>,
  includeRelated: boolean,
): Record<string, unknown>[] {
  const activities: Record<string, unknown>[] = [];

  if (isObjectRecord(statement.object) && isActivityLikeRecord(statement.object)) {
    activities.push(statement.object);
  }

  if (includeRelated) {
    collectContextActivities(statement.context, activities);

    if (isObjectRecord(statement.object) && isSubStatementRecord(statement.object)) {
      if (isObjectRecord(statement.object.object) && isActivityLikeRecord(statement.object.object)) {
        activities.push(statement.object.object);
      }

      collectContextActivities(statement.object.context, activities);
    }
  }

  return activities;
}

function getCollectionResults(
  storedStatements: Map<string, Record<string, unknown>>,
  voidedStatementIds: Set<string>,
  searchParams: URLSearchParams,
  acceptLanguage: string | null,
): { more: string; statements: Record<string, unknown>[] } {
  let results = Array.from(storedStatements.values()).filter((statement) => {
    return typeof statement.id === "string" && !voidedStatementIds.has(statement.id);
  });

  const statementFormat = getStatementResponseFormat(searchParams);

  const agentParam = searchParams.get("agent");
  if (agentParam) {
    const queryAgent = JSON.parse(agentParam) as Record<string, unknown>;
    const includeRelatedAgents = parseBooleanQuery(searchParams.get("related_agents")) === true;
    results = includeRelatedAgents
      ? results.filter((statement) => {
          return collectAgentCandidates(statement, true).some((candidate) => {
            return isMatchingAgent(candidate, queryAgent);
          });
        })
      : results.filter((statement) => {
          return isObjectRecord(statement.actor) && isMatchingAgent(statement.actor, queryAgent);
        });
  }

  const verb = searchParams.get("verb");
  if (verb) {
    results = results.filter((statement) => isObjectRecord(statement.verb) && statement.verb.id === verb);
  }

  const activity = searchParams.get("activity");
  if (activity) {
    const includeRelatedActivities = parseBooleanQuery(searchParams.get("related_activities")) === true;
    results = results.filter((statement) => {
      return collectActivityCandidates(statement, includeRelatedActivities).some(
        (candidate) => candidate.id === activity,
      );
    });
  }

  const registration = searchParams.get("registration");
  if (registration) {
    results = results.filter((statement) => {
      return isObjectRecord(statement.context) && statement.context.registration === registration;
    });
  }

  const since = searchParams.get("since");
  if (since) {
    const sinceDate = Date.parse(since);
    results = results.filter((statement) => {
      const storedDate = parseStoredDate(statement.stored);
      return typeof storedDate === "number" && storedDate > sinceDate;
    });
  }

  const until = searchParams.get("until");
  if (until) {
    const untilDate = Date.parse(until);
    results = results.filter((statement) => {
      const storedDate = parseStoredDate(statement.stored);
      return typeof storedDate === "number" && storedDate <= untilDate;
    });
  }

  results.sort((left, right) => (parseStoredDate(left.stored) ?? 0) - (parseStoredDate(right.stored) ?? 0));
  if (parseBooleanQuery(searchParams.get("ascending")) !== true) {
    results.reverse();
  }

  const limit = Number.parseInt(searchParams.get("limit") ?? "", 10);
  const offset = Number.parseInt(searchParams.get("offset") ?? "0", 10);
  const normalizedOffset = Number.isFinite(offset) && offset > 0 ? offset : 0;

  let statements = results;
  let more = "";
  if (Number.isFinite(limit) && limit > 0) {
    statements = results.slice(normalizedOffset, normalizedOffset + limit);
    const nextOffset = normalizedOffset + limit;
    if (nextOffset < results.length) {
      const nextQuery = new URLSearchParams(searchParams);
      nextQuery.set("limit", String(limit));
      nextQuery.set("offset", String(nextOffset));
      more = `/xapi/statements?${nextQuery.toString()}`;
    }
  }

  return {
    statements: statements.map((statement) => formatStatementForResponse(statement, statementFormat, acceptLanguage)),
    more,
  };
}

function isAgentQueryValid(value: string | null): boolean {
  return typeof parseAgentQueryObject(value) !== "undefined";
}

function validateAgentResourceQuery(searchParams: URLSearchParams): number | undefined {
  for (const key of searchParams.keys()) {
    if (key !== "agent") {
      return 400;
    }
  }

  if (!searchParams.has("agent") || !isAgentQueryValid(searchParams.get("agent"))) {
    return 400;
  }

  return undefined;
}

function validateActivityResourceQuery(searchParams: URLSearchParams): number | undefined {
  for (const key of searchParams.keys()) {
    if (key !== "activityId") {
      return 400;
    }
  }

  if (!searchParams.has("activityId") || !hasScheme(searchParams.get("activityId"))) {
    return 400;
  }

  return undefined;
}

function pushUniqueString(values: string[], value: string): void {
  if (!values.includes(value)) {
    values.push(value);
  }
}

function deepMergeRecords(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const merged = structuredClone(target);

  for (const [key, value] of Object.entries(source)) {
    if (isObjectRecord(value) && isObjectRecord(merged[key])) {
      merged[key] = deepMergeRecords(merged[key] as Record<string, unknown>, value);
      continue;
    }

    merged[key] = structuredClone(value);
  }

  return merged;
}

function buildPersonObject(
  queryAgent: Record<string, unknown>,
  storedStatements: Map<string, Record<string, unknown>>,
): Record<string, unknown> {
  const names: string[] = [];
  const mboxes: string[] = [];
  const mboxSha1sums: string[] = [];
  const openids: string[] = [];
  const accounts: Record<string, unknown>[] = [];
  const seenAccounts = new Set<string>();

  const collect = (candidate: Record<string, unknown>): void => {
    if (typeof candidate.name === "string") {
      pushUniqueString(names, candidate.name);
    }

    if (typeof candidate.mbox === "string") {
      pushUniqueString(mboxes, candidate.mbox);
    }

    if (typeof candidate.mbox_sha1sum === "string") {
      pushUniqueString(mboxSha1sums, candidate.mbox_sha1sum);
    }

    if (typeof candidate.openid === "string") {
      pushUniqueString(openids, candidate.openid);
    }

    if (isValidAgentAccount(candidate.account)) {
      const serialized = JSON.stringify(candidate.account);
      if (!seenAccounts.has(serialized)) {
        seenAccounts.add(serialized);
        accounts.push(structuredClone(candidate.account));
      }
    }
  };

  collect(queryAgent);

  for (const statement of storedStatements.values()) {
    for (const candidate of collectAgentCandidates(statement, true)) {
      if (isMatchingAgent(candidate, queryAgent)) {
        collect(candidate);
      }
    }
  }

  const person: Record<string, unknown> = {
    objectType: "Person",
  };

  if (names.length > 0) {
    person.name = names;
  }

  if (mboxes.length > 0) {
    person.mbox = mboxes;
  }

  if (mboxSha1sums.length > 0) {
    person.mbox_sha1sum = mboxSha1sums;
  }

  if (openids.length > 0) {
    person.openid = openids;
  }

  if (accounts.length > 0) {
    person.account = accounts;
  }

  return person;
}

function buildActivityObject(
  activityId: string,
  storedStatements: Map<string, Record<string, unknown>>,
): Record<string, unknown> {
  let activity: Record<string, unknown> = {
    objectType: "Activity",
    id: activityId,
  };

  for (const statement of storedStatements.values()) {
    if (!isObjectRecord(statement.object) || !isActivityLikeRecord(statement.object)) {
      continue;
    }

    if (statement.object.id !== activityId) {
      continue;
    }

    activity = deepMergeRecords(activity, statement.object);
  }

  activity.objectType = "Activity";
  activity.id = activityId;
  return activity;
}

function handleAboutResource(request: Request, version: string): Response {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Not found", { status: 404, headers: createMockHeaders(version, "text/plain") });
  }

  const response = Response.json({ version: [version] }, { status: 200, headers: createMockHeaders(version) });
  return request.method === "HEAD" ? withoutBody(response) : response;
}

function handleAgentsResource(
  request: Request,
  url: URL,
  version: string,
  storedStatements: Map<string, Record<string, unknown>>,
): Response {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Not found", { status: 404, headers: createMockHeaders(version, "text/plain") });
  }

  const validationStatus = validateAgentResourceQuery(url.searchParams);
  if (validationStatus) {
    return Response.json({ ok: false }, { status: validationStatus, headers: createMockHeaders(version) });
  }

  const queryAgent = parseAgentQueryObject(url.searchParams.get("agent"));
  if (!queryAgent) {
    return Response.json({ ok: false }, { status: 400, headers: createMockHeaders(version) });
  }

  const response = Response.json(buildPersonObject(queryAgent, storedStatements), {
    status: 200,
    headers: createMockHeaders(version),
  });
  return request.method === "HEAD" ? withoutBody(response) : response;
}

function handleActivitiesResource(
  request: Request,
  url: URL,
  version: string,
  storedStatements: Map<string, Record<string, unknown>>,
): Response {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Not found", { status: 404, headers: createMockHeaders(version, "text/plain") });
  }

  const validationStatus = validateActivityResourceQuery(url.searchParams);
  if (validationStatus) {
    return Response.json({ ok: false }, { status: validationStatus, headers: createMockHeaders(version) });
  }

  const activityId = url.searchParams.get("activityId");
  if (typeof activityId !== "string") {
    return Response.json({ ok: false }, { status: 400, headers: createMockHeaders(version) });
  }

  const response = Response.json(buildActivityObject(activityId, storedStatements), {
    status: 200,
    headers: createMockHeaders(version),
  });
  return request.method === "HEAD" ? withoutBody(response) : response;
}

function validateStatementQuery(searchParams: URLSearchParams): number | undefined {
  for (const key of searchParams.keys()) {
    if (!allowedStatementQueryKeys.has(key)) {
      return 400;
    }
  }

  if (searchParams.has("statementId") && searchParams.has("voidedStatementId")) {
    return 400;
  }

  if (searchParams.has("statementId") && !isUuidLike(searchParams.get("statementId"))) {
    return 400;
  }

  if (searchParams.has("voidedStatementId") && !isUuidLike(searchParams.get("voidedStatementId"))) {
    return 400;
  }

  if (searchParams.has("agent") && !isAgentQueryValid(searchParams.get("agent"))) {
    return 400;
  }

  if (searchParams.has("verb") && !hasScheme(searchParams.get("verb"))) {
    return 400;
  }

  if (searchParams.has("activity") && !hasScheme(searchParams.get("activity"))) {
    return 400;
  }

  if (searchParams.has("registration") && !isUuidLike(searchParams.get("registration"))) {
    return 400;
  }

  if (searchParams.has("since") && !isIsoTimestamp(searchParams.get("since") ?? "")) {
    return 400;
  }

  if (searchParams.has("until") && !isIsoTimestamp(searchParams.get("until") ?? "")) {
    return 400;
  }

  if (searchParams.has("ascending") && typeof parseBooleanQuery(searchParams.get("ascending")) === "undefined") {
    return 400;
  }

  if (
    searchParams.has("related_activities") &&
    typeof parseBooleanQuery(searchParams.get("related_activities")) === "undefined"
  ) {
    return 400;
  }

  if (
    searchParams.has("related_agents") &&
    typeof parseBooleanQuery(searchParams.get("related_agents")) === "undefined"
  ) {
    return 400;
  }

  if (searchParams.has("attachments") && typeof parseBooleanQuery(searchParams.get("attachments")) === "undefined") {
    return 400;
  }

  if (searchParams.has("format")) {
    const format = searchParams.get("format");
    if (format !== "canonical" && format !== "exact" && format !== "ids") {
      return 400;
    }
  }

  if (searchParams.has("limit")) {
    const limit = Number.parseInt(searchParams.get("limit") ?? "", 10);
    if (!Number.isFinite(limit) || limit <= 0) {
      return 400;
    }
  }

  if (searchParams.has("offset")) {
    const offset = Number.parseInt(searchParams.get("offset") ?? "", 10);
    if (!Number.isFinite(offset) || offset < 0) {
      return 400;
    }
  }

  if (searchParams.has("statementId")) {
    for (const key of searchParams.keys()) {
      if (!singleStatementAllowedKeys.has(key)) {
        return 400;
      }
    }
  }

  if (searchParams.has("voidedStatementId")) {
    for (const key of searchParams.keys()) {
      if (!singleStatementAllowedKeys.has(key)) {
        return 400;
      }
    }
  }

  return undefined;
}

type DocumentResourceOptions = {
  allowCollectionDelete?: boolean;
  allowRegistration?: boolean;
  allowSince?: boolean;
  contextKeys: readonly string[];
  idKey: string;
  requirePutPreconditionHeader?: boolean;
  requiredKeys: readonly string[];
  validateActivityId?: boolean;
  validateAgent?: boolean;
};

function normalizeMediaType(contentType: string | null): string {
  return contentType?.split(";")[0]?.trim().toLowerCase() || "application/octet-stream";
}

function isJsonMediaType(mediaType: string): boolean {
  return mediaType === "application/json";
}

function isLegacySerializedNonStringQueryValue(value: string | null): boolean {
  if (typeof value !== "string") {
    return false;
  }

  try {
    return typeof JSON.parse(value) !== "string";
  } catch {
    return false;
  }
}

function buildContextKey(searchParams: URLSearchParams, keys: readonly string[]): string {
  return keys.map((key) => `${key}=${searchParams.get(key) ?? ""}`).join("&");
}

function buildDocumentKey(contextKey: string, id: string): string {
  return `${contextKey}::${id}`;
}

function validateDocumentResourceQuery(
  searchParams: URLSearchParams,
  method: string,
  options: DocumentResourceOptions,
): number | undefined {
  const allowedKeys = new Set<string>([...options.requiredKeys, options.idKey]);
  if (options.allowRegistration) {
    allowedKeys.add("registration");
  }
  if (options.allowSince && method === "GET") {
    allowedKeys.add("since");
  }

  for (const key of searchParams.keys()) {
    if (!allowedKeys.has(key)) {
      return 400;
    }
  }

  for (const key of options.requiredKeys) {
    if (!searchParams.has(key)) {
      return 400;
    }
  }

  const idValue = searchParams.get(options.idKey);
  if (searchParams.has(options.idKey) && isLegacySerializedNonStringQueryValue(idValue)) {
    return 400;
  }

  if (method === "PUT" || method === "POST") {
    if (!searchParams.has(options.idKey)) {
      return 400;
    }
  }

  if (method === "DELETE" && !options.allowCollectionDelete && !searchParams.has(options.idKey)) {
    return 400;
  }

  if (options.validateActivityId && !hasScheme(searchParams.get("activityId"))) {
    return 400;
  }

  if (options.validateAgent && !isAgentQueryValid(searchParams.get("agent"))) {
    return 400;
  }

  if (searchParams.has("registration") && !isUuidLike(searchParams.get("registration"))) {
    return 400;
  }

  if (searchParams.has("since")) {
    if (!options.allowSince || method !== "GET") {
      return 400;
    }
    if (!isIsoTimestamp(searchParams.get("since") ?? "")) {
      return 400;
    }
  }

  return undefined;
}

function listDocumentIds(store: Map<string, StoredDocument>, contextKey: string, sinceTimestamp?: number): string[] {
  return Array.from(store.values())
    .filter((document) => {
      if (document.contextKey !== contextKey) {
        return false;
      }
      if (typeof sinceTimestamp === "number") {
        return document.storedAt > sinceTimestamp;
      }
      return true;
    })
    .sort((left, right) => left.storedAt - right.storedAt)
    .map((document) => document.id);
}

function deleteDocumentsByContext(store: Map<string, StoredDocument>, contextKey: string): void {
  for (const [key, document] of store.entries()) {
    if (document.contextKey === contextKey) {
      store.delete(key);
    }
  }
}

function parseDocumentWriteBody(
  requestText: string,
  contentType: string | null,
): { body: unknown; mediaType: string } | undefined {
  const mediaType = normalizeMediaType(contentType);
  if (isJsonMediaType(mediaType)) {
    try {
      const parsed = JSON.parse(requestText) as unknown;
      if (!isObjectRecord(parsed)) {
        return undefined;
      }
      return {
        body: parsed,
        mediaType,
      };
    } catch {
      return undefined;
    }
  }

  return {
    body: requestText,
    mediaType,
  };
}

function createStoredDocument(
  body: unknown,
  id: string,
  contextKey: string,
  mediaType: string,
  existing?: StoredDocument,
): StoredDocument {
  return {
    body: isObjectRecord(body) ? structuredClone(body) : body,
    contextKey,
    id,
    mediaType,
    storedAt: Math.max(Date.now(), (existing?.storedAt ?? 0) + 1000),
  };
}

function createStoredDocumentBody(document: StoredDocument): string {
  return isJsonMediaType(document.mediaType) ? JSON.stringify(document.body) : String(document.body);
}

function createDocumentEtag(document: StoredDocument): string {
  return `"${createHash("sha1").update(createStoredDocumentBody(document)).digest("hex")}"`;
}

function createDocumentPreconditionFailedResponse(version: string): Response {
  return new Response("Precondition Failed", {
    status: 412,
    headers: createMockHeaders(version, "text/plain"),
  });
}

function createDocumentConflictResponse(version: string): Response {
  return new Response("Conflict: existing document requires If-Match or If-None-Match.", {
    status: 409,
    headers: createMockHeaders(version, "text/plain"),
  });
}

function createDocumentMissingPreconditionResponse(version: string): Response {
  return new Response("Bad Request: document PUT requires If-Match or If-None-Match.", {
    status: 400,
    headers: createMockHeaders(version, "text/plain"),
  });
}

function buildStoredDocumentResponse(document: StoredDocument, version: string): Response {
  const headers = new Headers({
    "Content-Type": document.mediaType,
    ETag: createDocumentEtag(document),
    "Last-Modified": new Date(document.storedAt).toUTCString(),
    "X-Experience-API-Version": version,
  });
  const body = createStoredDocumentBody(document);
  return new Response(body, { status: 200, headers });
}

function handleDocumentResource(
  request: Request,
  url: URL,
  requestText: string,
  contentType: string | null,
  version: string,
  store: Map<string, StoredDocument>,
  options: DocumentResourceOptions,
): Response {
  const effectiveMethod = request.method === "HEAD" ? "GET" : request.method;
  const validationStatus = validateDocumentResourceQuery(url.searchParams, effectiveMethod, options);
  if (validationStatus) {
    return Response.json({ ok: false }, { status: validationStatus, headers: createMockHeaders(version) });
  }

  const contextKey = buildContextKey(url.searchParams, options.contextKeys);
  const documentId = url.searchParams.get(options.idKey);
  const key = typeof documentId === "string" ? buildDocumentKey(contextKey, documentId) : undefined;
  const existingDocument = key ? store.get(key) : undefined;

  const ifMatch = request.headers.get("If-Match");
  if (typeof ifMatch === "string") {
    if (!existingDocument || ifMatch !== createDocumentEtag(existingDocument)) {
      return createDocumentPreconditionFailedResponse(version);
    }
  }

  if (effectiveMethod === "GET") {
    if (documentId) {
      if (!existingDocument) {
        return new Response("Not found", { status: 404, headers: createMockHeaders(version, "text/plain") });
      }
      const response = buildStoredDocumentResponse(existingDocument, version);
      return request.method === "HEAD" ? withoutBody(response) : response;
    }

    const sinceTimestamp = url.searchParams.has("since") ? Date.parse(url.searchParams.get("since") ?? "") : undefined;
    const response = Response.json(listDocumentIds(store, contextKey, sinceTimestamp), {
      status: 200,
      headers: createMockHeaders(version),
    });
    return request.method === "HEAD" ? withoutBody(response) : response;
  }

  if (effectiveMethod === "DELETE") {
    if (key) {
      store.delete(key);
      return new Response(null, { status: 204, headers: createMockHeaders(version) });
    }

    deleteDocumentsByContext(store, contextKey);
    return new Response(null, { status: 204, headers: createMockHeaders(version) });
  }

  const parsedBody = parseDocumentWriteBody(requestText, contentType);
  if (!parsedBody || typeof documentId !== "string") {
    return Response.json({ ok: false }, { status: 400, headers: createMockHeaders(version) });
  }

  const documentKey = buildDocumentKey(contextKey, documentId);

  if (effectiveMethod === "PUT") {
    if (
      options.requirePutPreconditionHeader &&
      !existingDocument &&
      !request.headers.has("If-Match") &&
      !request.headers.has("If-None-Match")
    ) {
      return createDocumentMissingPreconditionResponse(version);
    }

    if (request.headers.get("If-None-Match") === "*" && existingDocument) {
      return createDocumentPreconditionFailedResponse(version);
    }

    if (existingDocument && !request.headers.has("If-Match") && !request.headers.has("If-None-Match")) {
      return createDocumentConflictResponse(version);
    }

    store.set(
      documentKey,
      createStoredDocument(parsedBody.body, documentId, contextKey, parsedBody.mediaType, existingDocument),
    );
    return new Response(null, { status: 204, headers: createMockHeaders(version) });
  }

  if (!existingDocument) {
    store.set(documentKey, createStoredDocument(parsedBody.body, documentId, contextKey, parsedBody.mediaType));
    return new Response(null, { status: 204, headers: createMockHeaders(version) });
  }

  if (!isJsonMediaType(existingDocument.mediaType) || !isJsonMediaType(parsedBody.mediaType)) {
    return Response.json({ ok: false }, { status: 400, headers: createMockHeaders(version) });
  }

  if (!isObjectRecord(existingDocument.body) || !isObjectRecord(parsedBody.body)) {
    return Response.json({ ok: false }, { status: 400, headers: createMockHeaders(version) });
  }

  const mergedBody = {
    ...existingDocument.body,
    ...parsedBody.body,
  };
  store.set(
    documentKey,
    createStoredDocument(mergedBody, documentId, contextKey, existingDocument.mediaType, existingDocument),
  );
  return new Response(null, { status: 204, headers: createMockHeaders(version) });
}

function startMockLrs(defaultVersion = "2.0.0") {
  const requests: CapturedRequest[] = [];
  const storedAttachmentBodies = new Map<string, StoredAttachmentBody>();
  const storedStatements = new Map<string, Record<string, unknown>>();
  const stateDocuments = new Map<string, StoredDocument>();
  const agentProfileDocuments = new Map<string, StoredDocument>();
  const activityProfileDocuments = new Map<string, StoredDocument>();
  let voidedStatementIds = new Set<string>();

  const server = Bun.serve({
    port: 0,
    async fetch(request) {
      const url = new URL(request.url);
      const requestText = await request.text();
      const contentType = request.headers.get("Content-Type");
      let body: unknown;
      let parsedMultipartStatement: ParsedMultipartStatementRequest | undefined;
      if (requestText.length > 0) {
        if (contentType?.toLowerCase().startsWith("multipart/mixed")) {
          parsedMultipartStatement = parseMultipartStatementRequest(requestText, contentType);
          body = parsedMultipartStatement?.body;
        } else {
          try {
            body = JSON.parse(requestText) as unknown;
          } catch {
            body = requestText;
          }
        }
      }

      const alternateStatementRequest = parseAlternateStatementRequest(request, url, requestText, contentType);

      requests.push({
        body,
        method: request.method,
        path: url.pathname,
        query: url.search,
        version: request.headers.get("X-Experience-API-Version"),
      });

      const validationRequest =
        alternateStatementRequest && !("errorStatus" in alternateStatementRequest)
          ? new Request(request.url, {
              method: alternateStatementRequest.method,
              headers: alternateStatementRequest.headers,
            })
          : request;

      const versionHeaderError = validateVersionHeader(validationRequest, url.pathname, defaultVersion);
      if (versionHeaderError) {
        return versionHeaderError;
      }

      const authorizationError = validateAuthorizationHeader(validationRequest, defaultVersion);
      if (authorizationError) {
        return authorizationError;
      }

      if (alternateStatementRequest && "errorStatus" in alternateStatementRequest) {
        return Response.json(
          { ok: false },
          { status: alternateStatementRequest.errorStatus, headers: createMockHeaders(defaultVersion) },
        );
      }

      const statementMethod =
        alternateStatementRequest && !("errorStatus" in alternateStatementRequest)
          ? alternateStatementRequest.method
          : request.method;
      const statementSearchParams =
        alternateStatementRequest && !("errorStatus" in alternateStatementRequest)
          ? alternateStatementRequest.searchParams
          : url.searchParams;
      const statementHeaders =
        alternateStatementRequest && !("errorStatus" in alternateStatementRequest)
          ? alternateStatementRequest.headers
          : request.headers;
      const statementBody =
        alternateStatementRequest && !("errorStatus" in alternateStatementRequest)
          ? alternateStatementRequest.body
          : body;
      const statementContentType =
        alternateStatementRequest && !("errorStatus" in alternateStatementRequest)
          ? alternateStatementRequest.contentType
          : contentType;

      if (statementMethod === "POST" && url.pathname === "/xapi/statements") {
        const contentTypeStatus = validateStatementWriteContentType(
          statementBody,
          statementContentType,
          parsedMultipartStatement,
        );
        if (contentTypeStatus) {
          return Response.json(
            { ok: false },
            { status: contentTypeStatus, headers: createMockHeaders(defaultVersion) },
          );
        }

        if (Array.isArray(statementBody)) {
          const seenIds = new Set<string>();
          if (
            statementBody.length === 0 ||
            statementBody.some((statement) => {
              if (!isObjectRecord(statement) || determineStatementStatus(statement) !== 200) {
                return true;
              }

              if (typeof statement.id === "string") {
                if (seenIds.has(statement.id)) {
                  return true;
                }

                seenIds.add(statement.id);
              }

              return false;
            })
          ) {
            return Response.json({ ok: false }, { status: 400, headers: createMockHeaders(defaultVersion) });
          }

          const statementIds: string[] = [];
          for (const statement of statementBody) {
            const statementId = typeof statement.id === "string" ? statement.id : crypto.randomUUID();
            statementIds.push(statementId);
            if (!storedStatements.has(statementId)) {
              storedStatements.set(statementId, createStoredStatement(statement, statementId));
            }
          }

          if (parsedMultipartStatement?.attachments) {
            for (const [hash, attachmentBody] of parsedMultipartStatement.attachments.entries()) {
              storedAttachmentBodies.set(hash, attachmentBody);
            }
          }

          voidedStatementIds = recomputeVoidedStatementIds(storedStatements);
          return Response.json(statementIds, { status: 200, headers: createMockHeaders(defaultVersion) });
        }

        const status = determineStatementStatus(statementBody);
        if (status === 200 && isObjectRecord(statementBody)) {
          const statementId = typeof statementBody.id === "string" ? statementBody.id : crypto.randomUUID();
          if (!storedStatements.has(statementId)) {
            storedStatements.set(statementId, createStoredStatement(statementBody, statementId));
          }
          if (parsedMultipartStatement?.attachments) {
            for (const [hash, attachmentBody] of parsedMultipartStatement.attachments.entries()) {
              storedAttachmentBodies.set(hash, attachmentBody);
            }
          }
          voidedStatementIds = recomputeVoidedStatementIds(storedStatements);

          return Response.json([statementId], { status, headers: createMockHeaders(defaultVersion) });
        }

        return Response.json({ ok: false }, { status, headers: createMockHeaders(defaultVersion) });
      }

      if (statementMethod === "PUT" && url.pathname === "/xapi/statements") {
        const contentTypeStatus = validateStatementWriteContentType(
          statementBody,
          statementContentType,
          parsedMultipartStatement,
        );
        if (contentTypeStatus) {
          return Response.json(
            { ok: false },
            { status: contentTypeStatus, headers: createMockHeaders(defaultVersion) },
          );
        }

        const statementId = statementSearchParams.get("statementId");
        if (typeof statementId !== "string" || !isUuidLike(statementId)) {
          return Response.json({ ok: false }, { status: 400, headers: createMockHeaders(defaultVersion) });
        }

        const status = determineStatementStatus(statementBody);
        if (status === 200 && isObjectRecord(statementBody)) {
          if (!storedStatements.has(statementId)) {
            storedStatements.set(statementId, createStoredStatement(statementBody, statementId));
          }
          voidedStatementIds = recomputeVoidedStatementIds(storedStatements);

          return new Response(null, { status: 204, headers: createMockHeaders(defaultVersion) });
        }

        return Response.json({ ok: false }, { status, headers: createMockHeaders(defaultVersion) });
      }

      if ((statementMethod === "GET" || statementMethod === "HEAD") && url.pathname === "/xapi/statements") {
        const validationStatus = validateStatementQuery(statementSearchParams);
        if (validationStatus) {
          const response = createStatementJsonResponse(defaultVersion, { ok: false }, validationStatus);
          return statementMethod === "HEAD" ? withoutBody(response) : response;
        }

        const statementFormat = getStatementResponseFormat(statementSearchParams);

        const statementId = statementSearchParams.get("statementId");
        if (statementId) {
          if (voidedStatementIds.has(statementId)) {
            const response = createStatementJsonResponse(defaultVersion, { ok: false }, 404);
            return statementMethod === "HEAD" ? withoutBody(response) : response;
          }

          const storedStatement = storedStatements.get(statementId);
          if (storedStatement) {
            const formattedStatement = formatStatementForResponse(
              storedStatement,
              statementFormat,
              statementHeaders.get("Accept-Language"),
            );
            const attachmentParts =
              parseBooleanQuery(statementSearchParams.get("attachments")) === true
                ? collectAttachmentParts([storedStatement], storedAttachmentBodies)
                : [];
            if (attachmentParts.length > 0) {
              const response = createMultipartStatementResponse(
                defaultVersion,
                formattedStatement,
                200,
                attachmentParts,
                storedStatement,
              );
              return statementMethod === "HEAD" ? withoutBody(response) : response;
            }

            const response = createStatementJsonResponse(defaultVersion, formattedStatement, 200, storedStatement);
            return statementMethod === "HEAD" ? withoutBody(response) : response;
          }

          const response = createStatementJsonResponse(defaultVersion, { ok: false }, 404);
          return statementMethod === "HEAD" ? withoutBody(response) : response;
        }

        const voidedStatementId = statementSearchParams.get("voidedStatementId");
        if (voidedStatementId) {
          if (!voidedStatementIds.has(voidedStatementId)) {
            const response = createStatementJsonResponse(defaultVersion, { ok: false }, 404);
            return statementMethod === "HEAD" ? withoutBody(response) : response;
          }

          const storedStatement = storedStatements.get(voidedStatementId);
          if (storedStatement) {
            const formattedStatement = formatStatementForResponse(
              storedStatement,
              statementFormat,
              statementHeaders.get("Accept-Language"),
            );
            const attachmentParts =
              parseBooleanQuery(statementSearchParams.get("attachments")) === true
                ? collectAttachmentParts([storedStatement], storedAttachmentBodies)
                : [];
            if (attachmentParts.length > 0) {
              const response = createMultipartStatementResponse(
                defaultVersion,
                formattedStatement,
                200,
                attachmentParts,
                storedStatement,
              );
              return statementMethod === "HEAD" ? withoutBody(response) : response;
            }

            const response = createStatementJsonResponse(defaultVersion, formattedStatement, 200, storedStatement);
            return statementMethod === "HEAD" ? withoutBody(response) : response;
          }

          const response = createStatementJsonResponse(defaultVersion, { ok: false }, 404);
          return statementMethod === "HEAD" ? withoutBody(response) : response;
        }

        const collectionResult = getCollectionResults(
          storedStatements,
          voidedStatementIds,
          statementSearchParams,
          statementHeaders.get("Accept-Language"),
        );
        const attachmentParts =
          parseBooleanQuery(statementSearchParams.get("attachments")) === true
            ? collectAttachmentParts(collectionResult.statements, storedAttachmentBodies)
            : [];
        if (attachmentParts.length > 0) {
          const response = createMultipartStatementResponse(defaultVersion, collectionResult, 200, attachmentParts);
          return statementMethod === "HEAD" ? withoutBody(response) : response;
        }

        const response = createStatementJsonResponse(defaultVersion, collectionResult, 200);
        return statementMethod === "HEAD" ? withoutBody(response) : response;
      }

      if (url.pathname === "/xapi/activities/state") {
        return handleDocumentResource(request, url, requestText, contentType, defaultVersion, stateDocuments, {
          allowCollectionDelete: true,
          allowRegistration: true,
          allowSince: true,
          contextKeys: ["activityId", "agent", "registration"],
          idKey: "stateId",
          requiredKeys: ["activityId", "agent"],
          validateActivityId: true,
          validateAgent: true,
        });
      }

      if (url.pathname === "/xapi/about") {
        return handleAboutResource(request, defaultVersion);
      }

      if (url.pathname === "/xapi/agents") {
        return handleAgentsResource(request, url, defaultVersion, storedStatements);
      }

      if (url.pathname === "/xapi/activities") {
        return handleActivitiesResource(request, url, defaultVersion, storedStatements);
      }

      if (url.pathname === "/xapi/agents/profile") {
        return handleDocumentResource(request, url, requestText, contentType, defaultVersion, agentProfileDocuments, {
          allowSince: true,
          contextKeys: ["agent"],
          idKey: "profileId",
          requirePutPreconditionHeader: defaultVersion === "1.0.3",
          requiredKeys: ["agent"],
          validateAgent: true,
        });
      }

      if (url.pathname === "/xapi/activities/profile") {
        return handleDocumentResource(
          request,
          url,
          requestText,
          contentType,
          defaultVersion,
          activityProfileDocuments,
          {
            allowSince: true,
            contextKeys: ["activityId"],
            idKey: "profileId",
            requirePutPreconditionHeader: defaultVersion === "1.0.3",
            requiredKeys: ["activityId"],
            validateActivityId: true,
          },
        );
      }

      return new Response("Not found", { status: 404, headers: createMockHeaders(defaultVersion, "text/plain") });
    },
  });

  return {
    endpoint: `http://127.0.0.1:${server.port}/xapi`,
    requests,
    server,
  };
}

function expectLoggedSuiteTitles(logTests: Array<{ title: string }>, expectedTitles: string[]): void {
  expect(logTests.map((suite) => suite.title)).toEqual(expectedTitles);
}

function expectLoggedNestedSuiteTitles(
  logTests: Array<{ title: string; tests: Array<{ title: string }> }>,
  suiteTitle: string,
  expectedTitles: string[],
): void {
  const suite = logTests.find((entry) => entry.title === suiteTitle);
  expect(suite?.tests.map((entry) => entry.title)).toEqual(expectedTitles);
}

function withBasicAuthArgs(argv: string[]): string[] {
  return [...argv, "-a", "-u", validBasicUserName, "-p", validBasicPassword];
}

describe("console runner entrypoint", () => {
  test("runs the v2 formatting slice end to end and writes an upstream-style log", async () => {
    const harness = startMockLrs("2.0.0");
    const logDirectory = join(import.meta.dir, "..", "..", "tmp", "agents", crypto.randomUUID());

    try {
      const execution = await runConsoleRunnerArgv(withBasicAuthArgs(["--endpoint", harness.endpoint]), {
        createUuid: () => "run-v2",
        logDirectory,
        logger: silentLogger,
        now: createNowSequence([100, 160]),
      });

      expect(execution.normalizedOptions.xapiVersion).toBe("2.0.0");
      expect(execution.runRecord.summary).toEqual({
        total: 1435,
        passed: 1435,
        failed: 0,
        version: "2.0.0",
      });
      expect(
        harness.requests.filter((request) => request.path === "/xapi/statements" && request.method === "POST"),
      ).toHaveLength(1191);
      expect(
        harness.requests.filter((request) => request.path === "/xapi/statements" && request.method === "PUT"),
      ).toHaveLength(47);
      expect(
        harness.requests.filter((request) => request.path === "/xapi/statements" && request.method === "GET"),
      ).toHaveLength(177);
      expect(harness.requests.filter((request) => request.version === null)).toHaveLength(10);
      expect(harness.requests.filter((request) => request.version === "BAD")).toHaveLength(2);
      expect(
        harness.requests.every(
          (request) => request.version === null || request.version === "BAD" || request.version === "2.0.0",
        ),
      ).toBe(true);

      const writtenRecord = JSON.parse(readFileSync(join(logDirectory, "run-v2.log"), "utf8")) as {
        log: { tests: Array<{ title: string; tests: Array<{ title: string }> }> };
        summary: { failed: number; passed: number; total: number; version: string };
      };

      expect(writtenRecord.summary).toEqual({
        total: 1435,
        passed: 1435,
        failed: 0,
        version: "2.0.0",
      });
      expectLoggedSuiteTitles(writtenRecord.log.tests, [
        "Formatting Requirements (Data 2.2)",
        "HEAD Request Implementation Requirements (Communication 1.1)",
        "Alternate Request Syntax Requirements",
        "Encoding Requirements (Communication 1.4)",
        "Content Type Requirements (Communication 1.5)",
        "Id Property Requirements (Data 2.4.1)",
        "Timestamp Property Requirements (Data 2.4.7)",
        "Stored Property Requirements (Data 2.4.8)",
        "Verb Property Requirements (Data 2.4.3)",
        "Version Property Requirements (Data 2.4.10)",
        "Result Property Requirements (Data 2.4.5)",
        "Actor Property Requirements (Data 2.4.2)",
        "Object Property Requirements (Data 2.4.4)",
        "Context Property Requirements (Data 2.4.6)",
        "Authority Property Requirements (Data 2.4.9)",
        "Attachments Property Requirements (Data 2.4.11)",
        "Statement Lifecycle Requirements (Data 2.3)",
        "Retrieval of Statements (Data 2.5)",
        "Signed Statements (Data 2.6)",
        "Special Data Types and Rules (Data 4.0)",
        "(4.2.7) Additional Requirements for Data Types",
        "Statement Resource Requirements (Communication 2.1)",
        "Document Resource Requirements (Communication 2.2)",
        "State Resource Requirements (Communication 2.3)",
        "Agents Resource Requirements (Communication 2.4)",
        "Activities Resource Requirements (Communication 2.5)",
        "Agent Profile Resource Requirements (Communication 2.6)",
        "Activity Profile Resource Requirements (Communication 2.7)",
        "About Resource Requirements (Communication 2.8)",
        "Concurrency Requirements (Communication 3.1)",
        "Error Codes Requirements (Communication 3.2)",
        "Versioning Requirements (Communication 3.3)",
        "Authentication Requirements (Communication 4.0)",
      ]);
      expectLoggedNestedSuiteTitles(writtenRecord.log.tests, "Formatting Requirements (Data 2.2)", [
        "An LRS stores 32-bit floating point numbers with at least the precision of IEEE 754 (Data 2.2.s4.b3, XAPI-00002)",
        'A Statement contains an "actor" property (Multiplicity, Data 2.2.s2.b3, XAPI-00003)',
        'A Statement contains a "verb" property (Multiplicity, Data 2.2.s2.b3, XAPI-00004)',
        'A Statement contains an "object" property (Multiplicity, Data 2.2.s2.b3, XAPI-00005)',
        'An LRS rejects with error code 400 Bad Request any Statement having a property whose value is set to "null", except in an "extensions" property (Data 2.2.s4.b1.b1, XAPI-00001)',
        "An LRS rejects with error code 400 Bad Request a Statement which uses the wrong data type (Data 2.2.s4.b2, XAPI-00006)",
        "An LRS rejects with error code 400 Bad Request a Statement which uses any non-format-following key or value, including the empty string, where a string with a particular format, such as mailto IRI, UUID, or IRI, is required. (Data 2.2.s4.b4, XAPI-00007)",
        "An LRS rejects with error code 400 Bad Request a Statement where the case of a key does not match the case specified in this specification. (Data 2.2.s4.b1.b5, XAPI-00008, XAPI-00010)",
        "An LRS rejects with error code 400 Bad Request a Statement where the case of a value restricted to enumerated values does not match an enumerated value given in this specification exactly. (Data 2.2.s4.b1.b6, XAPI-00009)",
        "The LRS rejects with error code 400 Bad Request a token with does not validate as matching the RFC 5646 standard in the sequence of token lengths for language map keys. (Format, Data 2.2.s4.b2, Data 2.4.6.s3.table1.row7, RFC5646, XAPI-00013)",
        "All Objects are well-created JSON Objects (Nature of binding, Data 2.1, XAPI-00014) **Implicit**",
        "An LRS rejects with error code 400 Bad Request a Statement containing IRL or IRI values without a scheme. (Data 2.2.s4.b1.b8, XAPI-00011)",
        "The LRS rejects with error code 400 Bad Request parameter values which do not validate to the same standards required for values of the same types in Statements (Data 2.2.s4.b4, XAPI-00012)",
      ]);
      const formattingSuite = writtenRecord.log.tests.find(
        (entry) => entry.title === "Formatting Requirements (Data 2.2)",
      );
      const formattingNestedSuites = (formattingSuite?.tests ?? []) as Array<{
        title: string;
        tests: Array<{ title: string }>;
      }>;
      expectLoggedNestedSuiteTitles(
        formattingNestedSuites,
        "All Objects are well-created JSON Objects (Nature of binding, Data 2.1, XAPI-00014) **Implicit**",
        [
          "Statements Verify Templates",
          "Agents Verify Templates",
          "Groups Verify Templates",
          'A Group is defined by "objectType" of an "actor" property or "object" property with value "Group" (Data 2.4.2.2.s2.table2.row1)',
          'An Anonymous Group is defined by "objectType" of an "actor" or "object" with value "Group" and by none of "mbox", "mbox_sha1sum", "openid", or "account" being used (Data 2.4.2.2.s2.table1.row1)',
          "Verbs Verify Templates",
          "Objects Verify Templates",
          "Activities Verify Templates",
          "An Activity Definition uses the following properties: name, description, type, moreInfo, interactionType, or extensions (Format, Data 2.4.4.1.s2)",
          "SubStatements Verify Templates",
          "StatementRefs Verify Templates",
          "Results Verify Templates",
          "Contexts Verify Templates",
          'A ContextActivity is defined as a single Activity of the "value" of the "contextActivities" property (definition, Data 2.4.6.2.s4.b2)',
          "Languages Verify Templates",
          "An LRS rejects a not well-created JSON Object",
        ],
      );
      expectLoggedNestedSuiteTitles(writtenRecord.log.tests, "Id Property Requirements (Data 2.4.1)", [
        'An LRS generates the "id" property of a Statement if none is provided (Modify, Data 2.4.1.s2.b1, XAPI-00026)',
        "All UUID types follow requirements of RFC4122 (Type, Data 2.4.1.s1, XAPI-00030, XAPI-00027)",
        "All UUID types are in standard String form (Type, Data 2.4.1.s1, XAPI-00029, XAPI-00028)",
      ]);
      expectLoggedNestedSuiteTitles(writtenRecord.log.tests, "Timestamp Property Requirements (Data 2.4.7)", [
        'A "timestamp" property is a TimeStamp (Type, Data 2.4.7, Data 2.4.s1.table1.row7, XAPI-00022)',
      ]);
      expectLoggedNestedSuiteTitles(writtenRecord.log.tests, "Stored Property Requirements (Data 2.4.8)", [
        "An LRS MUST accept statements with the stored property (Data 2.4.8.s3.b2, XAPI-00097)",
        "A stored property must be a TimeStamp (Data 2.4.8.s2, XAPI-00023)",
      ]);
      expectLoggedNestedSuiteTitles(writtenRecord.log.tests, "Verb Property Requirements (Data 2.4.3)", [
        'A "verb" property contains an "id" property (Multiplicity, Data 2.4.3.s3.table1.row1, XAPI-00044)',
        'A "verb" property\'s "id" property is an IRI (Type, Data 2.4.3.s3.table1.row1, XAPI-00044)',
        'A "verb" property\'s "display" property is a Language Map (Type, Data 2.4.3.s3.table1.row2, XAPI-00045)',
      ]);
      expectLoggedNestedSuiteTitles(writtenRecord.log.tests, "Version Property Requirements (Data 2.4.10)", [
        'An LRS rejects with error code 400 Bad Request, a Request which uses "version" and has the value set to anything but "1.0" or "1.0.x", where x is the semantic versioning number (Format, Data 2.4.10.s2.b1, Data 2.4.10.s3.b1, Communication 3.3.s3.b3, Communication 3.3.s3.b6, XAPI-00101)',
        "Statements returned by an LRS MUST retain the version property they are accepted with (Format, Data 2.4.10, XAPI-00332)",
      ]);
      expectLoggedNestedSuiteTitles(writtenRecord.log.tests, "Result Property Requirements (Data 2.4.5)", [
        'A "success" property is a Boolean (Type, Data 2.4.5.s2.table1.row1, XAPI-00074)',
        'A "completion" property is a Boolean (Type, Data 2.4.5.s2.table1.row2, XAPI-00075)',
        'A "response" property is a String (Type, Data 2.4.5.s2.table1.row3, XAPI-00076)',
        'A "duration" property is a formatted to ISO 8601 (Type, Data 2.4.5.s2.table1.row4, XAPI-00077)',
        'An "extensions" property is an Object (Type, Data 2.4.5.s2.table1.row6, XAPI-00078)',
        'A "score" property is an Object (Type, Data 2.4.5.1, XAPI-00079)',
        'A "score" Object\'s "scaled" property is a decimal number between -1 and 1, inclusive. (Type, Data 2.4.5.1.s2.table1.row1, XAPI-00083)',
        'A "score" Object\'s "raw" property is a decimal number between min and max, if present and otherwise unrestricted, inclusive (Type, Data 2.4.5.1.s2.table1.row2, XAPI-00082)',
        'A "score" Object\'s "min" property is a decimal number less than the "max" property, if it is present. (Type, Data 2.4.5.1.s2.table1.row3, XAPI-00081)',
        'A "score" Object\'s "max" property is a Decimal accurate to seven significant decimal figures (Type, Data 2.4.5.1.s2.table1.row4, XAPI-00080)',
      ]);
    } finally {
      await harness.server.stop(true);
    }
  });

  test("runs the v1 formatting slice through the same console runner path", async () => {
    const harness = startMockLrs("1.0.3");
    const logDirectory = join(import.meta.dir, "..", "..", "tmp", "agents", crypto.randomUUID());

    try {
      const execution = await runConsoleRunnerArgv(withBasicAuthArgs(["-e", harness.endpoint, "-x", "1.0.3"]), {
        createUuid: () => "run-v103",
        logDirectory,
        logger: silentLogger,
        now: createNowSequence([200, 250]),
      });

      expect(execution.normalizedOptions.xapiVersion).toBe("1.0.3");
      expect(execution.runRecord.summary).toEqual({
        total: 1365,
        passed: 1365,
        failed: 0,
        version: "1.0.3",
      });
      expect(harness.requests).toHaveLength(1625);
      expect(harness.requests.filter((request) => request.version === null)).toHaveLength(12);
      expect(harness.requests.filter((request) => request.version === "BAD")).toHaveLength(2);
      expect(
        harness.requests.every(
          (request) => request.version === null || request.version === "BAD" || request.version === "1.0.3",
        ),
      ).toBe(true);

      const writtenRecord = JSON.parse(readFileSync(join(logDirectory, "run-v103.log"), "utf8")) as {
        summary: { failed: number; passed: number; total: number; version: string };
      };

      expect(writtenRecord.summary).toEqual({
        total: 1365,
        passed: 1365,
        failed: 0,
        version: "1.0.3",
      });
    } finally {
      await harness.server.stop(true);
    }
  });

  test("runs the Parameters slice alongside v2_0 through directory selection", async () => {
    const harness = startMockLrs("2.0.0");
    const logDirectory = join(import.meta.dir, "..", "..", "tmp", "agents", crypto.randomUUID());

    try {
      const execution = await runConsoleRunnerArgv(
        withBasicAuthArgs(["--endpoint", harness.endpoint, "--directory", "Parameters,v2_0"]),
        {
          createUuid: () => "run-parameters-v2",
          logDirectory,
          logger: silentLogger,
          now: createNowSequence([300, 360]),
        },
      );

      expect(execution.normalizedOptions.directory).toEqual(["Parameters", "v2_0"]);
      expect(execution.normalizedOptions.xapiVersion).toBe("2.0.0");
      expect(execution.runRecord.summary).toEqual({
        total: 1493,
        passed: 1493,
        failed: 0,
        version: "2.0.0",
      });
      expect(harness.requests.filter((request) => request.path === "/xapi/statements")).toHaveLength(1418);
      expect(harness.requests.filter((request) => request.path === "/xapi/activities/state")).toHaveLength(156);
      expect(harness.requests.filter((request) => request.path === "/xapi/agents/profile")).toHaveLength(109);
      expect(harness.requests.filter((request) => request.path === "/xapi/activities/profile")).toHaveLength(121);
      expect(harness.requests.filter((request) => request.version === null)).toHaveLength(10);
      expect(harness.requests.filter((request) => request.version === "BAD")).toHaveLength(2);
      expect(
        harness.requests.every(
          (request) => request.version === null || request.version === "BAD" || request.version === "2.0.0",
        ),
      ).toBe(true);

      const writtenRecord = JSON.parse(readFileSync(join(logDirectory, "run-parameters-v2.log"), "utf8")) as {
        summary: { failed: number; passed: number; total: number; version: string };
      };

      expect(writtenRecord.summary).toEqual({
        total: 1493,
        passed: 1493,
        failed: 0,
        version: "2.0.0",
      });
    } finally {
      await harness.server.stop(true);
    }
  });

  test("runs the Multiplicity slice alongside v2_0 without adding HTTP traffic", async () => {
    const harness = startMockLrs("2.0.0");
    const logDirectory = join(import.meta.dir, "..", "..", "tmp", "agents", crypto.randomUUID());

    try {
      const execution = await runConsoleRunnerArgv(
        withBasicAuthArgs(["--endpoint", harness.endpoint, "--directory", "Multiplicity,v2_0"]),
        {
          createUuid: () => "run-multiplicity-v2",
          logDirectory,
          logger: silentLogger,
          now: createNowSequence([400, 470]),
        },
      );

      expect(execution.normalizedOptions.directory).toEqual(["Multiplicity", "v2_0"]);
      expect(execution.normalizedOptions.xapiVersion).toBe("2.0.0");
      expect(execution.runRecord.summary).toEqual({
        total: 1517,
        passed: 1517,
        failed: 0,
        version: "2.0.0",
      });
      expect(harness.requests.filter((request) => request.path === "/xapi/statements")).toHaveLength(1418);
      expect(harness.requests.filter((request) => request.path !== "/xapi/statements")).toHaveLength(361);

      const writtenRecord = JSON.parse(readFileSync(join(logDirectory, "run-multiplicity-v2.log"), "utf8")) as {
        log: { tests: Array<{ title: string }> };
        summary: { failed: number; passed: number; total: number; version: string };
      };

      expect(writtenRecord.summary).toEqual({
        total: 1517,
        passed: 1517,
        failed: 0,
        version: "2.0.0",
      });
      expectLoggedSuiteTitles(writtenRecord.log.tests, [
        "Welcome to Multiplicity Testing.  A Statement, Object or Verb's properties are used at most one time",
        "Formatting Requirements (Data 2.2)",
        "HEAD Request Implementation Requirements (Communication 1.1)",
        "Alternate Request Syntax Requirements",
        "Encoding Requirements (Communication 1.4)",
        "Content Type Requirements (Communication 1.5)",
        "Id Property Requirements (Data 2.4.1)",
        "Timestamp Property Requirements (Data 2.4.7)",
        "Stored Property Requirements (Data 2.4.8)",
        "Verb Property Requirements (Data 2.4.3)",
        "Version Property Requirements (Data 2.4.10)",
        "Result Property Requirements (Data 2.4.5)",
        "Actor Property Requirements (Data 2.4.2)",
        "Object Property Requirements (Data 2.4.4)",
        "Context Property Requirements (Data 2.4.6)",
        "Authority Property Requirements (Data 2.4.9)",
        "Attachments Property Requirements (Data 2.4.11)",
        "Statement Lifecycle Requirements (Data 2.3)",
        "Retrieval of Statements (Data 2.5)",
        "Signed Statements (Data 2.6)",
        "Special Data Types and Rules (Data 4.0)",
        "(4.2.7) Additional Requirements for Data Types",
        "Statement Resource Requirements (Communication 2.1)",
        "Document Resource Requirements (Communication 2.2)",
        "State Resource Requirements (Communication 2.3)",
        "Agents Resource Requirements (Communication 2.4)",
        "Activities Resource Requirements (Communication 2.5)",
        "Agent Profile Resource Requirements (Communication 2.6)",
        "Activity Profile Resource Requirements (Communication 2.7)",
        "About Resource Requirements (Communication 2.8)",
        "Concurrency Requirements (Communication 3.1)",
        "Error Codes Requirements (Communication 3.2)",
        "Versioning Requirements (Communication 3.3)",
        "Authentication Requirements (Communication 4.0)",
      ]);
    } finally {
      await harness.server.stop(true);
    }
  });
});
