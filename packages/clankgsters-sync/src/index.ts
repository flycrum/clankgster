/**
 * Public API surface for `@clankgsters/sync`: re-exports consumed by the monorepo, published `dist/index.mjs` (via `vp pack src/index.ts`), and npm consumers.
 * Prefer `import { … } from '@clankgsters/sync'` once the package is built; repo-local tooling may import this file by path (`packages/clankgsters-sync/src/index.js`).
 */
export { clankgstersIdentity } from './common/clankgsters-identity.js';
export { clankgstersConfig } from './core/configs/clankgsters-config.js';
export { clankgstersConfigDefaults } from './core/configs/clankgsters-config.defaults.js';
export { clankgstersConfigResolver } from './core/configs/config-resolver.js';
export { clankgstersConfigSchema } from './core/configs/clankgsters-config.schema.js';
export type { ClankgstersBehaviorEntryInput } from './core/configs/clankgsters-config.js';
export type {
  ClankgstersAgentConfig,
  ClankgstersBehaviorConfig,
  ClankgstersConfig,
  ClankgstersSourceDefaultsConfig,
} from './core/configs/clankgsters-config.schema.js';
