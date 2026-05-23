# xAPI Parity Ledger

## Current status

- Validation gate: `bun run check` is green.
- xAPI 2.0 manifest size: 1042 cases.
- Current top-level 2.0 suites: Statements, State Resource, Activity Profile Resource, Agent Profile Resource, Agents Resource, Activities Resource, About Resource, Communication.

## Closed in this tranche

- Actor and Verb requirements: added direct legacy-trace coverage for actor `objectType` vocabulary and type validation, actor `name` typing, anonymous group `member` requirements and member type validation, verb `id` presence and IRI validation, and verb `display` language-map typing. Existing actor IFI and account families now trace back to the real `4.2.2.1-Actor-Requirements.js` suite instead of config-only files.
- Statement Attachments: added acceptance and validation coverage for array shape, entry object shape, `usageType`, `contentType`, `length`, `sha2`, `fileUrl`, `display`, and `description`.
- Statement Metadata: added coverage for `timestamp`, `stored`, and `version`, including RFC 3339 acceptance, negative-zero offset rejection, version retention on retrieval, and stored overwrite checks on POST and PUT.
- Mock LRS parity: tightened attachment field validation, added strict timestamp normalization and validation, rejected negative-zero offsets, validated top-level statement `stored` and `version`, and now rejects non-string actor-like `name` values.
- Execution model: added `jsonPathNotEquals` assertions so proof cases can verify server-assigned values differ from client-submitted values.

## Remaining xAPI 2.0 backlog

These are the legacy `test/v2_0` suite files that still lack direct proof-slice trace coverage in the TypeScript rewrite and should drive the next migration passes.

- `4.2.5-Statement-Voiding.js`
- `4.2.7-Additional-Requirements-for-Data-Types.js`
- `E.Data2.5-RetrievalofStatements.js`
- `E.Data2.6-SignedStatements.js`
- `E.Data4.0-SpecialDataTypesAndRules.js`
- `H.Communication1.2-Headers.js`
- `H.Communication1.3-AlternateRequestSyntax.js`
- `H.Communication2.2-DocumentResources.js`

## Audit-needed overlap

- `4.2.5-Statement-Voiding.js` already has overlapping behavior in the current proof slice, so the next pass should reconcile and retag before adding net-new cases.
- `E.Data2.5-RetrievalofStatements.js` also overlaps current query and retrieval behavior, so it should be reconciled against the legacy file before treating it as a purely greenfield gap.

## After 2.0

- Begin the first substantial `1.0.3` migration pass only after the remaining xAPI 2.0 backlog above is closed.
