import { z } from "zod";

const clankAgentSchema = z.object({
  /** When false, this agent is skipped for the current run. */
  enabled: z.boolean().optional().default(true),
  /** Ordered behavior ids to run for this agent (e.g. rules, commands, skills). */
  behaviors: z.array(z.string().min(1)).optional().default([]),
});

const clankConfigSchemaValue = z.object({
  /** Enables file logging for sync scripts when true. */
  loggingEnabled: z.boolean().optional().default(false),
  /** Named agent entries (coding-agent front-ends) and their behavior lists. */
  agents: z.record(z.string(), clankAgentSchema).default({}),
  /** Paths or globs excluded from sync/discovery (repo-relative strings). */
  excluded: z.array(z.string()).optional().default([]),
  /** Path to the sync manifest JSON, relative to the repo root unless absolute. */
  syncManifestPath: z.string().optional().default(".clankgsters/sync-manifest.json"),
  /** Optional root for sync outputs (e.g. logs); defaults to repo root when unset. */
  syncOutputRoot: z.string().optional(),
});

export type ClankAgentConfig = z.infer<typeof clankAgentSchema>;
export type ClankConfig = z.infer<typeof clankConfigSchemaValue>;

/** Zod entry points: single-agent shape vs full repo config (see `ClankAgentConfig` / `ClankConfig`). */
export const clankConfigSchema = {
  /** Schema for one agent entry under `ClankConfig.agents`. */
  agent: clankAgentSchema,
  /** Schema for the merged root config object (logging, agents map, paths, etc.). */
  config: clankConfigSchemaValue,
};
