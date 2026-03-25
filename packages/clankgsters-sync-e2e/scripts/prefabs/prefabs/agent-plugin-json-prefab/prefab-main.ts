import { PrefabMainBase } from '../../prefab-main-base.js';
import { AgentPluginJsonPrefabPrepare } from './prefab-prepare.js';
import type { AgentPluginJsonPrefabOptions } from './prefab-run.js';
import { AgentPluginJsonPrefabRun } from './prefab-run.js';

export class AgentPluginJsonPrefabMain extends PrefabMainBase<AgentPluginJsonPrefabOptions> {
  static prefabClassPrepare = AgentPluginJsonPrefabPrepare;
  static prefabClassRun = AgentPluginJsonPrefabRun;
}
