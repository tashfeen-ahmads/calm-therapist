import { test } from "node:test";
import assert from "node:assert/strict";
import { needsDisclosure, DISCLOSURE_REPEAT_DAYS, AI_DISCLOSURE_FULL, FORBIDDEN_CLAIMS } from "../lib/legal.ts";

/**
 * Disclosure is a legal requirement in some places and the right thing
 * everywhere. Someone talking to software at 3am about the worst thing in
 * their life is entitled to know that is what they are doing.
 */

const DAY = 24 * 60 * 60 * 1000;

test("someone who has never been here is told", () => {
  assert.equal(needsDisclosure(null), true);
  assert.equal(needsDisclosure(undefined), true);
});

test("someone who was here yesterday is not told again", () => {
  assert.equal(needsDisclosure(new Date(Date.now() - DAY)), false);
});

test("someone returning after a long gap is told again", () => {
  const gap = new Date(Date.now() - (DISCLOSURE_REPEAT_DAYS + 1) * DAY);
  assert.equal(needsDisclosure(gap), true);
});

test("the boundary does not fire a day early", () => {
  const justInside = new Date(Date.now() - (DISCLOSURE_REPEAT_DAYS - 1) * DAY);
  assert.equal(needsDisclosure(justInside), false);
});

test("an unparseable timestamp discloses rather than staying quiet", () => {
  // Failing open would mean silently skipping a disclosure because a date
  // was malformed. Always err towards telling them.
  assert.equal(needsDisclosure("not a date"), true);
});

test("the full disclosure says the three things that matter", () => {
  assert.match(AI_DISCLOSURE_FULL, /software/i);
  assert.match(AI_DISCLOSURE_FULL, /not a therapist/i);
  assert.match(AI_DISCLOSURE_FULL, /emergency/i);
});

test("the forbidden-claims list covers diagnosis, treatment and proof", () => {
  const joined = FORBIDDEN_CLAIMS.join(" ");
  for (const needle of ["diagnoses", "prescribes", "clinically proven", "medical advice"]) {
    assert.ok(joined.includes(needle), `${needle} must be forbidden`);
  }
});
