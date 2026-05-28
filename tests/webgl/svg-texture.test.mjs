import assert from "node:assert/strict";
import test from "node:test";
import { Camera2D, Matrix3 } from "raw2d-core";
import { Sprite, createSvgTexture } from "raw2d-sprite";
import { createWebGLSpriteBatch } from "raw2d-webgl";

test("rasterized SVG textures feed the WebGL sprite batch path", async () => {
  const fixture = createSvgRasterFixture();
  const texture = await createSvgTexture({
    svg: "<svg></svg>",
    width: 20,
    height: 12,
    createCanvas: fixture.createCanvas,
    createImage: fixture.createImage,
    createObjectURL: fixture.createObjectURL,
    revokeObjectURL: fixture.revokeObjectURL
  });
  const sprite = new Sprite({ texture, width: 20, height: 12 });
  const batch = createWebGLSpriteBatch({
    items: [createRenderItem(sprite)],
    camera: new Camera2D(),
    width: 100,
    height: 100,
    getTextureKey: () => "svg-texture"
  });

  assert.equal(batch.textures, 1);
  assert.equal(batch.drawBatches.length, 1);
  assert.equal(batch.drawBatches[0].texture, texture);
  assert.equal(batch.drawBatches[0].vertexCount, 6);
});

function createRenderItem(object) {
  return {
    object,
    id: object.id,
    parentId: null,
    depth: 0,
    order: 0,
    zIndex: 0,
    visible: true,
    culled: false,
    bounds: null,
    localMatrix: new Matrix3(),
    worldMatrix: new Matrix3(),
    children: []
  };
}

function createSvgRasterFixture() {
  return {
    createCanvas(width, height) {
      return {
        width,
        height,
        getContext(type) {
          return type === "2d" ? { clearRect() {}, drawImage() {} } : null;
        }
      };
    },
    createImage() {
      return new FakeSvgImage();
    },
    createObjectURL() {
      return "blob:raw2d-svg";
    },
    revokeObjectURL() {}
  };
}

class FakeSvgImage {
  constructor() {
    this.crossOrigin = null;
    this.listeners = new Map();
    this.currentSrc = "";
  }

  set src(value) {
    this.currentSrc = value;
    queueMicrotask(() => this.emit("load"));
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

  async decode() {}

  emit(type) {
    for (const listener of this.listeners.get(type) ?? []) {
      listener();
    }
  }
}
