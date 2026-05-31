# Services Selector — What We Offer — Plan

**Date:** 2026-05-30
**Status:** approved
**Built:** —

## Approval

- **draft** — brainstorm complete; waiting for user review. No code.

---

## What we build

Replace the static 3-column card grid in the "What We Offer" section of `InsightTutorsPage.tsx` with an interactive split-panel selector. On desktop: numbered service names on the left, a detail panel (abstract art image + title + description + CTA) on the right that swaps when you click a name. On mobile: a vertical accordion — each item has a chevron button, click to expand inline showing the image and detail. First item is pre-selected by default.

## Key decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Layout pattern | Option A — Split panel | Closest to reference design; most editorial feel |
| Images | Abstract watercolour/gradient art via Unsplash URLs | Matches warm brand palette; can swap to real photos later |
| Mobile | Vertical accordion with chevron toggle | User-specified; natural collapse for narrow screens |
| Default state | First item pre-selected | User-specified |
| Component location | New `ServicesSelector` component extracted to `src/components/ServicesSelector.tsx` | `InsightTutorsPage.tsx` is already 522 lines (over 400-line limit); extraction keeps both files healthy |
| Image transition | CSS opacity fade + slight translateY on panel swap | Smooth feel without a heavy animation library |

## Files touched

| File | Change |
|------|--------|
| `src/components/ServicesSelector.tsx` | New component — all selector logic and markup |
| `src/pages/InsightTutorsPage.tsx` | Remove static grid; import and render `<ServicesSelector />` in services section; remove unused `Service` type (moves to component) |

## Implementation detail

### `ServicesSelector` component

**State:**
- `activeIdx: number` — defaults to `0`
- `openIdx: number | null` — for mobile accordion (null = all closed; initialise to `0`)

**Data:** Each `Service` in `SERVICES` gets an `image` field added — a curated Unsplash URL with warm abstract/watercolour aesthetic, unique per service.

**Desktop layout (`md:` breakpoint and up):**
- Two-column flex: left 40% / right 60%
- Left: `<button>` per service — number superscript + service title. Active = dark text + pill highlight (`bg-[#EDE9E4]` rounded-full). Inactive = muted (`text-[#B5B0AA]`)
- Right: card (`bg-[#F3F1EF]` rounded-2xl) — image top (rounded-xl, `object-cover`, fixed height ~280px), then title (`insight-heading`), sage green divider, description, `→ Book a free class` link to `#contact`
- Panel swap: fade + translateY transition via CSS (`transition: opacity 300ms, transform 300ms`)

**Mobile layout (below `md:`):**
- Stack of accordion rows — each row: number + title + chevron icon (`ChevronDown` / `ChevronUp` from lucide-react)
- Expanded row reveals image (full width, rounded-xl) + description + CTA below
- Border separator between rows
- Only one item open at a time (opening one closes others)

**Unsplash images (one per service):**
1. Our Subjects — soft watercolour warm peach/sage abstract
2. Where We Are — soft warm city light bokeh abstract
3. Our Prices — warm cream/gold abstract gradient
4. Our Difference — pink/rose abstract gradient
5. Our Experience — sage green/olive abstract
6. In Person & Online — blush/lavender soft abstract

All images: `https://images.unsplash.com/photo-[ID]?w=900&q=80&fit=crop`

## Out of scope

- No actual form wiring on the CTA (links to existing `#contact` anchor)
- No animation library — plain CSS transitions only
- Images are placeholders; real photography can be swapped later
