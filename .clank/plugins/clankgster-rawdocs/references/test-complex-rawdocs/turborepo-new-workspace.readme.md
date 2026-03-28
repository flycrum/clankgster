# Turborepo new workspace

## Purpose

- Creating new workspaces in the Mars monorepo: categories apps, packages. Agent reference. Related: [turborepo-general.readme.md](./turborepo-general.readme.md), [turborepo-dependencies.readme.md](./turborepo-dependencies.readme.md).

## Categories

- **apps** (Tauri/Vite apps), **packages** (publishable libs). Add under one. Package name: use `@mars/<name>` for packages (e.g. `@mars/dust-storm`); apps may be unscoped (e.g. `mars-lander`). Directory path is separate (e.g. `packages/dust-storm/`, `apps/mars-lander/`). Refs: [apps/mars-lander/package.json](../apps/mars-lander/package.json), [packages/dust-storm/package.json](../packages/dust-storm/package.json).

## Config

- ESLint, Prettier, TypeScript config live at repo root ([eslint.config.js](../eslint.config.js), [prettier.config.js](../prettier.config.js), [tsconfig.base.json](../tsconfig.base.json)). Workspaces extend or use root config; no separate configs workspace.

## Samples

- For apps, reference [apps/mars-lander](../apps/mars-lander): Tauri + Vite, Vue, workspace dep on @mars/dust-storm.
- For packages, reference [packages/dust-storm](../packages/dust-storm): publishable design-system package, workspace dep, dist output.
