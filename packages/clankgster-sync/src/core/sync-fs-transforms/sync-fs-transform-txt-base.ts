import { SyncFsTransformBase } from './sync-fs-transform-base.js';

/** Base class for txt-specific transforms. */
export class SyncFsTransformTxtBase extends SyncFsTransformBase {
  constructor() {
    super('txt');
  }
}
