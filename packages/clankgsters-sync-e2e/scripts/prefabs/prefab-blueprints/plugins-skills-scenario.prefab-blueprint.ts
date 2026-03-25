import {
  clankgstersConfigDefaults,
  clankgstersIdentity,
} from '../../../../clankgsters-sync/config/index.js';
import { PrefabBlueprintBase } from '../prefab-blueprint-base.js';
import { PrefabMainBase } from '../prefab-main-base.js';
import type { PrefabPrepareAction, PrefabPrepareOverlayOptions } from '../prefab-types.js';
import { AgentPluginJsonPrefabMain } from '../prefabs/agent-plugin-json-prefab/prefab-main.js';
import { PluginCommandMarkdownPrefabMain } from '../prefabs/plugin-command-markdown-prefab/prefab-main.js';
import { PluginRuleMarkdownPrefabMain } from '../prefabs/plugin-rule-markdown-prefab/prefab-main.js';
import { PluginSkillFilePrefabMain } from '../prefabs/plugin-skill-file-prefab/prefab-main.js';
import { SkillFileNamePrefabMain } from '../prefabs/skill-file-name-prefab/prefab-main.js';

export type PluginsSkillsScenarioMode = 'root-only' | 'nested-only-1' | 'root-and-nested-1';

export interface PluginsSkillsScenarioPrefabBlueprintOptions {
  includeRootRules?: boolean;
  includeStandaloneSkill?: boolean;
  pluginsDirName?: string;
  prepareEntryAction?: PrefabPrepareAction;
  prepareGroupAction?: PrefabPrepareAction;
  prepareReplaceRoots?: string[];
  scenarioMode?: PluginsSkillsScenarioMode;
  skillFileName?: string;
  skillsDirName?: string;
  sourceDirName?: string;
}

/** Seeds representative plugin and skills trees for discovery/content sync scenarios. */
export class PluginsSkillsScenarioPrefabBlueprint extends PrefabBlueprintBase<PluginsSkillsScenarioPrefabBlueprintOptions> {
  override getPrepareOverlay(): PrefabPrepareOverlayOptions | undefined {
    const { prepareGroupAction, prepareEntryAction, prepareReplaceRoots } = this.options;
    if (prepareGroupAction == null && prepareEntryAction == null && prepareReplaceRoots == null) {
      return undefined;
    }
    const groupAction = prepareGroupAction ?? 'append';
    return {
      entryAction: prepareEntryAction ?? groupAction,
      groupAction,
      replaceRoots: prepareReplaceRoots,
    };
  }

  override createPrefabMains(): PrefabMainBase<object>[] {
    const mode = this.options.scenarioMode ?? 'root-and-nested-1';
    const includeRoot = mode === 'root-only' || mode === 'root-and-nested-1';
    const includeNested = mode === 'nested-only-1' || mode === 'root-and-nested-1';
    const sourceDirName =
      this.options.sourceDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.sourceDir;
    const pluginsDirName =
      this.options.pluginsDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.pluginsDir;
    const skillsDirName =
      this.options.skillsDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.skillsDir;
    const mains: PrefabMainBase<object>[] = [];

    if (includeRoot) {
      mains.push(
        new AgentPluginJsonPrefabMain(this.sandboxDirectoryName, {
          pluginDirName: 'root',
          pluginManifestDirName: clankgstersIdentity.AGENT_CLAUDE_PLUGIN_DIR_NAME,
          pluginsDirName,
          sourceDirName,
        }),
        new AgentPluginJsonPrefabMain(this.sandboxDirectoryName, {
          pluginDirName: 'root',
          pluginManifestDirName: clankgstersIdentity.AGENT_CURSOR_PLUGIN_DIR_NAME,
          pluginsDirName,
          sourceDirName,
        }),
        new PluginCommandMarkdownPrefabMain(this.sandboxDirectoryName, {
          commandFileName: 'root-cmd.md',
          pluginDirName: 'root',
          pluginsDirName,
          sourceDirName,
        }),
        new PluginSkillFilePrefabMain(this.sandboxDirectoryName, {
          pluginDirName: 'root',
          pluginsDirName,
          skillDirName: 'root-fake-skill',
          sourceDirName,
        })
      );
      if (this.options.includeRootRules ?? true) {
        mains.push(
          new PluginRuleMarkdownPrefabMain(this.sandboxDirectoryName, {
            pluginDirName: 'root',
            pluginsDirName,
            ruleFileName: 'root-rule.md',
            sourceDirName,
          })
        );
      }
    }

    if (includeNested) {
      const parentPaths = ['packages', 'app'];
      mains.push(
        new AgentPluginJsonPrefabMain(this.sandboxDirectoryName, {
          parentPaths,
          pluginDirName: 'nested',
          pluginManifestDirName: clankgstersIdentity.AGENT_CLAUDE_PLUGIN_DIR_NAME,
          pluginsDirName,
          sourceDirName,
        }),
        new AgentPluginJsonPrefabMain(this.sandboxDirectoryName, {
          parentPaths,
          pluginDirName: 'nested',
          pluginManifestDirName: clankgstersIdentity.AGENT_CURSOR_PLUGIN_DIR_NAME,
          pluginsDirName,
          sourceDirName,
        }),
        new PluginCommandMarkdownPrefabMain(this.sandboxDirectoryName, {
          commandFileName: 'nested-cmd.md',
          parentPaths,
          pluginDirName: 'nested',
          pluginsDirName,
          sourceDirName,
        }),
        new PluginSkillFilePrefabMain(this.sandboxDirectoryName, {
          parentPaths,
          pluginDirName: 'nested',
          pluginsDirName,
          skillDirName: 'nested-fake-skill',
          sourceDirName,
        })
      );
    }

    if (this.options.includeStandaloneSkill ?? true) {
      mains.push(
        new SkillFileNamePrefabMain(this.sandboxDirectoryName, {
          skillDirName: 'sample-skill',
          skillFileName: this.options.skillFileName,
          skillsDirName,
          sourceDirName,
        })
      );
    }

    return mains;
  }
}
