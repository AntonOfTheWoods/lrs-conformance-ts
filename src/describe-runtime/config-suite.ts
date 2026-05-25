import type { DescribeRuntime } from "./runtime.ts";
import type { DescribeRuntimeContext } from "./suite-context.ts";
import type { JsonObject, JsonValue, TemplateLayer } from "./templates.ts";

export interface ConfigDrivenCaseDefinition {
  name: string;
  templates?: TemplateLayer[];
  json?: JsonValue;
  expect: number[];
  method?: "POST";
  path?: string;
}

export interface ConfigDrivenGroupDefinition {
  name: string;
  config: ConfigDrivenCaseDefinition[];
}

function extractSinglePayload(value: JsonObject): JsonValue {
  const entries = Object.entries(value);
  const entry = entries[0];
  if (!entry || entries.length !== 1) {
    throw new Error("Config-driven template expansion must produce exactly one top-level payload.");
  }

  return entry[1];
}

export function registerStatementPostConfigSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
  groups: ConfigDrivenGroupDefinition[],
): void {
  for (const group of groups) {
    runtime.describe(group.name, () => {
      for (const testCase of group.config) {
        runtime.it(testCase.name, async () => {
          if (!testCase.templates && typeof testCase.json === "undefined") {
            throw new Error(`Invalid test: ${testCase.name}`);
          }

          const payload =
            typeof testCase.json !== "undefined"
              ? testCase.json
              : extractSinglePayload(await context.createFromTemplate(testCase.templates ?? []));

          const response = await context.sendJsonRequest({
            method: testCase.method ?? "POST",
            path: testCase.path ?? context.getEndpointStatements(),
            json: payload,
          });

          if (!testCase.expect.includes(response.status)) {
            throw new Error(
              `Expected status ${testCase.expect.join(" or ")} for "${testCase.name}" but received ${response.status}.`,
            );
          }
        });
      }
    });
  }
}
