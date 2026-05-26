import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerStateResourceRequirementsSuite as registerSharedStateResourceRequirementsSuite } from "../shared/document-resource.ts";

export function registerStateResourceRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  registerSharedStateResourceRequirementsSuite(runtime, context, {
    includeLastModifiedCases: true,
  });
}
