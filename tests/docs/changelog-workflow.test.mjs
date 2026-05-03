import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const topic = readFileSync("src/pages/DocChangelogTopics.ts", "utf8");
const english = readFileSync("docs/ChangelogWorkflow.md", "utf8");
const hinglish = readFileSync("docs/hi/ChangelogWorkflow.md", "utf8");

test("changelog workflow covers release entry sections", () => {
  for (const content of [topic, english, hinglish]) {
    for (const label of ["Added", "Changed", "Fixed", "Breaking Changes", "Verification"]) {
      assert.match(content, new RegExp(label));
    }
  }
});

test("changelog workflow links tasks, package, and release truth", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /task\.md|task/i);
    assert.match(content, /npm version|npm/i);
    assert.match(content, /git tag|git/i);
    assert.match(content, /Package exports|exports/i);
  }
});
