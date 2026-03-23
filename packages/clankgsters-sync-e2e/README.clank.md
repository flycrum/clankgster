## Purpose

AI-facing architecture notes for sync e2e harness behavior.

## Invariants

- Harness executes sync as subprocesses, not by importing internals.
- Sandbox runs isolate filesystem effects using `CLANKGSTERS_REPO_ROOT`.
- Keep case structure as `<name>.ts` + `<name>.json`.
