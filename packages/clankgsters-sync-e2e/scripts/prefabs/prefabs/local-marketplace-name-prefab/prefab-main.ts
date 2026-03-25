import { PrefabMainBase } from '../../prefab-main-base.js';
import { LocalMarketplaceNamePrefabPrepare } from './prefab-prepare.js';
import type { LocalMarketplaceNamePrefabOptions } from './prefab-run.js';
import { LocalMarketplaceNamePrefabRun } from './prefab-run.js';

export class LocalMarketplaceNamePrefabMain extends PrefabMainBase<LocalMarketplaceNamePrefabOptions> {
  static prefabClassPrepare = LocalMarketplaceNamePrefabPrepare;
  static prefabClassRun = LocalMarketplaceNamePrefabRun;
}
