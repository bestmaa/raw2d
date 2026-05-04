import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../../", import.meta.url));
const terms = ["Scene", "Renderer", "Batch", "Atlas", "Bounds", "Hit Testing"];

test("docs glossary covers core Raw2D terms", async () => {
  const topic = await readText("src/pages/DocGlossaryTopics.ts");
  const docs = await readText("docs/Glossary.md");
  const hiDocs = await readText("docs/hi/Glossary.md");
  const registry = await readText("src/pages/DocTopics.ts");
  const readme = await readText("src/pages/ReadmeDocs.ts");

  for (const term of terms) {
    assert.match(topic, new RegExp(term));
    assert.match(docs, new RegExp(term));
  }

  assert.match(hiDocs, /Raw2D ke common words/);
  assert.match(registry, /glossaryTopics/);
  assert.match(readme, /Glossary\.md/);
});

async function readText(path) {
  return readFile(new URL(path, `file://${root}`), "utf8");
}
