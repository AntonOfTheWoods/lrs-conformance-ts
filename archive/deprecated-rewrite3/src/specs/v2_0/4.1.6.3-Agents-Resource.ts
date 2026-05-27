import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerAgentsResourceRequirementsSuite as registerSharedAgentsResourceRequirementsSuite } from "../shared/read-only-resource.ts";

export function registerAgentsResourceRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  registerSharedAgentsResourceRequirementsSuite(runtime, context);
}
