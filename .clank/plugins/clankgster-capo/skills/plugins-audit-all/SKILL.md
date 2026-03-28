---
name: plugins-audit-all
description: >-
  Runs all plugin audit types via sub-agents for one target plugin and returns
  a combined report with a summary table. Optionally triggers PluginsUpdate as a
  healer flow after review.
allowed-tools:
  - Agent
  - AskUserQuestion
  - mcp__capo__PluginsUpdate
---

# Audit all plugin pathways

## Scope

Run the full plugin audit suite against one plugin under `.clank/plugins/<plugin>/`.

## Steps

1. Resolve target plugin path. Ask user if missing.
2. Launch each audit as a sub-agent (required):
   - `plugins-audit-content-quality`
   - `plugins-audit-internal-links`
   - `plugins-audit-external-links`
   - `plugins-audit-fact-check`
   - `plugins-audit-source-freshness`
   - `plugins-audit-comparison-matrix`
   - `plugins-audit-structure`
3. Use sub-agent prompts that require full report return (no truncation, no summaries).
4. Collect all responses and build:
   - cross-audit summary table
   - full appended reports, in audit-type sections
5. Ask user if they want healer flow via `PluginsUpdate`.
6. If user confirms, call `PluginsUpdate` with target path and aggregated findings context.

## Sub-agent execution contract

- Always execute leaf audits through sub-agents.
- Prefer parallel launch for independent audits.
- Each sub-agent response must include complete markdown report content.

## Output format

- `# Plugins audit: <plugin-name>`
- `## Summary` table (audit, status, issues)
- full per-audit reports, appended as-is
- optional healer handoff result

## Verification

- [ ] All 7 plugin audits executed through sub-agents
- [ ] Summary table reflects leaf report outcomes
- [ ] Full reports preserved without data loss
- [ ] Healer prompt shown to user

## Cross-references

- [audit-chain-methodology.md](docs/audit-chain-methodology.md)
- [common-internal-mcp-routing-spec.md](../../docs/common-internal-mcp-routing-spec.md)
