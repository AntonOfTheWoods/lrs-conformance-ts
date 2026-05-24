import type { RegistryDefinition } from "../../domain/contracts";
import { RegistryBuilder } from "../../registry/builder";
import { createV103ActivitiesResourceProofSliceSuite } from "./activities-resource";
import { createV103ActivityProfileResourceProofSliceSuite } from "./activity-profile-resource";
import { createV103AgentsResourceProofSliceSuite } from "./agents-resource";
import { createV103AgentProfileResourceProofSliceSuite } from "./agent-profile-resource";
import { createV103AboutResourceProofSliceSuite } from "./about-resource";
import { createV103StateResourceProofSliceSuite } from "./state-resource";
import { createV103StatementResourceProofSliceSuite } from "./statements-resource";
import { createV103StatementQueryProofSliceSuite } from "./statements-query";
import { createV103StatementsFormattingProofSliceSuite } from "./statements-formatting";
import { createV103StatementsResultAndObjectsProofSliceSuite } from "./statements-result-and-objects";
import { createV103CommunicationProofSliceSuite } from "./communication";
import { specVersion } from "./shared";

export function createV103ProofSliceRegistry(): RegistryDefinition {
  const builder = new RegistryBuilder();
  builder.addSuite(specVersion, createV103StatementsFormattingProofSliceSuite());
  builder.addSuite(specVersion, createV103StatementsResultAndObjectsProofSliceSuite());
  builder.addSuite(specVersion, createV103StatementResourceProofSliceSuite());
  builder.addSuite(specVersion, createV103StatementQueryProofSliceSuite());
  builder.addSuite(specVersion, createV103CommunicationProofSliceSuite());
  builder.addSuite(specVersion, createV103AboutResourceProofSliceSuite());
  builder.addSuite(specVersion, createV103ActivitiesResourceProofSliceSuite());
  builder.addSuite(specVersion, createV103StateResourceProofSliceSuite());
  builder.addSuite(specVersion, createV103ActivityProfileResourceProofSliceSuite());
  builder.addSuite(specVersion, createV103AgentsResourceProofSliceSuite());
  builder.addSuite(specVersion, createV103AgentProfileResourceProofSliceSuite());
  return builder.build();
}

export {
  createV103StatementsFormattingProofSliceSuite,
  createV103StatementsResultAndObjectsProofSliceSuite,
  createV103StatementResourceProofSliceSuite,
  createV103StatementQueryProofSliceSuite,
  createV103CommunicationProofSliceSuite,
  createV103AboutResourceProofSliceSuite,
  createV103ActivitiesResourceProofSliceSuite,
  createV103StateResourceProofSliceSuite,
  createV103ActivityProfileResourceProofSliceSuite,
  createV103AgentsResourceProofSliceSuite,
  createV103AgentProfileResourceProofSliceSuite,
};
