import { PrefabMainBase } from '../../prefab-main-base.js';
import type { DirectoryPrefabOptions } from './prefab-run.js';
import { DirectoryPrefabPrepare } from './prefab-prepare.js';
import { DirectoryPrefabRun } from './prefab-run.js';

export class DirectoryPrefabMain extends PrefabMainBase<DirectoryPrefabOptions> {
  static prefabClassPrepare = DirectoryPrefabPrepare;
  static prefabClassRun = DirectoryPrefabRun;
}
