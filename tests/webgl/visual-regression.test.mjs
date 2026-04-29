import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { Arc, BasicMaterial, Camera2D, Circle, Ellipse, Line, Polygon, Polyline, Rect, RenderPipeline, ShapePath } from "raw2d-core";
import { Sprite, Texture } from "raw2d-sprite";
import { Text2D } from "raw2d-text";
import { createWebGLShapeBatch, createWebGLSpriteBatch } from "raw2d-webgl";

test("WebGL shape visual geometry stays stable", () => {
  assert.deepEqual(createShapeVisualSnapshot(), {
    drawBatches: [
      { key: "fill:#f45b69", firstVertex: 0, vertexCount: 6 },
      { key: "fill:#35c2ff", firstVertex: 6, vertexCount: 48 },
      { key: "fill:#f45b69", firstVertex: 54, vertexCount: 48 },
      { key: "fill:#35c2ff", firstVertex: 102, vertexCount: 33 },
      { key: "stroke:#f5f7fb:3:round:round:10", firstVertex: 135, vertexCount: 54 },
      { key: "stroke:#10141c:2:butt:miter:10", firstVertex: 189, vertexCount: 15 },
      { key: "fill:#f45b69", firstVertex: 204, vertexCount: 6 },
      { key: "fill:#35c2ff", firstVertex: 210, vertexCount: 51 },
      { key: "stroke:#10141c:2:butt:miter:10", firstVertex: 261, vertexCount: 171 }
    ],
    counts: { rects: 1, circles: 1, ellipses: 1, arcs: 1, lines: 1, polylines: 1, polygons: 1, shapePaths: 1, unsupported: 0 },
    vertexCount: 432,
    vertexHash: "aad3fbd261b300ad42e6"
  });
});

test("WebGL sprite and text visual quads stay stable", () => {
  assert.deepEqual(createSpriteVisualSnapshot(), {
    drawBatches: [
      { key: "sprite", firstVertex: 0, vertexCount: 6 },
      { key: "text", firstVertex: 6, vertexCount: 6 }
    ],
    sprites: 1,
    textures: 2,
    unsupported: 0,
    vertexCount: 12,
    vertexHash: "1d8ff7b523cbbfcecf72"
  });
});

function createShapeVisualSnapshot() {
  const red = new BasicMaterial({ fillColor: "#f45b69", strokeColor: "#f5f7fb", lineWidth: 3, strokeCap: "round", strokeJoin: "round" });
  const blue = new BasicMaterial({ fillColor: "#35c2ff", strokeColor: "#10141c", lineWidth: 2 });
  const camera = new Camera2D({ x: 10, y: 5, zoom: 1.25 });
  const batch = createWebGLShapeBatch({
    items: createItems([
      new Rect({ x: 24, y: 20, width: 48, height: 32, material: red }),
      new Circle({ x: 120, y: 42, radius: 22, material: blue }),
      new Ellipse({ x: 174, y: 42, radiusX: 26, radiusY: 14, material: red }),
      new Arc({ x: 76, y: 108, radiusX: 28, radiusY: 20, startAngle: 0, endAngle: Math.PI * 1.35, closed: true, material: blue }),
      new Line({ x: 150, y: 96, startX: 0, startY: 0, endX: 70, endY: 16, material: red }),
      new Polyline({ x: 26, y: 152, points: [{ x: 0, y: 0 }, { x: 36, y: -18 }, { x: 72, y: 10 }], material: blue }),
      new Polygon({ x: 132, y: 140, points: [{ x: 0, y: 0 }, { x: 42, y: 8 }, { x: 30, y: 48 }, { x: -8, y: 36 }], material: red }),
      createShapePath(blue)
    ]),
    camera,
    width: 320,
    height: 200,
    curveSegments: 16
  });
  return {
    drawBatches: batch.drawBatches.map(toDrawBatchSnapshot),
    counts: {
      rects: batch.rects,
      circles: batch.circles,
      ellipses: batch.ellipses,
      arcs: batch.arcs,
      lines: batch.lines,
      polylines: batch.polylines,
      polygons: batch.polygons,
      shapePaths: batch.shapePaths,
      unsupported: batch.unsupported
    },
    vertexCount: batch.vertices.length / 6,
    vertexHash: hashVertices(batch.vertices)
  };
}

function createSpriteVisualSnapshot() {
  const texture = new Texture({ source: { width: 64, height: 32 }, width: 64, height: 32 });
  const textTexture = new Texture({ source: { width: 96, height: 28 }, width: 96, height: 28 });
  const sprite = new Sprite({ texture, x: 40, y: 32, width: 32, height: 24, origin: "center", opacity: 0.75 });
  const label = new Text2D({ x: 100, y: 42, text: "Raw2D", font: "20px sans-serif" });
  const batch = createWebGLSpriteBatch({
    items: createItems([sprite, label]),
    camera: new Camera2D(),
    width: 160,
    height: 100,
    getTextureKey: (candidate) => candidate === texture ? "sprite" : "text",
    getTextTexture: () => ({ texture: textTexture, key: "label", localX: -2, localY: -18, width: 96, height: 28 })
  });
  return {
    drawBatches: batch.drawBatches.map(toDrawBatchSnapshot),
    sprites: batch.sprites,
    textures: batch.textures,
    unsupported: batch.unsupported,
    vertexCount: batch.vertices.length / 5,
    vertexHash: hashVertices(batch.vertices)
  };
}

function createShapePath(material) {
  return new ShapePath({ x: 220, y: 48, material })
    .moveTo(0, 0)
    .quadraticCurveTo(45, -24, 90, 0)
    .lineTo(72, 48)
    .lineTo(18, 48)
    .closePath();
}

function createItems(objects) {
  return new RenderPipeline().build({ objects }).getFlatItems();
}

function toDrawBatchSnapshot(batch) {
  return { key: batch.key, firstVertex: batch.firstVertex, vertexCount: batch.vertexCount };
}

function hashVertices(vertices) {
  const normalized = Array.from(vertices, (value) => Number(value.toFixed(6))).join(",");
  return createHash("sha256").update(normalized).digest("hex").slice(0, 20);
}
