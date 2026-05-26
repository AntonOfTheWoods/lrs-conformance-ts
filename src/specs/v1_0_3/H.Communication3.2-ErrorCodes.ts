import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerErrorCodesRequirementsSuite as registerSharedErrorCodesRequirementsSuite } from "../shared/protocol-requirements.ts";

export function registerErrorCodesRequirementsSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  registerSharedErrorCodesRequirementsSuite(runtime, context);
}
