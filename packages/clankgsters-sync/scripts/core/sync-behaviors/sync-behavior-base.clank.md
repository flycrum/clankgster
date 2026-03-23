## Purpose

Base class for sync behavior lifecycle hooks used by per-behavior machine states.

## Invariants

- Hooks are deterministic and return `Result`.
- No direct filesystem mutation in base hooks during architecture phase.
