import { PrefabMainBase } from '../../prefab-main-base.js';
import { SkillsLocalDirPrefabPrepare } from './prefab-prepare.js';
import type { SkillsLocalDirPrefabOptions } from './prefab-run.js';
import { SkillsLocalDirPrefabRun } from './prefab-run.js';

export class SkillsLocalDirPrefabMain extends PrefabMainBase<SkillsLocalDirPrefabOptions> {
  static prefabClassPrepare = SkillsLocalDirPrefabPrepare;
  static prefabClassRun = SkillsLocalDirPrefabRun;
}
