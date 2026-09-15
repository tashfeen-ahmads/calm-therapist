-- Reviews are not public until an admin has read them. Existing rows default
-- to unpublished: nothing that was auto-showing keeps showing without someone
-- actually approving it.
ALTER TABLE "Feedback" ADD COLUMN "published" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Feedback" ADD COLUMN "publishedAt" TIMESTAMP(3);
ALTER TABLE "Feedback" ADD COLUMN "rejectedAt" TIMESTAMP(3);

CREATE INDEX "Feedback_published_createdAt_idx" ON "Feedback"("published", "createdAt");
