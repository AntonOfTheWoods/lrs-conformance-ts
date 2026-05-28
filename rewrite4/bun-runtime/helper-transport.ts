"use strict";

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
      var newHeader = cloneHeader(context, header);
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
      var newHeader = cloneHeader(context, header);
      newHeader["X-Experience-API-Version"] = helper().getXapiVersion();
      return newHeader;
    },

    addBasicAuthenicationHeader: function addBasicAuthenicationHeader(header: HeaderMap = {}) {
      var newHeader = cloneHeader(context, header);
      if (process.env.BASIC_AUTH_ENABLED === "true") {
        var userPass = Buffer.from(process.env.BASIC_AUTH_USER + ":" + process.env.BASIC_AUTH_PASSWORD).toString(
          "base64",
        );
        newHeader["Authorization"] = "Basic " + userPass;
      }
      return newHeader;
    },

    buildCaptureOwnerMetadata: function buildCaptureOwnerMetadata() {
      var state = context.getState();
      var executionState = runtimeGlobal.__lrsConformanceCaptureExecutionState;
      if (!executionState || !Array.isArray(executionState.suitePath)) {
        return null;
      }

      var suitePath = executionState.suitePath.filter(function (segment: unknown) {
        return typeof segment === "string" && segment.length > 0;
      });
      var testTitle =
        typeof executionState.testTitle === "string" && executionState.testTitle.length > 0
          ? executionState.testTitle
          : null;
      if (suitePath.length === 0 && !testTitle) {
        return null;
      }

      var casePath = testTitle ? suitePath.concat([testTitle]) : null;
      var ownerPath = casePath || suitePath;
      var fallbackSuiteTitle = suitePath.length > 0 ? suitePath[0] : "unmapped";
      var sourceFilePath = process.env.LRS_CAPTURE_SOURCE_FILE_PATH || null;
      var sourceSymbol = process.env.LRS_CAPTURE_SOURCE_SYMBOL || null;

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
      var newHeader = cloneHeader(context, header);
      var metadata = helper().buildCaptureOwnerMetadata();
      if (metadata) {
        newHeader[context.getState().CAPTURE_OWNER_HEADER] = metadata;
      }
      return newHeader;
    },

    genDelay: function genDelay(time: number, query?: string, id?: string) {
      var comb = require("comb") as CombModule;
      var requestFactory = require("super-request") as RequestFactory;

      var delay = function () {
        var p = new comb.Promise();
        var endP = helper().getEndpointStatements();
        if (query) {
          endP += query;
        }
        var delta: number | undefined;
        var finish: number | undefined;

        function stmtFound(arr: Array<{ id?: string }>, expectedId: string) {
          var found = false;
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
              var result: AnyRecord;
              if (err) {
                throw err;
              }

              var consistentThroughHeader = res.headers["x-experience-api-consistent-through"];
              var dateHeader = res.headers.date;

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
      return context.getState().TIME_MARGIN;
    },

    sendRequest: function sendRequest(
      type: string,
      url: string,
      params: Record<string, unknown> | undefined,
      body: Buffer | Record<string, unknown> | string | undefined,
      expectedStatus: number,
      extraHeaders?: HeaderMap,
    ) {
      var requestFactory = require("super-request") as RequestFactory;
      var methodName = type === "delete" ? "del" : type;
      if (runtimeGlobal.OAUTH) {
        requestFactory = helper().OAuthRequest(requestFactory);
      }

      var requestRoot = requestFactory(helper().getEndpointAndAuth());
      var reqUrl = params ? url + "?" + helper().getUrlEncoding(params) : url;

      var headers = helper().addAllHeaders(extraHeaders || {});
      var requestMethod = requestRoot[methodName] as ((requestUrl: string) => RequestChain) | undefined;
      if (typeof requestMethod !== "function") {
        throw new TypeError("Unsupported request method: " + methodName);
      }
      var pre = requestMethod.call(requestRoot, reqUrl);
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

          var contentType = response && response.headers ? response.headers["content-type"] : undefined;
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
        var additionalData: AnyRecord = {};
        additionalData = JSON.parse(JSON.stringify(additionalData));
        additionalData["oauth_verifier"] = runtimeGlobal.OAUTH?.verifier;
        var params = oa._prepareParameters(token, secret, pre.method, pre.url, additionalData);

        var signature = oa._buildAuthorizationHeaders(params);
        pre.set("Authorization", signature);
      };
    },

    setTimeMargin: function setTimeMargin(done: (error?: unknown, ...ignored: unknown[]) => void) {
      var requestFactory = require("super-request") as RequestFactory;
      var temp: Array<Record<string, string>> = [{ statement: "{{statements.default}}" }];
      var id = helper().generateUUID();
      var query = helper().getUrlEncoding({
        statementId: id,
      });
      var lrsTime: Date;
      var suiteTime: Date;
      var statementContainer = helper().createTestObject(helper().convertTemplate(temp)) as {
        statement: AnyRecord;
      };
      var stmt = statementContainer.statement;

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
                    var result = JSON.parse(redoRes.body) as { stored: string };
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
      var encoding = "";
      Object.keys(object).forEach(function (key, index) {
        if (index !== 0) {
          encoding += "&";
        }
        var value = object[key];
        encoding += key + "=" + (typeof value === "object" ? encodeURIComponent(JSON.stringify(value)) : value);
      });
      return encoding;
    },

    getXapiVersion: function getXapiVersion() {
      return process.env.XAPI_VERSION;
    },

    OAuthRequest: function OAuthRequest(request: RequestFactory) {
      var originalRequest = request;

      function authRequest(e: string) {
        var r = originalRequest(e);

        function wrapPromise(p: RequestChain | undefined) {
          if (!p) return;
          if (p.__wrapped === true) return;
          p.__wrapped = true;
          for (var i in p) {
            (function (methodName) {
              if (typeof p[methodName] !== "function") return;
              var preAuthMethod = p[methodName] as (...args: unknown[]) => unknown;
              p[methodName + "_preAuth_"] = preAuthMethod;
              p[methodName] = function () {
                var test = preAuthMethod.apply(p, arguments as unknown as []);
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
          for (var i in testRequest) {
            (function (methodName) {
              if (typeof testRequest[methodName] !== "function") return;
              var preAuthMethod = testRequest[methodName] as (...args: unknown[]) => unknown;
              testRequest["_preAuth_" + methodName] = preAuthMethod;
              testRequest[methodName] = function () {
                var nextTest = preAuthMethod.apply(testRequest, arguments as unknown as []);
                var wrappedNextTest = nextTest as RequestChain | undefined;
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

module.exports = {
  createHelperTransportSupport: createHelperTransportSupport,
};
