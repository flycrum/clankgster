import { clankgstersConfigDefaults } from '../../../../../clankgsters-sync/config/index.js';
import type { FilePrefabOptions } from '../file-prefab/prefab-run.js';
import { FilePrefabRun } from '../file-prefab/prefab-run.js';

export interface SkillFileNamePrefabOptions {
  skillFileName?: string;
  skillDirName?: string;
  sourceDirName?: string;
  skillsDirName?: string;
  fileContents?: string;
}

/** Creates one skills marker file so sync can discover a standalone skill directory. */
export class SkillFileNamePrefabRun extends FilePrefabRun {
  constructor(sandboxDirectoryName: string, options: SkillFileNamePrefabOptions = {}) {
    const sourceDirName =
      options.sourceDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.sourceDir;
    const skillsDirName =
      options.skillsDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.skillsDir;
    const skillDirName = options.skillDirName ?? 'sample-skill';
    const resolved: FilePrefabOptions = {
      fileName:
        options.skillFileName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.skillFileName,
      fileContents: options.fileContents ?? '# sample-skill\n',
      parentPaths: [sourceDirName, skillsDirName, skillDirName],
    };
    super(sandboxDirectoryName, resolved);
  }
}
