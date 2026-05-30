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
    const context = this;
    context.timeout(0);
    const stmtTime = Date.now();

    const statementTemplates = [{ statement: "{{statements.default}}" }];

    const version = "2.0.0";
    const id = helper.generateUUID();

    let statement = helper.createFromTemplate(statementTemplates);
    statement = statement.statement;
    statement.id = id;
    statement.version = version;

    const query = helper.getUrlEncoding({ statementId: id });

    request(helper.getEndpointAndAuth())
      .post(helper.getEndpointStatements())
      .headers(helper.addAllHeaders({}))
      .json(statement)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          done(err);
          return;
        }

        request(helper.getEndpointAndAuth())
          .get(helper.getEndpointStatements() + "?" + query)
          .wait(helper.genDelay(stmtTime, "?" + query, id))
          .headers(helper.addAllHeaders({}))
          .expect(200)
          .end(function (getErr, getRes) {
            if (getErr) {
              done(getErr);
              return;
            }

            const results = helper.parse(getRes.body);
            expect(results.version).to.equal(version);
            done();
          });
      });
  });
});
