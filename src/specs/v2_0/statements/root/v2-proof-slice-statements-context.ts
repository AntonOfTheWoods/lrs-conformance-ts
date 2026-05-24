import type { SuiteDefinition } from "../../../../domain/contracts";
import { v2ProofSliceStatementsContextValidationSuite } from "./v2-proof-slice-statements-context/v2-proof-slice-statements-context-validation";
import { v2ProofSliceStatementsContextActivitiesSuite } from "./v2-proof-slice-statements-context/v2-proof-slice-statements-context-activities";
import { v2ProofSliceStatementsContextRoundtripSuite } from "./v2-proof-slice-statements-context/v2-proof-slice-statements-context-roundtrip";

export const v2ProofSliceStatementsContextSuite = {
  "type": "suite",
  "id": "v2.proof-slice.statements.context",
  "title": "Statement Context",
  "specVersion": "2.0.0",
  "tags": [
    "context"
  ]
,
  "children": [
    v2ProofSliceStatementsContextValidationSuite,
    v2ProofSliceStatementsContextActivitiesSuite,
    v2ProofSliceStatementsContextRoundtripSuite,
  ]
} as unknown as SuiteDefinition;
