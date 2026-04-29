import assert from "node:assert/strict";
import test from "node:test";
import { Sprite, Texture } from "raw2d-sprite";
import {
  analyzeWebGLSpriteBatching,
  estimateWebGLSpriteTextureBinds,
  sortWebGLSpritesForBatching
} from "raw2d-webgl";

test("sortWebGLSpritesForBatching groups sprites by zIndex, render mode, and texture", () => {
  const textureA = createTexture("a");
  const textureB = createTexture("b");
  const sprites = [
    new Sprite({ name: "b1", texture: textureB, zIndex: 0 }),
    new Sprite({ name: "a1", texture: textureA, zIndex: 0 }),
    new Sprite({ name: "b2", texture: textureB, zIndex: 0 }),
    new Sprite({ name: "front", texture: textureA, zIndex: 10 })
  ];

  const sorted = sortWebGLSpritesForBatching({ sprites });

  assert.deepEqual(sorted.map((sprite) => sprite.name), ["a1", "b1", "b2", "front"]);
});

test("sortWebGLSpritesForBatching keeps static and dynamic sprites in separate runs", () => {
  const texture = createTexture("shared");
  const dynamic = new Sprite({ name: "dynamic", texture });
  const staticSprite = new Sprite({ name: "static", texture });

  staticSprite.setRenderMode("static");

  const sorted = sortWebGLSpritesForBatching({ sprites: [dynamic, staticSprite] });

  assert.deepEqual(sorted.map((sprite) => sprite.name), ["dynamic", "static"]);
});

test("estimateWebGLSpriteTextureBinds counts consecutive compatible texture groups", () => {
  const textureA = createTexture("a");
  const textureB = createTexture("b");
  const mixed = [
    new Sprite({ texture: textureA }),
    new Sprite({ texture: textureB }),
    new Sprite({ texture: textureA }),
    new Sprite({ texture: textureB })
  ];
  const sorted = sortWebGLSpritesForBatching({ sprites: mixed });

  assert.equal(estimateWebGLSpriteTextureBinds({ sprites: mixed }), 4);
  assert.equal(estimateWebGLSpriteTextureBinds({ sprites: sorted }), 2);
});

test("analyzeWebGLSpriteBatching reports bind reduction and texture groups", () => {
  const textureA = createTexture("a");
  const textureB = createTexture("b");
  const sprites = [
    new Sprite({ texture: textureA }),
    new Sprite({ texture: textureB }),
    new Sprite({ texture: textureA }),
    new Sprite({ texture: textureB })
  ];

  assert.deepEqual(analyzeWebGLSpriteBatching({ sprites }), {
    spriteCount: 4,
    textureGroupCount: 2,
    currentTextureBinds: 4,
    sortedTextureBinds: 2,
    potentialReduction: 2,
    averageSpritesPerCurrentBind: 1,
    averageSpritesPerSortedBind: 2,
    textureGroups: [
      { key: "a", count: 2 },
      { key: "b", count: 2 }
    ]
  });
});

function createTexture(id) {
  return new Texture({
    id,
    source: { width: 16, height: 16 },
    width: 16,
    height: 16
  });
}
