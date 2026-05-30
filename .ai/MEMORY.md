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
