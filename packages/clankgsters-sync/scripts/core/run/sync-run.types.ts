import type { AgentQueueOutcome } from '../agents/agent-queue-outcome.js';
import type { ClankConfig } from '../configs/schema/clank-config.schema.js';

export interface SyncRunObservationEvent {
  /** Stable hook name for logging or tests (e.g. `sync.boot`). */
  eventName: string;
  /** Optional structured detail for the observation. */
  payload?: Record<string, unknown>;
}

export interface SyncRunMachineInput {
  /** Top-level sync or clear mode for the run. */
  mode: 'sync' | 'clear';
  /** Optional callback for lifecycle / diagnostic events from the machine. */
  onObservation?: (event: SyncRunObservationEvent) => void;
  /** Repository root passed into config resolution and downstream machines. */
  repoRoot: string;
}

export interface SyncRunMachineContext {
  /** Populated when the run fails before a clean terminal success path. */
  errorMessage: string | null;
  /** Original machine input (mode, repo root, observers). */
  input: SyncRunMachineInput;
  /** Per-agent results after the agent queue stage completes. */
  outcomes: AgentQueueOutcome[];
  /** Merged config after resolution, or `null` until resolution finishes. */
  resolvedConfig: ClankConfig | null;
}

export type SyncRunMachineEvent = { type: 'xstate.init' };
