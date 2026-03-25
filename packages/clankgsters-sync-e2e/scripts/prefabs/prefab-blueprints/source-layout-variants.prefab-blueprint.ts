import {
  clankgstersConfigDefaults,
  clankgstersIdentity,
} from '../../../../clankgsters-sync/config/index.js';
import { PrefabBlueprintBase } from '../prefab-blueprint-base.js';
import { PrefabMainBase } from '../prefab-main-base.js';
import { AgentPluginJsonPrefabMain } from '../prefabs/agent-plugin-json-prefab/prefab-main.js';
import { DirectoryPrefabMain } from '../prefabs/directory-prefab/prefab-main.js';
import { SkillFileNamePrefabMain } from '../prefabs/skill-file-name-prefab/prefab-main.js';

export interface SourceLayoutVariantsPrefabBlueprintOptions {
  includeNestedLocal?: boolean;
  includeNestedRegular?: boolean;
  includeShorthandLocal?: boolean;
  includeShorthandRegular?: boolean;
  pluginsDirName?: string;
  skillsDirName?: string;
  sourceDirName?: string;
}

function toShorthandBase(sourceDir: string): string {
  const normalized = sourceDir
    .replace(/\\/g, '/')
    .replace(/\/+$/g, '')
    .replace(/^\.\/+/g, '');
  const token = normalized
    .split('/')
    .filter((segment) => segment.length > 0)
    .join('-');
  return token.length > 0 ? token : 'source';
}

/** Seeds plugin/skills roots across nested and shorthand regular/local layout variants. */
export class SourceLayoutVariantsPrefabBlueprint extends PrefabBlueprintBase<SourceLayoutVariantsPrefabBlueprintOptions> {
  override createPrefabMains(): PrefabMainBase<object>[] {
    const sourceDirName =
      this.options.sourceDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.sourceDir;
    const pluginsDirName =
      this.options.pluginsDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.pluginsDir;
    const skillsDirName =
      this.options.skillsDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.skillsDir;
    const shorthandBase = toShorthandBase(sourceDirName);
    const includeNestedRegular = this.options.includeNestedRegular ?? true;
    const includeNestedLocal = this.options.includeNestedLocal ?? true;
    const includeShorthandRegular = this.options.includeShorthandRegular ?? true;
    const includeShorthandLocal = this.options.includeShorthandLocal ?? true;
    const mains: PrefabMainBase<object>[] = [];

    if (includeNestedRegular) {
      mains.push(
        new DirectoryPrefabMain(this.sandboxDirectoryName, {
          dirName: pluginsDirName,
          parentPaths: [sourceDirName],
        }),
        new AgentPluginJsonPrefabMain(this.sandboxDirectoryName, {
          pluginDirName: 'root-nested-regular',
          pluginManifestDirName: clankgstersIdentity.AGENT_CLAUDE_PLUGIN_DIR_NAME,
          pluginsDirName,
          sourceDirName,
        }),
        new SkillFileNamePrefabMain(this.sandboxDirectoryName, {
          skillDirName: 'skill-nested-regular',
          skillsDirName,
          sourceDirName,
        })
      );
    }
    if (includeNestedLocal) {
      mains.push(
        new DirectoryPrefabMain(this.sandboxDirectoryName, {
          dirName: `${pluginsDirName}.local`,
          parentPaths: [sourceDirName],
        }),
        new AgentPluginJsonPrefabMain(this.sandboxDirectoryName, {
          pluginDirName: 'root-nested-local',
          pluginManifestDirName: clankgstersIdentity.AGENT_CLAUDE_PLUGIN_DIR_NAME,
          pluginsDirName: `${pluginsDirName}.local`,
          sourceDirName,
        }),
        new SkillFileNamePrefabMain(this.sandboxDirectoryName, {
          skillDirName: 'skill-nested-local',
          skillsDirName: `${skillsDirName}.local`,
          sourceDirName,
        }),
        new DirectoryPrefabMain(this.sandboxDirectoryName, {
          dirName: `${skillsDirName}.local`,
          parentPaths: [sourceDirName],
        })
      );
    }
    if (includeShorthandRegular) {
      const shorthandPluginsDir = `${shorthandBase}-${pluginsDirName}`;
      const shorthandSkillsDir = `${shorthandBase}-${skillsDirName}`;
      mains.push(
        new DirectoryPrefabMain(this.sandboxDirectoryName, { dirName: shorthandPluginsDir }),
        new AgentPluginJsonPrefabMain(this.sandboxDirectoryName, {
          pluginDirName: 'root-shorthand-regular',
          pluginManifestDirName: clankgstersIdentity.AGENT_CLAUDE_PLUGIN_DIR_NAME,
          pluginsDirName: shorthandPluginsDir,
          sourceDirName: '.',
        }),
        new DirectoryPrefabMain(this.sandboxDirectoryName, { dirName: shorthandSkillsDir }),
        new SkillFileNamePrefabMain(this.sandboxDirectoryName, {
          skillDirName: 'skill-shorthand-regular',
          skillsDirName: shorthandSkillsDir,
          sourceDirName: '.',
        })
      );
    }
    if (includeShorthandLocal) {
      const shorthandPluginsLocalDir = `${shorthandBase}-${pluginsDirName}.local`;
      const shorthandSkillsLocalDir = `${shorthandBase}-${skillsDirName}.local`;
      mains.push(
        new DirectoryPrefabMain(this.sandboxDirectoryName, { dirName: shorthandPluginsLocalDir }),
        new AgentPluginJsonPrefabMain(this.sandboxDirectoryName, {
          pluginDirName: 'root-shorthand-local',
          pluginManifestDirName: clankgstersIdentity.AGENT_CLAUDE_PLUGIN_DIR_NAME,
          pluginsDirName: shorthandPluginsLocalDir,
          sourceDirName: '.',
        }),
        new DirectoryPrefabMain(this.sandboxDirectoryName, { dirName: shorthandSkillsLocalDir }),
        new SkillFileNamePrefabMain(this.sandboxDirectoryName, {
          skillDirName: 'skill-shorthand-local',
          skillsDirName: shorthandSkillsLocalDir,
          sourceDirName: '.',
        })
      );
    }

    return mains;
  }
}
