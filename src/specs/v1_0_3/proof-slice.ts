import type { RegistryDefinition } from "../../domain/contracts";
import { RegistryBuilder } from "../../registry/builder";
import {
  createV103StatementQueryProofSliceSuite,
  createV103StatementResourceProofSliceSuite,
  createV103StatementsAdditionalDataTypesProofSliceSuite,
  createV103StatementsAttachmentsProofSliceSuite,
  createV103StatementsAuthorityProofSliceSuite,
  createV103StatementsContextProofSliceSuite,
  createV103StatementsFormattingProofSliceSuite,
  createV103StatementsIdProofSliceSuite,
  createV103StatementsMetadataProofSliceSuite,
  createV103StatementsQueryValidationProofSliceSuite,
  createV103StatementsRepresentationProofSliceSuite,
  createV103StatementsResultAndObjectsProofSliceSuite,
  createV103StatementsSignedStatementsProofSliceSuite,
  createV103StatementsSpecialDataTypesProofSliceSuite,
} from "./statements";
import {
  createV103AboutResourceProofSliceSuite,
  createV103ActivitiesResourceProofSliceSuite,
  createV103ActivityProfileResourceProofSliceSuite,
  createV103AgentProfileResourceProofSliceSuite,
  createV103AgentsResourceProofSliceSuite,
  createV103CommunicationProofSliceSuite,
  createV103StateResourceProofSliceSuite,
} from "./resources";
import {
  createV103ActivityProfileValidationPackAProofSliceSuite,
  createV103ActivityProfileValidationPackBProofSliceSuite,
  createV103AgentProfileValidationPackAProofSliceSuite,
  createV103StateResourceValidationPackAProofSliceSuite,
} from "./packs";
import { specVersion } from "./shared";

export function createV103ProofSliceRegistry(): RegistryDefinition {
  const builder = new RegistryBuilder();
  builder.addSuite(specVersion, createV103StatementsFormattingProofSliceSuite());
  builder.addSuite(specVersion, createV103StatementsResultAndObjectsProofSliceSuite());
  builder.addSuite(specVersion, createV103StatementsContextProofSliceSuite());
  builder.addSuite(specVersion, createV103StatementsRepresentationProofSliceSuite());
  builder.addSuite(specVersion, createV103StatementsSpecialDataTypesProofSliceSuite());
  builder.addSuite(specVersion, createV103StatementsIdProofSliceSuite());
  builder.addSuite(specVersion, createV103StatementsMetadataProofSliceSuite());
  builder.addSuite(specVersion, createV103StatementsAttachmentsProofSliceSuite());
  builder.addSuite(specVersion, createV103StatementsAuthorityProofSliceSuite());
  builder.addSuite(specVersion, createV103StatementsSignedStatementsProofSliceSuite());
  builder.addSuite(specVersion, createV103StatementsAdditionalDataTypesProofSliceSuite());
  builder.addSuite(specVersion, createV103StatementsQueryValidationProofSliceSuite());
  builder.addSuite(specVersion, createV103StatementResourceProofSliceSuite());
  builder.addSuite(specVersion, createV103StatementQueryProofSliceSuite());
  builder.addSuite(specVersion, createV103CommunicationProofSliceSuite());
  builder.addSuite(specVersion, createV103AboutResourceProofSliceSuite());
  builder.addSuite(specVersion, createV103ActivitiesResourceProofSliceSuite());
  builder.addSuite(specVersion, createV103StateResourceProofSliceSuite());
  builder.addSuite(specVersion, createV103StateResourceValidationPackAProofSliceSuite());
  builder.addSuite(specVersion, createV103ActivityProfileResourceProofSliceSuite());
  builder.addSuite(specVersion, createV103ActivityProfileValidationPackAProofSliceSuite());
  builder.addSuite(specVersion, createV103ActivityProfileValidationPackBProofSliceSuite());
  builder.addSuite(specVersion, createV103AgentsResourceProofSliceSuite());
  builder.addSuite(specVersion, createV103AgentProfileResourceProofSliceSuite());
  builder.addSuite(specVersion, createV103AgentProfileValidationPackAProofSliceSuite());
  return builder.build();
}

export {
  createV103AboutResourceProofSliceSuite,
  createV103ActivitiesResourceProofSliceSuite,
  createV103ActivityProfileResourceProofSliceSuite,
  createV103ActivityProfileValidationPackAProofSliceSuite,
  createV103ActivityProfileValidationPackBProofSliceSuite,
  createV103AgentProfileResourceProofSliceSuite,
  createV103AgentProfileValidationPackAProofSliceSuite,
  createV103AgentsResourceProofSliceSuite,
  createV103CommunicationProofSliceSuite,
  createV103StatementQueryProofSliceSuite,
  createV103StatementResourceProofSliceSuite,
  createV103StateResourceProofSliceSuite,
  createV103StateResourceValidationPackAProofSliceSuite,
  createV103StatementsAdditionalDataTypesProofSliceSuite,
  createV103StatementsAttachmentsProofSliceSuite,
  createV103StatementsAuthorityProofSliceSuite,
  createV103StatementsContextProofSliceSuite,
  createV103StatementsFormattingProofSliceSuite,
  createV103StatementsIdProofSliceSuite,
  createV103StatementsMetadataProofSliceSuite,
  createV103StatementsQueryValidationProofSliceSuite,
  createV103StatementsRepresentationProofSliceSuite,
  createV103StatementsResultAndObjectsProofSliceSuite,
  createV103StatementsSignedStatementsProofSliceSuite,
  createV103StatementsSpecialDataTypesProofSliceSuite,
};
