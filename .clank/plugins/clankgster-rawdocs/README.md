# clankgster-rawdocs plugin

`clankgster-rawdocs` is a source-pathway `plugins/` workflow system for users who want to author context in one or more raw files first, then sync that raw material into a well-structured plugin layout.

## Why this exists

This plugin reduces organizational burden for plugin authors.

Instead of:

- requiring immediate decisions about `rules/` vs `skills/` vs `references/` vs `docs/`...
- users can put unstructured source material in `rawdocs/` within their target plugin

Then simply run the sync logic that:

- interprets intent and themes from raw materials,
- preserves writing style and habits,
- uses existing plugin structure for continuity where appropriate,
- scales structure as content evolves over time.

## Hard boundary model

`rawdocs/` is an internal source-input zone, not a public plugin pathway.

- Files outside `rawdocs/` must not link to `rawdocs/`.
- `docsraw-sync-run` treats `rawdocs/` as source input and leaves it unmodified.
- Sync output is written to normal plugin pathways (`rules/`, `skills/`, `references/`, `docs/`, and related plugin files).

See:

- [rawdocs-sync-safety-and-deletion-guardrails](rules/rawdocs-sync-safety-and-deletion-guardrails.md)

## Core skills

- [`docsraw-sync-run`](skills/docsraw-sync-run/SKILL.md)
- [`docsraw-analyze-raw`](skills/docsraw-analyze-raw/SKILL.md)
- [`docsraw-analyze-existing`](skills/docsraw-analyze-existing/SKILL.md)

## Supporting references and docs

- [rawdocs-sync-execution-model](skills/docsraw-analyze-existing/references/rawdocs-sync-execution-model.md)
- [rawdocs-style-preservation-principles](references/rawdocs-style-preservation-principles.md)
- [rawdocs-capo-dependencies-and-exceptions](skills/docsraw-analyze-raw/references/rawdocs-capo-dependencies-and-exceptions.md)
- [rawdocs-internal-planning-notes](docs/rawdocs-internal-planning-notes.md)

## Dependency note

This plugin intentionally depends on selected guidance from `clankgster-capo` and permits narrowly scoped cross-plugin references as an explicit exception for this system.
