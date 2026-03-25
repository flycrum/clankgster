import { clankgstersConfigDefaults } from '../../../../../clankgsters-sync/config/index.js';
import type { MarkdownFilePrefabOptions } from '../markdown-file-prefab/prefab-run.js';
import { MarkdownFilePrefabRun } from '../markdown-file-prefab/prefab-run.js';

export interface PluginRuleMarkdownPrefabOptions {
  pluginDirName: string;
  ruleContents?: string;
  ruleFileName?: string;
  sourceDirName?: string;
  pluginsDirName?: string;
  parentPaths?: string[];
}

/** Writes one plugin rule markdown file under `<plugin>/rules/`. */
export class PluginRuleMarkdownPrefabRun extends MarkdownFilePrefabRun {
  constructor(sandboxDirectoryName: string, options: PluginRuleMarkdownPrefabOptions) {
    const sourceDirName =
      options.sourceDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.sourceDir;
    const pluginsDirName =
      options.pluginsDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.pluginsDir;
    const resolved: MarkdownFilePrefabOptions = {
      fileName: options.ruleFileName ?? 'root-rule.md',
      fileContents: options.ruleContents ?? '# rule\n',
      parentPaths: [
        ...(options.parentPaths ?? []),
        sourceDirName,
        pluginsDirName,
        options.pluginDirName,
        'rules',
      ],
    };
    super(sandboxDirectoryName, resolved);
  }
}
