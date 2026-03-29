---
name: rawdocs-test-continuity-simple
description: >-
  Runs a simple continuity test for rawdocs structural sync by creating
  `.clank/plugins/hello-world`, running structural sync, editing the plugin's own
  `rawdocs/getting-started.md`, rerunning structural sync, and comparing non-rawdocs
  output churn across runs against continuity goals.
disable-model-invocation: true
user-invocable: false
---

# rawdocs test continuity simple

## Scope

**Test plugin path (`TARGET_PLUGIN_PATH`):** `.clank/plugins/hello-world`

Execute a fixed-path continuity test: measure output churn outside `rawdocs/` across two structural sync runs.

## Pre-checks

**STOP** if `.clank/plugins/hello-world` already exists and the user does not explicitly allow overwrite or reuse.

## Steps

1. In a sub-agent, create `TARGET_PLUGIN_PATH` using [`rawdocs-create-plugin`](../create-plugin/SKILL.md) (user must confirm the path). Wait for completion.
1. Follow run 1 in [`shared-execution-run-1.md`](../../references/tests/shared-execution-run-1.md), substituting **`TARGET_PLUGIN_PATH`** = `.clank/plugins/hello-world`.
1. For **Rawdocs mutation (between runs)**, follow [`simple-mutation.md`](../../references/tests/simple-mutation.md) (same `TARGET_PLUGIN_PATH`), then apply [`shared-execution-mutation-window.md`](../../references/tests/shared-execution-mutation-window.md).
1. Follow run 2 in [`shared-execution-run-2.md`](../../references/tests/shared-execution-run-2.md) with the same `TARGET_PLUGIN_PATH`.

## Required report shape

Follow [`shared-report-shape.md`](../../references/tests/shared-report-shape.md).

## Verification

Apply [`simple-verification.md`](../../references/tests/simple-verification.md) with **`TARGET_PLUGIN_PATH`** = `.clank/plugins/hello-world`.

## Cross-references

* [`../create-plugin/SKILL.md`](../create-plugin/SKILL.md)
* [`../struct-sync/SKILL.md`](../struct-sync/SKILL.md)
* [`../../references/tests/`](../../references/tests/) (shared continuity partials)
* [`../../references/rawdocs-structify-architecture.md`](../../references/rawdocs-structify-architecture.md)
