# Verification — complex continuity test

- [ ] `TARGET_PLUGIN_PATH` was created via [`rawdocs-seed-test-iterative-syncs`](../../skills/seed-test-iterative-syncs/SKILL.md) (or equivalent steps)
- [ ] `rawdocs/` was seeded with the five files from [`test-complex-rawdocs/`](../test-complex-rawdocs/) (same filenames)
- [ ] Both structural sync runs completed
- [ ] Both analysis snapshots excluded `rawdocs/`
- [ ] Only scaffold creation ran in a sub-agent; later steps ran in-session
- [ ] The `## Rule: assert only on types from the API` section was removed from `rawdocs/testing-types.readme.md` between runs
- [ ] Run-1 and run-2 source-to-output trace map artifacts are included
- [ ] Before/after comparison includes file-level and content-level conclusions
- [ ] Results include a capped change-cases table with 10 or fewer rows
- [ ] Final verdict explicitly evaluates the continuity goal from [`rawdocs-structify-architecture.md`](../rawdocs-structify-architecture.md)
