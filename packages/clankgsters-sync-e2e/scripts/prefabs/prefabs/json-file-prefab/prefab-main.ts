import { PrefabMainBase } from '../../prefab-main-base.js';
import { JsonFilePrefabPrepare } from './prefab-prepare.js';
import type { JsonFilePrefabOptions } from './prefab-run.js';
import { JsonFilePrefabRun } from './prefab-run.js';

export class JsonFilePrefabMain extends PrefabMainBase<JsonFilePrefabOptions> {
  static prefabClassPrepare = JsonFilePrefabPrepare;
  static prefabClassRun = JsonFilePrefabRun;
}
