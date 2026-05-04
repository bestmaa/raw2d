import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const html = readFileSync("examples/showcase/index.html", "utf8");
const main = readFileSync("examples/showcase/main.ts", "utf8");
const interaction = readFileSync("examples/showcase/showcaseInteraction.ts", "utf8");
const overlay = readFileSync("examples/showcase/showcaseOverlay.ts", "utf8");
const docs = readFileSync("docs/ShowcaseDemo.md", "utf8");

test("showcase wires selection, drag, and resize interaction", () => {
  assert.match(main, /createShowcaseInteraction/);
  assert.match(main, /interaction\.getSelection\(\)\.select/);
  assert.match(interaction, /controller\.enableSelection\(\)/);
  assert.match(interaction, /controller\.enableDrag\(\)/);
  assert.match(interaction, /controller\.enableResize\(\)/);
});

test("showcase draws transform handles on an overlay canvas", () => {
  assert.match(html, /id="raw2d-overlay"/);
  assert.match(overlay, /getResizeHandles/);
  assert.match(overlay, /strokeRect/);
  assert.match(main, /drawShowcaseOverlay/);
  assert.match(docs, /transform handles/);
});
