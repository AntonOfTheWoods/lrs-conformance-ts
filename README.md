# lrs-conformance-ts

To install dependencies:

```bash
bun install
```

To run the active upstream-helper checks:

```bash
bun run test
```

This project was created using `bun init` in bun v1.3.14. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## Parity Notes

- Historical LRSQL parity notes for the archived proof-slice runtime live in `archive/deprecated-rewrite/rewrite/docs/PARITY-LEDGER.md`.

## Rewrite Helpers

- The `rewrite/` directory is active helper/validator tooling for running and comparing the original upstream JS suite.
- `rewrite:*` package scripts are intentionally kept when they operate on upstream-original artifacts or comparisons.
- The deprecated proof-slice runtime has been moved under `archive/deprecated-rewrite/` and no root-level package script invokes it.
