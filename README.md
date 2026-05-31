# lrs-conformance-ts

This repository contains two closely related pieces:

- The active Bun/TypeScript conformance runtime under `runtime/`.
- The legacy comparison and oracle tooling under `legacy/`, which runs the runtime against the original upstream suite and compares the results.

The original upstream project is [adlnet/lrs-conformance-test-suite](https://github.com/adlnet/lrs-conformance-test-suite). It is used here as a reference implementation and oracle source, not as the primary codebase.

The original code was getting a little long in the tooth and the community needs a more modern, performant LRS conformance suite. This is an attempt to provide that, and also to move LRS conformance forward. This repository is the place where the original in-place porting (and many unsuccessful AI-driven experiments) was done. The rewritten code was then copied to https://github.com/emergent-english/conform-ed, where it is part of an effort to provide a one-stop-shop for testing digital education products against all relevant, modern specs and standards.

It was largely done via AI (GH Copilot) and will likely need to get further cleaned up over time.

## Getting Started

Install dependencies:

```bash
bun install
```

Run the main validation loop:

```bash
bun run validate
```

Run only the test suite:

```bash
bun run test
```

## Key Scripts

The most useful scripts are:

- `bun run validate` - typecheck, lint, and run the core test suite.
- `bun run test` - run the focused runtime and comparison tests.
- `bun run legacy:diagnose:traffic` - capture traffic from the runtime and compare it with an upstream oracle.
- `bun run legacy:compare` - compare runtime and upstream parity output.
- `bun run legacy:db:fingerprint` - generate DB fingerprints for comparison.
- `bun run legacy:db:compare` - compare DB fingerprints between runtime and upstream artifacts.
- `bun run legacy:db:bisect` - narrow a DB divergence to the first mismatching boundary.
- `bun run legacy:db:attribute` - attribute a DB divergence to the most likely cause.
- `bun run legacy:export:upstream:lrsql` - export an upstream run into the local validation layout.
- `bun run legacy:run:upstream:lrsql` - run the upstream suite directly against the local LRSQL target.
- `bun run setup:lrsql` - bring up the local LRSQL stack, wait for readiness, and verify auth.

## Runtime vs Legacy

`runtime/` is the code under active test. `legacy/` is the comparison harness that:

- exports or replays upstream-original behavior,
- captures traffic from the runtime,
- compares runtime results against upstream oracles,
- and produces diagnostics for DB-state divergence.

The `adl-lrs-conformance-tests` dependency in `package.json` provides the upstream suite content used by those legacy comparison scripts.

## Oracle Layout

Oracle artifacts live under `tmp/validation/oracles/traffic/` during local runs. They are keyed by DB-state mode and by version, so a run for one mode does not replace a run for another mode.

Examples:

- `tmp/validation/oracles/traffic/type-all/<timestamp>/1.0.3/`
- `tmp/validation/oracles/traffic/type-mutations/<timestamp>/2.0.0/`

The default `legacy:diagnose:traffic` behavior is to reuse a compatible oracle for the requested version and DB-state mode, or refresh a new one when no compatible oracle exists.

## Repository Notes

- `ops/` contains local orchestration helpers and compose scripts.
- `shared/` contains code shared between runtime and legacy comparison tooling.
- `tests/` contains focused unit tests for shared components.
