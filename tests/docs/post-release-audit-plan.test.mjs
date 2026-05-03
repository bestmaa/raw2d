import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const topic = readFileSync("src/pages/DocPostReleaseAuditTopics.ts", "utf8");
const english = readFileSync("docs/PostReleaseAuditPlan.md", "utf8");
const hinglish = readFileSync("docs/hi/PostReleaseAuditPlan.md", "utf8");
const topics = readFileSync("src/pages/DocTopics.ts", "utf8");

test("post-release audit plan covers fresh package installs", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /npm install raw2d/);
    assert.match(content, /raw2d-core/);
    assert.match(content, /raw2d-mcp/);
    assert.match(content, /raw2d-react/);
  }
});

test("post-release audit plan covers runtime and CDN checks", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /jsDelivr|cdn\.jsdelivr/i);
    assert.match(content, /Canvas/);
    assert.match(content, /WebGL/);
    assert.match(content, /Texture Atlas/);
    assert.match(content, /Interaction/);
  }
});

test("post-release audit plan is registered in docs navigation", () => {
  assert.match(topics, /postReleaseAuditTopics/);
  assert.match(topic, /post-release-audit/);
});
