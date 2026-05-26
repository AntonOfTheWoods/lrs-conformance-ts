import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerAuthenticationRequirementsSuite as registerSharedAuthenticationRequirementsSuite } from "../shared/protocol-requirements.ts";

export function registerAuthenticationRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  registerSharedAuthenticationRequirementsSuite(runtime, context);
}
