import assert from "node:assert/strict";
import test from "node:test";
import { AssetGroupLoader, Texture, TextureAtlas } from "raw2d-sprite";

test("AssetGroupLoader loads texture and atlas manifest entries", async () => {
  const progress = [];
  const playerTexture = createTexture("player");
  const atlasTexture = createTexture("atlas");
  const atlas = new TextureAtlas({
    texture: atlasTexture,
    frames: { idle: { x: 0, y: 0, width: 16, height: 16 } }
  });
  const textureLoader = {
    async load(url) {
      assert.equal(url, "/player.png");
      return playerTexture;
    }
  };
  const atlasLoader = {
    async load(url) {
      assert.equal(url, "/player.atlas.json");
      return atlas;
    }
  };
  const loader = new AssetGroupLoader({ textureLoader, atlasLoader });

  const group = await loader.load({
    player: "/player.png",
    playerAtlas: { type: "atlas", url: "/player.atlas.json" }
  }, {
    onProgress: (event) => progress.push(event)
  });

  assert.equal(group.getTexture("player"), playerTexture);
  assert.equal(group.getAtlas("playerAtlas"), atlas);
  assert.deepEqual(group.getSnapshot(), {
    textureNames: ["player"],
    atlasNames: ["playerAtlas"],
    errorNames: []
  });
  assert.deepEqual(progress.map((event) => `${event.name}:${event.kind}:${event.status}`), [
    "player:texture:loaded",
    "playerAtlas:atlas:loaded"
  ]);
});

test("AssetGroupLoader can collect failed assets without rejecting", async () => {
  const loader = new AssetGroupLoader({
    failFast: false,
    textureLoader: {
      async load(url) {
        if (url.includes("missing")) {
          throw new Error("missing texture");
        }

        return createTexture("ok");
      }
    }
  });

  const group = await loader.load({
    ok: "/ok.png",
    missing: "/missing.png"
  });

  assert.equal(group.hasTexture("ok"), true);
  assert.equal(group.hasError("missing"), true);
  assert.match(group.getError("missing")?.message ?? "", /missing texture/);
});

test("AssetGroupLoader rejects failed assets by default", async () => {
  const loader = new AssetGroupLoader({
    textureLoader: {
      async load() {
        throw new Error("network failed");
      }
    }
  });

  await assert.rejects(() => loader.load({ player: "/player.png" }), /network failed/);
});

test("AssetGroup dispose disposes unique texture sources", async () => {
  let closeCount = 0;
  const texture = new Texture({
    source: {
      width: 16,
      height: 16,
      close() {
        closeCount += 1;
      }
    },
    width: 16,
    height: 16
  });
  const atlas = new TextureAtlas({ texture, frames: {} });
  const loader = new AssetGroupLoader({
    textureLoader: { async load() { return texture; } },
    atlasLoader: { async load() { return atlas; } }
  });

  const group = await loader.load({
    player: "/player.png",
    atlas: { type: "atlas", url: "/player.atlas.json" }
  });

  group.dispose();

  assert.equal(texture.isDisposed(), true);
  assert.equal(closeCount, 1);
});

function createTexture(id) {
  return new Texture({
    id,
    source: { width: 16, height: 16 },
    width: 16,
    height: 16
  });
}

