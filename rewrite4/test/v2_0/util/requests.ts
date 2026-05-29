const axiosBase = require("axios") as typeof import("axios");
const axios = axiosBase.default;
const addOAuthInterceptor = require("axios-oauth-1.0a").default as typeof import("axios-oauth-1.0a").default;
const oldHelpersModule = require("../../helper.ts") as {
  default?: {
    generateUUID(): string;
    getUrlEncoding(params: Record<string, unknown>): string;
    signStatement(statement: Record<string, unknown>, options: { boundary: string }): Buffer;
  };
  generateUUID(): string;
  getUrlEncoding(params: Record<string, unknown>): string;
  signStatement(statement: Record<string, unknown>, options: { boundary: string }): Buffer;
};
const oldHelpers = oldHelpersModule.default ?? oldHelpersModule;

type AxiosResponse = import("axios").AxiosResponse;
type HeaderOverrides = Record<string, string> | undefined;
type QueryParams = Record<string, unknown>;

const LRS_ENDPOINT = process.env.LRS_ENDPOINT ?? "";
const PATH_ACTIVITIES = "/activities";
const PATH_ACTIVITIES_PROFILE = "/activities/profile";
const PATH_ACTIVITIES_STATE = "/activities/state";
const PATH_AGENTS_PROFILE = "/agents/profile";
const PATH_STATEMENTS = "/statements";

const globalWithOauth = globalThis as typeof globalThis & {
  OAUTH?: {
    consumer_key: string;
    consumer_secret: string;
    token: string;
    token_secret: string;
    verifier: string;
  };
};

axios.defaults.headers.common = {
  ...axios.defaults.headers.common,
  "Content-Type": "application/json",
  "X-Experience-API-Version": process.env.XAPI_VERSION,
};

if (typeof globalWithOauth.OAUTH !== "undefined") {
  addOAuthInterceptor(axios, {
    algorithm: "HMAC-SHA1",
    key: globalWithOauth.OAUTH.consumer_key,
    secret: globalWithOauth.OAUTH.consumer_secret,
    token: globalWithOauth.OAUTH.token,
    tokenSecret: globalWithOauth.OAUTH.token_secret,
    verifier: globalWithOauth.OAUTH.verifier,
  });
} else {
  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASSWORD;

  axios.defaults.headers.common.Authorization = `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;
}

function joinPaths(endpoint: string, resourcePath: string): string {
  return resourcePath ? endpoint.replace(/\/+$/, "") + "/" + resourcePath.replace(/^\/+/, "") : endpoint;
}

function getDocumentQuery(params: QueryParams): string {
  return `?${oldHelpers.getUrlEncoding(params)}`;
}

async function catchResponse<T>(promise: Promise<T>): Promise<T | AxiosResponse | undefined> {
  try {
    return await promise;
  } catch (error) {
    const axiosError = error as { response?: AxiosResponse };
    return axiosError.response;
  }
}

const requests = {
  resourcePaths: {
    activityProfile: PATH_ACTIVITIES_PROFILE,
    activityState: PATH_ACTIVITIES_STATE,
    agentsProfile: PATH_AGENTS_PROFILE,
  },

  async getStatementExact(id: string, headerOverrides?: HeaderOverrides): Promise<AxiosResponse | undefined> {
    return requests.getDocuments(PATH_STATEMENTS, { statementId: id }, headerOverrides);
  },

  async getStatementExactPromise(id: string, headerOverrides?: HeaderOverrides): Promise<AxiosResponse | undefined> {
    return requests.getDocuments(PATH_STATEMENTS, { statementId: id }, headerOverrides);
  },

  generateRandomMultipartBoundary(): string {
    return `-------------__${oldHelpers.generateUUID()}__123__456`;
  },

  generateSignedStatementBody(statement: Record<string, unknown>, boundary?: string): string {
    const multipartBoundary = boundary || requests.generateRandomMultipartBoundary();
    return oldHelpers.signStatement(statement, { boundary: multipartBoundary }).toString();
  },

  async sendSignedStatementBody(
    multipartBody: string,
    boundary: string,
    headerOverrides?: HeaderOverrides,
  ): Promise<AxiosResponse | undefined> {
    const endpoint = joinPaths(LRS_ENDPOINT, PATH_STATEMENTS);

    return (await catchResponse(
      axios.post(endpoint, multipartBody, {
        headers: {
          ...headerOverrides,
          "Content-Type": `multipart/mixed; boundary=${boundary}`,
        },
      }),
    )) as AxiosResponse | undefined;
  },

  async sendStatement(
    statement: Record<string, unknown>,
    headerOverrides?: HeaderOverrides,
  ): Promise<AxiosResponse | undefined> {
    const endpoint = joinPaths(LRS_ENDPOINT, PATH_STATEMENTS);
    return (await catchResponse(axios.post(endpoint, statement, { headers: headerOverrides }))) as
      | AxiosResponse
      | undefined;
  },

  async sendStatementPromise(
    statement: Record<string, unknown>,
    headerOverrides?: HeaderOverrides,
  ): Promise<AxiosResponse | undefined> {
    const endpoint = joinPaths(LRS_ENDPOINT, PATH_STATEMENTS);
    return (await catchResponse(axios.post(endpoint, statement, { headers: headerOverrides }))) as
      | AxiosResponse
      | undefined;
  },

  async getActivityWithIRI(iri: string, headerOverrides?: HeaderOverrides): Promise<AxiosResponse | undefined> {
    const endpoint = joinPaths(LRS_ENDPOINT, PATH_ACTIVITIES);
    const query = `?activityId=${encodeURIComponent(iri)}`;

    return (await catchResponse(axios.get(endpoint + query, { headers: headerOverrides }))) as
      | AxiosResponse
      | undefined;
  },

  async putState(
    state: unknown,
    params: QueryParams,
    headerOverrides?: HeaderOverrides,
  ): Promise<AxiosResponse | undefined> {
    return requests.putDocument(PATH_ACTIVITIES_STATE, state, params, headerOverrides);
  },

  async postState(
    state: unknown,
    params: QueryParams,
    headerOverrides?: HeaderOverrides,
  ): Promise<AxiosResponse | undefined> {
    return requests.postDocument(PATH_ACTIVITIES_STATE, state, params, headerOverrides);
  },

  async deleteState(params: QueryParams, headerOverrides?: HeaderOverrides): Promise<AxiosResponse | undefined> {
    return requests.deleteDocument(PATH_ACTIVITIES_STATE, params, headerOverrides);
  },

  async getSingleState(params: QueryParams, headerOverrides?: HeaderOverrides): Promise<AxiosResponse | undefined> {
    return requests.getDocuments(PATH_ACTIVITIES_STATE, params, headerOverrides);
  },

  async getMultipleStates(params: QueryParams, headerOverrides?: HeaderOverrides): Promise<AxiosResponse | undefined> {
    return requests.getDocuments(PATH_ACTIVITIES_STATE, params, headerOverrides);
  },

  async putAgentProfile(
    document: unknown,
    params: QueryParams,
    headerOverrides?: HeaderOverrides,
  ): Promise<AxiosResponse | undefined> {
    return requests.putDocument(PATH_AGENTS_PROFILE, document, params, headerOverrides);
  },

  async postAgentProfile(
    document: unknown,
    params: QueryParams,
    headerOverrides?: HeaderOverrides,
  ): Promise<AxiosResponse | undefined> {
    return requests.postDocument(PATH_AGENTS_PROFILE, document, params, headerOverrides);
  },

  async deleteAgentProfile(params: QueryParams, headerOverrides?: HeaderOverrides): Promise<AxiosResponse | undefined> {
    return requests.deleteDocument(PATH_AGENTS_PROFILE, params, headerOverrides);
  },

  async getSingleAgentProfile(
    params: QueryParams,
    headerOverrides?: HeaderOverrides,
  ): Promise<AxiosResponse | undefined> {
    return requests.getDocuments(PATH_AGENTS_PROFILE, params, headerOverrides);
  },

  async getMultipleAgentProfiles(
    params: QueryParams,
    headerOverrides?: HeaderOverrides,
  ): Promise<AxiosResponse | undefined> {
    return requests.getDocuments(PATH_AGENTS_PROFILE, params, headerOverrides);
  },

  async getDocuments(
    resourcePath: string,
    params: QueryParams,
    headerOverrides?: HeaderOverrides,
  ): Promise<AxiosResponse | undefined> {
    const endpoint = joinPaths(LRS_ENDPOINT, resourcePath);
    const query = getDocumentQuery(params);
    const headers = headerOverrides;

    return (await catchResponse(axios.get(endpoint + query, { headers }))) as AxiosResponse | undefined;
  },

  async putDocument(
    resourcePath: string,
    document: unknown,
    params: QueryParams,
    headerOverrides?: HeaderOverrides,
  ): Promise<AxiosResponse | undefined> {
    const endpoint = joinPaths(LRS_ENDPOINT, resourcePath);
    const query = getDocumentQuery(params);
    return (await catchResponse(axios.put(endpoint + query, document, { headers: headerOverrides }))) as
      | AxiosResponse
      | undefined;
  },

  async postDocument(
    resourcePath: string,
    document: unknown,
    params: QueryParams,
    headerOverrides?: HeaderOverrides,
  ): Promise<AxiosResponse | undefined> {
    const endpoint = joinPaths(LRS_ENDPOINT, resourcePath);
    const query = getDocumentQuery(params);
    return (await catchResponse(axios.post(endpoint + query, document, { headers: headerOverrides }))) as
      | AxiosResponse
      | undefined;
  },

  async postToStatements(
    document: unknown,
    params: QueryParams,
    headerOverrides?: HeaderOverrides,
  ): Promise<AxiosResponse | undefined> {
    const endpoint = joinPaths(LRS_ENDPOINT, PATH_STATEMENTS);
    const query = getDocumentQuery(params);
    return (await catchResponse(axios.post(endpoint + query, document, { headers: headerOverrides }))) as
      | AxiosResponse
      | undefined;
  },

  async putToStatements(
    document: unknown,
    params: QueryParams,
    headerOverrides?: HeaderOverrides,
  ): Promise<AxiosResponse | undefined> {
    const endpoint = joinPaths(LRS_ENDPOINT, PATH_STATEMENTS);
    const query = getDocumentQuery(params);
    return (await catchResponse(axios.put(endpoint + query, document, { headers: headerOverrides }))) as
      | AxiosResponse
      | undefined;
  },

  async deleteDocument(
    resourcePath: string,
    params: QueryParams,
    headerOverrides?: HeaderOverrides,
  ): Promise<AxiosResponse | undefined> {
    const endpoint = joinPaths(LRS_ENDPOINT, resourcePath);
    const query = getDocumentQuery(params);
    return (await catchResponse(axios.delete(endpoint + query, { headers: headerOverrides }))) as
      | AxiosResponse
      | undefined;
  },

  async delay(ms: number): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, ms));
  },
};

export default requests;

if (typeof module !== "undefined") {
  module.exports = requests;
}
