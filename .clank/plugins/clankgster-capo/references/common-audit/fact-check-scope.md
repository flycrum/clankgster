# Common scope: fact-check audit

Use this scope guidance for pathway-specific `*-audit-fact-check` skills.

- Audit factual claims in markdown content.
- Focus on verifiable statements (versions, limits, behavior, support).
- Keep pathway-specific target selection in the calling SKILL.
- **Open standard vs product:** Attribute behavior to the right layer (for example [agentskills.io](https://agentskills.io/specification) vs Claude Code vs Cursor docs). Do not mark plugin-internal taxonomy (Clankgster pathways, matrix rows) as incorrect because a vendor uses different names.
- **Heuristics:** Sentences framed as rules of thumb, editorial synthesis, or uncited empirical tables are **lower severity** unless they contradict a cited primary source in the same file.
