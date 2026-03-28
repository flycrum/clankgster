# docsraw structify architecture

Detailed architecture for `docsraw-structify`, including isolation boundaries, data contracts, and continuity strategy.

## Goals

1. Let users write freely in plugin-local `rawdocs/`.
2. Convert that content into organized plugin context output.
3. Preserve writing style and intent with minimal creative rewriting.
4. Maintain continuity across repeated structify sync runs while allowing structure to evolve.
5. Keep `rawdocs/` untouched and unlinked.

## Input model

- Primary input is a user-provided path for either:
  - the target plugin root, or
  - the plugin's `rawdocs/` directory.
- Runtime normalizes to two derived paths:
  - `target_plugin_path`
  - `target_rawdocs_path` (`target_plugin_path/rawdocs`)

## Isolation model

Run two analysis workflows in separate sub-agents to avoid context bleed:

1. `docsraw-analyze-raw`
   - Reads only `rawdocs/` recursively.
   - Produces source-truth analysis package.
2. `docsraw-analyze-existing`
   - Reads all plugin content recursively except `rawdocs/`.
   - Produces continuity and structure analysis package.

## Non-overlap contract

- `docsraw-analyze-raw` must not inspect files outside `rawdocs/`.
- `docsraw-analyze-existing` must explicitly exclude `rawdocs/`.
- Combined outputs should cover the complete plugin state with zero overlap.

## Output contracts

### `docsraw-analyze-raw` output package

- Resolved rawdocs file inventory
- Text-file eligibility map and skipped non-text files list
- Theme/objective map
- Style and tone profile (headers, punctuation habits, quote preferences, cadence)
- Content clustering candidates
- Porting fidelity constraints (temperature-near-zero guidance)
- Capo-linked structure lens notes
- External pattern research digest

### `docsraw-analyze-existing` output package

- Plugin sitemap excluding `rawdocs/`
- Empty/near-empty determination
- If non-empty: per-file purpose and section-outline summary (high-level only)
- Existing style conventions profile
- Continuity anchors and potential evolution points

## Planning model

`docsraw-structify` synthesizes both analysis outputs into:

1. Draft migration/update plan
2. Refinement pass plan
3. Final file operation plan

Plan priorities:

1. Preserve author meaning and style from rawdocs
2. Respect continuity from existing structure
3. Evolve structure only when justified for scaling
4. Never alter `rawdocs/`

## Write model

1. Snapshot final plan.
2. Remove all plugin files and folders except `rawdocs/`.
3. Rebuild output folders/files from refined plan.
4. Validate:
   - no markdown links to `rawdocs/`
   - expected folder shape present
   - cross-links resolve
   - style profile alignment is documented

## Risk controls

- **Boundary risk:** accidental `rawdocs/` mutation or deletion
  - Mitigation: explicit keep-list and deletion guard.
- **Overlap risk:** both analyzers inspect same files
  - Mitigation: path filters and post-run coverage check.
- **Over-editing risk:** rewriting user voice
  - Mitigation: style profile + low-creativity constraints.
- **Continuity risk:** structure thrash between structify syncs
  - Mitigation: continuity anchors and staged restructuring criteria.

## Cross-references

- [`docsraw-structify`](../skills/docsraw-structify/SKILL.md)
- [`docsraw-analyze-raw`](../skills/docsraw-analyze-raw/SKILL.md)
- [`docsraw-analyze-existing`](../skills/docsraw-analyze-existing/SKILL.md)
- [`rawdocs-internal-linking`](../rules/rawdocs-internal-linking.md)
- [`clankgster-capo plugins-write-context`](../../clankgster-capo/skills/plugins-write-context/SKILL.md)
