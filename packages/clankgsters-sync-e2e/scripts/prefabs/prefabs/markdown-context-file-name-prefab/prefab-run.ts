import { clankgstersConfigDefaults } from '../../../../../clankgsters-sync/config/index.js';
import type { MarkdownFilePrefabOptions } from '../markdown-file-prefab/prefab-run.js';
import { MarkdownFilePrefabRun } from '../markdown-file-prefab/prefab-run.js';

export interface MarkdownContextFileNamePrefabOptions {
  fileName?: string;
  fileContents?: string;
  parentPaths?: string[];
}

/** Writes the canonical markdown context file used by markdown symlink behavior discovery. */
export class MarkdownContextFileNamePrefabRun extends MarkdownFilePrefabRun {
  constructor(sandboxDirectoryName: string, options: MarkdownContextFileNamePrefabOptions = {}) {
    const resolved: MarkdownFilePrefabOptions = {
      fileName:
        options.fileName ??
        clankgstersConfigDefaults.CONSTANTS.sourceDefaults.markdownContextFileName,
      fileContents: options.fileContents ?? '# context\n',
      parentPaths: options.parentPaths ?? [],
    };
    super(sandboxDirectoryName, resolved);
  }
}
