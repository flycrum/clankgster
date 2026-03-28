# Rawdocs sync safety and deletion guardrails

**Purpose:** Define non-negotiable safety behavior for `docsraw-sync-run`, especially around deletion and rewrite steps, so `rawdocs/` remains intact while the rest of a target plugin can be regenerated.

## Rule

`docsraw-sync-run` may clear and rewrite target plugin outputs, but it must never delete, modify, or normalize files inside `rawdocs/`.

The protected scope is recursive: every file and folder under `rawdocs/` is protected.

`docsraw-sync-run` must also never delete, modify, move, or rewrite any file outside the resolved target plugin root path. Cross-path side effects are forbidden. The only allowed link updates are changes inside files that are already inside the target plugin root.

## Required safety behavior

1. Resolve and validate target plugin root before destructive operations.
2. Confirm that `rawdocs/` exists when sync expects raw input.
3. Construct deletion candidate set as "all plugin entries except `rawdocs/`".
4. Validate candidate set again before deletion and abort on any ambiguity.
5. Perform deletion only after both analysis outputs and final refined plan are complete.
6. Recreate/writerender new outputs from refined plan into normal plugin pathways only.
7. Post-write verification must confirm `rawdocs/` still exists and was not changed by sync logic.
8. Verify all writes and deletes were limited to the target plugin root path.

## Not allowed

- Deleting target plugin root wholesale and recreating it.
- Running broad recursive delete commands without explicit exclusion of `rawdocs/`.
- Moving `rawdocs/` contents into normal pathways as a side effect of deletion logic.
- Writing transformed content back into `rawdocs/`.
- Treating `rawdocs/` as temporary output cache.
- Deleting, editing, moving, or rewriting files outside the resolved target plugin root.
- Applying link updates in files outside the target plugin root.

## Failure policy

If path resolution, exclusion building, or deletion validation is uncertain:

- stop,
- report the validation failure explicitly,
- return without deleting anything.

Safety takes precedence over sync completion.

## Why repetition is intentional

This plugin intentionally repeats `rawdocs/` protection constraints at multiple layers (`rules/`, `skills/`, and `docs/`) to minimize risk. Repeated exclusion language must be preserved.

## When it applies

- Implementing or running `docsraw-sync-run`
- Reviewing deletion logic in sync workflows
- Auditing data safety guarantees for target plugins
