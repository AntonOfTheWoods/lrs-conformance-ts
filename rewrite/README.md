# Rewrite Helpers

This directory contains active helper and validator tooling for the original upstream JavaScript conformance suite.

These scripts are not the preferred runtime implementation for conformance execution. They exist to:

- export upstream runs and artifacts
- compare upstream and local outputs
- diagnose parity gaps

- Any scripts that depended on the archived proof-slice runtime have been removed from this active directory and moved under `archive/deprecated-rewrite/`.

If an obsoleted rewritten runtime is ever kept in the repository, it must live outside this directory under `archive/deprecated-rewrite/` and must not have any active package-script entrypoints.
