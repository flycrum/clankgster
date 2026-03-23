import { describe, expect, test } from 'vite-plus/test';
import { syncManifest } from './sync-manifest.js';

describe('syncManifest', () => {
  test('registerEntry appends to agent list', () => {
    const initial = syncManifest.emptyManifest();
    const result = syncManifest.registerEntry(initial, 'cursor', { behavior: 'rules' });
    expect(result.isOk()).toBe(true);
    if (result.isErr()) return;
    expect(result.value.cursor).toHaveLength(1);
  });
});
