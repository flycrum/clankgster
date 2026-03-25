import type { PrefabApplyContext } from '../../prefab-types.js';
import { PrefabRunBase } from '../../prefab-run-base.js';

export interface JsonFilePrefabOptions {
  fileName: string;
  jsonValue: unknown;
  parentPaths?: string[];
}

/** General-purpose JSON file prefab with pretty-print and trailing newline. */
export class JsonFilePrefabRun extends PrefabRunBase<JsonFilePrefabOptions> {
  override run(context: PrefabApplyContext): void {
    const filePath = this.joinSandboxPath(
      context,
      ...(this.options.parentPaths ?? []),
      this.options.fileName
    );
    this.writeJsonFile(filePath, this.options.jsonValue);
  }
}
