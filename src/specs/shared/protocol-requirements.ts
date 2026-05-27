import { Buffer } from "node:buffer";

import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext, JsonResponse } from "../../describe-runtime/suite-context.ts";
import type { JsonObject, JsonValue, TemplateLayer } from "../../describe-runtime/templates.ts";

const allowedModernVersionPattern = /^2\.0\.0$|^1\.0(\.[1-3])$/;
const allowedMissingVersionAboutResponsePattern = /^2\.0\.\d+$|^1\.0\.\d+$|^0?\.9\d*?$/;

type RawRequestOptions = {
  body?: JsonValue | string;
  badAuth?: boolean;
  headers?: Record<string, string>;
  includeVersionHeader?: boolean;
  method: "GET" | "HEAD" | "POST" | "PUT";
  path: string;
  query?: Record<string, unknown>;
  useDefaultHeaders?: boolean;
};

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function expectJsonObject(value: unknown, name: string): JsonObject {
  if (!isJsonObject(value)) {
    throw new Error(`Expected ${name} to be a JSON object.`);
  }

  return value;
}

function parseJsonObject(response: JsonResponse, name: string): JsonObject {
  return expectJsonObject(JSON.parse(response.bodyText) as unknown, name);
}

function expectStringArray(parent: JsonObject, key: string, name: string): string[] {
  const value = parent[key];
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string")) {
    throw new Error(`Expected ${name} ${key} to be an array of strings.`);
  }

  return value as string[];
}

function buildRequestTarget(context: DescribeRuntimeContext, path: string, query?: Record<string, unknown>): string {
  const baseEndpoint = context.options.endpoint.replace(/\/+$/, "");
  const queryString = query ? context.getUrlEncoding(query) : "";
  return queryString.length > 0 ? `${baseEndpoint}${path}?${queryString}` : `${baseEndpoint}${path}`;
}

async function sendRawRequest(context: DescribeRuntimeContext, request: RawRequestOptions): Promise<JsonResponse> {
  const headers =
    request.useDefaultHeaders === false
      ? { ...(request.headers ?? {}) }
      : context.addAllHeaders(request.headers ?? {}, request.badAuth ?? false);

  if (request.includeVersionHeader === false) {
    delete headers["X-Experience-API-Version"];
  } else if (request.useDefaultHeaders === false && typeof headers["X-Experience-API-Version"] === "undefined") {
    headers["X-Experience-API-Version"] = context.options.xapiVersion;
  }

  let bodyText: string | undefined;
  if (typeof request.body === "string") {
    bodyText = request.body;
  } else if (typeof request.body !== "undefined") {
    if (typeof headers["Content-Type"] === "undefined") {
      headers["Content-Type"] = "application/json";
    }
    bodyText = JSON.stringify(request.body);
  }

  const response = await fetch(buildRequestTarget(context, request.path, request.query), {
    method: request.method,
    headers,
    body: bodyText,
  });

  return {
    status: response.status,
    bodyText: await response.text(),
    headers: response.headers,
  };
}

async function sendWithoutVersionHeader(
  context: DescribeRuntimeContext,
  request: Omit<RawRequestOptions, "includeVersionHeader">,
  expectedStatus: number,
  name: string,
): Promise<JsonResponse> {
  const response = await sendRawRequest(context, {
    ...request,
    includeVersionHeader: false,
  });

  if (response.status !== expectedStatus) {
    throw new Error(`Expected ${name} to return ${expectedStatus}, received ${response.status}.`);
  }

  return response;
}

async function sendAndExpect(
  context: DescribeRuntimeContext,
  request: RawRequestOptions,
  expectedStatus: number,
  name: string,
): Promise<JsonResponse> {
  const response = await sendRawRequest(context, request);
  if (response.status !== expectedStatus) {
    throw new Error(`Expected ${name} to return ${expectedStatus}, received ${response.status}.`);
  }

  return response;
}

async function createTemplateStatement(
  context: DescribeRuntimeContext,
  layers: TemplateLayer[],
  name: string,
): Promise<JsonObject> {
  const payload = await context.createFromTemplate(layers);
  return structuredClone(expectJsonObject(payload.statement, name));
}

async function createDefaultStatement(context: DescribeRuntimeContext, name: string): Promise<JsonObject> {
  return createTemplateStatement(context, [{ statement: "{{statements.default}}" }], name);
}

async function postStatements(context: DescribeRuntimeContext, statements: JsonObject[], name: string): Promise<void> {
  const body = statements.length === 1 ? statements[0] : statements;
  const response = await context.sendRequest({
    method: "POST",
    path: context.getEndpointStatements(),
    body,
  });

  if (response.status !== 200) {
    throw new Error(`Expected ${name} to return 200, received ${response.status}.`);
  }
}

function expectVersionHeader(response: JsonResponse, expectedVersion: string, name: string): void {
  const actualVersion = response.headers.get("x-experience-api-version");
  if (actualVersion !== expectedVersion) {
    throw new Error(
      `Expected ${name} to include X-Experience-API-Version=${expectedVersion}, received ${actualVersion ?? "missing"}.`,
    );
  }
}

function expectVersionHeaderPattern(response: JsonResponse, pattern: RegExp, name: string): void {
  const actualVersion = response.headers.get("x-experience-api-version");
  if (!actualVersion || !pattern.test(actualVersion)) {
    throw new Error(
      `Expected ${name} to include X-Experience-API-Version matching ${pattern}, received ${actualVersion ?? "missing"}.`,
    );
  }
}

function expectHeadWithoutBody(response: JsonResponse, name: string): void {
  if (response.bodyText.length !== 0) {
    throw new Error(`Expected ${name} to return no message body.`);
  }
}

function createBasicAuthorizationHeader(context: DescribeRuntimeContext): Record<string, string> {
  if (!context.options.basicAuth) {
    return {};
  }

  const encodedCredentials = Buffer.from(
    `${context.options.authUser ?? ""}:${context.options.authPass ?? ""}`,
  ).toString("base64");

  return {
    Authorization: `Basic ${encodedCredentials}`,
  };
}

function createInvalidBasicAuthorizationHeader(userName: string, password: string): string {
  return `Basic ${Buffer.from(`${userName}:${password}`).toString("base64")}`;
}

function expectAllowedStatuses(response: JsonResponse, statuses: number[], name: string): void {
  if (!statuses.includes(response.status)) {
    throw new Error(`Expected ${name} to return one of ${statuses.join(", ")}, received ${response.status}.`);
  }
}

function requireBasicAuth(context: DescribeRuntimeContext): void {
  if (!context.options.basicAuth || !context.options.authUser || !context.options.authPass) {
    throw new Error("Authentication requirements need --basicAuth, --authUser, and --authPassword in this runtime.");
  }
}

export function registerAboutVersionHeaderExceptionCases(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  runtime.describe(
    'An LRS rejects with error code 400 Bad Request, a Request which does not use a "X-Experience-API-Version" header name to any Resource except the About Resource (multiplicity, Communication 2.8.s4.table1.row2, XAPI-00321)',
    () => {
      runtime.it("using Statement Endpoint", async () => {
        const response = await sendWithoutVersionHeader(
          context,
          {
            method: "GET",
            path: context.getEndpointStatements(),
            headers: createBasicAuthorizationHeader(context),
          },
          400,
          "About missing-version statement GET",
        );
        expectVersionHeaderPattern(
          response,
          allowedMissingVersionAboutResponsePattern,
          "About missing-version statement GET",
        );
      });

      for (const endpointCase of [
        { title: "using Activities Endpoint", path: context.getEndpointActivities() },
        { title: "using Activities Profile Endpoint", path: context.getEndpointActivitiesProfile() },
        { title: "using Activities State Endpoint", path: context.getEndpointActivitiesState() },
        { title: "using Agents Endpoint", path: context.getEndpointAgents() },
        { title: "using Agents Profile Endpoint", path: context.getEndpointAgentsProfile() },
      ]) {
        runtime.it(endpointCase.title, async () => {
          const response = await sendWithoutVersionHeader(
            context,
            {
              method: "GET",
              path: endpointCase.path,
              headers: createBasicAuthorizationHeader(context),
            },
            400,
            endpointCase.title,
          );
          expectVersionHeaderPattern(response, allowedMissingVersionAboutResponsePattern, endpointCase.title);
        });
      }
    },
  );
}

export function registerHeadRequestImplementationSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  runtime.describe("HEAD Request Implementation Requirements (Communication 1.1)", () => {
    runtime.describe("An LRS accepts HEAD requests (Communication 1.1, XAPI-00126)", () => {
      runtime.it("should succeed HEAD activities with no body", async () => {
        const statement = await createDefaultStatement(context, "HEAD activities statement");
        const activity = expectJsonObject(statement.object, "HEAD activities object");
        await postStatements(context, [statement], "HEAD activities setup");
        const response = await context.sendRequest({
          method: "HEAD",
          path: context.getEndpointActivities(),
          query: { activityId: activity.id },
        });
        if (response.status !== 200) {
          throw new Error(`Expected HEAD activities to return 200, received ${response.status}.`);
        }
      });

      runtime.it("should succeed HEAD activities profile with no body", async () => {
        const parameters = context.buildActivityProfile();
        const writeResponse = await context.sendRequest({
          method: "POST",
          path: context.getEndpointActivitiesProfile(),
          query: parameters,
          body: context.buildDocument(),
        });
        if (writeResponse.status !== 204) {
          throw new Error(`Expected HEAD activities profile setup to return 204, received ${writeResponse.status}.`);
        }
        const response = await context.sendRequest({
          method: "HEAD",
          path: context.getEndpointActivitiesProfile(),
          query: parameters,
        });
        if (response.status !== 200) {
          throw new Error(`Expected HEAD activities profile to return 200, received ${response.status}.`);
        }
      });

      runtime.it("should succeed HEAD activities state with no body", async () => {
        const parameters = context.buildState();
        const writeResponse = await context.sendRequest({
          method: "POST",
          path: context.getEndpointActivitiesState(),
          query: parameters,
          body: context.buildDocument(),
        });
        if (writeResponse.status !== 204) {
          throw new Error(`Expected HEAD activities state setup to return 204, received ${writeResponse.status}.`);
        }
        const response = await context.sendRequest({
          method: "HEAD",
          path: context.getEndpointActivitiesState(),
          query: parameters,
        });
        if (response.status !== 200) {
          throw new Error(`Expected HEAD activities state to return 200, received ${response.status}.`);
        }
      });

      runtime.it("should succeed HEAD agents with no body", async () => {
        const statement = await createDefaultStatement(context, "HEAD agents statement");
        const actor = expectJsonObject(statement.actor, "HEAD agents actor");
        await postStatements(context, [statement], "HEAD agents setup");
        const response = await context.sendRequest({
          method: "HEAD",
          path: context.getEndpointAgents(),
          query: { agent: actor },
        });
        if (response.status !== 200) {
          throw new Error(`Expected HEAD agents to return 200, received ${response.status}.`);
        }
      });

      runtime.it("should succeed HEAD agents profile with no body", async () => {
        const parameters = context.buildAgentProfile();
        const writeResponse = await context.sendRequest({
          method: "POST",
          path: context.getEndpointAgentsProfile(),
          query: parameters,
          body: context.buildDocument(),
        });
        if (writeResponse.status !== 204) {
          throw new Error(`Expected HEAD agents profile setup to return 204, received ${writeResponse.status}.`);
        }
        const response = await context.sendRequest({
          method: "HEAD",
          path: context.getEndpointAgentsProfile(),
          query: parameters,
        });
        if (response.status !== 200) {
          throw new Error(`Expected HEAD agents profile to return 200, received ${response.status}.`);
        }
      });

      runtime.it("should succeed HEAD statements with no body", async () => {
        const response = await context.sendRequest({
          method: "HEAD",
          path: context.getEndpointStatements(),
        });
        if (response.status !== 200) {
          throw new Error(`Expected HEAD statements to return 200, received ${response.status}.`);
        }
      });
    });

    runtime.describe(
      "An LRS responds to a HEAD request in the same way as a GET request, but without the message-body (Communication 1.1.s3.b1, XAPI-00125) **This means run ALL GET tests with HEAD**",
      () => {
        runtime.it("should succeed HEAD activities with no body", async () => {
          const statement = await createDefaultStatement(context, "HEAD activities no-body statement");
          const activity = expectJsonObject(statement.object, "HEAD activities no-body object");
          await postStatements(context, [statement], "HEAD activities no-body setup");
          const response = await context.sendRequest({
            method: "HEAD",
            path: context.getEndpointActivities(),
            query: { activityId: activity.id },
          });
          if (response.status !== 200) {
            throw new Error(`Expected HEAD activities no-body to return 200, received ${response.status}.`);
          }
          expectHeadWithoutBody(response, "HEAD activities no-body");
        });

        runtime.it("should succeed HEAD activities profile with no body", async () => {
          const parameters = context.buildActivityProfile();
          const writeResponse = await context.sendRequest({
            method: "POST",
            path: context.getEndpointActivitiesProfile(),
            query: parameters,
            body: context.buildDocument(),
          });
          if (writeResponse.status !== 204) {
            throw new Error(
              `Expected HEAD activities profile no-body setup to return 204, received ${writeResponse.status}.`,
            );
          }
          const response = await context.sendRequest({
            method: "HEAD",
            path: context.getEndpointActivitiesProfile(),
            query: parameters,
          });
          if (response.status !== 200) {
            throw new Error(`Expected HEAD activities profile no-body to return 200, received ${response.status}.`);
          }
          expectHeadWithoutBody(response, "HEAD activities profile no-body");
        });

        runtime.it("should succeed HEAD activities state with no body", async () => {
          const parameters = context.buildState();
          const writeResponse = await context.sendRequest({
            method: "POST",
            path: context.getEndpointActivitiesState(),
            query: parameters,
            body: context.buildDocument(),
          });
          if (writeResponse.status !== 204) {
            throw new Error(
              `Expected HEAD activities state no-body setup to return 204, received ${writeResponse.status}.`,
            );
          }
          const response = await context.sendRequest({
            method: "HEAD",
            path: context.getEndpointActivitiesState(),
            query: parameters,
          });
          if (response.status !== 200) {
            throw new Error(`Expected HEAD activities state no-body to return 200, received ${response.status}.`);
          }
          expectHeadWithoutBody(response, "HEAD activities state no-body");
        });

        runtime.it("should succeed HEAD agents with no body", async () => {
          const statement = await createDefaultStatement(context, "HEAD agents no-body statement");
          const actor = expectJsonObject(statement.actor, "HEAD agents no-body actor");
          await postStatements(context, [statement], "HEAD agents no-body setup");
          const response = await context.sendRequest({
            method: "HEAD",
            path: context.getEndpointAgents(),
            query: { agent: actor },
          });
          if (response.status !== 200) {
            throw new Error(`Expected HEAD agents no-body to return 200, received ${response.status}.`);
          }
          expectHeadWithoutBody(response, "HEAD agents no-body");
        });

        runtime.it("should succeed HEAD agents profile with no body", async () => {
          const parameters = context.buildAgentProfile();
          const writeResponse = await context.sendRequest({
            method: "POST",
            path: context.getEndpointAgentsProfile(),
            query: parameters,
            body: context.buildDocument(),
          });
          if (writeResponse.status !== 204) {
            throw new Error(
              `Expected HEAD agents profile no-body setup to return 204, received ${writeResponse.status}.`,
            );
          }
          const response = await context.sendRequest({
            method: "HEAD",
            path: context.getEndpointAgentsProfile(),
            query: parameters,
          });
          if (response.status !== 200) {
            throw new Error(`Expected HEAD agents profile no-body to return 200, received ${response.status}.`);
          }
          expectHeadWithoutBody(response, "HEAD agents profile no-body");
        });

        runtime.it("should succeed HEAD statements with no body", async () => {
          const statement = await createDefaultStatement(context, "HEAD statements no-body statement");
          await postStatements(context, [statement], "HEAD statements no-body setup");
          const response = await context.sendRequest({
            method: "HEAD",
            path: context.getEndpointStatements(),
          });
          if (response.status !== 200) {
            throw new Error(`Expected HEAD statements no-body to return 200, received ${response.status}.`);
          }
          expectHeadWithoutBody(response, "HEAD statements no-body");
        });
      },
    );

    runtime.it("An LRS accepts HEAD requests without Content-Length headers (Communication 1.1)", async () => {
      const response = await sendAndExpect(
        context,
        {
          method: "HEAD",
          path: context.getEndpointStatements(),
        },
        200,
        "HEAD without Content-Length",
      );
      expectHeadWithoutBody(response, "HEAD without Content-Length");
    });

    runtime.it("An LRS accepts GET requests without Content-Length headers (Communication 1.1)", async () => {
      await sendAndExpect(
        context,
        {
          method: "GET",
          path: context.getEndpointStatements(),
        },
        200,
        "GET without Content-Length",
      );
    });
  });
}

export function registerErrorCodesRequirementsSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  runtime.describe("Error Codes Requirements (Communication 3.2)", () => {
    runtime.it(
      "An LRS rejects with error code 400 Bad Request any request to an Resource which uses a parameter not recognized by the LRS (Communication 3.2.s2.b1, XAPI-00324)",
      async () => {
        const response = await context.sendRequest({
          method: "GET",
          path: context.getEndpointStatements(),
          query: { foo: "bar" },
        });

        if (response.status !== 400) {
          throw new Error(`Expected unrecognized statement parameter GET to return 400, received ${response.status}.`);
        }
      },
    );

    runtime.describe(
      "An LRS rejects with error code 400 Bad Request any request to an Resource which uses a parameter with differing case (Communication 3.2.s3.b8, XAPI-00325)",
      () => {
        runtime.it('should fail on PUT statement when not using "statementId"', async () => {
          const statement = await createDefaultStatement(context, "Error codes PUT case mismatch statement");
          const statementId = context.generateUuid();
          statement.id = statementId;

          const response = await context.sendRequest({
            method: "PUT",
            path: context.getEndpointStatements(),
            query: { StatementId: statementId },
            body: statement,
          });

          if (response.status !== 400) {
            throw new Error(`Expected PUT StatementId case mismatch to return 400, received ${response.status}.`);
          }
        });

        for (const queryCase of [
          {
            title: 'should fail on GET statement when not using "statementId"',
            query: { StatementId: context.generateUuid() },
          },
          {
            title: 'should fail on GET statement when not using "voidedStatementId"',
            query: { VoidedStatementId: context.generateUuid() },
          },
          {
            title: 'should fail on GET statement when not using "agent"',
            query: { Agent: { objectType: "Agent", mbox: "mailto:case-mismatch@example.com" } },
          },
          {
            title: 'should fail on GET statement when not using "verb"',
            query: { Verb: "http://adlnet.gov/expapi/verbs/attended" },
          },
          {
            title: 'should fail on GET statement when not using "activity"',
            query: { Activity: "http://www.example.com/meetings/occurances/34534" },
          },
          {
            title: 'should fail on GET statement when not using "registration"',
            query: { Registration: context.generateUuid() },
          },
          {
            title: 'should fail on GET statement when not using "related_activities"',
            query: { Related_Activities: true },
          },
          {
            title: 'should fail on GET statement when not using "related_agents"',
            query: { Related_Agents: true },
          },
          {
            title: 'should fail on GET statement when not using "since"',
            query: { Since: "2012-06-01T19:09:13.245Z" },
          },
          {
            title: 'should fail on GET statement when not using "until"',
            query: { Until: "2012-06-01T19:09:13.245Z" },
          },
          {
            title: 'should fail on GET statement when not using "limit"',
            query: { Limit: 10 },
          },
          {
            title: 'should fail on GET statement when not using "format"',
            query: { Format: "ids" },
          },
          {
            title: 'should fail on GET statement when not using "attachments"',
            query: { Attachments: true },
          },
          {
            title: 'should fail on GET statement when not using "ascending"',
            query: { Ascending: true },
          },
        ]) {
          runtime.it(queryCase.title, async () => {
            const response = await context.sendRequest({
              method: "GET",
              path: context.getEndpointStatements(),
              query: queryCase.query,
            });

            if (response.status !== 400) {
              throw new Error(`Expected ${queryCase.title} to return 400, received ${response.status}.`);
            }
          });
        }
      },
    );

    runtime.describe(
      "An LRS does not process any batch of Statements in which one or more Statements is rejected and if necessary, restores the LRS to the state in which it was before the batch began processing (Communication 3.2.s3.b9, XAPI-00326, **Implicit**)",
      () => {
        runtime.it("should not persist any statements on a single failure", async () => {
          const correct = await createDefaultStatement(context, "Error codes rollback correct statement");
          const incorrect = structuredClone(correct);
          const correctId = context.generateUuid();
          const incorrectId = context.generateUuid();
          correct.id = correctId;
          incorrect.id = incorrectId;

          const incorrectVerb = expectJsonObject(incorrect.verb, "Error codes rollback incorrect verb");
          incorrectVerb.id = "should fail";

          const postResponse = await context.sendRequest({
            method: "POST",
            path: context.getEndpointStatements(),
            body: [correct, incorrect],
          });
          if (postResponse.status !== 400) {
            throw new Error(`Expected invalid statement batch POST to return 400, received ${postResponse.status}.`);
          }

          const getResponse = await context.sendRequest({
            method: "GET",
            path: context.getEndpointStatements(),
            query: { statementId: correctId },
          });
          if (getResponse.status !== 404) {
            throw new Error(`Expected rejected batch rollback GET to return 404, received ${getResponse.status}.`);
          }
        });
      },
    );
  });
}

export function registerAuthenticationRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  runtime.describe("Authentication Requirements (Communication 4.0)", () => {
    runtime.describe(
      "An LRS rejects a Statement of bad authorization, either authentication needed or failed credentials, with error code 401 Unauthorized (Authentication, Communication 4.0, XAPI-00334)",
      () => {
        runtime.it("fails when given a random name pass pair", async () => {
          requireBasicAuth(context);

          const statement = await createDefaultStatement(context, "Authentication random credentials statement");
          const statementId = context.generateUuid();
          statement.id = statementId;
          const invalidAuthorization = createInvalidBasicAuthorizationHeader("RobCIsNot", "AUserOnThisLRS123");

          const putResponse = await sendRawRequest(context, {
            method: "PUT",
            path: context.getEndpointStatements(),
            query: { statementId },
            headers: { Authorization: invalidAuthorization },
            body: statement,
            useDefaultHeaders: false,
          });
          if (putResponse.status !== 401) {
            throw new Error(`Expected random basic auth PUT to return 401, received ${putResponse.status}.`);
          }

          const getResponse = await sendRawRequest(context, {
            method: "GET",
            path: context.getEndpointStatements(),
            headers: {
              Authorization: invalidAuthorization,
              "X-Experience-API-Version": "BAD",
            },
            useDefaultHeaders: false,
          });
          expectAllowedStatuses(getResponse, [400, 401], "random basic auth with invalid version header GET");
        });

        runtime.it("fails with a malformed header", async () => {
          requireBasicAuth(context);

          const statement = await createDefaultStatement(context, "Authentication malformed header statement");
          const statementId = context.generateUuid();
          statement.id = statementId;
          const malformedAuthorization = `Basic:${Buffer.from("RobCIsNot:AUserOnThisLRS").toString("base64")}`;

          const putResponse = await sendRawRequest(context, {
            method: "PUT",
            path: context.getEndpointStatements(),
            query: { statementId },
            headers: { Authorization: malformedAuthorization },
            body: statement,
            useDefaultHeaders: false,
          });
          if (putResponse.status !== 401) {
            throw new Error(`Expected malformed basic auth PUT to return 401, received ${putResponse.status}.`);
          }

          const getResponse = await sendRawRequest(context, {
            method: "GET",
            path: context.getEndpointStatements(),
            headers: {
              Authorization: malformedAuthorization,
              "X-Experience-API-Version": "BAD",
            },
            useDefaultHeaders: false,
          });
          expectAllowedStatuses(getResponse, [400, 401], "malformed basic auth with invalid version header GET");
        });
      },
    );

    runtime.it(
      "An LRS must support HTTP Basic Authentication (Authentication, Communication 4.0, XAPI-00335)",
      async () => {
        requireBasicAuth(context);

        const statement = await createDefaultStatement(context, "Authentication valid basic auth statement");
        const statementId = context.generateUuid();
        statement.id = statementId;

        const response = await context.sendRequest({
          method: "PUT",
          path: context.getEndpointStatements(),
          query: { statementId },
          body: statement,
        });

        if (response.status !== 204) {
          throw new Error(`Expected valid basic auth PUT to return 204, received ${response.status}.`);
        }
      },
    );
  });
}

export function registerVersioningRequirementsSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  runtime.describe("Versioning Requirements (Communication 3.3)", () => {
    runtime.it(
      'An LRS sends a header response with "X-Experience-API-Version" as the name and the latest patch version after "1.0.0" as the value (Format, Communication 3.3.s3.b1, Communication 3.3.s3.b2, XAPI-00333)',
      async () => {
        const statement = await createDefaultStatement(context, "Versioning header statement");
        const statementId = context.generateUuid();
        statement.id = statementId;
        await postStatements(context, [statement], "Versioning header setup");

        const response = await context.sendRequest({
          method: "GET",
          path: context.getEndpointStatements(),
          query: { statementId },
        });

        if (response.status !== 200) {
          throw new Error(`Expected Versioning response header GET to return 200, received ${response.status}.`);
        }
        expectVersionHeader(response, context.options.xapiVersion, "Versioning response header GET");
      },
    );

    runtime.describe(
      'An LRS will not modify Statements based on a "version" before "1.0.1" (Communication 3.3.s3.b4, XAPI-00330)',
      () => {
        runtime.it("should not convert newer version format to prior version format", async () => {
          const statement = await createDefaultStatement(context, "Versioning no-modify statement");
          const statementId = context.generateUuid();
          statement.id = statementId;
          await postStatements(context, [statement], "Versioning no-modify setup");

          const response = await context.sendRequest({
            method: "GET",
            path: context.getEndpointStatements(),
            query: { statementId },
          });

          if (response.status !== 200) {
            throw new Error(`Expected Versioning no-modify GET to return 200, received ${response.status}.`);
          }

          const storedStatement = parseJsonObject(response, "Versioning no-modify GET");
          if (JSON.stringify(storedStatement.actor) !== JSON.stringify(statement.actor)) {
            throw new Error("Expected the LRS not to modify the stored actor based on versioning rules.");
          }
          if (JSON.stringify(storedStatement.verb) !== JSON.stringify(statement.verb)) {
            throw new Error("Expected the LRS not to modify the stored verb based on versioning rules.");
          }
          if (JSON.stringify(storedStatement.object) !== JSON.stringify(statement.object)) {
            throw new Error("Expected the LRS not to modify the stored object based on versioning rules.");
          }
        });
      },
    );

    runtime.describe(
      'An LRS rejects with error code 400 Bad Request, a Request which does not use a "X-Experience-API-Version" header name to any Resource except the About Resource (Format, Communication 3.3.s4.b1, Communication 3.3.s3.b7, Communication 2.8.s5.b4, XAPI-00331)',
      () => {
        runtime.it('Should pass when About GET without header "X-Experience-API-Version"', async () => {
          const response = await sendWithoutVersionHeader(
            context,
            {
              method: "GET",
              path: context.getEndpointAbout(),
              headers: createBasicAuthorizationHeader(context),
            },
            200,
            "About GET without version header",
          );

          const about = parseJsonObject(response, "About GET without version header");
          const versions = expectStringArray(about, "version", "About GET without version header");
          if (!versions.includes(context.options.xapiVersion)) {
            throw new Error(`Expected About GET without version header to include ${context.options.xapiVersion}.`);
          }
        });

        runtime.it('Should fail when Statement GET without header "X-Experience-API-Version"', async () => {
          const response = await sendWithoutVersionHeader(
            context,
            {
              method: "GET",
              path: context.getEndpointStatements(),
              headers: createBasicAuthorizationHeader(context),
              query: { statementId: context.generateUuid() },
            },
            400,
            "Statement GET without version header",
          );

          expectVersionHeaderPattern(response, allowedModernVersionPattern, "Statement GET without version header");
        });

        runtime.it('Should fail when Statement POST without header "X-Experience-API-Version"', async () => {
          const response = await sendWithoutVersionHeader(
            context,
            {
              method: "POST",
              path: context.getEndpointStatements(),
              headers: createBasicAuthorizationHeader(context),
              body: await createDefaultStatement(context, "Statement POST without version header body"),
            },
            400,
            "Statement POST without version header",
          );

          expectVersionHeaderPattern(response, allowedModernVersionPattern, "Statement POST without version header");
        });

        runtime.it('Should fail when Statement PUT without header "X-Experience-API-Version"', async () => {
          const response = await sendWithoutVersionHeader(
            context,
            {
              method: "PUT",
              path: context.getEndpointStatements(),
              headers: createBasicAuthorizationHeader(context),
              query: { statementId: context.generateUuid() },
              body: await createDefaultStatement(context, "Statement PUT without version header body"),
            },
            400,
            "Statement PUT without version header",
          );

          expectVersionHeaderPattern(response, allowedModernVersionPattern, "Statement PUT without version header");
        });
      },
    );
  });
}
