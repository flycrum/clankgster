/**
 * Contract tests for `.oxlintrc.jsonc` + package `vite.config.ts` lint overrides:
 * - `@clankgster/sync` must not depend on `@clankgster/sync-e2e`
 * - `@clankgster/dafiles` must not depend on `@clankgster/sync` (sync consumes dafiles only)
 *
 * Safety: oxlint is invoked without fix flags (read-only on sources). Bad fixtures live under each
 * package's `tmp/` (ignored repo-wide), removed in `finally`.
 *
 * Skipped when `GITHUB_ACTIONS` is set. Run `vp test` / `pnpm test` locally to enforce.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, rmdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vite-plus/test';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const syncPackageRoot = join(repoRoot, 'packages', 'clankgster-sync');
const dafilesPackageRoot = join(repoRoot, 'packages', 'clankgster-dafiles');
/** Real oxlint binary (pnpm links `node_modules/oxlint` under `@clankgster/sync`). */
const oxlintBin = join(syncPackageRoot, 'node_modules', 'oxlint', 'bin', 'oxlint');

function runOxlintOnFile(absolutePath: string): void {
  execFileSync(oxlintBin, ['-c', join(repoRoot, '.oxlintrc.jsonc'), absolutePath], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: 'pipe',
  });
}

describe.skipIf(Boolean(process.env.GITHUB_ACTIONS))('Oxlint monorepo package boundaries', () => {
  describe('@clankgster/sync must not depend on @clankgster/sync-e2e', () => {
    it('fails when a file under sync imports the e2e package', () => {
      const tmpBase = join(syncPackageRoot, 'tmp');
      mkdirSync(tmpBase, { recursive: true });
      const tmpDir = mkdtempSync(join(tmpBase, 'oxlint-boundary-'));
      try {
        const badPath = join(tmpDir, 'should-fail.ts');
        writeFileSync(badPath, `import type { never } from '@clankgster/sync-e2e';\n`);
        try {
          runOxlintOnFile(badPath);
          expect.fail('oxlint should have failed');
        } catch (error: unknown) {
          const coded = error as { status?: number };
          expect(coded.status).toBe(1);
        }
      } finally {
        if (existsSync(tmpDir)) {
          rmSync(tmpDir, { recursive: true, force: true });
        }
        if (existsSync(tmpBase)) {
          try {
            rmdirSync(tmpBase);
          } catch {
            // Non-empty (other writers) or race; leave `tmp/` alone.
          }
        }
      }
    });

    it('passes for normal sync exports (positive)', () => {
      const samplePath = join(syncPackageRoot, 'src', 'index.ts');
      expect(() => runOxlintOnFile(samplePath)).not.toThrow();
    });
  });

  describe('@clankgster/dafiles must not depend on @clankgster/sync', () => {
    it('fails when a file under dafiles imports sync', () => {
      const tmpBase = join(dafilesPackageRoot, 'tmp');
      mkdirSync(tmpBase, { recursive: true });
      const tmpDir = mkdtempSync(join(tmpBase, 'oxlint-boundary-'));
      try {
        const badPath = join(tmpDir, 'should-fail.ts');
        writeFileSync(badPath, `import type { never } from '@clankgster/sync';\n`);
        try {
          runOxlintOnFile(badPath);
          expect.fail('oxlint should have failed');
        } catch (error: unknown) {
          const coded = error as { status?: number };
          expect(coded.status).toBe(1);
        }
      } finally {
        if (existsSync(tmpDir)) {
          rmSync(tmpDir, { recursive: true, force: true });
        }
        if (existsSync(tmpBase)) {
          try {
            rmdirSync(tmpBase);
          } catch {
            // Non-empty or race; leave `tmp/` alone.
          }
        }
      }
    });

    it('passes for normal dafiles exports (positive)', () => {
      const samplePath = join(dafilesPackageRoot, 'src', 'index.ts');
      expect(() => runOxlintOnFile(samplePath)).not.toThrow();
    });
  });
});
