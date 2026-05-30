/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xapi-lrs-conformance-requirements
 */

import { expect } from "chai";
import helperImport from "../helper.ts";
import requestBase from "../super-request.ts";

const helper: any = helperImport;
let request: any = requestBase;

if (process.env["OAUTH1_ENABLED"] === "true") request = helper.OAuthRequest(request);

describe("Encoding Requirements (Communication 1.4)", () => {
  /**  XAPI-00015,  2.2. Formatting Requirements
   * All Strings are encoded and interpreted as UTF-8
   * This req should stay here (Communication 1.4).  This is the only place which mentions UTF-8 in the spec, other than Comm 1.3
   */
  it("All Strings are encoded and interpreted as UTF-8 (Communication 1.4.s1.b1, XAPI-00015)", function (done) {
    this.timeout(0);
    let verbTemplate = "http://adlnet.gov/expapi/test/unicode/target/";
    let verb = verbTemplate + helper.generateUUID();
    let unicodeTemplates = [{ statement: "{{statements.unicode}}" }];

    let unicode = helper.createFromTemplate(unicodeTemplates).statement;
    unicode.verb.id = verb;

    let query = helper.getUrlEncoding({
      verb: verb,
    });
    let stmtTime = Date.now();

    request(helper.getEndpointAndAuth())
      .post(helper.getEndpointStatements())
      .headers(helper.addAllHeaders({}))
      .json(unicode)
      .expect(200)
      .end(function (err: unknown, res: any) {
        if (err) {
          done(err);
        } else {
          request(helper.getEndpointAndAuth())
            .get(helper.getEndpointStatements() + "?" + query)
            .wait(helper.genDelay(stmtTime, "?" + query, null))
            .headers(helper.addAllHeaders({}))
            .expect(200)
            .end(function (err: unknown, res: any) {
              if (err) {
                done(err);
              } else {
                let results = helper.parse(res.body, done);
                let languages = results.statements[0].verb.display;
                let unicodeConformant = true;
                for (let key in languages) {
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
