import assert from "node:assert/strict";
import test from "node:test";
import { Camera2D, getCameraWorldBounds } from "raw2d-core";

test("camera world bounds match viewport at zoom 1", () => {
  const camera = new Camera2D({ x: 100, y: 80, zoom: 1 });
  const bounds = getCameraWorldBounds({ camera, width: 800, height: 600 });

  assert.deepEqual(rectangleSnapshot(bounds), { x: 100, y: 80, width: 800, height: 600 });
});

test("camera world bounds shrink as zoom increases", () => {
  const camera = new Camera2D({ x: -40, y: 20, zoom: 2 });
  const bounds = getCameraWorldBounds({ camera, width: 800, height: 600 });

  assert.deepEqual(rectangleSnapshot(bounds), { x: -40, y: 20, width: 400, height: 300 });
});

test("camera world bounds clamp negative viewport sizes", () => {
  const camera = new Camera2D({ x: 10, y: 15, zoom: 4 });
  const bounds = getCameraWorldBounds({ camera, width: -800, height: -600 });

  assert.deepEqual(rectangleSnapshot(bounds), { x: 10, y: 15, width: 0, height: 0 });
});

function rectangleSnapshot(rectangle) {
  return {
    x: rectangle.x,
    y: rectangle.y,
    width: rectangle.width,
    height: rectangle.height
  };
}
