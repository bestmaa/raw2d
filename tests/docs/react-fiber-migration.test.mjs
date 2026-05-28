import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("React Fiber migration docs cover package choice and host config", async () => {
  const [english, hinglish, topics, readmeDocs, readmeHiDocs] = await Promise.all([
    readFile("docs/ReactFiberMigration.md", "utf8"),
    readFile("docs/hi/ReactFiberMigration.md", "utf8"),
    readFile("src/pages/DocReactReconcilerTopics.ts", "utf8"),
    readFile("src/pages/ReadmeDocs.ts", "utf8"),
    readFile("src/pages/ReadmeHinglishDocs.ts", "utf8")
  ]);

  for (const content of [english, hinglish, topics]) {
    assert.match(content, /raw2d-react/);
    assert.match(content, /raw2d-react-fiber/);
    assert.match(content, /createRaw2DFiberHostConfig/);
    assert.match(content, /createRaw2DFiberInteractionBridge/);
  }

  assert.match(topics, /react-fiber-migration/);
  assert.match(readmeDocs, /ReactFiberMigration\.md/);
  assert.match(readmeHiDocs, /hi\/ReactFiberMigration\.md/);
});
