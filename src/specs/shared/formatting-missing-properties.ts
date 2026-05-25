import type { ConfigDrivenGroupDefinition } from "../../describe-runtime/config-suite.ts";
import type { JsonObject, TemplateLayer } from "../../describe-runtime/templates.ts";

export interface FormattingQueryValidationCase {
  name: string;
  query: Record<string, string>;
  expect: number;
}

export interface FormattingIriSchemeCase {
  name: string;
  templates: TemplateLayer[];
  mutate: (statement: JsonObject) => void;
}

function isJsonObjectValue(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getRequiredObject(parent: JsonObject, key: string, label: string): JsonObject {
  const value = parent[key];
  if (!isJsonObjectValue(value)) {
    throw new Error(`Expected ${label} to be an object.`);
  }

  return value;
}

function getRequiredString(parent: JsonObject, key: string, label: string): string {
  const value = parent[key];
  if (typeof value !== "string") {
    throw new Error(`Expected ${label} to be a string.`);
  }

  return value;
}

function getFirstAttachment(statement: JsonObject): JsonObject {
  const attachments = statement.attachments;
  if (!Array.isArray(attachments)) {
    throw new Error("Expected statement attachments to be an array.");
  }

  const attachment = attachments[0];
  if (!isJsonObjectValue(attachment)) {
    throw new Error("Expected the first attachment to be an object.");
  }

  return attachment;
}

function stripScheme(value: string): string {
  return value.replace("http://", "");
}

const invalidNumeric = 12345;
const invalidObject = {
  key: "should fail",
} as const;
const invalidTimestamp = "1776-07-04T16:00:45.123Z";
const invalidStoredTimestamp = "1787-09-17T09:33:32.111Z";
const validStatementId = "6690e6c9-3ef0-4ed3-8b37-7f3964730bee";
const invalidUuidTooManyDigits = "AA97B177-9383-4934-8543-0F91A7A028368";
const invalidUuidInvalidLetter = "MA97B177-9383-4934-8543-0F91A7A02836";
const invalidAccountNameLayer = {
  account: {
    name: invalidObject,
  },
} as const;
const validAttachment = {
  usageType: "http://example.com/attachment-usage/test",
  display: {
    "en-US": "A test attachment",
  },
  description: {
    "en-US": "A test attachment (description)",
  },
  contentType: "text/plain; charset=ascii",
  length: 27,
  sha2: "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
  fileUrl: "http://over.there.com/file.txt",
} as const;
const validAttachmentDisplay = {
  usageType: "http://example.com/attachment-usage/test",
  display: {
    "en-US": "A test attachment",
    es: "Un accesorio de prueba",
  },
  description: {
    "en-US": "A test attachment (description)",
  },
  contentType: "text/plain; charset=ascii",
  length: 27,
  sha2: "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
  fileUrl: "http://over.there.com/file.txt",
} as const;
const validAttachmentDescription = {
  usageType: "http://example.com/attachment-usage/test",
  display: {
    "en-US": "A test attachment",
  },
  description: {
    "en-US": "A test attachment (description)",
    "es-MX": "Un accesorio de prueba (descripción)",
  },
  contentType: "text/plain; charset=ascii",
  length: 27,
  sha2: "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
  fileUrl: "http://over.there.com/file.txt",
} as const;
const invalidDisplayAttachment = {
  usageType: "http://example.com/attachment-usage/test",
  display: {
    "en-US": "A test attachment",
    something: "Un accesorio de prueba",
  },
  description: {
    "en-US": "A test attachment (description)",
  },
  contentType: "text/plain; charset=ascii",
  length: 27,
  sha2: "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
  fileUrl: "http://over.there.com/file.txt",
} as const;
const invalidDescriptionAttachment = {
  usageType: "http://example.com/attachment-usage/test",
  display: {
    "en-US": "A test attachment",
  },
  description: {
    "en-US": "A test attachment (description)",
    something: "Un accesorio de prueba (descripción)",
  },
  contentType: "text/plain; charset=ascii",
  length: 27,
  sha2: "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
  fileUrl: "http://over.there.com/file.txt",
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

export const formattingKeyCaseGroups: ConfigDrivenGroupDefinition[] = [
  {
    /**  XAPI-00008, Data 2.2 Formatting Requirements
     * An LRS rejects with error code 400 Bad Request a Statement where the case of a key does not match the case specified in this specification.
     */
    /**  XAPI-00010, Data 2.2 Formatting Requirements
     * An LRS rejects with error code 400 Bad Request a Statement where a key or value is not allowed by this specification.
     * This meets keys not allowed. Values not allowed are scattered throughout the suite.
     */
    name: "An LRS rejects with error code 400 Bad Request a Statement where the case of a key does not match the case specified in this specification. (Data 2.2.s4.b1.b5, XAPI-00008, XAPI-00010)",
    config: [
      {
        name: 'should fail when not using "id"',
        templates: [{ statement: "{{statements.default}}" }, { iD: validStatementId }],
        expect: [400],
      },
      {
        name: 'should fail when not using "actor"',
        templates: [{ statement: "{{statements.default}}" }, { Actor: "{{agents.default}}" }],
        expect: [400],
      },
      {
        name: 'should fail when not using "verb"',
        templates: [{ statement: "{{statements.default}}" }, { veRb: "{{verbs.default}}" }],
        expect: [400],
      },
      {
        name: 'should fail when not using "object"',
        templates: [{ statement: "{{statements.default}}" }, { oBject: "{{activities.default}}" }],
        expect: [400],
      },
      {
        name: 'should fail when not using "result"',
        templates: [{ statement: "{{statements.result}}" }, { RESULT: "{{results.default}}" }],
        expect: [400],
      },
      {
        name: 'should fail when not using "context"',
        templates: [{ statement: "{{statements.context}}" }, { conText: "{{contexts.default}}" }],
        expect: [400],
      },
      {
        name: 'should fail when not using "timestamp"',
        templates: [{ statement: "{{statements.default}}" }, { timeStamp: invalidTimestamp }],
        expect: [400],
      },
      {
        name: 'should fail when not using "stored"',
        templates: [{ statement: "{{statements.default}}" }, { STOred: invalidStoredTimestamp }],
        expect: [400],
      },
      {
        name: 'should fail when not using "authority"',
        templates: [{ statement: "{{statements.authority}}" }, { auTHORity: "{{agents.default}}" }],
        expect: [400],
      },
      {
        name: 'should fail when not using "version"',
        templates: [{ statement: "{{statements.default}}" }, { Version: "2.0.0" }],
        expect: [400],
      },
      {
        name: 'should fail when not using "attachments"',
        templates: [{ statement: "{{statements.attachment}}" }, { attachmentS: [validAttachment] }],
        expect: [400],
      },
    ],
  },
];

export const formattingEnumeratedValueCaseGroups: ConfigDrivenGroupDefinition[] = [
  {
    /**  XAPI-00009, Data 2.2 Formatting Requirements
     * An LRS rejects with error code 400 Bad Request a Statement where the case of a value restricted to enumerated values does not match an enumerated value given in this specification exactly.
     */
    name: "An LRS rejects with error code 400 Bad Request a Statement where the case of a value restricted to enumerated values does not match an enumerated value given in this specification exactly. (Data 2.2.s4.b1.b6, XAPI-00009)",
    config: [
      {
        name: 'when interactionType is wrong case ("true-faLse")',
        templates: [
          { statement: "{{statements.object_activity}}" },
          { object: "{{activities.true_false}}" },
          { definition: { interactionType: "true-faLse" } },
        ],
        expect: [400],
      },
      {
        name: 'when interactionType is wrong case ("choiCe")',
        templates: [
          { statement: "{{statements.object_activity}}" },
          { object: "{{activities.choice}}" },
          { definition: { interactionType: "choiCe" } },
        ],
        expect: [400],
      },
      {
        name: 'when interactionType is wrong case ("fill-iN")',
        templates: [
          { statement: "{{statements.object_activity}}" },
          { object: "{{activities.fill_in}}" },
          { definition: { interactionType: "fill-iN" } },
        ],
        expect: [400],
      },
      {
        name: 'when interactionType is wrong case ("long-fiLl-in")',
        templates: [
          { statement: "{{statements.object_activity}}" },
          { object: "{{activities.long_fill_in}}" },
          { definition: { interactionType: "long-fiLl-in" } },
        ],
        expect: [400],
      },
      {
        name: 'when interactionType is wrong case ("matchIng")',
        templates: [
          { statement: "{{statements.object_activity}}" },
          { object: "{{activities.matching}}" },
          { definition: { interactionType: "matchIng" } },
        ],
        expect: [400],
      },
      {
        name: 'when interactionType is wrong case ("perfOrmance")',
        templates: [
          { statement: "{{statements.object_activity}}" },
          { object: "{{activities.performance}}" },
          { definition: { interactionType: "perfOrmance" } },
        ],
        expect: [400],
      },
      {
        name: 'when interactionType is wrong case ("seqUencing")',
        templates: [
          { statement: "{{statements.object_activity}}" },
          { object: "{{activities.sequencing}}" },
          { definition: { interactionType: "seqUencing" } },
        ],
        expect: [400],
      },
      {
        name: 'when interactionType is wrong case ("liKert")',
        templates: [
          { statement: "{{statements.object_activity}}" },
          { object: "{{activities.likert}}" },
          { definition: { interactionType: "liKert" } },
        ],
        expect: [400],
      },
      {
        name: 'when interactionType is wrong case ("nUmeric")',
        templates: [
          { statement: "{{statements.object_activity}}" },
          { object: "{{activities.numeric}}" },
          { definition: { interactionType: "nUmeric" } },
        ],
        expect: [400],
      },
      {
        name: 'when interactionType is wrong case ("Other")',
        templates: [
          { statement: "{{statements.object_activity}}" },
          { object: "{{activities.other}}" },
          { definition: { interactionType: "Other" } },
        ],
        expect: [400],
      },
    ],
  },
];

export const formattingLanguageTagGroups: ConfigDrivenGroupDefinition[] = [
  {
    /**  XAPI-00013  2.2 Formatting Requirements
     * The LRS rejects with error code 400 Bad Request a token with does not validate as matching the RFC 5646 standard in the sequence of token lengths for language map keys.
     */
    name: "The LRS rejects with error code 400 Bad Request a token with does not validate as matching the RFC 5646 standard in the sequence of token lengths for language map keys. (Format, Data 2.2.s4.b2, Data 2.4.6.s3.table1.row7, RFC5646, XAPI-00013)",
    config: [
      {
        name: 'statement verb "display" should pass given de two letter language code only',
        templates: [
          { statement: "{{statements.default}}" },
          { verb: "{{verbs.default}}" },
          { display: { de: "besucht" } },
        ],
        expect: [200],
      },
      {
        name: 'statement verb "display" should fail given invalid language code',
        templates: [
          { statement: "{{statements.default}}" },
          { verb: "{{verbs.default}}" },
          { display: { something: "besucht" } },
        ],
        expect: [400],
      },
      {
        name: 'statement object "name" should pass given de-DE language-region code',
        templates: [
          { statement: "{{statements.object_activity}}" },
          { object: "{{activities.language_maps_valid_name}}" },
        ],
        expect: [200],
      },
      {
        name: 'statement object "name" should fail given invalid language code',
        templates: [{ statement: "{{statements.object_activity}}" }, { object: "{{activities.name_invalid}}" }],
        expect: [400],
      },
      {
        name: 'statement object "description" should pass given zh-Hant language-script code',
        templates: [
          { statement: "{{statements.object_activity}}" },
          { object: "{{activities.language_maps_valid_description}}" },
        ],
        expect: [200],
      },
      {
        name: 'statement object "description" should fail given invalid language code',
        templates: [{ statement: "{{statements.object_activity}}" }, { object: "{{activities.description_invalid}}" }],
        expect: [400],
      },
      {
        name: "interaction components' description should pass given sr-Latn-RS language-script-region code",
        templates: [
          { statement: "{{statements.object_activity}}" },
          { object: "{{activities.likert_valid_language_map}}" },
        ],
        expect: [200],
      },
      {
        name: "context.language should pass given three letter cmn language code",
        templates: [{ statement: "{{statements.context}}" }, { context: "{{contexts.default}}" }, { language: "cmn" }],
        expect: [200],
      },
      {
        name: "context.language should fail given invalid language code",
        templates: [
          { statement: "{{statements.context}}" },
          { context: "{{contexts.default}}" },
          { language: "something" },
        ],
        expect: [400],
      },
      {
        name: 'statement attachment "display" should pass given es two letter language code only',
        templates: [{ statement: "{{statements.attachment}}" }, { attachments: [validAttachmentDisplay] }],
        expect: [200],
      },
      {
        name: 'statement attachment "display" should fail given invalid language code',
        templates: [{ statement: "{{statements.attachment}}" }, { attachments: [invalidDisplayAttachment] }],
        expect: [400],
      },
      {
        name: 'statement attachment "description" should pass given es-MX language-UN region code',
        templates: [{ statement: "{{statements.attachment}}" }, { attachments: [validAttachmentDescription] }],
        expect: [200],
      },
      {
        name: 'statement attachment "description" should fail given es-MX invalid language code',
        templates: [{ statement: "{{statements.attachment}}" }, { attachments: [invalidDescriptionAttachment] }],
        expect: [400],
      },
      {
        name: 'statement substatement verb "display" should pass given sr-Cyrl language-script code',
        templates: [
          { statement: "{{statements.object_substatement_default}}" },
          { object: "{{substatements.verb_valid}}" },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement verb "display" should fail given invalid language code',
        templates: [
          { statement: "{{statements.object_substatement_default}}" },
          { object: "{{substatements.verb_invalid}}" },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement activity "name" should pass given zh-Hans-CN language-script-region code',
        templates: [
          { statement: "{{statements.object_substatement_default}}" },
          { object: "{{substatements.activity_definition_name}}" },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement activity "name" should fail given zh-z-aaa-z-bbb-c-ccc invalid (two extensions with same single-letter prefix) language code',
        templates: [
          { statement: "{{statements.object_substatement_default}}" },
          { object: "{{substatements.activity_definition_name_invalid}}" },
        ],
        expect: [400],
      },
      {
        name: 'statement substatement activity "description" should pass given ase three letter language code',
        templates: [
          { statement: "{{statements.object_substatement_default}}" },
          { object: "{{substatements.activity_definition_description}}" },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement activity "description" should fail given invalid language code',
        templates: [
          { statement: "{{statements.object_substatement_default}}" },
          { object: "{{substatements.activity_definition_description_invalid}}" },
        ],
        expect: [400],
      },
      {
        name: "substatement interaction components' description should pass given ja two letter language code only",
        templates: [
          { statement: "{{statements.object_substatement_default}}" },
          { object: "{{substatements.interaction_component_valid_language_map}}" },
        ],
        expect: [200],
      },
      {
        name: "substatement context.language should pass given two letter fr-CA language-region code",
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.context_valid_language_map}}" },
        ],
        expect: [200],
      },
      {
        name: "substatement context.language should fail given invalid language code",
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.context_invalid_language_map}}" },
        ],
        expect: [400],
      },
    ],
  },
];

export const formattingIriSchemeCases: FormattingIriSchemeCase[] = [
  {
    name: "should fail with bad verb id scheme",
    templates: [{ statement: "{{statements.default}}" }],
    mutate(statement) {
      const verb = getRequiredObject(statement, "verb", "statement verb");
      verb.id = stripScheme(getRequiredString(verb, "id", "statement verb id"));
    },
  },
  {
    name: "should fail with bad verb openid scheme",
    templates: [{ statement: "{{statements.actor}}" }],
    mutate(statement) {
      const actor = getRequiredObject(statement, "actor", "statement actor");
      actor.openid = "open.id.com/testUser";
    },
  },
  {
    name: "should fail with bad account homePage",
    templates: [{ statement: "{{statements.actor}}" }],
    mutate(statement) {
      const actor = getRequiredObject(statement, "actor", "statement actor");
      actor.account = {
        homePage: "homePage.com/testUser",
        name: "123456",
      };
    },
  },
  {
    name: "should fail with bad object id",
    templates: [{ statement: "{{statements.default}}" }],
    mutate(statement) {
      const object = getRequiredObject(statement, "object", "statement object");
      object.id = stripScheme(getRequiredString(object, "id", "statement object id"));
    },
  },
  {
    name: "should fail with bad object type",
    templates: [{ statement: "{{statements.default}}" }, { object: "{{activities.default}}" }],
    mutate(statement) {
      const object = getRequiredObject(statement, "object", "statement object");
      const definition = getRequiredObject(object, "definition", "activity definition");
      definition.type = stripScheme(getRequiredString(definition, "type", "activity definition type"));
    },
  },
  {
    name: "should fail with bad object moreInfo",
    templates: [{ statement: "{{statements.default}}" }, { object: "{{activities.default}}" }],
    mutate(statement) {
      const object = getRequiredObject(statement, "object", "statement object");
      const definition = getRequiredObject(object, "definition", "activity definition");
      definition.moreInfo = stripScheme(getRequiredString(definition, "moreInfo", "activity definition moreInfo"));
    },
  },
  {
    name: "should fail with attachment bad usageType",
    templates: [{ statement: "{{statements.attachment}}" }, { attachments: [validAttachment] }],
    mutate(statement) {
      const attachment = getFirstAttachment(statement);
      attachment.usageType = stripScheme(getRequiredString(attachment, "usageType", "attachment usageType"));
    },
  },
  {
    name: "should fail with bad attachment fileUrl",
    templates: [{ statement: "{{statements.attachment}}" }, { attachments: [validAttachment] }],
    mutate(statement) {
      const attachment = getFirstAttachment(statement);
      attachment.fileUrl = stripScheme(getRequiredString(attachment, "fileUrl", "attachment fileUrl"));
    },
  },
  {
    name: "should fail with bad object definition extension",
    templates: [{ statement: "{{statements.default}}" }, { object: "{{activities.default}}" }],
    mutate(statement) {
      const object = getRequiredObject(statement, "object", "statement object");
      const definition = getRequiredObject(object, "definition", "activity definition");
      definition.extensions = {
        "not.valid.com/extension": 1234,
      };
    },
  },
  {
    name: "should fail with bad context extension",
    templates: [{ statement: "{{statements.default}}" }, { context: "{{contexts.default}}" }],
    mutate(statement) {
      const context = getRequiredObject(statement, "context", "statement context");
      const extensions = getRequiredObject(context, "extensions", "statement context extensions");
      extensions["example.com/extension/wrong"] = 1234;
    },
  },
  {
    name: "should fail with bad result extension",
    templates: [{ statement: "{{statements.default}}" }, { result: "{{results.default}}" }],
    mutate(statement) {
      const result = getRequiredObject(statement, "result", "statement result");
      const extensions = getRequiredObject(result, "extensions", "statement result extensions");
      extensions["example.com/extension/wrong"] = 1234;
    },
  },
];

export const formattingVerifyTemplateGroups: ConfigDrivenGroupDefinition[] = [
  {
    /**  XAPI-00014, Data 2.2 Formatting Requirements
     * All Objects are well-created JSON Objects (Nature of Binding)
     */
    name: "Statements Verify Templates",
    config: [
      {
        name: "should pass statement template",
        templates: [{ statement: "{{statements.default}}" }, { timestamp: "2013-05-18T05:32:34.804Z" }],
        expect: [200],
      },
    ],
  },
  {
    /**  XAPI-00014, Data 2.2 Formatting Requirements
     * All Objects are well-created JSON Objects (Nature of Binding)
     */
    name: "Agents Verify Templates",
    config: [
      {
        name: "should pass statement actor template",
        templates: [{ statement: "{{statements.actor}}" }, { actor: "{{agents.default}}" }],
        expect: [200],
      },
      {
        name: "should pass statement authority template",
        templates: [{ statement: "{{statements.authority}}" }, { authority: "{{agents.default}}" }],
        expect: [200],
      },
      {
        name: "should pass statement context instructor template",
        templates: [
          { statement: "{{statements.context}}" },
          { context: "{{contexts.instructor}}" },
          { instructor: "{{agents.default}}" },
        ],
        expect: [200],
      },
      {
        name: "should pass statement substatement as agent template",
        templates: [{ statement: "{{statements.object_actor}}" }, { object: "{{agents.default}}" }],
        expect: [200],
      },
      {
        name: 'should pass statement substatement"s agent template',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.actor}}" },
          { actor: "{{agents.default}}" },
        ],
        expect: [200],
      },
      {
        name: 'should pass statement substatement"s context instructor template',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.context}}" },
          { context: "{{contexts.instructor}}" },
          { instructor: "{{agents.default}}" },
        ],
        expect: [200],
      },
    ],
  },
  {
    /**  XAPI-00014, Data 2.2 Formatting Requirements
     * All Objects are well-created JSON Objects (Nature of Binding)
     */
    name: "Groups Verify Templates",
    config: [
      {
        name: "should pass statement actor template",
        templates: [{ statement: "{{statements.actor}}" }, { actor: "{{groups.default}}" }],
        expect: [200],
      },
      {
        name: "should pass statement authority template",
        templates: [{ statement: "{{statements.authority}}" }, { authority: "{{groups.anonymous_two_member}}" }],
        expect: [200],
      },
      {
        name: "should pass statement context instructor template",
        templates: [
          { statement: "{{statements.context}}" },
          { context: "{{contexts.instructor}}" },
          { instructor: "{{groups.default}}" },
        ],
        expect: [200],
      },
      {
        name: "should pass statement context team template",
        templates: [
          { statement: "{{statements.context}}" },
          { context: "{{contexts.team}}" },
          { team: "{{groups.default}}" },
        ],
        expect: [200],
      },
      {
        name: "should pass statement substatement as group template",
        templates: [{ statement: "{{statements.object_actor}}" }, { object: "{{groups.default}}" }],
        expect: [200],
      },
      {
        name: 'should pass statement substatement"s group template',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.actor}}" },
          { actor: "{{groups.default}}" },
        ],
        expect: [200],
      },
      {
        name: 'should pass statement substatement"s context instructor template',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.context}}" },
          { context: "{{contexts.instructor}}" },
          { instructor: "{{groups.default}}" },
        ],
        expect: [200],
      },
      {
        name: 'should pass statement substatement"s context team template',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.context}}" },
          { context: "{{contexts.team}}" },
          { team: "{{groups.default}}" },
        ],
        expect: [200],
      },
    ],
  },
  {
    /**  XAPI-00014, Data 2.2 Formatting Requirements
     * All Objects are well-created JSON Objects (Nature of Binding)
     */
    name: 'A Group is defined by "objectType" of an "actor" property or "object" property with value "Group" (Data 2.4.2.2.s2.table2.row1)',
    config: [
      {
        name: 'statement actor "objectType" accepts "Group"',
        templates: [{ statement: "{{statements.actor}}" }, { actor: "{{groups.default}}" }],
        expect: [200],
      },
      {
        name: 'statement authority "objectType" accepts "Group"',
        templates: [{ statement: "{{statements.authority}}" }, { authority: "{{groups.authority_group}}" }],
        expect: [200],
      },
      {
        name: 'statement context instructor "objectType" accepts "Group"',
        templates: [
          { statement: "{{statements.context}}" },
          { context: "{{contexts.instructor}}" },
          { instructor: "{{groups.default}}" },
        ],
        expect: [200],
      },
      {
        name: 'statement context team "objectType" accepts "Group"',
        templates: [
          { statement: "{{statements.context}}" },
          { context: "{{contexts.team}}" },
          { team: "{{groups.default}}" },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement as group "objectType" accepts "Group"',
        templates: [{ statement: "{{statements.object_actor}}" }, { object: "{{groups.default}}" }],
        expect: [200],
      },
      {
        name: 'statement substatement"s group "objectType" accepts "Group"',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.actor}}" },
          { actor: "{{groups.default}}" },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context instructor "objectType" accepts "Group"',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.context}}" },
          { context: "{{contexts.instructor}}" },
          { instructor: "{{groups.default}}" },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context team "objectType" accepts "Group"',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.context}}" },
          { context: "{{contexts.team}}" },
          { team: "{{groups.default}}" },
        ],
        expect: [200],
      },
    ],
  },
  {
    /**  XAPI-00014, Data 2.2 Formatting Requirements
     * All Objects are well-created JSON Objects (Nature of Binding)
     */
    name: 'An Anonymous Group is defined by "objectType" of an "actor" or "object" with value "Group" and by none of "mbox", "mbox_sha1sum", "openid", or "account" being used (Data 2.4.2.2.s2.table1.row1)',
    config: [
      {
        name: "statement actor does not require functional identifier",
        templates: [{ statement: "{{statements.actor}}" }, { actor: "{{groups.anonymous}}" }],
        expect: [200],
      },
      {
        name: "statement authority does not require functional identifier",
        templates: [{ statement: "{{statements.authority}}" }, { authority: "{{groups.authority_group}}" }],
        expect: [200],
      },
      {
        name: "statement context instructor does not require functional identifier",
        templates: [
          { statement: "{{statements.context}}" },
          { context: "{{contexts.instructor}}" },
          { instructor: "{{groups.anonymous}}" },
        ],
        expect: [200],
      },
      {
        name: "statement context team does not require functional identifier",
        templates: [
          { statement: "{{statements.context}}" },
          { context: "{{contexts.team}}" },
          { team: "{{groups.anonymous}}" },
        ],
        expect: [200],
      },
      {
        name: "statement substatement as group does not require functional identifier",
        templates: [{ statement: "{{statements.object_actor}}" }, { object: "{{groups.anonymous}}" }],
        expect: [200],
      },
      {
        name: 'statement substatement"s group does not require functional identifier',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.actor}}" },
          { actor: "{{groups.anonymous}}" },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context instructor does not require functional identifier',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.context}}" },
          { context: "{{contexts.instructor}}" },
          { instructor: "{{groups.anonymous}}" },
        ],
        expect: [200],
      },
      {
        name: 'statement substatement"s context team does not require functional identifier',
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.context}}" },
          { context: "{{contexts.team}}" },
          { team: "{{groups.anonymous}}" },
        ],
        expect: [200],
      },
    ],
  },
  {
    /**  XAPI-00014, Data 2.2 Formatting Requirements
     * All Objects are well-created JSON Objects (Nature of Binding)
     */
    name: "Verbs Verify Templates",
    config: [
      {
        name: "should pass statement verb template",
        templates: [{ statement: "{{statements.verb}}" }, { verb: "{{verbs.default}}" }],
        expect: [200],
      },
      {
        name: "should pass substatement verb template",
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.verb}}" },
          { verb: "{{verbs.default}}" },
        ],
        expect: [200],
      },
    ],
  },
  {
    /**  XAPI-00014, Data 2.2 Formatting Requirements
     * All Objects are well-created JSON Objects (Nature of Binding)
     */
    name: "Objects Verify Templates",
    config: [
      {
        name: "should pass statement activity template",
        templates: [{ statement: "{{statements.object_activity}}" }, { object: "{{activities.default}}" }],
        expect: [200],
      },
      {
        name: "should pass statement substatement activity template",
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.activity}}" },
          { object: "{{activities.default}}" },
        ],
        expect: [200],
      },
      {
        name: "should pass statement agent template",
        templates: [{ statement: "{{statements.object_actor}}" }, { object: "{{agents.default}}" }],
        expect: [200],
      },
      {
        name: "should pass statement substatement agent template",
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.agent}}" },
          { object: "{{agents.default}}" },
        ],
        expect: [200],
      },
      {
        name: "should pass statement group template",
        templates: [{ statement: "{{statements.object_actor}}" }, { object: "{{groups.default}}" }],
        expect: [200],
      },
      {
        name: "should pass statement substatement group template",
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.group}}" },
          { object: "{{groups.default}}" },
        ],
        expect: [200],
      },
      {
        name: "should pass statement StatementRef template",
        templates: [{ statement: "{{statements.object_statementref}}" }],
        expect: [200],
      },
      {
        name: "should pass statement substatement StatementRef template",
        templates: [{ statement: "{{statements.object_substatement}}" }, { object: "{{substatements.statementref}}" }],
        expect: [200],
      },
      {
        name: "should pass statement SubStatement template",
        templates: [{ statement: "{{statements.object_substatement}}" }, { object: "{{substatements.default}}" }],
        expect: [200],
      },
    ],
  },
  {
    /**  XAPI-00014, Data 2.2 Formatting Requirements
     * All Objects are well-created JSON Objects (Nature of Binding)
     */
    name: "Activities Verify Templates",
    config: [
      {
        name: "should pass statement activity default template",
        templates: [{ statement: "{{statements.object_activity}}" }, { object: "{{activities.default}}" }],
        expect: [200],
      },
      {
        name: "should pass statement substatement activity default template",
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.activity}}" },
          { object: "{{activities.default}}" },
        ],
        expect: [200],
      },
      {
        name: "should pass statement activity choice template",
        templates: [{ statement: "{{statements.object_activity}}" }, { object: "{{activities.choice}}" }],
        expect: [200],
      },
      {
        name: "should pass statement activity fill-in template",
        templates: [{ statement: "{{statements.object_activity}}" }, { object: "{{activities.fill_in}}" }],
        expect: [200],
      },
      {
        name: "should pass statement activity numeric template",
        templates: [{ statement: "{{statements.object_activity}}" }, { object: "{{activities.numeric}}" }],
        expect: [200],
      },
      {
        name: "should pass statement activity likert template",
        templates: [{ statement: "{{statements.object_activity}}" }, { object: "{{activities.likert}}" }],
        expect: [200],
      },
      {
        name: "should pass statement activity long-fill-in template",
        templates: [{ statement: "{{statements.object_activity}}" }, { object: "{{activities.long_fill_in}}" }],
        expect: [200],
      },
      {
        name: "should pass statement activity matching template",
        templates: [{ statement: "{{statements.object_activity}}" }, { object: "{{activities.matching}}" }],
        expect: [200],
      },
      {
        name: "should pass statement activity other template",
        templates: [{ statement: "{{statements.object_activity}}" }, { object: "{{activities.other}}" }],
        expect: [200],
      },
      {
        name: "should pass statement activity performance template",
        templates: [{ statement: "{{statements.object_activity}}" }, { object: "{{activities.performance}}" }],
        expect: [200],
      },
      {
        name: "should pass statement activity sequencing template",
        templates: [{ statement: "{{statements.object_activity}}" }, { object: "{{activities.sequencing}}" }],
        expect: [200],
      },
      {
        name: "should pass statement activity true-false template",
        templates: [{ statement: "{{statements.object_activity}}" }, { object: "{{activities.true_false}}" }],
        expect: [200],
      },
      {
        name: "should pass statement substatement activity choice template",
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.activity}}" },
          { object: "{{activities.choice}}" },
        ],
        expect: [200],
      },
      {
        name: "should pass statement substatement activity likert template",
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.activity}}" },
          { object: "{{activities.likert}}" },
        ],
        expect: [200],
      },
      {
        name: "should pass statement substatement activity matching template",
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.activity}}" },
          { object: "{{activities.matching}}" },
        ],
        expect: [200],
      },
      {
        name: "should pass statement substatement activity performance template",
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.activity}}" },
          { object: "{{activities.performance}}" },
        ],
        expect: [200],
      },
      {
        name: "should pass statement substatement activity sequencing template",
        templates: [
          { statement: "{{statements.object_substatement}}" },
          { object: "{{substatements.activity}}" },
          { object: "{{activities.sequencing}}" },
        ],
        expect: [200],
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
