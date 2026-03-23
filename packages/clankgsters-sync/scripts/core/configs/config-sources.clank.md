## Purpose

Defines concrete config providers for team TS config, local TS config, and env overrides.

## Priority Order

- `clank.config.ts` (team)
- `clank.local.config.ts` (developer override)
- environment variables (highest priority)

## Invariants

- Missing local file is expected and should not fail config resolution.
