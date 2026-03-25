/**
 * Path utilities for Clankgsters sync scripts: resolves the **consumer repo root** from this
 * module’s location (so `pnpm -F` / package `cwd` does not mis-resolve), with an explicit env
 * override for sandboxes, linked installs, and the published CLI bin.
 *
 * Same resolution idea as other sync CLIs: explicit `CLANKGSTERS_REPO_ROOT` plus package-root walk.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const _scriptDir = path.dirname(fileURLToPath(import.meta.url));

/** True when `dir` looks like a repository root (marker files used by the POC and here). */
function hasRepoRootMarker(dir: string): boolean {
  return (
    fs.existsSync(path.join(dir, 'package.json')) ||
    fs.existsSync(path.join(dir, 'pnpm-workspace.yaml')) ||
    fs.existsSync(path.join(dir, 'lerna.json'))
  );
}

/** Namespaced path helpers for sync runtime; prefer `getRepoRoot()` for repo-relative work. */
export const pathHelpers = {
  /** Directory of this module (`scripts/common`). */
  get scriptDir(): string {
    return _scriptDir;
  },

  /** Root of the `@clankgsters/sync` package (the folder named like the published package). */
  get packageRoot(): string {
    return path.resolve(_scriptDir, '..', '..');
  },

  /**
   * Absolute path to the repository root that should hold `clankgsters.config.ts` and `.clank/`.
   *
   * **Resolution order**
   * 1. `CLANKGSTERS_REPO_ROOT` when set — used by e2e tests/sandboxes, `pnpm link`, and the `clankgsters-sync` bin so the **invocation directory** is the target project (not the symlink source under `node_modules`).
   * 2. Otherwise {@link pathHelpers.resolveRepoRootFromPackageRoot} from {@link pathHelpers.packageRoot} so `pnpm -F @clankgsters/sync run …` (where `cwd` is the package dir) still resolves to the monorepo root.
   *
   * **Not** `process.cwd()` alone — that breaks filtered workspace scripts because `cwd` is the package directory.
   */
  getRepoRoot(): string {
    const envRoot = process.env.CLANKGSTERS_REPO_ROOT;
    if (typeof envRoot === 'string' && envRoot.length > 0) return path.resolve(envRoot);
    return this.resolveRepoRootFromPackageRoot(this.packageRoot);
  },

  /**
   * Resolves repo root from the `@clankgsters/sync` package directory.
   *
   * - **Workspace / dev:** `packageRoot` is `.../packages/clankgsters-sync` → walks up to the monorepo root (two levels) when not under `node_modules`.
   * - **Published install:** path contains `node_modules` → takes the segment before the first `node_modules`, then walks up until a marker is found.
   *
   * Exposed for tests and advanced callers; normal code should use `getRepoRoot()`.
   *
   * @param packageRoot - Absolute path to the `@clankgsters/sync` package root (the folder that contains `package.json` for this package).
   * @returns Absolute path to the consumer or monorepo root.
   */
  resolveRepoRootFromPackageRoot(packageRoot: string): string {
    const normalized = packageRoot.replace(/\\/g, '/');
    if (normalized.includes('/node_modules/')) {
      const parts = normalized.split('/node_modules/');
      const candidate = path.resolve(parts[0]!);
      if (hasRepoRootMarker(candidate)) return candidate;
      let dir = candidate;
      for (;;) {
        const parent = path.dirname(dir);
        if (parent === dir) break;
        dir = parent;
        if (hasRepoRootMarker(dir)) return dir;
      }
      return candidate;
    }
    return path.resolve(packageRoot, '..', '..');
  },

  /** Joins path segments under a root and normalizes to an absolute path. */
  joinRepo(repoRoot: string, ...segments: string[]): string {
    return path.resolve(repoRoot, ...segments);
  },

  /** Normalizes slash style and trims duplicate separators for path comparisons. */
  normalizePathForCompare(targetPath: string): string {
    return targetPath.replace(/\\/g, '/').replace(/\/+/g, '/').replace(/\/$/g, '');
  },

  /**
   * True when `resolvedTarget` is the output root or a path under it (both arguments should already be passed through `path.resolve`).
   * Rejects `..` traversal and absolute `path.relative` results (e.g. different drive roots on Windows)
   */
  isResolvedPathUnderRoot(outputRoot: string, resolvedTarget: string): boolean {
    const root = path.resolve(outputRoot);
    const target = path.resolve(resolvedTarget);
    const rel = path.relative(root, target);
    if (rel.startsWith('..') || path.isAbsolute(rel)) return false;
    return target === root || target.startsWith(root + path.sep);
  },
};
