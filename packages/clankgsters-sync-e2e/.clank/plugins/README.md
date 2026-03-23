# clankgsters-e2e

Local plugin for **@clankgsters/sync-e2e**: skills to run tests, add a test case, and debug a failing case.

## Skills

| Skill                           | Purpose                                                                                             |
| ------------------------------- | --------------------------------------------------------------------------------------------------- |
| **clankgsters-e2e-run-all**     | Run all e2e cases (`pnpm test` in package or `pnpm test:e2e` from monorepo root).                   |
| **clankgsters-e2e-run-one**     | Run a single case by name (`pnpm exec tsx scripts/e2e-harness.ts <name>` or package `test` script). |
| **clankgsters-e2e-create-case** | Add a new case: follow `scripts/test-cases/`, add `.ts` + `.json`, then run run-one.                |
| **clankgsters-e2e-debug-case**  | Diagnose a failure: inspect `sandboxes/.tests/failed-<name>/`, diff manifest vs expected JSON.      |

## Layout

This plugin lives under `packages/clankgsters-sync-e2e/.clank/plugins/`. Test cases: `scripts/test-cases/`. Active sandbox: `sandboxes/.tests/current` (from `sandbox-template`); on failure it is renamed to `failed-<name>`.
