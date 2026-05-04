import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const html = readFileSync("examples/showcase/index.html", "utf8");
const main = readFileSync("examples/showcase/main.ts", "utf8");
const performance = readFileSync("examples/showcase/showcasePerformance.ts", "utf8");
const stats = readFileSync("examples/showcase/showcaseStats.ts", "utf8");
const docs = readFileSync("docs/ShowcaseDemo.md", "utf8");

test("showcase exposes performance toggles", () => {
  assert.match(html, /raw2d-toggle-atlas/);
  assert.match(html, /raw2d-toggle-static/);
  assert.match(html, /raw2d-toggle-culling/);
  assert.match(main, /readPerformanceOptions/);
});

test("showcase toggles affect renderer options and stats", () => {
  assert.match(main, /spriteSorting: performance\.atlasSorting \? "texture" : "none"/);
  assert.match(main, /culling: performance\.culling/);
  assert.match(performance, /setRenderMode\(renderMode\)/);
  assert.match(stats, /staticBatches:/);
  assert.match(docs, /culling toggles/);
});
