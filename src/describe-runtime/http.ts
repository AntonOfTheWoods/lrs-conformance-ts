import type { LegacyVersionFolder } from "./upstream";

export interface LegacyBasicAuthOptions {
  username: string;
  password: string;
}

export type LegacyFetch = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

export interface LegacyStatementPostRuntimeOptions {
  baseUrl: string;
  version: LegacyVersionFolder;
  basicAuth?: LegacyBasicAuthOptions;
  fetchImpl?: LegacyFetch;
}

export interface LegacyStatementPostResult {
  response: Response;
  bodyText: string;
}

function withTrailingSlash(value: string): string {
  return value.endsWith("/") ? value : `${value}/`;
}

function toHeaderVersion(version: LegacyVersionFolder): string {
  return version === "v1_0_3" ? "1.0.3" : "2.0.0";
}

function buildBasicAuthorizationHeader(credentials: LegacyBasicAuthOptions): string {
  return `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString("base64")}`;
}

export function buildLegacyStatementHeaders(options: LegacyStatementPostRuntimeOptions): Headers {
  const headers = new Headers({
    "content-type": "application/json",
    "x-experience-api-version": toHeaderVersion(options.version),
  });

  if (options.basicAuth) {
    headers.set("authorization", buildBasicAuthorizationHeader(options.basicAuth));
  }

  return headers;
}

export async function postLegacyStatement(
  options: LegacyStatementPostRuntimeOptions,
  body: unknown,
): Promise<LegacyStatementPostResult> {
  const url = new URL("statements", withTrailingSlash(options.baseUrl));
  const fetchImpl = options.fetchImpl ?? fetch;
  const response = await fetchImpl(url, {
    method: "POST",
    headers: buildLegacyStatementHeaders(options),
    body: JSON.stringify(body),
  });
  const bodyText = await response.text();

  return {
    response,
    bodyText,
  };
}
