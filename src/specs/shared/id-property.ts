import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";
import type { JsonObject } from "../../describe-runtime/templates.ts";

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function wait(delayMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

function parseStatementIdResponse(bodyText: string): string {
  const payload = JSON.parse(bodyText) as unknown;
  if (!Array.isArray(payload) || typeof payload[0] !== "string") {
    throw new Error("Expected the statement POST response body to be an array containing the generated statement id.");
  }

  return payload[0];
}

async function fetchStoredStatement(context: DescribeRuntimeContext, statementId: string): Promise<JsonObject> {
  const deadline = Date.now() + 15_000;

  while (Date.now() <= deadline) {
    const response = await context.sendRequest({
      method: "GET",
      path: context.getEndpointStatements(),
      query: {
        statementId,
      },
    });

    if (response.status === 200) {
      const payload = JSON.parse(response.bodyText) as unknown;
      if (!isJsonObject(payload)) {
        throw new Error("Expected the retrieved statement payload to resolve to an object.");
      }

      return payload;
    }

    await wait(200);
  }

  throw new Error("Timed out while retrieving the stored statement by generated id.");
}

export function registerIdPropertyRequirementsSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  describeIdPropertyRequirements(runtime, context);
}

function describeIdPropertyRequirements(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  describeIdPropertyRequirementsRoot(runtime, context);
}

function describeIdPropertyRequirementsRoot(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  /** Matchup with Conformance Requirements Document
   * XAPI-00026 - found below
   * XAPI-00027 - in uuids.js
   * XAPI-00028 - in uuids.js
   * XAPI-00029 - in uuids.js
   * XAPI-00030 - in uuids.js
   */
  runtime.describe("Id Property Requirements (Data 2.4.1)", () => {
    /**  XAPI-00026,  Data 2.4.1 Id
     * An LRS generates the "id" property of a Statement if none is provided (Modify, 4.1.1.a)
     */
    runtime.describe(
      'An LRS generates the "id" property of a Statement if none is provided (Modify, Data 2.4.1.s2.b1, XAPI-00026)',
      () => {
        runtime.it("should complete an empty id property", async () => {
          const payload = await context.createFromTemplate([{ statement: "{{statements.default}}" }]);
          const statement = payload.statement;
          if (!isJsonObject(statement)) {
            throw new Error("Expected the id-property statement payload to resolve to an object.");
          }

          const postResponse = await context.sendJsonRequest({
            method: "POST",
            path: context.getEndpointStatements(),
            json: statement,
          });

          if (postResponse.status !== 200) {
            throw new Error(`Expected status 200 for the id-property POST but received ${postResponse.status}.`);
          }

          const statementId = parseStatementIdResponse(postResponse.bodyText);
          const storedStatement = await fetchStoredStatement(context, statementId);
          if (storedStatement.id !== statementId) {
            const receivedId =
              typeof storedStatement.id === "string" ? storedStatement.id : JSON.stringify(storedStatement.id);
            throw new Error(`Expected stored statement id ${statementId} but received ${receivedId}.`);
          }
        });
      },
    );
  });
}
