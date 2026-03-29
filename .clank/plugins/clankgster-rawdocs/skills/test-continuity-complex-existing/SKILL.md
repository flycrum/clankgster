---
name: rawdocs-test-continuity-complex-existing
description: >-
  Runs a complex continuity test for an existing pre-created plugin fixture by
  executing run-1 and run-2 structural sync phases with a caller-specified
  rawdocs mutation between runs. Use when iterating repeatedly on sync quality
  without recreating the fixture on each run.
---

# rawdocs test continuity complex existing

## Scope

Use this harness when the complex test fixture plugin already exists and is pre-seeded from [`step-4-seed-rawdocs.md`](../create-complex-plugin/references/step-4-seed-rawdocs.md).

**Caller must provide:**

1. **`TARGET_PLUGIN_PATH`** (existing plugin root path)
1. **Rawdocs mutation instructions** to apply between run 1 and run 2

## Pre-checks

**STOP** if `TARGET_PLUGIN_PATH` does not exist.

**STOP** if `TARGET_PLUGIN_PATH/rawdocs/` does not exist.

**STOP** if `TARGET_PLUGIN_PATH/rawdocs/` is not seeded from the complex bundle in [`step-4-seed-rawdocs.md`](../create-complex-plugin/references/step-4-seed-rawdocs.md).

## Steps

1. Follow run 1 in [`shared-execution-run-1.md`](../../references/tests/shared-execution-run-1.md), substituting `TARGET_PLUGIN_PATH` from caller input.
1. Apply the caller-provided **Rawdocs mutation (between runs)** instructions under `TARGET_PLUGIN_PATH/rawdocs/`.
1. Apply [`shared-execution-mutation-window.md`](../../references/tests/shared-execution-mutation-window.md).
1. Follow run 2 in [`shared-execution-run-2.md`](../../references/tests/shared-execution-run-2.md) with the same `TARGET_PLUGIN_PATH`.

## Required report shape

Follow [`shared-report-shape.md`](../../references/tests/shared-report-shape.md) unless the caller explicitly overrides report shape.

## Verification

Apply [`complex-verification.md`](../../references/tests/complex-verification.md) with caller-provided `TARGET_PLUGIN_PATH`.

## Cross-references

* [`../create-complex-plugin/SKILL.md`](../create-complex-plugin/SKILL.md)
* [`../struct-sync/SKILL.md`](../struct-sync/SKILL.md)
* [`../../references/tests/`](../../references/tests/) (shared continuity partials)
* [`../../references/test-complex-rawdocs/`](../../references/test-complex-rawdocs/)
* [`../../references/rawdocs-structify-architecture.md`](../../references/rawdocs-structify-architecture.md)
