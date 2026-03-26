import { syncFsTransformMarkdownLinkPreset } from './sync-fs-transform-markdown-link-preset.js';
import { syncFsTransformMarkdownTemplateVariablesPreset } from './sync-fs-transform-markdown-template-variables-preset.js';
import { syncFsTransformMarkdownXmlSegmentsPreset } from './sync-fs-transform-markdown-xml-segments-preset.js';

/** Built-in sync fs transform preset definitions keyed by definition name. */
export const syncFsTransformBuiltinPresets = {
  DEFINITIONS: {
    [syncFsTransformMarkdownLinkPreset.name]: syncFsTransformMarkdownLinkPreset,
    [syncFsTransformMarkdownTemplateVariablesPreset.name]:
      syncFsTransformMarkdownTemplateVariablesPreset,
    [syncFsTransformMarkdownXmlSegmentsPreset.name]: syncFsTransformMarkdownXmlSegmentsPreset,
  },
} as const;
