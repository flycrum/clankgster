import { clankgstersConfigDefaults } from '../../../../../clankgsters-sync/config/index.js';
import type { DirectoryPrefabOptions } from '../directory-prefab/prefab-run.js';
import { DirectoryPrefabRun } from '../directory-prefab/prefab-run.js';

export interface SkillsLocalDirPrefabOptions {
  skillsDirName?: string;
  sourceDirName?: string;
}

/** Creates the nested `.local` skills directory under source root (e.g. `.clank/skills.local`). */
export class SkillsLocalDirPrefabRun extends DirectoryPrefabRun {
  constructor(sandboxDirectoryName: string, options: SkillsLocalDirPrefabOptions = {}) {
    const sourceDirName =
      options.sourceDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.sourceDir;
    const skillsDirName =
      options.skillsDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.skillsDir;
    const resolved: DirectoryPrefabOptions = {
      dirName: `${skillsDirName}.local`,
      parentPaths: [sourceDirName],
    };
    super(sandboxDirectoryName, resolved);
  }
}
