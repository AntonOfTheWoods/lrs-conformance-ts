import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerAlternateRequestSyntaxRequirementsSuite as registerSharedAlternateRequestSyntaxRequirementsSuite } from "../shared/alternate-request-syntax.ts";

export function registerAlternateRequestSyntaxRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  registerSharedAlternateRequestSyntaxRequirementsSuite(runtime, context);
}
