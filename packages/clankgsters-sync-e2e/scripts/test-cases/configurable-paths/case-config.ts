/**
 * Configurable source defaults case: verifies source defaults override for sourceDir and markdownContextFileName.
 */

import { clankgstersConfig } from '../../../../clankgsters-sync/config/index.js';
import { e2eTestCase } from '../../define-e2e-test-case.js';
import { DefaultSandboxPrefabBlueprint } from '../../prefabs/prefabs.js';

export const testCase = e2eTestCase.define({
  config: clankgstersConfig.define({
    agents: {
      claude: clankgstersConfig.defineAgent({
        behaviors: ['MarkdownSymlinkSyncPreset'],
        name: 'claude',
      }),
      cursor: false,
      codex: false,
    },
    sourceDefaults: {
      markdownContextFileName: 'YOYO.md',
      sourceDir: '.yoyo',
    },
  }),
  description: 'Source defaults override uses .yoyo and YOYO.md for context symlink discovery.',
  jsonPath: 'test-cases/configurable-paths/case-sync-manifest.json',
  seeding: e2eTestCase.defineSeeding([
    new DefaultSandboxPrefabBlueprint('', {
      markdownContextFileName: 'YOYO.md',
    }),
  ]),
});
