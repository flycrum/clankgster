/**
 * Optional Vitest `typecheck` include for `*.spec-d.ts` pattern tests.
 * Merge into `defineConfig` beside `monoBaseVitestNodeConfig` when a package uses that convention.
 */
export const monoBaseVitestSpecDTypecheckConfig = {
  typecheck: {
    include: ['src/**/*.spec-d.ts'],
  },
};
