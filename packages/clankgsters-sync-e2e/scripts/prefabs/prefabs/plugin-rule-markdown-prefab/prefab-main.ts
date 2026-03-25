import { PrefabMainBase } from '../../prefab-main-base.js';
import { PluginRuleMarkdownPrefabPrepare } from './prefab-prepare.js';
import type { PluginRuleMarkdownPrefabOptions } from './prefab-run.js';
import { PluginRuleMarkdownPrefabRun } from './prefab-run.js';

export class PluginRuleMarkdownPrefabMain extends PrefabMainBase<PluginRuleMarkdownPrefabOptions> {
  static prefabClassPrepare = PluginRuleMarkdownPrefabPrepare;
  static prefabClassRun = PluginRuleMarkdownPrefabRun;
}
