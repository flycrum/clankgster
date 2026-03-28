# Existing-only analysis scope contract

This document defines the mandatory scope contract for `docsraw-analyze-existing`.

## Objective

Analyze all plugin content under the target plugin root except `rawdocs/`, then return an extensive continuity profile for downstream sync planning.

## In-scope locations

- `<targetPluginRoot>/**`

## Out-of-scope locations

- `<targetPluginRoot>/rawdocs/` and every nested path under it
- Any paths outside the target plugin root

## Critical exclusion requirement

`rawdocs/` must be treated as if it does not exist for this analysis. Do not scan it, do not read it, do not summarize it, and do not include it in sitemaps.

This exclusion statement should be repeated in prompts and checks intentionally.

## Empty/new plugin behavior

If all non-`rawdocs/` content is empty or near-empty:

- skip deeper read/analysis steps,
- return status `New and or empty`,
- instruct parent workflow to proceed with sync-from-scratch logic.

## Text-specific interpretation policy

- Read text-based files only.
- Skip non-text/binary files with explicit inventory.
- Focus on high-level purpose, structure, and style conventions.
- Avoid carrying over large specific textual excerpts in output.

## Prohibited behavior

- Reading any file under `rawdocs/`
- Mixing rawdocs findings into existing-only analysis
- Over-indexing on detailed content carryover instead of structural continuity signals
