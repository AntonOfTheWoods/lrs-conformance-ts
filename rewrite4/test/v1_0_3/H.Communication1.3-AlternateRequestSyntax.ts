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

(function (module, fs, extend, moment, request, requestPromise, chai, liburl, Joi, helper, multipartParser, redirect) {
  // "use strict";
  if (global.OAUTH) request = helper.OAuthRequest(request);

  describe("Alternate Request Syntax Requirements (Communication 1.3)", function () {
    /**  XAPI-00336, Communication 1.3 Alternate Request Syntax
     * The LRS MUST support the Alternate Request Syntax.
     */
    describe("The LRS MUST support the Alternate Request Syntax (Communication 1.3.s3.b15, XAPI-00336)", function () {
      /**  XAPI-00148, Communication 2.1.2 POST Statements
       * An LRS accepts a valid POST request containing a GET request returning 200 OK and the StatementResult Object.
       */
      it("An LRS accepts a valid POST request containing a GET request returning 200 OK and the StatementResult Object. (Communication 1.3, Communication 2.1.2.s2.b3, XAPI-00148)", function (done) {
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements() + "?method=GET")
          .headers(helper.addAllHeaders({}))
          .form({ limit: 1 })
          .expect(200)
          .end(function (err, res) {
            if (err) {
              done(err);
            } else {
              var results = helper.parse(res.body, done);
              chai.expect(results).to.have.property("statements");
              chai.expect(results).to.have.property("more");
              done();
            }
          });
      });

      it("An LRS rejects an alternate request syntax not issued as a POST", function () {
        var parameters = { method: "POST" };
        var formBody = helper.buildFormBody(helper.buildStatement());
        return helper.sendRequest("put", helper.getEndpointStatements(), parameters, formBody, 400);
      });

      it("An LRS accepts an alternate request syntax PUT issued as a POST", function () {
        var parameters = { method: "PUT" };
        var formBody = {
          statementId: helper.generateUUID(),
          content: helper.buildStatement(),
        };
        return helper.sendRequest(
          "post",
          helper.getEndpointStatements(),
          parameters,
          helper.getUrlEncoding(formBody),
          204,
        );
      });

      it("During an alternate request syntax the LRS treats the listed form parameters, 'Authorization', 'X-Experience-API-Version', 'Content-Type', 'Content-Length', 'If-Match' and 'If-None-Match', as header parameters (Communictation 1.3.s3.b7)", function () {
        var parameters = { method: "PUT" };
        var sID = helper.generateUUID();
        var formBody = {
          statementId: sID,
          "X-Experience-API-Version": "0.8",
          content: helper.buildStatement(),
        };
        return helper.sendRequest(
          "post",
          helper.getEndpointStatements(),
          parameters,
          helper.getUrlEncoding(formBody),
          400,
        );
      });

      it("An LRS will reject an alternate request syntax which contains any extra information with error code 400 Bad Request (Communication 1.3.s3.b4)", function () {
        var templates = [{ statement: "{{statements.default}}" }];
        var data = helper.createFromTemplate(templates);
        var statement = data.statement;
        var sID = helper.generateUUID();
        var parameters = {
          method: "PUT",
          statementId: sID,
        };
        var body = {
          statementId: sID,
          content: statement,
        };

        return helper.sendRequest("post", helper.getEndpointStatements(), parameters, helper.getUrlEncoding(body), 400);
      });

      describe('An LRS will reject an alternate request syntax sending content which does not have a form parameter with the name of "content" (Communication 1.3.s3.b4)', function () {
        it("will pass PUT with content body which is url encoded", function (done) {
          var headers = helper.addAllHeaders({});
          var auth = headers["Authorization"];
          var query = helper.getUrlEncoding({ method: "PUT" });

          var templates = [{ statement: "{{statements.default}}" }];
          var data = helper.createFromTemplate(templates).statement;

          var form = {
            statementId: helper.generateUUID(),
            content: JSON.stringify(data),
            "X-Experience-API-Version": "1.0.3",
            Authorization: auth,
          };

          request(helper.getEndpointAndAuth())
            .post(helper.getEndpointStatements() + "?" + query)
            .headers({ "content-type": "application/x-www-form-urlencoded" })
            .form(form)
            .expect(204, done);
        });

        it("will fail PUT with no content body", function () {
          var parameters = { method: "PUT" };
          return helper.sendRequest("post", helper.getEndpointStatements(), parameters, undefined, 400);
        });

        it("will fail PUT with content body which is not url encoded", function (done) {
          var headers = helper.addAllHeaders({});
          var query = helper.getUrlEncoding({ method: "PUT" });
          var templates = [{ statement: "{{statements.default}}" }];
          var data = helper.createFromTemplate(templates).statement;
          headers["content-type"] = "application/x-www-form-urlencoded";

          var form = {
            statementId: helper.generateUUID(),
            content: JSON.stringify(data),
            "X-Experience-API-Version": "1.0.3",
          };

          request(helper.getEndpointAndAuth())
            .post(helper.getEndpointStatements() + "?" + query)
            .headers(headers)
            .body(JSON.stringify(form))
            .expect(400, done);
        });
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
);
