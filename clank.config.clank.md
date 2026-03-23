## Purpose

`clank.config.ts` is the tier-1 team configuration for sync behavior. This file is committed and shared.

## Invariants

- Keep values deterministic and team-safe.
- Avoid machine-specific paths or personal preferences.
- `agents` controls high-level enablement and behavior order.

## Merge Rules

- This file is loaded before `clank.local.config.ts`.
- Local config and env sources may override this file by priority.
