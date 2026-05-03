import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("v1 release checklist covers API, docs, package, and publish gates", async () => {
  const english = await readFile("docs/V1ReleaseChecklist.md", "utf8");
  const hinglish = await readFile("docs/hi/V1ReleaseChecklist.md", "utf8");
  const topics = await readFile("src/pages/DocReleaseTopics.ts", "utf8");
  const registry = await readFile("src/pages/DocTopics.ts", "utf8");

  for (const content of [english, hinglish, topics]) {
    assert.match(content, /API Freeze/);
    assert.match(content, /CanvasRenderer/);
    assert.match(content, /npm pack/);
    assert.match(content, /jsDelivr|jsdelivr/i);
  }

  assert.match(topics, /v1-release-checklist/);
  assert.match(registry, /releaseTopics/);
});

