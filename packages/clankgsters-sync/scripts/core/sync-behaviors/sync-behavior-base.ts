import { ok, type Result } from 'neverthrow';
import type {
  ClankgstersBehaviorConfig,
  ClankgstersConfig,
} from '../configs/clankgsters-config.schema.js';
import type { DiscoveredMarketplace } from '../run/sync-discover-agents.js';
import type { SyncManifestEntry } from '../run/sync-manifest.js';

/** Callback used by sync behaviors to upsert one manifest entry during `sync` mode. */
export type RegisterBehaviorManifestEntry = (
  agentName: string,
  behaviorManifestKey: string,
  entry: SyncManifestEntry
) => void;

/** Runtime context passed to every sync behavior hook execution. */
export interface SyncBehaviorRunContext {
  agentName: string;
  behavior: ClankgstersBehaviorConfig;
  excluded: string[];
  manifestEntry: SyncManifestEntry | undefined;
  mode: 'sync' | 'clear';
  outputRoot: string;
  registerManifestEntry: RegisterBehaviorManifestEntry;
  repoRoot: string;
  resolvedConfig: ClankgstersConfig;
  sharedState: Map<string, unknown>;
  discoveredMarketplaces: DiscoveredMarketplace[];
}

/** Constructor signature for a concrete sync behavior class in the behavior registry. */
export interface SyncBehaviorClassRef {
  new (): SyncBehaviorBase;
}

export class SyncBehaviorBase {
  /** Runs once before `syncRun` for this behavior (defaults to no-op `ok`). */
  syncSetupBefore(_context: SyncBehaviorRunContext): Result<void, Error> {
    return ok(undefined);
  }

  /** Main work for this `(agentName, behaviorName)` pair (defaults to no-op `ok`). */
  syncRun(_context: SyncBehaviorRunContext): Result<void, Error> {
    return ok(undefined);
  }

  /** Runs once after `syncRun` (defaults to no-op `ok`). */
  syncTeardownAfter(_context: SyncBehaviorRunContext): Result<void, Error> {
    return ok(undefined);
  }
}

export const syncBehaviorBase = {
  /** Returns a fresh `SyncBehaviorBase` instance. */
  create(behaviorClass: SyncBehaviorClassRef): SyncBehaviorBase {
    return new behaviorClass();
  },
};
