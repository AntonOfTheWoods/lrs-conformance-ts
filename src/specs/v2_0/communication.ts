import {
  authenticationLegacySuiteFile,
  buildActivityObjectFixture,
  buildActivityProfileDocumentFixture,
  buildActivityProfileIdentityFixture,
  buildActivityStateDocumentFixture,
  buildActivityStateIdentityFixture,
  buildAgentProfileDocumentFixture,
  buildAgentProfileIdentityFixture,
  buildAgentQuery,
  buildAgentWithMbox,
  buildAttachmentFixture,
  buildHeadRequest,
  buildMalformedMultipartStatementRequest,
  buildMultipartStatementPostRequest,
  buildMultipartStatementRequestBody,
  buildProofDocumentEtag,
  buildProofStatement,
  buildProofUuid,
  buildRequestWithoutVersionHeader,
  buildStatementBatchPostRequest,
  buildStatementBody,
  buildStatementCollectionRequest,
  buildStatementGetRequest,
  buildStatementPostRequest,
  buildStatementPutRequest,
  buildVersionedHeaders,
  buildVersionedRequest,
  concurrencyLegacySuiteFile,
  contentTypesLegacySuiteFile,
  documentResourcesLegacySuiteFile,
  encodingLegacySuiteFile,
  errorCodesLegacySuiteFile,
  headRequestsLegacySuiteFile,
  invalidLegacyString,
  requestSequenceCase,
  singleRequestCase,
  specVersion,
  versioningLegacySuiteFile,
} from "./shared";
import type {
  EndpointKind,
  JsonObject,
  JsonPathExpectation,
  MultipartStatementAttachment,
  SuiteDefinition,
} from "./shared";

interface DocumentConcurrencySuiteOptions {
  suiteId: string;
  title: string;
  endpoint: EndpointKind;
  bodyFixtureName: string;
  buildQuery(idSuffix: string): Record<string, string>;
  initialBody: JsonObject;
  replacementBody: JsonObject;
  resourceTag: string;
}

function buildDocumentConcurrencyResourceSuite(options: DocumentConcurrencySuiteOptions): SuiteDefinition {
  const baseTags = ["v2.0.0", "communication", "concurrency", options.resourceTag];
  const staleEtag = '"stale-proof-etag"';
  const initialEtag = buildProofDocumentEtag(options.initialBody);
  const mergeBody = {
    proofMerge: true,
  } satisfies JsonObject;
  const postReplacementBody = {
    ...options.initialBody,
    ...options.replacementBody,
  } satisfies JsonObject;

  const etagQuery = options.buildQuery("etag");
  const etagQuotedQuery = options.buildQuery("etag-quoted");
  const putStaleQuery = options.buildQuery("put-stale");
  const putStalePreserveQuery = options.buildQuery("put-stale-preserve");
  const putCurrentQuery = options.buildQuery("put-current");
  const putMissingQuery = options.buildQuery("put-missing");
  const putMissingMessageQuery = options.buildQuery("put-missing-message");
  const postStaleQuery = options.buildQuery("post-stale");
  const postStalePreserveQuery = options.buildQuery("post-stale-preserve");
  const postCurrentQuery = options.buildQuery("post-current");
  const postCurrentModifiedQuery = options.buildQuery("post-current-modified");
  const deleteStaleQuery = options.buildQuery("delete-stale");
  const deleteStalePreserveQuery = options.buildQuery("delete-stale-preserve");
  const deleteCurrentQuery = options.buildQuery("delete-current");

  return {
    type: "suite",
    id: options.suiteId,
    title: options.title,
    specVersion,
    tags: ["communication", "concurrency", options.resourceTag],
    children: [
      requestSequenceCase({
        caseId: `${options.suiteId}.etag-header`,
        title: `${options.title} GET responses include a quoted ETag header`,
        specVersion,
        requirementRefs: [
          {
            id: "XAPI-00322",
            section: "Communication 3.1",
            title: "Document resources return ETag headers for optimistic concurrency",
          },
        ],
        tags: baseTags,
        capabilityFlags: ["communication", "concurrency", options.resourceTag],
        legacyTraceSuiteFile: concurrencyLegacySuiteFile,
        notes: [`proof-slice ${options.resourceTag} etag header`],
        steps: [
          {
            request: buildVersionedRequest("POST", options.endpoint, etagQuery, {
              value: options.initialBody,
              fixtureName: options.bodyFixtureName,
            }),
            assertion: {
              status: 204,
            },
          },
          {
            request: buildVersionedRequest("GET", options.endpoint, etagQuery),
            assertion: {
              status: 200,
              expectedHeaders: [
                {
                  key: "etag",
                  equals: initialEtag,
                },
              ],
              jsonPathEquals: [
                {
                  path: [],
                  equals: options.initialBody,
                },
              ],
            },
          },
        ],
      }),
      requestSequenceCase({
        caseId: `${options.suiteId}.etag-header-quoted`,
        title: `${options.title} GET responses enclose the ETag header in quotes`,
        specVersion,
        requirementRefs: [
          {
            id: "XAPI-00322",
            section: "Communication 3.1",
            title: "Document resource ETag values are enclosed in quotes",
          },
        ],
        tags: baseTags,
        capabilityFlags: ["communication", "concurrency", options.resourceTag],
        legacyTraceSuiteFile: concurrencyLegacySuiteFile,
        notes: [`proof-slice ${options.resourceTag} etag header quoted`],
        steps: [
          {
            request: buildVersionedRequest("POST", options.endpoint, etagQuotedQuery, {
              value: options.initialBody,
              fixtureName: options.bodyFixtureName,
            }),
            assertion: {
              status: 204,
            },
          },
          {
            request: buildVersionedRequest("GET", options.endpoint, etagQuotedQuery),
            assertion: {
              status: 200,
              expectedHeaderPatterns: [
                {
                  key: "etag",
                  pattern: '^(W/)?".+"$',
                },
              ],
            },
          },
        ],
      }),
      requestSequenceCase({
        caseId: `${options.suiteId}.put-rejects-stale-if-match`,
        title: `${options.title} rejects PUT requests with a stale If-Match header`,
        specVersion,
        requirementRefs: [
          {
            id: "XAPI-00322",
            section: "Communication 3.1",
            title: "Document resources reject stale If-Match values for PUT",
          },
        ],
        tags: baseTags,
        capabilityFlags: ["communication", "concurrency", options.resourceTag],
        legacyTraceSuiteFile: concurrencyLegacySuiteFile,
        notes: [`proof-slice ${options.resourceTag} put stale if-match`],
        steps: [
          {
            request: buildVersionedRequest("POST", options.endpoint, putStaleQuery, {
              value: options.initialBody,
              fixtureName: options.bodyFixtureName,
            }),
            assertion: {
              status: 204,
            },
          },
          {
            request: buildVersionedRequest(
              "PUT",
              options.endpoint,
              putStaleQuery,
              {
                value: options.replacementBody,
                fixtureName: options.bodyFixtureName,
              },
              {
                "If-Match": staleEtag,
              },
            ),
            assertion: {
              status: 412,
            },
          },
          {
            request: buildVersionedRequest("GET", options.endpoint, putStaleQuery),
            assertion: {
              status: 200,
              jsonPathEquals: [
                {
                  path: [],
                  equals: options.initialBody,
                },
              ],
            },
          },
        ],
      }),
      requestSequenceCase({
        caseId: `${options.suiteId}.put-stale-preserves-document`,
        title: `${options.title} leaves the existing document unchanged after a stale PUT If-Match`,
        specVersion,
        requirementRefs: [
          {
            id: "XAPI-00322",
            section: "Communication 3.1",
            title: "Document resources do not modify data when PUT If-Match is stale",
          },
        ],
        tags: baseTags,
        capabilityFlags: ["communication", "concurrency", options.resourceTag],
        legacyTraceSuiteFile: concurrencyLegacySuiteFile,
        notes: [`proof-slice ${options.resourceTag} put stale preserves document`],
        steps: [
          {
            request: buildVersionedRequest("POST", options.endpoint, putStalePreserveQuery, {
              value: options.initialBody,
              fixtureName: options.bodyFixtureName,
            }),
            assertion: {
              status: 204,
            },
          },
          {
            request: buildVersionedRequest(
              "PUT",
              options.endpoint,
              putStalePreserveQuery,
              {
                value: options.replacementBody,
                fixtureName: options.bodyFixtureName,
              },
              {
                "If-Match": staleEtag,
              },
            ),
            assertion: {
              status: 412,
            },
          },
          {
            request: buildVersionedRequest("GET", options.endpoint, putStalePreserveQuery),
            assertion: {
              status: 200,
              jsonPathEquals: [
                {
                  path: [],
                  equals: options.initialBody,
                },
              ],
            },
          },
        ],
      }),
      requestSequenceCase({
        caseId: `${options.suiteId}.put-accepts-current-if-match`,
        title: `${options.title} accepts PUT requests with the current If-Match header`,
        specVersion,
        requirementRefs: [
          {
            id: "XAPI-00322",
            section: "Communication 3.1",
            title: "Document resources accept current If-Match values for PUT",
          },
        ],
        tags: baseTags,
        capabilityFlags: ["communication", "concurrency", options.resourceTag],
        legacyTraceSuiteFile: concurrencyLegacySuiteFile,
        notes: [`proof-slice ${options.resourceTag} put current if-match`],
        steps: [
          {
            request: buildVersionedRequest("POST", options.endpoint, putCurrentQuery, {
              value: options.initialBody,
              fixtureName: options.bodyFixtureName,
            }),
            assertion: {
              status: 204,
            },
          },
          {
            request: buildVersionedRequest(
              "PUT",
              options.endpoint,
              putCurrentQuery,
              {
                value: options.replacementBody,
                fixtureName: options.bodyFixtureName,
              },
              {
                "If-Match": initialEtag,
              },
            ),
            assertion: {
              status: 204,
            },
          },
          {
            request: buildVersionedRequest("GET", options.endpoint, putCurrentQuery),
            assertion: {
              status: 200,
              jsonPathEquals: [
                {
                  path: [],
                  equals: options.replacementBody,
                },
              ],
            },
          },
        ],
      }),
      requestSequenceCase({
        caseId: `${options.suiteId}.put-requires-if-match`,
        title: `${options.title} returns 409 when PUT overwrites an existing document without If-Match`,
        specVersion,
        requirementRefs: [
          {
            id: "XAPI-00322",
            section: "Communication 3.1",
            title: "Document resources require If-Match for overwriting PUT requests",
          },
        ],
        tags: baseTags,
        capabilityFlags: ["communication", "concurrency", options.resourceTag],
        legacyTraceSuiteFile: concurrencyLegacySuiteFile,
        notes: [`proof-slice ${options.resourceTag} put requires if-match`],
        steps: [
          {
            request: buildVersionedRequest("POST", options.endpoint, putMissingQuery, {
              value: options.initialBody,
              fixtureName: options.bodyFixtureName,
            }),
            assertion: {
              status: 204,
            },
          },
          {
            request: buildVersionedRequest("PUT", options.endpoint, putMissingQuery, {
              value: options.replacementBody,
              fixtureName: options.bodyFixtureName,
            }),
            assertion: {
              status: 409,
            },
          },
          {
            request: buildVersionedRequest("GET", options.endpoint, putMissingQuery),
            assertion: {
              status: 200,
              jsonPathEquals: [
                {
                  path: [],
                  equals: options.initialBody,
                },
              ],
            },
          },
        ],
      }),
      requestSequenceCase({
        caseId: `${options.suiteId}.put-requires-if-match-error-message`,
        title: `${options.title} explains that If-Match is required when PUT omits concurrency headers`,
        specVersion,
        requirementRefs: [
          {
            id: "XAPI-00322",
            section: "Communication 3.1",
            title: "Document resources explain missing If-Match conflicts for PUT",
          },
        ],
        tags: baseTags,
        capabilityFlags: ["communication", "concurrency", options.resourceTag],
        legacyTraceSuiteFile: concurrencyLegacySuiteFile,
        notes: [`proof-slice ${options.resourceTag} put requires if-match error message`],
        steps: [
          {
            request: buildVersionedRequest("POST", options.endpoint, putMissingMessageQuery, {
              value: options.initialBody,
              fixtureName: options.bodyFixtureName,
            }),
            assertion: {
              status: 204,
            },
          },
          {
            request: buildVersionedRequest("PUT", options.endpoint, putMissingMessageQuery, {
              value: options.replacementBody,
              fixtureName: options.bodyFixtureName,
            }),
            assertion: {
              status: 409,
              textContains: ["If-Match is required"],
            },
          },
        ],
      }),
      requestSequenceCase({
        caseId: `${options.suiteId}.post-rejects-stale-if-match`,
        title: `${options.title} rejects POST merge requests with a stale If-Match header`,
        specVersion,
        requirementRefs: [
          {
            id: "XAPI-00322",
            section: "Communication 3.1",
            title: "Document resources reject stale If-Match values for POST",
          },
        ],
        tags: baseTags,
        capabilityFlags: ["communication", "concurrency", options.resourceTag],
        legacyTraceSuiteFile: concurrencyLegacySuiteFile,
        notes: [`proof-slice ${options.resourceTag} post stale if-match`],
        steps: [
          {
            request: buildVersionedRequest("POST", options.endpoint, postStaleQuery, {
              value: options.initialBody,
              fixtureName: options.bodyFixtureName,
            }),
            assertion: {
              status: 204,
            },
          },
          {
            request: buildVersionedRequest(
              "POST",
              options.endpoint,
              postStaleQuery,
              {
                value: mergeBody,
              },
              {
                "If-Match": staleEtag,
              },
            ),
            assertion: {
              status: 412,
            },
          },
          {
            request: buildVersionedRequest("GET", options.endpoint, postStaleQuery),
            assertion: {
              status: 200,
              jsonPathEquals: [
                {
                  path: [],
                  equals: options.initialBody,
                },
              ],
            },
          },
        ],
      }),
      requestSequenceCase({
        caseId: `${options.suiteId}.post-stale-preserves-document`,
        title: `${options.title} leaves the existing document unchanged after a stale POST If-Match`,
        specVersion,
        requirementRefs: [
          {
            id: "XAPI-00322",
            section: "Communication 3.1",
            title: "Document resources do not modify data when POST If-Match is stale",
          },
        ],
        tags: baseTags,
        capabilityFlags: ["communication", "concurrency", options.resourceTag],
        legacyTraceSuiteFile: concurrencyLegacySuiteFile,
        notes: [`proof-slice ${options.resourceTag} post stale preserves document`],
        steps: [
          {
            request: buildVersionedRequest("POST", options.endpoint, postStalePreserveQuery, {
              value: options.initialBody,
              fixtureName: options.bodyFixtureName,
            }),
            assertion: {
              status: 204,
            },
          },
          {
            request: buildVersionedRequest(
              "POST",
              options.endpoint,
              postStalePreserveQuery,
              {
                value: mergeBody,
              },
              {
                "If-Match": staleEtag,
              },
            ),
            assertion: {
              status: 412,
            },
          },
          {
            request: buildVersionedRequest("GET", options.endpoint, postStalePreserveQuery),
            assertion: {
              status: 200,
              jsonPathEquals: [
                {
                  path: [],
                  equals: options.initialBody,
                },
              ],
            },
          },
        ],
      }),
      requestSequenceCase({
        caseId: `${options.suiteId}.post-accepts-current-if-match`,
        title: `${options.title} accepts POST merge requests with the current If-Match header`,
        specVersion,
        requirementRefs: [
          {
            id: "XAPI-00322",
            section: "Communication 3.1",
            title: "Document resources accept current If-Match values for POST",
          },
        ],
        tags: baseTags,
        capabilityFlags: ["communication", "concurrency", options.resourceTag],
        legacyTraceSuiteFile: concurrencyLegacySuiteFile,
        notes: [`proof-slice ${options.resourceTag} post current if-match accepted`],
        steps: [
          {
            request: buildVersionedRequest("POST", options.endpoint, postCurrentQuery, {
              value: options.initialBody,
              fixtureName: options.bodyFixtureName,
            }),
            assertion: {
              status: 204,
            },
          },
          {
            request: buildVersionedRequest(
              "POST",
              options.endpoint,
              postCurrentQuery,
              {
                value: postReplacementBody,
              },
              {
                "If-Match": initialEtag,
              },
            ),
            assertion: {
              status: 204,
            },
          },
        ],
      }),
      requestSequenceCase({
        caseId: `${options.suiteId}.post-current-if-match-modifies`,
        title: `${options.title} stores merged POST changes when the current If-Match header is supplied`,
        specVersion,
        requirementRefs: [
          {
            id: "XAPI-00322",
            section: "Communication 3.1",
            title: "Document resources update data when POST If-Match matches the current ETag",
          },
        ],
        tags: baseTags,
        capabilityFlags: ["communication", "concurrency", options.resourceTag],
        legacyTraceSuiteFile: concurrencyLegacySuiteFile,
        notes: [`proof-slice ${options.resourceTag} post current if-match modifies`],
        steps: [
          {
            request: buildVersionedRequest("POST", options.endpoint, postCurrentModifiedQuery, {
              value: options.initialBody,
              fixtureName: options.bodyFixtureName,
            }),
            assertion: {
              status: 204,
            },
          },
          {
            request: buildVersionedRequest(
              "POST",
              options.endpoint,
              postCurrentModifiedQuery,
              {
                value: postReplacementBody,
              },
              {
                "If-Match": initialEtag,
              },
            ),
            assertion: {
              status: 204,
            },
          },
          {
            request: buildVersionedRequest("GET", options.endpoint, postCurrentModifiedQuery),
            assertion: {
              status: 200,
              jsonPathEquals: [
                {
                  path: [],
                  equals: postReplacementBody,
                },
              ],
            },
          },
        ],
      }),
      requestSequenceCase({
        caseId: `${options.suiteId}.delete-rejects-stale-if-match`,
        title: `${options.title} rejects DELETE requests with a stale If-Match header`,
        specVersion,
        requirementRefs: [
          {
            id: "XAPI-00322",
            section: "Communication 3.1",
            title: "Document resources reject stale If-Match values for DELETE",
          },
        ],
        tags: baseTags,
        capabilityFlags: ["communication", "concurrency", options.resourceTag],
        legacyTraceSuiteFile: concurrencyLegacySuiteFile,
        notes: [`proof-slice ${options.resourceTag} delete stale if-match`],
        steps: [
          {
            request: buildVersionedRequest("POST", options.endpoint, deleteStaleQuery, {
              value: options.initialBody,
              fixtureName: options.bodyFixtureName,
            }),
            assertion: {
              status: 204,
            },
          },
          {
            request: buildVersionedRequest("DELETE", options.endpoint, deleteStaleQuery, undefined, {
              "If-Match": staleEtag,
            }),
            assertion: {
              status: 412,
            },
          },
          {
            request: buildVersionedRequest("GET", options.endpoint, deleteStaleQuery),
            assertion: {
              status: 200,
              jsonPathEquals: [
                {
                  path: [],
                  equals: options.initialBody,
                },
              ],
            },
          },
        ],
      }),
      requestSequenceCase({
        caseId: `${options.suiteId}.delete-stale-preserves-document`,
        title: `${options.title} leaves the existing document unchanged after a stale DELETE If-Match`,
        specVersion,
        requirementRefs: [
          {
            id: "XAPI-00322",
            section: "Communication 3.1",
            title: "Document resources do not delete data when DELETE If-Match is stale",
          },
        ],
        tags: baseTags,
        capabilityFlags: ["communication", "concurrency", options.resourceTag],
        legacyTraceSuiteFile: concurrencyLegacySuiteFile,
        notes: [`proof-slice ${options.resourceTag} delete stale preserves document`],
        steps: [
          {
            request: buildVersionedRequest("POST", options.endpoint, deleteStalePreserveQuery, {
              value: options.initialBody,
              fixtureName: options.bodyFixtureName,
            }),
            assertion: {
              status: 204,
            },
          },
          {
            request: buildVersionedRequest("DELETE", options.endpoint, deleteStalePreserveQuery, undefined, {
              "If-Match": staleEtag,
            }),
            assertion: {
              status: 412,
            },
          },
          {
            request: buildVersionedRequest("GET", options.endpoint, deleteStalePreserveQuery),
            assertion: {
              status: 200,
              jsonPathEquals: [
                {
                  path: [],
                  equals: options.initialBody,
                },
              ],
            },
          },
        ],
      }),
      requestSequenceCase({
        caseId: `${options.suiteId}.delete-accepts-current-if-match`,
        title: `${options.title} accepts DELETE requests with the current If-Match header`,
        specVersion,
        requirementRefs: [
          {
            id: "XAPI-00322",
            section: "Communication 3.1",
            title: "Document resources accept current If-Match values for DELETE",
          },
        ],
        tags: baseTags,
        capabilityFlags: ["communication", "concurrency", options.resourceTag],
        legacyTraceSuiteFile: concurrencyLegacySuiteFile,
        notes: [`proof-slice ${options.resourceTag} delete current if-match`],
        steps: [
          {
            request: buildVersionedRequest("POST", options.endpoint, deleteCurrentQuery, {
              value: options.initialBody,
              fixtureName: options.bodyFixtureName,
            }),
            assertion: {
              status: 204,
            },
          },
          {
            request: buildVersionedRequest("DELETE", options.endpoint, deleteCurrentQuery, undefined, {
              "If-Match": initialEtag,
            }),
            assertion: {
              status: 204,
            },
          },
          {
            request: buildVersionedRequest("GET", options.endpoint, deleteCurrentQuery),
            assertion: {
              status: 404,
            },
          },
        ],
      }),
    ],
  };
}

export function createV20CommunicationProofSliceSuite(): SuiteDefinition {
  // Audited no-op 2.0 legacy suites: H.Communication1.2-Headers.js and
  // H.Communication1.3-AlternateRequestSyntax.js do not add executable xAPI 2.0
  // requirements beyond the existing communication surface already covered here.
  const headNoBodyExpectation: JsonPathExpectation[] = [
    {
      path: [],
      equals: undefined,
    },
  ];

  const headActivityId = "https://example.test/xapi/activities/head-proof";
  const headAgentMbox = "mailto:head-proof-agent@example.test";
  const headActivityStatement = buildProofStatement(260, [
    {
      operation: "set",
      path: ["object"],
      value: buildActivityObjectFixture(headActivityId),
    },
  ]);
  const headAgentStatement = buildProofStatement(261, [
    {
      operation: "set",
      path: ["actor"],
      value: buildAgentWithMbox(headAgentMbox),
    },
  ]);
  const headStateIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/head-state",
    stateId: "head-state-document",
  });
  const headActivityProfileIdentity = buildActivityProfileIdentityFixture({
    activityId: "https://example.test/xapi/activities/head-activity-profile",
    profileId: "head-activity-profile-document",
  });
  const headAgentProfileIdentity = buildAgentProfileIdentityFixture({
    agent: JSON.stringify({
      objectType: "Agent",
      mbox: "mailto:head-agent-profile@example.test",
      name: "Head Agent Profile",
    }),
    profileId: "head-agent-profile-document",
  });
  const documentRollbackPersistedStatement = buildProofStatement(983, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/document-resource-rollback-valid",
    },
  ]);
  const documentRollbackRejectedStatement = buildProofStatement(984, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: invalidLegacyString,
    },
  ]);

  const documentResourceRejectedWriteRollbackCase = requestSequenceCase({
    caseId: "v2.communication.document-resources.rejected-write-rollback",
    title: "Document Resources leave stored data unchanged when a batched statement write is rejected",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00182",
        section: "Communication 2.2",
        title: "Rejected requests do not modify stored data",
      },
    ],
    tags: ["v2.0.0", "communication", "document-resources", "atomicity"],
    capabilityFlags: ["communication", "document", "transport", "rollback"],
    legacyTraceSuiteFile: documentResourcesLegacySuiteFile,
    notes: ["proof-slice communication document resource rejected write rollback"],
    steps: [
      {
        request: buildStatementBatchPostRequest([
          documentRollbackPersistedStatement,
          documentRollbackRejectedStatement,
        ]),
        assertion: {
          status: 400,
        },
      },
      {
        request: buildStatementGetRequest(documentRollbackPersistedStatement.id),
        assertion: {
          status: 404,
        },
      },
    ],
  });

  const documentMergeOverwriteIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/document-resource-overwrite",
    stateId: "document-resource-overwrite",
  });
  const documentMergeShallowIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/document-resource-shallow",
    stateId: "document-resource-shallow",
  });

  const documentResourceMergeOverwriteCase = requestSequenceCase({
    caseId: "v2.communication.document-resources.merge-overwrites-duplicates",
    title: "Document Resources overwrite duplicate top-level values during a document merge",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00184",
        section: "Communication 2.2.s7.b1, Communication 2.2.s7.b2, Communication 2.2.s7.b3",
        title: "Document merges overwrite duplicate values from the previous document",
      },
    ],
    tags: ["v2.0.0", "communication", "document-resources", "merge"],
    capabilityFlags: ["communication", "document", "merge", "state"],
    legacyTraceSuiteFile: documentResourcesLegacySuiteFile,
    notes: ["proof-slice communication document merge duplicate overwrite"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", documentMergeOverwriteIdentity, {
          value: {
            car: "MKX",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "activities-state", documentMergeOverwriteIdentity, {
          value: {
            car: "MKZ",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-state", documentMergeOverwriteIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: [],
              equals: {
                car: "MKZ",
              },
            },
          ],
        },
      },
    ],
  });

  const documentResourceMergeShallowCase = requestSequenceCase({
    caseId: "v2.communication.document-resources.merge-is-one-level-deep",
    title: "Document Resources perform merge overwrites at one level deep by replacing the entire nested object",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00183",
        section: "Communication 2.2.s7.b1, Communication 2.2.s7.b2, Communication 2.2.s7.b3",
        title: "Document merges only overwrite one level deep",
      },
    ],
    tags: ["v2.0.0", "communication", "document-resources", "merge"],
    capabilityFlags: ["communication", "document", "merge", "state"],
    legacyTraceSuiteFile: documentResourcesLegacySuiteFile,
    notes: ["proof-slice communication document merge shallow replacement"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", documentMergeShallowIdentity, {
          value: {
            car: {
              make: "Ford",
              model: "Escape",
            },
            driver: "Dale",
            series: {
              nascar: {
                series: "sprint",
              },
            },
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "activities-state", documentMergeShallowIdentity, {
          value: {
            car: {
              make: "Dodge",
              model: "Ram",
            },
            driver: "Jeff",
            series: {
              nascar: {
                series: "nextel",
              },
            },
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-state", documentMergeShallowIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: [],
              equals: {
                car: {
                  make: "Dodge",
                  model: "Ram",
                },
                driver: "Jeff",
                series: {
                  nascar: {
                    series: "nextel",
                  },
                },
              },
            },
          ],
        },
      },
    ],
  });

  const errorCodePutCaseVariantStatement = buildProofStatement(1221, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/error-code-case-diff-put",
    },
  ]);

  const unrecognizedStatementQueryParamCase = singleRequestCase({
    caseId: "v2.communication.error-codes.statements.unrecognized-query-parameter",
    title: "The Statements Resource rejects GET requests that use an unrecognized query parameter",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00324",
        section: "Communication 3.2.s2.b1",
        title: "Requests with unrecognized parameters are rejected with 400 Bad Request",
      },
    ],
    tags: ["v2.0.0", "communication", "error-codes", "validation", "statements"],
    capabilityFlags: ["communication", "validation", "query", "statements"],
    legacyTraceSuiteFile: errorCodesLegacySuiteFile,
    request: buildStatementCollectionRequest({
      foo: "bar",
    }),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice error codes unrecognized statement query parameter"],
  });

  const caseDifferingStatementGetParamVariants: Array<{
    caseId: string;
    title: string;
    query: Record<string, string>;
  }> = [
    {
      caseId: "v2.communication.error-codes.statements.case-differing.statement-id.get",
      title: 'The Statements Resource rejects GET requests that use the case-differing "StatementId" parameter',
      query: {
        StatementId: buildProofUuid(1222),
      },
    },
    {
      caseId: "v2.communication.error-codes.statements.case-differing.voided-statement-id.get",
      title: 'The Statements Resource rejects GET requests that use the case-differing "VoidedStatementId" parameter',
      query: {
        VoidedStatementId: buildProofUuid(1223),
      },
    },
    {
      caseId: "v2.communication.error-codes.statements.case-differing.agent",
      title: 'The Statements Resource rejects GET requests that use the case-differing "Agent" parameter',
      query: {
        Agent: buildAgentQuery("mailto:error-codes-agent@example.test"),
      },
    },
    {
      caseId: "v2.communication.error-codes.statements.case-differing.verb",
      title: 'The Statements Resource rejects GET requests that use the case-differing "Verb" parameter',
      query: {
        Verb: "http://adlnet.gov/expapi/verbs/attended",
      },
    },
    {
      caseId: "v2.communication.error-codes.statements.case-differing.activity",
      title: 'The Statements Resource rejects GET requests that use the case-differing "Activity" parameter',
      query: {
        Activity: "https://example.test/xapi/activities/error-codes-activity",
      },
    },
    {
      caseId: "v2.communication.error-codes.statements.case-differing.registration",
      title: 'The Statements Resource rejects GET requests that use the case-differing "Registration" parameter',
      query: {
        Registration: buildProofUuid(1224),
      },
    },
    {
      caseId: "v2.communication.error-codes.statements.case-differing.related-activities",
      title: 'The Statements Resource rejects GET requests that use the case-differing "Related_Activities" parameter',
      query: {
        Related_Activities: "true",
      },
    },
    {
      caseId: "v2.communication.error-codes.statements.case-differing.related-agents",
      title: 'The Statements Resource rejects GET requests that use the case-differing "Related_Agents" parameter',
      query: {
        Related_Agents: "true",
      },
    },
    {
      caseId: "v2.communication.error-codes.statements.case-differing.since",
      title: 'The Statements Resource rejects GET requests that use the case-differing "Since" parameter',
      query: {
        Since: "2012-06-01T19:09:13.245Z",
      },
    },
    {
      caseId: "v2.communication.error-codes.statements.case-differing.until",
      title: 'The Statements Resource rejects GET requests that use the case-differing "Until" parameter',
      query: {
        Until: "2012-06-01T19:09:13.245Z",
      },
    },
    {
      caseId: "v2.communication.error-codes.statements.case-differing.limit",
      title: 'The Statements Resource rejects GET requests that use the case-differing "Limit" parameter',
      query: {
        Limit: "10",
      },
    },
    {
      caseId: "v2.communication.error-codes.statements.case-differing.format",
      title: 'The Statements Resource rejects GET requests that use the case-differing "Format" parameter',
      query: {
        Format: "ids",
      },
    },
    {
      caseId: "v2.communication.error-codes.statements.case-differing.attachments",
      title: 'The Statements Resource rejects GET requests that use the case-differing "Attachments" parameter',
      query: {
        Attachments: "true",
      },
    },
    {
      caseId: "v2.communication.error-codes.statements.case-differing.ascending",
      title: 'The Statements Resource rejects GET requests that use the case-differing "Ascending" parameter',
      query: {
        Ascending: "true",
      },
    },
  ];

  const caseDifferingStatementGetParamCases = caseDifferingStatementGetParamVariants.map((variant) =>
    singleRequestCase({
      caseId: variant.caseId,
      title: variant.title,
      specVersion,
      requirementRefs: [
        {
          id: "XAPI-00325",
          section: "Communication 3.2.s3.b8",
          title: "Requests with case-differing parameters are rejected with 400 Bad Request",
        },
      ],
      tags: ["v2.0.0", "communication", "error-codes", "validation", "statements"],
      capabilityFlags: ["communication", "validation", "query", "statements"],
      legacyTraceSuiteFile: errorCodesLegacySuiteFile,
      request: buildStatementCollectionRequest(variant.query),
      assertion: {
        status: 400,
      },
      notes: [`proof-slice error codes ${variant.caseId}`],
    }),
  );

  const caseDifferingStatementIdPutCase = singleRequestCase({
    caseId: "v2.communication.error-codes.statements.case-differing.statement-id.put",
    title: 'The Statements Resource rejects PUT requests that use the case-differing "StatementId" parameter',
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00325",
        section: "Communication 3.2.s3.b8",
        title: "Requests with case-differing parameters are rejected with 400 Bad Request",
      },
    ],
    tags: ["v2.0.0", "communication", "error-codes", "validation", "statements"],
    capabilityFlags: ["communication", "validation", "transport", "statements"],
    legacyTraceSuiteFile: errorCodesLegacySuiteFile,
    request: {
      method: "PUT",
      endpoint: "statements",
      authMode: "basic",
      headers: buildVersionedHeaders(),
      query: {
        StatementId: errorCodePutCaseVariantStatement.id,
      },
      body: buildStatementBody(errorCodePutCaseVariantStatement),
    },
    assertion: {
      status: 400,
    },
    notes: ["proof-slice error codes case-differing StatementId PUT"],
  });

  const headActivitiesCase = requestSequenceCase({
    caseId: "v2.communication.head.activities",
    title: "The Activities Resource responds to HEAD in the same way as GET but without a message body",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00126",
        section: "Communication 1.1",
        title: "An LRS accepts HEAD requests",
      },
      {
        id: "XAPI-00125",
        section: "Communication 1.1.s3.b1",
        title: "HEAD responses mirror GET without a message body",
      },
    ],
    tags: ["v2.0.0", "communication", "head", "activities"],
    capabilityFlags: ["communication", "head", "activities"],
    legacyTraceSuiteFile: headRequestsLegacySuiteFile,
    notes: ["proof-slice head activities"],
    steps: [
      {
        request: buildStatementPostRequest(headActivityStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildHeadRequest("activities", {
          activityId: headActivityId,
        }),
        assertion: {
          status: 200,
          expectedHeaders: [
            {
              key: "X-Experience-API-Version",
              equals: specVersion,
            },
          ],
          jsonPathEquals: headNoBodyExpectation,
        },
      },
    ],
  });

  const headActivityProfileCase = requestSequenceCase({
    caseId: "v2.communication.head.activities-profile",
    title: "The Activity Profile Resource supports HEAD without returning a message body",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00126",
        section: "Communication 1.1",
        title: "An LRS accepts HEAD requests",
      },
      {
        id: "XAPI-00125",
        section: "Communication 1.1.s3.b1",
        title: "HEAD responses mirror GET without a message body",
      },
    ],
    tags: ["v2.0.0", "communication", "head", "activities-profile"],
    capabilityFlags: ["communication", "head", "activities-profile"],
    legacyTraceSuiteFile: headRequestsLegacySuiteFile,
    notes: ["proof-slice head activities profile"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-profile", headActivityProfileIdentity, {
          value: buildActivityProfileDocumentFixture(),
          fixtureName: "activity-profile-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildHeadRequest("activities-profile", headActivityProfileIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: headNoBodyExpectation,
        },
      },
    ],
  });

  const headStateCase = requestSequenceCase({
    caseId: "v2.communication.head.activities-state",
    title: "The State Resource supports HEAD without returning a message body",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00126",
        section: "Communication 1.1",
        title: "An LRS accepts HEAD requests",
      },
      {
        id: "XAPI-00125",
        section: "Communication 1.1.s3.b1",
        title: "HEAD responses mirror GET without a message body",
      },
    ],
    tags: ["v2.0.0", "communication", "head", "activities-state"],
    capabilityFlags: ["communication", "head", "activities-state"],
    legacyTraceSuiteFile: headRequestsLegacySuiteFile,
    notes: ["proof-slice head activities state"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", headStateIdentity, {
          value: buildActivityStateDocumentFixture(),
          fixtureName: "activity-state-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildHeadRequest("activities-state", headStateIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: headNoBodyExpectation,
        },
      },
    ],
  });

  const headAgentsCase = requestSequenceCase({
    caseId: "v2.communication.head.agents",
    title: "The Agents Resource supports HEAD without returning a message body",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00126",
        section: "Communication 1.1",
        title: "An LRS accepts HEAD requests",
      },
      {
        id: "XAPI-00125",
        section: "Communication 1.1.s3.b1",
        title: "HEAD responses mirror GET without a message body",
      },
    ],
    tags: ["v2.0.0", "communication", "head", "agents"],
    capabilityFlags: ["communication", "head", "agents"],
    legacyTraceSuiteFile: headRequestsLegacySuiteFile,
    notes: ["proof-slice head agents"],
    steps: [
      {
        request: buildStatementPostRequest(headAgentStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildHeadRequest("agents", {
          agent: buildAgentQuery(headAgentMbox),
        }),
        assertion: {
          status: 200,
          jsonPathEquals: headNoBodyExpectation,
        },
      },
    ],
  });

  const headAgentProfileCase = requestSequenceCase({
    caseId: "v2.communication.head.agents-profile",
    title: "The Agent Profile Resource supports HEAD without returning a message body",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00126",
        section: "Communication 1.1",
        title: "An LRS accepts HEAD requests",
      },
      {
        id: "XAPI-00125",
        section: "Communication 1.1.s3.b1",
        title: "HEAD responses mirror GET without a message body",
      },
    ],
    tags: ["v2.0.0", "communication", "head", "agents-profile"],
    capabilityFlags: ["communication", "head", "agents-profile"],
    legacyTraceSuiteFile: headRequestsLegacySuiteFile,
    notes: ["proof-slice head agents profile"],
    steps: [
      {
        request: buildVersionedRequest("POST", "agents-profile", headAgentProfileIdentity, {
          value: buildAgentProfileDocumentFixture(),
          fixtureName: "agent-profile-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildHeadRequest("agents-profile", headAgentProfileIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: headNoBodyExpectation,
        },
      },
    ],
  });

  const headStatementsCase = singleRequestCase({
    caseId: "v2.communication.head.statements",
    title: "The Statements Resource accepts HEAD without returning a message body",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00126",
        section: "Communication 1.1",
        title: "An LRS accepts HEAD requests",
      },
      {
        id: "XAPI-00125",
        section: "Communication 1.1.s3.b1",
        title: "HEAD responses mirror GET without a message body",
      },
    ],
    tags: ["v2.0.0", "communication", "head", "statements"],
    capabilityFlags: ["communication", "head", "statements"],
    legacyTraceSuiteFile: headRequestsLegacySuiteFile,
    request: buildHeadRequest("statements", {}),
    assertion: {
      status: 200,
      jsonPathEquals: headNoBodyExpectation,
    },
    notes: ["proof-slice head statements"],
  });

  const headWithoutContentLengthCase = singleRequestCase({
    caseId: "v2.communication.head.no-content-length.head-statements",
    title: "The Statements Resource accepts HEAD requests without a Content-Length header",
    specVersion,
    requirementRefs: [
      {
        id: "LEGACY-HEAD-NO-CONTENT-LENGTH",
        section: "Communication 1.1",
        title: "An LRS accepts HEAD requests without Content-Length headers",
      },
    ],
    tags: ["v2.0.0", "communication", "head", "statements"],
    capabilityFlags: ["communication", "head"],
    legacyTraceSuiteFile: headRequestsLegacySuiteFile,
    request: buildHeadRequest("statements", {}),
    assertion: {
      status: 200,
      jsonPathEquals: headNoBodyExpectation,
    },
    notes: ["proof-slice head statements no content-length"],
  });

  const getWithoutContentLengthCase = singleRequestCase({
    caseId: "v2.communication.head.no-content-length.get-statements",
    title: "The Statements Resource accepts GET requests without a Content-Length header",
    specVersion,
    requirementRefs: [
      {
        id: "LEGACY-GET-NO-CONTENT-LENGTH",
        section: "Communication 1.1",
        title: "An LRS accepts GET requests without Content-Length headers",
      },
    ],
    tags: ["v2.0.0", "communication", "head", "statements"],
    capabilityFlags: ["communication", "head"],
    legacyTraceSuiteFile: headRequestsLegacySuiteFile,
    request: buildVersionedRequest("GET", "statements", {}),
    assertion: {
      status: 200,
    },
    notes: ["proof-slice get statements no content-length"],
  });

  const headAboutAcceptedCase = singleRequestCase({
    caseId: "v2.communication.head.about.accepted",
    title: "The About Resource accepts HEAD requests",
    specVersion,
    requirementRefs: [
      {
        id: "LEGACY-HEAD-ABOUT-ACCEPTED",
        section: "Communication 1.1",
        title: "The About Resource accepts HEAD requests",
      },
    ],
    tags: ["v2.0.0", "communication", "head", "about"],
    capabilityFlags: ["communication", "head", "about"],
    legacyTraceSuiteFile: headRequestsLegacySuiteFile,
    request: buildHeadRequest("about", {}),
    assertion: {
      status: 200,
    },
    notes: ["proof-slice head about accepted"],
  });

  const headAboutNoBodyCase = singleRequestCase({
    caseId: "v2.communication.head.about.no-body",
    title: "The About Resource responds to HEAD without a message body",
    specVersion,
    requirementRefs: [
      {
        id: "LEGACY-HEAD-ABOUT-NO-BODY",
        section: "Communication 1.1.s3.b1",
        title: "The About Resource responds to HEAD without a message body",
      },
    ],
    tags: ["v2.0.0", "communication", "head", "about"],
    capabilityFlags: ["communication", "head", "about"],
    legacyTraceSuiteFile: headRequestsLegacySuiteFile,
    request: buildHeadRequest("about", {}),
    assertion: {
      status: 200,
      jsonPathEquals: headNoBodyExpectation,
    },
    notes: ["proof-slice head about no body"],
  });

  const headActivitiesAcceptedCase = requestSequenceCase({
    caseId: "v2.communication.head.activities.accepted",
    title: "The Activities Resource accepts HEAD requests",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00126",
        section: "Communication 1.1",
        title: "The Activities Resource accepts HEAD requests",
      },
    ],
    tags: ["v2.0.0", "communication", "head", "activities"],
    capabilityFlags: ["communication", "head", "activities"],
    legacyTraceSuiteFile: headRequestsLegacySuiteFile,
    notes: ["proof-slice head activities accepted"],
    steps: [
      {
        request: buildStatementPostRequest(headActivityStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildHeadRequest("activities", {
          activityId: headActivityId,
        }),
        assertion: {
          status: 200,
          expectedHeaders: [
            {
              key: "X-Experience-API-Version",
              equals: specVersion,
            },
          ],
        },
      },
    ],
  });

  const headActivityProfileAcceptedCase = requestSequenceCase({
    caseId: "v2.communication.head.activities-profile.accepted",
    title: "The Activity Profile Resource accepts HEAD requests",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00126",
        section: "Communication 1.1",
        title: "The Activity Profile Resource accepts HEAD requests",
      },
    ],
    tags: ["v2.0.0", "communication", "head", "activities-profile"],
    capabilityFlags: ["communication", "head", "activities-profile"],
    legacyTraceSuiteFile: headRequestsLegacySuiteFile,
    notes: ["proof-slice head activities profile accepted"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-profile", headActivityProfileIdentity, {
          value: buildActivityProfileDocumentFixture(),
          fixtureName: "activity-profile-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildHeadRequest("activities-profile", headActivityProfileIdentity),
        assertion: {
          status: 200,
        },
      },
    ],
  });

  const headStateAcceptedCase = requestSequenceCase({
    caseId: "v2.communication.head.activities-state.accepted",
    title: "The State Resource accepts HEAD requests",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00126",
        section: "Communication 1.1",
        title: "The State Resource accepts HEAD requests",
      },
    ],
    tags: ["v2.0.0", "communication", "head", "activities-state"],
    capabilityFlags: ["communication", "head", "activities-state"],
    legacyTraceSuiteFile: headRequestsLegacySuiteFile,
    notes: ["proof-slice head activities state accepted"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", headStateIdentity, {
          value: buildActivityStateDocumentFixture(),
          fixtureName: "activity-state-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildHeadRequest("activities-state", headStateIdentity),
        assertion: {
          status: 200,
        },
      },
    ],
  });

  const headAgentsAcceptedCase = requestSequenceCase({
    caseId: "v2.communication.head.agents.accepted",
    title: "The Agents Resource accepts HEAD requests",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00126",
        section: "Communication 1.1",
        title: "The Agents Resource accepts HEAD requests",
      },
    ],
    tags: ["v2.0.0", "communication", "head", "agents"],
    capabilityFlags: ["communication", "head", "agents"],
    legacyTraceSuiteFile: headRequestsLegacySuiteFile,
    notes: ["proof-slice head agents accepted"],
    steps: [
      {
        request: buildStatementPostRequest(headAgentStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildHeadRequest("agents", {
          agent: buildAgentQuery(headAgentMbox),
        }),
        assertion: {
          status: 200,
        },
      },
    ],
  });

  const headAgentProfileAcceptedCase = requestSequenceCase({
    caseId: "v2.communication.head.agents-profile.accepted",
    title: "The Agent Profile Resource accepts HEAD requests",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00126",
        section: "Communication 1.1",
        title: "The Agent Profile Resource accepts HEAD requests",
      },
    ],
    tags: ["v2.0.0", "communication", "head", "agents-profile"],
    capabilityFlags: ["communication", "head", "agents-profile"],
    legacyTraceSuiteFile: headRequestsLegacySuiteFile,
    notes: ["proof-slice head agents profile accepted"],
    steps: [
      {
        request: buildVersionedRequest("POST", "agents-profile", headAgentProfileIdentity, {
          value: buildAgentProfileDocumentFixture(),
          fixtureName: "agent-profile-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildHeadRequest("agents-profile", headAgentProfileIdentity),
        assertion: {
          status: 200,
        },
      },
    ],
  });

  const headStatementsAcceptedCase = singleRequestCase({
    caseId: "v2.communication.head.statements.accepted",
    title: "The Statements Resource accepts HEAD requests",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00126",
        section: "Communication 1.1",
        title: "The Statements Resource accepts HEAD requests",
      },
    ],
    tags: ["v2.0.0", "communication", "head", "statements"],
    capabilityFlags: ["communication", "head", "statements"],
    legacyTraceSuiteFile: headRequestsLegacySuiteFile,
    request: buildHeadRequest("statements", {}),
    assertion: {
      status: 200,
    },
    notes: ["proof-slice head statements accepted"],
  });

  const versionHeaderStatement = buildProofStatement(262);
  const missingHeaderGetStatement = buildProofStatement(263);
  const missingHeaderPostStatement = buildProofStatement(264);
  const missingHeaderPutStatement = buildProofStatement(265);
  const invalidHeaderGetStatement = buildProofStatement(266);
  const invalidHeaderPostStatement = buildProofStatement(267);
  const invalidHeaderPutStatement = buildProofStatement(268);
  const versioningShapePreservedStatement = buildProofStatement(985, [
    {
      operation: "set",
      path: ["verb", "id"],
      value: "https://example.test/xapi/verbs/versioning-shape-preserved",
    },
  ]);

  const versionHeaderResponseCase = requestSequenceCase({
    caseId: "v2.communication.versioning.response-header",
    title: "Statement responses include the X-Experience-API-Version response header",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00333",
        section: "Communication 3.3.s3.b1",
        title: "Statement responses include X-Experience-API-Version",
      },
    ],
    tags: ["v2.0.0", "communication", "versioning"],
    capabilityFlags: ["communication", "versioning"],
    legacyTraceSuiteFile: versioningLegacySuiteFile,
    notes: ["proof-slice versioning response header"],
    steps: [
      {
        request: buildStatementPostRequest(versionHeaderStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementGetRequest(versionHeaderStatement.id),
        assertion: {
          status: 200,
          expectedHeaders: [
            {
              key: "X-Experience-API-Version",
              equals: specVersion,
            },
          ],
        },
      },
    ],
  });

  const versioningShapePreservedCase = requestSequenceCase({
    caseId: "v2.communication.versioning.statement-shape-preserved",
    title: "Statement retrieval preserves actor, verb, and object data without version-based rewrites",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00330",
        section: "Communication 3.3.s3.b4",
        title: "An LRS does not modify statement structure based on prior version formats",
      },
    ],
    tags: ["v2.0.0", "communication", "versioning"],
    capabilityFlags: ["communication", "versioning", "retrieval"],
    legacyTraceSuiteFile: versioningLegacySuiteFile,
    notes: ["proof-slice versioning statement shape preserved"],
    steps: [
      {
        request: buildStatementPostRequest(versioningShapePreservedStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementGetRequest(versioningShapePreservedStatement.id),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["actor"],
              equals: versioningShapePreservedStatement.actor,
            },
            {
              path: ["verb"],
              equals: versioningShapePreservedStatement.verb,
            },
            {
              path: ["object"],
              equals: versioningShapePreservedStatement.object,
            },
          ],
        },
      },
    ],
  });

  const missingGetHeaderCase = requestSequenceCase({
    caseId: "v2.communication.versioning.get-missing-request-header",
    title: "The Statements Resource rejects GET requests that omit X-Experience-API-Version",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00331",
        section: "Communication 3.3.s4.b1",
        title: "Non-About GET requests require X-Experience-API-Version",
      },
    ],
    tags: ["v2.0.0", "communication", "versioning", "validation"],
    capabilityFlags: ["communication", "versioning", "validation"],
    legacyTraceSuiteFile: versioningLegacySuiteFile,
    notes: ["proof-slice versioning missing header get"],
    steps: [
      {
        request: buildStatementPostRequest(missingHeaderGetStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildRequestWithoutVersionHeader("GET", "statements", {
          statementId: missingHeaderGetStatement.id,
        }),
        assertion: {
          status: 400,
        },
      },
    ],
  });

  const missingPostHeaderCase = singleRequestCase({
    caseId: "v2.communication.versioning.post-missing-request-header",
    title: "The Statements Resource rejects POST requests that omit X-Experience-API-Version",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00331",
        section: "Communication 3.3.s4.b1",
        title: "Non-About POST requests require X-Experience-API-Version",
      },
    ],
    tags: ["v2.0.0", "communication", "versioning", "validation"],
    capabilityFlags: ["communication", "versioning", "validation"],
    legacyTraceSuiteFile: versioningLegacySuiteFile,
    request: buildRequestWithoutVersionHeader(
      "POST",
      "statements",
      {},
      {
        value: missingHeaderPostStatement,
      },
    ),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice versioning missing header post"],
  });

  const missingPutHeaderCase = singleRequestCase({
    caseId: "v2.communication.versioning.put-missing-request-header",
    title: "The Statements Resource rejects PUT requests that omit X-Experience-API-Version",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00331",
        section: "Communication 3.3.s4.b1",
        title: "Non-About PUT requests require X-Experience-API-Version",
      },
    ],
    tags: ["v2.0.0", "communication", "versioning", "validation"],
    capabilityFlags: ["communication", "versioning", "validation"],
    legacyTraceSuiteFile: versioningLegacySuiteFile,
    request: buildRequestWithoutVersionHeader(
      "PUT",
      "statements",
      {
        statementId: missingHeaderPutStatement.id,
      },
      {
        value: missingHeaderPutStatement,
      },
    ),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice versioning missing header put"],
  });

  const invalidGetHeaderCase = requestSequenceCase({
    caseId: "v2.communication.versioning.get-invalid-request-header",
    title: "The Statements Resource rejects GET requests with an invalid X-Experience-API-Version value",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00331",
        section: "Communication 3.3.s4.b1",
        title: "Non-About GET requests reject invalid X-Experience-API-Version values",
      },
    ],
    tags: ["v2.0.0", "communication", "versioning", "validation"],
    capabilityFlags: ["communication", "versioning", "validation"],
    legacyTraceSuiteFile: versioningLegacySuiteFile,
    notes: ["proof-slice versioning invalid header get"],
    steps: [
      {
        request: buildStatementPostRequest(invalidHeaderGetStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementGetRequest(invalidHeaderGetStatement.id, {
          "X-Experience-API-Version": "BAD",
        }),
        assertion: {
          status: 400,
        },
      },
    ],
  });

  const invalidPostHeaderCase = singleRequestCase({
    caseId: "v2.communication.versioning.post-invalid-request-header",
    title: "The Statements Resource rejects POST requests with an invalid X-Experience-API-Version value",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00331",
        section: "Communication 3.3.s4.b1",
        title: "Non-About POST requests reject invalid X-Experience-API-Version values",
      },
    ],
    tags: ["v2.0.0", "communication", "versioning", "validation"],
    capabilityFlags: ["communication", "versioning", "validation"],
    legacyTraceSuiteFile: versioningLegacySuiteFile,
    request: buildStatementPostRequest(invalidHeaderPostStatement, {
      "X-Experience-API-Version": "BAD",
    }),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice versioning invalid header post"],
  });

  const invalidPutHeaderCase = singleRequestCase({
    caseId: "v2.communication.versioning.put-invalid-request-header",
    title: "The Statements Resource rejects PUT requests with an invalid X-Experience-API-Version value",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00331",
        section: "Communication 3.3.s4.b1",
        title: "Non-About PUT requests reject invalid X-Experience-API-Version values",
      },
    ],
    tags: ["v2.0.0", "communication", "versioning", "validation"],
    capabilityFlags: ["communication", "versioning", "validation"],
    legacyTraceSuiteFile: versioningLegacySuiteFile,
    request: buildStatementPutRequest(invalidHeaderPutStatement.id, invalidHeaderPutStatement, {
      "X-Experience-API-Version": "BAD",
    }),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice versioning invalid header put"],
  });

  const authenticationSuccessStatement = buildProofStatement(269);
  const authenticationBadStatement = buildProofStatement(270);
  const authenticationMalformedStatement = buildProofStatement(271);

  const basicAuthenticationCase = singleRequestCase({
    caseId: "v2.communication.authentication.basic-accepted",
    title: "The Statements Resource accepts requests authenticated with valid HTTP Basic credentials",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00335",
        section: "Communication 4.0",
        title: "An LRS supports HTTP Basic Authentication",
      },
    ],
    tags: ["v2.0.0", "communication", "authentication"],
    capabilityFlags: ["communication", "authentication"],
    legacyTraceSuiteFile: authenticationLegacySuiteFile,
    request: buildStatementPutRequest(authenticationSuccessStatement.id, authenticationSuccessStatement),
    assertion: {
      status: 204,
    },
    notes: ["proof-slice authentication basic accepted"],
  });

  const badAuthenticationCase = singleRequestCase({
    caseId: "v2.communication.authentication.bad-basic-rejected",
    title: "The Statements Resource rejects requests authenticated with invalid HTTP Basic credentials",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00334",
        section: "Communication 4.0",
        title: "Bad authorization is rejected with 401 Unauthorized",
      },
    ],
    tags: ["v2.0.0", "communication", "authentication", "validation"],
    capabilityFlags: ["communication", "authentication", "validation"],
    legacyTraceSuiteFile: authenticationLegacySuiteFile,
    request: buildStatementPutRequest(authenticationBadStatement.id, authenticationBadStatement, {
      Authorization: `Basic ${Buffer.from("bad:credentials").toString("base64")}`,
    }),
    assertion: {
      status: 401,
    },
    notes: ["proof-slice authentication bad basic rejected"],
  });

  const malformedAuthenticationCase = singleRequestCase({
    caseId: "v2.communication.authentication.malformed-basic-rejected",
    title: "The Statements Resource rejects malformed Authorization headers with 401 Unauthorized",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00334",
        section: "Communication 4.0",
        title: "Malformed authorization is rejected with 401 Unauthorized",
      },
    ],
    tags: ["v2.0.0", "communication", "authentication", "validation"],
    capabilityFlags: ["communication", "authentication", "validation"],
    legacyTraceSuiteFile: authenticationLegacySuiteFile,
    request: buildStatementPutRequest(authenticationMalformedStatement.id, authenticationMalformedStatement, {
      Authorization: "Basic:not-base64",
    }),
    assertion: {
      status: 401,
    },
    notes: ["proof-slice authentication malformed basic rejected"],
  });

  const unicodeVerbId = "https://example.test/xapi/verbs/unicode-proof";
  const unicodeStatement = buildProofStatement(272, [
    {
      operation: "set",
      path: ["verb"],
      value: {
        id: unicodeVerbId,
        display: {
          "en-US": "snowman ☃",
          "ja-JP": "学習完了",
        },
      },
    },
  ]);

  const utf8EncodingCase = requestSequenceCase({
    caseId: "v2.communication.encoding.utf8-roundtrip",
    title: "The Statements Resource preserves UTF-8 string content across submit and retrieval",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00015",
        section: "Communication 1.4.s1.b1",
        title: "All strings are encoded and interpreted as UTF-8",
      },
    ],
    tags: ["v2.0.0", "communication", "encoding"],
    capabilityFlags: ["communication", "encoding"],
    legacyTraceSuiteFile: encodingLegacySuiteFile,
    notes: ["proof-slice utf8 roundtrip"],
    steps: [
      {
        request: buildStatementPostRequest(unicodeStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementGetRequest(unicodeStatement.id),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["verb", "display"],
              equals: {
                "en-US": "snowman ☃",
                "ja-JP": "学習完了",
              },
            },
          ],
        },
      },
    ],
  });

  const contentTypeBoundary = "mock-proof-content-types";
  const rawAttachmentBody = "proof raw attachment";
  const rawAttachmentSha = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const extraAttachmentSha = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
  const fileUrlAttachmentStatement = buildProofStatement(273, [
    {
      operation: "set",
      path: ["attachments"],
      value: [
        buildAttachmentFixture({
          fileUrl: "https://example.test/files/content-type-proof.txt",
        }),
      ],
    },
  ]);
  const duplicateJsonFileUrlAttachmentStatement = buildProofStatement(275, [
    {
      operation: "set",
      path: ["attachments"],
      value: [
        buildAttachmentFixture({
          fileUrl: "https://example.test/files/content-type-proof-repeat.txt",
        }),
      ],
    },
  ]);
  const multipartNoAttachmentsStatement = buildProofStatement(276);
  const rawAttachmentStatement = buildProofStatement(274, [
    {
      operation: "set",
      path: ["attachments"],
      value: [
        buildAttachmentFixture({
          contentType: "text/plain",
          length: rawAttachmentBody.length,
          sha2: rawAttachmentSha,
          fileUrl: undefined,
        }),
      ],
    },
  ]);
  const rawAttachmentPart: MultipartStatementAttachment = {
    contentType: "text/plain",
    sha2: rawAttachmentSha,
    body: rawAttachmentBody,
  };
  const rawMultipartContentType = `multipart/mixed; boundary=${contentTypeBoundary}`;
  const validRawMultipartBody = buildMultipartStatementRequestBody(
    rawAttachmentStatement,
    [rawAttachmentPart],
    contentTypeBoundary,
  );
  const missingInitialBoundaryMultipartBody =
    `Content-Type: application/json\r\n\r\n${JSON.stringify(rawAttachmentStatement)}\r\n` +
    `--${contentTypeBoundary}\r\n` +
    `Content-Type: text/plain\r\n` +
    `Content-Transfer-Encoding: binary\r\n` +
    `X-Experience-API-Hash: ${rawAttachmentSha}\r\n\r\n` +
    `${rawAttachmentBody}\r\n` +
    `--${contentTypeBoundary}--\r\n`;
  const missingBoundaryBetweenPartsBody =
    `--${contentTypeBoundary}\r\n` +
    `Content-Type: application/json\r\n\r\n${JSON.stringify(rawAttachmentStatement)}\r\n` +
    `Content-Type: text/plain\r\n` +
    `Content-Transfer-Encoding: binary\r\n` +
    `X-Experience-API-Hash: ${rawAttachmentSha}\r\n\r\n` +
    `${rawAttachmentBody}\r\n` +
    `--${contentTypeBoundary}--\r\n`;
  const firstPartNotJsonMultipartBody =
    `--${contentTypeBoundary}\r\n` +
    `Content-Type: text/plain\r\n\r\n${JSON.stringify(rawAttachmentStatement)}\r\n` +
    `--${contentTypeBoundary}\r\n` +
    `Content-Type: text/plain\r\n` +
    `Content-Transfer-Encoding: binary\r\n` +
    `X-Experience-API-Hash: ${rawAttachmentSha}\r\n\r\n` +
    `${rawAttachmentBody}\r\n` +
    `--${contentTypeBoundary}--\r\n`;
  const splitStatementsAcrossPartsBody =
    `--${contentTypeBoundary}\r\n` +
    `Content-Type: application/json\r\n\r\n${JSON.stringify(rawAttachmentStatement)}\r\n` +
    `--${contentTypeBoundary}\r\n` +
    `Content-Type: application/json\r\n\r\n${JSON.stringify(rawAttachmentStatement)}\r\n` +
    `--${contentTypeBoundary}\r\n` +
    `Content-Type: text/plain\r\n` +
    `Content-Transfer-Encoding: binary\r\n` +
    `X-Experience-API-Hash: ${rawAttachmentSha}\r\n\r\n` +
    `${rawAttachmentBody}\r\n` +
    `--${contentTypeBoundary}--\r\n`;

  const jsonFileUrlContentTypeCase = singleRequestCase({
    caseId: "v2.communication.content-types.json-file-url",
    title: "Statement POST accepts application/json when attachments only use fileUrl",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00127",
        section: "Communication 1.5.1",
        title: "Statement writes accept application/json for fileUrl attachments",
      },
    ],
    tags: ["v2.0.0", "communication", "content-types"],
    capabilityFlags: ["communication", "content-types"],
    legacyTraceSuiteFile: contentTypesLegacySuiteFile,
    request: buildStatementPostRequest(fileUrlAttachmentStatement),
    assertion: {
      status: 200,
    },
    notes: ["proof-slice content types json fileUrl"],
  });

  const multipartFileUrlContentTypeCase = singleRequestCase({
    caseId: "v2.communication.content-types.multipart-file-url",
    title: "Statement POST accepts multipart or mixed when attachments only use fileUrl",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00127",
        section: "Communication 1.5.1",
        title: "Statement writes accept multipart or mixed for fileUrl attachments",
      },
    ],
    tags: ["v2.0.0", "communication", "content-types"],
    capabilityFlags: ["communication", "content-types"],
    legacyTraceSuiteFile: contentTypesLegacySuiteFile,
    request: buildMultipartStatementPostRequest(
      fileUrlAttachmentStatement,
      [],
      {},
      {
        boundary: contentTypeBoundary,
      },
    ),
    assertion: {
      status: 200,
    },
    notes: ["proof-slice content types multipart fileUrl"],
  });

  const multipartRawAttachmentContentTypeCase = singleRequestCase({
    caseId: "v2.communication.content-types.multipart-raw-attachment",
    title: "Statement POST accepts multipart or mixed when raw attachment parts are present",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00127",
        section: "Communication 1.5.1",
        title: "Statement writes accept multipart or mixed for raw attachment data",
      },
    ],
    tags: ["v2.0.0", "communication", "content-types"],
    capabilityFlags: ["communication", "content-types"],
    legacyTraceSuiteFile: contentTypesLegacySuiteFile,
    request: buildMultipartStatementPostRequest(
      rawAttachmentStatement,
      [
        {
          contentType: "text/plain",
          sha2: rawAttachmentSha,
          body: rawAttachmentBody,
        },
      ],
      {},
      {
        boundary: contentTypeBoundary,
      },
    ),
    assertion: {
      status: 200,
    },
    notes: ["proof-slice content types multipart raw attachment"],
  });

  const duplicateJsonFileUrlContentTypeCase = singleRequestCase({
    caseId: "v2.communication.content-types.json-file-url-repeat",
    title: "Statement POST also accepts application/json for repeated fileUrl attachment coverage",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00127",
        section: "Communication 1.5.1",
        title: "Statement writes accept application/json for fileUrl attachments",
      },
    ],
    tags: ["v2.0.0", "communication", "content-types"],
    capabilityFlags: ["communication", "content-types"],
    legacyTraceSuiteFile: contentTypesLegacySuiteFile,
    request: buildStatementPostRequest(duplicateJsonFileUrlAttachmentStatement),
    assertion: {
      status: 200,
    },
    notes: ["proof-slice content types json fileUrl repeat"],
  });

  const multipartWithoutAttachmentsContentTypeCase = singleRequestCase({
    caseId: "v2.communication.content-types.multipart-without-attachments",
    title: "Statement POST accepts multipart or mixed requests that contain no attachments",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00127",
        section: "Communication 1.5.1",
        title: "Statement writes accept multipart or mixed requests without attachments",
      },
    ],
    tags: ["v2.0.0", "communication", "content-types"],
    capabilityFlags: ["communication", "content-types"],
    legacyTraceSuiteFile: contentTypesLegacySuiteFile,
    request: buildMultipartStatementPostRequest(
      multipartNoAttachmentsStatement,
      [],
      {},
      { boundary: contentTypeBoundary },
    ),
    assertion: {
      status: 200,
    },
    notes: ["proof-slice content types multipart without attachments"],
  });

  const jsonRawAttachmentRejectedCase = singleRequestCase({
    caseId: "v2.communication.content-types.json-raw-attachment-rejected",
    title: "Statement POST rejects application or json when raw attachment parts are missing",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00129",
        section: "Communication 1.5.1.s1.b2",
        title: "Statement writes reject application or json when raw attachment parts are missing",
      },
    ],
    tags: ["v2.0.0", "communication", "content-types", "validation"],
    capabilityFlags: ["communication", "content-types", "validation"],
    legacyTraceSuiteFile: contentTypesLegacySuiteFile,
    request: buildStatementPostRequest(rawAttachmentStatement),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice content types json raw attachment rejected"],
  });

  const formDataFileUrlRejectedCase = singleRequestCase({
    caseId: "v2.communication.content-types.form-data-file-url-rejected",
    title: "Statement POST rejects multipart or form-data when attachments are submitted with fileUrl metadata",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00127",
        section: "Communication 1.5.1",
        title: "Statement writes reject multipart or form-data for attachment submission",
      },
    ],
    tags: ["v2.0.0", "communication", "content-types", "validation"],
    capabilityFlags: ["communication", "content-types", "validation"],
    legacyTraceSuiteFile: contentTypesLegacySuiteFile,
    request: buildMultipartStatementPostRequest(
      fileUrlAttachmentStatement,
      [],
      {},
      {
        boundary: contentTypeBoundary,
        contentType: `multipart/form-data; boundary=${contentTypeBoundary}`,
      },
    ),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice content types form-data fileUrl rejected"],
  });

  const formDataRawRejectedCase = singleRequestCase({
    caseId: "v2.communication.content-types.form-data-raw-rejected",
    title: "Statement POST rejects multipart or form-data when raw attachment parts are submitted",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00127",
        section: "Communication 1.5.1",
        title: "Statement writes reject multipart or form-data for raw attachment submission",
      },
    ],
    tags: ["v2.0.0", "communication", "content-types", "validation"],
    capabilityFlags: ["communication", "content-types", "validation"],
    legacyTraceSuiteFile: contentTypesLegacySuiteFile,
    request: buildMultipartStatementPostRequest(
      rawAttachmentStatement,
      [
        {
          contentType: "text/plain",
          sha2: rawAttachmentSha,
          body: rawAttachmentBody,
        },
      ],
      {},
      {
        boundary: contentTypeBoundary,
        contentType: `multipart/form-data; boundary=${contentTypeBoundary}`,
      },
    ),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice content types form-data raw rejected"],
  });

  const extraMultipartSectionRejectedCase = singleRequestCase({
    caseId: "v2.communication.content-types.extra-multipart-section-rejected",
    title: "Statement POST rejects multipart or mixed requests with excess attachment sections",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00128",
        section: "Communication 1.5.1.s1.b2",
        title: "Statement writes reject excess multipart sections that are not attachments",
      },
    ],
    tags: ["v2.0.0", "communication", "content-types", "validation"],
    capabilityFlags: ["communication", "content-types", "validation"],
    legacyTraceSuiteFile: contentTypesLegacySuiteFile,
    request: buildMultipartStatementPostRequest(
      rawAttachmentStatement,
      [
        {
          contentType: "text/plain",
          sha2: rawAttachmentSha,
          body: rawAttachmentBody,
        },
      ],
      {},
      {
        boundary: contentTypeBoundary,
        extraParts: [
          {
            contentType: "text/plain",
            sha2: extraAttachmentSha,
            body: "extra multipart section",
          },
        ],
      },
    ),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice content types extra multipart section rejected"],
  });

  const missingInitialBoundaryRejectedCase = singleRequestCase({
    caseId: "v2.communication.content-types.missing-initial-boundary-rejected",
    title: "Statement POST rejects multipart or mixed requests whose body omits the initial boundary",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00131",
        section: "Communication 1.5.2.s2.b2",
        title: "Statement writes reject multipart bodies that omit the boundary marker",
      },
    ],
    tags: ["v2.0.0", "communication", "content-types", "validation"],
    capabilityFlags: ["communication", "content-types", "validation"],
    legacyTraceSuiteFile: contentTypesLegacySuiteFile,
    request: buildMalformedMultipartStatementRequest(missingInitialBoundaryMultipartBody, rawMultipartContentType),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice content types missing initial boundary rejected"],
  });

  const missingBoundaryBetweenPartsRejectedCase = singleRequestCase({
    caseId: "v2.communication.content-types.missing-boundary-between-parts-rejected",
    title: "Statement POST rejects multipart or mixed requests that omit a boundary before a later part",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00130",
        section: "Communication 1.5.2.s2.b2",
        title: "Statement writes reject multipart bodies that omit boundaries between parts",
      },
    ],
    tags: ["v2.0.0", "communication", "content-types", "validation"],
    capabilityFlags: ["communication", "content-types", "validation"],
    legacyTraceSuiteFile: contentTypesLegacySuiteFile,
    request: buildMalformedMultipartStatementRequest(missingBoundaryBetweenPartsBody, rawMultipartContentType),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice content types missing boundary between parts rejected"],
  });

  const missingBoundaryHeaderRejectedCase = singleRequestCase({
    caseId: "v2.communication.content-types.missing-boundary-header-rejected",
    title: "Statement POST rejects multipart or mixed requests whose Content-Type omits the boundary parameter",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00130",
        section: "Communication 1.5.2.s2.b2",
        title: "Statement writes reject multipart headers that omit the boundary parameter",
      },
    ],
    tags: ["v2.0.0", "communication", "content-types", "validation"],
    capabilityFlags: ["communication", "content-types", "validation"],
    legacyTraceSuiteFile: contentTypesLegacySuiteFile,
    request: buildMalformedMultipartStatementRequest(validRawMultipartBody, "multipart/mixed;"),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice content types missing boundary header rejected"],
  });

  const firstPartNotJsonRejectedCase = singleRequestCase({
    caseId: "v2.communication.content-types.first-part-not-json-rejected",
    title: "Statement POST rejects multipart or mixed requests whose first part is not application/json",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00134",
        section: "Communication 1.5.2.s2.b2.b1",
        title: "Statement writes reject multipart requests whose first part is not application/json",
      },
    ],
    tags: ["v2.0.0", "communication", "content-types", "validation"],
    capabilityFlags: ["communication", "content-types", "validation"],
    legacyTraceSuiteFile: contentTypesLegacySuiteFile,
    request: buildMalformedMultipartStatementRequest(firstPartNotJsonMultipartBody, rawMultipartContentType),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice content types first part not json rejected"],
  });

  const splitStatementsAcrossPartsRejectedCase = singleRequestCase({
    caseId: "v2.communication.content-types.split-statements-across-parts-rejected",
    title: "Statement POST rejects multipart or mixed requests that split statements across multiple parts",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00133",
        section: "Communication 1.5.2.s2.b2.b1",
        title: "Statement writes reject multipart requests that split statements across parts",
      },
    ],
    tags: ["v2.0.0", "communication", "content-types", "validation"],
    capabilityFlags: ["communication", "content-types", "validation"],
    legacyTraceSuiteFile: contentTypesLegacySuiteFile,
    request: buildMalformedMultipartStatementRequest(splitStatementsAcrossPartsBody, rawMultipartContentType),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice content types split statements across parts rejected"],
  });

  const missingAttachmentHashRejectedCase = singleRequestCase({
    caseId: "v2.communication.content-types.missing-attachment-hash-rejected",
    title: "Statement POST rejects multipart or mixed requests whose attachment parts omit X-Experience-API-Hash",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00132",
        section: "Communication 1.5.2.s2.b2.b3",
        title: "Statement writes reject attachment parts that omit X-Experience-API-Hash",
      },
    ],
    tags: ["v2.0.0", "communication", "content-types", "validation"],
    capabilityFlags: ["communication", "content-types", "validation"],
    legacyTraceSuiteFile: contentTypesLegacySuiteFile,
    request: buildMultipartStatementPostRequest(
      rawAttachmentStatement,
      [],
      {},
      {
        boundary: contentTypeBoundary,
        extraParts: [
          {
            contentType: "text/plain",
            body: rawAttachmentBody,
          },
        ],
      },
    ),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice content types missing attachment hash rejected"],
  });

  const mismatchedAttachmentHashRejectedCase = singleRequestCase({
    caseId: "v2.communication.content-types.mismatched-attachment-hash-rejected",
    title: "Statement POST rejects multipart or mixed requests whose attachment hash does not match a statement sha2",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00132",
        section: "Communication 1.5.2.s2.b2.b3",
        title: "Statement writes reject attachment parts whose hash does not match a statement sha2",
      },
    ],
    tags: ["v2.0.0", "communication", "content-types", "validation"],
    capabilityFlags: ["communication", "content-types", "validation"],
    legacyTraceSuiteFile: contentTypesLegacySuiteFile,
    request: buildMultipartStatementPostRequest(
      rawAttachmentStatement,
      [
        {
          ...rawAttachmentPart,
          sha2: extraAttachmentSha,
        },
      ],
      {},
      {
        boundary: contentTypeBoundary,
      },
    ),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice content types mismatched attachment hash rejected"],
  });

  const invalidTransferEncodingRejectedCase = singleRequestCase({
    caseId: "v2.communication.content-types.invalid-transfer-encoding-rejected",
    title:
      "Statement POST rejects multipart or mixed requests whose attachment parts do not use binary transfer encoding",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00135",
        section: "Communication 1.5.2",
        title: "Statement writes reject attachment parts that do not use binary transfer encoding",
      },
    ],
    tags: ["v2.0.0", "communication", "content-types", "validation"],
    capabilityFlags: ["communication", "content-types", "validation"],
    legacyTraceSuiteFile: contentTypesLegacySuiteFile,
    request: buildMultipartStatementPostRequest(
      rawAttachmentStatement,
      [
        {
          ...rawAttachmentPart,
          contentTransferEncoding: "base64",
        },
      ],
      {},
      {
        boundary: contentTypeBoundary,
      },
    ),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice content types invalid transfer encoding rejected"],
  });

  const stateConcurrencySuite = buildDocumentConcurrencyResourceSuite({
    suiteId: "v2.communication.concurrency.activities-state",
    title: "State Resource Concurrency",
    endpoint: "activities-state",
    bodyFixtureName: "activity-state-default",
    buildQuery: (idSuffix) =>
      buildActivityStateIdentityFixture({
        activityId: `https://example.test/xapi/activities/concurrency-state-${idSuffix}`,
        stateId: `proof-concurrency-state-${idSuffix}`,
      }),
    initialBody: buildActivityStateDocumentFixture(),
    replacementBody: {
      bookmark: "chapter-9",
      progress: {
        attempts: 9,
        complete: false,
      },
      context: {
        location: "lab-9",
      },
    },
    resourceTag: "activities-state",
  });

  const activityProfileConcurrencySuite = buildDocumentConcurrencyResourceSuite({
    suiteId: "v2.communication.concurrency.activities-profile",
    title: "Activity Profile Resource Concurrency",
    endpoint: "activities-profile",
    bodyFixtureName: "activity-profile-default",
    buildQuery: (idSuffix) =>
      buildActivityProfileIdentityFixture({
        activityId: `https://example.test/xapi/activities/concurrency-activity-profile-${idSuffix}`,
        profileId: `proof-concurrency-activity-profile-${idSuffix}`,
      }),
    initialBody: buildActivityProfileDocumentFixture(),
    replacementBody: {
      summary: "activity-profile-updated",
      metadata: {
        audience: "engineering",
        level: "advanced",
      },
    },
    resourceTag: "activities-profile",
  });

  const agentProfileConcurrencySuite = buildDocumentConcurrencyResourceSuite({
    suiteId: "v2.communication.concurrency.agents-profile",
    title: "Agent Profile Resource Concurrency",
    endpoint: "agents-profile",
    bodyFixtureName: "agent-profile-default",
    buildQuery: (idSuffix) =>
      buildAgentProfileIdentityFixture({
        agent: JSON.stringify({
          objectType: "Agent",
          mbox: `mailto:concurrency-agent-profile-${idSuffix}@example.test`,
          name: `Concurrency Agent ${idSuffix}`,
        }),
        profileId: `proof-concurrency-agent-profile-${idSuffix}`,
      }),
    initialBody: buildAgentProfileDocumentFixture(),
    replacementBody: {
      preference: "expanded",
      notifications: {
        email: false,
        digest: "weekly",
      },
    },
    resourceTag: "agents-profile",
  });

  return {
    type: "suite",
    id: "v2.proof-slice.communication",
    title: "Communication",
    specVersion,
    tags: ["proof-slice", "communication"],
    children: [
      {
        type: "suite",
        id: "v2.proof-slice.communication.head",
        title: "HEAD Requests",
        specVersion,
        tags: ["communication", "head"],
        children: [
          headAboutAcceptedCase,
          headAboutNoBodyCase,
          headActivitiesAcceptedCase,
          headActivitiesCase,
          headActivityProfileAcceptedCase,
          headActivityProfileCase,
          headStateAcceptedCase,
          headStateCase,
          headAgentsAcceptedCase,
          headAgentsCase,
          headAgentProfileAcceptedCase,
          headAgentProfileCase,
          headStatementsAcceptedCase,
          headStatementsCase,
          headWithoutContentLengthCase,
          getWithoutContentLengthCase,
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.communication.versioning",
        title: "Versioning",
        specVersion,
        tags: ["communication", "versioning"],
        children: [
          versionHeaderResponseCase,
          versioningShapePreservedCase,
          missingGetHeaderCase,
          missingPostHeaderCase,
          missingPutHeaderCase,
          invalidGetHeaderCase,
          invalidPostHeaderCase,
          invalidPutHeaderCase,
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.communication.authentication",
        title: "Authentication",
        specVersion,
        tags: ["communication", "authentication"],
        children: [basicAuthenticationCase, badAuthenticationCase, malformedAuthenticationCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.communication.encoding",
        title: "Encoding",
        specVersion,
        tags: ["communication", "encoding"],
        children: [utf8EncodingCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.communication.content-types",
        title: "Content Types",
        specVersion,
        tags: ["communication", "content-types"],
        children: [
          jsonFileUrlContentTypeCase,
          duplicateJsonFileUrlContentTypeCase,
          multipartFileUrlContentTypeCase,
          multipartWithoutAttachmentsContentTypeCase,
          multipartRawAttachmentContentTypeCase,
          jsonRawAttachmentRejectedCase,
          formDataFileUrlRejectedCase,
          formDataRawRejectedCase,
          extraMultipartSectionRejectedCase,
          missingInitialBoundaryRejectedCase,
          missingBoundaryBetweenPartsRejectedCase,
          missingBoundaryHeaderRejectedCase,
          firstPartNotJsonRejectedCase,
          splitStatementsAcrossPartsRejectedCase,
          missingAttachmentHashRejectedCase,
          mismatchedAttachmentHashRejectedCase,
          invalidTransferEncodingRejectedCase,
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.communication.error-codes",
        title: "Error Codes",
        specVersion,
        tags: ["communication", "error-codes"],
        children: [
          unrecognizedStatementQueryParamCase,
          caseDifferingStatementIdPutCase,
          ...caseDifferingStatementGetParamCases,
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.communication.concurrency",
        title: "Concurrency",
        specVersion,
        tags: ["communication", "concurrency"],
        children: [stateConcurrencySuite, activityProfileConcurrencySuite, agentProfileConcurrencySuite],
      },
      {
        type: "suite",
        id: "v2.proof-slice.communication.document-resources",
        title: "Document Resources",
        specVersion,
        tags: ["communication", "document-resources"],
        children: [
          documentResourceRejectedWriteRollbackCase,
          documentResourceMergeOverwriteCase,
          documentResourceMergeShallowCase,
        ],
      },
    ],
  };
}
