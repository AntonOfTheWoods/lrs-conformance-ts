import {
  accountObjectsLegacyConfigFile,
  activitiesLegacyConfigFile,
  activityObjectPlacements,
  actorRequirementsLegacySuiteFile,
  actorsLegacyConfigFile,
  additionalDataTypesLegacySuiteFile,
  agentActorPlacements,
  agentsLegacyConfigFile,
  attachmentRequirementsLegacySuiteFile,
  attachmentsLegacyConfigFile,
  authoritiesLegacyConfigFile,
  authoritiesLegacySuiteFile,
  buildAccount,
  buildActivitiesGetRequest,
  buildActivityDefinitionFixture,
  buildActivityDefinitionWithInteractionField,
  buildActivityObjectFixture,
  buildActivityObjectRoundTripPath,
  buildAgentQuery,
  buildAgentWithAccount,
  buildAgentWithMbox,
  buildAgentWithMboxSha1sum,
  buildAgentWithOpenId,
  buildAgentWithoutIfi,
  buildAnonymousAuthorityGroup,
  buildAttachmentFixture,
  buildAuthorityAccountAgent,
  buildAuthorityMboxAgent,
  buildContextActivitiesFixture,
  buildContextActivitiesRoundTripPath,
  buildContextActivityFixture,
  buildContextPropertyConstraintTransforms,
  buildContextStatementRefFixture,
  buildFormatProofStatement,
  buildGroupWithAccount,
  buildGroupWithMbox,
  buildGroupWithMboxSha1sum,
  buildGroupWithOpenId,
  buildGroupWithoutIfiOrMember,
  buildIdentifiedAuthorityGroup,
  buildIfiAcceptanceVariants,
  buildIfiExclusivityVariants,
  buildInteractionComponentFixture,
  buildMissingIfiVariants,
  buildMockJws,
  buildMultipartAttachmentMetadata,
  buildMultipartStatementPostRequest,
  buildProofStatement,
  buildProofStoredTimestamp,
  buildProofTimestamp,
  buildProofUuid,
  buildQueryRecord,
  buildRepeatedActorMutationVariants,
  buildResultFixture,
  buildSignedStatementAttachment,
  buildSignedStatementPostRequest,
  buildStatementBatchPostRequest,
  buildStatementBody,
  buildStatementCollectionExpectations,
  buildStatementCollectionMorePath,
  buildStatementCollectionQueryCase,
  buildStatementCollectionRequest,
  buildStatementCollectionTextCase,
  buildStatementFixture,
  buildStatementGetRequest,
  buildStatementPostRequest,
  buildStatementPutRequest,
  buildStatementQueryExclusivityCases,
  buildStatementRefFixture,
  buildSubStatementFixture,
  buildVerbFixture,
  buildVersionedHeaders,
  buildVoidedStatementGetRequest,
  contextActivitiesLegacyConfigFile,
  contextActivityKinds,
  contextLegacySuiteFile,
  contextPlacements,
  contextsLegacyConfigFile,
  durationsLegacyConfigFile,
  errorCodesLegacySuiteFile,
  explicitNonOauthAuthorityMemberMbox,
  explicitNonOauthAuthoritySecondMemberMbox,
  extensionsLegacyConfigFile,
  formattingLegacyConfigFile,
  formattingLegacySuiteFile,
  futureAcceptedTimestamp,
  groupActorPlacements,
  groupsLegacyConfigFile,
  idRequirementsLegacySuiteFile,
  ifisLegacyConfigFile,
  interactionComponentTargets,
  invalidAccountHomePage,
  invalidLegacyDate,
  invalidLegacyString,
  invalidMailtoEmail,
  invalidMailtoIri,
  invalidNegativeZeroTimestamp,
  invalidNegativeZeroTimestampCompact,
  invalidNegativeZeroTimestampExtended,
  invalidOpenId,
  invalidUuidInvalidLetter,
  invalidUuidNumeric,
  invalidUuidObject,
  invalidUuidTooManyDigits,
  isoTimestampHeaderPattern,
  languagesLegacyConfigFile,
  listEquals,
  multipartStatementResponseContentType,
  objectRequirementsLegacySuiteFile,
  objectsLegacyConfigFile,
  overwrittenStoredTimestamp,
  populatedAuthorityAccountHomePage,
  populatedAuthorityAuthorization,
  populatedAuthorityUserName,
  queryRetrievalFamily,
  requestSequenceCase,
  requiredFieldFamily,
  resultPlacements,
  resultRequirementsLegacySuiteFile,
  resultsLegacyConfigFile,
  retrievalOfStatementsLegacySuiteFile,
  scoresLegacyConfigFile,
  signedStatementsLegacySuiteFile,
  singleRequestCase,
  specVersion,
  specialDataTypesLegacySuiteFile,
  statementGeneratedIdRoundTripCase,
  statementLifecycleLegacySuiteFile,
  statementMutationFamily,
  statementQueryValidationFamily,
  statementRefPlacements,
  statementRefsLegacyConfigFile,
  statementResourceLegacySuiteFile,
  statementRoundTripCase,
  storedRequirementsLegacySuiteFile,
  subStatementsLegacyConfigFile,
  timestampPlacements,
  timestampPropertyLegacyConfigFile,
  timestampRequirementsLegacySuiteFile,
  timestampsLegacyConfigFile,
  uuidsLegacyConfigFile,
  validAccountHomePage,
  validAccountName,
  validAuthorityAccountHomePage,
  validAuthorityAccountName,
  validAuthorityThirdMemberMbox,
  validGroupMemberMbox,
  validMboxSha1sum,
  validRfc3339Timestamp,
  validScoreDecimal,
  validScoreMaxDecimal,
  verbPlacements,
  verbRequirementsLegacySuiteFile,
  verbsLegacyConfigFile,
  verifyLegacyConfigFile,
  versionPropertyLegacyConfigFile,
  versionRequirementsLegacySuiteFile,
  voidingLegacyConfigFile,
} from "./shared";
import type {
  CaseDefinition,
  InteractionComponentField,
  JsonObject,
  MultipartStatementAttachment,
  RequirementRef,
  StatementFixture,
  SuiteDefinition,
} from "./shared";

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
          {
            id: "XAPI-00028",
            section: "Data 2.4.1",
            title: 'A Statement rejects a non-string value in the "id" property',
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
          {
            id: "XAPI-00028",
            section: "Data 2.4.1",
            title: 'A Statement rejects a non-string value in the "id" property',
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
          {
            id: "XAPI-00027",
            section: "Data 2.4.1",
            title: 'A Statement rejects an invalid UUID in the "id" property',
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
          {
            id: "XAPI-00027",
            section: "Data 2.4.1",
            title: 'A Statement rejects an invalid UUID in the "id" property',
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
          {
            id: "XAPI-00060",
            section: "Data 2.4.4.1.s2.table1.row3",
            title: 'An Activity Definition "type" property is an IRI',
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
          {
            id: "XAPI-00061",
            section: "Data 2.4.4.1.s2.table1.row4",
            title: 'An Activity Definition "moreInfo" property is an IRI',
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
    legacyTraceSuiteFile: actorRequirementsLegacySuiteFile,
    legacyTraceConfigFile: ifisLegacyConfigFile,
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
    legacyTraceSuiteFile: actorRequirementsLegacySuiteFile,
    legacyTraceConfigFile: ifisLegacyConfigFile,
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
    legacyTraceSuiteFile: actorRequirementsLegacySuiteFile,
    legacyTraceConfigFile: ifisLegacyConfigFile,
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
    legacyTraceSuiteFile: actorRequirementsLegacySuiteFile,
    legacyTraceConfigFile: ifisLegacyConfigFile,
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
    legacyTraceSuiteFile: actorRequirementsLegacySuiteFile,
    legacyTraceConfigFile: accountObjectsLegacyConfigFile,
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
    legacyTraceSuiteFile: actorRequirementsLegacySuiteFile,
    legacyTraceConfigFile: accountObjectsLegacyConfigFile,
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
    legacyTraceSuiteFile: actorRequirementsLegacySuiteFile,
    legacyTraceConfigFile: accountObjectsLegacyConfigFile,
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

  const actorObjectTypeVocabularyCases = statementMutationFamily({
    familyId: "v2.statements.actor.object-type-vocabulary",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "actor", "object-type", "validation"],
    legacyTraceSuiteFile: actorRequirementsLegacySuiteFile,
    legacyTraceConfigFile: actorsLegacyConfigFile,
    variants: agentActorPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-agent`,
        title: `A Statement rejects ${placement.title} when objectType is not "Agent"`,
        transforms: placement.buildTransforms({
          ...buildAgentWithMbox("mailto:actor-object-type-agent@example.test"),
          objectType: "agent",
        }),
        requirementRefs: [
          {
            id: "XAPI-00031",
            section: "Data 2.4.2.1, Data 2.4.2.2",
            title: 'Actor objectType values are "Agent" or "Group"',
          },
        ],
      },
      {
        idSuffix: `${placement.idSuffix}-group`,
        title: `A Statement rejects ${placement.title} when objectType is not "Group"`,
        transforms: placement.buildTransforms({
          ...buildAgentWithMbox("mailto:actor-object-type-group@example.test"),
          objectType: "group",
        }),
        requirementRefs: [
          {
            id: "XAPI-00031",
            section: "Data 2.4.2.1, Data 2.4.2.2",
            title: 'Actor objectType values are "Agent" or "Group"',
          },
        ],
      },
    ]),
  });

  const agentObjectTypeTypeCases = statementMutationFamily({
    familyId: "v2.statements.actor.object-type-type",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "actor", "object-type", "validation"],
    legacyTraceSuiteFile: actorRequirementsLegacySuiteFile,
    legacyTraceConfigFile: agentsLegacyConfigFile,
    variants: agentActorPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-numeric`,
        title: `A Statement rejects ${placement.title} when objectType is numeric`,
        transforms: placement.buildTransforms({
          ...buildAgentWithMbox("mailto:actor-object-type-numeric@example.test"),
          objectType: 123,
        }),
        requirementRefs: [
          {
            id: "XAPI-00032",
            section: "Data 2.4.2.1.s2.table1.row1",
            title: "Agent objectType values are strings when present",
          },
        ],
      },
      {
        idSuffix: `${placement.idSuffix}-object`,
        title: `A Statement rejects ${placement.title} when objectType is an object`,
        transforms: placement.buildTransforms({
          ...buildAgentWithMbox("mailto:actor-object-type-object@example.test"),
          objectType: {
            invalid: true,
          },
        }),
        requirementRefs: [
          {
            id: "XAPI-00032",
            section: "Data 2.4.2.1.s2.table1.row1",
            title: "Agent objectType values are strings when present",
          },
        ],
      },
    ]),
  });

  const agentNameTypeCases = statementMutationFamily({
    familyId: "v2.statements.actor.name-type",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "actor", "name", "validation"],
    legacyTraceSuiteFile: actorRequirementsLegacySuiteFile,
    legacyTraceConfigFile: agentsLegacyConfigFile,
    variants: agentActorPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-numeric`,
        title: `A Statement rejects ${placement.title} when name is numeric`,
        transforms: placement.buildTransforms({
          ...buildAgentWithMbox("mailto:actor-name-numeric@example.test"),
          name: 123,
        }),
        requirementRefs: [
          {
            id: "XAPI-00033",
            section: "Data 2.4.2.1.s2.table1.row2",
            title: "Agent name values are strings when present",
          },
        ],
      },
      {
        idSuffix: `${placement.idSuffix}-object`,
        title: `A Statement rejects ${placement.title} when name is an object`,
        transforms: placement.buildTransforms({
          ...buildAgentWithMbox("mailto:actor-name-object@example.test"),
          name: {
            invalid: true,
          },
        }),
        requirementRefs: [
          {
            id: "XAPI-00033",
            section: "Data 2.4.2.1.s2.table1.row2",
            title: "Agent name values are strings when present",
          },
        ],
      },
    ]),
  });

  const groupAnonymousMemberRequiredCases = statementMutationFamily({
    familyId: "v2.statements.group.member-required",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "group", "member", "validation"],
    legacyTraceSuiteFile: actorRequirementsLegacySuiteFile,
    legacyTraceConfigFile: groupsLegacyConfigFile,
    variants: groupActorPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement rejects ${placement.title} when an anonymous group omits member`,
      transforms: placement.buildTransforms(buildGroupWithoutIfiOrMember()),
      requirementRefs: [
        {
          id: "XAPI-00035",
          section: "Data 2.4.2.2.s2.table1.row3",
          title: "Anonymous Groups require a member property",
        },
      ],
    })),
  });

  const groupMemberTypeCases = statementMutationFamily({
    familyId: "v2.statements.group.member-type",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "group", "member", "validation"],
    legacyTraceSuiteFile: actorRequirementsLegacySuiteFile,
    legacyTraceConfigFile: groupsLegacyConfigFile,
    variants: groupActorPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement rejects ${placement.title} when member is not an array of Agents`,
      transforms: placement.buildTransforms({
        ...buildGroupWithoutIfiOrMember(),
        member: buildAgentWithMbox("mailto:group-member-type@example.test"),
      }),
      requirementRefs: [
        {
          id: "XAPI-00036",
          section: "Data 2.4.2.2.s2.table2.row3",
          title: "Group member values are arrays of Agents",
        },
      ],
    })),
  });

  const verbIdRequiredCases = statementMutationFamily({
    familyId: "v2.statements.verb.id-required",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "verb", "validation"],
    legacyTraceSuiteFile: verbRequirementsLegacySuiteFile,
    legacyTraceConfigFile: verbsLegacyConfigFile,
    variants: verbPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement rejects ${placement.title} when id is missing`,
      transforms: placement.buildTransforms({
        display: {
          "en-US": "completed",
        },
      }),
      requirementRefs: [
        {
          id: "XAPI-00044",
          section: "Data 2.4.3.s3.table1.row1",
          title: "Verb objects require an id IRI",
        },
      ],
    })),
  });

  const verbIdIriCases = statementMutationFamily({
    familyId: "v2.statements.verb.id-iri",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "verb", "validation"],
    legacyTraceSuiteFile: verbRequirementsLegacySuiteFile,
    legacyTraceConfigFile: verbsLegacyConfigFile,
    variants: verbPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement rejects ${placement.title} when id is not an IRI`,
      transforms: placement.buildTransforms({
        ...buildVerbFixture(invalidOpenId, "completed"),
      }),
      requirementRefs: [
        {
          id: "XAPI-00044",
          section: "Data 2.4.3.s3.table1.row1",
          title: "Verb objects require an id IRI",
        },
      ],
    })),
  });

  const verbDisplayTypeCases = statementMutationFamily({
    familyId: "v2.statements.verb.display-type",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "verb", "display", "validation"],
    legacyTraceSuiteFile: verbRequirementsLegacySuiteFile,
    legacyTraceConfigFile: verbsLegacyConfigFile,
    variants: verbPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-numeric`,
        title: `A Statement rejects ${placement.title} when display is numeric`,
        transforms: placement.buildTransforms({
          ...buildVerbFixture("https://example.test/xapi/verbs/verb-display-type", "completed"),
          display: 12345,
        }),
        requirementRefs: [
          {
            id: "XAPI-00045",
            section: "Data 2.4.3.s3.table1.row2",
            title: "Verb display values are language maps",
          },
        ],
      },
      {
        idSuffix: `${placement.idSuffix}-string`,
        title: `A Statement rejects ${placement.title} when display is a string`,
        transforms: placement.buildTransforms({
          ...buildVerbFixture("https://example.test/xapi/verbs/verb-display-type", "completed"),
          display: "completed",
        }),
        requirementRefs: [
          {
            id: "XAPI-00045",
            section: "Data 2.4.3.s3.table1.row2",
            title: "Verb display values are language maps",
          },
        ],
      },
    ]),
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

  const legacyAttachmentFixture = buildAttachmentFixture({
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
  });
  const attachmentArrayRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00025",
      section: "Data 2.4.s1.table1.row11",
      title: "Statement attachments are arrays of Attachment objects",
    },
  ];
  const attachmentUsageTypeRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00107",
      section: "Data 2.4.11.s2.table1.row1",
      title: "Attachment usageType values are IRIs",
    },
  ];
  const attachmentContentTypeRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00105",
      section: "Data 2.4.11.s2.table1.row4",
      title: "Attachment contentType values are Internet Media Types",
    },
  ];
  const attachmentLengthRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00102",
      section: "Data 2.4.11.s2.table1.row5",
      title: "Attachment length values are integers",
    },
  ];
  const attachmentSha2RequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00103",
      section: "Data 2.4.11.s2.table1.row6",
      title: "Attachment sha2 values are hash strings",
    },
  ];
  const attachmentFileUrlRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00104",
      section: "Data 2.4.11.s2.table1.row7",
      title: "Attachment fileUrl values are IRIs when present",
    },
  ];
  const attachmentLanguageMapRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00106",
      section: "Data 2.4.11.s2.table1.row2",
      title: "Attachment display and description values are language maps",
    },
  ];

  const attachmentAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.attachments.acceptance",
    suiteTitle: "Statement Attachments",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "attachments", "acceptance"],
    expectedStatus: 200,
    legacyTraceSuiteFile: attachmentRequirementsLegacySuiteFile,
    legacyTraceConfigFile: attachmentsLegacyConfigFile,
    variants: [
      {
        idSuffix: "array",
        title: 'A Statement accepts the "attachments" property when it is an array of Attachment objects',
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [legacyAttachmentFixture],
          },
        ],
        requirementRefs: attachmentArrayRequirementRefs,
      },
    ],
  });

  const attachmentArrayTypeCases = statementMutationFamily({
    familyId: "v2.statements.attachments.not-array",
    suiteTitle: "Statement Attachments",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "attachments", "validation"],
    legacyTraceSuiteFile: attachmentRequirementsLegacySuiteFile,
    legacyTraceConfigFile: attachmentsLegacyConfigFile,
    variants: [
      {
        idSuffix: "statement",
        title: 'A Statement rejects the "attachments" property when it is not an array',
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: legacyAttachmentFixture,
          },
        ],
        requirementRefs: attachmentArrayRequirementRefs,
      },
    ],
  });

  const attachmentEntryObjectCases = statementMutationFamily({
    familyId: "v2.statements.attachments.entry-not-object",
    suiteTitle: "Statement Attachments",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "attachments", "validation"],
    legacyTraceSuiteFile: attachmentRequirementsLegacySuiteFile,
    legacyTraceConfigFile: attachmentsLegacyConfigFile,
    variants: [
      {
        idSuffix: "numeric",
        title: "A Statement rejects attachments when an entry is numeric",
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [invalidUuidNumeric],
          },
        ],
        requirementRefs: attachmentArrayRequirementRefs,
      },
      {
        idSuffix: "string",
        title: "A Statement rejects attachments when an entry is a string",
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [invalidLegacyString],
          },
        ],
        requirementRefs: attachmentArrayRequirementRefs,
      },
    ],
  });

  const attachmentUsageTypeCases = statementMutationFamily({
    familyId: "v2.statements.attachments.usage-type",
    suiteTitle: "Statement Attachments",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "attachments", "validation"],
    legacyTraceSuiteFile: attachmentRequirementsLegacySuiteFile,
    legacyTraceConfigFile: attachmentsLegacyConfigFile,
    variants: [
      {
        idSuffix: "string",
        title: "A Statement rejects an attachment when usageType is not an IRI",
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [
              {
                ...legacyAttachmentFixture,
                usageType: invalidLegacyString,
              },
            ],
          },
        ],
        requirementRefs: attachmentUsageTypeRequirementRefs,
      },
    ],
  });

  const attachmentContentTypeCases = statementMutationFamily({
    familyId: "v2.statements.attachments.content-type",
    suiteTitle: "Statement Attachments",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "attachments", "validation"],
    legacyTraceSuiteFile: attachmentRequirementsLegacySuiteFile,
    legacyTraceConfigFile: attachmentsLegacyConfigFile,
    variants: [
      {
        idSuffix: "numeric",
        title: "A Statement rejects an attachment when contentType is numeric",
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [
              {
                ...legacyAttachmentFixture,
                contentType: 999,
              },
            ],
          },
        ],
        requirementRefs: attachmentContentTypeRequirementRefs,
      },
    ],
  });

  const attachmentLengthCases = statementMutationFamily({
    familyId: "v2.statements.attachments.length",
    suiteTitle: "Statement Attachments",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "attachments", "validation"],
    legacyTraceSuiteFile: attachmentRequirementsLegacySuiteFile,
    legacyTraceConfigFile: attachmentsLegacyConfigFile,
    variants: [
      {
        idSuffix: "string",
        title: "A Statement rejects an attachment when length is not an integer",
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [
              {
                ...legacyAttachmentFixture,
                length: invalidLegacyString,
              },
            ],
          },
        ],
        requirementRefs: attachmentLengthRequirementRefs,
      },
    ],
  });

  const attachmentSha2Cases = statementMutationFamily({
    familyId: "v2.statements.attachments.sha2",
    suiteTitle: "Statement Attachments",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "attachments", "validation"],
    legacyTraceSuiteFile: attachmentRequirementsLegacySuiteFile,
    legacyTraceConfigFile: attachmentsLegacyConfigFile,
    variants: [
      {
        idSuffix: "numeric",
        title: "A Statement rejects an attachment when sha2 is not a hash string",
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [
              {
                ...legacyAttachmentFixture,
                sha2: invalidUuidNumeric,
              },
            ],
          },
        ],
        requirementRefs: attachmentSha2RequirementRefs,
      },
    ],
  });

  const attachmentFileUrlCases = statementMutationFamily({
    familyId: "v2.statements.attachments.file-url",
    suiteTitle: "Statement Attachments",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "attachments", "validation"],
    legacyTraceSuiteFile: attachmentRequirementsLegacySuiteFile,
    legacyTraceConfigFile: attachmentsLegacyConfigFile,
    variants: [
      {
        idSuffix: "string",
        title: "A Statement rejects an attachment when fileUrl is not an IRI",
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [
              {
                ...legacyAttachmentFixture,
                fileUrl: invalidLegacyString,
              },
            ],
          },
        ],
        requirementRefs: attachmentFileUrlRequirementRefs,
      },
    ],
  });

  const attachmentDisplayTypeCases = statementMutationFamily({
    familyId: "v2.statements.attachments.display-type",
    suiteTitle: "Statement Attachments",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "attachments", "validation"],
    legacyTraceSuiteFile: attachmentRequirementsLegacySuiteFile,
    legacyTraceConfigFile: attachmentsLegacyConfigFile,
    variants: [
      {
        idSuffix: "numeric",
        title: "A Statement rejects an attachment when display is numeric",
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [
              {
                ...legacyAttachmentFixture,
                display: invalidUuidNumeric,
              },
            ],
          },
        ],
        requirementRefs: attachmentLanguageMapRequirementRefs,
      },
      {
        idSuffix: "string",
        title: "A Statement rejects an attachment when display is a string",
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [
              {
                ...legacyAttachmentFixture,
                display: invalidLegacyString,
              },
            ],
          },
        ],
        requirementRefs: attachmentLanguageMapRequirementRefs,
      },
    ],
  });

  const attachmentDescriptionTypeCases = statementMutationFamily({
    familyId: "v2.statements.attachments.description-type",
    suiteTitle: "Statement Attachments",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "attachments", "validation"],
    legacyTraceSuiteFile: attachmentRequirementsLegacySuiteFile,
    legacyTraceConfigFile: attachmentsLegacyConfigFile,
    variants: [
      {
        idSuffix: "numeric",
        title: "A Statement rejects an attachment when description is numeric",
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [
              {
                ...legacyAttachmentFixture,
                description: invalidUuidNumeric,
              },
            ],
          },
        ],
        requirementRefs: attachmentLanguageMapRequirementRefs,
      },
      {
        idSuffix: "string",
        title: "A Statement rejects an attachment when description is a string",
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [
              {
                ...legacyAttachmentFixture,
                description: "should error",
              },
            ],
          },
        ],
        requirementRefs: attachmentLanguageMapRequirementRefs,
      },
    ],
  });

  const agentIfiExclusivityCases = statementMutationFamily({
    familyId: "v2.statements.agent-ifi-exclusivity",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "exclusivity", "agent"],
    legacyTraceSuiteFile: actorRequirementsLegacySuiteFile,
    legacyTraceConfigFile: agentsLegacyConfigFile,
    variants: buildIfiExclusivityVariants({
      placements: agentActorPlacements,
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
    legacyTraceSuiteFile: actorRequirementsLegacySuiteFile,
    legacyTraceConfigFile: groupsLegacyConfigFile,
    variants: buildIfiExclusivityVariants({
      placements: groupActorPlacements,
      requirementRefs: [
        {
          id: "XAPI-00037",
          section: "Data 2.4.2.2.s5.b1",
          title: "Identified Groups must use only one IFI",
        },
      ],
    }),
  });

  const identifiedGroupPlacements = groupActorPlacements.filter(
    (placement) => placement.idSuffix !== "authority-group",
  );

  const agentIfiRequiredCases = statementMutationFamily({
    familyId: "v2.statements.agent-ifi-required",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "required", "agent"],
    legacyTraceSuiteFile: actorRequirementsLegacySuiteFile,
    legacyTraceConfigFile: agentsLegacyConfigFile,
    variants: buildMissingIfiVariants({
      placements: agentActorPlacements,
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
    legacyTraceSuiteFile: actorRequirementsLegacySuiteFile,
    legacyTraceConfigFile: groupsLegacyConfigFile,
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
    legacyTraceSuiteFile: actorRequirementsLegacySuiteFile,
    legacyTraceConfigFile: groupsLegacyConfigFile,
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
    legacyTraceSuiteFile: actorRequirementsLegacySuiteFile,
    legacyTraceConfigFile: groupsLegacyConfigFile,
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

  const accountPropertyAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.account-property-acceptance",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "account", "acceptance"],
    expectedStatus: 200,
    legacyTraceSuiteFile: actorRequirementsLegacySuiteFile,
    legacyTraceConfigFile: ifisLegacyConfigFile,
    variants: [...agentActorPlacements, ...identifiedGroupPlacements].map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement accepts ${placement.title} when account is the sole IFI`,
      transforms: placement.buildTransforms(
        placement.kind === "agent"
          ? buildAgentWithAccount(buildAccount(validAccountHomePage, validAccountName))
          : buildGroupWithAccount(buildAccount(validAccountHomePage, validAccountName)),
      ),
      requirementRefs: [
        {
          id: "XAPI-00041",
          section: "Data 2.4.2.4",
          title: 'An Account Object is the "account" property of a Group or Agent',
        },
      ],
    })),
  });

  const agentIfiAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.agent-ifi-acceptance",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "ifi", "acceptance", "agent"],
    expectedStatus: 200,
    legacyTraceSuiteFile: actorRequirementsLegacySuiteFile,
    legacyTraceConfigFile: agentsLegacyConfigFile,
    variants: buildIfiAcceptanceVariants({
      placements: agentActorPlacements,
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

  const authorityPopulationStatement = buildStatementFixture([
    {
      operation: "set",
      path: ["id"],
      value: "22222222-2222-4222-8222-222222222222",
    },
  ]);

  const authorityPopulationCase = requestSequenceCase({
    caseId: "v2.statements.authority-populates-when-missing",
    title: "The Statements resource populates authority from header information when authority is omitted",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00099",
        section: "Data 2.4.9.s3.b4",
        title: "Statements populate authority from header information",
      },
    ],
    tags: ["v2.0.0", "statements", "authority", "population"],
    capabilityFlags: ["authority", "query", "retrieval"],
    legacyTraceSuiteFile: authoritiesLegacySuiteFile,
    notes: ["proof-slice statement authority population"],
    steps: [
      {
        request: buildStatementPostRequest(authorityPopulationStatement, {
          Authorization: populatedAuthorityAuthorization,
        }),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([authorityPopulationStatement.id]),
        },
      },
      {
        request: buildStatementGetRequest(authorityPopulationStatement.id),
        assertion: {
          status: 200,
          expectedHeaders: [
            {
              key: "X-Experience-API-Version",
              equals: specVersion,
            },
          ],
          jsonPathEquals: [
            {
              path: ["authority", "objectType"],
              equals: "Agent",
            },
            {
              path: ["authority", "account", "homePage"],
              equals: populatedAuthorityAccountHomePage,
            },
            {
              path: ["authority", "account", "name"],
              equals: populatedAuthorityUserName,
            },
          ],
        },
      },
    ],
  });

  const authorityNonOauthMembersCase = singleRequestCase({
    caseId: "v2.statements.authority-group-rejection.non-oauth-members",
    title: "A Statement rejects an authority group composed only of non-OAuth Agents",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00100",
        section: "Data 2.4.9.s3.b3",
        title: "Authority groups reject non-O-Auth Agents",
      },
    ],
    tags: ["v2.0.0", "statements", "authority", "group", "rejection", "non-oauth"],
    capabilityFlags: ["authority"],
    legacyTraceSuiteFile: authoritiesLegacySuiteFile,
    request: buildStatementPostRequest(
      buildStatementFixture([
        {
          operation: "set",
          path: ["authority"],
          value: buildAnonymousAuthorityGroup([
            buildAuthorityMboxAgent(explicitNonOauthAuthorityMemberMbox),
            buildAuthorityMboxAgent(explicitNonOauthAuthoritySecondMemberMbox),
          ]),
        },
      ]),
    ),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice statement authority non-oauth rejection"],
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

  const caseSensitiveKeyCases = statementMutationFamily({
    familyId: "v2.statements.case-sensitive-keys",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "keys"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: formattingLegacyConfigFile,
    variants: [
      {
        idSuffix: "id",
        title: 'A Statement rejects a case-mismatched top-level key for "id"',
        transforms: [
          {
            operation: "set",
            path: ["iD"],
            value: buildProofUuid(201),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00008",
            section: "Data 2.2.s4.b1.b5",
            title: "Statement keys are case-sensitive",
          },
          {
            id: "XAPI-00010",
            section: "Data 2.2.s4.b1.b5",
            title: "Statements reject unsupported keys",
          },
        ],
      },
      {
        idSuffix: "actor",
        title: 'A Statement rejects a case-mismatched top-level key for "actor"',
        transforms: [
          {
            operation: "set",
            path: ["Actor"],
            value: buildAgentWithMbox("mailto:case-sensitive-actor@example.test"),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00008",
            section: "Data 2.2.s4.b1.b5",
            title: "Statement keys are case-sensitive",
          },
          {
            id: "XAPI-00010",
            section: "Data 2.2.s4.b1.b5",
            title: "Statements reject unsupported keys",
          },
        ],
      },
      {
        idSuffix: "verb",
        title: 'A Statement rejects a case-mismatched top-level key for "verb"',
        transforms: [
          {
            operation: "set",
            path: ["veRb"],
            value: buildVerbFixture("https://example.test/xapi/verbs/case-sensitive", "case-sensitive"),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00008",
            section: "Data 2.2.s4.b1.b5",
            title: "Statement keys are case-sensitive",
          },
          {
            id: "XAPI-00010",
            section: "Data 2.2.s4.b1.b5",
            title: "Statements reject unsupported keys",
          },
        ],
      },
      {
        idSuffix: "object",
        title: 'A Statement rejects a case-mismatched top-level key for "object"',
        transforms: [
          {
            operation: "set",
            path: ["oBject"],
            value: buildActivityObjectFixture("https://example.test/xapi/activities/case-sensitive-object"),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00008",
            section: "Data 2.2.s4.b1.b5",
            title: "Statement keys are case-sensitive",
          },
          {
            id: "XAPI-00010",
            section: "Data 2.2.s4.b1.b5",
            title: "Statements reject unsupported keys",
          },
        ],
      },
      {
        idSuffix: "result",
        title: 'A Statement rejects a case-mismatched top-level key for "result"',
        transforms: [
          {
            operation: "set",
            path: ["RESULT"],
            value: {
              completion: true,
            },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00008",
            section: "Data 2.2.s4.b1.b5",
            title: "Statement keys are case-sensitive",
          },
          {
            id: "XAPI-00010",
            section: "Data 2.2.s4.b1.b5",
            title: "Statements reject unsupported keys",
          },
        ],
      },
      {
        idSuffix: "context",
        title: 'A Statement rejects a case-mismatched top-level key for "context"',
        transforms: [
          {
            operation: "set",
            path: ["conText"],
            value: {
              language: "en-US",
            },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00008",
            section: "Data 2.2.s4.b1.b5",
            title: "Statement keys are case-sensitive",
          },
          {
            id: "XAPI-00010",
            section: "Data 2.2.s4.b1.b5",
            title: "Statements reject unsupported keys",
          },
        ],
      },
      {
        idSuffix: "timestamp",
        title: 'A Statement rejects a case-mismatched top-level key for "timestamp"',
        transforms: [
          {
            operation: "set",
            path: ["timeStamp"],
            value: buildProofTimestamp(202),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00008",
            section: "Data 2.2.s4.b1.b5",
            title: "Statement keys are case-sensitive",
          },
          {
            id: "XAPI-00010",
            section: "Data 2.2.s4.b1.b5",
            title: "Statements reject unsupported keys",
          },
        ],
      },
      {
        idSuffix: "stored",
        title: 'A Statement rejects a case-mismatched top-level key for "stored"',
        transforms: [
          {
            operation: "set",
            path: ["STOred"],
            value: buildProofStoredTimestamp(202),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00008",
            section: "Data 2.2.s4.b1.b5",
            title: "Statement keys are case-sensitive",
          },
          {
            id: "XAPI-00010",
            section: "Data 2.2.s4.b1.b5",
            title: "Statements reject unsupported keys",
          },
        ],
      },
      {
        idSuffix: "authority",
        title: 'A Statement rejects a case-mismatched top-level key for "authority"',
        transforms: [
          {
            operation: "set",
            path: ["auTHORity"],
            value: buildAgentWithMbox("mailto:case-sensitive-authority@example.test"),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00008",
            section: "Data 2.2.s4.b1.b5",
            title: "Statement keys are case-sensitive",
          },
          {
            id: "XAPI-00010",
            section: "Data 2.2.s4.b1.b5",
            title: "Statements reject unsupported keys",
          },
        ],
      },
      {
        idSuffix: "version",
        title: 'A Statement rejects a case-mismatched top-level key for "version"',
        transforms: [
          {
            operation: "set",
            path: ["Version"],
            value: specVersion,
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00008",
            section: "Data 2.2.s4.b1.b5",
            title: "Statement keys are case-sensitive",
          },
          {
            id: "XAPI-00010",
            section: "Data 2.2.s4.b1.b5",
            title: "Statements reject unsupported keys",
          },
        ],
      },
      {
        idSuffix: "attachments",
        title: 'A Statement rejects a case-mismatched top-level key for "attachments"',
        transforms: [
          {
            operation: "set",
            path: ["attachmentS"],
            value: [buildAttachmentFixture()],
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00008",
            section: "Data 2.2.s4.b1.b5",
            title: "Statement keys are case-sensitive",
          },
          {
            id: "XAPI-00010",
            section: "Data 2.2.s4.b1.b5",
            title: "Statements reject unsupported keys",
          },
        ],
      },
    ],
  });

  const interactionTypeCaseCases = statementMutationFamily({
    familyId: "v2.statements.interaction-type-case",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "interaction-type"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: formattingLegacyConfigFile,
    variants: [
      {
        idSuffix: "true-false",
        title: 'A Statement rejects an interactionType value whose case does not exactly match "true-false"',
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "interactionType"],
            value: "true-faLse",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00009",
            section: "Data 2.2.s4.b1.b6",
            title: "Enumerated values are case-sensitive",
          },
        ],
      },
      {
        idSuffix: "choice",
        title: 'A Statement rejects an interactionType value whose case does not exactly match "choice"',
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "interactionType"],
            value: "choiCe",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00009",
            section: "Data 2.2.s4.b1.b6",
            title: "Enumerated values are case-sensitive",
          },
        ],
      },
      {
        idSuffix: "fill-in",
        title: 'A Statement rejects an interactionType value whose case does not exactly match "fill-in"',
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "interactionType"],
            value: "fill-iN",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00009",
            section: "Data 2.2.s4.b1.b6",
            title: "Enumerated values are case-sensitive",
          },
        ],
      },
      {
        idSuffix: "long-fill-in",
        title: 'A Statement rejects an interactionType value whose case does not exactly match "long-fill-in"',
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "interactionType"],
            value: "long-fiLl-in",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00009",
            section: "Data 2.2.s4.b1.b6",
            title: "Enumerated values are case-sensitive",
          },
        ],
      },
      {
        idSuffix: "matching",
        title: 'A Statement rejects an interactionType value whose case does not exactly match "matching"',
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "interactionType"],
            value: "matchIng",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00009",
            section: "Data 2.2.s4.b1.b6",
            title: "Enumerated values are case-sensitive",
          },
        ],
      },
      {
        idSuffix: "performance",
        title: 'A Statement rejects an interactionType value whose case does not exactly match "performance"',
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "interactionType"],
            value: "perfOrmance",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00009",
            section: "Data 2.2.s4.b1.b6",
            title: "Enumerated values are case-sensitive",
          },
        ],
      },
      {
        idSuffix: "sequencing",
        title: 'A Statement rejects an interactionType value whose case does not exactly match "sequencing"',
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "interactionType"],
            value: "seqUencing",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00009",
            section: "Data 2.2.s4.b1.b6",
            title: "Enumerated values are case-sensitive",
          },
        ],
      },
      {
        idSuffix: "likert",
        title: 'A Statement rejects an interactionType value whose case does not exactly match "likert"',
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "interactionType"],
            value: "liKert",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00009",
            section: "Data 2.2.s4.b1.b6",
            title: "Enumerated values are case-sensitive",
          },
        ],
      },
      {
        idSuffix: "numeric",
        title: 'A Statement rejects an interactionType value whose case does not exactly match "numeric"',
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "interactionType"],
            value: "nUmeric",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00009",
            section: "Data 2.2.s4.b1.b6",
            title: "Enumerated values are case-sensitive",
          },
        ],
      },
      {
        idSuffix: "other",
        title: 'A Statement rejects an interactionType value whose case does not exactly match "other"',
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "interactionType"],
            value: "Other",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00009",
            section: "Data 2.2.s4.b1.b6",
            title: "Enumerated values are case-sensitive",
          },
        ],
      },
    ],
  });

  const extensionKeyCases = statementMutationFamily({
    familyId: "v2.statements.invalid-extension-iri",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "extensions", "iri"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: formattingLegacyConfigFile,
    variants: [
      {
        idSuffix: "object-definition",
        title: "A Statement rejects an object definition extension key without an IRI scheme",
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "extensions"],
            value: {
              "not.valid.com/extension": 1234,
            },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00011",
            section: "Data 2.2.s4.b1.b8",
            title: "Extension keys must be IRIs",
          },
        ],
      },
      {
        idSuffix: "context",
        title: "A Statement rejects a context extension key without an IRI scheme",
        transforms: [
          {
            operation: "set",
            path: ["context", "extensions"],
            value: {
              "example.com/extension/wrong": 1234,
            },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00011",
            section: "Data 2.2.s4.b1.b8",
            title: "Extension keys must be IRIs",
          },
        ],
      },
      {
        idSuffix: "result",
        title: "A Statement rejects a result extension key without an IRI scheme",
        transforms: [
          {
            operation: "set",
            path: ["result", "extensions"],
            value: {
              "example.com/extension/wrong": 1234,
            },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00011",
            section: "Data 2.2.s4.b1.b8",
            title: "Extension keys must be IRIs",
          },
        ],
      },
    ],
  });

  const languageTagAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.language-tags.accepted",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    expectedStatus: 200,
    tags: ["v2.0.0", "statements", "formatting", "language-tags", "acceptance"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: formattingLegacyConfigFile,
    variants: [
      {
        idSuffix: "verb-display",
        title: "A Statement accepts a valid RFC 5646 language key in verb.display",
        transforms: [
          {
            operation: "set",
            path: ["verb", "display"],
            value: { de: "besucht" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "object-name",
        title: "A Statement accepts a valid RFC 5646 language key in object.definition.name",
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "name"],
            value: { "de-DE": "Beweis Aktivitat" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "object-description",
        title: "A Statement accepts a valid RFC 5646 language key in object.definition.description",
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "description"],
            value: { "zh-Hant": "證明描述" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "context-language",
        title: "A Statement accepts a valid RFC 5646 context.language value",
        transforms: [
          {
            operation: "set",
            path: ["context", "language"],
            value: "cmn",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language values follow RFC 5646",
          },
          {
            id: "XAPI-00091",
            section: "Data 2.4.6.s3.table1.row7",
            title: 'A "language" property follows RFC 5646',
          },
        ],
      },
      {
        idSuffix: "attachment-display",
        title: "A Statement accepts a valid RFC 5646 language key in attachment.display",
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [
              buildAttachmentFixture({
                display: {
                  "en-US": "Proof Attachment",
                  es: "Adjunto de prueba",
                },
              }),
            ],
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "attachment-description",
        title: "A Statement accepts a valid RFC 5646 language key in attachment.description",
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [
              buildAttachmentFixture({
                description: {
                  "en-US": "Proof Attachment Description",
                  "es-MX": "Descripcion del adjunto de prueba",
                },
              }),
            ],
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "substatement-verb-display",
        title: "A Statement accepts a valid RFC 5646 language key in a substatement verb.display",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "set",
            path: ["object", "verb", "display"],
            value: { "sr-Cyrl": "искусити" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "substatement-object-name",
        title: "A Statement accepts a valid RFC 5646 language key in a substatement activity name",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "set",
            path: ["object", "object", "definition", "name"],
            value: { "zh-Hans-CN": "子活动" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "substatement-object-description",
        title: "A Statement accepts a valid RFC 5646 language key in a substatement activity description",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "set",
            path: ["object", "object", "definition", "description"],
            value: { ase: "Substatement activity description" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "substatement-context-language",
        title: "A Statement accepts a valid RFC 5646 context.language value in a substatement",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "set",
            path: ["object", "context", "language"],
            value: "fr-CA",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language values follow RFC 5646",
          },
          {
            id: "XAPI-00091",
            section: "Data 2.4.6.s3.table1.row7",
            title: 'A "language" property follows RFC 5646',
          },
        ],
      },
    ],
  });

  const languageTagRejectionCases = statementMutationFamily({
    familyId: "v2.statements.language-tags.rejected",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "language-tags", "rejection"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: formattingLegacyConfigFile,
    variants: [
      {
        idSuffix: "verb-display",
        title: "A Statement rejects an invalid RFC 5646 language key in verb.display",
        transforms: [
          {
            operation: "set",
            path: ["verb", "display"],
            value: { something: "besucht" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "object-name",
        title: "A Statement rejects an invalid RFC 5646 language key in object.definition.name",
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "name"],
            value: { something: "Bad activity name" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "object-description",
        title: "A Statement rejects an invalid RFC 5646 language key in object.definition.description",
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "description"],
            value: { something: "Bad activity description" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "context-language",
        title: "A Statement rejects an invalid RFC 5646 context.language value",
        transforms: [
          {
            operation: "set",
            path: ["context", "language"],
            value: "something",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language values follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "attachment-display",
        title: "A Statement rejects an invalid RFC 5646 language key in attachment.display",
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [
              buildAttachmentFixture({
                display: {
                  "en-US": "Proof Attachment",
                  something: "Adjunto de prueba",
                },
              }),
            ],
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "attachment-description",
        title: "A Statement rejects an invalid RFC 5646 language key in attachment.description",
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [
              buildAttachmentFixture({
                description: {
                  "en-US": "Proof Attachment Description",
                  something: "Descripcion del adjunto de prueba",
                },
              }),
            ],
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "substatement-verb-display",
        title: "A Statement rejects an invalid RFC 5646 language key in a substatement verb.display",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "set",
            path: ["object", "verb", "display"],
            value: { something: "bad" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "substatement-object-name",
        title: "A Statement rejects an invalid RFC 5646 language key in a substatement activity name",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "set",
            path: ["object", "object", "definition", "name"],
            value: { "zh-z-aaa-z-bbb-c-ccc": "Invalid language tag" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "substatement-object-description",
        title: "A Statement rejects an invalid RFC 5646 language key in a substatement activity description",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "set",
            path: ["object", "object", "definition", "description"],
            value: { something: "Invalid language tag" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language map keys follow RFC 5646",
          },
        ],
      },
      {
        idSuffix: "substatement-context-language",
        title: "A Statement rejects an invalid RFC 5646 context.language value in a substatement",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "set",
            path: ["object", "context", "language"],
            value: "something",
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00013",
            section: "Data 2.2.s4.b2",
            title: "Language values follow RFC 5646",
          },
        ],
      },
    ],
  });

  const legacyLanguageMapRejectionCases = statementMutationFamily({
    familyId: "v2.statements.language-maps.legacy-rejected",
    suiteTitle: "Statement Special Data Types",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "language-maps", "legacy", "rejection"],
    legacyTraceSuiteFile: specialDataTypesLegacySuiteFile,
    legacyTraceConfigFile: languagesLegacyConfigFile,
    variants: [
      {
        idSuffix: "verb-display",
        title: "A Statement rejects an invalid language map in verb.display",
        transforms: [
          {
            operation: "set",
            path: ["verb", "display"],
            value: { something: "besucht" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00121",
            section: "Data 4.2.s1",
            title: "A Language Map follows RFC 5646",
          },
        ],
      },
      {
        idSuffix: "object-name",
        title: "A Statement rejects an invalid language map in object.definition.name",
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "name"],
            value: { something: "Bad activity name" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00121",
            section: "Data 4.2.s1",
            title: "A Language Map follows RFC 5646",
          },
        ],
      },
      {
        idSuffix: "object-description",
        title: "A Statement rejects an invalid language map in object.definition.description",
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "description"],
            value: { something: "Bad activity description" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00121",
            section: "Data 4.2.s1",
            title: "A Language Map follows RFC 5646",
          },
        ],
      },
      {
        idSuffix: "attachment-display",
        title: "A Statement rejects an invalid language map in attachment.display",
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [
              buildAttachmentFixture({
                display: {
                  "en-US": "Proof Attachment",
                  something: "Adjunto de prueba",
                },
              }),
            ],
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00121",
            section: "Data 4.2.s1",
            title: "A Language Map follows RFC 5646",
          },
        ],
      },
      {
        idSuffix: "attachment-description",
        title: "A Statement rejects an invalid language map in attachment.description",
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [
              buildAttachmentFixture({
                description: {
                  "en-US": "Proof Attachment Description",
                  something: "Descripcion del adjunto de prueba",
                },
              }),
            ],
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00121",
            section: "Data 4.2.s1",
            title: "A Language Map follows RFC 5646",
          },
        ],
      },
      {
        idSuffix: "substatement-verb-display",
        title: "A Statement rejects an invalid language map in a substatement verb.display",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "set",
            path: ["object", "verb", "display"],
            value: { something: "bad" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00121",
            section: "Data 4.2.s1",
            title: "A Language Map follows RFC 5646",
          },
        ],
      },
      {
        idSuffix: "substatement-object-name",
        title: "A Statement rejects an invalid language map in a substatement activity name",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "set",
            path: ["object", "object", "definition", "name"],
            value: { "zh-z-aaa-z-bbb-c-ccc": "Invalid language tag" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00121",
            section: "Data 4.2.s1",
            title: "A Language Map follows RFC 5646",
          },
        ],
      },
      {
        idSuffix: "substatement-object-description",
        title: "A Statement rejects an invalid language map in a substatement activity description",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "set",
            path: ["object", "object", "definition", "description"],
            value: { something: "Invalid language tag" },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00121",
            section: "Data 4.2.s1",
            title: "A Language Map follows RFC 5646",
          },
        ],
      },
    ],
  });

  const malformedObjectTypeCases = statementMutationFamily({
    familyId: "v2.statements.malformed-object-type",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "object-type"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    variants: [
      {
        idSuffix: "actor",
        title: "A Statement rejects an actor objectType value that does not exactly match Agent",
        transforms: [
          {
            operation: "set",
            path: ["actor", "objectType"],
            value: '"objectType": "Agent"',
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00014",
            section: "Data 2.1",
            title: "All Objects are well-created JSON Objects",
          },
        ],
      },
      {
        idSuffix: "substatement-actor",
        title: "A Statement rejects a substatement actor objectType value that does not exactly match Agent",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "set",
            path: ["object", "actor", "objectType"],
            value: '"objectType": "Agent"',
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00014",
            section: "Data 2.1",
            title: "All Objects are well-created JSON Objects",
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
        path: ["id"],
        value: buildProofUuid(200),
      },
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

  const putRoundTripStatement = buildProofStatement(201, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/transport-put-roundtrip",
    },
  ]);

  const statementEndpointPostStatement = buildProofStatement(1201, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/statement-endpoint-post",
    },
  ]);
  const statementEndpointPutStatement = buildProofStatement(1202, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/statement-endpoint-put",
    },
  ]);
  const statementPostAcceptedStatement = buildProofStatement(1203, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/statement-post-accepted",
    },
  ]);
  const statementPutAcceptedStatement = buildProofStatement(1204, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/statement-put-accepted",
    },
  ]);

  const statementEndpointPostCase = singleRequestCase({
    caseId: "v2.statements.transport.endpoint.post",
    title: "The Statements Resource exists at /statements and accepts POST requests",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00139",
        section: "Communication 2.1",
        title: "The Statements Resource exists at /statements",
      },
    ],
    tags: ["v2.0.0", "statements", "transport", "endpoint"],
    capabilityFlags: ["transport"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    request: buildStatementPostRequest(statementEndpointPostStatement),
    assertion: {
      status: 200,
    },
    notes: ["proof-slice statement endpoint post exists"],
  });

  const statementEndpointPutCase = singleRequestCase({
    caseId: "v2.statements.transport.endpoint.put",
    title: "The Statements Resource exists at /statements and accepts PUT requests",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00139",
        section: "Communication 2.1",
        title: "The Statements Resource exists at /statements",
      },
    ],
    tags: ["v2.0.0", "statements", "transport", "endpoint"],
    capabilityFlags: ["transport"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    request: buildStatementPutRequest(statementEndpointPutStatement.id, statementEndpointPutStatement),
    assertion: {
      status: 204,
    },
    notes: ["proof-slice statement endpoint put exists"],
  });

  const statementPostAcceptedCase = singleRequestCase({
    caseId: "v2.statements.transport.post-accepted",
    title: "The Statements Resource accepts POST requests",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00147",
        section: "Communication 2.1.2.s1",
        title: "The Statements Resource accepts POST requests",
      },
    ],
    tags: ["v2.0.0", "statements", "transport", "post"],
    capabilityFlags: ["transport"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    request: buildStatementPostRequest(statementPostAcceptedStatement),
    assertion: {
      status: 200,
    },
    notes: ["proof-slice statement post accepted"],
  });

  const statementPutAcceptedCase = singleRequestCase({
    caseId: "v2.statements.transport.put-with-statement-id-accepted",
    title: "The Statements Resource accepts PUT requests when statementId is provided",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00144",
        section: "Communication 2.1.1.s1.table1.row1",
        title: "The Statements Resource accepts PUT requests only if statementId is provided",
      },
    ],
    tags: ["v2.0.0", "statements", "transport", "put"],
    capabilityFlags: ["transport"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    request: buildStatementPutRequest(statementPutAcceptedStatement.id, statementPutAcceptedStatement),
    assertion: {
      status: 204,
    },
    notes: ["proof-slice statement put accepted with statementId"],
  });

  const putRoundTripCase = requestSequenceCase({
    caseId: "v2.statements.transport.put-roundtrip",
    title: "The Statements resource persists a statement written with PUT and retrieves it by statementId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00143",
        section: "Communication 2.1.1.s1",
        title: "Successful Statement PUT returns 204 No Content",
      },
    ],
    tags: ["v2.0.0", "statements", "transport", "put"],
    capabilityFlags: ["transport", "query", "retrieval"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice statement PUT roundtrip"],
    steps: [
      {
        request: buildStatementPutRequest(putRoundTripStatement.id, putRoundTripStatement),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildStatementGetRequest(putRoundTripStatement.id),
        assertion: {
          status: 200,
          expectedHeaders: [
            {
              key: "X-Experience-API-Version",
              equals: specVersion,
            },
          ],
          jsonPathEquals: [
            {
              path: ["id"],
              equals: putRoundTripStatement.id,
            },
            {
              path: ["verb", "id"],
              equals: "https://example.test/xapi/verbs/transport-put-roundtrip",
            },
          ],
        },
      },
    ],
  });

  const putRequiresStatementIdStatement = buildProofStatement(202, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/transport-put-missing-id",
    },
  ]);

  const putRequiresStatementIdCase = singleRequestCase({
    caseId: "v2.statements.transport.put-requires-statement-id",
    title: "The Statements resource rejects PUT without a statementId query parameter",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00145",
        section: "Communication 2.1.1.s1.table1.row1",
        title: "Statement PUT rejects requests without statementId",
      },
    ],
    tags: ["v2.0.0", "statements", "transport", "put"],
    capabilityFlags: ["transport", "validation"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    request: {
      method: "PUT",
      endpoint: "statements",
      authMode: "basic",
      headers: buildVersionedHeaders(),
      query: {},
      body: buildStatementBody(putRequiresStatementIdStatement),
    },
    assertion: {
      status: 400,
    },
    notes: ["proof-slice statement PUT requires statementId"],
  });

  const immutableOriginalVerbId = "https://example.test/xapi/verbs/transport-put-original";
  const immutableReplacementVerbId = "https://example.test/xapi/verbs/transport-put-replacement";
  const immutableOriginalStatement = buildProofStatement(203, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: immutableOriginalVerbId,
    },
  ]);
  const immutableReplacementStatement = buildProofStatement(203, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: immutableReplacementVerbId,
    },
  ]);

  const putImmutableCase = requestSequenceCase({
    caseId: "v2.statements.transport.put-is-immutable",
    title:
      "The Statements resource does not modify an existing statement when the same statementId is written again with PUT",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00142",
        section: "Communication 2.1.1.s2.b2",
        title: "Statement PUT cannot modify an existing Statement",
      },
    ],
    tags: ["v2.0.0", "statements", "transport", "put", "immutability"],
    capabilityFlags: ["transport", "query", "retrieval"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice statement PUT immutability"],
    steps: [
      {
        request: buildStatementPutRequest(immutableOriginalStatement.id, immutableOriginalStatement),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildStatementPutRequest(immutableReplacementStatement.id, immutableReplacementStatement),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildStatementGetRequest(immutableOriginalStatement.id),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["verb", "id"],
              equals: immutableOriginalVerbId,
            },
          ],
        },
      },
    ],
  });

  const voidedStatement = buildProofStatement(204, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/voiding-target",
    },
  ]);
  const voidingStatement = buildProofStatement(205, [
    {
      operation: "set",
      path: ["verb"],
      value: buildVerbFixture("http://adlnet.gov/expapi/verbs/voided", "voided"),
    },
    {
      operation: "set",
      path: ["object"],
      value: {
        objectType: "StatementRef",
        id: voidedStatement.id,
      },
    },
  ]);

  const voidedStatementQueryCase = requestSequenceCase({
    caseId: "v2.statements.voiding.voided-statement-id-roundtrip",
    title: "The Statements resource returns a voided statement when queried by voidedStatementId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00018",
        section: "Data 2.3.2.s2.b3",
        title: "Voided statements are returned only through voidedStatementId lookups",
      },
      {
        id: "XAPI-00155",
        section: "Communication 2.1.3.s1",
        title: "GET with voidedStatementId returns the corresponding Statement",
      },
    ],
    tags: ["v2.0.0", "statements", "voiding", "query"],
    capabilityFlags: ["transport", "query", "retrieval", "voiding"],
    legacyTraceSuiteFile: statementLifecycleLegacySuiteFile,
    notes: ["proof-slice voided statement retrieval"],
    steps: [
      {
        request: buildStatementPostRequest(voidedStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementPostRequest(voidingStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildVoidedStatementGetRequest(voidedStatement.id),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["id"],
              equals: voidedStatement.id,
            },
          ],
        },
      },
    ],
  });

  const hiddenVoidedStatement = buildProofStatement(206, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/voiding-hidden-target",
    },
  ]);
  const hidingVoidingStatement = buildProofStatement(207, [
    {
      operation: "set",
      path: ["verb"],
      value: buildVerbFixture("http://adlnet.gov/expapi/verbs/voided", "voided"),
    },
    {
      operation: "set",
      path: ["object"],
      value: {
        objectType: "StatementRef",
        id: hiddenVoidedStatement.id,
      },
    },
  ]);

  const hiddenVoidedStatementCase = requestSequenceCase({
    caseId: "v2.statements.voiding.statement-id-hides-voided",
    title: "The Statements resource does not return a voided statement when queried by statementId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00018",
        section: "Data 2.3.2.s2.b3",
        title: "Voided statements are hidden from statementId lookups",
      },
      {
        id: "XAPI-00163",
        section: "Communication 2.1.4.s1.b1",
        title: "Voided Statements are only returned for voidedStatementId lookups",
      },
    ],
    tags: ["v2.0.0", "statements", "voiding", "query"],
    capabilityFlags: ["transport", "query", "retrieval", "voiding"],
    legacyTraceSuiteFile: statementLifecycleLegacySuiteFile,
    notes: ["proof-slice hidden voided statement lookup"],
    steps: [
      {
        request: buildStatementPostRequest(hiddenVoidedStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementPostRequest(hidingVoidingStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementGetRequest(hiddenVoidedStatement.id),
        assertion: {
          status: 404,
        },
      },
    ],
  });

  const missingTargetVoidingStatement = buildProofStatement(970, [
    {
      operation: "set",
      path: ["verb"],
      value: buildVerbFixture("http://adlnet.gov/expapi/verbs/voided", "voided"),
    },
    {
      operation: "set",
      path: ["object"],
      value: {
        objectType: "StatementRef",
        id: buildProofUuid(971),
      },
    },
  ]);

  const missingTargetVoidingAcceptedCase = singleRequestCase({
    caseId: "v2.statements.voiding.missing-target-accepted",
    title: "The Statements resource accepts a voiding statement whose StatementRef target is not present",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00019",
        section: "Data 2.3.2",
        title: "Voiding statements are identified by the voided verb and StatementRef object",
      },
      {
        id: "XAPI-00020",
        section: "Data 2.3.2.s2.b1",
        title: "Voiding statements use StatementRef as the objectType",
      },
    ],
    tags: ["v2.0.0", "statements", "voiding"],
    capabilityFlags: ["transport", "voiding"],
    legacyTraceSuiteFile: statementLifecycleLegacySuiteFile,
    legacyTraceConfigFile: voidingLegacyConfigFile,
    request: buildStatementPostRequest(missingTargetVoidingStatement),
    assertion: {
      status: 200,
      jsonPathEquals: listEquals([missingTargetVoidingStatement.id]),
    },
    notes: ["proof-slice missing target voiding acceptance"],
  });

  const invalidVoidingObjectCase = singleRequestCase({
    caseId: "v2.statements.voiding.requires-statement-ref-object",
    title: "The Statements resource rejects a voiding statement when its object is not a StatementRef",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00017",
        section: "Data 2.3.2.s2.b1",
        title: "Voiding statements are rejected when objectType is not StatementRef",
      },
    ],
    tags: ["v2.0.0", "statements", "voiding", "validation"],
    capabilityFlags: ["transport", "voiding", "validation"],
    legacyTraceSuiteFile: statementLifecycleLegacySuiteFile,
    legacyTraceConfigFile: voidingLegacyConfigFile,
    request: buildStatementPostRequest(
      buildProofStatement(972, [
        {
          operation: "set",
          path: ["verb"],
          value: buildVerbFixture("http://adlnet.gov/expapi/verbs/voided", "voided"),
        },
        {
          operation: "set",
          path: ["object"],
          value: buildActivityObjectFixture("https://example.test/xapi/activities/not-a-statement-ref"),
        },
      ]),
    ),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice invalid voiding object rejection"],
  });

  const revoidedTargetStatement = buildProofStatement(973, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/revoid-target",
    },
  ]);
  const firstRevoidingStatement = buildProofStatement(974, [
    {
      operation: "set",
      path: ["verb"],
      value: buildVerbFixture("http://adlnet.gov/expapi/verbs/voided", "voided"),
    },
    {
      operation: "set",
      path: ["object"],
      value: {
        objectType: "StatementRef",
        id: revoidedTargetStatement.id,
      },
    },
  ]);
  const secondRevoidingStatement = buildProofStatement(975, [
    {
      operation: "set",
      path: ["verb"],
      value: buildVerbFixture("http://adlnet.gov/expapi/verbs/voided", "voided"),
    },
    {
      operation: "set",
      path: ["object"],
      value: {
        objectType: "StatementRef",
        id: revoidedTargetStatement.id,
      },
    },
  ]);

  const repeatedVoidingIgnoredCase = requestSequenceCase({
    caseId: "v2.statements.voiding.repeated-target-ignored",
    title: "The Statements resource ignores a second voiding statement that targets an already voided statement",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00016",
        section: "Data 2.3.2.s2.b7",
        title: "Voiding statements that target already voided statements are ignored if accepted",
      },
    ],
    tags: ["v2.0.0", "statements", "voiding"],
    capabilityFlags: ["transport", "query", "retrieval", "voiding"],
    legacyTraceSuiteFile: statementLifecycleLegacySuiteFile,
    notes: ["proof-slice repeated voiding is ignored"],
    steps: [
      {
        request: buildStatementPostRequest(revoidedTargetStatement),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([revoidedTargetStatement.id]),
        },
      },
      {
        request: buildStatementPostRequest(firstRevoidingStatement),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([firstRevoidingStatement.id]),
        },
      },
      {
        request: buildStatementPostRequest(secondRevoidingStatement),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([secondRevoidingStatement.id]),
        },
      },
      {
        request: buildVoidedStatementGetRequest(revoidedTargetStatement.id),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["id"],
              equals: revoidedTargetStatement.id,
            },
          ],
        },
      },
    ],
  });

  const protectedVoidingTargetStatement = buildProofStatement(976, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/protected-voiding-target",
    },
  ]);
  const protectedVoidingStatement = buildProofStatement(977, [
    {
      operation: "set",
      path: ["verb"],
      value: buildVerbFixture("http://adlnet.gov/expapi/verbs/voided", "voided"),
    },
    {
      operation: "set",
      path: ["object"],
      value: {
        objectType: "StatementRef",
        id: protectedVoidingTargetStatement.id,
      },
    },
  ]);
  const illegalVoidingOfVoidingStatement = buildProofStatement(978, [
    {
      operation: "set",
      path: ["verb"],
      value: buildVerbFixture("http://adlnet.gov/expapi/verbs/voided", "voided"),
    },
    {
      operation: "set",
      path: ["object"],
      value: {
        objectType: "StatementRef",
        id: protectedVoidingStatement.id,
      },
    },
  ]);

  const voidingStatementRemainsVisibleCase = requestSequenceCase({
    caseId: "v2.statements.voiding.cannot-target-voiding-statement",
    title: "The Statements resource does not void a voiding statement when another voiding statement targets it",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00016",
        section: "Data 2.3.2.s2.b7",
        title: "Voiding statements cannot target other voiding statements",
      },
    ],
    tags: ["v2.0.0", "statements", "voiding"],
    capabilityFlags: ["transport", "query", "retrieval", "voiding"],
    legacyTraceSuiteFile: statementLifecycleLegacySuiteFile,
    notes: ["proof-slice voiding statements remain visible when targeted"],
    steps: [
      {
        request: buildStatementPostRequest(protectedVoidingTargetStatement),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([protectedVoidingTargetStatement.id]),
        },
      },
      {
        request: buildStatementPostRequest(protectedVoidingStatement),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([protectedVoidingStatement.id]),
        },
      },
      {
        request: buildStatementPostRequest(illegalVoidingOfVoidingStatement),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([illegalVoidingOfVoidingStatement.id]),
        },
      },
      {
        request: buildStatementGetRequest(protectedVoidingStatement.id),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["id"],
              equals: protectedVoidingStatement.id,
            },
          ],
        },
      },
    ],
  });

  const batchSuccessStatementOne = buildProofStatement(220, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/batch-success-one",
    },
  ]);
  const batchSuccessStatementTwo = buildProofStatement(221, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/batch-success-two",
    },
  ]);

  const singlePostResponseStatement = buildProofStatement(209, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/post-single-response-array",
    },
  ]);

  const singlePostResponseCase = singleRequestCase({
    caseId: "v2.statements.transport.post-single-returns-id-array",
    title:
      "The Statements resource returns an array containing the submitted statement id for a successful single POST",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00146",
        section: "Communication 2.1.2.s1",
        title: "Successful Statement POST returns all submitted statement ids",
      },
    ],
    tags: ["v2.0.0", "statements", "transport", "post"],
    capabilityFlags: ["transport"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    request: buildStatementPostRequest(singlePostResponseStatement),
    assertion: {
      status: 200,
      jsonPathEquals: listEquals([singlePostResponseStatement.id]),
    },
    notes: ["proof-slice statement single POST success"],
  });

  const batchSuccessCase = singleRequestCase({
    caseId: "v2.statements.transport.post-batch-success",
    title: "The Statements resource accepts a valid POST batch and returns the submitted statement ids",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00146",
        section: "Communication 2.1.2.s1",
        title: "Successful Statement POST returns all submitted statement ids",
      },
    ],
    tags: ["v2.0.0", "statements", "transport", "batch"],
    capabilityFlags: ["transport", "batch"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    request: buildStatementBatchPostRequest([batchSuccessStatementOne, batchSuccessStatementTwo]),
    assertion: {
      status: 200,
      jsonPathEquals: [
        {
          path: [],
          equals: [batchSuccessStatementOne.id, batchSuccessStatementTwo.id],
        },
      ],
    },
    notes: ["proof-slice statement batch success"],
  });

  const duplicateBatchStatement = buildProofStatement(222, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/batch-duplicate-original",
    },
  ]);
  const duplicateBatchConflictingStatement = buildProofStatement(223, [
    {
      operation: "set",
      path: ["id"],
      value: duplicateBatchStatement.id,
    },
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/batch-duplicate-conflict",
    },
  ]);

  const duplicateBatchCase = singleRequestCase({
    caseId: "v2.statements.transport.post-batch-rejects-duplicate-ids",
    title: "The Statements resource rejects a POST batch that contains duplicate statement ids",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00326",
        section: "Communication 3.2.s3.b9",
        title: "Rejected Statement batches return 400 Bad Request",
      },
    ],
    tags: ["v2.0.0", "statements", "transport", "batch", "validation"],
    capabilityFlags: ["transport", "batch", "validation"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    request: buildStatementBatchPostRequest([duplicateBatchStatement, duplicateBatchConflictingStatement]),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice statement batch duplicate-id rejection"],
  });

  const rollbackBatchValidStatement = buildProofStatement(224, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/batch-rollback-valid",
    },
  ]);
  const rollbackBatchInvalidStatement = buildProofStatement(225, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "not-a-valid-iri",
    },
  ]);

  const batchRollbackCase = requestSequenceCase({
    caseId: "v2.statements.transport.post-batch-atomic-rollback",
    title: "The Statements resource does not persist any statements from a rejected POST batch",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00326",
        section: "Communication 3.2.s3.b9",
        title: "Rejected Statement batches do not partially persist",
      },
    ],
    tags: ["v2.0.0", "statements", "transport", "batch", "rollback"],
    capabilityFlags: ["transport", "batch", "validation"],
    legacyTraceSuiteFile: errorCodesLegacySuiteFile,
    notes: ["proof-slice statement batch rollback"],
    steps: [
      {
        request: buildStatementBatchPostRequest([rollbackBatchValidStatement, rollbackBatchInvalidStatement]),
        assertion: {
          status: 400,
        },
      },
      {
        request: buildStatementGetRequest(rollbackBatchValidStatement.id),
        assertion: {
          status: 404,
        },
      },
    ],
  });

  const exactFormatStatement = buildFormatProofStatement(226, "mailto:format-exact@example.test");
  const canonicalFormatStatement = buildFormatProofStatement(227, "mailto:format-canonical@example.test");
  const idsFormatStatement = buildFormatProofStatement(228, "mailto:format-ids@example.test");

  const exactFormatCase = requestSequenceCase({
    caseId: "v2.statements.representation.format-exact",
    title: "The Statements resource returns exact statement representations when format is exact",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00170",
        section: "Communication 2.1.3.s1.table1.row12",
        title: "GET with format exact returns statement content exactly as submitted",
      },
    ],
    tags: ["v2.0.0", "statements", "representation", "format"],
    capabilityFlags: ["query", "retrieval", "format"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice statement exact format"],
    steps: [
      {
        request: buildStatementPostRequest(exactFormatStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementCollectionRequest({
          statementId: exactFormatStatement.id,
          format: "exact",
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["actor"],
              equals: exactFormatStatement.actor,
            },
            {
              path: ["verb", "display"],
              equals: {
                "en-US": "format-proof-us",
                "en-GB": "format-proof-gb",
              },
            },
            {
              path: ["object", "definition", "name"],
              equals: {
                "en-US": "Format Proof US",
                "en-GB": "Format Proof GB",
              },
            },
          ],
        },
      },
    ],
  });

  const canonicalFormatCase = requestSequenceCase({
    caseId: "v2.statements.representation.format-canonical-accept-language",
    title: "The Statements resource applies Accept-Language when format is canonical",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00169",
        section: "Communication 2.1.3.s1.table1.row12",
        title: "GET with format canonical returns canonicalized statement values",
      },
      {
        id: "XAPI-00172",
        section: "Communication 2.1.3.s1.table1.row11",
        title: "GET with format canonical applies Accept-Language",
      },
    ],
    tags: ["v2.0.0", "statements", "representation", "format", "canonical"],
    capabilityFlags: ["query", "retrieval", "format"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice statement canonical format"],
    steps: [
      {
        request: buildStatementPostRequest(canonicalFormatStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementCollectionRequest(
          {
            statementId: canonicalFormatStatement.id,
            format: "canonical",
          },
          {
            "Accept-Language": "en-GB",
          },
        ),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["verb", "display"],
              equals: {
                "en-GB": "format-proof-gb",
              },
            },
            {
              path: ["object", "definition", "name"],
              equals: {
                "en-GB": "Format Proof GB",
              },
            },
            {
              path: ["object", "definition", "description"],
              equals: {
                "en-GB": "Format description GB",
              },
            },
          ],
        },
      },
    ],
  });

  const idsFormatCase = requestSequenceCase({
    caseId: "v2.statements.representation.format-ids",
    title: "The Statements resource returns identifier-only statement representations when format is ids",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00171",
        section: "Communication 2.1.3.s1.table1.row12",
        title: "GET with format ids returns only identifying statement data",
      },
    ],
    tags: ["v2.0.0", "statements", "representation", "format", "ids"],
    capabilityFlags: ["query", "retrieval", "format"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice statement ids format"],
    steps: [
      {
        request: buildStatementPostRequest(idsFormatStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementCollectionRequest({
          statementId: idsFormatStatement.id,
          format: "ids",
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["actor"],
              equals: {
                objectType: "Agent",
                mbox: "mailto:format-ids@example.test",
              },
            },
            {
              path: ["verb"],
              equals: {
                id: "https://example.test/xapi/verbs/format-proof",
              },
            },
            {
              path: ["object"],
              equals: {
                id: "https://example.test/xapi/activities/format-proof",
              },
            },
          ],
        },
      },
    ],
  });

  const multipartAttachment: MultipartStatementAttachment = {
    contentType: "text/plain",
    sha2: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    body: "here is a proof attachment",
  };
  const multipartAttachmentStatement = buildProofStatement(229, [
    {
      operation: "set",
      path: ["attachments"],
      value: [buildMultipartAttachmentMetadata(multipartAttachment)],
    },
  ]);
  const multipartFallbackStatement = buildProofStatement(230, [
    {
      operation: "set",
      path: ["attachments"],
      value: [buildMultipartAttachmentMetadata(multipartAttachment)],
    },
  ]);

  const attachmentsMultipartCase = requestSequenceCase({
    caseId: "v2.statements.representation.attachments-multipart",
    title: "The Statements resource returns multipart attachment data when attachments is true",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00167",
        section: "Communication 2.1.3.s1.table1.row13",
        title: "GET with attachments true returns multipart attachment data",
      },
    ],
    tags: ["v2.0.0", "statements", "representation", "attachments"],
    capabilityFlags: ["query", "retrieval", "attachments"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice statement multipart attachments"],
    steps: [
      {
        request: buildMultipartStatementPostRequest(multipartAttachmentStatement, [multipartAttachment]),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([multipartAttachmentStatement.id]),
        },
      },
      {
        request: buildStatementCollectionRequest({
          statementId: multipartAttachmentStatement.id,
          attachments: "true",
        }),
        assertion: {
          status: 200,
          expectedHeaders: [
            {
              key: "content-type",
              equals: multipartStatementResponseContentType,
            },
          ],
          textContains: [multipartAttachmentStatement.id, multipartAttachment.sha2, multipartAttachment.body],
        },
      },
    ],
  });

  const attachmentsJsonFallbackCase = requestSequenceCase({
    caseId: "v2.statements.representation.attachments-json-fallback",
    title: "The Statements resource falls back to application/json when attachments is absent or false",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00161",
        section: "Communication 2.1.3.s1.b1",
        title: "GET without attachments data returns application/json",
      },
    ],
    tags: ["v2.0.0", "statements", "representation", "attachments"],
    capabilityFlags: ["query", "retrieval", "attachments"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice statement attachment json fallback"],
    steps: [
      {
        request: buildMultipartStatementPostRequest(multipartFallbackStatement, [multipartAttachment]),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([multipartFallbackStatement.id]),
        },
      },
      {
        request: buildStatementGetRequest(multipartFallbackStatement.id),
        assertion: {
          status: 200,
          expectedHeaders: [
            {
              key: "content-type",
              equals: "application/json",
            },
          ],
          jsonPathEquals: [
            {
              path: ["id"],
              equals: multipartFallbackStatement.id,
            },
          ],
        },
      },
      {
        request: buildStatementCollectionRequest({
          statementId: multipartFallbackStatement.id,
          attachments: "false",
        }),
        assertion: {
          status: 200,
          expectedHeaders: [
            {
              key: "content-type",
              equals: "application/json",
            },
          ],
          jsonPathEquals: [
            {
              path: ["id"],
              equals: multipartFallbackStatement.id,
            },
          ],
        },
      },
    ],
  });

  const formatProofDisplay = {
    "en-US": "format-proof-us",
    "en-GB": "format-proof-gb",
  };
  const formatProofName = {
    "en-US": "Format Proof US",
    "en-GB": "Format Proof GB",
  };
  const formatProofDescription = {
    "en-US": "Format description US",
    "en-GB": "Format description GB",
  };

  const formatAbsentDefaultStatement = buildProofStatement(1215, [
    {
      operation: "set",
      path: ["actor"],
      value: {
        objectType: "Agent",
        mbox: "mailto:format-absent-default@example.test",
        name: "Format Proof Agent",
      },
    },
    {
      operation: "set",
      path: ["verb"],
      value: {
        id: "https://example.test/xapi/verbs/format-absent-default",
        display: formatProofDisplay,
      },
    },
    {
      operation: "set",
      path: ["object"],
      value: {
        objectType: "Activity",
        id: "https://example.test/xapi/activities/format-absent-default",
        definition: {
          name: formatProofName,
          description: formatProofDescription,
          type: "https://example.test/xapi/activity-types/format-proof",
        },
      },
    },
  ]);

  const formatAbsentDefaultCase = requestSequenceCase({
    caseId: "v2.statements.representation.format-absent-defaults-exact",
    title: "The Statements Resource returns exact statement data when format is absent",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00168",
        section: "Communication 2.1.3.s1.table1.row12",
        title: "The Statements Resource defaults GET responses to exact when format is absent",
      },
    ],
    tags: ["v2.0.0", "statements", "representation", "format"],
    capabilityFlags: ["query", "retrieval", "format"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice statement format absent defaults exact"],
    steps: [
      {
        request: buildStatementPostRequest(formatAbsentDefaultStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementGetRequest(formatAbsentDefaultStatement.id),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["actor"],
              equals: formatAbsentDefaultStatement.actor,
            },
            {
              path: ["verb", "display"],
              equals: formatProofDisplay,
            },
            {
              path: ["object", "definition", "name"],
              equals: formatProofName,
            },
          ],
        },
      },
    ],
  });

  const acceptLanguageWithoutCanonicalStatement = buildProofStatement(1216, [
    {
      operation: "set",
      path: ["actor"],
      value: {
        objectType: "Agent",
        mbox: "mailto:format-no-canonical@example.test",
        name: "Format Proof Agent",
      },
    },
    {
      operation: "set",
      path: ["verb"],
      value: {
        id: "https://example.test/xapi/verbs/format-no-canonical-default",
        display: formatProofDisplay,
      },
    },
    {
      operation: "set",
      path: ["object"],
      value: {
        objectType: "Activity",
        id: "https://example.test/xapi/activities/format-no-canonical-default",
        definition: {
          name: formatProofName,
          description: formatProofDescription,
          type: "https://example.test/xapi/activity-types/format-proof",
        },
      },
    },
  ]);

  const acceptLanguageWithoutCanonicalCase = requestSequenceCase({
    caseId: "v2.statements.representation.accept-language-ignored-without-canonical",
    title: "The Statements Resource does not apply Accept-Language when format is absent",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00172",
        section: "Communication 2.1.3.s1.table1.row11",
        title: "Accept-Language only affects statement retrieval when format is canonical",
      },
    ],
    tags: ["v2.0.0", "statements", "representation", "format", "accept-language"],
    capabilityFlags: ["query", "retrieval", "format"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice statement accept-language ignored without canonical"],
    steps: [
      {
        request: buildStatementPostRequest(acceptLanguageWithoutCanonicalStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementGetRequest(acceptLanguageWithoutCanonicalStatement.id, {
          "Accept-Language": "en-GB",
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["verb", "display"],
              equals: formatProofDisplay,
            },
            {
              path: ["object", "definition", "name"],
              equals: formatProofName,
            },
            {
              path: ["object", "definition", "description"],
              equals: formatProofDescription,
            },
          ],
        },
      },
    ],
  });

  const attachmentsMissingJsonStatement = buildProofStatement(1217, [
    {
      operation: "set",
      path: ["attachments"],
      value: [buildMultipartAttachmentMetadata(multipartAttachment)],
    },
  ]);
  const attachmentsFalseJsonStatement = buildProofStatement(1218, [
    {
      operation: "set",
      path: ["attachments"],
      value: [buildMultipartAttachmentMetadata(multipartAttachment)],
    },
  ]);

  const attachmentsMissingJsonCase = requestSequenceCase({
    caseId: "v2.statements.representation.attachments-missing-json",
    title: "The Statements Resource returns application/json when attachments is omitted",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00161",
        section: "Communication 2.1.3.s1.b1",
        title: "The Statements Resource does not return attachment data when attachments is omitted",
      },
    ],
    tags: ["v2.0.0", "statements", "representation", "attachments"],
    capabilityFlags: ["query", "retrieval", "attachments"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice statement attachments omitted json fallback"],
    steps: [
      {
        request: buildMultipartStatementPostRequest(attachmentsMissingJsonStatement, [multipartAttachment]),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([attachmentsMissingJsonStatement.id]),
        },
      },
      {
        request: buildStatementGetRequest(attachmentsMissingJsonStatement.id),
        assertion: {
          status: 200,
          expectedHeaderPatterns: [
            {
              key: "content-type",
              pattern: "^application/json(?:;.*)?$",
            },
          ],
        },
      },
    ],
  });

  const attachmentsFalseJsonCase = requestSequenceCase({
    caseId: "v2.statements.representation.attachments-false-json",
    title: "The Statements Resource returns application/json when attachments is false",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00161",
        section: "Communication 2.1.3.s1.b1",
        title: "The Statements Resource does not return attachment data when attachments is false",
      },
    ],
    tags: ["v2.0.0", "statements", "representation", "attachments"],
    capabilityFlags: ["query", "retrieval", "attachments"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice statement attachments false json fallback"],
    steps: [
      {
        request: buildMultipartStatementPostRequest(attachmentsFalseJsonStatement, [multipartAttachment]),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([attachmentsFalseJsonStatement.id]),
        },
      },
      {
        request: buildStatementCollectionRequest({
          statementId: attachmentsFalseJsonStatement.id,
          attachments: "false",
        }),
        assertion: {
          status: 200,
          expectedHeaderPatterns: [
            {
              key: "content-type",
              pattern: "^application/json(?:;.*)?$",
            },
          ],
        },
      },
    ],
  });

  const contentTypeHeaderCase = singleRequestCase({
    caseId: "v2.statements.representation.content-type-header",
    title: "The Statements Resource includes a Content-Type header on successful GET responses",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00165",
        section: "Communication 2.1.3.s1.table1.row14",
        title: "The Statements Resource includes a Content-Type header on GET responses",
      },
    ],
    tags: ["v2.0.0", "statements", "representation", "headers"],
    capabilityFlags: ["query", "headers"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    request: buildStatementCollectionRequest({
      ascending: "true",
    }),
    assertion: {
      status: 200,
      expectedHeaderPatterns: [
        {
          key: "content-type",
          pattern: "^application/json(?:;.*)?$",
        },
      ],
    },
    notes: ["proof-slice statement content-type header on get"],
  });

  const lastModifiedStatement = buildProofStatement(231, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/header-last-modified",
    },
  ]);

  const lastModifiedCase = requestSequenceCase({
    caseId: "v2.statements.headers.last-modified-matches-stored",
    title: "The Statements resource returns Last-Modified that matches the stored timestamp",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-01002",
        section: "Communication 2.1.1",
        title: "Statement GET Last-Modified matches the stored timestamp",
      },
    ],
    tags: ["v2.0.0", "statements", "headers"],
    capabilityFlags: ["query", "retrieval", "headers"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice statement last-modified header"],
    steps: [
      {
        request: buildStatementPostRequest(lastModifiedStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementGetRequest(lastModifiedStatement.id),
        assertion: {
          status: 200,
          expectedHeaders: [
            {
              key: "last-modified",
              equals: buildProofStoredTimestamp(231),
            },
          ],
          jsonPathEquals: [
            {
              path: ["stored"],
              equals: buildProofStoredTimestamp(231),
            },
          ],
        },
      },
    ],
  });

  const consistentThroughSuccessCase = singleRequestCase({
    caseId: "v2.statements.headers.consistent-through-success",
    title: "The Statements resource returns X-Experience-API-Consistent-Through on successful GET responses",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00153",
        section: "Communication 2.1.3.s2.b5",
        title: "GET returns X-Experience-API-Consistent-Through regardless of successful code",
      },
      {
        id: "XAPI-00160",
        section: "Communication 2.1.3.s2.b5",
        title: "X-Experience-API-Consistent-Through is an ISO 8601 timestamp",
      },
    ],
    tags: ["v2.0.0", "statements", "headers"],
    capabilityFlags: ["headers", "query"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    request: buildStatementCollectionRequest({
      verb: "https://example.test/xapi/verbs/non-existent-consistent-through",
    }),
    assertion: {
      status: 200,
      expectedHeaderPatterns: [
        {
          key: "x-experience-api-consistent-through",
          pattern: isoTimestampHeaderPattern,
        },
      ],
    },
    notes: ["proof-slice statement consistent-through success header"],
  });

  const consistentThroughErrorCase = singleRequestCase({
    caseId: "v2.statements.headers.consistent-through-error",
    title: "The Statements resource returns X-Experience-API-Consistent-Through on invalid GET responses",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00153",
        section: "Communication 2.1.3.s2.b5",
        title: "GET returns X-Experience-API-Consistent-Through regardless of returned code",
      },
    ],
    tags: ["v2.0.0", "statements", "headers", "validation"],
    capabilityFlags: ["headers", "query", "validation"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    request: buildStatementCollectionRequest({
      LIMIT: "1",
    }),
    assertion: {
      status: 400,
      expectedHeaderPatterns: [
        {
          key: "x-experience-api-consistent-through",
          pattern: isoTimestampHeaderPattern,
        },
      ],
    },
    notes: ["proof-slice statement consistent-through error header"],
  });

  const consistentThroughQueryVariants: Array<{
    idSuffix: string;
    title: string;
    query: Record<string, string>;
  }> = [
    {
      idSuffix: "agent",
      title: 'GET requests with "agent"',
      query: {
        agent: buildAgentQuery("mailto:consistent-through-agent@example.test"),
      },
    },
    {
      idSuffix: "verb",
      title: 'GET requests with "verb"',
      query: {
        verb: "https://example.test/xapi/verbs/consistent-through-verb",
      },
    },
    {
      idSuffix: "activity",
      title: 'GET requests with "activity"',
      query: {
        activity: "https://example.test/xapi/activities/consistent-through-activity",
      },
    },
    {
      idSuffix: "registration",
      title: 'GET requests with "registration"',
      query: {
        registration: buildProofUuid(1220),
      },
    },
    {
      idSuffix: "related-activities",
      title: 'GET requests with "related_activities"',
      query: {
        activity: "https://example.test/xapi/activities/consistent-through-related-activity",
        related_activities: "true",
      },
    },
    {
      idSuffix: "related-agents",
      title: 'GET requests with "related_agents"',
      query: {
        agent: buildAgentQuery("mailto:consistent-through-related-agent@example.test"),
        related_agents: "true",
      },
    },
    {
      idSuffix: "since",
      title: 'GET requests with "since"',
      query: {
        since: buildProofTimestamp(22),
      },
    },
    {
      idSuffix: "until",
      title: 'GET requests with "until"',
      query: {
        until: buildProofTimestamp(23),
      },
    },
    {
      idSuffix: "limit",
      title: 'GET requests with "limit"',
      query: {
        limit: "1",
      },
    },
    {
      idSuffix: "ascending",
      title: 'GET requests with "ascending"',
      query: {
        ascending: "true",
      },
    },
    {
      idSuffix: "format",
      title: 'GET requests with "format"',
      query: {
        format: "ids",
      },
    },
    {
      idSuffix: "attachments",
      title: 'GET requests with "attachments"',
      query: {
        attachments: "true",
      },
    },
  ];

  const consistentThroughPresenceCases = consistentThroughQueryVariants.map((variant) =>
    singleRequestCase({
      caseId: `v2.statements.headers.consistent-through.presence.${variant.idSuffix}`,
      title: `The Statements Resource returns X-Experience-API-Consistent-Through for ${variant.title}`,
      specVersion,
      requirementRefs: [
        {
          id: "XAPI-00153",
          section: "Communication 2.1.3.s2.b5",
          title: "The Statements Resource returns X-Experience-API-Consistent-Through regardless of the GET query",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "consistent-through"],
      capabilityFlags: ["headers", "query"],
      legacyTraceSuiteFile: statementResourceLegacySuiteFile,
      request: buildStatementCollectionRequest(variant.query),
      assertion: {
        status: 200,
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^.+$",
          },
        ],
      },
      notes: [`proof-slice statement consistent-through presence ${variant.idSuffix}`],
    }),
  );

  const consistentThroughIsoCases = consistentThroughQueryVariants.map((variant) =>
    singleRequestCase({
      caseId: `v2.statements.headers.consistent-through.iso.${variant.idSuffix}`,
      title: `The Statements Resource returns an ISO 8601 X-Experience-API-Consistent-Through header for ${variant.title}`,
      specVersion,
      requirementRefs: [
        {
          id: "XAPI-00160",
          section: "Communication 2.1.3.s2.b5",
          title: "The Statements Resource returns an ISO 8601 X-Experience-API-Consistent-Through header",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "consistent-through"],
      capabilityFlags: ["headers", "query"],
      legacyTraceSuiteFile: statementResourceLegacySuiteFile,
      request: buildStatementCollectionRequest(variant.query),
      assertion: {
        status: 200,
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: isoTimestampHeaderPattern,
          },
        ],
      },
      notes: [`proof-slice statement consistent-through iso ${variant.idSuffix}`],
    }),
  );

  const emptyResultCase = singleRequestCase({
    caseId: "v2.statements.query.empty-result",
    title: "The Statements resource returns 200 with an empty StatementResult when a collection query matches nothing",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00149",
        section: "Communication 2.1.3.s2.b4",
        title: "GET returns an empty StatementResult instead of rejecting the request",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "retrieval"],
    capabilityFlags: ["query", "retrieval"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    request: buildStatementCollectionRequest({
      verb: "https://example.test/xapi/verbs/non-existent-proof-query",
    }),
    assertion: {
      status: 200,
      jsonPathEquals: [
        {
          path: ["statements"],
          equals: [],
        },
      ],
    },
    notes: ["proof-slice empty statement query result"],
  });

  const retrievalArrayVerbId = "https://example.test/xapi/verbs/retrieval-array";
  const retrievalArrayStatement = buildProofStatement(979, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: retrievalArrayVerbId,
    },
    {
      operation: "set",
      path: ["actor", "mbox"],
      value: "mailto:retrieval-array-statement@example.test",
    },
  ]);
  const retrievalArraySubstatement = buildProofStatement(980, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: retrievalArrayVerbId,
    },
    {
      operation: "set",
      path: ["actor", "mbox"],
      value: "mailto:retrieval-array-substatement@example.test",
    },
    {
      operation: "set",
      path: ["object"],
      value: buildSubStatementFixture(),
    },
  ]);

  const retrievalStatementsArrayCase = requestSequenceCase({
    caseId: "v2.statements.retrieval.statement-result-array",
    title:
      "The Statements resource returns StatementResult collections with a statements array and empty more when all matches are returned",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00110",
        section: "Data 2.5.s2.table1.row1",
        title: 'StatementResult collections expose a "statements" array',
      },
      {
        id: "XAPI-00109",
        section: "Data 2.5.s2.table1.row2",
        title: 'StatementResult collections return an empty or absent "more" when fully exhausted',
      },
    ],
    tags: ["v2.0.0", "statements", "retrieval", "query"],
    capabilityFlags: ["transport", "query", "retrieval"],
    legacyTraceSuiteFile: retrievalOfStatementsLegacySuiteFile,
    notes: ["proof-slice retrieval statements array and empty more"],
    steps: [
      {
        request: buildStatementPostRequest(retrievalArrayStatement),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([retrievalArrayStatement.id]),
        },
      },
      {
        request: buildStatementPostRequest(retrievalArraySubstatement),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([retrievalArraySubstatement.id]),
        },
      },
      {
        request: buildStatementCollectionRequest({
          verb: retrievalArrayVerbId,
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            ...buildStatementCollectionExpectations([retrievalArraySubstatement.id, retrievalArrayStatement.id]),
            {
              path: ["more"],
              equals: "",
            },
          ],
        },
      },
    ],
  });

  const retrievalPagedVerbId = "https://example.test/xapi/verbs/retrieval-paged";
  const retrievalPagedOlderStatement = buildProofStatement(981, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: retrievalPagedVerbId,
    },
  ]);
  const retrievalPagedNewerStatement = buildProofStatement(982, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: retrievalPagedVerbId,
    },
  ]);
  const retrievalPagedMorePath = buildStatementCollectionMorePath({
    verb: retrievalPagedVerbId,
    limit: "1",
    offset: "1",
  });

  const retrievalPaginationCase = requestSequenceCase({
    caseId: "v2.statements.retrieval.pagination.more-container",
    title:
      "The Statements resource returns a usable more path for paginated StatementResult containers and preserves the container shape on follow-up pages",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00108",
        section: "Data 2.5.s2.table1.row2",
        title: 'A non-empty "more" IRL refers to the next page of results',
      },
      {
        id: "XAPI-00111",
        section: "Data 2.5.s2.table1.row2",
        title: 'A "more" container follows the same StatementResult rules as the original GET',
      },
      {
        id: "XAPI-00113",
        section: "Data 2.5.s2.table1",
        title: 'Successful paginated GETs return both "statements" and "more"',
      },
      {
        id: "XAPI-00114",
        section: "Data 2.5.s2.table1.row1",
        title: "Paginated StatementResults create a container for each additional page",
      },
    ],
    tags: ["v2.0.0", "statements", "retrieval", "pagination"],
    capabilityFlags: ["transport", "query", "retrieval"],
    legacyTraceSuiteFile: retrievalOfStatementsLegacySuiteFile,
    notes: ["proof-slice retrieval pagination containers"],
    steps: [
      {
        request: buildStatementPostRequest(retrievalPagedOlderStatement),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([retrievalPagedOlderStatement.id]),
        },
      },
      {
        request: buildStatementPostRequest(retrievalPagedNewerStatement),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([retrievalPagedNewerStatement.id]),
        },
      },
      {
        request: buildStatementCollectionRequest({
          verb: retrievalPagedVerbId,
          limit: "1",
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            ...buildStatementCollectionExpectations([retrievalPagedNewerStatement.id]),
            {
              path: ["more"],
              equals: retrievalPagedMorePath,
            },
          ],
        },
      },
      {
        request: buildStatementCollectionRequest({
          verb: retrievalPagedVerbId,
          limit: "1",
          offset: "1",
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            ...buildStatementCollectionExpectations([retrievalPagedOlderStatement.id]),
            {
              path: ["more"],
              equals: "",
            },
          ],
        },
      },
    ],
  });

  const retrievalDirectPropertiesCase = requestSequenceCase({
    caseId: "v2.statements.retrieval.direct.statements-and-more-properties",
    title: 'A paginated StatementResult includes both "statements" and "more" properties',
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00113",
        section: "Data 2.5.s2.table1",
        title: 'Paginated StatementResults include both "statements" and "more" properties',
      },
    ],
    tags: ["v2.0.0", "statements", "retrieval", "pagination"],
    capabilityFlags: ["query", "retrieval"],
    legacyTraceSuiteFile: retrievalOfStatementsLegacySuiteFile,
    notes: ["proof-slice retrieval direct properties"],
    steps: [
      {
        request: buildStatementPostRequest(retrievalPagedOlderStatement),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([retrievalPagedOlderStatement.id]),
        },
      },
      {
        request: buildStatementPostRequest(retrievalPagedNewerStatement),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([retrievalPagedNewerStatement.id]),
        },
      },
      {
        request: buildStatementCollectionRequest({
          verb: retrievalPagedVerbId,
          limit: "1",
        }),
        assertion: {
          status: 200,
          jsonPathNotEquals: [
            {
              path: ["statements", "length"],
              equals: undefined,
            },
            {
              path: ["more"],
              equals: undefined,
            },
          ],
        },
      },
    ],
  });

  const retrievalDirectStatementsArrayCase = requestSequenceCase({
    caseId: "v2.statements.retrieval.direct.statements-array-type",
    title: 'A StatementResult exposes a "statements" property that is an array',
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00110",
        section: "Data 2.5.s2.table1.row1",
        title: 'The "statements" property is an array of Statements',
      },
    ],
    tags: ["v2.0.0", "statements", "retrieval"],
    capabilityFlags: ["query", "retrieval"],
    legacyTraceSuiteFile: retrievalOfStatementsLegacySuiteFile,
    notes: ["proof-slice retrieval direct statements array"],
    steps: [
      {
        request: buildStatementPostRequest(retrievalArrayStatement),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([retrievalArrayStatement.id]),
        },
      },
      {
        request: buildStatementPostRequest(retrievalArraySubstatement),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([retrievalArraySubstatement.id]),
        },
      },
      {
        request: buildStatementCollectionRequest({
          verb: retrievalArrayVerbId,
        }),
        assertion: {
          status: 200,
          jsonPathNotEquals: [
            {
              path: ["statements", "length"],
              equals: undefined,
            },
          ],
        },
      },
    ],
  });

  const retrievalDirectAdditionalPageCase = requestSequenceCase({
    caseId: "v2.statements.retrieval.direct.additional-page-container",
    title: "A paginated StatementResult creates a container for each additional page of results",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00114",
        section: "Data 2.5.s2.table1.row1",
        title: "Paginated StatementResults create a container for each additional page",
      },
    ],
    tags: ["v2.0.0", "statements", "retrieval", "pagination"],
    capabilityFlags: ["query", "retrieval"],
    legacyTraceSuiteFile: retrievalOfStatementsLegacySuiteFile,
    notes: ["proof-slice retrieval direct additional page container"],
    steps: [
      {
        request: buildStatementPostRequest(retrievalPagedOlderStatement),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([retrievalPagedOlderStatement.id]),
        },
      },
      {
        request: buildStatementPostRequest(retrievalPagedNewerStatement),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([retrievalPagedNewerStatement.id]),
        },
      },
      {
        request: buildStatementCollectionRequest({
          verb: retrievalPagedVerbId,
          limit: "1",
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["more"],
              equals: retrievalPagedMorePath,
            },
          ],
        },
      },
      {
        request: buildStatementCollectionRequest({
          verb: retrievalPagedVerbId,
          limit: "1",
          offset: "1",
        }),
        assertion: {
          status: 200,
          jsonPathNotEquals: [
            {
              path: ["statements", "length"],
              equals: undefined,
            },
          ],
        },
      },
    ],
  });

  const retrievalDirectMoreEmptyCase = singleRequestCase({
    caseId: "v2.statements.retrieval.direct.more-empty-when-exhausted",
    title: 'The "more" property is empty when the entire result set has been returned',
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00109",
        section: "Data 2.5.s2.table1.row2",
        title: 'The "more" property is empty or absent when all results have been returned',
      },
    ],
    tags: ["v2.0.0", "statements", "retrieval"],
    capabilityFlags: ["query", "retrieval"],
    legacyTraceSuiteFile: retrievalOfStatementsLegacySuiteFile,
    request: buildStatementCollectionRequest({
      verb: "https://example.test/xapi/verbs/retrieval-empty-more",
    }),
    assertion: {
      status: 200,
      jsonPathEquals: [
        {
          path: ["more"],
          equals: "",
        },
      ],
    },
    notes: ["proof-slice retrieval direct more empty"],
  });

  const retrievalDirectMoreRefersCase = requestSequenceCase({
    caseId: "v2.statements.retrieval.direct.more-refers-next-page",
    title: 'A non-empty "more" value refers to the next page of StatementResult results',
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00108",
        section: "Data 2.5.s2.table1.row2",
        title: 'A non-empty "more" IRL refers to the next page of results',
      },
    ],
    tags: ["v2.0.0", "statements", "retrieval", "pagination"],
    capabilityFlags: ["query", "retrieval"],
    legacyTraceSuiteFile: retrievalOfStatementsLegacySuiteFile,
    notes: ["proof-slice retrieval direct more refers next page"],
    steps: [
      {
        request: buildStatementPostRequest(retrievalPagedOlderStatement),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([retrievalPagedOlderStatement.id]),
        },
      },
      {
        request: buildStatementPostRequest(retrievalPagedNewerStatement),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([retrievalPagedNewerStatement.id]),
        },
      },
      {
        request: buildStatementCollectionRequest({
          verb: retrievalPagedVerbId,
          limit: "1",
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["more"],
              equals: retrievalPagedMorePath,
            },
          ],
        },
      },
      {
        request: buildStatementCollectionRequest({
          verb: retrievalPagedVerbId,
          limit: "1",
          offset: "1",
        }),
        assertion: {
          status: 200,
          jsonPathEquals: buildStatementCollectionExpectations([retrievalPagedOlderStatement.id]),
        },
      },
    ],
  });

  const retrievalDirectMoreContainerRulesCase = requestSequenceCase({
    caseId: "v2.statements.retrieval.direct.more-container-rules",
    title: 'A referenced "more" container follows the same StatementResult rules as the original GET',
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00111",
        section: "Data 2.5.s2.table1.row2",
        title: 'A referenced "more" container follows the same StatementResult rules as the original GET',
      },
    ],
    tags: ["v2.0.0", "statements", "retrieval", "pagination"],
    capabilityFlags: ["query", "retrieval"],
    legacyTraceSuiteFile: retrievalOfStatementsLegacySuiteFile,
    notes: ["proof-slice retrieval direct more container rules"],
    steps: [
      {
        request: buildStatementPostRequest(retrievalPagedOlderStatement),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([retrievalPagedOlderStatement.id]),
        },
      },
      {
        request: buildStatementPostRequest(retrievalPagedNewerStatement),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([retrievalPagedNewerStatement.id]),
        },
      },
      {
        request: buildStatementCollectionRequest({
          verb: retrievalPagedVerbId,
          limit: "1",
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["more"],
              equals: retrievalPagedMorePath,
            },
          ],
        },
      },
      {
        request: buildStatementCollectionRequest({
          verb: retrievalPagedVerbId,
          limit: "1",
          offset: "1",
        }),
        assertion: {
          status: 200,
          jsonPathNotEquals: [
            {
              path: ["statements", "length"],
              equals: undefined,
            },
            {
              path: ["more"],
              equals: undefined,
            },
          ],
        },
      },
    ],
  });

  const exactAgentStatement = buildProofStatement(21, [
    {
      operation: "set",
      path: ["actor"],
      value: buildAgentWithMbox("mailto:query-agent-match@example.test"),
    },
  ]);
  const exactAgentNoiseStatement = buildProofStatement(22, [
    {
      operation: "set",
      path: ["actor"],
      value: buildAgentWithMbox("mailto:query-agent-noise@example.test"),
    },
  ]);

  const agentQueryCase = buildStatementCollectionQueryCase({
    caseId: "v2.statements.query.agent",
    title: "The Statements resource returns exact actor matches for an agent query",
    requirementRefs: [
      {
        id: "XAPI-00181",
        section: "Communication 2.1.3.s1.table1.row3",
        title: "GET with agent returns exact agent matches",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "agent"],
    setupStatements: [exactAgentStatement, exactAgentNoiseStatement],
    query: {
      agent: buildAgentQuery("mailto:query-agent-match@example.test"),
    },
    expectedStatementIds: [exactAgentStatement.id],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
  });

  const exactVerbStatement = buildProofStatement(23, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/query-verb-match",
    },
  ]);
  const exactVerbNoiseStatement = buildProofStatement(24, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/query-verb-noise",
    },
  ]);

  const verbQueryCase = buildStatementCollectionQueryCase({
    caseId: "v2.statements.query.verb",
    title: "The Statements resource returns exact verb matches for a verb query",
    requirementRefs: [
      {
        id: "XAPI-00180",
        section: "Communication 2.1.3.s1.table1.row4",
        title: "GET with verb returns exact verb matches",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "verb"],
    setupStatements: [exactVerbStatement, exactVerbNoiseStatement],
    query: {
      verb: "https://example.test/xapi/verbs/query-verb-match",
    },
    expectedStatementIds: [exactVerbStatement.id],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
  });

  const exactActivityStatement = buildProofStatement(25, [
    {
      operation: "set",
      path: ["object"],
      value: buildActivityObjectFixture("https://example.test/xapi/activities/query-activity-match"),
    },
  ]);
  const exactActivityNoiseStatement = buildProofStatement(26, [
    {
      operation: "set",
      path: ["object"],
      value: buildActivityObjectFixture("https://example.test/xapi/activities/query-activity-noise"),
    },
  ]);

  const activityQueryCase = buildStatementCollectionQueryCase({
    caseId: "v2.statements.query.activity",
    title: "The Statements resource returns exact activity matches for an activity query",
    requirementRefs: [
      {
        id: "XAPI-00179",
        section: "Communication 2.1.3.s1.table1.row5",
        title: "GET with activity returns exact activity matches",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "activity"],
    setupStatements: [exactActivityStatement, exactActivityNoiseStatement],
    query: {
      activity: "https://example.test/xapi/activities/query-activity-match",
    },
    expectedStatementIds: [exactActivityStatement.id],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
  });

  const exactRegistrationId = buildProofUuid(901);
  const exactRegistrationNoiseId = buildProofUuid(902);
  const exactRegistrationStatement = buildProofStatement(27, [
    {
      operation: "set",
      path: ["context", "registration"],
      value: exactRegistrationId,
    },
  ]);
  const exactRegistrationNoiseStatement = buildProofStatement(28, [
    {
      operation: "set",
      path: ["context", "registration"],
      value: exactRegistrationNoiseId,
    },
  ]);

  const registrationQueryCase = buildStatementCollectionQueryCase({
    caseId: "v2.statements.query.registration",
    title: "The Statements resource returns exact registration matches for a registration query",
    requirementRefs: [
      {
        id: "XAPI-00178",
        section: "Communication 2.1.3.s1.table1.row6",
        title: "GET with registration returns exact registration matches",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "registration"],
    setupStatements: [exactRegistrationStatement, exactRegistrationNoiseStatement],
    query: {
      registration: exactRegistrationId,
    },
    expectedStatementIds: [exactRegistrationStatement.id],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
  });

  const relatedActivityId = "https://example.test/xapi/activities/query-related-activity";
  const relatedActivityNoiseId = "https://example.test/xapi/activities/query-related-activity-noise";
  const relatedActivityStatement = buildProofStatement(29, [
    {
      operation: "set",
      path: ["context", "contextActivities", "category"],
      value: [buildActivityObjectFixture(relatedActivityId)],
    },
  ]);
  const relatedActivityNoiseStatement = buildProofStatement(30, [
    {
      operation: "set",
      path: ["context", "contextActivities", "category"],
      value: [buildActivityObjectFixture(relatedActivityNoiseId)],
    },
  ]);

  const relatedActivitiesQueryCase = buildStatementCollectionQueryCase({
    caseId: "v2.statements.query.related-activities",
    title: "The Statements resource returns related activity matches from nested Activity objects",
    requirementRefs: [
      {
        id: "XAPI-00177",
        section: "Communication 2.1.3.s1.table1.row7",
        title: "GET with related_activities returns nested activity matches",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "related-activities"],
    setupStatements: [relatedActivityStatement, relatedActivityNoiseStatement],
    query: {
      activity: relatedActivityId,
      related_activities: "true",
    },
    expectedStatementIds: [relatedActivityStatement.id],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
  });

  const relatedAgentMbox = "mailto:query-related-agent@example.test";
  const relatedAgentNoiseMbox = "mailto:query-related-agent-noise@example.test";
  const relatedAgentStatement = buildProofStatement(31, [
    {
      operation: "set",
      path: ["context", "instructor"],
      value: buildAgentWithMbox(relatedAgentMbox),
    },
  ]);
  const relatedAgentNoiseStatement = buildProofStatement(32, [
    {
      operation: "set",
      path: ["context", "instructor"],
      value: buildAgentWithMbox(relatedAgentNoiseMbox),
    },
  ]);

  const relatedAgentsQueryCase = buildStatementCollectionQueryCase({
    caseId: "v2.statements.query.related-agents",
    title: "The Statements resource returns related agent matches from nested actor-like values",
    requirementRefs: [
      {
        id: "XAPI-00176",
        section: "Communication 2.1.3.s1.table1.row8",
        title: "GET with related_agents returns nested agent matches",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "related-agents"],
    setupStatements: [relatedAgentStatement, relatedAgentNoiseStatement],
    query: {
      agent: buildAgentQuery(relatedAgentMbox),
      related_agents: "true",
    },
    expectedStatementIds: [relatedAgentStatement.id],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
  });

  const sinceVerbId = "https://example.test/xapi/verbs/query-since";
  const sinceOlderStatement = buildProofStatement(33, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: sinceVerbId,
    },
  ]);
  const sinceNewerStatement = buildProofStatement(34, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: sinceVerbId,
    },
  ]);

  const sinceQueryCase = buildStatementCollectionQueryCase({
    caseId: "v2.statements.query.since",
    title: "The Statements resource filters collection results to statements stored after the since value",
    requirementRefs: [
      {
        id: "XAPI-00175",
        section: "Communication 2.1.3.s1.table1.row9",
        title: "GET with since returns statements stored after the provided timestamp",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "since"],
    setupStatements: [sinceOlderStatement, sinceNewerStatement],
    query: {
      verb: sinceVerbId,
      since: buildProofTimestamp(33),
    },
    expectedStatementIds: [sinceNewerStatement.id],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
  });

  const untilVerbId = "https://example.test/xapi/verbs/query-until";
  const untilOlderStatement = buildProofStatement(35, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: untilVerbId,
    },
  ]);
  const untilNewerStatement = buildProofStatement(36, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: untilVerbId,
    },
  ]);

  const untilQueryCase = buildStatementCollectionQueryCase({
    caseId: "v2.statements.query.until",
    title: "The Statements resource filters collection results to statements stored at or before the until value",
    requirementRefs: [
      {
        id: "XAPI-00174",
        section: "Communication 2.1.3.s1.table1.row10",
        title: "GET with until returns statements stored at or before the provided timestamp",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "until"],
    setupStatements: [untilOlderStatement, untilNewerStatement],
    query: {
      verb: untilVerbId,
      until: buildProofTimestamp(35),
    },
    expectedStatementIds: [untilOlderStatement.id],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
  });

  const limitVerbId = "https://example.test/xapi/verbs/query-limit";
  const limitOlderStatement = buildProofStatement(37, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: limitVerbId,
    },
  ]);
  const limitNewerStatement = buildProofStatement(38, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: limitVerbId,
    },
  ]);

  const limitQueryCase = buildStatementCollectionQueryCase({
    caseId: "v2.statements.query.limit",
    title: "The Statements resource limits collection results to the requested maximum number of statements",
    requirementRefs: [
      {
        id: "XAPI-00173",
        section: "Communication 2.1.3.s1.table1.row11",
        title: "GET with limit returns no more than the requested number of statements",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "limit"],
    setupStatements: [limitOlderStatement, limitNewerStatement],
    query: {
      verb: limitVerbId,
      limit: "1",
    },
    expectedStatementIds: [limitNewerStatement.id],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
  });

  const ascendingVerbId = "https://example.test/xapi/verbs/query-ascending";
  const ascendingOlderStatement = buildProofStatement(39, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: ascendingVerbId,
    },
  ]);
  const ascendingNewerStatement = buildProofStatement(40, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: ascendingVerbId,
    },
  ]);

  const ascendingQueryCase = buildStatementCollectionQueryCase({
    caseId: "v2.statements.query.ascending",
    title: "The Statements resource orders collection results by stored time when ascending is true",
    requirementRefs: [
      {
        id: "XAPI-00166",
        section: "Communication 2.1.3.s1.table1.row14",
        title: "GET with ascending returns results in ascending stored order",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "ascending"],
    setupStatements: [ascendingOlderStatement, ascendingNewerStatement],
    query: {
      verb: ascendingVerbId,
      ascending: "true",
    },
    expectedStatementIds: [ascendingOlderStatement.id, ascendingNewerStatement.id],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
  });

  const filteringCriterionRequirementRef: RequirementRef = {
    id: "XAPI-00164",
    section: "Communication 2.1.3.s1",
    title:
      'The statements within the "statements" property correspond to the filtering criterion sent in the GET request',
  };

  const filteringCriterionVariants = [
    {
      caseId: "v2.statements.query.filtering.agent",
      title: 'The Statements Resource returns only statements matching the "agent" filtering criterion',
      tags: ["v2.0.0", "statements", "query", "filtering", "agent"],
      setupStatements: [exactAgentStatement, exactAgentNoiseStatement],
      query: {
        agent: buildAgentQuery("mailto:query-agent-match@example.test"),
      },
      expectedStatementIds: [exactAgentStatement.id],
      notes: ["proof-slice statement filtering criterion agent"],
    },
    {
      caseId: "v2.statements.query.filtering.verb",
      title: 'The Statements Resource returns only statements matching the "verb" filtering criterion',
      tags: ["v2.0.0", "statements", "query", "filtering", "verb"],
      setupStatements: [exactVerbStatement, exactVerbNoiseStatement],
      query: {
        verb: "https://example.test/xapi/verbs/query-verb-match",
      },
      expectedStatementIds: [exactVerbStatement.id],
      notes: ["proof-slice statement filtering criterion verb"],
    },
    {
      caseId: "v2.statements.query.filtering.activity",
      title: 'The Statements Resource returns only statements matching the "activity" filtering criterion',
      tags: ["v2.0.0", "statements", "query", "filtering", "activity"],
      setupStatements: [exactActivityStatement, exactActivityNoiseStatement],
      query: {
        activity: "https://example.test/xapi/activities/query-activity-match",
      },
      expectedStatementIds: [exactActivityStatement.id],
      notes: ["proof-slice statement filtering criterion activity"],
    },
    {
      caseId: "v2.statements.query.filtering.registration",
      title: 'The Statements Resource returns only statements matching the "registration" filtering criterion',
      tags: ["v2.0.0", "statements", "query", "filtering", "registration"],
      setupStatements: [exactRegistrationStatement, exactRegistrationNoiseStatement],
      query: {
        registration: exactRegistrationId,
      },
      expectedStatementIds: [exactRegistrationStatement.id],
      notes: ["proof-slice statement filtering criterion registration"],
    },
    {
      caseId: "v2.statements.query.filtering.related-activities",
      title: 'The Statements Resource returns only statements matching the "related_activities" filtering criterion',
      tags: ["v2.0.0", "statements", "query", "filtering", "related-activities"],
      setupStatements: [relatedActivityStatement, relatedActivityNoiseStatement],
      query: {
        activity: relatedActivityId,
        related_activities: "true",
      },
      expectedStatementIds: [relatedActivityStatement.id],
      notes: ["proof-slice statement filtering criterion related activities"],
    },
    {
      caseId: "v2.statements.query.filtering.related-agents",
      title: 'The Statements Resource returns only statements matching the "related_agents" filtering criterion',
      tags: ["v2.0.0", "statements", "query", "filtering", "related-agents"],
      setupStatements: [relatedAgentStatement, relatedAgentNoiseStatement],
      query: {
        agent: buildAgentQuery(relatedAgentMbox),
        related_agents: "true",
      },
      expectedStatementIds: [relatedAgentStatement.id],
      notes: ["proof-slice statement filtering criterion related agents"],
    },
    {
      caseId: "v2.statements.query.filtering.since",
      title: 'The Statements Resource returns only statements matching the "since" filtering criterion',
      tags: ["v2.0.0", "statements", "query", "filtering", "since"],
      setupStatements: [sinceOlderStatement, sinceNewerStatement],
      query: {
        verb: sinceVerbId,
        since: buildProofTimestamp(33),
      },
      expectedStatementIds: [sinceNewerStatement.id],
      notes: ["proof-slice statement filtering criterion since"],
    },
    {
      caseId: "v2.statements.query.filtering.until",
      title: 'The Statements Resource returns only statements matching the "until" filtering criterion',
      tags: ["v2.0.0", "statements", "query", "filtering", "until"],
      setupStatements: [untilOlderStatement, untilNewerStatement],
      query: {
        verb: untilVerbId,
        until: buildProofTimestamp(35),
      },
      expectedStatementIds: [untilOlderStatement.id],
      notes: ["proof-slice statement filtering criterion until"],
    },
    {
      caseId: "v2.statements.query.filtering.limit",
      title:
        'The Statements Resource returns only the number of statements requested by the "limit" filtering criterion',
      tags: ["v2.0.0", "statements", "query", "filtering", "limit"],
      setupStatements: [limitOlderStatement, limitNewerStatement],
      query: {
        verb: limitVerbId,
        limit: "1",
      },
      expectedStatementIds: [limitNewerStatement.id],
      notes: ["proof-slice statement filtering criterion limit"],
    },
    {
      caseId: "v2.statements.query.filtering.ascending",
      title:
        'The Statements Resource returns statements in ascending stored order when using the "ascending" filtering criterion',
      tags: ["v2.0.0", "statements", "query", "filtering", "ascending"],
      setupStatements: [ascendingOlderStatement, ascendingNewerStatement],
      query: {
        verb: ascendingVerbId,
        ascending: "true",
      },
      expectedStatementIds: [ascendingOlderStatement.id, ascendingNewerStatement.id],
      notes: ["proof-slice statement filtering criterion ascending"],
    },
    {
      caseId: "v2.statements.query.filtering.format",
      title:
        'The Statements Resource still applies the filtering criterion when GET requests include the "format" parameter',
      tags: ["v2.0.0", "statements", "query", "filtering", "format"],
      setupStatements: [exactVerbStatement, exactVerbNoiseStatement],
      query: {
        verb: "https://example.test/xapi/verbs/query-verb-match",
        format: "ids",
      },
      expectedStatementIds: [exactVerbStatement.id],
      notes: ["proof-slice statement filtering criterion format"],
    },
  ] satisfies Array<{
    caseId: string;
    title: string;
    tags: string[];
    setupStatements: StatementFixture[];
    query: Record<string, string>;
    expectedStatementIds: string[];
    notes: string[];
  }>;

  const filteringCriterionCases = filteringCriterionVariants.map((variant) =>
    buildStatementCollectionQueryCase({
      caseId: variant.caseId,
      title: variant.title,
      requirementRefs: [filteringCriterionRequirementRef],
      tags: variant.tags,
      setupStatements: variant.setupStatements,
      query: buildQueryRecord(variant.query),
      expectedStatementIds: variant.expectedStatementIds,
      legacyTraceSuiteFile: statementResourceLegacySuiteFile,
      notes: variant.notes,
    }),
  );

  const statementIdExclusivityCases = buildStatementQueryExclusivityCases({
    familyId: "v2.statements.query.exclusive.statement-id",
    baseQueryKey: "statementId",
    baseQueryValue: buildProofUuid(950),
    requirementRef: {
      id: "XAPI-00151",
      section: "Communication 2.1.3.s2.b2",
      title: "GET rejects statementId combined with collection query parameters",
    },
  });

  const voidedStatementIdExclusivityCases = buildStatementQueryExclusivityCases({
    familyId: "v2.statements.query.exclusive.voided-statement-id",
    baseQueryKey: "voidedStatementId",
    baseQueryValue: buildProofUuid(951),
    requirementRef: {
      id: "XAPI-00150",
      section: "Communication 2.1.3.s2.b2",
      title: "GET rejects voidedStatementId combined with collection query parameters",
    },
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
    transforms: [
      {
        operation: "set",
        path: ["id"],
        value: buildProofUuid(208),
      },
    ],
  });

  const statementEndpointGetCase = singleRequestCase({
    caseId: "v2.statements.query.endpoint.get",
    title: "The Statements Resource exists at /statements and accepts GET requests",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00139",
        section: "Communication 2.1",
        title: "The Statements Resource exists at /statements",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "endpoint"],
    capabilityFlags: ["query", "retrieval"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    request: buildStatementCollectionRequest({
      verb: "https://example.test/xapi/verbs/statement-endpoint-get",
    }),
    assertion: {
      status: 200,
    },
    notes: ["proof-slice statement endpoint get exists"],
  });

  const statementGetAcceptedCase = singleRequestCase({
    caseId: "v2.statements.query.get-accepted",
    title: "The Statements Resource accepts GET requests",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00159",
        section: "Communication 2.1.3.s1",
        title: "The Statements Resource accepts GET requests",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "retrieval"],
    capabilityFlags: ["query", "retrieval"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    request: buildStatementCollectionRequest({
      verb: "https://example.test/xapi/verbs/statement-get-accepted",
    }),
    assertion: {
      status: 200,
    },
    notes: ["proof-slice statement get accepted"],
  });

  const statementResultCollectionCase = singleRequestCase({
    caseId: "v2.statements.query.collection-statement-result",
    title:
      "The Statements Resource returns a StatementResult when neither statementId nor voidedStatementId is provided",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00154",
        section: "Communication 2.1.3.s1",
        title: "GET without statementId or voidedStatementId returns a StatementResult",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "retrieval"],
    capabilityFlags: ["query", "retrieval"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    request: buildStatementCollectionRequest({
      verb: "https://example.test/xapi/verbs/statement-result-empty",
    }),
    assertion: {
      status: 200,
      jsonPathEquals: [
        {
          path: ["statements"],
          equals: [],
        },
      ],
    },
    notes: ["proof-slice statement result collection"],
  });

  const statementIdAcceptedStatement = buildProofStatement(1205, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/statement-id-accepted",
    },
  ]);
  const statementIdReturnedStatement = buildProofStatement(1206, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/statement-id-returned",
    },
  ]);
  const voidedStatementIdAcceptedTargetStatement = buildProofStatement(1207, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/voided-statement-id-accepted-target",
    },
  ]);
  const voidedStatementIdAcceptedVoidingStatement = buildProofStatement(1208, [
    {
      operation: "set",
      path: ["verb"],
      value: buildVerbFixture("http://adlnet.gov/expapi/verbs/voided", "voided"),
    },
    {
      operation: "set",
      path: ["object"],
      value: {
        objectType: "StatementRef",
        id: voidedStatementIdAcceptedTargetStatement.id,
      },
    },
  ]);
  const statementIdFormatAllowedStatement = buildProofStatement(1209, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/statement-id-format-allowed",
    },
  ]);
  const statementIdAttachmentsAllowedStatement = buildProofStatement(1210, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/statement-id-attachments-allowed",
    },
  ]);
  const voidedStatementIdFormatAllowedTargetStatement = buildProofStatement(1211, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/voided-statement-id-format-target",
    },
  ]);
  const voidedStatementIdFormatAllowedVoidingStatement = buildProofStatement(1212, [
    {
      operation: "set",
      path: ["verb"],
      value: buildVerbFixture("http://adlnet.gov/expapi/verbs/voided", "voided"),
    },
    {
      operation: "set",
      path: ["object"],
      value: {
        objectType: "StatementRef",
        id: voidedStatementIdFormatAllowedTargetStatement.id,
      },
    },
  ]);
  const voidedStatementIdAttachmentsAllowedTargetStatement = buildProofStatement(1213, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/voided-statement-id-attachments-target",
    },
  ]);
  const voidedStatementIdAttachmentsAllowedVoidingStatement = buildProofStatement(1214, [
    {
      operation: "set",
      path: ["verb"],
      value: buildVerbFixture("http://adlnet.gov/expapi/verbs/voided", "voided"),
    },
    {
      operation: "set",
      path: ["object"],
      value: {
        objectType: "StatementRef",
        id: voidedStatementIdAttachmentsAllowedTargetStatement.id,
      },
    },
  ]);

  const statementIdAcceptedCase = requestSequenceCase({
    caseId: "v2.statements.query.statement-id-accepted",
    title: "The Statements Resource can process a GET request with statementId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00158",
        section: "Communication 2.1.3.s1.table1.row1",
        title: "The Statements Resource can process GET requests with statementId",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "statementId"],
    capabilityFlags: ["query", "retrieval"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice statementId accepted"],
    steps: [
      {
        request: buildStatementPostRequest(statementIdAcceptedStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementGetRequest(statementIdAcceptedStatement.id),
        assertion: {
          status: 200,
        },
      },
    ],
  });

  const statementIdReturnedCase = requestSequenceCase({
    caseId: "v2.statements.query.statement-id-single-statement",
    title: "The Statements Resource returns a single Statement for a successful statementId lookup",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00156",
        section: "Communication 2.1.3.s1",
        title: "GET with statementId returns the corresponding Statement",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "statementId"],
    capabilityFlags: ["query", "retrieval"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice statementId returns matching statement"],
    steps: [
      {
        request: buildStatementPostRequest(statementIdReturnedStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementGetRequest(statementIdReturnedStatement.id),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["id"],
              equals: statementIdReturnedStatement.id,
            },
          ],
        },
      },
    ],
  });

  const voidedStatementIdAcceptedCase = requestSequenceCase({
    caseId: "v2.statements.query.voided-statement-id-accepted",
    title: "The Statements Resource can process a GET request with voidedStatementId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00157",
        section: "Communication 2.1.3.s1.table1.row2",
        title: "The Statements Resource can process GET requests with voidedStatementId",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "voidedStatementId"],
    capabilityFlags: ["query", "retrieval", "voiding"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice voidedStatementId accepted"],
    steps: [
      {
        request: buildStatementPostRequest(voidedStatementIdAcceptedTargetStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementPostRequest(voidedStatementIdAcceptedVoidingStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildVoidedStatementGetRequest(voidedStatementIdAcceptedTargetStatement.id),
        assertion: {
          status: 200,
        },
      },
    ],
  });

  const statementIdFormatAllowedCase = requestSequenceCase({
    caseId: "v2.statements.query.statement-id-with-format-allowed",
    title: "The Statements Resource allows statementId to be combined with format",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00151",
        section: "Communication 2.1.3.s2.b2",
        title: "statementId may be combined with format on GET requests",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "statementId", "format"],
    capabilityFlags: ["query", "retrieval", "format"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice statementId format allowed"],
    steps: [
      {
        request: buildStatementPostRequest(statementIdFormatAllowedStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementCollectionRequest({
          statementId: statementIdFormatAllowedStatement.id,
          format: "ids",
        }),
        assertion: {
          status: 200,
        },
      },
    ],
  });

  const statementIdAttachmentsAllowedCase = requestSequenceCase({
    caseId: "v2.statements.query.statement-id-with-attachments-allowed",
    title: "The Statements Resource allows statementId to be combined with attachments",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00151",
        section: "Communication 2.1.3.s2.b2",
        title: "statementId may be combined with attachments on GET requests",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "statementId", "attachments"],
    capabilityFlags: ["query", "retrieval", "attachments"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice statementId attachments allowed"],
    steps: [
      {
        request: buildStatementPostRequest(statementIdAttachmentsAllowedStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementCollectionRequest({
          statementId: statementIdAttachmentsAllowedStatement.id,
          attachments: "true",
        }),
        assertion: {
          status: 200,
        },
      },
    ],
  });

  const voidedStatementIdFormatAllowedCase = requestSequenceCase({
    caseId: "v2.statements.query.voided-statement-id-with-format-allowed",
    title: "The Statements Resource allows voidedStatementId to be combined with format",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00150",
        section: "Communication 2.1.3.s2.b2",
        title: "voidedStatementId may be combined with format on GET requests",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "voidedStatementId", "format"],
    capabilityFlags: ["query", "retrieval", "format", "voiding"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice voidedStatementId format allowed"],
    steps: [
      {
        request: buildStatementPostRequest(voidedStatementIdFormatAllowedTargetStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementPostRequest(voidedStatementIdFormatAllowedVoidingStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementCollectionRequest({
          voidedStatementId: voidedStatementIdFormatAllowedTargetStatement.id,
          format: "ids",
        }),
        assertion: {
          status: 200,
        },
      },
    ],
  });

  const voidedStatementIdAttachmentsAllowedCase = requestSequenceCase({
    caseId: "v2.statements.query.voided-statement-id-with-attachments-allowed",
    title: "The Statements Resource allows voidedStatementId to be combined with attachments",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00150",
        section: "Communication 2.1.3.s2.b2",
        title: "voidedStatementId may be combined with attachments on GET requests",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "voidedStatementId", "attachments"],
    capabilityFlags: ["query", "retrieval", "attachments", "voiding"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice voidedStatementId attachments allowed"],
    steps: [
      {
        request: buildStatementPostRequest(voidedStatementIdAttachmentsAllowedTargetStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementPostRequest(voidedStatementIdAttachmentsAllowedVoidingStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementCollectionRequest({
          voidedStatementId: voidedStatementIdAttachmentsAllowedTargetStatement.id,
          attachments: "true",
        }),
        assertion: {
          status: 200,
        },
      },
    ],
  });

  const statementResultRequirementRef: RequirementRef = {
    id: "XAPI-00154",
    section: "Communication 2.1.3.s1",
    title: "GET without statementId or voidedStatementId returns a StatementResult",
  };

  const statementResultVariants = [
    {
      caseId: "v2.statements.query.statement-result.direct.base",
      title:
        'The Statements Resource returns a StatementResult for GET requests without "statementId" or "voidedStatementId"',
      query: {},
    },
    {
      caseId: "v2.statements.query.statement-result.direct.agent",
      title: 'The Statements Resource returns a StatementResult for GET requests with "agent"',
      query: {
        agent: buildAgentQuery("mailto:statement-result-agent@example.test"),
      },
    },
    {
      caseId: "v2.statements.query.statement-result.direct.verb",
      title: 'The Statements Resource returns a StatementResult for GET requests with "verb"',
      query: {
        verb: "https://example.test/xapi/verbs/statement-result-verb",
      },
    },
    {
      caseId: "v2.statements.query.statement-result.direct.activity",
      title: 'The Statements Resource returns a StatementResult for GET requests with "activity"',
      query: {
        activity: "https://example.test/xapi/activities/statement-result-activity",
      },
    },
    {
      caseId: "v2.statements.query.statement-result.direct.registration",
      title: 'The Statements Resource returns a StatementResult for GET requests with "registration"',
      query: {
        registration: buildProofUuid(1225),
      },
    },
    {
      caseId: "v2.statements.query.statement-result.direct.related-activities",
      title: 'The Statements Resource returns a StatementResult for GET requests with "related_activities"',
      query: {
        activity: "https://example.test/xapi/activities/statement-result-related-activity",
        related_activities: "true",
      },
    },
    {
      caseId: "v2.statements.query.statement-result.direct.related-agents",
      title: 'The Statements Resource returns a StatementResult for GET requests with "related_agents"',
      query: {
        agent: buildAgentQuery("mailto:statement-result-related-agent@example.test"),
        related_agents: "true",
      },
    },
    {
      caseId: "v2.statements.query.statement-result.direct.since",
      title: 'The Statements Resource returns a StatementResult for GET requests with "since"',
      query: {
        since: buildProofTimestamp(24),
      },
    },
    {
      caseId: "v2.statements.query.statement-result.direct.until",
      title: 'The Statements Resource returns a StatementResult for GET requests with "until"',
      query: {
        until: buildProofTimestamp(25),
      },
    },
    {
      caseId: "v2.statements.query.statement-result.direct.limit",
      title: 'The Statements Resource returns a StatementResult for GET requests with "limit"',
      query: {
        limit: "1",
      },
    },
    {
      caseId: "v2.statements.query.statement-result.direct.ascending",
      title: 'The Statements Resource returns a StatementResult for GET requests with "ascending"',
      query: {
        ascending: "true",
      },
    },
    {
      caseId: "v2.statements.query.statement-result.direct.format",
      title: 'The Statements Resource returns a StatementResult for GET requests with "format"',
      query: {
        format: "ids",
      },
    },
  ] satisfies Array<{
    caseId: string;
    title: string;
    query: Record<string, string>;
  }>;

  const statementResultVariantCases = statementResultVariants.map((variant) =>
    buildStatementCollectionTextCase({
      caseId: variant.caseId,
      title: variant.title,
      requirementRefs: [statementResultRequirementRef],
      tags: ["v2.0.0", "statements", "query", "statement-result"],
      capabilityFlags: ["query", "retrieval"],
      query: buildQueryRecord(variant.query),
      legacyTraceSuiteFile: statementResourceLegacySuiteFile,
      notes: ["proof-slice statement result direct trace"],
    }),
  );

  const statementQueryAcceptanceVariants = [
    {
      caseId: "v2.statements.query.accepts.agent",
      title: 'The Statements Resource can process GET requests with "agent"',
      query: {
        agent: buildAgentQuery("mailto:query-accepts-agent@example.test"),
      },
      requirementRef: {
        id: "XAPI-00181",
        section: "Communication 2.1.3.s1.table1.row3",
        title: "The Statements Resource can process GET requests with agent",
      },
    },
    {
      caseId: "v2.statements.query.accepts.verb",
      title: 'The Statements Resource can process GET requests with "verb"',
      query: {
        verb: "https://example.test/xapi/verbs/query-accepts-verb",
      },
      requirementRef: {
        id: "XAPI-00180",
        section: "Communication 2.1.3.s1.table1.row4",
        title: "The Statements Resource can process GET requests with verb",
      },
    },
    {
      caseId: "v2.statements.query.accepts.activity",
      title: 'The Statements Resource can process GET requests with "activity"',
      query: {
        activity: "https://example.test/xapi/activities/query-accepts-activity",
      },
      requirementRef: {
        id: "XAPI-00179",
        section: "Communication 2.1.3.s1.table1.row5",
        title: "The Statements Resource can process GET requests with activity",
      },
    },
    {
      caseId: "v2.statements.query.accepts.registration",
      title: 'The Statements Resource can process GET requests with "registration"',
      query: {
        registration: buildProofUuid(1226),
      },
      requirementRef: {
        id: "XAPI-00178",
        section: "Communication 2.1.3.s1.table1.row6",
        title: "The Statements Resource can process GET requests with registration",
      },
    },
    {
      caseId: "v2.statements.query.accepts.related-activities",
      title: 'The Statements Resource can process GET requests with "related_activities"',
      query: {
        activity: "https://example.test/xapi/activities/query-accepts-related-activity",
        related_activities: "true",
      },
      requirementRef: {
        id: "XAPI-00177",
        section: "Communication 2.1.3.s1.table1.row7",
        title: "The Statements Resource can process GET requests with related_activities",
      },
    },
    {
      caseId: "v2.statements.query.accepts.related-agents",
      title: 'The Statements Resource can process GET requests with "related_agents"',
      query: {
        agent: buildAgentQuery("mailto:query-accepts-related-agent@example.test"),
        related_agents: "true",
      },
      requirementRef: {
        id: "XAPI-00176",
        section: "Communication 2.1.3.s1.table1.row8",
        title: "The Statements Resource can process GET requests with related_agents",
      },
    },
    {
      caseId: "v2.statements.query.accepts.since",
      title: 'The Statements Resource can process GET requests with "since"',
      query: {
        since: buildProofTimestamp(26),
      },
      requirementRef: {
        id: "XAPI-00175",
        section: "Communication 2.1.3.s1.table1.row9",
        title: "The Statements Resource can process GET requests with since",
      },
    },
    {
      caseId: "v2.statements.query.accepts.until",
      title: 'The Statements Resource can process GET requests with "until"',
      query: {
        until: buildProofTimestamp(27),
      },
      requirementRef: {
        id: "XAPI-00174",
        section: "Communication 2.1.3.s1.table1.row10",
        title: "The Statements Resource can process GET requests with until",
      },
    },
    {
      caseId: "v2.statements.query.accepts.limit",
      title: 'The Statements Resource can process GET requests with "limit"',
      query: {
        limit: "1",
      },
      requirementRef: {
        id: "XAPI-00173",
        section: "Communication 2.1.3.s1.table1.row11",
        title: "The Statements Resource can process GET requests with limit",
      },
    },
    {
      caseId: "v2.statements.query.accepts.format",
      title: 'The Statements Resource can process GET requests with "format"',
      query: {
        format: "ids",
      },
      requirementRef: {
        id: "XAPI-00168",
        section: "Communication 2.1.3.s1.table1.row12",
        title: "The Statements Resource can process GET requests with format",
      },
    },
    {
      caseId: "v2.statements.query.accepts.attachments",
      title: 'The Statements Resource can process GET requests with "attachments"',
      query: {
        attachments: "true",
      },
      requirementRef: {
        id: "XAPI-00167",
        section: "Communication 2.1.3.s1.table1.row13",
        title: "The Statements Resource can process GET requests with attachments",
      },
    },
    {
      caseId: "v2.statements.query.accepts.ascending",
      title: 'The Statements Resource can process GET requests with "ascending"',
      query: {
        ascending: "true",
      },
      requirementRef: {
        id: "XAPI-00166",
        section: "Communication 2.1.3.s1.table1.row14",
        title: "The Statements Resource can process GET requests with ascending",
      },
    },
  ] satisfies Array<{
    caseId: string;
    title: string;
    query: Record<string, string>;
    requirementRef: RequirementRef;
  }>;

  const statementQueryAcceptanceCases = statementQueryAcceptanceVariants.map((variant) =>
    buildStatementCollectionTextCase({
      caseId: variant.caseId,
      title: variant.title,
      requirementRefs: [variant.requirementRef],
      tags: ["v2.0.0", "statements", "query", "acceptance"],
      capabilityFlags: ["query", "retrieval"],
      query: buildQueryRecord(variant.query),
      legacyTraceSuiteFile: statementResourceLegacySuiteFile,
      notes: ["proof-slice statement query acceptance direct trace"],
    }),
  );

  function buildVoidedTargetRetentionCase(options: {
    caseId: string;
    title: string;
    sequenceBase: number;
    query: (agentQuery: string) => Record<string, string>;
    expectedStatementIds: string[];
    notes: string[];
  }): CaseDefinition {
    const actorMbox = `mailto:voided-target-${options.sequenceBase}@example.test`;
    const actor = buildAgentWithMbox(actorMbox);
    const voidedStatement = buildProofStatement(options.sequenceBase, [
      {
        operation: "set",
        path: ["actor"],
        value: actor,
      },
      {
        operation: "set",
        path: ["verb", "id"],
        value: `https://example.test/xapi/verbs/voided-target-${options.sequenceBase}`,
      },
    ]);
    const voidingStatement = buildProofStatement(options.sequenceBase + 1, [
      {
        operation: "set",
        path: ["actor"],
        value: actor,
      },
      {
        operation: "set",
        path: ["verb"],
        value: buildVerbFixture("http://adlnet.gov/expapi/verbs/voided", "voided"),
      },
      {
        operation: "set",
        path: ["object"],
        value: {
          objectType: "StatementRef",
          id: voidedStatement.id,
        },
      },
    ]);
    const statementRefStatement = buildProofStatement(options.sequenceBase + 2, [
      {
        operation: "set",
        path: ["actor"],
        value: actor,
      },
      {
        operation: "set",
        path: ["verb", "id"],
        value: `https://example.test/xapi/verbs/voided-target-ref-${options.sequenceBase}`,
      },
      {
        operation: "set",
        path: ["object"],
        value: {
          objectType: "StatementRef",
          id: voidedStatement.id,
        },
      },
    ]);
    const agentQuery = buildAgentQuery(actorMbox);

    return requestSequenceCase({
      caseId: options.caseId,
      title: options.title,
      specVersion,
      requirementRefs: [
        {
          id: "XAPI-00162",
          section: "Communication 2.1.4.s1.b2",
          title:
            "Collection GETs return statements targeting a voided statement without returning the voided statement itself",
        },
      ],
      tags: ["v2.0.0", "statements", "query", "voiding", "retrieval"],
      capabilityFlags: ["query", "retrieval", "voiding"],
      legacyTraceSuiteFile: statementResourceLegacySuiteFile,
      notes: options.notes,
      steps: [
        {
          request: buildStatementPostRequest(voidedStatement),
          assertion: {
            status: 200,
            jsonPathEquals: listEquals([voidedStatement.id]),
          },
        },
        {
          request: buildStatementPostRequest(voidingStatement),
          assertion: {
            status: 200,
            jsonPathEquals: listEquals([voidingStatement.id]),
          },
        },
        {
          request: buildStatementPostRequest(statementRefStatement),
          assertion: {
            status: 200,
            jsonPathEquals: listEquals([statementRefStatement.id]),
          },
        },
        {
          request: buildStatementCollectionRequest(options.query(agentQuery)),
          assertion: {
            status: 200,
            jsonPathEquals: buildStatementCollectionExpectations(options.expectedStatementIds),
          },
        },
      ],
    });
  }

  const voidedTargetRetentionCases = [
    buildVoidedTargetRetentionCase({
      caseId: "v2.statements.query.voided-targets-retained.since",
      title:
        'The Statements Resource returns statements targeting a voided statement when using a qualifying "since" filter',
      sequenceBase: 1240,
      query: (agentQuery) => ({
        agent: agentQuery,
        since: buildProofTimestamp(1240),
      }),
      expectedStatementIds: [buildProofUuid(1242), buildProofUuid(1241)],
      notes: ["proof-slice voided target retrieval since"],
    }),
    buildVoidedTargetRetentionCase({
      caseId: "v2.statements.query.voided-targets-retained.until",
      title:
        'The Statements Resource returns statements targeting a voided statement when using a qualifying "until" filter',
      sequenceBase: 1243,
      query: (agentQuery) => ({
        agent: agentQuery,
        until: buildProofTimestamp(1245),
      }),
      expectedStatementIds: [buildProofUuid(1245), buildProofUuid(1244)],
      notes: ["proof-slice voided target retrieval until"],
    }),
    buildVoidedTargetRetentionCase({
      caseId: "v2.statements.query.voided-targets-retained.limit",
      title:
        "The Statements Resource returns only the newest statement targeting a voided statement when using a limiting filter",
      sequenceBase: 1246,
      query: (agentQuery) => ({
        agent: agentQuery,
        limit: "1",
      }),
      expectedStatementIds: [buildProofUuid(1248)],
      notes: ["proof-slice voided target retrieval limit"],
    }),
    buildVoidedTargetRetentionCase({
      caseId: "v2.statements.query.voided-targets-retained.base",
      title:
        "The Statements Resource returns statements targeting a voided statement even without additional range filters",
      sequenceBase: 1249,
      query: (agentQuery) => ({
        agent: agentQuery,
      }),
      expectedStatementIds: [buildProofUuid(1251), buildProofUuid(1250)],
      notes: ["proof-slice voided target retrieval base"],
    }),
  ];

  const collectionFormatAbsentVerbId = "https://example.test/xapi/verbs/collection-format-absent";
  const collectionFormatAbsentActivityId = "https://example.test/xapi/activities/collection-format-absent";
  const collectionFormatAbsentStatement = buildFormatProofStatement(
    1252,
    "mailto:collection-format-absent@example.test",
  );
  collectionFormatAbsentStatement.verb.id = collectionFormatAbsentVerbId;
  collectionFormatAbsentStatement.object.id = collectionFormatAbsentActivityId;

  const collectionFormatCanonicalVerbId = "https://example.test/xapi/verbs/collection-format-canonical";
  const collectionFormatCanonicalActivityId = "https://example.test/xapi/activities/collection-format-canonical";
  const collectionFormatCanonicalStatement = buildFormatProofStatement(
    1253,
    "mailto:collection-format-canonical@example.test",
  );
  collectionFormatCanonicalStatement.verb.id = collectionFormatCanonicalVerbId;
  collectionFormatCanonicalStatement.object.id = collectionFormatCanonicalActivityId;

  const collectionFormatExactVerbId = "https://example.test/xapi/verbs/collection-format-exact";
  const collectionFormatExactActivityId = "https://example.test/xapi/activities/collection-format-exact";
  const collectionFormatExactStatement = buildFormatProofStatement(1254, "mailto:collection-format-exact@example.test");
  collectionFormatExactStatement.verb.id = collectionFormatExactVerbId;
  collectionFormatExactStatement.object.id = collectionFormatExactActivityId;

  const collectionFormatIdsVerbId = "https://example.test/xapi/verbs/collection-format-ids";
  const collectionFormatIdsActivityId = "https://example.test/xapi/activities/collection-format-ids";
  const collectionFormatIdsStatement = buildFormatProofStatement(1255, "mailto:collection-format-ids@example.test");
  collectionFormatIdsStatement.verb.id = collectionFormatIdsVerbId;
  collectionFormatIdsStatement.object.id = collectionFormatIdsActivityId;

  const collectionFormatAbsentCase = requestSequenceCase({
    caseId: "v2.statements.representation.collection-format-absent",
    title: "The Statements Resource returns exact collection data when format is absent",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00168",
        section: "Communication 2.1.3.s1.table1.row12",
        title: "Collection GET defaults to exact when format is absent",
      },
    ],
    tags: ["v2.0.0", "statements", "representation", "format"],
    capabilityFlags: ["query", "retrieval", "format"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice collection format absent direct trace"],
    steps: [
      {
        request: buildStatementPostRequest(collectionFormatAbsentStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementCollectionRequest({
          verb: collectionFormatAbsentVerbId,
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            ...buildStatementCollectionExpectations([collectionFormatAbsentStatement.id]),
            {
              path: ["statements", "0", "verb", "display"],
              equals: formatProofDisplay,
            },
            {
              path: ["statements", "0", "object", "definition", "name"],
              equals: formatProofName,
            },
          ],
        },
      },
    ],
  });

  const collectionFormatCanonicalCase = requestSequenceCase({
    caseId: "v2.statements.representation.collection-format-canonical",
    title: "The Statements Resource returns canonical collection data when format is canonical",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00169",
        section: "Communication 2.1.3.s1.table1.row12",
        title: "Collection GET canonical format returns a single language per localized field",
      },
    ],
    tags: ["v2.0.0", "statements", "representation", "format"],
    capabilityFlags: ["query", "retrieval", "format"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice collection format canonical direct trace"],
    steps: [
      {
        request: buildStatementPostRequest(collectionFormatCanonicalStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementCollectionRequest(
          {
            verb: collectionFormatCanonicalVerbId,
            format: "canonical",
          },
          {
            "Accept-Language": "en-GB",
          },
        ),
        assertion: {
          status: 200,
          jsonPathEquals: [
            ...buildStatementCollectionExpectations([collectionFormatCanonicalStatement.id]),
            {
              path: ["statements", "0", "verb", "display"],
              equals: {
                "en-GB": "format-proof-gb",
              },
            },
            {
              path: ["statements", "0", "object", "definition", "name"],
              equals: {
                "en-GB": "Format Proof GB",
              },
            },
            {
              path: ["statements", "0", "object", "definition", "description"],
              equals: {
                "en-GB": "Format description GB",
              },
            },
          ],
        },
      },
    ],
  });

  const collectionFormatExactCase = requestSequenceCase({
    caseId: "v2.statements.representation.collection-format-exact",
    title: "The Statements Resource returns exact collection data when format is exact",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00170",
        section: "Communication 2.1.3.s1.table1.row12",
        title: "Collection GET exact format preserves full localized values",
      },
    ],
    tags: ["v2.0.0", "statements", "representation", "format"],
    capabilityFlags: ["query", "retrieval", "format"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice collection format exact direct trace"],
    steps: [
      {
        request: buildStatementPostRequest(collectionFormatExactStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementCollectionRequest({
          verb: collectionFormatExactVerbId,
          format: "exact",
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            ...buildStatementCollectionExpectations([collectionFormatExactStatement.id]),
            {
              path: ["statements", "0", "verb", "display"],
              equals: formatProofDisplay,
            },
            {
              path: ["statements", "0", "object", "definition", "description"],
              equals: formatProofDescription,
            },
          ],
        },
      },
    ],
  });

  const collectionFormatIdsCase = requestSequenceCase({
    caseId: "v2.statements.representation.collection-format-ids",
    title: "The Statements Resource returns identifier-only collection data when format is ids",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00171",
        section: "Communication 2.1.3.s1.table1.row12",
        title: "Collection GET ids format returns identifier-only representations",
      },
    ],
    tags: ["v2.0.0", "statements", "representation", "format"],
    capabilityFlags: ["query", "retrieval", "format"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice collection format ids direct trace"],
    steps: [
      {
        request: buildStatementPostRequest(collectionFormatIdsStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementCollectionRequest({
          verb: collectionFormatIdsVerbId,
          format: "ids",
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            ...buildStatementCollectionExpectations([collectionFormatIdsStatement.id]),
            {
              path: ["statements", "0", "verb"],
              equals: {
                id: collectionFormatIdsVerbId,
              },
            },
            {
              path: ["statements", "0", "object", "id"],
              equals: collectionFormatIdsActivityId,
            },
          ],
        },
      },
    ],
  });

  const collectionCanonicalAcceptLanguageCase = requestSequenceCase({
    caseId: "v2.statements.representation.collection-canonical-accept-language",
    title: "The Statements Resource applies Accept-Language on collection GET requests when format is canonical",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00172",
        section: "Communication 2.1.3.s1.table1.row11",
        title: "Accept-Language affects collection retrieval when format is canonical",
      },
    ],
    tags: ["v2.0.0", "statements", "representation", "format", "accept-language"],
    capabilityFlags: ["query", "retrieval", "format"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice collection canonical accept-language direct trace"],
    steps: [
      {
        request: buildStatementPostRequest(collectionFormatCanonicalStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementCollectionRequest(
          {
            verb: collectionFormatCanonicalVerbId,
            format: "canonical",
          },
          {
            "Accept-Language": "en-GB",
          },
        ),
        assertion: {
          status: 200,
          jsonPathEquals: [
            ...buildStatementCollectionExpectations([collectionFormatCanonicalStatement.id]),
            {
              path: ["statements", "0", "verb", "display"],
              equals: {
                "en-GB": "format-proof-gb",
              },
            },
          ],
        },
      },
    ],
  });

  const collectionAcceptLanguageWithoutFormatCase = requestSequenceCase({
    caseId: "v2.statements.representation.collection-accept-language-without-format",
    title: "The Statements Resource does not apply Accept-Language on collection GET requests when format is absent",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00172",
        section: "Communication 2.1.3.s1.table1.row11",
        title: "Accept-Language does not affect collection retrieval when format is absent",
      },
    ],
    tags: ["v2.0.0", "statements", "representation", "format", "accept-language"],
    capabilityFlags: ["query", "retrieval", "format"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
    notes: ["proof-slice collection accept-language without format direct trace"],
    steps: [
      {
        request: buildStatementPostRequest(collectionFormatAbsentStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementCollectionRequest(
          {
            verb: collectionFormatAbsentVerbId,
          },
          {
            "Accept-Language": "en-GB",
          },
        ),
        assertion: {
          status: 200,
          jsonPathEquals: [
            ...buildStatementCollectionExpectations([collectionFormatAbsentStatement.id]),
            {
              path: ["statements", "0", "verb", "display"],
              equals: formatProofDisplay,
            },
          ],
        },
      },
    ],
  });

  const resultSuccessRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00074",
      section: "Data 2.4.5.s2.table1.row1",
      title: "Result success values are Booleans",
    },
  ];
  const resultCompletionRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00075",
      section: "Data 2.4.5.s2.table1.row2",
      title: "Result completion values are Booleans",
    },
  ];
  const resultResponseRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00076",
      section: "Data 2.4.5.s2.table1.row3",
      title: "Result response values are Strings",
    },
  ];
  const resultDurationRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00077",
      section: "Data 2.4.5.s2.table1.row4",
      title: "Result duration values are ISO 8601 durations",
    },
    {
      id: "XAPI-00124",
      section: "Data 4.6.s1.b1",
      title: "Duration values use the ISO 8601 duration format",
    },
  ];
  const resultExtensionsRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00078",
      section: "Data 2.4.5.s2.table1.row6",
      title: "Result extensions values are Objects",
    },
  ];
  const scoreObjectRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00079",
      section: "Data 2.4.5.1",
      title: "Result score values are Objects",
    },
  ];
  const scoreMaxRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00080",
      section: "Data 2.4.5.1.s2.table1.row4",
      title: "Result score max values are greater than min when min is present",
    },
  ];
  const scoreMinRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00081",
      section: "Data 2.4.5.1.s2.table1.row3",
      title: "Result score min values are less than max when max is present",
    },
  ];
  const scoreRawRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00082",
      section: "Data 2.4.5.1.s2.table1.row2",
      title: "Result score raw values stay within min and max when present",
    },
  ];
  const scoreScaledRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00083",
      section: "Data 2.4.5.1.s2.table1.row1",
      title: "Result score scaled values are between -1 and 1 inclusive",
    },
  ];
  const objectTypeVocabularyRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00046",
      section: "Data 2.4.4.s2",
      title: "Object objectType values are Activity, Agent, Group, SubStatement, or StatementRef",
    },
  ];
  const activityIdRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00047",
      section: "Data 2.4.4.1.s1.table1.row2",
      title: "Activity objects require id and the id must be an IRI",
    },
  ];
  const activityDefinitionRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00048",
      section: "Data 2.4.4.1.s1.table1.row3",
      title: "Activity definition values are Objects",
    },
  ];
  const activityObjectTypeGenerationRequirementRefs: RequirementRef[] = [
    {
      id: "DATA-2.4.4.s2.activity-objecttype-generation",
      section: "Data 2.4.4.s2",
      title: "LRSs generate an Activity objectType for statement objects when it is omitted",
    },
  ];
  const activityDefinitionNameRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00056",
      section: "Data 2.4.4.1.s2.table1.row1",
      title: "Activity definition name values are Language Maps",
    },
  ];
  const activityDefinitionDescriptionRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00059",
      section: "Data 2.4.4.1.s2.table1.row2",
      title: "Activity definition description values are Language Maps",
    },
  ];
  const activityDefinitionExtensionsRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00057",
      section: "Data 2.4.4.1.s2.table1.row5",
      title: "Activity definition extensions values are Objects with IRI keys",
    },
  ];
  const activityInteractionTypeValueRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00049",
      section: "Data 2.4.4.1.s8.table1.row1",
      title:
        "Activity definition interactionType values are one of true-false, choice, fill-in, long-fill-in, matching, performance, sequencing, likert, numeric, or other",
    },
  ];
  const activityCorrectResponsesPatternRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00050",
      section: "Data 2.4.4.1.s8.table1.row2",
      title: "Activity definition correctResponsesPattern values are arrays of strings",
    },
  ];
  const activityInteractionComponentRequirementRefsByField: Record<InteractionComponentField, RequirementRef[]> = {
    choices: [
      {
        id: "XAPI-00051",
        section: "Data 2.4.4.1.s8.table1.row3",
        title: "Activity definition choices values are arrays of Interaction Components",
      },
    ],
    scale: [
      {
        id: "XAPI-00052",
        section: "Data 2.4.4.1.s8.table1.row3",
        title: "Activity definition scale values are arrays of Interaction Components",
      },
    ],
    source: [
      {
        id: "XAPI-00053",
        section: "Data 2.4.4.1.s8.table1.row3",
        title: "Activity definition source values are arrays of Interaction Components",
      },
    ],
    target: [
      {
        id: "XAPI-00054",
        section: "Data 2.4.4.1.s8.table1.row3",
        title: "Activity definition target values are arrays of Interaction Components",
      },
    ],
    steps: [
      {
        id: "XAPI-00055",
        section: "Data 2.4.4.1.s8.table1.row3",
        title: "Activity definition steps values are arrays of Interaction Components",
      },
    ],
  };
  const interactionComponentObjectRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00058",
      section: "Data 2.4.4.1.s14",
      title: "Interaction Components are Objects",
    },
  ];
  const interactionComponentIdRequirementRefs: RequirementRef[] = [
    {
      id: "DATA-2.4.4.1.s15.table1.row1",
      section: "Data 2.4.4.1.s15.table1.row1",
      title: "Interaction Components include string ids",
    },
  ];
  const interactionComponentDescriptionRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00062",
      section: "Data 2.4.4.1.s15.table1.row2",
      title: "Interaction Component descriptions are Language Maps",
    },
  ];
  const interactionComponentUniqueIdRequirementRefs: RequirementRef[] = [
    {
      id: "DATA-2.4.4.1.s16.b1",
      section: "Data 2.4.4.1.s16.b1",
      title: "Interaction Component ids are unique within their arrays",
    },
  ];
  const activityInteractionTypeRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00064",
      section: "Data 2.4.4.1.s8",
      title:
        "Activity definitions require interactionType when correctResponsesPattern or interaction component arrays are used",
    },
  ];
  const objectActorTypeRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00065",
      section: "Data 2.4.4.2.s1.b1",
      title: "Agent and Group statement objects require objectType",
    },
  ];
  const statementRefRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00072",
      section: "Data 2.4.4.3.s4.table1.row2",
      title: "StatementRef id values are UUIDs",
    },
    {
      id: "XAPI-00073",
      section: "Data 2.4.4.3.s4.b1",
      title: "StatementRef objectType values are StatementRef",
    },
  ];
  const subStatementObjectTypeRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-01002",
      section: "Data 2.4.4.3.s8.b1",
      title: "SubStatement objectType values are SubStatement",
    },
  ];
  const subStatementRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00066",
      section: "Data 2.4.4.3.s8.b2",
      title: "SubStatements follow Statement requirements",
    },
  ];

  const resultSuccessTypeCases = statementMutationFamily({
    familyId: "v2.statements.result.success-type",
    suiteTitle: "Statement Result",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "validation", "success"],
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: resultsLegacyConfigFile,
    variants: resultPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-true-string`,
        title: `A Statement rejects ${placement.title} when success is the string true`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            success: "true",
          }),
        ),
        requirementRefs: resultSuccessRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-false-string`,
        title: `A Statement rejects ${placement.title} when success is the string false`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            success: "false",
          }),
        ),
        requirementRefs: resultSuccessRequirementRefs,
      },
    ]),
  });

  const resultCompletionTypeCases = statementMutationFamily({
    familyId: "v2.statements.result.completion-type",
    suiteTitle: "Statement Result",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "validation", "completion"],
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: resultsLegacyConfigFile,
    variants: resultPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-true-string`,
        title: `A Statement rejects ${placement.title} when completion is the string true`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            completion: "true",
          }),
        ),
        requirementRefs: resultCompletionRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-false-string`,
        title: `A Statement rejects ${placement.title} when completion is the string false`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            completion: "false",
          }),
        ),
        requirementRefs: resultCompletionRequirementRefs,
      },
    ]),
  });

  const resultResponseTypeCases = statementMutationFamily({
    familyId: "v2.statements.result.response-type",
    suiteTitle: "Statement Result",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "validation", "response"],
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: resultsLegacyConfigFile,
    variants: resultPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-numeric`,
        title: `A Statement rejects ${placement.title} when response is numeric`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            response: 12345,
          }),
        ),
        requirementRefs: resultResponseRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-object`,
        title: `A Statement rejects ${placement.title} when response is an object`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            response: {
              invalid: true,
            },
          }),
        ),
        requirementRefs: resultResponseRequirementRefs,
      },
    ]),
  });

  const resultDurationInvalidCases = statementMutationFamily({
    familyId: "v2.statements.result.duration-invalid",
    suiteTitle: "Statement Result",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "validation", "duration"],
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: durationsLegacyConfigFile,
    variants: resultPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-string`,
        title: `A Statement rejects ${placement.title} when duration is a non-ISO string`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            duration: "not-a-duration",
          }),
        ),
        requirementRefs: resultDurationRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-numeric`,
        title: `A Statement rejects ${placement.title} when duration is numeric`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            duration: invalidUuidNumeric,
          }),
        ),
        requirementRefs: resultDurationRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-object`,
        title: `A Statement rejects ${placement.title} when duration is an object`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            duration: invalidUuidObject,
          }),
        ),
        requirementRefs: resultDurationRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-invalid-designator`,
        title: `A Statement rejects ${placement.title} when duration is PA1H0M0S`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            duration: "PA1H0M0S",
          }),
        ),
        requirementRefs: resultDurationRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-mixed-week-day`,
        title: `A Statement rejects ${placement.title} when duration is P4W1D`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            duration: "P4W1D",
          }),
        ),
        requirementRefs: resultDurationRequirementRefs,
      },
    ]),
  });

  const validDurationVariants = [
    {
      idSuffix: "hours-minutes-seconds",
      label: "PT1H0M0.1S",
      value: "PT1H0M0.1S",
    },
    {
      idSuffix: "time-only",
      label: "PT4H35M59.14S",
      value: "PT4H35M59.14S",
    },
    {
      idSuffix: "seconds-only",
      label: "PT16559.14S",
      value: "PT16559.14S",
    },
    {
      idSuffix: "date-time",
      label: "P3Y1M29DT4H35M59.14S",
      value: "P3Y1M29DT4H35M59.14S",
    },
    {
      idSuffix: "years-only",
      label: "P3Y",
      value: "P3Y",
    },
    {
      idSuffix: "weeks",
      label: "P4W",
      value: "P4W",
    },
  ] as const;

  const resultDurationAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.result.duration-valid",
    suiteTitle: "Statement Result",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "duration"],
    expectedStatus: 200,
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: durationsLegacyConfigFile,
    variants: resultPlacements.flatMap((placement) =>
      validDurationVariants.map((variant) => ({
        idSuffix: `${placement.idSuffix}-${variant.idSuffix}`,
        title: `A Statement accepts ${placement.title} when duration is ${variant.label}`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            duration: variant.value,
          }),
        ),
        requirementRefs: resultDurationRequirementRefs,
      })),
    ),
  });

  const resultExtensionsTypeCases = statementMutationFamily({
    familyId: "v2.statements.result.extensions-type",
    suiteTitle: "Statement Result",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "validation", "extensions"],
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: resultsLegacyConfigFile,
    variants: resultPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-numeric`,
        title: `A Statement rejects ${placement.title} when extensions is numeric`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            extensions: 12345,
          }),
        ),
        requirementRefs: resultExtensionsRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-string`,
        title: `A Statement rejects ${placement.title} when extensions is a string`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            extensions: "should fail",
          }),
        ),
        requirementRefs: resultExtensionsRequirementRefs,
      },
    ]),
  });

  const scoreObjectTypeCases = statementMutationFamily({
    familyId: "v2.statements.score.type",
    suiteTitle: "Statement Score",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "score", "validation"],
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: scoresLegacyConfigFile,
    variants: resultPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-numeric`,
        title: `A Statement rejects ${placement.title} when score is numeric`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            score: 12345,
          }),
        ),
        requirementRefs: scoreObjectRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-string`,
        title: `A Statement rejects ${placement.title} when score is a string`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            score: "should fail",
          }),
        ),
        requirementRefs: scoreObjectRequirementRefs,
      },
    ]),
  });

  const scoreScaledAcceptanceVariants = [
    {
      idSuffix: "decimal",
      label: "a decimal within range",
      score: { scaled: validScoreDecimal },
    },
    {
      idSuffix: "upper-bound",
      label: "the inclusive upper bound 1.0",
      score: { scaled: 1.0 },
    },
    {
      idSuffix: "lower-bound",
      label: "the inclusive lower bound -1.0",
      score: { scaled: -1.0 },
    },
  ] as const;

  const scoreScaledAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.score.scaled-valid",
    suiteTitle: "Statement Score",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "score", "scaled"],
    expectedStatus: 200,
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: scoresLegacyConfigFile,
    variants: resultPlacements.flatMap((placement) =>
      scoreScaledAcceptanceVariants.map((variant) => ({
        idSuffix: `${placement.idSuffix}-${variant.idSuffix}`,
        title: `A Statement accepts ${placement.title} when scaled uses ${variant.label}`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            score: variant.score,
          }),
        ),
        requirementRefs: scoreScaledRequirementRefs,
      })),
    ),
  });

  const scoreScaledRejectionVariants = [
    {
      idSuffix: "above-one",
      label: "1.01",
      score: { scaled: 1.01 },
    },
    {
      idSuffix: "below-negative-one",
      label: "-1.00001",
      score: { scaled: -1.00001 },
    },
  ] as const;

  const scoreScaledRejectionCases = statementMutationFamily({
    familyId: "v2.statements.score.scaled-invalid",
    suiteTitle: "Statement Score",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "score", "scaled", "validation"],
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: scoresLegacyConfigFile,
    variants: resultPlacements.flatMap((placement) =>
      scoreScaledRejectionVariants.map((variant) => ({
        idSuffix: `${placement.idSuffix}-${variant.idSuffix}`,
        title: `A Statement rejects ${placement.title} when scaled is ${variant.label}`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            score: variant.score,
          }),
        ),
        requirementRefs: scoreScaledRequirementRefs,
      })),
    ),
  });

  const scoreRawAcceptanceVariants = [
    {
      idSuffix: "unrestricted",
      label: "raw without min or max",
      score: { raw: validScoreDecimal },
    },
    {
      idSuffix: "bounded",
      label: "raw between min and max",
      score: { raw: validScoreDecimal, min: validScoreDecimal - 1, max: validScoreDecimal + 1 },
    },
  ] as const;

  const scoreRawAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.score.raw-valid",
    suiteTitle: "Statement Score",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "score", "raw"],
    expectedStatus: 200,
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: scoresLegacyConfigFile,
    variants: resultPlacements.flatMap((placement) =>
      scoreRawAcceptanceVariants.map((variant) => ({
        idSuffix: `${placement.idSuffix}-${variant.idSuffix}`,
        title: `A Statement accepts ${placement.title} when score uses ${variant.label}`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            score: variant.score,
          }),
        ),
        requirementRefs: scoreRawRequirementRefs,
      })),
    ),
  });

  const scoreRawRejectionVariants = [
    {
      idSuffix: "above-max",
      label: "raw greater than max",
      score: { raw: validScoreDecimal, max: validScoreDecimal - 0.02 },
    },
    {
      idSuffix: "below-min",
      label: "raw less than min",
      score: { raw: validScoreDecimal, min: validScoreDecimal + 0.73 },
    },
  ] as const;

  const scoreRawRejectionCases = statementMutationFamily({
    familyId: "v2.statements.score.raw-invalid",
    suiteTitle: "Statement Score",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "score", "raw", "validation"],
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: scoresLegacyConfigFile,
    variants: resultPlacements.flatMap((placement) =>
      scoreRawRejectionVariants.map((variant) => ({
        idSuffix: `${placement.idSuffix}-${variant.idSuffix}`,
        title: `A Statement rejects ${placement.title} when score uses ${variant.label}`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            score: variant.score,
          }),
        ),
        requirementRefs: scoreRawRequirementRefs,
      })),
    ),
  });

  const scoreMinAcceptanceVariants = [
    {
      idSuffix: "unrestricted",
      label: "min without max",
      score: { min: validScoreDecimal },
    },
    {
      idSuffix: "bounded",
      label: "min below max with raw between them",
      score: { min: validScoreDecimal, max: validScoreDecimal + 1, raw: validScoreDecimal + 0.5 },
    },
  ] as const;

  const scoreMinAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.score.min-valid",
    suiteTitle: "Statement Score",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "score", "min"],
    expectedStatus: 200,
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: scoresLegacyConfigFile,
    variants: resultPlacements.flatMap((placement) =>
      scoreMinAcceptanceVariants.map((variant) => ({
        idSuffix: `${placement.idSuffix}-${variant.idSuffix}`,
        title: `A Statement accepts ${placement.title} when score uses ${variant.label}`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            score: variant.score,
          }),
        ),
        requirementRefs: scoreMinRequirementRefs,
      })),
    ),
  });

  const scoreMinRejectionCases = statementMutationFamily({
    familyId: "v2.statements.score.min-invalid",
    suiteTitle: "Statement Score",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "score", "min", "validation"],
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: scoresLegacyConfigFile,
    variants: resultPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement rejects ${placement.title} when min is greater than max`,
      transforms: placement.buildTransforms(
        buildResultFixture({
          score: {
            min: validScoreDecimal,
            max: validScoreDecimal - 0.0000321,
            raw: validScoreDecimal - 0.0000033,
          },
        }),
      ),
      requirementRefs: scoreMinRequirementRefs,
    })),
  });

  const scoreMaxAcceptanceVariants = [
    {
      idSuffix: "unrestricted",
      label: "max without min",
      score: { max: validScoreMaxDecimal },
    },
    {
      idSuffix: "bounded",
      label: "max above min with raw between them",
      score: { max: validScoreMaxDecimal, min: validScoreMaxDecimal - 4, raw: validScoreMaxDecimal - 1 },
    },
  ] as const;

  const scoreMaxAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.score.max-valid",
    suiteTitle: "Statement Score",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "score", "max"],
    expectedStatus: 200,
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: scoresLegacyConfigFile,
    variants: resultPlacements.flatMap((placement) =>
      scoreMaxAcceptanceVariants.map((variant) => ({
        idSuffix: `${placement.idSuffix}-${variant.idSuffix}`,
        title: `A Statement accepts ${placement.title} when score uses ${variant.label}`,
        transforms: placement.buildTransforms(
          buildResultFixture({
            score: variant.score,
          }),
        ),
        requirementRefs: scoreMaxRequirementRefs,
      })),
    ),
  });

  const scoreMaxRejectionCases = statementMutationFamily({
    familyId: "v2.statements.score.max-invalid",
    suiteTitle: "Statement Score",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "result", "score", "max", "validation"],
    legacyTraceSuiteFile: resultRequirementsLegacySuiteFile,
    legacyTraceConfigFile: scoresLegacyConfigFile,
    variants: resultPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement rejects ${placement.title} when max is less than min`,
      transforms: placement.buildTransforms(
        buildResultFixture({
          score: {
            max: validScoreMaxDecimal,
            raw: validScoreMaxDecimal + 1,
            min: validScoreMaxDecimal + 4,
          },
        }),
      ),
      requirementRefs: scoreMaxRequirementRefs,
    })),
  });

  const objectTypeVocabularyCases = statementMutationFamily({
    familyId: "v2.statements.object-type-vocabulary",
    suiteTitle: "Statement Activity And Object Typing",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "object", "object-type", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: objectsLegacyConfigFile,
    variants: [
      ...activityObjectPlacements.map((placement) => ({
        idSuffix: `${placement.idSuffix}-activity`,
        title: `A Statement rejects ${placement.title} when objectType does not exactly match Activity`,
        transforms: placement.buildTransforms({
          ...buildActivityObjectFixture("https://example.test/xapi/activities/invalid-object-type"),
          objectType: "activity",
        }),
        requirementRefs: objectTypeVocabularyRequirementRefs,
      })),
      {
        idSuffix: "statement-agent",
        title: "A Statement rejects a statement Agent object when objectType does not exactly match Agent",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: {
              ...buildAgentWithMbox("mailto:proof-object-type-agent@example.test"),
              objectType: "agent",
            },
          },
        ],
        requirementRefs: objectTypeVocabularyRequirementRefs,
      },
      {
        idSuffix: "substatement-agent",
        title: "A Statement rejects a substatement Agent object when objectType does not exactly match Agent",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              object: {
                ...buildAgentWithMbox("mailto:proof-object-type-substatement-agent@example.test"),
                objectType: "agent",
              },
            }),
          },
        ],
        requirementRefs: objectTypeVocabularyRequirementRefs,
      },
      {
        idSuffix: "statement-group",
        title: "A Statement rejects a statement Group object when objectType does not exactly match Group",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: {
              ...buildGroupWithMbox("mailto:proof-object-type-group@example.test"),
              objectType: "group",
            },
          },
        ],
        requirementRefs: objectTypeVocabularyRequirementRefs,
      },
      {
        idSuffix: "substatement-group",
        title: "A Statement rejects a substatement Group object when objectType does not exactly match Group",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              object: {
                ...buildGroupWithMbox("mailto:proof-object-type-substatement-group@example.test"),
                objectType: "group",
              },
            }),
          },
        ],
        requirementRefs: objectTypeVocabularyRequirementRefs,
      },
      ...statementRefPlacements.map((placement) => ({
        idSuffix: `${placement.idSuffix}-statement-ref`,
        title: `A Statement rejects ${placement.title} when objectType does not exactly match StatementRef`,
        transforms: placement.buildTransforms({
          objectType: "statementref",
          id: buildProofUuid(975),
        }),
        requirementRefs: objectTypeVocabularyRequirementRefs,
      })),
    ],
  });

  const activityMissingIdCases = statementMutationFamily({
    familyId: "v2.statements.activity.missing-id",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "object", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: activitiesLegacyConfigFile,
    variants: activityObjectPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement rejects ${placement.title} when id is missing`,
      transforms: placement.buildTransforms({
        objectType: "Activity",
      }),
      requirementRefs: activityIdRequirementRefs,
    })),
  });

  const activityInvalidIdCases = statementMutationFamily({
    familyId: "v2.statements.activity.invalid-id",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "object", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: activitiesLegacyConfigFile,
    variants: activityObjectPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement rejects ${placement.title} when id is not an IRI`,
      transforms: placement.buildTransforms(buildActivityObjectFixture(invalidOpenId)),
      requirementRefs: activityIdRequirementRefs,
    })),
  });

  const activityDefinitionTypeCases = statementMutationFamily({
    familyId: "v2.statements.activity.definition-type",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: activitiesLegacyConfigFile,
    variants: activityObjectPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement rejects ${placement.title} when definition is not an object`,
      transforms: placement.buildTransforms(
        buildActivityObjectFixture(`https://example.test/xapi/activities/${placement.idSuffix}-definition-not-object`, {
          definition: "not-an-object",
        }),
      ),
      requirementRefs: activityDefinitionRequirementRefs,
    })),
  });

  const activityObjectTypeGeneratedCases = activityObjectPlacements.map((placement, index) =>
    statementRoundTripCase({
      caseId: `v2.statements.activity.object-type-generated.${placement.idSuffix}`,
      title: `The Statements resource generates objectType Activity for ${placement.title} when it is omitted`,
      specVersion,
      queryParam: "statementId",
      requirementRefs: activityObjectTypeGenerationRequirementRefs,
      tags: ["v2.0.0", "statements", "activity", "object", "retrieval"],
      capabilityFlags: ["query", "retrieval", "activity"],
      legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
      transforms: [
        {
          operation: "set",
          path: ["id"],
          value: buildProofUuid(1100 + index),
        },
        ...placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-generated-object-type`,
            {},
            false,
          ),
        ),
      ],
      queryJsonPathEquals: [
        {
          path: buildActivityObjectRoundTripPath(placement.idSuffix, ["objectType"]),
          equals: "Activity",
        },
      ],
      notes: ["proof-slice statement activity objectType generation"],
    }),
  );

  const activityDefinitionNameTypeCases = statementMutationFamily({
    familyId: "v2.statements.activity.definition-name-type",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "name", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: activitiesLegacyConfigFile,
    variants: activityObjectPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-numeric`,
        title: `A Statement rejects ${placement.title} when definition.name is numeric`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(`https://example.test/xapi/activities/${placement.idSuffix}-name-numeric`, {
            definition: buildActivityDefinitionFixture({
              name: 12345,
            }),
          }),
        ),
        requirementRefs: activityDefinitionNameRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-string`,
        title: `A Statement rejects ${placement.title} when definition.name is a string`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(`https://example.test/xapi/activities/${placement.idSuffix}-name-string`, {
            definition: buildActivityDefinitionFixture({
              name: "not-a-language-map",
            }),
          }),
        ),
        requirementRefs: activityDefinitionNameRequirementRefs,
      },
    ]),
  });

  const activityDefinitionDescriptionTypeCases = statementMutationFamily({
    familyId: "v2.statements.activity.definition-description-type",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "description", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: activitiesLegacyConfigFile,
    variants: activityObjectPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-numeric`,
        title: `A Statement rejects ${placement.title} when definition.description is numeric`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(`https://example.test/xapi/activities/${placement.idSuffix}-description-numeric`, {
            definition: buildActivityDefinitionFixture({
              description: 12345,
            }),
          }),
        ),
        requirementRefs: activityDefinitionDescriptionRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-string`,
        title: `A Statement rejects ${placement.title} when definition.description is a string`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(`https://example.test/xapi/activities/${placement.idSuffix}-description-string`, {
            definition: buildActivityDefinitionFixture({
              description: "not-a-language-map",
            }),
          }),
        ),
        requirementRefs: activityDefinitionDescriptionRequirementRefs,
      },
    ]),
  });

  const scalarInteractionTypeAcceptanceVariants = [
    {
      idSuffix: "true-false",
      label: '"true-false"',
      definition: buildActivityDefinitionFixture({
        interactionType: "true-false",
        correctResponsesPattern: ["true"],
      }),
    },
    {
      idSuffix: "fill-in",
      label: '"fill-in"',
      definition: buildActivityDefinitionFixture({
        interactionType: "fill-in",
        correctResponsesPattern: ["proof fill in"],
      }),
    },
    {
      idSuffix: "long-fill-in",
      label: '"long-fill-in"',
      definition: buildActivityDefinitionFixture({
        interactionType: "long-fill-in",
        correctResponsesPattern: ["proof long fill in"],
      }),
    },
    {
      idSuffix: "numeric",
      label: '"numeric"',
      definition: buildActivityDefinitionFixture({
        interactionType: "numeric",
        correctResponsesPattern: ["4[:]"],
      }),
    },
    {
      idSuffix: "other",
      label: '"other"',
      definition: buildActivityDefinitionFixture({
        interactionType: "other",
        correctResponsesPattern: ["(35.937432,-86.868896)"],
      }),
    },
  ] as const;

  const activityInteractionTypeAcceptanceVariants = [
    ...scalarInteractionTypeAcceptanceVariants,
    {
      idSuffix: "choice",
      label: '"choice"',
      definition: buildActivityDefinitionWithInteractionField({
        field: "choices",
        interactionType: "choice",
        correctResponsesPattern: ["choice-a[,]choice-b"],
        value: [
          buildInteractionComponentFixture("choice-a", "Choice A"),
          buildInteractionComponentFixture("choice-b", "Choice B"),
        ],
      }),
    },
    {
      idSuffix: "matching",
      label: '"matching"',
      definition: buildActivityDefinitionFixture({
        interactionType: "matching",
        correctResponsesPattern: ["source-a[.]target-a"],
        source: [
          buildInteractionComponentFixture("source-a", "Source A"),
          buildInteractionComponentFixture("source-b", "Source B"),
        ],
        target: [
          buildInteractionComponentFixture("target-a", "Target A"),
          buildInteractionComponentFixture("target-b", "Target B"),
        ],
      }),
    },
    {
      idSuffix: "performance",
      label: '"performance"',
      definition: buildActivityDefinitionWithInteractionField({
        field: "steps",
        interactionType: "performance",
        correctResponsesPattern: ["step-a[.]complete"],
        value: [
          buildInteractionComponentFixture("step-a", "Step A"),
          buildInteractionComponentFixture("step-b", "Step B"),
        ],
      }),
    },
    {
      idSuffix: "sequencing",
      label: '"sequencing"',
      definition: buildActivityDefinitionWithInteractionField({
        field: "choices",
        interactionType: "sequencing",
        correctResponsesPattern: ["sequence-a[,]sequence-b"],
        value: [
          buildInteractionComponentFixture("sequence-a", "Sequence A"),
          buildInteractionComponentFixture("sequence-b", "Sequence B"),
        ],
      }),
    },
    {
      idSuffix: "likert",
      label: '"likert"',
      definition: buildActivityDefinitionWithInteractionField({
        field: "scale",
        interactionType: "likert",
        correctResponsesPattern: ["likert-1"],
        value: [
          buildInteractionComponentFixture("likert-0", "Likert zero"),
          buildInteractionComponentFixture("likert-1", "Likert one"),
        ],
      }),
    },
  ];

  const activityInteractionTypeAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.activity.interaction-type.acceptance",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "interaction-type"],
    expectedStatus: 200,
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: activitiesLegacyConfigFile,
    variants: activityObjectPlacements.flatMap((placement) =>
      activityInteractionTypeAcceptanceVariants.map((variant) => ({
        idSuffix: `${placement.idSuffix}-${variant.idSuffix}`,
        title: `A Statement accepts ${placement.title} when definition.interactionType uses ${variant.label}`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-interaction-type-${variant.idSuffix}`,
            {
              definition: variant.definition,
            },
          ),
        ),
        requirementRefs: activityInteractionTypeValueRequirementRefs,
      })),
    ),
  });

  const invalidInteractionTypeVariants = [
    {
      idSuffix: "iri",
      label: "an IRI",
      value: invalidOpenId,
    },
    {
      idSuffix: "numeric",
      label: "a number",
      value: 12345,
    },
    {
      idSuffix: "object",
      label: "an object",
      value: {
        invalid: true,
      },
    },
    {
      idSuffix: "string",
      label: "an unsupported string",
      value: "should error",
    },
  ] as const;

  const activityInteractionTypeInvalidCases = statementMutationFamily({
    familyId: "v2.statements.activity.interaction-type.invalid",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "interaction-type", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: activitiesLegacyConfigFile,
    variants: activityObjectPlacements.flatMap((placement) =>
      invalidInteractionTypeVariants.map((variant) => ({
        idSuffix: `${placement.idSuffix}-${variant.idSuffix}`,
        title: `A Statement rejects ${placement.title} when definition.interactionType uses ${variant.label}`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-invalid-interaction-type-${variant.idSuffix}`,
            {
              definition: buildActivityDefinitionFixture({
                interactionType: variant.value,
                correctResponsesPattern: ["proof-response"],
              }),
            },
          ),
        ),
        requirementRefs: activityInteractionTypeValueRequirementRefs,
      })),
    ),
  });

  const activityCorrectResponsesPatternCases = statementMutationFamily({
    familyId: "v2.statements.activity.correct-responses-pattern",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "correct-responses-pattern"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    variants: activityObjectPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-valid`,
        title: `A Statement accepts ${placement.title} when definition.correctResponsesPattern is an array of strings`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-correct-responses-pattern-valid`,
            {
              definition: buildActivityDefinitionFixture({
                interactionType: "other",
                correctResponsesPattern: ["proof-response"],
              }),
            },
          ),
        ),
        requirementRefs: activityCorrectResponsesPatternRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-object`,
        title: `A Statement rejects ${placement.title} when definition.correctResponsesPattern is an object`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-correct-responses-pattern-object`,
            {
              definition: buildActivityDefinitionFixture({
                interactionType: "other",
                correctResponsesPattern: {
                  invalid: true,
                },
              }),
            },
          ),
        ),
        requirementRefs: activityCorrectResponsesPatternRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-array-object`,
        title: `A Statement rejects ${placement.title} when definition.correctResponsesPattern contains objects`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-correct-responses-pattern-array-object`,
            {
              definition: buildActivityDefinitionFixture({
                interactionType: "other",
                correctResponsesPattern: [
                  {
                    invalid: true,
                  },
                ],
              }),
            },
          ),
        ),
        requirementRefs: activityCorrectResponsesPatternRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-array-number`,
        title: `A Statement rejects ${placement.title} when definition.correctResponsesPattern contains numbers`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-correct-responses-pattern-array-number`,
            {
              definition: buildActivityDefinitionFixture({
                interactionType: "other",
                correctResponsesPattern: [12345],
              }),
            },
          ),
        ),
        requirementRefs: activityCorrectResponsesPatternRequirementRefs,
      },
    ]),
    expectedStatus: 200,
  }).map((testCase) =>
    testCase.id.endsWith("-object") || testCase.id.endsWith("-array-object") || testCase.id.endsWith("-array-number")
      ? {
          ...testCase,
          assertion: {
            ...testCase.assertion,
            status: 400,
          },
        }
      : testCase,
  );

  const activityExtensionsTypeCases = statementMutationFamily({
    familyId: "v2.statements.activity.extensions-type",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "extensions", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: activitiesLegacyConfigFile,
    variants: activityObjectPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-string`,
        title: `A Statement rejects ${placement.title} when definition.extensions is a string`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(`https://example.test/xapi/activities/${placement.idSuffix}-extensions-string`, {
            definition: buildActivityDefinitionFixture({
              extensions: "not-an-object",
            }),
          }),
        ),
        requirementRefs: activityDefinitionExtensionsRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-invalid-key`,
        title: `A Statement rejects ${placement.title} when definition.extensions uses a non-IRI key`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-extensions-invalid-key`,
            {
              definition: buildActivityDefinitionFixture({
                extensions: {
                  id: "valid",
                },
              }),
            },
          ),
        ),
        requirementRefs: activityDefinitionExtensionsRequirementRefs,
      },
    ]),
  });

  const legacyExtensionKeyCases = statementMutationFamily({
    familyId: "v2.statements.extensions.legacy-invalid-key",
    suiteTitle: "Statement Special Data Types",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "extensions", "legacy", "iri"],
    legacyTraceSuiteFile: specialDataTypesLegacySuiteFile,
    legacyTraceConfigFile: extensionsLegacyConfigFile,
    variants: [
      {
        idSuffix: "statement-activity",
        title: "A Statement rejects a non-IRI extension key in object.definition.extensions",
        transforms: [
          {
            operation: "set",
            path: ["object", "definition", "extensions"],
            value: {
              id: "valid",
            },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00118",
            section: "Data 4.1.s3.b1",
            title: 'An Extension "key" is an IRI',
          },
        ],
      },
      {
        idSuffix: "statement-result",
        title: "A Statement rejects a non-IRI extension key in result.extensions",
        transforms: [
          {
            operation: "set",
            path: ["result", "extensions"],
            value: {
              id: "valid",
            },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00118",
            section: "Data 4.1.s3.b1",
            title: 'An Extension "key" is an IRI',
          },
        ],
      },
      {
        idSuffix: "statement-context",
        title: "A Statement rejects a non-IRI extension key in context.extensions",
        transforms: [
          {
            operation: "set",
            path: ["context", "extensions"],
            value: {
              id: "valid",
            },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00118",
            section: "Data 4.1.s3.b1",
            title: 'An Extension "key" is an IRI',
          },
        ],
      },
      {
        idSuffix: "substatement-activity",
        title: "A Statement rejects a non-IRI extension key in a substatement activity definition",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "set",
            path: ["object", "object", "definition", "extensions"],
            value: {
              id: "valid",
            },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00118",
            section: "Data 4.1.s3.b1",
            title: 'An Extension "key" is an IRI',
          },
        ],
      },
      {
        idSuffix: "substatement-result",
        title: "A Statement rejects a non-IRI extension key in a substatement result",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "set",
            path: ["object", "result", "extensions"],
            value: {
              id: "valid",
            },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00118",
            section: "Data 4.1.s3.b1",
            title: 'An Extension "key" is an IRI',
          },
        ],
      },
      {
        idSuffix: "substatement-context",
        title: "A Statement rejects a non-IRI extension key in a substatement context",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "set",
            path: ["object", "context", "extensions"],
            value: {
              id: "valid",
            },
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00118",
            section: "Data 4.1.s3.b1",
            title: 'An Extension "key" is an IRI',
          },
        ],
      },
    ],
  });

  const activityInteractionComponentAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.activity.interaction-components.acceptance",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "interaction-components"],
    expectedStatus: 200,
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    variants: activityObjectPlacements.flatMap((placement) =>
      interactionComponentTargets.map((target) => ({
        idSuffix: `${placement.idSuffix}-${target.idSuffix}`,
        title: `A Statement accepts ${placement.title} when ${target.title} uses interaction components`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-${target.idSuffix}-acceptance`,
            {
              definition: buildActivityDefinitionWithInteractionField({
                field: target.field,
                interactionType: target.interactionType,
                correctResponsesPattern: target.correctResponsesPattern,
                value: target.components,
              }),
            },
          ),
        ),
        requirementRefs: activityInteractionComponentRequirementRefsByField[target.field],
      })),
    ),
  });

  const activityInteractionComponentNotArrayCases = statementMutationFamily({
    familyId: "v2.statements.activity.interaction-components.not-array",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "interaction-components", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    variants: activityObjectPlacements.flatMap((placement) =>
      interactionComponentTargets.map((target) => ({
        idSuffix: `${placement.idSuffix}-${target.idSuffix}`,
        title: `A Statement rejects ${placement.title} when ${target.title} is not an array`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-${target.idSuffix}-not-array`,
            {
              definition: buildActivityDefinitionWithInteractionField({
                field: target.field,
                interactionType: target.interactionType,
                correctResponsesPattern: target.correctResponsesPattern,
                value: {
                  invalid: true,
                },
              }),
            },
          ),
        ),
        requirementRefs: activityInteractionComponentRequirementRefsByField[target.field],
      })),
    ),
  });

  const activityInteractionComponentEntryNotObjectCases = statementMutationFamily({
    familyId: "v2.statements.activity.interaction-components.entry-not-object",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "interaction-components", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    variants: activityObjectPlacements.flatMap((placement) =>
      interactionComponentTargets.map((target) => ({
        idSuffix: `${placement.idSuffix}-${target.idSuffix}`,
        title: `A Statement rejects ${placement.title} when ${target.title} contains a non-object entry`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-${target.idSuffix}-entry-not-object`,
            {
              definition: buildActivityDefinitionWithInteractionField({
                field: target.field,
                interactionType: target.interactionType,
                correctResponsesPattern: target.correctResponsesPattern,
                value: ["not-an-object"],
              }),
            },
          ),
        ),
        requirementRefs: [
          ...activityInteractionComponentRequirementRefsByField[target.field],
          ...interactionComponentObjectRequirementRefs,
        ],
      })),
    ),
  });

  const activityInteractionComponentIdMissingCases = statementMutationFamily({
    familyId: "v2.statements.activity.interaction-components.id-missing",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "interaction-components", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    variants: activityObjectPlacements.flatMap((placement) =>
      interactionComponentTargets.map((target) => ({
        idSuffix: `${placement.idSuffix}-${target.idSuffix}`,
        title: `A Statement rejects ${placement.title} when ${target.title} omits an interaction component id`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-${target.idSuffix}-id-missing`,
            {
              definition: buildActivityDefinitionWithInteractionField({
                field: target.field,
                interactionType: target.interactionType,
                correctResponsesPattern: target.correctResponsesPattern,
                value: [
                  {
                    description: {
                      "en-US": "Proof interaction component",
                    },
                  },
                ],
              }),
            },
          ),
        ),
        requirementRefs: [
          ...activityInteractionComponentRequirementRefsByField[target.field],
          ...interactionComponentIdRequirementRefs,
        ],
      })),
    ),
  });

  const activityInteractionComponentIdInvalidCases = statementMutationFamily({
    familyId: "v2.statements.activity.interaction-components.id-invalid",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "interaction-components", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    variants: activityObjectPlacements.flatMap((placement) =>
      interactionComponentTargets.map((target) => ({
        idSuffix: `${placement.idSuffix}-${target.idSuffix}`,
        title: `A Statement rejects ${placement.title} when ${target.title} uses a non-string interaction component id`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-${target.idSuffix}-id-invalid`,
            {
              definition: buildActivityDefinitionWithInteractionField({
                field: target.field,
                interactionType: target.interactionType,
                correctResponsesPattern: target.correctResponsesPattern,
                value: [
                  {
                    id: 12345,
                    description: {
                      "en-US": "Proof interaction component",
                    },
                  },
                ],
              }),
            },
          ),
        ),
        requirementRefs: [
          ...activityInteractionComponentRequirementRefsByField[target.field],
          ...interactionComponentIdRequirementRefs,
        ],
      })),
    ),
  });

  const activityInteractionComponentDescriptionTypeCases = statementMutationFamily({
    familyId: "v2.statements.activity.interaction-components.description-type",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "interaction-components", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    variants: activityObjectPlacements.flatMap((placement) =>
      interactionComponentTargets.map((target) => ({
        idSuffix: `${placement.idSuffix}-${target.idSuffix}`,
        title: `A Statement rejects ${placement.title} when ${target.title} uses a non-object description`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-${target.idSuffix}-description-type`,
            {
              definition: buildActivityDefinitionWithInteractionField({
                field: target.field,
                interactionType: target.interactionType,
                correctResponsesPattern: target.correctResponsesPattern,
                value: [
                  {
                    id: `${target.idSuffix}-description-type`,
                    description: "not-a-language-map",
                  },
                ],
              }),
            },
          ),
        ),
        requirementRefs: [
          ...activityInteractionComponentRequirementRefsByField[target.field],
          ...interactionComponentDescriptionRequirementRefs,
        ],
      })),
    ),
  });

  const activityInteractionComponentDescriptionLanguageCases = statementMutationFamily({
    familyId: "v2.statements.activity.interaction-components.description-language",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "interaction-components", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    variants: activityObjectPlacements.flatMap((placement) =>
      interactionComponentTargets.map((target) => ({
        idSuffix: `${placement.idSuffix}-${target.idSuffix}`,
        title: `A Statement rejects ${placement.title} when ${target.title} uses an invalid description language key`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-${target.idSuffix}-description-language`,
            {
              definition: buildActivityDefinitionWithInteractionField({
                field: target.field,
                interactionType: target.interactionType,
                correctResponsesPattern: target.correctResponsesPattern,
                value: [
                  {
                    id: `${target.idSuffix}-description-language`,
                    description: {
                      something: "invalid-language-key",
                    },
                  },
                ],
              }),
            },
          ),
        ),
        requirementRefs: [
          ...activityInteractionComponentRequirementRefsByField[target.field],
          ...interactionComponentDescriptionRequirementRefs,
        ],
      })),
    ),
  });

  const activityInteractionComponentDuplicateIdCases = statementMutationFamily({
    familyId: "v2.statements.activity.interaction-components.duplicate-ids",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "interaction-components", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    variants: activityObjectPlacements.flatMap((placement) =>
      interactionComponentTargets.map((target) => ({
        idSuffix: `${placement.idSuffix}-${target.idSuffix}`,
        title: `A Statement rejects ${placement.title} when ${target.title} reuses an interaction component id`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-${target.idSuffix}-duplicate-ids`,
            {
              definition: buildActivityDefinitionWithInteractionField({
                field: target.field,
                interactionType: target.interactionType,
                correctResponsesPattern: target.correctResponsesPattern,
                value: [
                  buildInteractionComponentFixture(`${target.idSuffix}-duplicate`, "Duplicate A"),
                  buildInteractionComponentFixture(`${target.idSuffix}-duplicate`, "Duplicate B"),
                ],
              }),
            },
          ),
        ),
        requirementRefs: [
          ...activityInteractionComponentRequirementRefsByField[target.field],
          ...interactionComponentUniqueIdRequirementRefs,
        ],
      })),
    ),
  });

  const interactionCarrierVariants = [
    {
      idSuffix: "correct-responses-pattern",
      label: "correctResponsesPattern",
      definition: buildActivityDefinitionFixture({
        correctResponsesPattern: ["proof-response"],
      }),
    },
    {
      idSuffix: "choices",
      label: "choices",
      definition: buildActivityDefinitionFixture({
        choices: [buildInteractionComponentFixture("choice-a", "Proof choice")],
      }),
    },
    {
      idSuffix: "scale",
      label: "scale",
      definition: buildActivityDefinitionFixture({
        scale: [buildInteractionComponentFixture("scale-a", "Proof scale")],
      }),
    },
    {
      idSuffix: "source",
      label: "source",
      definition: buildActivityDefinitionFixture({
        source: [buildInteractionComponentFixture("source-a", "Proof source")],
      }),
    },
    {
      idSuffix: "target",
      label: "target",
      definition: buildActivityDefinitionFixture({
        target: [buildInteractionComponentFixture("target-a", "Proof target")],
      }),
    },
    {
      idSuffix: "steps",
      label: "steps",
      definition: buildActivityDefinitionFixture({
        steps: [buildInteractionComponentFixture("step-a", "Proof step")],
      }),
    },
  ] as const;

  const activityInteractionTypeRequiredCases = statementMutationFamily({
    familyId: "v2.statements.activity.interaction-type-required",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "activity", "definition", "interaction-type", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    variants: activityObjectPlacements.flatMap((placement) =>
      interactionCarrierVariants.map((variant) => ({
        idSuffix: `${placement.idSuffix}-${variant.idSuffix}`,
        title: `A Statement rejects ${placement.title} when ${variant.label} is used without interactionType`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-${variant.idSuffix}-without-interaction-type`,
            {
              definition: variant.definition,
            },
          ),
        ),
        requirementRefs: activityInteractionTypeRequirementRefs,
      })),
    ),
  });

  const objectActorTypeRequiredCases = statementMutationFamily({
    familyId: "v2.statements.object-agent-group.requires-object-type",
    suiteTitle: "Statement Activity And Object Typing",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "object", "agent", "group", "object-type", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    variants: [
      {
        idSuffix: "statement-agent",
        title: "A Statement rejects a statement Agent object when objectType is omitted",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: {
              mbox: "mailto:proof-object-agent-without-type@example.test",
              name: "Proof Agent",
            },
          },
        ],
        requirementRefs: objectActorTypeRequirementRefs,
      },
      {
        idSuffix: "statement-group",
        title: "A Statement rejects a statement Group object when objectType is omitted",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: {
              mbox: "mailto:proof-object-group-without-type@example.test",
              name: "Proof Group",
              member: [buildAgentWithMbox(validGroupMemberMbox)],
            },
          },
        ],
        requirementRefs: objectActorTypeRequirementRefs,
      },
      {
        idSuffix: "substatement-agent",
        title: "A Statement rejects a substatement Agent object when objectType is omitted",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              object: {
                mbox: "mailto:proof-substatement-object-agent-without-type@example.test",
                name: "Proof Agent",
              },
            }),
          },
        ],
        requirementRefs: objectActorTypeRequirementRefs,
      },
      {
        idSuffix: "substatement-group",
        title: "A Statement rejects a substatement Group object when objectType is omitted",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              object: {
                mbox: "mailto:proof-substatement-object-group-without-type@example.test",
                name: "Proof Group",
                member: [buildAgentWithMbox(validGroupMemberMbox)],
              },
            }),
          },
        ],
        requirementRefs: objectActorTypeRequirementRefs,
      },
    ],
  });

  const statementRefAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.statement-ref.acceptance",
    suiteTitle: "Statement References",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "object", "statement-ref"],
    expectedStatus: 200,
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: statementRefsLegacyConfigFile,
    variants: statementRefPlacements.map((placement, index) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement accepts ${placement.title} when it is a valid StatementRef`,
      transforms: placement.buildTransforms(buildStatementRefFixture(buildProofUuid(970 + index))),
      requirementRefs: statementRefRequirementRefs,
    })),
  });

  const statementRefObjectTypeCases = statementMutationFamily({
    familyId: "v2.statements.statement-ref.object-type",
    suiteTitle: "Statement References",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "object", "statement-ref", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: statementRefsLegacyConfigFile,
    variants: statementRefPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement rejects ${placement.title} when objectType does not exactly match StatementRef`,
      transforms: placement.buildTransforms({
        objectType: "statementref",
        id: buildProofUuid(972),
      }),
      requirementRefs: statementRefRequirementRefs,
    })),
  });

  const statementRefMissingIdCases = statementMutationFamily({
    familyId: "v2.statements.statement-ref.missing-id",
    suiteTitle: "Statement References",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "object", "statement-ref", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: statementRefsLegacyConfigFile,
    variants: statementRefPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement rejects ${placement.title} when id is missing`,
      transforms: placement.buildTransforms({
        objectType: "StatementRef",
      }),
      requirementRefs: statementRefRequirementRefs,
    })),
  });

  const statementRefInvalidIdCases = statementMutationFamily({
    familyId: "v2.statements.statement-ref.invalid-id",
    suiteTitle: "Statement References",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "object", "statement-ref", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: statementRefsLegacyConfigFile,
    variants: statementRefPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement rejects ${placement.title} when id is not a UUID`,
      transforms: placement.buildTransforms(buildStatementRefFixture("should fail")),
      requirementRefs: statementRefRequirementRefs,
    })),
  });

  const subStatementAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.substatement.acceptance",
    suiteTitle: "SubStatements",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "object", "substatement"],
    expectedStatus: 200,
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: subStatementsLegacyConfigFile,
    variants: [
      {
        idSuffix: "default",
        title: "A Statement accepts a valid SubStatement object",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
        ],
        requirementRefs: subStatementRequirementRefs,
      },
      {
        idSuffix: "context",
        title: "A Statement accepts a SubStatement that contains context",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              context: {
                language: "en-US",
              },
            }),
          },
        ],
        requirementRefs: subStatementRequirementRefs,
      },
      {
        idSuffix: "result",
        title: "A Statement accepts a SubStatement that contains result",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              result: buildResultFixture(),
            }),
          },
        ],
        requirementRefs: subStatementRequirementRefs,
      },
      {
        idSuffix: "statement-ref",
        title: "A Statement accepts a SubStatement whose object is a StatementRef",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              object: buildStatementRefFixture(buildProofUuid(973)),
            }),
          },
        ],
        requirementRefs: subStatementRequirementRefs,
      },
      {
        idSuffix: "agent",
        title: "A Statement accepts a SubStatement whose object is an Agent",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              object: buildAgentWithMbox("mailto:proof-substatement-agent@example.test"),
            }),
          },
        ],
        requirementRefs: subStatementRequirementRefs,
      },
      {
        idSuffix: "group",
        title: "A Statement accepts a SubStatement whose object is a Group",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              object: buildGroupWithMbox("mailto:proof-substatement-group@example.test"),
            }),
          },
        ],
        requirementRefs: subStatementRequirementRefs,
      },
    ],
  });

  const subStatementObjectTypeCases = statementMutationFamily({
    familyId: "v2.statements.substatement.object-type",
    suiteTitle: "SubStatements",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "object", "substatement", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: subStatementsLegacyConfigFile,
    variants: [
      {
        idSuffix: "statement",
        title: "A Statement rejects an objectType value that does not exactly match SubStatement",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              objectType: "substatement",
            }),
          },
        ],
        requirementRefs: subStatementObjectTypeRequirementRefs,
      },
    ],
  });

  const subStatementMissingFieldCases = statementMutationFamily({
    familyId: "v2.statements.substatement.missing-fields",
    suiteTitle: "SubStatements",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "object", "substatement", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: subStatementsLegacyConfigFile,
    variants: [
      {
        idSuffix: "actor",
        title: "A Statement rejects a SubStatement that omits actor",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "remove",
            path: ["object", "actor"],
          },
        ],
        requirementRefs: subStatementRequirementRefs,
      },
      {
        idSuffix: "verb",
        title: "A Statement rejects a SubStatement that omits verb",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "remove",
            path: ["object", "verb"],
          },
        ],
        requirementRefs: subStatementRequirementRefs,
      },
      {
        idSuffix: "object",
        title: "A Statement rejects a SubStatement that omits object",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture(),
          },
          {
            operation: "remove",
            path: ["object", "object"],
          },
        ],
        requirementRefs: subStatementRequirementRefs,
      },
    ],
  });

  const subStatementForbiddenPropertyCases = statementMutationFamily({
    familyId: "v2.statements.substatement.forbidden-properties",
    suiteTitle: "SubStatements",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "object", "substatement", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: subStatementsLegacyConfigFile,
    variants: [
      {
        idSuffix: "authority",
        title: "A Statement rejects a SubStatement that contains authority",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              authority: buildAgentWithMbox("mailto:proof-substatement-authority@example.test"),
            }),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00067",
            section: "Data 2.4.4.3.s8.b3",
            title: "SubStatements cannot use authority",
          },
        ],
      },
      {
        idSuffix: "version",
        title: "A Statement rejects a SubStatement that contains version",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              version: "1.0.0",
            }),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00068",
            section: "Data 2.4.4.3.s8.b3",
            title: "SubStatements cannot use version",
          },
        ],
      },
      {
        idSuffix: "stored",
        title: "A Statement rejects a SubStatement that contains stored",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              stored: "2013-05-18T05:32:34.804Z",
            }),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00069",
            section: "Data 2.4.4.3.s8.b3",
            title: "SubStatements cannot use stored",
          },
        ],
      },
      {
        idSuffix: "id",
        title: "A Statement rejects a SubStatement that contains id",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              id: buildProofUuid(974),
            }),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00070",
            section: "Data 2.4.4.3.s8.b3",
            title: "SubStatements cannot use id",
          },
        ],
      },
    ],
  });

  const subStatementNestedCase = statementMutationFamily({
    familyId: "v2.statements.substatement.nested",
    suiteTitle: "SubStatements",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "object", "substatement", "validation"],
    legacyTraceSuiteFile: objectRequirementsLegacySuiteFile,
    legacyTraceConfigFile: subStatementsLegacyConfigFile,
    variants: [
      {
        idSuffix: "substatement",
        title: "A Statement rejects a SubStatement whose object is another SubStatement",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              object: buildSubStatementFixture(),
            }),
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00071",
            section: "Data 2.4.4.3.s8.b4",
            title: "SubStatements cannot contain SubStatements",
          },
        ],
      },
    ],
  });

  const contextRegistrationRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00086",
      section: "Data 2.4.6",
      title: "Context registration values are UUIDs",
    },
  ];
  const contextTeamRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00087",
      section: "Data 2.4.6",
      title: "Context team values are Groups",
    },
  ];
  const contextActivitiesRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00088",
      section: "Data 2.4.6",
      title: "ContextActivities values are objects",
    },
  ];
  const contextRevisionRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00084",
      section: "Data 2.4.6",
      title: "Context revision values are strings and only apply to Activity objects",
    },
    {
      id: "XAPI-00089",
      section: "Data 2.4.6.s3.table1.row5",
      title: 'A "revision" property is a String',
    },
  ];
  const contextPlatformRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00085",
      section: "Data 2.4.6",
      title: "Context platform values are strings and only apply to Activity objects",
    },
    {
      id: "XAPI-00090",
      section: "Data 2.4.6.s3.table1.row6",
      title: 'A "platform" property is a String',
    },
  ];
  const contextStatementRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00092",
      section: "Data 2.4.6",
      title: "Context statement values are StatementRefs",
    },
  ];
  const contextActivityKeyRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00093",
      section: "Data 2.4.6.2",
      title: "ContextActivities only use parent, grouping, category, and other keys",
    },
  ];
  const contextActivityValueRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00094",
      section: "Data 2.4.6.2",
      title: "ContextActivities values are Activities or arrays of Activities",
    },
  ];
  const contextActivityRoundTripRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00096",
      section: "Data 2.4.6.2",
      title: "Retrieved ContextActivities values are arrays",
    },
  ];

  const invalidRegistrationCases = statementMutationFamily({
    familyId: "v2.statements.context.invalid-registration",
    suiteTitle: "Statement Context",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "registration", "validation"],
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextsLegacyConfigFile,
    variants: contextPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-object`,
        title: `A Statement rejects ${placement.title} registration when it is an object`,
        transforms: placement.buildTransforms({
          registration: {
            invalid: true,
          },
        }),
        requirementRefs: contextRegistrationRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-string`,
        title: `A Statement rejects ${placement.title} registration when it is not a UUID`,
        transforms: placement.buildTransforms({
          registration: "not-a-uuid",
        }),
        requirementRefs: contextRegistrationRequirementRefs,
      },
    ]),
  });

  const invalidTeamCases = statementMutationFamily({
    familyId: "v2.statements.context.invalid-team",
    suiteTitle: "Statement Context",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "team", "validation"],
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextsLegacyConfigFile,
    variants: contextPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-agent`,
        title: `A Statement rejects ${placement.title} team when it is an Agent`,
        transforms: placement.buildTransforms({
          team: buildAgentWithMbox(`mailto:${placement.idSuffix}-context-team-agent@example.test`),
        }),
        requirementRefs: contextTeamRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-object`,
        title: `A Statement rejects ${placement.title} team when it is not a Group`,
        transforms: placement.buildTransforms({
          team: {
            name: "not-a-group",
          },
        }),
        requirementRefs: contextTeamRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-string`,
        title: `A Statement rejects ${placement.title} team when it is a string`,
        transforms: placement.buildTransforms({
          team: "not-a-group",
        }),
        requirementRefs: contextTeamRequirementRefs,
      },
    ]),
  });

  const invalidContextActivitiesTypeCases = statementMutationFamily({
    familyId: "v2.statements.context.invalid-context-activities-type",
    suiteTitle: "Statement Context",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "context-activities", "validation"],
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextsLegacyConfigFile,
    variants: contextPlacements.map((placement) => ({
      idSuffix: `${placement.idSuffix}-string`,
      title: `A Statement rejects ${placement.title} contextActivities when it is not an object`,
      transforms: placement.buildTransforms({
        contextActivities: "not-an-object",
      }),
      requirementRefs: contextActivitiesRequirementRefs,
    })),
  });

  const invalidRevisionTypeCases = statementMutationFamily({
    familyId: "v2.statements.context.invalid-revision-type",
    suiteTitle: "Statement Context",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "revision", "validation"],
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextsLegacyConfigFile,
    variants: contextPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-number`,
        title: `A Statement rejects ${placement.title} revision when it is a number`,
        transforms: placement.buildTransforms({
          revision: 12,
        }),
        requirementRefs: contextRevisionRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-object`,
        title: `A Statement rejects ${placement.title} revision when it is an object`,
        transforms: placement.buildTransforms({
          revision: {
            invalid: true,
          },
        }),
        requirementRefs: contextRevisionRequirementRefs,
      },
    ]),
  });

  const revisionConstraintTargets = [
    {
      idSuffix: "statement-agent",
      title: "A Statement rejects a statement context revision when the statement object is an Agent",
      placement: "statement" as const,
      object: buildAgentWithMbox("mailto:context-revision-statement-agent@example.test"),
    },
    {
      idSuffix: "statement-group",
      title: "A Statement rejects a statement context revision when the statement object is a Group",
      placement: "statement" as const,
      object: buildGroupWithMbox("mailto:context-revision-statement-group@example.test"),
    },
    {
      idSuffix: "statement-statement-ref",
      title: "A Statement rejects a statement context revision when the statement object is a StatementRef",
      placement: "statement" as const,
      object: buildContextStatementRefFixture(buildProofUuid(929)),
    },
    {
      idSuffix: "statement-substatement",
      title: "A Statement rejects a statement context revision when the statement object is a SubStatement",
      placement: "statement" as const,
      object: buildSubStatementFixture(),
    },
    {
      idSuffix: "substatement-agent",
      title: "A Statement rejects a substatement context revision when the substatement object is an Agent",
      placement: "substatement" as const,
      object: buildAgentWithMbox("mailto:context-revision-substatement-agent@example.test"),
    },
    {
      idSuffix: "substatement-group",
      title: "A Statement rejects a substatement context revision when the substatement object is a Group",
      placement: "substatement" as const,
      object: buildGroupWithMbox("mailto:context-revision-substatement-group@example.test"),
    },
    {
      idSuffix: "substatement-statement-ref",
      title: "A Statement rejects a substatement context revision when the substatement object is a StatementRef",
      placement: "substatement" as const,
      object: buildContextStatementRefFixture(buildProofUuid(930)),
    },
  ];

  const revisionActivityOnlyRejectionCases = statementMutationFamily({
    familyId: "v2.statements.context.revision-activity-only",
    suiteTitle: "Statement Context",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "revision", "validation"],
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextsLegacyConfigFile,
    variants: revisionConstraintTargets.map((target) => ({
      idSuffix: target.idSuffix,
      title: target.title,
      transforms: buildContextPropertyConstraintTransforms(
        "revision",
        "proof-revision",
        target.object,
        target.placement,
      ),
      requirementRefs: contextRevisionRequirementRefs,
    })),
  });

  const revisionNoObjectTypeCases = statementMutationFamily({
    familyId: "v2.statements.context.revision-no-object-type",
    suiteTitle: "Statement Context",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "revision"],
    expectedStatus: 200,
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextsLegacyConfigFile,
    variants: [
      {
        idSuffix: "statement",
        title: "A Statement accepts a statement context revision when the statement object omits objectType",
        transforms: buildContextPropertyConstraintTransforms(
          "revision",
          "proof-revision",
          buildContextActivityFixture("https://example.test/xapi/activities/context-revision-no-object-type", false),
          "statement",
        ),
        requirementRefs: contextRevisionRequirementRefs,
      },
      {
        idSuffix: "substatement",
        title: "A Statement accepts a substatement context revision when the substatement object omits objectType",
        transforms: buildContextPropertyConstraintTransforms(
          "revision",
          "proof-revision",
          buildContextActivityFixture(
            "https://example.test/xapi/activities/context-substatement-revision-no-object-type",
            false,
          ),
          "substatement",
        ),
        requirementRefs: contextRevisionRequirementRefs,
      },
    ],
  });

  const invalidPlatformTypeCases = statementMutationFamily({
    familyId: "v2.statements.context.invalid-platform-type",
    suiteTitle: "Statement Context",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "platform", "validation"],
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextsLegacyConfigFile,
    variants: contextPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-number`,
        title: `A Statement rejects ${placement.title} platform when it is a number`,
        transforms: placement.buildTransforms({
          platform: 12,
        }),
        requirementRefs: contextPlatformRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-object`,
        title: `A Statement rejects ${placement.title} platform when it is an object`,
        transforms: placement.buildTransforms({
          platform: {
            invalid: true,
          },
        }),
        requirementRefs: contextPlatformRequirementRefs,
      },
    ]),
  });

  const platformConstraintTargets = [
    {
      idSuffix: "statement-agent",
      title: "A Statement rejects a statement context platform when the statement object is an Agent",
      placement: "statement" as const,
      object: buildAgentWithMbox("mailto:context-platform-statement-agent@example.test"),
    },
    {
      idSuffix: "statement-group",
      title: "A Statement rejects a statement context platform when the statement object is a Group",
      placement: "statement" as const,
      object: buildGroupWithMbox("mailto:context-platform-statement-group@example.test"),
    },
    {
      idSuffix: "statement-statement-ref",
      title: "A Statement rejects a statement context platform when the statement object is a StatementRef",
      placement: "statement" as const,
      object: buildContextStatementRefFixture(buildProofUuid(931)),
    },
    {
      idSuffix: "statement-substatement",
      title: "A Statement rejects a statement context platform when the statement object is a SubStatement",
      placement: "statement" as const,
      object: buildSubStatementFixture(),
    },
    {
      idSuffix: "substatement-agent",
      title: "A Statement rejects a substatement context platform when the substatement object is an Agent",
      placement: "substatement" as const,
      object: buildAgentWithMbox("mailto:context-platform-substatement-agent@example.test"),
    },
    {
      idSuffix: "substatement-group",
      title: "A Statement rejects a substatement context platform when the substatement object is a Group",
      placement: "substatement" as const,
      object: buildGroupWithMbox("mailto:context-platform-substatement-group@example.test"),
    },
    {
      idSuffix: "substatement-statement-ref",
      title: "A Statement rejects a substatement context platform when the substatement object is a StatementRef",
      placement: "substatement" as const,
      object: buildContextStatementRefFixture(buildProofUuid(932)),
    },
  ];

  const platformActivityOnlyRejectionCases = statementMutationFamily({
    familyId: "v2.statements.context.platform-activity-only",
    suiteTitle: "Statement Context",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "platform", "validation"],
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextsLegacyConfigFile,
    variants: platformConstraintTargets.map((target) => ({
      idSuffix: target.idSuffix,
      title: target.title,
      transforms: buildContextPropertyConstraintTransforms(
        "platform",
        "proof-platform",
        target.object,
        target.placement,
      ),
      requirementRefs: contextPlatformRequirementRefs,
    })),
  });

  const platformNoObjectTypeCases = statementMutationFamily({
    familyId: "v2.statements.context.platform-no-object-type",
    suiteTitle: "Statement Context",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "platform"],
    expectedStatus: 200,
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextsLegacyConfigFile,
    variants: [
      {
        idSuffix: "statement",
        title: "A Statement accepts a statement context platform when the statement object omits objectType",
        transforms: buildContextPropertyConstraintTransforms(
          "platform",
          "proof-platform",
          buildContextActivityFixture("https://example.test/xapi/activities/context-platform-no-object-type", false),
          "statement",
        ),
        requirementRefs: contextPlatformRequirementRefs,
      },
      {
        idSuffix: "substatement",
        title: "A Statement accepts a substatement context platform when the substatement object omits objectType",
        transforms: buildContextPropertyConstraintTransforms(
          "platform",
          "proof-platform",
          buildContextActivityFixture(
            "https://example.test/xapi/activities/context-substatement-platform-no-object-type",
            false,
          ),
          "substatement",
        ),
        requirementRefs: contextPlatformRequirementRefs,
      },
    ],
  });

  const invalidContextStatementRefCases = statementMutationFamily({
    familyId: "v2.statements.context.invalid-statement-ref",
    suiteTitle: "Statement Context",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "statement-ref", "validation"],
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextsLegacyConfigFile,
    variants: contextPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-object-type`,
        title: `A Statement rejects ${placement.title} statement when objectType does not exactly match StatementRef`,
        transforms: placement.buildTransforms({
          statement: {
            objectType: "statementref",
            id: buildProofUuid(933),
          },
        }),
        requirementRefs: contextStatementRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-id`,
        title: `A Statement rejects ${placement.title} statement when its id is not a UUID`,
        transforms: placement.buildTransforms({
          statement: buildContextStatementRefFixture("not-a-uuid"),
        }),
        requirementRefs: contextStatementRequirementRefs,
      },
    ]),
  });

  const timestampPropertyRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00022",
      section: "Data 2.4.s1.table1.row7",
      title: "Statement timestamps are timestamps",
    },
  ];
  const timestampIsoRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00123",
      section: "Data 4.5.s1.b1",
      title: "Timestamps conform to ISO 8601",
    },
  ];
  const versionRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00101",
      section: "Data 2.4.10.s2.b1",
      title: "Statement version values are restricted to accepted versions",
    },
  ];
  const versionRetentionRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00332",
      section: "Data 2.4.10",
      title: "Retrieved statements retain the submitted version property",
    },
  ];
  const storedOverwriteRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00097",
      section: "Data 2.4.8.s3.b2",
      title: "LRS assigns the stored property when statements are received",
    },
    {
      id: "XAPI-00023",
      section: "Data 2.4.8.s2",
      title: 'A "stored" property is a valid TimeStamp assigned by the LRS',
    },
  ];

  const timestampPropertyInvalidCases = statementMutationFamily({
    familyId: "v2.statements.timestamp.invalid-format",
    suiteTitle: "Statement Metadata",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "timestamp", "validation"],
    legacyTraceSuiteFile: timestampRequirementsLegacySuiteFile,
    legacyTraceConfigFile: timestampPropertyLegacyConfigFile,
    variants: timestampPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-string`,
        title: `A Statement rejects ${placement.title} when it is a non-timestamp string`,
        transforms: placement.buildTransforms(invalidLegacyString),
        requirementRefs: timestampPropertyRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-date`,
        title: `A Statement rejects ${placement.title} when it is not a valid date`,
        transforms: placement.buildTransforms(invalidLegacyDate),
        requirementRefs: timestampPropertyRequirementRefs,
      },
    ]),
  });

  const timestampPropertyAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.timestamp.acceptance",
    suiteTitle: "Statement Metadata",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "timestamp", "acceptance"],
    expectedStatus: 200,
    legacyTraceSuiteFile: timestampRequirementsLegacySuiteFile,
    legacyTraceConfigFile: timestampPropertyLegacyConfigFile,
    variants: timestampPlacements.map((placement) => ({
      idSuffix: `${placement.idSuffix}-future`,
      title: `A Statement accepts ${placement.title} when it is a future timestamp`,
      transforms: placement.buildTransforms(futureAcceptedTimestamp),
      requirementRefs: timestampPropertyRequirementRefs,
    })),
  });

  const timestampIso8601Cases = statementMutationFamily({
    familyId: "v2.statements.timestamp.iso8601",
    suiteTitle: "Statement Metadata",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "timestamp", "iso8601"],
    legacyTraceSuiteFile: timestampRequirementsLegacySuiteFile,
    legacyTraceConfigFile: timestampsLegacyConfigFile,
    variants: timestampPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-negative-zero`,
        title: `A Statement rejects ${placement.title} when it uses a -00 offset`,
        transforms: placement.buildTransforms(invalidNegativeZeroTimestamp),
        requirementRefs: timestampIsoRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-negative-zero-compact`,
        title: `A Statement rejects ${placement.title} when it uses a -0000 offset`,
        transforms: placement.buildTransforms(invalidNegativeZeroTimestampCompact),
        requirementRefs: timestampIsoRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-negative-zero-extended`,
        title: `A Statement rejects ${placement.title} when it uses a -00:00 offset`,
        transforms: placement.buildTransforms(invalidNegativeZeroTimestampExtended),
        requirementRefs: timestampIsoRequirementRefs,
      },
    ]),
  });

  const timestampIso8601AcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.timestamp.iso8601-acceptance",
    suiteTitle: "Statement Metadata",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "timestamp", "iso8601", "acceptance"],
    expectedStatus: 200,
    legacyTraceSuiteFile: timestampRequirementsLegacySuiteFile,
    legacyTraceConfigFile: timestampsLegacyConfigFile,
    variants: timestampPlacements.map((placement) => ({
      idSuffix: `${placement.idSuffix}-rfc3339`,
      title: `A Statement accepts ${placement.title} when it is a valid RFC 3339 timestamp`,
      transforms: placement.buildTransforms(validRfc3339Timestamp),
      requirementRefs: timestampIsoRequirementRefs,
    })),
  });

  const versionAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.version.acceptance",
    suiteTitle: "Statement Metadata",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "version", "acceptance"],
    expectedStatus: 200,
    legacyTraceSuiteFile: versionRequirementsLegacySuiteFile,
    legacyTraceConfigFile: versionPropertyLegacyConfigFile,
    variants: [
      {
        idSuffix: "1-0",
        title: "A Statement accepts version 1.0",
        transforms: [
          {
            operation: "set",
            path: ["version"],
            value: "1.0",
          },
        ],
        requirementRefs: versionRequirementRefs,
      },
      {
        idSuffix: "1-0-9",
        title: "A Statement accepts version 1.0.9",
        transforms: [
          {
            operation: "set",
            path: ["version"],
            value: "1.0.9",
          },
        ],
        requirementRefs: versionRequirementRefs,
      },
    ],
  });

  const versionInvalidCases = statementMutationFamily({
    familyId: "v2.statements.version.invalid",
    suiteTitle: "Statement Metadata",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "version", "validation"],
    legacyTraceSuiteFile: versionRequirementsLegacySuiteFile,
    legacyTraceConfigFile: versionPropertyLegacyConfigFile,
    variants: [
      {
        idSuffix: "string",
        title: "A Statement rejects version strings outside the accepted version range",
        transforms: [
          {
            operation: "set",
            path: ["version"],
            value: invalidLegacyString,
          },
        ],
        requirementRefs: versionRequirementRefs,
      },
      {
        idSuffix: "0-9-9",
        title: "A Statement rejects version 0.9.9",
        transforms: [
          {
            operation: "set",
            path: ["version"],
            value: "0.9.9",
          },
        ],
        requirementRefs: versionRequirementRefs,
      },
      {
        idSuffix: "1-1-0",
        title: "A Statement rejects version 1.1.0",
        transforms: [
          {
            operation: "set",
            path: ["version"],
            value: "1.1.0",
          },
        ],
        requirementRefs: versionRequirementRefs,
      },
    ],
  });

  const versionRoundTripCase = statementRoundTripCase({
    caseId: "v2.statements.version.retained-roundtrip",
    title: "The Statements resource retains version when a statement is accepted and later retrieved",
    specVersion,
    queryParam: "statementId",
    requirementRefs: versionRetentionRequirementRefs,
    tags: ["v2.0.0", "statements", "version", "query", "retrieval"],
    legacyTraceSuiteFile: versionRequirementsLegacySuiteFile,
    transforms: [
      {
        operation: "set",
        path: ["id"],
        value: buildProofUuid(212),
      },
      {
        operation: "set",
        path: ["version"],
        value: "2.0.0",
      },
      {
        operation: "set",
        path: ["verb", "id"],
        value: "https://example.test/xapi/verbs/version-retained-roundtrip",
      },
    ],
    queryJsonPathEquals: [
      {
        path: ["version"],
        equals: "2.0.0",
      },
    ],
    capabilityFlags: ["version", "query", "retrieval"],
    notes: ["proof-slice statement version roundtrip"],
  });

  const storedPostOverwriteStatement = buildProofStatement(210, [
    {
      operation: "set",
      path: ["stored"],
      value: overwrittenStoredTimestamp,
    },
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/stored-post-overwrite",
    },
  ]);
  const storedPutOverwriteStatement = buildProofStatement(211, [
    {
      operation: "set",
      path: ["stored"],
      value: overwrittenStoredTimestamp,
    },
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/stored-put-overwrite",
    },
  ]);

  const storedPostOverwriteCase = requestSequenceCase({
    caseId: "v2.statements.stored.post-overwrites-client-value",
    title: "The Statements resource overwrites a submitted stored value on POST",
    specVersion,
    requirementRefs: storedOverwriteRequirementRefs,
    tags: ["v2.0.0", "statements", "stored", "post", "retrieval"],
    capabilityFlags: ["stored", "query", "retrieval"],
    legacyTraceSuiteFile: storedRequirementsLegacySuiteFile,
    notes: ["proof-slice stored property overwrite on POST"],
    steps: [
      {
        request: buildStatementPostRequest(storedPostOverwriteStatement),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([storedPostOverwriteStatement.id]),
        },
      },
      {
        request: buildStatementGetRequest(storedPostOverwriteStatement.id),
        assertion: {
          status: 200,
          jsonPathNotEquals: [
            {
              path: ["stored"],
              equals: overwrittenStoredTimestamp,
            },
            {
              path: ["stored"],
              equals: undefined,
            },
          ],
        },
      },
    ],
  });

  const storedPutOverwriteCase = requestSequenceCase({
    caseId: "v2.statements.stored.put-overwrites-client-value",
    title: "The Statements resource overwrites a submitted stored value on PUT",
    specVersion,
    requirementRefs: storedOverwriteRequirementRefs,
    tags: ["v2.0.0", "statements", "stored", "put", "retrieval"],
    capabilityFlags: ["stored", "query", "retrieval"],
    legacyTraceSuiteFile: storedRequirementsLegacySuiteFile,
    notes: ["proof-slice stored property overwrite on PUT"],
    steps: [
      {
        request: buildStatementPutRequest(storedPutOverwriteStatement.id, storedPutOverwriteStatement),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildStatementGetRequest(storedPutOverwriteStatement.id),
        assertion: {
          status: 200,
          jsonPathNotEquals: [
            {
              path: ["stored"],
              equals: overwrittenStoredTimestamp,
            },
            {
              path: ["stored"],
              equals: undefined,
            },
          ],
        },
      },
    ],
  });

  const generatedStatementIdRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00026",
      section: "Data 2.4.1.s1",
      title: "Statement POST requests may omit id and receive a generated UUID",
    },
  ];
  const uuidStringFormRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00029",
      section: "Data 2.4.1.s1",
      title: "All UUID types are in standard string form",
    },
  ];
  const uuidRfc4122RequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00030",
      section: "Data 2.4.1.s1",
      title: "All UUID types follow the requirements of RFC4122",
    },
  ];

  const generatedStatementIdRoundTripCase = statementGeneratedIdRoundTripCase({
    caseId: "v2.statements.id.generated-roundtrip",
    title:
      "The Statements resource generates a UUID for a POST statement that omits id and returns the stored statement for that UUID",
    specVersion,
    requirementRefs: generatedStatementIdRequirementRefs,
    tags: ["v2.0.0", "statements", "id", "generation", "query"],
    legacyTraceSuiteFile: idRequirementsLegacySuiteFile,
    transforms: [
      {
        operation: "set",
        path: ["verb", "id"],
        value: "https://example.test/xapi/verbs/generated-id-roundtrip",
      },
    ],
    notes: ["proof-slice generated statement id roundtrip"],
  });

  const statementRefUuidStringFormCases = statementMutationFamily({
    familyId: "v2.statements.id.statement-ref.string-form",
    suiteTitle: "Statement Id Requirements",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "id", "statement-ref", "validation"],
    legacyTraceSuiteFile: idRequirementsLegacySuiteFile,
    legacyTraceConfigFile: uuidsLegacyConfigFile,
    variants: statementRefPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-numeric`,
        title: `A Statement rejects ${placement.title} when StatementRef id is numeric`,
        transforms: placement.buildTransforms({
          objectType: "StatementRef",
          id: invalidUuidNumeric,
        }),
        requirementRefs: uuidStringFormRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-object`,
        title: `A Statement rejects ${placement.title} when StatementRef id is an object`,
        transforms: placement.buildTransforms({
          objectType: "StatementRef",
          id: invalidUuidObject,
        }),
        requirementRefs: uuidStringFormRequirementRefs,
      },
    ]),
  });

  const statementRefUuidRfc4122Cases = statementMutationFamily({
    familyId: "v2.statements.id.statement-ref.rfc4122",
    suiteTitle: "Statement Id Requirements",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "id", "statement-ref", "validation"],
    legacyTraceSuiteFile: idRequirementsLegacySuiteFile,
    legacyTraceConfigFile: uuidsLegacyConfigFile,
    variants: statementRefPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-too-many-digits`,
        title: `A Statement rejects ${placement.title} when StatementRef id has too many digits`,
        transforms: placement.buildTransforms({
          objectType: "StatementRef",
          id: invalidUuidTooManyDigits,
        }),
        requirementRefs: uuidRfc4122RequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-invalid-letter`,
        title: `A Statement rejects ${placement.title} when StatementRef id contains invalid hexadecimal letters`,
        transforms: placement.buildTransforms({
          objectType: "StatementRef",
          id: invalidUuidInvalidLetter,
        }),
        requirementRefs: uuidRfc4122RequirementRefs,
      },
    ]),
  });

  const contextRegistrationUuidStringFormCases = statementMutationFamily({
    familyId: "v2.statements.id.context-registration.string-form",
    suiteTitle: "Statement Id Requirements",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "id", "context", "registration", "validation"],
    legacyTraceSuiteFile: idRequirementsLegacySuiteFile,
    legacyTraceConfigFile: uuidsLegacyConfigFile,
    variants: contextPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-numeric`,
        title: `A Statement rejects ${placement.title} when registration is numeric`,
        transforms: placement.buildTransforms({
          registration: invalidUuidNumeric,
        }),
        requirementRefs: uuidStringFormRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-object`,
        title: `A Statement rejects ${placement.title} when registration is an object`,
        transforms: placement.buildTransforms({
          registration: invalidUuidObject,
        }),
        requirementRefs: uuidStringFormRequirementRefs,
      },
    ]),
  });

  const contextRegistrationUuidRfc4122Cases = statementMutationFamily({
    familyId: "v2.statements.id.context-registration.rfc4122",
    suiteTitle: "Statement Id Requirements",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "id", "context", "registration", "validation"],
    legacyTraceSuiteFile: idRequirementsLegacySuiteFile,
    legacyTraceConfigFile: uuidsLegacyConfigFile,
    variants: contextPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-too-many-digits`,
        title: `A Statement rejects ${placement.title} when registration has too many digits`,
        transforms: placement.buildTransforms({
          registration: invalidUuidTooManyDigits,
        }),
        requirementRefs: uuidRfc4122RequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-invalid-letter`,
        title: `A Statement rejects ${placement.title} when registration contains invalid hexadecimal letters`,
        transforms: placement.buildTransforms({
          registration: invalidUuidInvalidLetter,
        }),
        requirementRefs: uuidRfc4122RequirementRefs,
      },
    ]),
  });

  const contextStatementUuidStringFormCases = statementMutationFamily({
    familyId: "v2.statements.id.context-statement.string-form",
    suiteTitle: "Statement Id Requirements",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "id", "context", "statement-ref", "validation"],
    legacyTraceSuiteFile: idRequirementsLegacySuiteFile,
    legacyTraceConfigFile: uuidsLegacyConfigFile,
    variants: contextPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-numeric`,
        title: `A Statement rejects ${placement.title} when context statement id is numeric`,
        transforms: placement.buildTransforms({
          statement: {
            objectType: "StatementRef",
            id: invalidUuidNumeric,
          },
        }),
        requirementRefs: uuidStringFormRequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-object`,
        title: `A Statement rejects ${placement.title} when context statement id is an object`,
        transforms: placement.buildTransforms({
          statement: {
            objectType: "StatementRef",
            id: invalidUuidObject,
          },
        }),
        requirementRefs: uuidStringFormRequirementRefs,
      },
    ]),
  });

  const contextStatementUuidRfc4122Cases = statementMutationFamily({
    familyId: "v2.statements.id.context-statement.rfc4122",
    suiteTitle: "Statement Id Requirements",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "id", "context", "statement-ref", "validation"],
    legacyTraceSuiteFile: idRequirementsLegacySuiteFile,
    legacyTraceConfigFile: uuidsLegacyConfigFile,
    variants: contextPlacements.flatMap((placement) => [
      {
        idSuffix: `${placement.idSuffix}-too-many-digits`,
        title: `A Statement rejects ${placement.title} when context statement id has too many digits`,
        transforms: placement.buildTransforms({
          statement: buildContextStatementRefFixture(invalidUuidTooManyDigits),
        }),
        requirementRefs: uuidRfc4122RequirementRefs,
      },
      {
        idSuffix: `${placement.idSuffix}-invalid-letter`,
        title: `A Statement rejects ${placement.title} when context statement id contains invalid hexadecimal letters`,
        transforms: placement.buildTransforms({
          statement: buildContextStatementRefFixture(invalidUuidInvalidLetter),
        }),
        requirementRefs: uuidRfc4122RequirementRefs,
      },
    ]),
  });

  const contextActivityKeyAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.context.context-activities-keys",
    suiteTitle: "Statement Context Activities",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "context-activities", "keys"],
    expectedStatus: 200,
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextActivitiesLegacyConfigFile,
    variants: [
      ...contextPlacements.flatMap((placement) =>
        contextActivityKinds.map((kind) => ({
          idSuffix: `${placement.idSuffix}-${kind}`,
          title: `A Statement accepts ${placement.title} contextActivities ${kind} values`,
          transforms: placement.buildTransforms(
            buildContextActivitiesFixture({
              [kind]: buildContextActivityFixture(
                `https://example.test/xapi/activities/${placement.idSuffix}-context-${kind}`,
              ),
            } as JsonObject),
          ),
          requirementRefs: contextActivityKeyRequirementRefs,
        })),
      ),
      ...contextPlacements.map((placement) => ({
        idSuffix: `${placement.idSuffix}-all`,
        title: `A Statement accepts ${placement.title} contextActivities with parent, grouping, category, and other`,
        transforms: placement.buildTransforms(
          buildContextActivitiesFixture({
            parent: buildContextActivityFixture(
              `https://example.test/xapi/activities/${placement.idSuffix}-context-parent-all`,
            ),
            grouping: buildContextActivityFixture(
              `https://example.test/xapi/activities/${placement.idSuffix}-context-grouping-all`,
            ),
            category: buildContextActivityFixture(
              `https://example.test/xapi/activities/${placement.idSuffix}-context-category-all`,
            ),
            other: buildContextActivityFixture(
              `https://example.test/xapi/activities/${placement.idSuffix}-context-other-all`,
            ),
          }),
        ),
        requirementRefs: contextActivityKeyRequirementRefs,
      })),
    ],
  });

  const contextActivityInvalidKeyCases = statementMutationFamily({
    familyId: "v2.statements.context.context-activities-invalid-key",
    suiteTitle: "Statement Context Activities",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "context-activities", "keys", "validation"],
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextActivitiesLegacyConfigFile,
    variants: contextPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement rejects ${placement.title} contextActivities keys outside parent, grouping, category, and other`,
      transforms: placement.buildTransforms(
        buildContextActivitiesFixture({
          invalid: buildContextActivityFixture(
            `https://example.test/xapi/activities/${placement.idSuffix}-context-invalid-key`,
          ),
        }),
      ),
      requirementRefs: contextActivityKeyRequirementRefs,
    })),
  });

  const contextActivityArrayValueCases = statementMutationFamily({
    familyId: "v2.statements.context.context-activities-values",
    suiteTitle: "Statement Context Activities",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "context-activities", "values"],
    expectedStatus: 200,
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextActivitiesLegacyConfigFile,
    variants: contextPlacements.flatMap((placement) =>
      contextActivityKinds.map((kind) => ({
        idSuffix: `${placement.idSuffix}-${kind}-array`,
        title: `A Statement accepts ${placement.title} contextActivities ${kind} arrays of Activities`,
        transforms: placement.buildTransforms(
          buildContextActivitiesFixture({
            [kind]: [
              buildContextActivityFixture(
                `https://example.test/xapi/activities/${placement.idSuffix}-context-${kind}-array`,
              ),
            ],
          } as JsonObject),
        ),
        requirementRefs: contextActivityValueRequirementRefs,
      })),
    ),
  });

  const contextActivityInvalidValueCases = statementMutationFamily({
    familyId: "v2.statements.context.context-activities-invalid-value",
    suiteTitle: "Statement Context Activities",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "context", "context-activities", "values", "validation"],
    legacyTraceSuiteFile: contextLegacySuiteFile,
    legacyTraceConfigFile: contextActivitiesLegacyConfigFile,
    variants: contextPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement rejects ${placement.title} contextActivities arrays when they contain non-Activity values`,
      transforms: placement.buildTransforms(
        buildContextActivitiesFixture({
          category: [
            buildContextActivityFixture(
              `https://example.test/xapi/activities/${placement.idSuffix}-context-category-invalid-array`,
            ),
            "not-an-activity",
          ],
        }),
      ),
      requirementRefs: contextActivityValueRequirementRefs,
    })),
  });

  const contextActivitiesRoundTripCases = contextPlacements.flatMap((placement) =>
    contextActivityKinds.map((kind) => {
      const activityId = `https://example.test/xapi/activities/${placement.idSuffix}-context-roundtrip-${kind}`;
      const statementId = buildProofUuid(
        placement.idSuffix === "statement"
          ? 934 + contextActivityKinds.indexOf(kind)
          : 938 + contextActivityKinds.indexOf(kind),
      );

      return statementRoundTripCase({
        caseId: `v2.statements.context.context-activities-roundtrip.${placement.idSuffix}-${kind}`,
        title: `The Statements resource returns ${placement.title} contextActivities ${kind} values as arrays`,
        specVersion,
        queryParam: "statementId",
        requirementRefs: contextActivityRoundTripRequirementRefs,
        tags: ["v2.0.0", "statements", "context", "context-activities", "retrieval"],
        capabilityFlags: ["query", "retrieval", "context-activities"],
        legacyTraceSuiteFile: contextLegacySuiteFile,
        legacyTraceConfigFile: contextActivitiesLegacyConfigFile,
        transforms: [
          {
            operation: "set",
            path: ["id"],
            value: statementId,
          },
          ...placement.buildTransforms(
            buildContextActivitiesFixture({
              [kind]: buildContextActivityFixture(activityId),
            } as JsonObject),
          ),
        ],
        queryJsonPathEquals: [
          {
            path: buildContextActivitiesRoundTripPath(placement.idSuffix, kind),
            equals: [buildContextActivityFixture(activityId)],
          },
        ],
        notes: ["proof-slice contextActivities retrieval returns arrays"],
      });
    }),
  );

  const additionalDataTypeIriRequirementRefs: RequirementRef[] = [
    {
      id: "LEGACY-DATATYPES-IRI-COMPARISON",
      section: "Additional Requirements for Data Types - IRIs",
      title: "IRIs are compared using simple string comparison or syntax-based normalization",
    },
  ];
  const additionalDataTypeDurationRequirementRefs: RequirementRef[] = [
    {
      id: "LEGACY-DATATYPES-DURATION-PRECISION",
      section: "Additional Requirements for Data Types - Duration",
      title: "Durations with precision beyond 0.01 seconds are accepted and may be truncated without rounding",
    },
  ];
  const additionalDataTypeTimestampRequirementRefs: RequirementRef[] = [
    {
      id: "LEGACY-DATATYPES-TIMESTAMP-UTC",
      section: "Additional Requirements for Data Types - Timestamps",
      title: "Retrieved timestamps preserve UTC equivalence",
    },
  ];
  const signedStatementPresenceRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00115",
      section: "Data 2.6.s4.b1",
      title: "Signed statements use a JWS attachment with application/octet-stream and raw signature data",
    },
  ];
  const signedStatementPayloadRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00116",
      section: "Data 2.6.s4.b3",
      title:
        "The signed statement JWS payload is a valid JSON serialization of the statement before the signature is added",
    },
  ];
  const signedStatementAlgorithmRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00117",
      section: "Data 2.6.s4.b4",
      title: 'The signed statement JWS algorithm is one of "RS256", "RS384", or "RS512"',
    },
  ];
  const specialDataTypesExtensionRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00119",
      section: "Data 4.1, XAPI-00119",
      title: "Extensions may contain null, empty strings, and empty objects",
    },
    {
      id: "XAPI-00120",
      section: "Data 4.1.s2",
      title: 'An Extension is defined as an Object of any "extensions" property',
    },
  ];
  const specialDataTypesTimestampRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00122",
      section: "Data 4.5.s1.b3",
      title: "Timestamps preserve precision to at least milliseconds when statements are recalled",
    },
  ];

  const iriComparisonSlug = buildProofUuid(5000);
  const iriComparisonSimple = `http://example.com/path/${iriComparisonSlug}`;
  const iriComparisonNormalized = `http://example.com/path/../${iriComparisonSlug}`;
  const iriComparisonStatement = buildProofStatement(5000, [
    {
      operation: "set",
      path: ["object"],
      value: buildActivityObjectFixture(iriComparisonNormalized),
    },
  ]);

  const additionalIriComparisonCase = requestSequenceCase({
    caseId: "v2.statements.additional-data-types.iri-comparison",
    title: "The Activities Resource supports retrieval after statements store equivalent IRIs",
    specVersion,
    requirementRefs: additionalDataTypeIriRequirementRefs,
    tags: ["v2.0.0", "statements", "additional-data-types", "iri"],
    capabilityFlags: ["activities", "retrieval", "iri"],
    legacyTraceSuiteFile: additionalDataTypesLegacySuiteFile,
    notes: ["proof-slice additional data types iri comparison"],
    steps: [
      {
        request: buildStatementPostRequest(iriComparisonStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildActivitiesGetRequest(iriComparisonSimple),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["id"],
              equals: iriComparisonSimple,
            },
          ],
        },
      },
      {
        request: buildActivitiesGetRequest(iriComparisonNormalized),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["id"],
              equals: iriComparisonNormalized,
            },
          ],
        },
      },
    ],
  });

  const highPrecisionDuration = "P1DT12H36M0.12567S";
  const highPrecisionDurationStatement = buildProofStatement(5001, [
    {
      operation: "set",
      path: ["result"],
      value: buildResultFixture({
        duration: highPrecisionDuration,
      }),
    },
  ]);

  const additionalHighPrecisionDurationAcceptedCase = singleRequestCase({
    caseId: "v2.statements.additional-data-types.duration-high-precision-accepted",
    title: "The Statements resource accepts Durations with precision beyond 0.01 seconds",
    specVersion,
    requirementRefs: additionalDataTypeDurationRequirementRefs,
    tags: ["v2.0.0", "statements", "additional-data-types", "duration"],
    capabilityFlags: ["duration", "validation"],
    legacyTraceSuiteFile: additionalDataTypesLegacySuiteFile,
    request: buildStatementPostRequest(highPrecisionDurationStatement),
    assertion: {
      status: 200,
    },
    notes: ["proof-slice additional data types duration precision acceptance"],
  });

  const additionalHighPrecisionDurationRoundTripCase = requestSequenceCase({
    caseId: "v2.statements.additional-data-types.duration-high-precision-roundtrip",
    title: "The Statements resource returns stored high-precision Durations without rounding them upward",
    specVersion,
    requirementRefs: additionalDataTypeDurationRequirementRefs,
    tags: ["v2.0.0", "statements", "additional-data-types", "duration", "retrieval"],
    capabilityFlags: ["duration", "retrieval"],
    legacyTraceSuiteFile: additionalDataTypesLegacySuiteFile,
    notes: ["proof-slice additional data types duration precision roundtrip"],
    steps: [
      {
        request: buildStatementPostRequest(highPrecisionDurationStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementGetRequest(highPrecisionDurationStatement.id),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["result", "duration"],
              equals: highPrecisionDuration,
            },
          ],
        },
      },
    ],
  });

  const signedDurationPayloadStatement = buildProofStatement(5002, [
    {
      operation: "set",
      path: ["result"],
      value: buildResultFixture({
        duration: "P1DT12H36M0.12S",
      }),
    },
  ]);
  const signedDurationSubmittedStatement = buildProofStatement(5002, [
    {
      operation: "set",
      path: ["result"],
      value: buildResultFixture({
        duration: "P1DT12H36M0.1237S",
      }),
    },
  ]);

  const additionalSignedDurationComparisonCase = singleRequestCase({
    caseId: "v2.statements.additional-data-types.signed-duration-comparison-truncates-hundredths",
    title: "The Statements resource compares signed statement Durations only through the hundredths place",
    specVersion,
    requirementRefs: additionalDataTypeDurationRequirementRefs,
    tags: ["v2.0.0", "statements", "additional-data-types", "duration", "signed"],
    capabilityFlags: ["duration", "signed"],
    legacyTraceSuiteFile: additionalDataTypesLegacySuiteFile,
    request: buildSignedStatementPostRequest(signedDurationSubmittedStatement, {
      signaturePayload: signedDurationPayloadStatement,
    }),
    assertion: {
      status: 200,
    },
    notes: ["proof-slice additional data types signed duration comparison"],
  });

  const utcTimestampOriginal = "2023-05-04T12:00:00-05:00";
  const utcTimestampNormalized = "2023-05-04T17:00:00.000Z";
  const utcTimestampStatement = buildProofStatement(5003, [
    {
      operation: "set",
      path: ["timestamp"],
      value: utcTimestampOriginal,
    },
  ]);

  const additionalTimestampUtcCase = requestSequenceCase({
    caseId: "v2.statements.additional-data-types.timestamp-utc-roundtrip",
    title: "The Statements resource returns timestamps in UTC-equivalent form when recalled",
    specVersion,
    requirementRefs: additionalDataTypeTimestampRequirementRefs,
    tags: ["v2.0.0", "statements", "additional-data-types", "timestamp"],
    capabilityFlags: ["timestamp", "retrieval"],
    legacyTraceSuiteFile: additionalDataTypesLegacySuiteFile,
    notes: ["proof-slice additional data types timestamp utc equivalence"],
    steps: [
      {
        request: buildStatementPostRequest(utcTimestampStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementGetRequest(utcTimestampStatement.id),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["timestamp"],
              equals: utcTimestampNormalized,
            },
          ],
        },
      },
    ],
  });

  const buildStatementPutAcceptanceCase = (options: {
    caseId: string;
    title: string;
    requirementRefs: RequirementRef[];
    tags: string[];
    capabilityFlags: string[];
    statement: JsonObject;
    legacyTraceSuiteFile: string;
    notes: string[];
  }) => {
    const statementId = options.statement.id;
    if (typeof statementId !== "string") {
      throw new Error("Statement PUT proof cases require a statement id");
    }

    return singleRequestCase({
      caseId: options.caseId,
      title: options.title,
      specVersion,
      requirementRefs: options.requirementRefs,
      tags: options.tags,
      capabilityFlags: options.capabilityFlags,
      legacyTraceSuiteFile: options.legacyTraceSuiteFile,
      request: buildStatementPutRequest(statementId, options.statement),
      assertion: {
        status: 204,
      },
      notes: options.notes,
    });
  };

  interface ExtensionAcceptancePlacement {
    idSuffix: string;
    title: string;
    buildStatement(sequence: number, extensions: JsonObject): JsonObject;
  }

  const extensionAcceptancePlacements: ExtensionAcceptancePlacement[] = [
    {
      idSuffix: "statement-activity",
      title: "statement activity extensions",
      buildStatement(sequence, extensions) {
        return buildProofStatement(sequence, [
          {
            operation: "set",
            path: ["object"],
            value: buildActivityObjectFixture(`https://example.test/xapi/activities/special-data-types/${sequence}`, {
              definition: buildActivityDefinitionFixture({
                extensions,
              }),
            }),
          },
        ]);
      },
    },
    {
      idSuffix: "statement-result",
      title: "statement result extensions",
      buildStatement(sequence, extensions) {
        return buildProofStatement(sequence, [
          {
            operation: "set",
            path: ["result"],
            value: buildResultFixture({
              extensions,
            }),
          },
        ]);
      },
    },
    {
      idSuffix: "statement-context",
      title: "statement context extensions",
      buildStatement(sequence, extensions) {
        return buildProofStatement(sequence, [
          {
            operation: "set",
            path: ["context"],
            value: {
              extensions,
            },
          },
        ]);
      },
    },
    {
      idSuffix: "substatement-activity",
      title: "statement substatement activity extensions",
      buildStatement(sequence, extensions) {
        return buildProofStatement(sequence, [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              object: buildActivityObjectFixture(
                `https://example.test/xapi/activities/special-data-types/substatement/${sequence}`,
                {
                  definition: buildActivityDefinitionFixture({
                    extensions,
                  }),
                },
              ),
            }),
          },
        ]);
      },
    },
    {
      idSuffix: "substatement-result",
      title: "statement substatement result extensions",
      buildStatement(sequence, extensions) {
        return buildProofStatement(sequence, [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              result: buildResultFixture({
                extensions,
              }),
            }),
          },
        ]);
      },
    },
    {
      idSuffix: "substatement-context",
      title: "statement substatement context extensions",
      buildStatement(sequence, extensions) {
        return buildProofStatement(sequence, [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              context: {
                extensions,
              },
            }),
          },
        ]);
      },
    },
  ];

  const extensionAcceptanceVariants = [
    {
      idSuffix: "empty-extensions",
      label: "extensions can be empty object",
      buildExtensions: () => ({}),
    },
    {
      idSuffix: "empty-string",
      label: "extension values can be empty string",
      buildExtensions: () => ({
        "http://example.com/ex": "",
      }),
    },
    {
      idSuffix: "null",
      label: "extension values can be null",
      buildExtensions: () => ({
        "http://example.com/ex": null,
      }),
    },
    {
      idSuffix: "empty-object",
      label: "extension values can be empty object",
      buildExtensions: () => ({
        "http://example.com/ex": {},
      }),
    },
  ] as const;

  let extensionAcceptanceSequence = 5100;
  const specialExtensionAcceptanceCases = extensionAcceptancePlacements.flatMap((placement) =>
    extensionAcceptanceVariants.map((variant) => {
      const statement = placement.buildStatement(extensionAcceptanceSequence++, variant.buildExtensions());

      return buildStatementPutAcceptanceCase({
        caseId: `v2.statements.special-data-types.extensions.${placement.idSuffix}.${variant.idSuffix}`,
        title: `The Statements resource accepts PUT when ${placement.title} ${variant.label}`,
        requirementRefs: specialDataTypesExtensionRequirementRefs,
        tags: ["v2.0.0", "statements", "special-data-types", "extensions", "put"],
        capabilityFlags: ["extensions", "put", "special-data-types"],
        statement,
        legacyTraceSuiteFile: specialDataTypesLegacySuiteFile,
        notes: [`proof-slice special data types ${placement.idSuffix} ${variant.idSuffix}`],
      });
    }),
  );

  const millisecondPrecisionOriginal = "2023-05-04T12:00:00.123456-05:00";
  const millisecondPrecisionNormalized = "2023-05-04T17:00:00.123Z";
  const timestampPrecisionStatement = buildProofStatement(5200, [
    {
      operation: "set",
      path: ["timestamp"],
      value: millisecondPrecisionOriginal,
    },
  ]);
  const storedPrecisionStatement = buildProofStatement(5201, [
    {
      operation: "set",
      path: ["timestamp"],
      value: millisecondPrecisionOriginal,
    },
  ]);

  const specialTimestampPrecisionCase = requestSequenceCase({
    caseId: "v2.statements.special-data-types.timestamp-millisecond-precision",
    title: "The Statements resource recalls timestamps with at least millisecond precision",
    specVersion,
    requirementRefs: specialDataTypesTimestampRequirementRefs,
    tags: ["v2.0.0", "statements", "special-data-types", "timestamp"],
    capabilityFlags: ["timestamp", "retrieval", "special-data-types"],
    legacyTraceSuiteFile: specialDataTypesLegacySuiteFile,
    notes: ["proof-slice special data types timestamp precision"],
    steps: [
      {
        request: buildStatementPostRequest(timestampPrecisionStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementGetRequest(timestampPrecisionStatement.id),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["timestamp"],
              equals: millisecondPrecisionNormalized,
            },
          ],
        },
      },
    ],
  });

  const specialStoredPrecisionCase = requestSequenceCase({
    caseId: "v2.statements.special-data-types.stored-millisecond-precision",
    title: "The Statements resource recalls stored timestamps with at least millisecond precision",
    specVersion,
    requirementRefs: specialDataTypesTimestampRequirementRefs,
    tags: ["v2.0.0", "statements", "special-data-types", "stored"],
    capabilityFlags: ["stored", "retrieval", "special-data-types"],
    legacyTraceSuiteFile: specialDataTypesLegacySuiteFile,
    notes: ["proof-slice special data types stored precision"],
    steps: [
      {
        request: buildStatementPostRequest(storedPrecisionStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementGetRequest(storedPrecisionStatement.id),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["stored"],
              equals: millisecondPrecisionNormalized,
            },
          ],
        },
      },
    ],
  });

  const verifyTemplateRequirementRefs: RequirementRef[] = [
    {
      id: "XAPI-00014",
      section: "Data 2.2",
      title: "All Objects are well-created JSON Objects",
    },
  ];

  const verifyStatementTemplateAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.verify.statement-template",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "verify-template", "formatting", "acceptance"],
    expectedStatus: 200,
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: verifyLegacyConfigFile,
    variants: [
      {
        idSuffix: "default",
        title: "A Statement accepts the default verify statement template",
        transforms: [
          {
            operation: "set",
            path: ["timestamp"],
            value: "2013-05-18T05:32:34.804Z",
          },
        ],
        requirementRefs: verifyTemplateRequirementRefs,
      },
    ],
  });

  const verifyAgentTemplateAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.verify.agent-template",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "verify-template", "agent", "acceptance"],
    expectedStatus: 200,
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: verifyLegacyConfigFile,
    variants: agentActorPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement accepts ${placement.title} verify template`,
      transforms: placement.buildTransforms(buildAgentWithMbox(`mailto:verify-${placement.idSuffix}@example.test`)),
      requirementRefs: verifyTemplateRequirementRefs,
    })),
  });

  function buildVerifyGroupTemplateValue(placementId: string): JsonObject {
    if (placementId === "authority-group") {
      return buildAnonymousAuthorityGroup();
    }

    return buildGroupWithMbox(`mailto:verify-${placementId}@example.test`);
  }

  const verifyGroupTemplateAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.verify.group-template",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "verify-template", "group", "acceptance"],
    expectedStatus: 200,
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: verifyLegacyConfigFile,
    variants: groupActorPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement accepts ${placement.title} verify template`,
      transforms: placement.buildTransforms(buildVerifyGroupTemplateValue(placement.idSuffix)),
      requirementRefs: verifyTemplateRequirementRefs,
    })),
  });

  const verifyVerbTemplateAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.verify.verb-template",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "verify-template", "verb", "acceptance"],
    expectedStatus: 200,
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: verifyLegacyConfigFile,
    variants: verbPlacements.map((placement) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement accepts ${placement.title} verify template`,
      transforms: placement.buildTransforms(
        buildVerbFixture(`https://example.test/xapi/verbs/verify-template-${placement.idSuffix}`, "verified"),
      ),
      requirementRefs: verifyTemplateRequirementRefs,
    })),
  });

  const verifyDefaultActivityDefinition = buildActivityDefinitionFixture({
    name: {
      "en-US": "Proof verify activity",
    },
    description: {
      "en-US": "Proof verify activity description",
    },
    type: "https://example.test/xapi/activity-types/verify-default",
    moreInfo: "https://example.test/xapi/activities/verify-default/more-info",
    extensions: {
      "https://example.test/xapi/activities/extensions/verify-default": true,
    },
  });

  const verifyActivitySubstatementTemplateIds = new Set(["choice", "likert", "matching", "performance", "sequencing"]);

  const verifyActivityTemplateAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.verify.activity-template",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "verify-template", "activity", "acceptance"],
    expectedStatus: 200,
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: verifyLegacyConfigFile,
    variants: [
      ...activityObjectPlacements.map((placement) => ({
        idSuffix: `${placement.idSuffix}-default`,
        title: `A Statement accepts ${placement.title} default verify template`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(`https://example.test/xapi/activities/verify-${placement.idSuffix}-default`, {
            definition: verifyDefaultActivityDefinition,
          }),
        ),
        requirementRefs: verifyTemplateRequirementRefs,
      })),
      ...activityObjectPlacements.flatMap((placement) =>
        activityInteractionTypeAcceptanceVariants
          .filter(
            (variant) =>
              placement.idSuffix === "statement" || verifyActivitySubstatementTemplateIds.has(variant.idSuffix),
          )
          .map((variant) => ({
            idSuffix: `${placement.idSuffix}-${variant.idSuffix}`,
            title: `A Statement accepts ${placement.title} verify template using interactionType ${variant.label}`,
            transforms: placement.buildTransforms(
              buildActivityObjectFixture(
                `https://example.test/xapi/activities/verify-${placement.idSuffix}-${variant.idSuffix}`,
                {
                  definition: variant.definition,
                },
              ),
            ),
            requirementRefs: verifyTemplateRequirementRefs,
          })),
      ),
    ],
  });

  const verifyActivityDefinitionVariants = [
    {
      idSuffix: "empty-definition",
      label: "omits all optional definition properties",
      definition: {},
    },
    {
      idSuffix: "name",
      label: 'contains only "name"',
      definition: {
        name: {
          "en-GB": "example meeting",
          "en-US": "example meeting",
        },
      },
    },
    {
      idSuffix: "description",
      label: 'contains only "description"',
      definition: {
        description: {
          "en-GB": "An example meeting that happened on a specific occasion with certain people present.",
          "en-US": "An example meeting that happened on a specific occasion with certain people present.",
        },
      },
    },
    {
      idSuffix: "type",
      label: 'contains only "type"',
      definition: {
        type: "http://adlnet.gov/expapi/activities/meeting",
      },
    },
    {
      idSuffix: "more-info",
      label: 'contains only "moreInfo"',
      definition: {
        moreInfo: "http://virtualmeeting.example.com/345256",
      },
    },
    {
      idSuffix: "extensions",
      label: 'contains only "extensions"',
      definition: {
        extensions: {
          "http://example.com/profiles/meetings/extension/location": "X:\\meetings\\minutes\\examplemeeting.one",
          "http://example.com/profiles/meetings/extension/reporter": {
            name: "Thomas",
            id: "http://openid.com/342",
          },
        },
      },
    },
    {
      idSuffix: "interaction-type",
      label: 'contains only "interactionType"',
      definition: {
        interactionType: "fill-in",
        correctResponsesPattern: ['Bob"s your uncle'],
      },
    },
  ] as const;

  const verifyActivityDefinitionAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.verify.activity-definition",
    suiteTitle: "Statement Activity Objects",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "verify-template", "activity", "definition", "acceptance"],
    expectedStatus: 200,
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: verifyLegacyConfigFile,
    variants: activityObjectPlacements.flatMap((placement) =>
      verifyActivityDefinitionVariants.map((variant) => ({
        idSuffix: `${placement.idSuffix}-${variant.idSuffix}`,
        title: `A Statement accepts ${placement.title} verify template when definition ${variant.label}`,
        transforms: placement.buildTransforms(
          buildActivityObjectFixture(
            `https://example.test/xapi/activities/verify-${placement.idSuffix}-definition-${variant.idSuffix}`,
            {
              definition: buildActivityDefinitionFixture(variant.definition),
            },
          ),
        ),
        requirementRefs: verifyTemplateRequirementRefs,
      })),
    ),
  });

  const verifyResultTemplateAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.verify.result-template",
    suiteTitle: "Statement Result",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "verify-template", "result", "acceptance"],
    expectedStatus: 200,
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: verifyLegacyConfigFile,
    variants: resultPlacements.map((placement, index) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement accepts ${placement.title} default verify template`,
      transforms: placement.buildTransforms(
        buildResultFixture({
          response: `proof verify result response ${index}`,
        }),
      ),
      requirementRefs: verifyTemplateRequirementRefs,
    })),
  });

  function buildVerifyDefaultContextFixture(seed: number, placementId: string): JsonObject {
    return {
      registration: buildProofUuid(seed),
      instructor: buildAgentWithMbox(`mailto:verify-context-instructor-${placementId}@example.test`),
      team: buildGroupWithMbox(`mailto:verify-context-team-${placementId}@example.test`),
      contextActivities: {
        category: buildContextActivityFixture(`https://example.test/xapi/activities/verify-context-${placementId}`),
      },
      language: "en-US",
    };
  }

  const verifyContextTemplateAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.verify.context-template",
    suiteTitle: "Statement Context",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "verify-template", "context", "acceptance"],
    expectedStatus: 200,
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: verifyLegacyConfigFile,
    variants: contextPlacements.map((placement, index) => ({
      idSuffix: placement.idSuffix,
      title: `A Statement accepts ${placement.title} default verify template`,
      transforms: placement.buildTransforms(buildVerifyDefaultContextFixture(6400 + index, placement.idSuffix)),
      requirementRefs: verifyTemplateRequirementRefs,
    })),
  });

  const verifyContextActivitySingleAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.verify.context-activity-single",
    suiteTitle: "Statement Context Activities",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "verify-template", "context", "context-activities", "acceptance"],
    expectedStatus: 200,
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: verifyLegacyConfigFile,
    variants: contextPlacements.flatMap((placement) =>
      contextActivityKinds.map((kind) => ({
        idSuffix: `${placement.idSuffix}-${kind}`,
        title: `A Statement accepts ${placement.title} verify template when contextActivities.${kind} is a single Activity`,
        transforms: placement.buildTransforms(
          buildContextActivitiesFixture({
            [kind]: buildContextActivityFixture(
              `https://example.test/xapi/activities/verify-${placement.idSuffix}-${kind}`,
            ),
          } as JsonObject),
        ),
        requirementRefs: verifyTemplateRequirementRefs,
      })),
    ),
  });

  const verifyLanguageTemplateAcceptanceCases = statementMutationFamily({
    familyId: "v2.statements.verify.language-template",
    suiteTitle: "Statement Formatting",
    specVersion,
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "verify-template", "languages", "acceptance"],
    expectedStatus: 200,
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: verifyLegacyConfigFile,
    variants: [
      {
        idSuffix: "statement-verb",
        title: "A Statement accepts a statement verb verify template when display is omitted",
        transforms: [
          {
            operation: "set",
            path: ["verb"],
            value: {
              id: "https://example.test/xapi/verbs/verify-language-statement",
            },
          },
        ],
        requirementRefs: verifyTemplateRequirementRefs,
      },
      {
        idSuffix: "statement-object",
        title: "A Statement accepts a statement Activity verify template when language maps are omitted",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildActivityObjectFixture("https://example.test/xapi/activities/verify-language-statement", {
              definition: buildActivityDefinitionFixture({
                type: "https://example.test/xapi/activity-types/verify-language-statement",
              }),
            }),
          },
        ],
        requirementRefs: verifyTemplateRequirementRefs,
      },
      {
        idSuffix: "statement-attachment",
        title: "A Statement accepts an attachment verify template with valid language maps",
        transforms: [
          {
            operation: "set",
            path: ["attachments"],
            value: [buildAttachmentFixture()],
          },
        ],
        requirementRefs: verifyTemplateRequirementRefs,
      },
      {
        idSuffix: "substatement-verb",
        title: "A Statement accepts a substatement verb verify template when display is omitted",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              verb: {
                id: "https://example.test/xapi/verbs/verify-language-substatement",
              },
            }),
          },
        ],
        requirementRefs: verifyTemplateRequirementRefs,
      },
      {
        idSuffix: "substatement-object",
        title: "A Statement accepts a substatement Activity verify template when language maps are omitted",
        transforms: [
          {
            operation: "set",
            path: ["object"],
            value: buildSubStatementFixture({
              object: buildActivityObjectFixture("https://example.test/xapi/activities/verify-language-substatement", {
                definition: buildActivityDefinitionFixture({
                  type: "https://example.test/xapi/activity-types/verify-language-substatement",
                }),
              }),
            }),
          },
        ],
        requirementRefs: verifyTemplateRequirementRefs,
      },
    ],
  });

  const missingSignaturePartStatement = buildProofStatement(5300, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/signed-missing-part",
    },
  ]);
  const missingSignaturePartPayload = buildMockJws(missingSignaturePartStatement);
  const missingSignatureAttachment = buildSignedStatementAttachment(missingSignaturePartPayload);

  const signedMissingPartCase = singleRequestCase({
    caseId: "v2.statements.signed-statements.missing-signature-part",
    title: "The Statements resource rejects signed statement metadata when the signature part is missing",
    specVersion,
    requirementRefs: signedStatementPresenceRequirementRefs,
    tags: ["v2.0.0", "statements", "signed-statements", "multipart"],
    capabilityFlags: ["signed", "multipart", "validation"],
    legacyTraceSuiteFile: signedStatementsLegacySuiteFile,
    request: buildMultipartStatementPostRequest(
      {
        ...missingSignaturePartStatement,
        attachments: [missingSignatureAttachment.metadata],
      },
      [],
    ),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice signed statement missing signature part"],
  });

  const signedBadContentTypeStatement = buildProofStatement(5301, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/signed-bad-content-type",
    },
  ]);

  const signedBadContentTypeCase = singleRequestCase({
    caseId: "v2.statements.signed-statements.bad-content-type",
    title:
      "The Statements resource rejects signed statements whose signature attachment contentType is not application/octet-stream",
    specVersion,
    requirementRefs: signedStatementPresenceRequirementRefs,
    tags: ["v2.0.0", "statements", "signed-statements", "multipart"],
    capabilityFlags: ["signed", "multipart", "validation"],
    legacyTraceSuiteFile: signedStatementsLegacySuiteFile,
    request: buildSignedStatementPostRequest(signedBadContentTypeStatement, {
      signatureContentType: "text/plain; charset=ascii",
    }),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice signed statement bad content type"],
  });

  const signedInvalidPayloadStatement = buildProofStatement(5302, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/signed-invalid-payload",
    },
  ]);

  const signedInvalidPayloadCase = singleRequestCase({
    caseId: "v2.statements.signed-statements.invalid-payload-json",
    title: "The Statements resource rejects signed statements whose JWS payload is not valid JSON",
    specVersion,
    requirementRefs: signedStatementPayloadRequirementRefs,
    tags: ["v2.0.0", "statements", "signed-statements", "multipart"],
    capabilityFlags: ["signed", "multipart", "validation"],
    legacyTraceSuiteFile: signedStatementsLegacySuiteFile,
    request: buildSignedStatementPostRequest(signedInvalidPayloadStatement, {
      signaturePayload: '{"broken"',
    }),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice signed statement invalid payload json"],
  });

  const signedRs256Statement = buildProofStatement(5303, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/signed-rs256",
    },
  ]);
  const signedRs384Statement = buildProofStatement(5304, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/signed-rs384",
    },
  ]);
  const signedRs512Statement = buildProofStatement(5305, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/signed-rs512",
    },
  ]);
  const signedHs256Statement = buildProofStatement(5306, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/signed-hs256",
    },
  ]);

  const signedRs256Case = singleRequestCase({
    caseId: "v2.statements.signed-statements.accepts-rs256",
    title: 'The Statements resource accepts signed statements that use the "RS256" algorithm',
    specVersion,
    requirementRefs: signedStatementAlgorithmRequirementRefs,
    tags: ["v2.0.0", "statements", "signed-statements", "multipart"],
    capabilityFlags: ["signed", "multipart"],
    legacyTraceSuiteFile: signedStatementsLegacySuiteFile,
    request: buildSignedStatementPostRequest(signedRs256Statement),
    assertion: {
      status: 200,
    },
    notes: ["proof-slice signed statement rs256"],
  });

  const signedRs384Case = singleRequestCase({
    caseId: "v2.statements.signed-statements.accepts-rs384",
    title: 'The Statements resource accepts signed statements that use the "RS384" algorithm',
    specVersion,
    requirementRefs: signedStatementAlgorithmRequirementRefs,
    tags: ["v2.0.0", "statements", "signed-statements", "multipart"],
    capabilityFlags: ["signed", "multipart"],
    legacyTraceSuiteFile: signedStatementsLegacySuiteFile,
    request: buildSignedStatementPostRequest(signedRs384Statement, {
      algorithm: "RS384",
    }),
    assertion: {
      status: 200,
    },
    notes: ["proof-slice signed statement rs384"],
  });

  const signedRs512Case = singleRequestCase({
    caseId: "v2.statements.signed-statements.accepts-rs512",
    title: 'The Statements resource accepts signed statements that use the "RS512" algorithm',
    specVersion,
    requirementRefs: signedStatementAlgorithmRequirementRefs,
    tags: ["v2.0.0", "statements", "signed-statements", "multipart"],
    capabilityFlags: ["signed", "multipart"],
    legacyTraceSuiteFile: signedStatementsLegacySuiteFile,
    request: buildSignedStatementPostRequest(signedRs512Statement, {
      algorithm: "RS512",
    }),
    assertion: {
      status: 200,
    },
    notes: ["proof-slice signed statement rs512"],
  });

  const signedHs256Case = singleRequestCase({
    caseId: "v2.statements.signed-statements.rejects-hs256",
    title:
      'The Statements resource rejects signed statements that use an algorithm other than "RS256", "RS384", or "RS512"',
    specVersion,
    requirementRefs: signedStatementAlgorithmRequirementRefs,
    tags: ["v2.0.0", "statements", "signed-statements", "multipart"],
    capabilityFlags: ["signed", "multipart", "validation"],
    legacyTraceSuiteFile: signedStatementsLegacySuiteFile,
    request: buildSignedStatementPostRequest(signedHs256Statement, {
      algorithm: "HS256",
    }),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice signed statement hs256 rejection"],
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
          ...verifyStatementTemplateAcceptanceCases,
          ...verifyAgentTemplateAcceptanceCases,
          ...verifyGroupTemplateAcceptanceCases,
          ...verifyVerbTemplateAcceptanceCases,
          ...accountHomePageMissingCases,
          ...accountHomePageInvalidCases,
          ...accountNameMissingCases,
          ...actorObjectTypeVocabularyCases,
          ...agentObjectTypeTypeCases,
          ...agentNameTypeCases,
          ...groupAnonymousMemberRequiredCases,
          ...groupMemberTypeCases,
          ...verbIdRequiredCases,
          ...verbIdIriCases,
          ...verbDisplayTypeCases,
          ...agentIfiAcceptanceCases,
          ...agentIfiRequiredCases,
          ...groupIfiOrMemberRequiredCases,
          ...groupIfiAcceptanceCases,
          ...groupIfiAcceptanceNoMemberCases,
          ...accountPropertyAcceptanceCases,
          ...agentIfiExclusivityCases,
          ...groupIfiExclusivityCases,
          ...attachmentIriCases,
          ...caseSensitiveKeyCases,
          ...interactionTypeCaseCases,
          ...extensionKeyCases,
          ...verifyLanguageTemplateAcceptanceCases,
          ...languageTagAcceptanceCases,
          ...languageTagRejectionCases,
          ...malformedObjectTypeCases,
          precisionCase,
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.statements.authority",
        title: "Statement Authority",
        specVersion,
        tags: ["authority"],
        children: [
          ...authorityGroupAcceptanceCases,
          authorityPopulationCase,
          authorityNonOauthMembersCase,
          ...authorityGroupRejectionCases,
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.statements.attachments",
        title: "Statement Attachments",
        specVersion,
        tags: ["attachments"],
        children: [
          ...attachmentAcceptanceCases,
          ...attachmentArrayTypeCases,
          ...attachmentEntryObjectCases,
          ...attachmentUsageTypeCases,
          ...attachmentContentTypeCases,
          ...attachmentLengthCases,
          ...attachmentSha2Cases,
          ...attachmentFileUrlCases,
          ...attachmentDisplayTypeCases,
          ...attachmentDescriptionTypeCases,
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.statements.result-and-objects",
        title: "Statement Result And Object Requirements",
        specVersion,
        tags: ["result", "object"],
        children: [
          {
            type: "suite",
            id: "v2.proof-slice.statements.result-and-objects.result",
            title: "Result",
            specVersion,
            tags: ["result"],
            children: [
              ...verifyResultTemplateAcceptanceCases,
              ...resultSuccessTypeCases,
              ...resultCompletionTypeCases,
              ...resultResponseTypeCases,
              ...resultDurationInvalidCases,
              ...resultDurationAcceptanceCases,
              ...resultExtensionsTypeCases,
              ...scoreObjectTypeCases,
              ...scoreScaledAcceptanceCases,
              ...scoreScaledRejectionCases,
              ...scoreRawAcceptanceCases,
              ...scoreRawRejectionCases,
              ...scoreMinAcceptanceCases,
              ...scoreMinRejectionCases,
              ...scoreMaxAcceptanceCases,
              ...scoreMaxRejectionCases,
            ],
          },
          {
            type: "suite",
            id: "v2.proof-slice.statements.result-and-objects.activity-object",
            title: "Activity And Object Typing",
            specVersion,
            tags: ["activity", "object"],
            children: [
              ...verifyActivityTemplateAcceptanceCases,
              ...verifyActivityDefinitionAcceptanceCases,
              ...objectTypeVocabularyCases,
              ...activityMissingIdCases,
              ...activityInvalidIdCases,
              ...activityObjectTypeGeneratedCases,
              ...activityDefinitionTypeCases,
              ...activityDefinitionNameTypeCases,
              ...activityDefinitionDescriptionTypeCases,
              ...activityInteractionTypeAcceptanceCases,
              ...activityInteractionTypeInvalidCases,
              ...activityCorrectResponsesPatternCases,
              ...activityExtensionsTypeCases,
              ...activityInteractionComponentAcceptanceCases,
              ...activityInteractionComponentNotArrayCases,
              ...activityInteractionComponentEntryNotObjectCases,
              ...activityInteractionComponentIdMissingCases,
              ...activityInteractionComponentIdInvalidCases,
              ...activityInteractionComponentDescriptionTypeCases,
              ...activityInteractionComponentDescriptionLanguageCases,
              ...activityInteractionComponentDuplicateIdCases,
              ...activityInteractionTypeRequiredCases,
              ...objectActorTypeRequiredCases,
            ],
          },
          {
            type: "suite",
            id: "v2.proof-slice.statements.result-and-objects.statement-ref",
            title: "Statement References",
            specVersion,
            tags: ["statement-ref"],
            children: [
              ...statementRefAcceptanceCases,
              ...statementRefObjectTypeCases,
              ...statementRefMissingIdCases,
              ...statementRefInvalidIdCases,
            ],
          },
          {
            type: "suite",
            id: "v2.proof-slice.statements.result-and-objects.substatement",
            title: "SubStatements",
            specVersion,
            tags: ["substatement"],
            children: [
              ...subStatementAcceptanceCases,
              ...subStatementObjectTypeCases,
              ...subStatementMissingFieldCases,
              ...subStatementForbiddenPropertyCases,
              ...subStatementNestedCase,
            ],
          },
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.statements.metadata",
        title: "Statement Metadata",
        specVersion,
        tags: ["metadata"],
        children: [
          ...timestampPropertyInvalidCases,
          ...timestampPropertyAcceptanceCases,
          ...timestampIso8601Cases,
          ...timestampIso8601AcceptanceCases,
          ...versionAcceptanceCases,
          ...versionInvalidCases,
          versionRoundTripCase,
          storedPostOverwriteCase,
          storedPutOverwriteCase,
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.statements.context",
        title: "Statement Context",
        specVersion,
        tags: ["context"],
        children: [
          {
            type: "suite",
            id: "v2.proof-slice.statements.context.validation",
            title: "Context Validation",
            specVersion,
            tags: ["validation"],
            children: [
              ...verifyContextTemplateAcceptanceCases,
              ...invalidRegistrationCases,
              ...invalidTeamCases,
              ...invalidContextActivitiesTypeCases,
              ...invalidRevisionTypeCases,
              ...revisionActivityOnlyRejectionCases,
              ...revisionNoObjectTypeCases,
              ...invalidPlatformTypeCases,
              ...platformActivityOnlyRejectionCases,
              ...platformNoObjectTypeCases,
              ...invalidContextStatementRefCases,
            ],
          },
          {
            type: "suite",
            id: "v2.proof-slice.statements.context.activities",
            title: "Context Activities",
            specVersion,
            tags: ["context-activities"],
            children: [
              ...verifyContextActivitySingleAcceptanceCases,
              ...contextActivityKeyAcceptanceCases,
              ...contextActivityInvalidKeyCases,
              ...contextActivityArrayValueCases,
              ...contextActivityInvalidValueCases,
            ],
          },
          {
            type: "suite",
            id: "v2.proof-slice.statements.context.roundtrip",
            title: "Context Roundtrip",
            specVersion,
            tags: ["retrieval"],
            children: contextActivitiesRoundTripCases,
          },
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.statements.transport",
        title: "Statement Transport",
        specVersion,
        tags: ["transport"],
        children: [
          statementEndpointPostCase,
          statementEndpointPutCase,
          statementPutAcceptedCase,
          putRoundTripCase,
          putRequiresStatementIdCase,
          putImmutableCase,
          statementPostAcceptedCase,
          singlePostResponseCase,
          batchSuccessCase,
          duplicateBatchCase,
          batchRollbackCase,
          missingTargetVoidingAcceptedCase,
          invalidVoidingObjectCase,
          repeatedVoidingIgnoredCase,
          voidingStatementRemainsVisibleCase,
          voidedStatementQueryCase,
          hiddenVoidedStatementCase,
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.statements.representation",
        title: "Statement Representation",
        specVersion,
        tags: ["representation"],
        children: [
          formatAbsentDefaultCase,
          acceptLanguageWithoutCanonicalCase,
          exactFormatCase,
          canonicalFormatCase,
          idsFormatCase,
          collectionFormatAbsentCase,
          collectionFormatCanonicalCase,
          collectionFormatExactCase,
          collectionFormatIdsCase,
          collectionCanonicalAcceptLanguageCase,
          collectionAcceptLanguageWithoutFormatCase,
          attachmentsMultipartCase,
          attachmentsJsonFallbackCase,
          attachmentsMissingJsonCase,
          attachmentsFalseJsonCase,
          contentTypeHeaderCase,
          lastModifiedCase,
          consistentThroughSuccessCase,
          consistentThroughErrorCase,
          ...consistentThroughPresenceCases,
          ...consistentThroughIsoCases,
        ],
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
        children: [
          statementEndpointGetCase,
          statementGetAcceptedCase,
          statementResultCollectionCase,
          ...statementResultVariantCases,
          retrievalStatementsArrayCase,
          retrievalPaginationCase,
          retrievalDirectPropertiesCase,
          retrievalDirectStatementsArrayCase,
          retrievalDirectAdditionalPageCase,
          retrievalDirectMoreEmptyCase,
          retrievalDirectMoreRefersCase,
          retrievalDirectMoreContainerRulesCase,
          statementIdAcceptedCase,
          statementIdReturnedCase,
          voidedStatementIdAcceptedCase,
          queryCase,
          emptyResultCase,
          ...statementQueryAcceptanceCases,
          agentQueryCase,
          verbQueryCase,
          activityQueryCase,
          registrationQueryCase,
          relatedActivitiesQueryCase,
          relatedAgentsQueryCase,
          sinceQueryCase,
          untilQueryCase,
          limitQueryCase,
          ascendingQueryCase,
          ...filteringCriterionCases,
          statementIdFormatAllowedCase,
          statementIdAttachmentsAllowedCase,
          voidedStatementIdFormatAllowedCase,
          voidedStatementIdAttachmentsAllowedCase,
          ...voidedTargetRetentionCases,
          ...statementIdExclusivityCases,
          ...voidedStatementIdExclusivityCases,
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.statements.id",
        title: "Statement Id Requirements",
        specVersion,
        tags: ["id"],
        children: [
          generatedStatementIdRoundTripCase,
          ...statementRefUuidStringFormCases,
          ...statementRefUuidRfc4122Cases,
          ...contextRegistrationUuidStringFormCases,
          ...contextRegistrationUuidRfc4122Cases,
          ...contextStatementUuidStringFormCases,
          ...contextStatementUuidRfc4122Cases,
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.statements.additional-data-types",
        title: "Additional Data Types",
        specVersion,
        tags: ["additional-data-types"],
        children: [
          additionalIriComparisonCase,
          additionalHighPrecisionDurationAcceptedCase,
          additionalHighPrecisionDurationRoundTripCase,
          additionalSignedDurationComparisonCase,
          additionalTimestampUtcCase,
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.statements.signed-statements",
        title: "Signed Statements",
        specVersion,
        tags: ["signed-statements"],
        children: [
          signedMissingPartCase,
          signedBadContentTypeCase,
          signedInvalidPayloadCase,
          signedRs256Case,
          signedRs384Case,
          signedRs512Case,
          signedHs256Case,
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.statements.special-data-types",
        title: "Special Data Types And Rules",
        specVersion,
        tags: ["special-data-types"],
        children: [
          ...specialExtensionAcceptanceCases,
          ...legacyLanguageMapRejectionCases,
          ...legacyExtensionKeyCases,
          specialTimestampPrecisionCase,
          specialStoredPrecisionCase,
        ],
      },
    ],
  };
}
