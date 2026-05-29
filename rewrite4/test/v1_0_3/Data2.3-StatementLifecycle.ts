/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xapi-lrs-conformance-requirements
 */

import __esmDep1 from "fs";
import __esmDep2 from "extend";
import __esmDep3 from "moment";
import __esmDep4 from "super-request";
import __esmDep5 from "supertest-as-promised";
import __esmDep6 from "chai";
import __esmDep7 from "url";
import __esmDep8 from "joi";
import __esmDep9 from "./../helper.ts";
import __esmDep10 from "./../multipartParser.ts";
import __esmDep11 from "./../redirect.ts";
import __esmDep12 from "./../templatingSelection.ts";

(function (
  module: any,
  fs: any,
  extend: any,
  moment: any,
  request: any,
  requestPromise: any,
  chai: any,
  liburl: any,
  Joi: any,
  helper: any,
  multipartParser: any,
  redirect: any,
  templatingSelection: any,
) {
  // "use strict";

  var expect = chai.expect;
  if (global.OAUTH) request = helper.OAuthRequest(request);

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
      var voidedId = helper.generateUUID();
      var stmtTime;

      before("persist voided statement", function (done) {
        var templates = [{ statement: "{{statements.default}}" }];
        var voided = helper.createFromTemplate(templates);
        voided = voided.statement;
        voided.id = voidedId;

        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(voided)
          .expect(200, done);
      });

      before("persist voiding statement", function (done) {
        var templates = [{ statement: "{{statements.voiding}}" }];
        var voiding = helper.createFromTemplate(templates);
        voiding = voiding.statement;
        voiding.object.id = voidedId;
        stmtTime = Date.now();

        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(voiding)
          .expect(200, done);
      });

      it('should return a voided statement when using GET "voidedStatementId"', function (done) {
        this.timeout(0);
        var query = helper.getUrlEncoding({ voidedStatementId: voidedId });
        request(helper.getEndpointAndAuth())
          .get(helper.getEndpointStatements() + "?" + query)
          .wait(helper.genDelay(stmtTime, "?" + query, voidedId))
          .headers(helper.addAllHeaders({}))
          .expect(200)
          .end(function (err, res) {
            if (err) {
              done(err);
            } else {
              var statement = helper.parse(res.body, done);
              expect(statement.id).to.equal(voidedId);
              done();
            }
          });
      });

      it('should return 404 when using GET with "statementId"', function (done) {
        this.timeout(0);
        var query = helper.getUrlEncoding({ statementId: voidedId });
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
      var voidedId, voidingId;

      before("persist voided statement", function (done) {
        var templates = [{ statement: "{{statements.default}}" }];
        var data = helper.createFromTemplate(templates);
        data = data.statement;

        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(data)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              done(err);
            } else {
              voidedId = res.body[0];
              done();
            }
          });
      });

      before("persist voiding statement", function (done) {
        var templates = [{ statement: "{{statements.voiding}}" }];
        var data = helper.createFromTemplate(templates);
        data = data.statement;
        data.object.id = voidedId;

        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(data)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              done(err);
            } else {
              voidingId = res.body[0];
              done();
            }
          });
      });

      it("should not void an already voided statement", function (done) {
        this.timeout(0);
        var templates = [{ statement: "{{statements.object_statementref}}" }, { verb: "{{verbs.voided}}" }];
        var data = helper.createFromTemplate(templates);
        data = data.statement;
        data.object.id = voidedId;
        var stmtTime = Date.now();

        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(data)
          .end(function (err, res) {
            if (err) {
              done(err);
            } else {
              var query = "?voidedStatementId=" + voidedId;
              request(helper.getEndpointAndAuth())
                .get(helper.getEndpointStatements())
                .wait(helper.genDelay(stmtTime, query, voidedId))
                .headers(helper.addAllHeaders({}))
                .expect(200, done);
            }
          });
      });

      it("should not void a voiding statement", function (done) {
        this.timeout(0);
        var templates = [{ statement: "{{statements.object_statementref}}" }, { verb: "{{verbs.voided}}" }];
        var data = helper.createFromTemplate(templates);
        data = data.statement;
        data.object.id = voidingId;
        var stmtTime = Date.now();
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(data)
          .end(function (err, res) {
            if (err) {
              done(err);
            } else {
              var query = "?statementId=" + voidingId;
              request(helper.getEndpointAndAuth())
                .get(helper.getEndpointStatements() + query)
                .headers(helper.addAllHeaders({}))
                .wait(helper.genDelay(stmtTime, query, voidingId))
                .expect(200, done);
            }
          });
      });
    });
  });
})(
  undefined,
  __esmDep1,
  __esmDep2,
  __esmDep3,
  __esmDep4,
  __esmDep5,
  __esmDep6,
  __esmDep7,
  __esmDep8,
  __esmDep9,
  __esmDep10,
  __esmDep11,
  __esmDep12,
);
