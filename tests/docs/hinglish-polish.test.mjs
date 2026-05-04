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

test("Hinglish docs sidebar beginner group uses polished copy", async () => {
  const topicsSource = await readText("src/pages/DocTopics.ts");

  assert.match(topicsSource, /Yahan Se Shuru Karein/);
  assert.match(topicsSource, /pehla render/);
  assert.doesNotMatch(topicsSource, /Yahan Se Start/);
});

test("core beginner Hinglish markdown avoids awkward mixed copy", async () => {
  const paths = [
    "docs/hi/StartHere.md",
    "docs/hi/GettingStarted.md",
    "docs/hi/Canvas.md",
    "docs/hi/WebGLWhenNeeded.md",
    "docs/hi/ReactAdapterVsFiber.md",
    "docs/hi/Raw2DMCPBeginner.md",
    "docs/hi/PublicBetaHardeningPlan.md"
  ];

  for (const path of paths) {
    const content = await readText(path);
    assert.doesNotMatch(content, /Why Use करें|Use करें|samajhna easy|good|required nahi/);
    assert.doesNotMatch(content, /Pehle .* use karo|wait karo|add karna nahi hai/);
  }
});

async function readText(path) {
  return readFile(new URL(path, `file://${root}`), "utf8");
}
