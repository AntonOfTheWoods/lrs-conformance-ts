import { RegistryBuilder } from "../../registry/builder";
import type { RegistryDefinition } from "../../domain/contracts";

import { specVersion } from "./shared";
import { createV20ProofSliceSuite } from "./statements";
import { createV20StateResourceProofSliceSuite } from "./state-resource";
import { createV20ActivityProfileResourceProofSliceSuite } from "./activity-profile-resource";
import { createV20AgentProfileResourceProofSliceSuite } from "./agent-profile-resource";
import { createV20AgentsResourceProofSliceSuite } from "./agents-resource";
import { createV20ActivitiesResourceProofSliceSuite } from "./activities-resource";
import { createV20AboutResourceProofSliceSuite } from "./about-resource";
import { createV20CommunicationProofSliceSuite } from "./communication";

export function createProofSliceRegistry(): RegistryDefinition {
  const builder = new RegistryBuilder();
  builder.addSuite(specVersion, createV20ProofSliceSuite());
  builder.addSuite(specVersion, createV20StateResourceProofSliceSuite());
  builder.addSuite(specVersion, createV20ActivityProfileResourceProofSliceSuite());
  builder.addSuite(specVersion, createV20AgentProfileResourceProofSliceSuite());
  builder.addSuite(specVersion, createV20AgentsResourceProofSliceSuite());
  builder.addSuite(specVersion, createV20ActivitiesResourceProofSliceSuite());
  builder.addSuite(specVersion, createV20AboutResourceProofSliceSuite());
  builder.addSuite(specVersion, createV20CommunicationProofSliceSuite());
  return builder.build();
}

export {
  createV20ProofSliceSuite,
  createV20StateResourceProofSliceSuite,
  createV20ActivityProfileResourceProofSliceSuite,
  createV20AgentProfileResourceProofSliceSuite,
  createV20AgentsResourceProofSliceSuite,
  createV20ActivitiesResourceProofSliceSuite,
  createV20AboutResourceProofSliceSuite,
  createV20CommunicationProofSliceSuite,
};
