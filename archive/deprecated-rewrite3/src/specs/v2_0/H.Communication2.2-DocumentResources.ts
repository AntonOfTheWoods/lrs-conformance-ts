import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerDocumentResourcesRequirementsSuite as registerSharedDocumentResourcesRequirementsSuite } from "../shared/document-resource.ts";

export function registerDocumentResourcesRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  registerSharedDocumentResourcesRequirementsSuite(runtime, context);
}
