import assert from "node:assert/strict";
import test from "node:test";
import { Arc, BasicMaterial, Camera2D, RenderPipeline } from "raw2d-core";
import { createWebGLShapeBatch } from "raw2d-webgl";

test("createWebGLShapeBatch writes open Arc stroke geometry", () => {
  const arc = new Arc({
    x: 50,
    y: 50,
    radiusX: 20,
    radiusY: 10,
    startAngle: 0,
    endAngle: Math.PI / 2,
    material: new BasicMaterial({ strokeColor: "#f97316", lineWidth: 4 })
  });
  const batch = createBatch([arc]);

  assert.equal(batch.arcs, 1);
  assert.equal(batch.unsupported, 0);
  assert.deepEqual(batch.drawBatches, [{ key: "stroke:#f97316:4:butt:miter:10", firstVertex: 0, vertexCount: 15 }]);
  assert.equal(batch.vertices.length, 90);
  assertAlmostEqual(batch.vertices[2], 249 / 255);
  assertAlmostEqual(batch.vertices[3], 115 / 255);
  assertAlmostEqual(batch.vertices[4], 22 / 255);
});

test("createWebGLShapeBatch writes closed Arc fill geometry", () => {
  const arc = new Arc({
    x: 50,
    y: 50,
    radiusX: 20,
    radiusY: 10,
    startAngle: 0,
    endAngle: Math.PI / 2,
    closed: true,
    material: new BasicMaterial({ fillColor: "#35c2ff" })
  });
  const batch = createBatch([arc]);

  assert.equal(batch.arcs, 1);
  assert.deepEqual(batch.drawBatches, [{ key: "fill:#35c2ff", firstVertex: 0, vertexCount: 6 }]);
  assert.equal(batch.vertices.length, 36);
  assertAlmostEqual(batch.vertices[2], 53 / 255);
  assertAlmostEqual(batch.vertices[3], 194 / 255);
  assert.equal(batch.vertices[4], 1);
});

function createBatch(objects) {
  return createWebGLShapeBatch({
    items: new RenderPipeline().build({ objects }).getFlatItems(),
    camera: new Camera2D(),
    width: 100,
    height: 100,
    curveSegments: 8
  });
}

function assertAlmostEqual(actual, expected) {
  assert.ok(Math.abs(actual - expected) < 0.000001, `${actual} !== ${expected}`);
}
