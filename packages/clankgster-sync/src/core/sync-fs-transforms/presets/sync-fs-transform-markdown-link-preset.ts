import type { Link } from 'mdast';
import { toString } from 'mdast-util-to-string';
import path from 'node:path';
import { visit } from 'unist-util-visit';
import { z } from 'zod';
import { defineSyncFsTransform } from '../define-sync-fs-transform.js';
import { SyncFsTransformMarkdownBase } from '../sync-fs-transform-markdown-base.js';
import { SyncFsTransformMarkdownVisitorBase } from '../sync-fs-transform-visitor-base.js';
import type {
  SyncFsTransformGlobalContext,
  SyncFsTransformMarkdownVisitorContext,
} from '../sync-fs-transform.types.js';

/** Hook payload for markdown link transforms. */
export interface MarkdownLinkTransformPayload {
  /** Rendered link label text. */
  linkName: string;
  /** Link target URL/path. */
  linkUrl: string;
}

/** Hook context for markdown link transforms. */
export interface MarkdownLinkTransformHookContext {
  /** Full source markdown contents. */
  fileContents: string;
}

/** Markdown link transform callback signature. */
export type MarkdownLinkTransformHook = (
  payload: MarkdownLinkTransformPayload,
  hookContext: MarkdownLinkTransformHookContext,
  globalContext: SyncFsTransformGlobalContext
) => MarkdownLinkTransformPayload;

function makeFunctionHookSchema<T>() {
  return z.custom<T>((value) => value == null || typeof value === 'function');
}

function parseLinkUrlParts(linkUrl: string): { basePath: string; suffix: string } {
  const match = /^([^?#]*)([?#].*)?$/.exec(linkUrl);
  return {
    basePath: match?.[1] ?? linkUrl,
    suffix: match?.[2] ?? '',
  };
}

function isNonRewritableLinkUrl(url: string): boolean {
  return (
    url.startsWith('#') ||
    url.startsWith('mailto:') ||
    url.startsWith('http://') ||
    url.startsWith('https://')
  );
}

/** Link visitor for markdown transforms. */
export class SyncFsTransformMarkdownVisitorLink extends SyncFsTransformMarkdownVisitorBase {
  /** Computes the default payload before optional hook overrides. */
  private defaultPayload(
    rawLinkName: string,
    rawLinkUrl: string,
    globalContext: SyncFsTransformGlobalContext
  ): MarkdownLinkTransformPayload {
    if (isNonRewritableLinkUrl(rawLinkUrl)) {
      return {
        linkName: rawLinkName,
        linkUrl: rawLinkUrl,
      };
    }
    const parsed = parseLinkUrlParts(rawLinkUrl);
    const basePath = parsed.basePath.trim();
    if (basePath.length === 0 || basePath.startsWith('/')) {
      return {
        linkName: rawLinkName,
        linkUrl: rawLinkUrl,
      };
    }
    const sourceDir = path.dirname(globalContext.sourceFileAbsolutePath);
    const destinationDir = path.dirname(globalContext.destinationFileAbsolutePath);
    const resolvedTarget = path.resolve(sourceDir, basePath);
    const repoRootResolved = path.resolve(globalContext.repoRoot);
    if (!resolvedTarget.startsWith(repoRootResolved)) {
      return {
        linkName: rawLinkName,
        linkUrl: rawLinkUrl,
      };
    }
    const rewritten = path.relative(destinationDir, resolvedTarget).replace(/\\/g, '/');
    return {
      linkName: rawLinkName,
      linkUrl: `${rewritten}${parsed.suffix}`,
    };
  }

  /** Rewrites markdown link nodes in-place. */
  override runOnMarkdownTree(context: SyncFsTransformMarkdownVisitorContext): void {
    const hook = context.resolvedHooks.onLinkTransform as MarkdownLinkTransformHook | undefined;
    visit(context.tree, 'link', (node) => {
      const linkNode = node as Link;
      const defaultPayload = this.defaultPayload(
        toString(linkNode),
        linkNode.url,
        context.globalContext
      );
      const nextPayload =
        hook?.(defaultPayload, { fileContents: context.fileContents }, context.globalContext) ??
        defaultPayload;
      const parsed = syncFsTransformMarkdownLinkPresetConfig.payloadSchema.safeParse(nextPayload);
      if (!parsed.success) {
        throw new Error(`onLinkTransform returned invalid payload: ${parsed.error.message}`);
      }
      linkNode.url = parsed.data.linkUrl;
    });
  }
}

/** Markdown link transform class. */
export class SyncFsTransformMarkdownLinkPreset extends SyncFsTransformMarkdownBase {
  /** Returns markdown visitors for this transform preset. */
  override getVisitors(): SyncFsTransformMarkdownVisitorBase[] {
    return [new SyncFsTransformMarkdownVisitorLink()];
  }
}

/** Shared config and schemas for markdown link transform. */
export const syncFsTransformMarkdownLinkPresetConfig = {
  /** Payload schema used to validate `onLinkTransform` return values. */
  payloadSchema: z.object({
    linkName: z.string(),
    linkUrl: z.string(),
  }),
  /** Hooks schema accepted under `transforms.hooks.SyncFsTransformMarkdownLinkPreset`. */
  hooksSchema: z.object({
    onLinkTransform: makeFunctionHookSchema<MarkdownLinkTransformHook>().optional(),
  }),
  /** Options schema for this transform preset. */
  optionsSchema: z.record(z.string(), z.unknown()),
};

/** Definition for markdown link transform preset. */
export const syncFsTransformMarkdownLinkPreset = defineSyncFsTransform('markdown', {
  classRef: SyncFsTransformMarkdownLinkPreset,
  defaultHookFns: {},
  defaultOptions: {},
  hookPayloadSchemas: {
    onLinkTransform: syncFsTransformMarkdownLinkPresetConfig.payloadSchema,
  },
  hooksSchema: syncFsTransformMarkdownLinkPresetConfig.hooksSchema,
  name: 'SyncFsTransformMarkdownLinkPreset',
  optionsSchema: syncFsTransformMarkdownLinkPresetConfig.optionsSchema,
});
