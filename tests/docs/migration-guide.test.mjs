import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("pre-v1 migration guide is documented in markdown and docs route", async () => {
  const english = await readFile("docs/PreV1MigrationGuide.md", "utf8");
  const hinglish = await readFile("docs/hi/PreV1MigrationGuide.md", "utf8");
  const topics = await readFile("src/pages/DocMigrationTopics.ts", "utf8");
  const registry = await readFile("src/pages/DocTopics.ts", "utf8");

  for (const content of [english, hinglish, topics]) {
    assert.match(content, /CanvasRenderer/);
    assert.match(content, /raw2d-react/);
    assert.match(content, /createWebGLShapeBatch/);
  }

  assert.match(topics, /pre-v1-migration/);
  assert.match(registry, /migrationTopics/);
});

