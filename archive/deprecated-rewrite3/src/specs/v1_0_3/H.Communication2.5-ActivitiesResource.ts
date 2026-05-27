import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerActivitiesResourceRequirementsSuite as registerSharedActivitiesResourceRequirementsSuite } from "../shared/read-only-resource.ts";

export function registerActivitiesResourceRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  registerSharedActivitiesResourceRequirementsSuite(runtime, context);
}
