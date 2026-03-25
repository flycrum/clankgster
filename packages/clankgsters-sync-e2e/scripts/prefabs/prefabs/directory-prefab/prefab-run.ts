import type { PrefabApplyContext } from '../../prefab-types.js';
import { PrefabRunBase } from '../../prefab-run-base.js';

export interface DirectoryPrefabOptions {
  dirName: string;
  parentPaths?: string[];
}

/** General-purpose directory creator prefab used by specialized directory prefabs. */
export class DirectoryPrefabRun extends PrefabRunBase<DirectoryPrefabOptions> {
  override run(context: PrefabApplyContext): void {
    const dirPath = this.joinSandboxPath(
      context,
      ...(this.options.parentPaths ?? []),
      this.options.dirName
    );
    this.ensureDirectory(dirPath);
  }
}
