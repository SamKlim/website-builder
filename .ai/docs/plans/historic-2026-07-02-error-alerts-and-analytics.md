# Error Alerts & Site Analytics — Plan

**Date:** 2026-07-02
**Status:** historic
**Built:** 2026-07-02

## Approval

- **draft** — brainstorm complete; waiting for user review. No code.
- **approved** — user explicitly approved; agent may implement.
- **historic** — built and shipped; rename file to `historic-YYYY-MM-DD-<topic>.md`.

---

## What we built

Two independent additions to `sites/insight-tutors`: (1) when the enquiry API function (`api/enquiry.ts`) throws or Resend fails, an email alert goes to `insighttutorstutoring@gmail.com` — rate-limited so a repeating bug can't flood the inbox; (2) Vercel Analytics is added to `BaseLayout.astro` so visitor traffic (pages, referrers, rough location/device) is visible in the Vercel dashboard. "What people searched to find you" is not something the site can capture in code — that's Google Search Console, a manual setup step outside this plan (steps given separately, not built).

## Key decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Error scope | Server/API errors only (`api/enquiry.ts` and future Vercel functions) | Site already controls this code path; client-side JS error capture needs a global handler on every page — bigger lift, deferred |
| Alert transport | Reuse existing Resend setup, same `TO_EMAIL` | Already wired up and working (see `534431f`), no new service/account needed |
| Rate limiting | One alert email per distinct error per 30 min window | Prevents inbox flooding if one bug fires repeatedly; distinct = same error message/name |
| Rate-limit storage | In-memory `Map` in the function's module scope | Vercel functions on the same region reuse warm instances between invocations; no DB exists in this site, so no new persistence layer for a best-effort dedupe |
| Analytics tool | `@vercel/analytics` | Already hosted on Vercel; one package + one component; free tier; no new account |
| Search insight | Google Search Console — manual setup, not code | Search query data only comes from the search engine itself; nothing the site can log |

## Files touched

- `sites/insight-tutors/api/enquiry.ts` — wrap the existing `try`-less logic in a try/catch; on Resend error or thrown exception, send a second alert email (subject: "Site error: enquiry form") via the same Resend client, rate-limited per error signature.
- `sites/insight-tutors/api/_lib/errorAlert.ts` (new) — small shared helper: `alertOnError(errorKey, details)` so any future Vercel function can reuse the same rate-limited alert logic instead of duplicating it.
- `sites/insight-tutors/package.json` — add `@vercel/analytics` dependency.
- `sites/insight-tutors/src/layouts/BaseLayout.astro` — mount the Analytics component once, site-wide.

## Not building now (out of scope)

- Client-side JS error capture (React error boundaries / `window.onerror`) — flagged as a possible later phase if server-side alerts aren't enough.
- Third-party error tracking (Sentry etc.) — heavier than needed for a single-function marketing site.
- Google Search Console integration — this is an account/verification step you do in Google's dashboard, not code. I'll hand you the exact steps once this plan is approved and built.
