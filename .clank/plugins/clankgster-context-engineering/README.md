# clankgster-context-engineering plugin

Context engineering toolkit for writing agent-optimized plugin content. Codifies best practices for skills, rules, references, docs, and plugin organization across Claude Code, Cursor, and Codex.

## Layout

### Skills

- [`clankgster-write-plugins-context`](skills/clankgster-write-plugins-context/SKILL.md) — Transform raw content into optimized plugin files via a 3-pass workflow (draft, refine, finalize). Synced as `clankgster-context-engineering-clankgster-write-plugins-context`.

### Rules

- [`writing-rules`](rules/clankgster-context-engineering-writing-rules.md) — Conventions for writing effective rule files
- [`writing-skills`](rules/clankgster-context-engineering-writing-skills.md) — Conventions for writing effective SKILL.md files
- [`organizing-plugin-content`](rules/clankgster-context-engineering-organizing-plugin-content.md) — How to decide what goes where in a plugin

### References

Shared material linked from skills and rules:

- [`prompt-techniques`](references/clankgster-context-engineering-prompt-techniques.md) — Positive framing, XML tags, emphasis, checklists, sub-agents, tool requests
- [`writing-descriptions`](references/clankgster-context-engineering-writing-descriptions.md) — Description field best practices, testing, trigger phrases
- [`tool-calls`](references/clankgster-context-engineering-tool-calls.md) — Complete tool reference for Claude Code, Cursor, Codex
- [`progressive-disclosure`](references/clankgster-context-engineering-progressive-disclosure.md) — Loading model, layer design, context budget

### Commands

- [`example-command`](commands/clankgster-context-engineering-example-command.md) — Teaching example of the command format (annotated)

### Docs

Background material not linked from active content:

- [`content-type-decision-tree`](docs/clankgster-context-engineering-content-type-decision-tree.md) — "I have content X → which type?"
- [`content-type-comparison-matrix`](docs/clankgster-context-engineering-content-type-comparison-matrix.md) — Exhaustive feature comparison of all content types
- [`deep-research-report`](docs/clankgster-context-engineering-deep-research-report.md) — Full research findings on context engineering (March 2026)

## After changing this plugin

Run `pnpm clankgster-sync:run` from the monorepo root to sync changes into agent-specific directories. Verify outputs in `.claude/skills/` and `.claude/rules/`.
