# Unified Calculus Taxonomy — Design

**Date:** 2026-04-09
**Status:** Validated — implement

## Problem

The current Level 1 taxonomy splits calculus into two top-level topics:
`Differentiation` and `Integration`. Real VCAA exam questions — especially
Exam 2 Extended Response — routinely mix both (set up with differentiation,
then antidifferentiate to find area or average value). Forcing these into
one bucket or the other drops the other half of the skill from the browse
filter and forces students to hunt across multiple topics.

Secondary symptoms (caught by the 2026-04-09 taxonomy audit):
- StudyClix's categorisation for 2023 systematically places our
  Differentiation + Integration rows under a single `Calculus` topic
- `Differentiation › Tangent Lines` and `Differentiation › Applications of
  Differentiation` live at inconsistent levels — tangent lines is really
  an application, not a technique
- `Circular Functions` in the DB drifted from the CLAUDE.md canonical
  `Trigonometry and Circular Functions` (8 rows)

## Decision

Collapse `Differentiation` + `Integration` into a single Level 1 topic
`Calculus` with four Level 2 subtopics. Existing technique labels (Chain
Rule, Definite Integrals, etc.) move down to Level 3 `subSubtopic`.

## New canonical taxonomy (Calculus only — rest of CLAUDE.md unchanged)

**Level 1:** `Calculus`

**Level 2 subtopics (4):**
- `Differentiation` — questions primarily assessing a differentiation
  technique (the mechanics of finding f'(x))
- `Antidifferentiation` — questions primarily assessing an
  antidifferentiation technique (finding F(x), evaluating definite
  integrals, computing area/volume mechanically)
- `Applications of Calculus` — questions where the calculus is in service
  of something else: optimisation, tangent lines, stationary points,
  increasing/decreasing behaviour, points of inflection
- `Average Value and Rate of Change` — rate-of-change modelling and
  average-value problems (kept separate because StudyClix uses it and
  2023 ER Q2 fits here cleanly)

**Level 3 subSubtopics** (examples, not exhaustive):
- Under `Differentiation`: `Chain Rule`, `Product Rule`, `Quotient Rule`,
  `Newton's Method`, `Differentiation of Exponential Functions`
- Under `Antidifferentiation`: `Definite Integrals`, `Area Under a Curve`,
  `Area Between Curves`
- Under `Applications of Calculus`: `Tangent Lines`, `Stationary Points`,
  `Optimisation`, `Points of Inflection`, `Increasing and Decreasing`

### Primary-skill rule for Applications vs technique

When a question could go under either `Differentiation` or `Applications
of Calculus` (e.g. an optimisation problem that requires the chain rule):

- If the marks mostly assess the derivative mechanics (finding and
  simplifying f'(x)), it's `Differentiation › Chain Rule`.
- If the marks mostly assess the application (reading the context,
  setting up the model, solving f'(x) = 0 for a stationary point), it's
  `Applications of Calculus › Optimisation`.

This mirrors how StudyClix categorises and gives us a predictable rule
when questions straddle the line.

## Row-level migration plan (2023 data)

All 20 existing Differentiation + Integration rows are rewritten to
`Calculus`. Every existing technique label is preserved, just moved down
one level.

| Current | New |
|---|---|
| `Differentiation › Chain Rule` | `Calculus › Differentiation › Chain Rule` |
| `Differentiation › Product Rule` | `Calculus › Differentiation › Product Rule` |
| `Differentiation › Quotient Rule` | `Calculus › Differentiation › Quotient Rule` |
| `Differentiation › Newton's Method` | `Calculus › Differentiation › Newton's Method` |
| `Differentiation › Tangent Lines` | `Calculus › Applications of Calculus › Tangent Lines` |
| `Differentiation › Applications of Differentiation › Optimisation` | `Calculus › Applications of Calculus › Optimisation` |
| `Differentiation › Applications of Differentiation › Stationary Points` | `Calculus › Applications of Calculus › Stationary Points` |
| `Differentiation › Applications of Differentiation › Points of Inflection` | `Calculus › Applications of Calculus › Points of Inflection` |
| `Differentiation › Applications of Differentiation › Increasing and Decreasing` | `Calculus › Applications of Calculus › Increasing and Decreasing` |
| `Differentiation › Applications of Differentiation › (null)` | `Calculus › Applications of Calculus › (null)` |
| `Integration › Definite Integrals` | `Calculus › Antidifferentiation › Definite Integrals` |
| `Integration › Area Under a Curve › Numerical approximation` | `Calculus › Antidifferentiation › Area Under a Curve` |

Plus the standalone renames/recategorisations:

- **All `Circular Functions` rows → `Trigonometry and Circular Functions`**
  (just the topic name — subtopics stay as-is)
- **2023 Exam 2 ER Q2 (all 7 parts)** → `Calculus › Average Value and Rate
  of Change`. StudyClix is right about (a–c); the multi-part rule forces
  the whole question to share one topic, so (d)'s piecewise modelling also
  lands here. This is defensible — the whole question is about rate of
  change on a wheel.

## Not moved (explicit non-action)

- **2023 Exam 2 ER Q1(d)** — StudyClix classes it as
  `Other Functions › Transformations`, but CLAUDE.md's multi-part rule
  forbids moving one part without the rest. Q1(a–ciii) are clearly cubic
  functions (setting up f(x), finding intercepts, solving equations), so
  the whole question should stay under `Algebra and Polynomials › Cubic
  Functions`. The transformation step in (d) is a secondary skill and
  should be captured via a `transformations` **concept tag** on that row
  only. Concept tags require Sam's approval per CLAUDE.md, so this is
  pending.

## Workflow change

Step 4 of `EXAM_PROCESSING_WORKFLOW.md` now explicitly requires
cross-referencing StudyClix's categorisation for every question before
finalising. StudyClix isn't always right, but a divergence is a signal
worth pausing on.
