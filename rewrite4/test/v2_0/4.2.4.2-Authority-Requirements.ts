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

describe("Authority Property Requirements (Data 2.4.9)", () => {
  /**  Matchup with Conformance Requirements Document
   * XAPI-00098 - in authorities.js
   * XAPI-00099 - below
   * XAPI-00100 - below
   *
   * Note - XAPI-00024 - in authorities.js
   */
  templatingSelection.createTemplate("authorities.ts");

  /**  XAPI-00100, Data 2.4.9 Authority
   * An LRS rejects with error code 400 Bad Request, a Request whose "authority" is a Group having more than two Agents
   */
  it('An LRS rejects with error code 400 Bad Request, a Request whose "authority" is a Group and consists of non-O-Auth Agents (Data 2.4.9.s3.b3, XAPI-00100)', function (done) {
    const templates = [
      { statement: "{{statements.default}}" },
      {
        authority: {
          objectType: "Group",
          name: "xAPI Group",
          mbox: "mailto:xapigroup@example.com",
          member: [
            { name: "agentA", mbox: "mailto:agentA@example.com" },
            { name: "agentB", mbox: "mailto:agentB@example.com" },
          ],
        },
      },
    ];
    let data = helper.createFromTemplate(templates);
    data = data.statement;
    request(helper.getEndpointAndAuth())
      .post(helper.getEndpointStatements())
      .headers(helper.addAllHeaders({}))
      .json(data)
      .expect(400, done);
  });

  /**  XAPI-00099, Data 2.4.9 Authority
   * An LRS populates the "authority" property if it is not provided in the Statement
   */
  describe('An LRS populates the "authority" property if it is not provided in the Statement, based on header information with the Agent corresponding to the user (contained within the header) (Implicit, Data 2.4.9.s3.b4, XAPI-00099) ', function () {
    it("should populate authority ", function (done) {
      const context = this;
      context.timeout(0);

      const templates = [{ statement: "{{statements.default}}" }];
      let data = helper.createFromTemplate(templates);
      data = data.statement;
      data.id = helper.generateUUID();
      const query = "?statementId=" + data.id;
      const stmtTime = Date.now();

      request(helper.getEndpointAndAuth())
        .post(helper.getEndpointStatements())
        .headers(helper.addAllHeaders({}))
        .json(data)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            done(err);
            return;
          }

          request(helper.getEndpointAndAuth())
            .get(helper.getEndpointStatements() + query)
            .headers(helper.addAllHeaders({}))
            .wait(helper.genDelay(stmtTime, query, data.id))
            .expect(200)
            .end(function (getErr, getRes) {
              if (getErr) {
                done(getErr);
                return;
              }

              const statement = helper.parse(getRes.body, done);
              expect(statement).to.have.property("authority");
              done();
            });
        });
    });
  });
});
