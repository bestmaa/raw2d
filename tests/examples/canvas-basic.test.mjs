import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const html = readFileSync("examples/canvas-basic/index.html", "utf8");
const source = readFileSync("examples/canvas-basic/main.ts", "utf8");

test("Canvas basic example uses shared example layout", () => {
  assert.match(html, /shared\/example\.css/);
  assert.match(html, /Canvas Basic/);
  assert.match(html, /npm install raw2d/);
  assert.match(html, /raw2d-toggle/);
  assert.match(html, /raw2d-reset/);
  assert.match(html, /raw2d-stats/);
});

test("Canvas basic example renders shapes, text, and stats", () => {
  assert.match(source, /new Canvas/);
  assert.match(source, /new Rect/);
  assert.match(source, /new Circle/);
  assert.match(source, /new Text2D/);
  assert.match(source, /getStats/);
  assert.match(source, /addEventListener\("click"/);
  assert.match(source, /status:/);
});
