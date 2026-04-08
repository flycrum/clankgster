# npm-release plugin

Internal reminder for publishing **`@clankgster/sync`** to npm: no extra release tooling in-repo—use **`npm version`** (or hand-edit `package.json`) and **`npm publish`** with an explicit **dist-tag** for prereleases.

## Purpose

- Pick **semver** (including **`0.1.0-alpha.N`**); commit on `main` before tagging.
- **Pre-flight:** `pnpm -F @clankgster/sync run check`, `pnpm -F @clankgster/sync run test`, then `pnpm --dir packages/clankgster-sync pack` and confirm the tarball’s `package.json` has concrete dependency ranges (no raw `catalog:`).
- **Publish:** from `packages/clankgster-sync`, `npm publish --tag alpha` (or `beta` / omit tag when promoting **`latest`**).
- **Git:** tag **`v<version>`** on the published commit and push the tag.

## Where humans look

- Package **README** and **[CHANGELOG.md](../../../CHANGELOG.md)** in `packages/clankgster-sync/`.
- This plugin folder does **not** ship a separate deploy skill yet; extend here if you add one, then run **Clankgster sync** so agent surfaces pick it up.
