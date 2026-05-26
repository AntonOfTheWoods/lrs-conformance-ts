import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerContentTypeRequirementsSuite as registerSharedContentTypeRequirementsSuite } from "../shared/transport-requirements.ts";

export function registerContentTypeRequirementsSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  registerSharedContentTypeRequirementsSuite(runtime, context, {
    includeMultipartWithoutAttachmentsCases: true,
  });
}
