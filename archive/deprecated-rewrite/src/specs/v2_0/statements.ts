import type { SuiteDefinition } from "../../domain/contracts";
import { v2ProofSliceStatementsSuite } from "./statements/root";

export function createV20ProofSliceSuite(): SuiteDefinition {
  return v2ProofSliceStatementsSuite;
}
