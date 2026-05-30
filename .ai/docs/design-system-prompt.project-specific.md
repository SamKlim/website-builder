# Design System — Exam Vault

Paste at the start of a greenfield UI task. Tokens live in `lib/design-system/colours.ts`, `lib/design-system/typography.ts`, and `tailwind.config.ts`. Components in `components/design-system/`. Admin showcase: `app/admin/DesignSystemTab.tsx`.

---

## Design Philosophy
Warm, minimal, education-focused. Clean whites and soft warm off-whites with charcoal text.
Calm and editorial — exam-prep serious, not playful or corporate-navy.
Orange is the brand accent. Generous whitespace. Subtle borders; shadows only where Figma specifies.
Designed at 1440px; layout scales via CSS `clamp()` between 375px and 1440px.
Never hardcode hex or raw font sizes — always use v2 tokens. Matches Figma "exam vault" exactly.

## Colors

### main/ (UI)
- Page background: `#ffffff` — `bg-white` (landing, topics)
- Light background (cards): `#faf9f5` — `main/light-background`
- Secondary background: `#f5f4f2` — `main/background` (question headers, show-answer buttons)
- Background hover: `#e8e7e4` — `main/background-hover`
- Background dark hover: `#dddbd7` — `main/background-dark-hover`
- Primary text: `#2b2823` — `main/primary-black`
- Secondary text: `#737373` — `main/light-grey-text`
- Body text: `#3d3d3a` — `main/dark-grey-text`
- Border: `#d9d9d999` (~60% opacity) — `main/border`
- Accent / brand orange: `#e46c37` — `main/secondary-orange`
- Orange tint: `#ffe9de` — `main/secondary-orange-background`
- Destructive: `#f8434c` / bg `#ffd8d4` — `main/destructive` / `main/destructive-bg`
- Success: `#016f5c` / bg `#ebfae1` — `main/success` / `main/success-bg`
- Selected fill: `#efefef` — `main/on-select`
- Prerequisite purple: `#5b21b6` / bg `#ece8fd` — `main/purple` / `main/purple-background`

### illust/ (illustrations)
- Green `#016f5c` · Purple `#cfc6fa` · Yellow `#fdae20` · Peach `#e5ae9f` · Black `#000000` · White `#ffffff`

### Legacy — do not use in new components
Shadcn HSL vars in `globals.css` (`--primary: #001f3d`, `bg-primary`, `text-muted-foreground`, etc.) and legacy difficulty CSS vars. v2 chips use `main/success`, `main/secondary-orange`, `main/destructive` instead.

## Typography

### Font families (`app/layout.tsx`)
- **Display**: Inter Black (900) — `--font-display`, `.font-display`
  Bold editorial punch for hero headlines only.
- **Body / UI**: Instrument Sans (400–700) — `--font-sans`, body default
  Clean, readable UI and prose.
- **Question / math**: STIX Two Text (400) — `--font-question`, `.font-question`
  Pairs with Temml MathML at weight 400 so inline math reads as one line.

### Named text styles (`lib/design-system/typography.ts`)
Never use raw `text-[Npx]` — apply via `type.display`, `type.heading2`, etc.

| Token | Size / LH | Weight | Tracking | Use |
|-------|-----------|--------|----------|-----|
| `display` | 96/96 | Inter Black | -4px | Hero desktop |
| `displayMobile` | 80/80 | Inter Black | -3px | Hero mobile |
| `heading1` | 36/39 | Bold | -1px | Feature numbers |
| `heading2` | 24/32 | Bold | -0.6px | Section titles, nav brand |
| `heading3` | 18/23.4 | Medium | 0 | Card titles, button md |
| `bodyBold` | 20/27 | Bold | 0 | Emphasis |
| `body` | 18/25.2 | Regular | 0 | Default prose |
| `bodySmall` | 14/21 | Regular | 0 | Secondary prose, inputs |
| `bodySmallSemibold` | 14/21 | SemiBold | 0 | Button sm, chips |
| `label` | 12/12 | Medium | 0 | Meta labels |
| `caption` | 14/14 | SemiBold uppercase | +0.7px | Section labels, neutral chips |
| `questionFont` | 16/28.8 | Regular | 0 | Question text, MCQ options |

Base: 18px body via `type.body`, antialiased.

## Spacing & Layout
- Reference frame: **1440px** max — `max-w-[1440px] mx-auto`
- Horizontal gutter (fluid): `clamp(24px → 60px)` between 375px and 1440px — see `lib/design-system/page-spacing.ts`
- **Page inset rule:** left, right, and bottom padding must match on every page (top may differ). Never omit bottom padding on scrollable form pages.
- Hero vertical padding: `clamp(40px → 60px)`
- Feature section padding: `clamp(40px → 70px)`
- Hero text↔image gap: `clamp(40px → 95px)` at ≥900px
- Questions page: `px-5 md:px-10 py-10`
- Questions list max width: **900px** — `md:max-w-[900px] mx-auto`
- Filter sidebar: **220px** fixed left rail
- Card padding: **24px** default (`p-6`) · **12px** small (`p-3`)
- Card gap: **13px** default (Figma one-off) · **4px** role cards
- Section / list gaps: **16–20px** (`gap-4`, `gap-5`)
- Footer: `px-6 sm:px-10 md:px-12 py-10`

## Border Radius
- Small (buttons, chips, pagination): **4px** — `rounded`
- Medium (cards, inputs, textarea, filter chips): **8px** — `rounded-lg`
- Icon button: **6px** — `rounded-md`

## Shadows
- Role card inset: `0 -1px 5px 0 rgba(0, 0, 0, 0.06)` — `shadow-card-role` (RoleCard only; Standard cards have no shadow)
- Legacy `.card-hover` in globals.css exists for old UI — not v2 spec

## Buttons
Source: `components/design-system/Button.tsx`

### Sizes
- **sm**: h-36px, px-16px, `bodySmallSemibold`
- **md**: h-44px, px-20px, `heading3`

### Variants
- **Default**: bg `main/primary-black`, text `main/light-background`, radius 4px, hover `opacity-90`
- **Outline**: transparent, 1.5px border `main/primary-black`, hover `main/background-hover`
- **Ghost**: transparent, text `main/primary-black`, hover `main/background-hover`
- **Destructive**: bg `main/secondary-orange`, text `main/light-background` (Figma "destructive" is orange)
- **Show/Hide Answer**: bg `main/background`, text `main/dark-grey-text`, sm only, down-arrow icon
- **IconButton** 28×28, radius 6px: default `main/on-select` · highlight `main/secondary-orange-background`

### States
- Disabled: `opacity-50`, `pointer-events-none`
- Focus: `ring-2 ring-main-primary-black/20`

## Chips
Source: `components/design-system/Chip.tsx`

- **neutral**: `main/on-select` + `caption` (uppercase)
- **neutralSelected**: bg `main/dark-grey-text`, text `main/on-select`
- **easy**: `main/success-bg` + border/text `main/success`
- **medium**: `main/secondary-orange-background` + border/text `main/secondary-orange`
- **hard**: `main/destructive-bg` + border/text `main/destructive`
- **prerequisite**: `main/purple-background` + border/text `main/purple`
- Sizes: lg `px-3 py-1` · sm `px-3 h-28px` · radius 4px

## Inputs
Source: `components/design-system/Input.tsx`, `Textarea.tsx`

- Input: h-36px, px-12px, radius 8px, 1px border, `bodySmall`
- Textarea: h-140px, p-12px, radius 8px
- Default/filled: white bg, `main/border` · Error: `main/light-background`, `main/destructive` border
- Focus: `ring-2 ring-main-primary-black/15`

## Animation Rules
- **CSS only** — no framer-motion or lottie in this repo
- **`prefers-reduced-motion`**: not implemented yet
- Landing: `.fade-in-up` — rise 16px + fade, 0.6s ease-out; stagger via `animation-delay`
- Loading: `animate-pulse` skeletons in `QuestionListPending`
- Navigation: React `useTransition` via `NavigationContext` — pending skeleton, not page transitions
- Hover: `transition-colors` on interactive elements
- Guideline: subtle and functional — no bouncy or flashy effects

## Component inventory
Reuse these — do not reinvent:

| Component | Path |
|-----------|------|
| Button, IconButton | `components/design-system/Button.tsx` |
| Card, RoleCard, FeatureCard, TopicCard, SubtopicChip | `components/design-system/Card.tsx` |
| Chip | `components/design-system/Chip.tsx` |
| Input, Textarea | `components/design-system/Input.tsx`, `Textarea.tsx` |
| Dialog | `components/design-system/Dialog.tsx` |
| QuestionCard | `components/design-system/QuestionCard.tsx` |
| FilterSidebar, ActiveFilterChips, Pagination | `components/design-system/FilterSidebar.tsx`, etc. |
| Footer | `components/design-system/Footer.tsx` |
| Icons | `components/design-system/icons.tsx` |
