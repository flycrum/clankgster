/** Result of executing one sync behavior for an agent (e.g. rules, commands). */
export interface BehaviorOutcome {
  /** Agent name this behavior belongs to. */
  agent: string;
  /** Behavior id (e.g. `rules`, `commands`). */
  behavior: string;
  /** Whether this behavior’s machine finished without a terminal failure. */
  success: boolean;
}
