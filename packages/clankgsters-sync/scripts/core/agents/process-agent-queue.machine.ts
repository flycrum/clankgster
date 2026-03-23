import { assign, createActor, fromPromise, setup } from 'xstate';
import { actorHelpers } from '../../common/actor-helpers.js';
import type { ClankConfig } from '../configs/schema/clank-config.schema.js';
import type { AgentQueueOutcome } from './agent-queue-outcome.js';
import { agentTypes, type ClankDefinedAgent } from './agent-types.js';
import {
  processAgentBehaviorsMachine,
  type ProcessAgentBehaviorsObservation,
} from './process-agent-behaviors.machine.js';

export interface ProcessAgentQueueMachineInput {
  mode: 'sync' | 'clear';
  onObservation?: (event: ProcessAgentBehaviorsObservation) => void;
  resolvedConfig: ClankConfig;
}

interface ProcessAgentQueueMachineContext {
  errorMessage: string | null;
  index: number;
  input: ProcessAgentQueueMachineInput;
  outcomes: AgentQueueOutcome[];
  queue: ClankDefinedAgent[];
}

type ProcessAgentQueueMachineEvent = { type: 'xstate.init' };

/**
 * Processes the agent queue: each entry in `resolvedConfig.agents` **in order**, one at a time (no overlap between agents).
 *
 * **Queue:** `agentTypes.buildQueue(resolvedConfig)` turns `resolvedConfig.agents` (named entries in
 * `clank.config` / `clank.local.config`, e.g. per–coding-agent front-ends) into a deterministic list. Each item
 * is handed to {@link processAgentBehaviorsMachine}, which runs that agent’s sync behaviors for the current `mode` (`sync` or
 * `clear`).
 *
 * **Orchestration:** Invoked by {@link syncRunMachine} after {@link configResolutionMachine} finishes. Output
 * (`AgentQueueOutcome[]`) becomes the run’s `outcomes` before manifest persistence.
 *
 * Invariants:
 * - Strictly sequential per-agent execution (pairs with {@link processAgentBehaviorsMachine}, which handles one agent).
 * - Output is per-agent outcomes concatenated in queue order.
 */
export const processAgentQueueMachine = setup({
  types: {
    context: {} as ProcessAgentQueueMachineContext,
    events: {} as ProcessAgentQueueMachineEvent,
    input: {} as ProcessAgentQueueMachineInput,
    output: {} as AgentQueueOutcome[],
  },
  actors: {
    runQueuedAgent: fromPromise(
      async ({
        input,
      }: {
        input: {
          mode: 'sync' | 'clear';
          onObservation?: (event: ProcessAgentBehaviorsObservation) => void;
          queueItem: ClankDefinedAgent;
        };
      }) => {
        const actor = createActor(processAgentBehaviorsMachine, {
          input: {
            agentName: input.queueItem.name,
            behaviors: input.queueItem.config.behaviors ?? [],
            enabled: input.queueItem.config.enabled ?? true,
            mode: input.mode,
            onObservation: input.onObservation,
          },
        });
        actor.start();
        const output = await actorHelpers.awaitOutput<
          | { behaviorOutcomes: unknown[]; outcome: AgentQueueOutcome }
          | {
              behaviorOutcomes: unknown[];
              input: { agentName: string };
              errorMessage: string | null;
            }
        >(actor);
        if ('outcome' in output) return output;
        return {
          behaviorOutcomes: output.behaviorOutcomes,
          outcome: {
            agent: output.input.agentName,
            success: output.errorMessage == null,
          },
        };
      }
    ),
  },
  guards: {
    hasQueueItems: ({ context }) => context.index < context.queue.length,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QEMYDsAusDKHVgFlkBjACwEs0wA6Cc2AB2QzIGIBtABgF1FQGA9rHIZyAtHxAAPRAEYA7ABZqneZwDM62QDYArJwCcsg4u0AaEAE9EAJhvrqB3epuybugBwHOnD-PUAvgEW+Jg4eDBEZJQ0dIzMbOyyvEgggsKi4pIyCArKqhpaeobGphbWCB7Kiga1SvK1NqYGgcEgoVi4+FEUVNQATgCuaACC6BisEOI0lABuAgDWNB3h3SS9NEOj4whzAsTMYmhc3CeS6SJH2bacNtSmhkqy6toNDYrlcuqc1Po+NtoXrJdAYvIogiFxqtIusYgNhmMwJhWGB+v0BP1qAwADbMABmGIAttQVl0YdE+ltEZhdmh5gdMsceGdUhdGdcELpdNpHNpDNpFC4mrpnp9cqZ7jp5G51PIPHoPDYgm00AIIHBJKSIoRYVRzkJLllUjkALTmKyIM0Q9pQsk6imxehMFikfUZK7GxCKGxilrUbTuTg6GryeR6JVtLVrB3w7ZIjBuw0ST0IF4ef1OTQ+Lz+b7qMWyRTKLwuRRKRSyWQeZzgyO27U9OFTPWsg3slNpjPOb6+Ay5jRijyyX4+TgC73qIweeXWqPkjbUPHIcjYyCJ9ugHLyVzUastTNqbQteQF17UQsuAxNatHzi6ZUBIA */
  id: 'processAgentQueueMachine',
  context: ({ input }) => ({
    errorMessage: null,
    index: 0,
    input,
    outcomes: [],
    queue: agentTypes.buildQueue(input.resolvedConfig),
  }),
  initial: 'dispatch',
  states: {
    dispatch: {
      always: [{ guard: 'hasQueueItems', target: 'processAgent' }, { target: 'done' }],
    },
    processAgent: {
      invoke: {
        src: 'runQueuedAgent',
        input: ({ context }) => ({
          mode: context.input.mode,
          onObservation: context.input.onObservation,
          queueItem: context.queue[context.index] as ClankDefinedAgent,
        }),
        onDone: {
          target: 'dispatch',
          actions: assign({
            index: ({ context }) => context.index + 1,
            outcomes: ({ context, event }) => [...context.outcomes, event.output.outcome],
          }),
        },
        onError: {
          target: 'failed',
          actions: assign({
            errorMessage: ({ event }) => String(event.error),
          }),
        },
      },
    },
    done: {
      type: 'final',
      output: ({ context }) => context.outcomes,
    },
    failed: {
      type: 'final',
      output: ({ context }) => context.outcomes,
    },
  },
});
