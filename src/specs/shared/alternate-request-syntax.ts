import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";
import type { JsonObject } from "../../describe-runtime/templates.ts";

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function buildEndpointUrl(context: DescribeRuntimeContext, path: string, query?: Record<string, unknown>): string {
  const base = context.options.endpoint.replace(/\/+$/, "");
  const queryString = query ? context.getUrlEncoding(query) : "";
  return `${base}${path}${queryString.length > 0 ? `?${queryString}` : ""}`;
}

async function createStatement(context: DescribeRuntimeContext, name: string): Promise<JsonObject> {
  const payload = await context.createFromTemplate([{ statement: "{{statements.default}}" }]);
  const statement = payload.statement;
  if (!isJsonObject(statement)) {
    throw new Error(`Expected ${name} to create a statement object.`);
  }

  return structuredClone(statement);
}

function buildRawHeaders(
  context: DescribeRuntimeContext,
  options: {
    includeAuthorization?: boolean;
    includeVersion?: boolean;
    headers?: Record<string, string>;
  } = {},
): Record<string, string> {
  const headers = context.addAllHeaders(options.headers ?? {});
  if (options.includeAuthorization === false) {
    delete headers.Authorization;
  }
  if (options.includeVersion === false) {
    delete headers["X-Experience-API-Version"];
  }

  return headers;
}

async function sendAlternateRequest(
  context: DescribeRuntimeContext,
  request: {
    body?: Record<string, unknown> | string;
    expectedStatus: number;
    headers?: Record<string, string>;
    includeAuthorization?: boolean;
    includeVersion?: boolean;
    method?: "POST" | "PUT";
    name: string;
    query: Record<string, unknown>;
  },
): Promise<Response> {
  const headers = buildRawHeaders(context, {
    includeAuthorization: request.includeAuthorization,
    includeVersion: request.includeVersion,
    headers: request.headers,
  });
  const bodyText =
    typeof request.body === "undefined"
      ? undefined
      : typeof request.body === "string"
        ? request.body
        : context.getUrlEncoding(request.body);
  const response = await fetch(buildEndpointUrl(context, context.getEndpointStatements(), request.query), {
    method: request.method ?? "POST",
    headers,
    body: bodyText,
  });

  if (response.status !== request.expectedStatus) {
    throw new Error(`Expected ${request.name} to return ${request.expectedStatus}, received ${response.status}.`);
  }

  return response;
}

export function registerAlternateRequestSyntaxRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  runtime.describe("Alternate Request Syntax Requirements (Communication 1.3)", () => {
    runtime.describe("The LRS MUST support the Alternate Request Syntax (Communication 1.3.s3.b15, XAPI-00336)", () => {
      runtime.it(
        "An LRS accepts a valid POST request containing a GET request returning 200 OK and the StatementResult Object. (Communication 1.3, Communication 2.1.2.s2.b3, XAPI-00148)",
        async () => {
          const response = await sendAlternateRequest(context, {
            body: { limit: 1 },
            expectedStatus: 200,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            name: "Alternate request syntax GET",
            query: { method: "GET" },
          });
          const parsed = JSON.parse(await response.text()) as unknown;
          if (!isJsonObject(parsed) || !Array.isArray(parsed.statements) || typeof parsed.more !== "string") {
            throw new Error("Expected alternate request syntax GET to return a StatementResult object.");
          }
        },
      );

      runtime.it("An LRS rejects an alternate request syntax not issued as a POST", async () => {
        const statement = await createStatement(context, "Alternate request syntax non-POST");
        await sendAlternateRequest(context, {
          body: {
            content: JSON.stringify(statement),
            statementId: context.generateUuid(),
          },
          expectedStatus: 400,
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          method: "PUT",
          name: "Alternate request syntax non-POST",
          query: { method: "POST" },
        });
      });

      runtime.it("An LRS accepts an alternate request syntax PUT issued as a POST", async () => {
        const statement = await createStatement(context, "Alternate request syntax PUT");
        await sendAlternateRequest(context, {
          body: {
            content: JSON.stringify(statement),
            statementId: context.generateUuid(),
          },
          expectedStatus: 204,
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          name: "Alternate request syntax PUT",
          query: { method: "PUT" },
        });
      });

      runtime.it(
        "During an alternate request syntax the LRS treats the listed form parameters, 'Authorization', 'X-Experience-API-Version', 'Content-Type', 'Content-Length', 'If-Match' and 'If-None-Match', as header parameters (Communictation 1.3.s3.b7)",
        async () => {
          const statement = await createStatement(context, "Alternate request syntax form headers");
          await sendAlternateRequest(context, {
            body: {
              content: JSON.stringify(statement),
              statementId: context.generateUuid(),
              "X-Experience-API-Version": "0.8",
            },
            expectedStatus: 400,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            includeVersion: false,
            name: "Alternate request syntax form headers",
            query: { method: "PUT" },
          });
        },
      );

      runtime.it(
        "An LRS will reject an alternate request syntax which contains any extra information with error code 400 Bad Request (Communication 1.3.s3.b4)",
        async () => {
          const statementId = context.generateUuid();
          const statement = await createStatement(context, "Alternate request syntax extra information");
          await sendAlternateRequest(context, {
            body: {
              content: JSON.stringify(statement),
              statementId,
            },
            expectedStatus: 400,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            name: "Alternate request syntax extra information",
            query: { method: "PUT", statementId },
          });
        },
      );

      runtime.describe(
        'An LRS will reject an alternate request syntax sending content which does not have a form parameter with the name of "content" (Communication 1.3.s3.b4)',
        () => {
          runtime.it("will pass PUT with content body which is url encoded", async () => {
            const statement = await createStatement(context, "Alternate request syntax url encoded body");
            const authorization = context.addAllHeaders({}).Authorization;
            if (typeof authorization !== "string") {
              throw new Error("Expected alternate request syntax suite to have an authorization header.");
            }

            await sendAlternateRequest(context, {
              body: {
                Authorization: authorization,
                content: JSON.stringify(statement),
                statementId: context.generateUuid(),
                "X-Experience-API-Version": context.options.xapiVersion,
              },
              expectedStatus: 204,
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              includeAuthorization: false,
              includeVersion: false,
              name: "Alternate request syntax url encoded body",
              query: { method: "PUT" },
            });
          });

          runtime.it("will fail PUT with no content body", async () => {
            await sendAlternateRequest(context, {
              expectedStatus: 400,
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              name: "Alternate request syntax missing content",
              query: { method: "PUT" },
            });
          });

          runtime.it("will fail PUT with content body which is not url encoded", async () => {
            const statement = await createStatement(context, "Alternate request syntax non-urlencoded content");
            const statementId = context.generateUuid();
            await sendAlternateRequest(context, {
              body: JSON.stringify({
                content: JSON.stringify(statement),
                statementId,
                "X-Experience-API-Version": context.options.xapiVersion,
              }),
              expectedStatus: 400,
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              name: "Alternate request syntax non-urlencoded content",
              query: { method: "PUT" },
            });
          });
        },
      );
    });
  });
}
