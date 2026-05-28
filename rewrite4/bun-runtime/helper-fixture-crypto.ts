"use strict";

type AnyRecord = Record<string, any>;
type JsonMapping = Record<string, Record<string, unknown>>;

type HelperState = {
  CONFIG_FOLDER: string;
  CONFIG_FOLDER_RELATIVE: string;
  DIRECTORY: string;
  TEMPLATE_FOLDER: string;
  TEMPLATE_FOLDER_RELATIVE: string;
};

type TestConfiguration = {
  config: unknown[];
  name: string;
};

type HelperExports = {
  clone(object: unknown): unknown;
  convertTemplate(list: Array<Record<string, unknown>>): Array<Record<string, unknown>>;
  createTestObject(list: Array<Record<string, unknown>>): AnyRecord;
  generateUUID(): string;
  getJsonMapping(): JsonMapping;
};

type FixtureCryptoContext = {
  FormUrlencode: {
    encode(value: Record<string, unknown>): string;
  };
  crypto: typeof import("crypto");
  extend(deep: boolean, target: AnyRecord, source: AnyRecord): AnyRecord;
  fs: typeof import("fs");
  getHelperExports(): HelperExports;
  getState(): HelperState;
  helperRequire: NodeJS.Require;
  jws: {
    sign(options: Record<string, unknown>): string;
  };
  lodashIsEqual(left: unknown, right: unknown): boolean;
  uuid: {
    v4(): string;
  };
};

type AttachmentInfo = {
  contentType?: string;
  usageType?: string;
};

type SignStatementOptions = {
  algorithm?: string;
  attachmentInfo?: AttachmentInfo;
  boundary?: string;
  breakJson?: boolean;
  privateKey?: string;
};

type SignableStatement = AnyRecord & {
  attachments?: Array<{
    contentType: string;
    description: Record<string, string>;
    display: Record<string, string>;
    length: number;
    sha2: string;
    usageType: string;
  }>;
};

function createMapping(mapper: JsonMapping, input: string) {
  var object: unknown = {};

  var nested: unknown = mapper;
  var cleanString = input.substring(2);
  cleanString = cleanString.substring(0, cleanString.length - 2);
  var mapping = cleanString.split(".");
  mapping.forEach(function (item) {
    nested = (nested as Record<string, unknown>)[item];
    if (nested) {
      object = nested;
    } else {
      throw new Error("Not mapped: " + input);
    }
  });
  return object;
}

function validateConfiguration(configurations: TestConfiguration[], location: string) {
  configurations.forEach(function (configuration) {
    if (!configuration.name) {
      throw new Error('Invalid configuration "missing name": ' + location);
    } else if (!Array.isArray(configuration.config)) {
      throw new Error('Invalid configuration "config not array": ' + location);
    }
  });
}

function createHelperFixtureCryptoSupport(context: FixtureCryptoContext) {
  const helper = function () {
    return context.getHelperExports();
  };

  return {
    convertTemplate: function convertTemplate(list: Array<Record<string, unknown>>) {
      var mapper = helper().getJsonMapping();
      var templates: Array<Record<string, unknown>> = [];
      list.forEach(function (item) {
        var key = Object.keys(item)[0];
        if (!key) {
          return;
        }
        var value = item[key];

        var object: Record<string, unknown> = {};
        if (typeof value === "string" && value.indexOf("{{") === 0 && value.indexOf("}}") === value.length - 2) {
          object[key] = createMapping(mapper, value);
          templates.push(object);
        } else {
          templates.push(item);
        }
      });
      return templates;
    },

    createFromTemplate: function createFromTemplate(templates: Array<Record<string, unknown>>) {
      var converted = helper().convertTemplate(templates);
      return helper().createTestObject(converted);
    },

    createTestObject: function createTestObject(array: Array<Record<string, unknown>>) {
      var from: Record<string, unknown> = {};

      array.reverse();
      array.forEach(function (to, index) {
        if (index === 0) {
          from = to;
          return;
        }

        var firstKey = Object.keys(to)[0];
        if (!firstKey) {
          return;
        }
        var toKey = to[firstKey] as AnyRecord;
        context.extend(true, toKey, from);
        from = to;
      });
      return from;
    },

    deepSearchObject: function deepSearchObject(object: Record<string, unknown>, primitive: unknown) {
      var tested: unknown[] = [];

      var _internal = function (candidate: Record<string, unknown>, expected: unknown): boolean {
        tested.push(candidate);
        var found = false;
        for (var i in candidate) {
          if (candidate[i] == expected) return true;
          else {
            if (typeof candidate[i] == "object" && candidate[i] !== null && tested.indexOf(candidate[i])) {
              found = found || _internal(candidate[i] as Record<string, unknown>, expected);
            }
          }
        }
        return found;
      };
      return _internal(object, primitive);
    },

    generateUUID: function generateUUID() {
      return context.uuid.v4();
    },

    getJsonMapping: function getJsonMapping() {
      var state = context.getState();
      var mapping: JsonMapping = {};
      var folders = context.fs.readdirSync(state.TEMPLATE_FOLDER) as string[];
      folders.forEach(function (folder) {
        var fileMapping: Record<string, unknown> = {};
        mapping[folder] = fileMapping;

        var files = context.fs.readdirSync(state.TEMPLATE_FOLDER + "/" + folder) as string[];
        files.forEach(function (file) {
          if (file.indexOf(".json") <= 0) {
            return;
          }

          var subfolder = state.TEMPLATE_FOLDER_RELATIVE + "/" + folder;
          var data = context.extend(true, {}, context.helperRequire(subfolder + "/" + file));
          var name = file.substring(0, file.indexOf(".json"));
          fileMapping[name] = data;
        });
      });
      return mapping;
    },

    getSHA1Sum: function getSHA1Sum(content: unknown) {
      var normalizedContent = typeof content === "string" ? content : JSON.stringify(content);

      var shasum = context.crypto.createHash("sha1");
      shasum.update(Buffer.from(normalizedContent));
      return shasum.digest("hex");
    },

    getTestConfiguration: function getTestConfiguration() {
      var state = context.getState();
      var list: TestConfiguration[] = [];

      var files = context.fs.readdirSync(state.CONFIG_FOLDER) as string[];
      files.forEach(function (file) {
        if (file.indexOf(".js") <= 0) {
          return;
        }

        var configFile = context.helperRequire(state.CONFIG_FOLDER_RELATIVE + "/" + file) as {
          config(): TestConfiguration[];
        };
        var config = configFile.config();
        validateConfiguration(config, "/" + file);
        list = list.concat(config);
      });
      return list;
    },

    getSingleTestConfiguration: function getSingleTestConfiguration(fileName: string) {
      var state = context.getState();
      var files = context.fs.readdirSync(state.CONFIG_FOLDER) as string[];
      var fileExists = false;
      files.forEach(function (file) {
        if (file === fileName) fileExists = true;
      });

      if (!fileExists) {
        throw new Error('Invalid configuration "missing name": ' + fileName);
      }

      var configFile = context.helperRequire(state.CONFIG_FOLDER_RELATIVE + "/" + fileName) as {
        config(): TestConfiguration[];
      };
      return configFile.config();
    },

    isEqual: function isEqual(original: unknown, other: unknown) {
      return context.lodashIsEqual(original, other);
    },

    buildFormBody: function buildFormBody(content: unknown, id?: string) {
      var body: Record<string, unknown> = {
        "X-Experience-API-Version": process.env.XAPI_VERSION,
        content: JSON.stringify(content),
      };
      if (id) {
        body.statementId = id;
      }
      return context.FormUrlencode.encode(body);
    },

    buildActivity: function buildActivity() {
      return {
        activityId: "http://www.example.com/activityId/hashset",
      };
    },

    buildState: function buildState() {
      return {
        activityId: "http://www.example.com/activityId/hashset",
        agent: {
          objectType: "Agent",
          account: {
            homePage: "http://www.example.com/agentId/1",
            name: "Rick James",
          },
        },
        stateId: helper().generateUUID(),
      };
    },

    buildActivityProfile: function buildActivityProfile() {
      return {
        activityId: "http://www.example.com/activityId/hashset",
        profileId: helper().generateUUID(),
      };
    },

    buildAgentProfile: function buildAgentProfile() {
      return {
        agent: {
          objectType: "Agent",
          account: {
            homePage: "http://www.example.com/agentId/1",
            name: "Rick James",
          },
        },
        profileId: helper().generateUUID(),
      };
    },

    buildAgent: function buildAgent() {
      return {
        agent: {
          name: "Rick James",
          objectType: "Agent",
          account: {
            homePage: "http://www.example.com/agentId/1",
            name: "Rick James",
          },
        },
      };
    },

    buildDocument: function buildDocument() {
      var document: Record<string, unknown> = {
        name: helper().generateUUID(),
        location: {
          name: helper().generateUUID(),
        },
      };
      document[helper().generateUUID()] = helper().generateUUID();
      return document;
    },

    buildStatement: function buildStatement() {
      var state = context.getState();
      return helper().clone(context.helperRequire("./" + state.DIRECTORY + "/templates/statements/default.json"));
    },

    clone: function clone(obj: unknown) {
      return JSON.parse(JSON.stringify(obj));
    },

    parse: function parse(input: string, done: (error?: unknown) => void) {
      var parsed: unknown;
      try {
        parsed = JSON.parse(input);
      } catch (error) {
        done(error);
      }
      return parsed;
    },

    signStatement: function signStatement(statement: SignableStatement, options?: SignStatementOptions) {
      options = options || {};
      options.privateKey =
        options.privateKey ||
        [
          "-----BEGIN RSA PRIVATE KEY-----",
          "MIIEpAIBAAKCAQEAvZtrkWAFrUYi8zekTKheDM7tvfNIB7FVbLtkPArlFMQE1kOe",
          "8sBEvENiMKvI8kv1jLuzbd/iSWd1Wqt81ooDAMwcv54b26w0qyk58vKv+ZgNzvUZ",
          "XtpFS3euLcOVPZUyc7O4gMLtDNblNehplFMNUFvd8Yc2jKOi9/URyIHOVzJwhKU0",
          "63CY6S8MEbTjHdhcYa3TpeFFtL8YKoCxR2h4OCtbMe0ub2tOIwZ4jKNhQQ1/N6SJ",
          "VV4gNmq6WVLfRtLDop72r5o8UZyPBwN9S3CxGBPMI2dBFC7waQwQ8zyvL6Kp2ZuA",
          "Q2clHQzGTsDpREGNqzXDdgkUN0bOGJn/JRgU3QIDAQABAoIBABdJbFepdGkIkShP",
          "8CTeFNb73yUSKQmQ1Q4Koc/iAqqfPHzYR0BHLun0WK3jm0Vu4NSNBQd8lL0xMK+X",
          "Gjj7ME07xFggYgmDx+AxqwVUmxpLe36siZYltpcDNug1+jFbDpw5OXLO/fAywGnz",
          "hmwKGzuAXOzaD3AMdOqBNdLrZl09BUlorhugmrXJbJebo/q3f6yxUbjanR70UpMs",
          "youqDH7JEV6FjFofLj32RQWWtkTlOEjQ5QE353v22HEZXvyDuwr50cAGtRS4Sqjw",
          "vXCGoBwJIHX75P5PN+MY3IBo3pjaKHZlNnQDnX7FQw/nxbAObWLEAj8IGlocNsWK",
          "F5QKnp0CgYEA8mJcGK6EotykzX8aBCrka2K7p9l4AVBHnzXNniVCh0OhdrdzcDQO",
          "hbbAm0uM+cIwnPrORY2DhG5hO8vxtsfojI/dFVUiJWXE1D4WDqJ65HdHMNKWu4SR",
          "vf1OHk3bliif5dTvmNOGt0G/Ypu1OkDvQ3zs0VIyM44TWVP+O5nsbxsCgYEAyEIX",
          "gnM460EsYBABZGRrKqcRhI+vNSPCxTV5nJS5MbdDkPiV9VQ3l0+p7IZ2jk91ISWt",
          "VlHLw9QMiOQF1776xJV7J30fSTk2fzz4znLjpnDcflZuyPtElNkQfr1A0LYTCjn8",
          "wfaZ7sA2RbvMHjWaD13qpKEkBlfjkLNn+zLPM2cCgYEAxDSg7o3e6mMHuR1pNvRt",
          "oQv0cgQVI6MTxyprftgUiaBShOItvSc2lkEAmvVGcisi5QAVl7HdQ4eCiEAoM1iR",
          "w671PT6D/JfsBA8aFdCrAGQZqcjeoX7H5260HM3TsjLCdO6w4Rphk9jSDwWSZ0yH",
          "Ii9vGGacIqWgvg/C3gZUoP8CgYBfOSYqrpVjMENkjlfLIADhcD3hNd2PPCjyU2I3",
          "dXS2Ujl7pujPljM07PmU8b9QHjJJB7xrrkthG+S19w9cLoDZl2bPOSz2SZFDYX/B",
          "01mynDoMjRby1KAg0zKHwYAffmSBWV9578P0hkuITytZNg3CvtrDW6hgp8wa02Rf",
          "SyLBgwKBgQCl73rjxN9B55tdKdQUkXSAaYYebYzuDOa9vRcTOW5nbWf21ehUUKlU",
          "w/F6uHl5okTfASEGn8BFQwBnA/npUbbKzz2wIAiPnjC96RIzU7G5fJFjWRMURQi/",
          "Ibbd1wXGedfy4A7+S+Swn2B2fwuBUL0BUkUrqYPvK5X8IZUnM/30RQ==",
          "-----END RSA PRIVATE KEY-----",
        ].join("\n");
      options.algorithm = options.algorithm || "RS256";
      options.boundary = options.boundary || "-------------" + Math.floor(Math.random() * 0xffffffff);
      options.attachmentInfo = options.attachmentInfo || {};
      options.attachmentInfo.usageType =
        options.attachmentInfo.usageType || "http://adlnet.gov/expapi/attachments/signature";
      options.attachmentInfo.contentType = options.attachmentInfo.contentType || "application/octet-stream";
      options.breakJson = options.breakJson || false;

      delete statement.attachments;

      var signature = context.jws.sign({
        header: { alg: options.algorithm },
        payload: options.breakJson ? JSON.stringify(statement).replace('"', "'") : statement,
        privateKey: options.privateKey,
      });
      var signatureBuffer = Buffer.from(signature);

      statement.attachments = [
        {
          usageType: options.attachmentInfo.usageType,
          display: { "en-US": "Signed by the Test Suite" },
          description: { "en-US": "Signed by the Test Suite" },
          contentType: options.attachmentInfo.contentType,
          length: signatureBuffer.byteLength,
          sha2: context.crypto.createHash("SHA256").update(signatureBuffer).digest("hex"),
        },
      ];
      var attachment = statement.attachments[0];
      if (!attachment) {
        throw new Error("Signed statement attachment generation failed.");
      }

      var buffers = [];
      buffers.push(Buffer.from(["", "--" + options.boundary, "Content-Type:application/json", "", ""].join("\r\n")));
      buffers.push(Buffer.from(JSON.stringify(statement), "utf8"));
      buffers.push(
        Buffer.from(
          [
            "",
            "--" + options.boundary,
            "Content-Type:" + attachment.contentType,
            "Content-Transfer-Encoding:binary",
            "X-Experience-API-Hash:" + attachment.sha2,
            "",
            "",
          ].join("\r\n"),
        ),
      );
      buffers.push(signatureBuffer);
      buffers.push(Buffer.from("\r\n--" + options.boundary + "--"));

      return Buffer.concat(
        buffers,
        buffers.reduce(function (size, buffer) {
          return size + buffer.byteLength;
        }, 0),
      );
    },

    verifyStatement: function verifyStatement(_statement: unknown) {
      var publicKey = [
        "-----BEGIN PUBLIC KEY-----",
        "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvZtrkWAFrUYi8zekTKhe",
        "DM7tvfNIB7FVbLtkPArlFMQE1kOe8sBEvENiMKvI8kv1jLuzbd/iSWd1Wqt81ooD",
        "AMwcv54b26w0qyk58vKv+ZgNzvUZXtpFS3euLcOVPZUyc7O4gMLtDNblNehplFMN",
        "UFvd8Yc2jKOi9/URyIHOVzJwhKU063CY6S8MEbTjHdhcYa3TpeFFtL8YKoCxR2h4",
        "OCtbMe0ub2tOIwZ4jKNhQQ1/N6SJVV4gNmq6WVLfRtLDop72r5o8UZyPBwN9S3Cx",
        "GBPMI2dBFC7waQwQ8zyvL6Kp2ZuAQ2clHQzGTsDpREGNqzXDdgkUN0bOGJn/JRgU",
        "3QIDAQAB",
        "-----END PUBLIC KEY-----",
      ].join("\n");
      void publicKey;
    },
  };
}

module.exports = {
  createHelperFixtureCryptoSupport: createHelperFixtureCryptoSupport,
};
