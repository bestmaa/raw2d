import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../../", import.meta.url));

test("Canvas vs WebGL decision guide is documented in route and markdown", async () => {
  const topic = await readText("src/pages/DocRendererChoiceTopics.ts");
  const renderer = await readText("docs/Renderer2D.md");
  const rendererHi = await readText("docs/hi/Renderer2D.md");

  assert.match(topic, /Decision Checklist/);
  assert.match(topic, /Compare Real Stats/);
  assert.match(topic, /needsAtlasBatching/);
  assert.match(renderer, /Decision Guide/);
  assert.match(renderer, /Compare Real Stats/);
  assert.match(renderer, /Canvas can be faster for tiny scenes/);
  assert.match(rendererHi, /Decision Guide/);
  assert.match(rendererHi, /Real Stats Compare Karein/);
});

async function readText(path) {
  return readFile(new URL(path, `file://${root}`), "utf8");
}
