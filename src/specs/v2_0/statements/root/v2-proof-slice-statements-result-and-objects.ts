import type { SuiteDefinition } from "../../../../domain/contracts";
import { v2ProofSliceStatementsResultAndObjectsResultSuite } from "./v2-proof-slice-statements-result-and-objects/v2-proof-slice-statements-result-and-objects-result";
import { v2ProofSliceStatementsResultAndObjectsActivityObjectSuite } from "./v2-proof-slice-statements-result-and-objects/v2-proof-slice-statements-result-and-objects-activity-object";
import { v2ProofSliceStatementsResultAndObjectsStatementRefSuite } from "./v2-proof-slice-statements-result-and-objects/v2-proof-slice-statements-result-and-objects-statement-ref";
import { v2ProofSliceStatementsResultAndObjectsSubstatementSuite } from "./v2-proof-slice-statements-result-and-objects/v2-proof-slice-statements-result-and-objects-substatement";

export const v2ProofSliceStatementsResultAndObjectsSuite = {
  "type": "suite",
  "id": "v2.proof-slice.statements.result-and-objects",
  "title": "Statement Result And Object Requirements",
  "specVersion": "2.0.0",
  "tags": [
    "result",
    "object"
  ]
,
  "children": [
    v2ProofSliceStatementsResultAndObjectsResultSuite,
    v2ProofSliceStatementsResultAndObjectsActivityObjectSuite,
    v2ProofSliceStatementsResultAndObjectsStatementRefSuite,
    v2ProofSliceStatementsResultAndObjectsSubstatementSuite,
  ]
} as unknown as SuiteDefinition;
