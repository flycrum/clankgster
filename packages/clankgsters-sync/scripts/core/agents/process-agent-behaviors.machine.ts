import { assign, createActor, fromPromise, setup } from 'xstate';
import { actorHelpers } from '../../common/actor-helpers.js';
import type {
  ClankgstersBehaviorConfig,
  ClankgstersConfig,
} from '../configs/clankgsters-config.schema.js';
import type { DiscoveredMarketplace } from '../run/sync-discover-agents.js';
import type { SyncManifestEntry } from '../run/sync-manifest.js';
import type { SyncBehaviorOutcome } from '../sync-behaviors/behavior-outcome.js';
import {
  perBehaviorMachine,
  type PerBehaviorObservation,
} from '../sync-behaviors/per-behavior.machine.js';
import { agentAdapterBase } from './agent-adapter-base.js';
import type { AgentQueueOutcome } from './agent-queue-outcome.js';

export interface ProcessAgentBehaviorsObservation {
  agentName: string;
  eventName: string;
  payload?: Record<string, unknown>;
}

export interface ProcessAgentBehaviorsMachineInput {
  agentName: string;
  behaviors: ClankgstersBehaviorConfig[];
  discoveredMarketplaces: DiscoveredMarketplace[];
  enabled: boolean;
  excluded: string[];
  manifestByBehavior: Record<string, SyncManifestEntry>;
  mode: 'sync' | 'clear';
  onObservation?: (event: ProcessAgentBehaviorsObservation | PerBehaviorObservation) => void;
  outputRoot: string;
  registerManifestEntry: (
    agentName: string,
    behaviorManifestKey: string,
    entry: SyncManifestEntry
  ) => void;
  repoRoot: string;
  resolvedConfig: ClankgstersConfig;
  sharedState: Map<string, unknown>;
}

interface ProcessAgentBehaviorsMachineContext {
  behaviorOutcomes: SyncBehaviorOutcome[];
  errorMessage: string | null;
  index: number;
  input: ProcessAgentBehaviorsMachineInput;
}

type ProcessAgentBehaviorsMachineEvent = { type: 'xstate.init' };

function emitObservation(
  input: ProcessAgentBehaviorsMachineInput,
  eventName: string,
  payload?: Record<string, unknown>
): void {
  input.onObservation?.({
    agentName: input.agentName,
    eventName,
    payload,
  });
}

/**
 * Processes one agent’s sync lifecycle: adapter hooks, then each configured behavior in order via
 * {@link perBehaviorMachine} child actors.
 *
 * Invariants:
 * - Behavior order is deterministic.
 * - Each behavior runs as its own child actor (`perBehaviorMachine`).
 * - Adapter lifecycle runs before the behavior loop.
 */
export const processAgentBehaviorsMachine = setup({
  types: {
    context: {} as ProcessAgentBehaviorsMachineContext,
    events: {} as ProcessAgentBehaviorsMachineEvent,
    input: {} as ProcessAgentBehaviorsMachineInput,
    output: {} as { behaviorOutcomes: SyncBehaviorOutcome[]; outcome: AgentQueueOutcome },
  },
  actors: {
    runAdapterLifecycle: fromPromise(
      async ({ input }: { input: ProcessAgentBehaviorsMachineInput }) => {
        emitObservation(input, 'agent.createAdapter');
        const adapter = agentAdapterBase.create();
        const result = adapter.runLifecycle({
          agentName: input.agentName,
          mode: input.mode,
        });
        if (result.isErr()) throw result.error;
      }
    ),
    runQueuedBehavior: fromPromise(
      async ({
        input,
      }: {
        input: {
          behavior: ClankgstersBehaviorConfig;
          behaviorsInput: ProcessAgentBehaviorsMachineInput;
        };
      }) => {
        emitObservation(input.behaviorsInput, 'agent.runBehavior', {
          behaviorName: input.behavior.name,
        });
        const behaviorManifestKey = input.behavior.manifestKey ?? input.behavior.name;
        const actor = createActor(perBehaviorMachine, {
          input: {
            agentName: input.behaviorsInput.agentName,
            behavior: input.behavior,
            discoveredMarketplaces: input.behaviorsInput.discoveredMarketplaces,
            excluded: input.behaviorsInput.excluded,
            manifestEntry: input.behaviorsInput.manifestByBehavior[behaviorManifestKey],
            mode: input.behaviorsInput.mode,
            onObservation: input.behaviorsInput.onObservation,
            outputRoot: input.behaviorsInput.outputRoot,
            registerManifestEntry: input.behaviorsInput.registerManifestEntry,
            repoRoot: input.behaviorsInput.repoRoot,
            resolvedConfig: input.behaviorsInput.resolvedConfig,
            sharedState: input.behaviorsInput.sharedState,
          },
        });
        actor.start();
        const output = await actorHelpers.awaitOutput<
          | SyncBehaviorOutcome
          | { input: { agentName: string; behaviorName: string }; errorMessage: string | null }
        >(actor);
        if ('success' in output) return output;
        return {
          agent: output.input.agentName,
          behavior: output.input.behaviorName,
          success: output.errorMessage == null,
        };
      }
    ),
  },
  guards: {
    hasMoreBehaviors: ({ context }) => context.index < context.input.behaviors.length,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAcwCcCCMB2AXAsgIYDGAFgJbZgB0xaYhuYGEhyTaAxBAPZXWUAbjwDWNVJhwESFfnQZMWbDgiE9ijcnwDaABgC6e-YhQ9Y5XFuwmQAD0QAmAOy7qARgBsAFl0AOB55e3r4eADQgAJ6Ibk4ArNS6Tr6Jbroebr6+ngC+2eESWGB4RGSUNPKMzKzs6JzoaDxo1MgANowAZo0Ats3ohcUyZbT0lUo1aKrYwhqWOgZGNshmFlY29gjOroF+Ad7BYZGIWdReAJznWQ4OHqdOqQDMufl9UiWyNABGYKSEglpoABFyLBkIwyJwFkgQEtzLNrFD1pt3N4doF9uEogh7p53LF0njfF47rpYo88tCXkVpKV+F8fn9GkCQWDSBC3MYoTCVnw1ogPE57tR7nESQ4vL44qcvG4MYhsR5cfiPITiaSnhTJFS3kM0ABXbAAIW+v3+3D4NDUYl6moGNJoesNxoZEzUMysRkhplhqwRjhcyJ8-jR4oOmPuHgcircsSuvlObjObjJzxt1Pe1AdRvppvqjWabVwnTQPQKr0G-EzTv+k2mmjmhgMi2WcN5G392yDexDso2V2osSSaRcbgCUqcuXJ2B4EDgi0ptveTe9PN9CAAtKHEBv1aWteXyiNFNUOEvufDQOsvA4e1LqA447p7g48R5Hx4Bzv52mhnSTYzgaCuBkKeLarmcgpBLotwjmKTj8vcPbYl4JxpNGr4qroSafqm2oVvqWZ-mgIE+heiCxK4DiPjBUoZF4sRxj2YqCk4V5uJ4LH0QOLHYf0378LwVDESupEIL49y+P2IS6LodEhPcpwIYcWJJlGHjCtJ5F3DxZZ2tQ7SEOQLSQEJ552Ig4EnK+0FXES8E9qkpzUKcsR4qcmTnPcQQOBO2RAA */
  id: 'processAgentBehaviorsMachine',
  context: ({ input }) => ({
    behaviorOutcomes: [],
    errorMessage: null,
    index: 0,
    input,
  }),
  initial: 'adapterLifecycle',
  states: {
    adapterLifecycle: {
      invoke: {
        src: 'runAdapterLifecycle',
        input: ({ context }) => context.input,
        onDone: {
          target: 'behaviorDispatch',
        },
        onError: {
          target: 'failed',
          actions: assign({
            errorMessage: ({ event }) => String(event.error),
          }),
        },
      },
    },
    behaviorDispatch: {
      always: [{ guard: 'hasMoreBehaviors', target: 'processBehavior' }, { target: 'done' }],
    },
    processBehavior: {
      invoke: {
        src: 'runQueuedBehavior',
        input: ({ context }) => ({
          behavior: context.input.behaviors[context.index] as ClankgstersBehaviorConfig,
          behaviorsInput: context.input,
        }),
        onDone: {
          target: 'behaviorDispatch',
          actions: assign({
            behaviorOutcomes: ({ context, event }) => [...context.behaviorOutcomes, event.output],
            index: ({ context }) => context.index + 1,
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
      output: ({ context }) => ({
        behaviorOutcomes: context.behaviorOutcomes,
        outcome: {
          agent: context.input.agentName,
          success: true,
        },
      }),
    },
    failed: {
      type: 'final',
      output: ({ context }) => ({
        behaviorOutcomes: context.behaviorOutcomes,
        outcome: {
          agent: context.input.agentName,
          success: false,
        },
      }),
    },
  },
});
