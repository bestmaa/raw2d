import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../../", import.meta.url));

test("docs copy flow can prepend package imports for partial Raw2D snippets", async () => {
  const copySource = await readText("src/pages/DocCopyCode.ts");
  const blockSource = await readText("src/pages/DocCodeBlock.ts");

  assert.match(copySource, /export function getCopyFriendlyCode/);
  assert.ok(copySource.includes('from "raw2d";'));
  assert.ok(copySource.includes("symbols.join"));
  assert.match(copySource, /hasOwnImports/);
  assert.match(copySource, /isCommandOrMarkup/);
  assert.match(copySource, /"Canvas"/);
  assert.match(copySource, /"WebGLRenderer2D"/);
  assert.match(blockSource, /getCopyFriendlyCode\(code\)/);
});

async function readText(path) {
  return readFile(new URL(path, `file://${root}`), "utf8");
}
