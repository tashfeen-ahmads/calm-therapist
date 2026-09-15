import { test } from "node:test";
import assert from "node:assert/strict";
import {
  captureFeedback,
  publicHighlights,
  publicRating,
  setReviewPublished,
  reviewsByUser,
} from "../lib/feedback.ts";

/**
 * The moderation gate. Nothing a member writes should be able to reach a
 * public marketing page without a person having read it first.
 */

async function leave(userId: string, rating: number, comment: string, consent: boolean) {
  return captureFeedback({
    userId,
    userName: `${userId} Person`,
    userEmail: `${userId}@example.com`,
    rating,
    comment,
    publicConsent: consent,
  });
}

test("a new review is never public, however glowing", async () => {
  await leave("r-new", 5, "This changed my life", true);
  const shown = await publicHighlights();
  assert.equal(shown.some((r) => r.userId === "r-new"), false);
});

test("consent alone does not publish", async () => {
  const rec = await leave("r-consent", 5, "Please quote me", true);
  assert.equal(rec.published, false, "consent is permission to ask, not publication");
});

test("a review goes public only once an admin approves it", async () => {
  const rec = await leave("r-approve", 5, "Aura remembered what I said last week", true);
  await setReviewPublished(rec.id, true);
  const shown = await publicHighlights();
  assert.equal(shown.some((r) => r.id === rec.id), true);
});

test("an approved review can be taken back down", async () => {
  const rec = await leave("r-down", 5, "Take this one down later", true);
  await setReviewPublished(rec.id, true);
  assert.equal((await publicHighlights()).some((r) => r.id === rec.id), true);
  await setReviewPublished(rec.id, false);
  assert.equal((await publicHighlights()).some((r) => r.id === rec.id), false);
});

test("an approved review with no words is not quoted", async () => {
  const rec = await leave("r-silent", 5, "", true);
  await setReviewPublished(rec.id, true);
  const shown = await publicHighlights();
  assert.equal(shown.some((r) => r.id === rec.id), false, "an empty quote is not a quote");
});

test("approving a review that was never consented to still does not quote it", async () => {
  // Belt and braces: even an admin mis-click cannot publish words the member
  // did not agree to have published.
  const rec = await leave("r-noconsent", 5, "I did not tick the box", false);
  await setReviewPublished(rec.id, true);
  const shown = await publicHighlights();
  assert.equal(shown.some((r) => r.id === rec.id), false);
});

test("a member sees their own reviews and where each one stands", async () => {
  const rec = await leave("r-mine", 4, "Good, with reservations", true);
  const mine = await reviewsByUser("r-mine");
  assert.equal(mine.length >= 1, true);
  assert.equal(mine[0].id, rec.id);
  assert.equal(mine[0].published, false);
});

test("no aggregate rating is published off a thin sample", async () => {
  // A rating built from one or two reviews is not a rating, and shipping
  // AggregateRating schema off it invites a manual action.
  const before = await publicRating(1000);
  assert.equal(before, null);
});

test("the aggregate counts only approved reviews", async () => {
  const a = await leave("r-agg-1", 5, "five", true);
  const b = await leave("r-agg-2", 3, "three", true);
  await setReviewPublished(a.id, true);
  await setReviewPublished(b.id, true);
  const rating = await publicRating(1);
  assert.ok(rating);
  assert.ok(rating.reviewCount >= 2);
  // An unapproved one must not move the average.
  const before = rating.reviewCount;
  await leave("r-agg-3", 1, "one star, unapproved", true);
  const after = await publicRating(1);
  assert.equal(after?.reviewCount, before, "pending reviews are not counted");
});
