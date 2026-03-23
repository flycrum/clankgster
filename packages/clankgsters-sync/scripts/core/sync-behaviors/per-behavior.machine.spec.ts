import { describe, expect, test } from 'vite-plus/test';
import { createActor } from 'xstate';
import { actorHelpers } from '../../common/actor-helpers.js';
import { perBehaviorMachine } from './per-behavior.machine.js';

describe('perBehaviorMachine', () => {
  test('reaches done and returns success output', async () => {
    const actor = createActor(perBehaviorMachine, {
      input: {
        agentName: 'cursor',
        behaviorName: 'rules',
        mode: 'sync',
      },
    });
    actor.start();
    const output = await actorHelpers.awaitOutput<{
      errorMessage?: string | null;
      input?: { behaviorName: string };
      agent: string;
      behavior: string;
      success: boolean;
    }>(actor);
    const success = output.success ?? output.errorMessage == null;
    const behavior = output.behavior ?? output.input?.behaviorName;
    expect(success).toBe(true);
    expect(behavior).toBe('rules');
  });
});
