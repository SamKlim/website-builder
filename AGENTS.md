# AGENTS.md

## Cursor Cloud specific instructions

### Product overview

This repo is a **prompt library + Vite multi-page showcase** for premium landing pages. The primary dev surface is the **root** npm app; `sites/insight-tutors/` is a separate Astro static site (optional unless you are working on that migration).

### Services

| Service | Port | When needed |
|---------|------|-------------|
| Vite dev (`npm run dev`) | 5173 | **Required** for browser work on root showcase pages |
| Astro dev (`sites/insight-tutors`) | 4321 | Only when editing the Astro site under `sites/insight-tutors/` |

No database, Docker, or in-repo API. Contact forms may call **Web3Forms** externally (`VITE_WEB3FORMS_ACCESS_KEY` / `PUBLIC_WEB3FORMS_ACCESS_KEY`); pages render without it.

### Commands (root `/workspace`)

See `package.json`. Common flows:

- **Dev:** `npm run dev` (add `-- --host 127.0.0.1` if binding matters in the VM)
- **Build / typecheck:** `npm run build` (`tsc -b` then `vite build`)
- **Preview production build:** `npm run build` then `npm run preview` (default port 4173)

**HTML entry points** (multi-page, not only `/`): `index.html` (Insight Tutors SPA at `/`), `halo.html`, `max-reed.html`, `max-reed-v2.html`, `insight-tutors.html`. Config: `vite.config.ts` → `build.rollupOptions.input`.

### Astro site (`sites/insight-tutors`)

Separate `package-lock.json`. From that directory: `npm install`, `npm run dev`, `npm run build`.

### Lint / tests

There are **no** `lint` or `test` scripts in root `package.json`. Verification is **`npm run build`** plus manual/browser checks. `.ai/rules/test-pipeline.md` describes a different project template (Next.js, port 3000, Playwright) and does **not** apply to this repo’s npm scripts.

### Project conventions

Chat workflow, memory, and skills live under `.ai/` (see `CLAUDE.md`). Do not edit `.claude/` or `.cursor/` rule content directly (symlinks to `.ai/`).
