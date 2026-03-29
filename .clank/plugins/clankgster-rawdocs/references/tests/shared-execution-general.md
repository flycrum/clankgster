# Shared execution flow (general)

Use with the `TARGET_PLUGIN_PATH` defined by the parent continuity skill.

## Execution mode

1. Run scaffold creation in a sub-agent only when the parent skill requires it.
1. Run the remaining continuity steps in-session unless the user explicitly asks otherwise.

## Ordered partials

1. [shared-execution-run-1.md](shared-execution-run-1.md)
1. [shared-execution-mutation-window.md](shared-execution-mutation-window.md)
1. [shared-execution-run-2.md](shared-execution-run-2.md)
