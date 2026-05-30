/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xapi-lrs-conformance-requirements
 */

import { expect } from "chai";
import helperImport from "../helper.ts";
import requestBase from "../super-request.ts";
import { expectAsync, endAsync } from "../super-request.ts";
import * as liburl from "url";

const helper: any = helperImport;
let request: any = requestBase;

if (process.env["OAUTH1_ENABLED"] === "true") request = helper.OAuthRequest(request);

function isValidRelativeUrl(value: unknown): boolean {
  if (typeof value !== "string" || value.length === 0) {
    return false;
  }

  try {
    new URL(value, "http://example.com");
    return true;
  } catch {
    return false;
  }
}

describe("Retrieval of Statements (Data 2.5)", function () {
  /**  Matchup with Conformance Requirements Document
   * XAPI-00108 - below
   * XAPI-00109 - below
   * XAPI-00110 - below
   * XAPI-00111 - below
   * XAPI-00112 - duplicate of XAPI-00149 Communication 2.1.3 Statements GET
   * XAPI-00113 - below
   * XAPI-00114 - below
   */

  /**  XAPI-00113, Data 2.5 Retrieval of Statements
   * An LRS's Statement API, upon processing a successful GET request, will return a single "statements" property and a single "more" property. A single "more" property must be present if there are additional results available.
   */
  describe('An LRS\'s Statement API, upon processing a successful GET request, will return a single "statements" property and a single "more" property. (Data 2.5.s2.table1, XAPI-00113)', function () {
    before("guarantee two statements in LRS", async function () {
      let template = [{ statement: "{{statements.default}}" }],
        s1 = helper.createFromTemplate(template).statement,
        s2 = helper.createFromTemplate(template).statement,
        stmts = [s1, s2];
      await expectAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(stmts),
        200,
      );
    });

    it("will return single statements property and may return", async function () {
      this.timeout(0);
      let query = "?limit=1";
      let stmtTime = Date.now();
      const res = await expectAsync(
        request(helper.getEndpointAndAuth())
          .get(helper.getEndpointStatements() + query)
          .wait(helper.genDelay(stmtTime, query, undefined))
          .headers(helper.addAllHeaders({})),
        200,
      );

      let result = helper.parse(res.body);
      expect(result).to.have.property("statements");
      expect(result).to.have.property("more");
    });
  });

  /**  XAPI-00110, Data 2.5 Retrieval of Statements
   * A "statements" property is an Array of Statements. Make a GET request which will return at least one statement and confirm the “statements” property is a valid Array of Statements.
   */
  describe('A "statements" property is an Array of Statements (Type, Data 2.5.s2.table1.row1, XAPI-00110)', function () {
    let statement: any;
    let substatement: any;
    let stmtTime: number;
    this.timeout(0);

    before("persist statement", async function () {
      let templates = [
        { statement: "{{statements.context}}" },
        { context: "{{contexts.category}}" },
        {
          instructor: {
            objectType: "Agent",
            name: "xAPI mbox",
            mbox: "mailto:pri@adlnet.gov",
          },
        },
      ];
      let data = helper.createFromTemplate(templates);
      statement = data.statement;

      //randomize data to prevent old results from breaking assertion logic
      statement.context.contextActivities.category.id += helper.generateUUID();
      statement.verb.id += helper.generateUUID();
      statement.actor.mbox = "mailto:" + helper.generateUUID() + "@adlnet.gov";
      statement.context.registration = helper.generateUUID();
      statement.context.instructor.mbox = "mailto:" + helper.generateUUID() + "@adlnet.gov";
      statement.object.id += helper.generateUUID();

      statement.context.contextActivities.category.id = "http://www.example.com/test/array/statements/pri";

      await expectAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(statement),
        200,
      );
    });

    before("persist substatement", async function () {
      let templates = [
        { statement: "{{statements.object_substatement}}" },
        { object: "{{substatements.context}}" },
        { context: "{{contexts.category}}" },
        {
          instructor: {
            objectType: "Agent",
            name: "xAPI mbox",
            mbox: "mailto:sub@adlnet.gov",
          },
        },
      ];
      let data = helper.createFromTemplate(templates);
      substatement = data.statement;

      //randomize data to prevent old results from breaking assertion logic
      substatement.verb.id += helper.generateUUID();
      substatement.actor.mbox = "mailto:" + helper.generateUUID() + "@adlnet.gov";

      substatement.object.verb.id += helper.generateUUID();
      substatement.object.actor.mbox = "mailto:" + helper.generateUUID() + "@adlnet.gov";
      substatement.object.object.id += helper.generateUUID();

      substatement.object.context.contextActivities.category.id = "http://www.example.com/test/array/statements/sub";
      stmtTime = Date.now();
      await expectAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(substatement),
        200,
      );
    });

    it('should return StatementResult with statements as array using GET without "statementId" or "voidedStatementId"', async function () {
      const res = await expectAsync(
        request(helper.getEndpointAndAuth())
          .get(helper.getEndpointStatements())
          .wait(helper.genDelay(stmtTime, undefined, undefined))
          .headers(helper.addAllHeaders({})),
        200,
      );

      let result = helper.parse(res.body);
      expect(result).to.have.property("statements").to.be.an("array");
    });
  });

  /**  XAPI-00114, Data 2.5 Retrieval of Statements
   * A "statements" property result which is paginated will create a container for each additional page.
   */
  it('A "statements" property which is too large for a single page will create a container for each additional page (Data 2.5.s2.table1.row1, XAPI-00114)', async function () {
    this.timeout(0);
    let statementTemplates = [{ statement: "{{statements.default}}" }];

    let statement1 = helper.createFromTemplate(statementTemplates);
    statement1 = statement1.statement;

    let statement2 = helper.createFromTemplate(statementTemplates);
    statement2 = statement2.statement;

    let query = helper.getUrlEncoding({ limit: 1 });
    let stmtTime = Date.now();

    await endAsync(
      request(helper.getEndpointAndAuth())
        .post(helper.getEndpointStatements())
        .headers(helper.addAllHeaders({}))
        .json([statement1, statement2])
        .expect(200),
    );

    const res = await endAsync(
      request(helper.getEndpointAndAuth())
        .get(helper.getEndpointStatements() + "?" + query)
        .wait(helper.genDelay(stmtTime, "?" + query, null))
        .headers(helper.addAllHeaders({}))
        .expect(200),
    );

    let results = helper.parse(res.body);
    expect(results.statements).to.exist;
    expect(results.more).to.exist;
  });

  /**  XAPI-00109, Data 2.5 Retrieval of Statements
   * The "more" property is absent or an empty string (no whitespace) if the entire results of the original GET request have been returned. To test make a GET request which will return a known number of statements and check to make sure the LRS either returns an empty string or the more property is absent.
   */
  describe('The "more" property is absent or an empty string (no whitespace) if the entire results of the original GET request have been returned. (Data 2.5.s2.table1.row2, XAPI-00109)', function () {
    it('should return empty "more" property or no "more" property when all statements returned', async function () {
      let query = helper.getUrlEncoding({ verb: "http://adlnet.gov/expapi/non/existent/344588672021038" });
      const res = await expectAsync(
        request(helper.getEndpointAndAuth())
          .get(helper.getEndpointStatements() + "?" + query)
          .headers(helper.addAllHeaders({})),
        200,
      );

      let result = helper.parse(res.body);
      let passed = false;

      if (result.more === "" || !result.more) passed = true;

      expect(passed).to.be.true;
    });
  });

  /**  XAPI-00108, Data 2.5 Retrieval of Statements
   * If not empty, the "more" property's IRL refers to a specific container object corresponding to the next page of results from the original GET request. To test make a GET request which will return a known number of statements and confirm the LRS returns a “more” property which has an IRL with a container of the remaining statements and that the IRL is valid.
   */
  describe('If not empty, the "more" property\'s IRL refers to a specific container object corresponding to the next page of results from the orignal GET request (Data 2.5.s2.table1.row2, XAPI-00108)', function () {
    it('should return "more" which refers to next page of results', async function () {
      const res = await endAsync(
        request(helper.getEndpointAndAuth())
          .get(helper.getEndpointStatements() + "?limit=1")
          .headers(helper.addAllHeaders({}))
          .expect(200),
      );

      let result = helper.parse(res.body);
      expect(result).to.have.property("more");
      expect(isValidRelativeUrl(result.more)).to.be.true;
      const res2 = await endAsync(
        request("").get(liburl.resolve(res.request.href, result.more)).headers(helper.addAllHeaders({})).expect(200),
      );

      let results2 = helper.parse(res2.body);
      expect(results2.statements).to.exist;
      expect(results2.more).to.exist;
    });
  });

  /**  XAPI-00111, Data 2.5 Retrieval of Statements
   * A "more" property's referenced container object follows the same rules as the original GET request, originating with a single "statements" property and a single "more" property.
   */
  it('A "more" property\'s referenced container object follows the same rules as the original GET request, originating with a single "statements" property and a single "more" property (Data 2.5.s2.table1.row2, XAPI-00111)', async function () {
    this.timeout(0);
    let verbTemplate = "http://adlnet.gov/expapi/test/more/target/";
    let id1 = helper.generateUUID();
    let id2 = helper.generateUUID();
    let statementTemplates = [{ statement: "{{statements.default}}" }];

    let statement1 = helper.createFromTemplate(statementTemplates);
    statement1 = statement1.statement;
    statement1.verb.id = verbTemplate + "one";
    statement1.id = id1;

    let statement2 = helper.createFromTemplate(statementTemplates);
    statement2 = statement2.statement;
    statement2.verb.id = verbTemplate + "two";
    statement2.id = id2;
    let query = helper.getUrlEncoding({ limit: 1 });
    let stmtTime = Date.now();

    await endAsync(
      request(helper.getEndpointAndAuth())
        .post(helper.getEndpointStatements())
        .headers(helper.addAllHeaders({}))
        .json([statement1, statement2])
        .expect(200),
    );

    const res = await endAsync(
      request(helper.getEndpointAndAuth())
        .get(helper.getEndpointStatements() + "?" + query)
        .wait(helper.genDelay(stmtTime, "?" + query, id2))
        .headers(helper.addAllHeaders({}))
        .expect(200),
    );

    let results = helper.parse(res.body);
    const res2 = await endAsync(
      request("").get(liburl.resolve(res.request.href, results.more)).headers(helper.addAllHeaders({})).expect(200),
    );

    let results2 = helper.parse(res2.body);
    expect(results2.statements).to.exist;
  });
});
