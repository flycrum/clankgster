import { PrefabMainBase } from '../../prefab-main-base.js';
import { SkillsDirPrefabPrepare } from './prefab-prepare.js';
import type { SkillsDirPrefabOptions } from './prefab-run.js';
import { SkillsDirPrefabRun } from './prefab-run.js';

export class SkillsDirPrefabMain extends PrefabMainBase<SkillsDirPrefabOptions> {
  static prefabClassPrepare = SkillsDirPrefabPrepare;
  static prefabClassRun = SkillsDirPrefabRun;
}
