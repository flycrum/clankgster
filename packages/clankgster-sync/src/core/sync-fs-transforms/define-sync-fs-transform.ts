import type {
  SyncFsTransformClassForFileType,
  SyncFsTransformFileType,
  SyncFsTransformHookFns,
  SyncFsTransformHookPayloadSchemas,
  SyncFsTransformDefinition,
  SyncFsTransformDefinitionInput,
} from './sync-fs-transform.types.js';

/** Defines one transform definition with filetype-aware class typing. */
export function defineSyncFsTransform<
  const TFileType extends SyncFsTransformFileType,
  const TName extends string,
  TClassRef extends SyncFsTransformClassForFileType<TFileType>,
  TDefaultOptions extends Record<string, unknown>,
  THooks extends SyncFsTransformHookFns,
  THookPayloadSchemas extends SyncFsTransformHookPayloadSchemas,
>(
  /** Filetype channel this transform can execute on. */
  fileType: TFileType,
  /** Definition input (name, classRef, schemas, and optional defaults). */
  input: SyncFsTransformDefinitionInput<
    TFileType,
    TName,
    TClassRef,
    TDefaultOptions,
    THooks,
    THookPayloadSchemas
  >
) {
  return {
    classRef: input.classRef,
    defaultHookFns: input.defaultHookFns ?? {},
    defaultOptions: input.defaultOptions ?? {},
    fileType,
    hookPayloadSchemas: input.hookPayloadSchemas ?? {},
    hooksSchema: input.hooksSchema,
    name: input.name,
    optionsSchema: input.optionsSchema,
  } as SyncFsTransformDefinition<
    TFileType,
    TName,
    TClassRef,
    TDefaultOptions,
    THooks,
    THookPayloadSchemas
  >;
}
