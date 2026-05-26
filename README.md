# lrs-conformance-ts

To install dependencies:

```bash
bun install
```

To run the active upstream-helper checks:

```bash
bun run test
```

To run the new Bun-native describe runtime slice against an LRS endpoint:

```bash
bun run describe:run -- --endpoint http://localhost:8000/xapi
```

When the endpoint is the local LRSQL instance at `http://localhost:8080/xapi`, `describe:run`
now auto-detects version-mode mismatches and resets LRSQL into the required `1.0.3` or
`2.0.0` mode before executing the suite.

The current rewrite slice registers the first config-driven cases from `Data2.2-FormattingRequirements.ts`
for both `v1_0_3` and `v2_0`, and writes an upstream-shaped JSON run log to `logs/<uuid>.log`.

This project was created using `bun init` in bun v1.3.14. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## Parity Notes

- Historical LRSQL parity notes for the archived proof-slice runtime live in `archive/deprecated-rewrite/rewrite/docs/PARITY-LEDGER.md`.

## Rewrite Helpers

- The `rewrite/` directory is active helper/validator tooling for running and comparing the original upstream JS suite.
- `rewrite:*` package scripts are intentionally kept when they operate on upstream-original artifacts or comparisons.
- The deprecated proof-slice runtime has been moved under `archive/deprecated-rewrite/` and no root-level package script invokes it.
