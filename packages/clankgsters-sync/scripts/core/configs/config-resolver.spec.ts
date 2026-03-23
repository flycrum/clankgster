import { describe, expect, test } from 'vite-plus/test';
import { clankConfigResolver } from './config-resolver.js';

describe('clankConfigResolver', () => {
  test('resolves and validates defaults', async () => {
    const result = await clankConfigResolver.resolve({
      mode: 'sync',
      repoRoot: process.cwd(),
    });
    expect(result.isOk()).toBe(true);
    if (result.isErr()) return;
    expect(typeof result.value.resolvedConfig.loggingEnabled).toBe('boolean');
  });
});
