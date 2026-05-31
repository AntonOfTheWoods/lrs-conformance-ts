# lrs-conformance-ts

To install dependencies:

```bash
bun install
```

To run the active legacy-comparison checks:

```bash
bun run test
```

The active root-level code now focuses on legacy-oracle migration tooling: trace capture,
upstream export, parity comparison, and migration control metadata.

This project was created using `bun init` in bun v1.3.14. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## Parity Notes

- LRSQL parity notes and diagnostics for active comparison tooling live under `legacy/`.

## Repository Layout

- The `runtime/` directory contains the active conformance runtime and test suites.
- The `legacy/` directory contains comparison/oracle tooling for upstream export, traffic capture, and parity analysis.
- `legacy:*` package scripts operate on upstream-original artifacts and runtime-vs-upstream comparisons.
