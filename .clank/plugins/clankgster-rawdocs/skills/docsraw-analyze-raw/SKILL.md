---
name: docsraw-analyze-raw
description: >-
  Analyzes only a target plugin's `rawdocs/` directory in isolated context,
  capturing themes, writing-style signals, and structure recommendations for
  high-fidelity sync planning with near-zero creative rewriting.
allowed-tools:
  - AskUserQuestion
  - Agent
  - WebSearch
---

# Analyze rawdocs only

## Scope

Analyze only `<targetPluginRoot>/rawdocs/` recursively and return a complete, extensive report that can be consumed by `docsraw-sync-run`.

For strict scope and exclusion details, follow:

- [docsraw-analysis-scope-raw-only.md](docs/docsraw-analysis-scope-raw-only.md)

This skill is intentionally strict. Scope reminders about raw-only analysis are required and should be repeated throughout execution.

## Pre-checks

1. Determine target plugin root:
   - preferred: explicit path in parent sub-agent prompt,
   - fallback: `AskUserQuestion` asking for either target plugin path or explicit `rawdocs/` path.
2. Normalize target plugin root if the input is a `rawdocs/` directory path.
3. Validate `<targetPluginRoot>/rawdocs/` exists and is a directory.
4. State scope explicitly before reading files: "This run analyzes only `rawdocs/`."

## Steps

1. **Reference capo guidance before interpretation**
   - Read and apply plugin-authoring structure guidance from:
     - `.clank/plugins/clankgster-capo/skills/plugins-write-context/SKILL.md`
     - `.clank/plugins/clankgster-capo/skills/plugins-write-context/reference.md`
   - Treat this guidance as organization criteria, not as a writing-style override.

2. **Read rawdocs text sources only**
   - Recursively enumerate files under `<targetPluginRoot>/rawdocs/`.
   - Read text-based files and skip non-text/binary files.
   - Track:
     - files analyzed,
     - files skipped and why.

3. **Extract source-of-truth thematic model**
   - Identify major themes and objective clusters from raw documents.
   - Identify likely plugin-content destinations (`rules/`, `skills/`, `references/`, `docs/`, `agents/`, `hooks/`) for each theme.
   - Preserve meaning and intent from raw source language.

4. **Capture style and habit profile (high priority)**
   - Record writing style and organizational habits, including:
     - section-header style,
     - tone and level of directness,
     - quoting style in code examples (single vs double where visible),
     - list/numbering preferences,
     - common phrase patterns.
   - Capture patterns as reusable profile notes for downstream generation.

5. **Run theme-aligned external research**
   - Run web research for similar plugin/documentation patterns aligned to detected themes.
   - Focus on organization strategies and file breakdown patterns that improve long-term maintainability.
   - Do not import external phrasing as replacement voice.

6. **Produce low-creativity organization analysis**
   - Propose logical grouping and splitting strategy for downstream plugin outputs.
   - Optimize for clarity, composability, and future growth.
   - Use near-zero creativity for textual reinterpretation:
     - preserve source wording whenever feasible,
     - only suggest light spelling/grammar cleanup when clearly beneficial,
     - do not over-edit user-authored voice.
     - allow curse words cause they're cool 🤬

7. **Return complete downstream-ready output**
   - Output must be extensive, not summarized away.
   - Output must be structured with all sections from the output schema below.

## Output schema (required)

1. `# Rawdocs analysis report`
2. `## Scope statement` (explicit raw-only confirmation)
3. `## Input inventory`
   - analyzed file list
   - skipped file list with reason
4. `## High-level themes and objectives`
5. `## Style and tone profile`
6. `## Capo-guided organization mapping`
   - theme -> recommended plugin pathway(s)
7. `## External research findings`
8. `## Proposed content grouping and split strategy`
9. `## Fidelity guardrails for downstream sync`
10. `## Risks, ambiguities, and follow-up prompts`
11. `## Completion checklist`

## Not allowed

- Reading any file outside `<targetPluginRoot>/rawdocs/`
- Using existing non-rawdocs plugin files as interpretation input
- Returning only a short abstract
- Rewriting user content with high creativity or strong voice substitution

## Verification

- [ ] Scope was explicitly constrained to `rawdocs/` only
- [ ] Non-text files were skipped with explicit reporting
- [ ] Capo write guidance was referenced and applied as structure criteria
- [ ] Style/tone profile was captured in detail
- [ ] External research was included and clearly separated from source truth
- [ ] Output includes every required schema section

## Cross-references

- [docsraw-analysis-scope-raw-only.md](docs/docsraw-analysis-scope-raw-only.md)
- [rawdocs-style-preservation-principles.md](../../references/rawdocs-style-preservation-principles.md)
- [rawdocs-capo-dependencies-and-exceptions.md](references/rawdocs-capo-dependencies-and-exceptions.md)
