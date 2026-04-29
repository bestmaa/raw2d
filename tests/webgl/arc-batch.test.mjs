import assert from "node:assert/strict";
import test from "node:test";
import { Arc, BasicMaterial, Camera2D, RenderPipeline } from "raw2d-core";
import { createWebGLShapeBatch, resolveWebGLCurveSegments } from "raw2d-webgl";

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

test("createWebGLShapeBatch uses curveSegments for Arc smoothness", () => {
  const arc = new Arc({
    x: 50,
    y: 50,
    radiusX: 20,
    radiusY: 10,
    startAngle: 0,
    endAngle: Math.PI / 2,
    closed: true
  });
  const low = createBatch([arc], 8);
  const high = createBatch([arc], 64);

  assert.equal(low.drawBatches[0].vertexCount, 6);
  assert.equal(high.drawBatches[0].vertexCount, 48);
  assert.equal(high.vertices.length > low.vertices.length, true);
});

test("resolveWebGLCurveSegments normalizes WebGL curve quality", () => {
  assert.equal(resolveWebGLCurveSegments(), 32);
  assert.equal(resolveWebGLCurveSegments({ curveSegments: 4 }), 8);
  assert.equal(resolveWebGLCurveSegments({ curveSegments: 12.9 }), 12);
  assert.equal(resolveWebGLCurveSegments({ fallback: 20 }), 20);
});

function createBatch(objects, curveSegments = 8) {
  return createWebGLShapeBatch({
    items: new RenderPipeline().build({ objects }).getFlatItems(),
    camera: new Camera2D(),
    width: 100,
    height: 100,
    curveSegments
  });
}

function assertAlmostEqual(actual, expected) {
  assert.ok(Math.abs(actual - expected) < 0.000001, `${actual} !== ${expected}`);
}
