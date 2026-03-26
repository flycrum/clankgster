import type { Root } from 'mdast';
import type { z } from 'zod';
import type { ClankgsterConfig } from '../configs/clankgster-config.schema.js';
import type { SyncFsTransformMarkdownVisitorBase } from './sync-fs-transform-visitor-base.js';

/** File type categories supported by sync-fs-transforms. */
export type SyncFsTransformFileType = 'markdown' | 'txt';

/** Shared context passed as the third argument to transform hooks. */
export interface SyncFsTransformGlobalContext {
  /** Agent key currently being synced (for example `cursor`). */
  agentName: string;
  /** Sync behavior class name currently running. */
  behaviorName: string;
  /** Absolute destination file path being written. */
  destinationFileAbsolutePath: string;
  /** Destination file path relative to `outputRoot`. */
  destinationFileRelativePath: string;
  /** Absolute output root for the current sync run. */
  outputRoot: string;
  /** Optional plugin name when source content belongs to a plugin. */
  pluginName?: string;
  /** Absolute repository root used for resolution. */
  repoRoot: string;
  /** Fully resolved runtime config for this sync run. */
  resolvedConfig: ClankgsterConfig;
  /** Absolute source file path being read. */
  sourceFileAbsolutePath: string;
  /** Source file path relative to `repoRoot`. */
  sourceFileRelativePath: string;
  /** High-level source category for downstream transforms/hooks. */
  sourceKind: 'command' | 'markdownContextFile' | 'plugin' | 'rule' | 'skill' | 'unknown';
  /** ISO timestamp captured at transform invocation time. */
  syncTimestampIso: string;
}

/** Runtime input for transform definitions. */
export interface SyncFsTransformRunContext {
  /** File contents before transform execution. */
  contents: string;
  /** Shared global metadata available to all transforms. */
  globalContext: SyncFsTransformGlobalContext;
}

/** Runtime hook payload validator for a single hook name. */
export type SyncFsTransformHookPayloadSchemas = Record<string, z.ZodType<unknown>>;

/** Runtime hook function map for one transform definition. */
export type SyncFsTransformHookFns = Record<string, (...args: any[]) => unknown>;

/** Class constructor for markdown transform classes. */
export type SyncFsTransformMarkdownClassRef = new () => {
  getVisitors(): SyncFsTransformMarkdownVisitorBase[];
};

/** Class constructor for txt transform classes. */
export type SyncFsTransformTxtClassRef = new () => Record<string, never>;

/** Resolves the constructor contract for a given filetype. */
export type SyncFsTransformClassForFileType<TFileType extends SyncFsTransformFileType> =
  TFileType extends 'markdown' ? SyncFsTransformMarkdownClassRef : SyncFsTransformTxtClassRef;

/** Strongly typed transform definition shape used at runtime and in preset declarations. */
export interface SyncFsTransformDefinition<
  TFileType extends SyncFsTransformFileType = SyncFsTransformFileType,
  TName extends string = string,
  TClassRef extends SyncFsTransformClassForFileType<TFileType> =
    SyncFsTransformClassForFileType<TFileType>,
  TDefaultOptions extends Record<string, unknown> = Record<string, unknown>,
  THooks extends SyncFsTransformHookFns = SyncFsTransformHookFns,
  THookPayloadSchemas extends SyncFsTransformHookPayloadSchemas = SyncFsTransformHookPayloadSchemas,
> {
  /** Runtime class constructor used to instantiate one transform. */
  classRef: TClassRef;
  /** Default hook callbacks merged before config-supplied hooks. */
  defaultHookFns: THooks;
  /** Default options merged before config-supplied options. */
  defaultOptions: TDefaultOptions;
  /** Filetype channel where this transform is allowed to run. */
  fileType: TFileType;
  /** Optional per-hook payload schemas for runtime validation. */
  hookPayloadSchemas: THookPayloadSchemas;
  /** Schema for validating resolved hooks object. */
  hooksSchema: z.ZodType<THooks>;
  /** Stable transform name used by `transforms.hooks/options` keys. */
  name: TName;
  /** Schema for validating resolved options object. */
  optionsSchema: z.ZodType<TDefaultOptions>;
}

/** Input shape for `defineSyncFsTransform` derived from the definition type. */
export type SyncFsTransformDefinitionInput<
  TFileType extends SyncFsTransformFileType = SyncFsTransformFileType,
  TName extends string = string,
  TClassRef extends SyncFsTransformClassForFileType<TFileType> =
    SyncFsTransformClassForFileType<TFileType>,
  TDefaultOptions extends Record<string, unknown> = Record<string, unknown>,
  THooks extends SyncFsTransformHookFns = SyncFsTransformHookFns,
  THookPayloadSchemas extends SyncFsTransformHookPayloadSchemas = SyncFsTransformHookPayloadSchemas,
> = Omit<
  SyncFsTransformDefinition<
    TFileType,
    TName,
    TClassRef,
    TDefaultOptions,
    THooks,
    THookPayloadSchemas
  >,
  'defaultHookFns' | 'defaultOptions' | 'fileType' | 'hookPayloadSchemas'
> & {
  /** Optional default hook callbacks; defaults to empty object. */
  defaultHookFns?: THooks;
  /** Optional default options; defaults to empty object. */
  defaultOptions?: TDefaultOptions;
  /** Optional per-hook payload schemas; defaults to empty object. */
  hookPayloadSchemas?: THookPayloadSchemas;
};

/** Config object under `ClankgsterConfig.transforms`. */
export interface SyncFsTransformsConfigInput {
  /** Per-transform hooks map keyed by transform definition name. */
  hooks?: Record<string, SyncFsTransformHookFns>;
  /** Per-transform options map keyed by transform definition name. */
  options?: Record<string, Record<string, unknown>>;
  /** Optional runtime registry override for built-in transform definitions. */
  registry?: (
    definitions: Record<string, SyncFsTransformDefinition>
  ) => Record<string, SyncFsTransformDefinition>;
  /** Shared template variable delimiter settings for markdown template transforms. */
  templateVariables?: {
    /** Closing delimiter token for template variables. */
    closingDelimiterToken?: string;
    /** Opening delimiter token for template variables. */
    openingDelimiterToken?: string;
  };
}

/** Context passed into markdown visitors. */
export interface SyncFsTransformMarkdownVisitorContext {
  /** Original source file contents before any markdown transforms. */
  fileContents: string;
  /** Shared global sync metadata. */
  globalContext: SyncFsTransformGlobalContext;
  /** Resolved transform options after defaults + config merge. */
  options: Record<string, unknown>;
  /** Resolved transform hooks after defaults + config merge. */
  resolvedHooks: SyncFsTransformHookFns;
  /** Parsed markdown AST root to mutate. */
  tree: Root;
}

/** Context passed into markdown post-stringify visitors. */
export interface SyncFsTransformMarkdownPostStringifyVisitorContext {
  /** Original source file contents before any markdown transforms. */
  fileContents: string;
  /** Shared global sync metadata. */
  globalContext: SyncFsTransformGlobalContext;
  /** Current markdown string from prior pipeline stages. */
  markdown: string;
  /** Resolved transform options after defaults + config merge. */
  options: Record<string, unknown>;
  /** Resolved transform hooks after defaults + config merge. */
  resolvedHooks: SyncFsTransformHookFns;
}
