import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const html = readFileSync("examples/shape-path/index.html", "utf8");
const source = readFileSync("examples/shape-path/main.ts", "utf8");

test("ShapePath example uses shared example layout", () => {
  assert.match(html, /shared\/example\.css/);
  assert.match(html, /ShapePath Comparison/);
  assert.match(html, /raw2d-canvas-stats/);
  assert.match(html, /raw2d-webgl-stats/);
});

test("ShapePath example compares Canvas and WebGL renderers", () => {
  assert.match(source, /new ShapePath/);
  assert.match(source, /bezierCurveTo/);
  assert.match(source, /flattenShapePath/);
  assert.match(source, /new Canvas/);
  assert.match(source, /new WebGLRenderer2D/);
  assert.match(source, /curveSegments: 18/);
});
