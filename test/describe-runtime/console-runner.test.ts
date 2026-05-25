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

const silentLogger = {
  log: (..._args: unknown[]) => {},
  error: (..._args: unknown[]) => {},
};

function createNowSequence(sequence: number[]): () => number {
  return () => sequence.shift() ?? 0;
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

const languageTagPattern =
  /^[A-Za-z]{2,3}(?:-[A-Za-z]{4})?(?:-(?:[A-Za-z]{2}|\d{3}))?(?:-(?:[A-Za-z0-9]{5,8}|\d[A-Za-z0-9]{3}))*$/;
const allowedVersionPattern = /^(?:1\.0(?:\.\d+)?|2\.0\.0)$/;
const isoDurationPattern =
  /^P(?=.)(?:\d+(?:\.\d+)?W|(?:(?:\d+(?:\.\d+)?Y)?(?:\d+(?:\.\d+)?M)?(?:\d+(?:\.\d+)?D)?(?:T(?=\d)(?:\d+(?:\.\d+)?H)?(?:\d+(?:\.\d+)?M)?(?:\d+(?:\.\d+)?S)?)?))$/;

const interactionComponentParents = new Set(["choices", "scale", "source", "target", "steps"]);

const isoTimestampPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

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
  return isoTimestampPattern.test(value) && !Number.isNaN(Date.parse(value));
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

function isAgentQueryValid(value: string | null): boolean {
  if (typeof value !== "string") {
    return false;
  }

  try {
    const parsed = JSON.parse(value) as { objectType?: string };
    return isObjectRecord(parsed) && parsed.objectType === "Agent";
  } catch {
    return false;
  }
}

function validateStatementQuery(searchParams: URLSearchParams): number | undefined {
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

  return undefined;
}

function validateStateResourceQuery(searchParams: URLSearchParams): number {
  if (searchParams.has("activityId") && !hasScheme(searchParams.get("activityId"))) {
    return 400;
  }

  if (searchParams.has("stateId") && !isUuidLike(searchParams.get("stateId"))) {
    return 400;
  }

  if (searchParams.has("agent") && !isAgentQueryValid(searchParams.get("agent"))) {
    return 400;
  }

  return 200;
}

function validateActivityProfileQuery(searchParams: URLSearchParams): number {
  if (searchParams.has("activityId") && !hasScheme(searchParams.get("activityId"))) {
    return 400;
  }

  if (searchParams.has("profileId") && !isUuidLike(searchParams.get("profileId"))) {
    return 400;
  }

  if (searchParams.has("agent") && !isAgentQueryValid(searchParams.get("agent"))) {
    return 400;
  }

  return 200;
}

function validateAgentProfileQuery(searchParams: URLSearchParams): number {
  if (searchParams.has("profileId") && !isUuidLike(searchParams.get("profileId"))) {
    return 400;
  }

  if (searchParams.has("agent") && !isAgentQueryValid(searchParams.get("agent"))) {
    return 400;
  }

  return 200;
}

function startMockLrs() {
  const requests: CapturedRequest[] = [];
  const storedStatements = new Map<string, Record<string, unknown>>();

  const server = Bun.serve({
    port: 0,
    async fetch(request) {
      const url = new URL(request.url);
      const requestText = await request.text();
      const body = requestText.length > 0 ? (JSON.parse(requestText) as unknown) : undefined;

      requests.push({
        body,
        method: request.method,
        path: url.pathname,
        query: url.search,
        version: request.headers.get("X-Experience-API-Version"),
      });

      if (request.method === "POST" && url.pathname === "/xapi/statements") {
        const status = determineStatementStatus(body);
        if (status === 200 && isObjectRecord(body)) {
          const statementId = typeof body.id === "string" ? body.id : crypto.randomUUID();
          storedStatements.set(statementId, {
            ...body,
            id: statementId,
            stored: createStoredTimestamp(),
          });

          return Response.json([statementId], { status });
        }

        return Response.json({ ok: false }, { status });
      }

      if (request.method === "PUT" && url.pathname === "/xapi/statements") {
        const statementId = url.searchParams.get("statementId");
        if (typeof statementId !== "string" || !isUuidLike(statementId)) {
          return Response.json({ ok: false }, { status: 400 });
        }

        const status = determineStatementStatus(body);
        if (status === 200 && isObjectRecord(body)) {
          storedStatements.set(statementId, {
            ...body,
            id: statementId,
            stored: createStoredTimestamp(),
          });

          return new Response(null, { status: 204 });
        }

        return Response.json({ ok: false }, { status });
      }

      if (request.method === "GET" && url.pathname === "/xapi/statements") {
        const validationStatus = validateStatementQuery(url.searchParams);
        if (validationStatus) {
          return Response.json({ ok: false }, { status: validationStatus });
        }

        const statementId = url.searchParams.get("statementId");
        if (statementId) {
          const storedStatement = storedStatements.get(statementId);
          if (storedStatement) {
            return Response.json(storedStatement, { status: 200 });
          }

          return Response.json({ ok: false }, { status: 404 });
        }

        return Response.json({ statements: Array.from(storedStatements.values()) }, { status: 200 });
      }

      if (url.pathname === "/xapi/activities/state") {
        return Response.json({ ok: true }, { status: validateStateResourceQuery(url.searchParams) });
      }

      if (url.pathname === "/xapi/agents/profile") {
        return Response.json({ ok: true }, { status: validateAgentProfileQuery(url.searchParams) });
      }

      if (url.pathname === "/xapi/activities/profile") {
        return Response.json({ ok: true }, { status: validateActivityProfileQuery(url.searchParams) });
      }

      return new Response("Not found", { status: 404 });
    },
  });

  return {
    endpoint: `http://127.0.0.1:${server.port}/xapi`,
    requests,
    server,
  };
}

describe("console runner entrypoint", () => {
  test("runs the v2 formatting slice end to end and writes an upstream-style log", async () => {
    const harness = startMockLrs();
    const logDirectory = join(import.meta.dir, "..", "..", "tmp", "agents", crypto.randomUUID());

    try {
      const execution = await runConsoleRunnerArgv(["--endpoint", harness.endpoint], {
        createUuid: () => "run-v2",
        logDirectory,
        logger: silentLogger,
        now: createNowSequence([100, 160]),
      });

      expect(execution.normalizedOptions.xapiVersion).toBe("2.0.0");
      expect(execution.runRecord.summary).toEqual({
        total: 784,
        passed: 784,
        failed: 0,
        version: "2.0.0",
      });
      expect(
        harness.requests.filter((request) => request.path === "/xapi/statements" && request.method === "POST"),
      ).toHaveLength(766);
      expect(
        harness.requests.filter((request) => request.path === "/xapi/statements" && request.method === "PUT"),
      ).toHaveLength(12);
      expect(
        harness.requests.filter((request) => request.path === "/xapi/statements" && request.method === "GET"),
      ).toHaveLength(13);
      expect(harness.requests.every((request) => request.version === "2.0.0")).toBe(true);

      const writtenRecord = JSON.parse(readFileSync(join(logDirectory, "run-v2.log"), "utf8")) as {
        log: { tests: Array<{ title: string; tests: Array<{ title: string }> }> };
        summary: { failed: number; passed: number; total: number; version: string };
      };

      expect(writtenRecord.summary).toEqual({
        total: 784,
        passed: 784,
        failed: 0,
        version: "2.0.0",
      });
      expect(writtenRecord.log.tests.map((suite) => suite.title)).toEqual([
        "Formatting Requirements (Data 2.2)",
        "Id Property Requirements (Data 2.4.1)",
        "Timestamp Property Requirements (Data 2.4.7)",
        "Stored Property Requirements (Data 2.4.8)",
        "Verb Property Requirements (Data 2.4.3)",
        "Version Property Requirements (Data 2.4.10)",
        "Result Property Requirements (Data 2.4.5)",
        "Actor Property Requirements (Data 2.4.2)",
        "Object Property Requirements (Data 2.4.4)",
      ]);
      expect(writtenRecord.log.tests[0]?.tests.map((suite) => suite.title)).toEqual([
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
        "All Objects are well-created JSON Objects (Nature of binding, Data 2.1, XAPI-00014) **Implicit**",
        "An LRS rejects with error code 400 Bad Request a Statement containing IRL or IRI values without a scheme. (Data 2.2.s4.b1.b8, XAPI-00011)",
        "The LRS rejects with error code 400 Bad Request parameter values which do not validate to the same standards required for values of the same types in Statements (Data 2.2.s4.b4, XAPI-00012)",
      ]);
      expect(writtenRecord.log.tests[1]?.tests.map((suite) => suite.title)).toEqual([
        'An LRS generates the "id" property of a Statement if none is provided (Modify, Data 2.4.1.s2.b1, XAPI-00026)',
      ]);
      expect(writtenRecord.log.tests[2]?.tests.map((suite) => suite.title)).toEqual([
        'A "timestamp" property is a TimeStamp (Type, Data 2.4.7, Data 2.4.s1.table1.row7, XAPI-00022)',
      ]);
      expect(writtenRecord.log.tests[3]?.tests.map((suite) => suite.title)).toEqual([
        "An LRS MUST accept statements with the stored property (Data 2.4.8.s3.b2, XAPI-00097)",
        "A stored property must be a TimeStamp (Data 2.4.8.s2, XAPI-00023)",
      ]);
      expect(writtenRecord.log.tests[4]?.tests.map((suite) => suite.title)).toEqual([
        'A "verb" property contains an "id" property (Multiplicity, Data 2.4.3.s3.table1.row1, XAPI-00044)',
        'A "verb" property\'s "id" property is an IRI (Type, Data 2.4.3.s3.table1.row1, XAPI-00044)',
        'A "verb" property\'s "display" property is a Language Map (Type, Data 2.4.3.s3.table1.row2, XAPI-00045)',
      ]);
      expect(writtenRecord.log.tests[5]?.tests.map((suite) => suite.title)).toEqual([
        'An LRS rejects with error code 400 Bad Request, a Request which uses "version" and has the value set to anything but "1.0" or "1.0.x", where x is the semantic versioning number (Format, Data 2.4.10.s2.b1, Data 2.4.10.s3.b1, Communication 3.3.s3.b3, Communication 3.3.s3.b6, XAPI-00101)',
        "Statements returned by an LRS MUST retain the version property they are accepted with (Format, Data 2.4.10, XAPI-00332)",
      ]);
      expect(writtenRecord.log.tests[6]?.tests.map((suite) => suite.title)).toEqual([
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
    const harness = startMockLrs();
    const logDirectory = join(import.meta.dir, "..", "..", "tmp", "agents", crypto.randomUUID());

    try {
      const execution = await runConsoleRunnerArgv(["-e", harness.endpoint, "-x", "1.0.3"], {
        createUuid: () => "run-v103",
        logDirectory,
        logger: silentLogger,
        now: createNowSequence([200, 250]),
      });

      expect(execution.normalizedOptions.xapiVersion).toBe("1.0.3");
      expect(execution.runRecord.summary).toEqual({
        total: 784,
        passed: 784,
        failed: 0,
        version: "1.0.3",
      });
      expect(harness.requests).toHaveLength(791);
      expect(harness.requests.every((request) => request.version === "1.0.3")).toBe(true);

      const writtenRecord = JSON.parse(readFileSync(join(logDirectory, "run-v103.log"), "utf8")) as {
        summary: { failed: number; passed: number; total: number; version: string };
      };

      expect(writtenRecord.summary).toEqual({
        total: 784,
        passed: 784,
        failed: 0,
        version: "1.0.3",
      });
    } finally {
      await harness.server.stop(true);
    }
  });

  test("runs the Parameters slice alongside v2_0 through directory selection", async () => {
    const harness = startMockLrs();
    const logDirectory = join(import.meta.dir, "..", "..", "tmp", "agents", crypto.randomUUID());

    try {
      const execution = await runConsoleRunnerArgv(["--endpoint", harness.endpoint, "--directory", "Parameters,v2_0"], {
        createUuid: () => "run-parameters-v2",
        logDirectory,
        logger: silentLogger,
        now: createNowSequence([300, 360]),
      });

      expect(execution.normalizedOptions.directory).toEqual(["Parameters", "v2_0"]);
      expect(execution.normalizedOptions.xapiVersion).toBe("2.0.0");
      expect(execution.runRecord.summary).toEqual({
        total: 812,
        passed: 812,
        failed: 0,
        version: "2.0.0",
      });
      expect(harness.requests.filter((request) => request.path === "/xapi/statements")).toHaveLength(791);
      expect(harness.requests.filter((request) => request.path === "/xapi/activities/state")).toHaveLength(13);
      expect(harness.requests.filter((request) => request.path === "/xapi/agents/profile")).toHaveLength(6);
      expect(harness.requests.filter((request) => request.path === "/xapi/activities/profile")).toHaveLength(9);
      expect(harness.requests.every((request) => request.version === "2.0.0")).toBe(true);

      const writtenRecord = JSON.parse(readFileSync(join(logDirectory, "run-parameters-v2.log"), "utf8")) as {
        summary: { failed: number; passed: number; total: number; version: string };
      };

      expect(writtenRecord.summary).toEqual({
        total: 812,
        passed: 812,
        failed: 0,
        version: "2.0.0",
      });
    } finally {
      await harness.server.stop(true);
    }
  });

  test("runs the Multiplicity slice alongside v2_0 without adding HTTP traffic", async () => {
    const harness = startMockLrs();
    const logDirectory = join(import.meta.dir, "..", "..", "tmp", "agents", crypto.randomUUID());

    try {
      const execution = await runConsoleRunnerArgv(
        ["--endpoint", harness.endpoint, "--directory", "Multiplicity,v2_0"],
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
        total: 866,
        passed: 866,
        failed: 0,
        version: "2.0.0",
      });
      expect(harness.requests.filter((request) => request.path === "/xapi/statements")).toHaveLength(791);
      expect(harness.requests.filter((request) => request.path !== "/xapi/statements")).toHaveLength(0);

      const writtenRecord = JSON.parse(readFileSync(join(logDirectory, "run-multiplicity-v2.log"), "utf8")) as {
        log: { tests: Array<{ title: string }> };
        summary: { failed: number; passed: number; total: number; version: string };
      };

      expect(writtenRecord.summary).toEqual({
        total: 866,
        passed: 866,
        failed: 0,
        version: "2.0.0",
      });
      expect(writtenRecord.log.tests.map((suite) => suite.title)).toEqual([
        "Welcome to Multiplicity Testing.  A Statement, Object or Verb's properties are used at most one time",
        "Formatting Requirements (Data 2.2)",
        "Id Property Requirements (Data 2.4.1)",
        "Timestamp Property Requirements (Data 2.4.7)",
        "Stored Property Requirements (Data 2.4.8)",
        "Verb Property Requirements (Data 2.4.3)",
        "Version Property Requirements (Data 2.4.10)",
        "Result Property Requirements (Data 2.4.5)",
        "Actor Property Requirements (Data 2.4.2)",
        "Object Property Requirements (Data 2.4.4)",
      ]);
    } finally {
      await harness.server.stop(true);
    }
  });
});
