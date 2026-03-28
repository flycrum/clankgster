# Rawdocs capo dependencies and exceptions

This reference explains intentional dependency on `clankgster-capo` and the cross-plugin linking exception used by `clankgster-rawdocs`.

## Why dependency exists

`clankgster-rawdocs` is an execution layer for plugin-organization workflows. It relies on mature guidance already maintained in `clankgster-capo` for:

- plugin content-type organization,
- plugin writing conventions,
- skill structure patterns,
- sub-agent orchestration models.

## Primary capo references

- `.clank/plugins/clankgster-capo/rules/common-organizing-content.md`
- `.clank/plugins/clankgster-capo/skills/plugins-write-context/SKILL.md`
- `.clank/plugins/clankgster-capo/skills/plugins-write-context/reference.md`
- `.clank/plugins/clankgster-capo/skills/skills-write-context/reference.md`
- `.clank/plugins/clankgster-capo/skills/plugins-audit-full-suite-plugin/SKILL.md`

## Cross-plugin exception statement

Cross-plugin markdown links are generally avoided in plugin authoring due to coupling risk. `clankgster-rawdocs` is an intentional exception because its purpose explicitly extends and operationalizes capo methods.

This exception should remain narrow:

- link only to durable, high-value capo references,
- avoid broad dependency sprawl,
- keep rawdocs plugin logic coherent if specific capo docs evolve.

## Maintenance guidance

When capo references move or change:

1. update this reference and any affected skill links,
2. preserve behavior intent in docsraw skills even if link paths change,
3. prefer stable rule/reference anchors over deep incidental docs.
