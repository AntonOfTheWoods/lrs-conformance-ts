
const crypto = require("node:crypto");

function encodeRfc3986(value) {
  return encodeURIComponent(value).replace(/[!'()*]/g, function (character) {
    return "%" + character.charCodeAt(0).toString(16).toUpperCase();
  });
}

function normalizeHeaders(headers) {
  const result = {};
  Object.keys(headers || {}).forEach(function (key) {
    const value = headers[key];
    if (typeof value === "undefined") {
      return;
    }
    result[key.toLowerCase()] = String(value);
  });
  return result;
}

function parseQuery(url) {
  const parsed = new URL(url);
  const params = [];
  parsed.searchParams.forEach(function (value, key) {
    params.push([key, value]);
  });
  return params;
}

function parseFormBody(headers, body) {
  const contentType = headers["content-type"] || "";
  if (!contentType.includes("application/x-www-form-urlencoded") || typeof body !== "string") {
    return [];
  }

  const params = [];
  new URLSearchParams(body).forEach(function (value, key) {
    params.push([key, value]);
  });
  return params;
}

function buildOAuthAuthorizationHeader(method, url, headers, body, oauth) {
  const oauthParams = {
    oauth_consumer_key: oauth.consumer_key || "",
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: oauth.token || "",
    oauth_version: "1.0",
  };

  if (oauth.verifier) {
    oauthParams.oauth_verifier = oauth.verifier;
  }

  const allParams = [];
  parseQuery(url).forEach(function (pair) {
    allParams.push(pair);
  });
  parseFormBody(headers, body).forEach(function (pair) {
    allParams.push(pair);
  });
  Object.keys(oauthParams).forEach(function (key) {
    allParams.push([key, oauthParams[key]]);
  });

  const normalizedParameterString = allParams
    .map(function (pair) {
      return [encodeRfc3986(pair[0]), encodeRfc3986(pair[1])];
    })
    .sort(function (left, right) {
      if (left[0] === right[0]) {
        return left[1] < right[1] ? -1 : left[1] > right[1] ? 1 : 0;
      }
      return left[0] < right[0] ? -1 : 1;
    })
    .map(function (pair) {
      return pair[0] + "=" + pair[1];
    })
    .join("&");

  const parsedUrl = new URL(url);
  const baseUrl = parsedUrl.origin + parsedUrl.pathname;
  const baseString = [method.toUpperCase(), encodeRfc3986(baseUrl), encodeRfc3986(normalizedParameterString)].join("&");

  const signingKey = encodeRfc3986(oauth.consumer_secret || "") + "&" + encodeRfc3986(oauth.token_secret || "");
  const signature = crypto.createHmac("sha1", signingKey).update(baseString).digest("base64");

  oauthParams.oauth_signature = signature;

  return (
    "OAuth " +
    Object.keys(oauthParams)
      .sort()
      .map(function (key) {
        return encodeRfc3986(key) + '="' + encodeRfc3986(oauthParams[key]) + '"';
      })
      .join(", ")
  );
}

function createChain(endpoint, method, path) {
  const state = {
    endpoint,
    method,
    path,
    headers: {},
    body: undefined,
    parseJsonResponse: false,
    expectedStatus: undefined,
    waitPromise: undefined,
    _options: {},
  };

  function resolveUrl() {
    if (/^https?:\/\//i.test(state.path)) {
      return state.path;
    }
    const base = String(state.endpoint || "").replace(/\/+$/, "");
    const targetPath = String(state.path || "");
    if (!base) {
      return targetPath;
    }
    if (!targetPath) {
      return base;
    }
    if (targetPath.startsWith("/")) {
      return base + targetPath;
    }
    return base + "/" + targetPath;
  }

  const chain = {
    _options: state._options,
    method: method,
    url: resolveUrl(),
    headers: function (value) {
      state.headers = Object.assign(state.headers, normalizeHeaders(value || {}));
      return chain;
    },
    set: function (name, value) {
      state.headers[String(name).toLowerCase()] = String(value);
      return chain;
    },
    json: function (payload) {
      if (!state.headers["content-type"]) {
        state.headers["content-type"] = "application/json";
      }
      state.body = JSON.stringify(payload);
      state.parseJsonResponse = true;
      return chain;
    },
    body: function (payload) {
      state.body = Buffer.isBuffer(payload) ? payload : String(payload);
      state.parseJsonResponse = false;
      return chain;
    },
    form: function (value) {
      if (!state.headers["content-type"]) {
        state.headers["content-type"] = "application/x-www-form-urlencoded";
      }
      const searchParams = new URLSearchParams();
      Object.keys(value || {}).forEach(function (key) {
        const current = value[key];
        if (typeof current === "undefined" || current === null) {
          return;
        }
        searchParams.set(key, String(current));
      });
      state.body = searchParams.toString();
      state.parseJsonResponse = false;
      return chain;
    },
    wait: function (delay) {
      if (delay && typeof delay.then === "function") {
        state.waitPromise = delay;
      }
      return chain;
    },
    expect: function (status, callback) {
      state.expectedStatus = status;
      if (typeof callback === "function") {
        chain.end(callback);
      }
      return chain;
    },
    end: function (callback) {
      const done = typeof callback === "function" ? callback : function () {};
      void (async function () {
        try {
          if (state.waitPromise) {
            await state.waitPromise;
          }

          const requestHeaders = Object.assign({}, state.headers);
          const url = resolveUrl();
          if (state._options && state._options.oauth) {
            requestHeaders["authorization"] = buildOAuthAuthorizationHeader(
              state.method,
              url,
              requestHeaders,
              state.body,
              state._options.oauth,
            );
          }

          const response = await fetch(url, {
            method: state.method,
            headers: requestHeaders,
            body: state.method === "GET" || state.method === "HEAD" ? undefined : state.body,
          });

          const text = await response.text();
          const responseHeaders = {};
          response.headers.forEach(function (value, key) {
            responseHeaders[key.toLowerCase()] = value;
          });

          const responsePayload = {
            body: text,
            text: text,
            headers: responseHeaders,
            request: {
              href: url,
            },
            statusCode: response.status,
          };

          const contentType = (responseHeaders["content-type"] || "").toLowerCase();
          if (state.parseJsonResponse && contentType.includes("json") && text.length > 0) {
            try {
              responsePayload.body = JSON.parse(text);
            } catch (_ignored) {
              // Keep legacy-compatible fallback: retain raw response text when JSON parse fails.
            }
          }

          if (typeof state.expectedStatus === "number" && response.status !== state.expectedStatus) {
            done(
              new Error("Expected response status code to be " + state.expectedStatus + " got " + response.status),
              responsePayload,
            );
            return;
          }

          done(undefined, responsePayload);
        } catch (error) {
          done(error);
        }
      })();
      return chain;
    },
  };

  return chain;
}

function createRoot(endpoint) {
  return {
    get: function (path) {
      return createChain(endpoint, "GET", path);
    },
    post: function (path) {
      return createChain(endpoint, "POST", path);
    },
    put: function (path) {
      return createChain(endpoint, "PUT", path);
    },
    del: function (path) {
      return createChain(endpoint, "DELETE", path);
    },
    delete: function (path) {
      return createChain(endpoint, "DELETE", path);
    },
    head: function (path) {
      return createChain(endpoint, "HEAD", path);
    },
  };
}

module.exports = createRoot;
