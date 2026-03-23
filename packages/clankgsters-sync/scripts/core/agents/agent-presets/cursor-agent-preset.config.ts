import type { AgentPresetConfig } from './agent-preset.config.js';

/** Cursor preset constants as a single source of truth. */
export const cursorAgentPresetConfig = {
  CONSTANTS: {
    AGENT_NAME: 'cursor',
    GITIGNORE_COMMENT: undefined,
    GITIGNORE_ENTRY: undefined,
    LOCAL_CONTENT_TARGET_ROOT: '.cursor',
    MARKDOWN_CONTEXT_TARGET_FILE_NAME: 'CURSOR.md',
    MARKDOWN_SECTION_FILE: undefined,
    MARKDOWN_SECTION_HEADING: undefined,
    MARKETPLACE_FILE: '.cursor/marketplace.json',
    MARKETPLACE_SOURCE_FORMAT: 'prefixed',
    NATIVE_SKILLS_DIR: '.cursor/skills',
    PLUGIN_MANIFEST_DIR: '.cursor-plugin',
    RULES_MARKDOWN_FRONTMATTER: '---\nalwaysApply: true\n---\n\n',
    RULES_DIR: '.cursor/rules',
    RULES_SYNC_MANIFEST: undefined,
    SETTINGS_FILE: '.cursor/settings.json',
    get SETTINGS_MANIFEST_KEY() {
      return this.AGENT_NAME;
    },
    SKILLS_SYNC_ENABLED: false,
  },
} as const satisfies AgentPresetConfig;
