# Common output format: internal links audit

Include:

- `## Internal links audit: <target-name>`
- checked/broken/mismatch/ok counts
- table: source, link text, target, status, notes
- broken and mismatch entries first (navigational links in running prose only; exclude link syntax inside fenced code blocks per [internal-links-scope.md](internal-links-scope.md))
- optional trailing section or notes rows for **low** hygiene: a relative link that resolves but is shown only inside monospace instead of as a normal markdown link (not a broken target; remediation is to drop the monospace delimiters so the link renders)
