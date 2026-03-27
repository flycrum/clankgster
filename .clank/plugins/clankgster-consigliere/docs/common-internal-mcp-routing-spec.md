# MCP routing spec (internal)

Canonical explicit routing contract for `clankgster-consigliere`.

This is an advanced, edge-case pattern for complex orchestration. It is not the default recommendation for typical plugin authoring.

## Contract version

- `contractVersion`: `1.0.0`

## Route table

| Route ID | MCP tool | Target skill ID | Pathway | Action |
| --- | --- | --- | --- | --- |
| `common.triaging` | `Triaging` | `common-triaging-context-type` | `common` | `triaging` |
| `plugins.writing` | `PluginsWriting` | `plugins-writing-context` | `plugins` | `writing` |
| `plugins.updating` | `PluginsUpdating` | `plugins-updating-context` | `plugins` | `updating` |
| `plugins.removing` | `PluginsRemoving` | `plugins-removing-context` | `plugins` | `removing` |
| `plugins.auditing` | `PluginsAuditing` | `common-auditing-all-orchestrator` | `plugins` | `auditing` |
| `skills.writing` | `SkillsWriting` | `skills-writing-context` | `skills` | `writing` |
| `skills.updating` | `SkillsUpdating` | `skills-updating-context` | `skills` | `updating` |
| `skills.removing` | `SkillsRemoving` | `skills-removing-context` | `skills` | `removing` |
| `skills.auditing` | `SkillsAuditing` | `common-auditing-all-orchestrator` | `skills` | `auditing` |
| `clankmd.writing` | `ClankMdWriting` | `clankmd-writing-context` | `clankmd` | `writing` |
| `clankmd.updating` | `ClankMdUpdating` | `clankmd-updating-context` | `clankmd` | `updating` |
| `clankmd.removing` | `ClankMdRemoving` | `clankmd-removing-context` | `clankmd` | `removing` |
| `clankmd.auditing` | `ClankMdAuditing` | `common-auditing-all-orchestrator` | `clankmd` | `auditing` |

## Input payload shape

Most route tools accept:

```json
{
  "targetPath": "string (optional)",
  "userIntent": "string (optional)",
  "dryRun": true,
  "context": {}
}
```

`Triaging` accepts pathway-selection oriented input:

```json
{
  "mode": "analyze | explicit",
  "selectedPathway": "plugins | skills | clankmd",
  "userIntent": "string (optional)",
  "context": {}
}
```

## Output payload shape

Every successful tool returns `structuredContent` with:

- `contractVersion`
- `ok`
- `routeId`
- `toolName`
- `targetSkillId`
- `pathway`
- `action`
- `input`
- `handoff.recommendedSkillCommand`
- `handoff.note`

## Error semantics

- Unknown tool: `isError: true` with error code `UNKNOWN_TOOL`
- Invalid params: JSON-RPC error `-32602` with `INVALID_TOOL_NAME`
- Unknown method: JSON-RPC error `-32601`

## Important behavior note

MCP routing metadata does not auto-execute skills. Skill execution remains explicit and model-mediated.

