# Common scope: content quality audit

Use this scope guidance for pathway-specific `*-audit-content-quality` skills.

- Target markdown content only.
- Evaluate prompt-engineering quality, not runtime behavior.
- Keep pathway-specific targeting details in the calling SKILL (`plugin dir`, `standalone skill dir`, or single `CLANK.md` file).
- **Sibling audit skills:** Parallel `*-audit-*` leaf skills that share the same Scope → shared `common-audit/*` step layout are **intentional progressive disclosure**. Do not treat that repetition as a defect unless instructions contradict each other.
- **Repeated guardrails:** The same caution (for example “MCP routing is advanced”) may appear in README, a reference, and a spec so each surface stands alone when preloaded in isolation. Do not flag that as redundant unless wording diverges in a confusing way.
