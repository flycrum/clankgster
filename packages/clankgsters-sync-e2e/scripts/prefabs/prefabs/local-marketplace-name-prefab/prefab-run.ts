import {
  clankgstersConfigDefaults,
  clankgstersIdentity,
} from '../../../../../clankgsters-sync/config/index.js';
import type { JsonFilePrefabOptions } from '../json-file-prefab/prefab-run.js';
import { JsonFilePrefabRun } from '../json-file-prefab/prefab-run.js';

export interface LocalMarketplaceNamePrefabOptions {
  localMarketplaceName?: string;
  marketplaceFilePath?: string;
}

/** Writes a local marketplace JSON stub seeded with the configured marketplace name. */
export class LocalMarketplaceNamePrefabRun extends JsonFilePrefabRun {
  constructor(sandboxDirectoryName: string, options: LocalMarketplaceNamePrefabOptions = {}) {
    const localMarketplaceName =
      options.localMarketplaceName ??
      clankgstersConfigDefaults.CONSTANTS.sourceDefaults.localMarketplaceName;
    const marketplaceFilePath =
      options.marketplaceFilePath ??
      `${clankgstersIdentity.AGENT_CLAUDE_PLUGIN_DIR_NAME}/marketplace.json`;
    const pathSegments = marketplaceFilePath.split('/').filter((segment) => segment.length > 0);
    const fileName = pathSegments.pop() ?? 'marketplace.json';
    const resolved: JsonFilePrefabOptions = {
      fileName,
      jsonValue: {
        name: localMarketplaceName,
        owner: { name: 'clankgsters' },
        plugins: [],
      },
      parentPaths: pathSegments,
    };
    super(sandboxDirectoryName, resolved);
  }
}
