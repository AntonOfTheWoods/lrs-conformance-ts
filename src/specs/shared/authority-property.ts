import { registerStatementPostConfigSuite } from "../../describe-runtime/config-suite.ts";
import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext, JsonResponse } from "../../describe-runtime/suite-context.ts";
import type { JsonObject } from "../../describe-runtime/templates.ts";

import { authorityPropertyGroups } from "./authority-property-groups.ts";

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function createStatement(
  context: DescribeRuntimeContext,
  templates: Array<Record<string, string | JsonObject>>,
): Promise<JsonObject> {
  const payload = await context.createFromTemplate(templates);
  const statement = payload.statement;
  if (!isJsonObject(statement)) {
    throw new Error("Expected the authority-property statement payload to resolve to an object.");
  }

  return statement;
}

async function expectPostStatus(
  context: DescribeRuntimeContext,
  statement: JsonObject,
  expectedStatus: number,
  name: string,
): Promise<void> {
  const response = await context.sendJsonRequest({
    method: "POST",
    path: context.getEndpointStatements(),
    json: statement,
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

async function fetchStoredStatement(
  context: DescribeRuntimeContext,
  statementId: string,
  name: string,
): Promise<JsonObject> {
  const response = await context.sendJsonRequest({
    method: "GET",
    path: context.getEndpointStatements(),
    query: { statementId },
  });

  if (response.status !== 200) {
    throw new Error(`Expected status 200 for "${name}" retrieval but received ${response.status}.`);
  }

  return parseJsonObject(response, name);
}

export function registerAuthorityPropertyRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  runtime.describe("Authority Property Requirements (Data 2.4.9)", () => {
    /**  Matchup with Conformance Requirements Document
     * XAPI-00024, XAPI-00098 - in authorities.js
     * XAPI-00099 - below
     * XAPI-00100 - below
     */
    registerStatementPostConfigSuite(runtime, context, authorityPropertyGroups);

    runtime.it(
      'An LRS rejects with error code 400 Bad Request, a Request whose "authority" is a Group and consists of non-O-Auth Agents (Data 2.4.9.s3.b3, XAPI-00100)',
      async () => {
        const statement = await createStatement(context, [
          { statement: "{{statements.default}}" },
          {
            authority: {
              objectType: "Group",
              name: "xAPI Group",
              mbox: "mailto:xapigroup@example.com",
              member: [
                {
                  name: "agentA",
                  mbox: "mailto:agentA@example.com",
                },
                {
                  name: "agentB",
                  mbox: "mailto:agentB@example.com",
                },
              ],
            },
          },
        ]);

        await expectPostStatus(context, statement, 400, "XAPI-00100");
      },
    );

    runtime.describe(
      'An LRS populates the "authority" property if it is not provided in the Statement, based on header information with the Agent corresponding to the user (contained within the header) (Implicit, Data 2.4.9.s3.b4, XAPI-00099)',
      () => {
        runtime.it("should populate authority", async () => {
          const statement = await createStatement(context, [{ statement: "{{statements.default}}" }]);
          const statementId = context.generateUuid();
          statement.id = statementId;

          await expectPostStatus(context, statement, 200, "XAPI-00099");

          const storedStatement = await fetchStoredStatement(context, statementId, "XAPI-00099");
          if (!isJsonObject(storedStatement.authority)) {
            throw new Error('Expected XAPI-00099 to populate the "authority" property.');
          }
        });
      },
    );
  });
}
