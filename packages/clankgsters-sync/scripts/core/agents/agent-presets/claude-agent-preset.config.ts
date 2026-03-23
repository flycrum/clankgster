import type { AgentPresetConfig } from './agent-preset.config.js';

/** Claude preset constants as a single source of truth. */
export const claudeAgentPresetConfig = {
  CONSTANTS: {
    AGENT_NAME: 'claude',
    GITIGNORE_COMMENT: '\n# clankgsters-sync: symlinked from AGENTS.md for Claude\n',
    MARKDOWN_CONTEXT_TARGET_FILE_NAME: 'CLAUDE.md',
    get GITIGNORE_ENTRY() {
      return this.MARKDOWN_CONTEXT_TARGET_FILE_NAME;
    },
    LOCAL_CONTENT_TARGET_ROOT: undefined,
    LOCAL_PLUGIN_CACHE_SEGMENTS: ['.claude', 'plugins', 'cache', 'local-plugins'],
    MARKDOWN_SECTION_FILE: undefined,
    MARKDOWN_SECTION_HEADING: undefined,
    MARKETPLACE_FILE: '.claude-plugin/marketplace.json',
    MARKETPLACE_SOURCE_FORMAT: 'prefixed',
    NATIVE_SKILLS_DIR: '.claude/skills',
    PLUGIN_MANIFEST_DIR: '.claude-plugin',
    RULES_MARKDOWN_FRONTMATTER: undefined,
    RULES_DIR: '.claude/rules',
    RULES_SYNC_MANIFEST: '.claude/.clankgsters-claude-sync.json',
    SETTINGS_FILE: '.claude/settings.json',
    get SETTINGS_MANIFEST_KEY() {
      return this.AGENT_NAME;
    },
    SKILLS_SYNC_ENABLED: true,
  },
} as const satisfies AgentPresetConfig;
