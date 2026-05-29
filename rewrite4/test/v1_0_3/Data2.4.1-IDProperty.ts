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

/**  As there is no Data 2.4 file, I will match them up here
 * Matchup with Conformance Requirements Document
 * XAPI-00021 - these are all in Multiplicity folder, the community said this won't be a problem and do not test it.  some are also covered in templating tests, usually in these cases post and 200 or 400.
 * XAPI-00022 - in timestamp_property.js
 * XAPI-00023 - in Data 2.4.8 Stored Property
 * XAPI-00024 - in authorities.js
 * XAPI-00025 - in attachments.js
 */

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

  /** Matchup with Conformance Requirements Document
   * XAPI-00026 - found below
   * XAPI-00027 - in uuids.js
   * XAPI-00028 - in uuids.js
   * XAPI-00029 - in uuids.js
   * XAPI-00030 - in uuids.js
   */

  describe("Id Property Requirements (Data 2.4.1)", () => {
    var data: any;

    templatingSelection.createTemplate("uuids.ts");

    /**  XAPI-00026,  Data 2.4.1 Id
     * An LRS generates the "id" property of a Statement if none is provided (Modify, 4.1.1.a)
     */
    describe('An LRS generates the "id" property of a Statement if none is provided (Modify, Data 2.4.1.s2.b1, XAPI-00026)', function () {
      it("should complete an empty id property", (done) => {
        this.timeout(0);
        var stmtid, query;
        var templates = [{ statement: "{{statements.default}}" }];
        data = helper.createFromTemplate(templates);
        data = data.statement;
        var stmtTime = Date.now();

        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(data)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              done(err);
            } else {
              stmtid = res.body[0];
              query = "?statementId=" + stmtid;
              request(helper.getEndpointAndAuth())
                .get(helper.getEndpointStatements() + query)
                .wait(helper.genDelay(stmtTime, query, stmtid))
                .headers(helper.addAllHeaders({}))
                .end(function (err, res) {
                  if (err) {
                    done(err);
                  } else {
                    var results = helper.parse(res.body, done);
                    expect(results.id).to.not.be.undefined;
                    expect(results.id).to.eql(stmtid);
                    done();
                  }
                });
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
