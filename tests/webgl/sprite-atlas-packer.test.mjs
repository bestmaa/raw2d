import assert from "node:assert/strict";
import test from "node:test";
import { Camera2D, Matrix3 } from "raw2d-core";
import { Sprite, TextureAtlasPacker } from "raw2d-sprite";
import { createWebGLSpriteBatch } from "raw2d-webgl";

test("packed atlas sprites stay in one WebGL sprite batch", () => {
  const atlas = new TextureAtlasPacker({
    padding: 2,
    maxWidth: 64,
    createCanvas: createCanvas
  }).pack([
    { name: "idle", source: { width: 16, height: 16 } },
    { name: "run", source: { width: 20, height: 10 } }
  ]);
  const idle = new Sprite({ texture: atlas.texture, frame: atlas.getFrame("idle"), width: 16, height: 16 });
  const run = new Sprite({ texture: atlas.texture, frame: atlas.getFrame("run"), width: 20, height: 10 });
  const batch = createWebGLSpriteBatch({
    items: [createRenderItem(idle, 0), createRenderItem(run, 1)],
    camera: new Camera2D(),
    width: 100,
    height: 100,
    getTextureKey: (texture) => texture === atlas.texture ? "atlas" : "other"
  });

  assert.equal(batch.textures, 1);
  assert.equal(batch.drawBatches.length, 1);
  assert.equal(batch.drawBatches[0].vertexCount, 12);
  assert.equal(batch.drawBatches[0].texture, atlas.texture);
  assertAlmostEqual(batch.vertices[2], atlas.getFrame("idle").x / atlas.texture.width);
  assertAlmostEqual(batch.vertices[3], atlas.getFrame("idle").y / atlas.texture.height);
  assertAlmostEqual(batch.vertices[32], atlas.getFrame("run").x / atlas.texture.width);
  assertAlmostEqual(batch.vertices[33], atlas.getFrame("run").y / atlas.texture.height);
});

function assertAlmostEqual(actual, expected) {
  assert.equal(Math.abs(actual - expected) < 0.000001, true);
}

function createRenderItem(object, order) {
  return {
    object,
    id: object.id,
    parentId: null,
    depth: 0,
    order,
    zIndex: 0,
    visible: true,
    culled: false,
    bounds: null,
    localMatrix: new Matrix3(),
    worldMatrix: new Matrix3(),
    children: []
  };
}

function createCanvas(width, height) {
  return {
    width,
    height,
    getContext(type) {
      if (type !== "2d") {
        return null;
      }

      return {
        clearRect() {},
        drawImage() {}
      };
    }
  };
}
