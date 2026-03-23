import fs from 'node:fs';
import path from 'node:path';

export interface FileAssertionResult {
  missing: string[];
}

export const fileAssertions = {
  /** Returns relative paths under `outputRoot` from `filePaths` that are missing on disk. */
  fromManifestEntries(outputRoot: string, filePaths: string[]): FileAssertionResult {
    const missing = filePaths.filter((relativePath) => {
      return !fs.existsSync(path.join(outputRoot, relativePath));
    });
    return { missing };
  },
};
