import type { JsonObject } from "../domain/contracts";

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

function isValidStatement(value: unknown): value is JsonObject {
  return hasRequiredStatementFields(value) && !containsDisallowedNull(value);
}

function buildStateDocumentKey(url: URL): string | undefined {
  const activityId = url.searchParams.get("activityId");
  const agent = url.searchParams.get("agent");
  const stateId = url.searchParams.get("stateId");

  if (!activityId || !agent || !stateId) {
    return undefined;
  }

  return `${activityId}::${agent}::${stateId}`;
}

export function startMockLrs(version = "2.0.0"): MockLrsHandle {
  const requests: RecordedRequest[] = [];
  const statements = new Map<string, JsonObject>();
  const stateDocuments = new Map<string, unknown>();

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
        const stateKey = buildStateDocumentKey(url);
        if (!stateKey) {
          return new Response(JSON.stringify({ error: "activityId, agent, and stateId are required" }), {
            status: 400,
            headers: createHeaders(version),
          });
        }

        if (request.method === "PUT" || request.method === "POST") {
          stateDocuments.set(stateKey, await request.json());
          return new Response(null, {
            status: 204,
            headers: createHeaders(version),
          });
        }

        if (request.method === "GET") {
          const document = stateDocuments.get(stateKey);
          if (document === undefined) {
            return new Response(JSON.stringify({ error: "state document not found" }), {
              status: 404,
              headers: createHeaders(version),
            });
          }

          return new Response(JSON.stringify(document), {
            status: 200,
            headers: createHeaders(version),
          });
        }

        if (request.method === "DELETE") {
          stateDocuments.delete(stateKey);
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

      if (url.pathname !== "/xapi/statements") {
        return new Response(JSON.stringify({ error: "not found" }), {
          status: 404,
          headers: createHeaders(version),
        });
      }

      if (request.method === "POST") {
        const body = await request.json();
        if (!isValidStatement(body)) {
          return new Response(JSON.stringify({ error: "invalid statement" }), {
            status: 400,
            headers: createHeaders(version),
          });
        }

        const statementId = typeof body.id === "string" ? body.id : crypto.randomUUID();
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
