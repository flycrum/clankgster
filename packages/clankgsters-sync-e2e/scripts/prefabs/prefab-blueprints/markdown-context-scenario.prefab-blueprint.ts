import { clankgstersConfigDefaults } from '../../../../clankgsters-sync/config/index.js';
import { PrefabBlueprintBase } from '../prefab-blueprint-base.js';
import { PrefabMainBase } from '../prefab-main-base.js';
import { MarkdownContextFileNamePrefabMain } from '../prefabs/markdown-context-file-name-prefab/prefab-main.js';

export type MarkdownScenarioMode =
  | 'root-only'
  | 'nested-only-1'
  | 'root-and-nested-1'
  | 'root-and-multi-nested';

export interface MarkdownContextScenarioPrefabBlueprintOptions {
  fileContentsByPath?: Record<string, string>;
  markdownContextFileName?: string;
  scenarioMode?: MarkdownScenarioMode;
}

/** Creates markdown context files for common root/nested topology scenarios. */
export class MarkdownContextScenarioPrefabBlueprint extends PrefabBlueprintBase<MarkdownContextScenarioPrefabBlueprintOptions> {
  override createPrefabMains(): PrefabMainBase<object>[] {
    const fileName =
      this.options.markdownContextFileName ??
      clankgstersConfigDefaults.CONSTANTS.sourceDefaults.markdownContextFileName;
    const mode = this.options.scenarioMode ?? 'root-and-nested-1';
    const nestedParentSets: string[][] =
      mode === 'root-only'
        ? []
        : mode === 'nested-only-1'
          ? [['packages', 'app']]
          : mode === 'root-and-nested-1'
            ? [['packages', 'app']]
            : [
                ['packages', 'app'],
                ['packages', 'app', 'nested', 'deep'],
              ];
    const includeRoot =
      mode === 'root-only' || mode === 'root-and-nested-1' || mode === 'root-and-multi-nested';

    const mains: PrefabMainBase<object>[] = [];
    if (includeRoot) {
      mains.push(
        new MarkdownContextFileNamePrefabMain(this.sandboxDirectoryName, {
          fileContents: this.options.fileContentsByPath?.['/'] ?? '# root context\n',
          fileName,
          parentPaths: [],
        })
      );
    }
    for (const parentPaths of nestedParentSets) {
      mains.push(
        new MarkdownContextFileNamePrefabMain(this.sandboxDirectoryName, {
          fileContents:
            this.options.fileContentsByPath?.[`/${parentPaths.join('/')}`] ??
            `# nested context ${parentPaths.join('/')}\n`,
          fileName,
          parentPaths,
        })
      );
    }
    return mains;
  }
}
