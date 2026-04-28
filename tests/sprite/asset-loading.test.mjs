import assert from "node:assert/strict";
import test from "node:test";
import { Texture, TextureAtlasLoader, createSpriteAnimationClip } from "raw2d-sprite";

test("TextureAtlasLoader loads atlas JSON and resolves image URLs from atlas directory", async () => {
  const loadedUrls = [];
  const texture = createTexture();
  const loader = new TextureAtlasLoader({
    fetch: async (url) => ({
      ok: true,
      status: 200,
      async json() {
        return {
          image: "sprites.png",
          frames: {
            idle: { x: 0, y: 0, width: 16, height: 16 },
            run: { x: 16, y: 0, width: 16, height: 16 }
          }
        };
      }
    }),
    textureLoader: {
      async load(url) {
        loadedUrls.push(url);
        return texture;
      }
    }
  });

  const atlas = await loader.load("https://cdn.raw2d.com/assets/player.atlas.json");

  assert.equal(atlas.texture, texture);
  assert.deepEqual(atlas.getFrame("run"), { x: 16, y: 0, width: 16, height: 16 });
  assert.deepEqual(loadedUrls, ["https://cdn.raw2d.com/assets/sprites.png"]);
});

test("TextureAtlasLoader caches atlas promises when cache is enabled", async () => {
  let fetchCount = 0;
  const loader = new TextureAtlasLoader({
    cache: true,
    fetch: async () => {
      fetchCount += 1;
      return {
        ok: true,
        async json() {
          return { image: "sheet.png", frames: { a: { x: 0, y: 0, width: 8, height: 8 } } };
        }
      };
    },
    textureLoader: {
      async load() {
        return createTexture();
      }
    }
  });

  const first = await loader.load("/atlas.json");
  const second = await loader.load("/atlas.json");

  assert.equal(first, second);
  assert.equal(fetchCount, 1);
});

test("createSpriteAnimationClip builds a clip from atlas frame names", async () => {
  const loader = new TextureAtlasLoader({
    fetch: async () => ({
      async json() {
        return {
          image: "sheet.png",
          frames: {
            a: { x: 0, y: 0, width: 8, height: 8 },
            b: { x: 8, y: 0, width: 8, height: 8 }
          }
        };
      }
    }),
    textureLoader: {
      async load() {
        return createTexture();
      }
    }
  });
  const atlas = await loader.load("/atlas.json");
  const clip = createSpriteAnimationClip({
    atlas,
    frameNames: ["a", "b"],
    fps: 12,
    loop: true,
    name: "idle"
  });

  assert.equal(clip.name, "idle");
  assert.equal(clip.frameCount, 2);
  assert.deepEqual(clip.getFrame(1), { x: 8, y: 0, width: 8, height: 8 });
});

test("TextureAtlasLoader rejects invalid atlas data", async () => {
  const loader = new TextureAtlasLoader({
    fetch: async () => ({
      async json() {
        return { image: "sheet.png", frames: { broken: { x: 0 } } };
      }
    }),
    textureLoader: {
      async load() {
        return createTexture();
      }
    }
  });

  await assert.rejects(() => loader.load("/broken.json"), /Invalid texture atlas data/);
});

function createTexture() {
  return new Texture({
    source: { width: 32, height: 32 },
    width: 32,
    height: 32
  });
}
