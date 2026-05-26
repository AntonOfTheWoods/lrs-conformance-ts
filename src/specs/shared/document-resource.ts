import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext, JsonResponse } from "../../describe-runtime/suite-context.ts";
import type { JsonObject, JsonValue } from "../../describe-runtime/templates.ts";

type DocumentMethod = "DELETE" | "GET" | "POST" | "PUT";
type DocumentResourceOptions = {
  includeLastModifiedCases?: boolean;
};

type DocumentCase = {
  method: DocumentMethod;
  title: string;
};

type ProfileResourceConfig = {
  buildParams: (context: DescribeRuntimeContext) => JsonObject;
  contextParamKey: "activityId" | "agent";
  deleteAcceptanceTitle: string;
  endpointPath: (context: DescribeRuntimeContext) => string;
  endpointTitle: string;
  getAcceptanceTitle: string;
  getByIdTitle: string;
  invalidContextCases?: readonly DocumentCase[];
  invalidJsonTitle: string;
  invalidTypeTitle: string;
  listTitle: string;
  missingContextCases: readonly DocumentCase[];
  missingIdCases: readonly DocumentCase[];
  postAcceptanceTitle: string;
  postCreatesTitle: string;
  putAcceptanceTitle: string;
  sinceCorrespondenceTitle: string;
  sinceTitle: string;
  suiteTitle: string;
  invalidSinceTitle: string;
  mergeTitle: string;
  includeLastModifiedCases?: boolean;
};

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseJsonObject(response: JsonResponse, name: string): JsonObject {
  const parsed = JSON.parse(response.bodyText) as unknown;
  if (!isJsonObject(parsed)) {
    throw new Error(`Expected "${name}" to return a JSON object response.`);
  }

  return parsed;
}

function parseJsonArray(response: JsonResponse, name: string): JsonValue[] {
  const parsed = JSON.parse(response.bodyText) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error(`Expected "${name}" to return a JSON array response.`);
  }

  return parsed;
}

function expectStringProperty(parent: JsonObject, key: string, name: string): string {
  const value = parent[key];
  if (typeof value !== "string") {
    throw new Error(`Expected ${name} to include a string "${key}" property.`);
  }

  return value;
}

function cloneParameters(parameters: JsonObject): JsonObject {
  return structuredClone(parameters);
}

function omitParameter(parameters: JsonObject, key: string): JsonObject {
  const cloned = cloneParameters(parameters);
  delete cloned[key];
  return cloned;
}

function expectStringArray(values: JsonValue[], name: string): string[] {
  if (values.some((value) => typeof value !== "string")) {
    throw new Error(`Expected ${name} to contain only string identifiers.`);
  }

  return values as string[];
}

function expectJsonEquals(actual: unknown, expected: JsonObject, name: string): void {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`Expected ${name} to equal the stored document.`);
  }
}

function parseHttpDate(value: string | null, name: string): number {
  const parsed = Date.parse(value ?? "");
  if (Number.isNaN(parsed)) {
    throw new Error(`Expected ${name} to be a parseable HTTP date but received "${value ?? ""}".`);
  }

  return parsed;
}

async function sendDocumentRequest(
  context: DescribeRuntimeContext,
  method: DocumentMethod,
  path: string,
  query: Record<string, unknown>,
  expectedStatus: number,
  name: string,
  body?: JsonValue | string,
  headers?: Record<string, string>,
): Promise<JsonResponse> {
  const request: {
    body?: JsonValue | string;
    headers?: Record<string, string>;
    method: DocumentMethod;
    path: string;
    query: Record<string, unknown>;
  } = {
    method,
    path,
    query,
  };

  if (typeof body !== "undefined") {
    request.body = body;
  }

  if (headers) {
    request.headers = headers;
  }

  const response = await context.sendRequest(request);
  if (response.status !== expectedStatus) {
    throw new Error(`Expected ${name} to return ${expectedStatus}, received ${response.status}.`);
  }

  return response;
}

async function fetchDocumentObject(
  context: DescribeRuntimeContext,
  path: string,
  query: Record<string, unknown>,
  name: string,
): Promise<JsonObject> {
  const response = await sendDocumentRequest(context, "GET", path, query, 200, name);
  return parseJsonObject(response, name);
}

async function fetchDocumentIds(
  context: DescribeRuntimeContext,
  path: string,
  query: Record<string, unknown>,
  name: string,
): Promise<string[]> {
  const response = await sendDocumentRequest(context, "GET", path, query, 200, name);
  return expectStringArray(parseJsonArray(response, name), name);
}

function createUpdatedDocument(document: JsonObject, suffix: string): JsonObject {
  return {
    ...structuredClone(document),
    name: `Updated Name:${suffix}`,
  };
}

async function waitForDocumentClockTick(): Promise<void> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 1100);
  });
}

function shouldWaitForLastModifiedUpdate(context: DescribeRuntimeContext): boolean {
  try {
    return new URL(context.options.endpoint).hostname !== "127.0.0.1";
  } catch {
    return true;
  }
}

async function createSinceTimestamp(context: DescribeRuntimeContext): Promise<string> {
  await context.setTimeMargin();
  return new Date(Date.now() - 60_000 - (context.getTimeMargin() ?? 0)).toISOString();
}

function registerLastModifiedCases(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
  endpointPath: string,
  buildParams: (context: DescribeRuntimeContext) => JsonObject,
): void {
  runtime.describe("The LRS shall include a Last-Modified header indicating when the document was last modified.", () => {
    runtime.it("Returns a Last-Modified header at all", async () => {
      const parameters = buildParams(context);
      const document = context.buildDocument();

      await sendDocumentRequest(
        context,
        "POST",
        endpointPath,
        parameters,
        204,
        "initial Last-Modified document write",
        document,
      );

      const response = await sendDocumentRequest(
        context,
        "GET",
        endpointPath,
        parameters,
        200,
        "Last-Modified document fetch",
      );

      parseHttpDate(response.headers.get("last-modified"), "Last-Modified header");
    });

    runtime.it("Updates the Last-Modified value when the corresponding document is updated.", async () => {
      const parameters = buildParams(context);
      const document = context.buildDocument();
      const updatedDocument = createUpdatedDocument(document, context.generateUuid());

      await sendDocumentRequest(
        context,
        "POST",
        endpointPath,
        parameters,
        204,
        "initial Last-Modified update write",
        document,
      );

      const originalResponse = await sendDocumentRequest(
        context,
        "GET",
        endpointPath,
        parameters,
        200,
        "Last-Modified original fetch",
      );

      if (shouldWaitForLastModifiedUpdate(context)) {
        await waitForDocumentClockTick();
      }

      await sendDocumentRequest(
        context,
        "POST",
        endpointPath,
        parameters,
        204,
        "Last-Modified update write",
        updatedDocument,
      );

      const updatedResponse = await sendDocumentRequest(
        context,
        "GET",
        endpointPath,
        parameters,
        200,
        "Last-Modified updated fetch",
      );

      const headerBeforeUpdate = parseHttpDate(originalResponse.headers.get("last-modified"), "original Last-Modified");
      const headerAfterUpdate = parseHttpDate(updatedResponse.headers.get("last-modified"), "updated Last-Modified");
      if (headerAfterUpdate <= headerBeforeUpdate) {
        throw new Error("Expected Last-Modified to advance after the document is updated.");
      }
    });
  });
}

function registerProfileResourceRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
  config: ProfileResourceConfig,
): void {
  const endpointPath = config.endpointPath(context);
  const putHeaders = { "If-None-Match": "*" };

  runtime.describe(config.suiteTitle, () => {
    runtime.it(config.endpointTitle, async () => {
      const parameters = config.buildParams(context);
      const document = context.buildDocument();
      await sendDocumentRequest(context, "POST", endpointPath, parameters, 204, config.endpointTitle, document);
    });

    runtime.it(config.putAcceptanceTitle, async () => {
      const parameters = config.buildParams(context);
      const document = context.buildDocument();
      await sendDocumentRequest(
        context,
        "PUT",
        endpointPath,
        parameters,
        204,
        config.putAcceptanceTitle,
        document,
        putHeaders,
      );
    });

    runtime.it(config.postAcceptanceTitle, async () => {
      const parameters = config.buildParams(context);
      const document = context.buildDocument();
      await sendDocumentRequest(context, "POST", endpointPath, parameters, 204, config.postAcceptanceTitle, document);
    });

    runtime.it(config.deleteAcceptanceTitle, async () => {
      const parameters = config.buildParams(context);
      const document = context.buildDocument();
      await sendDocumentRequest(
        context,
        "POST",
        endpointPath,
        parameters,
        204,
        `${config.deleteAcceptanceTitle} setup`,
        document,
      );
      await sendDocumentRequest(context, "DELETE", endpointPath, parameters, 204, config.deleteAcceptanceTitle);
    });

    runtime.it(config.getAcceptanceTitle, async () => {
      const parameters = config.buildParams(context);
      const document = context.buildDocument();
      await sendDocumentRequest(
        context,
        "POST",
        endpointPath,
        parameters,
        204,
        `${config.getAcceptanceTitle} setup`,
        document,
      );
      await sendDocumentRequest(context, "GET", endpointPath, parameters, 200, config.getAcceptanceTitle);
    });

    runtime.it(config.getByIdTitle, async () => {
      const parameters = config.buildParams(context);
      const document = context.buildDocument();
      await sendDocumentRequest(context, "POST", endpointPath, parameters, 204, `${config.getByIdTitle} setup`, document);
      const fetchedDocument = await fetchDocumentObject(context, endpointPath, parameters, config.getByIdTitle);
      expectJsonEquals(fetchedDocument, document, config.getByIdTitle);
    });

    for (const invalidCase of config.missingContextCases) {
      runtime.it(invalidCase.title, async () => {
        const parameters = config.buildParams(context);
        delete parameters[config.contextParamKey];
        const body = invalidCase.method === "GET" || invalidCase.method === "DELETE" ? undefined : context.buildDocument();
        const headers = invalidCase.method === "PUT" ? putHeaders : undefined;
        await sendDocumentRequest(context, invalidCase.method, endpointPath, parameters, 400, invalidCase.title, body, headers);
      });
    }

    for (const invalidCase of config.invalidContextCases ?? []) {
      runtime.it(invalidCase.title, async () => {
        const parameters = config.buildParams(context);
        parameters[config.contextParamKey] = true;
        const body = invalidCase.method === "GET" || invalidCase.method === "DELETE" ? undefined : context.buildDocument();
        const headers = invalidCase.method === "PUT" ? putHeaders : undefined;
        await sendDocumentRequest(context, invalidCase.method, endpointPath, parameters, 400, invalidCase.title, body, headers);
      });
    }

    for (const invalidCase of config.missingIdCases) {
      runtime.it(invalidCase.title, async () => {
        const parameters = config.buildParams(context);
        delete parameters.profileId;
        const body = invalidCase.method === "GET" || invalidCase.method === "DELETE" ? undefined : context.buildDocument();
        const headers = invalidCase.method === "PUT" ? putHeaders : undefined;
        await sendDocumentRequest(context, invalidCase.method, endpointPath, parameters, 400, invalidCase.title, body, headers);
      });
    }

    runtime.it(config.listTitle, async () => {
      const parameters = config.buildParams(context);
      const profileId = expectStringProperty(parameters, "profileId", config.listTitle);
      const document = context.buildDocument();
      await sendDocumentRequest(context, "POST", endpointPath, parameters, 204, `${config.listTitle} setup`, document);
      const listParameters = omitParameter(parameters, "profileId");
      const ids = await fetchDocumentIds(context, endpointPath, listParameters, config.listTitle);
      if (!ids.includes(profileId)) {
        throw new Error(`Expected ${config.listTitle} to include the stored profile id.`);
      }
    });

    runtime.it(config.sinceTitle, async () => {
      const parameters = config.buildParams(context);
      const profileId = expectStringProperty(parameters, "profileId", config.sinceTitle);
      const since = await createSinceTimestamp(context);
      const document = context.buildDocument();
      await sendDocumentRequest(context, "POST", endpointPath, parameters, 204, `${config.sinceTitle} setup`, document);
      const listParameters = omitParameter(parameters, "profileId");
      listParameters.since = since;
      const ids = await fetchDocumentIds(context, endpointPath, listParameters, config.sinceTitle);
      if (!ids.includes(profileId)) {
        throw new Error(`Expected ${config.sinceTitle} to include the stored profile id.`);
      }
    });

    runtime.it(config.invalidSinceTitle, async () => {
      const parameters = omitParameter(config.buildParams(context), "profileId");
      parameters.since = true;
      await sendDocumentRequest(context, "GET", endpointPath, parameters, 400, config.invalidSinceTitle);
    });

    runtime.it(config.sinceCorrespondenceTitle, async () => {
      const firstParameters = config.buildParams(context);
      const firstProfileId = expectStringProperty(firstParameters, "profileId", `${config.sinceCorrespondenceTitle} first profileId`);
      await sendDocumentRequest(
        context,
        "POST",
        endpointPath,
        firstParameters,
        204,
        `${config.sinceCorrespondenceTitle} first setup`,
        context.buildDocument(),
      );

      const since = await createSinceTimestamp(context);

      const secondParameters = cloneParameters(firstParameters);
      secondParameters.profileId = context.generateUuid();
      const secondProfileId = expectStringProperty(
        secondParameters,
        "profileId",
        `${config.sinceCorrespondenceTitle} second profileId`,
      );
      await sendDocumentRequest(
        context,
        "POST",
        endpointPath,
        secondParameters,
        204,
        `${config.sinceCorrespondenceTitle} second setup`,
        context.buildDocument(),
      );

      const listParameters = omitParameter(firstParameters, "profileId");
      listParameters.since = since;
      const ids = await fetchDocumentIds(context, endpointPath, listParameters, config.sinceCorrespondenceTitle);
      if (!ids.includes(firstProfileId)) {
        throw new Error(`Expected ${config.sinceCorrespondenceTitle} to include stored profile ids that match the since filter.`);
      }
      if (!ids.includes(secondProfileId)) {
        throw new Error(`Expected ${config.sinceCorrespondenceTitle} to include profiles stored after "since".`);
      }
    });

    runtime.it(config.postCreatesTitle, async () => {
      const parameters = config.buildParams(context);
      const document = context.buildDocument();
      await sendDocumentRequest(context, "POST", endpointPath, parameters, 204, config.postCreatesTitle, document);
      const fetchedDocument = await fetchDocumentObject(context, endpointPath, parameters, `${config.postCreatesTitle} fetch`);
      expectJsonEquals(fetchedDocument, document, config.postCreatesTitle);
    });

    runtime.it(config.mergeTitle, async () => {
      const parameters = config.buildParams(context);
      const firstDocument = {
        car: "Honda",
      } satisfies JsonObject;
      const secondDocument = {
        type: "Civic",
      } satisfies JsonObject;

      await sendDocumentRequest(context, "POST", endpointPath, parameters, 204, `${config.mergeTitle} first write`, firstDocument);
      await sendDocumentRequest(context, "POST", endpointPath, parameters, 204, `${config.mergeTitle} merge write`, secondDocument);

      const mergedDocument = await fetchDocumentObject(context, endpointPath, parameters, `${config.mergeTitle} fetch`);
      expectJsonEquals(
        mergedDocument,
        {
          car: "Honda",
          type: "Civic",
        },
        config.mergeTitle,
      );
    });

    runtime.it(config.invalidTypeTitle, async () => {
      const parameters = config.buildParams(context);
      const document = context.buildDocument();
      await sendDocumentRequest(context, "POST", endpointPath, parameters, 204, `${config.invalidTypeTitle} setup`, document);
      await sendDocumentRequest(
        context,
        "POST",
        endpointPath,
        parameters,
        400,
        config.invalidTypeTitle,
        "abcdefg",
        { "Content-Type": "application/octet-stream" },
      );

      const fetchedDocument = await fetchDocumentObject(context, endpointPath, parameters, `${config.invalidTypeTitle} fetch`);
      expectJsonEquals(fetchedDocument, document, config.invalidTypeTitle);
    });

    runtime.it(config.invalidJsonTitle, async () => {
      const parameters = config.buildParams(context);
      const document = context.buildDocument();
      await sendDocumentRequest(context, "POST", endpointPath, parameters, 204, `${config.invalidJsonTitle} setup`, document);
      await sendDocumentRequest(
        context,
        "POST",
        endpointPath,
        parameters,
        400,
        config.invalidJsonTitle,
        `${JSON.stringify(context.buildDocument())}{`,
        { "Content-Type": "application/json" },
      );

      const fetchedDocument = await fetchDocumentObject(context, endpointPath, parameters, `${config.invalidJsonTitle} fetch`);
      expectJsonEquals(fetchedDocument, document, config.invalidJsonTitle);
    });

    if (config.includeLastModifiedCases) {
      registerLastModifiedCases(runtime, context, endpointPath, config.buildParams);
    }
  });
}

export function registerAgentProfileResourceRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
  options: DocumentResourceOptions = {},
): void {
  registerProfileResourceRequirementsSuite(runtime, context, {
    buildParams: (currentContext) => currentContext.buildAgentProfile(),
    contextParamKey: "agent",
    deleteAcceptanceTitle:
      'An LRS\'s Agent Profile Resource upon processing a successful DELETE request deletes the associated profile and returns code 204 No Content (Communication 2.6.s3, XAPI-00271)',
    endpointPath: (currentContext) => currentContext.getEndpointAgentsProfile(),
    endpointTitle:
      'An LRS has an Agent Profile Resource with endpoint "base IRI"+"/agents/profile" (Communication 2.2.s3.table2.row3.a, Communication 2.2.table2.row3.c, XAPI-00282)',
    getAcceptanceTitle: 'An LRS\'s Agent Profile Resource accepts GET requests (Communication 2.6.s2, XAPI-00274)',
    getByIdTitle:
      'An LRS\'s Agent Profile Resource upon processing a successful GET request with a valid "profileId" as a parameter returns the document satisfying the requirements of the GET and code 200 OK (Communication 2.6.s3, XAPI-00259, XAPI-00269)',
    includeLastModifiedCases: options.includeLastModifiedCases,
    invalidContextCases: [
      {
        method: "DELETE",
        title:
          'An LRS\'s Agent Profile Resource rejects a DELETE request with "agent" as a parameter if it is not an Agent Object with error code 400 Bad Request (format, Communication 2.6.s3.table1.row1, XAPI-00255)',
      },
      {
        method: "POST",
        title:
          'An LRS\'s Agent Profile Resource rejects a POST request with "agent" as a parameter if it is not an Agent Object with error code 400 Bad Request (format, Communication 2.6.s3.table1.row1, XAPI-00256)',
      },
      {
        method: "PUT",
        title:
          'An LRS\'s Agent Profile Resource rejects a PUT request with "agent" as a parameter if it is not an Agent Object with error code 400 Bad Request (format, Communication 2.6.s3.table1.row1, XAPI-00257)',
      },
      {
        method: "GET",
        title:
          'An LRS\'s Agent Profile Resource rejects a GET request with "agent" as a parameter if it is a valid, in structure, Agent with error code 400 Bad Request (multiplicity, Communication 2.6.s4.table1.row1, Communication 2.6.s3.table1.row1, XAPI-00258)',
      },
    ],
    invalidJsonTitle:
      'An LRS must reject with 400 Bad Request a POST request to the Agent Profile Resource which contains name/value pairs with invalid JSON and the Content-Type header is "application/json" (Communication 2.6, XAPI-00284)',
    invalidSinceTitle:
      'An LRS\'s Agent Profile Resource rejects a GET request with "since" as a parameter if it is not a "TimeStamp", with error code 400 Bad Request (format, Communication 2.6.s4.table1.row2, XAPI-00260)',
    invalidTypeTitle:
      'An LRS\'s Agent Profile Resource, rejects a POST request if the document is found and either document\'s type is not "application/json" with error code 400 Bad Request (multiplicity, Communication 2.3.s3.table1.row3, Communication 2.2.s8.b1, XAPI-00278)',
    listTitle:
      'An LRS\'s Agent Profile Resource upon processing a successful GET request without "profileId" as a parameter returns an array of ids of agent profile documents satisfying the requirements of the GET and code 200 OK (Communication 2.6.s4, XAPI-00270)',
    mergeTitle:
      'An LRS\'s Agent Profile Resource performs a Document Merge if a document is found and both it and the document in the POST request have type "application/json" (Communication 2.2.s7.b1, Communication 2.2.s7.b2, Communication 2.2.s7.b3, XAPI-00279)',
    missingContextCases: [
      {
        method: "GET",
        title:
          'An LRS\'s Agent Profile Resource rejects a GET request without "agent" as a parameter with error code 400 Bad Request (multiplicity, Communication 2.6.s4.table1.row1, XAPI-00261)',
      },
      {
        method: "DELETE",
        title:
          'An LRS\'s Agent Profile Resource rejects a DELETE request without "agent" as a parameter with error code 400 Bad Request (multiplicity, Communication 2.6.s3.table1.row1, XAPI-00262)',
      },
      {
        method: "POST",
        title:
          'An LRS\'s Agent Profile Resource rejects a POST request without "agent" as a parameter with error code 400 Bad Request (multiplicity, Communication 2.6.s3.table1.row1, XAPI-00263)',
      },
      {
        method: "PUT",
        title:
          'An LRS\'s Agent Profile Resource rejects a PUT request without "agent" as a parameter with error code 400 Bad Request (multiplicity, Communication 2.6.s3.table1.row1, XAPI-00264)',
      },
    ],
    missingIdCases: [
      {
        method: "DELETE",
        title:
          'An LRS\'s Agent Profile Resource rejects a DELETE request without "profileId" as a parameter with error code 400 Bad Request (multiplicity, Communication 2.6.s3.table1.row2, XAPI-00265)',
      },
      {
        method: "POST",
        title:
          'An LRS\'s Agent Profile Resource rejects a POST request without "profileId" as a parameter with error code 400 Bad Request (multiplicity, Communication 2.6.s3.table1.row2, XAPI-00266)',
      },
      {
        method: "PUT",
        title:
          'An LRS\'s Agent Profile Resource rejects a PUT request without "profileId" as a parameter with error code 400 Bad Request (multiplicity, Communication 2.6.s3.table1.row2, XAPI-00267)',
      },
    ],
    postAcceptanceTitle:
      'An LRS\'s Agent Profile Resource upon processing a successful POST request returns code 204 No Content (Communication 2.6.s3, XAPI-00272, XAPI-00283)',
    postCreatesTitle:
      'An LRS\'s Agent Profile Resource, upon receiving a POST request for a document not currently in the LRS, treats it as a PUT request and store a new document (Communication 2.2.s7, XAPI-00280)',
    putAcceptanceTitle:
      'An LRS\'s Agent Profile Resource upon processing a successful PUT request returns code 204 No Content (Communication 2.6.s3, XAPI-00273)',
    sinceCorrespondenceTitle:
      'An LRS\'s returned array of ids from a successful GET request to the Agent Profile Resource all refer to documents stored after the TimeStamp in the "since" parameter of the GET request if such a parameter was present (Communication 2.6.s4.table1.row2, XAPI-00275)',
    sinceTitle:
      'An LRS\'s Agent Profile Resource can process a GET request with "since" as a parameter (Multiplicity, Communication 2.6.s4.table1.row2, XAPI-00268)',
    suiteTitle: 'Agent Profile Resource Requirements (Communication 2.6)',
  });
}

export function registerActivityProfileResourceRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
  options: DocumentResourceOptions = {},
): void {
  registerProfileResourceRequirementsSuite(runtime, context, {
    buildParams: (currentContext) => currentContext.buildActivityProfile(),
    contextParamKey: "activityId",
    deleteAcceptanceTitle:
      'An LRS\'s Activity Profile Resource accepts DELETE requests (Communication 2.7, XAPI-00285, XAPI-00291)',
    endpointPath: (currentContext) => currentContext.getEndpointActivitiesProfile(),
    endpointTitle:
      'An LRS has an Activity Profile Resource with endpoint "base IRI"+"/activities/profile" (Communication 2.2.s3.table1.row2, XAPI-00311)',
    getAcceptanceTitle: 'An LRS\'s Activity Profile Resource accepts GET requests (Communication 2.7, XAPI-00290)',
    getByIdTitle:
      'An LRS\'s Activity Profile Resource upon processing a successful GET request with a valid "profileId" as a parameter returns the document satisfying the requirements of the GET and code 200 OK (Communication 2.7.s3, XAPI-00288)',
    includeLastModifiedCases: options.includeLastModifiedCases,
    invalidJsonTitle:
      'An LRS\'s must reject, with 400 Bad Request, a POST request to the Activity Profile Resource which contains name/value pairs with invalid JSON and the Content-Type header is "application/json" (Communication 2.7.s4.table1.row2, XAPI-00314)',
    invalidSinceTitle:
      'An LRS\'s Activity Profile Resource rejects a GET request with "since" as a parameter if it is not a "TimeStamp", with error code 400 Bad Request (format, Communication 2.7.s4.table1.row2, XAPI-00295)',
    invalidTypeTitle:
      'An LRS\'s Activity Profile Resource, rejects a POST request if the document is found and either document\'s type is not "application/json" with error code 400 Bad Request (Communication 2.2.s8.b1, XAPI-00309)',
    listTitle:
      'An LRS\'s Activity Profile Resource upon processing a successful GET request without "profileId" as a parameter returns an array of ids of activity profile documents satisfying the requirements of the GET and code 200 OK (Communication 2.7.s4, XAPI-00289)',
    mergeTitle:
      'An LRS\'s Activity Profile Resource performs a Document Merge if a document is found and both it and the document in the POST request have type "application/json" (Communication 2.2.s7.b1, Communication 2.2.s7.b2, Communication 2.2.s7.b3, XAPI-00308)',
    missingContextCases: [
      {
        method: "GET",
        title:
          'An LRS\'s Activity Profile Resource rejects a GET request without "activityId" as a parameter with error code 400 Bad Request (multiplicity, Communication 2.7.s3.table1.row1, Communication 2.7.s4.table1.row1, XAPI-00296)',
      },
      {
        method: "DELETE",
        title:
          'An LRS\'s Activity Profile Resource rejects a DELETE request without "activityId" as a parameter with error code 400 Bad Request (multiplicity, Communication 2.7.s3.table1.row1, XAPI-00297)',
      },
      {
        method: "POST",
        title:
          'An LRS\'s Activity Profile Resource rejects a POST request without "activityId" as a parameter with error code 400 Bad Request (multiplicity, Communication 2.7.s3.table1.row1, XAPI-00298)',
      },
      {
        method: "PUT",
        title:
          'An LRS\'s Activity Profile Resource rejects a PUT request without "activityId" as a parameter with error code 400 Bad Request (multiplicity, Communication 2.7.s3.table1.row1, XAPI-00299)',
      },
    ],
    missingIdCases: [
      {
        method: "DELETE",
        title:
          'An LRS\'s Activity Profile Resource rejects a DELETE request without "profileId" as a parameter with error code 400 Bad Request (multiplicity, Communication 2.7.s3.table1.row2, XAPI-00300)',
      },
      {
        method: "POST",
        title:
          'An LRS\'s Activity Profile Resource rejects a POST request without "profileId" as a parameter with error code 400 Bad Request (multiplicity, Communication 2.7.s3.table1.row2, XAPI-00301)',
      },
      {
        method: "PUT",
        title:
          'An LRS\'s Activity Profile Resource rejects a PUT request without "profileId" as a parameter with error code 400 Bad Request (multiplicity, Communication 2.7.s3.table1.row2, XAPI-00302)',
      },
    ],
    postAcceptanceTitle:
      'An LRS\'s Activity Profile Resource accepts POST requests (Communication 2.7, XAPI-00286, XAPI-00292, XAPI-00312)',
    postCreatesTitle:
      'An LRS\'s Activity Profile Resource, upon receiving a POST request for a document not currently in the LRS, treats it as a PUT request and store a new document (Communication 2.2.s7, XAPI-00310)',
    putAcceptanceTitle:
      'An LRS\'s Activity Profile Resource accepts PUT requests (Communication 2.7, XAPI-00287, XAPI-00293)',
    sinceCorrespondenceTitle:
      'An LRS\'s returned array of ids from a successful GET request to the Activity Profile Resource all refer to documents stored after the TimeStamp in the "since" parameter of the GET request if such a parameter was present (Communication 2.7.s4.table1.row2, XAPI-00294)',
    sinceTitle:
      'An LRS\'s Activity Profile Resource can process a GET request with "since" as a parameter (multiplicity, Communication 2.7.s4.table1.row2, XAPI-00303)',
    suiteTitle: 'Activity Profile Resource Requirements (Communication 2.7)',
  });
}

export function registerStateResourceRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
  options: DocumentResourceOptions = {},
): void {
  const endpointPath = context.getEndpointActivitiesState();

  runtime.describe('State Resource Requirements (Communication 2.3)', () => {
    runtime.it('An LRS has a State Resource with endpoint "base IRI"+"/activities/state" (Communication 2.2.s3.table1.row1, XAPI-00230)', async () => {
      const parameters = context.buildState();
      const document = context.buildDocument();
      await sendDocumentRequest(
        context,
        'POST',
        endpointPath,
        parameters,
        204,
        'An LRS has a State Resource with endpoint "base IRI"+"/activities/state" (Communication 2.2.s3.table1.row1, XAPI-00230)',
        document,
      );
    });

    runtime.it('An LRS\'s State Resource accepts PUT requests (Communication 2.3, XAPI-00190)', async () => {
      const parameters = context.buildState();
      const document = context.buildDocument();
      await sendDocumentRequest(context, 'PUT', endpointPath, parameters, 204, 'State PUT acceptance', document);
    });

    runtime.it('An LRS\'s State Resource accepts POST requests (Communication 2.3, XAPI-00189, XAPI-00231)', async () => {
      const parameters = context.buildState();
      const document = context.buildDocument();
      await sendDocumentRequest(context, 'POST', endpointPath, parameters, 204, 'State POST acceptance', document);
    });

    runtime.it('An LRS\'s State Resource accepts GET requests (Communication 2.3, XAPI-00188)', async () => {
      const parameters = context.buildState();
      const document = context.buildDocument();
      await sendDocumentRequest(context, 'POST', endpointPath, parameters, 204, 'State GET acceptance setup', document);
      const fetchedDocument = await fetchDocumentObject(context, endpointPath, parameters, 'State GET acceptance');
      expectJsonEquals(fetchedDocument, document, 'State GET acceptance');
    });

    runtime.it('An LRS\'s State Resource accepts DELETE requests (Communication 2.3, XAPI-00187)', async () => {
      const parameters = context.buildState();
      const document = context.buildDocument();
      await sendDocumentRequest(context, 'POST', endpointPath, parameters, 204, 'State DELETE acceptance setup', document);
      await sendDocumentRequest(context, 'DELETE', endpointPath, parameters, 204, 'State DELETE acceptance');
    });

    runtime.it('An LRS\'s State Resource upon processing a successful GET request with a valid "stateId" as a parameter returns the document satisfying the requirements of the GET and code 200 OK (Communication 2.3.s3, XAPI-00192)', async () => {
      const parameters = context.buildState();
      const document = context.buildDocument();
      await sendDocumentRequest(context, 'POST', endpointPath, parameters, 204, 'State GET with stateId setup', document);
      const fetchedDocument = await fetchDocumentObject(context, endpointPath, parameters, 'State GET with stateId');
      expectJsonEquals(fetchedDocument, document, 'State GET with stateId');
    });

    runtime.it('An LRS\'s State Resource upon processing a successful DELETE request with a valid "stateId" as a parameter deletes the document satisfying the requirements of the DELETE and returns code 204 No Content (Communication 2.3.s3, XAPI-00191)', async () => {
      const parameters = context.buildState();
      const document = context.buildDocument();
      await sendDocumentRequest(context, 'POST', endpointPath, parameters, 204, 'State DELETE with stateId setup', document);
      await sendDocumentRequest(context, 'DELETE', endpointPath, parameters, 204, 'State DELETE with stateId');
    });

    for (const invalidCase of [
      {
        method: 'PUT' as const,
        title:
          'An LRS\'s State Resource rejects a PUT request without "activityId" as a parameter with error code 400 Bad Request (multiplicity, Communication 2.3.s3.table1.row1, XAPI-00210)',
      },
      {
        method: 'POST' as const,
        title:
          'An LRS\'s State Resource rejects a POST request without "activityId" as a parameter with error code 400 Bad Request (multiplicity, Communication 2.3.s3.table1.row1, XAPI-00209)',
      },
      {
        method: 'GET' as const,
        title:
          'An LRS\'s State Resource rejects a GET request without "activityId" as a parameter with error code 400 Bad Request (multiplicity, Communication 2.3.s3.table1.row1, XAPI-00208)',
      },
      {
        method: 'DELETE' as const,
        title:
          'An LRS\'s State Resource rejects a DELETE request without "activityId" as a parameter with error code 400 Bad Request (multiplicity, Communication 2.3.s3.table1.row1, XAPI-00207)',
      },
    ]) {
      runtime.it(invalidCase.title, async () => {
        const parameters = context.buildState();
        delete parameters.activityId;
        const body = invalidCase.method === 'GET' || invalidCase.method === 'DELETE' ? undefined : context.buildDocument();
        await sendDocumentRequest(context, invalidCase.method, endpointPath, parameters, 400, invalidCase.title, body);
      });
    }

    for (const invalidCase of [
      {
        method: 'PUT' as const,
        title:
          'An LRS\'s State Resource rejects a PUT request without "agent" as a parameter with error code 400 Bad Request (multiplicity, Communication 2.3.s3.table1.row2, XAPI-00215)',
        missing: true,
      },
      {
        method: 'PUT' as const,
        title:
          'An LRS\'s State Resource rejects a PUT request with "agent" as a parameter if it is not in JSON format with error code 400 Bad Request (format, Communication 2.3.s3.table1.row2, XAPI-00199)',
        missing: false,
      },
      {
        method: 'POST' as const,
        title:
          'An LRS\'s State Resource rejects a POST request without "agent" as a parameter with error code 400 Bad Request (multiplicity, Communication 2.3.s3.table1.row2)',
        missing: true,
      },
      {
        method: 'POST' as const,
        title:
          'An LRS\'s State Resource rejects a POST request with "agent" as a parameter if it is not in JSON format with error code 400 Bad Request (format, Communication 2.3.s3.table1.row2, XAPI-00198)',
        missing: false,
      },
      {
        method: 'GET' as const,
        title:
          'An LRS\'s State Resource rejects a GET request without "agent" as a parameter with error code 400 Bad Request (multiplicity, Communication 2.3.s3.table1.row2, XAPI-00213)',
        missing: true,
      },
      {
        method: 'GET' as const,
        title:
          'An LRS\'s State Resource rejects a GET request with "agent" as a parameter if it is not in JSON format with error code 400 Bad Request (format, Communication 2.3.s3.table1.row2, XAPI-00197)',
        missing: false,
      },
      {
        method: 'DELETE' as const,
        title:
          'An LRS\'s State Resource rejects a DELETE request without "agent" as a parameter with error code 400 Bad Request (multiplicity, Communication 2.3.s3.table1.row2, XAPI-00212)',
        missing: true,
      },
      {
        method: 'DELETE' as const,
        title:
          'An LRS\'s State Resource rejects a DELETE request with "agent" as a parameter if it is not in JSON format with error code 400 Bad Request (format, Communication 2.3.s3.table1.row2, XAPI-00196)',
        missing: false,
      },
    ]) {
      runtime.it(invalidCase.title, async () => {
        const parameters = context.buildState();
        if (invalidCase.missing) {
          delete parameters.agent;
        } else {
          parameters.agent = true;
        }
        const body = invalidCase.method === 'GET' || invalidCase.method === 'DELETE' ? undefined : context.buildDocument();
        await sendDocumentRequest(context, invalidCase.method, endpointPath, parameters, 400, invalidCase.title, body);
      });
    }

    for (const registrationCase of [
      {
        method: 'PUT' as const,
        title:
          'An LRS\'s State Resource can process a PUT request with "registration" as a parameter (multiplicity, Communication 2.3.s3.table1.row3, XAPI-00218)',
      },
      {
        method: 'POST' as const,
        title:
          'An LRS\'s State Resource can process a POST request with "registration" as a parameter (multiplicity, Communication 2.3.s3.table1.row3, XAPI-00227)',
      },
      {
        method: 'GET' as const,
        title:
          'An LRS\'s State Resource can process a GET request with "registration" as a parameter (multiplicity, Communication 2.3.s3.table1.row3, XAPI-00220)',
      },
      {
        method: 'DELETE' as const,
        title:
          'An LRS\'s State Resource can process a DELETE request with "registration" as a parameter (multiplicity, Communication 2.3.s3.table1.row3, XAPI-00219)',
      },
    ]) {
      runtime.it(registrationCase.title, async () => {
        const parameters = context.buildState();
        parameters.registration = context.generateUuid();
        const document = context.buildDocument();
        if (registrationCase.method === 'PUT' || registrationCase.method === 'POST') {
          await sendDocumentRequest(
            context,
            registrationCase.method,
            endpointPath,
            parameters,
            204,
            registrationCase.title,
            document,
          );
          return;
        }

        await sendDocumentRequest(context, 'POST', endpointPath, parameters, 204, `${registrationCase.title} setup`, document);
        if (registrationCase.method === 'GET') {
          const fetchedDocument = await fetchDocumentObject(context, endpointPath, parameters, registrationCase.title);
          expectJsonEquals(fetchedDocument, document, registrationCase.title);
          return;
        }

        await sendDocumentRequest(context, 'DELETE', endpointPath, parameters, 204, registrationCase.title);
      });
    }

    for (const invalidCase of [
      {
        method: 'PUT' as const,
        title:
          'An LRS\'s State Resource rejects a PUT request with "registration" as a parameter if it is not a UUID with error code 400 Bad Request(format, Communication 2.3.s3.table1.row3, XAPI-00203)',
      },
      {
        method: 'POST' as const,
        title:
          'An LRS\'s State Resource rejects a POST request with "registration" as a parameter if it is not a UUID with error code 400 Bad Request (format, Communication 2.3.s3.table1.row3, XAPI-00202)',
      },
      {
        method: 'GET' as const,
        title:
          'An LRS\'s State Resource rejects a GET request with "registration" as a parameter if it is not a UUID with error code 400 Bad Request (format, Communication 2.3.s3.table1.row3, XAPI-00201)',
      },
      {
        method: 'DELETE' as const,
        title:
          'An LRS\'s State Resource rejects a DELETE request with "registration" as a parameter if it is not a UUID with error code 400 Bad Request (format, Communication 2.3.s3.table1.row3, XAPI-00200)',
      },
    ]) {
      runtime.it(invalidCase.title, async () => {
        const parameters = context.buildState();
        parameters.registration = true;
        const body = invalidCase.method === 'GET' || invalidCase.method === 'DELETE' ? undefined : context.buildDocument();
        await sendDocumentRequest(context, invalidCase.method, endpointPath, parameters, 400, invalidCase.title, body);
      });
    }

    for (const invalidCase of [
      {
        method: 'PUT' as const,
        title:
          'An LRS\'s State Resource rejects a PUT request without "stateId" as a parameter with error code 400 Bad Request(multiplicity, Communication 2.3.s3.table1.row4, XAPI-00206)',
      },
      {
        method: 'POST' as const,
        title:
          'An LRS\'s State Resource rejects a POST request without "stateId" as a parameter with error code 400 Bad Request (multiplicity, Communication 2.3.s3.table1.row4, XAPI-00211)',
      },
    ]) {
      runtime.it(invalidCase.title, async () => {
        const parameters = context.buildState();
        delete parameters.stateId;
        await sendDocumentRequest(
          context,
          invalidCase.method,
          endpointPath,
          parameters,
          400,
          invalidCase.title,
          context.buildDocument(),
        );
      });
    }

    runtime.it('An LRS\'s State Resource can process a GET request with "stateId" as a parameter (multiplicity, Communication 2.3.s3.table1.row4, XAPI-00217)', async () => {
      const parameters = context.buildState();
      const document = context.buildDocument();
      await sendDocumentRequest(context, 'POST', endpointPath, parameters, 204, 'State GET stateId setup', document);
      const fetchedDocument = await fetchDocumentObject(context, endpointPath, parameters, 'State GET stateId process');
      expectJsonEquals(fetchedDocument, document, 'State GET stateId process');
    });

    runtime.it('An LRS\'s State Resource can process a GET request with "since" as a parameter (multiplicity, Communication 2.3.s4.table1.row4, XAPI-00221)', async () => {
      const parameters = context.buildState();
      const stateId = expectStringProperty(parameters, 'stateId', 'State since test stateId');
      const document = context.buildDocument();
      await sendDocumentRequest(context, 'POST', endpointPath, parameters, 204, 'State since setup', document);
      const listParameters = omitParameter(parameters, 'stateId');
      listParameters.since = await createSinceTimestamp(context);
      const ids = await fetchDocumentIds(context, endpointPath, listParameters, 'State since list');
      if (!ids.includes(stateId)) {
        throw new Error('Expected State since query to include the stored state id.');
      }
    });

    runtime.it('An LRS\'s State Resource rejects a GET request with "since" as a parameter if it is not a "TimeStamp", with error code 400 Bad Request (format, Communication 2.3.s4.table1.row4, XAPI-00204)', async () => {
      const parameters = omitParameter(context.buildState(), 'stateId');
      parameters.since = 'not a timestamp';
      await sendDocumentRequest(context, 'GET', endpointPath, parameters, 400, 'State invalid since');
    });

    runtime.it('An LRS\'s State Resource can process a DELETE request with "stateId" as a parameter (multiplicity, Communication 2.3.s3.table1.row4, XAPI-00216)', async () => {
      const parameters = context.buildState();
      const document = context.buildDocument();
      await sendDocumentRequest(context, 'POST', endpointPath, parameters, 204, 'State DELETE stateId setup', document);
      await sendDocumentRequest(context, 'DELETE', endpointPath, parameters, 204, 'State DELETE stateId process');
    });

    runtime.it('An LRS\'s State Resource upon processing a successful GET request without "stateId" as a parameter returns an array of ids of state data documents satisfying the requirements of the GET and code 200 OK (Communication 2.3.s4, XAPI-00193)', async () => {
      const parameters = context.buildState();
      const stateId = expectStringProperty(parameters, 'stateId', 'State list stateId');
      const document = context.buildDocument();
      await sendDocumentRequest(context, 'POST', endpointPath, parameters, 204, 'State list setup', document);
      const listParameters = omitParameter(parameters, 'stateId');
      const ids = await fetchDocumentIds(context, endpointPath, listParameters, 'State list without stateId');
      if (!ids.includes(stateId)) {
        throw new Error('Expected GET without stateId to include the stored state identifier.');
      }
    });

    runtime.it('An LRS\'s returned array of ids from a successful GET request to the State Resource all refer to documents stored after the TimeStamp in the "since" parameter of the GET request (Communication 2.3.s4.table1.row4, XAPI-00195)', async () => {
      const firstParameters = context.buildState();
      const firstStateId = expectStringProperty(firstParameters, 'stateId', 'State since correspondence first stateId');
      await sendDocumentRequest(
        context,
        'POST',
        endpointPath,
        firstParameters,
        204,
        'State since correspondence first setup',
        context.buildDocument(),
      );

      const since = await createSinceTimestamp(context);

      const secondParameters = cloneParameters(firstParameters);
      secondParameters.stateId = context.generateUuid();
      const secondStateId = expectStringProperty(secondParameters, 'stateId', 'State since correspondence second stateId');
      await sendDocumentRequest(
        context,
        'POST',
        endpointPath,
        secondParameters,
        204,
        'State since correspondence second setup',
        context.buildDocument(),
      );

      const listParameters = omitParameter(firstParameters, 'stateId');
      listParameters.since = since;
      const ids = await fetchDocumentIds(context, endpointPath, listParameters, 'State since correspondence list');
      if (!ids.includes(firstStateId)) {
        throw new Error('Expected State since correspondence to include matching stored documents.');
      }
      if (!ids.includes(secondStateId)) {
        throw new Error('Expected State since correspondence to include documents stored after the since timestamp.');
      }
    });

    runtime.it('An LRS\'s State Resource upon processing a successful DELETE request without "stateId" as a parameter deletes documents satisfying the requirements of the DELETE and code 204 No Content (Communication 2.3.s5, XAPI-00194)', async () => {
      const firstParameters = context.buildState();
      const secondParameters = cloneParameters(firstParameters);
      secondParameters.stateId = context.generateUuid();
      await sendDocumentRequest(
        context,
        'POST',
        endpointPath,
        firstParameters,
        204,
        'State collection delete first setup',
        context.buildDocument(),
      );
      await sendDocumentRequest(
        context,
        'POST',
        endpointPath,
        secondParameters,
        204,
        'State collection delete second setup',
        context.buildDocument(),
      );

      const collectionParameters = omitParameter(firstParameters, 'stateId');
      await sendDocumentRequest(context, 'DELETE', endpointPath, collectionParameters, 204, 'State collection delete');
      const remainingIds = await fetchDocumentIds(context, endpointPath, collectionParameters, 'State collection delete verification');
      if (remainingIds.length !== 0) {
        throw new Error('Expected DELETE without stateId to remove all documents in the matching state context.');
      }
    });

    runtime.it('An LRS\'s State Resource, upon receiving a POST request for a document not currently in the LRS, treats it as a PUT request and store a new document (Communication 2.2.s7, XAPI-00233)', async () => {
      const parameters = context.buildState();
      const document = context.buildDocument();
      await sendDocumentRequest(context, 'POST', endpointPath, parameters, 204, 'State POST creates document', document);
      const fetchedDocument = await fetchDocumentObject(context, endpointPath, parameters, 'State POST creates document fetch');
      expectJsonEquals(fetchedDocument, document, 'State POST creates document');
    });

    runtime.it('An LRS\'s State Resource performs a Document Merge if a document is found and both it and the document in the POST request have type "application/json" (Communication 2.2.s7.b1, Communication 2.2.s7.b2, Communication 2.2.s7.b3, XAPI-00234)', async () => {
      const parameters = context.buildState();
      await sendDocumentRequest(
        context,
        'POST',
        endpointPath,
        parameters,
        204,
        'State merge first write',
        { car: 'Honda' },
      );
      await sendDocumentRequest(
        context,
        'POST',
        endpointPath,
        parameters,
        204,
        'State merge second write',
        { type: 'Civic' },
      );
      const mergedDocument = await fetchDocumentObject(context, endpointPath, parameters, 'State merge fetch');
      expectJsonEquals(mergedDocument, { car: 'Honda', type: 'Civic' }, 'State merge');
    });

    runtime.it('An LRS\'s State Resource, rejects a POST request if the document is found and either document\'s type is not "application/json" with error code 400 Bad Request (Communication 2.2.s8.b1, XAPI-00232)', async () => {
      const parameters = context.buildState();
      const document = context.buildDocument();
      await sendDocumentRequest(context, 'POST', endpointPath, parameters, 204, 'State invalid type setup', document);
      await sendDocumentRequest(
        context,
        'POST',
        endpointPath,
        parameters,
        400,
        'State invalid type request',
        'abc',
        { 'Content-Type': 'application/octet-stream' },
      );
      const fetchedDocument = await fetchDocumentObject(context, endpointPath, parameters, 'State invalid type fetch');
      expectJsonEquals(fetchedDocument, document, 'State invalid type');
    });

    runtime.it("An LRS must reject with 400 Bad Request a POST request to the State Resource which contains name/value pairs with invalid JSON and the Content-Type header is 'application/json' (Communication 2.3, XAPI-00235)", async () => {
      const parameters = context.buildState();
      const document = context.buildDocument();
      await sendDocumentRequest(context, 'POST', endpointPath, parameters, 204, 'State invalid JSON setup', document);
      await sendDocumentRequest(
        context,
        'POST',
        endpointPath,
        parameters,
        400,
        'State invalid JSON request',
        `${JSON.stringify(context.buildDocument())}{`,
        { 'Content-Type': 'application/json' },
      );
      const fetchedDocument = await fetchDocumentObject(context, endpointPath, parameters, 'State invalid JSON fetch');
      expectJsonEquals(fetchedDocument, document, 'State invalid JSON');
    });

    if (options.includeLastModifiedCases) {
      registerLastModifiedCases(runtime, context, endpointPath, (currentContext) => currentContext.buildState());
    }
  });
}