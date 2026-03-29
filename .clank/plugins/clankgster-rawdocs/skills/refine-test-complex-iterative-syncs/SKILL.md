---
name: rawdocs-refine-test-complex-iterative-syncs
description: >-
  Iteratively refines rawdocs structural sync quality by running repeated
  complex continuity cycles with varied rawdocs mutations, evaluating churn and
  bucket placement outcomes, and applying targeted improvements to struct-sync.
  Use when improving rawdocs-struct-sync behavior over multiple controlled
  iterations.
---

# rawdocs refine test complex iterative syncs

## Scope

Run a multi-iteration refinement loop to improve [`rawdocs-struct-sync`](../struct-sync/SKILL.md) using a complex rawdocs fixture and evidence-driven patching.

This skill is optimization-oriented: every iteration gathers test evidence, evaluates against sync goals, then improves the sync system before the next iteration.

## Fixed target path

Use this exact fixture path:

`.clank/plugins/_rawdocs-refine-test-complex-iterative-syncs`

Treat this as **`TARGET_PLUGIN_PATH`** for all iteration steps.

## Hard boundaries

- Never modify `TARGET_PLUGIN_PATH/rawdocs/` during sync execution; only mutate rawdocs in the explicit mutation window.
- Never emit markdown links into `rawdocs/`.
- Keep mutation realism aligned with the complex seed set documented in [`step-4-seed-rawdocs.md`](../create-complex-plugin/references/step-4-seed-rawdocs.md).
- Prefer changing `struct-sync` behavior over changing test harness behavior.

## Pre-loop controls

1. Ask one-time pause preference using [`iteration-controls.md`](references/iteration-controls.md):
   - **Pause mode ON**: pause after each iteration report and wait for continue confirmation.
   - **Pause mode OFF**: continue automatically until stop condition.
2. Resolve iteration budget:
   - Default cap is `10`.
   - If user explicitly requests another count/condition (for example `1`, `20`, or stop-at-condition), honor it.
3. Ensure pristine fixture state:
   - If `TARGET_PLUGIN_PATH` exists, delete it without asking for permission.
   - Recreate once using [`rawdocs-create-complex-plugin`](../create-complex-plugin/SKILL.md) with `TARGET_PLUGIN_PATH`.
   - Do not recreate in later iterations.

## Iteration loop

For each iteration `N`:

1. Generate mutation profile via [`mutation-generation-strategy.md`](references/mutation-generation-strategy.md).
2. Apply only that iteration's mutation to `TARGET_PLUGIN_PATH/rawdocs/`.
3. Run continuity flow using [`rawdocs-test-continuity-complex-existing`](../test-continuity-complex-existing/SKILL.md) with:
   - same `TARGET_PLUGIN_PATH`
   - caller-provided mutation instructions from step 1
4. Produce report using [`iteration-report-shape.md`](references/iteration-report-shape.md).
5. Score outcomes against:
   - [`sync-goals-and-bucketing-criteria.md`](references/sync-goals-and-bucketing-criteria.md)
   - [`rawdocs-sync-goals.md`](../../references/rawdocs-sync-goals.md)
   - [`common-content-type-decision-tree.md`](../../../clankgster-capo/references/common-content-type-decision-tree.md)
6. Apply targeted improvements for next iteration:
   - primary target: [`../struct-sync/SKILL.md`](../struct-sync/SKILL.md)
   - secondary target: [`../struct-sync/references/`](../struct-sync/references/)
   - optional architecture criteria updates: [`../../references/rawdocs-structify-architecture.md`](../../references/rawdocs-structify-architecture.md) and [`../../references/rawdocs-sync-goals.md`](../../references/rawdocs-sync-goals.md)
   - rare and justified only: [`../test-continuity-complex-existing/SKILL.md`](../test-continuity-complex-existing/SKILL.md) and related test references when instrumentation and reports are insufficient
7. If pause mode is ON, stop and wait for user confirmation before next iteration.

## Improvement application policy

Follow [`improvement-application-policy.md`](references/improvement-application-policy.md).

Do not apply speculative refactors; each patch must cite a failure signature from the current iteration report.

## Success criteria

Follow [`docs/test-plan.md`](docs/test-plan.md) and [`sync-goals-and-bucketing-criteria.md`](references/sync-goals-and-bucketing-criteria.md).

Key target: improve continuity and subtractive honesty while funneling synced output to the right plugin buckets with minimal unsupported `docs/` placement.

## Required final output

Return:

1. Controls used (pause mode, iteration budget/stop condition)
1. Mutation profile log across all iterations
1. Per-iteration reports
1. Patch ledger of sync/test changes applied
1. Trend summary (churn, bucket placement, goal pass rate)
1. Final recommendation set for next refinement cycle

## Verification

- [ ] One-time pause preference question asked exactly once before iteration 1
- [ ] Fixture path reset and created once before loop
- [ ] No additional create calls inside loop
- [ ] Each iteration used a mutation profile from taxonomy
- [ ] Each iteration produced report-shape-compliant output
- [ ] Most applied patches target struct-sync system files
- [ ] Any test-harness patch is explicitly justified as instrumentation/reporting need

## Cross-references

* [`docs/test-plan.md`](docs/test-plan.md)
* [`references/iteration-controls.md`](references/iteration-controls.md)
* [`references/iteration-report-shape.md`](references/iteration-report-shape.md)
* [`references/mutation-taxonomy.md`](references/mutation-taxonomy.md)
* [`references/mutation-generation-strategy.md`](references/mutation-generation-strategy.md)
* [`references/sync-goals-and-bucketing-criteria.md`](references/sync-goals-and-bucketing-criteria.md)
* [`references/improvement-application-policy.md`](references/improvement-application-policy.md)
* [`../test-continuity-complex-existing/SKILL.md`](../test-continuity-complex-existing/SKILL.md)
* [`../struct-sync/SKILL.md`](../struct-sync/SKILL.md)
