# In-session orchestration vs MCP (internal policy)

> 🔑🔑🔑 **Scope (clankgster-capo only).** Non-portability: [common-internal-disclosure-instructions.md](common-internal-disclosure-instructions.md).

**Purpose:** Single place for how `clankgster-capo` skills should chain work **inside an agent session** versus when to use **capo MCP tools**.

**Audience:** Maintainers editing this plugin. Not a general Clankgster author guide.

## Terms

- **Aggregator skill** — Full-suite workflow that fans out to multiple **leaf** skills (for example `plugins-audit-full-suite-plugin`, `skills-audit-full-suite-skill`, `clankmd-audit-full-suite-md`).
- **Leaf skill** — Single-concern workflow (one audit type, one target slice). Invoked by aggregators via **sub-agents** with an explicit prompt that names the leaf skill id and validated target path.
- **In-session** — The coding agent already has repo and skill catalog; it can `Read` files, use the **Agent** tool, and follow `SKILL.md` bodies without calling MCP.
- **MCP surface** — Capo’s registered tools (`mcp__capo__*`) and the route table in `docs/common-internal-mcp-routing-spec.md`. Intended for **tool-first clients**, automation, and **optional** parity when the host exposes MCP.

## Default: in-session chaining

1. **Aggregator → leaves:** Use the **Agent** tool (sub-agents). Each sub-agent prompt must name the leaf skill id and pass the **same validated target** (path) the aggregator collected. Do **not** invoke MCP tools to run leaf audits inside the same chat.
2. **Triage → write:** After pathway selection, **read and execute** the pathway write skill body:
   - Plain path: `.clank/plugins/clankgster-capo/skills/plugins-write-context/SKILL.md`
   - Plain path: `.clank/plugins/clankgster-capo/skills/skills-write-context/SKILL.md`
   - Plain path: `.clank/plugins/clankgster-capo/skills/clankmd-write-context/SKILL.md`
3. **Healer (audit → update):** After user confirms, **read and execute** the matching update skill:
   - `.clank/plugins/clankgster-capo/skills/plugins-update-context/SKILL.md`
   - `.clank/plugins/clankgster-capo/skills/skills-update-context/SKILL.md`
   - `.clank/plugins/clankgster-capo/skills/clankmd-update-context/SKILL.md`  
   Pass target path plus aggregated findings context as that skill expects.

This keeps behavior correct when MCP is disconnected and matches how slash-invoked skills already run.

## MCP: when it is appropriate

- **External or tool-first entry:** Scripts, IDE features, or agents that only speak MCP should use the route table; tools map to **target skill ids**, not magic execution.
- **Optional shortcut in-session:** If the host exposes capo MCP **and** the user asks for tool dispatch, calling the equivalent `mcp__capo__*` tool is allowed as an alternative to `Read`+follow the same target skill — same intent, different transport.
- **Registry only:** MCP routes do not auto-run `SKILL.md` files; they document which skill is canonical for a tool name.

## Anti-patterns

- Chaining **leaf** audits or write flows by calling **MCP tools** from one skill to another **inside** a normal Cursor/Claude session that already loaded skills
- Treating `allowed-tools` entries as mandatory routing (they are **permission scope** only; see `rules/skills-write-rules.md`)
- Documenting skills as “call MCP only” when the primary path should be readable `SKILL.md` execution

## Related docs

- [common-internal-mcp-routing-spec.md](../docs/common-internal-mcp-routing-spec.md)
- [common-mcp-tools-in-plugins.md](common-mcp-tools-in-plugins.md)
- Audit chain methodology (skill-local): plain path `.clank/plugins/clankgster-capo/skills/plugins-audit-full-suite-plugin/docs/audit-chain-methodology.md`
