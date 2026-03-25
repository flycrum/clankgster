import { readFileSync } from 'node:fs';
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
    return this.packFileSegmentsToLintGlobs(files);
  },

  /** Maps npm `files` path segments to oxlint file globs. */
  packFileSegmentsToLintGlobs(segments: readonly string[]): string[] {
    const out: string[] = [];
    for (const segment of segments) {
      if (segment === 'dist') continue;
      if (segment === 'bin') {
        out.push(`${segment}/**/*.{mjs,ts}`);
        continue;
      }
      out.push(`${segment}/**/*.{ts,tsx}`);
    }
    return out;
  },
} as const;
