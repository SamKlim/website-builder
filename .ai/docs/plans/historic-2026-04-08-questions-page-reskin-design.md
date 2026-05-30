# Questions Page Reskin — Design Plan

**Date:** 2026-04-08
**Figma frame:** `Questions Page` (node `193:1742`, 1440×882)
**Status:** Awaiting sign-off — no code yet

---

## Goal

Reskin `app/questions/page.tsx` to mirror the Figma "Questions Page" frame *exactly*, using only v2 design system components and existing tokens. **Zero new primitives, zero new tokens.**

## Non-goals

- Empty state (no questions match) — keep whatever we have today, revisit as a follow-up
- Loading state — same; keep existing skeleton
- Mobile-specific redesign — defer; mobile uses the same single-column collapse the v1 page already has
- Touching `FilterSidebar`, `QuestionCard`, `Pagination`, `Chip`, or any other v2 component (with one exception, see below)
- The legacy `/questions?layout=...` v1/v2 layout switching — gone, this is the only layout

## The one primitive change

`components/design-system/QuestionCard.tsx:97` currently hardcodes `w-[600px]`. The Figma cards are 900px wide and need to fill their column on real screens. **Change:** drop `w-[600px]`, replace with `w-full`. Single-line edit. The DesignSystemTab showcase will need a `max-w-[600px]` wrapper to keep its preview the same size — also a one-line edit.

## Components used (audit)

| Need | Component | Status |
|---|---|---|
| Left rail | `FilterSidebar` (production wrapper) | exists, already used by current page |
| Question rows (3 states) | `QuestionCard` | exists, needs `w-full` change |
| Pagination row | `Pagination` | exists, supports `getHref` for SSR-friendly anchors |
| Page heading eyebrow | `type.caption` | exists |
| Page heading h1 | `type.heading1` | exists |
| Page heading subtitle | `type.body` | exists |
| Active filter chips | `Chip` (`neutral` + `easy`/`medium`/`hard` variants) | exists |
| Page bg | `bg-main-light-background` | exists |
| Content card bg | `bg-white` (or `bg-illust-white`) + `border-main-border` | exists |

## Files

### Edit

- `app/questions/page.tsx` — full rewrite of the JSX layout, keep the existing data-fetching functions (`getFilterOptions`, `getQuestions`) untouched
- `components/design-system/QuestionCard.tsx` — `w-[600px]` → `w-full`
- `app/admin/DesignSystemTab.tsx` — wrap the `DSQuestionCard` showcase rows in `<div className="max-w-[600px]">` so the admin preview keeps the same width

### New

- `components/design-system/ActiveFilterChips.tsx` — small presentational component, takes `searchParams` + `topics`/`subtopics` for label resolution and renders a row of v2 `Chip`s with an `×` icon. Uses `<Link>`s with the param removed for SSR. **This is composition, not a new primitive — it just arranges existing `Chip` + `icons` + `Link`. Lives in design-system because it'll be reused if we ever surface filters elsewhere.**

### Delete

- `components/QuestionList.tsx` — replaced by inline mapping to `QuestionCard`
- `components/QuestionListSkeleton.tsx` import — keep the file, but the new page won't import it (defer empty/loading work)
- `components/QuestionListWrapper.tsx` import — same, file stays for now
- `components/FilterPanel.tsx` import — the v1 mobile filter panel; FilterSidebar handles mobile too via its own responsive collapse
- `components/ActiveFilters.tsx` import — replaced by the v2 `ActiveFilterChips`
- `components/AvatarMenu.tsx` import — the avatar lives inside `FilterSidebar` already
- `components/ui/Pagination` import — replaced by the v2 `Pagination`
- `lib/typography` (v1) import — replaced by `lib/design-system/typography`

(Files are kept on disk in case anything else still references them — verified separately before any deletion.)

## Page layout (JSX skeleton)

```tsx
<div className="min-h-screen flex bg-main-light-background">
  {/* ── Left rail (260px) ─────────── */}
  <aside className="hidden lg:block h-screen sticky top-0 overflow-y-auto scrollbar-hide shrink-0">
    <FilterSidebar
      subtopics={filterOptions.subtopics}
      topics={filterOptions.topics}
      popularTags={filterOptions.tags.slice(0, 30)}
      user={user}
    />
  </aside>

  {/* ── Right pane ────────────────── */}
  <main className="flex-1 min-w-0 px-10 py-10">
    <div className="max-w-[940px]">
      {/* Heading block */}
      <header className="mb-8">
        <p className={`${type.caption} text-main-dark-grey-text mb-2`}>{eyebrow}</p>
        <h1 className={`${type.heading1} text-main-primary-black mb-2`}>{title}</h1>
        <p className={`${type.body} text-main-dark-grey-text`}>{subtitle}</p>
      </header>

      {/* Active filter chips — only if hasFilters */}
      {hasFilters && (
        <div className="mb-6">
          <ActiveFilterChips searchParams={searchParams} topics={...} subtopics={...} />
        </div>
      )}

      {/* Question list — single column, gap 12px between rows */}
      <div className="flex flex-col gap-3">
        {grouped.map((group) => (
          <QuestionCard key={group.id} {...mapToCardProps(group)} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        getHref={(p) => buildHref({ ...searchParams, page: String(p) })}
        className="mt-8"
      />
    </div>
  </main>
</div>
```

## Heading block logic

| Filters applied | Eyebrow | Title | Subtitle |
|---|---|---|---|
| None | `Mathematical Methods` | `All Questions` | `Every VCAA exam question, sorted by topic and difficulty.` |
| Topic only | `Mathematical Methods` | `{topic}` | `Practice {topic.toLowerCase()} questions from past VCAA exams.` |
| Topic + subtopic | `Mathematical Methods` | `{topic} · {subtopic}` | `Practice {topic.toLowerCase()} questions from past VCAA exams.` |

The Figma shows `Maths Methods` / `Differentiation · Chain Rule` / `Practice differentiation questions from past VCAA exams.` — that's the third row exactly.

## Question card data mapping

The current `QuestionList` groups Prisma rows by `(year, examType, questionNumber)` because a multi-part question is several rows in the DB (one per part). The new page needs the same grouping. Each *group* renders as one `QuestionCard`.

For each group:

| QuestionCard prop | Source |
|---|---|
| `examLabel` | `"${year} Exam ${examType} · Q${questionNumber}"` from the first part |
| `topic` | Per the CLAUDE.md "all parts share same subtopic" rule: if all parts in the group have the same `subtopic`, render `"${topic} › ${subtopic}"`; otherwise just `"${topic}"`. Same for subSubtopic. |
| `partLabel` | `parts[0].partLabel || ""` — for now we render only the first part. **Open question below.** |
| `question` | `parts[0].content` |
| `workingSteps` | `parts[0].workingSteps as string[]` |
| `finalAnswer` | `parts[0].answer ?? undefined` |

### Multi-part questions — RESOLVED (path B)

**Decision: extend the v2 `QuestionCard` to support multiple parts inside one card, each with its own Show/Hide answer button.**

**Status: already done.** Implemented in commit alongside this plan revision. The v2 `QuestionCard` now accepts an optional `parts: QuestionCardPart[]` prop. When provided:
- Each part renders inside the same card body, separated by a divider
- Each part has its own Show/Hide answer button on the right
- Per-part answer state is uncontrolled (managed inside the internal `PartRow` component)
- Card-level `state` only controls collapsed vs expanded — `answerShown` is meaningless for multi-part because each part answers independently
- The single-part API is unchanged; old call sites still render identically

**Why path B over the alternatives** (the three options previously considered):
- **Path A — flatten to one card per part:** uses v2 as-built but breaks the "one question, multiple parts" mental model. Parts (b) and (c) often depend on part (a)'s answer; splitting them across separate cards loses that grouping.
- **Path B — extend the v2 card** (chosen): one question = one card, which matches both the data model and how students actually study. Required adding a `parts` prop, internal `PartRow`, and shared `AnswerBlock` helper. Framed as "completing an incomplete component" rather than inventing a new one — the Figma component showed states, not data shape.
- **Path C — punt and keep v1 cards on the page:** zero risk to question rendering but leaves the page visually inconsistent. Cards stay v1-styled while everything else is v2.

**Production data mapping for the page rewrite:**
The existing `QuestionList` already groups Prisma rows by `(year, examType, section, questionNumber)` so all parts of one question land in one group. The new page does the same grouping and maps each group to one `QuestionCard` with a `parts` array built from the group's rows.

## Active filter chips — composition

`ActiveFilterChips` takes the same `searchParams` shape the page already gets and renders a row:

```tsx
<div className="flex flex-wrap items-center gap-2">
  {difficulties.map(d => (
    <Link key={d} href={removeParam(searchParams, 'difficulty', d)}>
      <Chip variant={d}>{label(d)} ×</Chip>
    </Link>
  ))}
  {years.map(y => (
    <Link key={y} href={removeParam(searchParams, 'year', y)}>
      <Chip variant="neutral">{y} ×</Chip>
    </Link>
  ))}
  {/* topic, subtopic, examType, calculator, tag — same pattern */}
</div>
```

- Difficulty filters use the `easy`/`medium`/`hard` Chip variants (already styled with VCAA difficulty colours)
- All other filters use `neutral`
- The `×` is plain text inside the chip label — no new icon/variant needed
- Each chip is wrapped in a `<Link>` for SSR-friendly removal (no client JS needed)
- No "Clear all" inline — the FilterSidebar already has one

## Implementation order (chunks for separate commits)

1. **Primitive change:** `QuestionCard` `w-[600px]` → `w-full`; wrap the admin preview in `max-w-[600px]`. Verify nothing else breaks. → commit
2. **New `ActiveFilterChips` component** in `components/design-system/`. Add a showcase row to `DesignSystemTab.tsx` so we can see it in isolation. → commit
3. **Page rewrite:** new `app/questions/page.tsx` JSX, data mapping helpers, breadcrumb logic, heading block. → commit
4. **Cleanup:** delete unused v1 imports from the file (the components themselves stay on disk). → commit

## Risks & gotchas

- **`partLabel` decision (above)** — blocks step 3
- **`FilterSidebar` width** — currently fixed at 260; `aside` doesn't need a w- class because the sidebar component owns its own width
- **`max-w-[940px]`** — derived from Figma: 900 (cards) + 40 (left padding from heading) = 940 content max. If you'd rather the cards stretch on huge screens, we drop this and let the column fill `flex-1`
- **Pagination href builder** — need a small `buildHref` helper to round-trip search params; trivial but worth flagging
- **Selected user / topic in FilterSidebar** — the production wrapper reads `useSearchParams` itself, so the selected topic highlight will Just Work without us passing anything extra

## Acceptance check

Before merging:
- [ ] Side-by-side screenshot of `/questions?topic=Differentiation&subtopic=Chain%20Rule` vs the Figma frame
- [ ] Click an active filter chip → URL param removed → row updates
- [ ] Click "Clear all filters" in sidebar → all params gone, chips bar disappears
- [ ] Card width fills the column at 1440 viewport (matches 900px Figma)
- [ ] Card width still feels right at 1024 (lg breakpoint)
- [ ] Mobile (no sidebar): cards stack full-width, heading reflows
