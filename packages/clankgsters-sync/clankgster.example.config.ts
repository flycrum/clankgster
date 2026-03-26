import { clankgstersConfig } from './src/index.js';

/** Example team config template; remove `.example` from the filename to activate as repo-root `clankgster.config.ts`. */
const clankgster = clankgstersConfig.define({
  loggingEnabled: false,
  agents: {
    claude: true,
    cursor: true,
    codex: true,
  },
  excluded: ['dist', '.git', '.next', 'node_modules'],
});

export default clankgster;
