# Admin Dashboard & Tutor Question Feedback — Plan

**Date:** 2026-04-07
**Status:** historic
**Built:** 2026-05

---

## What we built
Protected `/admin` route (admin-only) with tab navigation: Feedback, Design System, Taxonomy. Internal tutors (Insight Tutors with `isInternal: true`) can submit feedback on any question via a dialog with voice-to-text input. Feedback is stored in the database linked to the question and tutor profile.

## Key decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Voice input | Web Speech API (browser native) | No external dependencies, works in Chrome/Edge/Safari |
| Feedback dialog | Custom component | Simple enough — avoids adding a modal library |
| Admin detection | `Profile.role === 'admin'` | Defined in auth — no duplication |
| Internal tutor check | `Profile.isInternal === true` | Feature-flagged — same role, different visibility |
| Feedback scope | Per-question only | No general feedback tab — user decision |

## Data model

```prisma
model QuestionFeedback {
  id          String   @id @default(cuid())
  questionId  Int      @map("question_id")
  question    Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  authorId    String   @map("author_id")
  author      Profile  @relation(fields: [authorId], references: [id], onDelete: Cascade)
  content     String
  createdAt   DateTime @default(now()) @map("created_at")
  @@map("question_feedback")
}
```

## Open threads
- Mark feedback as reviewed/actioned — deferred, not built yet
