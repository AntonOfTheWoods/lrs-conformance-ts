import {
  registerStatementPostConfigSuite,
  type ConfigDrivenGroupDefinition,
} from "../../describe-runtime/config-suite.ts";
import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext, JsonResponse } from "../../describe-runtime/suite-context.ts";
import type { JsonObject, JsonValue } from "../../describe-runtime/templates.ts";

const statementLifecycleGroups: ConfigDrivenGroupDefinition[] = [
  {
    name: 'A Voiding Statement is defined as a Statement whose "verb" property\'s "id" property\'s IRI ending with "voided" (Data 2.3.2, XAPI-00019)',
    config: [
      {
        name: 'statement verb voided IRI ends with "voided" (WARNING: this applies "Upon receiving a Statement that voids another, the LRS SHOULD NOT* reject the request on the grounds of the Object of that voiding Statement not being present")',
        templates: [
          { statement: "{{statements.object_statementref}}" },
          {
            verb: {
              id: "http://adlnet.gov/expapi/verbs/voided",
              display: { "en-US": "voided" },
            },
          },
        ],
        expect: [200],
      },
    ],
  },
  {
    name: 'A Voiding Statement\'s "objectType" field has a value of "StatementRef" (Format, Data 2.3.2.s2.b1, XAPI-00017, XAPI-00020)',
    config: [
      {
        name: 'statement verb voided uses substatement with "StatementRef"',
        templates: [
          { statement: "{{statements.object_statementref}}" },
          {
            verb: {
              id: "http://adlnet.gov/expapi/verbs/voided",
              display: { "en-US": "voided" },
            },
          },
        ],
        expect: [200],
      },
      {
        name: 'statement verb voided does not use object "StatementRef"',
        templates: [
          { statement: "{{statements.verb}}" },
          {
            verb: {
              id: "http://adlnet.gov/expapi/verbs/voided",
              display: { "en-US": "voided" },
            },
          },
        ],
        expect: [400],
      },
    ],
  },
];

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function createVoidedVerb(): JsonObject {
  return {
    id: "http://adlnet.gov/expapi/verbs/voided",
    display: { "en-US": "voided" },
  };
}

async function createStatement(
  context: DescribeRuntimeContext,
  templates: Array<Record<string, JsonValue>>,
): Promise<JsonObject> {
  const payload = await context.createFromTemplate(templates);
  const statement = payload.statement;
  if (!isJsonObject(statement)) {
    throw new Error("Expected the statement-lifecycle payload to resolve to an object.");
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

async function fetchStatement(
  context: DescribeRuntimeContext,
  queryKey: "statementId" | "voidedStatementId",
  statementId: string,
  expectedStatus: number,
  name: string,
): Promise<JsonObject | undefined> {
  const response = await context.sendJsonRequest({
    method: "GET",
    path: context.getEndpointStatements(),
    query: { [queryKey]: statementId },
  });

  if (response.status !== expectedStatus) {
    throw new Error(`Expected status ${expectedStatus} for "${name}" but received ${response.status}.`);
  }

  if (response.status !== 200) {
    return undefined;
  }

  return parseJsonObject(response, name);
}

async function persistVoidedAndVoidingStatements(
  context: DescribeRuntimeContext,
): Promise<{ voidedId: string; voidingId: string }> {
  const voidedId = context.generateUuid();
  const voidingId = context.generateUuid();

  const voidedStatement = await createStatement(context, [{ statement: "{{statements.default}}" }]);
  voidedStatement.id = voidedId;
  await expectPostStatus(context, voidedStatement, 200, "persist voided statement");

  const voidingStatement = await createStatement(context, [
    { statement: "{{statements.object_statementref}}" },
    { verb: createVoidedVerb() },
  ]);
  voidingStatement.id = voidingId;

  const voidingObject = voidingStatement.object;
  if (!isJsonObject(voidingObject)) {
    throw new Error("Expected the voiding template to resolve a StatementRef object.");
  }

  voidingObject.id = voidedId;
  await expectPostStatus(context, voidingStatement, 200, "persist voiding statement");

  return { voidedId, voidingId };
}

export function registerStatementLifecycleRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
  options: { includeNeverRejectVoidedVerbCase?: boolean } = {},
): void {
  runtime.describe("Statement Lifecycle Requirements (Data 2.3)", () => {
    /**  Matchup with Conformance Requirements Document
     * XAPI-00016 - below
     * XAPI-00017 - in voiding.js
     * XAPI-00018 - below
     * XAPI-00019 - in voiding.js
     * XAPI-00020 - in voiding.js
     */
    registerStatementPostConfigSuite(runtime, context, statementLifecycleGroups);

    runtime.describe(
      "A Voided Statement is defined as a Statement that is not a Voiding Statement and is the Target of a Voiding Statement within the LRS (Data 2.3.2.s2.b3, XAPI-00018)",
      () => {
        runtime.it('should return a voided statement when using GET "voidedStatementId"', async () => {
          const { voidedId } = await persistVoidedAndVoidingStatements(context);
          const statement = await fetchStatement(
            context,
            "voidedStatementId",
            voidedId,
            200,
            'GET with "voidedStatementId"',
          );

          if (!statement || statement.id !== voidedId) {
            throw new Error('Expected GET with "voidedStatementId" to return the voided statement.');
          }
        });

        runtime.it('should return 404 when using GET with "statementId"', async () => {
          const { voidedId } = await persistVoidedAndVoidingStatements(context);
          await fetchStatement(context, "statementId", voidedId, 404, 'GET with "statementId"');
        });
      },
    );

    runtime.describe(
      "A Voiding Statement cannot Target another Voiding Statement (Data 2.3.2.s2.b7, XAPI-00016)",
      () => {
        runtime.it("should not void an already voided statement", async () => {
          const { voidedId } = await persistVoidedAndVoidingStatements(context);
          const repeatedVoidingStatement = await createStatement(context, [
            { statement: "{{statements.object_statementref}}" },
            { verb: createVoidedVerb() },
          ]);
          repeatedVoidingStatement.id = context.generateUuid();

          const repeatedObject = repeatedVoidingStatement.object;
          if (!isJsonObject(repeatedObject)) {
            throw new Error("Expected the repeated voiding template to resolve a StatementRef object.");
          }

          repeatedObject.id = voidedId;
          await expectPostStatus(context, repeatedVoidingStatement, 200, "repeat void already voided statement");
          await fetchStatement(
            context,
            "voidedStatementId",
            voidedId,
            200,
            "GET voided statement after repeated voiding",
          );
        });

        runtime.it("should not void a voiding statement", async () => {
          const { voidingId } = await persistVoidedAndVoidingStatements(context);
          const invalidTargetStatement = await createStatement(context, [
            { statement: "{{statements.object_statementref}}" },
            { verb: createVoidedVerb() },
          ]);
          invalidTargetStatement.id = context.generateUuid();

          const invalidTargetObject = invalidTargetStatement.object;
          if (!isJsonObject(invalidTargetObject)) {
            throw new Error("Expected the invalid target voiding template to resolve a StatementRef object.");
          }

          invalidTargetObject.id = voidingId;
          await expectPostStatus(
            context,
            invalidTargetStatement,
            200,
            "voiding statement targeting a voiding statement",
          );
          const statement = await fetchStatement(
            context,
            "statementId",
            voidingId,
            200,
            "GET original voiding statement",
          );

          if (!statement || statement.id !== voidingId) {
            throw new Error("Expected the original voiding statement to remain retrievable.");
          }
        });
      },
    );

    if (options.includeNeverRejectVoidedVerbCase) {
      runtime.describe(
        "An LRS SHALL NOT reject a voided statement because it cannot find the ID of the Object of that statement, nor does the LRS have to try to find it. (4.2.4.1 LRS Rejection Cases, XAPI-00016)",
        () => {
          runtime.it("shall not reject a voided statement", async () => {
            const statement = await createStatement(context, [
              { statement: "{{statements.object_statementref}}" },
              { verb: createVoidedVerb() },
            ]);
            statement.id = context.generateUuid();

            const statementObject = statement.object;
            if (!isJsonObject(statementObject)) {
              throw new Error("Expected the missing-target voiding template to resolve a StatementRef object.");
            }

            statementObject.id = context.generateUuid();
            await expectPostStatus(context, statement, 200, "missing target voiding acceptance");
          });
        },
      );
    }
  });
}
