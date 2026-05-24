import type { RegistryDefinition } from "../../domain/contracts";
import { RegistryBuilder } from "../../registry/builder";
import { createV103ActivitiesResourceProofSliceSuite } from "./activities-resource";
import { createV103AboutResourceProofSliceSuite } from "./about-resource";
import { specVersion } from "./shared";

export function createV103ProofSliceRegistry(): RegistryDefinition {
  const builder = new RegistryBuilder();
  builder.addSuite(specVersion, createV103AboutResourceProofSliceSuite());
  builder.addSuite(specVersion, createV103ActivitiesResourceProofSliceSuite());
  return builder.build();
}

export { createV103AboutResourceProofSliceSuite, createV103ActivitiesResourceProofSliceSuite };
