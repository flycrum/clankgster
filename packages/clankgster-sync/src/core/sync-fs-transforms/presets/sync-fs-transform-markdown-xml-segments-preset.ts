import { z } from 'zod';
import { defineSyncFsTransform } from '../define-sync-fs-transform.js';
import { SyncFsTransformMarkdownBase } from '../sync-fs-transform-markdown-base.js';
import { SyncFsTransformMarkdownVisitorBase } from '../sync-fs-transform-visitor-base.js';
import type {
  SyncFsTransformGlobalContext,
  SyncFsTransformMarkdownPostStringifyVisitorContext,
} from '../sync-fs-transform.types.js';

/** Hook payload for markdown XML-segment transforms. */
export interface MarkdownXmlSegmentsTransformPayload {
  /** Parsed XML attributes from the opening tag. */
  attributes: Record<string, string>;
  /** Inner XML content between opening and closing tags. */
  innerContent: string;
  /** XML tag name. */
  tagName: string;
}

/** Hook context for markdown XML-segment transforms. */
export interface MarkdownXmlSegmentsTransformHookContext {
  /** Full source markdown contents. */
  fileContents: string;
}

/** Markdown XML-segment transform callback signature. */
export type MarkdownXmlSegmentsTransformHook = (
  payload: MarkdownXmlSegmentsTransformPayload,
  hookContext: MarkdownXmlSegmentsTransformHookContext,
  globalContext: SyncFsTransformGlobalContext
) => MarkdownXmlSegmentsTransformPayload;

function makeFunctionHookSchema<T>() {
  return z.custom<T>((value) => value == null || typeof value === 'function');
}

const xmlTagRegex = /<([A-Za-z][\w:-]*)(\s[^>]*)?>([\s\S]*?)<\/\1>/g;
const xmlAttributeRegex = /([^\s=]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>/]+))/g;

function parseXmlAttributes(attributesSource: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  xmlAttributeRegex.lastIndex = 0;
  let match = xmlAttributeRegex.exec(attributesSource);
  while (match != null) {
    const key = match[1] ?? '';
    const value = match[3] ?? match[4] ?? match[5] ?? '';
    if (key.length > 0) attributes[key] = value;
    match = xmlAttributeRegex.exec(attributesSource);
  }
  return attributes;
}

function stringifyXmlAttributes(attributes: Record<string, string>): string {
  const entries = Object.entries(attributes);
  if (entries.length === 0) return '';
  return ` ${entries.map(([key, value]) => `${key}="${value}"`).join(' ')}`;
}

function splitByCodeFences(contents: string): { isCodeFence: boolean; value: string }[] {
  const segments: { isCodeFence: boolean; value: string }[] = [];
  const fenceRegex = /```[\s\S]*?```/g;
  let lastIndex = 0;
  let match = fenceRegex.exec(contents);
  while (match != null) {
    const start = match.index;
    const end = start + match[0].length;
    if (start > lastIndex) {
      segments.push({ isCodeFence: false, value: contents.slice(lastIndex, start) });
    }
    segments.push({ isCodeFence: true, value: match[0] });
    lastIndex = end;
    match = fenceRegex.exec(contents);
  }
  if (lastIndex < contents.length) {
    segments.push({ isCodeFence: false, value: contents.slice(lastIndex) });
  }
  if (segments.length === 0) return [{ isCodeFence: false, value: contents }];
  return segments;
}

/** XML segment visitor for markdown transforms. */
export class SyncFsTransformMarkdownVisitorXmlSegments extends SyncFsTransformMarkdownVisitorBase {
  /** Rewrites XML-like segments in markdown string output. */
  override runOnMarkdownString(
    context: SyncFsTransformMarkdownPostStringifyVisitorContext
  ): string {
    const hook = context.resolvedHooks.onXmlTransform as
      | MarkdownXmlSegmentsTransformHook
      | undefined;
    if (hook == null) return context.markdown;
    return splitByCodeFences(context.markdown)
      .map((segment) => {
        if (segment.isCodeFence) return segment.value;
        const regex = new RegExp(xmlTagRegex.source, 'g');
        return segment.value.replace(
          regex,
          (_match, tagName: string, attrsSource: string | undefined, innerContent: string) => {
            const attributes = parseXmlAttributes(attrsSource ?? '');
            const defaultPayload = {
              attributes,
              innerContent,
              tagName,
            };
            const nextPayload = hook(
              defaultPayload,
              { fileContents: context.fileContents },
              context.globalContext
            );
            const parsed =
              syncFsTransformMarkdownXmlSegmentsPresetConfig.payloadSchema.safeParse(nextPayload);
            if (!parsed.success) {
              throw new Error(`onXmlTransform returned invalid payload: ${parsed.error.message}`);
            }
            const attrs = stringifyXmlAttributes(parsed.data.attributes);
            return `<${parsed.data.tagName}${attrs}>${parsed.data.innerContent}</${parsed.data.tagName}>`;
          }
        );
      })
      .join('');
  }
}

/** Markdown XML-segments transform class. */
export class SyncFsTransformMarkdownXmlSegmentsPreset extends SyncFsTransformMarkdownBase {
  /** Returns markdown visitors for this transform preset. */
  override getVisitors(): SyncFsTransformMarkdownVisitorBase[] {
    return [new SyncFsTransformMarkdownVisitorXmlSegments()];
  }
}

/** Shared config and schemas for markdown XML-segments transform. */
export const syncFsTransformMarkdownXmlSegmentsPresetConfig = {
  /** Payload schema used to validate `onXmlTransform` return values. */
  payloadSchema: z.object({
    tagName: z.string(),
    attributes: z.record(z.string(), z.string()),
    innerContent: z.string(),
  }),
  /** Hooks schema accepted under `transforms.hooks.SyncFsTransformMarkdownXmlSegmentsPreset`. */
  hooksSchema: z.object({
    onXmlTransform: makeFunctionHookSchema<MarkdownXmlSegmentsTransformHook>().optional(),
  }),
  /** Options schema for this transform preset. */
  optionsSchema: z.record(z.string(), z.unknown()),
};

/** Definition for markdown XML-segments transform preset. */
export const syncFsTransformMarkdownXmlSegmentsPreset = defineSyncFsTransform('markdown', {
  classRef: SyncFsTransformMarkdownXmlSegmentsPreset,
  defaultHookFns: {},
  defaultOptions: {},
  hookPayloadSchemas: {
    onXmlTransform: syncFsTransformMarkdownXmlSegmentsPresetConfig.payloadSchema,
  },
  hooksSchema: syncFsTransformMarkdownXmlSegmentsPresetConfig.hooksSchema,
  name: 'SyncFsTransformMarkdownXmlSegmentsPreset',
  optionsSchema: syncFsTransformMarkdownXmlSegmentsPresetConfig.optionsSchema,
});
