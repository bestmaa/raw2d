import assert from "node:assert/strict";
import test from "node:test";
import { createSvgTexture, rasterizeSvgToCanvas } from "raw2d-sprite";

test("rasterizeSvgToCanvas draws SVG input into an explicit canvas size", async () => {
  const fixture = createSvgRasterFixture();
  const canvas = await rasterizeSvgToCanvas({
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="12"></svg>',
    width: 24,
    height: 12,
    createCanvas: fixture.createCanvas,
    createImage: fixture.createImage,
    createObjectURL: fixture.createObjectURL,
    revokeObjectURL: fixture.revokeObjectURL
  });

  assert.equal(canvas.width, 24);
  assert.equal(canvas.height, 12);
  assert.equal(fixture.images[0].crossOrigin, "anonymous");
  assert.equal(fixture.images[0].decodeCount, 1);
  assert.deepEqual(fixture.contexts[0].calls, [
    "clearRect:0,0,24,12",
    "drawImage:blob:raw2d-svg-0:0,0,24,12"
  ]);
  assert.deepEqual(fixture.revokedUrls, ["blob:raw2d-svg-0"]);
});

test("createSvgTexture returns a Texture backed by the rasterized canvas", async () => {
  const fixture = createSvgRasterFixture();
  const texture = await createSvgTexture({
    svg: new Blob(["<svg></svg>"], { type: "image/svg+xml" }),
    width: 32,
    height: 16,
    id: "svg-icon",
    url: "inline://svg-icon",
    createCanvas: fixture.createCanvas,
    createImage: fixture.createImage,
    createObjectURL: fixture.createObjectURL,
    revokeObjectURL: fixture.revokeObjectURL
  });

  assert.deepEqual(texture.getSnapshot(), {
    id: "svg-icon",
    url: "inline://svg-icon",
    width: 32,
    height: 16,
    status: "ready"
  });
  assert.equal(texture.source, fixture.canvases[0]);
});

test("rasterizeSvgToCanvas revokes object URLs when image loading fails", async () => {
  const fixture = createSvgRasterFixture({ fail: true });

  await assert.rejects(
    () => rasterizeSvgToCanvas({
      svg: "<svg></svg>",
      width: 10,
      height: 10,
      createCanvas: fixture.createCanvas,
      createImage: fixture.createImage,
      createObjectURL: fixture.createObjectURL,
      revokeObjectURL: fixture.revokeObjectURL
    }),
    /Failed to rasterize SVG texture/
  );
  assert.deepEqual(fixture.revokedUrls, ["blob:raw2d-svg-0"]);
});

function createSvgRasterFixture(options = {}) {
  const canvases = [];
  const contexts = [];
  const images = [];
  const revokedUrls = [];
  const objectUrls = [];

  return {
    canvases,
    contexts,
    images,
    revokedUrls,
    createCanvas(width, height) {
      const context = new FakeSvgCanvasContext();
      const canvas = {
        width,
        height,
        getContext(type) {
          return type === "2d" ? context : null;
        }
      };

      canvases.push(canvas);
      contexts.push(context);
      return canvas;
    },
    createImage() {
      const image = new FakeSvgImage(options.fail === true);
      images.push(image);
      return image;
    },
    createObjectURL() {
      const url = `blob:raw2d-svg-${objectUrls.length}`;
      objectUrls.push(url);
      return url;
    },
    revokeObjectURL(url) {
      revokedUrls.push(url);
    }
  };
}

class FakeSvgCanvasContext {
  constructor() {
    this.calls = [];
  }

  clearRect(x, y, width, height) {
    this.calls.push(`clearRect:${x},${y},${width},${height}`);
  }

  drawImage(source, x, y, width, height) {
    this.calls.push(`drawImage:${source.src}:${x},${y},${width},${height}`);
  }
}

class FakeSvgImage {
  constructor(fail) {
    this.fail = fail;
    this.crossOrigin = null;
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
