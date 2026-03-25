# E2E prefabs and blueprints

Dynamic seeding for e2e sandboxes.

- **Prefab mains** (`prefabs/<name>-prefab/prefab-main.ts`) wire a prepare class and a run class; test cases and blueprints instantiate mains, not prepare/run directly
- **Blueprints** (`prefab-blueprints/*.prefab-blueprint.ts`) expand to ordered prefab main lists; optional `getPrepareOverlay()` adjusts append/replace and `replaceRoots` for expanded mains
- Constructor shape: `(sandboxDirectoryName, options)`; pass `''` to seed into the case output root
- `PrefabRunBase` exposes protected fs/path helpers for run implementations

Use exports from `scripts/prefabs/prefabs.ts`.

Example:

```ts
seeding: e2eTestCase.defineSeeding([
  new PluginsSkillsScenarioPrefabBlueprint('', { scenarioMode: 'root-only' }),
  new MarkdownContextScenarioPrefabBlueprint('', { scenarioMode: 'root-and-nested-1' }),
]),
```
