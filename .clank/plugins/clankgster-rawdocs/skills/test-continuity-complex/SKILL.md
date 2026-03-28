---
name: rawdocs-test-continuity-complex
description: >-
  Runs a complex continuity test for rawdocs structural sync by creating
  `.clank/plugins/hello-test-complex` with a multi-file Mars-style rawdocs seed,
  running structural sync twice with a targeted rawdocs edit between runs, and
  comparing non-rawdocs churn against continuity goals.
---

# rawdocs test continuity complex

## Scope

**Test plugin path (`TARGET_PLUGIN_PATH`):** `.clank/plugins/hello-test-complex`

Same intent as [`rawdocs-test-continuity-simple`](../test-continuity-simple/SKILL.md), but the fixture uses **five heterogeneous `rawdocs/*.md` files** (no prescribed “rules” / “skills” sections in source) copied from [`references/test-complex-rawdocs/`](../../references/test-complex-rawdocs/).

## Pre-checks

**STOP** if `.clank/plugins/hello-test-complex` already exists and the user does not explicitly allow overwrite or reuse.

## Steps

1. In a sub-agent, create `TARGET_PLUGIN_PATH` using [`rawdocs-create-complex-plugin`](../create-complex-plugin/SKILL.md) (user must confirm the path). Wait for completion.
1. Execute the shared flow in [`shared-execution.md`](../../references/tests/shared-execution.md), substituting **`TARGET_PLUGIN_PATH`** = `.clank/plugins/hello-test-complex`.
1. For **Rawdocs mutation (between runs)**, follow [`complex-mutation.md`](../../references/tests/complex-mutation.md) (same `TARGET_PLUGIN_PATH`).

## Required report shape

Follow [`shared-report-shape.md`](../../references/tests/shared-report-shape.md).

## Verification

Apply [`complex-verification.md`](../../references/tests/complex-verification.md) with **`TARGET_PLUGIN_PATH`** = `.clank/plugins/hello-test-complex`.

## Cross-references

* [`../create-complex-plugin/SKILL.md`](../create-complex-plugin/SKILL.md)
* [`../struct-sync/SKILL.md`](../struct-sync/SKILL.md)
* [`../../references/tests/`](../../references/tests/) (shared continuity partials)
* [`../../references/test-complex-rawdocs/`](../../references/test-complex-rawdocs/)
* [`../../references/rawdocs-structify-architecture.md`](../../references/rawdocs-structify-architecture.md)
