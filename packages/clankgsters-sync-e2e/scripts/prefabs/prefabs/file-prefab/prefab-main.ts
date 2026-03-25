import { PrefabMainBase } from '../../prefab-main-base.js';
import { FilePrefabPrepare } from './prefab-prepare.js';
import type { FilePrefabOptions } from './prefab-run.js';
import { FilePrefabRun } from './prefab-run.js';

export class FilePrefabMain extends PrefabMainBase<FilePrefabOptions> {
  static prefabClassPrepare = FilePrefabPrepare;
  static prefabClassRun = FilePrefabRun;
}
