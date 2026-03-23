import { LocalPluginCacheBustBehavior } from './local-plugin-cache-bust-behavior.js';
import { LocalPluginsContentSyncBehavior } from './local-plugins-content-sync-behavior.js';
import { MarkdownContextSymlinkSyncBehavior } from './markdown-context-symlink-sync-behavior.js';
import { MarkdownSectionSyncBehavior } from './markdown-section-sync-behavior.js';
import { MarketplaceJsonSyncBehavior } from './marketplace-json-sync-behavior.js';
import { RulesSymlinkSyncBehavior } from './rules-symlink-sync-behavior.js';
import { SettingsSyncBehavior } from './settings-sync-behavior.js';
import { SkillsDirectorySyncBehavior } from './skills-directory-sync-behavior.js';
import type { SyncBehaviorClassRef } from './sync-behavior-base.js';

/** Built-in behavior class registry keyed by stable behavior ids from config. */
export const syncBehaviorRegistry = {
  resolve(behaviorName: string): SyncBehaviorClassRef | null {
    const registry: Record<string, SyncBehaviorClassRef> = {
      cacheBust: LocalPluginCacheBustBehavior,
      commands: LocalPluginsContentSyncBehavior,
      markdownContextSymlink: MarkdownContextSymlinkSyncBehavior,
      localContentSync: LocalPluginsContentSyncBehavior,
      localMarketplaceSync: MarketplaceJsonSyncBehavior,
      localPluginsContentSync: LocalPluginsContentSyncBehavior,
      markdownSectionSync: MarkdownSectionSyncBehavior,
      marketplaceJson: MarketplaceJsonSyncBehavior,
      rules: RulesSymlinkSyncBehavior,
      rulesSymlink: RulesSymlinkSyncBehavior,
      settingsSync: SettingsSyncBehavior,
      skills: SkillsDirectorySyncBehavior,
      skillsDirectorySync: SkillsDirectorySyncBehavior,
      skillsSync: SkillsDirectorySyncBehavior,
    };
    return registry[behaviorName] ?? null;
  },
};
