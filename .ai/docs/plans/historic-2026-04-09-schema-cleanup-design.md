# Schema Cleanup — Validated Design

**Status:** Validated. Ready to execute.
**Date:** 2026-04-09
**Decisions confirmed by:** Sam

---

## Goal

Remove redundant columns and one dead table from the `questions` schema. Tighten `questionType` so it carries the disambiguation work `section` was doing today. Rename one column for clarity. None of this changes the questions page UX — it's a storage cleanup that the user-facing app passes through unchanged.

This is **not** the B1/B3 redesign from the Apr 7 plan. That's a separate, larger conversation. This plan deliberately leaves `sharedContext` and the flat row-per-part structure alone.

---

## Changes

| # | Change | Type |
|---|---|---|
| 1 | Drop column `section`, let `questionType` take over disambiguation | breaking schema |
| 2 | Drop column `calculator`, derive from `questionType` | breaking schema |
| 3 | Drop column `difficulty`, derive from `vcaaPercentCorrect` at query time | breaking schema |
| 4 | Rename column `concept_tags` → `cross_topic_prerequisites` | breaking schema |
| 5 | Drop table `working_feedback` (and its Prisma model + relation) | breaking schema |

All five ship in **one** migration so the codebase is never in an intermediate state where some columns are gone but others aren't.

---

## Decision: section → questionType uniqueness

Today the implicit unique key is `(year, examType, section, questionNumber, partLabel)`. After this change it becomes `(year, examType, questionType, questionNumber, partLabel)`.

This is sound because `section` and `questionType` are 1:1 today:

| section (today)            | questionType (today) |
|----------------------------|----------------------|
| `null` (Exam 1)            | `short_answer`       |
| `Section A` (Exam 2)       | `multiple_choice`    |
| `Extended Response` (Exam 2) | `extended_response`  |

VCAA Exam 2 Section A Q1 and Section B Q1 remain distinct because they have different `questionType` values.

We will **not** add a database `UNIQUE` constraint on the new tuple in this migration — just verify it via a SQL `SELECT … GROUP BY … HAVING COUNT(*) > 1` during the dry run, and document the invariant. Adding the constraint is a follow-up if we want belt-and-braces.

## Decision: calculator derivation

```
questionType = short_answer       →  non-calculator
questionType = multiple_choice    →  calculator
questionType = extended_response  →  calculator
```

Holds for every VCAA Methods exam in the current format. The filter sidebar's "Calculator" / "Non-Calculator" buttons keep their labels — they just rewrite their `where` clause:

- **Non-calculator** → `where: { questionType: 'short_answer' }`
- **Calculator** → `where: { questionType: { in: ['multiple_choice', 'extended_response'] } }`

## Decision: difficulty derivation

Bucket `vcaaPercentCorrect` at query time:

```
percent >= 70                      →  easy
percent >= 40 AND percent < 70     →  medium
percent < 40                       →  hard
percent IS NULL                    →  medium  ← Sam's call
```

The null-percent case lands in **medium** so older rows missing a VCAA report don't disappear from difficulty filtering entirely.

Implementation: a Prisma raw `CASE` expression isn't ergonomic, so we'll do this in JS over the `where` clause — translate the incoming `difficulty` filter into a `vcaaPercentCorrect` range filter at query construction time. Example:

```ts
// difficulty=easy
where.vcaaPercentCorrect = { gte: 70 }

// difficulty=hard
where.vcaaPercentCorrect = { lt: 40 }

// difficulty=medium  (the tricky one — includes nulls)
where.OR = [
  { vcaaPercentCorrect: { gte: 40, lt: 70 } },
  { vcaaPercentCorrect: null },
]
```

The render layer (`QuestionCard`) doesn't show difficulty anywhere visible right now, so there's no read site that needs to derive a label per row. If that changes later, we add a small helper.

## Decision: rename conceptTags → crossTopicPrerequisites

Mechanical rename across:

- DB column: `concept_tags` → `cross_topic_prerequisites`
- Prisma field: `conceptTags` → `crossTopicPrerequisites`
- Filter sidebar prop: `popularTags` → `popularPrerequisites`
- `QuestionCardPart` field: `conceptTags` → `crossTopicPrerequisites` (already labelled "Prerequisite:" in the rendered chip, so no UI change)
- CLAUDE.md taxonomy section
- Active filter chip code that reads the URL param `tag` — rename to `prereq` (and update SSR href builder + chip labels)

## Decision: drop working_feedback

`DROP TABLE working_feedback`. Confirmed unused — only `submitQuestionFeedback` writes feedback today, and it writes to `question_feedback`. The relation is removed from the `Question` model.

---

## Migration SQL (single file)

`prisma/migrations/<timestamp>_schema_cleanup/migration.sql`:

```sql
-- 1. Drop dead table.
DROP TABLE public.working_feedback;

-- 2. Drop redundant columns from questions.
ALTER TABLE public.questions DROP COLUMN section;
ALTER TABLE public.questions DROP COLUMN calculator;
ALTER TABLE public.questions DROP COLUMN difficulty;

-- 3. Rename concept_tags → cross_topic_prerequisites.
ALTER TABLE public.questions
  RENAME COLUMN concept_tags TO cross_topic_prerequisites;

-- 4. Drop the now-unused difficulty enum.
DROP TYPE public."Difficulty";
```

Pre-flight check (run in psql, NOT in the migration) — confirms the new uniqueness invariant holds before we ship:

```sql
SELECT year, exam_type, question_type, question_number, part_label, COUNT(*)
FROM public.questions
GROUP BY 1, 2, 3, 4, 5
HAVING COUNT(*) > 1;
-- expected: 0 rows
```

---

## File-by-file change list

### Schema / migration
- `prisma/schema.prisma` — drop `section`, `calculator`, `difficulty`, `WorkingFeedback` model and relation; rename `conceptTags`; drop `Difficulty` enum
- `prisma/migrations/<timestamp>_schema_cleanup/migration.sql` — the SQL above

### Importer (writes the columns we're touching)
- `scripts/import.ts` — remove `section`, `calculator`, `difficulty` writes; rename `conceptTags` → `crossTopicPrerequisites`; verify `questionType` is set on every row
- `lib/claude.ts` — remove `section` from the prompt schema (if present); confirm prompt asks for cross-topic prerequisites under the new name (the JSON shape stays — only the wrapper field name changes)

### Read sites (questions page + filters)
- `app/questions/page.tsx`
  - Remove `section` from `select`, `where`, `orderBy`, and `groupQuestions` key — replace with `questionType`
  - Replace `where.calculator` branches with `where.questionType` branches (per the calculator decision above)
  - Replace `where.difficulty` branches with `where.vcaaPercentCorrect` ranges (per the difficulty decision above)
  - Rename `conceptTags` reads to `crossTopicPrerequisites`
  - Rename URL search param `tag` → `prereq`
  - Keep `where.section: { not: 'Extended Response' }` filter alive but rewrite as `where.questionType: { not: 'extended_response' }`
- `app/topics/page.tsx` — same `where` changes if it references any of these columns
- `app/review/solutions/page.tsx` + `SolutionsClient.tsx` — same
- `app/admin/feedback/page.tsx` + `AdminFeedbackTab.tsx` — drop any reference to `WorkingFeedback`
- `app/actions/taxonomy.ts`, `app/actions/feedback.ts` — verify no references to dropped fields

### UI components
- `components/design-system/FilterSidebar.tsx` — rewrite Calculator buttons to filter on `questionType`; rename `popularTags` prop → `popularPrerequisites`
- `components/design-system/ActiveFilterChips.tsx` — rename `tag` URL param → `prereq`; update chip label
- `components/design-system/QuestionCard.tsx` — rename `conceptTags` field on `QuestionCardPart` type → `crossTopicPrerequisites`
- `components/design-system/Chip.tsx` — only if a variant references `concept` or `tag` strings
- `components/FilterPanel.tsx` — mobile mirror of FilterSidebar; same changes
- `components/QuestionList.tsx` + `components/ActiveFilters.tsx` — v1 components, may be unused; check before editing
- `components/TaxonomyMindMap.tsx` — check for column references

### Scripts / data
- `scripts/backfill-mcq-options.ts` — verify it doesn't write any dropped columns
- `data/studyclix/taxonomy.ts` — read-only, may not need changes
- Any audit script (`fix-part-a-context`, etc.) — sanity check

### Docs
- `CLAUDE.md` — update the schema section, the conceptTags rules section (becomes "Cross-topic prerequisites"), and remove any reference to `section`/`calculator`/`difficulty` columns

---

## Rollout order

Per CLAUDE.md "each increment leaves the codebase in a working state" — but a schema migration that drops columns is necessarily a single atomic step. We can't drop `section` from the DB without simultaneously updating every read site, or vice versa. So the increment is: **all code changes first, then the migration, then verify**.

1. **Code changes (no DB touch yet).** Update every read/write site to use the new schema. The codebase will type-check against the *new* Prisma schema even though the DB still has the old shape. This is fine because we don't run Prisma until step 3.
2. **`npx tsc --noEmit`** — green type check confirms every reference is updated.
3. **Pre-flight SQL check** — run the `GROUP BY HAVING COUNT(*) > 1` query against the live DB to confirm the new uniqueness key holds.
4. **`prisma migrate dev` locally** — apply the migration to the local DB, run the app against it, smoke-test the questions page (filters, pagination, feedback dialog).
5. **`prisma migrate deploy` to Supabase** — apply to production DB.
6. **Git commit + push.**

Rollback plan: if step 5 fails or the app breaks in production, revert the git commit (which restores the old code) and run the inverse migration manually. The dropped columns can be re-added — but we'd lose the data in `section` (~3 distinct values, easy to backfill from `questionType`), `calculator` (fully derivable from `questionType`), and `difficulty` (the original VCAA percents are still in `vcaaPercentCorrect`, so no data loss). `working_feedback` data is the only thing genuinely lost; confirm it's empty before dropping.

---

## Risks and unknowns

1. **Old v1 components** under `components/` (`QuestionList.tsx`, `ActiveFilters.tsx`, `FilterPanel.tsx`) may still import the dropped fields. Need to grep before assuming they're dead.
2. **`drafts/questions-v1/page.tsx`** is a draft route — check whether it's still routed; if it is, it has to be updated or deleted.
3. **`StudyClixTab.tsx`** in admin may reference these — needs a read.
4. **The Claude importer prompt** in `lib/claude.ts` may still ask the model to return `section` or `difficulty`. Need to update the prompt JSON schema or the importer will start writing nulls into columns that no longer exist (which Postgres will reject — actually that's a *good* failure mode, it means we'll catch it).
5. **MCP/RLS interaction**: RLS is enabled on `working_feedback`. Dropping the table is fine (the policy goes with it), but worth noting.
6. **Production data inspection**: should `SELECT COUNT(*) FROM working_feedback` before dropping, to confirm zero rows.
