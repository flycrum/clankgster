# `scripts/` in `@clankgster/sync`

This folder holds **thin local-dev TypeScript entrypoints** only (`clankgster-sync.run.ts`, `clankgster-sync.clear.ts`). They are used when `clankgster-sync run|clear` is launched with `CLANKGSTER_SYNC_EXECUTION_MODE=source`.

## Why keep them here

- **Source execution mode** invokes these files with `tsx` from the package root for no-build local testing.
- **Installed consumers** should use the published prebuilt runtime entries under `dist/scripts/` (or the `clankgster-sync` bin), not TypeScript paths from `scripts/`.

## What is not here

- Library and sync runtime code lives in **`src/`** (`src/common/`, `src/core/`). The **supported import API** for npm is `package.json` → `"exports"."."` → `./dist/index.mjs`, produced via `vp pack`. Deep imports into `src/` are not a declared public surface unless you add explicit export subpaths.
