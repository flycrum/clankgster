import path from 'node:path';
import { describe, expect, test } from 'vite-plus/test';
import { clankgsterConfigSchema } from '../configs/clankgster-config.schema.js';
import { syncFsContentPipeline } from './sync-fs-content-pipeline.js';
import type { SyncFsTransformGlobalContext } from './sync-fs-transform.types.js';

function makeGlobalContext(
  overrides: Partial<SyncFsTransformGlobalContext> = {}
): SyncFsTransformGlobalContext {
  const repoRoot = '/repo';
  const resolvedConfig = clankgsterConfigSchema.config.parse({
    transforms: overrides.resolvedConfig?.transforms ?? {},
  });
  return {
    agentName: 'cursor',
    behaviorName: 'PluginsDirectorySyncPreset',
    destinationFileAbsolutePath: '/repo/.cursor/rules/foo/rule.mdc',
    destinationFileRelativePath: '.cursor/rules/foo/rule.mdc',
    outputRoot: repoRoot,
    repoRoot,
    resolvedConfig,
    sourceFileAbsolutePath: '/repo/.clank/plugins/foo/rules/rule.md',
    sourceFileRelativePath: '.clank/plugins/foo/rules/rule.md',
    sourceKind: 'rule',
    syncTimestampIso: '2026-03-25T00:00:00.000Z',
    ...overrides,
  };
}

describe('syncFsContentPipeline', () => {
  test('returns original contents in symlink mode', () => {
    const output = syncFsContentPipeline.process({
      artifactMode: 'symlink',
      contents: 'hello',
      globalContext: makeGlobalContext(),
    });
    expect(output).toBe('hello');
  });

  test('rewrites relative markdown links against destination file path', () => {
    const output = syncFsContentPipeline.process({
      artifactMode: 'copy',
      contents: '[docs](../references/README.md)',
      globalContext: makeGlobalContext(),
    });
    expect(output).toContain('../../../.clank/plugins/foo/references/README.md');
  });

  test('resolves built-in template variables and trims whitespace', () => {
    const output = syncFsContentPipeline.process({
      artifactMode: 'copy',
      contents:
        'a=[[[clankgster_agent_name]]], b=[[[ clankgster_time ]]], c=[[[       clankgster_agent_name]]]',
      globalContext: makeGlobalContext(),
    });
    expect(output).toContain('a=cursor');
    expect(output).toContain('b=2026-03-25T00:00:00.000Z');
    expect(output).toContain('c=cursor');
  });

  test('supports configurable template delimiters', () => {
    const output = syncFsContentPipeline.process({
      artifactMode: 'copy',
      contents: '[[clankgster_agent_name]]',
      globalContext: makeGlobalContext({
        resolvedConfig: clankgsterConfigSchema.config.parse({
          transforms: {
            templateVariables: {
              closingDelimiterToken: ']]',
              openingDelimiterToken: '[[',
            },
          },
        }),
      }),
    });
    expect(output).toContain('cursor');
  });

  test('leaves unknown template variables unchanged by default', () => {
    const output = syncFsContentPipeline.process({
      artifactMode: 'copy',
      contents: '[[[ my_custom_local_var ]]]',
      globalContext: makeGlobalContext(),
    });
    expect(output).toContain('[[[ my_custom_local_var ]]]');
  });

  test('applies xml hook outside fenced code blocks only', () => {
    const context = makeGlobalContext({
      resolvedConfig: clankgsterConfigSchema.config.parse({
        transforms: {
          hooks: {
            SyncFsTransformMarkdownXmlSegmentsPreset: {
              onXmlTransform: (payload: {
                attributes: Record<string, string>;
                innerContent: string;
                tagName: string;
              }) => ({
                ...payload,
                innerContent: payload.innerContent.toUpperCase(),
              }),
            },
          },
        },
      }),
    });
    const output = syncFsContentPipeline.process({
      artifactMode: 'copy',
      contents: '<thinking phase="a">hello</thinking>\n\n```md\n<thinking>skip</thinking>\n```',
      globalContext: context,
    });
    expect(output).toContain('<thinking phase="a">HELLO</thinking>');
    expect(output).toContain('<thinking>skip</thinking>');
  });

  test('validates hook payload shape via zod', () => {
    const context = makeGlobalContext({
      resolvedConfig: clankgsterConfigSchema.config.parse({
        transforms: {
          hooks: {
            SyncFsTransformMarkdownLinkPreset: {
              onLinkTransform: () => ({ linkUrl: 1 }) as unknown as never,
            },
          },
        },
      }),
    });
    expect(() =>
      syncFsContentPipeline.process({
        artifactMode: 'copy',
        contents: '[x](./x.md)',
        globalContext: context,
      })
    ).toThrow(/onLinkTransform returned invalid payload/);
  });

  test('default link rewrite keeps anchors and absolute urls unchanged', () => {
    const output = syncFsContentPipeline.process({
      artifactMode: 'copy',
      contents: '[a](#head) [b](https://example.com/x) [c](mailto:test@example.com)',
      globalContext: makeGlobalContext({
        destinationFileAbsolutePath: path.join('/repo', '.cursor', 'rules', 'foo', 'bar.mdc'),
      }),
    });
    expect(output).toContain('[a](#head)');
    expect(output).toContain('[b](https://example.com/x)');
    expect(output).toContain('[c](mailto:test@example.com)');
  });
});
