import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerVersioningRequirementsSuite as registerSharedVersioningRequirementsSuite } from "../shared/protocol-requirements.ts";

export function registerVersioningRequirementsSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  registerSharedVersioningRequirementsSuite(runtime, context);
}
