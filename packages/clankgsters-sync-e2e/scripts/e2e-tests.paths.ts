import fs from 'node:fs';
import path from 'node:path';

/** One discovered case under `scripts/test-cases/<caseId>/`. */
export interface E2eTestCasePaths {
  /** Absolute path to the discovered case config module.
   * @example `caseConfigPath: '/repo/packages/clankgsters-sync-e2e/scripts/test-cases/basic/case-config.ts'` */
  caseConfigPath: string;
  /** Absolute path to the case directory that contains fixtures and config.
   * @example `caseDir: '/repo/packages/clankgsters-sync-e2e/scripts/test-cases/basic'` */
  caseDir: string;
  /** Case identifier derived from the case directory name.
   * @example `caseId: 'basic'` */
  caseId: string;
}

/** Shared path constants/helpers for e2e-tests sandbox and result directories. */
export const e2eTestsPaths = {
  /** Prefix used when naming per-case output directories (e.g. `case-1-basic`). */
  CASE_NAME_PREFIX: 'case',
  /** Directory name under `sandboxes/` where all run outputs are written (e.g. `sandboxes/.e2e-tests.run-results/`). */
  RESULTS_DIR_NAME: '.e2e-tests.run-results',
  /** Package-local folder that stores sandbox outputs and runtime artifacts (e.g. `packages/clankgsters-sync-e2e/sandboxes/`). */
  SANDBOXES_DIR_NAME: 'sandboxes',
  /** Folder under `scripts/` containing per-case dirs with `case-config.ts` and fixtures. */
  TEST_CASES_DIR_NAME: 'test-cases',

  /** Standard fixture filenames inside each case directory. */
  CASE_FILE_STRUCTURE_FIXTURE_NAME: 'case-file-structure.json',
  CASE_SYNC_MANIFEST_FIXTURE_NAME: 'case-sync-manifest.json',
  CASE_CONFIG_FILE_NAME: 'case-config.ts',

  /** Builds stable per-case result folder name (e.g. `case-1-basic`). */
  formatCaseDirectoryName(caseIndex: number, caseName: string): string {
    return `${this.CASE_NAME_PREFIX}-${caseIndex}-${caseName}`;
  },

  /** Absolute results root under the e2e package. */
  getResultsRoot(packageRoot: string): string {
    return path.join(packageRoot, this.SANDBOXES_DIR_NAME, this.RESULTS_DIR_NAME);
  },

  /** Absolute directory containing per-case subfolders. */
  getTestCasesRoot(scriptsRoot: string): string {
    return path.join(scriptsRoot, this.TEST_CASES_DIR_NAME);
  },

  /** Lists `test-cases/<caseId>/case-config.ts` in alphabetical order by `caseId`. */
  discoverCases(testCasesRoot: string): E2eTestCasePaths[] {
    const results: E2eTestCasePaths[] = [];
    for (const name of fs.readdirSync(testCasesRoot)) {
      if (name.startsWith('.')) continue;
      const caseDir = path.join(testCasesRoot, name);
      if (!fs.statSync(caseDir).isDirectory()) continue;
      const caseConfigPath = path.join(caseDir, this.CASE_CONFIG_FILE_NAME);
      if (!fs.existsSync(caseConfigPath)) continue;
      results.push({ caseConfigPath, caseDir, caseId: name });
    }
    results.sort((left, right) => left.caseId.localeCompare(right.caseId));
    return results;
  },
} as const;
