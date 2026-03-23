import { describe, expect, test } from 'vite-plus/test';
import { createActor } from 'xstate';
import { actorHelpers } from '../../common/actor-helpers.js';
import { syncRunMachine } from './sync-run.machine.js';

describe('syncRunMachine', () => {
  test('completes sync mode', async () => {
    const actor = createActor(syncRunMachine, {
      input: {
        mode: 'sync',
        repoRoot: process.cwd(),
      },
    });
    actor.start();
    const output = await actorHelpers.awaitOutput<{
      errorMessage: string | null;
      outcomes: { agent: string; success: boolean }[];
      success: boolean;
    }>(actor);
    const success = output.success ?? output.errorMessage == null;
    expect(success).toBe(true);
  });

  test('completes clear mode', async () => {
    const actor = createActor(syncRunMachine, {
      input: {
        mode: 'clear',
        repoRoot: process.cwd(),
      },
    });
    actor.start();
    const output = await actorHelpers.awaitOutput<{
      errorMessage: string | null;
      outcomes: { agent: string; success: boolean }[];
      success: boolean;
    }>(actor);
    const success = output.success ?? output.errorMessage == null;
    expect(success).toBe(true);
  });
});
