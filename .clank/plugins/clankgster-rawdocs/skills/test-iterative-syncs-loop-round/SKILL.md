---
name: rawdocs-test-iterative-syncs-loop-round
description: >-
  Executes one iterative-sync round: mutation profile selection, continuity
  run-1/run-2 execution, scoring, and evidence-backed patch application.
---

# rawdocs test iterative syncs loop round

## Scope

Use this skill for exactly one round inside the iterative-sync loop. One round is:

1. generate one mutation profile
2. apply mutation to `rawdocs/`
3. run continuity (`run-1` then `run-2`)
4. score against sync goals
5. apply targeted evidence-backed patches
6. return one round report

**Caller must provide:**

1. `TARGET_PLUGIN_PATH` (existing plugin root path)
2. `ROUND_INDEX`

## Pre-checks

**STOP** if `TARGET_PLUGIN_PATH` does not exist.

**STOP** if `TARGET_PLUGIN_PATH/rawdocs/` does not exist.

## Steps

1. Generate mutation profile using [`mutation-generation-strategy.md`](../refine-test-iterative-syncs/references/mutation-generation-strategy.md).
2. Apply only this round's mutation under `TARGET_PLUGIN_PATH/rawdocs/`.
3. Follow run 1 in [`shared-execution-run-1.md`](../../references/tests/shared-execution-run-1.md), substituting caller `TARGET_PLUGIN_PATH`.
4. Apply [`shared-execution-mutation-window.md`](../../references/tests/shared-execution-mutation-window.md).
5. Follow run 2 in [`shared-execution-run-2.md`](../../references/tests/shared-execution-run-2.md) with the same `TARGET_PLUGIN_PATH`.
6. Produce round report using [`iteration-report-shape.md`](../refine-test-iterative-syncs/references/iteration-report-shape.md).
7. Score outcomes using [`sync-goals-and-bucketing-criteria.md`](../refine-test-iterative-syncs/references/sync-goals-and-bucketing-criteria.md).
8. Apply targeted improvement patches following [`improvement-application-policy.md`](../refine-test-iterative-syncs/references/improvement-application-policy.md).

## Required report shape

Follow [`iteration-report-shape.md`](../refine-test-iterative-syncs/references/iteration-report-shape.md).

## Verification

Apply [`complex-verification.md`](../../references/tests/complex-verification.md) with caller-provided `TARGET_PLUGIN_PATH`.

- [ ] `ROUND_INDEX` included in round report
- [ ] Exactly one mutation profile used
- [ ] Both run-1 and run-2 completed
- [ ] Scorecard includes pass/partial/fail against sync goals
- [ ] Any applied patch references a concrete failure signature

## Cross-references

- [`../seed-test-iterative-syncs/SKILL.md`](../seed-test-iterative-syncs/SKILL.md)
- [`../struct-sync/SKILL.md`](../struct-sync/SKILL.md)
- [`../refine-test-iterative-syncs/references/iteration-report-shape.md`](../refine-test-iterative-syncs/references/iteration-report-shape.md)
- [`../refine-test-iterative-syncs/references/sync-goals-and-bucketing-criteria.md`](../refine-test-iterative-syncs/references/sync-goals-and-bucketing-criteria.md)
