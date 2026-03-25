import { clankgstersConfig } from '../../../../clankgsters-sync/config/index.js';
import { e2eTestCase } from '../../define-e2e-test-case.js';
import {
  DefaultSandboxPrefabBlueprint,
  SourceLayoutVariantsPrefabBlueprint,
} from '../../prefabs/prefabs.js';

export const testCase = e2eTestCase.define({
  config: clankgstersConfig.define({
    agents: {
      claude: true,
      codex: false,
      cursor: false,
    },
  }),
  description:
    'Seeds nested/shorthand x regular/local source layout variants for discovery coverage.',
  jsonPath: 'test-cases/source-layout-all-variants/case-sync-manifest.json',
  seeding: e2eTestCase.defineSeeding([
    new DefaultSandboxPrefabBlueprint('', {}),
    new SourceLayoutVariantsPrefabBlueprint('', {}),
  ]),
});
