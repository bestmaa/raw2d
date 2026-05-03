import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const topic = readFileSync("src/pages/DocCanvasQATopics.ts", "utf8");
const english = readFileSync("docs/CanvasDocsQAChecklist.md", "utf8");
const hinglish = readFileSync("docs/hi/CanvasDocsQAChecklist.md", "utf8");

test("Canvas docs QA checklist covers browser routes and visual checks", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /canvas-basic/);
    assert.match(content, /canvas-init/);
    assert.match(content, /console error/i);
    assert.match(content, /blank|blank nahi/i);
    assert.match(content, /resize/i);
  }
});

test("Canvas docs QA checklist covers core Canvas objects", () => {
  for (const name of ["Rect", "Circle", "Line", "Text2D", "Sprite"]) {
    assert.match(topic, new RegExp(name));
    assert.match(english, new RegExp(name));
    assert.match(hinglish, new RegExp(name));
  }
});
