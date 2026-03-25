import { PrefabBlueprintBase } from '../prefab-blueprint-base.js';
import { PrefabMainBase } from '../prefab-main-base.js';
import { PluginsDirPrefabMain } from '../prefabs/plugins-dir-prefab/prefab-main.js';
import { SkillsDirPrefabMain } from '../prefabs/skills-dir-prefab/prefab-main.js';
import { SourceDirPrefabMain } from '../prefabs/source-dir-prefab/prefab-main.js';
import { MarkdownContextScenarioPrefabBlueprint } from './markdown-context-scenario.prefab-blueprint.js';
import { PluginsSkillsScenarioPrefabBlueprint } from './plugins-skills-scenario.prefab-blueprint.js';

export interface DefaultSandboxPrefabBlueprintOptions {
  markdownContextFileName?: string;
}

/** Creates the default case baseline using dynamic prefab composition. */
export class DefaultSandboxPrefabBlueprint extends PrefabBlueprintBase<DefaultSandboxPrefabBlueprintOptions> {
  override createPrefabMains(): PrefabMainBase<object>[] {
    return [
      new SourceDirPrefabMain(this.sandboxDirectoryName, {}),
      new PluginsDirPrefabMain(this.sandboxDirectoryName, {}),
      new SkillsDirPrefabMain(this.sandboxDirectoryName, {}),
      ...new MarkdownContextScenarioPrefabBlueprint(this.sandboxDirectoryName, {
        markdownContextFileName: this.options.markdownContextFileName,
        scenarioMode: 'root-and-nested-1',
      }).createPrefabMains(),
      ...new PluginsSkillsScenarioPrefabBlueprint(this.sandboxDirectoryName, {
        includeRootRules: true,
        includeStandaloneSkill: true,
        scenarioMode: 'root-and-nested-1',
      }).createPrefabMains(),
    ];
  }
}
