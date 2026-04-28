import assert from "node:assert/strict";
import test from "node:test";
import { BasicMaterial, Camera2D, Circle, Ellipse, Line, Polygon, Polyline, Rect, RenderPipeline } from "raw2d-core";
import { createWebGLRectBatch, createWebGLShapeBatch, parseWebGLColor } from "raw2d-webgl";

test("parseWebGLColor supports hex and rgba colors", () => {
  assert.deepEqual(parseWebGLColor("#35c2ff"), {
    r: 53 / 255,
    g: 194 / 255,
    b: 1,
    a: 1
  });
  assert.deepEqual(parseWebGLColor("rgba(255, 128, 0, 0.5)"), {
    r: 1,
    g: 128 / 255,
    b: 0,
    a: 0.5
  });
});

test("createWebGLRectBatch writes six vertices for one rect", () => {
  const rect = new Rect({
    x: 10,
    y: 20,
    width: 40,
    height: 30,
    material: new BasicMaterial({ fillColor: "#ff0000" })
  });
  const renderList = new RenderPipeline().build({ objects: [rect] });
  const batch = createWebGLRectBatch({
    items: renderList.getFlatItems(),
    camera: new Camera2D(),
    width: 100,
    height: 100
  });

  assert.equal(batch.rects, 1);
  assert.equal(batch.unsupported, 0);
  assert.equal(batch.vertices.length, 36);
  assert.ok(Math.abs(batch.vertices[0] - -0.8) < 0.000001);
  assert.ok(Math.abs(batch.vertices[1] - 0.6) < 0.000001);
  assert.deepEqual(Array.from(batch.vertices.slice(2, 6)), [1, 0, 0, 1]);
});

test("createWebGLShapeBatch writes circle and ellipse triangle fans", () => {
  const circle = new Circle({
    x: 50,
    y: 50,
    radius: 10,
    material: new BasicMaterial({ fillColor: "#35c2ff" })
  });
  const ellipse = new Ellipse({
    x: 20,
    y: 30,
    radiusX: 16,
    radiusY: 8,
    material: new BasicMaterial({ fillColor: "#f45b69" })
  });
  const renderList = new RenderPipeline().build({ objects: [circle, ellipse] });
  const batch = createWebGLShapeBatch({
    items: renderList.getFlatItems(),
    camera: new Camera2D(),
    width: 100,
    height: 100,
    curveSegments: 8
  });

  assert.equal(batch.rects, 0);
  assert.equal(batch.circles, 1);
  assert.equal(batch.ellipses, 1);
  assert.equal(batch.lines, 0);
  assert.equal(batch.polylines, 0);
  assert.equal(batch.polygons, 0);
  assert.equal(batch.unsupported, 0);
  assert.deepEqual(batch.drawBatches, [
    { key: "fill:#35c2ff", firstVertex: 0, vertexCount: 24 },
    { key: "fill:#f45b69", firstVertex: 24, vertexCount: 24 }
  ]);
  assert.equal(batch.vertices.length, 288);
  assert.ok(Math.abs(batch.vertices[0]) < 0.000001);
  assert.ok(Math.abs(batch.vertices[1]) < 0.000001);
  assertAlmostEqual(batch.vertices[2], 53 / 255);
  assertAlmostEqual(batch.vertices[3], 194 / 255);
  assert.equal(batch.vertices[4], 1);
  assert.equal(batch.vertices[5], 1);
});

test("createWebGLShapeBatch writes line, polyline, and polygon geometry", () => {
  const line = new Line({
    x: 10,
    y: 10,
    endX: 40,
    endY: 0,
    material: new BasicMaterial({ strokeColor: "#facc15", lineWidth: 4 })
  });
  const polyline = new Polyline({
    x: 10,
    y: 30,
    points: [
      { x: 0, y: 0 },
      { x: 20, y: 10 },
      { x: 40, y: 0 }
    ],
    material: new BasicMaterial({ strokeColor: "#38bdf8", lineWidth: 4 })
  });
  const polygon = new Polygon({
    x: 70,
    y: 20,
    points: [
      { x: 0, y: 0 },
      { x: 20, y: 0 },
      { x: 10, y: 20 }
    ],
    material: new BasicMaterial({ fillColor: "#22c55e" })
  });
  const renderList = new RenderPipeline().build({ objects: [line, polyline, polygon] });
  const batch = createWebGLShapeBatch({
    items: renderList.getFlatItems(),
    camera: new Camera2D(),
    width: 100,
    height: 100
  });

  assert.equal(batch.lines, 1);
  assert.equal(batch.polylines, 1);
  assert.equal(batch.polygons, 1);
  assert.deepEqual(batch.drawBatches, [
    { key: "stroke:#facc15:4", firstVertex: 0, vertexCount: 6 },
    { key: "stroke:#38bdf8:4", firstVertex: 6, vertexCount: 12 },
    { key: "fill:#22c55e", firstVertex: 18, vertexCount: 3 }
  ]);
  assert.equal(batch.vertices.length, 126);
  assertAlmostEqual(batch.vertices[2], 250 / 255);
  assertAlmostEqual(batch.vertices[3], 204 / 255);
  assertAlmostEqual(batch.vertices[4], 21 / 255);
});

function assertAlmostEqual(actual, expected) {
  assert.ok(Math.abs(actual - expected) < 0.000001);
}
