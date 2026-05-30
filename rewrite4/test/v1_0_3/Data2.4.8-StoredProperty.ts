/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xapi-lrs-conformance-requirements
 */

import { expect } from "chai";
import helperImport from "../helper.ts";
import moment from "moment";
import requestBase from "super-request";

const helper: any = helperImport;
let request: any = requestBase;

// "use strict";

if (global.OAUTH) request = helper.OAuthRequest(request);

describe("Stored Property Requirements (Data 2.4.8)", () => {
  let param: any;

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
    let storedTime = new Date("July 15, 2011").toISOString();
    let template = [{ statement: "{{statements.default}}" }, { stored: storedTime }];
    let data = helper.createFromTemplate(template).statement;
    let postId: string;
    let putId: string;

    it("using POST", function (done) {
      let stmtTime = Date.now();
      request(helper.getEndpointAndAuth())
        .post(helper.getEndpointStatements())
        .headers(helper.addAllHeaders())
        .json(data)
        .expect(200)
        .end((err: unknown, res: any) => {
          if (err) {
            done(err);
          } else {
            postId = res.body[0];
            let query = "?statementId=" + postId;

            request(helper.getEndpointAndAuth())
              .get(helper.getEndpointStatements() + query)
              .wait(helper.genDelay(stmtTime, query, postId))
              .headers(helper.addAllHeaders())
              .expect(200)
              .end((err: unknown, res: any) => {
                if (err) {
                  done(err);
                } else {
                  let result = helper.parse(res.body);
                  expect(result).to.have.property("stored");
                  let stmtStored = result.stored;
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
      let stmtTime = Date.now();

      request(helper.getEndpointAndAuth())
        .put(helper.getEndpointStatements() + param)
        .headers(helper.addAllHeaders())
        .json(data)
        .expect(204)
        .end((err: unknown, _res: any) => {
          if (err) {
            done(err);
          } else {
            request(helper.getEndpointAndAuth())
              .get(helper.getEndpointStatements() + param)
              .wait(helper.genDelay(stmtTime, param, putId))
              .headers(helper.addAllHeaders())
              .expect(200)
              .end((err: unknown, res: any) => {
                if (err) {
                  done(err);
                } else {
                  let result = helper.parse(res.body);
                  expect(result).to.have.property("stored");
                  let stmtStored = result.stored;
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
        .end((err: unknown, res: any) => {
          if (err) {
            done(err);
          } else {
            let result = helper.parse(res.body);
            let stmts = result.statements;
            let milliChecker = (num: number) => {
              expect(stmts[num]).to.have.property("stored");
              //formatted iso 8601
              let chkStored = moment(stmts[num].stored, moment.ISO_8601);
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
