import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const topic = readFileSync("src/pages/DocFinalRendererParityTopics.ts", "utf8");
const english = readFileSync("docs/RendererParityChecklist.md", "utf8");
const hinglish = readFileSync("docs/hi/RendererParityChecklist.md", "utf8");

test("renderer parity checklist covers shared renderer behavior", () => {
  for (const content of [topic, english, hinglish]) {
    for (const word of ["CanvasRenderer", "WebGLRenderer2D", "zIndex", "Camera"]) {
      assert.match(content, new RegExp(word));
    }
  }
});

test("renderer parity checklist covers browser and visual checks", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /test:browser/);
    assert.match(content, /benchmark/);
    assert.match(content, /visual-test/);
    assert.match(content, /WebGL2/);
  }
});
