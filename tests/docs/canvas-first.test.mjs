import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const topic = readFileSync("src/pages/DocCanvasInitTopics.ts", "utf8");
const english = readFileSync("docs/Canvas.md", "utf8");
const hinglish = readFileSync("docs/hi/Canvas.md", "utf8");

test("Canvas docs show the smallest working scene", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /Smallest Working Scene/);
    assert.match(content, /new Canvas/);
    assert.match(content, /new Scene/);
    assert.match(content, /new Camera2D/);
    assert.match(content, /new Rect/);
    assert.match(content, /render\(scene, camera\)/);
  }
});

test("Canvas first docs explain render responsibility", () => {
  assert.match(topic, /What Render Does/);
  assert.match(english, /clears the canvas/);
  assert.match(hinglish, /canvas clear karta hai/);
});
