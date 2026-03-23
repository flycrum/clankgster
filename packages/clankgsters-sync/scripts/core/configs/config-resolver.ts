import { err, ok, type Result } from 'neverthrow';
import { clankgstersConfig } from './clankgsters-config.js';
import {
  clankgstersConfigSource,
  type ClankgstersConfigResolutionContext,
  type ClankgstersConfigSource,
} from './config-source.js';
import { clankgstersConfigSources } from './config-sources.js';
import { clankgstersConfigSchema, type ClankgstersConfig } from './clankgsters-config.schema.js';

/** Output of {@link clankgstersConfigResolver.resolve}: merged partial layers, schema-validated config, and which sources contributed. */
export interface ClankgstersConfigResolutionDetails {
  mergedConfig: Partial<ClankgstersConfig>;
  resolvedConfig: ClankgstersConfig;
  sourcesLoaded: string[];
}

/** Deep-merges config layers in order: top-level keys shallow-merge; `agents` merges by key; `sourceDefaults` deep-merges; `excluded` uses the latest layer that sets it. One {@link clankgstersConfig.define} pass at the end applies defaults without clobbering prior `sourceDefaults` keys. */
function mergeConfigLayers(layers: Partial<ClankgstersConfig>[]): Partial<ClankgstersConfig> {
  const merged = layers.reduce<Partial<ClankgstersConfig>>((acc, layer) => {
    if (layer == null) return acc;
    return {
      ...acc,
      ...layer,
      agents: {
        ...acc.agents,
        ...layer.agents,
      },
      sourceDefaults: {
        ...acc.sourceDefaults,
        ...layer.sourceDefaults,
      },
      excluded: layer.excluded ?? acc.excluded,
    } as Partial<ClankgstersConfig>;
  }, {});
  return clankgstersConfig.define(merged as Parameters<typeof clankgstersConfig.define>[0]);
}

/** Invokes `source.load` and maps failures into a `Result` with the source id in the error message. */
async function loadSource(
  source: ClankgstersConfigSource,
  context: ClankgstersConfigResolutionContext
): Promise<Result<Partial<ClankgstersConfig> | null, Error>> {
  try {
    const loaded = await source.load(context);
    return ok(loaded);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return err(new Error(`failed loading config source ${source.id}: ${message}`));
  }
}

/** Parses partial config through `clankgstersConfigSchema.config` and returns a full `ClankgstersConfig` or a parse error. */
function validateShape(config: Partial<ClankgstersConfig>): Result<ClankgstersConfig, Error> {
  const parsed = clankgstersConfigSchema.config.safeParse(config);
  if (!parsed.success) {
    return err(new Error(parsed.error.message));
  }
  return ok(parsed.data);
}

export const clankgstersConfigResolver = {
  /** Loads sources in priority order, merges non-null layers, validates with the schema, and returns details (defaults to `clankgstersConfigSources.defaults()` when `sources` is omitted). */
  async resolve(
    context: ClankgstersConfigResolutionContext,
    sources = clankgstersConfigSources.defaults()
  ): Promise<Result<ClankgstersConfigResolutionDetails, Error>> {
    const sortedSources = [...sources].sort((a, b) =>
      clankgstersConfigSource.comparePriority(a, b)
    );
    const loadedLayers: Partial<ClankgstersConfig>[] = [];
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
