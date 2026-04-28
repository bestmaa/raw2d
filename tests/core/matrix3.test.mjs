import assert from "node:assert/strict";
import test from "node:test";
import { Matrix3 } from "raw2d-core";

test("Matrix3 composes translation, rotation, and scale", () => {
  const matrix = new Matrix3().compose(10, 20, Math.PI / 2, 2, 3);
  const point = matrix.transformPoint({ x: 4, y: 5 });

  assert.ok(Math.abs(point.x - -5) < 0.000001);
  assert.ok(Math.abs(point.y - 28) < 0.000001);
});

test("Matrix3 multiplies parent and child transforms", () => {
  const parent = new Matrix3().compose(100, 0, 0, 1, 1);
  const child = new Matrix3().compose(20, 5, 0, 1, 1);
  const world = new Matrix3().multiplyMatrices(parent, child);

  assert.deepEqual(world.transformPoint({ x: 0, y: 0 }), { x: 120, y: 5 });
});

test("Matrix3 inverts transform points", () => {
  const matrix = new Matrix3().compose(10, 20, 0.35, 2, 3);
  const inverse = matrix.clone();
  const worldPoint = matrix.transformPoint({ x: 6, y: 8 });

  assert.equal(inverse.invert(), true);

  const localPoint = inverse.transformPoint(worldPoint);

  assert.ok(Math.abs(localPoint.x - 6) < 0.000001);
  assert.ok(Math.abs(localPoint.y - 8) < 0.000001);
});

