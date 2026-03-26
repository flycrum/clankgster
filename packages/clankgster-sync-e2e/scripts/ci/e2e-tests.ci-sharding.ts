import type { E2eTestCasePaths } from '../../src/common/e2e-path-helpers.js';

export interface E2eTestsCiShardSelection {
  shardCount: number;
  shardIndex: number;
}

/**
 * CI-oriented shard selection and deterministic case partitioning for the e2e harness.
 *
 * Why this exists:
 * - CI should go red early when one shard fails, but still let other shards finish for broader diagnostics
 * - Matrix fan-out in GitHub Actions needs stable, repeatable shard math across runners
 * - Harness logic should stay focused on execution/reporting, not environment parsing rules
 *
 * Design notes:
 * - Uses 1-based shard indexes (`1..N`) because GitHub matrix values are easiest to reason about that way
 * - Defaults to single-shard mode when env vars are absent, so local runs behave like before
 * - Uses index modulo partitioning to keep case assignment deterministic across runs
 *
 * CI wiring lives in {@link ../../../../.github/workflows/ci.yml}.
 */
export const e2eTestsCiSharding = {
  /**
   * Resolves shard settings from process env and validates that both values are present and coherent.
   *
   * Expected env vars:
   * - `CLANKGSTER_E2E_SHARD_COUNT`: total number of CI shards
   * - `CLANKGSTER_E2E_SHARD_INDEX`: current shard index (1-based)
   *
   * Behavior:
   * - If either variable is missing/empty, returns `{ shardCount: 1, shardIndex: 1 }`
   * - Throws with explicit messages for non-numeric or out-of-range values
   */
  resolveFromEnv(env: NodeJS.ProcessEnv): E2eTestsCiShardSelection {
    const rawCount = env.CLANKGSTER_E2E_SHARD_COUNT;
    const rawIndex = env.CLANKGSTER_E2E_SHARD_INDEX;
    if (rawCount == null || rawCount.length === 0 || rawIndex == null || rawIndex.length === 0) {
      return { shardCount: 1, shardIndex: 1 };
    }

    const parsedCount = Number.parseInt(rawCount, 10);
    const parsedIndex = Number.parseInt(rawIndex, 10);
    if (!Number.isFinite(parsedCount) || !Number.isFinite(parsedIndex)) {
      throw new Error(
        `Invalid shard values CLANKGSTER_E2E_SHARD_COUNT='${rawCount}' CLANKGSTER_E2E_SHARD_INDEX='${rawIndex}'`
      );
    }
    if (parsedCount < 1) {
      throw new Error(`CLANKGSTER_E2E_SHARD_COUNT must be >= 1, received '${rawCount}'`);
    }
    if (parsedIndex < 1 || parsedIndex > parsedCount) {
      throw new Error(
        `CLANKGSTER_E2E_SHARD_INDEX must be within 1..${parsedCount}, received '${rawIndex}'`
      );
    }
    return { shardCount: parsedCount, shardIndex: parsedIndex };
  },

  /** Deterministically selects the subset of discovered cases assigned to one shard. */
  filterCases(cases: E2eTestCasePaths[], selection: E2eTestsCiShardSelection): E2eTestCasePaths[] {
    return cases.filter((_, index) => index % selection.shardCount === selection.shardIndex - 1);
  },
} as const;
