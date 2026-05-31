# Insight Tutors — Astro Migration

**Date:** 2026-05-31
**Status:** draft
**Built:** —

## Approval

- **draft** — brainstorm complete; waiting for user review. No code.
- **approved** — user explicitly approved; agent may implement.
- **historic** — built and shipped; rename file to `historic-YYYY-MM-DD-<topic>.md`.

---

## What we build

Migrate the existing InsightTutors landing page (currently a React SPA) into an Astro multi-page site at `sites/insight-tutors/` on a new branch `feat/insight-tutors-astro`. The visual design is **unchanged** — same Tailwind classes, custom CSS, colours, animations, and fonts. The change is purely structural: Astro pre-renders each page to static HTML so Google gets real content without executing JavaScript. New sub-pages are added to expand keyword surface area for SEO.

---

## Key decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Framework | Astro + `@astrojs/react` | Static-first, ships zero JS by default; React islands for interactive components |
| Interactivity | React islands (`client:load` / `client:visible`) | Nav, form, tutor toggle, ServicesSelector need state; marquees and static sections don't |
| Styling | Tailwind CSS via `@astrojs/tailwind` | Direct port of existing classes |
| Custom CSS | `src/styles/global.css` | All `.insight-*`, `.liquid-glass-*`, `.animate-marquee-*`, `.exam-vault-*` classes copied verbatim from `src/index.css` |
| Form handler | Web3Forms (existing) | Already wired up; same `WEB3FORMS_ACCESS_KEY` env var |
| SEO extras | `@astrojs/sitemap` + `robots.txt` + JSON-LD LocalBusiness | Auto-generates `sitemap.xml`; JSON-LD on home page only |
| Branch | `feat/insight-tutors-astro` | Keeps this completely separate from the Vite showcase |
| Location | `sites/insight-tutors/` | Monorepo-style alongside existing Vite projects |
| Domain placeholder | `https://insighttutors.com.au` | Swap for real domain before deploy |

---

## Pages

| Route | Title tag | Primary keywords |
|-------|-----------|-----------------|
| `/` | Insight Tutors \| Expert Maths & English Tutoring Melbourne | tutoring melbourne, private tutor |
| `/subjects` | Subjects We Teach \| Insight Tutors | maths tutoring, english tutoring |
| `/subjects/maths` | VCE Maths Tutoring Melbourne \| Insight Tutors | vce maths tutor, methods tutor |
| `/subjects/english` | VCE English Tutoring Melbourne \| Insight Tutors | vce english tutor, english literature tutor |
| `/tutors` | Meet Our Tutors \| Insight Tutors | qualified tutors sydney, atar tutors |
| `/how-it-works` | How It Works \| Insight Tutors | how does tutoring work, tutoring process |
| `/pricing` | Tutoring Prices \| Insight Tutors | tutoring cost melbourne, affordable tutor |
| `/contact` | Book a Free Lesson \| Insight Tutors | book a tutor, trial lesson |

---

## Folder structure

```
sites/insight-tutors/
  astro.config.mjs
  package.json
  tailwind.config.mjs
  tsconfig.json
  public/
    tutors/                  (symlinked or copied from repo root public/tutors/)
    insight-tutors/          (symlinked or copied from repo root public/insight-tutors/)
    robots.txt
    favicon.svg
  src/
    layouts/
      BaseLayout.astro       (head with SEO meta, nav, footer slot)
    pages/
      index.astro            (/)
      subjects/
        index.astro          (/subjects)
        [subject].astro      (/subjects/[subject])
      tutors.astro           (/tutors)
      how-it-works.astro     (/how-it-works)
      pricing.astro          (/pricing)
      contact.astro          (/contact)
    components/
      Nav.tsx                (React island — scroll shrink + mobile menu)
      TutorGrid.tsx          (React island — math/english toggle + cards)
      TutorCard.tsx          (React island — expand/collapse bio)
      ServicesSelector.tsx   (React island — exact copy)
      ContactForm.tsx        (React island — Web3Forms two-step form)
      ReviewsMarquee.astro   (pure Astro — static HTML + CSS animation)
      TutorMarquee.astro     (pure Astro — static HTML + CSS animation)
    data/
      tutors.ts              (TUTORS array, typed)
      subjects.ts            (subject data for dynamic pages)
      reviews.ts             (REVIEWS array)
    styles/
      global.css             (all custom CSS classes from existing index.css)
```

---

## What is and isn't a React island

| Component | Island? | Reason |
|-----------|---------|--------|
| Nav | Yes — `client:load` | Scroll state, mobile menu open/close |
| TutorGrid | Yes — `client:load` | Math/English category toggle |
| TutorCard | Yes — `client:load` | Expand/collapse bio |
| ServicesSelector | Yes — `client:load` | Hover-activated detail panel, accordion |
| ContactForm | Yes — `client:load` | Multi-step form, fetch to Web3Forms |
| ReviewsMarquee | No | Pure CSS animation, no state |
| TutorMarquee | No | Pure CSS animation, no state |
| Hero section | No | Static HTML |
| About section | No | Static HTML |
| Our Difference section | No | Static HTML (scroll reveal re-implemented in CSS or Astro View Transitions) |
| Footer | No | Static HTML |

---

## SEO additions (beyond meta tags)

- `robots.txt` — allow all, point to sitemap
- `sitemap.xml` — auto-generated by `@astrojs/sitemap` at build time
- JSON-LD `LocalBusiness` schema on `/` only:
  - name, url, description, areaServed (Melbourne), priceRange ($75–$95)

---

## Exam vault scroll reveal

The current `useScrollReveal` hook uses `IntersectionObserver`-style logic via `window.addEventListener('scroll')`. In Astro this stays as a React island on the Our Difference section, or is replaced with a simple CSS `@keyframes` triggered by `IntersectionObserver` in a small inline `<script>` tag — decision at build time based on complexity.

---

## Environment variables

| Var | Used in |
|-----|---------|
| `WEB3FORMS_ACCESS_KEY` | `ContactForm.tsx` — same key as existing Vite site |

Astro uses `import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY` (public prefix required for client-side access).

---

## Out of scope for this plan

- Payments or booking calendar
- CMS integration
- Authentication
- Deploying to production (that's a separate step)
