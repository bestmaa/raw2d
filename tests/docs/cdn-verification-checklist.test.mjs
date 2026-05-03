import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const topic = readFileSync("src/pages/DocCDNTopics.ts", "utf8");
const english = readFileSync("docs/CDNVerificationChecklist.md", "utf8");
const hinglish = readFileSync("docs/hi/CDNVerificationChecklist.md", "utf8");

test("CDN checklist covers pinned and latest jsDelivr URLs", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /cdn\.jsdelivr\.net\/npm\/raw2d@/);
    assert.match(content, /cdn\.jsdelivr\.net\/npm\/raw2d\/dist/);
    assert.match(content, /raw2d\.umd\.cjs/);
  }
});

test("CDN checklist covers browser import and stale latest checks", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /Scene/);
    assert.match(content, /Camera2D/);
    assert.match(content, /CanvasRenderer/);
    assert.match(content, /latest|Latest/);
    assert.match(content, /npm view raw2d version/);
  }
});
