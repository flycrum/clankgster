import { ok, type Result } from 'neverthrow';

export interface SyncBehaviorRunContext {
  agentName: string;
  behaviorName: string;
  mode: 'sync' | 'clear';
}

export class SyncBehaviorBase {
  /** Runs once before `syncRun` for this behavior (defaults to no-op `ok`). */
  syncSetupBefore(_context: SyncBehaviorRunContext): Result<void, Error> {
    return ok(undefined);
  }

  /** Main work for this `(agentName, behaviorName)` pair (defaults to no-op `ok`). */
  syncRun(_context: SyncBehaviorRunContext): Result<void, Error> {
    return ok(undefined);
  }

  /** Runs once after `syncRun` (defaults to no-op `ok`). */
  syncTeardownAfter(_context: SyncBehaviorRunContext): Result<void, Error> {
    return ok(undefined);
  }
}

export const syncBehaviorBase = {
  /** Returns a fresh `SyncBehaviorBase` instance. */
  create(): SyncBehaviorBase {
    return new SyncBehaviorBase();
  },
};
