import type { Result } from 'neverthrow';
import { assign, fromPromise, setup } from 'xstate';
import { clankLogger } from '../../common/logger.js';
import type {
  ClankgstersBehaviorConfig,
  ClankgstersConfig,
} from '../configs/clankgsters-config.schema.js';
import type { DiscoveredMarketplace } from '../run/sync-discover-agents.js';
import type { SyncManifestEntry } from '../run/sync-manifest.js';
import type { SyncBehaviorOutcome } from './behavior-outcome.js';
import {
  SyncBehaviorBase,
  syncBehaviorBase,
  type RegisterBehaviorManifestEntry,
  type SyncBehaviorRunContext,
} from './sync-behavior-base.js';
import { syncBehaviorRegistry } from './sync-behavior-registry.js';

export interface PerBehaviorObservation {
  agentName: string;
  behaviorName: string;
  eventName: string;
}

export interface PerBehaviorMachineInput {
  agentName: string;
  behavior: ClankgstersBehaviorConfig;
  discoveredMarketplaces: DiscoveredMarketplace[];
  excluded: string[];
  manifestEntry?: SyncManifestEntry;
  mode: 'sync' | 'clear';
  onObservation?: (event: PerBehaviorObservation) => void;
  outputRoot: string;
  registerManifestEntry: RegisterBehaviorManifestEntry;
  repoRoot: string;
  resolvedConfig: ClankgstersConfig;
  sharedState: Map<string, unknown>;
}

interface PerBehaviorMachineContext {
  errorMessage: string | null;
  input: PerBehaviorMachineInput;
}

type PerBehaviorMachineEvent = { type: 'xstate.init' };

function observe(
  input: PerBehaviorMachineInput,
  eventName: string,
  logger = clankLogger.getLogger()
): void {
  logger.debug(
    { agent: input.agentName, behavior: input.behavior.name, eventName },
    'behavior stage'
  );
  input.onObservation?.({
    agentName: input.agentName,
    behaviorName: input.behavior.name,
    eventName,
  });
}

function runHook(
  input: PerBehaviorMachineInput,
  hook: (behavior: SyncBehaviorBase, context: SyncBehaviorRunContext) => Result<void, Error>
): void {
  const behaviorClass = syncBehaviorRegistry.resolve(input.behavior.name);
  if (behaviorClass == null) throw new Error(`unknown behavior: ${input.behavior.name}`);
  const behavior = syncBehaviorBase.create(behaviorClass);
  const context: SyncBehaviorRunContext = {
    agentName: input.agentName,
    behavior: input.behavior,
    discoveredMarketplaces: input.discoveredMarketplaces,
    excluded: input.excluded,
    manifestEntry: input.manifestEntry,
    mode: input.mode,
    outputRoot: input.outputRoot,
    registerManifestEntry: input.registerManifestEntry,
    repoRoot: input.repoRoot,
    resolvedConfig: input.resolvedConfig,
    sharedState: input.sharedState,
  };
  const result = hook(behavior, context);
  if (result.isErr()) throw result.error;
}

export const perBehaviorMachine = setup({
  types: {
    context: {} as PerBehaviorMachineContext,
    events: {} as PerBehaviorMachineEvent,
    input: {} as PerBehaviorMachineInput,
    output: {} as SyncBehaviorOutcome,
  },
  actors: {
    syncSetup: fromPromise(async ({ input }: { input: PerBehaviorMachineInput }) => {
      observe(input, 'syncSetup');
      runHook(input, (behavior, context) => behavior.syncSetupBefore(context));
    }),
    syncRun: fromPromise(async ({ input }: { input: PerBehaviorMachineInput }) => {
      observe(input, 'syncRun');
      runHook(input, (behavior, context) => behavior.syncRun(context));
    }),
    syncTeardown: fromPromise(async ({ input }: { input: PerBehaviorMachineInput }) => {
      observe(input, 'syncTeardown');
      runHook(input, (behavior, context) => behavior.syncTeardownAfter(context));
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAcwCcBCYAWBDAbgJYD2aAsrgMbaEB2YAdLAJ62UDKYALgK7IDEEYvQZ18xANaNUmHARLkqNESzadeyBGOKVcXErQDaABgC6J04hTFYhfcKsgAHogBMAZgAcDAGwBGAHY-AE5PVx9XAFYAFgiAGhBmNzCGV2N3Pz9jMMiAgJ8AXwKEmSw8IlIKajpGVQ5uPn50NFIGZAAbPQAzUgBbNvQy+UqlGqZWeo0tWnFdeyMzC0dkGzsDRxcED29-INDwqNjXBKSEaL9IhgD042DoyMjggMifdyKSwbkKxWqVCYAlHi0QTCRjaKQDWTlBRVZS1AFA6azPQGCxLJAgFa2eYbRCPAKpcKPDLuHwvXInRB+dzBBhPMmk4zGALuaLuVzvTGfaEjX7wtiA4HNVodbp9SFDb6wsZ1QVInQo4RoszLVY4jGbfGEsnBElkskBSlbFkMaL5SLs2LRVzRYIc4pcqHDH5w8ZsAAqYFwaCEAHdgUIRODpNzndK-h6vT7iP75XNUYsVRisWsHBrEE9aTTPLamT5bgFQkbPO4rrbgnbop5gn4fKE-JzSl8YaMI5RPd6-UK0C00G1Olwemh+k2eS6ZRMO9HY9p40rE5Zk2r1umEJmGNnc8Z85nPEbqX5UuXrqTPAFrdkig7aMQIHBlqGpa2wKrsSvQJsALQ+I2fy4VgDAMAwtG0fFs+TdSY+FfVNaFxM5jkSRAaVpO1gh8PIzRzTwMNAp0nwg2UgRg9UP0Qc5SzSDJoliC1nhidwjSiAkT0yC0wkzQoHVHMNn0gqcuxI99nEQZ5aVcPwz2rc9PHSYJ9wuU1zWMDxglyOtgjwyVwNdQMXyXN80zIhBMjyBgYjrVxq3zLx0OLQ9y1CXUfBoqzSS05teVdLpcEIdpICEoyRJMwICQsu1rPSaymLuVJ0iyG01NcKzPCvAogA */
  id: 'perBehaviorMachine',
  context: ({ input }) => ({
    errorMessage: null,
    input,
  }),
  initial: 'syncSetup',
  states: {
    syncSetup: {
      invoke: {
        src: 'syncSetup',
        input: ({ context }) => context.input,
        onDone: { target: 'syncRun' },
        onError: {
          target: 'failed',
          actions: assign({
            errorMessage: ({ event }) => String(event.error),
          }),
        },
      },
    },
    syncRun: {
      invoke: {
        src: 'syncRun',
        input: ({ context }) => context.input,
        onDone: { target: 'syncTeardown' },
        onError: {
          target: 'failed',
          actions: assign({
            errorMessage: ({ event }) => String(event.error),
          }),
        },
      },
    },
    syncTeardown: {
      invoke: {
        src: 'syncTeardown',
        input: ({ context }) => context.input,
        onDone: { target: 'done' },
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
        agent: context.input.agentName,
        behavior: context.input.behavior.name,
        success: true,
      }),
    },
    failed: {
      type: 'final',
      output: ({ context }) => ({
        agent: context.input.agentName,
        behavior: context.input.behavior.name,
        success: false,
      }),
    },
  },
});
