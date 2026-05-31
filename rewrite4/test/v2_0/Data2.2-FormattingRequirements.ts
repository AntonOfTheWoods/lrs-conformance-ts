/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xapi-lrs-conformance-requirements
 */

import { beforeAll, describe, expect, it } from "../bun-test.ts";
import helperImport from "../helper.ts";
import requestBase, { expectAsync, endAsync, type RequestFactory } from "../super-request.ts";
import templatingSelectionImport from "../templatingSelection.ts";

type FormattingHelper = {
  OAuthRequest(request: RequestFactory): RequestFactory;
  addAllHeaders(headers?: Record<string, string | undefined>): Record<string, string | undefined>;
  createFromTemplate(templates: Array<Record<string, unknown>>): { statement: any };
  genDelay(stmtTime: number, query?: string, statementId?: string | null): Promise<unknown>;
  generateUUID(): string;
  getEndpointAndAuth(): string;
  getEndpointStatements(): string;
  getUrlEncoding(object: Record<string, unknown>): string;
  parse(input: unknown): any;
  setTimeMargin(done: (error?: unknown) => void): void;
};

type FormattingTemplatingSelection = {
  createTemplate(name: string): void;
};

const helper = helperImport as unknown as FormattingHelper;
const templatingSelection = templatingSelectionImport as unknown as FormattingTemplatingSelection;
let request: RequestFactory = requestBase;

if (process.env["OAUTH1_ENABLED"] === "true") {
  request = helper.OAuthRequest(request) as unknown as RequestFactory;
}

beforeAll(async function () {
  console.log("Setting up\nAccounting for time differential between test suite and lrs");
  await new Promise<void>((resolve, reject) => {
    helper.setTimeMargin((err: unknown) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
});

describe("Formatting Requirements (Data 2.2)", () => {
  /**  Matchup with Conformance Requirements Document
   * XAPI-00001 - in formatting.js
   * XAPI-00002 - below
   * XAPI-00003 - in formatting.js
   * XAPI-00004 - in formatting.js
   * XAPI-00005 - in formatting.js
   * XAPI-00006 - in formatting.js
   * XAPI-00007 - in formatting.js
   * XAPI-00008 - in formatting.js
   * XAPI-00009 - in formatting.js
   * XAPI-00010 - in formatting.js
   * XAPI-00011 - below
   * XAPI-00012 - below
   * XAPI-00013 - in formatting.js
   * XAPI-00014 - below and in verify.js
   * XAPI-00015 - in Communication 1.4 - should stay in Comm 1.4 Encoding
   */

  templatingSelection.createTemplate("formatting.ts");

  /**  XAPI-00002, Data 2.2 Formatting Requirements
   * An LRS stores 32-bit floating point numbers with at least the precision of IEEE 754
   */
  describe("An LRS stores 32-bit floating point numbers with at least the precision of IEEE 754 (Data 2.2.s4.b3, XAPI-00002)", function () {
    it("should pass and keep precision", async function () {
      const templates = [{ statement: "{{statements.result}}" }, { result: "{{results.default}}" }];
      const data = helper.createFromTemplate(templates).statement;
      const id = helper.generateUUID();
      const query = "?statementId=" + id;
      const min = 0.12123434;
      const raw = 12.125;
      const max = 45.45;
      const stmtTime = Date.now();

      data.id = id;
      data.result.score.min = min;
      data.result.score.raw = raw;
      data.result.score.max = max;
      data.result.score.scaled = min;

      await endAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(data)
          .expect(200),
      );

      const res = await endAsync(
        request(helper.getEndpointAndAuth())
          .get(helper.getEndpointStatements() + query)
          .wait(helper.genDelay(stmtTime, query, id))
          .headers(helper.addAllHeaders({}))
          .expect(200),
      );

      const score = helper.parse(res.body).result.score;
      expect(score.min).toEqual(min);
      expect(score.raw).toEqual(raw);
      expect(score.max).toEqual(max);
      expect(score.scaled).toEqual(min);
    });
  });

  /**  XAPI-00012
   * The LRS rejects with error code 400 Bad Request parameter values which do not validate to the same standards required for values of the same types in Statements.
   */
  describe("The LRS rejects with error code 400 Bad Request parameter values which do not validate to the same standards required for values of the same types in Statements (Data 2.2.s4.b4, XAPI-00012)", function () {
    it("should reject when statementId value is invalid", async function () {
      const query = helper.getUrlEncoding({ statementId: "wrong" });
      await request(helper.getEndpointAndAuth())
        .get(helper.getEndpointStatements() + "?" + query)
        .headers(helper.addAllHeaders({}))
        .expect(400);
    });

    it("should reject when statementId value is invalid", async function () {
      const query = helper.getUrlEncoding({ voidedStatementId: "wrong" });
      await request(helper.getEndpointAndAuth())
        .get(helper.getEndpointStatements() + "?" + query)
        .headers(helper.addAllHeaders({}))
        .expect(400);
    });

    it("should reject when statementId value is invalid", async function () {
      const query = helper.getUrlEncoding({ agent: "wrong" });
      await request(helper.getEndpointAndAuth())
        .get(helper.getEndpointStatements() + "?" + query)
        .headers(helper.addAllHeaders({}))
        .expect(400);
    });

    it("should reject when statementId value is invalid", async function () {
      const query = helper.getUrlEncoding({ verb: "not.a.valid.iri.com/verb" });
      await request(helper.getEndpointAndAuth())
        .get(helper.getEndpointStatements() + "?" + query)
        .headers(helper.addAllHeaders({}))
        .expect(400);
    });

    it("should reject when statementId value is invalid", async function () {
      const query = helper.getUrlEncoding({ activity: "not.a.valid.iri.com/activity" });
      await request(helper.getEndpointAndAuth())
        .get(helper.getEndpointStatements() + "?" + query)
        .headers(helper.addAllHeaders({}))
        .expect(400);
    });

    it("should reject when statementId value is invalid", async function () {
      const query = helper.getUrlEncoding({ registration: "wrong" });
      await request(helper.getEndpointAndAuth())
        .get(helper.getEndpointStatements() + "?" + query)
        .headers(helper.addAllHeaders({}))
        .expect(400);
    });
  });

  /**  XAPI-00014, Data 2.2 Formatting Requirements
   * All Objects are well-created JSON Objects (Nature of Binding)
   */
  describe("All Objects are well-created JSON Objects (Nature of binding, Data 2.1, XAPI-00014) **Implicit**", function () {
    templatingSelection.createTemplate("verify.ts");

    it("An LRS rejects a not well-created JSON Object", async function () {
      const malformedTemplates = [{ statement: "{{statements.default}}" }];
      const malformed = helper.createFromTemplate(malformedTemplates).statement;
      const string = '"objectType": "Agent"';
      malformed.actor.objectType = string;

      await expectAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(malformed),
        400,
      );
    });
  });

  /**  XAPI-00011, Data 2.2 Formatting Requirements
   * An LRS rejects with error code 400 Bad Request a Statement containing IRL or IRI values without a scheme.
   */
  describe("An LRS rejects with error code 400 Bad Request a Statement containing IRL or IRI values without a scheme. (Data 2.2.s4.b1.b8, XAPI-00011)", function () {
    // verb id
    it("should fail with bad verb id scheme", async function () {
      const templates = [
        {
          statement: "{{statements.default}}",
        },
      ];
      const data = helper.createFromTemplate(templates).statement;
      data.id = helper.generateUUID();
      data.verb.id = data.verb.id.replace("http://", ""); // remove the scheme portion of the IRI
      const headers = helper.addAllHeaders({});

      await request(helper.getEndpointAndAuth())
        .put(helper.getEndpointStatements() + "?statementId=" + data.id)
        .headers(headers)
        .json(data)
        .expect(400);
    });

    // openid
    it("should fail with bad verb openid scheme", async function () {
      const templates = [
        {
          statement: "{{statements.actor}}",
        },
      ];
      const data = helper.createFromTemplate(templates).statement;
      data.id = helper.generateUUID();
      data.actor.openid = "open.id.com/testUser";
      const headers = helper.addAllHeaders({});

      await request(helper.getEndpointAndAuth())
        .put(helper.getEndpointStatements() + "?statementId=" + data.id)
        .headers(headers)
        .json(data)
        .expect(400);
    });

    // account homePage
    it("should fail with bad account homePage", async function () {
      const templates = [
        {
          statement: "{{statements.actor}}",
        },
      ];
      const data = helper.createFromTemplate(templates).statement;
      data.id = helper.generateUUID();
      data.actor.account = { homePage: "homePage.com/testUser", name: "123456" };
      const headers = helper.addAllHeaders({});

      await request(helper.getEndpointAndAuth())
        .put(helper.getEndpointStatements() + "?statementId=" + data.id)
        .headers(headers)
        .json(data)
        .expect(400);
    });

    // object id
    it("should fail with bad object id", async function () {
      const templates = [
        {
          statement: "{{statements.default}}",
        },
      ];
      const data = helper.createFromTemplate(templates).statement;
      data.id = helper.generateUUID();
      data.object.id = data.object.id.replace("http://", ""); // remove the scheme portion of the IRI
      const headers = helper.addAllHeaders({});

      await request(helper.getEndpointAndAuth())
        .put(helper.getEndpointStatements() + "?statementId=" + data.id)
        .headers(headers)
        .json(data)
        .expect(400);
    });

    // object type
    it("should fail with bad object type", async function () {
      const templates = [
        {
          statement: "{{statements.default}}",
        },
        {
          object: "{{activities.default}}",
        },
      ];
      const data = helper.createFromTemplate(templates).statement;
      data.id = helper.generateUUID();
      data.object.definition.type = data.object.definition.type.replace("http://", ""); // remove the scheme portion of the IRI
      const headers = helper.addAllHeaders({});

      await request(helper.getEndpointAndAuth())
        .put(helper.getEndpointStatements() + "?statementId=" + data.id)
        .headers(headers)
        .json(data)
        .expect(400);
    });

    // object moreInfo
    it("should fail with bad object moreInfo", async function () {
      const templates = [
        {
          statement: "{{statements.default}}",
        },
        {
          object: "{{activities.default}}",
        },
      ];
      const data = helper.createFromTemplate(templates).statement;
      data.id = helper.generateUUID();
      data.object.definition.moreInfo = data.object.definition.moreInfo.replace("http://", ""); // remove the scheme portion of the IRI
      const headers = helper.addAllHeaders({});

      await request(helper.getEndpointAndAuth())
        .put(helper.getEndpointStatements() + "?statementId=" + data.id)
        .headers(headers)
        .json(data)
        .expect(400);
    });

    // attachment usageType
    it("should fail with attachment bad usageType", async function () {
      const templates = [
        {
          statement: "{{statements.attachment}}",
        },
        {
          attachments: [
            {
              usageType: "http://example.com/attachment-usage/test",
              display: { "en-US": "A test attachment" },
              description: { "en-US": "A test attachment (description)" },
              contentType: "text/plain; charset=ascii",
              length: 27,
              sha2: "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
              fileUrl: "http://over.there.com/file.txt",
            },
          ],
        },
      ];
      const data = helper.createFromTemplate(templates).statement;
      data.id = helper.generateUUID();
      data.attachments[0].usageType = data.attachments[0].usageType.replace("http://", ""); // remove the scheme portion of the IRI
      const headers = helper.addAllHeaders({});

      await request(helper.getEndpointAndAuth())
        .put(helper.getEndpointStatements() + "?statementId=" + data.id)
        .headers(headers)
        .json(data)
        .expect(400);
    });

    // attachment fileUrl
    it("should fail with bad attachment fileUrl", async function () {
      const templates = [
        {
          statement: "{{statements.attachment}}",
        },
        {
          attachments: [
            {
              usageType: "http://example.com/attachment-usage/test",
              display: { "en-US": "A test attachment" },
              description: { "en-US": "A test attachment (description)" },
              contentType: "text/plain; charset=ascii",
              length: 27,
              sha2: "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
              fileUrl: "http://over.there.com/file.txt",
            },
          ],
        },
      ];
      const data = helper.createFromTemplate(templates).statement;
      data.id = helper.generateUUID();
      data.attachments[0].fileUrl = data.attachments[0].fileUrl.replace("http://", ""); // remove the scheme portion of the IRI
      const headers = helper.addAllHeaders({});

      await request(helper.getEndpointAndAuth())
        .put(helper.getEndpointStatements() + "?statementId=" + data.id)
        .headers(headers)
        .json(data)
        .expect(400);
    });

    // object definition extension
    it("should fail with bad object definition extension", async function () {
      const templates = [
        {
          statement: "{{statements.default}}",
        },
        {
          object: "{{activities.default}}",
        },
      ];
      const data = helper.createFromTemplate(templates).statement;
      data.id = helper.generateUUID();
      data.object.definition.extensions = { "not.valid.com/extension": 1234 };
      const headers = helper.addAllHeaders({});

      await request(helper.getEndpointAndAuth())
        .put(helper.getEndpointStatements() + "?statementId=" + data.id)
        .headers(headers)
        .json(data)
        .expect(400);
    });

    // context extension
    it("should fail with bad context extension", async function () {
      const templates = [
        {
          statement: "{{statements.default}}",
        },
        {
          context: "{{contexts.default}}",
        },
      ];
      const data = helper.createFromTemplate(templates).statement;
      data.id = helper.generateUUID();
      data.context.extensions["example.com/extension/wrong"] = 1234;
      const headers = helper.addAllHeaders({});

      await request(helper.getEndpointAndAuth())
        .put(helper.getEndpointStatements() + "?statementId=" + data.id)
        .headers(headers)
        .json(data)
        .expect(400);
    });

    // result extension
    it("should fail with bad result extension", async function () {
      const templates = [
        {
          statement: "{{statements.default}}",
        },
        {
          result: "{{results.default}}",
        },
      ];
      const data = helper.createFromTemplate(templates).statement;
      data.id = helper.generateUUID();
      data.result.extensions["example.com/extension/wrong"] = 1234;
      const headers = helper.addAllHeaders({});

      await request(helper.getEndpointAndAuth())
        .put(helper.getEndpointStatements() + "?statementId=" + data.id)
        .headers(headers)
        .json(data)
        .expect(400);
    });
  });
});
