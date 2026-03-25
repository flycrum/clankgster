/**
 * Public API surface for `@clankgsters/sync`: re-exports consumed by the monorepo, published `dist/index.mjs` (via `vp pack exports/index.ts`), and npm consumers.
 * Prefer `import { … } from '@clankgsters/sync'` once the package is built; repo-local tooling may import this file by path (`packages/clankgsters-sync/exports/index.js`).
 */
export { clankgstersIdentity } from '../src/common/clankgsters-identity.js';
export { clankgstersConfigDefaults } from '../src/core/configs/clankgsters-config.defaults.js';
export { clankgstersConfig } from '../src/core/configs/clankgsters-config.js';
export type { ClankgstersBehaviorEntryInput } from '../src/core/configs/clankgsters-config.js';
export { clankgstersConfigSchema } from '../src/core/configs/clankgsters-config.schema.js';
export type {
  ClankgstersAgentConfig,
  ClankgstersBehaviorConfig,
  ClankgstersConfig,
  ClankgstersSourceDefaultsConfig,
} from '../src/core/configs/clankgsters-config.schema.js';
export { clankgstersConfigResolver } from '../src/core/configs/config-resolver.js';
