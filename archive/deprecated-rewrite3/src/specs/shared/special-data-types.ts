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

async function sendPostStatementExpectStatus(
  context: DescribeRuntimeContext,
  statement: JsonObject,
  expectedStatus: number,
  name: string,
): Promise<void> {
  if (typeof statement.id !== "string") {
    statement.id = context.generateUuid();
  }

  const response = await context.sendRequest({
    method: "POST",
    path: context.getEndpointStatements(),
    body: statement,
  });
  if (response.status !== expectedStatus) {
    throw new Error(`Expected ${name} to return ${expectedStatus}, received ${response.status}.`);
  }
}

async function sendPostStatement(context: DescribeRuntimeContext, statement: JsonObject, name: string): Promise<void> {
  await sendPostStatementExpectStatus(context, statement, 200, name);
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

type ExtensionVariantKind = "emptyExtensions" | "emptyString" | "nullValue" | "emptyObject";
type ExtensionStatementCaseKey =
  | "activity"
  | "result"
  | "context"
  | "substatement-activity"
  | "substatement-result"
  | "substatement-context";

const extensionVariants: Array<{
  kind: ExtensionVariantKind;
  layer: JsonObject;
}> = [
  {
    kind: "emptyExtensions",
    layer: { extensions: {} } satisfies JsonObject,
  },
  {
    kind: "emptyString",
    layer: { extensions: { "http://example.com/ex": "" } } satisfies JsonObject,
  },
  {
    kind: "nullValue",
    layer: { extensions: { "http://example.com/ex": null } } satisfies JsonObject,
  },
  {
    kind: "emptyObject",
    layer: { extensions: { "http://example.com/ex": {} } } satisfies JsonObject,
  },
];

const validExtensionVariants = [
  {
    label: "extensions valid boolean",
    layer: { extensions: { "http://example.com/ex": true } } satisfies JsonObject,
  },
  {
    label: "extensions valid numeric",
    layer: { extensions: { "http://example.com/ex": 12345 } } satisfies JsonObject,
  },
  {
    label: "extensions valid object",
    layer: { extensions: { "http://example.com/ex": { key: "valid" } } } satisfies JsonObject,
  },
  {
    label: "extensions valid string",
    layer: { extensions: { "http://example.com/ex": "valid" } } satisfies JsonObject,
  },
] as const;

const invalidExtensionKeyLayer = { extensions: { "should fail": true } } satisfies JsonObject;
const invalidLanguageMap = { a12345678: "should error" } satisfies JsonObject;
const invalidDescriptionLanguageLayer = { description: invalidLanguageMap } satisfies JsonObject;
const invalidDisplayLanguageLayer = { display: invalidLanguageMap } satisfies JsonObject;
const invalidNameLanguageLayer = { name: invalidLanguageMap } satisfies JsonObject;
const validAttachmentDisplayLanguageLayer = { display: { "en-US": "A test attachment" } } satisfies JsonObject;
const invalidDuration = "PA1H0M0S";
const invalidDurationNumber = 12345;
const invalidDurationObject = { key: "invalid" } satisfies JsonObject;
const invalidDurationString = "should fail";
const validDuration = "PT1H0M0.1S";
const invalidTimestampDate = "01/011/2015";
const invalidTimestampString = "should fail";
const invalidTimestampNegativeZeroHour = "2008-09-15T15:53:00.601-00";
const invalidTimestampNegativeZeroBasic = "2008-09-15T15:53:00.601-0000";
const invalidTimestampNegativeZeroExtended = "2008-09-15T15:53:00.601-00:00";
const validTimestampRfc3339 = "2008-09-15T15:53:00.601+00:00";

interface TemplateStatusCase {
  title: string;
  layers: TemplateLayer[];
  expectedStatus: number;
}

interface TimestampValidationCase {
  title: string;
  target: "statement" | "substatement";
  timestamp: string;
  expectedStatus: number;
}

function templateLayer(value: TemplateLayer): TemplateLayer {
  return value;
}

const extensionStatementCases: Array<{
  caseKey: ExtensionStatementCaseKey;
  buildLayers: () => TemplateLayer[];
  titlePrefix: string;
  valueLayerKey: "definition" | "statement";
}> = [
  {
    caseKey: "activity",
    buildLayers: () => [
      templateLayer({ statement: "{{statements.object_activity}}" }),
      templateLayer({ object: "{{activities.no_extensions}}" }),
    ],
    titlePrefix: "statement activity",
    valueLayerKey: "definition",
  },
  {
    caseKey: "result",
    buildLayers: () => [
      templateLayer({ statement: "{{statements.result}}" }),
      templateLayer({ result: "{{results.no_extensions}}" }),
    ],
    titlePrefix: "statement result",
    valueLayerKey: "statement",
  },
  {
    caseKey: "context",
    buildLayers: () => [
      templateLayer({ statement: "{{statements.context}}" }),
      templateLayer({ context: "{{contexts.no_extensions}}" }),
    ],
    titlePrefix: "statement context",
    valueLayerKey: "statement",
  },
  {
    caseKey: "substatement-activity",
    buildLayers: () => [
      templateLayer({ statement: "{{statements.object_substatement}}" }),
      templateLayer({ object: "{{substatements.activity}}" }),
      templateLayer({ object: "{{activities.no_extensions}}" }),
    ],
    titlePrefix: "statement substatement activity",
    valueLayerKey: "definition",
  },
  {
    caseKey: "substatement-result",
    buildLayers: () => [
      templateLayer({ statement: "{{statements.object_substatement}}" }),
      templateLayer({ object: "{{substatements.result}}" }),
      templateLayer({ result: "{{results.no_extensions}}" }),
    ],
    titlePrefix: "statement substatement result",
    valueLayerKey: "statement",
  },
  {
    caseKey: "substatement-context",
    buildLayers: () => [
      templateLayer({ statement: "{{statements.object_substatement}}" }),
      templateLayer({ object: "{{substatements.context}}" }),
      templateLayer({ context: "{{contexts.no_extensions}}" }),
    ],
    titlePrefix: "statement substatement context",
    valueLayerKey: "statement",
  },
];

const extensionObjectStatementCases: Array<{
  buildLayers: () => TemplateLayer[];
  titlePrefix: string;
  valueLayerKey: "definition" | "statement";
}> = [
  {
    buildLayers: () => [
      templateLayer({ statement: "{{statements.object_activity}}" }),
      templateLayer({ object: "{{activities.default}}" }),
    ],
    titlePrefix: "statement activity",
    valueLayerKey: "definition",
  },
  {
    buildLayers: () => [
      templateLayer({ statement: "{{statements.result}}" }),
      templateLayer({ result: "{{results.default}}" }),
    ],
    titlePrefix: "statement result",
    valueLayerKey: "statement",
  },
  {
    buildLayers: () => [
      templateLayer({ statement: "{{statements.context}}" }),
      templateLayer({ context: "{{contexts.default}}" }),
    ],
    titlePrefix: "statement context",
    valueLayerKey: "statement",
  },
  {
    buildLayers: () => [
      templateLayer({ statement: "{{statements.object_substatement}}" }),
      templateLayer({ object: "{{substatements.activity}}" }),
      templateLayer({ object: "{{activities.default}}" }),
    ],
    titlePrefix: "statement substatement activity",
    valueLayerKey: "definition",
  },
  {
    buildLayers: () => [
      templateLayer({ statement: "{{statements.object_substatement}}" }),
      templateLayer({ object: "{{substatements.result}}" }),
      templateLayer({ result: "{{results.default}}" }),
    ],
    titlePrefix: "statement substatement result",
    valueLayerKey: "statement",
  },
  {
    buildLayers: () => [
      templateLayer({ statement: "{{statements.object_substatement}}" }),
      templateLayer({ object: "{{substatements.context}}" }),
      templateLayer({ context: "{{contexts.default}}" }),
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

function buildExtensionAcceptanceLayers(
  statementCase: {
    caseKey: ExtensionStatementCaseKey;
    buildLayers: () => TemplateLayer[];
    valueLayerKey: "definition" | "statement";
  },
  variantKind: ExtensionVariantKind,
  method: "POST" | "PUT",
  extensionLayer: JsonObject,
): TemplateLayer[] {
  if (method === "PUT" && statementCase.caseKey === "substatement-result" && variantKind === "nullValue") {
    return buildExtensionLayers(
      [
        templateLayer({ statement: "{{statements.object_substatement}}" }),
        templateLayer({ object: "{{substatements.activity}}" }),
        templateLayer({ object: "{{activities.no_extensions}}" }),
      ],
      "definition",
      extensionLayer,
    );
  }

  return buildExtensionLayers(statementCase.buildLayers(), statementCase.valueLayerKey, extensionLayer);
}

function getSubStatementObject(statement: JsonObject, name: string): JsonObject {
  const object = statement.object;
  if (!isJsonObject(object)) {
    throw new Error(`Expected ${name} to include a substatement object.`);
  }

  return object;
}

async function createTemplateStatementAndPostExpectStatus(
  context: DescribeRuntimeContext,
  layers: TemplateLayer[],
  expectedStatus: number,
  name: string,
  mutate?: (statement: JsonObject) => void,
): Promise<void> {
  const statement = await createTemplateStatement(context, layers, name);
  mutate?.(statement);
  await sendPostStatementExpectStatus(context, statement, expectedStatus, name);
}

function getLanguageMapValidationCases(): TemplateStatusCase[] {
  return [
    {
      title: 'statement verb "display" language map invalid',
      layers: [
        templateLayer({ statement: "{{statements.verb}}" }),
        templateLayer({ verb: "{{verbs.no_display}}" }),
        invalidDisplayLanguageLayer,
      ],
      expectedStatus: 400,
    },
    {
      title: 'statement object "name" language map invalid',
      layers: [
        templateLayer({ statement: "{{statements.object_activity}}" }),
        templateLayer({ object: "{{activities.no_languages}}" }),
        templateLayer({ definition: invalidNameLanguageLayer }),
      ],
      expectedStatus: 400,
    },
    {
      title: 'statement object "description" language map invalid',
      layers: [
        templateLayer({ statement: "{{statements.object_activity}}" }),
        templateLayer({ object: "{{activities.no_languages}}" }),
        templateLayer({ definition: invalidDescriptionLanguageLayer }),
      ],
      expectedStatus: 400,
    },
    {
      title: 'statement attachment "display" language map invalid',
      layers: [
        templateLayer({ statement: "{{statements.attachment}}" }),
        {
          attachments: [
            {
              usageType: "http://example.com/attachment-usage/test",
              display: invalidLanguageMap,
              contentType: "text/plain; charset=ascii",
              length: 27,
              sha2: "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
              fileUrl: "http://over.there.com/file.txt",
            },
          ],
        },
      ],
      expectedStatus: 400,
    },
    {
      title: 'statement attachment "description" language map invalid',
      layers: [
        templateLayer({ statement: "{{statements.attachment}}" }),
        {
          attachments: [
            {
              usageType: "http://example.com/attachment-usage/test",
              ...validAttachmentDisplayLanguageLayer,
              description: invalidLanguageMap,
              contentType: "text/plain; charset=ascii",
              length: 27,
              sha2: "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
              fileUrl: "http://over.there.com/file.txt",
            },
          ],
        },
      ],
      expectedStatus: 400,
    },
    {
      title: 'statement substatement verb "display" language map invalid',
      layers: [
        templateLayer({ statement: "{{statements.object_substatement}}" }),
        templateLayer({ object: "{{substatements.verb}}" }),
        templateLayer({ verb: "{{verbs.no_display}}" }),
        invalidDisplayLanguageLayer,
      ],
      expectedStatus: 400,
    },
    {
      title: 'statement substatement activity "name" language map invalid',
      layers: [
        templateLayer({ statement: "{{statements.object_substatement}}" }),
        templateLayer({ object: "{{substatements.activity}}" }),
        templateLayer({ object: "{{activities.no_languages}}" }),
        templateLayer({ definition: invalidNameLanguageLayer }),
      ],
      expectedStatus: 400,
    },
    {
      title: 'statement substatement activity "description" language map invalid',
      layers: [
        templateLayer({ statement: "{{statements.object_substatement}}" }),
        templateLayer({ object: "{{substatements.activity}}" }),
        templateLayer({ object: "{{activities.no_languages}}" }),
        templateLayer({ definition: invalidDescriptionLanguageLayer }),
      ],
      expectedStatus: 400,
    },
  ];
}

function getDurationValidationCases(): TemplateStatusCase[] {
  return [
    {
      title: 'Statement result "duration" property is valid',
      layers: [
        templateLayer({ statement: "{{statements.result}}" }),
        templateLayer({ result: "{{results.default}}" }),
        templateLayer({ duration: validDuration }),
      ],
      expectedStatus: 200,
    },
    {
      title: 'Statement substatement result "duration" property is valid',
      layers: [
        templateLayer({ statement: "{{statements.object_substatement}}" }),
        templateLayer({ object: "{{substatements.result}}" }),
        templateLayer({ result: "{{results.default}}" }),
        templateLayer({ duration: validDuration }),
      ],
      expectedStatus: 200,
    },
    {
      title: 'statement result "duration" property is invalid with invalid string',
      layers: [
        templateLayer({ statement: "{{statements.result}}" }),
        templateLayer({ result: "{{results.default}}" }),
        templateLayer({ duration: invalidDurationString }),
      ],
      expectedStatus: 400,
    },
    {
      title: 'statement substatement result "duration" property is invalid',
      layers: [
        templateLayer({ statement: "{{statements.object_substatement}}" }),
        templateLayer({ object: "{{substatements.result}}" }),
        templateLayer({ result: "{{results.default}}" }),
        templateLayer({ duration: invalidDurationString }),
      ],
      expectedStatus: 400,
    },
    {
      title: 'statement result "duration" property is invalid with invalid number',
      layers: [
        templateLayer({ statement: "{{statements.result}}" }),
        templateLayer({ result: "{{results.default}}" }),
        templateLayer({ duration: invalidDurationNumber }),
      ],
      expectedStatus: 400,
    },
    {
      title: 'statement substatement result "duration" property is invalid invalid number',
      layers: [
        templateLayer({ statement: "{{statements.object_substatement}}" }),
        templateLayer({ object: "{{substatements.result}}" }),
        templateLayer({ result: "{{results.default}}" }),
        templateLayer({ duration: invalidDurationNumber }),
      ],
      expectedStatus: 400,
    },
    {
      title: 'statement result "duration" property is invalid with invalid object',
      layers: [
        templateLayer({ statement: "{{statements.result}}" }),
        templateLayer({ result: "{{results.default}}" }),
        templateLayer({ duration: invalidDurationObject }),
      ],
      expectedStatus: 400,
    },
    {
      title: 'statement substatement result "duration" property is invalid with invalid object',
      layers: [
        templateLayer({ statement: "{{statements.object_substatement}}" }),
        templateLayer({ object: "{{substatements.result}}" }),
        templateLayer({ result: "{{results.default}}" }),
        templateLayer({ duration: invalidDurationObject }),
      ],
      expectedStatus: 400,
    },
    {
      title: 'statement result "duration" property is invalid with invalid duration',
      layers: [
        templateLayer({ statement: "{{statements.result}}" }),
        templateLayer({ result: "{{results.default}}" }),
        templateLayer({ duration: invalidDuration }),
      ],
      expectedStatus: 400,
    },
    {
      title: 'statement substatement result "duration" property is invalid with invalid duration',
      layers: [
        templateLayer({ statement: "{{statements.object_substatement}}" }),
        templateLayer({ object: "{{substatements.result}}" }),
        templateLayer({ result: "{{results.default}}" }),
        templateLayer({ duration: invalidDuration }),
      ],
      expectedStatus: 400,
    },
    {
      title: 'statement result "duration" property is valid with "PT4H35M59.14S"',
      layers: [
        templateLayer({ statement: "{{statements.result}}" }),
        templateLayer({ result: "{{results.default}}" }),
        templateLayer({ duration: "PT4H35M59.14S" }),
      ],
      expectedStatus: 200,
    },
    {
      title: 'statement substatement result "duration" property is valid with "PT16559.14S"',
      layers: [
        templateLayer({ statement: "{{statements.object_substatement}}" }),
        templateLayer({ object: "{{substatements.result}}" }),
        templateLayer({ result: "{{results.default}}" }),
        templateLayer({ duration: "PT16559.14S" }),
      ],
      expectedStatus: 200,
    },
    {
      title: 'statement result "duration" property is valid with "P3Y1M29DT4H35M59.14S"',
      layers: [
        templateLayer({ statement: "{{statements.result}}" }),
        templateLayer({ result: "{{results.default}}" }),
        templateLayer({ duration: "P3Y1M29DT4H35M59.14S" }),
      ],
      expectedStatus: 200,
    },
    {
      title: 'statement substatement result "duration" property is valid with "P3Y"',
      layers: [
        templateLayer({ statement: "{{statements.object_substatement}}" }),
        templateLayer({ object: "{{substatements.result}}" }),
        templateLayer({ result: "{{results.default}}" }),
        templateLayer({ duration: "P3Y" }),
      ],
      expectedStatus: 200,
    },
    {
      title: 'statement result "duration" property is valid with "P4W"',
      layers: [
        templateLayer({ statement: "{{statements.result}}" }),
        templateLayer({ result: "{{results.default}}" }),
        templateLayer({ duration: "P4W" }),
      ],
      expectedStatus: 200,
    },
    {
      title: 'statement result "duration" property is invalid with "P4W1D"',
      layers: [
        templateLayer({ statement: "{{statements.result}}" }),
        templateLayer({ result: "{{results.default}}" }),
        templateLayer({ duration: "P4W1D" }),
      ],
      expectedStatus: 400,
    },
  ];
}

function getTimestampValidationCases(version: string): TimestampValidationCase[] {
  const statementNegativeZeroLabel = version === "1.0.3" ? "statement timestmap" : "statement timestamp";

  const cases: TimestampValidationCase[] = [
    {
      title: 'statement "template" invalid string in timestamp',
      target: "statement",
      timestamp: invalidTimestampString,
      expectedStatus: 400,
    },
    {
      title: 'statement "template" invalid date in timestamp',
      target: "statement",
      timestamp: invalidTimestampDate,
      expectedStatus: 400,
    },
    {
      title: `statement "template" invalid date in timestamp: did not reject ${statementNegativeZeroLabel} with -00 offset`,
      target: "statement",
      timestamp: invalidTimestampNegativeZeroHour,
      expectedStatus: 400,
    },
    {
      title: `statement "template" invalid date in timestamp: did not reject ${statementNegativeZeroLabel} with -0000 offset`,
      target: "statement",
      timestamp: invalidTimestampNegativeZeroBasic,
      expectedStatus: 400,
    },
    {
      title: `statement "template" invalid date in timestamp: did not reject ${statementNegativeZeroLabel} with -00:00 offset`,
      target: "statement",
      timestamp: invalidTimestampNegativeZeroExtended,
      expectedStatus: 400,
    },
    {
      title: 'substatement "template" invalid string in timestamp',
      target: "substatement",
      timestamp: invalidTimestampString,
      expectedStatus: 400,
    },
    {
      title: 'substatement "template" invalid date in timestamp',
      target: "substatement",
      timestamp: invalidTimestampDate,
      expectedStatus: 400,
    },
    {
      title: 'substatement "template" invalid date in timestamp: did not reject substatement timestamp with -00 offset',
      target: "substatement",
      timestamp: invalidTimestampNegativeZeroHour,
      expectedStatus: 400,
    },
    {
      title:
        version === "1.0.3"
          ? 'substatement "template" invalid date in timestamp: did not reject substatement timestamp with  -0000 offset'
          : 'substatement "template" invalid date in timestamp: did not reject substatement timestamp with -0000 offset',
      target: "substatement",
      timestamp: invalidTimestampNegativeZeroBasic,
      expectedStatus: 400,
    },
    {
      title:
        version === "1.0.3"
          ? 'substatement "template" invalid date in timestamp: did not reject substatement timestamp with  -00:00 offset'
          : 'substatement "template" invalid date in timestamp: did not reject substatement timestamp with -00:00 offset',
      target: "substatement",
      timestamp: invalidTimestampNegativeZeroExtended,
      expectedStatus: 400,
    },
  ];

  if (version === "2.0.0") {
    cases.splice(5, 0, {
      title: 'Statement "template" valid RFC 3339 date in timestamp',
      target: "statement",
      timestamp: validTimestampRfc3339,
      expectedStatus: 200,
    });
    cases.push({
      title: 'Substatement "template" valid RFC 3339 date in timestamp',
      target: "substatement",
      timestamp: validTimestampRfc3339,
      expectedStatus: 200,
    });
  }

  return cases;
}

function getExtensionAcceptanceTitle(
  statementCase: { caseKey: ExtensionStatementCaseKey; titlePrefix: string },
  variantKind: ExtensionVariantKind,
  method: "POST" | "PUT",
): string {
  if (variantKind === "emptyExtensions") {
    return `${statementCase.titlePrefix} extensions can be empty object`;
  }

  const useExtensionsLabel =
    (method === "POST" &&
      (statementCase.caseKey === "context" ||
        statementCase.caseKey === "substatement-result" ||
        statementCase.caseKey === "substatement-context")) ||
    (method === "PUT" && statementCase.caseKey === "activity" && variantKind === "emptyObject");

  const valueLabel =
    variantKind === "emptyString" ? "empty string" : variantKind === "nullValue" ? "null" : "empty object";
  const prefix = useExtensionsLabel ? "extensions can be" : "extension values can be";
  return `${statementCase.titlePrefix} ${prefix} ${valueLabel}`;
}

export function registerSpecialDataTypesAndRulesSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  runtime.describe("Special Data Types and Rules (Data 4.0)", () => {
    runtime.describe(
      'An Extension is defined as an Object of any "extensions" property (Multiplicity, Data 4.1.s2, XAPI-00120)',
      () => {
        for (const statementCase of extensionObjectStatementCases) {
          for (const variant of validExtensionVariants) {
            runtime.it(`${statementCase.titlePrefix} ${variant.label}`, async () => {
              const statement = await createTemplateStatement(
                context,
                buildExtensionLayers(statementCase.buildLayers(), statementCase.valueLayerKey, variant.layer),
                `${statementCase.titlePrefix} ${variant.label}`,
              );
              await sendPostStatement(context, statement, `${statementCase.titlePrefix} ${variant.label}`);
            });
          }
        }
      },
    );

    runtime.describe(
      "An Extension can be null, an empty string, objects with nothing in them when using POST. (Format, Data 4.1, XAPI-00119)",
      () => {
        for (const statementCase of extensionStatementCases) {
          for (const variant of extensionVariants) {
            const title = getExtensionAcceptanceTitle(statementCase, variant.kind, "POST");
            runtime.it(title, async () => {
              const statement = await createTemplateStatement(
                context,
                buildExtensionAcceptanceLayers(statementCase, variant.kind, "POST", variant.layer),
                title,
              );
              await sendPostStatement(context, statement, title);
            });
          }
        }
      },
    );

    runtime.describe(
      "An Extension can be null, an empty string, objects with nothing in them when using PUT. (Format, Data 4.1, XAPI-00119)",
      () => {
        for (const statementCase of extensionStatementCases) {
          for (const variant of extensionVariants) {
            const title = getExtensionAcceptanceTitle(statementCase, variant.kind, "PUT");
            runtime.it(title, async () => {
              const statement = await createTemplateStatement(
                context,
                buildExtensionAcceptanceLayers(statementCase, variant.kind, "PUT", variant.layer),
                title,
              );
              await sendPutStatement(context, statement, title);
            });
          }
        }
      },
    );

    runtime.describe('An Extension "key" is an IRI (Format, Data 4.1.s3.b1, XAPI-00118)', () => {
      for (const statementCase of extensionObjectStatementCases) {
        const title = `${statementCase.titlePrefix} extensions key is not an IRI`;
        runtime.it(title, async () => {
          await createTemplateStatementAndPostExpectStatus(
            context,
            buildExtensionLayers(statementCase.buildLayers(), statementCase.valueLayerKey, invalidExtensionKeyLayer),
            400,
            title,
          );
        });
      }
    });

    runtime.describe("A Language Map follows RFC5646 (Format, Data 4.2.s1, RFC5646, XAPI-00121)", () => {
      for (const testCase of getLanguageMapValidationCases()) {
        runtime.it(testCase.title, async () => {
          await createTemplateStatementAndPostExpectStatus(
            context,
            testCase.layers,
            testCase.expectedStatus,
            testCase.title,
          );
        });
      }
    });

    runtime.describe(
      "A TimeStamp is defined as a Date/Time formatted according to ISO 8601 (Format, Data 4.5.s1.b1, ISO8601, XAPI-00123)",
      () => {
        for (const testCase of getTimestampValidationCases(context.options.xapiVersion)) {
          runtime.it(testCase.title, async () => {
            await createTemplateStatementAndPostExpectStatus(
              context,
              [
                templateLayer({
                  statement:
                    testCase.target === "statement"
                      ? "{{statements.default}}"
                      : "{{statements.object_substatement_default}}",
                }),
              ],
              testCase.expectedStatus,
              testCase.title,
              (statement) => {
                if (testCase.target === "statement") {
                  statement.timestamp = testCase.timestamp;
                  return;
                }

                const subStatement = getSubStatementObject(statement, testCase.title);
                subStatement.timestamp = testCase.timestamp;
              },
            );
          });
        }
      },
    );

    runtime.describe(
      "A Timestamp MUST preserve precision to at least milliseconds, 3 decimal points beyond seconds. (Data 4.5.s1.b3, XAPI-00122)",
      () => {
        runtime.it("retrieve statements, test a timestamp property", async () => {
          const response = await context.sendRequest({
            method: "GET",
            path: context.getEndpointStatements(),
          });
          if (response.status !== 200) {
            throw new Error(`Expected Timestamp precision GET to return 200, received ${response.status}.`);
          }

          const result = parseJsonObject(response, "Timestamp precision GET");
          const statements = result.statements;
          if (!Array.isArray(statements) || statements.length === 0) {
            throw new Error("Expected Timestamp precision GET to return one or more statements.");
          }

          let foundSubTenMillisecondDigit = false;
          for (const value of statements) {
            if (!isJsonObject(value)) {
              throw new Error("Expected Timestamp precision GET statements to be objects.");
            }
            const timestamp = getString(value, "timestamp", "Timestamp precision statement");
            if (Number.isNaN(Date.parse(timestamp))) {
              throw new Error(`Expected timestamp to be valid ISO 8601, received ${timestamp}.`);
            }
            const fraction = timestamp.match(/\.(\d+)(?:Z|[+-]\d{2}:?\d{2})$/)?.[1];
            if (!fraction || fraction.length < 3) {
              throw new Error(`Expected timestamp to include at least millisecond precision, received ${timestamp}.`);
            }
            const milliseconds = Number.parseInt(fraction.slice(0, 3), 10);
            if (!Number.isNaN(milliseconds) && milliseconds % 10 > 0) {
              foundSubTenMillisecondDigit = true;
              break;
            }
          }

          if (!foundSubTenMillisecondDigit) {
            throw new Error(
              "Expected at least one retrieved timestamp to preserve precision beyond a trailing zero millisecond digit.",
            );
          }
        });

        runtime.it("retrieve statements, test a stored property", async () => {
          const response = await context.sendRequest({
            method: "GET",
            path: context.getEndpointStatements(),
          });
          if (response.status !== 200) {
            throw new Error(`Expected Stored precision GET to return 200, received ${response.status}.`);
          }

          const result = parseJsonObject(response, "Stored precision GET");
          const statements = result.statements;
          if (!Array.isArray(statements) || statements.length === 0) {
            throw new Error("Expected Stored precision GET to return one or more statements.");
          }

          let foundSubTenMillisecondDigit = false;
          for (const value of statements) {
            if (!isJsonObject(value)) {
              throw new Error("Expected Stored precision GET statements to be objects.");
            }
            const stored = getString(value, "stored", "Stored precision statement");
            if (Number.isNaN(Date.parse(stored))) {
              throw new Error(`Expected stored to be valid ISO 8601, received ${stored}.`);
            }
            const fraction = stored.match(/\.(\d+)(?:Z|[+-]\d{2}:?\d{2})$/)?.[1];
            if (!fraction || fraction.length < 3) {
              throw new Error(`Expected stored to include at least millisecond precision, received ${stored}.`);
            }
            const milliseconds = Number.parseInt(fraction.slice(0, 3), 10);
            if (!Number.isNaN(milliseconds) && milliseconds % 10 > 0) {
              foundSubTenMillisecondDigit = true;
              break;
            }
          }

          if (!foundSubTenMillisecondDigit) {
            throw new Error(
              "Expected at least one retrieved stored timestamp to preserve precision beyond a trailing zero millisecond digit.",
            );
          }
        });
      },
    );

    runtime.describe(
      "A Duration MUST be expressed using the format for Duration in ISO 8601:2004(E) section 4.4.3.2. (Type, Data 4.6.s1.b1, XAPI-00124)",
      () => {
        for (const testCase of getDurationValidationCases()) {
          runtime.it(testCase.title, async () => {
            await createTemplateStatementAndPostExpectStatus(
              context,
              testCase.layers,
              testCase.expectedStatus,
              testCase.title,
            );
          });
        }
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
