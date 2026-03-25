import { clankgstersConfigDefaults } from '../../../../../clankgsters-sync/config/index.js';
import type { DirectoryPrefabOptions } from '../directory-prefab/prefab-run.js';
import { DirectoryPrefabRun } from '../directory-prefab/prefab-run.js';

export interface SourceDirPrefabOptions {
  sourceDirName?: string;
}

/** Creates the source defaults root directory used by discovery (e.g. `.clank`). */
export class SourceDirPrefabRun extends DirectoryPrefabRun {
  constructor(sandboxDirectoryName: string, options: SourceDirPrefabOptions = {}) {
    const resolved: DirectoryPrefabOptions = {
      dirName:
        options.sourceDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.sourceDir,
      parentPaths: [],
    };
    super(sandboxDirectoryName, resolved);
  }
}
