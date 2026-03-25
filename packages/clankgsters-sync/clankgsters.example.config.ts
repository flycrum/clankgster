import { clankgstersConfig } from './config/index.js';

/** Example team config template; remove `.example` from the filename to activate as repo-root `clankgsters.config.ts`. */
const clankgsters = clankgstersConfig.define({
  loggingEnabled: false,
  agents: {
    claude: true,
    cursor: true,
    codex: true,
  },
  excluded: ['dist', '.git', '.next', 'node_modules'],
});

export default clankgsters;
