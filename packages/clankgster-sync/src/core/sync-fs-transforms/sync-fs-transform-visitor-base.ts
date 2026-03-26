import type {
  SyncFsTransformMarkdownPostStringifyVisitorContext,
  SyncFsTransformMarkdownVisitorContext,
} from './sync-fs-transform.types.js';

/** Base class for markdown transform visitors. */
export class SyncFsTransformMarkdownVisitorBase {
  /** Runs on markdown AST before stringify. */
  runOnMarkdownTree(_context: SyncFsTransformMarkdownVisitorContext): void {}

  /** Runs on markdown string after stringify. */
  runOnMarkdownString(context: SyncFsTransformMarkdownPostStringifyVisitorContext): string {
    return context.markdown;
  }
}
