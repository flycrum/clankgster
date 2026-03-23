/**
 * CLI harness for package-local e2e cases: discovers modules under `scripts/test-cases/`,
 * runs them through `runOneE2eCase`, and exits with status 1 when any case fails.
 */
import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runOneE2eCase } from './e2e-case-runner.js';
import { printLine } from './utils/print-line.js';

/**
 * Runs the e2e loop: optional `process.argv[2]` selects a single `<name>` so only
 * `test-cases/<name>.ts` runs; otherwise every `*.ts` case in `scripts/test-cases/` runs in order.
 *
 * Each case uses `sandboxes/.tests/current` as the live sandbox; `runOneE2eCase` removes it on success.
 *
 * Invariants:
 * - Deletes `sandboxes/.tests` once at harness start so each invocation begins from a clean tree.
 * - On failure, renames `current` to `failed-<case>` under `.tests` so the partial sandbox stays for debugging.
 */
async function main(): Promise<void> {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const packageRoot = path.resolve(scriptDir, '..');
  const repoRoot = path.resolve(packageRoot, '..', '..');
  const testCasesDir = path.join(scriptDir, 'test-cases');
  const caseNameArg = process.argv[2];
  const testCases = fs
    .readdirSync(testCasesDir)
    .filter((name) => name.endsWith('.ts') && !name.endsWith('.d.ts'));
  const selectedCases =
    caseNameArg != null ? testCases.filter((name) => name === `${caseNameArg}.ts`) : testCases;

  if (selectedCases.length === 0) {
    console.error(chalk.red('No e2e test cases found.'));
    process.exit(1);
  }

  const testsRoot = path.join(packageRoot, 'sandboxes', '.tests');
  if (fs.existsSync(testsRoot)) fs.rmSync(testsRoot, { recursive: true, force: true });

  let failures = 0;
  for (const testCaseFile of selectedCases) {
    const name = testCaseFile.replace(/\.ts$/, '');
    const outputRoot = path.join(testsRoot, 'current');
    const result = await runOneE2eCase({
      expectedManifestPath: path.join(testCasesDir, `${name}.json`),
      keepSandboxOnFailure: true,
      name,
      outputRoot,
      packageRoot,
      repoRoot,
      testCaseTsPath: path.join(testCasesDir, testCaseFile),
    });
    if (result.passed) {
      console.log(printLine.success(`${name} passed`));
      continue;
    }

    failures += 1;
    const failedPath = path.join(testsRoot, `failed-${name}`);
    if (fs.existsSync(failedPath)) fs.rmSync(failedPath, { recursive: true, force: true });
    if (fs.existsSync(outputRoot)) fs.renameSync(outputRoot, failedPath);
    console.log(printLine.error(`${name} failed`));
    for (const errorLine of result.errorLines) console.log(errorLine);
  }

  if (failures > 0) {
    console.error(chalk.red(`E2E failures: ${failures}`));
    process.exit(1);
  }
  console.log(chalk.green('All e2e cases passed.'));
}

main().catch((error) => {
  console.error(chalk.red('Unexpected e2e harness error'), error);
  process.exit(1);
});
