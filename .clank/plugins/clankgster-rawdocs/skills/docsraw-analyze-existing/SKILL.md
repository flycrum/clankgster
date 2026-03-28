---
name: docsraw-analyze-existing
description: >-
  Analyzes a target plugin's existing structure and text-based content while
  strictly excluding `rawdocs/`, returning continuity-focused output for sync
  planning and repeat-run stability.
allowed-tools:
  - AskUserQuestion
  - Agent
---

# Analyze existing plugin context (excluding rawdocs)

## Scope

Analyze target plugin context recursively while strictly excluding `rawdocs/` and all nested `rawdocs/**` paths.

For strict inclusion/exclusion requirements, follow:

- [docsraw-analysis-scope-existing-only.md](docs/docsraw-analysis-scope-existing-only.md)

Scope reminders about excluding `rawdocs/` are mandatory and should be repeated.

## Pre-checks

1. Determine target plugin root:
   - preferred: explicit path from parent sub-agent prompt,
   - fallback: `AskUserQuestion` requesting plugin path or `rawdocs/` path.
2. Normalize root when input is a `rawdocs/` path.
3. Validate target plugin root exists and is a directory.
4. Build scope statement: "Analyze all plugin files except `rawdocs/`."

## Steps

1. **Build non-rawdocs sitemap**
   - Recursively inventory target plugin folders/files excluding `rawdocs/`.
   - Return structural map for continuity analysis (this is effectively a site map).

2. **Handle empty/new plugin fast path**
   - If non-`rawdocs/` inventory is empty or near-empty:
     - return explicit status `New and or empty`,
     - skip deeper read steps,
     - provide short execution note telling parent workflow to proceed from scratch.

3. **Read existing text-based files (non-rawdocs only)**
   - Read all text-based files recursively in included scope.
   - Skip non-text/binary files and record them.

4. **Capture continuity profile**
   - For each existing file, capture high-level:
     - purpose,
     - section-outline structure,
     - stylistic conventions,
     - organizational role in current plugin.
   - Keep this high-level; do not carry large specific excerpts.

5. **Extract structure-evolution guidance**
   - Identify what should be preserved for continuity.
   - Identify where structure should evolve as content scales.
   - Mark likely merge, split, rename, and regroup opportunities at file/folder level.

6. **Return complete downstream-ready output**
   - Output must be extensive and complete for `docsraw-sync-run`.
   - Include explicit exclusion confirmations proving `rawdocs/` was not analyzed.

## Output schema (required)

1. `# Existing context analysis report`
2. `## Scope statement` (explicit rawdocs exclusion)
3. `## Non-rawdocs sitemap`
4. `## Empty/new plugin determination`
5. `## File-purpose and outline profile`
6. `## Style/tone continuity profile`
7. `## Structural continuity anchors`
8. `## Scale/evolution recommendations`
9. `## Skipped non-text inventory`
10. `## Risks and ambiguities`
11. `## Completion checklist`

## Not allowed

- Reading anything under `rawdocs/`
- Mentioning `rawdocs/` content details in this report
- Returning low-detail summaries that cannot drive sync planning
- Copying large textual excerpts from existing files into final output

## Verification

- [ ] All analysis excluded `rawdocs/` recursively
- [ ] Empty/new branch returns explicit `New and or empty` when applicable
- [ ] Text-only read policy was applied with skip inventory
- [ ] Output focuses on continuity signals over detailed textual carryover
- [ ] Output includes all required sections

## Cross-references

- [docsraw-analysis-scope-existing-only.md](docs/docsraw-analysis-scope-existing-only.md)
- [rawdocs-sync-execution-model.md](references/rawdocs-sync-execution-model.md)
- [rawdocs-style-preservation-principles.md](../../references/rawdocs-style-preservation-principles.md)
