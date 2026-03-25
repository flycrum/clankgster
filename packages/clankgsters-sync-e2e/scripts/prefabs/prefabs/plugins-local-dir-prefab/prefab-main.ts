import { PrefabMainBase } from '../../prefab-main-base.js';
import { PluginsLocalDirPrefabPrepare } from './prefab-prepare.js';
import type { PluginsLocalDirPrefabOptions } from './prefab-run.js';
import { PluginsLocalDirPrefabRun } from './prefab-run.js';

export class PluginsLocalDirPrefabMain extends PrefabMainBase<PluginsLocalDirPrefabOptions> {
  static prefabClassPrepare = PluginsLocalDirPrefabPrepare;
  static prefabClassRun = PluginsLocalDirPrefabRun;
}
