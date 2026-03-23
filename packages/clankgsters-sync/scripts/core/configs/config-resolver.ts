import { err, ok, type Result } from "neverthrow";
import {
  clankConfigSource,
  type ClankConfigResolutionContext,
  type ClankConfigSource,
} from "./config-source.js";
import { clankConfigSources } from "./config-sources.js";
import { clankConfigSchema, type ClankConfig } from "./schema/clank-config.schema.js";

/** Output of {@link clankConfigResolver.resolve}: merged partial layers, schema-validated config, and which sources contributed. */
export interface ClankConfigResolutionDetails {
  mergedConfig: Partial<ClankConfig>;
  resolvedConfig: ClankConfig;
  sourcesLoaded: string[];
}

/** Deep-merges config layers in order: top-level keys shallow-merge; `agents` merges by key; `excluded` uses the latest layer that sets it. */
function mergeConfigLayers(layers: Partial<ClankConfig>[]): Partial<ClankConfig> {
  return layers.reduce<Partial<ClankConfig>>((acc, layer) => {
    return {
      ...acc,
      ...layer,
      agents: {
        ...acc.agents,
        ...layer.agents,
      },
      excluded: layer.excluded ?? acc.excluded,
    };
  }, {});
}

/** Invokes `source.load` and maps failures into a `Result` with the source id in the error message. */
async function loadSource(
  source: ClankConfigSource,
  context: ClankConfigResolutionContext,
): Promise<Result<Partial<ClankConfig> | null, Error>> {
  try {
    const loaded = await source.load(context);
    return ok(loaded);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return err(new Error(`failed loading config source ${source.id}: ${message}`));
  }
}

/** Parses partial config through `clankConfigSchema.config` and returns a full `ClankConfig` or a parse error. */
function validateShape(config: Partial<ClankConfig>): Result<ClankConfig, Error> {
  const parsed = clankConfigSchema.config.safeParse(config);
  if (!parsed.success) {
    return err(new Error(parsed.error.message));
  }
  return ok(parsed.data);
}

export const clankConfigResolver = {
  /** Loads sources in priority order, merges non-null layers, validates with the schema, and returns details (defaults to `clankConfigSources.defaults()` when `sources` is omitted). */
  async resolve(
    context: ClankConfigResolutionContext,
    sources = clankConfigSources.defaults(),
  ): Promise<Result<ClankConfigResolutionDetails, Error>> {
    const sortedSources = [...sources].sort((a, b) => clankConfigSource.comparePriority(a, b));
    const loadedLayers: Partial<ClankConfig>[] = [];
    const loadedSourceIds: string[] = [];

    for (const source of sortedSources) {
      const loadedResult = await loadSource(source, context);
      if (loadedResult.isErr()) return err(loadedResult.error);
      const loaded = loadedResult.value;
      if (loaded == null) continue;
      loadedSourceIds.push(source.id);
      loadedLayers.push(loaded);
    }

    const mergedConfig = mergeConfigLayers(loadedLayers);
    return validateShape(mergedConfig).map((resolvedConfig) => ({
      mergedConfig,
      resolvedConfig,
      sourcesLoaded: loadedSourceIds,
    }));
  },
  validateShape,
};
