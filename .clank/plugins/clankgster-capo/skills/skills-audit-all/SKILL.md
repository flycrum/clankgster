---
name: skills-audit-all
description: >-
  Runs all standalone skills audits via sub-agents for one target skill
  directory and returns a combined report. Optionally triggers SkillsUpdate as a
  healer flow after review.
allowed-tools:
  - Agent
  - AskUserQuestion
  - mcp__capo__SkillsUpdate
---

# Audit all standalone skills pathways

## Scope

Run the full standalone `skills/` audit suite against one target skill directory.

## Steps

1. Resolve target standalone skill directory.
2. Launch leaf audits via sub-agents:
   - `skills-audit-content-quality`
   - `skills-audit-internal-links`
   - `skills-audit-external-links`
   - `skills-audit-fact-check`
   - `skills-audit-source-freshness`
3. Collect full reports and build:
   - summary table
   - full appended reports in audit-type sections
4. Ask user whether to run healer flow via `SkillsUpdate`.
5. If yes, call `SkillsUpdate` with target path and aggregated findings context.

## Sub-agent execution contract

- Sub-agents are mandatory for leaf execution.
- Launch in parallel where safe.
- Require full markdown report return from each leaf.

## Output format

- `# Standalone skills audit: <skill-name>`
- `## Summary` table
- appended full reports
- optional healer handoff result

## Verification

- [ ] All 5 standalone-skill audits executed through sub-agents
- [ ] Summary aligns to leaf results
- [ ] Full reports preserved
- [ ] Healer prompt displayed

## Cross-references

- [skill-asking-for-user-input.md](../skills-write-context/docs/skill-asking-for-user-input.md)
- [common-internal-mcp-routing-spec.md](../../docs/common-internal-mcp-routing-spec.md)
