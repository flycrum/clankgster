import type { PrefabRunBase } from './prefab-run-base.js';
import type { PrefabApplyContext, PrefabsPrepareConfig } from './prefab-types.js';

/** Base class for prefab prepare stages that build explicit append/replace prepare configs. */
export abstract class PrefabPrepareBase<TOptions extends object = Record<string, never>> {
  constructor(
    protected readonly sandboxDirectoryName: string,
    protected readonly options: TOptions
  ) {}

  /**
   * Builds a prepare config; `run` is the paired run instance used for materialize callbacks.
   */
  prepare(_context: PrefabApplyContext, run: PrefabRunBase<TOptions>): PrefabsPrepareConfig {
    return {
      groups: [
        {
          action: 'append',
          entries: [
            {
              action: 'append',
              id: `${run.constructor.name}.materialize`,
              run: (runContext) => run.run(runContext),
            },
          ],
          id: this.constructor.name,
        },
      ],
    };
  }
}
