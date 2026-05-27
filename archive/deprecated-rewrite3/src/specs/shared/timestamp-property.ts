import {
  registerStatementPostConfigSuite,
  type ConfigDrivenGroupDefinition,
} from "../../describe-runtime/config-suite.ts";
import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

const invalidDate = "01/011/2015";
const invalidString = "should fail";

function createFutureTimestamp(): string {
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 5);
  return futureDate.toISOString();
}

const timestampPropertyGroups: ConfigDrivenGroupDefinition[] = [
  {
    /**  XAPI-00022, Data 2.4 Statement Properties
     * A "timestamp" property is a TimeStamp, per section 4.5. An LRS rejects with 400 Bad Request a statement if it has a TimeStamp and that TimeStamp is invalid.
     */
    name: 'A "timestamp" property is a TimeStamp (Type, Data 2.4.7, Data 2.4.s1.table1.row7, XAPI-00022)',
    config: [
      {
        name: 'statement "template" invalid string',
        templates: [{ statement: "{{statements.default}}" }, { timestamp: invalidString }],
        expect: [400],
      },
      {
        name: 'statement "template" invalid date',
        templates: [{ statement: "{{statements.default}}" }, { timestamp: invalidDate }],
        expect: [400],
      },
      {
        name: 'statement "template" future date',
        templates: [{ statement: "{{statements.default}}" }, { timestamp: createFutureTimestamp() }],
        expect: [200],
      },
      {
        name: 'substatement "template" invalid string',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{statements.default}}" },
          { timestamp: invalidString },
        ],
        expect: [400],
      },
      {
        name: 'substatement "template" invalid date',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{statements.default}}" },
          { timestamp: invalidDate },
        ],
        expect: [400],
      },
      {
        name: 'substatement "template" future date',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{statements.default}}" },
          { timestamp: createFutureTimestamp() },
        ],
        expect: [200],
      },
    ],
  },
];

export function registerTimestampPropertyRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  runtime.describe("Timestamp Property Requirements (Data 2.4.7)", () => {
    /**  Matchup with Conformance Requirements Document
     * XAPI-00022 - in timestamp_property.js
     */
    registerStatementPostConfigSuite(runtime, context, timestampPropertyGroups);
  });
}
