import type { ClankgstersConfig } from './clankgsters-config.schema.js';

export interface ClankgstersConfigResolutionContext {
  /** Current sync run mode (e.g. apply rules vs clear). */
  mode: 'sync' | 'clear';
  /** Absolute path to the repository root being configured. */
  repoRoot: string;
}

export interface ClankgstersConfigSource {
  /** Stable id for this source (logging, merge diagnostics). */
  id: string;
  /** Merge order: lower values load first; compare with `clankgstersConfigSource.comparePriority`. */
  priority: number;
  /** Returns partial config for the repo, sync or async; `null`/`undefined` layers are skipped. */
  load: (
    context: ClankgstersConfigResolutionContext
  ) => Promise<Partial<ClankgstersConfig> | null> | Partial<ClankgstersConfig> | null;
}

export const clankgstersConfigSource = {
  /** Comparator for sorting sources: lower `priority` values order first (`a.priority - b.priority`). */
  comparePriority(a: ClankgstersConfigSource, b: ClankgstersConfigSource): number {
    return a.priority - b.priority;
  },
};
