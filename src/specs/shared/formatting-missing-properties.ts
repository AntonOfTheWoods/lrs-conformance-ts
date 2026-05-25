import type { ConfigDrivenGroupDefinition } from "../../describe-runtime/config-suite.ts";

export interface FormattingQueryValidationCase {
  name: string;
  query: Record<string, string>;
  expect: number;
}

export const formattingMissingPropertyGroups: ConfigDrivenGroupDefinition[] = [
  {
    /**  XAPI-00003, 2.2 Formatting Requirements
     * An LRS rejects with error code 400 Bad Request a Statement which does not contain an "actor" property
     */
    name: 'A Statement contains an "actor" property (Multiplicity, Data 2.2.s2.b3, XAPI-00003)',
    config: [
      {
        name: 'statement "actor" missing',
        templates: [{ statement: "{{statements.no_actor}}" }],
        expect: [400],
      },
    ],
  },
  {
    /**  XAPI-00004, 2.2 Formatting Requirements
     * An LRS rejects with error code 400 Bad Request a Statement which does not contain a "verb" property
     */
    name: 'A Statement contains a "verb" property (Multiplicity, Data 2.2.s2.b3, XAPI-00004)',
    config: [
      {
        name: 'statement "verb" missing',
        templates: [{ statement: "{{statements.no_verb}}" }],
        expect: [400],
      },
    ],
  },
  {
    /**  XAPI-00005, 2.2 Formatting Requirements
     * An LRS rejects with error code 400 Bad Request a Statement which does not contain an "object" property
     */
    name: 'A Statement contains an "object" property (Multiplicity, Data 2.2.s2.b3, XAPI-00005)',
    config: [
      {
        name: 'statement "object" missing',
        templates: [{ statement: "{{statements.no_object}}" }],
        expect: [400],
      },
    ],
  },
];

export const formattingWrongTypeGroups: ConfigDrivenGroupDefinition[] = [
  {
    /**  XAPI-00006, Data 2.2 Formatting Requirements
     * An LRS rejects with error code 400 Bad Request a Statement which uses the wrong data type
     */
    name: "An LRS rejects with error code 400 Bad Request a Statement which uses the wrong data type (Data 2.2.s4.b2, XAPI-00006)",
    config: [
      {
        name: "with strings where numbers are required",
        templates: [
          { statement: "{{statements.result}}" },
          { result: "{{results.default}}" },
          { score: { max: "one hundred" } },
        ],
        expect: [400],
      },
      {
        name: "even if those strings contain numbers",
        templates: [
          { statement: "{{statements.result}}" },
          { result: "{{results.default}}" },
          { score: { max: "100" } },
        ],
        expect: [400],
      },
      {
        name: "with strings where booleans are required",
        templates: [
          { statement: "{{statements.result}}" },
          { result: "{{results.default}}" },
          { success: "We regret to inform you that your effort was unsuccessful." },
        ],
        expect: [400],
      },
      {
        name: "even if those strings contain booleans",
        templates: [{ statement: "{{statements.result}}" }, { result: "{{results.default}}" }, { completion: "false" }],
        expect: [400],
      },
    ],
  },
];

export const formattingParameterValidationCases: FormattingQueryValidationCase[] = [
  {
    name: "should reject when statementId value is invalid",
    query: {
      statementId: "wrong",
    },
    expect: 400,
  },
  {
    name: "should reject when statementId value is invalid",
    query: {
      voidedStatementId: "wrong",
    },
    expect: 400,
  },
  {
    name: "should reject when statementId value is invalid",
    query: {
      agent: "wrong",
    },
    expect: 400,
  },
  {
    name: "should reject when statementId value is invalid",
    query: {
      verb: "not.a.valid.iri.com/verb",
    },
    expect: 400,
  },
  {
    name: "should reject when statementId value is invalid",
    query: {
      activity: "not.a.valid.iri.com/activity",
    },
    expect: 400,
  },
  {
    name: "should reject when statementId value is invalid",
    query: {
      registration: "wrong",
    },
    expect: 400,
  },
];
