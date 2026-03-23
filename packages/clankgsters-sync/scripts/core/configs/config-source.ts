import type { ClankConfig } from "./schema/clank-config.schema.js";

export interface ClankConfigResolutionContext {
  /** Current sync run mode (e.g. apply rules vs clear). */
  mode: "sync" | "clear";
  /** Absolute path to the repository root being configured. */
  repoRoot: string;
}

export interface ClankConfigSource {
  /** Stable id for this source (logging, merge diagnostics). */
  id: string;
  /** Merge order: lower values load first; compare with `clankConfigSource.comparePriority`. */
  priority: number;
  /** Returns partial config for the repo, sync or async; `null`/`undefined` layers are skipped. */
  load: (
    context: ClankConfigResolutionContext,
  ) => Promise<Partial<ClankConfig> | null> | Partial<ClankConfig> | null;
}

export const clankConfigSource = {
  /** Comparator for sorting sources: lower `priority` values order first (`a.priority - b.priority`). */
  comparePriority(a: ClankConfigSource, b: ClankConfigSource): number {
    return a.priority - b.priority;
  },
};
