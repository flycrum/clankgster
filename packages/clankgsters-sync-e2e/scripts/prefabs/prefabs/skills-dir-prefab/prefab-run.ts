import { clankgstersConfigDefaults } from '../../../../../clankgsters-sync/config/index.js';
import type { DirectoryPrefabOptions } from '../directory-prefab/prefab-run.js';
import { DirectoryPrefabRun } from '../directory-prefab/prefab-run.js';

export interface SkillsDirPrefabOptions {
  skillsDirName?: string;
  sourceDirName?: string;
}

/** Creates the skills directory under the configured source root. */
export class SkillsDirPrefabRun extends DirectoryPrefabRun {
  constructor(sandboxDirectoryName: string, options: SkillsDirPrefabOptions = {}) {
    const resolved: DirectoryPrefabOptions = {
      dirName:
        options.skillsDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.skillsDir,
      parentPaths: [
        options.sourceDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.sourceDir,
      ],
    };
    super(sandboxDirectoryName, resolved);
  }
}
