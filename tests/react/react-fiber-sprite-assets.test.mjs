import assert from "node:assert/strict";
import test from "node:test";
import { AssetGroup, Group2D, Scene, Sprite, Texture } from "raw2d";
import { createRaw2DFiberHostConfig, resolveRaw2DFiberSpriteTexture } from "raw2d-react-fiber";

test("raw2d-react-fiber sprites mount from direct textures", () => {
  const config = createRaw2DFiberHostConfig();
  const texture = createTexture(18, 12);
  const sprite = config.createInstance("rawSprite", { texture });

  assert.ok(sprite.object instanceof Sprite);
  assert.equal(sprite.object.texture, texture);
  assert.equal(sprite.object.width, 18);
  assert.equal(sprite.object.height, 12);
});

test("raw2d-react-fiber sprites resolve textures from asset groups", () => {
  const texture = createTexture(24, 10);
  const assetGroup = createAssetGroup("hero", texture);
  const config = createRaw2DFiberHostConfig();
  const sprite = config.createInstance("rawSprite", { assetGroup, textureName: "hero" });

  assert.ok(sprite.object instanceof Sprite);
  assert.equal(sprite.object.texture, texture);
  assert.equal(sprite.object.width, 24);
  assert.equal(sprite.object.height, 10);
  assert.equal(resolveRaw2DFiberSpriteTexture({ assetGroup, textureName: "hero" }), texture);
});

test("raw2d-react-fiber sprites require a texture source", () => {
  const config = createRaw2DFiberHostConfig();

  assert.throws(() => {
    config.createInstance("rawSprite", {});
  }, /rawSprite requires a texture or assetGroup with textureName/);
});

test("raw2d-react-fiber disposes owned sprite textures on replacement only", () => {
  const config = createRaw2DFiberHostConfig();
  const first = createTexture();
  const second = createTexture(32, 32);
  const sprite = config.createInstance("rawSprite", {
    texture: first,
    textureOwnership: "owned"
  });

  config.commitUpdate(sprite, {
    texture: second,
    textureOwnership: "external"
  });

  assert.equal(first.isDisposed(), true);
  assert.equal(second.isDisposed(), false);
});

test("raw2d-react-fiber keeps external textures alive on update and unmount", () => {
  const config = createRaw2DFiberHostConfig();
  const scene = new Scene();
  const texture = createTexture();
  const sprite = config.createInstance("rawSprite", { texture });

  config.appendChild(scene, sprite);
  config.commitUpdate(sprite, { texture, opacity: 0.4 });
  config.removeChild(scene, sprite);

  assert.equal(texture.isDisposed(), false);
  assert.equal(scene.getObjects().length, 0);
});

test("raw2d-react-fiber disposes owned textures on unmount", () => {
  const config = createRaw2DFiberHostConfig();
  const scene = new Scene();
  const texture = createTexture();
  const sprite = config.createInstance("rawSprite", {
    texture,
    textureOwnership: "owned"
  });

  config.appendChild(scene, sprite);
  config.removeChild(scene, sprite);

  assert.equal(texture.isDisposed(), true);
});

test("raw2d-react-fiber does not dispose asset group textures by default", () => {
  const config = createRaw2DFiberHostConfig();
  const scene = new Scene();
  const texture = createTexture();
  const assetGroup = createAssetGroup("hero", texture);
  const sprite = config.createInstance("rawSprite", { assetGroup, textureName: "hero" });

  config.appendChild(scene, sprite);
  config.removeChild(scene, sprite);

  assert.equal(texture.isDisposed(), false);
});

test("raw2d-react-fiber recursively disposes owned sprite children", () => {
  const config = createRaw2DFiberHostConfig();
  const scene = new Scene();
  const texture = createTexture();
  const group = config.createInstance("rawGroup2D", { name: "layer" });
  const sprite = config.createInstance("rawSprite", {
    texture,
    textureOwnership: "owned"
  });

  config.appendChild(scene, group);
  config.appendChild(group, sprite);

  assert.ok(group.object instanceof Group2D);
  assert.equal(group.children.length, 1);

  config.removeChild(scene, group);

  assert.equal(texture.isDisposed(), true);
  assert.equal(group.children.length, 0);
  assert.equal(group.object.getChildren().length, 0);
});

function createTexture(width = 16, height = 16) {
  return new Texture({ source: { width, height, close: () => undefined }, width, height });
}

function createAssetGroup(name, texture) {
  return new AssetGroup({ textures: new Map([[name, texture]]) });
}
