/**
 * Disabled test case: all preset agents disabled (no custom).
 * Ensures sync runs and produces an empty manifest (all agent entries cleared).
 */

import { clankgstersConfig } from '../../../../clankgsters-sync/config/index.js';
import { e2eTestCase } from '../../define-e2e-test-case.js';
import { DefaultSandboxPrefabBlueprint } from '../../prefabs/prefabs.js';

export const testCase = e2eTestCase.define({
  config: clankgstersConfig.define({
    agents: {
      claude: false,
      cursor: false,
      codex: false,
    },
  }),
  description: 'All preset agents disabled; manifest should have no agent entries.',
  jsonPath: 'test-cases/disabled-all/case-sync-manifest.json',
  seeding: e2eTestCase.defineSeeding([new DefaultSandboxPrefabBlueprint('', {})]),
});
