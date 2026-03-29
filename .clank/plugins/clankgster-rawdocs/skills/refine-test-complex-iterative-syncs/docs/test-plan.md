# Test plan — refine test complex iterative syncs

This plan defines how to run and evaluate iterative structural sync refinement.

## Objective

Improve `rawdocs-struct-sync` outcomes over repeated continuity cycles by:

- varying realistic rawdocs changes
- measuring continuity and bucketing quality
- applying targeted sync-system improvements between iterations

## Fixture and setup

- Fixed fixture path:
  - `.clank/plugins/_rawdocs-refine-test-complex-iterative-syncs`
- Seed source reference:
  - [`step-4-seed-rawdocs.md`](../../create-complex-plugin/references/step-4-seed-rawdocs.md)
- Fixture reset happens once before loop start.

## Loop contract

- One-time pause preference question before iteration 1.
- Default max iterations: `10`.
- User may override count or provide stop condition.
- For each iteration:
  1. generate mutation profile
  1. apply mutation
  1. run continuity flow
  1. score outputs
  1. patch sync system

## Success measurements

Primary:

1. improved score trend against [`sync-goals-and-bucketing-criteria.md`](../references/sync-goals-and-bucketing-criteria.md)
2. reduced unnecessary churn for traceable paths
3. stronger subtractive sync behavior when rawdocs removes support

Secondary:

1. better bucket fit (`rules/` and `skills/` first, justified `references/`, minimized top-level `docs/`)
2. fewer policy violations per iteration
3. fewer ad hoc manual corrections required

## Allowed patch targets

Patch priority order:

1. [`../../struct-sync/SKILL.md`](../../struct-sync/SKILL.md)
2. [`../../struct-sync/references/`](../../struct-sync/references/)
3. [`../../../references/rawdocs-structify-architecture.md`](../../../references/rawdocs-structify-architecture.md)
4. [`../../test-continuity-complex-existing/SKILL.md`](../../test-continuity-complex-existing/SKILL.md) only when instrumentation/reporting needs improvement

Apply this using [`improvement-application-policy.md`](../references/improvement-application-policy.md).

## Reporting

Use [`iteration-report-shape.md`](../references/iteration-report-shape.md) per iteration and provide a cumulative final trend summary.
