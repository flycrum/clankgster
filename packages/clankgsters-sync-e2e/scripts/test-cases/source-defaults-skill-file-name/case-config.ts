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
      skillFileName: 'ABILITY.md',
    },
  }),
  description: 'sourceDefaults.skillFileName override drives standalone skill discovery marker.',
  jsonPath: 'test-cases/source-defaults-skill-file-name/case-sync-manifest.json',
  seeding: e2eTestCase.defineSeeding([
    new DefaultSandboxPrefabBlueprint('', {}),
    new PluginsSkillsScenarioPrefabBlueprint('', {
      includeRootRules: false,
      includeStandaloneSkill: true,
      prepareGroupAction: 'replace',
      prepareEntryAction: 'replace',
      prepareReplaceRoots: ['.clank/skills/sample-skill'],
      scenarioMode: 'root-only',
      skillFileName: 'ABILITY.md',
    }),
  ]),
});
