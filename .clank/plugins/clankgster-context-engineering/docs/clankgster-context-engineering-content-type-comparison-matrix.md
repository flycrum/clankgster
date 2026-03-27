# Content type comparison matrix

Exhaustive feature comparison of all plugin content types. Use this to understand the differences, trade-offs, and capabilities of each type.

---

## Primary comparison matrix


| Feature              | Skill                                | Rule                    | Command                  | Reference                      | Doc                  | Agent             |
| -------------------- | ------------------------------------ | ----------------------- | ------------------------ | ------------------------------ | -------------------- | ----------------- |
| **Purpose**          | Multi-step workflow                  | Convention / constraint | Simple workflow (legacy) | Shared detail for skills/rules | Background knowledge | Sub-agent persona |
| **Primary file**     | `SKILL.md`                           | `<name>.md`             | `<name>.md`              | `<name>.md`                    | `<name>.md`          | `<name>.md`       |
| **Directory**        | `skills/<name>/`                     | `rules/`                | `commands/`              | `references/`                  | `docs/`              | `agents/`         |
| **Has subdirectory** | Yes (skill dir)                      | No                      | No                       | No                             | No                   | No                |
| **Supporting files** | `references/`, `scripts/`, `assets/` | None                    | None                     | None                           | None                 | None              |


---

## Loading and context behavior


| Feature                          | Skill                          | Rule                               | Command   | Reference                       | Doc                  | Agent     |
| -------------------------------- | ------------------------------ | ---------------------------------- | --------- | ------------------------------- | -------------------- | --------- |
| **Auto-loaded at startup**       | Description only (~100 tokens) | Yes (always-on) or conditional     | No        | No                              | No                   | No        |
| **Loaded on invocation**         | Full body                      | N/A (already loaded or contextual) | Full body | N/A                             | N/A                  | Full body |
| **Loaded on demand**             | N/A                            | N/A                                | N/A       | When linked from active content | When explicitly read | N/A       |
| **Context window cost (idle)**   | ~100 tokens (description)      | Full file (if always-on)           | 0         | 0                               | 0                    | 0         |
| **Context window cost (active)** | Full body + referenced files   | Already loaded                     | Full body | Full file                       | Full file            | Full body |
| **Progressive disclosure**       | Yes (3 layers)                 | Partial (contextual rules)         | No        | Yes (on-demand)                 | No (all or nothing)  | No        |


---

## Invocation and triggering


| Feature                            | Skill                                  | Rule                                     | Command       | Reference                | Doc                  | Agent           |
| ---------------------------------- | -------------------------------------- | ---------------------------------------- | ------------- | ------------------------ | -------------------- | --------------- |
| **User-invocable (slash /)**       | Yes (default)                          | No                                       | Yes           | No                       | No                   | No              |
| **Auto-invocable (agent decides)** | Yes (via description match)            | Yes (always-on or contextual)            | No            | No                       | No                   | No              |
| **Can disable auto-invocation**    | Yes (`disable-model-invocation: true`) | Yes (set `alwaysApply: false` in Cursor) | N/A           | N/A                      | N/A                  | N/A             |
| **Can hide from slash menu**       | Yes (`user-invocable: false`)          | N/A                                      | No            | N/A                      | N/A                  | N/A             |
| **Trigger mechanism**              | Description match or user `/`          | File globs, description, or always-on    | User `/` only | Link from active content | Explicit instruction | Sub-agent spawn |


---

## Metadata and frontmatter


| Feature                        | Skill                               | Rule                               | Command  | Reference     | Doc | Agent               |
| ------------------------------ | ----------------------------------- | ---------------------------------- | -------- | ------------- | --- | ------------------- |
| **Has YAML frontmatter**       | Yes (required for name/description) | Optional                           | Optional | No (standard) | No  | Yes                 |
| `**name` field**               | Yes (1-64 chars, kebab-case)        | No                                 | No       | No            | No  | Yes                 |
| `**description` field**        | Yes (1-1024 chars, critical)        | Optional (for contextual matching) | Optional | No            | No  | Optional            |
| `**allowed-tools`**            | Yes                                 | No                                 | No       | No            | No  | Yes                 |
| `**model` override**           | Yes                                 | No                                 | No       | No            | No  | Yes                 |
| `**effort` level**             | Yes                                 | No                                 | No       | No            | No  | Yes                 |
| `**context: fork`**            | Yes                                 | No                                 | No       | No            | No  | N/A (always forked) |
| `**hooks**`                    | Yes (scoped to skill lifecycle)     | No                                 | No       | No            | No  | No                  |
| `**paths` (glob activation)**  | Yes                                 | Via `.mdc` `globs` (Cursor)        | No       | No            | No  | No                  |
| `**argument-hint`**            | Yes                                 | No                                 | No       | No            | No  | No                  |
| `**disable-model-invocation**` | Yes                                 | No                                 | No       | No            | No  | No                  |
| `**user-invocable**`           | Yes                                 | No                                 | No       | No            | No  | No                  |
| `**shell**`                    | Yes                                 | No                                 | No       | No            | No  | No                  |


---

## Content guidelines


| Feature                     | Skill                     | Rule                       | Command      | Reference                   | Doc      | Agent             |
| --------------------------- | ------------------------- | -------------------------- | ------------ | --------------------------- | -------- | ----------------- |
| **Recommended max lines**   | 500                       | 200 (preferred), 500 (max) | 50           | No hard limit (TOC if >100) | No limit | 200               |
| **Recommended max tokens**  | 5,000 (body)              | 2,000                      | 1,000        | Variable                    | No limit | 2,000             |
| **Description max chars**   | 1,024                     | N/A                        | N/A          | N/A                         | N/A      | N/A               |
| **Contains workflow steps** | Yes (primary purpose)     | No (state conventions)     | Yes (simple) | No (detail/reference)       | No       | No (persona only) |
| **Contains examples**       | Yes (good/bad pairs)      | Yes (good/bad pairs)       | Optional     | Yes (detailed)              | Yes      | No                |
| **Contains checklists**     | Yes (verification)        | Optional                   | No           | Optional                    | Optional | No                |
| **Cross-references others** | Yes (links to references) | Yes (links to references)  | Rarely       | Yes (links to other refs)   | Optional | Rarely            |


---

## Naming and organization


| Feature                    | Skill                             | Rule                              | Command                           | Reference                    | Doc                   | Agent                |
| -------------------------- | --------------------------------- | --------------------------------- | --------------------------------- | ---------------------------- | --------------------- | -------------------- |
| **Naming convention**      | Gerund preferred (processing-X)   | Plugin-prefix + descriptive       | Plugin-prefix + descriptive       | Plugin-prefix + topic        | Plugin-prefix + topic | Plugin-prefix + role |
| **Plugin name prefix**     | Folder name prefixed              | File name prefixed                | File name prefixed                | File name prefixed           | File name prefixed    | File name prefixed   |
| **Uniqueness requirement** | Must be unique across all plugins | Must be unique across all plugins | Must be unique across all plugins | Descriptive (linked by path) | Descriptive           | Must be unique       |
| **Sync namespacing**       | `plugin:skill-name`               | Symlinked to agent dirs           | Symlinked to agent dirs           | Not synced directly          | Not synced            | Symlinked            |


---

## Cross-agent support


| Feature                    | Skill                  | Rule                       | Command               | Reference             | Doc         | Agent        |
| -------------------------- | ---------------------- | -------------------------- | --------------------- | --------------------- | ----------- | ------------ |
| **Claude Code**            | Full support           | Full support               | Full support (legacy) | Via skill references/ | Manual read | Full support |
| **Cursor**                 | Full support           | Full support (.mdc native) | Partial               | Via skill references/ | Manual read | Partial      |
| **Codex**                  | Full support           | Via AGENTS.md              | Partial               | Via skill references/ | Manual read | Limited      |
| **Agent Skills standard**  | Core spec              | Not in spec                | Not in spec           | In spec (optional)    | Not in spec | Not in spec  |
| **Portable across agents** | Yes (core frontmatter) | Partially (format varies)  | Partially             | Yes                   | Yes         | Partially    |


---

## When to use (summary)


| Type          | Use when...                                                          | Do NOT use when...                                                  |
| ------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Skill**     | You have a multi-step workflow with clear inputs and outputs         | The content is a simple convention with no execution steps          |
| **Rule**      | You have a convention, constraint, or guideline agents should follow | The content is a workflow requiring numbered steps and verification |
| **Command**   | You need a simple workflow under 30 lines (legacy; prefer skills)    | The workflow is complex or needs supporting files                   |
| **Reference** | You have detailed material shared by multiple skills or rules        | The content stands alone and nothing links to it                    |
| **Doc**       | You have background research, reports, or archival content           | The content should influence agent behavior automatically           |
| **Agent**     | You need a specialized sub-agent with its own persona and tools      | The behavior is a workflow that runs in the main agent context      |


---

## Decision shortcuts

- "Agents should always follow this" → **Rule** (always-on)
- "Agents should follow this for .ts files" → **Rule** (glob-matched)
- "User types /something to run a workflow" → **Skill**
- "Agent should auto-detect when to run this" → **Skill** (description-matched)
- "Multiple skills reference this guide" → **Reference**
- "I want to read this but agents do not need it" → **Doc**
- "Run this code when an event happens" → **Hook**
- "Connect to an external tool" → **MCP**

