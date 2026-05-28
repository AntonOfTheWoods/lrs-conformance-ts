// @ts-nocheck
"use strict";

function cloneHeader(context, header) {
  return context.extend(true, {}, header || {});
}

function createHelperTransportSupport(context) {
  const helper = function () {
    return context.getHelperExports();
  };

  return {
    addAllHeaders: function addAllHeaders(header, badAuth) {
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

    addHeaderXapiVersion: function addHeaderXapiVersion(header) {
      var newHeader = cloneHeader(context, header);
      newHeader["X-Experience-API-Version"] = helper().getXapiVersion();
      return newHeader;
    },

    addBasicAuthenicationHeader: function addBasicAuthenicationHeader(header) {
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
      var executionState = global.__lrsConformanceCaptureExecutionState;
      if (!executionState || !Array.isArray(executionState.suitePath)) {
        return null;
      }

      var suitePath = executionState.suitePath.filter(function (segment) {
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

    addCaptureOwnerHeader: function addCaptureOwnerHeader(header) {
      var newHeader = cloneHeader(context, header);
      var metadata = helper().buildCaptureOwnerMetadata();
      if (metadata) {
        newHeader[context.getState().CAPTURE_OWNER_HEADER] = metadata;
      }
      return newHeader;
    },

    genDelay: function genDelay(time, query, id) {
      var comb = require("comb");
      var request = require("super-request");

      var delay = function () {
        var p = new comb.Promise();
        var endP = helper().getEndpointStatements();
        if (query) {
          endP += query;
        }
        var delta;
        var finish;

        function stmtFound(arr, expectedId) {
          var found = false;
          arr.forEach(function (statement) {
            if (statement.id === expectedId) {
              found = true;
            }
          });
          return found;
        }

        function doRequest() {
          if (global.OAUTH) {
            request = helper().OAuthRequest(request);
          }
          request(helper().getEndpointAndAuth())
            .get(endP)
            .headers(helper().addAllHeaders({}))
            .end(function (err, res) {
              var result;
              if (err) {
                throw err;
              }

              try {
                result = JSON.parse(res.body);
              } catch (_error) {
                result = {};
              }

              if (id && result.id && result.id === id) {
                p.resolve();
              } else if (id && result.statements && stmtFound(result.statements, id)) {
                p.resolve();
              } else if (
                new Date(res.headers["x-experience-api-consistent-through"]).valueOf() + helper().getTimeMargin() >=
                time
              ) {
                p.resolve();
              } else {
                if (!delta) {
                  delta =
                    new Date(res.headers.date).valueOf() -
                    new Date(res.headers["x-experience-api-consistent-through"]).valueOf();
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

    sendRequest: function sendRequest(type, url, params, body, expectedStatus, extraHeaders) {
      var request = require("super-request");
      var methodName = type === "delete" ? "del" : type;
      if (global.OAUTH) {
        request = helper().OAuthRequest(request);
      }

      request = request(helper().getEndpointAndAuth());
      var reqUrl = params ? url + "?" + helper().getUrlEncoding(params) : url;

      var headers = helper().addAllHeaders(extraHeaders || {});
      var pre = request[methodName](reqUrl);
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
        pre.expect(expectedStatus).end(function (error, response) {
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

    extendRequestWithOauth: function extendRequestWithOauth(pre) {
      pre.sign = function (oa, token, secret) {
        var additionalData = {};
        additionalData = JSON.parse(JSON.stringify(additionalData));
        additionalData["oauth_verifier"] = global.OAUTH.verifier;
        var params = oa._prepareParameters(token, secret, pre.method, pre.url, additionalData);

        var signature = oa._buildAuthorizationHeaders(params);
        pre.set("Authorization", signature);
      };
    },

    setTimeMargin: function setTimeMargin(done) {
      var request = require("super-request");
      var temp = [{ statement: "{{statements.default}}" }];
      var stmt;
      var id = helper().generateUUID();
      var query = helper().getUrlEncoding({
        statementId: id,
      });
      var lrsTime;
      var suiteTime;

      stmt = helper().createTestObject(helper().convertTemplate(temp)).statement;
      stmt.id = id;
      suiteTime = new Date();

      if (global.OAUTH) {
        request = helper().OAuthRequest(request);
      }

      request(helper().getEndpointAndAuth())
        .post(helper().getEndpointStatements())
        .headers(helper().addAllHeaders({}))
        .json(stmt)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            function redo() {
              request(helper().getEndpointAndAuth())
                .get(helper().getEndpointStatements() + "?" + query)
                .headers(helper().addAllHeaders({}))
                .end(function (redoErr, redoRes) {
                  if (redoErr) {
                    done(redoErr);
                  } else if (redoRes.statusCode === 200) {
                    var result = JSON.parse(redoRes.body);
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

    getUrlEncoding: function getUrlEncoding(object) {
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

    OAuthRequest: function OAuthRequest(request) {
      var originalRequest = request;

      function authRequest(e) {
        var r = originalRequest(e);

        function wrapPromise(p) {
          if (p.__wrapped === true) return;
          p.__wrapped = true;
          for (var i in p) {
            (function (methodName) {
              if (typeof p[methodName] !== "function") return;
              p[methodName + "_preAuth_"] = p[methodName];
              p[methodName] = function () {
                var test = p[methodName + "_preAuth_"].apply(p, arguments);
                if (test) {
                  if (methodName === "end") {
                    wrapPromise(test);
                  } else {
                    wrapMethods(test);
                  }
                }
                return test;
              };
            })(i);
          }
        }

        function wrapMethods(testRequest) {
          if (testRequest.__wrapped === true) return;
          testRequest.__wrapped = true;
          if (testRequest._options) testRequest._options.oauth = global.OAUTH;
          for (var i in testRequest) {
            (function (methodName) {
              if (typeof testRequest[methodName] !== "function") return;
              testRequest["_preAuth_" + methodName] = testRequest[methodName];
              testRequest[methodName] = function () {
                var nextTest = testRequest["_preAuth_" + methodName].apply(testRequest, arguments);
                if (nextTest && nextTest._options && !nextTest._options.oauth) {
                  nextTest._options.oauth = global.OAUTH;
                  wrapMethods(nextTest);
                  return nextTest;
                }
                if (methodName === "end") {
                  wrapPromise(nextTest);
                }

                return nextTest;
              };
            })(i);
          }
        }

        wrapMethods(r);
        return r;
      }

      return authRequest;
    },
  };
}

module.exports = {
  createHelperTransportSupport: createHelperTransportSupport,
};