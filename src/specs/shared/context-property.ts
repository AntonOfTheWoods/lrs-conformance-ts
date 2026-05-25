import {
  registerStatementPostConfigSuite,
  type ConfigDrivenGroupDefinition,
} from "../../describe-runtime/config-suite.ts";
import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext, JsonResponse } from "../../describe-runtime/suite-context.ts";
import type { JsonObject } from "../../describe-runtime/templates.ts";

import { contextPropertyGroups } from "./context-property-groups.ts";

const contextActivityTypes = ["parent", "grouping", "category", "other"] as const;

type ContextActivityType = (typeof contextActivityTypes)[number];

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function createStatement(
  context: DescribeRuntimeContext,
  templates: Array<Record<string, string>>,
): Promise<JsonObject> {
  const payload = await context.createFromTemplate(templates);
  const statement = payload.statement;
  if (!isJsonObject(statement)) {
    throw new Error("Expected the context-property statement payload to resolve to an object.");
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

function assertContextActivityArray(value: unknown, type: ContextActivityType, name: string): void {
  if (!isJsonObject(value)) {
    throw new Error(`Expected "${name}" to resolve a context object.`);
  }

  const contextActivities = value.contextActivities;
  if (!isJsonObject(contextActivities)) {
    throw new Error(`Expected "${name}" to return contextActivities.`);
  }

  if (!Array.isArray(contextActivities[type])) {
    throw new Error(`Expected "${name}" to return contextActivities.${type} as an array.`);
  }
}

export function registerContextPropertyRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
  additionalGroups: ConfigDrivenGroupDefinition[] = [],
): void {
  runtime.describe("Context Property Requirements (Data 2.4.6)", () => {
    /**  Matchup with Conformance Requirements Document
     * XAPI-00084..XAPI-00092 - in contexts.js
     * XAPI-00093..XAPI-00094 - in contextactivities.js
     * XAPI-00096 - below
     */
    registerStatementPostConfigSuite(runtime, context, contextPropertyGroups);

    if (additionalGroups.length > 0) {
      registerStatementPostConfigSuite(runtime, context, additionalGroups);
    }

    runtime.describe(
      "An LRS returns a ContextActivity in an array, even if only a single ContextActivity is returned (Data 2.4.6.2.s4.b3, XAPI-00096)",
      () => {
        for (const type of contextActivityTypes) {
          runtime.it(
            `should return array for statement context "${type}" when single ContextActivity is passed`,
            async () => {
              const statement = await createStatement(context, [
                { statement: "{{statements.context}}" },
                { context: `{{contexts.${type}}}` },
              ]);
              const statementId = context.generateUuid();
              statement.id = statementId;

              await expectPostStatus(context, statement, 200, `statement context ${type}`);

              const storedStatement = await fetchStoredStatement(context, statementId, `statement context ${type}`);
              assertContextActivityArray(storedStatement.context, type, `statement context ${type}`);
            },
          );
        }

        for (const type of contextActivityTypes) {
          runtime.it(
            `should return array for statement substatement context "${type}" when single ContextActivity is passed`,
            async () => {
              const statement = await createStatement(context, [
                { statement: "{{statements.object_substatement}}" },
                { object: "{{substatements.context}}" },
                { context: `{{contexts.${type}}}` },
              ]);
              const statementId = context.generateUuid();
              statement.id = statementId;

              await expectPostStatus(context, statement, 200, `statement substatement context ${type}`);

              const storedStatement = await fetchStoredStatement(
                context,
                statementId,
                `statement substatement context ${type}`,
              );

              if (!isJsonObject(storedStatement.object)) {
                throw new Error(`Expected statement substatement context ${type} to return a substatement object.`);
              }

              assertContextActivityArray(
                storedStatement.object.context,
                type,
                `statement substatement context ${type}`,
              );
            },
          );
        }
      },
    );
  });
}
