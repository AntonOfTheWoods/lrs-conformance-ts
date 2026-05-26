import { Buffer } from "node:buffer";

import type { NormalizedRunnerOptions } from "./options.ts";
import {
  createFromTemplate as createFromTemplateFromFixtures,
  type JsonObject,
  type JsonValue,
  type TemplateLayer,
} from "./templates.ts";

export interface JsonRequestOptions {
  method: "DELETE" | "GET" | "HEAD" | "POST" | "PUT";
  path: string;
  headers?: Record<string, string>;
  query?: Record<string, unknown>;
  json?: JsonValue;
}

export interface RequestOptions {
  method: "DELETE" | "GET" | "HEAD" | "POST" | "PUT";
  path: string;
  headers?: Record<string, string>;
  query?: Record<string, unknown>;
  body?: JsonValue | string;
}

export interface JsonResponse {
  status: number;
  bodyText: string;
  headers: Headers;
}

export interface DescribeRuntimeContext {
  directory: string;
  options: NormalizedRunnerOptions;
  addAllHeaders(headers?: Record<string, string>, badAuth?: boolean): Record<string, string>;
  createFromTemplate(layers: TemplateLayer[]): Promise<JsonObject>;
  generateUuid(): string;
  getEndpointAbout(): string;
  getEndpointActivities(): string;
  getEndpointActivitiesProfile(): string;
  getEndpointActivitiesState(): string;
  getEndpointAgents(): string;
  getEndpointAgentsProfile(): string;
  getEndpointStatements(): string;
  getTimeMargin(): number | undefined;
  getUrlEncoding(object: Record<string, unknown>): string;
  sendRequest(request: RequestOptions): Promise<JsonResponse>;
  sendJsonRequest(request: JsonRequestOptions): Promise<JsonResponse>;
  buildActivityProfile(): JsonObject;
  buildAgentProfile(): JsonObject;
  buildDocument(): JsonObject;
  buildState(): JsonObject;
  setTimeMargin(): Promise<number>;
}

function joinEndpoint(baseEndpoint: string, resourcePath: string): string {
  const normalizedBase = baseEndpoint.replace(/\/+$/, "");
  const normalizedPath = resourcePath.startsWith("/") ? resourcePath : `/${resourcePath}`;
  return `${normalizedBase}${normalizedPath}`;
}

function isAbsoluteUrl(value: string): boolean {
  return /^[A-Za-z][A-Za-z\d+.-]*:\/\//.test(value);
}

function resolveRequestTarget(baseEndpoint: string, resourcePath: string): string {
  return isAbsoluteUrl(resourcePath) ? resourcePath : joinEndpoint(baseEndpoint, resourcePath);
}

function addHeaderXapiVersion(
  headers: Record<string, string>,
  options: NormalizedRunnerOptions,
): Record<string, string> {
  return {
    ...headers,
    "X-Experience-API-Version": options.xapiVersion,
  };
}

function addBasicAuthenticationHeader(
  headers: Record<string, string>,
  options: NormalizedRunnerOptions,
  badAuth = false,
): Record<string, string> {
  if (!options.basicAuth && !badAuth) {
    return headers;
  }

  const encodedCredentials = badAuth
    ? Buffer.from("foo:bar").toString("base64")
    : Buffer.from(`${options.authUser ?? ""}:${options.authPass ?? ""}`).toString("base64");

  return {
    ...headers,
    Authorization: `Basic ${encodedCredentials}`,
  };
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function wait(delayMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

function serializeQueryValue(value: unknown): string {
  if (typeof value === "object") {
    return encodeURIComponent(JSON.stringify(value));
  }

  if (typeof value === "undefined") {
    return "undefined";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return value.toString();
  }

  if (typeof value === "symbol") {
    return value.description ?? "symbol";
  }

  return "function";
}

export function createDescribeRuntimeContext(
  directory: string,
  options: NormalizedRunnerOptions,
): DescribeRuntimeContext {
  let timeMargin: number | undefined;

  const addAllHeaders = (headers: Record<string, string> = {}, badAuth = false): Record<string, string> => {
    const versionHeaders = addHeaderXapiVersion(headers, options);
    return addBasicAuthenticationHeader(versionHeaders, options, badAuth);
  };

  const getUrlEncoding = (object: Record<string, unknown>): string => {
    let encoding = "";

    Object.keys(object).forEach((key, index) => {
      if (index !== 0) {
        encoding += "&";
      }

      const value = object[key];
      encoding += `${key}=${serializeQueryValue(value)}`;
    });

    return encoding;
  };

  const sendRequest = async (request: RequestOptions): Promise<JsonResponse> => {
    const queryString = request.query ? getUrlEncoding(request.query) : "";
    const requestPath = queryString.length > 0 ? `${request.path}?${queryString}` : request.path;
    const headers = { ...(request.headers ?? {}) };
    let bodyText: string | undefined;

    if (typeof request.body === "string") {
      bodyText = request.body;
    } else if (typeof request.body !== "undefined") {
      if (typeof headers["Content-Type"] === "undefined") {
        headers["Content-Type"] = "application/json";
      }

      bodyText = JSON.stringify(request.body);
    }

    const response = await fetch(resolveRequestTarget(options.endpoint, requestPath), {
      method: request.method,
      headers: addAllHeaders(headers),
      body: bodyText,
    });

    return {
      status: response.status,
      bodyText: await response.text(),
      headers: response.headers,
    };
  };

  const createFromTemplate = (layers: TemplateLayer[]): Promise<JsonObject> =>
    createFromTemplateFromFixtures(directory, layers);

  const generateUuid = (): string => crypto.randomUUID();

  const buildDocument = (): JsonObject => {
    const key = generateUuid();
    return {
      name: generateUuid(),
      location: {
        name: generateUuid(),
      },
      [key]: generateUuid(),
    };
  };

  const buildState = (): JsonObject => ({
    activityId: "http://www.example.com/activityId/hashset",
    agent: {
      objectType: "Agent",
      account: {
        homePage: "http://www.example.com/agentId/1",
        name: "Rick James",
      },
    },
    stateId: generateUuid(),
  });

  const buildActivityProfile = (): JsonObject => ({
    activityId: "http://www.example.com/activityId/hashset",
    profileId: generateUuid(),
  });

  const buildAgentProfile = (): JsonObject => ({
    agent: {
      objectType: "Agent",
      account: {
        homePage: "http://www.example.com/agentId/1",
        name: "Rick James",
      },
    },
    profileId: generateUuid(),
  });

  return {
    directory,
    options,
    addAllHeaders,
    createFromTemplate,
    generateUuid,
    getEndpointAbout() {
      return "/about";
    },
    getEndpointActivities() {
      return "/activities";
    },
    getEndpointActivitiesProfile() {
      return "/activities/profile";
    },
    getEndpointActivitiesState() {
      return "/activities/state";
    },
    getEndpointAgents() {
      return "/agents";
    },
    getEndpointAgentsProfile() {
      return "/agents/profile";
    },
    getEndpointStatements() {
      return "/statements";
    },
    getTimeMargin() {
      return timeMargin;
    },
    getUrlEncoding,
    sendRequest,
    sendJsonRequest(request) {
      return sendRequest({
        method: request.method,
        path: request.path,
        headers: request.headers,
        query: request.query,
        body: request.json,
      });
    },
    buildActivityProfile,
    buildAgentProfile,
    buildDocument,
    buildState,
    async setTimeMargin() {
      if (typeof timeMargin !== "undefined") {
        return timeMargin;
      }

      const statementPayload = await createFromTemplate([{ statement: "{{statements.default}}" }]);
      const statement = statementPayload.statement;
      if (!isJsonObject(statement)) {
        throw new Error("The default statement fixture did not resolve to an object.");
      }

      const statementId = generateUuid();
      statement.id = statementId;
      const suiteTime = new Date();

      const postResponse = await sendRequest({
        method: "POST",
        path: "/statements",
        body: statement,
      });

      if (postResponse.status !== 200) {
        throw new Error(`Unable to establish time margin: expected 200 but received ${postResponse.status}.`);
      }

      const deadline = Date.now() + 15_000;
      while (Date.now() <= deadline) {
        const getResponse = await sendRequest({
          method: "GET",
          path: "/statements",
          query: {
            statementId,
          },
        });

        if (getResponse.status === 200) {
          const result = JSON.parse(getResponse.bodyText) as { stored?: string };
          if (!result.stored) {
            throw new Error("The retrieved statement did not include a stored timestamp.");
          }

          const lrsTime = new Date(result.stored);
          timeMargin = suiteTime.getTime() - lrsTime.getTime();
          return timeMargin;
        }

        await wait(200);
      }

      throw new Error("Timed out while calculating time margin.");
    },
  };
}
