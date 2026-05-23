import type { JsonObject } from "../domain/contracts";

interface StoredDocument {
  id: string;
  contextKey: string;
  body: unknown;
  storedAt: number;
}

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

function createHeaders(version: string): Headers {
  return new Headers({
    "content-type": "application/json",
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

function validateStatementBody(value: unknown): string | undefined {
  if (!hasRequiredStatementFields(value)) {
    return "statement must include actor, verb, and object";
  }

  if (containsDisallowedNull(value)) {
    return "statement contains disallowed null values";
  }

  const statementId = value.id;
  if (typeof statementId !== "string" || !isUuid(statementId)) {
    return "statement id must be a UUID";
  }

  const verb = value.verb;
  if (!isJsonObject(verb) || typeof verb.id !== "string" || !hasUriScheme(verb.id)) {
    return "verb id must be an IRI";
  }

  const object = value.object;
  if (!isJsonObject(object) || typeof object.id !== "string" || !hasUriScheme(object.id)) {
    return "object id must be an IRI";
  }

  const definition = object.definition;
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

    const nextBody = await request.json();
    const documentKey = buildDocumentKey(contextKey, documentId);
    const existing = store.get(documentKey);

    let bodyToStore = nextBody;
    if (request.method === "POST" && existing) {
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
    }

    store.set(documentKey, {
      id: documentId,
      contextKey,
      body: bodyToStore,
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

    return new Response(JSON.stringify(document.body), {
      status: 200,
      headers: createHeaders(version),
    });
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
        const body = await request.json();
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
