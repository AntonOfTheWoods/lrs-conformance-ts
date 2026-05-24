import type { EndpointKind, HttpRequest, SuiteDefinition } from "../../domain/contracts";
import { singleRequestCase } from "../../registry/families";
import { specVersion, upstreamV103Root } from "./shared";

const aboutResourceLegacySuiteFile = `${upstreamV103Root}/H.Communication2.8-AboutResource.js`;

function buildGetRequest(endpoint: EndpointKind, includeVersionHeader = true): HttpRequest {
  return {
    method: "GET",
    endpoint,
    authMode: "basic",
    headers: includeVersionHeader
      ? {
          "X-Experience-API-Version": specVersion,
        }
      : {},
    query: {},
  };
}

export function createV103AboutResourceProofSliceSuite(): SuiteDefinition {
  const nonAboutVersionHeaderPattern = "^(2\\.0\\.[0-9]+|1\\.0\\.[0-9]+|0?\\.9\\d*)$";

  const endpointCase = singleRequestCase({
    caseId: "v1.about.resource.endpoint-exists",
    title: "The About Resource exists at /about",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00315",
        section: "Communication 2.8",
        title: "The About Resource exists at /about",
      },
    ],
    tags: ["v1.0.3", "about", "resource", "basics"],
    capabilityFlags: ["about", "retrieval"],
    legacyTraceSuiteFile: aboutResourceLegacySuiteFile,
    request: buildGetRequest("about"),
    assertion: {
      status: 200,
    },
    notes: ["v1 proof-slice about resource endpoint exists"],
  });

  const versionPropertyCase = singleRequestCase({
    caseId: "v1.about.resource.version-property",
    title: "The About Resource returns a version property on successful GET requests",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00319",
        section: "Communication 2.8.s4",
        title: "A successful About GET returns 200 OK and a version property",
      },
    ],
    tags: ["v1.0.3", "about", "resource", "basics"],
    capabilityFlags: ["about", "retrieval"],
    legacyTraceSuiteFile: aboutResourceLegacySuiteFile,
    request: buildGetRequest("about"),
    assertion: {
      status: 200,
      jsonPathEquals: [
        {
          path: ["version"],
          equals: [specVersion],
        },
      ],
    },
    notes: ["v1 proof-slice about resource version property"],
  });

  const versionArrayTypeCase = singleRequestCase({
    caseId: "v1.about.resource.version-array-type",
    title: "The About Resource returns the version property as an array",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00318",
        section: "Communication 2.8.s4.table1.row1",
        title: "The About version property is an array of strings",
      },
    ],
    tags: ["v1.0.3", "about", "resource", "basics"],
    capabilityFlags: ["about", "retrieval"],
    legacyTraceSuiteFile: aboutResourceLegacySuiteFile,
    request: buildGetRequest("about"),
    assertion: {
      status: 200,
      jsonPathEquals: [
        {
          path: ["version"],
          equals: [specVersion],
        },
      ],
    },
    notes: ["v1 proof-slice about resource version array type"],
  });

  const versionValuesCase = singleRequestCase({
    caseId: "v1.about.resource.version-values",
    title: "The About Resource returns allowed version values including 1.0.3",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00316",
        section: "Communication 2.8.s5.b1.b1",
        title: "About version property only contains allowed versions and includes 1.0.3",
      },
      {
        id: "XAPI-00317",
        section: "Communication 2.8.s5.b1.b1",
        title: "About version property contains at least one 1.0.3 value",
      },
    ],
    tags: ["v1.0.3", "about", "resource", "basics"],
    capabilityFlags: ["about", "retrieval"],
    legacyTraceSuiteFile: aboutResourceLegacySuiteFile,
    request: buildGetRequest("about"),
    assertion: {
      status: 200,
      jsonPathEquals: [
        {
          path: ["version"],
          equals: [specVersion],
        },
      ],
    },
    notes: ["v1 proof-slice about resource version values"],
  });

  const nonAboutMissingVersionHeaderCase = singleRequestCase({
    caseId: "v1.about.resource.non-about-requires-version-header",
    title: "Non-About resources reject requests that omit X-Experience-API-Version",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00321",
        section: "Communication 2.8.s4.table1.row2",
        title: "Resources other than About reject requests without X-Experience-API-Version",
      },
    ],
    tags: ["v1.0.3", "about", "resource", "versioning"],
    capabilityFlags: ["versioning", "validation"],
    legacyTraceSuiteFile: aboutResourceLegacySuiteFile,
    request: buildGetRequest("statements", false),
    assertion: {
      status: 400,
      expectedHeaderPatterns: [
        {
          key: "X-Experience-API-Version",
          pattern: nonAboutVersionHeaderPattern,
        },
      ],
    },
    notes: ["v1 proof-slice about non-about missing version header"],
  });

  return {
    type: "suite",
    id: "v1.proof-slice.about",
    title: "About Resource",
    specVersion,
    tags: ["proof-slice", "about"],
    children: [
      {
        type: "suite",
        id: "v1.proof-slice.about.basics",
        title: "About Basics",
        specVersion,
        tags: ["about", "basics"],
        children: [endpointCase, versionPropertyCase, versionArrayTypeCase, versionValuesCase],
      },
      {
        type: "suite",
        id: "v1.proof-slice.about.versioning",
        title: "About Versioning",
        specVersion,
        tags: ["about", "versioning"],
        children: [nonAboutMissingVersionHeaderCase],
      },
    ],
  };
}
