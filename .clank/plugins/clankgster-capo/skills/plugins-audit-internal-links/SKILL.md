---
name: plugins-audit-internal-links
description: >-
  Audits relative markdown links within a plugin. Resolves each target path,
  checks existence, and flags broken or mismatched references.
---

# Audit plugin internal links

## Scope

Audit relative markdown links in one plugin directory.
Shared scope guidance: [internal-links-scope.md](../../references/common-audit/internal-links-scope.md)

## Out of scope

- Same-file anchors only (`#...`) as the **sole** target (no file path)
- Relative targets that appear only inside fenced code blocks (template examples); see [internal-links-scope.md](../../references/common-audit/internal-links-scope.md)

## In scope

- Cross-file relative links in normal markdown body text (rendered as followable links)

## Steps

Apply [plugins-target-input.md](../plugins-audit-full-suite-plugin/resources/plugins-target-input.md): user path gate and validation as written (including sub-agent handoff); then shared audit steps.

Use shared steps: [internal-links-steps.md](../../references/common-audit/internal-links-steps.md)

## Output format

Use shared output format: [internal-links-output-format.md](../../references/common-audit/internal-links-output-format.md)

## Verification

Use shared verification: [internal-links-verification.md](../../references/common-audit/internal-links-verification.md)

## Cross-references

Use shared references: [internal-links-cross-references.md](../../references/common-audit/internal-links-cross-references.md)
