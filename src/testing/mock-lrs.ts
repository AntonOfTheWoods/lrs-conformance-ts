import type { JsonObject } from "../domain/contracts";

interface StoredDocument {
  id: string;
  contextKey: string;
  body: unknown;
  mediaType: string;
  storedAt: number;
}

const populatedAuthorityAccountHomePage = "https://example.test/xapi/auth/basic";

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

function createHeaders(version: string, contentType = "application/json"): Headers {
  return new Headers({
    "content-type": contentType,
    "x-experience-api-version": version,
    "x-experience-api-consistent-through": new Date().toISOString(),
  });
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

function validateVerb(value: unknown): string | undefined {
  if (!isJsonObject(value) || typeof value.id !== "string" || !hasUriScheme(value.id)) {
    return "verb id must be an IRI";
  }

  return undefined;
}

function validateAccount(value: unknown): string | undefined {
  if (!isJsonObject(value)) {
    return "account must be an object";
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

    return decoded.slice(0, separatorIndex);
  } catch {
    return undefined;
  }
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

  if (value.instructor !== undefined) {
    const instructorError = validateActorLike(value.instructor);
    if (instructorError) {
      return instructorError;
    }
  }

  if (value.team !== undefined) {
    const teamError = validateActorLike(value.team);
    if (teamError) {
      return teamError;
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

    if (typeof attachment.usageType !== "string" || !hasUriScheme(attachment.usageType)) {
      return "attachment usageType must be an IRI";
    }

    const fileUrl = attachment.fileUrl;
    if (fileUrl !== undefined && (typeof fileUrl !== "string" || !hasUriScheme(fileUrl))) {
      return "attachment fileUrl must be an IRI";
    }
  }

  return undefined;
}

function validateActivityObject(value: JsonObject): string | undefined {
  const objectId = value.id;
  if (typeof objectId !== "string" || !hasUriScheme(objectId)) {
    return "object id must be an IRI";
  }

  const definition = value.definition;
  if (definition !== undefined) {
    if (!isJsonObject(definition)) {
      return "object definition must be an object";
    }

    const type = definition.type;
    if (type !== undefined && (typeof type !== "string" || !hasUriScheme(type))) {
      return "object definition type must be an IRI";
    }

    const moreInfo = definition.moreInfo;
    if (moreInfo !== undefined && (typeof moreInfo !== "string" || !hasUriScheme(moreInfo))) {
      return "object definition moreInfo must be an IRI";
    }
  }

  return undefined;
}

function validateStatementLike(value: JsonObject, requireId: boolean): string | undefined {
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
  }

  if (value.attachments !== undefined) {
    const attachmentsError = validateAttachments(value.attachments);
    if (attachmentsError) {
      return attachmentsError;
    }
  }

  const result = value.result;
  if (result !== undefined) {
    if (!isJsonObject(result)) {
      return "result must be an object";
    }

    if (result.success !== undefined && typeof result.success !== "boolean") {
      return "result.success must be a boolean";
    }

    if (result.completion !== undefined && typeof result.completion !== "boolean") {
      return "result.completion must be a boolean";
    }

    const score = result.score;
    if (score !== undefined) {
      if (!isJsonObject(score)) {
        return "result.score must be an object";
      }

      for (const field of ["scaled", "raw", "min", "max"] as const) {
        const scoreValue = score[field];
        if (scoreValue !== undefined && !isFiniteNumber(scoreValue)) {
          return `result.score.${field} must be a number`;
        }
      }
    }
  }

  return undefined;
}

function validateSubStatement(value: JsonObject): string | undefined {
  if (!["actor", "verb", "object"].every((key) => key in value)) {
    return "substatement must include actor, verb, and object";
  }

  return validateStatementLike(value, false);
}

function validateObject(value: unknown): string | undefined {
  if (!isJsonObject(value)) {
    return "object must be an object";
  }

  const objectType = value.objectType;
  if (objectType === "SubStatement") {
    return validateSubStatement(value);
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

function validateStatementQuery(url: URL): string | undefined {
  const statementId = url.searchParams.get("statementId");
  if (statementId && !isUuid(statementId)) {
    return "statementId must be a UUID";
  }

  const voidedStatementId = url.searchParams.get("voidedStatementId");
  if (voidedStatementId && !isUuid(voidedStatementId)) {
    return "voidedStatementId must be a UUID";
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

  return undefined;
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

  return new Response(body, {
    status: 200,
    headers: createHeaders(version, document.mediaType),
  });
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
  const contextKey = buildContextKey(url, options.requiredParams);
  if (!contextKey) {
    return new Response(JSON.stringify({ error: `${options.requiredParams.join(", ")} are required` }), {
      status: 400,
      headers: createHeaders(version),
    });
  }

  const documentId = url.searchParams.get(options.idParam);
  const since = url.searchParams.get("since");

  if (request.method === "PUT" || request.method === "POST") {
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

    let bodyToStore = nextBody;
    let mediaTypeToStore = nextMediaType;
    if (request.method === "POST" && existing) {
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

  if (request.method === "GET") {
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

      return new Response(JSON.stringify(listDocumentIds(store, contextKey, sinceTimestamp)), {
        status: 200,
        headers: createHeaders(version),
      });
    }

    const document = store.get(buildDocumentKey(contextKey, documentId));
    if (!document) {
      return new Response(JSON.stringify({ error: "document not found" }), {
        status: 404,
        headers: createHeaders(version),
      });
    }

    return buildStoredDocumentResponse(document, version);
  }

  if (request.method === "DELETE") {
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

export function startMockLrs(version = "2.0.0"): MockLrsHandle {
  const requests: RecordedRequest[] = [];
  const statements = new Map<string, JsonObject>();
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
        const body = populateAuthorityFromRequest(await request.json(), request);
        const validationError = validateStatementBody(body);
        if (validationError) {
          return new Response(JSON.stringify({ error: validationError }), {
            status: 400,
            headers: createHeaders(version),
          });
        }

        if (!isJsonObject(body) || typeof body.id !== "string") {
          return new Response(JSON.stringify({ error: "statement id must be a UUID" }), {
            status: 400,
            headers: createHeaders(version),
          });
        }

        const statementId = body.id;
        statements.set(statementId, {
          ...body,
          id: statementId,
        });

        return new Response(JSON.stringify({ id: statementId }), {
          status: 200,
          headers: createHeaders(version),
        });
      }

      if (request.method === "GET") {
        const validationError = validateStatementQuery(url);
        if (validationError) {
          return new Response(JSON.stringify({ error: validationError }), {
            status: 400,
            headers: createHeaders(version),
          });
        }

        const statementId = url.searchParams.get("statementId");
        if (!statementId) {
          return new Response(JSON.stringify({ error: "statementId is required" }), {
            status: 400,
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

        return new Response(JSON.stringify(statement), {
          status: 200,
          headers: createHeaders(version),
        });
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
