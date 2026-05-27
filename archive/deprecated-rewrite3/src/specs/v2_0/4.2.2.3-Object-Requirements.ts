import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerObjectPropertyRequirementsSuite as registerSharedObjectPropertyRequirementsSuite } from "../shared/object-property.ts";

export function registerObjectPropertyRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  registerSharedObjectPropertyRequirementsSuite(runtime, context);
}
