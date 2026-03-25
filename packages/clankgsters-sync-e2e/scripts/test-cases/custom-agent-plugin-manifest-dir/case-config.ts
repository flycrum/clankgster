import { clankgstersConfig } from '../../../../clankgsters-sync/config/index.js';
import { e2eTestCase } from '../../define-e2e-test-case.js';
import { AgentPluginJsonPrefabMain, DefaultSandboxPrefabBlueprint } from '../../prefabs/prefabs.js';

export const testCase = e2eTestCase.define({
  config: clankgstersConfig.define({
    agents: {
      claude: false,
      codex: false,
      cursor: false,
      custom: {
        testagent: clankgstersConfig.defineAgent({
          behaviors: ['AgentMarketplaceJsonSyncPreset', 'SkillsDirectorySyncPreset'],
          name: 'testagent',
        }),
      },
    },
  }),
  description: 'Custom agent uses fallback plugin manifest dir .testagent-plugin during discovery.',
  jsonPath: 'test-cases/custom-agent-plugin-manifest-dir/case-sync-manifest.json',
  seeding: e2eTestCase.defineSeeding([
    new DefaultSandboxPrefabBlueprint('', {}),
    new AgentPluginJsonPrefabMain('', {
      pluginDirName: 'root',
      pluginManifestDirName: '.testagent-plugin',
      pluginName: 'root',
    }),
  ]),
});
