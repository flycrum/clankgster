---
name: rawdocs-test-continuity-simple
description: >-
  Runs a simple continuity test for rawdocs structural sync by creating
  `.clank/plugins/hello-world`, running structural sync, editing the plugin's own
  `rawdocs/getting-started.md`, rerunning structural sync, and comparing non-rawdocs
  output churn across runs against continuity goals.
---

# rawdocs test continuity simple

## Scope

Execute a fixed-path continuity test focused on `.clank/plugins/hello-world` and measure output churn outside `rawdocs/` across two structural sync runs.

## Pre-checks

**STOP** if `.clank/plugins/hello-world` already exists and the user does not explicitly allow overwrite or reuse.

## Steps

1. In a sub-agent, create `.clank/plugins/hello-world` using [`rawdocs-create-plugin`](../create-plugin/SKILL.md) and wait for completion.
1. Execute all remaining steps in-session (no sub-agent) unless the user explicitly requests otherwise.
1. Read and summarize `.clank/plugins/hello-world/rawdocs/getting-started.md`.
1. Run [`rawdocs-struct-sync`](../struct-sync/SKILL.md) for `.clank/plugins/hello-world` and wait for completion.
1. Snapshot and analyze resulting changes under `.clank/plugins/hello-world` outside `rawdocs/` (file list + content-level summary).
1. Produce a tiny run-1 source-to-output trace map artifact (rawdocs section -> generated/updated non-rawdocs file paths).
1. Edit the created `.clank/plugins/hello-world/rawdocs/getting-started.md` file to remove the `Rare penguin protocol` block.
1. Re-run [`rawdocs-struct-sync`](../struct-sync/SKILL.md) for `.clank/plugins/hello-world` and wait for completion.
1. Snapshot and analyze resulting changes again under `.clank/plugins/hello-world` outside `rawdocs/`.
1. Produce a tiny run-2 source-to-output trace map artifact (rawdocs section -> generated/updated/removed non-rawdocs file paths).
1. Compare first-run vs second-run non-rawdocs outputs and classify churn severity (`none` = no file/content changes; `low` = localized wording updates with stable structure; `medium` = multi-file rewrites without major tree changes; `high` = broad rewrites and/or structural shifts).
1. Report observations against goals in [`rawdocs-structify-architecture.md`](../../references/rawdocs-structify-architecture.md), with explicit callout for: "Maintain continuity across repeated structural sync runs while allowing structure to evolve."

## Required report shape

Return:

1. target paths used
1. run 1 non-rawdocs output snapshot
1. run 2 non-rawdocs output snapshot
1. run 1 source-to-output trace map artifact (tiny mapping)
1. run 2 source-to-output trace map artifact (tiny mapping)
1. a markdown table of change-cases (up to 10 rows, no more than 10)

Table schema:

- `case_id`
- `summary`
- `before_path`
- `after_path`
- `change_type` (must be one of: `file content modification change`, `file content removal change`, `file content additional change`)

1. diff summary (before vs after), including files added/removed/modified and lines added/removed
1. churn severity
1. goal-by-goal verdict with status markers (`✅ pass`, `🥕 partial`, `❌ fail`)
1. concise recommendations if continuity is weak

## Verification

- [ ] `.clank/plugins/hello-world` was created via `rawdocs-create-plugin`
- [ ] Both structural sync runs completed
- [ ] Both analysis snapshots excluded `rawdocs/`
- [ ] Only step 1 ran in a sub-agent; all later steps ran in-session
- [ ] `Rare penguin protocol` block was removed from `.clank/plugins/hello-world/rawdocs/getting-started.md` between runs
- [ ] Run-1 and run-2 source-to-output trace map artifacts are included
- [ ] Before/after comparison includes file-level and content-level conclusions
- [ ] Results include a capped change-cases table with 10 or fewer rows
- [ ] Final verdict explicitly evaluates continuity goal

## Cross-references

- [../create-plugin/SKILL.md](../create-plugin/SKILL.md)
- [../struct-sync/SKILL.md](../struct-sync/SKILL.md)
- [../../references/rawdocs-structify-architecture.md](../../references/rawdocs-structify-architecture.md)
