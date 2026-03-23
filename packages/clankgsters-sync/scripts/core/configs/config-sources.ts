import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { parseUtils } from "../../common/parse-utils.js";
import type { ClankConfigResolutionContext, ClankConfigSource } from "./config-source.js";
import type { ClankConfig } from "./schema/clank-config.schema.js";

/** Loads `filePath` as an ES module and returns its default export as partial config, or `null` if the file is missing or the default is not a non-null object. */
async function loadTypeScriptConfig(filePath: string): Promise<Partial<ClankConfig> | null> {
  if (!fs.existsSync(filePath)) return null;
  const mod = await import(pathToFileURL(filePath).href);
  if (typeof mod.default !== "object" || mod.default == null) return null;
  return mod.default as Partial<ClankConfig>;
}

/** Builds a {@link ClankConfigSource} that loads `fileName` relative to `context.repoRoot` via {@link loadTypeScriptConfig}. */
function buildTypeScriptSource(id: string, priority: number, fileName: string): ClankConfigSource {
  return {
    id,
    priority,
    async load(context: ClankConfigResolutionContext): Promise<Partial<ClankConfig> | null> {
      return loadTypeScriptConfig(path.join(context.repoRoot, fileName));
    },
  };
}

const envSource: ClankConfigSource = {
  /** Source id used when merging and logging. */
  id: "env",
  /** Runs after file-based sources (10, 20); lower `priority` sorts earlier. */
  priority: 30,
  /** Partial config from `CLANKGSTERS_*` process environment variables. */
  load(): Partial<ClankConfig> {
    const loggingEnabled = parseUtils.parseBool(process.env.CLANKGSTERS_LOGGING_ENABLED);
    const syncOutputRoot = process.env.CLANKGSTERS_SYNC_OUTPUT_ROOT;
    const syncManifestPath = process.env.CLANKGSTERS_SYNC_MANIFEST_PATH;
    const source: Partial<ClankConfig> = { agents: {} };
    if (loggingEnabled != null) source.loggingEnabled = loggingEnabled;
    if (typeof syncOutputRoot === "string" && syncOutputRoot.length > 0) {
      source.syncOutputRoot = syncOutputRoot;
    }
    if (typeof syncManifestPath === "string" && syncManifestPath.length > 0) {
      source.syncManifestPath = syncManifestPath;
    }
    return source;
  },
};

export const clankConfigSources = {
  /** Default resolution order: team `clank.config.ts`, then `clank.local.config.ts`, then environment overrides. */
  defaults(): ClankConfigSource[] {
    return [
      buildTypeScriptSource("team-ts-config", 10, "clank.config.ts"),
      buildTypeScriptSource("local-ts-config", 20, "clank.local.config.ts"),
      envSource,
    ];
  },
};
