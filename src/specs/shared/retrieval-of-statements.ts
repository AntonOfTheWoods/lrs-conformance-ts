import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext, JsonResponse } from "../../describe-runtime/suite-context.ts";
import type { JsonObject, JsonValue } from "../../describe-runtime/templates.ts";

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function createStatement(
  context: DescribeRuntimeContext,
  templates: Array<Record<string, JsonValue>>,
): Promise<JsonObject> {
  const payload = await context.createFromTemplate(templates);
  const statement = payload.statement;
  if (!isJsonObject(statement)) {
    throw new Error("Expected the retrieval-of-statements payload to resolve to an object.");
  }

  return statement;
}

async function expectPostStatus(
  context: DescribeRuntimeContext,
  json: JsonValue,
  expectedStatus: number,
  name: string,
): Promise<void> {
  const response = await context.sendJsonRequest({
    method: "POST",
    path: context.getEndpointStatements(),
    json,
  });

  if (response.status !== expectedStatus) {
    throw new Error(`Expected status ${expectedStatus} for "${name}" but received ${response.status}.`);
  }
}

function parseJsonObject(response: JsonResponse, name: string): JsonObject {
  const parsed = JSON.parse(response.bodyText) as unknown;
  if (!isJsonObject(parsed)) {
    throw new Error(`Expected "${name}" to return a JSON object response.`);
  }

  return parsed;
}

function resolveMoreRequestUrl(context: DescribeRuntimeContext, more: string): string {
  const statementsUrl = `${context.options.endpoint.replace(/\/+$/, "")}${context.getEndpointStatements()}`;
  return new URL(more, statementsUrl).toString();
}

async function fetchCollection(
  context: DescribeRuntimeContext,
  name: string,
  query?: Record<string, unknown>,
): Promise<JsonObject> {
  const response = await context.sendJsonRequest({
    method: "GET",
    path: context.getEndpointStatements(),
    query,
  });

  if (response.status !== 200) {
    throw new Error(`Expected status 200 for "${name}" but received ${response.status}.`);
  }

  return parseJsonObject(response, name);
}

async function fetchMore(context: DescribeRuntimeContext, more: string, name: string): Promise<JsonObject> {
  const response = await context.sendJsonRequest({
    method: "GET",
    path: resolveMoreRequestUrl(context, more),
  });

  if (response.status !== 200) {
    throw new Error(`Expected status 200 for "${name}" but received ${response.status}.`);
  }

  return parseJsonObject(response, name);
}

async function persistTwoDefaultStatements(context: DescribeRuntimeContext): Promise<void> {
  const first = await createStatement(context, [{ statement: "{{statements.default}}" }]);
  const second = await createStatement(context, [{ statement: "{{statements.default}}" }]);
  await expectPostStatus(context, [first, second], 200, "persist two statements");
}

export function registerRetrievalOfStatementsSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  runtime.describe("Retrieval of Statements (Data 2.5)", () => {
    /**  Matchup with Conformance Requirements Document
     * XAPI-00108 - below
     * XAPI-00109 - below
     * XAPI-00110 - below
     * XAPI-00111 - below
     * XAPI-00113 - below
     * XAPI-00114 - below
     */

    runtime.describe(
      'An LRS\'s Statement API, upon processing a successful GET request, will return a single "statements" property and a single "more" property. (Data 2.5.s2.table1, XAPI-00113)',
      () => {
        runtime.it("will return single statements property and may return", async () => {
          await persistTwoDefaultStatements(context);
          const result = await fetchCollection(context, "XAPI-00113", { limit: 1 });

          if (!Array.isArray(result.statements) || typeof result.more !== "string") {
            throw new Error('Expected XAPI-00113 to return both "statements" and "more" properties.');
          }
        });
      },
    );

    runtime.describe(
      'A "statements" property is an Array of Statements (Type, Data 2.5.s2.table1.row1, XAPI-00110)',
      () => {
        runtime.it(
          'should return StatementResult with statements as array using GET without "statementId" or "voidedStatementId"',
          async () => {
            const statement = await createStatement(context, [
              { statement: "{{statements.context}}" },
              { context: "{{contexts.category}}" },
              {
                instructor: {
                  objectType: "Agent",
                  name: "xAPI mbox",
                  mbox: `mailto:${context.generateUuid()}@adlnet.gov`,
                },
              },
            ]);

            const statementContext = statement.context;
            if (!isJsonObject(statementContext)) {
              throw new Error("Expected the retrieval statement to include a context object.");
            }
            const statementContextActivities = statementContext.contextActivities;
            if (!isJsonObject(statementContextActivities)) {
              throw new Error("Expected the retrieval statement to include context activities.");
            }
            const statementCategory = statementContextActivities.category;
            if (!isJsonObject(statementCategory)) {
              throw new Error("Expected the retrieval statement to include a category activity.");
            }
            const statementActor = statement.actor;
            if (!isJsonObject(statementActor)) {
              throw new Error("Expected the retrieval statement to include an actor.");
            }
            const statementVerb = statement.verb;
            if (!isJsonObject(statementVerb)) {
              throw new Error("Expected the retrieval statement to include a verb.");
            }
            const statementObject = statement.object;
            if (!isJsonObject(statementObject)) {
              throw new Error("Expected the retrieval statement to include an object.");
            }
            const statementInstructor = statementContext.instructor;
            if (!isJsonObject(statementInstructor)) {
              throw new Error("Expected the retrieval statement to include an instructor.");
            }

            statementCategory.id = "http://www.example.com/test/array/statements/pri";
            statementVerb.id = `${String(statementVerb.id)}${context.generateUuid()}`;
            statementActor.mbox = `mailto:${context.generateUuid()}@adlnet.gov`;
            statementContext.registration = context.generateUuid();
            statementInstructor.mbox = `mailto:${context.generateUuid()}@adlnet.gov`;
            statementObject.id = `${String(statementObject.id)}${context.generateUuid()}`;

            const substatement = await createStatement(context, [
              { statement: "{{statements.object_substatement}}" },
              { object: "{{substatements.context}}" },
              { context: "{{contexts.category}}" },
              {
                instructor: {
                  objectType: "Agent",
                  name: "xAPI mbox",
                  mbox: `mailto:${context.generateUuid()}@adlnet.gov`,
                },
              },
            ]);

            const substatementActor = substatement.actor;
            if (!isJsonObject(substatementActor)) {
              throw new Error("Expected the retrieval substatement to include an actor.");
            }
            const substatementVerb = substatement.verb;
            if (!isJsonObject(substatementVerb)) {
              throw new Error("Expected the retrieval substatement to include a verb.");
            }
            const nestedSubstatement = substatement.object;
            if (!isJsonObject(nestedSubstatement)) {
              throw new Error("Expected the retrieval substatement to include a nested substatement.");
            }
            const nestedActor = nestedSubstatement.actor;
            if (!isJsonObject(nestedActor)) {
              throw new Error("Expected the retrieval nested substatement to include an actor.");
            }
            const nestedVerb = nestedSubstatement.verb;
            if (!isJsonObject(nestedVerb)) {
              throw new Error("Expected the retrieval nested substatement to include a verb.");
            }
            const nestedObject = nestedSubstatement.object;
            if (!isJsonObject(nestedObject)) {
              throw new Error("Expected the retrieval nested substatement to include an object.");
            }
            const nestedContext = nestedSubstatement.context;
            if (!isJsonObject(nestedContext)) {
              throw new Error("Expected the retrieval nested substatement to include a context.");
            }
            const nestedContextActivities = nestedContext.contextActivities;
            if (!isJsonObject(nestedContextActivities)) {
              throw new Error("Expected the retrieval nested substatement to include context activities.");
            }
            const nestedCategory = nestedContextActivities.category;
            if (!isJsonObject(nestedCategory)) {
              throw new Error("Expected the retrieval nested substatement to include a category activity.");
            }

            substatementVerb.id = `${String(substatementVerb.id)}${context.generateUuid()}`;
            substatementActor.mbox = `mailto:${context.generateUuid()}@adlnet.gov`;
            nestedVerb.id = `${String(nestedVerb.id)}${context.generateUuid()}`;
            nestedActor.mbox = `mailto:${context.generateUuid()}@adlnet.gov`;
            nestedObject.id = `${String(nestedObject.id)}${context.generateUuid()}`;
            nestedCategory.id = "http://www.example.com/test/array/statements/sub";

            await expectPostStatus(context, statement, 200, "persist retrieval statement");
            await expectPostStatus(context, substatement, 200, "persist retrieval substatement");

            const result = await fetchCollection(context, "XAPI-00110");
            if (!Array.isArray(result.statements)) {
              throw new Error('Expected XAPI-00110 to return a "statements" array.');
            }
          },
        );
      },
    );

    runtime.it(
      'A "statements" property which is too large for a single page will create a container for each additional page (Data 2.5.s2.table1.row1, XAPI-00114)',
      async () => {
        await persistTwoDefaultStatements(context);
        const result = await fetchCollection(context, "XAPI-00114", { limit: 1 });
        if (!Array.isArray(result.statements) || typeof result.more !== "string" || result.more.length === 0) {
          throw new Error('Expected XAPI-00114 to return a paginated container with a non-empty "more" property.');
        }
      },
    );

    runtime.describe(
      'The "more" property is absent or an empty string (no whitespace) if the entire results of the original GET request have been returned. (Data 2.5.s2.table1.row2, XAPI-00109)',
      () => {
        runtime.it(
          'should return empty "more" property or no "more" property when all statements returned',
          async () => {
            const result = await fetchCollection(context, "XAPI-00109", {
              verb: "http://adlnet.gov/expapi/non/existent/344588672021038",
            });

            if (!(result.more === "" || typeof result.more === "undefined")) {
              throw new Error('Expected XAPI-00109 to return an empty or absent "more" property.');
            }
          },
        );
      },
    );

    runtime.describe(
      'If not empty, the "more" property\'s IRL refers to a specific container object corresponding to the next page of results from the orignal GET request (Data 2.5.s2.table1.row2, XAPI-00108)',
      () => {
        runtime.it('should return "more" which refers to next page of results', async () => {
          await persistTwoDefaultStatements(context);
          const result = await fetchCollection(context, "XAPI-00108", { limit: 1 });

          if (typeof result.more !== "string" || result.more.length === 0) {
            throw new Error('Expected XAPI-00108 to return a non-empty "more" property.');
          }

          const nextPage = await fetchMore(context, result.more, "XAPI-00108 more page");
          if (!Array.isArray(nextPage.statements) || typeof nextPage.more !== "string") {
            throw new Error("Expected the XAPI-00108 more page to follow the statement-result container shape.");
          }
        });
      },
    );

    runtime.it(
      'A "more" property\'s referenced container object follows the same rules as the original GET request, originating with a single "statements" property and a single "more" property (Data 2.5.s2.table1.row2, XAPI-00111)',
      async () => {
        await persistTwoDefaultStatements(context);
        const result = await fetchCollection(context, "XAPI-00111", { limit: 1 });

        if (typeof result.more !== "string" || result.more.length === 0) {
          throw new Error('Expected XAPI-00111 to produce a non-empty "more" property.');
        }

        const nextPage = await fetchMore(context, result.more, "XAPI-00111 more page");
        if (!Array.isArray(nextPage.statements) || typeof nextPage.more !== "string") {
          throw new Error("Expected the XAPI-00111 more page to preserve the original GET response shape.");
        }
      },
    );
  });
}
