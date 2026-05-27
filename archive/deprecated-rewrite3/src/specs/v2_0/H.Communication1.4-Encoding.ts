import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerEncodingRequirementsSuite as registerSharedEncodingRequirementsSuite } from "../shared/transport-requirements.ts";

export function registerEncodingRequirementsSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  registerSharedEncodingRequirementsSuite(runtime, context);
}
