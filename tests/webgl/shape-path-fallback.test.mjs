import assert from "node:assert/strict";
import test from "node:test";
import { BasicMaterial, Camera2D, RenderPipeline, ShapePath } from "raw2d-core";
import { WebGLShapePathTextureCache, createWebGLShapePathFallbackBatch } from "raw2d-webgl";

test("WebGLShapePathTextureCache reuses texture when only transform changes", () => {
  const cache = new WebGLShapePathTextureCache({ createCanvas });
  const shapePath = createComplexShapePath();

  cache.beginFrame();
  const first = cache.get(shapePath);

  shapePath.x = 100;
  shapePath.rotation = 0.5;
  cache.beginFrame();
  const second = cache.get(shapePath);

  assert.equal(second.texture, first.texture);
  assert.deepEqual(cache.getStats(), {
    size: 1,
    hits: 1,
    misses: 0,
    evictions: 0,
    retired: 0
  });
});

test("WebGLShapePathTextureCache rebuilds texture when fill changes", () => {
  const cache = new WebGLShapePathTextureCache({ createCanvas });
  const material = new BasicMaterial({ fillColor: "#38bdf8" });
  const shapePath = createComplexShapePath(material);

  cache.get(shapePath);
  cache.beginFrame();
  material.fillColor = "#f45b69";
  const next = cache.get(shapePath);

  assert.equal(next.key.includes("#f45b69"), true);
  assert.deepEqual(cache.getStats(), {
    size: 1,
    hits: 0,
    misses: 1,
    evictions: 0,
    retired: 1
  });
});

test("createWebGLShapePathFallbackBatch writes texture quad for unsupported fill", () => {
  const cache = new WebGLShapePathTextureCache({ createCanvas });
  const shapePath = createComplexShapePath();
  const items = new RenderPipeline().build({ objects: [shapePath] }).getFlatItems();
  const batch = createWebGLShapePathFallbackBatch({
    items,
    camera: new Camera2D(),
    width: 100,
    height: 100,
    getTextureKey: (texture) => texture.id,
    getShapePathTexture: (path) => cache.get(path)
  });

  assert.equal(batch.drawBatches.length, 1);
  assert.equal(batch.vertices.length, 30);
  assert.equal(batch.sprites, 0);
  assert.equal(batch.textures, 1);
  assert.equal(batch.unsupported, 0);
});

function createComplexShapePath(material = new BasicMaterial({ fillColor: "#38bdf8" })) {
  return new ShapePath({ fill: true, stroke: false, material })
    .moveTo(0, 0)
    .lineTo(24, 0)
    .lineTo(24, 24)
    .closePath()
    .moveTo(8, 8)
    .lineTo(16, 8)
    .lineTo(16, 16)
    .closePath();
}

function createCanvas(width, height) {
  return {
    width,
    height,
    getContext(type) {
      return type === "2d" ? createFakeContext() : null;
    }
  };
}

function createFakeContext() {
  return {
    fillStyle: "#ffffff",
    beginPath() {},
    bezierCurveTo() {},
    clearRect() {},
    closePath() {},
    fill() {},
    lineTo() {},
    moveTo() {},
    quadraticCurveTo() {},
    restore() {},
    save() {},
    translate() {}
  };
}
