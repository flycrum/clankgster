import type { ClankAgentConfig } from '../configs/schema/clank-config.schema.js';

/**
 * Default preset definitions for common coding agents.
 *
 * Invariants:
 * - Keep behaviors declarative and ordered.
 * - Presets should be overridable by config layers.
 */
export const agentPresets = {
  claude: {
    enabled: true,
    behaviors: ['rules', 'commands', 'skills'],
  },
  cursor: {
    enabled: true,
    behaviors: ['rules', 'commands', 'skills'],
  },
  codex: {
    enabled: true,
    behaviors: ['rules', 'commands', 'skills'],
  },
} satisfies Record<string, ClankAgentConfig>;
