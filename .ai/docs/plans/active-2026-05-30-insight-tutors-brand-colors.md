# Insight Tutors Brand Color Correction — Plan

**Date:** 2026-05-30
**Status:** approved
**Built:** YYYY-MM-DD (set when implementation is complete)

## Approval

- **draft** — brainstorm complete; waiting for user review. No code.
- **approved** — user explicitly approved; agent may implement.
- **historic** — built and shipped; rename file to `historic-YYYY-MM-DD-<topic>.md`.

---

## What we built
Correct the Insight Tutors page so the color system matches the real brand direction: soft off-white surfaces, near-black text, muted sage CTAs/highlights, and tiny dusty-peach accents only. Done looks like calmer contrast, cleaner hierarchy, and no saturated or yellow-heavy tones.

## Key decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Palette source | Use the approved brand prompt palette | Keeps implementation aligned with reference screenshots and approved direction |
| Accent usage | Restrict dusty-peach to micro accents only | Prevents brand drift and over-warm look |
| Text color | Move to near-black for headings/body | Improves readability and fidelity to real site |
| Surface system | Use subtle off-white + very light card tints | Preserves minimal, premium tone without flat monotony |
| Scope | Color + contrast + hover/focus states only | Fast correction of the reported issue without broad layout refactor |

## Data model changes
None.

## Implementation scope

1. Update color classes in `src/pages/InsightTutorsPage.tsx`:
   - page background, text, headers, cards, borders, buttons, links, focus states
   - constrain peach to logo dot and tiny metadata accents only
2. Adjust supporting CSS in `src/index.css`:
   - reduce/neutralize any shadow or hover color casts that push tones off-brand
3. Verify route in browser and run lint check on edited files.

## Out of scope

- Structural section redesign
- Copy/content rewrites
- New components or animation redesign
