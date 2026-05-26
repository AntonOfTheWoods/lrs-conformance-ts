import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerAboutResourceRequirementsSuite as registerSharedAboutResourceRequirementsSuite } from "../shared/read-only-resource.ts";

export function registerAboutResourceRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  registerSharedAboutResourceRequirementsSuite(runtime, context);
}
