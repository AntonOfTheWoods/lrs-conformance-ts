import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerConcurrencyRequirementsSuite as registerSharedConcurrencyRequirementsSuite } from "../shared/concurrency-requirements.ts";

export function registerConcurrencyRequirementsSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  registerSharedConcurrencyRequirementsSuite(runtime, context, {
    etagPattern: /^(W\/)?"[0-9a-f]{40}"$/i,
    includeIfNoneMatchCases: true,
    includeLegacyV1Cases: true,
    requirementTitle:
      "An LRS must support HTTP/1.1 entity tags (ETags) to implement optimistic concurrency control when handling Resources where PUT may overwrite existing data (Agent Profile, and Activity Profile, Communication 3.1, XAPI-00322)",
    resources: [
      {
        name: "Agent Profile",
        path: (currentContext) => currentContext.getEndpointAgentsProfile(),
        buildParams: (currentContext) => currentContext.buildAgentProfile(),
      },
      {
        name: "Activity Profile",
        path: (currentContext) => currentContext.getEndpointActivitiesProfile(),
        buildParams: (currentContext) => currentContext.buildActivityProfile(),
      },
    ],
  });
}
