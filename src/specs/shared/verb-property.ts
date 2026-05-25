import {
  registerStatementPostConfigSuite,
  type ConfigDrivenGroupDefinition,
} from "../../describe-runtime/config-suite.ts";
import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

const invalidUri = "ab=c://should.fail.com";
const invalidLanguageMapNumeric = { display: 12345 };
const invalidLanguageMapString = { display: "a12345 attended" };

const verbPropertyGroups: ConfigDrivenGroupDefinition[] = [
  {
    /** XAPI-00044, Data 2.4.3 Verb
     * A "verb" object contains an "id" property which is required to be an IRI. An LRS rejects with 400 Bad Request if a statement uses the Verb Object and “id” is absent or “id” is present, but the value is an invalid IRI.
     * Covers this and next suite
     */
    name: 'A "verb" property contains an "id" property (Multiplicity, Data 2.4.3.s3.table1.row1, XAPI-00044)',
    config: [
      {
        name: 'statement verb missing "id"',
        templates: [{ statement: "{{statements.verb}}" }, { verb: "{{verbs.no_id}}" }],
        expect: [400],
      },
      {
        name: 'statement substatement verb missing "id"',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.verb}}" },
          { verb: "{{verbs.no_id}}" },
        ],
        expect: [400],
      },
    ],
  },
  {
    /** XAPI-00044, Data 2.4.3 Verb
     * A "verb" property's "id" property is an IRI.
     */
    name: 'A "verb" property\'s "id" property is an IRI (Type, Data 2.4.3.s3.table1.row1, XAPI-00044)',
    config: [
      {
        name: 'statement verb "id" not IRI',
        templates: [{ statement: "{{statements.verb}}" }, { verb: "{{verbs.default}}" }, { id: invalidUri }],
        expect: [400],
      },
      {
        name: 'statement substatement verb "id" not IRI',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.verb}}" },
          { verb: invalidUri },
        ],
        expect: [400],
      },
    ],
  },
  {
    /**  XAPI-00045, Data 2.4.3 Verb
     * A "verb" property's "display" property is a Language Map. An LRS rejects with 400 Bad Request if a statement uses the Verb Object’s “display” property and it is not a valid Language Map.
     */
    name: 'A "verb" property\'s "display" property is a Language Map (Type, Data 2.4.3.s3.table1.row2, XAPI-00045)',
    config: [
      {
        name: 'statement verb "display" is numeric',
        templates: [{ statement: "{{statements.verb}}" }, { verb: "{{verbs.default}}" }, invalidLanguageMapNumeric],
        expect: [400],
      },
      {
        name: 'statement verb "display" is string',
        templates: [{ statement: "{{statements.verb}}" }, { verb: "{{verbs.default}}" }, invalidLanguageMapString],
        expect: [400],
      },
      {
        name: 'statement substatement verb "display" is numeric',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.verb}}" },
          { verb: "{{verbs.default}}" },
          invalidLanguageMapNumeric,
        ],
        expect: [400],
      },
      {
        name: 'statement substatement verb "display" is string',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.verb}}" },
          { verb: "{{verbs.default}}" },
          invalidLanguageMapString,
        ],
        expect: [400],
      },
    ],
  },
];

export function registerVerbPropertyRequirementsSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  runtime.describe("Verb Property Requirements (Data 2.4.3)", () => {
    /**  Matchup with Conformance Requirements Document
     * XAPI-00044 - in verbs.js - two suites
     * XAPI-00045 - in verbs.js
     */
    registerStatementPostConfigSuite(runtime, context, verbPropertyGroups);
  });
}
