# Docsraw plan refinement checklist

Use this checklist for the second refinement pass in `docsraw-sync-run`.

## Continuity and structure

- [ ] Preserves stable, useful existing structure where continuity is beneficial
- [ ] Evolves structure where scale and clarity require change
- [ ] Clearly marks merge/split/rename/regroup decisions and rationale

## Source fidelity

- [ ] Treats `rawdocs` content meaning as source of truth
- [ ] Keeps creativity near-zero for textual rewriting
- [ ] Applies grammar/spelling edits only when clearly justified
- [ ] Preserves tone, style, and heading habits inferred from source

## Safety and boundary checks

- [ ] Reaffirms that `rawdocs/` remains unmodified
- [ ] Reaffirms that final plugin files outside `rawdocs/` do not link to `rawdocs/`
- [ ] Confirms deletion candidate set excludes `rawdocs/` recursively

## Repeat-sync durability

- [ ] Plan improves consistency across future sync runs
- [ ] Naming and file boundaries support growth in future `rawdocs` additions
- [ ] Output organization avoids brittle one-off structure

## Output readiness

- [ ] Refined plan can be executed without unresolved ambiguity
- [ ] File-by-file write plan is explicit enough for deterministic generation
