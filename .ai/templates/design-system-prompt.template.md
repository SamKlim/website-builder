# Design System — [Project Name]

Paste this at the start of a greenfield UI task. Fill every bracket before use.
Source of truth for tokens: [path to colours], [path to typography], [path to tailwind config].

---

## Design Philosophy
[2–4 sentences: mood, inspiration, what the product should feel like.]
[What to avoid: e.g. harsh colours, generic AI aesthetics, flat corporate look.]
[Motion temperament: smooth and subtle / none / expressive — one line.]

## Colors
- Page background: [hex] — `[token]`
- Secondary background: [hex] — `[token]`
- Card background: [hex] — `[token]`
- Primary text: [hex] — `[token]`
- Secondary text: [hex] — `[token]`
- Tertiary text: [hex or rgba] — `[token]`
- Border subtle: [hex or rgba] — `[token]`
- Border strong: [hex or rgba] — `[token]`
- Hover background: [hex] — `[token]`
- Accent (CTA / links): [hex] — `[token]`
- Accent hover: [hex] — `[token]`
- Destructive: [hex] / bg [hex] — `[token]`
- Success: [hex] / bg [hex] — `[token]`
- [Other semantic pairs: warning, info, selected, etc.]

### Illustration / decorative palette (optional)
- [name]: [hex] — `[token]`

### Rules
- Never hardcode hex in components — use Tailwind tokens only.
- [Note any legacy palette to avoid in new work.]

## Typography

### Font families
- Display: [font stack] — [CSS variable / class]
  ([one-line rationale])
- Body / UI: [font stack] — [CSS variable / class]
  ([one-line rationale])
- [Specialty: math, code, etc.]: [font stack] — [CSS variable / class]
  ([one-line rationale])

### Named text styles
Every text element uses a token from `[typography file]` — never raw `text-[Npx]`.

| Token | Size / LH | Weight | Tracking | Use |
|-------|-----------|--------|----------|-----|
| [display] | [px/px] | [weight] | [tracking] | [use] |
| [heading1] | | | | |
| [heading2] | | | | |
| [body] | | | | |
| [bodySmall] | | | | |
| [caption] | | | | |

Base: [px], antialiased.

## Spacing & Layout
- Reference frame: [px] max — `[class or pattern]`
- Page padding (horizontal): [fixed px or clamp formula]
- Screen top padding: [px]
- Content max width: [px], centered
- [Screen-specific max widths if different]
- Card padding: [default px] / [small px]
- Section gaps: [range]
- [Fixed rails: sidebar width, footer padding, etc.]

## Border Radius
- Small (buttons, chips, tags): [px] — `[tailwind class]`
- Medium (cards, inputs): [px] — `[tailwind class]`
- Icon / compact controls: [px] — `[tailwind class]`
- Full round: [px or 999px]

## Shadows
- [Name]: `[box-shadow]`
  ([when to use — e.g. Role cards only, not standard cards])
- [Hover shadow if any]: `[box-shadow]` — [legacy or active?]

## Buttons
Source: `[component path]`

### Sizes
- **sm**: h-[px], px-[px], `[type token]`
- **md**: h-[px], px-[px], `[type token]`

### Variants
- **Primary**: bg `[token]`, text `[token]`, radius [px], hover [behaviour]
- **Outline**: [spec]
- **Ghost**: [spec]
- **Destructive**: [spec]
- **[Domain-specific]**: [spec]
- **IconButton**: [size], radius [px], variants [spec]

### States
- Hover: [per variant]
- Disabled: opacity [N], cursor not-allowed
- Focus: ring [spec]

## Chips / Tags (optional)
Source: `[component path]`

- **[variant]**: bg `[token]`, border `[token]`, text `[token]`, `[type token]`
- Sizes: [spec]
- Radius: [px]

## Inputs (optional)
Source: `[component path]`

- Height [px], padding [px], radius [px], border [px]
- Default / filled / error states: [spec]
- Focus ring: [spec]

## Animation Rules
- Page transitions: [library or CSS-only / none]
- Hero / illustration motion: [library or CSS-only / none]
- Respect `prefers-reduced-motion`: [yes — how / not yet]
- Loading states: [skeleton / pulse / spinner]
- Navigation pending: [React transition / none]
- Guideline: [smooth and purposeful / minimal / etc.]

## Component inventory (optional)
List canonical components an agent should reuse, not reinvent:

- `[path]` — Button, IconButton
- `[path]` — Card, [variants]
- `[path]` — Chip
- `[path]` — Input, Textarea, Dialog
- Admin showcase: `[path]`
