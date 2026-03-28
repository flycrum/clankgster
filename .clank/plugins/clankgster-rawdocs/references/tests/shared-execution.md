# Shared execution flow (rawdocs continuity tests)

Use with the **test plugin path** named in the parent skill’s `## Scope` (below: `TARGET_PLUGIN_PATH`).

## Sub-agent vs in-session

1. **Scaffold creation** — Run in a **dedicated sub-agent** when the parent skill says so; wait for completion.
1. **All remaining steps** — Run **in-session** (no sub-agent) unless the user explicitly requests otherwise.

## Run 1 — baseline structural sync

1. Read and summarize the current `rawdocs/` tree under `TARGET_PLUGIN_PATH` (file list + short content summary).
1. Run [`rawdocs-struct-sync`](../../skills/struct-sync/SKILL.md) for `TARGET_PLUGIN_PATH` and wait for completion.
1. Snapshot and analyze resulting changes under `TARGET_PLUGIN_PATH` **outside** `rawdocs/` (file list + content-level summary).
1. Produce a tiny **run-1** source-to-output trace map artifact (rawdocs section or file → generated/updated non-`rawdocs/` paths).

## Rawdocs mutation (between runs)

Perform **only** the edit described in the parent skill’s **Rawdocs mutation** section (that section is unique per test variant).

## Run 2 — structural sync after mutation

1. Re-run [`rawdocs-struct-sync`](../../skills/struct-sync/SKILL.md) for `TARGET_PLUGIN_PATH` and wait for completion.
1. Snapshot and analyze resulting changes again under `TARGET_PLUGIN_PATH` outside `rawdocs/`.
1. Produce a tiny **run-2** source-to-output trace map artifact (rawdocs section or file → generated/updated/removed non-`rawdocs/` paths).
1. Compare first-run vs second-run non-`rawdocs/` outputs and classify churn severity using [shared-churn-severity.md](shared-churn-severity.md).
1. Report observations against goals in [`rawdocs-structify-architecture.md`](../rawdocs-structify-architecture.md), with explicit callout for: **"Maintain continuity across repeated structural sync runs while allowing structure to evolve."**

## Cross-references

* [shared-report-shape.md](shared-report-shape.md)
* [../rawdocs-structify-architecture.md](../rawdocs-structify-architecture.md)
