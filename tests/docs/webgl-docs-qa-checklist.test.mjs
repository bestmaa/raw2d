import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const topic = readFileSync("src/pages/DocWebGLQATopics.ts", "utf8");
const english = readFileSync("docs/WebGLDocsQAChecklist.md", "utf8");
const hinglish = readFileSync("docs/hi/WebGLDocsQAChecklist.md", "utf8");

test("WebGL docs QA checklist covers key visual routes", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /webgl-performance/);
    assert.match(content, /webgl-visual-tests/);
    assert.match(content, /benchmark/);
    assert.match(content, /visual-test/);
    assert.match(content, /webgl-basic/);
  }
});

test("WebGL docs QA checklist covers renderer diagnostics", () => {
  for (const word of ["drawCalls", "textureBinds", "unsupportedObjects", "WebGL2"]) {
    assert.match(topic, new RegExp(word));
    assert.match(english, new RegExp(word));
    assert.match(hinglish, new RegExp(word));
  }
});
