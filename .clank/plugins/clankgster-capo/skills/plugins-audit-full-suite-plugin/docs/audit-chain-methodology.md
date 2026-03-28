# Audit chain methodology (pathway-first)

This document defines the internal audit execution model for `clankgster-capo` after splitting audits by source pathway (`plugins/`, `skills/`, `CLANK.md`).

## Why pathway-first grouping

The prior audit model grouped by audit type first (`common-audit-content-quality`, `common-audit-links`, etc.) and then attempted to fan out by pathway. In practice, user intent is usually pathway-bound:

- audit one plugin
- audit one standalone skill
- audit one CLANK.md file

So the orchestration axis should match user intent:

- `plugins-audit-full-suite-plugin`
- `skills-audit-full-suite-skill`
- `clankmd-audit-full-suite-md`

Each top-level aggregator runs all relevant audit types for that single target.

## Chain shape

Aggregator skills call leaf audits via sub-agents. Leaf audits return complete markdown reports. Aggregator preserves full reports and adds a lightweight summary.

```text
plugins-audit-full-suite-plugin
  -> plugins-audit-content-quality
  -> plugins-audit-internal-links
  -> plugins-audit-external-links
  -> plugins-audit-fact-check
  -> plugins-audit-source-freshness
  -> plugins-audit-comparison-matrix
  -> plugins-audit-structure

skills-audit-full-suite-skill
  -> skills-audit-content-quality
  -> skills-audit-internal-links
  -> skills-audit-external-links
  -> skills-audit-fact-check
  -> skills-audit-source-freshness

clankmd-audit-full-suite-md
  -> clankmd-audit-content-quality
  -> clankmd-audit-internal-links
  -> clankmd-audit-external-links
  -> clankmd-audit-fact-check
  -> clankmd-audit-source-freshness
```

## Sub-agent rule (hard requirement)

Leaf audits must be invoked through sub-agents from the aggregator, not inline in the parent thread.

Reasons:

- keeps parent context compact
- isolates each audit type's heavy intermediate reasoning
- enables parallel execution
- creates clean report boundaries per audit type

## Target scope by pathway

- `plugins-audit-*`: one plugin directory under `.clank/plugins/<plugin>/`
- `skills-audit-*`: one standalone skill directory (for example `.clank/skills/<name>/`)
- `clankmd-audit-*`: one `CLANK.md` file path

`clankmd` audits are file-scoped by design; they do not recursively scan every CLANK.md in the repo.

## Report contract

Each leaf audit returns a **self-contained markdown report**:

- stable heading at top (for example `## Internal links audit: <target>`)
- counts and result tables
- actionable findings

Aggregator behavior:

1. Build top summary table (one row per leaf audit)
2. Append full leaf reports as-is, in audit-type order
3. Do not rewrite or collapse leaf tables (avoid information loss)

This gives both:

- quick triage view (summary)
- full forensic detail (raw leaf reports)

## Healer handoff

After presenting the aggregate report, aggregator asks the user whether to run the matching update flow:

- plugins -> `PluginsUpdate`
- skills -> `SkillsUpdate`
- clankmd -> `ClankMdUpdate`

If approved, aggregator passes target path and the aggregate findings context to the update MCP tool route.

This turns audit output into optional remediation with explicit user consent.

## MCP routing alignment

Two route classes exist for audit:

1. pathway aggregator routes (`PluginsAudit`, `SkillsAudit`, `ClankMdAudit`)
2. direct leaf routes (for targeted single-audit runs)

Both are explicit route metadata only; MCP routes do not auto-execute SKILL files.

## Adding a new audit type

When adding a new audit type (for example `naming-consistency`):

1. Add 3 leaf skills:
   - `plugins-audit-naming-consistency`
   - `skills-audit-naming-consistency`
   - `clankmd-audit-naming-consistency`
2. Add leaf route entries in MCP registry/spec for all 3.
3. Add each leaf to its pathway aggregator's sub-agent list.
4. Update aggregator summary table schema/examples.
5. Update README audit suite index.

If an audit type is pathway-specific (for example matrix/structure), only add the pathway-specific leaf and include it in that pathway aggregator.

## Operational guardrails

- Keep leaf audits focused on one concern.
- Keep aggregator output deterministic in section order.
- Preserve leaf report text exactly where possible.
- Ask before healer execution every time.
- Prefer parallel sub-agent execution when leaf audits are independent.
