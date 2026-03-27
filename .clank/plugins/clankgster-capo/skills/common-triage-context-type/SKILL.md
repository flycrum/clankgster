---
name: common-triage-context-type
description: >-
  Triages new context requests across Clankgster source pathways (`plugins/`,
  `skills/`, `CLANK.md`) and dispatches to pathway-specific MCP routes. Use when
  users ask where context should live, what to create first, or how to start a
  new context artifact.
allowed-tools:
  - AskUserQuestion
  - mcp__capo__Triage
  - mcp__capo__PluginsWrite
  - mcp__capo__SkillsWrite
  - mcp__capo__ClankMdWrite
---

# Triage context type

## Scope

Choose a source pathway, explain why, and dispatch to the appropriate MCP route.

## Steps

1. Read [reference.md](reference.md).
2. Present four options with AskUserQuestion:
   - analyze and recommend
   - source pathway `skills/`
   - source pathway `plugins/`
   - source pathway `CLANK.md`
3. If analyze and recommend is selected, inspect user intent and map to one pathway.
4. Confirm pathway choice in one sentence.
5. Call the matching MCP tool:
   - If analyze and recommend is selected, call `Triage`.
   - If source pathway `skills/` is selected, call `SkillsWrite`.
   - If source pathway `plugins/` is selected, call `PluginsWrite`.
   - If source pathway `CLANK.md` is selected, call `ClankMdWrite`.
6. Return the selected pathway and routed next action.

## Verification

- [ ] Exactly one pathway selected
- [ ] Reasoning included for analyze and recommend selection
- [ ] MCP route dispatch call made for selected pathway

## Cross-references

- [reference.md](reference.md)
