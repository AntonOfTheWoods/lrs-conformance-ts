# xAPI Parity Ledger

## Current status

- Validation gate: `bun run check` is green.
- Source-of-truth baseline: `/home/anton/dev/tmp/lrs-conformance-test-suite-orig`.
- xAPI 2.0 upstream conformance count: 1435 tests in the original upstream batteries artifact.
- xAPI 2.0 rewrite manifest size: 1210 proof cases.
- xAPI 2.0 count gap versus upstream batteries total: 225.
- Current top-level 2.0 suites: Statements, State Resource, Activity Profile Resource, Agent Profile Resource, Agents Resource, Activities Resource, About Resource, Communication.

## Current interpretation

- The rewrite appears to have direct proof-slice trace coverage for every legacy `test/v2_0` suite owner, including Additional Data Types, Signed Statements, and Special Data Types And Rules.
- That suite-owner closure is not yet enough to claim upstream parity. The original upstream battery still reports 1435 2.0 conformance tests, so the rewrite's 1210-case manifest should currently be treated as a lower-granularity proof surface, not full one-to-one upstream test parity.
- Statement Resource direct-trace tranche: added the next major upstream-original catch-up slice for `4.1.6.1-Statement-Resource.js`, including explicit `/statements` POST/PUT/GET endpoint leaves, positive PUT/POST/GET acceptance leaves, StatementResult-without-id lookup coverage, direct `statementId`/`voidedStatementId` processing leaves, explicit GET `Content-Type` coverage, format-absent exact retrieval, non-canonical Accept-Language preservation, split attachment JSON-fallback leaves, allowed `statementId`/`voidedStatementId` plus `format`/`attachments` combinations, and the repeated `X-Experience-API-Consistent-Through` header matrix. The full gate remains green after this expansion.
- Reopened upstream resource tranche: added the first substantial upstream-original catch-up slice for `4.1.6.2-State-Resource.js`, `4.1.6.5-Agent-Profile-Resource.js`, and `4.1.6.6-Activity-Profile-Resource.js`, including missing required-parameter rejection cases, invalid agent-query rejection cases, State `registration` acceptance and validation, and shared document-resource query validation in the mock runtime.
- Communication/resource direct-trace tranche: added the missing one-to-one upstream leaves for `4.1.4-Concurrency.js` that were still collapsed in the rewrite, including quoted ETag validation, stale-update non-mutation checks, POST `If-Match` acceptance and persistence checks, and explicit 409 conflict-message coverage across State, Activity Profile, and Agent Profile resources. The same tranche also added the remaining About/version-header endpoint matrix from `4.1.6.7-About-Resource.js`, explicit Agents/Activities endpoint-acceptance leaves, the `H.Communication3.3-Versioning.js` non-rewrite statement-shape check, and the explicit HEAD/GET-without-Content-Length leaves from `H.Communication1.1-HeadRequestImplementation.js`.
- Document-resource runtime parity: the shared mock document handler now rejects unrecognized or malformed query parameters for State/Profile resources, validates `activityId` IRIs and Agent query objects, treats State `registration` as part of the document scope, and returns `Last-Modified` on stored document retrievals.
- Additional data and signed-statement parity: added direct legacy-trace coverage for IRI comparison fallback behavior, high-precision duration acceptance and roundtrip, signed duration comparison through hundredths precision, UTC-equivalent timestamp recall, signed statement multipart validation, allowed JWS algorithms, invalid JSON payload rejection, and signature-part presence checks.
- Special data types parity: added direct legacy-trace PUT coverage for empty extension maps plus null, empty-string, and empty-object extension values across statement and substatement activity, result, and context placements; also pinned millisecond timestamp and stored precision on retrieval.
- Communication resource parity: added direct legacy-trace coverage for rejected-request rollback, duplicate-key overwrite semantics during document merges, and one-level-deep document merge behavior. Audited `H.Communication1.2-Headers.js` as empty in xAPI 2.0 and `H.Communication1.3-AlternateRequestSyntax.js` as an explicit no-op suite in xAPI 2.0, so both now drop out of the remaining-gap ledger without adding fake executable coverage.
- Statement Lifecycle and Retrieval: added direct legacy-trace coverage for the remaining xAPI 2.0 voiding and retrieval suite owners, including voided lookup visibility, repeated voiding ignore semantics, rejection of voiding statements whose object is not a `StatementRef`, StatementResult array shape, empty `more` on exhausted results, and paginated `more` containers that can be followed to the next page.
- Actor and Verb requirements: added direct legacy-trace coverage for actor `objectType` vocabulary and type validation, actor `name` typing, anonymous group `member` requirements and member type validation, verb `id` presence and IRI validation, and verb `display` language-map typing. Existing actor IFI and account families now trace back to the real `4.2.2.1-Actor-Requirements.js` suite instead of config-only files.
- Statement Attachments: added acceptance and validation coverage for array shape, entry object shape, `usageType`, `contentType`, `length`, `sha2`, `fileUrl`, `display`, and `description`.
- Statement Metadata: added coverage for `timestamp`, `stored`, and `version`, including RFC 3339 acceptance, negative-zero offset rejection, version retention on retrieval, and stored overwrite checks on POST and PUT.
- Mock LRS parity: tightened attachment field validation, added strict timestamp normalization and validation, rejected negative-zero offsets, validated top-level statement `stored` and `version`, rejects non-string actor-like `name` values, enforces `StatementRef` objects for voiding statements, and now returns paginated StatementResult containers with deterministic `more` paths.
- Execution model: added `jsonPathNotEquals` assertions so proof cases can verify server-assigned values differ from client-submitted values.

## Remaining xAPI 2.0 backlog

- Upstream-baseline gap audit is open. We still need to explain and either close or explicitly justify the 225-test difference between the original upstream 2.0 conformance count and the rewrite's 1210 proof cases.
- The dominant remaining hotspot has shifted further into the upstream-original communication tail, especially `H.Communication3.2-ErrorCodes.js` plus the remaining Statement Resource/retrieval one-to-one leaves that are still collapsed in the proof registry.

## Audit-needed overlap

- Determine which upstream original 2.0 tests were merged, dropped, or not yet ported when building the typed proof registry.
- Recount against the original upstream batteries artifact and runner semantics, not the modernized local fork.

## After 2.0

- Do not treat xAPI 2.0 as fully closed until the upstream-original baseline gap is reconciled.
- Once the upstream-original 2.0 gap is reconciled, resume the first substantial `1.0.3` migration pass from the upstream clone, not the modernized local fork.
