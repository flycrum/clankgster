# Rawdocs internal planning notes

> 🔑🔑🔑 **Scope (clankgster-rawdocs only).** Non-portability: [rawdocs-internal-disclosure-instructions.md](rawdocs-internal-disclosure-instructions.md).

This document captures internal planning for the `clankgster-rawdocs` plugin. It is intentionally verbose and preserves user intent with high fidelity.

## Planning objective

Create a new plugin in source pathway (e.g. `plugins/`) (`clankgster-rawdocs`) that allows users to place unstructured source material in `rawdocs/` and run a sync workflow that outputs an organized plugin structure without requiring users to manually split and classify content first.

## Primary problem this system solves

Growing plugin content is hard to organize from day one. Authors often know what they want to capture but not where each piece belongs in `rules/`, `skills/`, `references/`, `docs/`, `agents/`, or `hooks/`.

`rawdocs` solves that by giving users an intentionally unstructured intake path and a repeatable system that can:

- interpret theme and intent,
- preserve source voice/style,
- produce structured outputs,
- keep structure consistent across repeated syncs,
- still evolve structure when scale demands it.

## Explicit conceptual model

### Opt-in model

A user opts into this system by creating a `rawdocs/` directory inside their target plugin.

`rawdocs/` is colocated at the same depth as normal plugin pathways such as:

- `rules/`
- `skills/`
- `references/`
- `docs/`
- `agents/`
- `hooks/`

### Boundary model

`rawdocs/` is source input only.

It is not a navigational pathway and is not a destination for plugin cross-links from normal authored pathways.

### Output model

The sync process reads and interprets `rawdocs/`, then writes organized files outside `rawdocs/` according to plugin best practices and continuity constraints.

### Preservation model

The source content style is strongly respected. Textual creativity should be near zero when porting source meaning into organized files.

## Hard constraints and safety rules

1. Never create markdown links from normal plugin files to `rawdocs/`.
2. Never modify `rawdocs/` during sync output generation.
3. Never delete `rawdocs/` during cleanup/reset stages.
4. Keep repeated `rawdocs`-exclusion reminders; do not deduplicate them away.
5. Keep raw-only and existing-only analysis scopes disjoint and explicit.

Internal-only policy reference:

- [rawdocs-internal-linking-boundary](rawdocs-internal-linking-boundary.md)

## Dependency and cross-plugin exception

`clankgster-rawdocs` intentionally depends on `clankgster-capo` guidance. This is a deliberate exception to typical cross-plugin-link minimization.

High-value dependency anchors include:

- `.clank/plugins/clankgster-capo/rules/common-organizing-content.md`
- `.clank/plugins/clankgster-capo/skills/common-triage-context-type/SKILL.md`
- `.clank/plugins/clankgster-capo/skills/plugins-write-context/SKILL.md`
- `.clank/plugins/clankgster-capo/skills/plugins-write-context/reference.md`
- `.clank/plugins/clankgster-capo/skills/skills-write-context/docs/skill-asking-for-user-input.md`

## Core workflow architecture

### Primary orchestrator

`docsraw-sync-run` is the parent/orchestrator skill.

### Required isolated analysis skills

1. `docsraw-analyze-raw`
2. `docsraw-analyze-existing`

These two analyses must run in separate sub-agents with strict scope boundaries and no overlap.

### Why strict isolation matters

The user explicitly requested context isolation so analysis context does not bleed across sibling tasks or into parent orchestration logic.

## Execution behavior notes

### Step family: target input and canonical path tracking

- Ask user for target plugin path or `rawdocs/` path.
- Normalize to canonical target plugin root.
- Persist canonical target path for all later steps.

### Step family: `docsraw-analyze-raw`

- Analyze only target `rawdocs/` recursively.
- Read text files only.
- Skip non-text/binary and report skipped inventory.
- Capture themes/objectives and style profile.
- Reference capo plugin-writing guidance.
- Run web research for analogous themes and organizational patterns.
- Produce extensive output for downstream planning.

### Step family: `docsraw-analyze-existing`

- Analyze target plugin recursively excluding `rawdocs/`.
- Build sitemap and structural profile.
- If non-`rawdocs` content is empty or near-empty, return `New and or empty` and stop deeper analysis.
- Otherwise capture high-level purpose/outline/style continuity signals without excessive textual carryover.
- Produce extensive output for downstream planning.

### Step family: merge and refinement

- Wait for both analysis outputs.
- Treat raw analysis as content source truth.
- Treat existing analysis as continuity/structure truth.
- Build strategic plan balancing continuity and evolution.
- Run a second refinement pass focused on repeat-sync durability and style fidelity.

### Step family: safe clear and rewrite

- Delete all target plugin outputs except `rawdocs/`.
- Rebuild from refined plan.
- Preserve `rawdocs/` unchanged.

## Fidelity and temperature guidance

This system should not behave like an aggressive rewriting assistant.

Desired behavior:

- near-zero creativity in textual reinterpretation,
- high respect for source wording,
- careful and limited spelling/grammar corrections only when clearly needed,
- strategic creativity for structure only (grouping/splitting/naming/evolution).

## Continuity-vs-evolution strategy

The system should feel stable from sync to sync while still adapting to growth.

### Preserve

- useful existing folder conventions,
- recognizable file purposes,
- familiar section-outline patterns.

### Evolve

- split overloaded files,
- merge fragmented micro-files,
- rename for clearer domain boundaries,
- reorganize for future scale.

### Decision posture

Think like a long-horizon software architect: maintain continuity intentionally, evolve structure deliberately.

## Risks and mitigations

### Risk: accidental rawdocs inclusion in wrong step

Mitigation:

- repeat explicit scope in prompts,
- add scope guards and not-allowed sections in both analyzer skills,
- verify no-overlap before merge.

### Risk: accidental rawdocs deletion

Mitigation:

- explicit deletion-candidate validation,
- fail closed on ambiguity,
- dedicated guardrail rule file.

### Risk: style drift

Mitigation:

- style-profile capture in both analyses,
- refinement checklist includes style-fidelity checks.

### Risk: weak outputs from leaf sub-agents

Mitigation:

- enforce output schemas,
- require complete reports,
- block merge step on incomplete outputs.

## User instruction transcript (edited only for minor spelling/grammar)

I want to add a new concept to our `.clank/plugins/clankgster-capo`, which, as a reminder, currently does what is described in `.clank/plugins/clankgster-capo/.claude-plugin/plugin.json`.

The new idea is called `rawdocs/`.

- This is going to be a new plugin located in source pathway `plugins/`.
- The name of the plugin will be `clankgster-rawdocs`.
- It is closely related to and dependent upon the `.clank/plugins/clankgster-capo` plugin and its content (it is not ideal to cross-reference or use markdown links across different plugin boundaries, but we will make an exception in this case).
- The high-level intent behind this plugin will aid in the organization of a user-created plugin (for example, `.clank/plugins/clankgster-capo/rules/common-organizing-content.md`) and relate to some of the decision making in `.clank/plugins/clankgster-capo/skills/common-triage-context-type/SKILL.md`.
- First, everything in these directions should be captured and documented in a `docs/rawdocs-internal-planning-notes.md` file within its `docs/` folder (too much is better than too little for documenting our conversation in that file).
- The purpose of this system, which I want clearly documented, is to allow users to create a plugin without having to organize and split out the contents themselves.
- Instead, the user would have one or more docs in a new `rawdocs/` directory.
- The user would opt into this system implicitly by creating this `rawdocs/` directory within their plugin, colocated with the folders mentioned in `.clank/plugins/clankgster-capo/rules/common-organizing-content.md` (in other words, at the same level).
- Files in the `rawdocs/` directory would never be referenced/linked by other files in the plugin: hard boundary rule. (`rules/`, `skills/`, `docs/`, `references/`, etc. could not and would never link to files in `rawdocs/`.)
- The idea is that files in `rawdocs/` are raw input that `clankgster-capo` can take, interpret, organize, split out, and output into a well-structured series of plugin folders/files representing the intended context from `rawdocs/`, but organized into a plugin structure that follows best practices and is efficient/effective.
- This also helps scale documentation architecture over time because developers can dump information into `rawdocs/`, not worry about structure, and then let this system process and thoughtfully output organized plugin context.

Important note:

- Our `rawdocs` system will be powered by skills defined in its own plugin.

Primary skill: `docsraw-sync-run`:

1. Run a sub-agent to take either user input target plugin path or `rawdocs/` path as input (similar inspiration from capo skill input docs, but with our own steps/context). Track the provided path as the canonical "target plugin" path for reuse throughout the skill.
2. Run another isolated sub-agent that analyzes only the target plugin `rawdocs/` recursively. This should be a separate skill named `docsraw-analyze-raw`:
   - REFERENCE CAPO: reference capo docs on plugin organization and writing (include links to `.clank/plugins/clankgster-capo/skills/plugins-write-context/SKILL.md`).
   - READ RAWDOCS: read raw unstructured text-based files in `rawdocs/` and determine high-level themes/objectives (examples: TypeScript, Figma-to-code, UI design, testing, npm publish, CI deploy, monorepo conventions, debugging, security compliance/scanning, frontend/backend playbooks, PR workflows, documentation patterns, database design/migrations, cleanup, accessibility/compliance). Capture writing style, tone, quote preferences, section-header habits, etc.
   - RESEARCH THEME: web research for how similar themed plugins are written.
   - ANALYZE RAWDOCS: analyze how content should be grouped/split/organized through capo guidance and highly respect original writing style. Creativity near zero; preserve source voice. Only very judicious spelling/grammar changes.
   - OUTPUT: extensive and complete output for later steps.
3. In parallel, run another isolated sub-agent that reads all target-plugin content excluding `rawdocs/`. This should be a separate skill named `docsraw-analyze-existing`:
   - IDENTIFY CURRENT STRUCTURE: recursively scan and produce sitemap excluding `rawdocs/`.
   - If non-rawdocs content is empty or near-empty, return that the plugin is `New and or empty`, then skip remaining sub-steps.
   - READ REST OF PLUGIN: if not empty, recursively read text files and capture high-level purpose, file organization patterns, writing style/tone/habits/quote preferences/headers, etc. Do not include too many specific textual details in final output; keep to high-level purpose and structure signals.
   - OUTPUT: extensive and complete output for later steps.
4. Wait for both previous outputs. Together they should cover all plugin content without overlap.
5. Thoughtfully combine outputs into one plan to update all plugin content except `rawdocs/`:
   - use `docsraw-analyze-raw` for content truth (not for adopting raw file structure),
   - preserve source writing style with near-zero creative rewriting,
   - use `docsraw-analyze-existing` for structural continuity and consistency across repeated syncs, while still allowing strategic evolution (restructure/split/merge/rename as needed).
6. Run a second refinement pass focused on continuity across sync runs, structure evolution, and style consistency.
7. Remove all folders/files recursively in target plugin except `rawdocs/` (do not delete `rawdocs/`).
8. Rebuild new folders/files/content from refined plan.
9. Once complete, finish with comprehensive output/verification.

Additional requirement:

- Repeated reminders that `rawdocs/` is excluded in specific steps are important. Keep them; do not remove as redundancy.

Quality requirement:

- Make all skills and documentation extremely thorough and extensive.
- Do not cut context, purpose, or specifics.
- Over-documentation is preferred over under-documentation for this effort.

Final plan drafting requirement:

- Do a refinement pass after initial planning.
- Respect precise instructions and preserve exact intentions.
- Include a transcript of original instructions near the bottom, nearly verbatim, with only minor spelling/grammar corrections or tiny context clarifications.
