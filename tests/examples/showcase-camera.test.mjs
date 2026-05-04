import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const html = readFileSync("examples/showcase/index.html", "utf8");
const main = readFileSync("examples/showcase/main.ts", "utf8");
const minimap = readFileSync("examples/showcase/showcaseMinimap.ts", "utf8");
const docs = readFileSync("docs/ShowcaseDemo.md", "utf8");

test("showcase wires camera controls and reset UI", () => {
  assert.match(html, /id="raw2d-reset"/);
  assert.match(main, /new CameraControls/);
  assert.match(main, /panButton: 1/);
  assert.match(main, /controls\.enablePan\(1\)/);
  assert.match(main, /controls\.enableZoom\(\)/);
  assert.match(main, /showcase\.camera\.setZoom\(1\)/);
});

test("showcase draws minimap viewport hints", () => {
  assert.match(html, /id="raw2d-minimap"/);
  assert.match(main, /drawShowcaseMinimap/);
  assert.match(minimap, /viewportWidth/);
  assert.match(minimap, /strokeRect\(viewX, viewY, viewWidth, viewHeight\)/);
  assert.match(docs, /minimap viewport hints/);
});
