import type {
  ClankgstersAgentConfig,
  ClankgstersConfig,
} from '../configs/clankgsters-config.schema.js';

/**
 * Defines agent queue shape consumed by `processAgentQueueMachine` and `processAgentBehaviorsMachine`.
 *
 * Invariants:
 * - Queue construction must stay deterministic (`Object.entries` order from resolved config object).
 */

export interface ClankgstersDefinedAgent {
  config: ClankgstersAgentConfig;
  name: string;
}

function toDefinedAgent(name: string, config: ClankgstersAgentConfig): ClankgstersDefinedAgent {
  return { name, config };
}

export const agentTypes = {
  /** Builds the agent queue from the resolved config object. */
  buildQueue(config: ClankgstersConfig): ClankgstersDefinedAgent[] {
    return Object.entries(config.agents).map(([name, agentConfig]) =>
      toDefinedAgent(name, agentConfig)
    );
  },
};
