import type { Root } from 'mdast';
import remarkFrontmatter from 'remark-frontmatter';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { syncFsContentPipelineConfig } from './sync-fs-content-pipeline.config.js';
import { SyncFsTransformMarkdownBase } from './sync-fs-transform-markdown-base.js';
import { syncFsTransformRegistry } from './sync-fs-transform-registry.js';
import type { SyncFsTransformGlobalContext } from './sync-fs-transform.types.js';

/** Input for one copy-mode markdown content processing call. */
export interface SyncFsContentPipelineInput {
  /** Active artifact mode for the current sync operation. */
  artifactMode: 'copy' | 'symlink';
  /** Raw markdown contents from source file. */
  contents: string;
  /** Shared metadata/context available to all transforms. */
  globalContext: SyncFsTransformGlobalContext;
}

/** Creates a unified markdown parser/stringifier pipeline with frontmatter support. */
function createMarkdownProcessor() {
  return unified().use(remarkParse).use(remarkFrontmatter, ['yaml']).use(remarkStringify);
}

/** Markdown parse/transform/stringify pipeline used for copy-mode file syncing. */
export const syncFsContentPipeline = {
  /** Processes markdown content in copy mode; returns original text for symlink mode. */
  process(input: SyncFsContentPipelineInput): string {
    if (input.artifactMode === 'symlink') return input.contents;
    const processor = createMarkdownProcessor();
    const tree = processor.parse(input.contents) as Root;
    const runtimeDefinitions = syncFsTransformRegistry.resolveRuntimeDefinitions(
      input.globalContext.resolvedConfig.transforms
    );
    const markdownDefinitions = Object.values(runtimeDefinitions).filter(
      (definition) => definition.fileType === 'markdown'
    );
    for (const definition of markdownDefinitions) {
      const optionsRaw =
        input.globalContext.resolvedConfig.transforms.options[definition.name] ?? {};
      const hooksRaw = input.globalContext.resolvedConfig.transforms.hooks[definition.name] ?? {};
      const optionsParsed = definition.optionsSchema.safeParse({
        ...definition.defaultOptions,
        ...optionsRaw,
      });
      if (!optionsParsed.success) {
        throw new Error(
          `sync fs transform ${definition.name} options invalid: ${optionsParsed.error.message}`
        );
      }
      const hooksParsed = definition.hooksSchema.safeParse({
        ...definition.defaultHookFns,
        ...hooksRaw,
      });
      if (!hooksParsed.success) {
        throw new Error(
          `sync fs transform ${definition.name} hooks invalid: ${hooksParsed.error.message}`
        );
      }
      const instance = new definition.classRef();
      if (!(instance instanceof SyncFsTransformMarkdownBase)) {
        throw new Error(
          `sync fs transform ${definition.name} resolved for markdown but class type mismatch`
        );
      }
      for (const visitor of instance.getVisitors()) {
        visitor.runOnMarkdownTree({
          fileContents: input.contents,
          globalContext: input.globalContext,
          options: optionsParsed.data,
          resolvedHooks: hooksParsed.data,
          tree,
        });
      }
    }
    let rendered = syncFsContentPipelineConfig.restoreEscapedTemplateTokens(
      String(processor.stringify(tree))
    );
    for (const definition of markdownDefinitions) {
      const optionsRaw =
        input.globalContext.resolvedConfig.transforms.options[definition.name] ?? {};
      const hooksRaw = input.globalContext.resolvedConfig.transforms.hooks[definition.name] ?? {};
      const optionsParsed = definition.optionsSchema.safeParse({
        ...definition.defaultOptions,
        ...optionsRaw,
      });
      if (!optionsParsed.success) continue;
      const hooksParsed = definition.hooksSchema.safeParse({
        ...definition.defaultHookFns,
        ...hooksRaw,
      });
      if (!hooksParsed.success) continue;
      const instance = new definition.classRef();
      if (!(instance instanceof SyncFsTransformMarkdownBase)) continue;
      for (const visitor of instance.getVisitors()) {
        rendered = visitor.runOnMarkdownString({
          fileContents: input.contents,
          globalContext: input.globalContext,
          markdown: rendered,
          options: optionsParsed.data,
          resolvedHooks: hooksParsed.data,
        });
      }
    }
    return rendered;
  },
};
