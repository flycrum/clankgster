import { clankgstersConfigDefaults } from '../../../../../clankgsters-sync/config/index.js';
import type { DirectoryPrefabOptions } from '../directory-prefab/prefab-run.js';
import { DirectoryPrefabRun } from '../directory-prefab/prefab-run.js';

export interface PluginsLocalDirPrefabOptions {
  pluginsDirName?: string;
  sourceDirName?: string;
}

/** Creates the nested `.local` plugins directory under source root (e.g. `.clank/plugins.local`). */
export class PluginsLocalDirPrefabRun extends DirectoryPrefabRun {
  constructor(sandboxDirectoryName: string, options: PluginsLocalDirPrefabOptions = {}) {
    const sourceDirName =
      options.sourceDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.sourceDir;
    const pluginsDirName =
      options.pluginsDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.pluginsDir;
    const resolved: DirectoryPrefabOptions = {
      dirName: `${pluginsDirName}.local`,
      parentPaths: [sourceDirName],
    };
    super(sandboxDirectoryName, resolved);
  }
}
