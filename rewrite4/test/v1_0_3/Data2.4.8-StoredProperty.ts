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
) {
  // "use strict";

  var expect = chai.expect;
  if (global.OAUTH) request = helper.OAuthRequest(request);

  describe("Stored Property Requirements (Data 2.4.8)", () => {
    var param: any;

    /**  Matchup with Conformance Requirements Document
     * XAPI-00097 - below
     *
     * Note XAPI-00023 - below
     */

    /**  XAPI-00097, Data 2.4.8 Stored
     * An LRS MUST assign the "stored" property timestamp upon receiving a statement.
     */
    describe("An LRS MUST accept statements with the stored property (Data 2.4.8.s3.b2, XAPI-00097)", function () {
      this.timeout(0);
      var storedTime = new Date("July 15, 2011").toISOString();
      var template = [{ statement: "{{statements.default}}" }, { stored: storedTime }];
      var data = helper.createFromTemplate(template).statement;
      var postId, putId;

      it("using POST", function (done) {
        var stmtTime = Date.now();
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders())
          .json(data)
          .expect(200)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              postId = res.body[0];
              var query = "?statementId=" + postId;

              request(helper.getEndpointAndAuth())
                .get(helper.getEndpointStatements() + query)
                .wait(helper.genDelay(stmtTime, query, postId))
                .headers(helper.addAllHeaders())
                .expect(200)
                .end((err, res) => {
                  if (err) {
                    done(err);
                  } else {
                    var result = helper.parse(res.body);
                    expect(result).to.have.property("stored");
                    var stmtStored = result.stored;
                    expect(stmtStored).to.not.eql(storedTime);
                    done();
                  }
                });
            }
          });
      });

      it("using PUT", function (done) {
        putId = helper.generateUUID();
        param = "?statementId=" + putId;
        var stmtTime = Date.now();

        request(helper.getEndpointAndAuth())
          .put(helper.getEndpointStatements() + param)
          .headers(helper.addAllHeaders())
          .json(data)
          .expect(204)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              request(helper.getEndpointAndAuth())
                .get(helper.getEndpointStatements() + param)
                .wait(helper.genDelay(stmtTime, param, putId))
                .headers(helper.addAllHeaders())
                .expect(200)
                .end((err, res) => {
                  if (err) {
                    done(err);
                  } else {
                    var result = helper.parse(res.body);
                    expect(result).to.have.property("stored");
                    var stmtStored = result.stored;
                    expect(stmtStored).to.not.eql(storedTime);
                    done();
                  }
                });
            }
          });
      });
    });

    /**  XAPI-00023,  2.4 Statement Properties
     * A "stored" property is a TimeStamp, per section 4.5. An LRS assigns the “stored” property upon receipt with a valid TimeStamp.
     */
    describe("A stored property must be a TimeStamp (Data 2.4.8.s2, XAPI-00023)", function () {
      it("retrieve statements, test a stored property", (done) => {
        request(helper.getEndpointAndAuth())
          .get(helper.getEndpointStatements())
          .headers(helper.addAllHeaders())
          .expect(200)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              var result = helper.parse(res.body);
              var stmts = result.statements;
              var milliChecker = (num) => {
                expect(stmts[num]).to.have.property("stored");
                //formatted iso 8601
                var chkStored = moment(stmts[num].stored, moment.ISO_8601);
                expect(chkStored.isValid()).to.be.true;
                expect(isNaN(chkStored._pf.parsedDateParts[6])).to.be.false;
                //precision to milliseconds
                if (chkStored._pf.parsedDateParts[6] % 10 > 0) {
                  expect(chkStored._pf.parsedDateParts[6] % 10).to.be.above(0);
                  done();
                } else {
                  if (++num < stmts.length) {
                    milliChecker(num);
                  } else {
                    expect(chkStored._pf.parsedDateParts[6] % 10).to.be.above(0);
                    done();
                  }
                }
              };
              milliChecker(0);
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
);
