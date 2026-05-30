/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xapi-lrs-conformance-requirements
 */

import { expect } from "chai";
import helperImport from "../helper.ts";
import requestBase from "super-request";
import templatingSelectionImport from "../templatingSelection.ts";

const helper: any = helperImport;
const templatingSelection: any = templatingSelectionImport;
let request: any = requestBase;

if (process.env["OAUTH1_ENABLED"] === "true") request = helper.OAuthRequest(request);

describe("Statement Lifecycle Requirements (Data 2.3)", () => {
  /**  Matchup with Conformance Requirements Document
   * XAPI-00016 - below
   * XAPI-00017 - in voiding.js
   * XAPI-00018 - below
   * XAPI-00019 - in voiding.js
   * XAPI-00020 - in voiding.js
   */

  templatingSelection.createTemplate("voiding.ts");

  /**  XAPI-00018, Data 2.3.2 Voiding
   * An LRS MUST consider a Statement it contains voided if the Statement is not itself a voiding Statement and the LRS also contains a voiding Statement referring to the first Statement.
   * Test: Void a statement and then send a GET for that statement which uses “statementId” instead of “voidedStatementId.” The statement should then not be returned in the GET request, which should return a 404.
   */
  describe("A Voided Statement is defined as a Statement that is not a Voiding Statement and is the Target of a Voiding Statement within the LRS (Data 2.3.2.s2.b3, XAPI-00018)", function () {
    const voidedId = helper.generateUUID();
    let stmtTime: number;

    before("Persist voided statement", function (done) {
      const templates = [{ statement: "{{statements.default}}" }];
      let voided = helper.createFromTemplate(templates);
      voided = voided.statement;
      voided.id = voidedId;

      request(helper.getEndpointAndAuth())
        .post(helper.getEndpointStatements())
        .headers(helper.addAllHeaders({}))
        .json(voided)
        .expect(200, done);
    });

    before("Persist voiding statement", function (done) {
      const templates = [{ statement: "{{statements.voiding}}" }];
      let voiding = helper.createFromTemplate(templates);
      voiding = voiding.statement;
      voiding.object.id = voidedId;
      stmtTime = Date.now();

      request(helper.getEndpointAndAuth())
        .post(helper.getEndpointStatements())
        .headers(helper.addAllHeaders({}))
        .json(voiding)
        .expect(200, done);
    });

    it('Should return a voided statement when using GET "voidedStatementId"', function (done) {
      const context = this;
      context.timeout(0);
      const query = helper.getUrlEncoding({ voidedStatementId: voidedId });
      request(helper.getEndpointAndAuth())
        .get(helper.getEndpointStatements() + "?" + query)
        .wait(helper.genDelay(stmtTime, "?" + query, voidedId))
        .headers(helper.addAllHeaders({}))
        .expect(200)
        .end(function (err: unknown, res: any) {
          if (err) {
            done(err);
            return;
          }

          const statement = helper.parse(res.body, done);
          expect(statement.id).to.equal(voidedId);
          done();
        });
    });

    it('Should return 404 when using GET with "statementId"', function (done) {
      const context = this;
      context.timeout(0);
      const query = helper.getUrlEncoding({ statementId: voidedId });
      request(helper.getEndpointAndAuth())
        .get(helper.getEndpointStatements() + "?" + query)
        .wait(helper.genDelay(stmtTime, "?" + query, voidedId))
        .headers(helper.addAllHeaders({}))
        .expect(404, done);
    });
  });

  /**  XAPI-00016, Data 2.3.2 Voiding
   * A Voiding Statement cannot Target another Voiding Statement.
   * LRS behavior this new VOIDING statement MAY be rejected.
   * If the LRS accepts that statement, the violating VOIDING statement SHOULD be ignored.
   * Adjust this test accordingly
   */
  describe("A Voiding Statement cannot Target another Voiding Statement (Data 2.3.2.s2.b7, XAPI-00016)", function () {
    let voidedId: string;
    let voidingId: string;

    before("Persist voided statement", function (done) {
      const templates = [{ statement: "{{statements.default}}" }];
      let data = helper.createFromTemplate(templates);
      data = data.statement;

      request(helper.getEndpointAndAuth())
        .post(helper.getEndpointStatements())
        .headers(helper.addAllHeaders({}))
        .json(data)
        .expect(200)
        .end(function (err: unknown, res: any) {
          if (err) {
            done(err);
            return;
          }

          voidedId = res.body[0];
          done();
        });
    });

    before("Persist voiding statement", function (done) {
      const templates = [{ statement: "{{statements.voiding}}" }];
      let data = helper.createFromTemplate(templates);
      data = data.statement;
      data.object.id = voidedId;

      request(helper.getEndpointAndAuth())
        .post(helper.getEndpointStatements())
        .headers(helper.addAllHeaders({}))
        .json(data)
        .expect(200)
        .end(function (err: unknown, res: any) {
          if (err) {
            done(err);
            return;
          }

          voidingId = res.body[0];
          done();
        });
    });

    it("Should not void an already voided statement", function (done) {
      const context = this;
      context.timeout(0);
      const templates = [{ statement: "{{statements.object_statementref}}" }, { verb: "{{verbs.voided}}" }];
      let data = helper.createFromTemplate(templates);
      data = data.statement;
      data.object.id = voidedId;
      const stmtTime = Date.now();

      request(helper.getEndpointAndAuth())
        .post(helper.getEndpointStatements())
        .headers(helper.addAllHeaders({}))
        .json(data)
        .end(function (err: unknown) {
          if (err) {
            done(err);
            return;
          }

          const query = "?voidedStatementId=" + voidedId;
          request(helper.getEndpointAndAuth())
            .get(helper.getEndpointStatements())
            .wait(helper.genDelay(stmtTime, query, voidedId))
            .headers(helper.addAllHeaders({}))
            .expect(200, done);
        });
    });

    it("Should not void a voiding statement", function (done) {
      const context = this;
      context.timeout(0);
      const templates = [{ statement: "{{statements.object_statementref}}" }, { verb: "{{verbs.voided}}" }];
      let data = helper.createFromTemplate(templates);
      data = data.statement;
      data.object.id = voidingId;
      const stmtTime = Date.now();
      request(helper.getEndpointAndAuth())
        .post(helper.getEndpointStatements())
        .headers(helper.addAllHeaders({}))
        .json(data)
        .end(function (err: unknown) {
          if (err) {
            done(err);
            return;
          }

          const query = "?statementId=" + voidingId;
          request(helper.getEndpointAndAuth())
            .get(helper.getEndpointStatements() + query)
            .headers(helper.addAllHeaders({}))
            .wait(helper.genDelay(stmtTime, query, voidingId))
            .expect(200, done);
        });
    });
  });

  /**  4.2.4.1 LRS Rejection Cases
   * Update for 2.0
   *
   * Never reject a stateemnt for using the voided verb.
   */
  describe("An LRS SHALL NOT reject a voided statement because it cannot find the ID of the Object of that statement, nor does the LRS have to try to find it. (4.2.4.1 LRS Rejection Cases, XAPI-00016)", function () {
    const nonExistentStatementID = helper.generateUUID();

    it("Shall not reject a voided statement.", function (done) {
      const context = this;
      context.timeout(0);
      const templates = [{ statement: "{{statements.object_statementref}}" }, { verb: "{{verbs.voided}}" }];

      let data = helper.createFromTemplate(templates);

      data = data.statement;
      data.object.id = nonExistentStatementID;

      request(helper.getEndpointAndAuth())
        .post(helper.getEndpointStatements())
        .headers(helper.addAllHeaders({}))
        .json(data)
        .expect(200)
        .end(function (err: unknown) {
          if (err) {
            done(err);
            return;
          }

          done();
        });
    });
  });
});
