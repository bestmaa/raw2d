import assert from "node:assert/strict";
import test from "node:test";
import { BasicMaterial, Camera2D, Polygon, RenderPipeline } from "raw2d-core";
import { createWebGLShapeBatch, triangulateWebGLPolygon } from "raw2d-webgl";

test("triangulateWebGLPolygon handles concave polygons without zero-area fan triangles", () => {
  const triangles = triangulateWebGLPolygon([
    { x: 0, y: 0 },
    { x: 40, y: 0 },
    { x: 40, y: 40 },
    { x: 20, y: 20 },
    { x: 0, y: 40 }
  ]);

  assert.equal(triangles.length, 9);

  for (let index = 0; index < triangles.length; index += 3) {
    assert.ok(getTriangleArea(triangles[index], triangles[index + 1], triangles[index + 2]) > 0);
  }
});

test("createWebGLShapeBatch writes concave Polygon geometry from ear-clipped triangles", () => {
  const polygon = new Polygon({
    x: 40,
    y: 20,
    points: [
      { x: 0, y: 0 },
      { x: 40, y: 0 },
      { x: 40, y: 40 },
      { x: 20, y: 20 },
      { x: 0, y: 40 }
    ],
    material: new BasicMaterial({ fillColor: "#22c55e" })
  });
  const batch = createWebGLShapeBatch({
    items: new RenderPipeline().build({ objects: [polygon] }).getFlatItems(),
    camera: new Camera2D(),
    width: 100,
    height: 100
  });

  assert.equal(batch.polygons, 1);
  assert.deepEqual(batch.drawBatches, [{ key: "fill:#22c55e", firstVertex: 0, vertexCount: 9 }]);
  assert.equal(batch.vertices.length, 54);
});

function getTriangleArea(a, b, c) {
  return Math.abs((a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)) / 2);
}

