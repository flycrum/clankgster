# Docsraw sub-agent contract

This contract governs sub-agent execution inside `docsraw-sync-run`.

## Why this exists

`docsraw-sync-run` intentionally delegates analysis to isolated sub-agents so each analysis stream has focused context boundaries and does not bleed into sibling analysis or parent planning context.

## Required sub-agents

1. `docsraw-analyze-raw`
2. `docsraw-analyze-existing`

These should be launched in parallel when possible.

## Required prompt content for each leaf

Every delegated prompt must include:

1. explicit validated target plugin root path,
2. explicit scope boundary statement,
3. explicit exclusion statement,
4. instruction to return complete report (no truncation).

## Scope split requirements

- `docsraw-analyze-raw`: analyze only `<targetPluginRoot>/rawdocs/**`.
- `docsraw-analyze-existing`: analyze `<targetPluginRoot>/**` excluding `<targetPluginRoot>/rawdocs/**`.

No overlap is allowed.

## Completion and wait behavior

Parent workflow must wait for both sub-agents and only proceed once both complete reports are present.

If either report is missing required sections:

- request completion from leaf or rerun leaf,
- do not proceed to merge plan.

## Output transport requirements

Parent should preserve leaf output content as structured input, not aggressively summarize away details needed for downstream planning and safety checks.
