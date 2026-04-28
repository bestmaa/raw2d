import assert from "node:assert/strict";
import test from "node:test";
import { BasicMaterial, Camera2D, Rect, RenderPipeline } from "raw2d-core";
import { createWebGLRectBatch, parseWebGLColor } from "raw2d-webgl";

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
