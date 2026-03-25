import { PrefabMainBase } from '../../prefab-main-base.js';
import { MarkdownContextFileNamePrefabPrepare } from './prefab-prepare.js';
import type { MarkdownContextFileNamePrefabOptions } from './prefab-run.js';
import { MarkdownContextFileNamePrefabRun } from './prefab-run.js';

export class MarkdownContextFileNamePrefabMain extends PrefabMainBase<MarkdownContextFileNamePrefabOptions> {
  static prefabClassPrepare = MarkdownContextFileNamePrefabPrepare;
  static prefabClassRun = MarkdownContextFileNamePrefabRun;
}
