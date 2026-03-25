import { clankgstersConfig } from '../../../../clankgsters-sync/config/index.js';
import { e2eTestCase } from '../../define-e2e-test-case.js';
import { DefaultSandboxPrefabBlueprint } from '../../prefabs/prefabs.js';

export const testCase = e2eTestCase.define({
  config: clankgstersConfig.define({
    agents: {
      claude: true,
      codex: false,
      cursor: false,
    },
    syncCacheDir: '.alt-cache',
  }),
  description: 'Custom syncCacheDir writes manifest under a non-default cache directory.',
  jsonPath: 'test-cases/sync-cache-dir/case-sync-manifest.json',
  seeding: e2eTestCase.defineSeeding([new DefaultSandboxPrefabBlueprint('', {})]),
});
