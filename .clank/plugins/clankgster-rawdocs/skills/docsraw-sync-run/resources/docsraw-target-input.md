# Docsraw target input gate

Use this gate before `docsraw-sync-run` performs analysis or sync actions.

## Intent

Collect one explicit target from the user:

- target plugin root path, or
- target plugin `rawdocs/` path.

Then normalize to canonical target plugin root.

## Mandatory first step: AskUserQuestion

`AskUserQuestion` must be the first substantive step.

Do not infer the target from open tabs, focused files, repository search, or prior context.

## User prompt guidance

Ask for one explicit path and include this instruction:

- "Provide either the plugin root path or the plugin `rawdocs/` path. This workflow will normalize to the plugin root."

If UI options are required, keep options static and non-discovering, then let user provide free-text path.

## Normalization policy

1. If input ends in `/rawdocs` (or points to `rawdocs/`), set target plugin root to parent directory.
2. Otherwise treat input as plugin root.
3. Resolve to absolute path.

## Validation policy

After normalization, validate:

1. target exists and is a directory,
2. target has `rawdocs/` directory,
3. target is the intended plugin root for this run (or parent of the provided `rawdocs/` path).

If validation fails, ask once for corrected path under the same policy.

## Sub-agent handoff shortcut

If parent flow already validated target plugin root and passes explicit path in delegated prompt:

- skip second `AskUserQuestion`,
- re-validate before use.

## Non-interactive runs

Require explicit path from caller and apply same normalization/validation.

Never infer from discovery.
