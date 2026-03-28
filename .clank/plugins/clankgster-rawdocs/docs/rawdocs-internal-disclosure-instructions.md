# Internal disclosure instructions (clankgster-rawdocs)

## Purpose

Hold the full non-portability explanation for internal `clankgster-rawdocs` docs so each file can keep a short, identical 🔑 scope blockquote and link here instead of repeating long paragraphs.

**Do not** treat anything that links here as binding guidance for paths outside this plugin root.

Companion to the blockquote at the top of selected internal docs: `🔑🔑🔑 **Scope (clankgster-rawdocs only).**` plus an inline link to this file. **Use that single blockquote** so scope wording stays consistent.

## What that scope means

- The parent document's rules, guidelines, terminology, or contracts apply **only** to this plugin root and everything nested under it.
- They are **not** portable defaults for the wider Clankgster ecosystem.

## Do not apply this material outside `clankgster-rawdocs`

Unless you are explicitly editing **inside this plugin root**, do **not** treat these internal docs as authority for:

- Other plugin roots under source pathway `plugins/` (for example `plugins/<other-plugin>/`)
- Standalone source pathway `skills/` trees (for example `skills/<name>/`, `skills.local/<name>/`, `<prefix>-skills/<name>/`, `<prefix>-skills.local/<name>/`)
- `CLANK.md` files at any path outside this plugin

## For maintainers

When you add another internal doc that carries the 🔑 scope line, link to this file with the same relative pattern as sibling internal references.
