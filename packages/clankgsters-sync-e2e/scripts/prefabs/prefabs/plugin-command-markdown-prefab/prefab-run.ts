import { clankgstersConfigDefaults } from '../../../../../clankgsters-sync/config/index.js';
import type { MarkdownFilePrefabOptions } from '../markdown-file-prefab/prefab-run.js';
import { MarkdownFilePrefabRun } from '../markdown-file-prefab/prefab-run.js';

export interface PluginCommandMarkdownPrefabOptions {
  commandFileName?: string;
  commandContents?: string;
  pluginDirName: string;
  sourceDirName?: string;
  pluginsDirName?: string;
  parentPaths?: string[];
}

/** Writes one plugin command markdown file under `<plugin>/commands/`. */
export class PluginCommandMarkdownPrefabRun extends MarkdownFilePrefabRun {
  constructor(sandboxDirectoryName: string, options: PluginCommandMarkdownPrefabOptions) {
    const sourceDirName =
      options.sourceDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.sourceDir;
    const pluginsDirName =
      options.pluginsDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.pluginsDir;
    const resolved: MarkdownFilePrefabOptions = {
      fileName: options.commandFileName ?? 'root-cmd.md',
      fileContents: options.commandContents ?? '# command\n',
      parentPaths: [
        ...(options.parentPaths ?? []),
        sourceDirName,
        pluginsDirName,
        options.pluginDirName,
        'commands',
      ],
    };
    super(sandboxDirectoryName, resolved);
  }
}
