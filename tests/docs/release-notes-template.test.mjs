import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const topic = readFileSync("src/pages/DocReleaseNotesTopics.ts", "utf8");
const english = readFileSync("docs/ReleaseNotesTemplate.md", "utf8");
const hinglish = readFileSync("docs/hi/ReleaseNotesTemplate.md", "utf8");

test("release notes template covers release sections", () => {
  for (const content of [topic, english, hinglish]) {
    for (const heading of ["Highlights", "Added", "Changed", "Fixed", "Verification"]) {
      assert.match(content, new RegExp(heading));
    }
  }
});

test("release notes template covers publish links and checks", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /npm run typecheck/);
    assert.match(content, /npm test/);
    assert.match(content, /raw2d\.com\/doc/);
    assert.match(content, /cdn\.jsdelivr\.net/);
    assert.match(content, /github\.com\/bestmaa\/raw2d/);
  }
});
