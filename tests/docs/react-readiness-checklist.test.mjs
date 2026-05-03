import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const topic = readFileSync("src/pages/DocReactReadinessTopics.ts", "utf8");
const english = readFileSync("docs/ReactReadinessChecklist.md", "utf8");
const hinglish = readFileSync("docs/hi/ReactReadinessChecklist.md", "utf8");

test("React readiness checklist keeps React outside runtime packages", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /raw2d-react/);
    assert.match(content, /raw2d-core/);
    assert.match(content, /raw2d-canvas/);
    assert.match(content, /raw2d-webgl/);
  }
});

test("React readiness checklist covers consumer and docs routes", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /tests\/react/);
    assert.match(content, /react-basic/);
    assert.match(content, /optional/i);
    assert.match(content, /pipeline/i);
  }
});
