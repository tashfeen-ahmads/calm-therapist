import { test } from "node:test";
import assert from "node:assert/strict";
import { checkTalkingRules, splitStanceTag } from "../lib/aura-prompt.ts";

test("stance tag is parsed and stripped", () => {
  const r = splitStanceTag("[stance:reflect] So it's not the call itself.");
  assert.equal(r.stance, "reflect");
  assert.equal(r.body, "So it's not the call itself.");
});

test("unknown stance tag is dropped but body kept", () => {
  const r = splitStanceTag("[stance:lecture] Here is a list.");
  assert.equal(r.stance, null);
  assert.equal(r.body, "Here is a list.");
});

test("no tag leaves the text untouched", () => {
  const r = splitStanceTag("Take your time.");
  assert.equal(r.stance, null);
  assert.equal(r.body, "Take your time.");
});

test("a good reply has no violations", () => {
  assert.deepEqual(checkTalkingRules("Yes came out before you'd decided, didn't it."), []);
});

test("two questions is a violation", () => {
  assert.ok(checkTalkingRules("How was it? And what did she say?").includes("questions:2"));
});

test("lists and markdown are violations", () => {
  const v = checkTalkingRules("Try these:\n- breathe\n- walk\n**Then** sleep.");
  assert.ok(v.includes("list"));
  assert.ok(v.includes("markdown"));
});

test("filler phrases and stock openers are caught", () => {
  const v = checkTalkingRules("I hear you. It's completely valid that you feel this way.");
  assert.ok(v.includes("filler-phrase"));
  assert.ok(v.includes("stock-opener"));
});

test("diagnosis and medication advice are caught", () => {
  assert.ok(checkTalkingRules("You have GAD, honestly.").includes("diagnosis"));
  assert.ok(checkTalkingRules("You could ask about increasing your SSRI dose.").includes("medication"));
});

test("voice replies are held shorter", () => {
  const four = "One. Two. Three. Four. Five.";
  assert.ok(checkTalkingRules(four, { voice: true }).some((v) => v.startsWith("too-long")));
  assert.ok(!checkTalkingRules("One. Two. Three.", { voice: false }).some((v) => v.startsWith("too-long")));
});

test("em dashes and en dashes are violations", () => {
  // Nobody texts with an em dash. One is enough to make a message read as
  // machine-written, which is the whole thing Aura is trying not to be.
  assert.ok(checkTalkingRules("You said yes — before you'd decided.").includes("em-dash"));
  assert.ok(checkTalkingRules("Three weeks – and he took the credit.").includes("em-dash"));
});

test("hyphens are left alone", () => {
  // The rule is about the long dashes, not ordinary hyphenation.
  assert.deepEqual(checkTalkingRules("That's a well-worn path for you."), []);
  assert.deepEqual(checkTalkingRules("Twenty-one is young to carry that."), []);
});

test("the venting guidance reaches the prompt", async () => {
  const { VENTING_RULES } = await import("../lib/aura-prompt.ts");
  // The two failure modes the evidence is clearest on.
  assert.match(VENTING_RULES, /do not move to problem-solve/i);
  assert.match(VENTING_RULES, /reframing early/i);
});

test("long dashes are replaced before the reply is sent", async () => {
  const { softenDashes } = await import("../lib/aura-prompt.ts");
  assert.equal(
    softenDashes("You said yes — before you'd decided."),
    "You said yes, before you'd decided."
  );
  assert.equal(softenDashes("Three weeks–and he took the credit."), "Three weeks, and he took the credit.");
});

test("softening dashes leaves ordinary hyphens and clean text alone", async () => {
  const { softenDashes } = await import("../lib/aura-prompt.ts");
  assert.equal(softenDashes("That's a well-worn path."), "That's a well-worn path.");
  assert.equal(softenDashes("Take your time."), "Take your time.");
});

test("softened output passes its own rule check", async () => {
  const { softenDashes } = await import("../lib/aura-prompt.ts");
  const raw = "So it wasn't the call — it was saying yes first.";
  assert.deepEqual(checkTalkingRules(softenDashes(raw)), []);
});

test("the opening posture reaches a brand new member's prompt", async () => {
  const { composeSystemPrompt, DEFAULT_PROFILE } = await import("../lib/aura.ts");
  const fresh = { ...DEFAULT_PROFILE, sessionCount: 1, opening: "listen" as const };
  const prompt = composeSystemPrompt({ profile: fresh });
  // The first conversation is exactly where this signal does its work.
  assert.match(prompt, /\[OPENING\]/);
  assert.match(prompt, /do not offer anything/i);
});

test("someone who wants help deciding gets a different posture", async () => {
  const { composeSystemPrompt, DEFAULT_PROFILE } = await import("../lib/aura.ts");
  const prompt = composeSystemPrompt({ profile: { ...DEFAULT_PROFILE, opening: "practical" } });
  assert.match(prompt, /problem-solve sooner/i);
  assert.match(prompt, /still ask before you do/i);
});

test("no opening preference leaves no stray marker in the prompt", async () => {
  const { composeSystemPrompt, DEFAULT_PROFILE } = await import("../lib/aura.ts");
  const prompt = composeSystemPrompt({ profile: DEFAULT_PROFILE });
  assert.ok(!prompt.includes("[OPENING]"));
});
