import { npmPackFilesToLintGlobs } from '@clankgster/vite-plus-config/common/npm-pack-files-to-lint-globs';
import { monoBaseFormatConfig } from '@clankgster/vite-plus-config/mono-base-format-config';
import { monoBaseLintConfig } from '@clankgster/vite-plus-config/mono-base-lint-config';
import { monoBaseVitestNodeConfig } from '@clankgster/vite-plus-config/mono-base-vitest-node-config';
import type { OxlintConfig } from 'oxlint';
import { defineConfig } from 'vite-plus';

const dafilesPackageLintOverrideFiles = npmPackFilesToLintGlobs.getLintGlobsForImportMetaUrl(
  import.meta.url
);

/** Enforced for `@clankgster/dafiles` only; keep aligned with `.oxlintrc.jsonc` (editor / `pnpm exec oxlint`). */
const dafilesMustNotDependOnSyncRules: NonNullable<OxlintConfig['rules']> = {
  'eslint/no-restricted-imports': [
    'error',
    {
      paths: [
        {
          name: '@clankgster/sync',
          message:
            '@clankgster/dafiles must not depend on @clankgster/sync; sync consumes dafiles, not the reverse.',
        },
      ],
      patterns: [
        {
          regex: 'clankgster-sync',
          message:
            '@clankgster/dafiles must not import paths containing clankgster-sync (including sync or sync-e2e).',
        },
      ],
    },
  ],
};

export default defineConfig({
  ...monoBaseVitestNodeConfig,
  test: {
    ...monoBaseVitestNodeConfig.test,
    include: ['src/**/*.spec.ts', 'tests/**/*.test.ts'],
    passWithNoTests: true,
  },
  lint: {
    ...monoBaseLintConfig,
    overrides: [
      ...(monoBaseLintConfig.overrides ?? []),
      {
        files: dafilesPackageLintOverrideFiles,
        rules: dafilesMustNotDependOnSyncRules,
      },
    ],
  },
  fmt: monoBaseFormatConfig,
});
