/**
 * Single source for discovery walk logging in `sync-source-layouts.config.ts`.
 * Logs are directory-only; a line is emitted when depth is shallow enough or the visit was slow enough.
 */
export const syncSourceLayoutDiscoveryLog = {
  CAN_LOG_MAX_DEPTH: 2,
  CAN_LOG_MAX_EXECUTION_MS: 20,
} as const;
