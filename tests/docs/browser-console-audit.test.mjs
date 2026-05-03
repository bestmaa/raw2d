import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const topic = readFileSync("src/pages/DocConsoleAuditTopics.ts", "utf8");
const english = readFileSync("docs/BrowserConsoleAuditChecklist.md", "utf8");
const hinglish = readFileSync("docs/hi/BrowserConsoleAuditChecklist.md", "utf8");

test("browser console audit covers docs and example routes", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /\/doc/);
    assert.match(content, /\/benchmark/);
    assert.match(content, /canvas-basic/);
    assert.match(content, /webgl-basic/);
    assert.match(content, /interaction-basic/);
  }
});

test("browser console audit defines failing and allowed output", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /TypeError/);
    assert.match(content, /ReferenceError/);
    assert.match(content, /404/);
    assert.match(content, /WebGL2/);
    assert.match(content, /test:browser/);
  }
});
