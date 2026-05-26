import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerConcurrencyRequirementsSuite as registerSharedConcurrencyRequirementsSuite } from "../shared/concurrency-requirements.ts";

export function registerConcurrencyRequirementsSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  registerSharedConcurrencyRequirementsSuite(runtime, context, {
    etagPattern: /^(W\/)?".+"$/,
    includeIfMatchPostAndDeleteCases: true,
    requirementTitle:
      "xAPI uses HTTP 1.1 entity tags (ETags) to implement optimistic concurrency control in the following resources, where PUT, POST or DELETE are allowed to overwrite or remove existing data. (Communication 3.1, XAPI-00322)",
    resources: [
      {
        name: "Activity State",
        path: (currentContext) => currentContext.getEndpointActivitiesState(),
        buildParams: (currentContext) => currentContext.buildState(),
      },
      {
        name: "Activity Profile",
        path: (currentContext) => currentContext.getEndpointActivitiesProfile(),
        buildParams: (currentContext) => currentContext.buildActivityProfile(),
      },
      {
        name: "Agents Profile",
        path: (currentContext) => currentContext.getEndpointAgentsProfile(),
        buildParams: (currentContext) => currentContext.buildAgentProfile(),
      },
    ],
  });
}
