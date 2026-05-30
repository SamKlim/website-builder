---
description: Design system — typography, UI aesthetics
alwaysApply: false
paths:
  - "app/**"
  - "components/**"
  - "lib/design-system/**"
  - "app/globals.css"
  - "tailwind.config.ts"
globs: "{app,components,lib/design-system}/**"
---

# Typography

**NEVER hardcode raw font values directly on elements.**

Always define a type scale first, then apply named type styles. Every project must have a token file before any text is written.

## Rules

- Define all type styles in `lib/design-system/typography.ts` before writing any UI
- Every text element must reference a named type style — never raw `text-[18px] font-bold`
- The type scale must cover: `display`, `displayMobile`, `heading1`, `heading2`, `heading3`, `bodyBold`, `body`, `bodySmall`, `bodySmallSemibold`, `label`, `caption`, `questionFont`
- Each type style defines: size, weight, line-height, letter-spacing, and optionally color/transform

# UI Aesthetics

- Avoid generic "AI-generated" aesthetics: no cliché purple gradients on white, no cookie-cutter component patterns
- Prefer CSS-only animations; use Motion library for React when heavier orchestration is needed
- Focus animation on high-impact moments (page load reveals, scroll-triggered entries) over scattered micro-interactions
- Backgrounds should create atmosphere and depth — not default to flat solid colours
- Spatial composition: use generous negative space, asymmetry, and intentional layout choices

# Page layout

Every full-page view must have consistent horizontal and bottom padding so content never sits flush against the viewport edge.

- Import page spacing tokens from `lib/design-system/page-spacing.ts` (NOT Next.js `app/layout.tsx`)
- **Horizontal (`pageSpacing.gutter`)**: required on every page — left, right, and bottom must match. Fluid `24px → 60px` between 375px and 1440px viewport. Apply via inline style, e.g. `paddingLeft`, `paddingRight`, and `paddingBottom` all set to `pageSpacing.gutter`.
- **Bottom (`pageSpacing.padBottom`)**: defaults to the same value as horizontal gutter unless the page spec says otherwise. **Never omit bottom padding** on scrollable form pages — the last button or field must not sit flush against the viewport edge.
- **Top**: page-specific (hero offset, onboarding Figma `pt-[168px]`, etc.) — may differ from gutter.
- Pages must scroll when content exceeds the viewport.

# Interaction feedback

Every click must register visually within 100ms. A silent click is broken.

## Button rules

1. **Press state** — design-system `Button` includes `:active` styling (instant, every click).
2. **Loading state** — any button that triggers an async action must pass `loading` to `components/design-system/Button`. Spinner appears on the button.
3. **Double-submit prevention** — `loading` automatically disables the button until the action finishes or fails. Do not wire async buttons without it.

```tsx
// ✅ Sign-in, save, submit
<Button loading={isPending} onClick={handleSave}>Save</Button>

// ❌ Async handler with no loading — silent click, duplicate requests possible
<Button onClick={handleSave}>Save</Button>
```

## Full-screen loaders

Branded full-screen loaders (`OnboardingSuccess`) are for page takeovers — when the whole screen context changes. Not for a single CTA on a static page.

Preview component states (including loading) in **Admin → Design System**, or in the real app flow.
