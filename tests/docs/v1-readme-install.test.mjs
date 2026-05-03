import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../../", import.meta.url));

test("README and /readme docs cover v1 install and package split", async () => {
  const readme = await readText("README.md");
  const v1Doc = await readText("docs/V1Install.md");
  const hiDoc = await readText("docs/hi/V1Install.md");
  const readmeDocs = await readText("src/pages/ReadmeDocs.ts");
  const readmeHiDocs = await readText("src/pages/ReadmeHinglishDocs.ts");

  assert.match(readme, /raw2d-react raw2d-mcp/);
  assert.match(readme, /all Raw2D packages are versioned together/);
  assert.match(v1Doc, /Version Rule/);
  assert.match(v1Doc, /raw2d-core raw2d-canvas raw2d-webgl/);
  assert.match(hiDoc, /V1 Install Aur Package Split/);
  assert.match(readmeDocs, /V1Install\.md/);
  assert.match(readmeHiDocs, /hi\/V1Install\.md/);
});

async function readText(path) {
  return readFile(new URL(path, `file://${root}`), "utf8");
}
