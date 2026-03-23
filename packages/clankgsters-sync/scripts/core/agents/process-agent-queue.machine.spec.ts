import { describe, expect, test } from 'vite-plus/test';
import { createActor } from 'xstate';
import { actorHelpers } from '../../common/actor-helpers.js';
import { processAgentQueueMachine } from './process-agent-queue.machine.js';

describe('processAgentQueueMachine', () => {
  test('runs configured agents in order', async () => {
    const actor = createActor(processAgentQueueMachine, {
      input: {
        mode: 'sync',
        resolvedConfig: {
          loggingEnabled: false,
          agents: {
            cursor: { enabled: true, behaviors: ['rules'] },
          },
          excluded: [],
          syncManifestPath: '.clankgsters/sync-manifest.json',
        },
      },
    });
    actor.start();
    const output = await actorHelpers.awaitOutput<
      | Array<{ agent: string; success: boolean }>
      | { outcomes: Array<{ agent: string; success: boolean }> }
    >(actor);
    const outcomes = Array.isArray(output) ? output : output.outcomes;
    expect(outcomes).toHaveLength(1);
    expect(outcomes[0]?.agent).toBe('cursor');
  });
});
