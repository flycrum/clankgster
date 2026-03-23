import { assign, createActor, fromPromise, setup } from 'xstate';
import { processAgentQueueMachine } from '../agents/process-agent-queue.machine.js';
import { configResolutionMachine } from '../configs/config-resolution.machine.js';
import { actorHelpers } from '../../common/actor-helpers.js';
import { clankLogger } from '../../common/logger.js';
import { syncDiscover } from './sync-discover-agents.js';
import { syncManifest } from './sync-manifest.js';
import type { AgentQueueOutcome } from '../agents/agent-queue-outcome.js';
import type {
  SyncRunMachineContext,
  SyncRunMachineEvent,
  SyncRunMachineInput,
} from './sync-run.types.js';

function observe(
  input: SyncRunMachineInput,
  eventName: string,
  payload?: Record<string, unknown>
): void {
  input.onObservation?.({ eventName, payload });
}

export const syncRunMachine = setup({
  types: {
    context: {} as SyncRunMachineContext,
    events: {} as SyncRunMachineEvent,
    input: {} as SyncRunMachineInput,
    output: {} as { errorMessage: string | null; outcomes: AgentQueueOutcome[]; success: boolean },
  },
  actors: {
    resolveConfigActor: fromPromise(
      async ({ input }: { input: { mode: 'sync' | 'clear'; repoRoot: string } }) => {
        const actor = createActor(configResolutionMachine, { input });
        actor.start();
        const output = await actorHelpers.awaitOutput<
          | {
              mergedConfig: Record<string, unknown>;
              resolvedConfig: NonNullable<SyncRunMachineContext['resolvedConfig']>;
              sourcesLoaded: string[];
            }
          | {
              details: {
                resolvedConfig: NonNullable<SyncRunMachineContext['resolvedConfig']>;
                sourcesLoaded: string[];
              };
            }
        >(actor);
        if ('resolvedConfig' in output) return output;
        return output.details;
      }
    ),
    runAgentsActor: fromPromise(
      async ({
        input,
      }: {
        input: {
          mode: 'sync' | 'clear';
          resolvedConfig: NonNullable<SyncRunMachineContext['resolvedConfig']>;
        };
      }) => {
        const actor = createActor(processAgentQueueMachine, { input });
        actor.start();
        const output = await actorHelpers.awaitOutput<
          AgentQueueOutcome[] | { outcomes: AgentQueueOutcome[] }
        >(actor);
        if (Array.isArray(output)) return output;
        return output.outcomes;
      }
    ),
  },
  actions: {
    initializeLogger: ({ context }) => {
      clankLogger.setLoggerContext({
        repoRoot: context.input.repoRoot,
      });
      observe(context.input, 'sync.boot');
    },
    persistManifestStub: ({ context }) => {
      if (context.resolvedConfig == null) return;
      const syncDiscoverResult = syncDiscover.discoverAgents();
      if (syncDiscoverResult.isErr()) {
        clankLogger.getLogger().error({ error: syncDiscoverResult.error }, 'syncDiscover failed');
        return;
      }

      const manifestPath = syncManifest.getManifestPath(
        context.input.repoRoot,
        context.resolvedConfig.syncManifestPath
      );
      const manifestResult = syncManifest.load(manifestPath);
      if (manifestResult.isErr()) {
        clankLogger.getLogger().error({ error: manifestResult.error }, 'manifest load failed');
        return;
      }
      const writeResult = syncManifest.write(manifestPath, manifestResult.value);
      if (writeResult.isErr()) {
        clankLogger.getLogger().error({ error: writeResult.error }, 'manifest write failed');
      }
      observe(context.input, 'sync.persistManifest', { manifestPath });
    },
  },
}).createMachine({
  id: 'syncRunMachine',
  context: ({ input }) => ({
    errorMessage: null,
    input,
    outcomes: [],
    resolvedConfig: null,
  }),
  initial: 'boot',
  states: {
    boot: {
      entry: 'initializeLogger',
      always: {
        target: 'resolveConfig',
      },
    },
    resolveConfig: {
      invoke: {
        src: 'resolveConfigActor',
        input: ({ context }) => ({
          mode: context.input.mode,
          repoRoot: context.input.repoRoot,
        }),
        onDone: {
          target: 'runAgents',
          actions: [
            assign({
              resolvedConfig: ({ event }) =>
                (
                  event.output as {
                    resolvedConfig: NonNullable<SyncRunMachineContext['resolvedConfig']>;
                  }
                ).resolvedConfig,
            }),
            ({ context, event }) => {
              const output = event.output as {
                resolvedConfig: NonNullable<SyncRunMachineContext['resolvedConfig']>;
                sourcesLoaded: string[];
              };
              clankLogger.setLoggerContext({
                loggingEnabled: output.resolvedConfig.loggingEnabled,
                outputRoot: output.resolvedConfig.syncOutputRoot,
                repoRoot: context.input.repoRoot,
              });
              clankLogger.getLogger().info({ sources: output.sourcesLoaded }, 'config resolved');
              observe(context.input, 'sync.configResolved', {
                sourcesLoaded: output.sourcesLoaded,
              });
            },
          ],
        },
        onError: {
          target: 'failed',
          actions: assign({
            errorMessage: ({ event }) => String(event.error),
          }),
        },
      },
    },
    runAgents: {
      invoke: {
        src: 'runAgentsActor',
        input: ({ context }) => ({
          mode: context.input.mode,
          resolvedConfig: context.resolvedConfig as NonNullable<
            SyncRunMachineContext['resolvedConfig']
          >,
        }),
        onDone: {
          target: 'persistManifest',
          actions: assign({
            outcomes: ({ event }) => event.output as AgentQueueOutcome[],
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
    persistManifest: {
      entry: 'persistManifestStub',
      always: {
        target: 'done',
      },
    },
    done: {
      type: 'final',
      output: ({ context }) => ({
        errorMessage: null,
        outcomes: context.outcomes,
        success: true,
      }),
    },
    failed: {
      type: 'final',
      output: ({ context }) => ({
        errorMessage: context.errorMessage,
        outcomes: context.outcomes,
        success: false,
      }),
    },
  },
});
