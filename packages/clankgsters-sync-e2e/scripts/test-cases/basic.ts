import { e2eTestCase } from '../define-e2e-test-case.js';

export const testCase = e2eTestCase.define({
  config: {
    loggingEnabled: false,
    agents: {
      cursor: {
        enabled: true,
        behaviors: ['rules'],
      },
    },
  },
  description: 'basic single-agent case',
  jsonPath: 'scripts/test-cases/basic.json',
});
