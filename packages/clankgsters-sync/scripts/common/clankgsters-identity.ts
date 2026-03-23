/**
 * Canonical public identifiers for the clankgsters sync package and artifacts it writes.
 *
 * Import this module instead of inlining `clankgsters-sync` so renames stay consistent.
 */
export const clankgstersIdentity = {
  /**
   * `name` field in generated local marketplace JSON (e.g. `.claude-plugin/marketplace.json`).
   * Matches the published CLI binary name (`package.json` → `bin`).
   */
  LOCAL_MARKETPLACE_NAME: 'clankgsters-sync',

  /**
   * Token in e2e expected-manifest JSON; {@link clankgstersIdentity.resolveFixtureStrings} substitutes {@link LOCAL_MARKETPLACE_NAME}.
   */
  LOCAL_MARKETPLACE_NAME_FIXTURE_PLACEHOLDER: '__CLANKGSTERS_LOCAL_MARKETPLACE_NAME__',

  /** Deep-replaces {@link LOCAL_MARKETPLACE_NAME_FIXTURE_PLACEHOLDER} in string leaves (e2e manifest fixtures). */
  resolveFixtureStrings(value: unknown): unknown {
    if (typeof value === 'string') {
      return value.replaceAll(
        clankgstersIdentity.LOCAL_MARKETPLACE_NAME_FIXTURE_PLACEHOLDER,
        clankgstersIdentity.LOCAL_MARKETPLACE_NAME
      );
    }
    if (Array.isArray(value)) {
      return value.map((item) => clankgstersIdentity.resolveFixtureStrings(item));
    }
    if (value !== null && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([key, val]) => [
          key,
          clankgstersIdentity.resolveFixtureStrings(val),
        ])
      );
    }
    return value;
  },
} as const;
