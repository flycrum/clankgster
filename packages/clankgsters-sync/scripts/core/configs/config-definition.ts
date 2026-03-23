import type { ClankConfig } from "./schema/clank-config.schema.js";

/** Typed helper surface for authoring `ClankConfig` in code. */
export const clankConfigDefinition = {
  /**
   * Tiny typed helper for authoring config objects and future composable config factories.
   *
   * Invariants:
   * - Keep runtime behavior simple (identity function).
   * - Type guidance should track schema evolution.
   */
  defineClankConfig(config: Partial<ClankConfig>): Partial<ClankConfig> {
    return config;
  },
};
