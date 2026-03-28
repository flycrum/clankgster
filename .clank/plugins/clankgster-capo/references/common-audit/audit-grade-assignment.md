# Audit grade assignment (aggregators)

Use this in top-level pathway aggregators (`plugins-audit-full-suite-plugin`, `skills-audit-full-suite-skill`, `clankmd-audit-full-suite-md`) after collecting all leaf reports.

## 5. Grade assignment

Derive one overall pathway grade from aggregated findings.

### Grade calculation

1. Count findings from all leaf reports by severity:
   - `critical`
   - `high`
   - `medium`
   - `low`
2. Compute total findings and weighted score:
   - `score = critical*8 + high*5 + medium*3 + low*1`
3. Assign grade from score and critical presence:

| Grade | Criteria |
| ------ | ------ |
| **A+** | score = 0 and no findings |
| **A** | score <= 3 and no critical/high |
| **A-** | score <= 8 and no critical |
| **B+** | score <= 14 and <= 1 high, no critical |
| **B** | score <= 22 and <= 2 high, no critical |
| **B-** | score <= 30 and <= 3 high, no critical |
| **C+** | score <= 40 and <= 1 critical |
| **C** | score <= 52 |
| **C-** | score <= 66 |
| **D+** | score <= 82 |
| **D** | score <= 100 |
| **F** | score > 100 or >= 3 critical |

### Grade characterization and badge

Render grade plus characterization and ASCII art badge in aggregator output.

#### Creative variation

Use these as base templates, not fixed output. Keep `GRADE: X` exact and keep art to <=10 lines. Vary expression/accessories/props between runs while preserving grade theme.

**F — Baboon**  
The content appears to have been composed by enthusiastic primates banging on keyboards. Impressive effort; zero signal.

```md
    .---.
   / o o \
  (   >   )
   \ --- /
    |   |
   _|   |_
  (_______)
  GRADE: F
```

**D — Parrot**  
Lots of words repeated back with confidence. Unfortunately, none of them help the agent do its job.

```md
     __
    /  \  ~~
   | oo |/
   |  > |
    \__/
    /||\
   / || \
  GRADE: D
```

**D+ — Scribe**  
Somebody tried to document things. The spirit is willing; the prompt engineering is weak.

```md
    _____
   |     |
   | ~~~ |
   | ~~~ |
   | ~~~ |
   |_____|
    _/ \_
  GRADE: D+
```

**C — Neanderthal**  
Functional enough to survive, but not to thrive.

```md
     ___
    /. .\
   | \_/ |
    \ _ /
   --|+|--
    /| |\
   / | | \
  GRADE: C
```

**C+ — Homosapien**  
Clearly written by a modern human with good intentions. Needs AI polish to reach full potential.

```md
     O
    /|\
    / \
   |   |
   THINKER
  GRADE: C+
```

**B — Intern**  
Solid fundamentals and reasonable structure. A few more review cycles and this ships.

```md
     O
    -|-
    / \
   [   ]
   INTERN
  GRADE: B
```

**B+ — Architect**  
Clean, intentional, and structured. Strong work with minor polish remaining.

```md
     O
    -|-
    / \
   [   ]
   BRAIN
   GRADE: B+
```

**A- / A — AI-Augmented**  
Thoughtful context engineering with only small tuning opportunities.

```md
  .-----.
  | o o |
  |  -  |
  | [=] |
  |_____|
   /| |\
 NEXT LEVEL
  GRADE: A
```

For `A-`, keep same art and set `GRADE: A-`.

**A+ — Clankgster**  
Peak context engineering. The robot approves.

```md
    _______
~~~(( ( ) ))~~~
  .|[o   o]|.
  ||  ===  ||
  || [|||] ||
  '|_______|'
    /_| |_\
   PERFECT
  GRADE: A+
```

## 6. Summary add-on

After the badge, include:

1. Severity distribution table (`critical/high/medium/low`)
2. Top 3 recurring issues across leaf reports
3. Highest-impact next actions (ordered)
