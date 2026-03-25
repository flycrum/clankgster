import { clankgstersConfig } from '../../../../clankgsters-sync/config/index.js';
import { e2eTestCase } from '../../define-e2e-test-case.js';
import {
  DefaultSandboxPrefabBlueprint,
  PluginsSkillsScenarioPrefabBlueprint,
} from '../../prefabs/prefabs.js';

export const testCase = e2eTestCase.define({
  config: clankgstersConfig.define({
    agents: {
      claude: true,
      codex: false,
      cursor: false,
    },
    sourceDefaults: {
      pluginsDir: 'plugins-custom',
      skillsDir: 'skills-custom',
    },
  }),
  description: 'sourceDefaults pluginsDir/skillsDir overrides with matching seeded tree paths.',
  jsonPath: 'test-cases/source-defaults-plugins-skills-dir/case-sync-manifest.json',
  seeding: e2eTestCase.defineSeeding([
    new DefaultSandboxPrefabBlueprint('', {}),
    new PluginsSkillsScenarioPrefabBlueprint('', {
      prepareGroupAction: 'replace',
      prepareEntryAction: 'replace',
      prepareReplaceRoots: ['.clank/plugins', '.clank/skills'],
      pluginsDirName: 'plugins-custom',
      skillsDirName: 'skills-custom',
      scenarioMode: 'root-only',
    }),
  ]),
});
