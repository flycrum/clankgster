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
    syncManifestPath: '.custom/sync-manifest.custom.json',
  }),
  description: 'Custom syncManifestPath writes/reads manifest from a non-default relative path.',
  jsonPath: 'test-cases/sync-manifest-path/case-sync-manifest.json',
  seeding: e2eTestCase.defineSeeding([new DefaultSandboxPrefabBlueprint('', {})]),
});
