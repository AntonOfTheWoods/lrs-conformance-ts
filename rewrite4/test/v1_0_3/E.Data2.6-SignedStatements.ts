/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xapi-lrs-conformance-requirements
 */

import helperImport from "../helper.ts";
import requestBase from "../super-request.ts";

const helper: any = helperImport;
let request: any = requestBase;

request = helper.OAuthRequest(request);
describe("Signed Statements (Data 2.6)", () => {
  /**  Matchup with Conformance Requirements Document
   * XAPI-00115 - below
   * XAPI-00116 - below
   * XAPI-00117 - below
   */

  describe("LRS must validate and store statement signatures if they are provided (Data 2.6)", function () {
    let templates = [{ statement: "{{statements.default}}" }];
    let data = helper.createFromTemplate(templates);
    data = data.statement;

    async function expectSignedStatementStatus(options: any, expectedStatus: number) {
      data.id = helper.generateUUID();
      const body = await helper.signStatement(data, options);

      await new Promise<void>(function (resolve, reject) {
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({ "Content-Type": "multipart/mixed; boundary=" + options.boundary }))
          .body(body)
          .expect(expectedStatus, function (error: unknown) {
            if (error) {
              reject(error);
              return;
            }
            resolve();
          });
      });
    }

    /**  XAPI-00115, Data 2.5 Signed Statements
     * A Signed Statement MUST include a JSON web signature (JWS) as defined here: http://tools.ietf.org/html/rfc7515, as an Attachment with a usageType of http://adlnet.gov/expapi/attachments/signature and a contentType of application/octet-stream. The LRS must reject with 400 a statement which has usageType of http://adlnet.gov/expapi/attachments/signature and a contentType of application/octet-stream but does not have a signature attached.
     */
    describe("A Signed Statement MUST include a JSON web signature, JWS (Data 2.6.s4.b1, XAPI-00115)", function () {
      it("rejects a signed statement with a malformed signature - bad content type", async function () {
        let options: any = { attachmentInfo: { contentType: "text/plain; charset=ascii" } };
        await expectSignedStatementStatus(options, 400);
      });

      it("rejects a signed statement with a malformed signature - bad JWS", async function () {
        let options: any = { breakJson: true };
        await expectSignedStatementStatus(options, 400);
      });
    });

    /**  XAPI-00116, Data 2.6 Signed Statements
     * The JWS signature MUST have a payload of a valid JSON serialization of the complete Statement before the signature was added.The LRS must reject with 400 a statement which does not have a valid JSON serialization.
     */
    describe("The JWS signature MUST have a payload of a valid JSON serialization of the complete Statement before the signature was added. (Data 2.6.s4.b3, XAPI-00116)", function () {
      it("rejects statement with invalid JSON serialization", async function () {
        let options: any = { breakJson: true };
        await expectSignedStatementStatus(options, 400);
      });
    });

    /**  XAPI-00117, Data 2.6 Signed Statements
     * The JWS signature MUST use an algorithm of "RS256", "RS384", or "RS512". The LRS must reject with 400 a statement which does not use one of these algorithms or does not use one of these algorithms correctly.
     */
    describe('The JWS signature MUST use an algorithm of "RS256", "RS384", or "RS512". (Data 2.6.s4.b4, XAPI-00117)', function () {
      it('Accepts signed statement with "RS256"', async function () {
        // sign statement
        let options: any = {};
        await expectSignedStatementStatus(options, 200);
      }); //end it good sig with "RS256"

      it('Accepts signed statement with "RS384"', async function () {
        // sign statement
        let options: any = { algorithm: "RS384" };
        await expectSignedStatementStatus(options, 200);
      }); //end it good sig with "RS384"

      it('Accepts signed statement with "RS512"', async function () {
        // sign statement
        let options: any = { algorithm: "RS512" };
        await expectSignedStatementStatus(options, 200);
      }); //end it good sig with "RS512"

      it("Rejects signed statement with another algorithm", async function () {
        let options: any = { algorithm: "HS256" };
        await expectSignedStatementStatus(options, 400);
      });
    });
  }); //end describe statement signatures
});
