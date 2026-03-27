# Reference hub: plugin content authoring

Canonical quick-reference for writing source pathway `plugins/` content.

## Read order

1. [common-content-type-decision-tree.md](../../docs/common-content-type-decision-tree.md)
2. [common-content-type-comparison-matrix.md](../../docs/common-content-type-comparison-matrix.md)
3. [common-organizing-content.md](../../rules/common-organizing-content.md)
4. [common-write-skills.md](../../rules/common-write-skills.md)
5. [common-write-rules.md](../../rules/common-write-rules.md)

## Skills in plugins

Plugin `skills/<name>/SKILL.md` files share structure and frontmatter conventions with standalone source pathway `skills/`. For SKILL.md-specific authoring depth, use:

- [skills-write-context/reference.md](../skills-write-context/reference.md)

Plugin skills differ from standalone skills mainly by where they live, namespaced invocation behavior, and the fact that they are coordinated with sibling plugin content types (`rules/`, `references/`, `docs/`, `agents/`, `hooks/`).

## Other plugin content types

- Rules: [template-rule.md](docs/template-rule.md)
- References: [common-progressive-disclosure.md](../../references/common-progressive-disclosure.md)
- Docs: [plugins-matrix-loading-behavior.md](../../docs/plugins-matrix-loading-behavior.md)
- Commands: [template-command.md](docs/template-command.md)
- Agents: [template-agent.md](docs/template-agent.md)
- Hooks: [template-hooks.md](docs/template-hooks.md)
