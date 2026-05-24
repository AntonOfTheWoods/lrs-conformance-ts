import type { SuiteDefinition } from "../../../../domain/contracts";
import { v2StatementsQueryEndpointGetCase } from "./v2-proof-slice-statements-query/v2-statements-query-endpoint-get";
import { v2StatementsQueryGetAcceptedCase } from "./v2-proof-slice-statements-query/v2-statements-query-get-accepted";
import { v2StatementsQueryCollectionStatementResultCase } from "./v2-proof-slice-statements-query/v2-statements-query-collection-statement-result";
import { v2StatementsQueryStatementResultDirectBaseCase } from "./v2-proof-slice-statements-query/v2-statements-query-statement-result-direct-base";
import { v2StatementsQueryStatementResultDirectAgentCase } from "./v2-proof-slice-statements-query/v2-statements-query-statement-result-direct-agent";
import { v2StatementsQueryStatementResultDirectVerbCase } from "./v2-proof-slice-statements-query/v2-statements-query-statement-result-direct-verb";
import { v2StatementsQueryStatementResultDirectActivityCase } from "./v2-proof-slice-statements-query/v2-statements-query-statement-result-direct-activity";
import { v2StatementsQueryStatementResultDirectRegistrationCase } from "./v2-proof-slice-statements-query/v2-statements-query-statement-result-direct-registration";
import { v2StatementsQueryStatementResultDirectRelatedActivitiesCase } from "./v2-proof-slice-statements-query/v2-statements-query-statement-result-direct-related-activities";
import { v2StatementsQueryStatementResultDirectRelatedAgentsCase } from "./v2-proof-slice-statements-query/v2-statements-query-statement-result-direct-related-agents";
import { v2StatementsQueryStatementResultDirectSinceCase } from "./v2-proof-slice-statements-query/v2-statements-query-statement-result-direct-since";
import { v2StatementsQueryStatementResultDirectUntilCase } from "./v2-proof-slice-statements-query/v2-statements-query-statement-result-direct-until";
import { v2StatementsQueryStatementResultDirectLimitCase } from "./v2-proof-slice-statements-query/v2-statements-query-statement-result-direct-limit";
import { v2StatementsQueryStatementResultDirectAscendingCase } from "./v2-proof-slice-statements-query/v2-statements-query-statement-result-direct-ascending";
import { v2StatementsQueryStatementResultDirectFormatCase } from "./v2-proof-slice-statements-query/v2-statements-query-statement-result-direct-format";
import { v2StatementsRetrievalStatementResultArrayCase } from "./v2-proof-slice-statements-query/v2-statements-retrieval-statement-result-array";
import { v2StatementsRetrievalPaginationMoreContainerCase } from "./v2-proof-slice-statements-query/v2-statements-retrieval-pagination-more-container";
import { v2StatementsRetrievalDirectStatementsAndMorePropertiesCase } from "./v2-proof-slice-statements-query/v2-statements-retrieval-direct-statements-and-more-properties";
import { v2StatementsRetrievalDirectStatementsArrayTypeCase } from "./v2-proof-slice-statements-query/v2-statements-retrieval-direct-statements-array-type";
import { v2StatementsRetrievalDirectAdditionalPageContainerCase } from "./v2-proof-slice-statements-query/v2-statements-retrieval-direct-additional-page-container";
import { v2StatementsRetrievalDirectMoreEmptyWhenExhaustedCase } from "./v2-proof-slice-statements-query/v2-statements-retrieval-direct-more-empty-when-exhausted";
import { v2StatementsRetrievalDirectMoreRefersNextPageCase } from "./v2-proof-slice-statements-query/v2-statements-retrieval-direct-more-refers-next-page";
import { v2StatementsRetrievalDirectMoreContainerRulesCase } from "./v2-proof-slice-statements-query/v2-statements-retrieval-direct-more-container-rules";
import { v2StatementsQueryStatementIdAcceptedCase } from "./v2-proof-slice-statements-query/v2-statements-query-statement-id-accepted";
import { v2StatementsQueryStatementIdSingleStatementCase } from "./v2-proof-slice-statements-query/v2-statements-query-statement-id-single-statement";
import { v2StatementsQueryVoidedStatementIdAcceptedCase } from "./v2-proof-slice-statements-query/v2-statements-query-voided-statement-id-accepted";
import { v2StatementsQueryStatementIdRoundtripCase } from "./v2-proof-slice-statements-query/v2-statements-query-statement-id-roundtrip";
import { v2StatementsQueryEmptyResultCase } from "./v2-proof-slice-statements-query/v2-statements-query-empty-result";
import { v2StatementsQueryAcceptsAgentCase } from "./v2-proof-slice-statements-query/v2-statements-query-accepts-agent";
import { v2StatementsQueryAcceptsVerbCase } from "./v2-proof-slice-statements-query/v2-statements-query-accepts-verb";
import { v2StatementsQueryAcceptsActivityCase } from "./v2-proof-slice-statements-query/v2-statements-query-accepts-activity";
import { v2StatementsQueryAcceptsRegistrationCase } from "./v2-proof-slice-statements-query/v2-statements-query-accepts-registration";
import { v2StatementsQueryAcceptsRelatedActivitiesCase } from "./v2-proof-slice-statements-query/v2-statements-query-accepts-related-activities";
import { v2StatementsQueryAcceptsRelatedAgentsCase } from "./v2-proof-slice-statements-query/v2-statements-query-accepts-related-agents";
import { v2StatementsQueryAcceptsSinceCase } from "./v2-proof-slice-statements-query/v2-statements-query-accepts-since";
import { v2StatementsQueryAcceptsUntilCase } from "./v2-proof-slice-statements-query/v2-statements-query-accepts-until";
import { v2StatementsQueryAcceptsLimitCase } from "./v2-proof-slice-statements-query/v2-statements-query-accepts-limit";
import { v2StatementsQueryAcceptsFormatCase } from "./v2-proof-slice-statements-query/v2-statements-query-accepts-format";
import { v2StatementsQueryAcceptsAttachmentsCase } from "./v2-proof-slice-statements-query/v2-statements-query-accepts-attachments";
import { v2StatementsQueryAcceptsAscendingCase } from "./v2-proof-slice-statements-query/v2-statements-query-accepts-ascending";
import { v2StatementsQueryAgentCase } from "./v2-proof-slice-statements-query/v2-statements-query-agent";
import { v2StatementsQueryVerbCase } from "./v2-proof-slice-statements-query/v2-statements-query-verb";
import { v2StatementsQueryActivityCase } from "./v2-proof-slice-statements-query/v2-statements-query-activity";
import { v2StatementsQueryRegistrationCase } from "./v2-proof-slice-statements-query/v2-statements-query-registration";
import { v2StatementsQueryRelatedActivitiesCase } from "./v2-proof-slice-statements-query/v2-statements-query-related-activities";
import { v2StatementsQueryRelatedAgentsCase } from "./v2-proof-slice-statements-query/v2-statements-query-related-agents";
import { v2StatementsQuerySinceCase } from "./v2-proof-slice-statements-query/v2-statements-query-since";
import { v2StatementsQueryUntilCase } from "./v2-proof-slice-statements-query/v2-statements-query-until";
import { v2StatementsQueryLimitCase } from "./v2-proof-slice-statements-query/v2-statements-query-limit";
import { v2StatementsQueryAscendingCase } from "./v2-proof-slice-statements-query/v2-statements-query-ascending";
import { v2StatementsQueryFilteringAgentCase } from "./v2-proof-slice-statements-query/v2-statements-query-filtering-agent";
import { v2StatementsQueryFilteringVerbCase } from "./v2-proof-slice-statements-query/v2-statements-query-filtering-verb";
import { v2StatementsQueryFilteringActivityCase } from "./v2-proof-slice-statements-query/v2-statements-query-filtering-activity";
import { v2StatementsQueryFilteringRegistrationCase } from "./v2-proof-slice-statements-query/v2-statements-query-filtering-registration";
import { v2StatementsQueryFilteringRelatedActivitiesCase } from "./v2-proof-slice-statements-query/v2-statements-query-filtering-related-activities";
import { v2StatementsQueryFilteringRelatedAgentsCase } from "./v2-proof-slice-statements-query/v2-statements-query-filtering-related-agents";
import { v2StatementsQueryFilteringSinceCase } from "./v2-proof-slice-statements-query/v2-statements-query-filtering-since";
import { v2StatementsQueryFilteringUntilCase } from "./v2-proof-slice-statements-query/v2-statements-query-filtering-until";
import { v2StatementsQueryFilteringLimitCase } from "./v2-proof-slice-statements-query/v2-statements-query-filtering-limit";
import { v2StatementsQueryFilteringAscendingCase } from "./v2-proof-slice-statements-query/v2-statements-query-filtering-ascending";
import { v2StatementsQueryFilteringFormatCase } from "./v2-proof-slice-statements-query/v2-statements-query-filtering-format";
import { v2StatementsQueryStatementIdWithFormatAllowedCase } from "./v2-proof-slice-statements-query/v2-statements-query-statement-id-with-format-allowed";
import { v2StatementsQueryStatementIdWithAttachmentsAllowedCase } from "./v2-proof-slice-statements-query/v2-statements-query-statement-id-with-attachments-allowed";
import { v2StatementsQueryVoidedStatementIdWithFormatAllowedCase } from "./v2-proof-slice-statements-query/v2-statements-query-voided-statement-id-with-format-allowed";
import { v2StatementsQueryVoidedStatementIdWithAttachmentsAllowedCase } from "./v2-proof-slice-statements-query/v2-statements-query-voided-statement-id-with-attachments-allowed";
import { v2StatementsQueryVoidedTargetsRetainedSinceCase } from "./v2-proof-slice-statements-query/v2-statements-query-voided-targets-retained-since";
import { v2StatementsQueryVoidedTargetsRetainedUntilCase } from "./v2-proof-slice-statements-query/v2-statements-query-voided-targets-retained-until";
import { v2StatementsQueryVoidedTargetsRetainedLimitCase } from "./v2-proof-slice-statements-query/v2-statements-query-voided-targets-retained-limit";
import { v2StatementsQueryVoidedTargetsRetainedBaseCase } from "./v2-proof-slice-statements-query/v2-statements-query-voided-targets-retained-base";
import { v2StatementsQueryExclusiveStatementIdWithAgentCase } from "./v2-proof-slice-statements-query/v2-statements-query-exclusive-statement-id-with-agent";
import { v2StatementsQueryExclusiveStatementIdWithVerbCase } from "./v2-proof-slice-statements-query/v2-statements-query-exclusive-statement-id-with-verb";
import { v2StatementsQueryExclusiveStatementIdWithActivityCase } from "./v2-proof-slice-statements-query/v2-statements-query-exclusive-statement-id-with-activity";
import { v2StatementsQueryExclusiveStatementIdWithRegistrationCase } from "./v2-proof-slice-statements-query/v2-statements-query-exclusive-statement-id-with-registration";
import { v2StatementsQueryExclusiveStatementIdWithRelatedActivitiesCase } from "./v2-proof-slice-statements-query/v2-statements-query-exclusive-statement-id-with-related-activities";
import { v2StatementsQueryExclusiveStatementIdWithRelatedAgentsCase } from "./v2-proof-slice-statements-query/v2-statements-query-exclusive-statement-id-with-related-agents";
import { v2StatementsQueryExclusiveStatementIdWithSinceCase } from "./v2-proof-slice-statements-query/v2-statements-query-exclusive-statement-id-with-since";
import { v2StatementsQueryExclusiveStatementIdWithUntilCase } from "./v2-proof-slice-statements-query/v2-statements-query-exclusive-statement-id-with-until";
import { v2StatementsQueryExclusiveStatementIdWithLimitCase } from "./v2-proof-slice-statements-query/v2-statements-query-exclusive-statement-id-with-limit";
import { v2StatementsQueryExclusiveStatementIdWithAscendingCase } from "./v2-proof-slice-statements-query/v2-statements-query-exclusive-statement-id-with-ascending";
import { v2StatementsQueryExclusiveVoidedStatementIdWithAgentCase } from "./v2-proof-slice-statements-query/v2-statements-query-exclusive-voided-statement-id-with-agent";
import { v2StatementsQueryExclusiveVoidedStatementIdWithVerbCase } from "./v2-proof-slice-statements-query/v2-statements-query-exclusive-voided-statement-id-with-verb";
import { v2StatementsQueryExclusiveVoidedStatementIdWithActivityCase } from "./v2-proof-slice-statements-query/v2-statements-query-exclusive-voided-statement-id-with-activity";
import { v2StatementsQueryExclusiveVoidedStatementIdWithRegistrationCase } from "./v2-proof-slice-statements-query/v2-statements-query-exclusive-voided-statement-id-with-registration";
import { v2StatementsQueryExclusiveVoidedStatementIdWithRelatedActivitiesCase } from "./v2-proof-slice-statements-query/v2-statements-query-exclusive-voided-statement-id-with-related-activities";
import { v2StatementsQueryExclusiveVoidedStatementIdWithRelatedAgentsCase } from "./v2-proof-slice-statements-query/v2-statements-query-exclusive-voided-statement-id-with-related-agents";
import { v2StatementsQueryExclusiveVoidedStatementIdWithSinceCase } from "./v2-proof-slice-statements-query/v2-statements-query-exclusive-voided-statement-id-with-since";
import { v2StatementsQueryExclusiveVoidedStatementIdWithUntilCase } from "./v2-proof-slice-statements-query/v2-statements-query-exclusive-voided-statement-id-with-until";
import { v2StatementsQueryExclusiveVoidedStatementIdWithLimitCase } from "./v2-proof-slice-statements-query/v2-statements-query-exclusive-voided-statement-id-with-limit";
import { v2StatementsQueryExclusiveVoidedStatementIdWithAscendingCase } from "./v2-proof-slice-statements-query/v2-statements-query-exclusive-voided-statement-id-with-ascending";

export const v2ProofSliceStatementsQuerySuite = {
  "type": "suite",
  "id": "v2.proof-slice.statements.query",
  "title": "Statement Query",
  "specVersion": "2.0.0",
  "tags": [
    "query"
  ]
,
  "children": [
    v2StatementsQueryEndpointGetCase,
    v2StatementsQueryGetAcceptedCase,
    v2StatementsQueryCollectionStatementResultCase,
    v2StatementsQueryStatementResultDirectBaseCase,
    v2StatementsQueryStatementResultDirectAgentCase,
    v2StatementsQueryStatementResultDirectVerbCase,
    v2StatementsQueryStatementResultDirectActivityCase,
    v2StatementsQueryStatementResultDirectRegistrationCase,
    v2StatementsQueryStatementResultDirectRelatedActivitiesCase,
    v2StatementsQueryStatementResultDirectRelatedAgentsCase,
    v2StatementsQueryStatementResultDirectSinceCase,
    v2StatementsQueryStatementResultDirectUntilCase,
    v2StatementsQueryStatementResultDirectLimitCase,
    v2StatementsQueryStatementResultDirectAscendingCase,
    v2StatementsQueryStatementResultDirectFormatCase,
    v2StatementsRetrievalStatementResultArrayCase,
    v2StatementsRetrievalPaginationMoreContainerCase,
    v2StatementsRetrievalDirectStatementsAndMorePropertiesCase,
    v2StatementsRetrievalDirectStatementsArrayTypeCase,
    v2StatementsRetrievalDirectAdditionalPageContainerCase,
    v2StatementsRetrievalDirectMoreEmptyWhenExhaustedCase,
    v2StatementsRetrievalDirectMoreRefersNextPageCase,
    v2StatementsRetrievalDirectMoreContainerRulesCase,
    v2StatementsQueryStatementIdAcceptedCase,
    v2StatementsQueryStatementIdSingleStatementCase,
    v2StatementsQueryVoidedStatementIdAcceptedCase,
    v2StatementsQueryStatementIdRoundtripCase,
    v2StatementsQueryEmptyResultCase,
    v2StatementsQueryAcceptsAgentCase,
    v2StatementsQueryAcceptsVerbCase,
    v2StatementsQueryAcceptsActivityCase,
    v2StatementsQueryAcceptsRegistrationCase,
    v2StatementsQueryAcceptsRelatedActivitiesCase,
    v2StatementsQueryAcceptsRelatedAgentsCase,
    v2StatementsQueryAcceptsSinceCase,
    v2StatementsQueryAcceptsUntilCase,
    v2StatementsQueryAcceptsLimitCase,
    v2StatementsQueryAcceptsFormatCase,
    v2StatementsQueryAcceptsAttachmentsCase,
    v2StatementsQueryAcceptsAscendingCase,
    v2StatementsQueryAgentCase,
    v2StatementsQueryVerbCase,
    v2StatementsQueryActivityCase,
    v2StatementsQueryRegistrationCase,
    v2StatementsQueryRelatedActivitiesCase,
    v2StatementsQueryRelatedAgentsCase,
    v2StatementsQuerySinceCase,
    v2StatementsQueryUntilCase,
    v2StatementsQueryLimitCase,
    v2StatementsQueryAscendingCase,
    v2StatementsQueryFilteringAgentCase,
    v2StatementsQueryFilteringVerbCase,
    v2StatementsQueryFilteringActivityCase,
    v2StatementsQueryFilteringRegistrationCase,
    v2StatementsQueryFilteringRelatedActivitiesCase,
    v2StatementsQueryFilteringRelatedAgentsCase,
    v2StatementsQueryFilteringSinceCase,
    v2StatementsQueryFilteringUntilCase,
    v2StatementsQueryFilteringLimitCase,
    v2StatementsQueryFilteringAscendingCase,
    v2StatementsQueryFilteringFormatCase,
    v2StatementsQueryStatementIdWithFormatAllowedCase,
    v2StatementsQueryStatementIdWithAttachmentsAllowedCase,
    v2StatementsQueryVoidedStatementIdWithFormatAllowedCase,
    v2StatementsQueryVoidedStatementIdWithAttachmentsAllowedCase,
    v2StatementsQueryVoidedTargetsRetainedSinceCase,
    v2StatementsQueryVoidedTargetsRetainedUntilCase,
    v2StatementsQueryVoidedTargetsRetainedLimitCase,
    v2StatementsQueryVoidedTargetsRetainedBaseCase,
    v2StatementsQueryExclusiveStatementIdWithAgentCase,
    v2StatementsQueryExclusiveStatementIdWithVerbCase,
    v2StatementsQueryExclusiveStatementIdWithActivityCase,
    v2StatementsQueryExclusiveStatementIdWithRegistrationCase,
    v2StatementsQueryExclusiveStatementIdWithRelatedActivitiesCase,
    v2StatementsQueryExclusiveStatementIdWithRelatedAgentsCase,
    v2StatementsQueryExclusiveStatementIdWithSinceCase,
    v2StatementsQueryExclusiveStatementIdWithUntilCase,
    v2StatementsQueryExclusiveStatementIdWithLimitCase,
    v2StatementsQueryExclusiveStatementIdWithAscendingCase,
    v2StatementsQueryExclusiveVoidedStatementIdWithAgentCase,
    v2StatementsQueryExclusiveVoidedStatementIdWithVerbCase,
    v2StatementsQueryExclusiveVoidedStatementIdWithActivityCase,
    v2StatementsQueryExclusiveVoidedStatementIdWithRegistrationCase,
    v2StatementsQueryExclusiveVoidedStatementIdWithRelatedActivitiesCase,
    v2StatementsQueryExclusiveVoidedStatementIdWithRelatedAgentsCase,
    v2StatementsQueryExclusiveVoidedStatementIdWithSinceCase,
    v2StatementsQueryExclusiveVoidedStatementIdWithUntilCase,
    v2StatementsQueryExclusiveVoidedStatementIdWithLimitCase,
    v2StatementsQueryExclusiveVoidedStatementIdWithAscendingCase,
  ]
} as unknown as SuiteDefinition;
