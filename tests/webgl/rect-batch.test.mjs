import assert from "node:assert/strict";
import test from "node:test";
import { BasicMaterial, Camera2D, Circle, Ellipse, Line, Polygon, Polyline, Rect, RenderPipeline } from "raw2d-core";
import { Sprite, Texture } from "raw2d-sprite";
import {
  WebGLBufferUploader,
  WebGLFloatBuffer,
  createWebGLRectBatch,
  createWebGLRenderRuns,
  createWebGLShapeBatch,
  createWebGLSpriteBatch,
  getWebGLRenderRunKind,
  parseWebGLColor
} from "raw2d-webgl";

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

test("createWebGLSpriteBatch writes textured quad vertices", () => {
  const texture = new Texture({
    source: { width: 16, height: 16 },
    width: 16,
    height: 16
  });
  const sprite = new Sprite({ texture, x: 10, y: 20, width: 16, height: 8, opacity: 0.75 });
  const renderList = new RenderPipeline().build({ objects: [sprite] });
  const batch = createWebGLSpriteBatch({
    items: renderList.getFlatItems(),
    camera: new Camera2D(),
    width: 100,
    height: 100,
    getTextureKey: () => "texture:1"
  });

  assert.equal(batch.sprites, 1);
  assert.equal(batch.textures, 1);
  assert.equal(batch.unsupported, 0);
  assert.deepEqual(batch.drawBatches, [
    { key: "texture:1", texture, firstVertex: 0, vertexCount: 6 }
  ]);
  assert.equal(batch.vertices.length, 30);
  assertAlmostEqual(batch.vertices[0], -0.8);
  assertAlmostEqual(batch.vertices[1], 0.6);
  assert.equal(batch.vertices[2], 0);
  assert.equal(batch.vertices[3], 0);
  assert.equal(batch.vertices[4], 0.75);
});

test("createWebGLSpriteBatch writes atlas frame UVs", () => {
  const texture = new Texture({
    source: { width: 64, height: 64 },
    width: 64,
    height: 64
  });
  const sprite = new Sprite({
    texture,
    frame: { x: 16, y: 8, width: 32, height: 24 },
    x: 0,
    y: 0
  });
  const renderList = new RenderPipeline().build({ objects: [sprite] });
  const batch = createWebGLSpriteBatch({
    items: renderList.getFlatItems(),
    camera: new Camera2D(),
    width: 100,
    height: 100,
    getTextureKey: () => "texture:1"
  });

  assertAlmostEqual(batch.vertices[2], 0.25);
  assertAlmostEqual(batch.vertices[3], 0.125);
  assertAlmostEqual(batch.vertices[7], 0.75);
  assertAlmostEqual(batch.vertices[8], 0.125);
  assertAlmostEqual(batch.vertices[12], 0.75);
  assertAlmostEqual(batch.vertices[13], 0.5);
});

test("WebGLFloatBuffer reuses backing storage until capacity grows", () => {
  const floatBuffer = new WebGLFloatBuffer({ initialCapacity: 12 });
  const first = floatBuffer.acquire(12);
  const firstBacking = first.buffer;
  const second = floatBuffer.acquire(6);

  assert.equal(second.buffer, firstBacking);
  assert.equal(floatBuffer.getUsed(), 6);
  assert.equal(floatBuffer.getCapacity(), 12);

  const third = floatBuffer.acquire(40);

  assert.notEqual(third.buffer, firstBacking);
  assert.equal(floatBuffer.getUsed(), 40);
  assert.ok(floatBuffer.getCapacity() >= 40);
});

test("createWebGLShapeBatch can write into a reusable float buffer", () => {
  const floatBuffer = new WebGLFloatBuffer();
  const firstBatch = createWebGLShapeBatch({
    items: new RenderPipeline().build({ objects: [new Rect({ width: 10, height: 10 })] }).getFlatItems(),
    camera: new Camera2D(),
    width: 100,
    height: 100,
    floatBuffer
  });
  const firstBacking = firstBatch.vertices.buffer;
  const secondBatch = createWebGLShapeBatch({
    items: new RenderPipeline().build({ objects: [new Rect({ width: 8, height: 8 })] }).getFlatItems(),
    camera: new Camera2D(),
    width: 100,
    height: 100,
    floatBuffer
  });

  assert.equal(secondBatch.vertices.buffer, firstBacking);
  assert.equal(floatBuffer.getUsed(), 36);
});

test("createWebGLSpriteBatch can write into a reusable float buffer", () => {
  const floatBuffer = new WebGLFloatBuffer();
  const texture = new Texture({ source: { width: 16, height: 16 }, width: 16, height: 16 });
  const sprite = new Sprite({ texture, width: 16, height: 16 });
  const firstBatch = createWebGLSpriteBatch({
    items: new RenderPipeline().build({ objects: [sprite] }).getFlatItems(),
    camera: new Camera2D(),
    width: 100,
    height: 100,
    getTextureKey: () => "texture:1",
    floatBuffer
  });
  const firstBacking = firstBatch.vertices.buffer;
  const secondBatch = createWebGLSpriteBatch({
    items: new RenderPipeline().build({ objects: [sprite] }).getFlatItems(),
    camera: new Camera2D(),
    width: 100,
    height: 100,
    getTextureKey: () => "texture:1",
    floatBuffer
  });

  assert.equal(secondBatch.vertices.buffer, firstBacking);
  assert.equal(floatBuffer.getUsed(), 30);
});

test("WebGLBufferUploader uses bufferData until GPU capacity is large enough", () => {
  const gl = createUploadFakeWebGL2Context();
  const uploader = new WebGLBufferUploader({
    gl,
    target: gl.ARRAY_BUFFER,
    usage: gl.DYNAMIC_DRAW
  });
  const first = uploader.upload(new Float32Array(12));
  const second = uploader.upload(new Float32Array(6));

  assert.deepEqual(first, {
    mode: "bufferData",
    byteLength: 48,
    capacity: 48
  });
  assert.deepEqual(second, {
    mode: "bufferSubData",
    byteLength: 24,
    capacity: 48
  });
  assert.deepEqual(gl.calls, [
    "createBuffer",
    "bindBuffer:34962",
    "bufferData:34962,12,35048",
    "bindBuffer:34962",
    "bufferSubData:34962,0,6"
  ]);
});

test("createWebGLRenderRuns splits supported objects by render mode", () => {
  const staticRect = new Rect({ width: 10, height: 10 });
  const dynamicRect = new Rect({ width: 10, height: 10 });
  staticRect.setRenderMode("static");
  const items = new RenderPipeline().build({ objects: [staticRect, dynamicRect] }).getFlatItems();
  const runs = createWebGLRenderRuns(items, getWebGLRenderRunKind);

  assert.deepEqual(runs.map((run) => ({ kind: run.kind, mode: run.mode, count: run.items.length })), [
    { kind: "shape", mode: "static", count: 1 },
    { kind: "shape", mode: "dynamic", count: 1 }
  ]);
});

function assertAlmostEqual(actual, expected) {
  assert.ok(Math.abs(actual - expected) < 0.000001);
}

function createUploadFakeWebGL2Context() {
  return {
    ARRAY_BUFFER: 34962,
    DYNAMIC_DRAW: 35048,
    calls: [],
    bindBuffer(target) {
      this.calls.push(`bindBuffer:${target}`);
    },
    bufferData(target, data, usage) {
      this.calls.push(`bufferData:${target},${data.length},${usage}`);
    },
    bufferSubData(target, offset, data) {
      this.calls.push(`bufferSubData:${target},${offset},${data.length}`);
    },
    createBuffer() {
      this.calls.push("createBuffer");
      return {};
    }
  };
}
