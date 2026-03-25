import { clankgstersConfigDefaults } from '../../../../../clankgsters-sync/config/index.js';
import type { JsonFilePrefabOptions } from '../json-file-prefab/prefab-run.js';
import { JsonFilePrefabRun } from '../json-file-prefab/prefab-run.js';

export interface AgentPluginJsonPrefabOptions {
  pluginDirName: string;
  pluginManifestDirName: string;
  pluginName?: string;
  version?: string;
  description?: string;
  sourceDirName?: string;
  pluginsDirName?: string;
  parentPaths?: string[];
}

function toJsonFileOptions(options: AgentPluginJsonPrefabOptions): JsonFilePrefabOptions {
  const sourceDirName =
    options.sourceDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.sourceDir;
  const pluginsDirName =
    options.pluginsDirName ?? clankgstersConfigDefaults.CONSTANTS.sourceDefaults.pluginsDir;
  return {
    fileName: 'plugin.json',
    jsonValue: {
      description: options.description ?? `${options.pluginDirName} plugin`,
      name: options.pluginName ?? options.pluginDirName,
      version: options.version ?? '0.0.1',
    },
    parentPaths: [
      ...(options.parentPaths ?? []),
      sourceDirName,
      pluginsDirName,
      options.pluginDirName,
      options.pluginManifestDirName,
    ],
  };
}

/** Writes one agent-specific plugin manifest JSON used by marketplace discovery. */
export class AgentPluginJsonPrefabRun extends JsonFilePrefabRun {
  constructor(sandboxDirectoryName: string, options: AgentPluginJsonPrefabOptions) {
    super(sandboxDirectoryName, toJsonFileOptions(options));
  }
}
