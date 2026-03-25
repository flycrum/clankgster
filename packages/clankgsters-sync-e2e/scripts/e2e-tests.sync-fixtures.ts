import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { clankgstersIdentity } from '../../clankgsters-sync/config/index.js';
import type { E2eTestCaseDefinition } from './define-e2e-test-case.js';
import { e2eTestsPaths } from './e2e-tests.paths.js';
import { fileStructureFixture } from './utils/file-structure-fixture.js';
import { printLine } from './utils/print-line.js';

function getManifestPathForCase(sandboxRoot: string, testCase: E2eTestCaseDefinition): string {
  if (
    typeof testCase.config.syncManifestPath === 'string' &&
    testCase.config.syncManifestPath.length > 0
  ) {
    return path.isAbsolute(testCase.config.syncManifestPath)
      ? testCase.config.syncManifestPath
      : path.join(sandboxRoot, testCase.config.syncManifestPath);
  }
  if (typeof testCase.config.syncCacheDir === 'string' && testCase.config.syncCacheDir.length > 0) {
    return path.join(
      sandboxRoot,
      testCase.config.syncCacheDir,
      clankgstersIdentity.SYNC_MANIFEST_FILE_NAME
    );
  }
  return path.join(sandboxRoot, clankgstersIdentity.defaultSyncManifestRelativePath);
}

/** Copies generated manifests and file-structure snapshots back into each `scripts/test-cases/<id>/` folder. */
async function main(): Promise<void> {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const packageRoot = path.resolve(scriptDir, '..');
  const testCasesDir = e2eTestsPaths.getTestCasesRoot(scriptDir);
  const resultsRoot = e2eTestsPaths.getResultsRoot(packageRoot);
  const cases = e2eTestsPaths.discoverCases(testCasesDir);

  for (const [offset, { caseConfigPath, caseDir, caseId }] of cases.entries()) {
    const caseIndex = offset + 1;
    const caseDirName = e2eTestsPaths.formatCaseDirectoryName(caseIndex, caseId);
    const caseOutputRoot = path.join(resultsRoot, caseDirName);
    const sandboxRoot = caseOutputRoot;
    const imported = await import(pathToFileURL(caseConfigPath).href);
    const testCase = imported.testCase as E2eTestCaseDefinition;
    const manifestPath = getManifestPathForCase(sandboxRoot, testCase);
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`manifest not found for ${caseId}: ${manifestPath}`);
    }
    const targetManifestFixturePath = path.join(
      caseDir,
      e2eTestsPaths.CASE_SYNC_MANIFEST_FIXTURE_NAME
    );
    const value = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as unknown;
    fs.writeFileSync(targetManifestFixturePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    console.log(printLine.success(`fixture synced: ${targetManifestFixturePath}`));

    const targetFileStructureFixturePath = path.join(
      caseDir,
      e2eTestsPaths.CASE_FILE_STRUCTURE_FIXTURE_NAME
    );
    const snapshot = fileStructureFixture.buildSnapshot(sandboxRoot);
    fs.writeFileSync(
      targetFileStructureFixturePath,
      `${JSON.stringify(snapshot, null, 2)}\n`,
      'utf8'
    );
    console.log(printLine.success(`fixture synced: ${targetFileStructureFixturePath}`));
  }
}

main().catch((error) => {
  console.error(printLine.error(`fixture sync failed: ${String(error)}`));
  process.exit(1);
});
