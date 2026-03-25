import { PrefabMainBase } from '../../prefab-main-base.js';
import { PluginSkillFilePrefabPrepare } from './prefab-prepare.js';
import type { PluginSkillFilePrefabOptions } from './prefab-run.js';
import { PluginSkillFilePrefabRun } from './prefab-run.js';

export class PluginSkillFilePrefabMain extends PrefabMainBase<PluginSkillFilePrefabOptions> {
  static prefabClassPrepare = PluginSkillFilePrefabPrepare;
  static prefabClassRun = PluginSkillFilePrefabRun;
}
