import assert from "node:assert/strict";
import test from "node:test";
import { BasicMaterial, Camera2D, RenderPipeline, ShapePath } from "raw2d-core";
import { createWebGLShapeBatch } from "raw2d-webgl";

test("createWebGLShapeBatch writes ShapePath stroke geometry from flattened curves", () => {
  const shapePath = new ShapePath({
    x: 40,
    y: 30,
    fill: false,
    material: new BasicMaterial({ strokeColor: "#f5f7fb", lineWidth: 4 })
  })
    .moveTo(0, 0)
    .quadraticCurveTo(10, 20, 20, 0);
  const batch = createBatch(shapePath);

  assert.equal(batch.shapePaths, 1);
  assert.equal(batch.unsupported, 0);
  assert.deepEqual(batch.drawBatches, [{ key: "stroke:#f5f7fb:4", firstVertex: 0, vertexCount: 48 }]);
  assert.equal(batch.vertices.length, 288);
});

test("createWebGLShapeBatch includes closing ShapePath stroke segments", () => {
  const shapePath = new ShapePath({
    stroke: true,
    material: new BasicMaterial({ strokeColor: "#38bdf8", lineWidth: 2 })
  })
    .moveTo(0, 0)
    .lineTo(20, 0)
    .lineTo(20, 20)
    .closePath();
  const batch = createBatch(shapePath);

  assert.equal(batch.shapePaths, 1);
  assert.deepEqual(batch.drawBatches, [{ key: "stroke:#38bdf8:2", firstVertex: 0, vertexCount: 18 }]);
  assert.equal(batch.vertices.length, 108);
});

test("createWebGLShapeBatch skips ShapePath fill until WebGL fill is implemented", () => {
  const shapePath = new ShapePath({
    fill: true,
    stroke: false,
    material: new BasicMaterial({ fillColor: "#38bdf8" })
  })
    .moveTo(0, 0)
    .lineTo(20, 0)
    .lineTo(20, 20)
    .closePath();
  const batch = createBatch(shapePath);

  assert.equal(batch.shapePaths, 1);
  assert.deepEqual(batch.drawBatches, []);
  assert.equal(batch.vertices.length, 0);
});

function createBatch(shapePath) {
  return createWebGLShapeBatch({
    items: new RenderPipeline().build({ objects: [shapePath] }).getFlatItems(),
    camera: new Camera2D(),
    width: 100,
    height: 100,
    curveSegments: 2
  });
}
