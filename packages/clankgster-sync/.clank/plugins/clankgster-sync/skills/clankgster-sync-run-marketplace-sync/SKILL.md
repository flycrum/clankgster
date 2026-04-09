---
name: clankgster-sync-run-marketplace-sync
description: >-
  Run @clankgster/sync so Cursor, Claude Code, and Codex pick up .clank/ — pnpm clankgster-sync:run or clankgster-sync:clear from monorepo root (see packages/clankgster-sync/package.json). Refreshes .cursor rules/skills, marketplace manifests, AGENTS.override.md, sync cache. Triggers — after editing plugins or skills, clankgster.config.ts, git pull, “run sync”, “refresh marketplace”, “rules not updating”, “skills missing”, troubleshooting discovery. Do not hand-fix .cursor/; fix sources and re-run.
---

# Run marketplace sync scripts

Use this skill when you need to **run the Clankgster sync scripts** (sync or clear) so Cursor, Claude, and Codex see the latest `.clank/` sources. Behavior summary: [sync behavior and config](../../references/clankgster-sync-sync-behavior-and-config.md); trust workflow: [trust sync](../../references/clankgster-sync-trust-sync-and-sources.md).

## When to use

- After adding or changing anything under `.clank/` (plugins, flat skills, rules) or `clankgster.config.ts`
- After `git pull` / merge (or use a post-merge hook if you add one)
- User asks to "sync agent marketplaces", "refresh plugins", or "run clankgster sync"

## How to run

**Always read** `packages/clankgster-sync/package.json` for exact script names — they can change.

From **monorepo root** (typical):

```bash
pnpm clankgster-sync:run
pnpm clankgster-sync:clear
```

These delegate to `clankgster-sync run|clear` via the package bin abstraction. In this monorepo, package scripts set source execution mode for no-build TS development; for published consumers, the same bin surface defaults to prebuilt runtime entries. For npm consumers, run `clankgster-sync` with `CLANKGSTER_REPO_ROOT` set to the target project root when needed (see [package README](../../../README.md)).

## After sync

Confirm expected outputs (rules, skills, manifests). Do **not** hand-edit `.cursor/` or `.claude/` to “fix” gaps — fix sources or sync. See [trust sync](../../references/clankgster-sync-trust-sync-and-sources.md).

## Config and E2E

Config and E2E: [sync behavior and config](../../references/clankgster-sync-sync-behavior-and-config.md).
