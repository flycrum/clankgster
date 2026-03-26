import { clankgsterConfig, clankgsterIdentity } from '../../../../clankgster-sync/src/index.js';
import { e2eTestCase } from '../../core/e2e-define-test-case.js';
import { AgentPluginJsonSeedingPrefab } from '../../seeding-prefabs/prefabs/agent-plugin-json-seeding-prefab.js';
import { PluginCommandMarkdownSeedingPrefab } from '../../seeding-prefabs/prefabs/plugin-command-markdown-seeding-prefab.js';
import { PluginRuleMarkdownSeedingPrefab } from '../../seeding-prefabs/prefabs/plugin-rule-markdown-seeding-prefab.js';
import { SourceDirSeedingPrefab } from '../../seeding-prefabs/prefabs/source-dir-seeding-prefab.js';

export const testCase = e2eTestCase.define({
  assertions: {
    fileContains: {
      '.cursor/commands/root/root-cmd.md': [
        '../../../.clank/plugins/root/references/guide.md',
        'cursor',
        'from-hook',
        '<thinking phase="draft">HELLO</thinking>',
        'from-registry',
      ],
      '.cursor/rules/root/root-rule.mdc': [
        '../../../.clank/plugins/root/references/guide.md',
        'cursor',
        'from-hook',
        '<thinking phase="draft">HELLO</thinking>',
        'from-registry',
      ],
    },
  },
  config: clankgsterConfig.define({
    agents: {
      cursor: true,
    },
    transforms: {
      hooks: {
        SyncFsTransformMarkdownTemplateVariablesPreset: {
          onTemplateVariable: (payload) => {
            if (payload.variableName === 'custom_local') {
              return { ...payload, replacement: 'from-hook' };
            }
            return payload;
          },
        },
        SyncFsTransformMarkdownXmlSegmentsPreset: {
          onXmlTransform: (payload) => ({
            ...payload,
            innerContent: payload.innerContent.toUpperCase(),
          }),
        },
        SyncFsTransformMarkdownCustomRegistryPreset: {
          onTemplateVariable: (payload) => {
            if (payload.variableName === 'registry_local') {
              return { ...payload, replacement: 'from-registry' };
            }
            return payload;
          },
        },
      },
      registry: (definitions) => {
        const baseDefinition = definitions.SyncFsTransformMarkdownTemplateVariablesPreset;
        if (baseDefinition == null) return definitions;
        return {
          ...definitions,
          SyncFsTransformMarkdownCustomRegistryPreset: {
            ...baseDefinition,
            name: 'SyncFsTransformMarkdownCustomRegistryPreset',
          },
        };
      },
      templateVariables: {
        closingDelimiterToken: ']]',
        openingDelimiterToken: '[[',
      },
    },
  }),
  description:
    'Validates sync-fs-transforms content changes (link rewrite, xml/template hooks, custom registry transform).',
  jsonPath: 'test-cases/sync-fs-transforms/case-sync-manifest.json',
  seeding: e2eTestCase.defineSeeding([
    new SourceDirSeedingPrefab('', {}),
    new AgentPluginJsonSeedingPrefab('', {
      pluginDirName: 'root',
      pluginManifestDirName: clankgsterIdentity.AGENT_CURSOR_PLUGIN_DIR_NAME,
    }),
    new PluginCommandMarkdownSeedingPrefab('', {
      commandContents:
        '# cmd\\n\\n[Reference](../references/guide.md)\\n\\n[[ clankgster_agent_name ]] [[ custom_local ]] [[ registry_local ]]\\n\\n<thinking phase="draft">hello</thinking>\\n',
      pluginDirName: 'root',
    }),
    new PluginRuleMarkdownSeedingPrefab('', {
      pluginDirName: 'root',
      ruleContents:
        '# rule\\n\\n[Reference](../references/guide.md)\\n\\n[[ clankgster_agent_name ]] [[ custom_local ]] [[ registry_local ]]\\n\\n<thinking phase="draft">hello</thinking>\\n',
      ruleFileName: 'root-rule.md',
    }),
  ]),
});
