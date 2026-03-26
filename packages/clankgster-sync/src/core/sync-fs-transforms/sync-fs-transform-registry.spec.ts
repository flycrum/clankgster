import { describe, expect, test } from 'vite-plus/test';
import { z } from 'zod';
import { defineSyncFsTransform } from './define-sync-fs-transform.js';
import { SyncFsTransformMarkdownBase } from './sync-fs-transform-markdown-base.js';
import { syncFsTransformRegistry } from './sync-fs-transform-registry.js';

class TestMarkdownTransform extends SyncFsTransformMarkdownBase {}

describe('syncFsTransformRegistry', () => {
  test('returns built-in definitions', () => {
    const builtins = syncFsTransformRegistry.getBuiltInDefinitions();
    expect(Object.keys(builtins)).toContain('SyncFsTransformMarkdownLinkPreset');
    expect(Object.keys(builtins)).toContain('SyncFsTransformMarkdownTemplateVariablesPreset');
    expect(Object.keys(builtins)).toContain('SyncFsTransformMarkdownXmlSegmentsPreset');
  });

  test('applies transforms.registry override', () => {
    const custom = defineSyncFsTransform('markdown', {
      classRef: TestMarkdownTransform,
      hooksSchema: z.object({}),
      name: 'TestMarkdownTransform',
      optionsSchema: z.record(z.string(), z.unknown()),
    });
    const runtime = syncFsTransformRegistry.resolveRuntimeDefinitions({
      registry: (definitions) => ({
        ...definitions,
        [custom.name]: custom,
      }),
    });
    expect(runtime.TestMarkdownTransform).toBe(custom);
  });

  test('throws for invalid class/fileType combinations', () => {
    const badDefinition = {
      classRef: class {},
      defaultHookFns: {},
      defaultOptions: {},
      fileType: 'markdown',
      hookPayloadSchemas: {},
      hooksSchema: z.object({}),
      name: 'BadDefinition',
      optionsSchema: z.record(z.string(), z.unknown()),
    };
    expect(() =>
      syncFsTransformRegistry.assertValidDefinitionMap({
        BadDefinition: badDefinition as never,
      })
    ).toThrow(/does not extend SyncFsTransformMarkdownBase/);
  });
});
