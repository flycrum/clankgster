# E2E tests

Config-driven e2e tests for `@clankgsters/sync`.

## What they do

- Clone `sandboxes/sandbox-template/` into `sandboxes/.tests/current`.
- Inject the test case config into sandbox `clankgsters.config.ts`.
- Run clear then sync using package scripts.
- Compare expected manifest JSON with actual manifest JSON.
- Keep failed sandboxes as `failed-<case-name>` for inspection.
- Sandbox fixtures follow `.clank` source conventions and `CLANK.md` context files.

## Run

From repository root:

- `pnpm test:e2e`

From this package:

- `pnpm test`
- `tsx scripts/e2e-harness.ts [case-name]`
