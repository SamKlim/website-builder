# Shared Context Redesign — Validated Design (B1 refined)

**Status:** Validated. Ready to execute pending sign-off.
**Date:** 2026-04-09
**Supersedes:** `2026-04-07-shared-context-redesign-exploration.md` (decision: B1 with explicit scope, not B3)
**Decisions confirmed by:** Sam

---

## Goal

Fix two data bugs we've seen today:

1. **Q6 accumulates deltas.** `sharedContext` on part (b) and (c) was the entire concatenated blob from (a) onward. Violates the schema rule and wastes storage.
2. **Filter-induced orphans.** When a filter hides part (a), part (c) renders with no setup — student sees "Find the sample size" without knowing which sample. The current "render-time diff against previous part" rule only works if the full group is present.

Plus: set up the model so a single part can render **in isolation** (deep link, practice mode) and still show all the context it needs.

---

## Decision

Go with **Option B1, refined**:

- Store a `contextBlocks` JSON array on every part row
- **Every part in the same question stores the same array** (denormalised)
- Each block has **explicit scope**: `parts: ["a","b","c"]`
- Keep one flat `questions` table — no parent entity, no join

This is B1 from the Apr 7 plan with explicit scope replacing chunk-ID dedupe. Pragmatic, cheap, works.

B3 (parent `questions` + child `question_parts`) was the structurally "correct" alternative. Rejected because exam content is frozen after import, single-part-in-isolation is the dominant read, and the migration cost is 5–10× higher for no runtime benefit we care about today.

---

## JSON shape

```ts
type ContextBlock = {
  /** The preamble prose. Optional — a block can be image-only. */
  text?: string
  /** Optional diagram that lives inside this block. */
  image?: string
  /** The parts this block applies to, in exam order. e.g. ["a","b","c"] */
  parts: string[]
}

type ContextBlocks = ContextBlock[]
```

No `id` field — the `parts` scope uniquely identifies a block within a
question, and we use array index for React keys.

Stored on every part row under the column name `contextBlocks` (new column, see migration plan below). `sharedContext` stays intact during rollout so we can revert.

### Example — Q6 (2023 Exam 1)

```json
[
  {
    "text": "Let $\\hat{P}$ be the random variable… (0.04, 0.16).",
    "parts": ["a", "b", "c"]
  },
  {
    "text": "Use $z = 2$ to approximate the 95% confidence interval.",
    "parts": ["b", "c"]
  }
]
```

Every part row (a, b, c) stores this **identical** array.

### Example — Q7 (2023 Exam 1), with a shared image

```json
[
  {
    "text": "Consider $f: (-\\infty, 1] \\to R,\\; f(x) = x^2 - 2x$. Part of the graph of $y = f(x)$ is shown.",
    "image": "/exam-images/2023_exam_1/q7.png",
    "parts": ["a", "b", "c", "d"]
  }
]
```

Replaces both `sharedContext` (text) and `contextImageUrl` (image) with a single block.

---

## Render rule

Two modes:

### 1. Card mode (group of parts together, possibly with gaps from filters)

For each part `P` in the group's rendered parts (in exam order):
- Walk `contextBlocks` in array order
- Render block `B` if **`P` is the earliest member of `B.parts` that's present in the current group**

This handles:
- Whole question: block renders at its first scope part
- Some parts filtered out: block falls to the next present part in its scope

### 2. Isolated mode (single part, no group context)

Render **every block whose scope contains this part**, in array order. No "earliest" check — there's no "earliest" when there's only one part.

### Algorithm (shared helper)

```ts
function blocksToRenderFor(
  part: PartLabel,
  contextBlocks: ContextBlocks,
  presentParts: PartLabel[],  // the parts in the current card group; [part] if isolated
): ContextBlock[] {
  return contextBlocks.filter(block => {
    // The earliest part in block.parts that's also in presentParts
    const earliestPresent = block.parts.find(p => presentParts.includes(p))
    return earliestPresent === part
  })
}
```

Works for both modes — isolated mode just passes `presentParts = [thisPart]` and the earliest-present check degenerates to "does my scope include me".

---

## Schema migration

Additive, reversible, phased:

1. **Add** column `contextBlocks Json?` — keep `sharedContext String?` and `contextImageUrl String?` untouched
2. **Mapper change** in `app/questions/page.tsx`: prefer `contextBlocks` when non-null; fall back to the existing `sharedContext` + `contextImageUrl` diff logic when null. Codebase handles both shapes during rollout.
3. **PartRow change** in `QuestionCard.tsx`: accept an array of `preambleBlocks` (each with optional text + optional image), loop instead of single preamble
4. **Backfill script** — reads every question group, converts `sharedContext` + `contextImageUrl` to `contextBlocks`. Guesses scope:
   - For rows with `contextImageUrl` set: create a block `{image, parts: [all parts in the group]}`
   - For rows with non-null `sharedContext` that matches the group's first part: create a block `{text, parts: [all parts in the group]}`
   - For rows with non-null `sharedContext` on later parts: create a block `{text, parts: [thisPart, ...all later parts]}`  ← this is the scope guess that needs human review
   - Clear the row's `sharedContext` to null after writing `contextBlocks`
5. **Human re-review pass** — Sam walks `/questions` and fixes any mis-scoped blocks. The mapper falls back to old behaviour for any row still on the legacy shape, so we can ship the migration and fix rows incrementally.
6. **Drop legacy** — once every row has `contextBlocks` set, drop `sharedContext` and `contextImageUrl` columns in a follow-up migration

Rollback at any step: revert the code change. The DB remains additive until step 6.

---

## File-by-file changes

### Schema / migration
- `prisma/schema.prisma` — add `contextBlocks Json?` to Question
- `prisma/migrations/<timestamp>_add_context_blocks/migration.sql` — `ALTER TABLE questions ADD COLUMN context_blocks JSONB;`

### Mapper
- `app/questions/page.tsx`
  - Extend `QuestionRow` select with `contextBlocks`
  - Rewrite `mapToCardParts` to emit `preambleBlocks: { text?, image? }[]` per part using the `blocksToRenderFor` helper
  - Keep legacy fallback: if `contextBlocks` is null, use existing sharedContext/contextImageUrl diff logic

### Card
- `components/design-system/QuestionCard.tsx`
  - Extend `QuestionCardPart` type: replace `preamble?` and `preambleImage?` with `preambleBlocks?: { text?: ReactNode; image?: ReactNode }[]`
  - Keep the old fields as deprecated for one release to avoid breaking the admin design-system showcase tab
  - Update `PartRow` to loop over `preambleBlocks` and render each as text + image (either can be missing)

### Backfill
- `scripts/backfill-context-blocks.ts` (new) — one-shot script with the guess logic above

### Docs
- `CLAUDE.md` — rewrite the "Question Data Schema" section's shared-context rules to describe the new block shape; keep the rules but change the storage description
- `EXAM_PROCESSING_WORKFLOW.md` — update Step 2 to explain how to write `contextBlocks` when importing a new exam

---

## Risks

1. **Scope guessing is heuristic.** The backfill can't always infer whether a block applies to ["b","c"] or ["b","c","d"]. The fallback is "apply to thisPart and all later parts in the group" which will over-scope occasionally — cheaper to correct visually than under-scope and hide context.
2. **Importer prompt** in `lib/claude.ts` still writes the old shape. Not touching in this migration — the mapper fallback handles new imports on the legacy shape, and we can update the importer once the migration is bedded in.
3. **Admin design-system showcase tab** (`app/admin/DesignSystemTab.tsx`) may use the old `preamble` / `preambleImage` fields. Keeping them deprecated-but-supported for one release prevents a broken showcase during rollout.
4. **`contextBlocks` redundancy.** Storing identical JSON on every part row duplicates storage. For ~200 rows this is noise. Documented as a deliberate denormalisation trade-off.
