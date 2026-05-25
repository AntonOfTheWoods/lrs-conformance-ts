import { registerStatementPostConfigSuite } from "../../describe-runtime/config-suite.ts";
import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";
import type { JsonObject } from "../../describe-runtime/templates.ts";
import {
  formattingEnumeratedValueCaseGroups,
  formattingIriSchemeCases,
  formattingKeyCaseGroups,
  formattingLanguageTagGroups,
  formattingMissingPropertyGroups,
  formattingNullPropertyGroups,
  formattingParameterValidationCases,
  formattingRequiredFormatGroups,
  formattingVerifyTemplateGroups,
  formattingWrongTypeGroups,
} from "../shared/formatting-missing-properties.ts";

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function wait(delayMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
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
        throw new Error("Expected the retrieved precision-check statement to resolve to an object.");
      }

      return payload;
    }

    await wait(200);
  }

  throw new Error("Timed out while retrieving the stored precision-check statement.");
}

function registerFormattingFloatPrecisionSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  /**  XAPI-00002, Data 2.2 Formatting Requirements
   * An LRS stores 32-bit floating point numbers with at least the precision of IEEE 754
   */
  runtime.describe(
    "An LRS stores 32-bit floating point numbers with at least the precision of IEEE 754 (Data 2.2.s4.b3, XAPI-00002)",
    () => {
      runtime.it("should pass and keep precision", async () => {
        const payload = await context.createFromTemplate([
          { statement: "{{statements.result}}" },
          { result: "{{results.default}}" },
        ]);
        const statement = payload.statement;
        if (!isJsonObject(statement)) {
          throw new Error("Expected the precision-check statement payload to resolve to an object.");
        }

        const result = statement.result;
        if (!isJsonObject(result)) {
          throw new Error("Expected the precision-check statement result to resolve to an object.");
        }

        const score = result.score;
        if (!isJsonObject(score)) {
          throw new Error("Expected the precision-check statement score to resolve to an object.");
        }

        const statementId = context.generateUuid();
        const min = 0.12123434;
        const raw = 12.125;
        const max = 45.45;

        statement.id = statementId;
        score.min = min;
        score.raw = raw;
        score.max = max;
        score.scaled = min;

        const postResponse = await context.sendJsonRequest({
          method: "POST",
          path: context.getEndpointStatements(),
          json: statement,
        });

        if (postResponse.status !== 200) {
          throw new Error(`Expected status 200 for the precision-check POST but received ${postResponse.status}.`);
        }

        const storedStatement = await fetchStoredStatement(context, statementId);
        const storedResult = storedStatement.result;
        if (!isJsonObject(storedResult)) {
          throw new Error("Expected the stored precision-check result to resolve to an object.");
        }

        const storedScore = storedResult.score;
        if (!isJsonObject(storedScore)) {
          throw new Error("Expected the stored precision-check score to resolve to an object.");
        }

        if (
          storedScore.min !== min ||
          storedScore.raw !== raw ||
          storedScore.max !== max ||
          storedScore.scaled !== min
        ) {
          throw new Error(
            `Expected stored score precision ${JSON.stringify({ min, raw, max, scaled: min })} but received ${JSON.stringify(storedScore)}.`,
          );
        }
      });
    },
  );
}

function registerFormattingIriSchemeSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  /**  XAPI-00011
   * An LRS rejects with error code 400 Bad Request a Statement containing IRL or IRI values without a scheme.
   */
  runtime.describe(
    "An LRS rejects with error code 400 Bad Request a Statement containing IRL or IRI values without a scheme. (Data 2.2.s4.b1.b8, XAPI-00011)",
    () => {
      for (const testCase of formattingIriSchemeCases) {
        runtime.it(testCase.name, async () => {
          const payload = await context.createFromTemplate(testCase.templates);
          const statement = payload.statement;
          if (!isJsonObject(statement)) {
            throw new Error(`Expected the statement payload to resolve to an object for "${testCase.name}".`);
          }

          const statementId = context.generateUuid();
          statement.id = statementId;
          testCase.mutate(statement);

          const response = await context.sendJsonRequest({
            method: "PUT",
            path: context.getEndpointStatements(),
            query: {
              statementId,
            },
            json: statement,
          });

          if (response.status !== 400) {
            throw new Error(`Expected status 400 for "${testCase.name}" but received ${response.status}.`);
          }
        });
      }
    },
  );
}

function registerFormattingMalformedObjectSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  /**  XAPI-00014
   * All Objects are well-created JSON Objects (Nature of Binding)
   */
  runtime.describe(
    "All Objects are well-created JSON Objects (Nature of binding, Data 2.1, XAPI-00014) **Implicit**",
    () => {
      runtime.it("An LRS rejects a not well-created JSON Object", async () => {
        const payload = await context.createFromTemplate([{ statement: "{{statements.default}}" }]);
        const statement = payload.statement;
        if (!isJsonObject(statement)) {
          throw new Error("Expected the malformed-object statement payload to resolve to an object.");
        }

        const actor = statement.actor;
        if (!isJsonObject(actor)) {
          throw new Error("Expected the malformed-object statement actor to resolve to an object.");
        }

        actor.objectType = '"objectType": "Agent"';

        const response = await context.sendJsonRequest({
          method: "POST",
          path: context.getEndpointStatements(),
          json: statement,
        });

        if (response.status !== 400) {
          throw new Error(`Expected status 400 for malformed JSON object case but received ${response.status}.`);
        }
      });
    },
  );
}

function registerFormattingParameterValidationSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  /**  XAPI-00012
   * The LRS rejects with error code 400 Bad Request parameter values which do not validate to the same standards required for values of the same types in Statements.
   */
  runtime.describe(
    "The LRS rejects with error code 400 Bad Request parameter values which do not validate to the same standards required for values of the same types in Statements (Data 2.2.s4.b4, XAPI-00012)",
    () => {
      for (const testCase of formattingParameterValidationCases) {
        runtime.it(testCase.name, async () => {
          const response = await context.sendRequest({
            method: "GET",
            path: context.getEndpointStatements(),
            query: testCase.query,
          });

          if (response.status !== testCase.expect) {
            throw new Error(
              `Expected status ${testCase.expect} for "${testCase.name}" but received ${response.status}.`,
            );
          }
        });
      }
    },
  );
}

/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xapi-lrs-conformance-requirements
 */
export function registerFormattingRequirementsSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  runtime.before("Before all tests are run", async () => {
    await context.setTimeMargin();
  });

  runtime.describe("Formatting Requirements (Data 2.2)", () => {
    /**  Matchup with Conformance Requirements Document
     * XAPI-00001 - in formatting.js
     * XAPI-00002 - below
     * XAPI-00003 - in formatting.js
     * XAPI-00004 - in formatting.js
     * XAPI-00005 - in formatting.js
     * XAPI-00006 - in formatting.js
     * XAPI-00007 - in formatting.js
     * XAPI-00008 - in formatting.js
     * XAPI-00009 - in formatting.js
     * XAPI-00010 - in formatting.js
     * XAPI-00011 - below
     * XAPI-00012 - below
     * XAPI-00013 - in formatting.js
     * XAPI-00014 - below and in verify.js
     * XAPI-00015 - in Communication 1.4 - should stay in Comm 1.4 Encoding
     */
    registerFormattingFloatPrecisionSuite(runtime, context);
    registerStatementPostConfigSuite(runtime, context, formattingMissingPropertyGroups);
    registerStatementPostConfigSuite(runtime, context, formattingNullPropertyGroups);
    registerStatementPostConfigSuite(runtime, context, formattingWrongTypeGroups);
    registerStatementPostConfigSuite(runtime, context, formattingRequiredFormatGroups);
    registerStatementPostConfigSuite(runtime, context, formattingKeyCaseGroups);
    registerStatementPostConfigSuite(runtime, context, formattingEnumeratedValueCaseGroups);
    registerStatementPostConfigSuite(runtime, context, formattingLanguageTagGroups);
    registerStatementPostConfigSuite(runtime, context, formattingVerifyTemplateGroups);
    registerFormattingMalformedObjectSuite(runtime, context);
    registerFormattingIriSchemeSuite(runtime, context);
    registerFormattingParameterValidationSuite(runtime, context);
  });
}
