import fs, { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vite-plus/test';
import { pathHelpers } from './path-helpers.js';

describe('pathHelpers', () => {
  describe('resolveRepoRootFromPackageRoot', () => {
    it('walks up two segments from a workspace package dir (no node_modules)', () => {
      const pkg = path.join('/workspace', 'packages', 'clankgsters-sync');
      expect(pathHelpers.resolveRepoRootFromPackageRoot(pkg)).toBe(path.resolve('/workspace'));
    });

    it('resolves consumer project root when the package path is under node_modules', () => {
      const root = mkdtempSync(path.join(tmpdir(), 'clankgsters-path-test-'));
      try {
        const consumer = path.join(root, 'consumer');
        mkdirSync(consumer, { recursive: true });
        writeFileSync(path.join(consumer, 'package.json'), '{}');
        const pkgPath = path.join(consumer, 'node_modules', '@clankgsters', 'sync');
        mkdirSync(pkgPath, { recursive: true });
        expect(pathHelpers.resolveRepoRootFromPackageRoot(pkgPath)).toBe(consumer);
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    });
  });

  describe('getRepoRoot', () => {
    it('honors CLANKGSTERS_REPO_ROOT when set', () => {
      const previous = process.env.CLANKGSTERS_REPO_ROOT;
      try {
        process.env.CLANKGSTERS_REPO_ROOT = '/explicit/repo/root';
        expect(pathHelpers.getRepoRoot()).toBe(path.resolve('/explicit/repo/root'));
      } finally {
        if (previous === undefined) delete process.env.CLANKGSTERS_REPO_ROOT;
        else process.env.CLANKGSTERS_REPO_ROOT = previous;
      }
    });

    it('resolves to this monorepo root when env is unset (from package layout)', () => {
      const previous = process.env.CLANKGSTERS_REPO_ROOT;
      try {
        delete process.env.CLANKGSTERS_REPO_ROOT;
        const resolved = pathHelpers.getRepoRoot();
        expect(fs.existsSync(path.join(resolved, 'package.json'))).toBe(true);
        expect(
          fs.existsSync(path.join(resolved, 'pnpm-workspace.yaml')) ||
            fs.existsSync(path.join(resolved, 'package.json'))
        ).toBe(true);
      } finally {
        if (previous === undefined) delete process.env.CLANKGSTERS_REPO_ROOT;
        else process.env.CLANKGSTERS_REPO_ROOT = previous;
      }
    });
  });
});
