import { PrefabMainBase } from '../../prefab-main-base.js';
import { PluginsDirPrefabPrepare } from './prefab-prepare.js';
import type { PluginsDirPrefabOptions } from './prefab-run.js';
import { PluginsDirPrefabRun } from './prefab-run.js';

export class PluginsDirPrefabMain extends PrefabMainBase<PluginsDirPrefabOptions> {
  static prefabClassPrepare = PluginsDirPrefabPrepare;
  static prefabClassRun = PluginsDirPrefabRun;
}
