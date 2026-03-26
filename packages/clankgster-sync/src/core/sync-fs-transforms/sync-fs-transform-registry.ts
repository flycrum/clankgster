import { syncFsTransformBuiltinPresets } from './presets/sync-fs-transform-builtin-presets.js';
import { SyncFsTransformMarkdownBase } from './sync-fs-transform-markdown-base.js';
import { SyncFsTransformTxtBase } from './sync-fs-transform-txt-base.js';
import type {
  SyncFsTransformDefinition,
  SyncFsTransformsConfigInput,
} from './sync-fs-transform.types.js';

/** Registry helpers for built-in and runtime sync-fs-transform definitions. */
export const syncFsTransformRegistry = {
  /** Returns the immutable built-in definition map. */
  getBuiltInDefinitions(): Record<string, SyncFsTransformDefinition> {
    return {
      ...syncFsTransformBuiltinPresets.DEFINITIONS,
    };
  },

  /** Resolves runtime definitions by applying optional config registry override. */
  resolveRuntimeDefinitions(
    transformsConfig: SyncFsTransformsConfigInput
  ): Record<string, SyncFsTransformDefinition> {
    const builtins = this.getBuiltInDefinitions();
    const runtime = transformsConfig.registry?.(builtins) ?? builtins;
    this.assertValidDefinitionMap(runtime);
    return runtime;
  },

  /** Validates one runtime definition map. */
  assertValidDefinitionMap(definitions: Record<string, SyncFsTransformDefinition>): void {
    for (const [name, definition] of Object.entries(definitions)) {
      if (name.length === 0) throw new Error('sync fs transform definition name cannot be empty');
      const instance = new definition.classRef();
      if (
        definition.fileType === 'markdown' &&
        !(instance instanceof SyncFsTransformMarkdownBase)
      ) {
        throw new Error(
          `sync fs transform "${name}" declares markdown but class does not extend SyncFsTransformMarkdownBase`
        );
      }
      if (definition.fileType === 'txt' && !(instance instanceof SyncFsTransformTxtBase)) {
        throw new Error(
          `sync fs transform "${name}" declares txt but class does not extend SyncFsTransformTxtBase`
        );
      }
    }
  },
};
