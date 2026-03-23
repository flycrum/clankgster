## Purpose

Single source of truth for sync config runtime validation and TypeScript inference.

## Invariants

- Types for config flow should come from `z.infer`.
- All merged config layers must be validated with this schema before use.

## Notes

- Keep schema additive and backwards compatible where possible.
