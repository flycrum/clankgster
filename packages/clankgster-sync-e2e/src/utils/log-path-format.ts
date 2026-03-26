import path from 'node:path';

export interface LogPathFormatOptions {
  repoRoot: string;
  tailSegments?: number;
}

/** Path formatting helpers for concise, scan-friendly e2e log output across local and CI environments. */
export const logPathFormat = {
  /** Returns a repo-relative path when inside repo root; otherwise absolute path. */
  repoRelativeOrAbsolute(absolutePath: string, options: LogPathFormatOptions): string {
    const resolvedRoot = path.resolve(options.repoRoot);
    const resolvedPath = path.resolve(absolutePath);
    const relativeToRepo = path.relative(resolvedRoot, resolvedPath);
    const insideRepo =
      relativeToRepo === '' ||
      (relativeToRepo.length > 0 &&
        !relativeToRepo.startsWith('..') &&
        !path.isAbsolute(relativeToRepo));
    return insideRepo ? this.toPosix(relativeToRepo || '.') : this.toPosix(resolvedPath);
  },

  /** Returns a short label plus repo-relative path when available (for example `foo/bar.ts (src/foo/bar.ts)`). */
  summarizePath(absolutePath: string, options: LogPathFormatOptions): string {
    const displayPath = this.repoRelativeOrAbsolute(absolutePath, options);
    const shortLabel = this.lastSegments(displayPath, options.tailSegments ?? 3);
    if (shortLabel === displayPath) return displayPath;
    return `${shortLabel} (${displayPath})`;
  },

  /** Converts OS-native path separators to `/` for stable logs. */
  toPosix(inputPath: string): string {
    return inputPath.split(path.sep).join('/');
  },

  /** Returns the trailing `count` path segments from a POSIX path. */
  lastSegments(posixPath: string, count: number): string {
    const segments = posixPath.split('/').filter((segment) => segment.length > 0);
    if (segments.length === 0) return posixPath;
    return segments.slice(-Math.max(1, count)).join('/');
  },
} as const;
