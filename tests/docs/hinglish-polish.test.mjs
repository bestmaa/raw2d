import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../../", import.meta.url));

test("Hinglish docs use natural UI labels and avoid mixed Hindi verbs", async () => {
  const i18nSource = await readText("src/pages/DocI18n.ts");
  const hinglishSource = await readText("src/pages/DocHinglish.ts");
  const focusedSource = await readText("src/pages/DocFocusedExample.ts");

  assert.match(i18nSource, /Docs me search karein/);
  assert.match(i18nSource, /Code dekhein/);
  assert.match(focusedSource, /Chhota code/);
  assert.match(hinglishSource, /Code copy karke same Raw2D API/);
  assert.doesNotMatch(hinglishSource, /करें|करे|Why Use करें|Use करें/);
});

async function readText(path) {
  return readFile(new URL(path, `file://${root}`), "utf8");
}
