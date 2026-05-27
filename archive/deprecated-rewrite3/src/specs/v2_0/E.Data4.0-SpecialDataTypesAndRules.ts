import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerSpecialDataTypesAndRulesSuite as registerSharedSpecialDataTypesAndRulesSuite } from "../shared/special-data-types.ts";

export function registerSpecialDataTypesAndRulesSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  registerSharedSpecialDataTypesAndRulesSuite(runtime, context);
}
