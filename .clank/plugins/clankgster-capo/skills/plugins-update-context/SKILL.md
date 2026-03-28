---
name: plugins-update-context
description: >-
  Updates source pathway `plugins/` content across skills, rules, references,
  and docs with cross-link validation. Use when editing an existing plugin and
  preserving internal consistency.
---

# Update plugin context

## Scope

Source pathway `plugins/` content only. Edits existing plugin trees with cross-link validation.

## Steps

1. Read [reference.md](reference.md).
2. Read affected plugin files.
3. Apply requested edits with pathway prefix conventions.
4. Re-check internal links and file references.
5. Produce finalized update output.

This skill is also the target of MCP route `plugins.update` (`PluginsUpdate`).

## Verification

- [ ] Updated files keep naming conventions
- [ ] Cross-links resolve after edits
- [ ] No stale references remain

## Cross-references

- [reference.md](reference.md)
