import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerContextPropertyRequirementsSuite as registerSharedContextPropertyRequirementsSuite } from "../shared/context-property.ts";

export function registerContextPropertyRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  registerSharedContextPropertyRequirementsSuite(runtime, context);
}
