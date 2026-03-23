import { describe, expect, test } from 'vite-plus/test';
import { createActor } from 'xstate';
import { actorHelpers } from '../../common/actor-helpers.js';
import { processAgentBehaviorsMachine } from './process-agent-behaviors.machine.js';

describe('processAgentBehaviorsMachine', () => {
  test('invokes perBehavior machine for each behavior', async () => {
    const actor = createActor(processAgentBehaviorsMachine, {
      input: {
        agentName: 'cursor',
        behaviors: ['rules', 'commands'],
        enabled: true,
        mode: 'sync',
      },
    });
    actor.start();
    const output = await actorHelpers.awaitOutput<{
      errorMessage?: string | null;
      input?: { agentName: string };
      behaviorOutcomes: { success: boolean }[];
      outcome: { agent: string; success: boolean };
    }>(actor);
    const outcome = output.outcome ?? {
      agent: output.input?.agentName ?? 'unknown',
      success: output.errorMessage == null,
    };
    expect(outcome.success).toBe(true);
    expect(output.behaviorOutcomes).toHaveLength(2);
  });
});
