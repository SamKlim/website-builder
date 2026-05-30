# Website prompts

Copy-paste prompts for building landing pages. Live examples run in the Vite app.

| Prompt | Route |
|--------|-------|
| `examples/halo-usd-fintech-landing.md` | `/halo` |
| `examples/max-reed-portfolio-features.md` | `/max-reed` |

**Templates:** `templates/landing-page.template.md` — reusable build prompt with hero, sections, global styles, and technical details.

**Run locally:** `npm run dev` then open `/halo` or `/max-reed` in your browser.

**Static HTML (separate files):** `npm run build` → `dist/halo.html` and `dist/max-reed.html` (plus `dist/index.html` with dev links). Serve with `npm run preview` — opening raw HTML from disk may block videos due to browser security.

**Fonts:** Halo expects TT Norms Pro in `public/fonts/` (`tt-norms-pro-regular.woff2`, `tt-norms-pro-semibold.woff2`). Until you add them, the page falls back to system sans.

**Media:** Videos and images load from CloudFront URLs in the original MotionSites prompts.
