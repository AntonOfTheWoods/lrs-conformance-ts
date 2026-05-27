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

const invalidNumeric = 12345;
const invalidObject: JsonObject = { key: "should fail" };
const invalidUuidTooManyDigits = "AA97B177-9383-4934-8543-0F91A7A028368";
const invalidUuidInvalidLetter = "MA97B177-9383-4934-8543-0F91A7A02836";

const uuidPropertyGroups: ConfigDrivenGroupDefinition[] = [
  {
    /**  XAPI-00030, Data 2.4.1 Id
     * All UUID types follow requirements of RFC4122. An LRS rejects with 400 Bad Request a statement which has a property which is required to be a UUID and does not follow RFC4122.
     */
    /**  XAPI-00027, Data 2.4.1 Id
     * A Statement's "id" property is a UUID following RFC 4122. An LRS rejects with 400 Bad Request a statement which has an "id" and that "id" is invalid.
     */
    name: "All UUID types follow requirements of RFC4122 (Type, Data 2.4.1.s1, XAPI-00030, XAPI-00027)",
    config: [
      {
        name: 'statement "id" invalid UUID with too many digits',
        templates: [{ statement: "{{statements.default}}" }, { id: invalidUuidTooManyDigits }],
        expect: [400],
      },
      {
        name: 'statement "id" invalid UUID with non A-F',
        templates: [{ statement: "{{statements.default}}" }, { id: invalidUuidInvalidLetter }],
        expect: [400],
      },
      {
        name: 'statement object statementref "id" invalid UUID with too many digits',
        templates: [{ statement: "{{statements.object_statementref}}" }, { object: { id: invalidUuidTooManyDigits } }],
        expect: [400],
      },
      {
        name: 'statement object statementref "id" invalid UUID with non A-F',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.statementref}}" },
          { object: { id: invalidUuidInvalidLetter } },
        ],
        expect: [400],
      },
      {
        name: 'statement context "registration" invalid UUID with too many digits',
        templates: [
          { statement: "{{statements.context}}" },
          { context: "{{contexts.default}}" },
          { registration: invalidUuidTooManyDigits },
        ],
        expect: [400],
      },
      {
        name: 'statement context "registration" invalid UUID with non A-F',
        templates: [
          { statement: "{{statements.context}}" },
          { context: "{{contexts.default}}" },
          { registration: invalidUuidInvalidLetter },
        ],
        expect: [400],
      },
      {
        name: 'statement context "statement" invalid UUID with too many digits',
        templates: [
          { statement: "{{statements.object_statementref}}" },
          { context: "{{contexts.default}}" },
          { statement: { id: invalidUuidTooManyDigits } },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement context "statement" invalid UUID with non A-F',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.statementref}}" },
          { context: "{{contexts.default}}" },
          { statement: { id: invalidUuidInvalidLetter } },
        ],
        expect: [400],
      },
    ],
  },
  {
    /**  XAPI-00029, Data 2.4.1 Id
     * All UUID types are in standard String form. An LRS rejects with 400 Bad Request a statement which has a property which is required to be a UUID and that property is not in standard string form.
     */
    /**  XAPI-00028, Data 2.4.1 Id
     * A Statement's "id" property is a String. An LRS rejects with 400 Bad Request a statement which has an "id" and that property is not a string.
     */
    name: "All UUID types are in standard String form (Type, Data 2.4.1.s1, XAPI-00029, XAPI-00028)",
    config: [
      {
        name: 'statement "id" invalid numeric',
        templates: [{ statement: "{{statements.default}}" }, { id: invalidNumeric }],
        expect: [400],
      },
      {
        name: 'statement "id" invalid object',
        templates: [{ statement: "{{statements.default}}" }, { id: invalidObject }],
        expect: [400],
      },
      {
        name: 'statement object statementref "id" invalid numeric',
        templates: [{ statement: "{{statements.object_statementref}}" }, { object: { id: invalidNumeric } }],
        expect: [400],
      },
      {
        name: 'statement object statementref "id" invalid object',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.statementref}}" },
          { object: { id: invalidObject } },
        ],
        expect: [400],
      },
      {
        name: 'statement context "registration" invalid numeric',
        templates: [
          { statement: "{{statements.context}}" },
          { context: "{{contexts.default}}" },
          { registration: invalidNumeric },
        ],
        expect: [400],
      },
      {
        name: 'statement context "registration" invalid object',
        templates: [
          { statement: "{{statements.context}}" },
          { context: "{{contexts.default}}" },
          { registration: invalidObject },
        ],
        expect: [400],
      },
      {
        name: 'statement context "statement" invalid numeric',
        templates: [
          { statement: "{{statements.object_statementref}}" },
          { context: "{{contexts.default}}" },
          { statement: { id: invalidNumeric } },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement context "statement" invalid object',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.statementref}}" },
          { context: "{{contexts.default}}" },
          { statement: { id: invalidObject } },
        ],
        expect: [400],
      },
    ],
  },
];

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

    registerStatementPostConfigSuite(runtime, context, uuidPropertyGroups);
  });
}
