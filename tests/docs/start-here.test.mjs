import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const topic = readFileSync("src/pages/DocStartHereTopics.ts", "utf8");
const topics = readFileSync("src/pages/DocTopics.ts", "utf8");
const english = readFileSync("docs/StartHere.md", "utf8");
const hinglish = readFileSync("docs/hi/StartHere.md", "utf8");

test("start here docs define the first-time user path", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /npm install raw2d/);
    assert.match(content, /Canvas/);
    assert.match(content, /Scene/);
    assert.match(content, /Camera2D/);
    assert.match(content, /WebGL/);
  }
});

test("start here topic is registered before setup topics", () => {
  assert.match(topic, /start-here-guide/);
  assert.match(topics, /startHereTopics/);
  assert.ok(topics.indexOf("...startHereTopics") < topics.indexOf("...setupTopics"));
});
