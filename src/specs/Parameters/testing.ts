import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";
import type { JsonObject } from "../../describe-runtime/templates.ts";

type InvalidParameterType = boolean | number | JsonObject | undefined;
type ParameterMap = Record<string, unknown>;

interface ParameterSuiteDefinition {
  bodyFactory?: () => JsonObject;
  buildParameters: () => ParameterMap;
  invalidTypes: InvalidParameterType[];
  method: "DELETE" | "GET" | "POST" | "PUT";
  mutateParameters: (parameters: ParameterMap, invalidType: InvalidParameterType) => void;
  suiteTitle: string;
  testTitlePrefix: string;
  url: string;
}

function formatInvalidTypeForTitle(invalidType: InvalidParameterType): string {
  if (typeof invalidType === "undefined") {
    return "undefined";
  }

  if (typeof invalidType === "object" && invalidType !== null) {
    return "[object Object]";
  }

  return String(invalidType);
}

function registerParameterRejectionSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
  definition: ParameterSuiteDefinition,
): void {
  runtime.describe(definition.suiteTitle, () => {
    for (const invalidType of definition.invalidTypes) {
      runtime.it(`${definition.testTitlePrefix}${formatInvalidTypeForTitle(invalidType)}`, async () => {
        const parameters = definition.buildParameters();
        definition.mutateParameters(parameters, invalidType);

        const response = await context.sendRequest({
          method: definition.method,
          path: definition.url,
          query: parameters,
          body: definition.bodyFactory?.(),
        });

        if (response.status !== 400) {
          throw new Error(`Expected status 400 but received ${response.status}.`);
        }
      });
    }
  });
}

/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xAPI_LRS_Test/blob/master/TestingRequirements.md
 *
 * https://github.com/adlnet/xAPI_LRS_Test/blob/master/TestingRequirements.md
 *
 */
export function registerParametersTestingSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  runtime.describe("These are tests with specific parameters that need to be met", () => {
    /**  XAPI-00277, Communication 2.6 Agent Profile Resource
     * An LRS's Agent Profile API rejects a PUT request with "profileId" as a parameter if it is not type "String" with error code 400 Bad Request
     */
    registerParameterRejectionSuite(runtime, context, {
      suiteTitle:
        'An LRS\'s Agent Profile API rejects a PUT request with "profileId" as a parameter if it is not type "String" with error code 400 Bad Request (format, 7.6.table3.row2.a, XAPI-00277)',
      invalidTypes: [1, true, { key: "value" }],
      testTitlePrefix: 'Should reject PUT with "profileId" with type ',
      buildParameters: () => context.buildAgentProfile(),
      mutateParameters(parameters, invalidType) {
        parameters.profileId = invalidType ?? parameters.profileId;
      },
      method: "PUT",
      url: context.getEndpointAgentsProfile(),
      bodyFactory: () => context.buildDocument(),
    });

    /**  XAPI-00276, Communication 2.6 Agent Profile Resource
     * An LRS's Agent Profile API rejects a POST request with "profileId" as a parameter if it is not type "String" with error code 400 Bad Request
     */
    registerParameterRejectionSuite(runtime, context, {
      suiteTitle:
        'An LRS\'s Agent Profile API rejects a POST request with "profileId" as a parameter if it is not type "String" with error code 400 Bad Request (format, 7.6.table3.row2.a, XAPI-00276)',
      invalidTypes: [1, true, { key: "value" }],
      testTitlePrefix: 'Should reject POST with "profileId" with type ',
      buildParameters: () => context.buildAgentProfile(),
      mutateParameters(parameters, invalidType) {
        parameters.profileId = invalidType ?? parameters.profileId;
      },
      method: "POST",
      url: context.getEndpointAgentsProfile(),
      bodyFactory: () => context.buildDocument(),
    });

    registerParameterRejectionSuite(runtime, context, {
      suiteTitle:
        'An LRS\'s Agent Profile Resource rejects a DELETE request with "profileId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.6.s3.table1.row2)',
      invalidTypes: [1, true, { key: "value" }],
      testTitlePrefix: 'Should reject DELETE with "profileId" with type ',
      buildParameters: () => context.buildAgentProfile(),
      mutateParameters(parameters, invalidType) {
        parameters.agent = invalidType;
      },
      method: "DELETE",
      url: context.getEndpointAgentsProfile(),
      bodyFactory: () => context.buildDocument(),
    });

    /**  XAPI-00228, Communication 2.3 State Resource
     * An LRS's State API rejects a PUT request with "stateId" as a parameter if it is not type "String" with error code 400 Bad Request
     */
    registerParameterRejectionSuite(runtime, context, {
      suiteTitle:
        'An LRS\'s State API rejects a PUT request with "stateId" as a parameter if it is not type "String" with error code 400 Bad Request (format, 7.4.table1.row1.a, XAPI-00228)',
      invalidTypes: [1, true, { key: "value" }],
      testTitlePrefix: 'Should reject PUT with "stateId" with type ',
      buildParameters: () => context.buildState(),
      mutateParameters(parameters, invalidType) {
        parameters.stateId = invalidType ?? parameters.stateId;
      },
      method: "PUT",
      url: context.getEndpointActivitiesState(),
      bodyFactory: () => context.buildDocument(),
    });

    registerParameterRejectionSuite(runtime, context, {
      suiteTitle:
        'An LRS\'s State Resource rejects a PUT request with "activityId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.3.s3.table1.row1)',
      invalidTypes: [{ key: "value" }, 1, true, undefined],
      testTitlePrefix: "Should State Resource reject a PUT request with activityId type ",
      buildParameters: () => context.buildState(),
      mutateParameters(parameters, invalidType) {
        parameters.activityId = invalidType;
      },
      method: "PUT",
      url: context.getEndpointActivitiesState(),
      bodyFactory: () => context.buildDocument(),
    });

    /**  XAPI-00226, Communication 2.3 State Resource
     * An LRS's State API rejects a POST request with "stateId" as a parameter if it is not type "String" with error code 400 Bad Request
     */
    registerParameterRejectionSuite(runtime, context, {
      suiteTitle:
        'An LRS\'s State API rejects a POST request with "stateId" as a parameter if it is not type "String" with error code 400 Bad Request (format, 7.4.table1.row1.a, XAPI-00226)',
      invalidTypes: [1, true, { key: "value" }],
      testTitlePrefix: 'Should reject POST with "stateId" with type ',
      buildParameters: () => context.buildState(),
      mutateParameters(parameters, invalidType) {
        parameters.stateId = invalidType ?? parameters.stateId;
      },
      method: "POST",
      url: context.getEndpointActivitiesState(),
      bodyFactory: () => context.buildDocument(),
    });

    registerParameterRejectionSuite(runtime, context, {
      suiteTitle:
        'An LRS\'s State Resource rejects a POST request with "activityId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.3.s3.table1.row1)',
      invalidTypes: [1, true, { key: "value" }, undefined],
      testTitlePrefix: "Should reject PUT State with stateId type : ",
      buildParameters: () => context.buildState(),
      mutateParameters(parameters, invalidType) {
        parameters.activityId = invalidType;
      },
      method: "POST",
      url: context.getEndpointActivitiesState(),
      bodyFactory: () => context.buildDocument(),
    });

    /**  XAPI-00225, Communication 2.3 State Resources
     * An LRS's State API rejects a GET request with "stateId" as a parameter if it is not type "String" with error code 400 Bad Request
     */
    registerParameterRejectionSuite(runtime, context, {
      suiteTitle:
        'An LRS\'s State API rejects a GET request with "stateId" as a parameter if it is not type "String" with error code 400 Bad Request (format, 7.4.table1.row1.a, XAPI-00225)',
      invalidTypes: [1, true, { key: "value" }],
      testTitlePrefix: 'Should reject GET with "stateId" with type ',
      buildParameters: () => context.buildState(),
      mutateParameters(parameters, invalidType) {
        parameters.stateId = invalidType ?? parameters.stateId;
      },
      method: "GET",
      url: context.getEndpointActivitiesState(),
    });

    registerParameterRejectionSuite(runtime, context, {
      suiteTitle:
        'An LRS\'s State Resource rejects a GET request with "activityId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.3.s3.table1.row1)',
      invalidTypes: [1, true, { key: "value" }, undefined],
      testTitlePrefix: 'Should reject GET with "activityId" with type ',
      buildParameters: () => context.buildState(),
      mutateParameters(parameters, invalidType) {
        parameters.activityId = invalidType;
      },
      method: "GET",
      url: context.getEndpointActivitiesState(),
    });

    /**  XAPI-00224, Communication 2.3 State Resource
     * An LRS's State API rejects a DELETE request with "stateId" as a parameter if it is not type "String" with error code 400 Bad Request
     */
    registerParameterRejectionSuite(runtime, context, {
      suiteTitle:
        'An LRS\'s State Resource rejects a DELETE request with "activityId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.3.s3.table1.row1)',
      invalidTypes: [1, true, { key: "value" }, undefined],
      testTitlePrefix: 'Should reject DELETE with "activityId" with type ',
      buildParameters: () => context.buildState(),
      mutateParameters(parameters, invalidType) {
        parameters.activityId = invalidType;
      },
      method: "DELETE",
      url: context.getEndpointActivitiesState(),
    });
  });

  /**  XAPI-00306, Communication 2.7 Activity Profile Resource
   * An LRS's Activity Profile API API rejects a POST request with "profileId" as a parameter if it is not type "String" with error code 400 Bad Request (format, 7.5.table2.row2.a)
   */
  registerParameterRejectionSuite(runtime, context, {
    suiteTitle:
      'An LRS\'s Activity Profile Resource rejects a POST request without "profileId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.7.s3.table1.row2, XAPI-00306)',
    invalidTypes: [1, true, { key: "value" }],
    testTitlePrefix: 'Should reject POST with "profileId" with type ',
    buildParameters: () => context.buildActivityProfile(),
    mutateParameters(parameters, invalidType) {
      parameters.agent = invalidType;
    },
    method: "POST",
    url: context.getEndpointActivitiesProfile(),
    bodyFactory: () => context.buildDocument(),
  });

  registerParameterRejectionSuite(runtime, context, {
    suiteTitle:
      'An LRS\'s Activity Profile Resource rejects a PUT request with "activityId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.7.s3.table1.row1)',
    invalidTypes: [1, true, { key: "value" }],
    testTitlePrefix: 'Should reject PUT with "activityId" with type ',
    buildParameters: () => context.buildActivityProfile(),
    mutateParameters(parameters, invalidType) {
      parameters.activityId = invalidType;
    },
    method: "PUT",
    url: context.getEndpointActivitiesProfile(),
    bodyFactory: () => context.buildDocument(),
  });

  registerParameterRejectionSuite(runtime, context, {
    suiteTitle:
      'An LRS\'s Activity Profile Resource rejects a POST request with "activityId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.7.s3.table1.row1)',
    invalidTypes: [1, true, { key: "value" }],
    testTitlePrefix: 'Should reject POST with "activityId" with type ',
    buildParameters: () => context.buildActivityProfile(),
    mutateParameters(parameters, invalidType) {
      parameters.activityId = invalidType;
    },
    method: "POST",
    url: context.getEndpointActivitiesProfile(),
    bodyFactory: () => context.buildDocument(),
  });

  registerParameterRejectionSuite(runtime, context, {
    suiteTitle:
      'An LRS\'s Activity Profile Resource rejects a DELETE request with "activityId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.7.s3.table1.row1)',
    invalidTypes: [1, true, { key: "value" }],
    testTitlePrefix: 'Should reject DELETE with "activityId" with type ',
    buildParameters: () => context.buildActivityProfile(),
    mutateParameters(parameters, invalidType) {
      parameters.activityId = invalidType;
    },
    method: "DELETE",
    url: context.getEndpointActivitiesProfile(),
  });

  /**  XAPI-00305, Communication 2.7 Activity Profile Resource
   * An LRS's Activity Profile API rejects a DELETE request with "profileId" as a parameter if it is not type "String" with error code 400 Bad Request
   */
  registerParameterRejectionSuite(runtime, context, {
    suiteTitle:
      'An LRS\'s Activity Profile Resource rejects a DELETE request with "profileId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.7.s4.table1.row2, XAPI-00305)',
    invalidTypes: [1, true, { key: "value" }],
    testTitlePrefix: 'Should reject DELETE with "activityId" with type ',
    buildParameters: () => context.buildActivityProfile(),
    mutateParameters(parameters, invalidType) {
      parameters.profileId = invalidType ?? parameters.profileId;
    },
    method: "DELETE",
    url: context.getEndpointActivitiesProfile(),
    bodyFactory: () => context.buildDocument(),
  });

  registerParameterRejectionSuite(runtime, context, {
    suiteTitle:
      'An LRS\'s Activity Profile Resource rejects a GET request without "profileId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.7.s3.table1.row2)',
    invalidTypes: [1, true, { key: "value" }],
    testTitlePrefix: 'Should reject GET with "profileId" with type ',
    buildParameters: () => context.buildActivityProfile(),
    mutateParameters(parameters, invalidType) {
      parameters.profileId = invalidType ?? parameters.profileId;
    },
    method: "GET",
    url: context.getEndpointActivitiesProfile(),
  });

  registerParameterRejectionSuite(runtime, context, {
    suiteTitle:
      'An LRS\'s Activity Profile Resource rejects a GET request with "activityId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.7.s3.table1.row1, Communication 2.7.s4.table1.row1)',
    invalidTypes: [1, true, { key: "value" }],
    testTitlePrefix: 'Should reject GET with "activityId" with type ',
    buildParameters: () => context.buildActivityProfile(),
    mutateParameters(parameters, invalidType) {
      parameters.activityId = invalidType;
    },
    method: "GET",
    url: context.getEndpointActivitiesProfile(),
  });

  /**  XAPI-00307, Communication 2.7 Activity Profile Resource
   * An LRS's Activity Profile API rejects a PUT request with "profileId" as a parameter if it is not type "String" with error code 400 Bad Request (format, 7.5.table2.row2.a)
   */
  registerParameterRejectionSuite(runtime, context, {
    suiteTitle:
      'An LRS\'s Activity Profile Resource rejects a PUT request without "profileId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.7.s3.table1.row2, XAPI-00307)',
    invalidTypes: [1, true, { key: "value" }],
    testTitlePrefix: 'Should reject PUT with "profileId" with type ',
    buildParameters: () => context.buildActivityProfile(),
    mutateParameters(parameters, invalidType) {
      parameters.agent = invalidType;
    },
    method: "PUT",
    url: context.getEndpointActivitiesProfile(),
    bodyFactory: () => context.buildDocument(),
  });
}
