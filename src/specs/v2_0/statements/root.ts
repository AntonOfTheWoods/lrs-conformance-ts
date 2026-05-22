import type { SuiteDefinition } from "../../../domain/contracts";
import { statementsFormattingSuite } from "./areas/formatting";
import { statementsAuthoritySuite } from "./areas/authority";
import { statementsAttachmentsSuite } from "./areas/attachments";
import { statementsResultAndObjectsSuite } from "./areas/result-and-objects";
import { statementsMetadataSuite } from "./areas/metadata";
import { statementsContextSuite } from "./areas/context";
import { statementsTransportSuite } from "./areas/transport";
import { statementsRepresentationSuite } from "./areas/representation";
import { statementsQueryValidationSuite } from "./areas/query-validation";
import { statementsQuerySuite } from "./areas/query";
import { statementsIdSuite } from "./areas/id";
import { statementsAdditionalDataTypesSuite } from "./areas/additional-data-types";
import { statementsSignedStatementsSuite } from "./areas/signed-statements";
import { statementsSpecialDataTypesSuite } from "./areas/special-data-types";

export const statementsSuite = {
  type: "suite",
  id: "v2.proof-slice.statements",
  title: "Statements",
  specVersion: "2.0.0",
  tags: ["proof-slice", "statements"],
  children: [
    statementsFormattingSuite,
    statementsAuthoritySuite,
    statementsAttachmentsSuite,
    statementsResultAndObjectsSuite,
    statementsMetadataSuite,
    statementsContextSuite,
    statementsTransportSuite,
    statementsRepresentationSuite,
    statementsQueryValidationSuite,
    statementsQuerySuite,
    statementsIdSuite,
    statementsAdditionalDataTypesSuite,
    statementsSignedStatementsSuite,
    statementsSpecialDataTypesSuite,
  ],
} as unknown as SuiteDefinition;

export const v2ProofSliceStatementsSuite = statementsSuite;
