import { describe, expect, test } from 'vite-plus/test';
import { clankgstersIdentity } from '../../common/clankgsters-identity.js';
import { clankgstersConfigResolver } from './config-resolver.js';

describe('clankgstersConfigResolver', () => {
  test('resolves and validates defaults', async () => {
    const result = await clankgstersConfigResolver.resolve({
      mode: 'sync',
      repoRoot: process.cwd(),
    });
    expect(result.isOk()).toBe(true);
    if (result.isErr()) return;
    expect(typeof result.value.resolvedConfig.loggingEnabled).toBe('boolean');
    expect(result.value.resolvedConfig.syncManifestPath).toBe('.clank/sync-manifest.json');
    expect(result.value.resolvedConfig.sourceDefaults.sourceDir).toBe('.clank');
    expect(result.value.resolvedConfig.sourceDefaults.markdownContextFileName).toBe('CLANK.md');
    expect(result.value.resolvedConfig.sourceDefaults.localMarketplaceName).toBe(
      clankgstersIdentity.LOCAL_MARKETPLACE_NAME
    );
  });
});
