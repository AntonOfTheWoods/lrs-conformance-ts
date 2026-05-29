// @ts-nocheck
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
  module,
  fs,
  extend,
  moment,
  request,
  requestPromise,
  chai,
  liburl,
  Joi,
  helper,
  multipartParser,
  redirect,
  templatingSelection,
) {
  // "use strict";

  const REG_ALLOWED_VERSIONS = /^2\.0\.0$|^1\.0(\.[1-3])$/;

  var expect = chai.expect;
  if (global.OAUTH) request = helper.OAuthRequest(request);

  describe("Version Property Requirements (Data 2.4.10)", () => {
    /**  Matchup with Conformance Requirements Document
     * XAPI-00101 - in version.js
     * Unnumbered test - came from XAPI-00332
     */

    templatingSelection.createTemplate("version.ts");

    /**  XAPI-00332, Communication 3.3 Versioning which should be moved to Data 2.4.10 Version Property
     * Statements returned by an LRS MUST retain the version property they are accepted with.
     */
    it("Statements returned by an LRS MUST retain the version property they are accepted with (Format, Data 2.4.10, XAPI-00332)", function (done) {
      this.timeout(0);
      var stmtTime = Date.now();

      var statementTemplates = [{ statement: "{{statements.default}}" }];

      var version = "1.0.3";
      var id = helper.generateUUID();

      var statement = helper.createFromTemplate(statementTemplates);
      statement = statement.statement;
      statement.id = id;
      statement.version = version;

      var query = helper.getUrlEncoding({ statementId: id });

      request(helper.getEndpointAndAuth())
        .post(helper.getEndpointStatements())
        .headers(helper.addAllHeaders({}))
        .json(statement)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            request(helper.getEndpointAndAuth())
              .get(helper.getEndpointStatements() + "?" + query)
              .wait(helper.genDelay(stmtTime, "?" + query, id))
              .headers(helper.addAllHeaders({}))
              .expect(200)
              .end(function (err, res) {
                if (err) {
                  done(err);
                } else {
                  var results = helper.parse(res.body);
                  expect(results.version).to.match(REG_ALLOWED_VERSIONS);
                  done();
                }
              });
          }
        });
    });
  });
})(undefined,__esmDep1,
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
