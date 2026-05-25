import { Buffer } from "node:buffer";

import type { NormalizedRunnerOptions } from "./options.ts";
import { createFromTemplate, type JsonObject, type JsonValue, type TemplateLayer } from "./templates.ts";

export interface JsonRequestOptions {
  method: "GET" | "HEAD" | "POST" | "PUT";
  path: string;
  headers?: Record<string, string>;
  json?: JsonValue;
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
  getEndpointStatements(): string;
  sendJsonRequest(request: JsonRequestOptions): Promise<JsonResponse>;
  setTimeMargin(): Promise<void>;
}

function joinEndpoint(baseEndpoint: string, resourcePath: string): string {
  const normalizedBase = baseEndpoint.replace(/\/+$/, "");
  const normalizedPath = resourcePath.startsWith("/") ? resourcePath : `/${resourcePath}`;
  return `${normalizedBase}${normalizedPath}`;
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

export function createDescribeRuntimeContext(
  directory: string,
  options: NormalizedRunnerOptions,
): DescribeRuntimeContext {
  return {
    directory,
    options,
    addAllHeaders(headers = {}, badAuth = false) {
      const versionHeaders = addHeaderXapiVersion(headers, options);
      return addBasicAuthenticationHeader(versionHeaders, options, badAuth);
    },
    createFromTemplate(layers) {
      return createFromTemplate(directory, layers);
    },
    getEndpointStatements() {
      return "/statements";
    },
    async sendJsonRequest(request) {
      const headers = request.json
        ? {
            "Content-Type": "application/json",
            ...request.headers,
          }
        : { ...request.headers };

      const response = await fetch(joinEndpoint(options.endpoint, request.path), {
        method: request.method,
        headers: this.addAllHeaders(headers),
        body: typeof request.json === "undefined" ? undefined : JSON.stringify(request.json),
      });

      return {
        status: response.status,
        bodyText: await response.text(),
        headers: response.headers,
      };
    },
    async setTimeMargin() {
      // The first slice does not depend on time-differential calculations yet.
    },
  };
}
