import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const html = readFileSync("examples/showcase/index.html", "utf8");
const main = readFileSync("examples/showcase/main.ts", "utf8");
const scene = readFileSync("examples/showcase/showcaseScene.ts", "utf8");
const minimap = readFileSync("examples/showcase/showcaseMinimap.ts", "utf8");
const overlay = readFileSync("examples/showcase/showcaseOverlay.ts", "utf8");

test("showcase visual surface includes main, overlay, and minimap canvases", () => {
  for (const expected of ["raw2d-canvas", "raw2d-overlay", "raw2d-minimap"]) {
    assert.match(html, new RegExp(expected));
  }

  assert.match(html, /Renderer, interaction, and batching in one scene/);
  assert.match(html, /npm install raw2d/);
  assert.match(main, /drawShowcaseMinimap/);
  assert.match(main, /drawShowcaseOverlay/);
});

test("showcase scene has visible scale for visual regression checks", () => {
  assert.match(scene, /index < 320/);
  assert.match(scene, /index < 84/);
  assert.match(scene, /index < 40/);
  assert.match(scene, /Text2D/);
});

test("showcase visual helpers draw inspectable output", () => {
  assert.match(minimap, /strokeRect/);
  assert.match(minimap, /fillRect/);
  assert.match(overlay, /strokeRect/);
  assert.match(overlay, /fillRect/);
});
