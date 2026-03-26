import { readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Maps npm `package.json` → `files` entries to oxlint `overrides[].files` globs (Vite+ `lint` config).
 * `dist` is skipped (generated). `bin` uses `mjs`/`ts`; other segments use `ts`/`tsx`.
 */
export const npmPackFilesToLintGlobs = {
  /**
   * Resolves the directory containing `package.json` from an ESM `import.meta.url`, then returns lint globs.
   */
  getLintGlobsForImportMetaUrl(importMetaUrl: string | URL): string[] {
    const packageRoot = dirname(fileURLToPath(importMetaUrl));
    return this.getLintGlobsForPackageRoot(packageRoot);
  },

  /**
   * Reads `package.json` at `packageRoot` and returns globs for each `files` entry.
   */
  getLintGlobsForPackageRoot(packageRoot: string): string[] {
    const { files } = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8')) as {
      files: string[];
    };
    return this.packFileSegmentsToLintGlobs(packageRoot, files);
  },

  /**
   * Maps npm `files` path segments to oxlint `overrides[].files` globs, resolving each path under `packageRoot`.
   * Directories get recursive `ts`/`tsx` globs (`bin` uses `mjs`/`ts`); regular files use the segment as a literal target.
   */
  packFileSegmentsToLintGlobs(packageRoot: string, segments: readonly string[]): string[] {
    const out: string[] = [];
    for (const segment of segments) {
      if (segment === 'dist') continue;
      const absolute = join(packageRoot, segment);
      let isDirectory = false;
      let isFile = false;
      try {
        const st = statSync(absolute);
        isDirectory = st.isDirectory();
        isFile = st.isFile();
      } catch {
        isDirectory = true;
      }
      if (isFile) {
        out.push(segment);
        continue;
      }
      if (!isDirectory) continue;
      if (segment === 'bin') {
        out.push(`${segment}/**/*.{mjs,ts}`);
        continue;
      }
      out.push(`${segment}/**/*.{ts,tsx}`);
    }
    return out;
  },
} as const;
