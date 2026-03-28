---
name: docsraw-sync-run
description: >-
  Runs end-to-end rawdocs sync for a target plugin: gathers target input,
  launches isolated parallel analysis sub-agents, builds and refines a combined
  plan, safely replaces and rewrites plugin outputs, and preserves `rawdocs/` unchanged.
allowed-tools:
  - AskUserQuestion
  - Agent
  - WebSearch
---

# Run docsraw sync

## Scope

Execute a full sync workflow that transforms raw source content under a target plugin's `rawdocs/` directory into organized plugin outputs while preserving source style, continuity, and `rawdocs/` safety boundaries.

This skill is the orchestrator and must delegate analysis tasks to isolated sub-agents.

## Pre-checks

1. Apply input gate:
   - [docsraw-target-input.md](resources/docsraw-target-input.md)
2. Normalize and validate target plugin root.
3. Confirm required boundary conditions:
   - target contains `rawdocs/`,
   - `rawdocs/` is protected and must remain unmodified,
   - output paths outside `rawdocs/` must not link into `rawdocs/`.
4. Restate scope/exclusion rules in execution log. Repetition is required.

## Steps

1. **Collect and validate target input**
   - Run `AskUserQuestion` per input gate policy.
   - Accept plugin root path or `rawdocs/` path.
   - Normalize to canonical target plugin root.
   - Persist canonical path as "target plugin path" for all later steps.

2. **Launch raw-only analysis in isolated sub-agent**
   - Launch `docsraw-analyze-raw` in a separate sub-agent.
   - Pass explicit canonical target path.
   - Require scope statement: analyze only `<targetPluginRoot>/rawdocs/**`.
   - Require complete report output.

3. **Launch existing-only analysis in isolated sub-agent (parallel)**
   - Launch `docsraw-analyze-existing` in a separate sub-agent.
   - Pass same canonical target path.
   - Require scope statement: analyze `<targetPluginRoot>/**` excluding `rawdocs/**`.
   - Require complete report output.

4. **Wait for and validate both analysis outputs**
   - Wait until both reports return.
   - Verify no overlap in scope.
   - Verify both reports are complete and include required schema sections.
   - If either report is incomplete, request completion before proceeding.

5. **Combine outputs into strategic sync plan**
   - Treat `docsraw-analyze-raw` findings as content source-of-truth for meaning, intent, priorities, and writing-style signals.
   - Treat `docsraw-analyze-existing` findings as continuity and structure guidance for file boundaries, naming consistency, and repeat-sync stability.
   - Do not mirror `rawdocs/` file/folder structure directly; map source content into best-fit plugin pathways (`rules/`, `skills/`, `references/`, `docs/`, `agents/`, `hooks/`) using structure decisions from this step.
   - Run explicit merge arbitration for each proposed output file:
     - **Content arbitration:** preserve raw source meaning and user voice with near-zero creative rewriting.
     - **Structure arbitration:** prefer existing structure when still healthy; evolve when scale, clarity, or maintainability requires it.
     - **Style arbitration:** preserve tone, heading habits, code quote habits, and terminology patterns captured from analyses.
   - For each file/folder decision, classify action as one of:
     - keep as-is,
     - update in place,
     - split into focused files,
     - merge overlapping files,
     - rename/re-scope purpose,
     - create new file/folder,
     - remove obsolete non-rawdocs artifact.
   - Require written rationale for any structural evolution (split/merge/rename/remove) so future sync runs preserve continuity by default rather than drifting.
   - Produce a deterministic, file-by-file execution plan that includes:
     - destination path,
     - purpose and section outline,
     - source material mapping from raw themes,
     - continuity notes from existing plugin context,
     - style-fidelity constraints,
     - link-impact notes (with strict no-link-to-`rawdocs/` compliance).
   - Explicitly carry forward repeated exclusion reminders in the plan text for both analyzer scopes. This repetition is required and not optional.

6. **Run second refinement pass**
   - Apply:
     - [docsraw-plan-refinement-checklist.md](docs/docsraw-plan-refinement-checklist.md)
   - Tighten merge/split/rename decisions.
   - Reconfirm style/tone fidelity and boundary safety.
   - Ensure plan is deterministic enough to execute without ambiguity.

7. **Safely clear target plugin outputs (except rawdocs)**
   - Build recursive deletion set for target plugin entries excluding `rawdocs/`.
   - Validate deletion set again before execution.
   - Delete only validated non-rawdocs entries.
   - If exclusion cannot be guaranteed, abort without deleting.

8. **Write refined output structure**
   - Generate final folders/files/content from refined plan.
   - Keep `rawdocs/` as-is and unmodified.
   - Ensure normal plugin pathways remain link-clean (no links into `rawdocs/`).

9. **Finalize with verification report**
   - Confirm output completeness.
   - Confirm `rawdocs/` still exists and was untouched by sync logic.
   - Confirm boundary/linking rules are satisfied.
   - Return comprehensive report with analysis references, planning rationale, and execution summary.

## Scope guard (must repeat)

- Raw analysis and existing analysis must remain isolated.
- `rawdocs/` exclusion reminders should remain repeated in prompts and checklists.
- Repetition is intentional and required safety context.

## Not allowed

- Running both analyses in one blended context without isolation
- Reading `rawdocs/` in `docsraw-analyze-existing`
- Reading non-`rawdocs/` files in `docsraw-analyze-raw`
- Deleting or modifying `rawdocs/` during clear/rewrite
- Creating links from plugin outputs into `rawdocs/`
- Continuing execution when critical report sections are missing

## Verification

- [ ] Input gate used and target normalized/validated
- [ ] Both analysis skills executed in isolated sub-agents
- [ ] Analysis scopes were disjoint and complete together
- [ ] Combined plan used raw source truth + existing continuity signals
- [ ] Second refinement pass completed with checklist
- [ ] Deletion excluded `rawdocs/` recursively
- [ ] Final outputs written and `rawdocs/` preserved
- [ ] No final links into `rawdocs/`

## Cross-references

- [docsraw-target-input.md](resources/docsraw-target-input.md)
- [docsraw-subagent-contract.md](docs/docsraw-subagent-contract.md)
- [docsraw-plan-refinement-checklist.md](docs/docsraw-plan-refinement-checklist.md)
- [rawdocs-sync-safety-and-deletion-guardrails.md](../../rules/rawdocs-sync-safety-and-deletion-guardrails.md)
