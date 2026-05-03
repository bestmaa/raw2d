import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const topic = readFileSync("src/pages/DocAccessibilityTopics.ts", "utf8");
const english = readFileSync("docs/DocsAccessibilityChecklist.md", "utf8");
const hinglish = readFileSync("docs/hi/DocsAccessibilityChecklist.md", "utf8");

test("docs accessibility checklist covers keyboard and readable controls", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /Tab/);
    assert.match(content, /Shift\+Tab/);
    assert.match(content, /Enter/);
    assert.match(content, /focus/i);
    assert.match(content, /Search|search/);
  }
});

test("docs accessibility checklist covers visual docs routes", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /canvas-init/);
    assert.match(content, /webgl-renderer/);
    assert.match(content, /interaction-controller/);
    assert.match(content, /Hinglish/);
  }
});
