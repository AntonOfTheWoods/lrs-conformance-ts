import {
  registerStatementPostConfigSuite,
  type ConfigDrivenGroupDefinition,
} from "../../describe-runtime/config-suite.ts";
import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

const invalidDuration = "PA1H0M0S";
const invalidNumeric = 12345;
const invalidObject = { key: "invalid" };
const invalidString = "should fail";
const validDuration = "PT1H0M0.1S";
const validDecimalDigits = 0.6767676;
const validMaxDecimalDigits = 100.6767676;

const resultPropertyGroups: ConfigDrivenGroupDefinition[] = [
  {
    /**  XAPI-00074, Data 2.4.5 result
     * A "success" property is a Boolean.
     */
    name: 'A "success" property is a Boolean (Type, Data 2.4.5.s2.table1.row1, XAPI-00074)',
    config: [
      {
        name: 'statement result "success" property is string "true"',
        templates: [{ statement: "{{statements.result}}" }, { result: "{{results.default}}" }, { success: "true" }],
        expect: [400],
      },
      {
        name: 'statement result "success" property is string "false"',
        templates: [{ statement: "{{statements.result}}" }, { result: "{{results.default}}" }, { success: "false" }],
        expect: [400],
      },
      {
        name: 'statement substatement result "success" property is string "true"',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.result}}" },
          { result: "{{results.default}}" },
          { success: "true" },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement result "success" property is string "false"',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.result}}" },
          { result: "{{results.default}}" },
          { success: "false" },
        ],
        expect: [400],
      },
    ],
  },
  {
    /**  XAPI-00075, Data 2.4.5 result
     * A "completion" property is a Boolean.
     */
    name: 'A "completion" property is a Boolean (Type, Data 2.4.5.s2.table1.row2, XAPI-00075)',
    config: [
      {
        name: 'statement result "completion" property is string "true"',
        templates: [{ statement: "{{statements.result}}" }, { result: "{{results.default}}" }, { completion: "true" }],
        expect: [400],
      },
      {
        name: 'statement result "completion" property is string "false"',
        templates: [{ statement: "{{statements.result}}" }, { result: "{{results.default}}" }, { completion: "false" }],
        expect: [400],
      },
      {
        name: 'statement substatement result "completion" property is string "true"',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.result}}" },
          { result: "{{results.default}}" },
          { completion: "true" },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement result "completion" property is string "false"',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.result}}" },
          { result: "{{results.default}}" },
          { completion: "false" },
        ],
        expect: [400],
      },
    ],
  },
  {
    /**  XAPI-00076, Data 2.4.5 result
     * A "response" property is a String.
     */
    name: 'A "response" property is a String (Type, Data 2.4.5.s2.table1.row3, XAPI-00076)',
    config: [
      {
        name: 'statement result "response" property is numeric',
        templates: [
          { statement: "{{statements.result}}" },
          { result: "{{results.default}}" },
          { response: invalidNumeric },
        ],
        expect: [400],
      },
      {
        name: 'statement result "completion" property is object',
        templates: [
          { statement: "{{statements.result}}" },
          { result: "{{results.default}}" },
          { response: invalidObject },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement result "completion" property is numeric',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.result}}" },
          { result: "{{results.default}}" },
          { response: invalidNumeric },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement result "completion" property is object',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.result}}" },
          { result: "{{results.default}}" },
          { response: invalidObject },
        ],
        expect: [400],
      },
    ],
  },
  {
    /**  XAPI-00077, Data 2.4.5 result
     * A "duration" property is formatted to ISO 8601 durations.
     */
    name: 'A "duration" property is a formatted to ISO 8601 (Type, Data 2.4.5.s2.table1.row4, XAPI-00077)',
    config: [
      {
        name: 'statement result "duration" property is invalid',
        templates: [
          { statement: "{{statements.result}}" },
          { result: "{{results.default}}" },
          { duration: invalidDuration },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement result "duration" property is invalid',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.result}}" },
          { result: "{{results.default}}" },
          { duration: invalidDuration },
        ],
        expect: [400],
      },
      {
        name: 'statement result "duration" property is valid',
        templates: [
          { statement: "{{statements.result}}" },
          { result: "{{results.default}}" },
          { duration: validDuration },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement result "duration" property is valid',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.result}}" },
          { result: "{{results.default}}" },
          { duration: validDuration },
        ],
        expect: [200],
      },
      {
        name: 'statement result "duration" property is valid',
        templates: [
          { statement: "{{statements.result}}" },
          { result: "{{results.default}}" },
          { duration: "PT4H35M59.14S" },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement result "duration" property is valid',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.result}}" },
          { result: "{{results.default}}" },
          { duration: "PT16559.14S" },
        ],
        expect: [200],
      },
      {
        name: 'statement result "duration" property is valid',
        templates: [
          { statement: "{{statements.result}}" },
          { result: "{{results.default}}" },
          { duration: "P3Y1M29DT4H35M59.14S" },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement result "duration" property is valid',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.result}}" },
          { result: "{{results.default}}" },
          { duration: "P3Y" },
        ],
        expect: [200],
      },
      {
        name: 'statement result "duration" property is valid',
        templates: [{ statement: "{{statements.result}}" }, { result: "{{results.default}}" }, { duration: "P4W" }],
        expect: [200],
      },
    ],
  },
  {
    /**  XAPI-00078, Data 2.4.5 result
     * An "extensions" property is an Object.
     * Upstream config mutates duration here; preserve that executable surface verbatim.
     */
    name: 'An "extensions" property is an Object (Type, Data 2.4.5.s2.table1.row6, XAPI-00078)',
    config: [
      {
        name: 'statement result "extensions" property is numeric',
        templates: [
          { statement: "{{statements.result}}" },
          { result: "{{results.default}}" },
          { duration: invalidNumeric },
        ],
        expect: [400],
      },
      {
        name: 'statement result "extensions" property is string',
        templates: [
          { statement: "{{statements.result}}" },
          { result: "{{results.default}}" },
          { duration: invalidString },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement result "extensions" property is numeric',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.result}}" },
          { result: "{{results.default}}" },
          { duration: invalidNumeric },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement result "extensions" property is string',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.result}}" },
          { result: "{{results.default}}" },
          { duration: invalidString },
        ],
        expect: [400],
      },
    ],
  },
  {
    /**  XAPI-00079, Data 2.4.5.1 score
     * A "score" property is an Object.
     */
    name: 'A "score" property is an Object (Type, Data 2.4.5.1, XAPI-00079)',
    config: [
      {
        name: "statement result score numeric",
        templates: [
          { statement: "{{statements.result}}" },
          { result: "{{results.default}}" },
          { score: invalidNumeric },
        ],
        expect: [400],
      },
      {
        name: "statement result score string",
        templates: [
          { statement: "{{statements.result}}" },
          { result: "{{results.default}}" },
          { score: invalidString },
        ],
        expect: [400],
      },
      {
        name: "statement substatement result score numeric",
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.result}}" },
          { result: "{{results.default}}" },
          { score: invalidNumeric },
        ],
        expect: [400],
      },
      {
        name: "statement substatement result score string",
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.result}}" },
          { result: "{{results.default}}" },
          { score: invalidString },
        ],
        expect: [400],
      },
    ],
  },
  {
    /**  XAPI-00083, Data 2.4.5.1 score
     * If the "score" Object uses the "scaled" property, the value must be a decimal number between -1 and 1.
     */
    name: 'A "score" Object\'s "scaled" property is a decimal number between -1 and 1, inclusive. (Type, Data 2.4.5.1.s2.table1.row1, XAPI-00083)',
    config: [
      {
        name: 'statement result "scaled" accepts decimal',
        templates: [
          { statement: "{{statements.result}}" },
          { result: "{{results.default}}" },
          { score: { scaled: validDecimalDigits } },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement result "scaled" accepts decimal',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.result}}" },
          { result: "{{results.default}}" },
          { score: { scaled: validDecimalDigits } },
        ],
        expect: [200],
      },
      {
        name: 'statement result "scaled" should pass with value 1.0',
        templates: [
          { statement: "{{statements.result}}" },
          { result: "{{results.default}}" },
          { score: { scaled: 1.0 } },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement result "scaled" pass with value -1.0000',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.result}}" },
          { result: "{{results.default}}" },
          { score: { scaled: -1.0 } },
        ],
        expect: [200],
      },
      {
        name: 'statement result "scaled" should reject with value 1.01',
        templates: [
          { statement: "{{statements.result}}" },
          { result: "{{results.default}}" },
          { score: { scaled: 1.01 } },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement result "scaled" reject with value -1.00001',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.result}}" },
          { result: "{{results.default}}" },
          { score: { scaled: -1.00001 } },
        ],
        expect: [400],
      },
    ],
  },
  {
    /**  XAPI-00082, Data 2.4.5.1 score
     * If the "score" Object uses the "raw" property, the value must be a decimal number between the "min" and "max", if they are present.
     */
    name: 'A "score" Object\'s "raw" property is a decimal number between min and max, if present and otherwise unrestricted, inclusive (Type, Data 2.4.5.1.s2.table1.row2, XAPI-00082)',
    config: [
      {
        name: 'statement result "raw" accepts decimal',
        templates: [
          { statement: "{{statements.result}}" },
          { result: "{{results.default}}" },
          { score: { raw: validDecimalDigits } },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement result "raw" accepts decimal',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.result}}" },
          { result: "{{results.default}}" },
          { score: { raw: validDecimalDigits } },
        ],
        expect: [200],
      },
      {
        name: 'statement result "raw" rejects raw greater than max',
        templates: [
          { statement: "{{statements.result}}" },
          { result: "{{results.default}}" },
          { score: { raw: validDecimalDigits, max: validDecimalDigits - 0.02 } },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement result "raw" rejects raw greater than max',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.result}}" },
          { result: "{{results.default}}" },
          { score: { raw: validDecimalDigits, max: validDecimalDigits - 2 } },
        ],
        expect: [400],
      },
      {
        name: 'statement result "raw" rejects raw less than min',
        templates: [
          { statement: "{{statements.result}}" },
          { result: "{{results.default}}" },
          { score: { raw: validDecimalDigits, min: validDecimalDigits + 0.73 } },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement result "raw" rejects raw less than min',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.result}}" },
          { result: "{{results.default}}" },
          { score: { raw: validDecimalDigits, min: validDecimalDigits + 7 } },
        ],
        expect: [400],
      },
    ],
  },
  {
    /** XAPI-00081, Data 2.4.5.1 score
     * If the "score" Object uses the "min" property, the value must be a decimal number less than the "max" property, if it is present.
     */
    name: 'A "score" Object\'s "min" property is a decimal number less than the "max" property, if it is present. (Type, Data 2.4.5.1.s2.table1.row3, XAPI-00081)',
    config: [
      {
        name: 'statement result "min" accepts decimal',
        templates: [
          { statement: "{{statements.result}}" },
          { result: "{{results.default}}" },
          { score: { min: validDecimalDigits } },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement result "min" accepts decimal',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.result}}" },
          { result: "{{results.default}}" },
          { score: { min: validDecimalDigits } },
        ],
        expect: [200],
      },
      {
        name: 'statement result "min" rejects decimal number greater than "max"',
        templates: [
          { statement: "{{statements.result}}" },
          { result: "{{results.default}}" },
          {
            score: {
              min: validDecimalDigits,
              max: validDecimalDigits - 0.0000321,
              raw: validDecimalDigits - 0.0000033,
            },
          },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement result "min" rejects decimal number greater than "max"',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.result}}" },
          { result: "{{results.default}}" },
          { score: { min: validDecimalDigits, max: validDecimalDigits - 4, raw: validDecimalDigits - 1 } },
        ],
        expect: [400],
      },
    ],
  },
  {
    /**  XAPI-00080, Data 2.4.5.1 score
     * If the "score" Object uses the "max" property, the value must be a decimal number more than the "min" property, if it is present.
     */
    name: 'A "score" Object\'s "max" property is a Decimal accurate to seven significant decimal figures (Type, Data 2.4.5.1.s2.table1.row4, XAPI-00080)',
    config: [
      {
        name: 'statement result "max" accepts a decimal number more than the "min" property, if it is present.',
        templates: [
          { statement: "{{statements.result}}" },
          { result: "{{results.default}}" },
          { score: { max: validMaxDecimalDigits } },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement result "max" accepts a decimal number more than the "min" property, if it is present.',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.result}}" },
          { result: "{{results.default}}" },
          { score: { max: validMaxDecimalDigits } },
        ],
        expect: [200],
      },
      {
        name: 'statement result "max" accepts a decimal number more than the "min" property, if it is present.',
        templates: [
          { statement: "{{statements.result}}" },
          { result: "{{results.default}}" },
          { score: { max: validMaxDecimalDigits, min: validMaxDecimalDigits + 4, raw: validMaxDecimalDigits + 1 } },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement result "max" accepts a decimal number more than the "min" property, if it is present.',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.result}}" },
          { result: "{{results.default}}" },
          { score: { max: validMaxDecimalDigits, raw: validMaxDecimalDigits + 10, min: validMaxDecimalDigits + 100 } },
        ],
        expect: [400],
      },
    ],
  },
];

export function registerResultPropertyRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  runtime.describe("Result Property Requirements (Data 2.4.5)", () => {
    /**  Matchup with Conformance Requirements Document
     * Data 2.4.5 Result
     * XAPI-00074 - in results.js
     * XAPI-00075 - in results.js
     * XAPI-00076 - in results.js
     * XAPI-00077 - in results.js
     * XAPI-00078 - in results.js
     *
     * Data 2.4.5.1 Score
     * XAPI-00079 - in scores.js
     * XAPI-00080 - in scores.js
     * XAPI-00081 - in scores.js
     * XAPI-00082 - in scores.js
     * XAPI-00083 - in scores.js
     */
    registerStatementPostConfigSuite(runtime, context, resultPropertyGroups);
  });
}
