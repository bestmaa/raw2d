import assert from "node:assert/strict";
import test from "node:test";
import { Matrix3 } from "raw2d-core";
import { Sprite, Texture } from "raw2d-sprite";
import { Text2D } from "raw2d-text";
import { applyWebGLSpriteSorting } from "raw2d-webgl";

test("applyWebGLSpriteSorting sorts only within one zIndex boundary", () => {
  const textureA = createTexture();
  const textureB = createTexture();
  const lowB = createSprite("low-b", textureB, 0);
  const highB = createSprite("high-b", textureB, 1);
  const highA = createSprite("high-a", textureA, 1);
  const result = sortObjects([lowB, highB, highA], new Map([
    [textureA, "a"],
    [textureB, "b"]
  ]));

  assert.deepEqual(result.map((item) => item.object.name), ["low-b", "high-a", "high-b"]);
  assert.deepEqual(result.map((item) => item.zIndex), [0, 1, 1]);
});

test("applyWebGLSpriteSorting preserves renderMode boundaries", () => {
  const textureA = createTexture();
  const textureB = createTexture();
  const dynamicB = createSprite("dynamic-b", textureB, 0, "dynamic");
  const staticA = createSprite("static-a", textureA, 0, "static");
  const result = sortObjects([dynamicB, staticA], new Map([
    [textureA, "a"],
    [textureB, "b"]
  ]));

  assert.deepEqual(result.map((item) => item.object.name), ["dynamic-b", "static-a"]);
});

test("applyWebGLSpriteSorting leaves mixed texture runs unchanged", () => {
  const textureA = createTexture();
  const sprite = createSprite("sprite", textureA, 0);
  const text = new Text2D({ name: "text", text: "Raw2D" });
  const runs = applyWebGLSpriteSorting({
    runs: [createRun([createItem(sprite), createItem(text)])],
    mode: "texture",
    getTextureKey: () => "a"
  });

  assert.deepEqual(runs[0].items.map((item) => item.object.name), ["sprite", "text"]);
});

function sortObjects(objects, textureKeys) {
  const runs = applyWebGLSpriteSorting({
    runs: [createRun(objects.map((object) => createItem(object)))],
    mode: "texture",
    getTextureKey: (texture) => textureKeys.get(texture) ?? texture.id
  });

  return runs[0].items;
}

function createRun(items) {
  return { kind: "sprite", mode: "dynamic", items };
}

function createItem(object) {
  return {
    object,
    id: object.id,
    parentId: null,
    depth: 0,
    order: 0,
    zIndex: object.zIndex,
    visible: object.visible,
    culled: false,
    bounds: null,
    localMatrix: new Matrix3(),
    worldMatrix: new Matrix3(),
    children: []
  };
}

function createSprite(name, texture, zIndex, renderMode = "dynamic") {
  return new Sprite({ name, texture, zIndex, renderMode, width: 16, height: 16 });
}

function createTexture() {
  return new Texture({ source: { width: 16, height: 16 }, width: 16, height: 16 });
}
