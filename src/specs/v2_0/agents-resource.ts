import {
  agentsResourceLegacySuiteFile,
  buildAccount,
  buildAgentWithAccount,
  buildAgentWithMboxSha1sum,
  buildAgentWithOpenId,
  buildAgentsGetRequest,
  buildProofStatement,
  buildStatementPostRequest,
  buildVersionedRequest,
  invalidAgentQuery,
  requestSequenceCase,
  singleRequestCase,
  specVersion,
} from "./shared";
import type { SuiteDefinition } from "./shared";

export function createV20AgentsResourceProofSliceSuite(): SuiteDefinition {
  const roundTripMbox = "mailto:agents-resource-roundtrip@example.test";
  const nameMergeMbox = "mailto:agents-resource-name-merge@example.test";
  const mboxResourceValue = "mailto:agents-resource-mbox@example.test";
  const mboxSha1sumValue = "0123456789abcdef0123456789abcdef01234567";
  const openIdValue = "https://example.test/agents/openid-resource";
  const accountHomePage = "https://example.test/agents/account-homepage";
  const accountName = "resource-account";
  const unknownAgentMbox = "mailto:agents-resource-unknown@example.test";

  const roundTripStatement = buildProofStatement(240, [
    {
      operation: "set",
      path: ["actor"],
      value: {
        objectType: "Agent",
        mbox: roundTripMbox,
        name: "Roundtrip Agent",
      },
    },
  ]);
  const nameMergeStatementOne = buildProofStatement(241, [
    {
      operation: "set",
      path: ["actor"],
      value: {
        objectType: "Agent",
        mbox: nameMergeMbox,
        name: "Alpha Name",
      },
    },
  ]);
  const nameMergeStatementTwo = buildProofStatement(242, [
    {
      operation: "set",
      path: ["actor"],
      value: {
        objectType: "Agent",
        mbox: nameMergeMbox,
        name: "Beta Name",
      },
    },
  ]);
  const mboxStatement = buildProofStatement(243, [
    {
      operation: "set",
      path: ["actor"],
      value: {
        objectType: "Agent",
        mbox: mboxResourceValue,
        name: "Mailbox Agent",
      },
    },
  ]);
  const mboxSha1sumStatement = buildProofStatement(244, [
    {
      operation: "set",
      path: ["actor"],
      value: buildAgentWithMboxSha1sum(mboxSha1sumValue),
    },
  ]);
  const openIdStatement = buildProofStatement(245, [
    {
      operation: "set",
      path: ["actor"],
      value: buildAgentWithOpenId(openIdValue),
    },
  ]);
  const accountStatement = buildProofStatement(246, [
    {
      operation: "set",
      path: ["actor"],
      value: buildAgentWithAccount(buildAccount(accountHomePage, accountName)),
    },
  ]);

  const roundTripCase = requestSequenceCase({
    caseId: "v2.agents.resource.roundtrip",
    title: "The Agents Resource accepts GET requests and returns a Person Object for a stored Agent",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00245",
        section: "Communication 2.4",
        title: "The Agents Resource exists at /agents",
      },
      {
        id: "XAPI-00236",
        section: "Communication 2.4.s2",
        title: "The Agents Resource accepts GET requests",
      },
      {
        id: "XAPI-00248",
        section: "Communication 2.4.s2.table1.row1",
        title: "The Agents Resource returns a Person Object for the queried Agent",
      },
      {
        id: "XAPI-00246",
        section: "Communication 2.4.s2.table1.row1",
        title: "The Agents Resource endpoint accepts GET and returns a Person Object with array-valued attributes",
      },
    ],
    tags: ["v2.0.0", "agents", "resource", "roundtrip"],
    capabilityFlags: ["agents", "retrieval"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    notes: [
      "proof-slice agents resource roundtrip",
      'legacy note: XAPI-00245 upstream comment - An LRS has an Agents API with endpoint "base IRI" + /agents"',
      "legacy note: XAPI-00236 upstream comment - An LRS's Agents API accepts GET requests with response 200 OK, Person Object",
      'legacy note: XAPI-00248 upstream comment - An LRS\'s Agents API upon processing a successful GET request returns a Person Object based on matched data from the "agent" parameter and code 200 OK',
      "legacy note: XAPI-00246 upstream comment - same as 248 - The Agents Resource MUST have an endpoint which accepts GET requests and returns a special, Person Object where each attribute has an array value and it is legal to include multiple identifying properties.",
    ],
    steps: [
      {
        request: buildStatementPostRequest(roundTripStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildAgentsGetRequest({
          objectType: "Agent",
          mbox: roundTripMbox,
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["objectType"],
              equals: "Person",
            },
            {
              path: ["mbox"],
              equals: [roundTripMbox],
            },
          ],
        },
      },
    ],
  });

  const endpointCase = singleRequestCase({
    caseId: "v2.agents.resource.endpoint-exists",
    title: "The Agents Resource exists at /agents",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00245",
        section: "Communication 2.4",
        title: "The Agents Resource exists at /agents",
      },
    ],
    tags: ["v2.0.0", "agents", "resource", "basics"],
    capabilityFlags: ["agents", "retrieval"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    request: buildAgentsGetRequest({
      objectType: "Agent",
      mbox: unknownAgentMbox,
    }),
    assertion: {
      status: 200,
    },
    notes: [
      "proof-slice agents resource endpoint exists",
      'legacy note: XAPI-00245 upstream comment - An LRS has an Agents API with endpoint "base IRI" + /agents"',
    ],
  });

  const acceptsGetCase = singleRequestCase({
    caseId: "v2.agents.resource.accepts-get",
    title: "The Agents Resource accepts GET requests",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00236",
        section: "Communication 2.4.s2",
        title: "The Agents Resource accepts GET requests",
      },
    ],
    tags: ["v2.0.0", "agents", "resource", "basics"],
    capabilityFlags: ["agents", "retrieval"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    request: buildAgentsGetRequest({
      objectType: "Agent",
      mbox: unknownAgentMbox,
    }),
    assertion: {
      status: 200,
    },
    notes: [
      "proof-slice agents resource accepts get",
      "legacy note: XAPI-00236 upstream comment - An LRS's Agents API accepts GET requests with response 200 OK, Person Object",
    ],
  });

  const objectTypePersonCase = singleRequestCase({
    caseId: "v2.agents.resource.object-type-person",
    title: 'The Agents Resource returns a Person objectType of "Person"',
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00237",
        section: "Communication 2.4.s5.table1.row1",
        title: 'A Person objectType property is the string "Person"',
      },
    ],
    tags: ["v2.0.0", "agents", "resource", "person"],
    capabilityFlags: ["agents", "retrieval", "person"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    request: buildAgentsGetRequest({
      objectType: "Agent",
      mbox: unknownAgentMbox,
    }),
    assertion: {
      status: 200,
      jsonPathEquals: [
        {
          path: ["objectType"],
          equals: "Person",
        },
      ],
    },
    notes: [
      "proof-slice agents resource objectType person",
      'legacy note: XAPI-00237 upstream comment - A Person Object\'s "objectType" property is a String and is "Person" The LRS must return a valid “objectType” string.',
    ],
  });

  const missingAgentCase = singleRequestCase({
    caseId: "v2.agents.resource.missing-agent",
    title: "The Agents Resource rejects a GET request without the agent parameter",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00243",
        section: "Communication 2.4.s2.table1.row1",
        title: "The Agents Resource rejects requests without agent",
      },
    ],
    tags: ["v2.0.0", "agents", "resource", "validation"],
    capabilityFlags: ["agents", "validation"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    request: buildVersionedRequest("GET", "agents", {}),
    assertion: {
      status: 400,
    },
    notes: [
      "proof-slice agents resource missing agent",
      'legacy note: XAPI-00243 upstream comment - An LRS\'s Agents API rejects a GET request without "agent" as a parameter with error code 400 Bad Request',
    ],
  });

  const invalidAgentCase = singleRequestCase({
    caseId: "v2.agents.resource.invalid-agent",
    title: "The Agents Resource rejects a GET request whose agent parameter is not a valid Agent",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00249",
        section: "Communication 2.4",
        title: "The Agents Resource rejects invalid agent query values",
      },
    ],
    tags: ["v2.0.0", "agents", "resource", "validation"],
    capabilityFlags: ["agents", "validation"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    request: buildAgentsGetRequest(invalidAgentQuery),
    assertion: {
      status: 400,
    },
    notes: [
      "proof-slice agents resource invalid agent query",
      'legacy note: XAPI-00249 upstream comment - An LRSs Agents API rejects a GET request with "agent" as a parameter if it is not a valid (in structure) Agent with error code 400 Bad Request (XAPI-00249)',
    ],
  });

  const nameArrayCase = requestSequenceCase({
    caseId: "v2.agents.resource.name-array",
    title: "The Agents Resource returns a Person name array merged from matching Agent data",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00238",
        section: "Communication 2.4.s5.table1.row2",
        title: "A Person name property is an array of strings",
      },
    ],
    tags: ["v2.0.0", "agents", "resource", "person"],
    capabilityFlags: ["agents", "retrieval", "person"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    notes: [
      "proof-slice agents resource name array",
      "legacy note: Person.name is array-valued in Agents resource responses",
      'legacy note: XAPI-00238 upstream comment - A Person Object\'s "name" property is an Array of Strings. The LRS must return a “name” property with a valid Array of Strings, if present.',
    ],
    steps: [
      {
        request: buildStatementPostRequest(nameMergeStatementOne),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementPostRequest(nameMergeStatementTwo),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildAgentsGetRequest({
          objectType: "Agent",
          mbox: nameMergeMbox,
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [],
          jsonPathNotEquals: [
            {
              path: ["name"],
              equals: [],
            },
          ],
        },
      },
    ],
  });

  const mboxCase = requestSequenceCase({
    caseId: "v2.agents.resource.mbox-array",
    title: "The Agents Resource returns Person mbox values as a mailto IRI array",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00239",
        section: "Communication 2.4.s5.table1.row3",
        title: "A Person mbox property is an array of IRIs",
      },
      {
        id: "XAPI-00244",
        section: "Communication 2.4.s5.table1.row3",
        title: "A Person mbox value has the form mailto:emailaddress",
      },
    ],
    tags: ["v2.0.0", "agents", "resource", "person"],
    capabilityFlags: ["agents", "retrieval", "person"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    notes: [
      "proof-slice agents resource mbox array",
      'legacy note: XAPI-00239 upstream comment - A Person Object\'s "mbox" property is an Array of IRIs. The LRS must return an “mbox” property with a valid array of IRIs, if present.',
      'legacy note: XAPI-00244 upstream comment - A Person Object\'s "mbox" entries have the form "mailto:emailaddress". The LRS must return a Person Object which has a “mbox” value with the form "mailto:emailaddress"',
    ],
    steps: [
      {
        request: buildStatementPostRequest(mboxStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildAgentsGetRequest({
          objectType: "Agent",
          mbox: mboxResourceValue,
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["mbox"],
              equals: [mboxResourceValue],
            },
          ],
        },
      },
    ],
  });

  const mboxSha1sumCase = requestSequenceCase({
    caseId: "v2.agents.resource.mbox-sha1sum-array",
    title: "The Agents Resource returns Person mbox_sha1sum values as a string array",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00240",
        section: "Communication 2.4.s5.table1.row4",
        title: "A Person mbox_sha1sum property is an array of strings",
      },
    ],
    tags: ["v2.0.0", "agents", "resource", "person"],
    capabilityFlags: ["agents", "retrieval", "person"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    notes: [
      "proof-slice agents resource mbox_sha1sum array",
      'legacy note: XAPI-00240 upstream comment - A Person Object\'s "mbox_sha1sum" property is an Array of Strings. The LRS must return a Person Object which has a “mbox_sha1sum” and is valid array of strings, if present.',
    ],
    steps: [
      {
        request: buildStatementPostRequest(mboxSha1sumStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildAgentsGetRequest({
          objectType: "Agent",
          mbox_sha1sum: mboxSha1sumValue,
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["mbox_sha1sum"],
              equals: [mboxSha1sumValue],
            },
          ],
        },
      },
    ],
  });

  const openIdCase = requestSequenceCase({
    caseId: "v2.agents.resource.openid-array",
    title: "The Agents Resource returns Person openid values as a string array",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00241",
        section: "Communication 2.4.s5.table1.row5",
        title: "A Person openid property is an array of strings",
      },
    ],
    tags: ["v2.0.0", "agents", "resource", "person"],
    capabilityFlags: ["agents", "retrieval", "person"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    notes: [
      "proof-slice agents resource openid array",
      'legacy note: XAPI-00241 upstream comment - A Person Object\'s "openid" property is an Array of Strings The LRS must return a “openid” value which is valid array of strings, if present.',
    ],
    steps: [
      {
        request: buildStatementPostRequest(openIdStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildAgentsGetRequest({
          objectType: "Agent",
          openid: openIdValue,
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["openid"],
              equals: [openIdValue],
            },
          ],
        },
      },
    ],
  });

  const accountCase = requestSequenceCase({
    caseId: "v2.agents.resource.account-array",
    title: "The Agents Resource returns Person account values as an array of Account objects",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00242",
        section: "Communication 2.4.s5.table1.row6",
        title: "A Person account property is an array of Account objects",
      },
    ],
    tags: ["v2.0.0", "agents", "resource", "person"],
    capabilityFlags: ["agents", "retrieval", "person"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    notes: [
      "proof-slice agents resource account array",
      'legacy note: XAPI-00242 upstream comment - A Person Object\'s "account" property is an Array of Account Objects The LRS must return a Person Object with a “name” value which is a valid array of account objects, if present.',
    ],
    steps: [
      {
        request: buildStatementPostRequest(accountStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildAgentsGetRequest({
          objectType: "Agent",
          account: buildAccount(accountHomePage, accountName),
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["account"],
              equals: [buildAccount(accountHomePage, accountName)],
            },
          ],
        },
      },
    ],
  });

  const unknownAgentFallbackCase = singleRequestCase({
    caseId: "v2.agents.resource.unknown-agent-fallback",
    title: "The Agents Resource still returns a Person Object when no additional Agent data is known",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00247",
        section: "Communication 2.4.s2.table1.row1",
        title: "The Agents Resource still returns a Person when no additional data is known",
      },
    ],
    tags: ["v2.0.0", "agents", "resource", "fallback"],
    capabilityFlags: ["agents", "retrieval", "person"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    request: buildAgentsGetRequest({
      objectType: "Agent",
      mbox: unknownAgentMbox,
    }),
    assertion: {
      status: 200,
      jsonPathEquals: [
        {
          path: ["objectType"],
          equals: "Person",
        },
      ],
    },
    notes: [
      "proof-slice agents resource unknown agent fallback",
      "legacy note: endpoint still returns a Person object when no additional Agent data is known",
      "legacy note: XAPI-00247 upstream comment - same as 248 - If an LRS does not have any additional information about an Agent to return from the Agents Resource, the LRS MUST still return a Person when queried, but that Person Object will only include the information associated with the requested Agent.",
    ],
  });

  return {
    type: "suite",
    id: "v2.proof-slice.agents",
    title: "Agents Resource",
    specVersion,
    tags: ["proof-slice", "agents"],
    children: [
      {
        type: "suite",
        id: "v2.proof-slice.agents.basics",
        title: "Agents Basics",
        specVersion,
        tags: ["agents", "basics"],
        children: [endpointCase, acceptsGetCase, roundTripCase, missingAgentCase, invalidAgentCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.agents.person-shape",
        title: "Agents Person Shape",
        specVersion,
        tags: ["agents", "person"],
        children: [objectTypePersonCase, nameArrayCase, mboxCase, mboxSha1sumCase, openIdCase, accountCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.agents.fallback",
        title: "Agents Fallback",
        specVersion,
        tags: ["agents", "fallback"],
        children: [unknownAgentFallbackCase],
      },
    ],
  };
}
