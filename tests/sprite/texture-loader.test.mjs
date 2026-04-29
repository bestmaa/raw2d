import assert from "node:assert/strict";
import test from "node:test";
import { TextureLoader } from "raw2d-sprite";

test("TextureLoader creates textures from existing image sources", () => {
  let closed = false;
  const source = {
    width: 40,
    height: 20,
    close() {
      closed = true;
    }
  };
  const texture = new TextureLoader().fromSource(source, {
    id: "manual-texture",
    url: "memory://sprite"
  });

  assert.deepEqual(texture.getSize(), { width: 40, height: 20 });
  assert.deepEqual(texture.getSnapshot(), {
    id: "manual-texture",
    url: "memory://sprite",
    width: 40,
    height: 20,
    status: "ready"
  });

  texture.dispose();
  assert.equal(texture.isDisposed(), true);
  assert.equal(closed, true);
});

test("TextureLoader loads URL images with cache, decode, and crossOrigin", async () => {
  const factory = createImageFactory();
  const loader = new TextureLoader({
    cache: true,
    crossOrigin: "anonymous",
    createImage: factory.createImage
  });

  const first = loader.load("/player.png");
  const second = loader.load("/player.png");

  assert.equal(first, second);

  const texture = await first;
  const image = factory.images[0];

  assert.equal(factory.images.length, 1);
  assert.equal(image.crossOrigin, "anonymous");
  assert.equal(image.decodeCount, 1);
  assert.equal(texture.url, "/player.png");
  assert.deepEqual(texture.getSize(), { width: 64, height: 32 });
  assert.equal(loader.getCacheSize(), 1);

  assert.equal(loader.deleteFromCache("/player.png"), true);
  await loader.load("/player.png");
  assert.equal(factory.images.length, 2);
});

test("TextureLoader removes failed URL loads from cache", async () => {
  const factory = createImageFactory({ fail: true });
  const loader = new TextureLoader({ cache: true, createImage: factory.createImage });

  await assert.rejects(() => loader.load("/missing.png"), /Failed to load texture/);
  assert.equal(loader.getCacheSize(), 0);
});

test("TextureLoader can build ImageBitmap-backed textures", async () => {
  const factory = createImageFactory();
  const bitmap = { width: 128, height: 64 };
  let bitmapSource = null;
  const loader = new TextureLoader({
    imageBitmap: true,
    createImage: factory.createImage,
    createImageBitmap: async (source) => {
      bitmapSource = source;
      return bitmap;
    }
  });

  const texture = await loader.load("/atlas.png");

  assert.equal(bitmapSource, factory.images[0]);
  assert.equal(texture.source, bitmap);
  assert.deepEqual(texture.getSize(), { width: 128, height: 64 });
});

function createImageFactory(options = {}) {
  const images = [];

  return {
    images,
    createImage() {
      const image = new FakeTextureImage(options.fail === true);
      images.push(image);
      return image;
    }
  };
}

class FakeTextureImage {
  constructor(fail) {
    this.fail = fail;
    this.crossOrigin = null;
    this.naturalWidth = 64;
    this.naturalHeight = 32;
    this.decodeCount = 0;
    this.listeners = new Map();
    this.currentSrc = "";
  }

  set src(value) {
    this.currentSrc = value;
    queueMicrotask(() => {
      this.emit(this.fail ? "error" : "load");
    });
  }

  get src() {
    return this.currentSrc;
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) ?? new Set();
    listeners.add(listener);
    this.listeners.set(type, listeners);
  }

  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener);
  }

  async decode() {
    this.decodeCount += 1;
  }

  emit(type) {
    for (const listener of this.listeners.get(type) ?? []) {
      listener();
    }
  }
}

