import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext, JsonResponse } from "../../describe-runtime/suite-context.ts";
import type { JsonObject, TemplateLayer } from "../../describe-runtime/templates.ts";

import { buildSignedStatementBody } from "./signed-statements.ts";

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseJsonObject(response: JsonResponse, name: string): JsonObject {
  const parsed = JSON.parse(response.bodyText) as unknown;
  if (!isJsonObject(parsed)) {
    throw new Error(`Expected ${name} to return a JSON object.`);
  }

  return parsed;
}

function getString(parent: JsonObject, key: string, name: string): string {
  const value = parent[key];
  if (typeof value !== "string") {
    throw new Error(`Expected ${name} to include string property ${key}.`);
  }

  return value;
}

async function createTemplateStatement(
  context: DescribeRuntimeContext,
  layers: TemplateLayer[],
  name: string,
): Promise<JsonObject> {
  const payload = await context.createFromTemplate(layers);
  const statement = payload.statement;
  if (!isJsonObject(statement)) {
    throw new Error(`Expected ${name} to create a statement object.`);
  }

  return structuredClone(statement);
}

async function createDefaultStatement(context: DescribeRuntimeContext, name: string): Promise<JsonObject> {
  return createTemplateStatement(context, [{ statement: "{{statements.default}}" }], name);
}

async function sendPutStatement(context: DescribeRuntimeContext, statement: JsonObject, name: string): Promise<void> {
  const statementId = context.generateUuid();
  statement.id = statementId;

  const response = await context.sendRequest({
    method: "PUT",
    path: context.getEndpointStatements(),
    query: { statementId },
    body: statement,
  });
  if (response.status !== 204) {
    throw new Error(`Expected ${name} to return 204, received ${response.status}.`);
  }
}

async function fetchExactStatement(
  context: DescribeRuntimeContext,
  statementId: string,
  name: string,
): Promise<JsonObject> {
  const response = await context.sendRequest({
    method: "GET",
    path: context.getEndpointStatements(),
    query: { statementId },
  });
  if (response.status !== 200) {
    throw new Error(`Expected ${name} to return 200, received ${response.status}.`);
  }

  return parseJsonObject(response, name);
}

const extensionVariants = [
  {
    label: "extensions can be empty object",
    layer: { extensions: {} } satisfies JsonObject,
  },
  {
    label: "extension values can be empty string",
    layer: { extensions: { "http://example.com/ex": "" } } satisfies JsonObject,
  },
  {
    label: "extension values can be null",
    layer: { extensions: { "http://example.com/ex": null } } satisfies JsonObject,
  },
  {
    label: "extension values can be empty object",
    layer: { extensions: { "http://example.com/ex": {} } } satisfies JsonObject,
  },
] as const;

function templateLayer(value: TemplateLayer): TemplateLayer {
  return value;
}

const extensionStatementCases: Array<{
  buildLayers: () => TemplateLayer[];
  titlePrefix: string;
  valueLayerKey: "definition" | "statement";
}> = [
  {
    buildLayers: () => [
      templateLayer({ statement: "{{statements.object_activity}}" }),
      templateLayer({ object: "{{activities.no_extensions}}" }),
    ],
    titlePrefix: "statement activity",
    valueLayerKey: "definition",
  },
  {
    buildLayers: () => [
      templateLayer({ statement: "{{statements.result}}" }),
      templateLayer({ result: "{{results.no_extensions}}" }),
    ],
    titlePrefix: "statement result",
    valueLayerKey: "statement",
  },
  {
    buildLayers: () => [
      templateLayer({ statement: "{{statements.context}}" }),
      templateLayer({ context: "{{contexts.no_extensions}}" }),
    ],
    titlePrefix: "statement context",
    valueLayerKey: "statement",
  },
  {
    buildLayers: () => [
      templateLayer({ statement: "{{statements.object_substatement}}" }),
      templateLayer({ object: "{{substatements.activity}}" }),
      templateLayer({ object: "{{activities.no_extensions}}" }),
    ],
    titlePrefix: "statement substatement activity",
    valueLayerKey: "definition",
  },
  {
    buildLayers: () => [
      templateLayer({ statement: "{{statements.object_substatement}}" }),
      templateLayer({ object: "{{substatements.result}}" }),
      templateLayer({ result: "{{results.no_extensions}}" }),
    ],
    titlePrefix: "statement substatement result",
    valueLayerKey: "statement",
  },
  {
    buildLayers: () => [
      templateLayer({ statement: "{{statements.object_substatement}}" }),
      templateLayer({ object: "{{substatements.context}}" }),
      templateLayer({ context: "{{contexts.no_extensions}}" }),
    ],
    titlePrefix: "statement substatement context",
    valueLayerKey: "statement",
  },
];

function buildExtensionLayers(
  baseLayers: readonly TemplateLayer[],
  valueLayerKey: "definition" | "statement",
  extensionLayer: JsonObject,
): TemplateLayer[] {
  if (valueLayerKey === "definition") {
    return [...baseLayers, { definition: extensionLayer }];
  }

  return [...baseLayers, extensionLayer];
}

export function registerSpecialDataTypesAndRulesSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  runtime.describe("Special Data Types and Rules (Data 4.0)", () => {
    runtime.describe(
      "An Extension can be null, an empty string, objects with nothing in them when using PUT. (Format, Data 4.1, XAPI-00119)",
      () => {
        for (const statementCase of extensionStatementCases) {
          for (const variant of extensionVariants) {
            runtime.it(`${statementCase.titlePrefix} ${variant.label}`, async () => {
              const statement = await createTemplateStatement(
                context,
                buildExtensionLayers(statementCase.buildLayers(), statementCase.valueLayerKey, variant.layer),
                `${statementCase.titlePrefix} ${variant.label}`,
              );
              await sendPutStatement(context, statement, `${statementCase.titlePrefix} ${variant.label}`);
            });
          }
        }
      },
    );

    runtime.describe(
      "A Timestamp MUST preserve precision to at least milliseconds, 3 decimal points beyond seconds. (Data 4.5.s1.b3, XAPI-00122)",
      () => {
        runtime.it("retrieve statements, test a timestamp property", async () => {
          const statement = await createDefaultStatement(context, "Timestamp precision statement");
          const statementId = context.generateUuid();
          statement.id = statementId;
          statement.timestamp = "2023-05-04T17:00:00.12345Z";

          const postResponse = await context.sendRequest({
            method: "POST",
            path: context.getEndpointStatements(),
            body: statement,
          });
          if (postResponse.status !== 200) {
            throw new Error(`Expected Timestamp precision POST to return 200, received ${postResponse.status}.`);
          }

          const storedStatement = await fetchExactStatement(context, statementId, "Timestamp precision exact GET");
          const storedTimestamp = getString(storedStatement, "timestamp", "Timestamp precision exact GET");
          if (!/\.\d{3,}Z$/.test(storedTimestamp)) {
            throw new Error("Expected retrieved timestamp to preserve at least millisecond precision.");
          }
        });

        runtime.it("retrieve statements, test a stored property", async () => {
          const statement = await createDefaultStatement(context, "Stored precision statement");
          const statementId = context.generateUuid();
          statement.id = statementId;

          const postResponse = await context.sendRequest({
            method: "POST",
            path: context.getEndpointStatements(),
            body: statement,
          });
          if (postResponse.status !== 200) {
            throw new Error(`Expected Stored precision POST to return 200, received ${postResponse.status}.`);
          }

          const storedStatement = await fetchExactStatement(context, statementId, "Stored precision exact GET");
          const storedTimestamp = getString(storedStatement, "stored", "Stored precision exact GET");
          if (!/\.\d{3,}Z$/.test(storedTimestamp)) {
            throw new Error("Expected retrieved stored timestamp to preserve at least millisecond precision.");
          }
        });
      },
    );
  });
}

export function registerAdditionalRequirementsForDataTypesSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  runtime.describe("(4.2.7) Additional Requirements for Data Types", () => {
    runtime.describe("IRIs", () => {
      runtime.it(
        "When storing or comparing IRIs, LRSs shall handle them only by using one or more of the approaches described in 5.3.1 (Simple String Comparison) and 5.3.2 (Syntax-Based Normalization) of RFC 3987",
        async () => {
          const slug = context.generateUuid();
          const iriA = `http://example.com/path/${slug}`;
          const iriB = `http://example.com/path/../${slug}`;
          const statement = await createDefaultStatement(context, "IRI comparison statement");
          statement.id = context.generateUuid();
          const object = statement.object;
          if (!isJsonObject(object)) {
            throw new Error("Expected IRI comparison statement to include an object.");
          }
          object.id = iriB;

          const postResponse = await context.sendRequest({
            method: "POST",
            path: context.getEndpointStatements(),
            body: statement,
          });
          if (postResponse.status !== 200) {
            throw new Error(`Expected IRI comparison POST to return 200, received ${postResponse.status}.`);
          }

          const responseA = await context.sendRequest({
            method: "GET",
            path: context.getEndpointActivities(),
            query: { activityId: iriA },
          });
          const responseB = await context.sendRequest({
            method: "GET",
            path: context.getEndpointActivities(),
            query: { activityId: iriB },
          });
          const activityA = parseJsonObject(responseA, "IRI comparison GET A");
          const activityB = parseJsonObject(responseB, "IRI comparison GET B");
          const matchesA = activityA.id === iriA;
          const matchesB = activityB.id === iriB;
          if (!matchesA && !matchesB) {
            throw new Error("Expected at least one retrieved activity to match the requested IRI.");
          }
        },
      );
    });

    runtime.describe("Duration", () => {
      runtime.it(
        "On receiving a Duration with more than 0.01 second precision, the LRS shall not reject the request.",
        async () => {
          const statement = await createDefaultStatement(context, "Duration precision acceptance statement");
          statement.id = context.generateUuid();
          statement.result = {
            duration: "P1DT12H36M0.12567S",
          };

          const postResponse = await context.sendRequest({
            method: "POST",
            path: context.getEndpointStatements(),
            body: statement,
          });
          if (postResponse.status !== 200) {
            throw new Error(`Expected Duration precision POST to return 200, received ${postResponse.status}.`);
          }
        },
      );

      runtime.it(
        "On receiving a Duration with more than 0.01 second precision, the LRS may truncate the duration to 0.01 second precision.",
        async () => {
          const duration = "P1DT12H36M0.12567S";
          const durationTruncated = "P1DT12H36M0.12S";
          const statement = await createDefaultStatement(context, "Duration truncation statement");
          const statementId = context.generateUuid();
          statement.id = statementId;
          statement.result = {
            duration,
          };

          const postResponse = await context.sendRequest({
            method: "POST",
            path: context.getEndpointStatements(),
            body: statement,
          });
          if (postResponse.status !== 200) {
            throw new Error(`Expected Duration truncation POST to return 200, received ${postResponse.status}.`);
          }

          const storedStatement = await fetchExactStatement(context, statementId, "Duration truncation exact GET");
          const result = storedStatement.result;
          if (!isJsonObject(result)) {
            throw new Error("Expected Duration truncation exact GET to include a result object.");
          }
          const receivedDuration = getString(result, "duration", "Duration truncation exact GET");
          if (receivedDuration !== duration && receivedDuration !== durationTruncated) {
            throw new Error(`Expected duration to remain ${duration} or truncate to ${durationTruncated}.`);
          }
        },
      );

      runtime.it(
        "When comparing Durations (or Statements containing them), any precision beyond 0.01 second precision shall not be included in the comparison.",
        async () => {
          const durationFull = "P1DT12H36M0.1237S";
          const durationShort = "P1DT12H36M0.12S";
          const statement = await createDefaultStatement(context, "Duration signed comparison statement");
          statement.id = context.generateUuid();
          statement.result = {
            duration: durationShort,
          };

          const signedStatement = buildSignedStatementBody(statement);
          const requestBody = signedStatement.body.replace(durationShort, durationFull);
          const response = await context.sendRequest({
            method: "POST",
            path: context.getEndpointStatements(),
            headers: {
              "Content-Type": `multipart/mixed; boundary=${signedStatement.boundary}`,
            },
            body: requestBody,
          });
          if (response.status !== 200) {
            throw new Error(`Expected Duration signed comparison POST to return 200, received ${response.status}.`);
          }
        },
      );
    });

    runtime.describe("Timestamps", () => {
      runtime.it("checks if the LRS converts timestamps to UTC", async () => {
        const statementId = context.generateUuid();
        const statement = await createDefaultStatement(context, "Timestamp UTC statement");
        statement.id = statementId;
        statement.timestamp = "2023-05-04T12:00:00-05:00";

        const postResponse = await context.sendRequest({
          method: "POST",
          path: context.getEndpointStatements(),
          body: statement,
        });
        if (postResponse.status !== 200) {
          throw new Error(`Expected Timestamp UTC POST to return 200, received ${postResponse.status}.`);
        }

        const storedStatement = await fetchExactStatement(context, statementId, "Timestamp UTC exact GET");
        const storedTimestamp = getString(storedStatement, "timestamp", "Timestamp UTC exact GET");
        if (Date.parse(storedTimestamp) !== Date.parse("2023-05-04T17:00:00.000Z")) {
          throw new Error(`Expected timestamp to normalize to UTC, received ${storedTimestamp}.`);
        }
      });
    });
  });
}
