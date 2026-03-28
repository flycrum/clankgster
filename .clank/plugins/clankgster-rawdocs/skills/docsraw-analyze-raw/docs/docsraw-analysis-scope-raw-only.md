# Raw-only analysis scope contract

This document defines the mandatory scope contract for `docsraw-analyze-raw`.

## Objective

Analyze only the target plugin's `rawdocs/` directory (including nested files and subdirectories) and produce an extensive synthesis suitable for downstream sync planning.

## In-scope locations

- `<targetPluginRoot>/rawdocs/`
- Any nested paths under `<targetPluginRoot>/rawdocs/**`

## Out-of-scope locations

- Any sibling directories at `<targetPluginRoot>/*` other than `rawdocs/`
- Any parent directories above target plugin root
- Any other plugin roots in source pathway `plugins/`
- Any files in the target plugin outside `rawdocs/`

## File-type handling

- Read text-based files.
- Skip binary/non-text content (images, archives, compiled artifacts, unknown binary blobs).
- Record skipped files in output so the parent workflow has complete visibility.

## Mandatory repetition requirement

The scope reminder "only `rawdocs/`" should be repeated in prompts, checklists, and verification sections. This repetition is required and should not be removed as redundancy.

## Style-preservation capture requirements

Collect style signals without rewriting source text:

- heading style and section habits,
- cadence and tone,
- preference patterns such as single-quote vs double-quote in code examples,
- list structure habits and terminology patterns.

## Prohibited behavior

- Reading files outside `rawdocs/`
- Inferring target content from non-rawdocs files
- Performing transformations that aggressively rewrite user voice
- Returning shallow summaries that cannot drive downstream planning
