import type { SuiteDefinition } from "../../../domain/contracts";
import { v2ProofSliceStatementsFormattingSuite } from "./root/v2-proof-slice-statements-formatting";
import { v2ProofSliceStatementsAuthoritySuite } from "./root/v2-proof-slice-statements-authority";
import { v2ProofSliceStatementsAttachmentsSuite } from "./root/v2-proof-slice-statements-attachments";
import { v2ProofSliceStatementsResultAndObjectsSuite } from "./root/v2-proof-slice-statements-result-and-objects";
import { v2ProofSliceStatementsMetadataSuite } from "./root/v2-proof-slice-statements-metadata";
import { v2ProofSliceStatementsContextSuite } from "./root/v2-proof-slice-statements-context";
import { v2ProofSliceStatementsTransportSuite } from "./root/v2-proof-slice-statements-transport";
import { v2ProofSliceStatementsRepresentationSuite } from "./root/v2-proof-slice-statements-representation";
import { v2ProofSliceStatementsQueryValidationSuite } from "./root/v2-proof-slice-statements-query-validation";
import { v2ProofSliceStatementsQuerySuite } from "./root/v2-proof-slice-statements-query";
import { v2ProofSliceStatementsIdSuite } from "./root/v2-proof-slice-statements-id";
import { v2ProofSliceStatementsAdditionalDataTypesSuite } from "./root/v2-proof-slice-statements-additional-data-types";
import { v2ProofSliceStatementsSignedStatementsSuite } from "./root/v2-proof-slice-statements-signed-statements";
import { v2ProofSliceStatementsSpecialDataTypesSuite } from "./root/v2-proof-slice-statements-special-data-types";

export const v2ProofSliceStatementsSuite = {
  "type": "suite",
  "id": "v2.proof-slice.statements",
  "title": "Statements",
  "specVersion": "2.0.0",
  "tags": [
    "proof-slice",
    "statements"
  ]
,
  "children": [
    v2ProofSliceStatementsFormattingSuite,
    v2ProofSliceStatementsAuthoritySuite,
    v2ProofSliceStatementsAttachmentsSuite,
    v2ProofSliceStatementsResultAndObjectsSuite,
    v2ProofSliceStatementsMetadataSuite,
    v2ProofSliceStatementsContextSuite,
    v2ProofSliceStatementsTransportSuite,
    v2ProofSliceStatementsRepresentationSuite,
    v2ProofSliceStatementsQueryValidationSuite,
    v2ProofSliceStatementsQuerySuite,
    v2ProofSliceStatementsIdSuite,
    v2ProofSliceStatementsAdditionalDataTypesSuite,
    v2ProofSliceStatementsSignedStatementsSuite,
    v2ProofSliceStatementsSpecialDataTypesSuite,
  ]
} as unknown as SuiteDefinition;
