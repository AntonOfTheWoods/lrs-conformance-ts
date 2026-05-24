import type { RegistryDefinition } from "../../domain/contracts";
import { RegistryBuilder } from "../../registry/builder";
import { createV103ActivitiesResourceProofSliceSuite } from "./activities-resource";
import { createV103ActivityProfileResourceProofSliceSuite } from "./activity-profile-resource";
import { createV103AgentsResourceProofSliceSuite } from "./agents-resource";
import { createV103AgentProfileResourceProofSliceSuite } from "./agent-profile-resource";
import { createV103AboutResourceProofSliceSuite } from "./about-resource";
import { specVersion } from "./shared";

export function createV103ProofSliceRegistry(): RegistryDefinition {
  const builder = new RegistryBuilder();
  builder.addSuite(specVersion, createV103AboutResourceProofSliceSuite());
  builder.addSuite(specVersion, createV103ActivitiesResourceProofSliceSuite());
  builder.addSuite(specVersion, createV103ActivityProfileResourceProofSliceSuite());
  builder.addSuite(specVersion, createV103AgentsResourceProofSliceSuite());
  builder.addSuite(specVersion, createV103AgentProfileResourceProofSliceSuite());
  return builder.build();
}

export {
  createV103AboutResourceProofSliceSuite,
  createV103ActivitiesResourceProofSliceSuite,
  createV103ActivityProfileResourceProofSliceSuite,
  createV103AgentsResourceProofSliceSuite,
  createV103AgentProfileResourceProofSliceSuite,
};
