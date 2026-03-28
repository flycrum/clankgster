# Common scope: external links audit

Use this scope guidance for pathway-specific `*-audit-external-links` skills.

- Audit only external URLs (`http://`, `https://`) found in markdown.
- Keep pathway-specific target resolution in the calling SKILL.
- **GitHub `blob` vs raw:** `https://github.com/.../blob/...` pages often return HTML shells without the markdown body in automated fetches. Do not mark **Risky** solely for an empty extracted body on blob URLs; prefer checking HTTP status or recommend `https://raw.githubusercontent.com/<org>/<repo>/<ref>/<path>` when the doc should cite machine-readable file content.
