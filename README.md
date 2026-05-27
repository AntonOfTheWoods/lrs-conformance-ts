# lrs-conformance-ts

To install dependencies:

```bash
bun install
```

To run the active upstream-helper checks:

```bash
bun run test
```

The active root-level code now focuses on upstream-oracle migration tooling: trace capture,
upstream export, parity comparison, and migration control metadata.

The previous Bun-native rewrite attempt has been archived under `archive/deprecated-rewrite3/`.
No root-level package script invokes that archived runtime directly.

This project was created using `bun init` in bun v1.3.14. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## Parity Notes

- Historical LRSQL parity notes for the archived proof-slice runtime live in `archive/deprecated-rewrite/rewrite/docs/PARITY-LEDGER.md`.

## Rewrite Helpers

- The `rewrite/` directory is active helper/validator tooling for upstream export, traffic capture, DB comparison, and the fresh migration workflow.
- `rewrite:*` package scripts are intentionally kept when they operate on upstream-original artifacts, archived rewrite comparisons, or migration traces.
- Historical runtimes now live under `archive/deprecated-rewrite/` and `archive/deprecated-rewrite3/`; neither is exposed as a root package script.
