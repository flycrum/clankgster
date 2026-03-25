import { PrefabMainBase } from '../../prefab-main-base.js';
import { PluginCommandMarkdownPrefabPrepare } from './prefab-prepare.js';
import type { PluginCommandMarkdownPrefabOptions } from './prefab-run.js';
import { PluginCommandMarkdownPrefabRun } from './prefab-run.js';

export class PluginCommandMarkdownPrefabMain extends PrefabMainBase<PluginCommandMarkdownPrefabOptions> {
  static prefabClassPrepare = PluginCommandMarkdownPrefabPrepare;
  static prefabClassRun = PluginCommandMarkdownPrefabRun;
}
