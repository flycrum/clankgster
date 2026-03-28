# Rawdocs sync execution model

This reference describes how `docsraw-sync-run` executes from input through final write.

## Core model

1. collect explicit target path,
2. normalize to target plugin root,
3. run two isolated analyses with non-overlapping scopes,
4. combine and refine planning output,
5. clear non-rawdocs outputs safely,
6. regenerate structured plugin outputs,
7. verify safety and boundary policies.

## Scope split

- `docsraw-analyze-raw`: only `rawdocs/**`.
- `docsraw-analyze-existing`: everything except `rawdocs/**`.

Together they form full plugin coverage without overlap.

## Strategic merge model

The merge process intentionally uses two sources of truth for different dimensions:

- **content truth:** what the raw source says and how it says it,
- **continuity truth:** how existing plugin structure behaves over repeated sync runs.

Both dimensions are required for durable output quality.

## Refinement pass role

The second refinement pass is mandatory and exists to:

- protect continuity from drift,
- identify justified structural evolution,
- enforce low-creativity style-preserving transfer,
- harden deletion/write safety.

## Repeat-run behavior

The model is designed for repeated execution as `rawdocs/` evolves.

Each run should:

- preserve stable structure when it still serves content,
- adapt structure when scale requires reorganization,
- keep `rawdocs/` untouched and non-linked from final outputs.
