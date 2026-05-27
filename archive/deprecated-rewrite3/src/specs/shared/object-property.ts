import { registerStatementPostConfigSuite } from "../../describe-runtime/config-suite.ts";
import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";
import type { JsonObject } from "../../describe-runtime/templates.ts";

import { objectPropertyGroups } from "./object-property-groups.ts";

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
    throw new Error("Expected the object-property statement payload to resolve to an object.");
  }

  return statement;
}

async function createStatementObjectFromStatementTemplate(
  context: DescribeRuntimeContext,
  statementTemplate: string,
): Promise<JsonObject> {
  const statement = await createStatement(context, [{ statement: statementTemplate }]);
  const object = statement.object;
  if (!isJsonObject(object)) {
    throw new Error("Expected the referenced statement template to expose an object payload.");
  }

  return structuredClone(object);
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

export function registerObjectPropertyRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  runtime.describe("Object Property Requirements (Data 2.4.4)", () => {
    /**  Matchup with Conformance Requirements Document
     * XAPI-00046 - in objects.js
     * XAPI-00047..XAPI-00063 - in activities.js
     * XAPI-00064 - below
     * XAPI-00065 - below
     * XAPI-00066..XAPI-00071 - in substatements.js
     * XAPI-00072..XAPI-00073 - in statementrefs.js
     */
    registerStatementPostConfigSuite(runtime, context, objectPropertyGroups);

    runtime.describe(
      'An Activity Definition uses the "interactionType" property if any of the correctResponsesPattern, choices, scale, source, target, or steps properties are used (Multiplicity, Data 2.4.4.1.s8, XAPI-00064) **Implicit**',
      () => {
        const cases = [
          {
            title: 'Activity Definition uses correctResponsesPattern without "interactionType" property',
            objectTemplate: "{{activities.other}}",
          },
          {
            title: 'Activity Definition uses choices without "interactionType" property',
            objectTemplate: "{{activities.choice}}",
          },
          {
            title: 'Activity Definition uses fill-in without "interactionType" property',
            objectTemplate: "{{activities.fill_in}}",
          },
          {
            title: 'Activity Definition uses scale without "interactionType" property',
            objectTemplate: "{{activities.likert}}",
          },
          {
            title: 'Activity Definition uses long-fill-in without "interactionType" property',
            objectTemplate: "{{activities.long_fill_in}}",
          },
          {
            title: 'Activity Definition uses source without "interactionType" property',
            objectTemplate: "{{activities.matching}}",
          },
          {
            title: 'Activity Definition uses target without "interactionType" property',
            objectTemplate: "{{activities.matching_target}}",
          },
          {
            title: 'Activity Definition uses numeric without "interactionType" property',
            objectTemplate: "{{activities.numeric}}",
          },
          {
            title: 'Activity Definition uses other without "interactionType" property',
            objectTemplate: "{{activities.other}}",
          },
          {
            title: 'Activity Definition uses performance without "interactionType" property',
            objectTemplate: "{{activities.performance}}",
          },
          {
            title: 'Activity Definition uses sequencing without "interactionType" property',
            objectTemplate: "{{activities.sequencing}}",
          },
          {
            title: 'Activity Definition uses true-false without "interactionType" property',
            objectTemplate: "{{activities.true_false}}",
          },
        ] as const;

        for (const testCase of cases) {
          runtime.it(testCase.title, async () => {
            const statement = await createStatement(context, [
              { statement: "{{statements.default}}" },
              { object: testCase.objectTemplate },
            ]);

            const object = statement.object;
            if (!isJsonObject(object) || !isJsonObject(object.definition)) {
              throw new Error(`Expected ${testCase.title} to resolve an activity definition.`);
            }

            delete object.definition.interactionType;
            await expectPostStatus(context, statement, 400, testCase.title);
          });
        }
      },
    );

    runtime.describe(
      'Statements that use an Agent or Group as an Object MUST specify an "objectType" property. (Data 2.4.4.2.s1.b1, XAPI-00065)',
      () => {
        const directCases = [
          {
            title: "should fail when using agent as object and no objectType",
            statementTemplate: "{{statements.object_agent_default}}",
          },
          {
            title: "should fail when using group as object and no objectType",
            statementTemplate: "{{statements.object_group_default}}",
          },
        ] as const;

        for (const testCase of directCases) {
          runtime.it(testCase.title, async () => {
            const statement = await createStatement(context, [{ statement: testCase.statementTemplate }]);
            const object = statement.object;
            if (!isJsonObject(object)) {
              throw new Error(`Expected ${testCase.title} to resolve an object payload.`);
            }

            delete object.objectType;
            await expectPostStatus(context, statement, 400, testCase.title);
          });
        }

        const substatementCases = [
          {
            title: "substatement should fail when using agent as object and no objectType",
            objectTemplate: "{{statements.object_agent_default}}",
          },
          {
            title: "substatement should fail when using group as object and no objectType",
            objectTemplate: "{{statements.object_group_default}}",
          },
        ] as const;

        for (const testCase of substatementCases) {
          runtime.it(testCase.title, async () => {
            const statement = await createStatement(context, [{ statement: "{{statements.object_substatement}}" }]);
            const substatement = statement.object;
            if (!isJsonObject(substatement)) {
              throw new Error(`Expected ${testCase.title} to resolve a substatement object.`);
            }

            const nestedObject = await createStatementObjectFromStatementTemplate(context, testCase.objectTemplate);
            delete nestedObject.objectType;
            substatement.object = nestedObject;

            await expectPostStatus(context, statement, 400, testCase.title);
          });
        }
      },
    );
  });
}
