import type { PrefabApplyContext } from '../../prefab-types.js';
import { PrefabRunBase } from '../../prefab-run-base.js';

export interface FilePrefabOptions {
  fileName: string;
  fileContents?: string;
  parentPaths?: string[];
}

/** General-purpose text file prefab used by markdown/json specializations. */
export class FilePrefabRun extends PrefabRunBase<FilePrefabOptions> {
  /** Resolves the output filename; subclasses can override for extension/normalization rules. */
  protected getOutputFileName(): string {
    return this.options.fileName;
  }

  override run(context: PrefabApplyContext): void {
    const filePath = this.joinSandboxPath(
      context,
      ...(this.options.parentPaths ?? []),
      this.getOutputFileName()
    );
    this.writeTextFile(filePath, this.options.fileContents ?? '');
  }
}
