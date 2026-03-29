# Iteration controls

Use these controls at the very beginning of `rawdocs-refine-test-complex-iterative-syncs`.

## One-time pause preference

Ask exactly once before iteration 1:

`Do you want this workflow to pause after each iteration report for review before continuing?`

Allowed responses:

- `yes` -> pause mode ON
- `no` -> pause mode OFF

Never ask this question again after iteration execution begins.

## Iteration budget

Default loop cap: `10` iterations.

Override rules:

- If user asks for a specific count (for example `1`, `20`), use that count.
- If user asks for a stop condition (for example "until churn is low for two consecutive runs"), track and enforce that condition.
- If user asks for both count and condition, stop at whichever is met first.

## Fixture reset control

Before the first iteration:

1. If `TARGET_PLUGIN_PATH` exists, delete it.
2. Recreate via `rawdocs-create-complex-plugin`.
3. Do not recreate inside the loop.

This reset is automatic and does not require user confirmation.
