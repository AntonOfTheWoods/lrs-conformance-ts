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

export function startMockLrs(version = "2.0.0"): MockLrsHandle {
  const requests: RecordedRequest[] = [];
  const statements = new Map<string, JsonObject>();

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

      if (url.pathname !== "/xapi/statements") {
        return new Response(JSON.stringify({ error: "not found" }), {
          status: 404,
          headers: createHeaders(version),
        });
      }

      if (request.method === "POST") {
        const body = await request.json();
        if (!hasRequiredStatementFields(body)) {
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