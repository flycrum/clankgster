import type { ClankgstersConfig } from '../../clankgsters-sync/config/index.js';

export interface E2eTestCaseDefinition {
  /** Partial config serialized into the sandbox `clankgsters.config.ts`. */
  config: Partial<ClankgstersConfig>;
  /** Short human-readable label for the case (e.g. logs and failure output). */
  description: string;
  /** Path to the expected manifest JSON fixture, relative to this package root. */
  jsonPath: string;
}

export const e2eTestCase = {
  /** Returns `definition` unchanged so the case stays typed at the export site. */
  define(definition: E2eTestCaseDefinition): E2eTestCaseDefinition {
    return definition;
  },
};
