import assert from "node:assert/strict";
import test from "node:test";
import { Sprite, Texture, TextureAtlas } from "raw2d-sprite";

test("TextureAtlas stores named frames for one texture", () => {
  const texture = createTexture();
  const atlas = new TextureAtlas({
    texture,
    frames: {
      idle: { x: 0, y: 0, width: 32, height: 32 },
      run: { x: 32, y: 0, width: 32, height: 32 }
    }
  });

  assert.equal(atlas.texture, texture);
  assert.equal(atlas.getVersion(), 0);
  assert.equal(atlas.hasFrame("idle"), true);
  assert.deepEqual(atlas.getFrame("run"), { x: 32, y: 0, width: 32, height: 32 });
  assert.deepEqual(atlas.getFrameNames(), ["idle", "run"]);
});

test("Sprite can use and replace a TextureAtlas frame", () => {
  const texture = createTexture();
  const atlas = new TextureAtlas({
    texture,
    frames: {
      tile: { x: 16, y: 8, width: 32, height: 24 }
    }
  });
  const sprite = new Sprite({ texture: atlas.texture, frame: atlas.getFrame("tile") });

  assert.deepEqual(sprite.frame, { x: 16, y: 8, width: 32, height: 24 });
  assert.deepEqual(sprite.getSize(), { width: 32, height: 24 });

  sprite.setFrame({ x: 0, y: 0, width: 12, height: 14 });
  assert.deepEqual(sprite.frame, { x: 0, y: 0, width: 12, height: 14 });
  assert.deepEqual(sprite.getDirtyState(), { version: 1, dirty: true });
});

test("TextureAtlas version changes when frames are updated", () => {
  const atlas = new TextureAtlas({ texture: createTexture() });

  atlas.setFrame({ name: "idle", x: 0, y: 0, width: 16, height: 16 });

  assert.equal(atlas.getVersion(), 1);
});

function createTexture() {
  return new Texture({
    source: { width: 64, height: 64 },
    width: 64,
    height: 64
  });
}
