import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

export function registerAlternateRequestSyntaxRequirementsSuite(
  runtime: DescribeRuntime,
  _context: DescribeRuntimeContext,
): void {
  runtime.describe("Alternate Request Syntax Requirements", () => {
    runtime.it("The LRS Spec does not mandate any properties regarding Alternate Request Syntax in xAPI 2.0", () => {
      // Intentionally empty to mirror the upstream xAPI 2.0 suite.
    });
  });
}
