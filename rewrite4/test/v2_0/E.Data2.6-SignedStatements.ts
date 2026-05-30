/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xapi-lrs-conformance-requirements
 */

import helperImport from "../helper.ts";
import requestBase from "super-request";

const helper: any = helperImport;
const request: any = helper.OAuthRequest(requestBase);

describe("Signed Statements (Data 2.6)", () => {
    /**  Matchup with Conformance Requirements Document
     * XAPI-00115 - below
     * XAPI-00116 - below
     * XAPI-00117 - below
     */

    describe("LRS must validate and store statement signatures if they are provided (Data 2.6)", function () {
      const templates = [{ statement: "{{statements.default}}" }];
      const data = helper.createFromTemplate(templates).statement;

      /**  XAPI-00115, Data 2.5 Signed Statements
       * A Signed Statement MUST include a JSON web signature (JWS) as defined here: http://tools.ietf.org/html/rfc7515, as an Attachment with a usageType of http://adlnet.gov/expapi/attachments/signature and a contentType of application/octet-stream. The LRS must reject with 400 a statement which has usageType of http://adlnet.gov/expapi/attachments/signature and a contentType of application/octet-stream but does not have a signature attached.
       */
      describe("A Signed Statement MUST include a JSON web signature, JWS (Data 2.6.s4.b1, XAPI-00115)", function () {
        it("rejects a signed statement with a malformed signature - bad content type", function (done) {
          data.id = helper.generateUUID();
          const options: any = { attachmentInfo: { contentType: "text/plain; charset=ascii" } };
          const body = helper.signStatement(data, options);

          request(helper.getEndpointAndAuth())
            .post(helper.getEndpointStatements())
            .headers(helper.addAllHeaders({ "Content-Type": "multipart/mixed; boundary=" + options.boundary }))
            .body(body)
            .expect(400, done);
        });

        it("rejects a signed statement with a malformed signature - bad JWS", function (done) {
          data.id = helper.generateUUID();
          const options: any = { breakJson: true };
          const body = helper.signStatement(data, options);

          request(helper.getEndpointAndAuth())
            .post(helper.getEndpointStatements())
            .headers(helper.addAllHeaders({ "Content-Type": "multipart/mixed; boundary=" + options.boundary }))
            .body(body)
            .expect(400, done);
        });
      });

      /**  XAPI-00116, Data 2.6 Signed Statements
       * The JWS signature MUST have a payload of a valid JSON serialization of the complete Statement before the signature was added.The LRS must reject with 400 a statement which does not have a valid JSON serialization.
       */
      describe("The JWS signature MUST have a payload of a valid JSON serialization of the complete Statement before the signature was added. (Data 2.6.s4.b3, XAPI-00116)", function () {
        it("rejects statement with invalid JSON serialization", function (done) {
          data.id = helper.generateUUID();
          const options: any = { breakJson: true };
          const body = helper.signStatement(data, options);

          request(helper.getEndpointAndAuth())
            .post(helper.getEndpointStatements())
            .headers(helper.addAllHeaders({ "Content-Type": "multipart/mixed; boundary=" + options.boundary }))
            .body(body)
            .expect(400, done);
        });
      });

      /**  XAPI-00117, Data 2.6 Signed Statements
       * The JWS signature MUST use an algorithm of "RS256", "RS384", or "RS512". The LRS must reject with 400 a statement which does not use one of these algorithms or does not use one of these algorithms correctly.
       */
      describe('The JWS signature MUST use an algorithm of "RS256", "RS384", or "RS512". (Data 2.6.s4.b4, XAPI-00117)', function () {
        it('Accepts signed statement with "RS256"', function (done) {
          // sign statement
          data.id = helper.generateUUID();
          const options: any = {};
          const body = helper.signStatement(data, options);

          request(helper.getEndpointAndAuth())
            .post(helper.getEndpointStatements())
            .headers(helper.addAllHeaders({ "Content-Type": "multipart/mixed; boundary=" + options.boundary }))
            .body(body)
            .expect(200, done);
        }); //end it good sig with "RS256"

        it('Accepts signed statement with "RS384"', function (done) {
          // sign statement
          data.id = helper.generateUUID();
          const options: any = { algorithm: "RS384" };
          const body = helper.signStatement(data, options);

          request(helper.getEndpointAndAuth())
            .post(helper.getEndpointStatements())
            .headers(helper.addAllHeaders({ "Content-Type": "multipart/mixed; boundary=" + options.boundary }))
            .body(body)
            .expect(200, done);
        }); //end it good sig with "RS384"

        it('Accepts signed statement with "RS512"', function (done) {
          // sign statement
          data.id = helper.generateUUID();
          const options: any = { algorithm: "RS512" };
          const body = helper.signStatement(data, options);

          request(helper.getEndpointAndAuth())
            .post(helper.getEndpointStatements())
            .headers(helper.addAllHeaders({ "Content-Type": "multipart/mixed; boundary=" + options.boundary }))
            .body(body)
            .expect(200, done);
        }); //end it good sig with "RS512"

        it("Rejects signed statement with another algorithm", function (done) {
          data.id = helper.generateUUID();
          const options: any = { algorithm: "HS256" };
          const body = helper.signStatement(data, options);

          request(helper.getEndpointAndAuth())
            .post(helper.getEndpointStatements())
            .headers(helper.addAllHeaders({ "Content-Type": "multipart/mixed; boundary=" + options.boundary }))
            .body(body)
            .expect(400, done);
        });
      });
    }); //end describe statement signatures
  });
