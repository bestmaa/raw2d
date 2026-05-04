import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const topic = readFileSync("src/pages/DocWebGLDecisionTopics.ts", "utf8");
const topics = readFileSync("src/pages/DocTopics.ts", "utf8");
const english = readFileSync("docs/WebGLWhenNeeded.md", "utf8");
const hinglish = readFileSync("docs/hi/WebGLWhenNeeded.md", "utf8");

test("WebGL decision docs explain when to move beyond Canvas", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /Canvas/);
    assert.match(content, /WebGLRenderer2D/);
    assert.match(content, /textureBinds/);
    assert.match(content, /staticCacheHits/);
    assert.match(content, /isWebGL2Available/);
  }
});

test("WebGL decision topic is registered in docs", () => {
  assert.match(topic, /webgl-when-needed/);
  assert.match(topics, /webGLDecisionTopics/);
  assert.ok(topics.indexOf("...webGLDecisionTopics") < topics.indexOf("...rendererChoiceTopics"));
});
