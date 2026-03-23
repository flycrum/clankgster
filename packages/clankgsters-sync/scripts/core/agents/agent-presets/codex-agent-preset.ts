import type { ClankgstersAgentConfig } from '../../configs/clankgsters-config.schema.js';
import { codexAgentPresetConfig } from './codex-agent-preset.config.js';

const { CONSTANTS } = codexAgentPresetConfig;

/** Default Codex preset behaviors for sync runs. */
export const codexAgentPreset: ClankgstersAgentConfig = {
  enabled: true,
  behaviors: [
    {
      enabled: true,
      manifestKey: 'markdownContextSymlink',
      name: 'markdownContextSymlink',
      options: {
        targetFile: CONSTANTS.MARKDOWN_CONTEXT_TARGET_FILE_NAME,
        gitignoreComment: CONSTANTS.GITIGNORE_COMMENT,
        gitignoreEntry: CONSTANTS.GITIGNORE_ENTRY,
      },
    },
    { enabled: true, manifestKey: 'skillsDirectorySync', name: 'skillsSync', options: {} },
    {
      enabled: true,
      manifestKey: 'markdownSectionSync',
      name: 'markdownSectionSync',
      options: {
        agentsFile: CONSTANTS.MARKDOWN_SECTION_FILE,
        sectionHeading: CONSTANTS.MARKDOWN_SECTION_HEADING,
      },
    },
  ],
};
