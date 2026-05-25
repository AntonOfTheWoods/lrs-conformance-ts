import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerActorPropertyRequirementsSuite as registerSharedActorPropertyRequirementsSuite } from "../shared/actor-property.ts";

export function registerActorPropertyRequirementsSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  registerSharedActorPropertyRequirementsSuite(runtime, context);
}