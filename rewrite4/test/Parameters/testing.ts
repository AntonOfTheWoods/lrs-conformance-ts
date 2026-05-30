/* Testing if I can make a quick set of dummy tests to explore the possibility o fadding test profiles.  This is copied and pasted from the non_templating file. */

/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xAPI_LRS_Test/blob/master/TestingRequirements.md
 *
 * https://github.com/adlnet/xAPI_LRS_Test/blob/master/TestingRequirements.md
 *
 */
import helperImport from "../helper.ts";

const helper = helperImport as any;
/**
 * Sends an HTTP request using supertest
 * @param {string} type ex. GET, POST, PUT, DELETE and HEAD
 * @param {string} url url to send request too
 * @param {json} params query params to append onto url. Params get urlencoded
 * @param body
 * @param {number} expect the result of the request
 * @returns {*} promise
 */
function sendRequest(type: string, url: string, params: unknown, body: unknown, expect: number): any {
  return helper.sendRequest(type, url, params as Record<string, unknown> | undefined, body as any, expect);
}

describe("These are tests with specific parameters that need to be met", function () {
  /**  XAPI-00277, Communication 2.6 Agent Profile Resource
   * An LRS's Agent Profile API rejects a PUT request with "profileId" as a parameter if it is not type "String" with error code 400 Bad Request
   */
  describe('An LRS\'s Agent Profile API rejects a PUT request with "profileId" as a parameter if it is not type "String" with error code 400 Bad Request (format, 7.6.table3.row2.a, XAPI-00277)', function () {
    const document = helper.buildDocument();
    const invalidTypes = [1, true, { key: "value" }];
    invalidTypes.forEach(function (type) {
      it('Should reject PUT with "profileId" with type ' + type, function () {
        const parameters = helper.buildAgentProfile();
        parameters.profileId = type;
        return sendRequest("put", helper.getEndpointAgentsProfile(), parameters, document, 400);
      });
    });
  });

  /**  XAPI-00276, Communication 2.6 Agent Profile Resource
   * An LRS's Agent Profile API rejects a POST request with "profileId" as a parameter if it is not type "String" with error code 400 Bad Request
   */
  describe('An LRS\'s Agent Profile API rejects a POST request with "profileId" as a parameter if it is not type "String" with error code 400 Bad Request (format, 7.6.table3.row2.a, XAPI-00276)', function () {
    const document = helper.buildDocument();
    const invalidTypes = [1, true, { key: "value" }];
    invalidTypes.forEach(function (type) {
      it('Should reject POST with "profileId" with type ' + type, function () {
        const parameters = helper.buildAgentProfile();
        parameters.profileId = type;
        return sendRequest("post", helper.getEndpointAgentsProfile(), parameters, document, 400);
      });
    });
  });

  // Type "String" - likely to be reworded or removed
  describe('An LRS\'s Agent Profile Resource rejects a DELETE request with "profileId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.6.s3.table1.row2)', function () {
    const document = helper.buildDocument();
    const invalidTypes = [1, true, { key: "value" }];
    invalidTypes.forEach(function (type) {
      it('Should reject DELETE with "profileId" with type ' + type, function () {
        const parameters = helper.buildAgentProfile();
        parameters.agent = type;
        return helper.sendRequest("delete", helper.getEndpointAgentsProfile(), parameters, document, 400);
      });
    });
  });

  /**  XAPI-00228, Communication 2.3 State Resource
   * An LRS's State API rejects a PUT request with "stateId" as a parameter if it is not type "String" with error code 400 Bad Request
   */
  describe('An LRS\'s State API rejects a PUT request with "stateId" as a parameter if it is not type "String" with error code 400 Bad Request (format, 7.4.table1.row1.a)', function () {
    const document = helper.buildDocument();
    const invalidTypes = [1, true, { key: "value" }];
    invalidTypes.forEach(function (type) {
      it('Should reject PUT with "stateId" with type ' + type, function () {
        const parameters = helper.buildState();
        parameters.stateId = type;
        return sendRequest("put", helper.getEndpointActivitiesState(), parameters, document, 400);
      });
    });
  });
  describe('An LRS\'s State Resource rejects a PUT request with "activityId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.3.s3.table1.row1)', function () {
    const invalidTypes = [{ key: "value" }, 1, true, undefined];
    invalidTypes.forEach(function (type) {
      it("Should State Resource reject a PUT request with activityId type " + type, function () {
        const parameters = helper.buildState();
        const document = helper.buildDocument();
        parameters.activityId = type;
        return helper.sendRequest("put", helper.getEndpointActivitiesState(), parameters, document, 400);
      });
    });
  });

  /**  XAPI-00226, Communication 2.3 State Resource
   * An LRS's State API rejects a POST request with "stateId" as a parameter if it is not type "String" with error code 400 Bad Request
   */
  describe('An LRS\'s State API rejects a POST request with "stateId" as a parameter if it is not type "String" with error code 400 Bad Request (format, 7.4.table1.row1.a, XAPI-00226)', function () {
    const document = helper.buildDocument();
    const invalidTypes = [1, true, { key: "value" }];
    invalidTypes.forEach(function (type) {
      it('Should reject POST with "stateId" with type ' + type, function () {
        const parameters = helper.buildState();
        parameters.stateId = type;
        return sendRequest("post", helper.getEndpointActivitiesState(), parameters, document, 400);
      });
    });
  });
  describe('An LRS\'s State Resource rejects a POST request with "activityId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.3.s3.table1.row1)', function () {
    const document = helper.buildDocument();
    const invalidTypes = [1, true, { key: "value" }, undefined];
    invalidTypes.forEach(function (type) {
      it("Should reject PUT State with stateId type : " + type, function () {
        const parameters = helper.buildState();
        parameters.activityId = type;
        return helper.sendRequest("post", helper.getEndpointActivitiesState(), parameters, document, 400);
      });
    });
  });

  /**  XAPI-00225, Communication 2.3 State Resources
   * An LRS's State API rejects a GET request with "stateId" as a parameter if it is not type "String" with error code 400 Bad Request
   */
  describe('An LRS\'s State API rejects a GET request with "stateId" as a parameter if it is not type "String" with error code 400 Bad Request (format, 7.4.table1.row1.a, XAPI-00225)', function () {
    const document = helper.buildDocument();
    const invalidTypes = [1, true, { key: "value" }];
    invalidTypes.forEach(function (type) {
      it('Should reject GET with "stateId" with type ' + type, function () {
        const parameters = helper.buildState();
        parameters.stateId = type;
        return sendRequest("get", helper.getEndpointActivitiesState(), parameters, document, 400);
      });
    });
  });
  describe('An LRS\'s State Resource rejects a GET request with "activityId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.3.s3.table1.row1)', function () {
    const invalidTypes = [1, true, { key: "value" }, undefined];
    invalidTypes.forEach(function (type) {
      it('Should reject GET with "activityId" with type ' + type, function () {
        const parameters = helper.buildState();
        parameters.activityId = type;
        return helper.sendRequest("get", helper.getEndpointActivitiesState(), parameters, undefined, 400);
      });
    });
  });

  /**  XAPI-00224, Communication 2.3 State Resource
   * An LRS's State API rejects a DELETE request with "stateId" as a parameter if it is not type "String" with error code 400 Bad Request
   */
  describe('An LRS\'s State Resource rejects a DELETE request with "activityId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.3.s3.table1.row1)', function () {
    const invalidTypes = [1, true, { key: "value" }, undefined];
    invalidTypes.forEach(function (type) {
      it('Should reject DELETE with "activityId" with type ' + type, function () {
        const parameters = helper.buildState();
        parameters.activityId = type;
        return helper.sendRequest("delete", helper.getEndpointActivitiesState(), parameters, undefined, 400);
      });
    });
  });
});

//likely to be changed or removed
describe('An LRS\'s Activity Profile Resource rejects a PUT request with "activityId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.7.s3.table1.row1)', function () {
  const document = helper.buildDocument();
  const invalidTypes = [1, true, { key: "value" }];
  invalidTypes.forEach(function (type) {
    it('Should reject PUT with "activityId" with type ' + type, function () {
      const parameters = helper.buildActivityProfile();
      parameters.activityId = type;
      return helper.sendRequest("put", helper.getEndpointActivitiesProfile(), parameters, document, 400);
    });
  });
});
//likely to be changed or removed
describe('An LRS\'s Activity Profile Resource rejects a POST request with "activityId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.7.s3.table1.row1)', function () {
  const document = helper.buildDocument();
  const invalidTypes = [1, true, { key: "value" }];
  invalidTypes.forEach(function (type) {
    it('Should reject POST with "activityId" with type ' + type, function () {
      const parameters = helper.buildActivityProfile();
      parameters.activityId = type;
      return helper.sendRequest("post", helper.getEndpointActivitiesProfile(), parameters, document, 400);
    });
  });
});
//likely to be changed or removed
describe('An LRS\'s Activity Profile Resource rejects a DELETE request with "activityId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.7.s3.table1.row1)', function () {
  const invalidTypes = [1, true, { key: "value" }];
  invalidTypes.forEach(function (type) {
    it('Should reject DELETE with "activityId" with type ' + type, function () {
      const parameters = helper.buildActivityProfile();
      parameters.activityId = type;
      return helper.sendRequest("delete", helper.getEndpointActivitiesProfile(), parameters, undefined, 400);
    });
  });
});
/**  XAPI-00306, Communication 2.7 Activity Profile Resource
 * An LRS's Activity Profile API API rejects a POST request with "profileId" as a parameter if it is not type "String" with error code 400 Bad Request (format, 7.5.table2.row2.a)
 */
//Type "String" tests likely to be reworded or removed
describe('An LRS\'s Activity Profile Resource rejects a POST request without "profileId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.7.s3.table1.row2, XAPI-00306)', function () {
  const document = helper.buildDocument();
  const invalidTypes = [1, true, { key: "value" }];
  invalidTypes.forEach(function (type) {
    it('Should reject POST with "profileId" with type ' + type, function () {
      const parameters = helper.buildActivityProfile();
      parameters.agent = type;
      return helper.sendRequest("post", helper.getEndpointActivitiesProfile(), parameters, document, 400);
    });
  });
});

//Type "String" tests likely to be reworded or removed
describe('An LRS\'s Activity Profile Resource rejects a GET request without "profileId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.7.s3.table1.row2)', function () {
  const document = helper.buildDocument();
  const invalidTypes = [1, true, { key: "value" }];
  invalidTypes.forEach(function (type) {
    it('Should reject GET with "profileId" with type ' + type, function () {
      const parameters = helper.buildActivityProfile();
      parameters.profileId = type;
      return helper.sendRequest("get", helper.getEndpointActivitiesProfile(), parameters, document, 400);
    });
  });
});

describe('An LRS\'s Activity Profile Resource rejects a GET request with "activityId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.7.s3.table1.row1, Communication 2.7.s4.table1.row1)', function () {
  const invalidTypes = [1, true, { key: "value" }];
  invalidTypes.forEach(function (type) {
    it('Should reject GET with "activityId" with type ' + type, function () {
      const parameters = helper.buildActivityProfile();
      parameters.activityId = type;
      return helper.sendRequest("get", helper.getEndpointActivitiesProfile(), parameters, undefined, 400);
    });
  });
});
/**  XAPI-00305, Communication 2.7 Activity Profile Resource
 * An LRS's Activity Profile API rejects a DELETE request with "profileId" as a parameter if it is not type "String" with error code 400 Bad Request
 */
describe('An LRS\'s Activity Profile Resource rejects a DELETE request with "profileId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.7.s4.table1.row2, XAPI-00305)', function () {
  const document = helper.buildDocument();
  const invalidTypes = [1, true, { key: "value" }];
  invalidTypes.forEach(function (type) {
    it('Should reject DELETE with "activityId" with type ' + type, function () {
      const parameters = helper.buildActivityProfile();
      parameters.profileId = type;
      return helper.sendRequest("delete", helper.getEndpointActivitiesProfile(), parameters, document, 400);
    });
  });
});

/**  XAPI-00307, Communication 2.7 Activity Profile Resource
 * An LRS's Activity Profile API rejects a PUT request with "profileId" as a parameter if it is not type "String" with error code 400 Bad Request (format, 7.5.table2.row2.a)
 */
//Type "String" tests likely to be reworded or removed
describe('An LRS\'s Activity Profile Resource rejects a PUT request without "profileId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.7.s3.table1.row2, XAPI-00307)', function () {
  const document = helper.buildDocument();
  const invalidTypes = [1, true, { key: "value" }];
  invalidTypes.forEach(function (type) {
    it('Should reject PUT with "profileId" with type ' + type, function () {
      const parameters = helper.buildActivityProfile();
      parameters.agent = type;
      return helper.sendRequest("put", helper.getEndpointActivitiesProfile(), parameters, document, 400);
    });
  });
});
