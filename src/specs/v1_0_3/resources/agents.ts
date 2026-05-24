import type { JsonObject, SuiteDefinition } from "../../../domain/contracts";
import { requestSequenceCase, singleRequestCase } from "../../../registry/families";
import { buildStatementFixture } from "../../../fixtures/v2_0/statements";
import { specVersion, upstreamV103Root } from "../shared";

const agentsResourceLegacySuiteFile = `${upstreamV103Root}/H.Communication2.4-AgentsResource.js`;

function buildVersionedRequest(
  method: "GET" | "POST",
  endpoint: "agents" | "statements",
  query: Record<string, string>,
  body?: unknown,
) {
  return {
    method,
    endpoint,
    authMode: "basic" as const,
    headers: {
      "X-Experience-API-Version": specVersion,
    },
    query,
    body: body
      ? {
          kind: "json" as const,
          value: body,
          sourceFixture: {
            version: specVersion,
            domain: "statements",
            name: "default",
          },
        }
      : undefined,
  };
}

function buildStatementPostRequest(statement: JsonObject) {
  return buildVersionedRequest("POST", "statements", {}, statement);
}

function buildAgentsGetRequest(agent: JsonObject | string) {
  const query = {
    agent: typeof agent === "string" ? agent : JSON.stringify(agent),
  };

  return buildVersionedRequest("GET", "agents", query);
}

function buildProofStatement(id: string, actor: JsonObject): JsonObject {
  return buildStatementFixture([
    {
      operation: "set",
      path: ["id"],
      value: id,
    },
    {
      operation: "set",
      path: ["actor"],
      value: actor,
    },
  ]) as JsonObject;
}

function buildAccount(homePage: string, name: string): JsonObject {
  return {
    homePage,
    name,
  };
}

function buildAgentWithMboxSha1sum(mboxSha1sum: string): JsonObject {
  return {
    objectType: "Agent",
    mbox_sha1sum: mboxSha1sum,
    name: "Mbox Sha1sum Agent",
  };
}

function buildAgentWithOpenId(openId: string): JsonObject {
  return {
    objectType: "Agent",
    openid: openId,
    name: "OpenId Agent",
  };
}

function buildAgentWithAccount(account: JsonObject): JsonObject {
  return {
    objectType: "Agent",
    account,
    name: "Account Agent",
  };
}

const invalidAgentQuery = {
  objectType: "Agent",
  account: {
    homePage: "https://example.test/invalid-agent-account",
  },
} as JsonObject;

export function createV103AgentsResourceProofSliceSuite(): SuiteDefinition {
  const roundTripMbox = "mailto:agents-resource-roundtrip-v1@example.test";
  const nameMergeMbox = "mailto:agents-resource-name-merge-v1@example.test";
  const mboxResourceValue = "mailto:agents-resource-mbox-v1@example.test";
  const mboxSha1sumValue = "0123456789abcdef0123456789abcdef01234567";
  const openIdValue = "https://example.test/agents/openid-resource-v1";
  const accountHomePage = "https://example.test/agents/account-homepage-v1";
  const accountName = "resource-account-v1";
  const unknownAgentMbox = "mailto:agents-resource-unknown-v1@example.test";

  const roundTripStatement = buildProofStatement("11111111-1111-4111-8111-000000000306", {
    objectType: "Agent",
    mbox: roundTripMbox,
    name: "Roundtrip Agent",
  });
  const nameMergeStatementOne = buildProofStatement("11111111-1111-4111-8111-000000000307", {
    objectType: "Agent",
    mbox: nameMergeMbox,
    name: "Alpha Name",
  });
  const nameMergeStatementTwo = buildProofStatement("11111111-1111-4111-8111-000000000308", {
    objectType: "Agent",
    mbox: nameMergeMbox,
    name: "Beta Name",
  });
  const mboxStatement = buildProofStatement("11111111-1111-4111-8111-000000000309", {
    objectType: "Agent",
    mbox: mboxResourceValue,
    name: "Mailbox Agent",
  });
  const mboxSha1sumStatement = buildProofStatement(
    "11111111-1111-4111-8111-000000000310",
    buildAgentWithMboxSha1sum(mboxSha1sumValue),
  );
  const openIdStatement = buildProofStatement(
    "11111111-1111-4111-8111-000000000311",
    buildAgentWithOpenId(openIdValue),
  );
  const accountStatement = buildProofStatement(
    "11111111-1111-4111-8111-000000000312",
    buildAgentWithAccount(buildAccount(accountHomePage, accountName)),
  );

  const roundTripCase = requestSequenceCase({
    caseId: "v1.agents.resource.roundtrip",
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
    tags: ["v1.0.3", "agents", "resource", "roundtrip"],
    capabilityFlags: ["agents", "retrieval"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    notes: ["v1 proof-slice agents resource roundtrip"],
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
    caseId: "v1.agents.resource.endpoint-exists",
    title: "The Agents Resource exists at /agents",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00245",
        section: "Communication 2.4",
        title: "The Agents Resource exists at /agents",
      },
    ],
    tags: ["v1.0.3", "agents", "resource", "basics"],
    capabilityFlags: ["agents", "retrieval"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    request: buildAgentsGetRequest({
      objectType: "Agent",
      mbox: unknownAgentMbox,
    }),
    assertion: {
      status: 200,
    },
    notes: ["v1 proof-slice agents resource endpoint exists"],
  });

  const acceptsGetCase = singleRequestCase({
    caseId: "v1.agents.resource.accepts-get",
    title: "The Agents Resource accepts GET requests",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00236",
        section: "Communication 2.4.s2",
        title: "The Agents Resource accepts GET requests",
      },
    ],
    tags: ["v1.0.3", "agents", "resource", "basics"],
    capabilityFlags: ["agents", "retrieval"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    request: buildAgentsGetRequest({
      objectType: "Agent",
      mbox: unknownAgentMbox,
    }),
    assertion: {
      status: 200,
    },
    notes: ["v1 proof-slice agents resource accepts get"],
  });

  const objectTypePersonCase = singleRequestCase({
    caseId: "v1.agents.resource.object-type-person",
    title: 'The Agents Resource returns a Person objectType of "Person"',
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00237",
        section: "Communication 2.4.s5.table1.row1",
        title: 'A Person objectType property is the string "Person"',
      },
    ],
    tags: ["v1.0.3", "agents", "resource", "person"],
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
    notes: ["v1 proof-slice agents resource objectType person"],
  });

  const missingAgentCase = singleRequestCase({
    caseId: "v1.agents.resource.missing-agent",
    title: "The Agents Resource rejects a GET request without the agent parameter",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00243",
        section: "Communication 2.4.s2.table1.row1",
        title: "The Agents Resource rejects requests without agent",
      },
    ],
    tags: ["v1.0.3", "agents", "resource", "validation"],
    capabilityFlags: ["agents", "validation"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    request: buildVersionedRequest("GET", "agents", {}),
    assertion: {
      status: 400,
    },
    notes: ["v1 proof-slice agents resource missing agent"],
  });

  const invalidAgentCase = singleRequestCase({
    caseId: "v1.agents.resource.invalid-agent",
    title: "The Agents Resource rejects a GET request whose agent parameter is not a valid Agent",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00249",
        section: "Communication 2.4",
        title: "The Agents Resource rejects invalid agent query values",
      },
    ],
    tags: ["v1.0.3", "agents", "resource", "validation"],
    capabilityFlags: ["agents", "validation"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    request: buildAgentsGetRequest(invalidAgentQuery),
    assertion: {
      status: 400,
    },
    notes: ["v1 proof-slice agents resource invalid agent query"],
  });

  const nameArrayCase = requestSequenceCase({
    caseId: "v1.agents.resource.name-array",
    title: "The Agents Resource returns a Person name array merged from matching Agent data",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00238",
        section: "Communication 2.4.s5.table1.row2",
        title: "A Person name property is an array of strings",
      },
    ],
    tags: ["v1.0.3", "agents", "resource", "person"],
    capabilityFlags: ["agents", "retrieval", "person"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    notes: [
      "v1 proof-slice agents resource name array",
      "legacy note: Person.name is array-valued in Agents resource responses",
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
          jsonPathEquals: [
            {
              path: ["name"],
              equals: ["Beta Name"],
            },
          ],
        },
      },
    ],
  });

  const mboxCase = requestSequenceCase({
    caseId: "v1.agents.resource.mbox-array",
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
    tags: ["v1.0.3", "agents", "resource", "person"],
    capabilityFlags: ["agents", "retrieval", "person"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    notes: ["v1 proof-slice agents resource mbox array"],
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
    caseId: "v1.agents.resource.mbox-sha1sum-array",
    title: "The Agents Resource returns Person mbox_sha1sum values as a string array",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00240",
        section: "Communication 2.4.s5.table1.row4",
        title: "A Person mbox_sha1sum property is an array of strings",
      },
    ],
    tags: ["v1.0.3", "agents", "resource", "person"],
    capabilityFlags: ["agents", "retrieval", "person"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    notes: ["v1 proof-slice agents resource mbox_sha1sum array"],
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
    caseId: "v1.agents.resource.openid-array",
    title: "The Agents Resource returns Person openid values as a string array",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00241",
        section: "Communication 2.4.s5.table1.row5",
        title: "A Person openid property is an array of strings",
      },
    ],
    tags: ["v1.0.3", "agents", "resource", "person"],
    capabilityFlags: ["agents", "retrieval", "person"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    notes: ["v1 proof-slice agents resource openid array"],
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
    caseId: "v1.agents.resource.account-array",
    title: "The Agents Resource returns Person account values as an array of Account objects",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00242",
        section: "Communication 2.4.s5.table1.row6",
        title: "A Person account property is an array of Account objects",
      },
    ],
    tags: ["v1.0.3", "agents", "resource", "person"],
    capabilityFlags: ["agents", "retrieval", "person"],
    legacyTraceSuiteFile: agentsResourceLegacySuiteFile,
    notes: ["v1 proof-slice agents resource account array"],
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
    caseId: "v1.agents.resource.unknown-agent-fallback",
    title: "The Agents Resource still returns a Person Object when no additional Agent data is known",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00247",
        section: "Communication 2.4.s2.table1.row1",
        title: "The Agents Resource still returns a Person when no additional data is known",
      },
    ],
    tags: ["v1.0.3", "agents", "resource", "fallback"],
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
      "v1 proof-slice agents resource unknown agent fallback",
      "legacy note: endpoint still returns a Person object when no additional Agent data is known",
    ],
  });

  return {
    type: "suite",
    id: "v1.proof-slice.agents",
    title: "Agents Resource",
    specVersion,
    tags: ["proof-slice", "agents"],
    children: [
      {
        type: "suite",
        id: "v1.proof-slice.agents.basics",
        title: "Agents Basics",
        specVersion,
        tags: ["agents", "basics"],
        children: [endpointCase, acceptsGetCase, roundTripCase, missingAgentCase, invalidAgentCase],
      },
      {
        type: "suite",
        id: "v1.proof-slice.agents.person-shape",
        title: "Agents Person Shape",
        specVersion,
        tags: ["agents", "person"],
        children: [objectTypePersonCase, nameArrayCase, mboxCase, mboxSha1sumCase, openIdCase, accountCase],
      },
      {
        type: "suite",
        id: "v1.proof-slice.agents.fallback",
        title: "Agents Fallback",
        specVersion,
        tags: ["agents", "fallback"],
        children: [unknownAgentFallbackCase],
      },
    ],
  };
}
