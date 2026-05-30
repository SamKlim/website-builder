# Topics Page Reskin — Design

**Date:** 2026-04-07
**Figma source:** `Topics Page` frame (`167:4870`, Design System page, 1450×935)
**Target file:** `app/topics/page.tsx`

## Goal

Reskin the existing topics page to match the Figma frame using only v2
design-system components, v2 colour tokens, and v2 typography. Data layer
(Prisma query, taxonomy ordering) is unchanged.

## What's already in code

- `app/topics/page.tsx` — has the data fetching (`getTopicsWithSubtopics`),
  the hard-coded `TOPIC_ORDER`, and the page shell. Currently renders
  legacy `<FigmaTopicCard>` from `components/ui/`.
- Header uses legacy `lib/typography` (not `lib/design-system/typography`)
- Wrapped in legacy `<Nav>` (no v2 Nav exists yet — will keep legacy for
  this PR and clean up separately).

## New design-system pieces to add

### 1. `SubtopicChip` — new component in `components/design-system/Card.tsx`

A horizontal chip showing an asterisk icon + subtopic name.

**Figma specs (`213:1131`):**
- Container: `flex flex-row items-center gap-[7px]` horizontal layout
- Padding: `px-3 py-2.5` (12 / 10)
- Background: `bg-main-light-background` (white)
- Border: `border-[0.5px] border-main-border`
- Corner radius: `rounded-lg` (8px)
- Asterisk icon: 18×18, `text-main-secondary-orange`
- Label: `${type.bodySmallSemibold}` (14/21 Instrument Sans SemiBold), colour `text-main-dark-grey-text`

**Props:**
```ts
type SubtopicChipProps = {
  label: string
  href?: string  // if provided, renders as <a>; otherwise <div>
}
```

### 2. `TopicCard` — new export in `components/design-system/Card.tsx`

Sits alongside `FeatureCard` and `RoleCard`. Replaces the legacy
`<FigmaTopicCard>` for the topics page (legacy stays untouched in this PR).

**Figma specs (`213:1126` / `139:1124`):**
- Container: `bg-main-background` (cream), `border-[0.5px] border-main-border`,
  `rounded-2xl` (16px), `p-4` (16px all sides), vertical layout
- Inner card stack: `flex flex-col gap-3` (12px gap)
- Number: `${type.heading2}` text, `text-main-secondary-orange` ("01.", "02." etc.)
- Topic name: `${type.heading2}`, `text-main-primary-black`
- Subtopics: `flex flex-col gap-2` (8px), each is a `<SubtopicChip>`
- Card height: HUG content (taller cards for topics with more subtopics)

**Props:**
```ts
type TopicCardProps = {
  index: number          // 1-based, formatted as "01." in render
  name: string
  subtopics: { label: string; href?: string }[]
}
```

### 3. Add both to `app/admin/DesignSystemTab.tsx`

Two new rows in the existing v2 Cards section:
- `Subtopic Chip` row showing one chip
- `Topic Card` row showing one card with 4 subtopics

## Changes to `app/topics/page.tsx`

1. Swap legacy imports for v2 imports:
   - `lib/typography` → `lib/design-system/typography`
   - `components/ui/FigmaTopicCard` → `components/design-system/Card` (`TopicCard` named export)
2. Update header section to match Figma:
   - Eyebrow: `${type.caption} text-main-light-grey-text` ("VCAA Mathematical Methods — Year 12")
   - Title: `${type.heading1} text-main-primary-black` ("Select a Topic")
   - Subtitle: `${type.body} text-main-dark-grey-text` ("Choose a topic or subtopic below…")
3. Page background: `bg-white` (Figma uses `main-light-background`)
4. Layout containers:
   - Outer: `min-h-screen bg-white`
   - Inner: `mx-auto max-w-[1440px]`
   - Section padding: fluid `clamp(24px, …, 60px)` gutters (same helper as
     landing page — copy the `fluid` helper into a shared location? See
     "open question 1" below)
5. Topic grid:
   - Keep CSS columns masonry approach: `columns-1 md:columns-2 lg:columns-3`
   - Gap: 20px between columns and rows
   - Each card wrapped in `break-inside-avoid mb-5`
6. Drop the legacy `<Nav>` for now? **No** — keep it so the page still has
   navigation. We'll do a v2 Nav in a separate PR.
7. Subtopic links: each chip should link to
   `/questions?topic=…&subtopic=…` (matches existing `FigmaTopicCard` behaviour
   if applicable — verify before writing).

## Responsive breakpoints

| Viewport | Grid |
|---|---|
| `<md` (<768px) | 1 column |
| `md` (768-1023) | 2 columns |
| `lg+` (≥1024) | 3 columns |

Header padding scales fluidly 24→60px between 375 and 1440 viewport widths,
matching the landing page idiom.

## Open questions

1. **Fluid layout helper duplication.** The landing page defines a local
   `fluid` const for clamp() padding values. The topics page wants the same.
   Should we extract this into `lib/design-system/spacing.ts`? **My
   recommendation:** not yet — wait until we have a third use case before
   abstracting. Inline the few values we need on the topics page.
2. **Subtopic chip click target.** Figma doesn't show a hover state for the
   chip. **My recommendation:** add subtle `hover:bg-main-background-hover`
   to the chip when `href` is provided. Confirm okay.
3. **TopicCard click affordance.** Should the topic name itself be a link
   (taking the user to `/questions?topic=…`), or only the subtopic chips?
   The existing `FigmaTopicCard` has the topic name as a link. **My
   recommendation:** keep the topic name linkable. Confirm.

## Out of scope

- Mobile nav
- v2 `<Nav>` component
- Adding TopicCard as a Card variant inside the Figma component set
  (separate task you already asked about)
- Removing the legacy `FigmaTopicCard` from `components/ui/` (separate
  cleanup PR)

## Order of work

1. Add `SubtopicChip` to `components/design-system/Card.tsx`
2. Add `TopicCard` to `components/design-system/Card.tsx`
3. Add both to `app/admin/DesignSystemTab.tsx` Cards section
4. Verify visually in design system tab
5. Rewrite `app/topics/page.tsx` to use the new components
6. Verify on `/topics` at three viewport widths
7. Commit
