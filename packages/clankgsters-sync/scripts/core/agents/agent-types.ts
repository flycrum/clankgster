import type { ClankAgentConfig, ClankConfig } from '../configs/schema/clank-config.schema.js';

/**
 * Defines agent queue shape consumed by `processAgentQueueMachine` and `processAgentBehaviorsMachine`.
 *
 * Invariants:
 * - Queue construction must stay deterministic (`Object.entries` order from resolved config object).
 */

export interface ClankDefinedAgent {
  config: ClankAgentConfig;
  name: string;
}

function toDefinedAgent(name: string, config: ClankAgentConfig): ClankDefinedAgent {
  return { name, config };
}

export const agentTypes = {
  /** Builds the agent queue from the resolved config object. */
  buildQueue(config: ClankConfig): ClankDefinedAgent[] {
    return Object.entries(config.agents).map(([name, agentConfig]) =>
      toDefinedAgent(name, agentConfig)
    );
  },
};
