# Common scope: internal links audit

Use this scope guidance for pathway-specific **\*-audit-internal-links** skills.

- Audit relative markdown links.
- Resolve targets from each source file location.
- Keep pathway-specific target discovery in the calling SKILL.
- **Documentation hygiene (low):** When prose means “here is a link someone should follow,” write a normal markdown link in the document body (like [internal-links-output-format.md](internal-links-output-format.md)), not the same URL wrapped in monospace. Monospace around a whole link stops renderers from turning it into a link and encourages models to emit backticks around links in their own output, which is wrong for finished markdown. Flag a resolved relative target that appears only inside monospace as **low** in the notes column (optional pass if the audit focuses only on broken targets).
- **Fenced examples (out of scope for broken/mismatch):** Relative link `[]](...)` targets that appear **only** inside a fenced code block (between a line starting with \`\`\` and the closing \`\`\`) are template or sample markup, not navigational links in the host document. Do **not** count them toward broken or mismatch totals or list them in the primary broken/mismatch tables. You may add a short optional note (“template fences only”) if an inventory is required.
