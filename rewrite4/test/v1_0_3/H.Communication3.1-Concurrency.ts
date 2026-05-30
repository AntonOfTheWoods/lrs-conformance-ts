/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xapi-lrs-conformance-requirements
 */

import { expect } from "chai";
import helperImport from "../helper.ts";

const helper: any = helperImport;

describe("Concurrency Requirements (Communication 3.1)", () => {
  /**  Matchup with Conformance Requirements Document
   * XAPI-00322 - below
   */

  /**  XAPI-00322, Communication 3.1 Concurrency
   * An LRS must support HTTP/1.1 entity tags (ETags) to implement optimistic concurrency control when handling APIs where PUT may overwrite existing data (State, Agent Profile, and Activity Profile)
   */
  describe("An LRS must support HTTP/1.1 entity tags (ETags) to implement optimistic concurrency control when handling Resources where PUT may overwrite existing data (Agent Profile, and Activity Profile, Communication 3.1, XAPI-00322)", function () {
    it("When responding to a GET request to Agent Profile resource, include an ETag HTTP header in the response", function () {
      let parameters = helper.buildAgentProfile(),
        document = helper.buildDocument();

      return helper
        .sendRequest("put", helper.getEndpointAgentsProfile(), parameters, document, 204, { "If-None-Match": "*" })
        .then(function (res: any) {
          return helper
            .sendRequest("get", helper.getEndpointAgentsProfile(), parameters, undefined, 200)
            .then(function (res: any) {
              expect(res.headers).to.have.property("etag");
            });
        });
    });

    it("When responding to a GET request to Activities Profile resource, include an ETag HTTP header in the response", function () {
      let parameters = helper.buildActivityProfile(),
        document = helper.buildDocument();

      return helper
        .sendRequest("put", helper.getEndpointActivitiesProfile(), parameters, document, 204, {
          "If-None-Match": "*",
        })
        .then(function (res: any) {
          return helper
            .sendRequest("get", helper.getEndpointActivitiesProfile(), parameters, undefined, 200)
            .then(function (res: any) {
              expect(res.headers).to.have.property("etag");
            });
        });
    });

    it("When returning an ETag header, the value should be calculated as a SHA1 hexadecimal value", function () {
      let parameters = helper.buildAgentProfile(),
        document = helper.buildDocument();

      return helper.sendRequest("post", helper.getEndpointAgentsProfile(), parameters, document, 204).then(function () {
        return helper.sendRequest("get", helper.getEndpointAgentsProfile(), parameters, undefined, 200).then(function (
          res: any,
        ) {
          expect(res.headers.etag).to.be.ok;
          expect(res.headers.etag).to.match(/\b[0-9a-fA-F]{40}\b/);
        });
      });
    });

    it("When responding to a GET Request the Etag header must be enclosed in quotes", function () {
      let parameters = helper.buildAgentProfile(),
        document = helper.buildDocument();

      return helper.sendRequest("post", helper.getEndpointAgentsProfile(), parameters, document, 204).then(function () {
        return helper.sendRequest("get", helper.getEndpointAgentsProfile(), parameters, undefined, 200).then(function (
          res: any,
        ) {
          expect(res.headers.etag).to.be.ok;
          let str = res.headers.etag;
          //test for weak etags
          if (str[0] !== '"') {
            expect(str[0]).to.equal("W");
            expect(str[1]).to.equal("/");
            str = str.substring(2);
          }
          expect(str[0]).to.equal('"');
          expect(str[41]).to.equal('"');
        });
      });
    });

    describe("With a valid etag", function () {
      let parameters: any, document: any;
      before("before", function () {
        parameters = helper.buildAgentProfile();
        document = helper.buildDocument();
        return helper.sendRequest("post", helper.getEndpointAgentsProfile(), parameters, document, 204);
      });

      it("When responding to a PUT request, must handle the If-Match header as described in RFC 2616, HTTP/1.1 if it contains an ETag", function () {
        document = helper.buildDocument();
        return helper.sendRequest("get", helper.getEndpointAgentsProfile(), parameters, null, 200).then(function (
          res: any,
        ) {
          let goodTag = res.headers.etag;

          let document = helper.buildDocument();
          return helper.sendRequest("put", helper.getEndpointAgentsProfile(), parameters, document, 204, {
            "If-Match": goodTag,
          });
        });
      });
    });

    describe('When responding to a PUT request, handle the If-None-Match header as described in RFC 2616, HTTP/1.1 if it contains "*"', function () {
      let parameters = helper.buildActivityProfile();

      it("succeeds when no document exists", function () {
        let document = helper.buildDocument();
        return helper.sendRequest("put", helper.getEndpointActivitiesProfile(), parameters, document, 204, {
          "If-None-Match": "*",
        });
      });

      it("rejects if a document already exists", function () {
        let document2 = helper.buildDocument();
        return helper.sendRequest("put", helper.getEndpointActivitiesProfile(), parameters, document2, 412, {
          "If-None-Match": "*",
        });
      });
    });

    describe("If Header precondition in PUT Requests for RFC2616 fail", function () {
      let parameters = helper.buildAgentProfile(),
        document = helper.buildDocument();

      before("post the document and get the etag", function () {
        return helper.sendRequest("post", helper.getEndpointAgentsProfile(), parameters, document, 204).then(function (
          res: any,
        ) {
          return helper.sendRequest("get", helper.getEndpointAgentsProfile(), parameters, null, 200).then(function (
            res: any,
          ) {
            void res.headers.etag;
          });
        });
      });

      it("Return HTTP 412 (Precondition Failed)", function () {
        let badTag = '"1111111111111111111111111111111111111111"';
        let document2 = helper.buildDocument();
        return helper.sendRequest("put", helper.getEndpointAgentsProfile(), parameters, document2, 412, {
          "If-Match": badTag,
        });
      });

      it("Do not modify the resource", function () {
        return helper.sendRequest("get", helper.getEndpointAgentsProfile(), parameters, null, 200).then(function (
          res: any,
        ) {
          let result = res.body;
          expect(result).to.eql(document);
        });
      });
    });

    describe("If put request is received without either header for a resource that already exists", function () {
      let parameters = helper.buildActivityProfile();
      let document = helper.buildDocument();
      let document2 = helper.buildDocument();

      before("post the document and get the etag", function () {
        return helper
          .sendRequest("post", helper.getEndpointActivitiesProfile(), parameters, document, 204)
          .then(function (res: any) {
            return helper
              .sendRequest("get", helper.getEndpointActivitiesProfile(), parameters, null, 200)
              .then(function (res: any) {
                void res.headers.etag;
              });
          });
      });

      it("Return 409 conflict", function () {
        return helper.sendRequest("put", helper.getEndpointActivitiesProfile(), parameters, document2, 409);
      });

      it("Return error message explaining the situation", function () {
        return helper
          .sendRequest("put", helper.getEndpointActivitiesProfile(), parameters, document2, 409)
          .then(function (res: any) {
            expect(res).to.have.property("text");
            expect(res.text).to.have.length.above(0);
          });
      });

      it("Do not modify the resource", function () {
        return helper
          .sendRequest("put", helper.getEndpointActivitiesProfile(), parameters, document2, 409)
          .then(function (res: any) {
            return helper
              .sendRequest("get", helper.getEndpointActivitiesProfile(), parameters, null, 200)
              .then(function (res: any) {
                expect(res.body).to.eql(document);
              });
          });
      });
    });
  });
});
