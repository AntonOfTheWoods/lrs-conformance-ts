import { registerStatementPostConfigSuite } from "../../describe-runtime/config-suite.ts";
import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { actorPropertyGroups } from "./actor-property-groups.ts";

export function registerActorPropertyRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  runtime.describe("Actor Property Requirements (Data 2.4.2)", () => {
    /**  Matchup with Conformance Requirements Document
     * XAPI-00031 - in actors.js
     *
     * 2.4.2.1 Actor is Agent - may have more in agents.js
     * XAPI-00032 - in agents.js
     * XAPI-00033 - in agents.js
     * XAPI-00034 - in agents.js
     *
     * 2.4.2.2 Actor is Group
     * XAPI-00035 - in groups.js
     * XAPI-00036 - in groups.js
     * XAPI-00037 - in groups.js - multiple suites
     *
     * 2.4.2.3 Inverse Function Identifier
     * XAPI-00038 - in ifis.js - two suites
     * XAPI-00039 - in ifis.js
     * XAPI-00040 - in ifis.js
     * XAPI-00041 - in ifis.js
     *
     * 2.4.2.4 Account Object
     * XAPI-00042 - in accountobjects.js
     * XAPI-00043 - in accountobjects.js
     */
    registerStatementPostConfigSuite(runtime, context, actorPropertyGroups);
  });
}
