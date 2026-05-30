# Auth & Onboarding — Plan

**Date:** 2026-04-07
**Status:** historic
**Built:** 2026-05

---

## What we built
Supabase Google OAuth with a custom Prisma `Profile` model. After sign-in, users are routed through an onboarding step (role selection + optional invite code for Insight Tutors). Admin is hardcoded by email. Route protection lives in `middleware.ts` using cookie hints to avoid Prisma in the Edge runtime.

## Business rules
- All users get 1 month free, then must pay (payment system is future work)
- Students and tutors see the same question bank; tutors get additional tracking features
- Insight Tutors enter an invite code to get free access — flags them as `isInternal`
- Admin (Sam) detected by email match in env var

## Key decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Auth library | `@supabase/ssr` | `auth-helpers-nextjs` is deprecated |
| Profile storage | Prisma `Profile` in `public` schema | Decoupled from Supabase `auth` schema — we own the data |
| Profile ID | Supabase UUID (string) | Direct FK to `auth.users.id` |
| Internal/external tutor | Boolean `isInternal` flag | Same role, different feature visibility — no second role needed |
| Invite code | Single env var | Only 1 code needed for Insight Tutors |
| Middleware DB access | Cookie-based routing hints (`x-onboarded`, `x-role`) | Avoids Edge runtime + Prisma complexity |
| Admin detection | Email match in env var | Single admin user — no role management overhead |
| Tutor's students | `TutorStudent` table (name + tutor FK) | Just names for session tracking — not app users |

## Data models

```prisma
enum AccountRole { admin tutor student }

model Profile {
  id           String      @id       // Supabase auth.users UUID
  email        String      @unique
  displayName  String?     @map("display_name")
  avatarUrl    String?     @map("avatar_url")
  role         AccountRole @default(student)
  isInternal   Boolean     @default(false) @map("is_internal")
  hasOnboarded Boolean     @default(false) @map("has_onboarded")
  createdAt    DateTime    @default(now()) @map("created_at")
  updatedAt    DateTime    @updatedAt @map("updated_at")
  students     TutorStudent[]
  @@map("profiles")
}

model TutorStudent {
  id        String   @id @default(cuid())
  name      String
  tutorId   String   @map("tutor_id")
  tutor     Profile  @relation(fields: [tutorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now()) @map("created_at")
  @@map("tutor_students")
}
```

## Open threads
- Payment system not built — 1 month free period enforced manually for now
- Student progress tracking deferred — `TutorStudent` model exists but no tracking UI yet
