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

This project was created using `bun init` in bun v1.3.14. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## Parity Notes

- LRSQL parity notes and diagnostics for active comparison tooling live under `rewrite/docs/`.

## Rewrite Helpers

- The `rewrite/` directory is active helper/validator tooling for upstream export, traffic capture, DB comparison, and the fresh migration workflow.
- `rewrite:*` package scripts are intentionally kept when they operate on upstream-original artifacts, active rewrite comparisons, or migration traces.
