import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const topic = readFileSync("src/pages/DocReactBetaTopics.ts", "utf8");
const topics = readFileSync("src/pages/DocTopics.ts", "utf8");
const english = readFileSync("docs/ReactAdapterVsFiber.md", "utf8");
const hinglish = readFileSync("docs/hi/ReactAdapterVsFiber.md", "utf8");

test("React beta docs separate current adapter and future Fiber", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /raw2d-react/);
    assert.match(content, /Fiber|fiber/);
    assert.match(content, /React-free/);
    assert.match(content, /Canvas|WebGL/);
  }
});

test("React beta topic is registered before detailed React docs", () => {
  assert.match(topic, /react-beta-guide/);
  assert.match(topics, /reactBetaTopics/);
  assert.ok(topics.indexOf("...reactBetaTopics") < topics.indexOf("...reactTopics"));
});
