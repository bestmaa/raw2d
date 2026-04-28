import assert from "node:assert/strict";
import test from "node:test";
import { ShapePath, flattenPathCommands, flattenShapePath } from "raw2d-core";

test("flattenShapePath converts line commands into subpath points", () => {
  const path = new ShapePath()
    .moveTo(0, 0)
    .lineTo(20, 0)
    .lineTo(20, 12)
    .closePath();
  const flattened = flattenShapePath(path);

  assert.equal(flattened.subpaths.length, 1);
  assert.equal(flattened.subpaths[0].closed, true);
  assert.deepEqual(flattened.subpaths[0].points, [
    { x: 0, y: 0 },
    { x: 20, y: 0 },
    { x: 20, y: 12 }
  ]);
});

test("flattenShapePath samples quadratic curves", () => {
  const path = new ShapePath().moveTo(0, 0).quadraticCurveTo(10, 20, 20, 0);
  const flattened = flattenShapePath(path, { curveSegments: 2 });
  const points = flattened.subpaths[0].points;

  assert.deepEqual(points, [
    { x: 0, y: 0 },
    { x: 10, y: 10 },
    { x: 20, y: 0 }
  ]);
});

test("flattenPathCommands samples cubic curves and keeps separate subpaths", () => {
  const flattened = flattenPathCommands(
    [
      { type: "moveTo", x: 0, y: 0 },
      { type: "bezierCurveTo", cp1x: 0, cp1y: 30, cp2x: 30, cp2y: 30, x: 30, y: 0 },
      { type: "moveTo", x: 100, y: 100 },
      { type: "lineTo", x: 120, y: 100 }
    ],
    { curveSegments: 3 }
  );

  assert.equal(flattened.subpaths.length, 2);
  assert.equal(flattened.subpaths[0].points.length, 4);
  assertAlmostEqual(flattened.subpaths[0].points.at(-1).x, 30);
  assertAlmostEqual(flattened.subpaths[0].points.at(-1).y, 0);
  assert.deepEqual(flattened.subpaths[1].points, [
    { x: 100, y: 100 },
    { x: 120, y: 100 }
  ]);
});

function assertAlmostEqual(actual, expected) {
  assert.ok(Math.abs(actual - expected) < 0.000001, `${actual} !== ${expected}`);
}

