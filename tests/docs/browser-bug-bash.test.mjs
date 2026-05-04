import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const topic = readFileSync("src/pages/DocBrowserBugBashTopics.ts", "utf8");
const topics = readFileSync("src/pages/DocTopics.ts", "utf8");
const english = readFileSync("docs/BetaBrowserBugBash.md", "utf8");
const hinglish = readFileSync("docs/hi/BetaBrowserBugBash.md", "utf8");
const smoke = readFileSync("tests/browser/smoke.test.mjs", "utf8");

test("browser bug bash checklist covers docs and readme routes", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /\/doc/);
    assert.match(content, /\/readme/);
    assert.match(content, /search/i);
    assert.match(content, /Hinglish/i);
  }
});

test("browser bug bash checklist is registered and browser-smoked", () => {
  assert.match(topics, /browserBugBashTopics/);
  assert.match(topic, /browser-bug-bash/);
  assert.match(smoke, /"\/doc"/);
  assert.match(smoke, /"\/readme"/);
});
