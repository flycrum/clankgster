import { PrefabMainBase } from '../../prefab-main-base.js';
import { SkillFileNamePrefabPrepare } from './prefab-prepare.js';
import type { SkillFileNamePrefabOptions } from './prefab-run.js';
import { SkillFileNamePrefabRun } from './prefab-run.js';

export class SkillFileNamePrefabMain extends PrefabMainBase<SkillFileNamePrefabOptions> {
  static prefabClassPrepare = SkillFileNamePrefabPrepare;
  static prefabClassRun = SkillFileNamePrefabRun;
}
