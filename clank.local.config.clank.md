## Purpose

`clank.local.config.ts` is a developer-only tier-2 override layer for sync.

## Invariants

- This file must remain uncommitted.
- Use it for personal overrides only (enable flags, behaviors, logging).

## Merge Rules

- Local values override `clank.config.ts`.
- Environment variables can still override local values.
