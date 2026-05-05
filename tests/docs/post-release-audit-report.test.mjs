import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const topic = readFileSync("src/pages/DocPostReleaseAuditTopics.ts", "utf8");
const english = readFileSync("docs/PostReleaseAuditReport.md", "utf8");
const hinglish = readFileSync("docs/hi/PostReleaseAuditReport.md", "utf8");

test("post-release audit report covers npm and CDN checks", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /npm view raw2d version/);
    assert.match(content, /cdn\.jsdelivr/);
    assert.match(content, /raw2d\.umd\.cjs/);
  }
});

test("post-release audit report covers docs and browser examples", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /raw2d\.com\/doc/);
    assert.match(content, /Canvas/);
    assert.match(content, /WebGL/);
    assert.match(content, /Texture Atlas/);
    assert.match(content, /Interaction/);
    assert.match(content, /Studio/);
    assert.match(content, /studio-demo-checklist/);
  }
});

test("post-release audit report is registered as a docs topic", () => {
  assert.match(topic, /post-release-audit-report/);
  assert.match(topic, /Audit Report/);
});
