# Memory

Decision log + shipped-features index. Not a session recap.

- `[decision]` — architectural choices and rejected alternatives
- `[lesson]` — mistakes to avoid
- `[shipped]` — one-line capability inventory ("this exists, don't rebuild")

---

[2026-05-27][decision] isInternal is set to true when a tutor enters a valid Insight Tutors invite code during onboarding. It's not a separate role — they're still role: tutor. The flag just unlocks extra features (like giving feedback on questions). Rejected: separate role for internal tutors.

[2026-05-27][decision] Admin is identified by matching their email against an env var. No admin role management — there's only one admin (Sam).

[2026-05-27][decision] Prisma can't run on Vercel's edge layer so middleware can't query the database directly. When someone logs in, the server sets cookies (x-onboarded, x-role) with their role and status. Middleware reads those cookies for routing — no database hit. Real data always lives in Prisma.

[2026-05-27][decision] Admin dashboard lives at /admin with three tabs — Feedback, Design System, and Taxonomy. Only users with the admin role can access it.

[2026-05-27][decision] Tutors can leave feedback on individual questions via a dialog. Voice input uses the browser's built-in Web Speech API — no external library needed. Works in Chrome, Edge, and Safari.

[2026-05-28][shipped] Sign-in hero animation — staggered icon bounce, headline fades in after SVG load.

[2026-05-28][shipped] Onboarding success overlay — loading hand, confetti, route to /topics without white flash.

[2026-05-28][decision] Page gutters live in `lib/design-system/page-spacing.ts`, not `app/layout.tsx`. Left, right, and bottom padding share one value, 24px on mobile scaling to 60px on desktop.

[2026-07-02][shipped] Insight Tutors: server-side API errors (api/enquiry.ts) email an alert to insighttutorstutoring@gmail.com via Resend, rate-limited to one per distinct error per 30 min (api/_lib/errorAlert.ts). Vercel Analytics added for visitor/referrer traffic (BaseLayout.astro) — view in Vercel dashboard, not email.

[2026-09-07][shipped] Insight Tutors: one shared footer (sites/insight-tutors/src/components/Footer.astro) used by all six pages. Left column mirrors the floating nav links (Home, Our Story, Our Tutors, Subjects, Reviews, Pricing). Right column is a Contact Us block with email, mobile, and the Ivanhoe address linked to the Google Maps listing by CID. The footer markup used to be hand-copied into each page and had drifted apart.

[2026-09-07][decision] Footer contact details live in the right-hand Contact Us column, so "Contact" is deliberately not repeated in the footer link list. The nav reaches the enquiry form through its "Book a free class" button instead. Rejected: adding a Google reviews link to the footer.

[2026-09-07][lesson] Claude Code registers a skill only if its SKILL.md opens with YAML frontmatter containing name and description. Five skills in .ai/skills/ had none, so /finish-coding and the rest returned "unknown command". Two related traps: a skill also needs a symlink in .claude/skills/ (test was missing one), and Claude Code must be launched from the repo root, because a session started elsewhere never scans the project's .claude/ at all.
