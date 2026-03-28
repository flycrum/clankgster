# Required report shape (continuity tests)

Return:

1. Target paths used
1. Run 1 non-`rawdocs/` output snapshot
1. Run 2 non-`rawdocs/` output snapshot
1. Run 1 source-to-output trace map artifact (tiny mapping)
1. Run 2 source-to-output trace map artifact (tiny mapping)
1. A markdown table of change-cases (**up to 10 rows, no more than 10**)

**Table schema:**

| Column | Notes |
|--------|--------|
| `case_id` | Short id |
| `summary` | One line |
| `before_path` | Path or `—` |
| `after_path` | Path or `—` |
| `change_type` | One of: `file content modification change`, `file content removal change`, `file content additional change` |

1. Diff summary (before vs after), including files added/removed/modified and lines added/removed
1. Churn severity (see [shared-churn-severity.md](shared-churn-severity.md))
1. Goal-by-goal verdict with status markers (`✅ pass`, `🥕 partial`, `❌ fail`)
1. Concise recommendations if continuity is weak
