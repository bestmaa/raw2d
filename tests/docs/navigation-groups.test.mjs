import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../../", import.meta.url));

test("docs navigation groups include English and Hinglish descriptions", async () => {
  const typeSource = await readText("src/pages/DocPage.type.ts");
  const topicSource = await readText("src/pages/DocTopics.ts");
  const sidebarSource = await readText("src/pages/DocSidebar.ts");

  assert.match(typeSource, /readonly description: string/);
  assert.match(typeSource, /readonly hiDescription: string/);
  assert.equal(countMatches(topicSource, "description:"), 8);
  assert.equal(countMatches(topicSource, "hiDescription:"), 8);
  assert.match(sidebarSource, /doc-nav-group-description/);
  assert.match(sidebarSource, /group\.hiDescription : group\.description/);
});

function countMatches(source, value) {
  return source.split(value).length - 1;
}

async function readText(path) {
  return readFile(new URL(path, `file://${root}`), "utf8");
}
