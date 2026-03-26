import type { SyncFsTransformFileType } from './sync-fs-transform.types.js';

/** Base class for all file-system content transforms. */
export class SyncFsTransformBase {
  /** Supported file type for this transform class. */
  readonly fileType: SyncFsTransformFileType;

  constructor(fileType: SyncFsTransformFileType) {
    this.fileType = fileType;
  }
}
