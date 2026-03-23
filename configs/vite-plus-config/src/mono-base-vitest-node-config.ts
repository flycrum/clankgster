/**
 * Shared Vitest fragment for Node packages.
 * Tests still import from `vite-plus/test` (no `globals: true` needed).
 */
export const monoBaseVitestNodeConfig = {
  test: {
    include: ['**/*.test.ts', '**/*.spec.ts'],
    environment: 'node',
  },
};
