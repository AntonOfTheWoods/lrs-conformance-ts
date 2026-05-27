import {
  registerStatementPostConfigSuite,
  type ConfigDrivenGroupDefinition,
} from "../../describe-runtime/config-suite.ts";
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
        throw new Error("Expected the retrieved version-property statement to resolve to an object.");
      }

      return payload;
    }

    await wait(200);
  }

  throw new Error("Timed out while retrieving the version-property statement.");
}

const invalidString = "should fail";
const invalidVersion099 = "0.9.9";
const invalidVersion110 = "1.1.0";
const validVersion10 = "1.0";
const validVersion109 = "1.0.9";

const versionPropertyGroups: ConfigDrivenGroupDefinition[] = [
  {
    /**  XAPI-00101, Data 2.4.10 Version
     * An LRS rejects with error code 400 Bad Request, a Request which uses "version" and has the value set to anything but "1.0" or "1.0.x", where x is the semantic versioning number
     */
    name: 'An LRS rejects with error code 400 Bad Request, a Request which uses "version" and has the value set to anything but "1.0" or "1.0.x", where x is the semantic versioning number (Format, Data 2.4.10.s2.b1, Data 2.4.10.s3.b1, Communication 3.3.s3.b3, Communication 3.3.s3.b6, XAPI-00101)',
    config: [
      {
        name: 'statement "version" valid 1.0',
        templates: [{ statement: "{{statements.default}}" }, { version: validVersion10 }],
        expect: [200],
      },
      {
        name: 'statement "version" valid 1.0.9',
        templates: [{ statement: "{{statements.default}}" }, { version: validVersion109 }],
        expect: [200],
      },
      {
        name: 'statement "version" invalid string',
        templates: [{ statement: "{{statements.default}}" }, { version: invalidString }],
        expect: [400],
      },
      {
        name: 'statement "version" invalid 0.9.9',
        templates: [{ statement: "{{statements.default}}" }, { version: invalidVersion099 }],
        expect: [400],
      },
      {
        name: 'statement "version" invalid 1.1.0',
        templates: [{ statement: "{{statements.default}}" }, { version: invalidVersion110 }],
        expect: [400],
      },
    ],
  },
];

export function registerVersionPropertyRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  runtime.describe("Version Property Requirements (Data 2.4.10)", () => {
    /**  Matchup with Conformance Requirements Document
     * XAPI-00101 - in version.js
     * Unnumbered test - came from XAPI-00332
     */
    registerStatementPostConfigSuite(runtime, context, versionPropertyGroups);

    /**  XAPI-00332, Communication 3.3 Versioning which should be moved to Data 2.4.10 Version Property
     * Statements returned by an LRS MUST retain the version property they are accepted with.
     */
    runtime.it(
      "Statements returned by an LRS MUST retain the version property they are accepted with (Format, Data 2.4.10, XAPI-00332)",
      async () => {
        const payload = await context.createFromTemplate([{ statement: "{{statements.default}}" }]);
        const statement = payload.statement;
        if (!isJsonObject(statement)) {
          throw new Error("Expected the version-property statement payload to resolve to an object.");
        }

        const statementId = context.generateUuid();
        const version = context.options.xapiVersion;
        statement.id = statementId;
        statement.version = version;

        const postResponse = await context.sendJsonRequest({
          method: "POST",
          path: context.getEndpointStatements(),
          json: statement,
        });

        if (postResponse.status !== 200) {
          throw new Error(`Expected status 200 for the version-property POST but received ${postResponse.status}.`);
        }

        const returnedStatementId = parseStatementIdResponse(postResponse.bodyText);
        if (returnedStatementId !== statementId) {
          throw new Error(`Expected returned statement id ${statementId} but received ${returnedStatementId}.`);
        }

        const storedStatement = await fetchStoredStatement(context, statementId);
        if (storedStatement.version !== version) {
          throw new Error(
            `Expected stored version ${version} but received ${JSON.stringify(storedStatement.version)}.`,
          );
        }
      },
    );
  });
}
