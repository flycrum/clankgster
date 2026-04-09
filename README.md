# Clankgster

## Quick Start

```bash
npm install @clankgster/sync@alpha
```

Clankgster helps your team define agent behavior once and run it across Claude, Codex, Cursor, and more without maintaining separate stacks.

- 🎛️ One shared spec works across many agent front-ends
- 🧰 Flexible building blocks: skills, plugins, context files, rules, commands, and agents
- 🪁 Start small now, keep advanced switches ready when you need them

Naming note: use **Clankgster** for the project/package brand; repo config uses `clankgster.config.ts` at the root and `clankgsterConfig` from `@clankgster/sync`.

<img
  src="assets/story-sm.jpg"
  alt="Three-panel pixel comic: a small robot with a glowing face and wild blue hair looks puzzled at Claude, Codex, and Cursor; then powers up with the names; then floats at ease as the tools orbit calmly."
/>

## Go to clankgster-sync

Head to the [`@clankgster/sync` README](packages/clankgster-sync/README.md) for setup details, config patterns, and the full sync workflow.

## Monorepo (Vite+)

This repository is a **pnpm workspace** organized around the publishable sync package **[`@clankgster/sync`](packages/clankgster-sync/README.md)** (`packages/clankgster-sync`). Tooling follows **[Vite+](https://viteplus.dev/)**—the unified **`vp`** CLI for install, check, test, pack/build, and monorepo tasks—so day-to-day work looks like `vp install`, `vp check`, and `vp test` from the repo root.

- **`packages/clankgster-sync`** — Node + TypeScript (`tsx` scripts, `vp pack` for npm)
- **`packages/clankgster-sync-e2e`** — private e2e harness and tests against the sync package (`@clankgster/sync-e2e`)

Prereqs: **Node 22.12+** and global **`vp`** ([install](https://viteplus.dev/guide/)). Then: `vp install`, `vp check`, `vp test`.

## One more thing...for you humanoid

Not only does this monorepo contain the source for the Clankgster sync system, we're also a customer and use it to create, modify, and maintain our codebase! 😎

## Licensing

Clankgster is built to be openly usable by developers and teams while keeping source stewardship clear.

- Source code in this repository is licensed under the PolyForm Noncommercial License 1.0.0 (see `LICENSE`).
- The published npm package `@clankgster/sync` is distributed under MIT (see `packages/clankgster-sync/LICENSE`).
- This split keeps npm usage straightforward in real projects, while the repository source stays aligned with a noncommercial source-sharing model.
