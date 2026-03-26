import { SyncFsTransformBase } from './sync-fs-transform-base.js';
import type { SyncFsTransformMarkdownVisitorBase } from './sync-fs-transform-visitor-base.js';

/** Base class for markdown-specific transforms. */
export class SyncFsTransformMarkdownBase extends SyncFsTransformBase {
  constructor() {
    super('markdown');
  }

  /** Returns visitors used by this markdown transform. */
  getVisitors(): SyncFsTransformMarkdownVisitorBase[] {
    return [];
  }
}
