import {
  aboutResourceLegacySuiteFile,
  buildAboutGetRequest,
  buildActivitiesGetRequest,
  buildRequestWithoutVersionHeader,
  singleRequestCase,
  specVersion,
} from "./shared";
import type { EndpointKind, SuiteDefinition } from "./shared";

export function createV20AboutResourceProofSliceSuite(): SuiteDefinition {
  const nonAboutVersionHeaderPattern = "^(2\\.0\\.0|1\\.0\\.[1-3]|0?\\.9\\d*)$";

  function buildNonAboutMissingVersionHeaderCase(caseId: string, title: string, endpoint: EndpointKind) {
    return singleRequestCase({
      caseId,
      title,
      specVersion,
      requirementRefs: [
        {
          id: "XAPI-00321",
          section: "Communication 2.8.s4.table1.row2",
          title: "Resources other than About reject requests without X-Experience-API-Version",
        },
      ],
      tags: ["v2.0.0", "about", "resource", "versioning"],
      capabilityFlags: ["versioning", "validation"],
      legacyTraceSuiteFile: aboutResourceLegacySuiteFile,
      request: buildRequestWithoutVersionHeader("GET", endpoint, {}),
      assertion: {
        status: 400,
        expectedHeaderPatterns: [
          {
            key: "X-Experience-API-Version",
            pattern: nonAboutVersionHeaderPattern,
          },
        ],
      },
      notes: [`proof-slice about resource missing version header ${endpoint}`],
    });
  }

  const aboutEndpointCase = singleRequestCase({
    caseId: "v2.about.resource.endpoint-exists",
    title: "The About Resource exists at /about",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00315",
        section: "Communication 2.8",
        title: "The About Resource exists at /about",
      },
    ],
    tags: ["v2.0.0", "about", "resource", "basics"],
    capabilityFlags: ["about", "retrieval"],
    legacyTraceSuiteFile: aboutResourceLegacySuiteFile,
    request: buildAboutGetRequest(),
    assertion: {
      status: 200,
    },
    notes: ["proof-slice about resource endpoint exists"],
  });

  const aboutVersionPropertyCase = singleRequestCase({
    caseId: "v2.about.resource.version-property",
    title: "The About Resource returns a version property on successful GET requests",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00319",
        section: "Communication 2.8.s4",
        title: "A successful About GET returns 200 OK and a version property",
      },
    ],
    tags: ["v2.0.0", "about", "resource", "basics"],
    capabilityFlags: ["about", "retrieval"],
    legacyTraceSuiteFile: aboutResourceLegacySuiteFile,
    request: buildAboutGetRequest(),
    assertion: {
      status: 200,
      jsonPathEquals: [
        {
          path: ["version"],
          equals: [specVersion],
        },
      ],
    },
    notes: ["proof-slice about resource version property"],
  });

  const aboutVersionArrayTypeCase = singleRequestCase({
    caseId: "v2.about.resource.version-array-type",
    title: "The About Resource returns the version property as an array of strings",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00318",
        section: "Communication 2.8.s4.table1.row1",
        title: "The About version property is an array of strings",
      },
    ],
    tags: ["v2.0.0", "about", "resource", "basics"],
    capabilityFlags: ["about", "retrieval"],
    legacyTraceSuiteFile: aboutResourceLegacySuiteFile,
    request: buildAboutGetRequest(),
    assertion: {
      status: 200,
      jsonPathEquals: [
        {
          path: ["version"],
          equals: [specVersion],
        },
      ],
    },
    notes: ["proof-slice about resource version array type"],
  });

  const aboutGetCase = singleRequestCase({
    caseId: "v2.about.resource.version-array",
    title: "The About Resource returns a version array that includes 2.0.0",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00315",
        section: "Communication 2.8",
        title: "The About Resource exists at /about",
      },
      {
        id: "XAPI-00319",
        section: "Communication 2.8.s4",
        title: "A successful About GET returns 200 OK and a version property",
      },
      {
        id: "XAPI-00318",
        section: "Communication 2.8.s4.table1.row1",
        title: "The About version property is an array of strings",
      },
      {
        id: "XAPI-00317",
        section: "Communication 2.8.s5.b1.b1",
        title: "The About version property contains 2.0.0",
      },
      {
        id: "XAPI-00316",
        section: "Communication 2.8.s5.b1.b1",
        title: "The About version property only contains allowed version values and includes 2.0.0",
      },
    ],
    tags: ["v2.0.0", "about", "resource"],
    capabilityFlags: ["about", "retrieval"],
    legacyTraceSuiteFile: aboutResourceLegacySuiteFile,
    request: buildAboutGetRequest(),
    assertion: {
      status: 200,
      jsonPathEquals: [
        {
          path: ["version"],
          equals: [specVersion],
        },
      ],
    },
    notes: ["proof-slice about resource version array"],
  });

  const aboutWithoutVersionHeaderCase = singleRequestCase({
    caseId: "v2.about.resource.version-header-exempt",
    title: "The About Resource accepts GET requests without an X-Experience-API-Version header",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00321",
        section: "Communication 2.8.s4.table1.row2",
        title: "The About Resource is exempt from the X-Experience-API-Version request-header requirement",
      },
    ],
    tags: ["v2.0.0", "about", "resource", "versioning"],
    capabilityFlags: ["about", "retrieval", "versioning"],
    legacyTraceSuiteFile: aboutResourceLegacySuiteFile,
    request: buildAboutGetRequest(false),
    assertion: {
      status: 200,
      jsonPathEquals: [
        {
          path: ["version"],
          equals: [specVersion],
        },
      ],
    },
    notes: ["proof-slice about resource version header exemption"],
  });

  const nonAboutRequiresVersionHeaderCase = singleRequestCase({
    caseId: "v2.about.resource.non-about-requires-version-header",
    title: "Non-About resources reject requests that omit X-Experience-API-Version",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00321",
        section: "Communication 2.8.s4.table1.row2",
        title: "Resources other than About reject requests without X-Experience-API-Version",
      },
    ],
    tags: ["v2.0.0", "about", "resource", "versioning"],
    capabilityFlags: ["versioning", "validation"],
    legacyTraceSuiteFile: aboutResourceLegacySuiteFile,
    request: buildActivitiesGetRequest("https://example.test/xapi/activities/missing-version-header", false),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice version header required outside about"],
  });

  const statementMissingVersionHeaderCase = buildNonAboutMissingVersionHeaderCase(
    "v2.about.resource.non-about-missing-version-header.statements",
    "The Statements Resource rejects GET requests without an X-Experience-API-Version header",
    "statements",
  );

  const activitiesProfileMissingVersionHeaderCase = buildNonAboutMissingVersionHeaderCase(
    "v2.about.resource.non-about-missing-version-header.activities-profile",
    "The Activity Profile Resource rejects GET requests without an X-Experience-API-Version header",
    "activities-profile",
  );

  const activitiesStateMissingVersionHeaderCase = buildNonAboutMissingVersionHeaderCase(
    "v2.about.resource.non-about-missing-version-header.activities-state",
    "The State Resource rejects GET requests without an X-Experience-API-Version header",
    "activities-state",
  );

  const agentsMissingVersionHeaderCase = buildNonAboutMissingVersionHeaderCase(
    "v2.about.resource.non-about-missing-version-header.agents",
    "The Agents Resource rejects GET requests without an X-Experience-API-Version header",
    "agents",
  );

  const agentsProfileMissingVersionHeaderCase = buildNonAboutMissingVersionHeaderCase(
    "v2.about.resource.non-about-missing-version-header.agents-profile",
    "The Agent Profile Resource rejects GET requests without an X-Experience-API-Version header",
    "agents-profile",
  );

  return {
    type: "suite",
    id: "v2.proof-slice.about",
    title: "About Resource",
    specVersion,
    tags: ["proof-slice", "about"],
    children: [
      {
        type: "suite",
        id: "v2.proof-slice.about.basics",
        title: "About Basics",
        specVersion,
        tags: ["about", "basics"],
        children: [
          aboutEndpointCase,
          aboutGetCase,
          aboutVersionPropertyCase,
          aboutVersionArrayTypeCase,
          aboutWithoutVersionHeaderCase,
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.about.versioning",
        title: "About Versioning",
        specVersion,
        tags: ["about", "versioning"],
        children: [
          nonAboutRequiresVersionHeaderCase,
          statementMissingVersionHeaderCase,
          activitiesProfileMissingVersionHeaderCase,
          activitiesStateMissingVersionHeaderCase,
          agentsMissingVersionHeaderCase,
          agentsProfileMissingVersionHeaderCase,
        ],
      },
    ],
  };
}
