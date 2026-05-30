"use strict";

import combImport from "comb";
import requestFactoryImport from "super-request";

type AnyRecord = Record<string, any>;
type HeaderMap = Record<string, string | undefined>;

type HelperState = {
  CAPTURE_OWNER_HEADER: string;
  DIRECTORY: string;
  LRS_ENDPOINT: string;
  TIME_MARGIN: number | undefined;
  URL_ABOUT: string;
  URL_ACTIVITIES: string;
  URL_ACTIVITIES_PROFILE: string;
  URL_ACTIVITIES_STATE: string;
  URL_AGENTS: string;
  URL_AGENTS_PROFILE: string;
  URL_STATEMENTS: string;
};

type RequestResponse = {
  body: string;
  headers: Record<string, string | undefined>;
  statusCode?: number;
  text?: string;
};

type RequestChain = AnyRecord & {
  _options?: {
    oauth?: unknown;
  };
  body: (payload: string | Buffer) => RequestChain;
  end: (callback: (error: unknown, response: RequestResponse) => void) => unknown;
  expect: (status: number) => RequestChain;
  get: (url: string) => RequestChain;
  headers: (headers: HeaderMap) => RequestChain;
  json: (payload: unknown) => RequestChain;
  method?: string;
  post: (url: string) => RequestChain;
  put: (url: string) => RequestChain;
  set: (name: string, value: string) => void;
  url?: string;
};

type RequestFactory = AnyRecord & ((endpoint: string) => RequestChain);

type CombPromise = {
  resolve: () => void;
};

type CombModule = {
  Promise: new () => CombPromise;
};

type HelperExports = {
  OAuthRequest(request: RequestFactory): RequestFactory;
  addAllHeaders(header: HeaderMap, badAuth?: boolean): HeaderMap;
  addBasicAuthenicationHeader(header: HeaderMap): HeaderMap;
  addCaptureOwnerHeader(header: HeaderMap): HeaderMap;
  addHeaderXapiVersion(header: HeaderMap): HeaderMap;
  buildCaptureOwnerMetadata(): string | null;
  convertTemplate(list: Array<Record<string, unknown>>): Array<Record<string, unknown>>;
  createTestObject(list: Array<Record<string, unknown>>): AnyRecord;
  generateUUID(): string;
  getEndpointAndAuth(): string;
  getEndpointStatements(): string;
  getTimeMargin(): number | undefined;
  getUrlEncoding(object: Record<string, unknown>): string;
  getXapiVersion(): string | undefined;
};

type HelperTransportContext = {
  extend(deep: boolean, target: AnyRecord, source: AnyRecord): HeaderMap;
  getHelperExports(): HelperExports;
  getState(): HelperState;
  setTimeMargin(value: number | undefined): void;
};

const runtimeGlobal = globalThis as typeof globalThis & {
  OAUTH?: {
    verifier?: string;
  };
  __lrsConformanceCaptureExecutionState?: {
    suitePath?: unknown;
    testTitle?: unknown;
  };
};

function cloneHeader(context: HelperTransportContext, header?: HeaderMap): HeaderMap {
  return context.extend(true, {}, header || {});
}

function createHelperTransportSupport(context: HelperTransportContext) {
  const helper = function () {
    return context.getHelperExports();
  };

  return {
    addAllHeaders: function addAllHeaders(header: HeaderMap = {}, badAuth?: boolean) {
      badAuth = badAuth || false;
      let newHeader = cloneHeader(context, header);
      newHeader = helper().addHeaderXapiVersion(newHeader);
      if (badAuth) {
        newHeader["Authorization"] = "Basic " + Buffer.from("foo:bar").toString("base64");
      } else {
        newHeader = helper().addBasicAuthenicationHeader(newHeader);
      }
      newHeader = helper().addCaptureOwnerHeader(newHeader);
      return newHeader;
    },

    addHeaderXapiVersion: function addHeaderXapiVersion(header: HeaderMap = {}) {
      const newHeader = cloneHeader(context, header);
      newHeader["X-Experience-API-Version"] = helper().getXapiVersion();
      return newHeader;
    },

    addBasicAuthenicationHeader: function addBasicAuthenicationHeader(header: HeaderMap = {}) {
      const newHeader = cloneHeader(context, header);
      if (process.env.BASIC_AUTH_ENABLED === "true") {
        const userPass = Buffer.from(process.env.BASIC_AUTH_USER + ":" + process.env.BASIC_AUTH_PASSWORD).toString(
          "base64",
        );
        newHeader["Authorization"] = "Basic " + userPass;
      }
      return newHeader;
    },

    buildCaptureOwnerMetadata: function buildCaptureOwnerMetadata() {
      const state = context.getState();
      const executionState = runtimeGlobal.__lrsConformanceCaptureExecutionState;
      if (!executionState || !Array.isArray(executionState.suitePath)) {
        return null;
      }

      const suitePath = executionState.suitePath.filter(function (segment: unknown) {
        return typeof segment === "string" && segment.length > 0;
      });
      const testTitle =
        typeof executionState.testTitle === "string" && executionState.testTitle.length > 0
          ? executionState.testTitle
          : null;
      if (suitePath.length === 0 && !testTitle) {
        return null;
      }

      const casePath = testTitle ? suitePath.concat([testTitle]) : null;
      const ownerPath = casePath || suitePath;
      const fallbackSuiteTitle = suitePath.length > 0 ? suitePath[0] : "unmapped";
      const sourceFilePath = process.env.LRS_CAPTURE_SOURCE_FILE_PATH || null;
      const sourceSymbol = process.env.LRS_CAPTURE_SOURCE_SYMBOL || null;

      return encodeURIComponent(
        JSON.stringify({
          casePath: casePath,
          directory: process.env.LRS_CAPTURE_DIRECTORY || state.DIRECTORY || "",
          hookTitle: null,
          ownerLabel: ownerPath.join(" > "),
          phase: testTitle ? "case" : "before",
          sourceFilePath: sourceFilePath,
          sourceSymbol: sourceSymbol,
          suitePath: suitePath,
          unitKey:
            process.env.LRS_CAPTURE_UNIT_KEY ||
            (process.env.LRS_CAPTURE_DIRECTORY || state.DIRECTORY || "unmapped") + ":" + fallbackSuiteTitle,
          version: process.env.LRS_CAPTURE_VERSION || process.env.XAPI_VERSION || "",
        }),
      );
    },

    addCaptureOwnerHeader: function addCaptureOwnerHeader(header: HeaderMap = {}) {
      const newHeader = cloneHeader(context, header);
      const metadata = helper().buildCaptureOwnerMetadata();
      if (metadata) {
        newHeader[context.getState().CAPTURE_OWNER_HEADER] = metadata;
      }
      return newHeader;
    },

    genDelay: function genDelay(time: number, query?: string, id?: string) {
      const comb = combImport as unknown as CombModule;
      let requestFactory = requestFactoryImport as unknown as RequestFactory;

      const delay = function () {
        const p = new comb.Promise();
        let endP = helper().getEndpointStatements();
        if (query) {
          endP += query;
        }
        let delta: number | undefined;
        let finish: number | undefined;

        function stmtFound(arr: Array<{ id?: string }>, expectedId: string) {
          let found = false;
          arr.forEach(function (statement) {
            if (statement.id === expectedId) {
              found = true;
            }
          });
          return found;
        }

        function doRequest() {
          if (runtimeGlobal.OAUTH) {
            requestFactory = helper().OAuthRequest(requestFactory);
          }
          requestFactory(helper().getEndpointAndAuth())
            .get(endP)
            .headers(helper().addAllHeaders({}))
            .end(function (err: unknown, res: RequestResponse) {
              let result: AnyRecord;
              if (err) {
                throw err;
              }

              const consistentThroughHeader = res.headers["x-experience-api-consistent-through"];
              const dateHeader = res.headers.date;

              try {
                result = JSON.parse(res.body);
              } catch (_error) {
                result = {};
              }

              if (id && result.id && result.id === id) {
                p.resolve();
              } else if (id && Array.isArray(result.statements) && stmtFound(result.statements, id)) {
                p.resolve();
              } else if (
                new Date(consistentThroughHeader ?? Number.NaN).valueOf() + (helper().getTimeMargin() ?? Number.NaN) >=
                time
              ) {
                p.resolve();
              } else {
                if (!delta) {
                  delta =
                    new Date(dateHeader ?? Number.NaN).valueOf() -
                    new Date(consistentThroughHeader ?? Number.NaN).valueOf();
                  finish = Date.now() + 10 * Math.abs(delta);

                  if (isNaN(finish)) {
                    throw new TypeError("X-Experience-API-Consistent-Through header was missing or not a number.");
                  }
                }

                if (typeof finish === "number" && Date.now() >= finish) {
                  p.resolve();
                } else {
                  setTimeout(doRequest, 1000);
                }
              }
            });
        }

        doRequest();
        return p;
      };

      return delay();
    },

    getEndpoint: function getEndpoint() {
      return context.getState().LRS_ENDPOINT;
    },

    getEndpointAndAuth: function getEndpointAndAuth() {
      return context.getState().LRS_ENDPOINT;
    },

    getEndpointAbout: function getEndpointAbout() {
      return context.getState().URL_ABOUT;
    },

    getEndpointActivities: function getEndpointActivities() {
      return context.getState().URL_ACTIVITIES;
    },

    getEndpointActivitiesProfile: function getEndpointActivitiesProfile() {
      return context.getState().URL_ACTIVITIES_PROFILE;
    },

    getEndpointActivitiesState: function getEndpointActivitiesState() {
      return context.getState().URL_ACTIVITIES_STATE;
    },

    getEndpointAgents: function getEndpointAgents() {
      return context.getState().URL_AGENTS;
    },

    getEndpointAgentsProfile: function getEndpointAgentsProfile() {
      return context.getState().URL_AGENTS_PROFILE;
    },

    getEndpointStatements: function getEndpointStatements() {
      return context.getState().URL_STATEMENTS;
    },

    getTimeMargin: function getTimeMargin() {
      return context.getState().TIME_MARGIN ?? 0;
    },

    sendRequest: function sendRequest(
      type: string,
      url: string,
      params: Record<string, unknown> | undefined,
      body: Buffer | Record<string, unknown> | string | undefined,
      expectedStatus: number,
      extraHeaders?: HeaderMap,
    ) {
      let requestFactory = requestFactoryImport as unknown as RequestFactory;
      const methodName = type === "delete" ? "del" : type;
      if (runtimeGlobal.OAUTH) {
        requestFactory = helper().OAuthRequest(requestFactory);
      }

      const requestRoot = requestFactory(helper().getEndpointAndAuth());
      const reqUrl = params ? url + "?" + helper().getUrlEncoding(params) : url;

      const headers = helper().addAllHeaders(extraHeaders || {});
      const requestMethod = requestRoot[methodName] as ((requestUrl: string) => RequestChain) | undefined;
      if (typeof requestMethod !== "function") {
        throw new TypeError("Unsupported request method: " + methodName);
      }
      const pre = requestMethod.call(requestRoot, reqUrl);
      if (body) {
        if (Buffer.isBuffer(body) || typeof body === "string") {
          if (!headers["content-type"] && !headers["Content-Type"]) {
            headers["content-type"] = "application/x-www-form-urlencoded";
          }
          pre.body(body);
        } else {
          pre.json(body);
        }
      }
      pre.headers(headers);

      return new Promise(function (resolve, reject) {
        pre.expect(expectedStatus).end(function (error: unknown, response: RequestResponse) {
          if (error) {
            reject(error);
            return;
          }

          const contentType = response && response.headers ? response.headers["content-type"] : undefined;
          if (response && typeof response.body === "string" && contentType && contentType.indexOf("json") !== -1) {
            try {
              response.body = JSON.parse(response.body);
            } catch (_parseError) {}
          }

          if (response && typeof response.text === "undefined" && typeof response.body === "string") {
            response.text = response.body;
          }

          resolve(response);
        });
      });
    },

    extendRequestWithOauth: function extendRequestWithOauth(pre: RequestChain) {
      pre.sign = function (oa: AnyRecord, token: string, secret: string) {
        let additionalData: AnyRecord = {};
        additionalData = JSON.parse(JSON.stringify(additionalData));
        additionalData["oauth_verifier"] = runtimeGlobal.OAUTH?.verifier;
        const params = oa._prepareParameters(token, secret, pre.method, pre.url, additionalData);

        const signature = oa._buildAuthorizationHeaders(params);
        pre.set("Authorization", signature);
      };
    },

    setTimeMargin: function setTimeMargin(done: (error?: unknown, ...ignored: unknown[]) => void) {
      let requestFactory = requestFactoryImport as unknown as RequestFactory;
      const temp: Array<Record<string, string>> = [{ statement: "{{statements.default}}" }];
      const id = helper().generateUUID();
      const query = helper().getUrlEncoding({
        statementId: id,
      });
      let lrsTime: Date;
      let suiteTime: Date;
      const statementContainer = helper().createTestObject(helper().convertTemplate(temp)) as {
        statement: AnyRecord;
      };
      const stmt = statementContainer.statement;

      stmt.id = id;
      suiteTime = new Date();

      if (runtimeGlobal.OAUTH) {
        requestFactory = helper().OAuthRequest(requestFactory);
      }

      requestFactory(helper().getEndpointAndAuth())
        .post(helper().getEndpointStatements())
        .headers(helper().addAllHeaders({}))
        .json(stmt)
        .expect(200)
        .end(function (err: unknown, _res: RequestResponse) {
          if (err) {
            done(err);
          } else {
            function redo() {
              requestFactory(helper().getEndpointAndAuth())
                .get(helper().getEndpointStatements() + "?" + query)
                .headers(helper().addAllHeaders({}))
                .end(function (redoErr: unknown, redoRes: RequestResponse) {
                  if (redoErr) {
                    done(redoErr);
                  } else if (redoRes.statusCode === 200) {
                    const result = JSON.parse(redoRes.body) as { stored: string };
                    lrsTime = new Date(result.stored);
                    context.setTimeMargin(suiteTime.valueOf() - lrsTime.valueOf());
                    done(redoErr, helper().getTimeMargin());
                  } else {
                    setTimeout(redo, 2000);
                  }
                });
            }

            redo();
          }
        });
    },

    getUrlEncoding: function getUrlEncoding(object: Record<string, unknown>) {
      let encoding = "";
      Object.keys(object).forEach(function (key, index) {
        if (index !== 0) {
          encoding += "&";
        }
        const value = object[key];
        encoding += key + "=" + (typeof value === "object" ? encodeURIComponent(JSON.stringify(value)) : value);
      });
      return encoding;
    },

    getXapiVersion: function getXapiVersion() {
      return process.env.XAPI_VERSION;
    },

    OAuthRequest: function OAuthRequest(request: RequestFactory) {
      const originalRequest = request;

      function authRequest(e: string) {
        const r = originalRequest(e);

        function wrapPromise(p: RequestChain | undefined) {
          if (!p) return;
          if (p.__wrapped === true) return;
          p.__wrapped = true;
          for (const i in p) {
            (function (methodName) {
              if (typeof p[methodName] !== "function") return;
              const preAuthMethod = p[methodName] as (...args: unknown[]) => unknown;
              p[methodName + "_preAuth_"] = preAuthMethod;
              p[methodName] = function () {
                const test = preAuthMethod.apply(p, arguments as unknown as []);
                if (test) {
                  if (methodName === "end") {
                    wrapPromise(test as RequestChain | undefined);
                  } else {
                    wrapMethods(test as RequestChain | undefined);
                  }
                }
                return test;
              };
            })(i);
          }
        }

        function wrapMethods(testRequest: RequestChain | undefined) {
          if (!testRequest) return;
          if (testRequest.__wrapped === true) return;
          testRequest.__wrapped = true;
          if (testRequest._options) testRequest._options.oauth = runtimeGlobal.OAUTH;
          for (const i in testRequest) {
            (function (methodName) {
              if (typeof testRequest[methodName] !== "function") return;
              const preAuthMethod = testRequest[methodName] as (...args: unknown[]) => unknown;
              testRequest["_preAuth_" + methodName] = preAuthMethod;
              testRequest[methodName] = function () {
                const nextTest = preAuthMethod.apply(testRequest, arguments as unknown as []);
                const wrappedNextTest = nextTest as RequestChain | undefined;
                if (wrappedNextTest && wrappedNextTest._options && !wrappedNextTest._options.oauth) {
                  wrappedNextTest._options.oauth = runtimeGlobal.OAUTH;
                  wrapMethods(wrappedNextTest);
                  return wrappedNextTest;
                }
                if (methodName === "end") {
                  wrapPromise(wrappedNextTest);
                }

                return nextTest;
              };
            })(i);
          }
        }

        wrapMethods(r);
        return r;
      }

      return authRequest as RequestFactory;
    },
  };
}

export { createHelperTransportSupport };

export default {
  createHelperTransportSupport,
};
