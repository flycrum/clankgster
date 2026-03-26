import path from 'node:path';
import type { ClankgsterConfig } from '../configs/clankgster-config.schema.js';
import type { SyncFsTransformGlobalContext } from './sync-fs-transform.types.js';

/** Input used to construct one `SyncFsTransformGlobalContext`. */
export interface CreateSyncFsTransformGlobalContextInput {
  /** Agent key currently being synced. */
  agentName: string;
  /** Sync behavior class name currently running. */
  behaviorName: string;
  /** Absolute destination output root for relative path derivation. */
  outputRoot: string;
  /** Optional plugin name for plugin-scoped content. */
  pluginName?: string;
  /** Absolute repository root. */
  repoRoot: string;
  /** Fully resolved runtime config for the current run. */
  resolvedConfig: ClankgsterConfig;
  /** Source kind category for downstream transforms. */
  sourceKind: SyncFsTransformGlobalContext['sourceKind'];
  /** Absolute or relative destination file path. */
  destinationPath: string;
  /** Absolute or relative source file path. */
  sourcePath: string;
  /** Optional timestamp override; defaults to `new Date().toISOString()`. */
  syncTimestampIso?: string;
}

/** Factory for creating normalized transform global context objects. */
export const syncFsTransformGlobalContextConfig = {
  /** Creates normalized absolute/relative path fields for one transform execution. */
  create(input: CreateSyncFsTransformGlobalContextInput): SyncFsTransformGlobalContext {
    const destinationFileAbsolutePath = path.resolve(input.destinationPath);
    const sourceFileAbsolutePath = path.resolve(input.sourcePath);
    return {
      agentName: input.agentName,
      behaviorName: input.behaviorName,
      destinationFileAbsolutePath,
      destinationFileRelativePath: path
        .relative(input.outputRoot, destinationFileAbsolutePath)
        .replace(/\\/g, '/'),
      outputRoot: input.outputRoot,
      pluginName: input.pluginName,
      repoRoot: input.repoRoot,
      resolvedConfig: input.resolvedConfig,
      sourceFileAbsolutePath,
      sourceFileRelativePath: path
        .relative(input.repoRoot, sourceFileAbsolutePath)
        .replace(/\\/g, '/'),
      sourceKind: input.sourceKind,
      syncTimestampIso: input.syncTimestampIso ?? new Date().toISOString(),
    };
  },
};
