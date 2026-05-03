import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const topic = readFileSync("src/pages/DocAPIFreezeTopics.ts", "utf8");
const english = readFileSync("docs/APIFreezeChecklist.md", "utf8");
const hinglish = readFileSync("docs/hi/APIFreezeChecklist.md", "utf8");

test("API freeze checklist covers public package and class names", () => {
  for (const content of [topic, english, hinglish]) {
    for (const name of ["raw2d-core", "CanvasRenderer", "WebGLRenderer2D", "Camera2D"]) {
      assert.match(content, new RegExp(name));
    }
  }
});

test("API freeze checklist covers audits and breaking change rules", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /public-surface-audit/);
    assert.match(content, /metadata-audit/);
    assert.match(content, /pack:check/);
    assert.match(content, /breaking/i);
  }
});
