import { PrefabBlueprintBase } from './prefab-blueprint-base.js';
import { DefaultSandboxPrefabBlueprint } from './prefab-blueprints/default-sandbox.prefab-blueprint.js';
import { MarkdownContextScenarioPrefabBlueprint } from './prefab-blueprints/markdown-context-scenario.prefab-blueprint.js';
import { PluginsSkillsScenarioPrefabBlueprint } from './prefab-blueprints/plugins-skills-scenario.prefab-blueprint.js';
import { SourceLayoutVariantsPrefabBlueprint } from './prefab-blueprints/source-layout-variants.prefab-blueprint.js';
import { PrefabMainBase } from './prefab-main-base.js';
import { type TestCaseSeedingItem, prefabOrchestration } from './prefab-orchestration.js';
import { PrefabPrepareBase } from './prefab-prepare-base.js';
import { PrefabRunBase } from './prefab-run-base.js';
import { AgentPluginJsonPrefabMain } from './prefabs/agent-plugin-json-prefab/prefab-main.js';
import { DirectoryPrefabMain } from './prefabs/directory-prefab/prefab-main.js';
import { FilePrefabMain } from './prefabs/file-prefab/prefab-main.js';
import { JsonFilePrefabMain } from './prefabs/json-file-prefab/prefab-main.js';
import { LocalMarketplaceNamePrefabMain } from './prefabs/local-marketplace-name-prefab/prefab-main.js';
import { MarkdownContextFileNamePrefabMain } from './prefabs/markdown-context-file-name-prefab/prefab-main.js';
import { MarkdownFilePrefabMain } from './prefabs/markdown-file-prefab/prefab-main.js';
import { PluginCommandMarkdownPrefabMain } from './prefabs/plugin-command-markdown-prefab/prefab-main.js';
import { PluginRuleMarkdownPrefabMain } from './prefabs/plugin-rule-markdown-prefab/prefab-main.js';
import { PluginSkillFilePrefabMain } from './prefabs/plugin-skill-file-prefab/prefab-main.js';
import { PluginsDirPrefabMain } from './prefabs/plugins-dir-prefab/prefab-main.js';
import { PluginsLocalDirPrefabMain } from './prefabs/plugins-local-dir-prefab/prefab-main.js';
import { SkillFileNamePrefabMain } from './prefabs/skill-file-name-prefab/prefab-main.js';
import { SkillsDirPrefabMain } from './prefabs/skills-dir-prefab/prefab-main.js';
import { SkillsLocalDirPrefabMain } from './prefabs/skills-local-dir-prefab/prefab-main.js';
import { SourceDirPrefabMain } from './prefabs/source-dir-prefab/prefab-main.js';
import type { PrefabApplyContext } from './prefab-types.js';

/** Registry list of concrete prefab main classes available to test cases. */
const PREFAB_MAIN_CLASSES = [
  AgentPluginJsonPrefabMain,
  DirectoryPrefabMain,
  FilePrefabMain,
  JsonFilePrefabMain,
  LocalMarketplaceNamePrefabMain,
  MarkdownContextFileNamePrefabMain,
  MarkdownFilePrefabMain,
  PluginCommandMarkdownPrefabMain,
  PluginRuleMarkdownPrefabMain,
  PluginsDirPrefabMain,
  PluginsLocalDirPrefabMain,
  PluginSkillFilePrefabMain,
  SkillFileNamePrefabMain,
  SkillsDirPrefabMain,
  SkillsLocalDirPrefabMain,
  SourceDirPrefabMain,
] as const;

/** Registry list of concrete prefab blueprint classes available to test cases. */
const PREFAB_BLUEPRINT_CLASSES = [
  DefaultSandboxPrefabBlueprint,
  MarkdownContextScenarioPrefabBlueprint,
  PluginsSkillsScenarioPrefabBlueprint,
  SourceLayoutVariantsPrefabBlueprint,
] as const;

/** Shared prefab API surface and registries for e2e seeding. */
export const prefabs = {
  PREFAB_BLUEPRINT_CLASSES,
  PREFAB_MAIN_CLASSES,

  /** Runs blueprint/main seeding: prepare → resolve → run for each expanded slot. */
  applySequentially(items: TestCaseSeedingItem[], context: PrefabApplyContext): void {
    prefabOrchestration.applySeeding(context, items);
  },
} as const;

export {
  AgentPluginJsonPrefabMain,
  DefaultSandboxPrefabBlueprint,
  DirectoryPrefabMain,
  FilePrefabMain,
  JsonFilePrefabMain,
  LocalMarketplaceNamePrefabMain,
  MarkdownContextFileNamePrefabMain,
  MarkdownContextScenarioPrefabBlueprint,
  MarkdownFilePrefabMain,
  PluginCommandMarkdownPrefabMain,
  PluginRuleMarkdownPrefabMain,
  PluginsDirPrefabMain,
  PluginSkillFilePrefabMain,
  PluginsLocalDirPrefabMain,
  PluginsSkillsScenarioPrefabBlueprint,
  prefabOrchestration,
  PrefabBlueprintBase,
  PrefabMainBase,
  PrefabPrepareBase,
  PrefabRunBase,
  SkillFileNamePrefabMain,
  SkillsDirPrefabMain,
  SkillsLocalDirPrefabMain,
  SourceDirPrefabMain,
  SourceLayoutVariantsPrefabBlueprint,
};

export type { TestCaseSeedingItem } from './prefab-orchestration.js';
export type {
  PrefabApplyContext,
  PrefabPrepareAction,
  PrefabPrepareEntry,
  PrefabPrepareGroup,
  PrefabPrepareOverlayOptions,
  PrefabsPrepareConfig,
  ResolvedPrefabsPrepareConfig,
} from './prefab-types.js';
