---
name: rawdocs-create-complex-plugin
description: >-
  Creates a rawdocs-enabled plugin scaffold like rawdocs-create-plugin, but seeds
  `rawdocs/` with the multi-file Mars-style test bundle (turborepo, testing-types,
  VS Code extension notes) from clankgster-rawdocs references. Use for complex
  structural-sync fixtures and continuity tests—not the default getting-started
  template.
---

# rawdocs create complex plugin

## Scope

Same as [`rawdocs-create-plugin`](../create-plugin/SKILL.md) for manifests and `rawdocs/` opt-in, except **`rawdocs/` is filled by copying** the five markdown files under [`references/test-complex-rawdocs/`](../../references/test-complex-rawdocs/) instead of generating a single `getting-started.md` from the simple template.

## Pre-checks

Follow [`prechecks.md`](../../references/create-plugin-shared/prechecks.md).

## Steps

### 1) Gather target path

Follow [`step-1-gather-path.md`](../../references/create-plugin-shared/step-1-gather-path.md).

### 2) Create barebones plugin scaffold

Follow [`step-2-scaffold.md`](../../references/create-plugin-shared/step-2-scaffold.md).

### 3) Create barebones `rawdocs/` directory

Follow [`step-3-rawdocs-dir.md`](../../references/create-plugin-shared/step-3-rawdocs-dir.md).

### 4) Seed `rawdocs/` from the test-complex bundle

Follow [`step-4-seed-rawdocs.md`](references/step-4-seed-rawdocs.md).

### 5) Return setup summary

Follow [`step-5-return-summary.md`](../../references/create-plugin-shared/step-5-return-summary.md).

## Verification

* [ ] Target plugin path was explicitly provided by the user
* [ ] Bare plugin files created (`README.md`, `.claude-plugin/plugin.json`, `.cursor-plugin/plugin.json`)
* [ ] `rawdocs/` created
* [ ] All five `*.md` files from [`test-complex-rawdocs/`](../../references/test-complex-rawdocs/) exist under `target_plugin_path/rawdocs/` with matching names
* [ ] Summary includes the next step to structural sync

## Cross-references

* [`../create-plugin/SKILL.md`](../create-plugin/SKILL.md)
* [`references/create-plugin-shared/`](../../references/create-plugin-shared/) (shared steps 1–3 and 5)
* [`references/step-4-seed-rawdocs.md`](references/step-4-seed-rawdocs.md)
* [`references/test-complex-rawdocs/`](../../references/test-complex-rawdocs/)
* [`../struct-sync/SKILL.md`](../struct-sync/SKILL.md)
* [`../../rules/rawdocs-opt-in-placement.md`](../../rules/rawdocs-opt-in-placement.md)
