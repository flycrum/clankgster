const clankConfig = {
  loggingEnabled: false,
  agents: {
    claude: {
      enabled: true,
      behaviors: ['rules', 'commands', 'skills'],
    },
    cursor: {
      enabled: true,
      behaviors: ['rules', 'commands', 'skills'],
    },
    codex: {
      enabled: true,
      behaviors: ['rules', 'commands', 'skills'],
    },
  },
  excluded: ['dist', '.git', '.turbo', '.next', 'node_modules'],
};

export default clankConfig;
