import { PrefabMainBase } from '../../prefab-main-base.js';
import { SourceDirPrefabPrepare } from './prefab-prepare.js';
import type { SourceDirPrefabOptions } from './prefab-run.js';
import { SourceDirPrefabRun } from './prefab-run.js';

export class SourceDirPrefabMain extends PrefabMainBase<SourceDirPrefabOptions> {
  static prefabClassPrepare = SourceDirPrefabPrepare;
  static prefabClassRun = SourceDirPrefabRun;
}
