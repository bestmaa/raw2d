import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const topic = readFileSync("src/pages/DocInteractionQATopics.ts", "utf8");
const english = readFileSync("docs/InteractionDocsQAChecklist.md", "utf8");
const hinglish = readFileSync("docs/hi/InteractionDocsQAChecklist.md", "utf8");

test("Interaction docs QA checklist covers interaction routes", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /interaction-controller/);
    assert.match(content, /selection-manager/);
    assert.match(content, /keyboard-controller/);
    assert.match(content, /camera-controls/);
    assert.match(content, /interaction-basic/);
  }
});

test("Interaction docs QA checklist covers user behaviors", () => {
  for (const word of ["selected", "drag", "resize", "Escape", "Delete"]) {
    assert.match(topic, new RegExp(word));
    assert.match(english, new RegExp(word));
    assert.match(hinglish, new RegExp(word));
  }
});
