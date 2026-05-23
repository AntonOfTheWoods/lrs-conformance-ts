import type {
  EndpointKind,
  HttpMethod,
  HttpRequest,
  JsonObject,
  RegistryDefinition,
  RequirementRef,
  SuiteDefinition,
} from "../../domain/contracts";
import {
  buildActivityProfileDocumentFixture,
  buildActivityProfileIdentityFixture,
  buildActivityStateDocumentFixture,
  buildActivityStateIdentityFixture,
  buildAgentProfileDocumentFixture,
  buildAgentProfileIdentityFixture,
} from "../../fixtures/v2_0/documents";
import type { FixtureTransform } from "../../fixtures/v2_0/statements";
import { RegistryBuilder } from "../../registry/builder";
import {
  documentRoundTripCase,
  queryRetrievalFamily,
  requestSequenceCase,
  requiredFieldFamily,
  singleRequestCase,
  statementMutationFamily,
  statementQueryValidationFamily,
  statementRoundTripCase,
} from "../../registry/families";

const specVersion = "2.0.0" as const;
const formattingLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/Data2.2-FormattingRequirements.js";
const formattingLegacyConfigFile = "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/configs/formatting.js";
const statementResourceLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.1.6.1-Statement-Resource.js";
const stateResourceLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.1.6.2-State-Resource.js";
const agentProfileLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.1.6.5-Agent-Profile-Resource.js";
const activityProfileLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.1.6.6-Activity-Profile-Resource.js";
const ifisLegacyConfigFile = "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/configs/ifis.js";
const agentsLegacyConfigFile = "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/configs/agents.js";
const groupsLegacyConfigFile = "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/configs/groups.js";
const authoritiesLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.2.4.2-Authority-Requirements.js";
const authoritiesLegacyConfigFile = "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/configs/authorities.js";
const accountObjectsLegacyConfigFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/configs/accountobjects.js";

function buildVersionedRequest(
  method: HttpMethod,
  endpoint: EndpointKind,
  query: Record<string, string>,
  body?:
    | { kind?: "json"; value: unknown; fixtureName?: string; contentType?: string }
    | { kind: "text"; value: string; fixtureName?: string; contentType?: string },
): HttpRequest {
  const headers: Record<string, string> = {
    "X-Experience-API-Version": specVersion,
  };

  if (body?.contentType) {
    headers["content-type"] = body.contentType;
  }

  return {
    method,
    endpoint,
    authMode: "basic",
    headers,
    query,
    body: body
      ? body.kind === "text"
        ? {
            kind: "text",
            value: body.value,
            sourceFixture: body.fixtureName
              ? {
                  version: specVersion,
                  domain: "documents",
                  name: body.fixtureName,
                }
              : undefined,
          }
        : {
            kind: "json",
            value: body.value,
            sourceFixture: body.fixtureName
              ? {
                  version: specVersion,
                  domain: "documents",
                  name: body.fixtureName,
                }
              : undefined,
          }
      : undefined,
  };
}

function listEquals(expected: string[]) {
  return [
    {
      path: [],
      equals: expected,
    },
  ];
}

const validSinceTimestamp = "2020-01-01T00:00:00.000Z";
const invalidSinceTimestamp = "not-a-timestamp";
const validGroupMemberMbox = "mailto:proof-group-member@example.test";
const validNestedAgentMbox = "mailto:proof-nested-agent@example.test";
const validMboxSha1sum = "495395e777cd98da653df9615d09c0fd6bb2f8d4";
const validAccountHomePage = "https://example.test/xapi/accounts/proof";
const validAccountName = "proof-account";
const validAuthorityAccountHomePage = "http://example.com/xAPI/OAuth/Token";
const validAuthorityAccountName = "oauth_consumer_x75db";
const validAuthorityMemberMbox = "mailto:bob@example.com";
const validAuthorityThirdMemberMbox = "mailto:james@example.com";
const invalidMailtoIri = "http://should.fail.com";
const invalidMailtoEmail = "mailto:should.fail.com";
const invalidOpenId = "ab=c://should.fail.com";
const invalidAccountHomePage = "ab=c://should.fail.com";
const nonJsonDocumentBody = "abcdefg";
const existingNonJsonDocumentBody = "/ asdf / undefined";
const invalidAgentQuery = '{"objectType":"Agent"';
const invalidJsonDocumentBody = '{"name":"Broken profile document"[';

function buildVerbFixture(id: string, display: string): JsonObject {
  return {
    id,
    display: {
      "en-US": display,
    },
  };
}

function buildActivityObjectFixture(id: string): JsonObject {
  return {
    objectType: "Activity",
    id,
  };
}

function buildAgentWithMbox(mbox: string): JsonObject {
  return {
    objectType: "Agent",
    mbox,
    name: "Proof Agent",
  };
}

function buildGroupWithMbox(mbox: string, includeMember = true): JsonObject {
  return {
    objectType: "Group",
    mbox,
    name: "Proof Group",
    ...(includeMember
      ? {
          member: [buildAgentWithMbox(validGroupMemberMbox)],
        }
      : {}),
  };
}

function buildAgentWithOpenId(openid: string): JsonObject {
  return {
    objectType: "Agent",
    openid,
    name: "Proof Agent",
  };
}

function buildGroupWithOpenId(openid: string, includeMember = true): JsonObject {
  return {
    objectType: "Group",
    openid,
    name: "Proof Group",
    ...(includeMember
      ? {
          member: [buildAgentWithMbox(validGroupMemberMbox)],
        }
      : {}),
  };
}

function buildAgentWithMboxSha1sum(mboxSha1sum: unknown): JsonObject {
  return {
    objectType: "Agent",
    mbox_sha1sum: mboxSha1sum,
    name: "Proof Agent",
  };
}

function buildGroupWithMboxSha1sum(mboxSha1sum: unknown, includeMember = true): JsonObject {
  return {
    objectType: "Group",
    mbox_sha1sum: mboxSha1sum,
    name: "Proof Group",
    ...(includeMember
      ? {
          member: [buildAgentWithMbox(validGroupMemberMbox)],
        }
      : {}),
  };
}

function buildAccount(homePage?: string, name?: string): JsonObject {
  const account: JsonObject = {};

  if (homePage !== undefined) {
    account.homePage = homePage;
  }

  if (name !== undefined) {
    account.name = name;
  }

  return account;
}

function buildAgentWithAccount(account: JsonObject): JsonObject {
  return {
    objectType: "Agent",
    account,
    name: "Proof Agent",
  };
}

function buildGroupWithAccount(account: JsonObject, includeMember = true): JsonObject {
  return {
    objectType: "Group",
    account,
    name: "Proof Group",
    ...(includeMember
      ? {
          member: [buildAgentWithMbox(validGroupMemberMbox)],
        }
      : {}),
  };
}

function buildAgentWithoutIfi(): JsonObject {
  return {
    objectType: "Agent",
    name: "Proof Agent",
  };
}

function buildGroupWithoutIfiOrMember(): JsonObject {
  return {
    objectType: "Group",
    name: "Proof Group",
  };
}

function buildAuthorityAccountAgent(): JsonObject {
  return {
    account: buildAccount(validAuthorityAccountHomePage, validAuthorityAccountName),
  };
}

function buildAuthorityMboxAgent(mbox = validAuthorityMemberMbox): JsonObject {
  return {
    mbox,
  };
}

function buildAnonymousAuthorityGroup(
  members: JsonObject[] = [buildAuthorityAccountAgent(), buildAuthorityMboxAgent()],
): JsonObject {
  return {
    objectType: "Group",
    member: members,
  };
}

function buildIdentifiedAuthorityGroup(overrides: Partial<JsonObject>): JsonObject {
  return {
    ...buildAnonymousAuthorityGroup(),
    ...overrides,
  };
}

function buildSubStatementFixture(overrides: Partial<JsonObject> = {}): JsonObject {
  return {
    objectType: "SubStatement",
    actor: buildAgentWithMbox(validNestedAgentMbox),
    verb: buildVerbFixture("https://example.test/xapi/verbs/experienced", "experienced"),
    object: buildActivityObjectFixture("https://example.test/xapi/activities/substatement"),
    ...overrides,
  };
}

function buildAttachmentFixture(overrides: Partial<JsonObject> = {}): JsonObject {
  return {
    usageType: "https://example.test/xapi/attachments/proof",
    display: {
      "en-US": "Proof Attachment",
    },
    description: {
      "en-US": "Proof Attachment Description",
    },
    contentType: "text/plain; charset=ascii",
    length: 27,
    sha2: "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
    fileUrl: "https://example.test/files/proof.txt",
    ...overrides,
  };
}

interface ActorLikePlacement {
  idSuffix: string;
  title: string;
  kind: "agent" | "group";
  buildTransforms(value: JsonObject): FixtureTransform[];
}

const actorLikePlacements: ActorLikePlacement[] = [
  {
    idSuffix: "actor-agent",
    title: 'statement actor "agent"',
    kind: "agent",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["actor"],
          value,
        },
      ];
    },
  },
  {
    idSuffix: "actor-group",
    title: 'statement actor "group"',
    kind: "group",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["actor"],
          value,
        },
      ];
    },
  },
  {
    idSuffix: "authority-agent",
    title: 'statement authority "agent"',
    kind: "agent",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["authority"],
          value,
        },
      ];
    },
  },
  {
    idSuffix: "authority-group",
    title: 'statement authority "group"',
    kind: "group",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["authority"],
          value,
        },
      ];
    },
  },
  {
    idSuffix: "context-instructor-agent",
    title: 'statement context instructor "agent"',
    kind: "agent",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["context"],
          value: {
            instructor: value,
          },
        },
      ];
    },
  },
  {
    idSuffix: "context-instructor-group",
    title: 'statement context instructor "group"',
    kind: "group",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["context"],
          value: {
            instructor: value,
          },
        },
      ];
    },
  },
  {
    idSuffix: "context-team-group",
    title: 'statement context team "group"',
    kind: "group",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["context"],
          value: {
            team: value,
          },
        },
      ];
    },
  },
  {
    idSuffix: "object-agent",
    title: 'statement object "agent"',
    kind: "agent",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["object"],
          value,
        },
      ];
    },
  },
  {
    idSuffix: "object-group",
    title: 'statement object "group"',
    kind: "group",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["object"],
          value,
        },
      ];
    },
  },
  {
    idSuffix: "substatement-actor-agent",
    title: 'statement substatement actor "agent"',
    kind: "agent",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["object"],
          value: buildSubStatementFixture({
            actor: value,
          }),
        },
      ];
    },
  },
  {
    idSuffix: "substatement-actor-group",
    title: 'statement substatement actor "group"',
    kind: "group",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["object"],
          value: buildSubStatementFixture({
            actor: value,
          }),
        },
      ];
    },
  },
  {
    idSuffix: "substatement-context-instructor-agent",
    title: 'statement substatement context instructor "agent"',
    kind: "agent",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["object"],
          value: buildSubStatementFixture({
            context: {
              instructor: value,
            },
          }),
        },
      ];
    },
  },
  {
    idSuffix: "substatement-context-instructor-group",
    title: 'statement substatement context instructor "group"',
    kind: "group",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["object"],
          value: buildSubStatementFixture({
            context: {
              instructor: value,
            },
          }),
        },
      ];
    },
  },
  {
    idSuffix: "substatement-context-team-group",
    title: 'statement substatement context team "group"',
    kind: "group",
    buildTransforms(value) {
      return [
        {
          operation: "set",
          path: ["object"],
          value: buildSubStatementFixture({
            context: {
              team: value,
            },
          }),
        },
      ];
    },
  },
];

interface IfiSpec {
  idToken: string;
  label: string;
  buildAgent(): JsonObject;
  buildGroup(includeMember?: boolean): JsonObject;
}

const ifiSpecs: IfiSpec[] = [
  {
    idToken: "mbox",
    label: "mbox",
    buildAgent: () => buildAgentWithMbox("mailto:proof-agent@example.test"),
    buildGroup: (includeMember = true) => buildGroupWithMbox("mailto:proof-group@example.test", includeMember),
  },
  {
    idToken: "mbox-sha1sum",
    label: "mbox_sha1sum",
    buildAgent: () => buildAgentWithMboxSha1sum(validMboxSha1sum),
    buildGroup: (includeMember = true) => buildGroupWithMboxSha1sum(validMboxSha1sum, includeMember),
  },
  {
    idToken: "openid",
    label: "openid",
    buildAgent: () => buildAgentWithOpenId("https://openid.example.test/proof-agent"),
    buildGroup: (includeMember = true) =>
      buildGroupWithOpenId("https://openid.example.test/proof-group", includeMember),
  },
  {
    idToken: "account",
    label: "account",
    buildAgent: () => buildAgentWithAccount(buildAccount(validAccountHomePage, validAccountName)),
    buildGroup: (includeMember = true) =>
      buildGroupWithAccount(buildAccount(validAccountHomePage, validAccountName), includeMember),
  },
];

function mergeActorLikeValues(primary: JsonObject, secondary: JsonObject): JsonObject {
  return {
    ...primary,
    ...secondary,
  };
}

function buildRepeatedActorMutationVariants(options: {
  description: string;
  requirementRefs: RequirementRef[];
  buildAgent(): JsonObject;
  buildGroup(): JsonObject;
}) {
  return actorLikePlacements.map((placement) => ({
    idSuffix: placement.idSuffix,
    title: `A Statement rejects ${placement.title} when ${options.description}`,
    transforms: placement.buildTransforms(placement.kind === "agent" ? options.buildAgent() : options.buildGroup()),
    requirementRefs: options.requirementRefs,
  }));
}

function buildIfiExclusivityVariants(options: { placements: ActorLikePlacement[]; requirementRefs: RequirementRef[] }) {
  return options.placements.flatMap((placement) =>
    ifiSpecs.flatMap((primary) =>
      ifiSpecs
        .filter((secondary) => secondary.idToken !== primary.idToken)
        .map((secondary) => ({
          idSuffix: `${placement.idSuffix}-${primary.idToken}-with-${secondary.idToken}`,
          title: `A Statement rejects ${placement.title} when ${primary.label} is used with ${secondary.label}`,
          transforms: placement.buildTransforms(
            mergeActorLikeValues(
              placement.kind === "agent" ? primary.buildAgent() : primary.buildGroup(),
              placement.kind === "agent" ? secondary.buildAgent() : secondary.buildGroup(),
            ),
          ),
          requirementRefs: options.requirementRefs,
        })),
    ),
  );
}

function buildIfiAcceptanceVariants(options: {
  placements: ActorLikePlacement[];
  requirementRefs: RequirementRef[];
  includeMember?: boolean;
}) {
  return options.placements.flatMap((placement) =>
    ifiSpecs.map((ifi) => ({
      idSuffix: `${placement.idSuffix}-${ifi.idToken}${options.includeMember === false ? "-no-member" : ""}`,
      title: `A Statement accepts ${placement.title} when ${ifi.label} is the sole IFI${
        options.includeMember === false ? " and no member is present" : ""
      }`,
      transforms: placement.buildTransforms(
        placement.kind === "agent" ? ifi.buildAgent() : ifi.buildGroup(options.includeMember),
      ),
      requirementRefs: options.requirementRefs,
    })),
  );
}

function buildMissingIfiVariants(options: {
  placements: ActorLikePlacement[];
  requirementRefs: RequirementRef[];
  buildValue(placement: ActorLikePlacement): JsonObject;
  description: string;
}) {
  return options.placements.map((placement) => ({
    idSuffix: placement.idSuffix,
    title: `A Statement rejects ${placement.title} when ${options.description}`,
    transforms: placement.buildTransforms(options.buildValue(placement)),
    requirementRefs: options.requirementRefs,
  }));
}

export function createV20ProofSliceSuite(): SuiteDefinition {
  const formattingCases = requiredFieldFamily({
    familyId: "v2.statements.required-fields",
    suiteTitle: "Statement Formatting",
    specVersion: "2.0.0",
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: formattingLegacyConfigFile,
    variants: [
      {
        idSuffix: "missing-actor",
        title: 'A Statement contains an "actor" property',
        missingPath: ["actor"],
        requirementRefs: [
          {
            id: "XAPI-00003",
            section: "Data 2.2.s2.b3",
            title: "Statement actor is required",
          },
        ],
      },
      {
        idSuffix: "missing-verb",
        title: 'A Statement contains a "verb" property',
        missingPath: ["verb"],
        requirementRefs: [
          {
            id: "XAPI-00004",
            section: "Data 2.2.s2.b3",
            title: "Statement verb is required",
          },
        ],
      },
      {
        idSuffix: "missing-object",
        title: 'A Statement contains an "object" property',
        missingPath: ["object"],
        requirementRefs: [
          {
            id: "XAPI-00005",
            section: "Data 2.2.s2.b3",
            title: "Statement object is required",
          },
        ],
      },
    ],
  });

  const nullValueCases = statementMutationFamily({
    familyId: "v2.statements.invalid-values",
    suiteTitle: "Statement Formatting",
    specVersion: "2.0.0",
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "null-values"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: formattingLegacyConfigFile,
    variants: [
      {
        idSuffix: "actor-name-null",
        title: 'A Statement rejects "null" for actor.name',
        transforms: [
          {
            operation: "set",
            path: ["actor", "name"],
            value: null,
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00001",
            section: "Data 2.2.s4.b1.b1",
            title: "Statements reject null values outside extensions",
          },
        ],
      },
      {
        idSuffix: "verb-display-null",
        title: 'A Statement rejects "null" for verb.display.en-US',
        transforms: [
          {
            operation: "set",
            path: ["verb", "display", "en-US"],
            value: null,
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00001",
            section: "Data 2.2.s4.b1.b1",
            title: "Statements reject null values outside extensions",
          },
        ],
      },
      {
        idSuffix: "object-id-null",
        title: 'A Statement rejects "null" for object.id',
        transforms: [
          {
            operation: "set",
            path: ["object", "id"],
            value: null,
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00001",
            section: "Data 2.2.s4.b1.b1",
            title: "Statements reject null values outside extensions",
          },
        ],
      },
    ],
  });

  const wrongTypeCases = statementMutationFamily({
    familyId: "v2.statements.invalid-types",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "types"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: formattingLegacyConfigFile,
    variants: [
      {
        idSuffix: "score-max-string",
        title: "A Statement rejects a string where result.score.max requires a number",
        transforms: [
          {
            operation: "set",
            path: ["result", "score", "max"],
            value: "one hundred",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00006",
            section: "Data 2.2.s4.b2",
            title: "Statements reject wrong data types",
          },
        ],
      },
      {
        idSuffix: "score-max-numeric-string",
        title: "A Statement rejects a numeric string where result.score.max requires a number",
        transforms: [
          {
            operation: "set",
            path: ["result", "score", "max"],
            value: "100",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00006",
            section: "Data 2.2.s4.b2",
            title: "Statements reject wrong data types",
          },
        ],
      },
      {
        idSuffix: "result-success-string",
        title: "A Statement rejects a string where result.success requires a boolean",
        transforms: [
          {
            operation: "set",
            path: ["result", "success"],
            value: "We regret to inform you that your effort was unsuccessful.",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00006",
            section: "Data 2.2.s4.b2",
            title: "Statements reject wrong data types",
          },
        ],
      },
      {
        idSuffix: "result-completion-string",
        title: "A Statement rejects a string where result.completion requires a boolean",
        transforms: [
          {
            operation: "set",
            path: ["result", "completion"],
            value: "false",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00006",
            section: "Data 2.2.s4.b2",
            title: "Statements reject wrong data types",
          },
        ],
      },
    ],
  });

  const invalidFormatCases = statementMutationFamily({
    familyId: "v2.statements.invalid-format",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "invalid-format"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: formattingLegacyConfigFile,
    variants: [
      {
        idSuffix: "statement-id-numeric",
        title: 'A Statement rejects a numeric value for the "id" field',
        transforms: [
          {
            operation: "set",
            path: ["id"],
            value: 42,
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00007",
            section: "Data 2.2.s4.b4",
            title: "Statements reject invalid formatted values",
          },
        ],
      },
      {
        idSuffix: "statement-id-object",
        title: 'A Statement rejects an object value for the "id" field',
        transforms: [
          {
            operation: "set",
            path: ["id"],
            value: { key: "value" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00007",
            section: "Data 2.2.s4.b4",
            title: "Statements reject invalid formatted values",
          },
        ],
      },
      {
        idSuffix: "statement-id-too-many-digits",
        title: 'A Statement rejects a UUID with too many digits in the "id" field',
        transforms: [
          {
            operation: "set",
            path: ["id"],
            value: "111111111-1111-4111-8111-111111111111",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00007",
            section: "Data 2.2.s4.b4",
            title: "Statements reject invalid formatted values",
          },
        ],
      },
      {
        idSuffix: "statement-id-invalid-letter",
        title: 'A Statement rejects a UUID with invalid hexadecimal letters in the "id" field',
        transforms: [
          {
            operation: "set",
            path: ["id"],
            value: "11111111-1111-4111-8111-11111111111G",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00007",
            section: "Data 2.2.s4.b4",
            title: "Statements reject invalid formatted values",
          },
        ],
      },
    ],
  });

  const iriSchemeCases = statementMutationFamily({
    familyId: "v2.statements.invalid-iri-schemes",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "iri"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: formattingLegacyConfigFile,
    variants: [
      {
        idSuffix: "verb-id-no-scheme",
        title: "A Statement rejects a verb id without an IRI scheme",
        transforms: [
          {
            operation: "set",
            path: ["verb", "id"],
            value: "example.test/xapi/verbs/completed",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00011",
            section: "Data 2.2.s4.b1.b8",
            title: "Statements reject IRIs without schemes",
          },
        ],
      },
      {
        idSuffix: "object-id-no-scheme",
        title: "A Statement rejects an object id without an IRI scheme",
        transforms: [
          {
            operation: "set",
            path: ["object", "id"],
            value: "example.test/xapi/activities/first-proof-slice",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00011",
            section: "Data 2.2.s4.b1.b8",
            title: "Statements reject IRIs without schemes",
          },
        ],
      },
      {
        idSuffix: "definition-type-no-scheme",
        title: "A Statement rejects an object definition type without an IRI scheme",
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "type"],
            value: "example.test/xapi/activity-type",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00011",
            section: "Data 2.2.s4.b1.b8",
            title: "Statements reject IRIs without schemes",
          },
        ],
      },
      {
        idSuffix: "definition-more-info-no-scheme",
        title: "A Statement rejects an object definition moreInfo value without an IRI scheme",
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "moreInfo"],
            value: "example.test/xapi/more-info",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00011",
            section: "Data 2.2.s4.b1.b8",
            title: "Statements reject IRIs without schemes",
          },
        ],
      },
    ],
  });

  const mboxIriCases = statementMutationFamily({
    familyId: "v2.statements.invalid-mbox-iri",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "mbox"],
    legacyTraceSuiteFile: ifisLegacyConfigFile,
    variants: buildRepeatedActorMutationVariants({
      description: "mbox is not a valid mailto IRI",
      requirementRefs: [
        {
          id: "XAPI-00038",
          section: "Data 2.4.2.3.s3.table1.row1",
          title: "mbox values must be mailto IRIs",
        },
      ],
      buildAgent: () => buildAgentWithMbox(invalidMailtoIri),
      buildGroup: () => buildGroupWithMbox(invalidMailtoIri),
    }),
  });

  const mboxMailtoCases = statementMutationFamily({
    familyId: "v2.statements.invalid-mbox-mailto",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "mbox"],
    legacyTraceSuiteFile: ifisLegacyConfigFile,
    variants: buildRepeatedActorMutationVariants({
      description: "mbox is not a valid mailto email address",
      requirementRefs: [
        {
          id: "XAPI-00038",
          section: "Data 2.4.2.3.s3.table1.row1",
          title: "mbox values must be mailto IRIs",
        },
      ],
      buildAgent: () => buildAgentWithMbox(invalidMailtoEmail),
      buildGroup: () => buildGroupWithMbox(invalidMailtoEmail),
    }),
  });

  const mboxSha1sumCases = statementMutationFamily({
    familyId: "v2.statements.invalid-mbox-sha1sum",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "mbox-sha1sum"],
    legacyTraceSuiteFile: ifisLegacyConfigFile,
    variants: buildRepeatedActorMutationVariants({
      description: "mbox_sha1sum is not a string",
      requirementRefs: [
        {
          id: "XAPI-00039",
          section: "Data 2.4.2.3.s3.table1.row2",
          title: "mbox_sha1sum values must be strings",
        },
      ],
      buildAgent: () => buildAgentWithMboxSha1sum({ key: "value" }),
      buildGroup: () => buildGroupWithMboxSha1sum({ key: "value" }),
    }),
  });

  const openIdCases = statementMutationFamily({
    familyId: "v2.statements.invalid-openid",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "openid"],
    legacyTraceSuiteFile: ifisLegacyConfigFile,
    variants: buildRepeatedActorMutationVariants({
      description: "openid is not a valid URI",
      requirementRefs: [
        {
          id: "XAPI-00040",
          section: "Data 2.4.2.3.s3.table1.row3",
          title: "openid values must be URIs",
        },
      ],
      buildAgent: () => buildAgentWithOpenId(invalidOpenId),
      buildGroup: () => buildGroupWithOpenId(invalidOpenId),
    }),
  });

  const accountHomePageMissingCases = statementMutationFamily({
    familyId: "v2.statements.account-home-page-missing",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "account"],
    legacyTraceSuiteFile: accountObjectsLegacyConfigFile,
    variants: buildRepeatedActorMutationVariants({
      description: "account.homePage is missing",
      requirementRefs: [
        {
          id: "XAPI-00042",
          section: "Data 2.4.2.4.s2.table1.row1",
          title: "Account objects require homePage",
        },
      ],
      buildAgent: () => buildAgentWithAccount(buildAccount(undefined, validAccountName)),
      buildGroup: () => buildGroupWithAccount(buildAccount(undefined, validAccountName)),
    }),
  });

  const accountHomePageInvalidCases = statementMutationFamily({
    familyId: "v2.statements.account-home-page-invalid",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "account"],
    legacyTraceSuiteFile: accountObjectsLegacyConfigFile,
    variants: buildRepeatedActorMutationVariants({
      description: "account.homePage is not a valid URI",
      requirementRefs: [
        {
          id: "XAPI-00042",
          section: "Data 2.4.2.4.s2.table1.row1",
          title: "Account objects require valid homePage IRIs",
        },
      ],
      buildAgent: () => buildAgentWithAccount(buildAccount(invalidAccountHomePage, validAccountName)),
      buildGroup: () => buildGroupWithAccount(buildAccount(invalidAccountHomePage, validAccountName)),
    }),
  });

  const accountNameMissingCases = statementMutationFamily({
    familyId: "v2.statements.account-name-missing",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "account"],
    legacyTraceSuiteFile: accountObjectsLegacyConfigFile,
    variants: buildRepeatedActorMutationVariants({
      description: "account.name is missing",
      requirementRefs: [
        {
          id: "XAPI-00043",
          section: "Data 2.4.2.4.s2.table1.row2",
          title: "Account objects require name",
        },
      ],
      buildAgent: () => buildAgentWithAccount(buildAccount(validAccountHomePage)),
      buildGroup: () => buildGroupWithAccount(buildAccount(validAccountHomePage)),
    }),
  });

  const attachmentIriCases = statementMutationFamily({
    familyId: "v2.statements.invalid-attachment-iri",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "attachment", "iri"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    variants: [
      {
        idSuffix: "usage-type-no-scheme",
        title: "A Statement rejects an attachment usageType without an IRI scheme",
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [
              buildAttachmentFixture({
                usageType: "example.test/xapi/attachments/proof",
              }),
            ],
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00011",
            section: "Data 2.2.s4.b1.b8",
            title: "Attachment usageType values must be IRIs",
          },
        ],
      },
      {
        idSuffix: "file-url-no-scheme",
        title: "A Statement rejects an attachment fileUrl without an IRI scheme",
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [
              buildAttachmentFixture({
                fileUrl: "example.test/files/proof.txt",
              }),
            ],
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00011",
            section: "Data 2.2.s4.b1.b8",
            title: "Attachment fileUrl values must be IRIs",
          },
        ],
      },
    ],
  });

  const agentIfiExclusivityCases = statementMutationFamily({
    familyId: "v2.statements.agent-ifi-exclusivity",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "exclusivity", "agent"],
    legacyTraceSuiteFile: agentsLegacyConfigFile,
    variants: buildIfiExclusivityVariants({
      placements: actorLikePlacements.filter((placement) => placement.kind === "agent"),
      requirementRefs: [
        {
          id: "XAPI-00034",
          section: "Data 2.4.2.1.s2.b2",
          title: "Agents must use only one IFI",
        },
      ],
    }),
  });

  const groupIfiExclusivityCases = statementMutationFamily({
    familyId: "v2.statements.group-ifi-exclusivity",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "exclusivity", "group"],
    legacyTraceSuiteFile: groupsLegacyConfigFile,
    variants: buildIfiExclusivityVariants({
      placements: actorLikePlacements.filter((placement) => placement.kind === "group"),
      requirementRefs: [
        {
          id: "XAPI-00037",
          section: "Data 2.4.2.2.s5.b1",
          title: "Identified Groups must use only one IFI",
        },
      ],
    }),
  });

  const identifiedGroupPlacements = actorLikePlacements.filter(
    (placement) => placement.kind === "group" && placement.idSuffix !== "authority-group",
  );

  const agentIfiRequiredCases = statementMutationFamily({
    familyId: "v2.statements.agent-ifi-required",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "required", "agent"],
    legacyTraceSuiteFile: agentsLegacyConfigFile,
    variants: buildMissingIfiVariants({
      placements: actorLikePlacements.filter((placement) => placement.kind === "agent"),
      description: "no IFI is present",
      buildValue: () => buildAgentWithoutIfi(),
      requirementRefs: [
        {
          id: "XAPI-00034",
          section: "Data 2.4.2.1.s2.b1",
          title: "Agents must include exactly one IFI",
        },
      ],
    }),
  });

  const groupIfiOrMemberRequiredCases = statementMutationFamily({
    familyId: "v2.statements.group-ifi-or-member-required",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "required", "group"],
    legacyTraceSuiteFile: groupsLegacyConfigFile,
    variants: buildMissingIfiVariants({
      placements: identifiedGroupPlacements,
      description: "no IFI and no member are present",
      buildValue: () => buildGroupWithoutIfiOrMember(),
      requirementRefs: [
        {
          id: "XAPI-00037",
          section: "Data 2.4.2.2.s2.table2.row1",
          title: "Groups without members must include an IFI",
        },
      ],
    }),
  });

  const groupIfiAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.group-ifi-acceptance",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "acceptance", "group"],
    expectedStatus: 200,
    legacyTraceSuiteFile: groupsLegacyConfigFile,
    variants: buildIfiAcceptanceVariants({
      placements: identifiedGroupPlacements,
      requirementRefs: [
        {
          id: "XAPI-00037",
          section: "Data 2.4.2.2.s2.table2.row1",
          title: "Identified Groups accept exactly one IFI",
        },
      ],
    }),
  });

  const groupIfiAcceptanceNoMemberCases = statementMutationFamily({
    familyId: "v2.statements.group-ifi-acceptance-no-member",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "acceptance", "group", "no-member"],
    expectedStatus: 200,
    legacyTraceSuiteFile: groupsLegacyConfigFile,
    variants: buildIfiAcceptanceVariants({
      placements: identifiedGroupPlacements,
      includeMember: false,
      requirementRefs: [
        {
          id: "XAPI-00037",
          section: "Data 2.4.2.2.s2.table2.row4",
          title: "Identified Groups accept a sole IFI without members",
        },
      ],
    }),
  });

  const agentIfiAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.agent-ifi-acceptance",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "acceptance", "agent"],
    expectedStatus: 200,
    legacyTraceSuiteFile: agentsLegacyConfigFile,
    variants: buildIfiAcceptanceVariants({
      placements: actorLikePlacements.filter((placement) => placement.kind === "agent"),
      requirementRefs: [
        {
          id: "XAPI-00034",
          section: "Data 2.4.2.1.s2.b1",
          title: "Agents accept exactly one IFI",
        },
      ],
    }),
  });

  const authorityGroupAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.authority-group-acceptance",
    suiteTitle: "Statement Authority",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "authority", "group", "acceptance"],
    expectedStatus: 200,
    legacyTraceSuiteFile: authoritiesLegacySuiteFile,
    legacyTraceConfigFile: authoritiesLegacyConfigFile,
    variants: [
      {
        idSuffix: "anonymous-two-member",
        title: "A Statement accepts an authority anonymous group with exactly two members",
        transforms: [
          {
            operation: "set",
            path: ["authority"],
            value: buildAnonymousAuthorityGroup(),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00098",
            section: "Data 2.4.9.s3.b1",
            title: "Authority groups are anonymous groups with exactly two members",
          },
        ],
      },
    ],
  });

  const authorityGroupRejectionCases = statementMutationFamily({
    familyId: "v2.statements.authority-group-rejection",
    suiteTitle: "Statement Authority",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "authority", "group", "rejection"],
    legacyTraceSuiteFile: authoritiesLegacySuiteFile,
    legacyTraceConfigFile: authoritiesLegacyConfigFile,
    variants: [
      {
        idSuffix: "identified-mbox",
        title: "A Statement rejects an authority identified group that uses mbox",
        transforms: [
          {
            operation: "set",
            path: ["authority"],
            value: buildIdentifiedAuthorityGroup({
              mbox: "mailto:bob@example.com",
            }),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00024",
            section: "Data 2.4.s1.table1.row9",
            title: "Authority groups do not use identified group IFIs",
          },
        ],
      },
      {
        idSuffix: "identified-mbox-sha1sum",
        title: "A Statement rejects an authority identified group that uses mbox_sha1sum",
        transforms: [
          {
            operation: "set",
            path: ["authority"],
            value: buildIdentifiedAuthorityGroup({
              mbox_sha1sum: validMboxSha1sum,
            }),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00024",
            section: "Data 2.4.s1.table1.row9",
            title: "Authority groups do not use identified group IFIs",
          },
        ],
      },
      {
        idSuffix: "identified-openid",
        title: "A Statement rejects an authority identified group that uses openid",
        transforms: [
          {
            operation: "set",
            path: ["authority"],
            value: buildIdentifiedAuthorityGroup({
              openid: "http://openid.example.org/12345",
            }),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00024",
            section: "Data 2.4.s1.table1.row9",
            title: "Authority groups do not use identified group IFIs",
          },
        ],
      },
      {
        idSuffix: "identified-account",
        title: "A Statement rejects an authority identified group that uses account",
        transforms: [
          {
            operation: "set",
            path: ["authority"],
            value: buildIdentifiedAuthorityGroup({
              account: buildAccount(validAuthorityAccountHomePage, validAuthorityAccountName),
            }),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00024",
            section: "Data 2.4.s1.table1.row9",
            title: "Authority groups do not use identified group IFIs",
          },
        ],
      },
      {
        idSuffix: "anonymous-no-member",
        title: "A Statement rejects an authority anonymous group without two members",
        transforms: [
          {
            operation: "set",
            path: ["authority"],
            value: buildGroupWithoutIfiOrMember(),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00098",
            section: "Data 2.4.9.s3.b1",
            title: "Authority groups require exactly two members",
          },
        ],
      },
      {
        idSuffix: "anonymous-one-member",
        title: "A Statement rejects an authority anonymous group with one member",
        transforms: [
          {
            operation: "set",
            path: ["authority"],
            value: buildAnonymousAuthorityGroup([buildAuthorityMboxAgent()]),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00098",
            section: "Data 2.4.9.s3.b1",
            title: "Authority groups require exactly two members",
          },
        ],
      },
      {
        idSuffix: "anonymous-three-member",
        title: "A Statement rejects an authority anonymous group with three members",
        transforms: [
          {
            operation: "set",
            path: ["authority"],
            value: buildAnonymousAuthorityGroup([
              buildAuthorityAccountAgent(),
              buildAuthorityMboxAgent(),
              buildAuthorityMboxAgent(validAuthorityThirdMemberMbox),
            ]),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00098",
            section: "Data 2.4.9.s3.b1",
            title: "Authority groups require exactly two members",
          },
        ],
      },
    ],
  });

  const min = 0.12123434;
  const raw = 12.125;
  const max = 45.45;
  const precisionCase = statementRoundTripCase({
    caseId: "v2.statements.numeric-precision.score-roundtrip",
    title: "The Statements resource preserves IEEE 754 score precision across submit and query",
    specVersion,
    queryParam: "statementId",
    requirementRefs: [
      {
        id: "XAPI-00002",
        section: "Data 2.2.s4.b3",
        title: "Statements preserve IEEE 754 score precision",
      },
    ],
    tags: ["v2.0.0", "statements", "formatting", "precision"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    transforms: [
      {
        operation: "set",
        path: ["result", "score", "min"],
        value: min,
      },
      {
        operation: "set",
        path: ["result", "score", "raw"],
        value: raw,
      },
      {
        operation: "set",
        path: ["result", "score", "max"],
        value: max,
      },
      {
        operation: "set",
        path: ["result", "score", "scaled"],
        value: min,
      },
    ],
    queryJsonPathEquals: [
      {
        path: ["result", "score", "min"],
        equals: min,
      },
      {
        path: ["result", "score", "raw"],
        equals: raw,
      },
      {
        path: ["result", "score", "max"],
        equals: max,
      },
      {
        path: ["result", "score", "scaled"],
        equals: min,
      },
    ],
    capabilityFlags: ["query", "retrieval", "precision"],
    notes: ["proof-slice numeric precision"],
  });

  const queryValidationCases = statementQueryValidationFamily({
    familyId: "v2.statements.query-validation",
    suiteTitle: "Statement Query Validation",
    specVersion,
    tags: ["v2.0.0", "statements", "query", "validation"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    variants: [
      {
        idSuffix: "invalid-statement-id",
        title: "The Statements resource rejects an invalid statementId query value",
        query: {
          statementId: "wrong",
        },
        requirementRefs: [
          {
            id: "XAPI-00012",
            section: "Data 2.2.s4.b4",
            title: "Statement query parameters follow statement value validation rules",
          },
        ],
      },
      {
        idSuffix: "invalid-voided-statement-id",
        title: "The Statements resource rejects an invalid voidedStatementId query value",
        query: {
          voidedStatementId: "wrong",
        },
        requirementRefs: [
          {
            id: "XAPI-00012",
            section: "Data 2.2.s4.b4",
            title: "Statement query parameters follow statement value validation rules",
          },
        ],
      },
      {
        idSuffix: "invalid-agent",
        title: "The Statements resource rejects an invalid agent query value",
        query: {
          agent: "wrong",
        },
        requirementRefs: [
          {
            id: "XAPI-00012",
            section: "Data 2.2.s4.b4",
            title: "Statement query parameters follow statement value validation rules",
          },
        ],
      },
      {
        idSuffix: "invalid-verb",
        title: "The Statements resource rejects an invalid verb query value",
        query: {
          verb: "not.a.valid.iri.com/verb",
        },
        requirementRefs: [
          {
            id: "XAPI-00012",
            section: "Data 2.2.s4.b4",
            title: "Statement query parameters follow statement value validation rules",
          },
        ],
      },
      {
        idSuffix: "invalid-activity",
        title: "The Statements resource rejects an invalid activity query value",
        query: {
          activity: "not.a.valid.iri.com/activity",
        },
        requirementRefs: [
          {
            id: "XAPI-00012",
            section: "Data 2.2.s4.b4",
            title: "Statement query parameters follow statement value validation rules",
          },
        ],
      },
      {
        idSuffix: "invalid-registration",
        title: "The Statements resource rejects an invalid registration query value",
        query: {
          registration: "wrong",
        },
        requirementRefs: [
          {
            id: "XAPI-00012",
            section: "Data 2.2.s4.b4",
            title: "Statement query parameters follow statement value validation rules",
          },
        ],
      },
    ],
  });

  const queryCase = queryRetrievalFamily({
    caseId: "v2.statements.query.statement-id-roundtrip",
    title: "The Statements resource returns a submitted statement when queried by statementId",
    specVersion,
    queryParam: "statementId",
    requirementRefs: [
      {
        id: "XAPI-01001",
        section: "Communication 4.1.6.1",
        title: "Statements can be queried by statementId",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "retrieval"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
  });

  return {
    type: "suite",
    id: "v2.proof-slice.statements",
    title: "Statements",
    specVersion: "2.0.0",
    tags: ["proof-slice", "statements"],
    children: [
      {
        type: "suite",
        id: "v2.proof-slice.statements.formatting",
        title: "Statement Formatting",
        specVersion: "2.0.0",
        tags: ["formatting"],
        children: [
          ...formattingCases,
          ...nullValueCases,
          ...wrongTypeCases,
          ...invalidFormatCases,
          ...iriSchemeCases,
          ...mboxIriCases,
          ...mboxMailtoCases,
          ...mboxSha1sumCases,
          ...openIdCases,
          ...accountHomePageMissingCases,
          ...accountHomePageInvalidCases,
          ...accountNameMissingCases,
          ...agentIfiAcceptanceCases,
          ...agentIfiRequiredCases,
          ...groupIfiOrMemberRequiredCases,
          ...groupIfiAcceptanceCases,
          ...groupIfiAcceptanceNoMemberCases,
          ...agentIfiExclusivityCases,
          ...groupIfiExclusivityCases,
          ...attachmentIriCases,
          precisionCase,
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.statements.authority",
        title: "Statement Authority",
        specVersion,
        tags: ["authority"],
        children: [...authorityGroupAcceptanceCases, ...authorityGroupRejectionCases],
      },
      {
        type: "suite",
        id: "v2.proof-slice.statements.query-validation",
        title: "Statement Query Validation",
        specVersion,
        tags: ["query", "validation"],
        children: queryValidationCases,
      },
      {
        type: "suite",
        id: "v2.proof-slice.statements.query",
        title: "Statement Query",
        specVersion,
        tags: ["query"],
        children: [queryCase],
      },
    ],
  };
}

export function createV20StateResourceProofSliceSuite(): SuiteDefinition {
  const stateDocument = buildActivityStateDocumentFixture();
  const stateIdentity = buildActivityStateIdentityFixture();
  const stateListIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/state-proof-slice/list",
    stateId: "proof-state-list",
  });
  const stateSinceIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/state-proof-slice/since",
    stateId: "proof-state-since",
  });
  const stateMergeIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/state-proof-slice/merge",
    stateId: "proof-state-merge",
  });
  const stateNonJsonPostRejectIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/state-proof-slice/merge-reject-post",
    stateId: "proof-state-merge-reject-post",
  });
  const stateExistingNonJsonRejectIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/state-proof-slice/merge-reject-existing",
    stateId: "proof-state-merge-reject-existing",
  });
  const stateDeleteIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/state-proof-slice/delete",
    stateId: "proof-state-delete",
  });
  const stateListQuery = {
    activityId: stateListIdentity.activityId,
    agent: stateListIdentity.agent,
  };
  const stateSinceQuery = {
    activityId: stateSinceIdentity.activityId,
    agent: stateSinceIdentity.agent,
  };
  const stateDeleteQuery = {
    activityId: stateDeleteIdentity.activityId,
    agent: stateDeleteIdentity.agent,
  };

  const stateRoundTripCase = documentRoundTripCase({
    caseId: "v2.activities-state.document-roundtrip",
    title: "The State Resource returns a stored document when queried by stateId",
    specVersion,
    endpoint: "activities-state",
    submitMethod: "PUT",
    requirementRefs: [
      {
        id: "XAPI-00192",
        section: "Communication 2.3.s3",
        title: "State Resource GET with stateId returns the stored document",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "roundtrip"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    query: stateIdentity,
    body: stateDocument,
    bodyFixtureName: "activity-state-default",
    queryJsonPathEquals: [
      {
        path: ["bookmark"],
        equals: stateDocument.bookmark,
      },
      {
        path: ["progress", "attempts"],
        equals: stateDocument.progress.attempts,
      },
      {
        path: ["progress", "complete"],
        equals: stateDocument.progress.complete,
      },
      {
        path: ["context", "location"],
        equals: stateDocument.context.location,
      },
    ],
    capabilityFlags: ["document", "retrieval", "state"],
    notes: ["proof-slice activity state roundtrip"],
  });

  const stateListCase = requestSequenceCase({
    caseId: "v2.activities-state.document-list",
    title: "The State Resource lists stored state ids when queried without stateId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00193",
        section: "Communication 2.3.s4",
        title: "State Resource GET without stateId returns matching ids",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "list"],
    capabilityFlags: ["document", "list", "state"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: ["proof-slice activity state list"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", stateListIdentity, {
          value: buildActivityStateDocumentFixture(),
          fixtureName: "activity-state-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-state", stateListQuery),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([stateListIdentity.stateId]),
        },
      },
    ],
  });

  const stateSinceCase = requestSequenceCase({
    caseId: "v2.activities-state.document-list-since",
    title: "The State Resource filters listed state ids using the since parameter",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00221",
        section: "Communication 2.3.s4",
        title: "State Resource GET without stateId accepts since",
      },
      {
        id: "XAPI-00195",
        section: "Communication 2.3.s4",
        title: "State Resource list results can be filtered by since",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "list", "since"],
    capabilityFlags: ["document", "list", "state", "since"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: ["proof-slice activity state since filtering"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", stateSinceIdentity, {
          value: buildActivityStateDocumentFixture(),
          fixtureName: "activity-state-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-state", {
          ...stateSinceQuery,
          since: validSinceTimestamp,
        }),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([stateSinceIdentity.stateId]),
        },
      },
    ],
  });

  const stateInvalidSinceCase = singleRequestCase({
    caseId: "v2.activities-state.invalid-since",
    title: "The State Resource rejects an invalid since value when listing state ids",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00204",
        section: "Communication 2.3.s4",
        title: "State Resource rejects invalid since values",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "list", "since"],
    capabilityFlags: ["document", "list", "state", "since"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    request: buildVersionedRequest("GET", "activities-state", {
      activityId: stateSinceIdentity.activityId,
      agent: stateSinceIdentity.agent,
      since: invalidSinceTimestamp,
    }),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice activity state invalid since"],
  });

  const stateInvalidAgentQueryCase = singleRequestCase({
    caseId: "v2.activities-state.document-invalid-agent-query",
    title: "The State Resource rejects a POST request whose agent query value is not valid JSON",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00235",
        section: "Communication 2.3",
        title: "State Resource rejects invalid JSON agent query values",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "invalid", "agent-query"],
    capabilityFlags: ["document", "state", "invalid", "agent-query"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    request: buildVersionedRequest(
      "POST",
      "activities-state",
      {
        ...stateMergeIdentity,
        stateId: `${stateMergeIdentity.stateId}-invalid-agent`,
        agent: invalidAgentQuery,
      },
      {
        value: {
          car: "Honda",
        },
      },
    ),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice activity state invalid agent query"],
  });

  const stateMergeCase = requestSequenceCase({
    caseId: "v2.activities-state.document-merge",
    title: "The State Resource merges JSON documents on POST when a state document already exists",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00234",
        section: "Communication 2.2.s7",
        title: "State Resource performs JSON document merge",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "merge"],
    capabilityFlags: ["document", "merge", "state"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: ["proof-slice activity state merge"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", stateMergeIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "activities-state", stateMergeIdentity, {
          value: {
            type: "Civic",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-state", stateMergeIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["car"],
              equals: "Honda",
            },
            {
              path: ["type"],
              equals: "Civic",
            },
          ],
        },
      },
    ],
  });

  const stateNonJsonPostRejectCase = requestSequenceCase({
    caseId: "v2.activities-state.document-merge-rejects-non-json-post",
    title: "The State Resource rejects a POST merge when the incoming document is not application/json",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00229",
        section: "Communication 2.3.s3.table1.row3",
        title: "State Resource rejects non-JSON POST merges without mutation",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "merge", "invalid"],
    capabilityFlags: ["document", "merge", "state", "invalid"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: ["proof-slice activity state non-json incoming merge rejection"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", stateNonJsonPostRejectIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "activities-state", stateNonJsonPostRejectIdentity, {
          kind: "text",
          value: nonJsonDocumentBody,
          contentType: "not/json",
        }),
        assertion: {
          status: 400,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-state", stateNonJsonPostRejectIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["car"],
              equals: "Honda",
            },
          ],
        },
      },
    ],
  });

  const stateExistingNonJsonRejectCase = requestSequenceCase({
    caseId: "v2.activities-state.document-merge-rejects-existing-non-json",
    title: "The State Resource rejects a POST merge when the existing document is not application/json",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00229",
        section: "Communication 2.3.s3.table1.row3",
        title: "State Resource rejects merges against non-JSON stored documents",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "merge", "invalid"],
    capabilityFlags: ["document", "merge", "state", "invalid"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: ["proof-slice activity state existing non-json merge rejection"],
    steps: [
      {
        request: buildVersionedRequest("PUT", "activities-state", stateExistingNonJsonRejectIdentity, {
          kind: "text",
          value: existingNonJsonDocumentBody,
          contentType: "application/octet-stream",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "activities-state", stateExistingNonJsonRejectIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 400,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-state", stateExistingNonJsonRejectIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: [],
              equals: existingNonJsonDocumentBody,
            },
          ],
        },
      },
    ],
  });

  const stateDeleteCase = requestSequenceCase({
    caseId: "v2.activities-state.delete-context-documents",
    title: "The State Resource deletes matching documents when DELETE omits stateId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00194",
        section: "Communication 2.3.s5",
        title: "State Resource DELETE without stateId deletes matching documents",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "delete"],
    capabilityFlags: ["document", "delete", "state"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: ["proof-slice activity state delete"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", stateDeleteIdentity, {
          value: buildActivityStateDocumentFixture(),
          fixtureName: "activity-state-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("DELETE", "activities-state", stateDeleteQuery),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-state", stateDeleteQuery),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([]),
        },
      },
    ],
  });

  return {
    type: "suite",
    id: "v2.proof-slice.activities-state",
    title: "State Resource",
    specVersion,
    tags: ["proof-slice", "activities-state"],
    children: [
      {
        type: "suite",
        id: "v2.proof-slice.activities-state.roundtrip",
        title: "State Document Roundtrip",
        specVersion,
        tags: ["roundtrip"],
        children: [stateRoundTripCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-state.listing",
        title: "State Document Listing",
        specVersion,
        tags: ["list"],
        children: [stateListCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-state.since",
        title: "State Document Since",
        specVersion,
        tags: ["list", "since"],
        children: [stateSinceCase, stateInvalidSinceCase, stateInvalidAgentQueryCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-state.merge",
        title: "State Document Merge",
        specVersion,
        tags: ["merge"],
        children: [stateMergeCase, stateNonJsonPostRejectCase, stateExistingNonJsonRejectCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-state.deletion",
        title: "State Document Deletion",
        specVersion,
        tags: ["delete"],
        children: [stateDeleteCase],
      },
    ],
  };
}

export function createV20ActivityProfileResourceProofSliceSuite(): SuiteDefinition {
  const profileDocument = buildActivityProfileDocumentFixture();
  const profileIdentity = buildActivityProfileIdentityFixture();
  const profileListIdentity = buildActivityProfileIdentityFixture({
    activityId: "https://example.test/xapi/activities/profile-proof-slice/list",
    profileId: "proof-activity-profile-list",
  });
  const profileSinceIdentity = buildActivityProfileIdentityFixture({
    activityId: "https://example.test/xapi/activities/profile-proof-slice/since",
    profileId: "proof-activity-profile-since",
  });
  const profileMergeIdentity = buildActivityProfileIdentityFixture({
    activityId: "https://example.test/xapi/activities/profile-proof-slice/merge",
    profileId: "proof-activity-profile-merge",
  });
  const profileNonJsonPostRejectIdentity = buildActivityProfileIdentityFixture({
    activityId: "https://example.test/xapi/activities/profile-proof-slice/merge-reject-post",
    profileId: "proof-activity-profile-merge-reject-post",
  });
  const profileExistingNonJsonRejectIdentity = buildActivityProfileIdentityFixture({
    activityId: "https://example.test/xapi/activities/profile-proof-slice/merge-reject-existing",
    profileId: "proof-activity-profile-merge-reject-existing",
  });
  const profileDeleteIdentity = buildActivityProfileIdentityFixture({
    activityId: "https://example.test/xapi/activities/profile-proof-slice/delete",
    profileId: "proof-activity-profile-delete",
  });
  const profileListQuery = {
    activityId: profileListIdentity.activityId,
  };
  const profileSinceQuery = {
    activityId: profileSinceIdentity.activityId,
  };
  const profileDeleteListQuery = {
    activityId: profileDeleteIdentity.activityId,
  };

  const roundTripCase = documentRoundTripCase({
    caseId: "v2.activities-profile.document-roundtrip",
    title: "The Activity Profile Resource returns a stored document when queried by profileId",
    specVersion,
    endpoint: "activities-profile",
    submitMethod: "POST",
    requirementRefs: [
      {
        id: "XAPI-00288",
        section: "Communication 2.7.s3",
        title: "Activity Profile GET with profileId returns the stored document",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "roundtrip"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    query: profileIdentity,
    body: profileDocument,
    bodyFixtureName: "activity-profile-default",
    queryJsonPathEquals: [
      {
        path: ["summary"],
        equals: profileDocument.summary,
      },
      {
        path: ["metadata", "audience"],
        equals: profileDocument.metadata.audience,
      },
      {
        path: ["metadata", "level"],
        equals: profileDocument.metadata.level,
      },
    ],
    capabilityFlags: ["document", "retrieval", "activity-profile"],
    notes: ["proof-slice activity profile roundtrip"],
  });

  const listCase = requestSequenceCase({
    caseId: "v2.activities-profile.document-list",
    title: "The Activity Profile Resource lists stored profile ids when queried without profileId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00289",
        section: "Communication 2.7.s4",
        title: "Activity Profile GET without profileId returns matching ids",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "list"],
    capabilityFlags: ["document", "list", "activity-profile"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: ["proof-slice activity profile list"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-profile", profileListIdentity, {
          value: buildActivityProfileDocumentFixture(),
          fixtureName: "activity-profile-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-profile", profileListQuery),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([profileListIdentity.profileId]),
        },
      },
    ],
  });

  const sinceCase = requestSequenceCase({
    caseId: "v2.activities-profile.document-list-since",
    title: "The Activity Profile Resource filters listed profile ids using the since parameter",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00303",
        section: "Communication 2.7.s4",
        title: "Activity Profile GET without profileId accepts since",
      },
      {
        id: "XAPI-00294",
        section: "Communication 2.7.s4",
        title: "Activity Profile list results can be filtered by since",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "list", "since"],
    capabilityFlags: ["document", "list", "activity-profile", "since"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: ["proof-slice activity profile since filtering"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-profile", profileSinceIdentity, {
          value: buildActivityProfileDocumentFixture(),
          fixtureName: "activity-profile-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-profile", {
          ...profileSinceQuery,
          since: validSinceTimestamp,
        }),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([profileSinceIdentity.profileId]),
        },
      },
    ],
  });

  const invalidSinceCase = singleRequestCase({
    caseId: "v2.activities-profile.invalid-since",
    title: "The Activity Profile Resource rejects an invalid since value when listing profile ids",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00295",
        section: "Communication 2.7.s4",
        title: "Activity Profile rejects invalid since values",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "list", "since"],
    capabilityFlags: ["document", "list", "activity-profile", "since"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    request: buildVersionedRequest("GET", "activities-profile", {
      activityId: profileSinceIdentity.activityId,
      since: invalidSinceTimestamp,
    }),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice activity profile invalid since"],
  });

  const invalidJsonPostCase = singleRequestCase({
    caseId: "v2.activities-profile.document-invalid-json-post",
    title: "The Activity Profile Resource rejects a POST request with an invalid JSON document body",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00314",
        section: "Communication 2.7.s4.table1.row2",
        title: "Activity Profile rejects invalid JSON document bodies",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "invalid", "json"],
    capabilityFlags: ["document", "activity-profile", "invalid", "json"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    request: buildVersionedRequest(
      "POST",
      "activities-profile",
      {
        ...profileMergeIdentity,
        profileId: `${profileMergeIdentity.profileId}-invalid-json`,
      },
      {
        kind: "text",
        value: invalidJsonDocumentBody,
        contentType: "application/json",
      },
    ),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice activity profile invalid JSON document body"],
  });

  const mergeCase = requestSequenceCase({
    caseId: "v2.activities-profile.document-merge",
    title: "The Activity Profile Resource merges JSON documents on POST when a profile already exists",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00308",
        section: "Communication 2.2.s7",
        title: "Activity Profile performs JSON document merge",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "merge"],
    capabilityFlags: ["document", "merge", "activity-profile"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: ["proof-slice activity profile merge"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-profile", profileMergeIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "activities-profile", profileMergeIdentity, {
          value: {
            type: "Civic",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-profile", profileMergeIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["car"],
              equals: "Honda",
            },
            {
              path: ["type"],
              equals: "Civic",
            },
          ],
        },
      },
    ],
  });

  const nonJsonPostRejectCase = requestSequenceCase({
    caseId: "v2.activities-profile.document-merge-rejects-non-json-post",
    title: "The Activity Profile Resource rejects a POST merge when the incoming document is not application/json",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00313",
        section: "Communication 2.7.s3.table1.row3",
        title: "Activity Profile rejects non-JSON POST merges without mutation",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "merge", "invalid"],
    capabilityFlags: ["document", "merge", "activity-profile", "invalid"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: ["proof-slice activity profile non-json incoming merge rejection"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-profile", profileNonJsonPostRejectIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "activities-profile", profileNonJsonPostRejectIdentity, {
          kind: "text",
          value: nonJsonDocumentBody,
          contentType: "application/octet-stream",
        }),
        assertion: {
          status: 400,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-profile", profileNonJsonPostRejectIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["car"],
              equals: "Honda",
            },
          ],
        },
      },
    ],
  });

  const existingNonJsonRejectCase = requestSequenceCase({
    caseId: "v2.activities-profile.document-merge-rejects-existing-non-json",
    title: "The Activity Profile Resource rejects a POST merge when the existing document is not application/json",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00313",
        section: "Communication 2.7.s3.table1.row3",
        title: "Activity Profile rejects merges against non-JSON stored documents",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "merge", "invalid"],
    capabilityFlags: ["document", "merge", "activity-profile", "invalid"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: ["proof-slice activity profile existing non-json merge rejection"],
    steps: [
      {
        request: buildVersionedRequest("PUT", "activities-profile", profileExistingNonJsonRejectIdentity, {
          kind: "text",
          value: existingNonJsonDocumentBody,
          contentType: "application/octet-stream",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "activities-profile", profileExistingNonJsonRejectIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 400,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-profile", profileExistingNonJsonRejectIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: [],
              equals: existingNonJsonDocumentBody,
            },
          ],
        },
      },
    ],
  });

  const deleteCase = requestSequenceCase({
    caseId: "v2.activities-profile.delete-document",
    title: "The Activity Profile Resource deletes a stored document and removes it from profile listings",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00285",
        section: "Communication 2.7.s3",
        title: "Activity Profile DELETE removes the associated profile",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "delete"],
    capabilityFlags: ["document", "delete", "activity-profile"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: ["proof-slice activity profile delete"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-profile", profileDeleteIdentity, {
          value: buildActivityProfileDocumentFixture(),
          fixtureName: "activity-profile-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("DELETE", "activities-profile", profileDeleteIdentity),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-profile", profileDeleteListQuery),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([]),
        },
      },
    ],
  });

  return {
    type: "suite",
    id: "v2.proof-slice.activities-profile",
    title: "Activity Profile Resource",
    specVersion,
    tags: ["proof-slice", "activities-profile"],
    children: [
      {
        type: "suite",
        id: "v2.proof-slice.activities-profile.roundtrip",
        title: "Activity Profile Roundtrip",
        specVersion,
        tags: ["roundtrip"],
        children: [roundTripCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-profile.listing",
        title: "Activity Profile Listing",
        specVersion,
        tags: ["list"],
        children: [listCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-profile.since",
        title: "Activity Profile Since",
        specVersion,
        tags: ["list", "since"],
        children: [sinceCase, invalidSinceCase, invalidJsonPostCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-profile.merge",
        title: "Activity Profile Merge",
        specVersion,
        tags: ["merge"],
        children: [mergeCase, nonJsonPostRejectCase, existingNonJsonRejectCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-profile.deletion",
        title: "Activity Profile Deletion",
        specVersion,
        tags: ["delete"],
        children: [deleteCase],
      },
    ],
  };
}

export function createV20AgentProfileResourceProofSliceSuite(): SuiteDefinition {
  const profileDocument = buildAgentProfileDocumentFixture();
  const profileIdentity = buildAgentProfileIdentityFixture();
  const profileListIdentity = buildAgentProfileIdentityFixture({
    agent: JSON.stringify({
      objectType: "Agent",
      mbox: "mailto:agent-profile-list@example.test",
      name: "Agent Profile List",
    }),
    profileId: "proof-agent-profile-list",
  });
  const profileSinceIdentity = buildAgentProfileIdentityFixture({
    agent: JSON.stringify({
      objectType: "Agent",
      mbox: "mailto:agent-profile-since@example.test",
      name: "Agent Profile Since",
    }),
    profileId: "proof-agent-profile-since",
  });
  const profileMergeIdentity = buildAgentProfileIdentityFixture({
    agent: JSON.stringify({
      objectType: "Agent",
      mbox: "mailto:agent-profile-merge@example.test",
      name: "Agent Profile Merge",
    }),
    profileId: "proof-agent-profile-merge",
  });
  const profileNonJsonPostRejectIdentity = buildAgentProfileIdentityFixture({
    agent: JSON.stringify({
      objectType: "Agent",
      mbox: "mailto:agent-profile-merge-reject-post@example.test",
      name: "Agent Profile Merge Reject Post",
    }),
    profileId: "proof-agent-profile-merge-reject-post",
  });
  const profileExistingNonJsonRejectIdentity = buildAgentProfileIdentityFixture({
    agent: JSON.stringify({
      objectType: "Agent",
      mbox: "mailto:agent-profile-merge-reject-existing@example.test",
      name: "Agent Profile Merge Reject Existing",
    }),
    profileId: "proof-agent-profile-merge-reject-existing",
  });
  const profileDeleteIdentity = buildAgentProfileIdentityFixture({
    agent: JSON.stringify({
      objectType: "Agent",
      mbox: "mailto:agent-profile-delete@example.test",
      name: "Agent Profile Delete",
    }),
    profileId: "proof-agent-profile-delete",
  });
  const profileListQuery = {
    agent: profileListIdentity.agent,
  };
  const profileSinceQuery = {
    agent: profileSinceIdentity.agent,
  };
  const profileDeleteListQuery = {
    agent: profileDeleteIdentity.agent,
  };

  const roundTripCase = documentRoundTripCase({
    caseId: "v2.agents-profile.document-roundtrip",
    title: "The Agent Profile Resource returns a stored document when queried by profileId",
    specVersion,
    endpoint: "agents-profile",
    submitMethod: "POST",
    requirementRefs: [
      {
        id: "XAPI-00269",
        section: "Communication 2.6.s3",
        title: "Agent Profile GET with profileId returns the stored document",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "roundtrip"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    query: profileIdentity,
    body: profileDocument,
    bodyFixtureName: "agent-profile-default",
    queryJsonPathEquals: [
      {
        path: ["preference"],
        equals: profileDocument.preference,
      },
      {
        path: ["notifications", "email"],
        equals: profileDocument.notifications.email,
      },
      {
        path: ["notifications", "digest"],
        equals: profileDocument.notifications.digest,
      },
    ],
    capabilityFlags: ["document", "retrieval", "agent-profile"],
    notes: ["proof-slice agent profile roundtrip"],
  });

  const listCase = requestSequenceCase({
    caseId: "v2.agents-profile.document-list",
    title: "The Agent Profile Resource lists stored profile ids when queried without profileId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00270",
        section: "Communication 2.6.s4",
        title: "Agent Profile GET without profileId returns matching ids",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "list"],
    capabilityFlags: ["document", "list", "agent-profile"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: ["proof-slice agent profile list"],
    steps: [
      {
        request: buildVersionedRequest("POST", "agents-profile", profileListIdentity, {
          value: buildAgentProfileDocumentFixture(),
          fixtureName: "agent-profile-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "agents-profile", profileListQuery),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([profileListIdentity.profileId]),
        },
      },
    ],
  });

  const sinceCase = requestSequenceCase({
    caseId: "v2.agents-profile.document-list-since",
    title: "The Agent Profile Resource filters listed profile ids using the since parameter",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00268",
        section: "Communication 2.6.s4",
        title: "Agent Profile GET without profileId accepts since",
      },
      {
        id: "XAPI-00275",
        section: "Communication 2.6.s4",
        title: "Agent Profile list results can be filtered by since",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "list", "since"],
    capabilityFlags: ["document", "list", "agent-profile", "since"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: ["proof-slice agent profile since filtering"],
    steps: [
      {
        request: buildVersionedRequest("POST", "agents-profile", profileSinceIdentity, {
          value: buildAgentProfileDocumentFixture(),
          fixtureName: "agent-profile-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "agents-profile", {
          ...profileSinceQuery,
          since: validSinceTimestamp,
        }),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([profileSinceIdentity.profileId]),
        },
      },
    ],
  });

  const invalidSinceCase = singleRequestCase({
    caseId: "v2.agents-profile.invalid-since",
    title: "The Agent Profile Resource rejects an invalid since value when listing profile ids",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00260",
        section: "Communication 2.6.s4",
        title: "Agent Profile rejects invalid since values",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "list", "since"],
    capabilityFlags: ["document", "list", "agent-profile", "since"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    request: buildVersionedRequest("GET", "agents-profile", {
      agent: profileSinceIdentity.agent,
      since: invalidSinceTimestamp,
    }),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice agent profile invalid since"],
  });

  const invalidAgentQueryCase = singleRequestCase({
    caseId: "v2.agents-profile.document-invalid-agent-query",
    title: "The Agent Profile Resource rejects a POST request whose agent query value is not valid JSON",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00284",
        section: "Communication 2.6",
        title: "Agent Profile rejects invalid JSON agent query values",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "invalid", "agent-query"],
    capabilityFlags: ["document", "agent-profile", "invalid", "agent-query"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    request: buildVersionedRequest(
      "POST",
      "agents-profile",
      {
        ...profileMergeIdentity,
        profileId: `${profileMergeIdentity.profileId}-invalid-agent`,
        agent: invalidAgentQuery,
      },
      {
        value: {
          car: "Honda",
        },
      },
    ),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice agent profile invalid agent query"],
  });

  const mergeCase = requestSequenceCase({
    caseId: "v2.agents-profile.document-merge",
    title: "The Agent Profile Resource merges JSON documents on POST when a profile already exists",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00279",
        section: "Communication 2.2.s7",
        title: "Agent Profile performs JSON document merge",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "merge"],
    capabilityFlags: ["document", "merge", "agent-profile"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: ["proof-slice agent profile merge"],
    steps: [
      {
        request: buildVersionedRequest("POST", "agents-profile", profileMergeIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "agents-profile", profileMergeIdentity, {
          value: {
            type: "Civic",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "agents-profile", profileMergeIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["car"],
              equals: "Honda",
            },
            {
              path: ["type"],
              equals: "Civic",
            },
          ],
        },
      },
    ],
  });

  const nonJsonPostRejectCase = requestSequenceCase({
    caseId: "v2.agents-profile.document-merge-rejects-non-json-post",
    title: "The Agent Profile Resource rejects a POST merge when the incoming document is not application/json",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00278",
        section: "Communication 2.3.s3.table1.row3",
        title: "Agent Profile rejects non-JSON POST merges without mutation",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "merge", "invalid"],
    capabilityFlags: ["document", "merge", "agent-profile", "invalid"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: ["proof-slice agent profile non-json incoming merge rejection"],
    steps: [
      {
        request: buildVersionedRequest("POST", "agents-profile", profileNonJsonPostRejectIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "agents-profile", profileNonJsonPostRejectIdentity, {
          kind: "text",
          value: nonJsonDocumentBody,
          contentType: "application/octet-stream",
        }),
        assertion: {
          status: 400,
        },
      },
      {
        request: buildVersionedRequest("GET", "agents-profile", profileNonJsonPostRejectIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["car"],
              equals: "Honda",
            },
          ],
        },
      },
    ],
  });

  const existingNonJsonRejectCase = requestSequenceCase({
    caseId: "v2.agents-profile.document-merge-rejects-existing-non-json",
    title: "The Agent Profile Resource rejects a POST merge when the existing document is not application/json",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00278",
        section: "Communication 2.3.s3.table1.row3",
        title: "Agent Profile rejects merges against non-JSON stored documents",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "merge", "invalid"],
    capabilityFlags: ["document", "merge", "agent-profile", "invalid"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: ["proof-slice agent profile existing non-json merge rejection"],
    steps: [
      {
        request: buildVersionedRequest("PUT", "agents-profile", profileExistingNonJsonRejectIdentity, {
          kind: "text",
          value: existingNonJsonDocumentBody,
          contentType: "application/octet-stream",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "agents-profile", profileExistingNonJsonRejectIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 400,
        },
      },
      {
        request: buildVersionedRequest("GET", "agents-profile", profileExistingNonJsonRejectIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: [],
              equals: existingNonJsonDocumentBody,
            },
          ],
        },
      },
    ],
  });

  const deleteCase = requestSequenceCase({
    caseId: "v2.agents-profile.delete-document",
    title: "The Agent Profile Resource deletes a stored document and removes it from profile listings",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00271",
        section: "Communication 2.6.s3",
        title: "Agent Profile DELETE removes the associated profile",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "delete"],
    capabilityFlags: ["document", "delete", "agent-profile"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: ["proof-slice agent profile delete"],
    steps: [
      {
        request: buildVersionedRequest("POST", "agents-profile", profileDeleteIdentity, {
          value: buildAgentProfileDocumentFixture(),
          fixtureName: "agent-profile-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("DELETE", "agents-profile", profileDeleteIdentity),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "agents-profile", profileDeleteListQuery),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([]),
        },
      },
    ],
  });

  return {
    type: "suite",
    id: "v2.proof-slice.agents-profile",
    title: "Agent Profile Resource",
    specVersion,
    tags: ["proof-slice", "agents-profile"],
    children: [
      {
        type: "suite",
        id: "v2.proof-slice.agents-profile.roundtrip",
        title: "Agent Profile Roundtrip",
        specVersion,
        tags: ["roundtrip"],
        children: [roundTripCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.agents-profile.listing",
        title: "Agent Profile Listing",
        specVersion,
        tags: ["list"],
        children: [listCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.agents-profile.since",
        title: "Agent Profile Since",
        specVersion,
        tags: ["list", "since"],
        children: [sinceCase, invalidSinceCase, invalidAgentQueryCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.agents-profile.merge",
        title: "Agent Profile Merge",
        specVersion,
        tags: ["merge"],
        children: [mergeCase, nonJsonPostRejectCase, existingNonJsonRejectCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.agents-profile.deletion",
        title: "Agent Profile Deletion",
        specVersion,
        tags: ["delete"],
        children: [deleteCase],
      },
    ],
  };
}

export function createProofSliceRegistry(): RegistryDefinition {
  const builder = new RegistryBuilder();
  builder.addSuite(specVersion, createV20ProofSliceSuite());
  builder.addSuite(specVersion, createV20StateResourceProofSliceSuite());
  builder.addSuite(specVersion, createV20ActivityProfileResourceProofSliceSuite());
  builder.addSuite(specVersion, createV20AgentProfileResourceProofSliceSuite());
  return builder.build();
}
