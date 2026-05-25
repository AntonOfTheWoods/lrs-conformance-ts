import type { ConfigDrivenGroupDefinition } from "../../describe-runtime/config-suite.ts";

export interface FormattingQueryValidationCase {
  name: string;
  query: Record<string, string>;
  expect: number;
}

const invalidNumeric = 12345;
const invalidObject = {
  key: "should fail",
} as const;
const invalidUuidTooManyDigits = "AA97B177-9383-4934-8543-0F91A7A028368";
const invalidUuidInvalidLetter = "MA97B177-9383-4934-8543-0F91A7A02836";
const invalidAccountNameLayer = {
  account: {
    name: invalidObject,
  },
} as const;

const validExtensionLayer = {
  extensions: {
    "http://example.com/null": null,
  },
} as const;

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

export const formattingRequiredFormatGroups: ConfigDrivenGroupDefinition[] = [
  {
    /**  XAPI-00007, Data 2.2 Formatting Requirements
     * An LRS rejects with error code 400 Bad Request a Statement which uses any non-format-following key or value, including the empty string, where a string with a particular format (such as mailto IRI, UUID, or IRI) is required.
     * Additional UUID tests in uuids.js xapi-00027 & 28
     * IFI's covered in actors.js xapi-0038
     */
    name: "An LRS rejects with error code 400 Bad Request a Statement which uses any non-format-following key or value, including the empty string, where a string with a particular format, such as mailto IRI, UUID, or IRI, is required. (Data 2.2.s4.b4, XAPI-00007)",
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
        name: 'statement actor "agent" account "name" property is string',
        templates: [
          { statement: "{{statements.actor}}" },
          { actor: "{{agents.account_no_name}}" },
          invalidAccountNameLayer,
        ],
        expect: [400],
      },
      {
        name: 'statement actor "group" account "name" property is string',
        templates: [
          { statement: "{{statements.actor}}" },
          { actor: "{{groups.identified_account_no_name}}" },
          invalidAccountNameLayer,
        ],
        expect: [400],
      },
      {
        name: 'statement authority "agent" account "name" property is string',
        templates: [
          { statement: "{{statements.authority}}" },
          { authority: "{{agents.account_no_name}}" },
          invalidAccountNameLayer,
        ],
        expect: [400],
      },
      {
        name: 'statement authority "group" account "name" property is string',
        templates: [
          { statement: "{{statements.authority}}" },
          { authority: "{{groups.identified_account_no_name}}" },
          invalidAccountNameLayer,
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "agent" account "name" property is string',
        templates: [
          { statement: "{{statements.context}}" },
          { context: "{{contexts.instructor}}" },
          { instructor: "{{agents.account_no_name}}" },
          invalidAccountNameLayer,
        ],
        expect: [400],
      },
      {
        name: 'statement context instructor "group" account "name" property is string',
        templates: [
          { statement: "{{statements.context}}" },
          { context: "{{contexts.instructor}}" },
          { instructor: "{{groups.identified_account_no_name}}" },
          invalidAccountNameLayer,
        ],
        expect: [400],
      },
      {
        name: 'statement context team "group" account "name" property is string',
        templates: [
          { statement: "{{statements.context}}" },
          { context: "{{contexts.instructor}}" },
          { instructor: "{{groups.identified_account_no_name}}" },
          invalidAccountNameLayer,
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as "agent" account "name" property is string',
        templates: [
          { statement: "{{statements.object_actor}}" },
          { object: "{{agents.account_no_name}}" },
          invalidAccountNameLayer,
        ],
        expect: [400],
      },
      {
        name: 'statement substatement as "group" account "name" property is string',
        templates: [
          { statement: "{{statements.object_actor}}" },
          { object: "{{groups.identified_account_no_name}}" },
          invalidAccountNameLayer,
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s "agent" account "name" property is string',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.actor}}" },
          { actor: "{{agents.account_no_name}}" },
          invalidAccountNameLayer,
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s "group" account "name" property is string',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.actor}}" },
          { actor: "{{groups.identified_account_no_name}}" },
          invalidAccountNameLayer,
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "agent" account "name" property is string',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.context}}" },
          { context: "{{contexts.instructor}}" },
          { instructor: "{{agents.account_no_name}}" },
          invalidAccountNameLayer,
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context instructor "group" account "name" property is string',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.context}}" },
          { context: "{{contexts.instructor}}" },
          { instructor: "{{groups.identified_account_no_name}}" },
          invalidAccountNameLayer,
        ],
        expect: [400],
      },
      {
        name: 'statement substatement"s context team "group" account "name" property is string',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.context}}" },
          { context: "{{contexts.instructor}}" },
          { instructor: "{{groups.identified_account_no_name}}" },
          invalidAccountNameLayer,
        ],
        expect: [400],
      },
    ],
  },
];

export const formattingNullPropertyGroups: ConfigDrivenGroupDefinition[] = [
  {
    /**  XAPI-00001, 2.2 Formatting Requirements
     * An LRS rejects with error code 400 Bad Request any Statement having a property whose value is set to "null", an empty object, or has no value, except in an "extensions" property
     */
    name: 'An LRS rejects with error code 400 Bad Request any Statement having a property whose value is set to "null", except in an "extensions" property (Data 2.2.s4.b1.b1, XAPI-00001)',
    config: [
      {
        name: 'statement actor should fail on "null"',
        templates: [{ statement: "{{statements.actor}}" }, { actor: "{{agents.mbox}}" }, { name: null }],
        expect: [400],
      },
      {
        name: 'statement verb should fail on "null"',
        templates: [
          { statement: "{{statements.verb}}" },
          { verb: "{{verbs.default}}" },
          { display: { "en-US": null } },
        ],
        expect: [400],
      },
      {
        name: 'statement context should fail on "null"',
        templates: [
          { statement: "{{statements.context}}" },
          { context: "{{contexts.default}}" },
          { registration: null },
        ],
        expect: [400],
      },
      {
        name: 'statement object should fail on "null"',
        templates: [
          { statement: "{{statements.object_activity}}" },
          { object: "{{activities.default}}" },
          { definition: { moreInfo: null } },
        ],
        expect: [400],
      },
      {
        name: "statement activity extensions can be empty",
        templates: [
          { statement: "{{statements.object_activity}}" },
          { object: "{{activities.no_extensions}}" },
          { definition: validExtensionLayer },
        ],
        expect: [200],
      },
      {
        name: "statement result extensions can be empty",
        templates: [
          { statement: "{{statements.result}}" },
          { result: "{{results.no_extensions}}" },
          validExtensionLayer,
        ],
        expect: [200],
      },
      {
        name: "statement context extensions can be empty",
        templates: [
          { statement: "{{statements.context}}" },
          { context: "{{contexts.no_extensions}}" },
          validExtensionLayer,
        ],
        expect: [200],
      },
      {
        name: "statement substatement activity extensions can be empty",
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.activity}}" },
          { object: "{{activities.no_extensions}}" },
          { definition: validExtensionLayer },
        ],
        expect: [200],
      },
      {
        name: "statement substatement result extensions can be empty",
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.result}}" },
          { result: "{{results.no_extensions}}" },
          validExtensionLayer,
        ],
        expect: [200],
      },
      {
        name: "statement substatement context extensions can be empty",
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.context}}" },
          { context: "{{contexts.no_extensions}}" },
          validExtensionLayer,
        ],
        expect: [200],
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
