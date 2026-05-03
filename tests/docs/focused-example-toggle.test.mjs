import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../../", import.meta.url));

test("focused docs examples expose consistent small and full code modes", async () => {
  const focusedSource = await readText("src/pages/DocFocusedExample.ts");
  const pageSource = await readText("src/pages/DocPage.ts");

  assert.match(focusedSource, /doc-example-switch/);
  assert.match(focusedSource, /Small code/);
  assert.match(focusedSource, /Full example/);
  assert.match(focusedSource, /getLiveExampleCode/);
  assert.match(focusedSource, /createCodeBlock\(smallCode/);
  assert.match(focusedSource, /createCodeBlock\(fullCode/);
  assert.match(pageSource, /createFocusedExample\(\{ section, sourceSection, language \}\)/);
});

async function readText(path) {
  return readFile(new URL(path, `file://${root}`), "utf8");
}
