import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const topic = readFileSync("src/pages/DocPublicBetaTopics.ts", "utf8");
const english = readFileSync("docs/PublicBetaHardeningPlan.md", "utf8");
const hinglish = readFileSync("docs/hi/PublicBetaHardeningPlan.md", "utf8");
const topics = readFileSync("src/pages/DocTopics.ts", "utf8");
const taskQueue = readFileSync("TASK3.md", "utf8");

test("public beta hardening covers install, CDN, docs, and browser gates", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /npm install raw2d/);
    assert.match(content, /raw2d-core raw2d-canvas/);
    assert.match(content, /cdn\.jsdelivr\.net/);
    assert.match(content, /\/doc/);
    assert.match(content, /\/readme/);
    assert.match(content, /browser/i);
  }
});

test("public beta hardening defines pass and fail rules", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /pass/i);
    assert.match(content, /fail/i);
    assert.match(content, /failing command|failing route|failing command ya route/i);
  }
});

test("public beta hardening is registered in docs and task queue", () => {
  assert.match(topics, /publicBetaTopics/);
  assert.match(topic, /public-beta-hardening/);
  assert.match(taskQueue, /T172 .*Status: (in_progress|completed)/);
});
