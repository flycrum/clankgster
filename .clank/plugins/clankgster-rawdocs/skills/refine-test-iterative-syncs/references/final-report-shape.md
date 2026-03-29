# Final report shape

The orchestrator final output must include all sections below.

## 1) Controls

- `target_plugin_path`
- `iteration_budget`
- strict full-budget mode state

## 2) Round ledger summary

- total rounds executed
- ordered list of round IDs
- mutation profile index by round

## 3) Trend summary

- churn trend (`none`/`low`/`medium`/`high`)
- continuity stability trend
- subtractive honesty trend
- bucket-fit trend
- goal pass-rate trend

## 4) Goal score rollup

Roll up pass/partial/fail by criterion from [`sync-goals-and-bucketing-criteria.md`](sync-goals-and-bucketing-criteria.md).

For any criterion not passing, include:

1. top failure signatures
2. impacted files or buckets
3. next-cycle correction proposal

## 5) Patch ledger rollup

- patch count by target area (`struct-sync`, references, test harness)
- per-patch linked failure signatures
- observed impact notes

## 6) Reliability assertions

- fixture seeded once before loop
- full budget completed without skipped rounds
- no script-based loop automation
- report shape compliance confirmed for each round

## 7) Final recommendations

- prioritized next-cycle actions
- explicit risks and monitoring focus
- suggested next iteration budget
