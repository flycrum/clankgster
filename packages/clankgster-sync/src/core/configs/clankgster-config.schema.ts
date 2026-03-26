import { z } from 'zod';
import { clankgsterIdentity } from '../../common/clankgster-identity.js';
import { syncFsTransformRegistry } from '../sync-fs-transforms/sync-fs-transform-registry.js';
import type {
  SyncFsTransformFileType,
  SyncFsTransformsConfigInput,
} from '../sync-fs-transforms/sync-fs-transform.types.js';
import { clankgsterConfigDefaults } from './clankgster-config.defaults.js';

function makeFunctionSchema<T>() {
  return z.custom<T>((value) => value == null || typeof value === 'function');
}

const clankgsterBehaviorSchema = z.object({
  /**
   * Preset class name used as registry id and as the key under each agent in `sync-manifest.json` (e.g.
   * `AgentRulesDirectorySyncPreset`, `AgentSettingsSyncPreset`).
   */
  behaviorName: z.string().min(1),
  /** Optional switch to disable a behavior while keeping its options in config. */
  enabled: z.boolean().optional().default(true),
  /** Serializable behavior options passed to the concrete preset implementation. */
  options: z.record(z.string(), z.unknown()).optional().default({}),
});

const clankgsterAgentSchema = z.object({
  /** When false, this agent is skipped for the current run. */
  enabled: z.boolean().optional().default(true),
  /** Ordered behavior definitions to run for this agent. */
  behaviors: z.array(clankgsterBehaviorSchema).optional().default([]),
});

const clankgsterSourceDefaultsSchema = z.object({
  /** Root source directory for marketplace content (default: `.clank`). */
  sourceDir: z
    .string()
    .optional()
    .default(clankgsterConfigDefaults.CONSTANTS.sourceDefaults.sourceDir),
  /**
   * Plugins directory name under `sourceDir` (default: `plugins`).
   *
   * Discovery supports both nested and shorthand layouts:
   * - Nested: `{sourceDir}/{pluginsDir}` and `{sourceDir}/{pluginsDir}.local`
   * - Shorthand sibling: `{sourceDir}-{pluginsDir}` and `{sourceDir}-{pluginsDir}.local`
   */
  pluginsDir: z
    .string()
    .optional()
    .default(clankgsterConfigDefaults.CONSTANTS.sourceDefaults.pluginsDir),
  /**
   * Skills directory name under `sourceDir` (default: `skills`).
   *
   * Discovery supports both nested and shorthand layouts:
   * - Nested: `{sourceDir}/{skillsDir}` and `{sourceDir}/{skillsDir}.local`
   * - Shorthand sibling: `{sourceDir}-{skillsDir}` and `{sourceDir}-{skillsDir}.local`
   */
  skillsDir: z
    .string()
    .optional()
    .default(clankgsterConfigDefaults.CONSTANTS.sourceDefaults.skillsDir),
  /**
   * Repo-relative path to the canonical context markdown (default `CLANK.md`).
   * May be a basename (e.g. `CLANK.md`) or a nested path (e.g. `docs/guide.md`) depending on layout.
   */
  markdownContextFileName: z
    .string()
    .optional()
    .default(clankgsterConfigDefaults.CONSTANTS.sourceDefaults.markdownContextFileName),
  /**
   * `name` for generated local marketplace JSON and related manifest/settings linkage
   * (default {@link clankgsterIdentity.LOCAL_MARKETPLACE_NAME}).
   */
  localMarketplaceName: z
    .string()
    .optional()
    .default(clankgsterConfigDefaults.CONSTANTS.sourceDefaults.localMarketplaceName),
  /** Marker filename that identifies a skill directory (default: `SKILL.md`). */
  skillFileName: z
    .string()
    .optional()
    .default(clankgsterConfigDefaults.CONSTANTS.sourceDefaults.skillFileName),
});

const clankgsterConfigSchemaValueBase = z.object({
  /** Named agent entries (coding-agent front-ends) and their behavior definitions. */
  agents: z.record(z.string(), clankgsterAgentSchema).default({}),
  /** Global output artifact strategy; `copy` enables in-file transforms and hooks. */
  artifactMode: z
    .enum(['copy', 'symlink'])
    .optional()
    .default(clankgsterConfigDefaults.CONSTANTS.artifactMode),
  /** Paths or globs excluded from sync/discovery (repo-relative strings). */
  excluded: z.array(z.string()).optional().default([]),
  /** Enables file logging for sync scripts when true. */
  loggingEnabled: z.boolean().optional().default(false),
  /** Global source/layout defaults used by discovery and selected behaviors. */
  sourceDefaults: clankgsterSourceDefaultsSchema.default({
    ...clankgsterConfigDefaults.CONSTANTS.sourceDefaults,
  }),
  /**
   * Repo-relative directory for generated sync cache (default {@link clankgsterIdentity.SYNC_CACHE_DIR}).
   * When `syncManifestPath` is omitted, it defaults to `{syncCacheDir}/{@link clankgsterIdentity.SYNC_MANIFEST_FILE_NAME}`.
   */
  syncCacheDir: z.string().optional().default(clankgsterConfigDefaults.CONSTANTS.syncCacheDir),
  /** Path to the sync manifest JSON, relative to the repo root unless absolute; defaults under `syncCacheDir`. */
  syncManifestPath: z.string().optional(),
  /** Optional root for sync outputs (e.g. logs); defaults to repo root when unset. */
  syncOutputRoot: z.string().optional(),
  /** Marks copied output files read-only after sync writes when enabled. */
  syncOutputReadOnly: z
    .boolean()
    .optional()
    .default(clankgsterConfigDefaults.CONSTANTS.syncOutputReadOnly),
  /** Sync-fs-transforms configuration: registry, hooks, options, and template variable delimiters. */
  transforms: z
    .object({
      hooks: z
        .record(z.string(), z.record(z.string(), makeFunctionSchema<(...args: any[]) => unknown>()))
        .optional()
        .default({}),
      options: z.record(z.string(), z.record(z.string(), z.unknown())).optional().default({}),
      registry: makeFunctionSchema<
        (
          definitions: ReturnType<typeof syncFsTransformRegistry.getBuiltInDefinitions>
        ) => ReturnType<typeof syncFsTransformRegistry.getBuiltInDefinitions>
      >()
        .optional()
        .default((definitions) => definitions),
      templateVariables: z
        .object({
          closingDelimiterToken: z
            .string()
            .min(1)
            .optional()
            .default(
              clankgsterConfigDefaults.CONSTANTS.transforms.templateVariables.closingDelimiterToken
            ),
          openingDelimiterToken: z
            .string()
            .min(1)
            .optional()
            .default(
              clankgsterConfigDefaults.CONSTANTS.transforms.templateVariables.openingDelimiterToken
            ),
        })
        .optional()
        .default({
          ...clankgsterConfigDefaults.CONSTANTS.transforms.templateVariables,
        }),
    })
    .optional()
    .default({
      hooks: {},
      options: {},
      registry: (definitions) => definitions,
      templateVariables: {
        ...clankgsterConfigDefaults.CONSTANTS.transforms.templateVariables,
      },
    }),
});

const clankgsterConfigSchemaValue = clankgsterConfigSchemaValueBase.transform((data) => ({
  ...data,
  syncManifestPath:
    data.syncManifestPath ?? `${data.syncCacheDir}/${clankgsterIdentity.SYNC_MANIFEST_FILE_NAME}`,
}));

export type ClankgsterBehaviorConfig = z.infer<typeof clankgsterBehaviorSchema>;
export type ClankgsterAgentConfig = z.infer<typeof clankgsterAgentSchema>;
export type ClankgsterSourceDefaultsConfig = z.infer<typeof clankgsterSourceDefaultsSchema>;
export type ClankgsterConfig = z.infer<typeof clankgsterConfigSchemaValue>;
export type SyncArtifactMode = 'copy' | 'symlink';
export type { SyncFsTransformFileType, SyncFsTransformsConfigInput };

/** Zod entry points: single-agent shape vs full repo config (see `ClankgsterAgentConfig` / `ClankgsterConfig`). */
export const clankgsterConfigSchema = {
  /** Schema for one agent entry under `ClankgsterConfig.agents`. */
  agent: clankgsterAgentSchema,
  /** Schema for one behavior definition under `ClankgsterAgentConfig.behaviors`. */
  behaviorSchema: clankgsterBehaviorSchema,
  /** Schema for the merged root config object (logging, agents map, paths, etc.). */
  config: clankgsterConfigSchemaValue,
  /** Schema for source/layout defaults used by discovery and context behaviors. */
  sourceDefaults: clankgsterSourceDefaultsSchema,
};
