# Rawdocs internal linking boundary

> 🔑🔑🔑 **Scope (clankgster-rawdocs only).** Non-portability: [rawdocs-internal-disclosure-instructions.md](rawdocs-internal-disclosure-instructions.md).

**Purpose:** Enforce a strict, permanent boundary between a target plugin's `rawdocs/` source-input zone and every normal plugin pathway (`rules/`, `skills/`, `references/`, `docs/`, `agents/`, `hooks/`, root index files).

## Rule

Treat `rawdocs/` as ingest-only input for sync workflows.

Files outside `rawdocs/` must never include markdown links to `rawdocs/` content. This prohibition is absolute and non-expiring.

This rule exists to prevent accidental dependency on unstable raw inputs and to keep authored plugin pathways clean, durable, and navigable.

## Hard requirements

1. Do not add markdown links from non-`rawdocs/` files to `rawdocs/` files.
2. Do not add relative links, absolute links, reference links, or alias links that resolve into `rawdocs/`.
3. Do not use `rawdocs/` as a documentation hub for normal plugin navigation.
4. Do not cite `rawdocs/` files as required reading from `rules/`, `skills/`, `references/`, or `docs/`.
5. If a normal pathway needs shareable prose, move that prose into an allowed pathway and link there.

## Clarifications

- It is acceptable for sync workflows to read `rawdocs/` during analysis.
- It is acceptable to mention `rawdocs/` as a concept in explanatory text.
- It is not acceptable to create followable links into `rawdocs/` from normal plugin files.

## Why repeated reminders are required

The boundary is frequently restated in this plugin by design. Repetition is not redundancy; repetition is a safety mechanism that reduces drift and prevents future interpretation errors.

## When it applies

- Creating or editing any file in plugin pathways outside `rawdocs/`
- Designing sync workflows that ingest raw input
- Reviewing internal links for policy compliance

## When it does not apply

- A user directly reading files inside `rawdocs/` in their editor
- Internal runtime file reads performed by `docsraw-*` analysis logic
