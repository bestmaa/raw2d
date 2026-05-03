import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../../", import.meta.url));

test("docs search exposes scoring and keyboard navigation hooks", async () => {
  const searchSource = await readText("src/pages/DocSearch.ts");
  const sidebarSource = await readText("src/pages/DocSidebar.ts");

  assert.match(searchSource, /export function getDocSearchScore/);
  assert.match(searchSource, /phrase/);
  assert.match(sidebarSource, /getRankedTopics/);
  assert.match(sidebarSource, /right\.score - left\.score/);
  assert.match(sidebarSource, /event\.key === "ArrowDown"/);
  assert.match(sidebarSource, /event\.key === "Escape"/);
  assert.match(sidebarSource, /selectBestSearchMatch/);
});

async function readText(path) {
  return readFile(new URL(path, `file://${root}`), "utf8");
}
