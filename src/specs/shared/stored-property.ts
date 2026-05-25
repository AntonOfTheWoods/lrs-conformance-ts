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
        throw new Error("Expected the retrieved stored-property statement to resolve to an object.");
      }

      return payload;
    }

    await wait(200);
  }

  throw new Error("Timed out while retrieving the stored-property statement.");
}

async function createStatementWithStoredProperty(
  context: DescribeRuntimeContext,
  storedTime: string,
): Promise<JsonObject> {
  const payload = await context.createFromTemplate([{ statement: "{{statements.default}}" }, { stored: storedTime }]);
  const statement = payload.statement;
  if (!isJsonObject(statement)) {
    throw new Error("Expected the stored-property statement payload to resolve to an object.");
  }

  return statement;
}

function getMillisecondPrecision(value: string): number | null {
  const match = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.([0-9]{3,})(?:Z|[+-]\d{2}:\d{2})$/.exec(value);
  if (!match || typeof match[1] !== "string" || Number.isNaN(Date.parse(value))) {
    return null;
  }

  return Number.parseInt(match[1].slice(0, 3), 10);
}

function isIsoTimestampWithMilliseconds(value: string): boolean {
  return getMillisecondPrecision(value) !== null;
}

function hasSubMillisecondDigit(value: string): boolean {
  const milliseconds = getMillisecondPrecision(value);
  return milliseconds !== null && milliseconds % 10 > 0;
}

function parseStatementsCollection(bodyText: string): JsonObject[] {
  const payload = JSON.parse(bodyText) as unknown;
  if (!isJsonObject(payload) || !Array.isArray(payload.statements)) {
    throw new Error("Expected the statements collection response body to include a statements array.");
  }

  const statements: JsonObject[] = [];
  for (const statement of payload.statements) {
    if (!isJsonObject(statement)) {
      throw new Error("Expected each stored statement in the collection to resolve to an object.");
    }

    statements.push(statement);
  }

  return statements;
}

export function registerStoredPropertyRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  runtime.describe("Stored Property Requirements (Data 2.4.8)", () => {
    /**  Matchup with Conformance Requirements Document
     * XAPI-00097 - below
     *
     * Note XAPI-00023 - below
     */

    /**  XAPI-00097, Data 2.4.8 Stored
     * An LRS MUST assign the "stored" property timestamp upon receiving a statement.
     */
    runtime.describe("An LRS MUST accept statements with the stored property (Data 2.4.8.s3.b2, XAPI-00097)", () => {
      runtime.it("using POST", async () => {
        const storedTime = new Date("July 15, 2011").toISOString();
        const statement = await createStatementWithStoredProperty(context, storedTime);

        const postResponse = await context.sendJsonRequest({
          method: "POST",
          path: context.getEndpointStatements(),
          json: statement,
        });

        if (postResponse.status !== 200) {
          throw new Error(`Expected status 200 for stored-property POST but received ${postResponse.status}.`);
        }

        const statementId = parseStatementIdResponse(postResponse.bodyText);
        const storedStatement = await fetchStoredStatement(context, statementId);
        if (typeof storedStatement.stored !== "string") {
          throw new Error("Expected the stored-property POST retrieval to include a stored timestamp.");
        }

        if (storedStatement.stored === storedTime) {
          throw new Error("Expected the LRS-assigned stored timestamp to differ from the submitted stored value.");
        }
      });

      runtime.it("using PUT", async () => {
        const storedTime = new Date("July 15, 2011").toISOString();
        const statement = await createStatementWithStoredProperty(context, storedTime);
        const statementId = context.generateUuid();

        const putResponse = await context.sendJsonRequest({
          method: "PUT",
          path: context.getEndpointStatements(),
          query: {
            statementId,
          },
          json: statement,
        });

        if (putResponse.status !== 204) {
          throw new Error(`Expected status 204 for stored-property PUT but received ${putResponse.status}.`);
        }

        const storedStatement = await fetchStoredStatement(context, statementId);
        if (typeof storedStatement.stored !== "string") {
          throw new Error("Expected the stored-property PUT retrieval to include a stored timestamp.");
        }

        if (storedStatement.stored === storedTime) {
          throw new Error("Expected the LRS-assigned stored timestamp to differ from the submitted stored value.");
        }
      });
    });

    /**  XAPI-00023,  2.4 Statement Properties
     * A "stored" property is a TimeStamp, per section 4.5. An LRS assigns the “stored” property upon receipt with a valid TimeStamp.
     */
    runtime.describe("A stored property must be a TimeStamp (Data 2.4.8.s2, XAPI-00023)", () => {
      runtime.it("retrieve statements, test a stored property", async () => {
        const response = await context.sendRequest({
          method: "GET",
          path: context.getEndpointStatements(),
        });

        if (response.status !== 200) {
          throw new Error(`Expected status 200 when retrieving statements but received ${response.status}.`);
        }

        const statements = parseStatementsCollection(response.bodyText);
        const validStatement = statements.find((statement) => {
          const stored = statement.stored;
          return typeof stored === "string" && isIsoTimestampWithMilliseconds(stored) && hasSubMillisecondDigit(stored);
        });

        if (!validStatement) {
          throw new Error(
            "Expected at least one retrieved statement to include a millisecond-precision stored timestamp.",
          );
        }
      });
    });
  });
}
