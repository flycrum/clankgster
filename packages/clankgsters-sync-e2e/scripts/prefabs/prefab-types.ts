/** Execution context passed to each prefab while seeding one test case sandbox. */
export interface PrefabApplyContext {
  /** 1-based case index in alphabetical run order. */
  caseIndex: number;
  /** Absolute root directory for one case result folder (e.g. `.e2e-tests.run-results/case-1-basic`). */
  caseOutputRoot: string;
  /** Case id from the test case folder name (e.g. `basic`). */
  caseName: string;
  /** Absolute package root for `@clankgsters/sync-e2e`. */
  packageRoot: string;
  /** Absolute monorepo root used for `pnpm clankgsters-sync:*` commands. */
  repoRoot: string;
}

export type PrefabPrepareAction = 'append' | 'replace';

export interface PrefabPrepareScope {
  /** Limits `replace` behavior to matching roots when resolving prepared groups.
   * Example: `const scope: PrefabPrepareScope = { replaceRoots: ['.clank/plugins', '.clank/skills'] };` */
  replaceRoots?: string[];
}

export interface PrefabPrepareEntry {
  /** Overrides how this entry merges with a previously prepared entry of the same id.
   * Example: `action: 'replace'` */
  action?: PrefabPrepareAction;
  /** Stable merge key used by the resolver to match entries across groups.
   * Example: `id: 'PluginSkillFilePrefabRun.materialize'` */
  id: string;
  /** Executes this prepared entry against the active case sandbox.
   * Example: `run: (context) => prefabMain.run(context)` */
  run: (context: PrefabApplyContext) => void;
  /** Narrows where merge/replace behavior applies for this entry.
   * Example: `scope: { replaceRoots: ['.clank/plugins'] }` */
  scope?: PrefabPrepareScope;
}

export interface PrefabPrepareGroup {
  /** Overrides how this group merges with a previously prepared group of the same id.
   * Example: `action: 'append'` */
  action?: PrefabPrepareAction;
  /** Ordered prepared entries to resolve and execute under this group id.
   * Example: `entries: [{ id: 'plugins.materialize', run: (context) => writePlugins(context) }]` */
  entries: PrefabPrepareEntry[];
  /** Stable merge key used by the resolver to match groups.
   * Example: `id: 'PluginsSkillsScenarioPrefabBlueprint'` */
  id: string;
  /** Default scope inherited by group entries unless an entry provides its own scope.
   * Example: `scope: { replaceRoots: ['.clank/skills'] }` */
  scope?: PrefabPrepareScope;
}

export interface PrefabsPrepareConfig {
  /** Top-level prepared groups emitted by one prefab before config resolution.
   * Example: `const config: PrefabsPrepareConfig = { groups: [{ id: 'main', entries: [] }] };` */
  groups: PrefabPrepareGroup[];
}

export interface ResolvedPrefabPrepareEntry {
  action: PrefabPrepareAction;
  id: string;
  /** Concrete replace roots after inherited scope and overlay options are resolved.
   * Example: `replaceRoots: ['.clank/plugins']` */
  replaceRoots: string[];
  /** Resolved executable callback for this entry.
   * Example: `run: (context) => prefabMain.run(context)` */
  run: (context: PrefabApplyContext) => void;
}

export interface ResolvedPrefabPrepareGroup {
  /** Fully resolved entries in execution order for this group.
   * Example: `entries: [{ id: 'main.materialize', action: 'append', replaceRoots: [], run }]` */
  entries: ResolvedPrefabPrepareEntry[];
  /** Resolved group id preserved from the prepared config.
   * Example: `id: 'DefaultSandboxPrefabBlueprint'` */
  id: string;
}

export interface ResolvedPrefabsPrepareConfig {
  /** Final resolved groups consumed by prefab orchestration.
   * Example: `const resolved: ResolvedPrefabsPrepareConfig = { groups: [] };` */
  groups: ResolvedPrefabPrepareGroup[];
}

/** Optional overlay applied to a main prefab's prepared config (e.g. replace subtree before materialize). */
export interface PrefabPrepareOverlayOptions {
  /** Optional action override applied to every resolved entry in a main prefab config.
   * Example: `entryAction: 'replace'` */
  entryAction?: PrefabPrepareAction;
  /** Optional action override applied to every resolved group in a main prefab config.
   * Example: `groupAction: 'replace'` */
  groupAction?: PrefabPrepareAction;
  /** Optional replace roots override applied during main prefab resolution.
   * Example: `replaceRoots: ['.clank/plugins', '.clank/skills']` */
  replaceRoots?: string[];
}
