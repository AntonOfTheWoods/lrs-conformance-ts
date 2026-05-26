import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerAgentProfileResourceRequirementsSuite as registerSharedAgentProfileResourceRequirementsSuite } from "../shared/document-resource.ts";

export function registerAgentProfileResourceRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  registerSharedAgentProfileResourceRequirementsSuite(runtime, context, {
    includeLastModifiedCases: true,
  });
}
