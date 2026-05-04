import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const registry = readFileSync("src/pages/DocTopics.ts", "utf8");
const startHere = readFileSync("src/pages/DocStartHereTopics.ts", "utf8");
const beginnerPath = readFileSync("src/pages/DocBeginnerPathTopics.ts", "utf8");
const english = readFileSync("docs/StartHere.md", "utf8");
const hinglish = readFileSync("docs/hi/StartHere.md", "utf8");

test("beginner path docs cover the core first-user journey", () => {
  for (const content of [startHere, beginnerPath, english, hinglish]) {
    assert.match(content, /npm install raw2d|Install/);
    assert.match(content, /Canvas/);
    assert.match(content, /Scene/);
    assert.match(content, /Camera2D|Camera/);
    assert.match(content, /Rect|Circle|shape/i);
    assert.match(content, /Texture|Sprite/);
    assert.match(content, /WebGL/);
    assert.match(content, /Interaction|MCP|React/i);
  }
});

test("beginner navigation keeps the expected early learning order", () => {
  assertBefore("...startHereTopics", "...setupTopics");
  assertBefore("...setupTopics", "...beginnerPathTopics");
  assertBefore("...beginnerPathTopics", "...publicApiTopics");
  assertBefore("...canvasInitTopics", "...coreTopics");
  assertBefore("...webGLDecisionTopics", "...rendererChoiceTopics");
  assertBefore("...mcpBeginnerTopics", "...mcpTopics");
  assertBefore("...reactBetaTopics", "...reactTopics");
});

function assertBefore(left, right) {
  assert.ok(registry.indexOf(left) >= 0, `${left} missing from docs registry`);
  assert.ok(registry.indexOf(right) >= 0, `${right} missing from docs registry`);
  assert.ok(registry.indexOf(left) < registry.indexOf(right), `${left} should come before ${right}`);
}
