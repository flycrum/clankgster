import { clankgstersConfigDefaults } from '../../../../../clankgsters-sync/config/index.js';
import type { FilePrefabOptions } from '../file-prefab/prefab-run.js';
import { FilePrefabRun } from '../file-prefab/prefab-run.js';

export interface PluginSkillFilePrefabOptions {
  pluginDirName: string;
  skillContents?: string;
  skillDirName?: string;
  skillFileName?: string;
  sourceDirName?: string;
  pluginsDirName?: string;
  parentPaths?: string[];
}

/** Writes one plugin-scoped skill marker file under `<plugin>/skills/<skillDir>/`. */
export class PluginSkillFilePrefabRun extends FilePrefabRun {
  constructor(sandboxDirectoryName: string, options: PluginSkillFilePrefabOptions) {
    const sourceDirName =
      options.sourceDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.sourceDir;
    const pluginsDirName =
      options.pluginsDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.pluginsDir;
    const resolved: FilePrefabOptions = {
      fileName:
        options.skillFileName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.skillFileName,
      fileContents: options.skillContents ?? '# skill\n',
      parentPaths: [
        ...(options.parentPaths ?? []),
        sourceDirName,
        pluginsDirName,
        options.pluginDirName,
        clankgstersConfigDefaults.CONSTANTS.sourceDefaults.skillsDir,
        options.skillDirName ?? 'root-fake-skill',
      ],
    };
    super(sandboxDirectoryName, resolved);
  }
}
