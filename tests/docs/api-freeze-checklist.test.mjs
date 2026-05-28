import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const topic = readFileSync("src/pages/DocAPIFreezeTopics.ts", "utf8");
const english = readFileSync("docs/APIFreezeChecklist.md", "utf8");
const hinglish = readFileSync("docs/hi/APIFreezeChecklist.md", "utf8");

test("API freeze checklist covers public package and class names", () => {
  for (const content of [topic, english, hinglish]) {
    for (const name of [
      "raw2d-core",
      "raw2d-effects",
      "raw2d-mcp",
      "raw2d-react-fiber",
      "CanvasRenderer",
      "WebGLRenderer2D",
      "Camera2D"
    ]) {
      assert.match(content, new RegExp(name));
    }
  }
});

test("API freeze checklist covers audits and breaking change rules", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /public-surface-audit/);
    assert.match(content, /core-exports/);
    assert.match(content, /focused-exports/);
    assert.match(content, /metadata-audit/);
    assert.match(content, /typecheck/);
    assert.match(content, /pack:check/);
    assert.match(content, /breaking/i);
  }
});

test("API freeze checklist documents aliases and integration boundaries", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /Canvas/);
    assert.match(content, /CanvasRenderer/);
    assert.match(content, /alias|Alias/);
    assert.match(content, /raw2d-react/);
    assert.match(content, /raw2d-react-fiber/);
    assert.match(content, /not re-exported|re-export nahi/);
  }
});
