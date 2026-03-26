import type { Text } from 'mdast';
import { visit } from 'unist-util-visit';
import { z } from 'zod';
import { defineSyncFsTransform } from '../define-sync-fs-transform.js';
import { SyncFsTransformMarkdownBase } from '../sync-fs-transform-markdown-base.js';
import { SyncFsTransformMarkdownVisitorBase } from '../sync-fs-transform-visitor-base.js';
import type {
  SyncFsTransformGlobalContext,
  SyncFsTransformMarkdownVisitorContext,
} from '../sync-fs-transform.types.js';

/** Hook payload for markdown template variable transforms. */
export interface MarkdownTemplateVariableTransformPayload {
  /** Optional replacement value; `null` keeps the original token. */
  replacement: string | null;
  /** Parsed variable name (trimmed between delimiters). */
  variableName: string;
}

/** Hook context for markdown template variable transforms. */
export interface MarkdownTemplateVariableTransformHookContext {
  /** Full source markdown contents. */
  fileContents: string;
}

/** Markdown template variable transform callback signature. */
export type MarkdownTemplateVariableTransformHook = (
  payload: MarkdownTemplateVariableTransformPayload,
  hookContext: MarkdownTemplateVariableTransformHookContext,
  globalContext: SyncFsTransformGlobalContext
) => MarkdownTemplateVariableTransformPayload;

function makeFunctionHookSchema<T>() {
  return z.custom<T>((value) => value == null || typeof value === 'function');
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Template variable visitor for markdown transforms. */
export class SyncFsTransformMarkdownVisitorTemplateVariables extends SyncFsTransformMarkdownVisitorBase {
  /** Resolves built-in variables; returns `null` for unknown names. */
  private resolveBuiltInValue(
    variableName: string,
    globalContext: SyncFsTransformGlobalContext
  ): string | null {
    if (variableName === 'clankgster_time') return globalContext.syncTimestampIso;
    if (variableName === 'clankgster_agent_name') return globalContext.agentName;
    return null;
  }

  /** Rewrites markdown text nodes with template variable replacements. */
  override runOnMarkdownTree(context: SyncFsTransformMarkdownVisitorContext): void {
    const transformsConfig = context.globalContext.resolvedConfig.transforms;
    const openingDelimiterToken = transformsConfig.templateVariables.openingDelimiterToken;
    const closingDelimiterToken = transformsConfig.templateVariables.closingDelimiterToken;
    const regex = new RegExp(
      `${escapeRegex(openingDelimiterToken)}([\\s\\S]*?)${escapeRegex(closingDelimiterToken)}`,
      'g'
    );
    const hook = context.resolvedHooks.onTemplateVariable as
      | MarkdownTemplateVariableTransformHook
      | undefined;
    visit(context.tree, 'text', (node) => {
      const textNode = node as Text;
      textNode.value = textNode.value.replace(
        regex,
        (_fullMatch: string, variableSource: string) => {
          const variableName = String(variableSource).trim();
          const defaultPayload = {
            replacement: this.resolveBuiltInValue(variableName, context.globalContext),
            variableName,
          };
          const nextPayload =
            hook?.(defaultPayload, { fileContents: context.fileContents }, context.globalContext) ??
            defaultPayload;
          const parsed =
            syncFsTransformMarkdownTemplateVariablesPresetConfig.payloadSchema.safeParse(
              nextPayload
            );
          if (!parsed.success) {
            throw new Error(`onTemplateVariable returned invalid payload: ${parsed.error.message}`);
          }
          return (
            parsed.data.replacement ??
            `${openingDelimiterToken}${variableSource}${closingDelimiterToken}`
          );
        }
      );
    });
  }
}

/** Markdown template variables transform class. */
export class SyncFsTransformMarkdownTemplateVariablesPreset extends SyncFsTransformMarkdownBase {
  /** Returns markdown visitors for this transform preset. */
  override getVisitors(): SyncFsTransformMarkdownVisitorBase[] {
    return [new SyncFsTransformMarkdownVisitorTemplateVariables()];
  }
}

/** Shared config and schemas for markdown template variable transform. */
export const syncFsTransformMarkdownTemplateVariablesPresetConfig = {
  /** Payload schema used to validate `onTemplateVariable` return values. */
  payloadSchema: z.object({
    replacement: z.string().nullable(),
    variableName: z.string(),
  }),
  /** Hooks schema accepted under `transforms.hooks.SyncFsTransformMarkdownTemplateVariablesPreset`. */
  hooksSchema: z.object({
    onTemplateVariable: makeFunctionHookSchema<MarkdownTemplateVariableTransformHook>().optional(),
  }),
  /** Options schema for this transform preset. */
  optionsSchema: z.record(z.string(), z.unknown()),
};

/** Definition for markdown template variable transform preset. */
export const syncFsTransformMarkdownTemplateVariablesPreset = defineSyncFsTransform('markdown', {
  classRef: SyncFsTransformMarkdownTemplateVariablesPreset,
  defaultHookFns: {},
  defaultOptions: {},
  hookPayloadSchemas: {
    onTemplateVariable: syncFsTransformMarkdownTemplateVariablesPresetConfig.payloadSchema,
  },
  hooksSchema: syncFsTransformMarkdownTemplateVariablesPresetConfig.hooksSchema,
  name: 'SyncFsTransformMarkdownTemplateVariablesPreset',
  optionsSchema: syncFsTransformMarkdownTemplateVariablesPresetConfig.optionsSchema,
});
