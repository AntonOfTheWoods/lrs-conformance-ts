import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerAgentProfileResourceRequirementsSuite as registerSharedAgentProfileResourceRequirementsSuite } from "../shared/document-resource.ts";

export function registerAgentProfileResourceRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  registerSharedAgentProfileResourceRequirementsSuite(runtime, context, {
    nestAcceptanceUnderEndpoint: true,
    endpointSuitePutWithoutHeaderTitle:
      "An LRS's Agent Profile Resource upon processing a PUT request without an ETag header returns an error code and message (Communication 2.6.s3, XAPI-00273)",
  });
}
