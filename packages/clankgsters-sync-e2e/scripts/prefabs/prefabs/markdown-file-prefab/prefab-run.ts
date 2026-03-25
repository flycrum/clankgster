import type { FilePrefabOptions } from '../file-prefab/prefab-run.js';
import { FilePrefabRun } from '../file-prefab/prefab-run.js';

export interface MarkdownFilePrefabOptions extends FilePrefabOptions {}

/** Markdown-specialized file prefab that enforces `.md` extension. */
export class MarkdownFilePrefabRun extends FilePrefabRun {
  protected override getOutputFileName(): string {
    const fileName = this.options.fileName.toLowerCase().endsWith('.md')
      ? this.options.fileName
      : `${this.options.fileName}.md`;
    return fileName;
  }
}
