# CLANK.md target resolution (shared)

Use this decision path before running any `clankmd-audit-*` workflow.

## Resolution order

1. **Focused file shortcut**
   - If host/editor context includes a currently focused file and it ends with `CLANK.md`, use that file path as target
2. **Explicit user selection**
   - If focused file is missing or not a `CLANK.md`, ask the user to choose target
   - Use AskUserQuestion with:
     - 2-4 best-guess `CLANK.md` path options (if known)
     - one free-text `"Other"` option for manual path entry
3. **Validation**
   - Confirm selected path exists and file name is `CLANK.md`
   - If invalid, ask again with corrected options

## Candidate discovery guidance

- Use file search to find `**/CLANK.md` candidates when options are not obvious
- Prefer nearest project-level candidates first
- If exactly one candidate exists, still state the chosen path explicitly in output
