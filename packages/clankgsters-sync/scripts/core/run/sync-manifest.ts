import { ok, type Result } from "neverthrow";
import path from "node:path";

/** One recorded sync action for an agent in the manifest. */
export interface SyncManifestEntry {
  behavior: string;
  options?: Record<string, unknown>;
}

/** Per-agent lists of manifest entries (persisted shape). */
export type SyncManifest = Record<string, SyncManifestEntry[]>;

/**
 * Manifest API contracts and no-op persistence used by sync architecture bones.
 *
 * Invariants:
 * - Keep function signatures stable for a future real storage implementation.
 * - Prefer pure behavior where possible to simplify machine tests.
 */
export const syncManifest = {
  /** Absolute path to the manifest JSON under `repoRoot`, using `overridePath` or the default relative file. */
  getManifestPath(repoRoot: string, overridePath?: string): string {
    return path.resolve(repoRoot, overridePath ?? ".clankgsters/sync-manifest.json");
  },
  /** Reads manifest from disk (placeholder: returns an empty manifest until real persistence exists). */
  load(_manifestPath: string): Result<SyncManifest, Error> {
    // Intentional placeholder: manifest persistence wiring exists, storage is deferred.
    return ok({});
  },
  /** Persists manifest to disk (placeholder: no-op until real persistence exists). */
  write(_manifestPath: string, _manifest: SyncManifest): Result<void, Error> {
    // Intentional placeholder: no-op write for architecture phase.
    return ok(undefined);
  },
  /** Returns a new manifest with `entry` appended for `agent`, without mutating `manifest`. */
  registerEntry(
    manifest: SyncManifest,
    agent: string,
    entry: SyncManifestEntry,
  ): Result<SyncManifest, Error> {
    const existing = manifest[agent] ?? [];
    return ok({
      ...manifest,
      [agent]: [...existing, entry],
    });
  },
  /** Empty manifest object suitable before the first load or after a reset. */
  emptyManifest(): SyncManifest {
    return {};
  },
};
