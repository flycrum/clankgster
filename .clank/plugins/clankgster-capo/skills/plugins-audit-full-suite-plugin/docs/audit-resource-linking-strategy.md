# Audit resource linking strategy (internal)

This document describes how **this plugin** organizes shared audit guidance under plugin-root `references/common-audit/` and how pathway-specific audit skills link to those resources section-by-section. It is **internal** maintenance context for `clankgster-capo` authors and agents refactoring this tree—not a portable standard for every Clankgster plugin.

---

## Why we changed this

After splitting audits by source pathway (`plugins/`, `skills/`, `CLANK.md`), each audit type existed in three pathway variants. Those variants were mostly the same, which created:

- redundant maintenance across 15 leaf audit SKILL files
- drift risk when one pathway version changed and others did not
- unnecessary context load from repeated prose

To reduce duplication while preserving pathway-specific behavior, we moved shared audit content into plugin-root references and kept leaf SKILL files as lightweight orchestrators.

---

## Current model

For each cross-pathway audit type, shared guidance lives in:

- `.clank/plugins/clankgster-capo/references/common-audit/`

Each pathway-specific leaf skill keeps only:

- frontmatter (`name`, pathway-targeted description)
- H1 title
- pathway-specific target line(s) in `## Scope`
- non-routing exclusions (if any)
- links to shared section resources

This keeps leaf skills short and consistent while still making pathway intent explicit.

---

## Section-by-section resource pattern

Each cross-pathway audit type is split into shared files by section header:

- `<audit-type>-scope.md`
- `<audit-type>-steps.md`
- `<audit-type>-output-format.md`
- `<audit-type>-verification.md`
- `<audit-type>-cross-references.md`

Example (content quality):

- `content-quality-scope.md`
- `content-quality-steps.md`
- `content-quality-output-format.md`
- `content-quality-verification.md`
- `content-quality-cross-references.md`

Leaf skills link to these one-by-one from matching section headers.

---

## Audit types using this pattern

The following cross-pathway audit types are now section-shared:

- `content-quality`
- `external-links`
- `fact-check`
- `internal-links`
- `source-freshness`

Pathway-specific, plugins-only audits (`comparison-matrix`, `structure`) remain outside this cross-pathway section-sharing pattern.

---

## Out-of-scope cleanup rule

During this refactor, we removed noisy `## Out of scope` sections that only listed "use other audit skill X".

Rule now:

- remove routing-only exclusions
- keep only non-routing constraints that materially narrow behavior (for example anchor-only exclusions in internal-links audits)

This reduces context noise without losing practical guardrails.

---

## Boundary guardrail interaction

This strategy is designed to stay compatible with this plugin's boundary rule:

- plugin-root `references/` must not markdown-link into `skills/`, `rules/`, `commands/`, or `agents/`

So shared files in `references/common-audit/`:

- may link to other `references/` and `docs/`
- should use plain paths (not markdown links) when pointing to `skills/` or `rules/` material

Leaf SKILL files are allowed to link into `references/common-audit/`.

---

## Maintenance workflow

When updating one of the five cross-pathway audit types:

1. Edit the shared section files in `references/common-audit/` first.
2. Only edit pathway leaf SKILL files when target behavior differs by pathway.
3. Keep section header order consistent across the three pathway variants.
4. Verify no `references/` boundary violations were introduced.

When adding a brand-new cross-pathway audit type:

1. Create three leaf SKILL files (`plugins-`, `skills-`, `clankmd-`).
2. Create the five section-shared files for that audit type in `references/common-audit/`.
3. Link each leaf section to matching shared files.
4. Apply the out-of-scope cleanup rule (routing-only exclusions removed).

---

## Summary

This plugin now treats leaf audit SKILL files as pathway wrappers around shared section resources. The result is lower duplication, lower drift risk, and clearer ownership of shared audit semantics.
