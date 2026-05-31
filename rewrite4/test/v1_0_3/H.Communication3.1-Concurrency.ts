/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xapi-lrs-conformance-requirements
 */

import { beforeAll, describe, expect, it } from "bun:test";
import helperImport from "../helper.ts";

const helper: any = helperImport;

describe("Concurrency Requirements (Communication 3.1)", () => {
  /**  Matchup with Conformance Requirements Document
   * XAPI-00322 - below
   */

  /**  XAPI-00322, Communication 3.1 Concurrency
   * An LRS must support HTTP/1.1 entity tags (ETags) to implement optimistic concurrency control when handling APIs where PUT may overwrite existing data (State, Agent Profile, and Activity Profile)
   */
  describe("An LRS must support HTTP/1.1 entity tags (ETags) to implement optimistic concurrency control when handling Resources where PUT may overwrite existing data (Agent Profile, and Activity Profile, Communication 3.1, XAPI-00322)", () => {
    it("When responding to a GET request to Agent Profile resource, include an ETag HTTP header in the response", () => {
      let parameters = helper.buildAgentProfile(),
        document = helper.buildDocument();

      return helper
        .sendRequest("put", helper.getEndpointAgentsProfile(), parameters, document, 204, { "If-None-Match": "*" })
        .then((res: any) => {
          return helper
            .sendRequest("get", helper.getEndpointAgentsProfile(), parameters, undefined, 200)
            .then((res: any) => {
              expect(res.headers).toHaveProperty("etag");
            });
        });
    });

    it("When responding to a GET request to Activities Profile resource, include an ETag HTTP header in the response", () => {
      let parameters = helper.buildActivityProfile(),
        document = helper.buildDocument();

      return helper
        .sendRequest("put", helper.getEndpointActivitiesProfile(), parameters, document, 204, {
          "If-None-Match": "*",
        })
        .then((res: any) => {
          return helper
            .sendRequest("get", helper.getEndpointActivitiesProfile(), parameters, undefined, 200)
            .then((res: any) => {
              expect(res.headers).toHaveProperty("etag");
            });
        });
    });

    it("When returning an ETag header, the value should be calculated as a SHA1 hexadecimal value", () => {
      let parameters = helper.buildAgentProfile(),
        document = helper.buildDocument();

      return helper.sendRequest("post", helper.getEndpointAgentsProfile(), parameters, document, 204).then(() => {
        return helper.sendRequest("get", helper.getEndpointAgentsProfile(), parameters, undefined, 200).then((
          res: any,
        ) => {
          expect(res.headers.etag).toBeTruthy();
          expect(res.headers.etag).toMatch(/\b[0-9a-fA-F]{40}\b/);
        });
      });
    });

    it("When responding to a GET Request the Etag header must be enclosed in quotes", () => {
      let parameters = helper.buildAgentProfile(),
        document = helper.buildDocument();

      return helper.sendRequest("post", helper.getEndpointAgentsProfile(), parameters, document, 204).then(() => {
        return helper.sendRequest("get", helper.getEndpointAgentsProfile(), parameters, undefined, 200).then((
          res: any,
        ) => {
          expect(res.headers.etag).toBeTruthy();
          let str = res.headers.etag;
          //test for weak etags
          if (str[0] !== '"') {
            expect(str[0]).toEqual("W");
            expect(str[1]).toEqual("/");
            str = str.substring(2);
          }
          expect(str[0]).toEqual('"');
          expect(str[41]).toEqual('"');
        });
      });
    });

    describe("With a valid etag", () => {
      let parameters: any, document: any;
      beforeAll(() => {
        parameters = helper.buildAgentProfile();
        document = helper.buildDocument();
        return helper.sendRequest("post", helper.getEndpointAgentsProfile(), parameters, document, 204);
      });

      it("When responding to a PUT request, must handle the If-Match header as described in RFC 2616, HTTP/1.1 if it contains an ETag", () => {
        document = helper.buildDocument();
        return helper.sendRequest("get", helper.getEndpointAgentsProfile(), parameters, null, 200).then((
          res: any,
        ) => {
          let goodTag = res.headers.etag;

          let document = helper.buildDocument();
          return helper.sendRequest("put", helper.getEndpointAgentsProfile(), parameters, document, 204, {
            "If-Match": goodTag,
          });
        });
      });
    });

    describe('When responding to a PUT request, handle the If-None-Match header as described in RFC 2616, HTTP/1.1 if it contains "*"', () => {
      let parameters = helper.buildActivityProfile();

      it("succeeds when no document exists", () => {
        let document = helper.buildDocument();
        return helper.sendRequest("put", helper.getEndpointActivitiesProfile(), parameters, document, 204, {
          "If-None-Match": "*",
        });
      });

      it("rejects if a document already exists", () => {
        let document2 = helper.buildDocument();
        return helper.sendRequest("put", helper.getEndpointActivitiesProfile(), parameters, document2, 412, {
          "If-None-Match": "*",
        });
      });
    });

    describe("If Header precondition in PUT Requests for RFC2616 fail", () => {
      let parameters = helper.buildAgentProfile(),
        document = helper.buildDocument();

      beforeAll(() => {
        return helper.sendRequest("post", helper.getEndpointAgentsProfile(), parameters, document, 204).then((
          res: any,
        ) => {
          return helper.sendRequest("get", helper.getEndpointAgentsProfile(), parameters, null, 200).then((
            res: any,
          ) => {
            void res.headers.etag;
          });
        });
      });

      it("Return HTTP 412 (Precondition Failed)", () => {
        let badTag = '"1111111111111111111111111111111111111111"';
        let document2 = helper.buildDocument();
        return helper.sendRequest("put", helper.getEndpointAgentsProfile(), parameters, document2, 412, {
          "If-Match": badTag,
        });
      });

      it("Do not modify the resource", () => {
        return helper.sendRequest("get", helper.getEndpointAgentsProfile(), parameters, null, 200).then((
          res: any,
        ) => {
          let result = res.body;
          expect(result).toEqual(document);
        });
      });
    });

    describe("If put request is received without either header for a resource that already exists", () => {
      let parameters = helper.buildActivityProfile();
      let document = helper.buildDocument();
      let document2 = helper.buildDocument();

      beforeAll(() => {
        return helper
          .sendRequest("post", helper.getEndpointActivitiesProfile(), parameters, document, 204)
          .then((res: any) => {
            return helper
              .sendRequest("get", helper.getEndpointActivitiesProfile(), parameters, null, 200)
              .then((res: any) => {
                void res.headers.etag;
              });
          });
      });

      it("Return 409 conflict", () => {
        return helper.sendRequest("put", helper.getEndpointActivitiesProfile(), parameters, document2, 409);
      });

      it("Return error message explaining the situation", () => {
        return helper
          .sendRequest("put", helper.getEndpointActivitiesProfile(), parameters, document2, 409)
          .then((res: any) => {
            expect(res).toHaveProperty("text");
            expect(res.text.length).toBeGreaterThan(0);
          });
      });

      it("Do not modify the resource", () => {
        return helper
          .sendRequest("put", helper.getEndpointActivitiesProfile(), parameters, document2, 409)
          .then((res: any) => {
            return helper
              .sendRequest("get", helper.getEndpointActivitiesProfile(), parameters, null, 200)
              .then((res: any) => {
                expect(res.body).toEqual(document);
              });
          });
      });
    });
  });
});
