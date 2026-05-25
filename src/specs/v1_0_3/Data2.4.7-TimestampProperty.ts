import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";
import { registerTimestampPropertyRequirementsSuite as registerSharedTimestampPropertyRequirementsSuite } from "../shared/timestamp-property.ts";

export function registerTimestampPropertyRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  registerSharedTimestampPropertyRequirementsSuite(runtime, context);
}
