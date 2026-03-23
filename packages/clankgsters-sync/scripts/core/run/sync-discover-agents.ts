import { ok, type Result } from "neverthrow";

/**
 * Stub discovery surface for future plugin/agent scans (wired from the sync-run machine).
 *
 * Invariants:
 * - Return shape stays stable while implementation is a no-op.
 * - Real filesystem walking is intentionally out of scope at this stage.
 */
export interface DiscoveredAgent {
  name: string;
  source: "config" | "discovery";
}

export const syncDiscover = {
  /** Lists agents/plugins discoverable for sync (placeholder: returns `[]` until real discovery exists). */
  discoverAgents(): Result<DiscoveredAgent[], Error> {
    // Intentional placeholder: real filesystem/plugin discovery is deferred.
    return ok([]);
  },
};
