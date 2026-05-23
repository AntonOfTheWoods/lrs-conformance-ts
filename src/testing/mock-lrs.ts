import { createHash } from "node:crypto";

import type { JsonObject } from "../domain/contracts";

interface StoredDocument {
  id: string;
  contextKey: string;
  body: unknown;
  mediaType: string;
  storedAt: number;
}

interface StoredAttachmentPart {
  sha2: string;
  contentType: string;
  body: string;
}

interface StoredStatement {
  id: string;
  body: JsonObject;
  storedAt: string;
  storedAtMs: number;
  isVoiding: boolean;
  attachmentParts: StoredAttachmentPart[];
}

interface ParsedMultipartPart {
  headers: Record<string, string>;
  body: string;
}

interface ParsedStatementWritePayload {
  statements: unknown[];
  responseKind: "single" | "batch";
  attachmentParts: Map<string, StoredAttachmentPart>;
}

const populatedAuthorityAccountHomePage = "https://example.test/xapi/auth/basic";
const voidingVerbId = "http://adlnet.gov/expapi/verbs/voided";
const statementAttachmentResponseBoundary = "mock-xapi-statement-attachments";
const validBasicAuthorization = "Basic cHJvb2YtYmFzaWMtdXNlcjpwcm9vZi1iYXNpYy1wYXNzd29yZA==";
const validBasicUserName = "proof-basic-user";
const validBasicPassword = "proof-basic-password";
const validOauthAuthorizationPrefix = "OAuth ";
const versionHeaderExemptPaths = new Set(["/xapi/about"]);
const versionedApiPaths = new Set([
  "/xapi/statements",
  "/xapi/activities",
  "/xapi/activities/profile",
  "/xapi/activities/state",
  "/xapi/agents",
  "/xapi/agents/profile",
]);
const statementQueryParameters = new Set([
  "statementId",
  "voidedStatementId",
  "agent",
  "verb",
  "activity",
  "registration",
  "related_activities",
  "related_agents",
  "since",
  "until",
  "limit",
  "ascending",
  "format",
  "attachments",
]);
const statementSingleResultAllowedExtras = new Set(["format", "attachments"]);
const statementFormats = new Set(["exact", "canonical", "ids"]);
const statementKeys = new Set([
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
const subStatementKeys = new Set(["objectType", "actor", "verb", "object", "result", "context", "timestamp"]);
const agentKeys = new Set(["objectType", "name", "mbox", "mbox_sha1sum", "openid", "account"]);
const groupKeys = new Set(["objectType", "name", "mbox", "mbox_sha1sum", "openid", "account", "member"]);
const accountKeys = new Set(["homePage", "name"]);
const verbKeys = new Set(["id", "display"]);
const attachmentKeys = new Set(["usageType", "display", "description", "contentType", "length", "sha2", "fileUrl"]);
const activityKeys = new Set(["objectType", "id", "definition"]);
const activityDefinitionKeys = new Set([
  "name",
  "description",
  "type",
  "moreInfo",
  "interactionType",
  "correctResponsesPattern",
  "choices",
  "scale",
  "source",
  "target",
  "steps",
  "extensions",
]);
const interactionComponentKeys = new Set(["id", "description"]);
const contextKeys = new Set([
  "registration",
  "instructor",
  "team",
  "contextActivities",
  "revision",
  "platform",
  "language",
  "statement",
  "extensions",
]);
const contextActivityKeys = new Set(["parent", "grouping", "category", "other"]);
const resultKeys = new Set(["score", "success", "completion", "response", "duration", "extensions"]);
const scoreKeys = new Set(["scaled", "raw", "min", "max"]);
const statementRefKeys = new Set(["objectType", "id"]);
const interactionTypes = new Set([
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

export interface RecordedRequest {
  method: string;
  path: string;
  query: Record<string, string>;
}

export interface MockLrsHandle {
  baseUrl: string;
  requests: RecordedRequest[];
  stop(): void;
}

function createHeaders(
  version: string,
  contentType = "application/json",
  extraHeaders: Record<string, string> = {},
): Headers {
  return new Headers({
    "content-type": contentType,
    "x-experience-api-version": version,
    "x-experience-api-consistent-through": new Date().toISOString(),
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
    headers: createHeaders(version),
  });
}

function parseBasicAuthCredentials(headerValue: string | null): { username: string; password: string } | undefined {
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
      headers: createHeaders(version),
    });
  }

  if (authorization === validBasicAuthorization || authorization.startsWith(validOauthAuthorizationPrefix)) {
    return undefined;
  }

  const credentials = parseBasicAuthCredentials(authorization);
  if (credentials && credentials.username === validBasicUserName && credentials.password === validBasicPassword) {
    return undefined;
  }

  return new Response(JSON.stringify({ error: "unauthorized" }), {
    status: 401,
    headers: createHeaders(version),
  });
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cloneValue<T>(value: T): T {
  return structuredClone(value);
}

function hasRequiredStatementFields(value: unknown): value is JsonObject {
  if (!isJsonObject(value)) {
    return false;
  }

  return ["actor", "verb", "object"].every((key) => key in value);
}

function containsDisallowedNull(value: unknown): boolean {
  if (value === null) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some((item) => containsDisallowedNull(item));
  }

  if (!isJsonObject(value)) {
    return false;
  }

  return Object.entries(value).some(([key, child]) => {
    if (key === "extensions") {
      return false;
    }

    return containsDisallowedNull(child);
  });
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function hasUriScheme(value: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/i.test(value);
}

function isFiniteNumber(value: unknown): boolean {
  return typeof value === "number" && Number.isFinite(value);
}

function isValidTimestamp(value: string): boolean {
  return Number.isFinite(Date.parse(value));
}

function normalizeMediaType(value: string | null): string {
  const mediaType = value?.split(";", 1)[0]?.trim().toLowerCase();
  return mediaType && mediaType.length > 0 ? mediaType : "application/json";
}

function isJsonMediaType(value: string): boolean {
  return value === "application/json" || value.endsWith("+json");
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
    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim().toLowerCase();
    const value = line.slice(separatorIndex + 1).trim();
    headers[key] = value;
  }

  return headers;
}

function parseMultipartParts(body: string, boundary: string): ParsedMultipartPart[] {
  const marker = `--${boundary}`;

  return body.split(marker).flatMap((segment) => {
    const trimmed = segment.replace(/^\r?\n/, "").replace(/\r?\n$/, "");
    if (trimmed.length === 0 || trimmed === "--") {
      return [];
    }

    const withoutClosingMarker = trimmed.endsWith("--") ? trimmed.slice(0, -2) : trimmed;
    const normalized = withoutClosingMarker.replace(/^\r?\n/, "").replace(/\r?\n$/, "");
    const separator = normalized.includes("\r\n\r\n") ? "\r\n\r\n" : "\n\n";
    const separatorIndex = normalized.indexOf(separator);
    if (separatorIndex < 0) {
      return [];
    }

    return [
      {
        headers: parseMultipartHeaders(normalized.slice(0, separatorIndex)),
        body: normalized.slice(separatorIndex + separator.length).replace(/\r?\n$/, ""),
      },
    ];
  });
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function isValidMailto(value: string): boolean {
  return /^mailto:[^@\s]+@[^@\s]+\.[^@\s]+$/i.test(value);
}

function isLanguageMap(value: unknown): value is JsonObject {
  return (
    isJsonObject(value) &&
    Object.keys(value).length > 0 &&
    Object.values(value).every((entry) => typeof entry === "string")
  );
}

function validateAllowedKeys(value: JsonObject, allowedKeys: ReadonlySet<string>, label: string): string | undefined {
  for (const key of Object.keys(value)) {
    if (!allowedKeys.has(key)) {
      return `${label} contains unsupported key ${key}`;
    }
  }

  return undefined;
}

function isValidLanguageTag(value: string): boolean {
  try {
    return Intl.getCanonicalLocales(value).length === 1;
  } catch {
    return false;
  }
}

function isValidIsoDuration(value: string): boolean {
  return /^P(?=.)(?:\d+W|(?:\d+Y)?(?:\d+M)?(?:\d+D)?(?:T(?=\d)(?:\d+H)?(?:\d+M)?(?:\d+(?:\.\d+)?S)?)?)$/i.test(value);
}

function validateLanguageMapValue(value: unknown, label: string): string | undefined {
  if (!isLanguageMap(value)) {
    return `${label} must be a language map`;
  }

  for (const key of Object.keys(value)) {
    if (!isValidLanguageTag(key)) {
      return `${label} keys must be RFC 5646 language tags`;
    }
  }

  return undefined;
}

function validateExtensions(value: unknown, label: string): string | undefined {
  if (!isJsonObject(value)) {
    return `${label} must be an object`;
  }

  for (const key of Object.keys(value)) {
    if (!hasUriScheme(key)) {
      return `${label} keys must be IRIs`;
    }
  }

  return undefined;
}

function validateInteractionComponents(value: unknown, label: string): string | undefined {
  if (!Array.isArray(value)) {
    return `${label} must be an array`;
  }

  for (const component of value) {
    if (!isJsonObject(component)) {
      return `${label} entries must be objects`;
    }

    const keyError = validateAllowedKeys(component, interactionComponentKeys, `${label} entry`);
    if (keyError) {
      return keyError;
    }

    if (typeof component.id !== "string" || component.id.length === 0) {
      return `${label} entry id must be a string`;
    }

    if (component.description !== undefined) {
      const descriptionError = validateLanguageMapValue(component.description, `${label} entry description`);
      if (descriptionError) {
        return descriptionError;
      }
    }
  }

  return undefined;
}

function validateContextActivityEntry(value: unknown, label: string): string | undefined {
  if (Array.isArray(value)) {
    for (const item of value) {
      if (!isJsonObject(item)) {
        return `${label} entries must be Activity objects`;
      }

      const activityError = validateActivityObject(item);
      if (activityError) {
        return activityError;
      }
    }

    return undefined;
  }

  if (!isJsonObject(value)) {
    return `${label} must be an Activity or array of Activities`;
  }

  return validateActivityObject(value);
}

function validateContextActivities(value: unknown): string | undefined {
  if (!isJsonObject(value)) {
    return "contextActivities must be an object";
  }

  const keyError = validateAllowedKeys(value, contextActivityKeys, "contextActivities");
  if (keyError) {
    return keyError;
  }

  for (const [key, child] of Object.entries(value)) {
    const entryError = validateContextActivityEntry(child, `contextActivities ${key}`);
    if (entryError) {
      return entryError;
    }
  }

  return undefined;
}

function normalizeContextActivitiesInValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((child) => normalizeContextActivitiesInValue(child));
  }

  if (!isJsonObject(value)) {
    return value;
  }

  const next: JsonObject = {};

  for (const [key, child] of Object.entries(value)) {
    if (key === "contextActivities" && isJsonObject(child)) {
      const normalizedContextActivities: JsonObject = {};

      for (const [activityKey, activityValue] of Object.entries(child)) {
        if (Array.isArray(activityValue)) {
          normalizedContextActivities[activityKey] = activityValue.map((item) =>
            normalizeContextActivitiesInValue(item),
          );
          continue;
        }

        normalizedContextActivities[activityKey] = [normalizeContextActivitiesInValue(activityValue)];
      }

      next[key] = normalizedContextActivities;
      continue;
    }

    next[key] = normalizeContextActivitiesInValue(child);
  }

  return next;
}

function isActivityObjectForContextConstraints(value: unknown): boolean {
  return (
    isJsonObject(value) &&
    ((typeof value.id === "string" && value.objectType === undefined) || value.objectType === "Activity")
  );
}

function validateActivityDefinition(value: unknown): string | undefined {
  if (!isJsonObject(value)) {
    return "object definition must be an object";
  }

  const keyError = validateAllowedKeys(value, activityDefinitionKeys, "object definition");
  if (keyError) {
    return keyError;
  }

  if (value.name !== undefined) {
    const nameError = validateLanguageMapValue(value.name, "object definition name");
    if (nameError) {
      return nameError;
    }
  }

  if (value.description !== undefined) {
    const descriptionError = validateLanguageMapValue(value.description, "object definition description");
    if (descriptionError) {
      return descriptionError;
    }
  }

  const type = value.type;
  if (type !== undefined && (typeof type !== "string" || !hasUriScheme(type))) {
    return "object definition type must be an IRI";
  }

  const moreInfo = value.moreInfo;
  if (moreInfo !== undefined && (typeof moreInfo !== "string" || !hasUriScheme(moreInfo))) {
    return "object definition moreInfo must be an IRI";
  }

  const interactionType = value.interactionType;
  if (interactionType !== undefined) {
    if (typeof interactionType !== "string" || !interactionTypes.has(interactionType)) {
      return "object definition interactionType must match an xAPI interaction type exactly";
    }
  }

  if (value.extensions !== undefined) {
    const extensionsError = validateExtensions(value.extensions, "object definition extensions");
    if (extensionsError) {
      return extensionsError;
    }
  }

  for (const field of ["choices", "scale", "source", "target", "steps"] as const) {
    if (value[field] !== undefined) {
      const componentError = validateInteractionComponents(value[field], `object definition ${field}`);
      if (componentError) {
        return componentError;
      }
    }
  }

  return undefined;
}

function selectLanguageKey(value: JsonObject, acceptLanguage: string | null): string | undefined {
  const keys = Object.keys(value);
  if (keys.length === 0) {
    return undefined;
  }

  if (!acceptLanguage) {
    return keys[0];
  }

  const preferences = acceptLanguage
    .split(",")
    .map((entry) => entry.trim().split(";", 1)[0]?.trim().toLowerCase())
    .filter((entry): entry is string => Boolean(entry));

  for (const preference of preferences) {
    const exact = keys.find((key) => key.toLowerCase() === preference);
    if (exact) {
      return exact;
    }

    const base = preference.split("-", 1)[0];
    const partial = keys.find((key) => key.toLowerCase().split("-", 1)[0] === base);
    if (partial) {
      return partial;
    }

    if (preference === "*") {
      return keys[0];
    }
  }

  return keys[0];
}

function canonicalizeLanguageMap(value: JsonObject, acceptLanguage: string | null): JsonObject {
  const key = selectLanguageKey(value, acceptLanguage);
  if (!key) {
    return {};
  }

  return {
    [key]: value[key],
  };
}

function validateVerb(value: unknown): string | undefined {
  if (!isJsonObject(value)) {
    return "verb must be an object";
  }

  const keyError = validateAllowedKeys(value, verbKeys, "verb");
  if (keyError) {
    return keyError;
  }

  if (typeof value.id !== "string" || !hasUriScheme(value.id)) {
    return "verb id must be an IRI";
  }

  if (value.display !== undefined) {
    const displayError = validateLanguageMapValue(value.display, "verb display");
    if (displayError) {
      return displayError;
    }
  }

  return undefined;
}

function validateAccount(value: unknown): string | undefined {
  if (!isJsonObject(value)) {
    return "account must be an object";
  }

  const keyError = validateAllowedKeys(value, accountKeys, "account");
  if (keyError) {
    return keyError;
  }

  const homePage = value.homePage;
  if (typeof homePage !== "string" || !isValidUrl(homePage)) {
    return "account.homePage must be a URI";
  }

  const name = value.name;
  if (typeof name !== "string" || name.length === 0) {
    return "account.name must be a string";
  }

  return undefined;
}

function countIfis(value: JsonObject): number {
  return [value.mbox, value.mbox_sha1sum, value.openid, value.account].filter((candidate) => candidate !== undefined)
    .length;
}

function validateIfiFormats(value: JsonObject): string | undefined {
  const mbox = value.mbox;
  if (mbox !== undefined && (typeof mbox !== "string" || !isValidMailto(mbox))) {
    return "mbox must be a mailto IRI";
  }

  const mboxSha1sum = value.mbox_sha1sum;
  if (mboxSha1sum !== undefined && typeof mboxSha1sum !== "string") {
    return "mbox_sha1sum must be a string";
  }

  const openid = value.openid;
  if (openid !== undefined && (typeof openid !== "string" || !isValidUrl(openid))) {
    return "openid must be a URI";
  }

  const account = value.account;
  if (account !== undefined) {
    const accountError = validateAccount(account);
    if (accountError) {
      return accountError;
    }
  }

  return undefined;
}

function validateAgentLike(value: JsonObject): string | undefined {
  if (value.objectType !== undefined && value.objectType !== "Agent") {
    return "agent objectType must be Agent";
  }

  const keyError = validateAllowedKeys(value, agentKeys, "agent");
  if (keyError) {
    return keyError;
  }

  const ifiCount = countIfis(value);
  if (ifiCount > 1) {
    return "actor-like value must use only one IFI";
  }

  const ifiError = validateIfiFormats(value);
  if (ifiError) {
    return ifiError;
  }

  if (ifiCount === 0) {
    return "actor-like value must include one IFI";
  }

  return undefined;
}

function validateGroupMembers(value: unknown): string | undefined {
  if (!Array.isArray(value) || value.length === 0) {
    return "group member must be a non-empty array of Agents";
  }

  for (const member of value) {
    if (!isJsonObject(member)) {
      return "group member must be a non-empty array of Agents";
    }

    if (member.objectType !== undefined && member.objectType !== "Agent") {
      return "group member must be a non-empty array of Agents";
    }

    const memberError = validateAgentLike(member);
    if (memberError) {
      return memberError;
    }
  }

  return undefined;
}

function validateGroupLike(value: JsonObject): string | undefined {
  if (value.objectType !== undefined && value.objectType !== "Group") {
    return "group objectType must be Group";
  }

  const keyError = validateAllowedKeys(value, groupKeys, "group");
  if (keyError) {
    return keyError;
  }

  const ifiCount = countIfis(value);
  if (ifiCount > 1) {
    return "actor-like value must use only one IFI";
  }

  const ifiError = validateIfiFormats(value);
  if (ifiError) {
    return ifiError;
  }

  if (value.member !== undefined) {
    const memberError = validateGroupMembers(value.member);
    if (memberError) {
      return memberError;
    }
  }

  if (ifiCount === 0 && value.member === undefined) {
    return "group must include an IFI or member";
  }

  return undefined;
}

function validateActorLike(value: unknown): string | undefined {
  if (!isJsonObject(value)) {
    return "actor-like value must be an object";
  }

  if (value.objectType !== undefined && value.objectType !== "Agent" && value.objectType !== "Group") {
    return "actor-like objectType must be Agent or Group";
  }

  return value.objectType === "Group" || value.member !== undefined
    ? validateGroupLike(value)
    : validateAgentLike(value);
}

function validateAuthority(value: unknown): string | undefined {
  if (!isJsonObject(value)) {
    return "authority must be an object";
  }

  if (value.objectType === "Group" || value.member !== undefined) {
    if (countIfis(value) > 0) {
      return "authority group must be anonymous and contain exactly two Agents";
    }

    const memberError = validateGroupMembers(value.member);
    if (memberError) {
      return memberError;
    }

    if (!Array.isArray(value.member) || value.member.length !== 2) {
      return "authority group must be anonymous and contain exactly two Agents";
    }

    if (!value.member.some((member) => isJsonObject(member) && member.account !== undefined)) {
      return "authority group must include an OAuth Agent";
    }

    return undefined;
  }

  return validateAgentLike(value);
}

function parseBasicAuthUser(headerValue: string | null): string | undefined {
  return parseBasicAuthCredentials(headerValue)?.username;
}

function populateAuthorityFromRequest(statement: unknown, request: Request): unknown {
  if (!isJsonObject(statement) || statement.authority !== undefined) {
    return statement;
  }

  const userName = parseBasicAuthUser(request.headers.get("authorization"));
  if (!userName) {
    return statement;
  }

  return {
    ...statement,
    authority: {
      objectType: "Agent",
      account: {
        homePage: populatedAuthorityAccountHomePage,
        name: userName,
      },
    },
  } satisfies JsonObject;
}

function validateContext(value: unknown): string | undefined {
  if (!isJsonObject(value)) {
    return "context must be an object";
  }

  const keyError = validateAllowedKeys(value, contextKeys, "context");
  if (keyError) {
    return keyError;
  }

  if (value.instructor !== undefined) {
    const instructorError = validateActorLike(value.instructor);
    if (instructorError) {
      return instructorError;
    }
  }

  if (value.registration !== undefined && (typeof value.registration !== "string" || !isUuid(value.registration))) {
    return "context.registration must be a UUID";
  }

  if (value.team !== undefined) {
    if (!isJsonObject(value.team)) {
      return "context.team must be a Group";
    }

    const teamError = validateGroupLike(value.team);
    if (teamError) {
      return teamError;
    }
  }

  if (value.contextActivities !== undefined) {
    const contextActivitiesError = validateContextActivities(value.contextActivities);
    if (contextActivitiesError) {
      return contextActivitiesError;
    }
  }

  if (value.revision !== undefined && typeof value.revision !== "string") {
    return "context.revision must be a string";
  }

  if (value.platform !== undefined && typeof value.platform !== "string") {
    return "context.platform must be a string";
  }

  if (value.language !== undefined && (typeof value.language !== "string" || !isValidLanguageTag(value.language))) {
    return "context.language must be an RFC 5646 language tag";
  }

  if (value.statement !== undefined) {
    if (!isJsonObject(value.statement)) {
      return "context.statement must be a StatementRef";
    }

    const statementError = validateStatementRef(value.statement);
    if (statementError) {
      return statementError;
    }
  }

  if (value.extensions !== undefined) {
    const extensionsError = validateExtensions(value.extensions, "context.extensions");
    if (extensionsError) {
      return extensionsError;
    }
  }

  return undefined;
}

function validateAttachments(value: unknown): string | undefined {
  if (!Array.isArray(value)) {
    return "attachments must be an array";
  }

  for (const attachment of value) {
    if (!isJsonObject(attachment)) {
      return "attachments must contain objects";
    }

    const keyError = validateAllowedKeys(attachment, attachmentKeys, "attachment");
    if (keyError) {
      return keyError;
    }

    if (typeof attachment.usageType !== "string" || !hasUriScheme(attachment.usageType)) {
      return "attachment usageType must be an IRI";
    }

    const fileUrl = attachment.fileUrl;
    if (fileUrl !== undefined && (typeof fileUrl !== "string" || !hasUriScheme(fileUrl))) {
      return "attachment fileUrl must be an IRI";
    }

    if (attachment.display !== undefined) {
      const displayError = validateLanguageMapValue(attachment.display, "attachment display");
      if (displayError) {
        return displayError;
      }
    }

    if (attachment.description !== undefined) {
      const descriptionError = validateLanguageMapValue(attachment.description, "attachment description");
      if (descriptionError) {
        return descriptionError;
      }
    }
  }

  return undefined;
}

function validateActivityObject(value: JsonObject): string | undefined {
  const keyError = validateAllowedKeys(value, activityKeys, "activity object");
  if (keyError) {
    return keyError;
  }

  if (value.objectType !== undefined && value.objectType !== "Activity") {
    return "activity objectType must be Activity";
  }

  const objectId = value.id;
  if (typeof objectId !== "string" || !hasUriScheme(objectId)) {
    return "object id must be an IRI";
  }

  const definition = value.definition;
  if (definition !== undefined) {
    const definitionError = validateActivityDefinition(definition);
    if (definitionError) {
      return definitionError;
    }
  }

  return undefined;
}

function validateResult(value: unknown): string | undefined {
  if (!isJsonObject(value)) {
    return "result must be an object";
  }

  const keyError = validateAllowedKeys(value, resultKeys, "result");
  if (keyError) {
    return keyError;
  }

  if (value.success !== undefined && typeof value.success !== "boolean") {
    return "result.success must be a boolean";
  }

  if (value.completion !== undefined && typeof value.completion !== "boolean") {
    return "result.completion must be a boolean";
  }

  if (value.response !== undefined && typeof value.response !== "string") {
    return "result.response must be a string";
  }

  if (value.duration !== undefined && (typeof value.duration !== "string" || !isValidIsoDuration(value.duration))) {
    return "result.duration must be an ISO 8601 duration";
  }

  const score = value.score;
  if (score !== undefined) {
    if (!isJsonObject(score)) {
      return "result.score must be an object";
    }

    const scoreKeyError = validateAllowedKeys(score, scoreKeys, "result.score");
    if (scoreKeyError) {
      return scoreKeyError;
    }

    for (const field of ["scaled", "raw", "min", "max"] as const) {
      const scoreValue = score[field];
      if (scoreValue !== undefined && !isFiniteNumber(scoreValue)) {
        return `result.score.${field} must be a number`;
      }
    }

    const scaled = score.scaled;
    const raw = score.raw;
    const min = score.min;
    const max = score.max;

    if (typeof scaled === "number" && Number.isFinite(scaled) && (scaled < -1 || scaled > 1)) {
      return "result.score.scaled must be between -1 and 1 inclusive";
    }

    if (
      typeof min === "number" &&
      Number.isFinite(min) &&
      typeof max === "number" &&
      Number.isFinite(max) &&
      min >= max
    ) {
      return "result.score.min must be less than result.score.max";
    }

    if (
      typeof raw === "number" &&
      Number.isFinite(raw) &&
      typeof min === "number" &&
      Number.isFinite(min) &&
      raw < min
    ) {
      return "result.score.raw must be greater than or equal to result.score.min";
    }

    if (
      typeof raw === "number" &&
      Number.isFinite(raw) &&
      typeof max === "number" &&
      Number.isFinite(max) &&
      raw > max
    ) {
      return "result.score.raw must be less than or equal to result.score.max";
    }
  }

  if (value.extensions !== undefined) {
    const extensionsError = validateExtensions(value.extensions, "result.extensions");
    if (extensionsError) {
      return extensionsError;
    }
  }

  return undefined;
}

function validateStatementLike(value: JsonObject, requireId: boolean): string | undefined {
  const keyError = validateAllowedKeys(
    value,
    requireId ? statementKeys : subStatementKeys,
    requireId ? "statement" : "substatement",
  );
  if (keyError) {
    return keyError;
  }

  if (requireId) {
    const statementId = value.id;
    if (typeof statementId !== "string" || !isUuid(statementId)) {
      return "statement id must be a UUID";
    }
  }

  const actorError = validateActorLike(value.actor);
  if (actorError) {
    return actorError;
  }

  const verbError = validateVerb(value.verb);
  if (verbError) {
    return verbError;
  }

  const objectError = validateObject(value.object);
  if (objectError) {
    return objectError;
  }

  if (value.authority !== undefined) {
    const authorityError = validateAuthority(value.authority);
    if (authorityError) {
      return authorityError;
    }
  }

  if (value.context !== undefined) {
    const contextError = validateContext(value.context);
    if (contextError) {
      return contextError;
    }

    const context = value.context;
    if (
      isJsonObject(context) &&
      (context.revision !== undefined || context.platform !== undefined) &&
      !isActivityObjectForContextConstraints(value.object)
    ) {
      return "context.revision and context.platform require the statement object to be an Activity";
    }
  }

  if (value.attachments !== undefined) {
    const attachmentsError = validateAttachments(value.attachments);
    if (attachmentsError) {
      return attachmentsError;
    }
  }

  const result = value.result;
  if (result !== undefined) {
    const resultError = validateResult(result);
    if (resultError) {
      return resultError;
    }
  }

  return undefined;
}

function validateSubStatement(value: JsonObject): string | undefined {
  if (value.objectType !== undefined && value.objectType !== "SubStatement") {
    return "substatement objectType must be SubStatement";
  }

  if (!["actor", "verb", "object"].every((key) => key in value)) {
    return "substatement must include actor, verb, and object";
  }

  if (isJsonObject(value.object) && value.object.objectType === "SubStatement") {
    return "substatement object cannot be a SubStatement";
  }

  return validateStatementLike(value, false);
}

function validateStatementRef(value: JsonObject): string | undefined {
  const keyError = validateAllowedKeys(value, statementRefKeys, "statement ref");
  if (keyError) {
    return keyError;
  }

  if (value.objectType !== undefined && value.objectType !== "StatementRef") {
    return "statement ref objectType must be StatementRef";
  }

  if (typeof value.id !== "string" || !isUuid(value.id)) {
    return "statement ref id must be a UUID";
  }

  return undefined;
}

function validateObject(value: unknown): string | undefined {
  if (!isJsonObject(value)) {
    return "object must be an object";
  }

  const objectType = value.objectType;
  if (objectType === "SubStatement") {
    return validateSubStatement(value);
  }

  if (objectType === "StatementRef") {
    return validateStatementRef(value);
  }

  if (
    objectType === "Agent" ||
    objectType === "Group" ||
    "mbox" in value ||
    "openid" in value ||
    "account" in value ||
    "mbox_sha1sum" in value
  ) {
    return validateActorLike(value);
  }

  return validateActivityObject(value);
}

function validateStatementBody(value: unknown): string | undefined {
  if (!hasRequiredStatementFields(value)) {
    return "statement must include actor, verb, and object";
  }

  if (containsDisallowedNull(value)) {
    return "statement contains disallowed null values";
  }

  return validateStatementLike(value, true);
}

function isValidAgentParameter(value: string | null): boolean {
  if (!value) {
    return false;
  }

  try {
    const parsed = JSON.parse(value);
    return isJsonObject(parsed);
  } catch {
    return false;
  }
}

function parseAgentQuery(value: string | null): JsonObject | undefined {
  if (!value) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(value);
    return isJsonObject(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function isBooleanQueryValue(value: string | null): boolean {
  return value === "true" || value === "false";
}

function readBooleanQueryValue(value: string | null): boolean {
  return value === "true";
}

function isValidLimitQuery(value: string | null): boolean {
  return value !== null && /^\d+$/.test(value);
}

function isRecognizedStatementQueryParam(name: string): boolean {
  return statementQueryParameters.has(name);
}

function isActorLikeCandidate(value: unknown): boolean {
  return (
    isJsonObject(value) &&
    (value.objectType === "Agent" ||
      value.objectType === "Group" ||
      value.member !== undefined ||
      "mbox" in value ||
      "mbox_sha1sum" in value ||
      "openid" in value ||
      "account" in value)
  );
}

function getActorLikeSignature(value: unknown): string | undefined {
  if (!isJsonObject(value)) {
    return undefined;
  }

  if (typeof value.mbox === "string") {
    return `mbox:${value.mbox}`;
  }

  if (typeof value.mbox_sha1sum === "string") {
    return `mbox_sha1sum:${value.mbox_sha1sum}`;
  }

  if (typeof value.openid === "string") {
    return `openid:${value.openid}`;
  }

  if (
    isJsonObject(value.account) &&
    typeof value.account.homePage === "string" &&
    typeof value.account.name === "string"
  ) {
    return `account:${value.account.homePage}|${value.account.name}`;
  }

  return undefined;
}

function collectActorLikeSignatures(value: unknown, signatures: Set<string>): void {
  if (Array.isArray(value)) {
    for (const child of value) {
      collectActorLikeSignatures(child, signatures);
    }
    return;
  }

  if (!isJsonObject(value)) {
    return;
  }

  if (isActorLikeCandidate(value)) {
    const signature = getActorLikeSignature(value);
    if (signature) {
      signatures.add(signature);
    }
  }

  for (const child of Object.values(value)) {
    collectActorLikeSignatures(child, signatures);
  }
}

function collectActivityIds(value: unknown, activityIds: Set<string>): void {
  if (Array.isArray(value)) {
    for (const child of value) {
      collectActivityIds(child, activityIds);
    }
    return;
  }

  if (!isJsonObject(value)) {
    return;
  }

  if (value.objectType === "Activity" && typeof value.id === "string") {
    activityIds.add(value.id);
  }

  for (const child of Object.values(value)) {
    collectActivityIds(child, activityIds);
  }
}

function collectMatchingAgents(value: unknown, signature: string, matches: JsonObject[]): void {
  if (Array.isArray(value)) {
    for (const child of value) {
      collectMatchingAgents(child, signature, matches);
    }
    return;
  }

  if (!isJsonObject(value)) {
    return;
  }

  if (
    isActorLikeCandidate(value) &&
    getActorLikeSignature(value) === signature &&
    value.objectType !== "Group" &&
    value.member === undefined
  ) {
    matches.push(cloneValue(value));
  }

  for (const child of Object.values(value)) {
    collectMatchingAgents(child, signature, matches);
  }
}

function collectMatchingActivities(value: unknown, activityId: string, matches: JsonObject[]): void {
  if (Array.isArray(value)) {
    for (const child of value) {
      collectMatchingActivities(child, activityId, matches);
    }
    return;
  }

  if (!isJsonObject(value)) {
    return;
  }

  if (value.objectType === "Activity" && value.id === activityId) {
    matches.push(cloneValue(value));
  }

  for (const child of Object.values(value)) {
    collectMatchingActivities(child, activityId, matches);
  }
}

function mergeJsonValues(left: unknown, right: unknown): unknown {
  if (isJsonObject(left) && isJsonObject(right)) {
    const merged = cloneValue(left);

    for (const [key, value] of Object.entries(right)) {
      merged[key] = key in merged ? mergeJsonValues(merged[key], value) : cloneValue(value);
    }

    return merged;
  }

  return cloneValue(right);
}

function appendUniqueString(target: string[], seen: Set<string>, value: unknown): void {
  if (typeof value !== "string" || seen.has(value)) {
    return;
  }

  seen.add(value);
  target.push(value);
}

function buildAccountSignature(value: unknown): string | undefined {
  if (!isJsonObject(value) || typeof value.homePage !== "string" || typeof value.name !== "string") {
    return undefined;
  }

  return `${value.homePage}|${value.name}`;
}

function buildPersonObject(agent: JsonObject, statements: Map<string, StoredStatement>): JsonObject {
  const signature = getActorLikeSignature(agent);
  const matchedAgents: JsonObject[] = [];

  if (signature) {
    for (const statement of statements.values()) {
      collectMatchingAgents(statement.body, signature, matchedAgents);
    }
  }

  const sources = [agent, ...matchedAgents];
  const person: JsonObject = {
    objectType: "Person",
  };
  const names: string[] = [];
  const mboxes: string[] = [];
  const mboxSha1sums: string[] = [];
  const openids: string[] = [];
  const accounts: JsonObject[] = [];
  const seenNames = new Set<string>();
  const seenMboxes = new Set<string>();
  const seenMboxSha1sums = new Set<string>();
  const seenOpenIds = new Set<string>();
  const seenAccounts = new Set<string>();

  for (const source of sources) {
    appendUniqueString(names, seenNames, source.name);
    appendUniqueString(mboxes, seenMboxes, source.mbox);
    appendUniqueString(mboxSha1sums, seenMboxSha1sums, source.mbox_sha1sum);
    appendUniqueString(openids, seenOpenIds, source.openid);

    const accountSignature = buildAccountSignature(source.account);
    if (accountSignature && !seenAccounts.has(accountSignature) && isJsonObject(source.account)) {
      seenAccounts.add(accountSignature);
      accounts.push(cloneValue(source.account));
    }
  }

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

function buildActivityObject(activityId: string, statements: Map<string, StoredStatement>): JsonObject {
  const matchedActivities: JsonObject[] = [];

  for (const statement of statements.values()) {
    collectMatchingActivities(statement.body, activityId, matchedActivities);
  }

  if (matchedActivities.length === 0) {
    return {
      objectType: "Activity",
      id: activityId,
    };
  }

  const [firstActivity, ...restActivities] = matchedActivities;
  if (!firstActivity) {
    return {
      objectType: "Activity",
      id: activityId,
    };
  }

  const merged = restActivities.reduce<unknown>((result, activity) => mergeJsonValues(result, activity), firstActivity);
  if (!isJsonObject(merged)) {
    return {
      objectType: "Activity",
      id: activityId,
    };
  }

  return {
    objectType: "Activity",
    ...merged,
    id: activityId,
  };
}

function canonicalizeStatementValue(value: unknown, acceptLanguage: string | null): unknown {
  if (Array.isArray(value)) {
    return value.map((child) => canonicalizeStatementValue(child, acceptLanguage));
  }

  if (!isJsonObject(value)) {
    return value;
  }

  const next: JsonObject = {};
  for (const [key, child] of Object.entries(value)) {
    if ((key === "display" || key === "name" || key === "description") && isLanguageMap(child)) {
      next[key] = canonicalizeLanguageMap(child, acceptLanguage);
      continue;
    }

    next[key] = canonicalizeStatementValue(child, acceptLanguage);
  }

  return next;
}

function formatActorLikeIds(value: JsonObject): JsonObject {
  const next: JsonObject = {};

  if (typeof value.objectType === "string") {
    next.objectType = value.objectType;
  }

  if (typeof value.mbox === "string") {
    next.mbox = value.mbox;
  } else if (typeof value.mbox_sha1sum === "string") {
    next.mbox_sha1sum = value.mbox_sha1sum;
  } else if (typeof value.openid === "string") {
    next.openid = value.openid;
  } else if (
    isJsonObject(value.account) &&
    typeof value.account.homePage === "string" &&
    typeof value.account.name === "string"
  ) {
    next.account = {
      homePage: value.account.homePage,
      name: value.account.name,
    };
  }

  if (Array.isArray(value.member)) {
    next.member = value.member.filter(isJsonObject).map((member) => formatActorLikeIds(member));
  }

  return next;
}

function formatStatementIdsValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((child) => formatStatementIdsValue(child));
  }

  if (!isJsonObject(value)) {
    return value;
  }

  if (value.objectType === "SubStatement") {
    const next = cloneValue(value);
    next.actor = formatStatementIdsValue(next.actor);
    next.verb = formatStatementIdsValue(next.verb);
    next.object = formatStatementIdsValue(next.object);
    next.context = formatStatementIdsValue(next.context);
    return next;
  }

  if (value.objectType === "StatementRef") {
    return {
      objectType: "StatementRef",
      id: value.id,
    };
  }

  if (isActorLikeCandidate(value)) {
    return formatActorLikeIds(value);
  }

  if (typeof value.id === "string" && isJsonObject(value.display) && value.objectType === undefined) {
    return {
      id: value.id,
    };
  }

  if ((value.objectType === "Activity" || value.definition !== undefined) && typeof value.id === "string") {
    return {
      id: value.id,
    };
  }

  const next: JsonObject = {};
  for (const [key, child] of Object.entries(value)) {
    next[key] = formatStatementIdsValue(child);
  }

  return next;
}

function formatStatementBody(body: JsonObject, format: string | null, acceptLanguage: string | null): JsonObject {
  switch (format) {
    case null:
    case "exact":
      return cloneValue(body);
    case "canonical":
      return canonicalizeStatementValue(cloneValue(body), acceptLanguage) as JsonObject;
    case "ids":
      return formatStatementIdsValue(cloneValue(body)) as JsonObject;
    default:
      return cloneValue(body);
  }
}

function validateStatementQuery(url: URL): string | undefined {
  for (const name of url.searchParams.keys()) {
    if (!isRecognizedStatementQueryParam(name)) {
      return `${name} is not a recognized parameter`;
    }
  }

  const statementId = url.searchParams.get("statementId");
  if (statementId && !isUuid(statementId)) {
    return "statementId must be a UUID";
  }

  const voidedStatementId = url.searchParams.get("voidedStatementId");
  if (voidedStatementId && !isUuid(voidedStatementId)) {
    return "voidedStatementId must be a UUID";
  }

  if (statementId && voidedStatementId) {
    return "statementId and voidedStatementId cannot both be provided";
  }

  if (statementId || voidedStatementId) {
    for (const name of url.searchParams.keys()) {
      if (!statementSingleResultAllowedExtras.has(name) && name !== "statementId" && name !== "voidedStatementId") {
        return "statementId and voidedStatementId cannot be combined with collection query parameters";
      }
    }
  }

  const registration = url.searchParams.get("registration");
  if (registration && !isUuid(registration)) {
    return "registration must be a UUID";
  }

  const agent = url.searchParams.get("agent");
  if (agent && !isValidAgentParameter(agent)) {
    return "agent must be valid JSON";
  }

  const verb = url.searchParams.get("verb");
  if (verb && !hasUriScheme(verb)) {
    return "verb must be an IRI";
  }

  const activity = url.searchParams.get("activity");
  if (activity && !hasUriScheme(activity)) {
    return "activity must be an IRI";
  }

  const since = url.searchParams.get("since");
  if (since !== null && !isValidTimestamp(since)) {
    return "since must be a timestamp";
  }

  const until = url.searchParams.get("until");
  if (until !== null && !isValidTimestamp(until)) {
    return "until must be a timestamp";
  }

  const limit = url.searchParams.get("limit");
  if (limit !== null && !isValidLimitQuery(limit)) {
    return "limit must be a non-negative integer";
  }

  for (const name of ["related_activities", "related_agents", "ascending", "attachments"] as const) {
    const value = url.searchParams.get(name);
    if (value !== null && !isBooleanQueryValue(value)) {
      return `${name} must be true or false`;
    }
  }

  const format = url.searchParams.get("format");
  if (format !== null && !statementFormats.has(format)) {
    return "format must be exact, canonical, or ids";
  }

  return undefined;
}

function validateAgentResourceQuery(url: URL): string | undefined {
  for (const name of url.searchParams.keys()) {
    if (name !== "agent") {
      return `${name} is not a recognized parameter`;
    }
  }

  const rawAgent = url.searchParams.get("agent");
  if (rawAgent === null) {
    return "agent is required";
  }

  if (!isValidAgentParameter(rawAgent)) {
    return "agent must be a valid JSON Agent";
  }

  const agent = parseAgentQuery(rawAgent);
  if (!agent || agent.objectType === "Group" || agent.member !== undefined) {
    return "agent must be a valid JSON Agent";
  }

  return validateAgentLike(agent);
}

function validateActivityResourceQuery(url: URL): string | undefined {
  for (const name of url.searchParams.keys()) {
    if (name !== "activityId") {
      return `${name} is not a recognized parameter`;
    }
  }

  const activityId = url.searchParams.get("activityId");
  if (!activityId) {
    return "activityId is required";
  }

  if (!hasUriScheme(activityId)) {
    return "activityId must be an IRI";
  }

  return undefined;
}

function isVoidingStatement(statement: JsonObject): boolean {
  return (
    isJsonObject(statement.verb) &&
    statement.verb.id === voidingVerbId &&
    isJsonObject(statement.object) &&
    statement.object.objectType === "StatementRef" &&
    typeof statement.object.id === "string"
  );
}

function extractStoredAttachmentParts(
  body: JsonObject,
  attachmentParts: Map<string, StoredAttachmentPart>,
): StoredAttachmentPart[] {
  if (!Array.isArray(body.attachments)) {
    return [];
  }

  return body.attachments.flatMap((attachment) => {
    if (!isJsonObject(attachment) || typeof attachment.sha2 !== "string") {
      return [];
    }

    const part = attachmentParts.get(attachment.sha2);
    return part ? [part] : [];
  });
}

function buildStoredStatement(
  body: JsonObject,
  attachmentParts: Map<string, StoredAttachmentPart> = new Map(),
): StoredStatement {
  const storedBody = normalizeContextActivitiesInValue(cloneValue(body)) as JsonObject;
  const storedAt =
    typeof storedBody.timestamp === "string" && isValidTimestamp(storedBody.timestamp)
      ? new Date(storedBody.timestamp).toISOString()
      : new Date().toISOString();
  const statementId = storedBody.id;

  if (typeof statementId !== "string") {
    throw new Error("stored statement id must be a string");
  }

  storedBody.stored = storedAt;
  if (typeof storedBody.timestamp !== "string" || !isValidTimestamp(storedBody.timestamp)) {
    storedBody.timestamp = storedAt;
  }

  return {
    id: statementId,
    body: storedBody,
    storedAt,
    storedAtMs: Date.parse(storedAt),
    isVoiding: isVoidingStatement(storedBody),
    attachmentParts: extractStoredAttachmentParts(storedBody, attachmentParts),
  };
}

function registerVoidingStatement(
  statement: StoredStatement,
  statements: Map<string, StoredStatement>,
  voidedStatementIds: Set<string>,
): void {
  if (!statement.isVoiding) {
    return;
  }

  const statementObject = statement.body.object;
  if (!isJsonObject(statementObject) || typeof statementObject.id !== "string") {
    return;
  }

  const target = statements.get(statementObject.id);
  if (!target || target.isVoiding || voidedStatementIds.has(target.id)) {
    return;
  }

  voidedStatementIds.add(target.id);
}

function buildMultipartStatementResponse(
  primaryBody: string,
  attachments: StoredAttachmentPart[],
  version: string,
  extraHeaders: Record<string, string> = {},
): Response {
  let body = `--${statementAttachmentResponseBoundary}\r\n`;
  body += "Content-Type: application/json\r\n\r\n";
  body += `${primaryBody}\r\n`;

  for (const attachment of attachments) {
    body += `--${statementAttachmentResponseBoundary}\r\n`;
    body += `Content-Type: ${attachment.contentType}\r\n`;
    body += `X-Experience-API-Hash: ${attachment.sha2}\r\n\r\n`;
    body += `${attachment.body}\r\n`;
  }

  body += `--${statementAttachmentResponseBoundary}--\r\n`;

  return new Response(body, {
    status: 200,
    headers: createHeaders(version, `multipart/mixed; boundary=${statementAttachmentResponseBoundary}`, extraHeaders),
  });
}

function buildStatementResponse(
  statement: StoredStatement,
  version: string,
  options: {
    format: string | null;
    acceptLanguage: string | null;
    includeAttachments: boolean;
  },
): Response {
  const formatted = formatStatementBody(statement.body, options.format, options.acceptLanguage);
  const extraHeaders = {
    "last-modified": statement.storedAt,
  };

  if (options.includeAttachments && statement.attachmentParts.length > 0) {
    return buildMultipartStatementResponse(JSON.stringify(formatted), statement.attachmentParts, version, extraHeaders);
  }

  return new Response(JSON.stringify(formatted), {
    status: 200,
    headers: createHeaders(version, "application/json", extraHeaders),
  });
}

function buildStatementResultResponse(
  statements: StoredStatement[],
  version: string,
  options: {
    format: string | null;
    acceptLanguage: string | null;
    includeAttachments: boolean;
  },
): Response {
  const formattedStatements = statements.map((statement) =>
    formatStatementBody(statement.body, options.format, options.acceptLanguage),
  );

  if (options.includeAttachments) {
    const attachmentParts = new Map<string, StoredAttachmentPart>();
    for (const statement of statements) {
      for (const attachment of statement.attachmentParts) {
        attachmentParts.set(attachment.sha2, attachment);
      }
    }

    if (attachmentParts.size > 0) {
      return buildMultipartStatementResponse(
        JSON.stringify({ statements: formattedStatements }),
        [...attachmentParts.values()],
        version,
      );
    }
  }

  return new Response(JSON.stringify({ statements: formattedStatements }), {
    status: 200,
    headers: createHeaders(version),
  });
}

function parseStatementPayload(
  value: unknown,
  version: string,
  attachmentParts: Map<string, StoredAttachmentPart>,
): ParsedStatementWritePayload | Response {
  if (Array.isArray(value)) {
    return {
      statements: value,
      responseKind: "batch",
      attachmentParts,
    };
  }

  if (isJsonObject(value)) {
    return {
      statements: [value],
      responseKind: "single",
      attachmentParts,
    };
  }

  return new Response(JSON.stringify({ error: "statement payload must be a JSON object or array" }), {
    status: 400,
    headers: createHeaders(version),
  });
}

async function parseStatementWritePayload(
  request: Request,
  version: string,
): Promise<ParsedStatementWritePayload | Response> {
  const rawContentType = request.headers.get("content-type");
  const mediaType = normalizeMediaType(rawContentType);
  const boundary = parseMultipartBoundary(rawContentType);
  const rawBody = await request.text();

  if (boundary) {
    if (mediaType !== "multipart/mixed") {
      return new Response(
        JSON.stringify({ error: "statement content-type must be application/json or multipart/mixed" }),
        {
          status: 400,
          headers: createHeaders(version),
        },
      );
    }

    const parts = parseMultipartParts(rawBody, boundary);
    if (parts.length === 0) {
      return new Response(JSON.stringify({ error: "multipart statements require a JSON statement part" }), {
        status: 400,
        headers: createHeaders(version),
      });
    }

    try {
      const attachmentParts = new Map<string, StoredAttachmentPart>();
      const statementPart = parts[0];
      if (!statementPart) {
        return new Response(JSON.stringify({ error: "multipart statements require a JSON statement part" }), {
          status: 400,
          headers: createHeaders(version),
        });
      }

      const parsedStatement = JSON.parse(statementPart.body);

      for (const part of parts.slice(1)) {
        const sha2 = part.headers["x-experience-api-hash"];
        if (!sha2) {
          continue;
        }

        attachmentParts.set(sha2, {
          sha2,
          contentType: part.headers["content-type"] ?? "application/octet-stream",
          body: part.body,
        });
      }

      return parseStatementPayload(parsedStatement, version, attachmentParts);
    } catch {
      return new Response(JSON.stringify({ error: "invalid JSON body" }), {
        status: 400,
        headers: createHeaders(version),
      });
    }
  }

  if (!isJsonMediaType(mediaType)) {
    return new Response(
      JSON.stringify({ error: "statement content-type must be application/json or multipart/mixed" }),
      {
        status: 400,
        headers: createHeaders(version),
      },
    );
  }

  try {
    return parseStatementPayload(JSON.parse(rawBody), version, new Map());
  } catch {
    return new Response(JSON.stringify({ error: "invalid JSON body" }), {
      status: 400,
      headers: createHeaders(version),
    });
  }
}

function prepareStatementsForWrite(
  payload: ParsedStatementWritePayload,
  request: Request,
  version: string,
): JsonObject[] | Response {
  const prepared: JsonObject[] = [];
  const seenIds = new Set<string>();

  for (const rawStatement of payload.statements) {
    const statement = populateAuthorityFromRequest(rawStatement, request);
    const validationError = validateStatementBody(statement);
    if (validationError) {
      return new Response(JSON.stringify({ error: validationError }), {
        status: 400,
        headers: createHeaders(version),
      });
    }

    if (!isJsonObject(statement) || typeof statement.id !== "string") {
      return new Response(JSON.stringify({ error: "statement id must be a UUID" }), {
        status: 400,
        headers: createHeaders(version),
      });
    }

    if (seenIds.has(statement.id)) {
      return new Response(JSON.stringify({ error: "statement batch contains duplicate ids" }), {
        status: 400,
        headers: createHeaders(version),
      });
    }

    seenIds.add(statement.id);
    prepared.push(statement);
  }

  return prepared;
}

function commitStatements(
  nextStatements: JsonObject[],
  attachmentParts: Map<string, StoredAttachmentPart>,
  statements: Map<string, StoredStatement>,
  voidedStatementIds: Set<string>,
): void {
  const newStatements: StoredStatement[] = [];

  for (const statement of nextStatements) {
    if (statements.has(statement.id as string)) {
      continue;
    }

    const storedStatement = buildStoredStatement(statement, attachmentParts);
    statements.set(storedStatement.id, storedStatement);
    newStatements.push(storedStatement);
  }

  for (const statement of newStatements) {
    registerVoidingStatement(statement, statements, voidedStatementIds);
  }
}

function matchesAgentQuery(statement: StoredStatement, query: JsonObject, relatedAgents: boolean): boolean {
  const signature = getActorLikeSignature(query);
  if (!signature) {
    return false;
  }

  if (!relatedAgents) {
    return getActorLikeSignature(statement.body.actor) === signature;
  }

  const signatures = new Set<string>();
  collectActorLikeSignatures(statement.body, signatures);
  return signatures.has(signature);
}

function matchesActivityQuery(statement: StoredStatement, activityId: string, relatedActivities: boolean): boolean {
  if (!relatedActivities) {
    const statementObject = statement.body.object;
    return (
      isJsonObject(statementObject) && statementObject.objectType === "Activity" && statementObject.id === activityId
    );
  }

  const activityIds = new Set<string>();
  collectActivityIds(statement.body, activityIds);
  return activityIds.has(activityId);
}

function matchesCollectionStatementQuery(statement: StoredStatement, url: URL): boolean {
  const agent = parseAgentQuery(url.searchParams.get("agent"));
  if (agent && !matchesAgentQuery(statement, agent, readBooleanQueryValue(url.searchParams.get("related_agents")))) {
    return false;
  }

  const verb = url.searchParams.get("verb");
  if (verb && (!isJsonObject(statement.body.verb) || statement.body.verb.id !== verb)) {
    return false;
  }

  const activity = url.searchParams.get("activity");
  if (
    activity &&
    !matchesActivityQuery(statement, activity, readBooleanQueryValue(url.searchParams.get("related_activities")))
  ) {
    return false;
  }

  const registration = url.searchParams.get("registration");
  if (registration) {
    const context = statement.body.context;
    if (!isJsonObject(context) || context.registration !== registration) {
      return false;
    }
  }

  const since = url.searchParams.get("since");
  if (since !== null && statement.storedAtMs <= Date.parse(since)) {
    return false;
  }

  const until = url.searchParams.get("until");
  if (until !== null && statement.storedAtMs > Date.parse(until)) {
    return false;
  }

  return true;
}

function buildContextKey(url: URL, requiredParams: string[]): string | undefined {
  const values: string[] = [];

  for (const name of requiredParams) {
    const value = url.searchParams.get(name);
    if (!value) {
      return undefined;
    }

    if (name === "agent" && !isValidAgentParameter(value)) {
      return undefined;
    }

    values.push(`${name}=${value}`);
  }

  return values.join("&");
}

function buildDocumentKey(contextKey: string, documentId: string): string {
  return `${contextKey}::${documentId}`;
}

function listDocumentIds(store: Map<string, StoredDocument>, contextKey: string, since?: number): string[] {
  return [...store.values()]
    .filter((document) => document.contextKey === contextKey && (since === undefined || document.storedAt > since))
    .map((document) => document.id);
}

function deleteDocumentsByContext(store: Map<string, StoredDocument>, contextKey: string): void {
  for (const [key, document] of store.entries()) {
    if (document.contextKey === contextKey) {
      store.delete(key);
    }
  }
}

async function parseDocumentWriteBody(
  request: Request,
  version: string,
): Promise<{ body: unknown; mediaType: string } | Response> {
  const mediaType = normalizeMediaType(request.headers.get("content-type"));
  const rawBody = await request.text();

  if (!isJsonMediaType(mediaType)) {
    return {
      body: rawBody,
      mediaType,
    };
  }

  try {
    return {
      body: JSON.parse(rawBody),
      mediaType,
    };
  } catch {
    return new Response(JSON.stringify({ error: "invalid JSON body" }), {
      status: 400,
      headers: createHeaders(version),
    });
  }
}

function buildStoredDocumentResponse(document: StoredDocument, version: string): Response {
  const body = isJsonMediaType(document.mediaType)
    ? JSON.stringify(document.body)
    : typeof document.body === "string"
      ? document.body
      : JSON.stringify(document.body ?? null);
  const etag = `"${createHash("sha1").update(`${document.mediaType}:${body}`).digest("hex")}"`;

  return new Response(body, {
    status: 200,
    headers: createHeaders(version, document.mediaType, {
      etag,
    }),
  });
}

function buildDocumentConflictResponse(version: string): Response {
  return new Response(JSON.stringify({ error: "If-Match is required when overwriting an existing document" }), {
    status: 409,
    headers: createHeaders(version),
  });
}

function buildDocumentPreconditionFailedResponse(version: string): Response {
  return new Response(JSON.stringify({ error: "If-Match does not match the current entity tag" }), {
    status: 412,
    headers: createHeaders(version),
  });
}

function validateDocumentIfMatch(
  request: Request,
  document: StoredDocument | undefined,
  version: string,
): Response | undefined {
  const ifMatch = request.headers.get("if-match");
  if (ifMatch === null) {
    return undefined;
  }

  if (!document) {
    return buildDocumentPreconditionFailedResponse(version);
  }

  const currentEtag = buildStoredDocumentResponse(document, version).headers.get("etag");
  if (currentEtag !== ifMatch) {
    return buildDocumentPreconditionFailedResponse(version);
  }

  return undefined;
}

function validateStatementAttachmentParts(
  statements: JsonObject[],
  attachmentParts: Map<string, StoredAttachmentPart>,
  version: string,
): Response | undefined {
  const allowedParts = new Set<string>();
  const requiredParts = new Set<string>();

  for (const statement of statements) {
    if (!Array.isArray(statement.attachments)) {
      continue;
    }

    for (const attachment of statement.attachments) {
      if (!isJsonObject(attachment) || typeof attachment.sha2 !== "string") {
        continue;
      }

      allowedParts.add(attachment.sha2);

      if (attachment.fileUrl === undefined) {
        requiredParts.add(attachment.sha2);
      }
    }
  }

  for (const sha2 of requiredParts) {
    if (!attachmentParts.has(sha2)) {
      return new Response(JSON.stringify({ error: "multipart attachment parts do not match statement attachments" }), {
        status: 400,
        headers: createHeaders(version),
      });
    }
  }

  for (const sha2 of attachmentParts.keys()) {
    if (!allowedParts.has(sha2)) {
      return new Response(JSON.stringify({ error: "multipart attachment parts do not match statement attachments" }), {
        status: 400,
        headers: createHeaders(version),
      });
    }
  }

  return undefined;
}

async function handleDocumentResource(
  request: Request,
  url: URL,
  version: string,
  store: Map<string, StoredDocument>,
  options: {
    requiredParams: string[];
    idParam: string;
    allowCollectionDelete: boolean;
  },
): Promise<Response> {
  const effectiveMethod = request.method === "HEAD" ? "GET" : request.method;
  const contextKey = buildContextKey(url, options.requiredParams);
  if (!contextKey) {
    return new Response(JSON.stringify({ error: `${options.requiredParams.join(", ")} are required` }), {
      status: 400,
      headers: createHeaders(version),
    });
  }

  const documentId = url.searchParams.get(options.idParam);
  const since = url.searchParams.get("since");

  if (effectiveMethod === "PUT" || effectiveMethod === "POST") {
    if (!documentId) {
      return new Response(JSON.stringify({ error: `${options.idParam} is required` }), {
        status: 400,
        headers: createHeaders(version),
      });
    }

    const parsedBody = await parseDocumentWriteBody(request, version);
    if (parsedBody instanceof Response) {
      return parsedBody;
    }

    const { body: nextBody, mediaType: nextMediaType } = parsedBody;
    const documentKey = buildDocumentKey(contextKey, documentId);
    const existing = store.get(documentKey);

    const ifMatchError = validateDocumentIfMatch(request, existing, version);
    if (ifMatchError) {
      return ifMatchError;
    }

    if (effectiveMethod === "PUT" && existing && request.headers.get("if-match") === null) {
      return buildDocumentConflictResponse(version);
    }

    let bodyToStore = nextBody;
    let mediaTypeToStore = nextMediaType;
    if (effectiveMethod === "POST" && existing) {
      if (!isJsonMediaType(existing.mediaType) || !isJsonMediaType(nextMediaType)) {
        return new Response(JSON.stringify({ error: "document merge requires application/json documents" }), {
          status: 400,
          headers: createHeaders(version),
        });
      }

      if (!isJsonObject(existing.body) || !isJsonObject(nextBody)) {
        return new Response(JSON.stringify({ error: "document merge requires JSON objects" }), {
          status: 400,
          headers: createHeaders(version),
        });
      }

      bodyToStore = {
        ...existing.body,
        ...nextBody,
      };
      mediaTypeToStore = existing.mediaType;
    }

    store.set(documentKey, {
      id: documentId,
      contextKey,
      body: bodyToStore,
      mediaType: mediaTypeToStore,
      storedAt: Date.now(),
    });

    return new Response(null, {
      status: 204,
      headers: createHeaders(version),
    });
  }

  if (effectiveMethod === "GET") {
    if (!documentId) {
      let sinceTimestamp: number | undefined;
      if (since !== null) {
        if (!isValidTimestamp(since)) {
          return new Response(JSON.stringify({ error: "since must be a timestamp" }), {
            status: 400,
            headers: createHeaders(version),
          });
        }

        sinceTimestamp = Date.parse(since);
      }

      const response = new Response(JSON.stringify(listDocumentIds(store, contextKey, sinceTimestamp)), {
        status: 200,
        headers: createHeaders(version),
      });

      return request.method === "HEAD" ? withoutBody(response) : response;
    }

    const document = store.get(buildDocumentKey(contextKey, documentId));
    if (!document) {
      return new Response(JSON.stringify({ error: "document not found" }), {
        status: 404,
        headers: createHeaders(version),
      });
    }

    const response = buildStoredDocumentResponse(document, version);
    return request.method === "HEAD" ? withoutBody(response) : response;
  }

  if (effectiveMethod === "DELETE") {
    if (!documentId) {
      if (!options.allowCollectionDelete) {
        return new Response(JSON.stringify({ error: `${options.idParam} is required` }), {
          status: 400,
          headers: createHeaders(version),
        });
      }

      deleteDocumentsByContext(store, contextKey);
      return new Response(null, {
        status: 204,
        headers: createHeaders(version),
      });
    }

    const existing = store.get(buildDocumentKey(contextKey, documentId));
    const ifMatchError = validateDocumentIfMatch(request, existing, version);
    if (ifMatchError) {
      return ifMatchError;
    }

    store.delete(buildDocumentKey(contextKey, documentId));
    return new Response(null, {
      status: 204,
      headers: createHeaders(version),
    });
  }

  return new Response(JSON.stringify({ error: "method not allowed" }), {
    status: 405,
    headers: createHeaders(version),
  });
}

function handleAboutResource(request: Request, version: string): Response {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response(JSON.stringify({ error: "method not allowed" }), {
      status: 405,
      headers: createHeaders(version),
    });
  }

  const response = new Response(JSON.stringify({ version: [version] }), {
    status: 200,
    headers: createHeaders(version),
  });

  return request.method === "HEAD" ? withoutBody(response) : response;
}

function handleAgentsResource(
  request: Request,
  url: URL,
  version: string,
  statements: Map<string, StoredStatement>,
): Response {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response(JSON.stringify({ error: "method not allowed" }), {
      status: 405,
      headers: createHeaders(version),
    });
  }

  const validationError = validateAgentResourceQuery(url);
  if (validationError) {
    return new Response(JSON.stringify({ error: validationError }), {
      status: 400,
      headers: createHeaders(version),
    });
  }

  const agent = parseAgentQuery(url.searchParams.get("agent"));
  if (!agent) {
    return new Response(JSON.stringify({ error: "agent is required" }), {
      status: 400,
      headers: createHeaders(version),
    });
  }

  const response = new Response(JSON.stringify(buildPersonObject(agent, statements)), {
    status: 200,
    headers: createHeaders(version),
  });

  return request.method === "HEAD" ? withoutBody(response) : response;
}

function handleActivitiesResource(
  request: Request,
  url: URL,
  version: string,
  statements: Map<string, StoredStatement>,
): Response {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response(JSON.stringify({ error: "method not allowed" }), {
      status: 405,
      headers: createHeaders(version),
    });
  }

  const validationError = validateActivityResourceQuery(url);
  if (validationError) {
    return new Response(JSON.stringify({ error: validationError }), {
      status: 400,
      headers: createHeaders(version),
    });
  }

  const activityId = url.searchParams.get("activityId");
  if (!activityId) {
    return new Response(JSON.stringify({ error: "activityId is required" }), {
      status: 400,
      headers: createHeaders(version),
    });
  }

  const response = new Response(JSON.stringify(buildActivityObject(activityId, statements)), {
    status: 200,
    headers: createHeaders(version),
  });

  return request.method === "HEAD" ? withoutBody(response) : response;
}

export function startMockLrs(version = "2.0.0"): MockLrsHandle {
  const requests: RecordedRequest[] = [];
  const statements = new Map<string, StoredStatement>();
  const voidedStatementIds = new Set<string>();
  const stateDocuments = new Map<string, StoredDocument>();
  const activityProfileDocuments = new Map<string, StoredDocument>();
  const agentProfileDocuments = new Map<string, StoredDocument>();

  const server = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    async fetch(request) {
      const url = new URL(request.url);
      const query = Object.fromEntries(url.searchParams.entries());
      requests.push({
        method: request.method,
        path: url.pathname,
        query,
      });

      const versionHeaderError = validateVersionHeader(request, url.pathname, version);
      if (versionHeaderError) {
        return versionHeaderError;
      }

      const authorizationError = validateAuthorizationHeader(request, version);
      if (authorizationError) {
        return authorizationError;
      }

      if (url.pathname === "/xapi/about") {
        return handleAboutResource(request, version);
      }

      if (url.pathname === "/xapi/activities") {
        return handleActivitiesResource(request, url, version, statements);
      }

      if (url.pathname === "/xapi/agents") {
        return handleAgentsResource(request, url, version, statements);
      }

      if (url.pathname === "/xapi/activities/state") {
        return handleDocumentResource(request, url, version, stateDocuments, {
          requiredParams: ["activityId", "agent"],
          idParam: "stateId",
          allowCollectionDelete: true,
        });
      }

      if (url.pathname === "/xapi/activities/profile") {
        return handleDocumentResource(request, url, version, activityProfileDocuments, {
          requiredParams: ["activityId"],
          idParam: "profileId",
          allowCollectionDelete: false,
        });
      }

      if (url.pathname === "/xapi/agents/profile") {
        return handleDocumentResource(request, url, version, agentProfileDocuments, {
          requiredParams: ["agent"],
          idParam: "profileId",
          allowCollectionDelete: false,
        });
      }

      if (url.pathname !== "/xapi/statements") {
        return new Response(JSON.stringify({ error: "not found" }), {
          status: 404,
          headers: createHeaders(version),
        });
      }

      if (request.method === "POST") {
        const payload = await parseStatementWritePayload(request, version);
        if (payload instanceof Response) {
          return payload;
        }

        const preparedStatements = prepareStatementsForWrite(payload, request, version);
        if (preparedStatements instanceof Response) {
          return preparedStatements;
        }

        const attachmentValidationError = validateStatementAttachmentParts(
          preparedStatements,
          payload.attachmentParts,
          version,
        );
        if (attachmentValidationError) {
          return attachmentValidationError;
        }

        commitStatements(preparedStatements, payload.attachmentParts, statements, voidedStatementIds);

        if (payload.responseKind === "batch") {
          return new Response(JSON.stringify(preparedStatements.map((statement) => statement.id)), {
            status: 200,
            headers: createHeaders(version),
          });
        }

        return new Response(JSON.stringify({ id: preparedStatements[0]?.id }), {
          status: 200,
          headers: createHeaders(version),
        });
      }

      if (request.method === "PUT") {
        for (const name of url.searchParams.keys()) {
          if (name !== "statementId") {
            return new Response(JSON.stringify({ error: "statementId is required" }), {
              status: 400,
              headers: createHeaders(version),
            });
          }
        }

        const statementId = url.searchParams.get("statementId");
        if (!statementId || !isUuid(statementId)) {
          return new Response(JSON.stringify({ error: "statementId is required" }), {
            status: 400,
            headers: createHeaders(version),
          });
        }

        const payload = await parseStatementWritePayload(request, version);
        if (payload instanceof Response) {
          return payload;
        }

        if (payload.responseKind !== "single" || payload.statements.length !== 1) {
          return new Response(JSON.stringify({ error: "statement PUT requires a single statement" }), {
            status: 400,
            headers: createHeaders(version),
          });
        }

        let body = populateAuthorityFromRequest(payload.statements[0], request);
        if (isJsonObject(body) && body.id === undefined) {
          body = {
            ...body,
            id: statementId,
          } satisfies JsonObject;
        }

        const validationError = validateStatementBody(body);
        if (validationError) {
          return new Response(JSON.stringify({ error: validationError }), {
            status: 400,
            headers: createHeaders(version),
          });
        }

        if (!isJsonObject(body) || typeof body.id !== "string" || body.id !== statementId) {
          return new Response(JSON.stringify({ error: "statement id must match statementId" }), {
            status: 400,
            headers: createHeaders(version),
          });
        }

        const attachmentValidationError = validateStatementAttachmentParts([body], payload.attachmentParts, version);
        if (attachmentValidationError) {
          return attachmentValidationError;
        }

        if (!statements.has(statementId)) {
          const storedStatement = buildStoredStatement(body, payload.attachmentParts);
          statements.set(statementId, storedStatement);
          registerVoidingStatement(storedStatement, statements, voidedStatementIds);
        }

        return new Response(null, {
          status: 204,
          headers: createHeaders(version),
        });
      }

      if (request.method === "GET" || request.method === "HEAD") {
        const validationError = validateStatementQuery(url);
        if (validationError) {
          return new Response(JSON.stringify({ error: validationError }), {
            status: 400,
            headers: createHeaders(version),
          });
        }

        const format = url.searchParams.get("format");
        const acceptLanguage = request.headers.get("accept-language");
        const includeAttachments = readBooleanQueryValue(url.searchParams.get("attachments"));

        const statementId = url.searchParams.get("statementId");
        if (statementId) {
          if (voidedStatementIds.has(statementId)) {
            return new Response(JSON.stringify({ error: "statement not found" }), {
              status: 404,
              headers: createHeaders(version),
            });
          }

          const statement = statements.get(statementId);
          if (!statement) {
            return new Response(JSON.stringify({ error: "statement not found" }), {
              status: 404,
              headers: createHeaders(version),
            });
          }

          const response = buildStatementResponse(statement, version, {
            format,
            acceptLanguage,
            includeAttachments,
          });

          return request.method === "HEAD" ? withoutBody(response) : response;
        }

        const voidedStatementId = url.searchParams.get("voidedStatementId");
        if (voidedStatementId) {
          if (!voidedStatementIds.has(voidedStatementId)) {
            return new Response(JSON.stringify({ error: "statement not found" }), {
              status: 404,
              headers: createHeaders(version),
            });
          }

          const statement = statements.get(voidedStatementId);
          if (!statement) {
            return new Response(JSON.stringify({ error: "statement not found" }), {
              status: 404,
              headers: createHeaders(version),
            });
          }

          const response = buildStatementResponse(statement, version, {
            format,
            acceptLanguage,
            includeAttachments,
          });

          return request.method === "HEAD" ? withoutBody(response) : response;
        }

        const ascending = readBooleanQueryValue(url.searchParams.get("ascending"));
        const limit = url.searchParams.get("limit");

        let resultStatements = [...statements.values()]
          .filter((statement) => !voidedStatementIds.has(statement.id) || statement.isVoiding)
          .filter((statement) => matchesCollectionStatementQuery(statement, url))
          .sort((left, right) => (ascending ? left.storedAtMs - right.storedAtMs : right.storedAtMs - left.storedAtMs));

        if (limit !== null && Number(limit) > 0) {
          resultStatements = resultStatements.slice(0, Number(limit));
        }

        const response = buildStatementResultResponse(resultStatements, version, {
          format,
          acceptLanguage,
          includeAttachments,
        });

        return request.method === "HEAD" ? withoutBody(response) : response;
      }

      return new Response(JSON.stringify({ error: "method not allowed" }), {
        status: 405,
        headers: createHeaders(version),
      });
    },
  });

  return {
    baseUrl: `http://127.0.0.1:${server.port}/xapi`,
    requests,
    stop() {
      void server.stop(true);
    },
  };
}
