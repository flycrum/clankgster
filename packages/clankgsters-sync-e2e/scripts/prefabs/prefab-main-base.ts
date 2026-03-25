/**
 * Base for concrete prefab mains. Each subclass must declare static `prefabClassPrepare` and
 * `prefabClassRun` consumed by `prefabOrchestration`.
 */
export abstract class PrefabMainBase<TOptions extends object = Record<string, never>> {
  constructor(
    public readonly sandboxDirectoryName: string,
    public readonly options: TOptions
  ) {}
}
