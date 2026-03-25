import { PrefabMainBase } from './prefab-main-base.js';
import type { PrefabPrepareOverlayOptions } from './prefab-types.js';

/** Base class for blueprints that expand into one or more prefab main instances (declarative only). */
export abstract class PrefabBlueprintBase<TOptions extends object = Record<string, never>> {
  constructor(
    public readonly sandboxDirectoryName: string,
    public readonly options: TOptions
  ) {}

  /** Returns prefab main instances to execute sequentially for this blueprint. */
  abstract createPrefabMains(): PrefabMainBase<object>[];

  /**
   * Optional overlay applied to each expanded main's prepare config (e.g. replace actions and roots).
   */
  getPrepareOverlay(): PrefabPrepareOverlayOptions | undefined {
    return undefined;
  }
}
