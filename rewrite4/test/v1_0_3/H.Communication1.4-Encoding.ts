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

  describe("Encoding Requirements (Communication 1.4)", () => {
    /**  XAPI-00015,  2.2. Formatting Requirements
     * All Strings are encoded and interpreted as UTF-8
     * This req should stay here (Communication 1.4).  This is the only place which mentions UTF-8 in the spec, other than Comm 1.3
     */
    it("All Strings are encoded and interpreted as UTF-8 (Communication 1.4.s1.b1, XAPI-00015)", function (done) {
      this.timeout(0);
      var verbTemplate = "http://adlnet.gov/expapi/test/unicode/target/";
      var verb = verbTemplate + helper.generateUUID();
      var unicodeTemplates = [{ statement: "{{statements.unicode}}" }];

      var unicode = helper.createFromTemplate(unicodeTemplates);
      unicode = unicode.statement;
      unicode.verb.id = verb;

      var query = helper.getUrlEncoding({
        verb: verb,
      });
      var stmtTime = Date.now();

      request(helper.getEndpointAndAuth())
        .post(helper.getEndpointStatements())
        .headers(helper.addAllHeaders({}))
        .json(unicode)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            request(helper.getEndpointAndAuth())
              .get(helper.getEndpointStatements() + "?" + query)
              .wait(helper.genDelay(stmtTime, "?" + query, null))
              .headers(helper.addAllHeaders({}))
              .expect(200)
              .end(function (err, res) {
                if (err) {
                  done(err);
                } else {
                  var results = helper.parse(res.body, done);
                  var languages = results.statements[0].verb.display;
                  var unicodeConformant = true;
                  for (var key in languages) {
                    if (languages[key] !== unicode.verb.display[key]) unicodeConformant = false;
                  }
                  expect(unicodeConformant).to.be.true;
                  done();
                }
              });
          }
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
