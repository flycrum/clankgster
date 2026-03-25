import fs from 'node:fs';
import path from 'node:path';
import { PrefabBlueprintBase } from './prefab-blueprint-base.js';
import { PrefabMainBase } from './prefab-main-base.js';
import type { PrefabPrepareBase } from './prefab-prepare-base.js';
import type { PrefabRunBase } from './prefab-run-base.js';
import type {
  PrefabApplyContext,
  PrefabPrepareOverlayOptions,
  PrefabsPrepareConfig,
  ResolvedPrefabsPrepareConfig,
} from './prefab-types.js';

type PrefabMainConstructor = typeof PrefabMainBase & {
  prefabClassPrepare: new (
    sandboxDirectoryName: string,
    options: object
  ) => PrefabPrepareBase<object>;
  prefabClassRun: new (sandboxDirectoryName: string, options: object) => PrefabRunBase<object>;
};

function normalizeReplaceRoots(replaceRoots: string[] | undefined): string[] {
  if (replaceRoots == null) return [];
  return [
    ...new Set(replaceRoots.map((value) => value.trim()).filter((value) => value.length > 0)),
  ];
}

function isPathInsideRoot(root: string, value: string): boolean {
  const rel = path.relative(root, value);
  return !(rel.startsWith('..') || path.isAbsolute(rel));
}

/** One seeding entry: either a prefab main or a blueprint that expands to mains. */
export type TestCaseSeedingItem = PrefabBlueprintBase<any> | PrefabMainBase<any>;

function runOnePrefabMain(
  context: PrefabApplyContext,
  main: PrefabMainBase<any>,
  overlay: PrefabPrepareOverlayOptions | undefined
): void {
  const Ctor = main.constructor as PrefabMainConstructor;
  const prepareInstance = new Ctor.prefabClassPrepare(main.sandboxDirectoryName, main.options);
  const runInstance = new Ctor.prefabClassRun(main.sandboxDirectoryName, main.options);
  let prepareConfig = prepareInstance.prepare(context, runInstance);
  if (overlay != null)
    prepareConfig = prefabOrchestration.applyPrepareOverlay(prepareConfig, overlay);
  const resolved = prefabOrchestration.resolvePrepareConfig(prepareConfig, Ctor.name);
  prefabOrchestration.runResolvedPrepare(
    context,
    resolved,
    path.join(context.caseOutputRoot, main.sandboxDirectoryName)
  );
}

export const prefabOrchestration = {
  /** Applies blueprint prepare overlay values to every group and entry in a prepare config. */
  applyPrepareOverlay(
    prepareConfig: PrefabsPrepareConfig,
    overlay: PrefabPrepareOverlayOptions
  ): PrefabsPrepareConfig {
    const groupAction = overlay.groupAction ?? 'append';
    const entryAction = overlay.entryAction ?? groupAction;
    return {
      groups: prepareConfig.groups.map((group) => ({
        ...group,
        action: groupAction,
        entries: group.entries.map((entry) => ({
          ...entry,
          action: entryAction,
        })),
        scope: overlay.replaceRoots != null ? { replaceRoots: overlay.replaceRoots } : group.scope,
      })),
    };
  },

  /** Flattens seeding items into runnable mains with any blueprint-provided prepare overlays. */
  flattenSeeding(items: TestCaseSeedingItem[]): Array<{
    main: PrefabMainBase<any>;
    overlay?: PrefabPrepareOverlayOptions;
  }> {
    const out: Array<{ main: PrefabMainBase<any>; overlay?: PrefabPrepareOverlayOptions }> = [];
    for (const item of items) {
      if (item instanceof PrefabBlueprintBase) {
        const overlay = item.getPrepareOverlay();
        for (const main of item.createPrefabMains()) {
          out.push({ main, overlay });
        }
      } else {
        out.push({ main: item });
      }
    }
    return out;
  },

  /** Resolves inherited prepare actions/scopes and validates replace rules before execution. */
  resolvePrepareConfig(
    prepareConfig: PrefabsPrepareConfig,
    prepareSource: string
  ): ResolvedPrefabsPrepareConfig {
    const resolvedGroups: ResolvedPrefabsPrepareConfig['groups'] = [];
    for (const group of prepareConfig.groups) {
      const resolvedEntries: ResolvedPrefabsPrepareConfig['groups'][0]['entries'] = [];
      for (const entry of group.entries) {
        const action = entry.action ?? group.action;
        if (action == null) {
          throw new Error(
            `${prepareSource}: prepare entry "${entry.id}" in group "${group.id}" is missing an explicit action`
          );
        }
        const replaceRoots = normalizeReplaceRoots(
          entry.scope?.replaceRoots ?? group.scope?.replaceRoots
        );
        if (action === 'replace' && replaceRoots.length === 0) {
          throw new Error(
            `${prepareSource}: replace action requires replaceRoots for entry "${entry.id}" in group "${group.id}"`
          );
        }
        resolvedEntries.push({
          action,
          id: entry.id,
          replaceRoots,
          run: entry.run,
        });
      }
      resolvedGroups.push({
        entries: resolvedEntries,
        id: group.id,
      });
    }
    return { groups: resolvedGroups };
  },

  /** Executes resolved prepare entries and enforces sandbox-safe replace deletes before each run. */
  runResolvedPrepare(
    context: PrefabApplyContext,
    resolvedPrepare: ResolvedPrefabsPrepareConfig,
    sandboxRoot: string
  ): void {
    const normalizedSandboxRoot = path.resolve(sandboxRoot);
    for (const group of resolvedPrepare.groups) {
      for (const entry of group.entries) {
        if (entry.action === 'replace') {
          for (const replaceRoot of entry.replaceRoots) {
            const targetPath = path.resolve(normalizedSandboxRoot, replaceRoot);
            if (!isPathInsideRoot(normalizedSandboxRoot, targetPath)) {
              throw new Error(
                `replace root escapes sandbox for entry "${entry.id}" in group "${group.id}": ${replaceRoot}`
              );
            }
            if (fs.existsSync(targetPath)) {
              fs.rmSync(targetPath, { force: true, recursive: true });
            }
          }
        }
        entry.run(context);
      }
    }
  },

  /** Gathers mains from blueprints, runs prepare → resolve → run for each slot in order. */
  applySeeding(context: PrefabApplyContext, items: TestCaseSeedingItem[]): void {
    for (const { main, overlay } of this.flattenSeeding(items)) {
      runOnePrefabMain(context, main, overlay);
    }
  },
} as const;
