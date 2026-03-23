import { err, ok, type Result } from 'neverthrow';
import fs from 'node:fs';
import { isPlainObject } from 'lodash-es';
import path from 'node:path';
import { agentPresetConfigs } from '../agents/agent-presets/agent-preset-configs.js';
import type { ClankgstersSourceDefaultsConfig } from '../configs/clankgsters-config.schema.js';

/** Per-plugin manifest presence map keyed by agent name. */
export type PluginManifestMap = Record<string, boolean>;

/** One plugin discovered under a source marketplace plugins directory. */
export interface DiscoveredPlugin {
  description?: string;
  manifests: PluginManifestMap;
  manifestName?: string;
  name: string;
  path: string;
  relativePath: string;
  version?: string;
}

/** Marketplace node discovered at root or in nested packages. */
export interface DiscoveredMarketplace {
  label: string;
  plugins: DiscoveredPlugin[];
  pluginsDir: string;
  relativePath: string;
}

function normalizeRel(value: string): string {
  return value.replace(/\\/g, '/');
}

function readManifestInfo(manifestPath: string): {
  description?: string;
  manifestName?: string;
  version?: string;
} | null {
  try {
    const raw = fs.readFileSync(manifestPath, 'utf8');
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!isPlainObject(parsed)) return null;
    return {
      description: typeof parsed.description === 'string' ? parsed.description : undefined,
      manifestName: typeof parsed.name === 'string' ? parsed.name : undefined,
      version: typeof parsed.version === 'string' ? parsed.version : undefined,
    };
  } catch {
    return null;
  }
}

function getResolvedSourcePath(defaults: ClankgstersSourceDefaultsConfig): {
  pluginsPath: string;
  skillsPath: string;
} {
  const sourceDir = defaults.sourceDir.replace(/\/+$/g, '');
  return {
    pluginsPath: normalizeRel(path.posix.join(sourceDir, defaults.pluginsDir)),
    skillsPath: normalizeRel(path.posix.join(sourceDir, defaults.skillsDir)),
  };
}

function findPluginsDirs(repoRoot: string, pluginsPath: string, excluded: string[]): string[] {
  const found = new Set<string>();
  const segments = pluginsPath.split('/').filter((segment) => segment.length > 0);
  const excludedSet = new Set(excluded);

  const walk = (dir: string): void => {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const fullPath = path.join(dir, entry.name);
      const rel = normalizeRel(path.relative(repoRoot, fullPath));
      if (excludedSet.has(entry.name) || excludedSet.has(rel)) continue;
      const maybePluginsPath = path.join(fullPath, ...segments);
      if (fs.existsSync(maybePluginsPath) && fs.statSync(maybePluginsPath).isDirectory()) {
        found.add(maybePluginsPath);
      }
      walk(fullPath);
    }
  };

  const rootPlugins = path.join(repoRoot, ...segments);
  if (fs.existsSync(rootPlugins) && fs.statSync(rootPlugins).isDirectory()) {
    found.add(rootPlugins);
  }
  walk(repoRoot);
  return [...found];
}

function discoverPluginsInDir(
  repoRoot: string,
  pluginsDir: string,
  relativePluginsPath: string,
  agentNames: string[],
  excluded: string[]
): DiscoveredPlugin[] {
  const entries = fs.readdirSync(pluginsDir, { withFileTypes: true });
  const plugins: DiscoveredPlugin[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const pluginPath = path.join(pluginsDir, entry.name);
    const pluginRelativePath = normalizeRel(path.join(relativePluginsPath, entry.name));
    const excludedSet = new Set(excluded);
    if (excludedSet.has(entry.name) || excludedSet.has(pluginRelativePath)) continue;
    const manifests: PluginManifestMap = {};
    let firstManifestPath: string | null = null;
    for (const agentName of agentNames) {
      const manifestDir = agentPresetConfigs.resolve(agentName).CONSTANTS.PLUGIN_MANIFEST_DIR;
      const manifestPath = path.join(pluginPath, manifestDir, 'plugin.json');
      const present = fs.existsSync(manifestPath);
      manifests[agentName] = present;
      if (present && firstManifestPath == null) firstManifestPath = manifestPath;
    }
    if (!Object.values(manifests).some(Boolean)) continue;

    const metadata = firstManifestPath != null ? readManifestInfo(firstManifestPath) : null;
    plugins.push({
      description: metadata?.description,
      manifests,
      manifestName: metadata?.manifestName ?? entry.name,
      name: entry.name,
      path: pluginPath,
      relativePath: pluginRelativePath,
      version: metadata?.version,
    });
  }
  return plugins.sort((left, right) => left.name.localeCompare(right.name));
}

export const syncDiscover = {
  /** Discovers plugin marketplaces from source defaults and filters plugins by manifest presence for known agent names. */
  discoverMarketplaces(input: {
    agentNames: string[];
    excluded: string[];
    repoRoot: string;
    sourceDefaults: ClankgstersSourceDefaultsConfig;
  }): Result<DiscoveredMarketplace[], Error> {
    try {
      const paths = getResolvedSourcePath(input.sourceDefaults);
      const pluginDirs = findPluginsDirs(input.repoRoot, paths.pluginsPath, input.excluded);
      const marketplaces = pluginDirs.map((pluginsDir) => {
        const relativePath = normalizeRel(path.relative(input.repoRoot, pluginsDir));
        return {
          label:
            relativePath === paths.pluginsPath ? 'Root marketplace' : `${relativePath} marketplace`,
          plugins: discoverPluginsInDir(
            input.repoRoot,
            pluginsDir,
            relativePath,
            input.agentNames,
            input.excluded
          ),
          pluginsDir,
          relativePath,
        };
      });
      return ok(marketplaces);
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  },
  getResolvedSourcePath,
};
