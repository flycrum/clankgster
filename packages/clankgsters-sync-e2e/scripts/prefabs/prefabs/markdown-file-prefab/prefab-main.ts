import { PrefabMainBase } from '../../prefab-main-base.js';
import { MarkdownFilePrefabPrepare } from './prefab-prepare.js';
import type { MarkdownFilePrefabOptions } from './prefab-run.js';
import { MarkdownFilePrefabRun } from './prefab-run.js';

export class MarkdownFilePrefabMain extends PrefabMainBase<MarkdownFilePrefabOptions> {
  static prefabClassPrepare = MarkdownFilePrefabPrepare;
  static prefabClassRun = MarkdownFilePrefabRun;
}
