import type { ClankgstersAgentConfig } from '../../configs/clankgsters-config.schema.js';
import { cursorAgentPresetConfig } from './cursor-agent-preset.config.js';

const { CONSTANTS } = cursorAgentPresetConfig;

/** Default Cursor preset behaviors for sync runs. */
export const cursorAgentPreset: ClankgstersAgentConfig = {
  enabled: true,
  behaviors: [
    { enabled: true, manifestKey: 'skillsDirectorySync', name: 'skillsSync', options: {} },
    {
      enabled: true,
      manifestKey: 'localPluginsContentSync',
      name: 'localContentSync',
      options: {
        customHandler: {},
        requiredManifestKey: CONSTANTS.SETTINGS_MANIFEST_KEY,
        targetRoot: CONSTANTS.LOCAL_CONTENT_TARGET_ROOT,
      },
    },
  ],
};
