import assert from "node:assert/strict";
import test from "node:test";
import { BasicMaterial } from "raw2d-core";
import { Text2D } from "raw2d-text";
import { WebGLTextTextureCache } from "raw2d-webgl";

test("WebGLTextTextureCache reuses texture when only transform changes", () => {
  const cache = new WebGLTextTextureCache({ createCanvas });
  const text = new Text2D({ text: "Raw2D", font: "18px sans-serif" });

  cache.beginFrame();
  const first = cache.get(text);

  text.x = 100;
  text.rotation = 0.4;
  cache.beginFrame();
  const second = cache.get(text);

  assert.equal(second.texture, first.texture);
  assert.deepEqual(cache.getStats(), {
    size: 1,
    hits: 1,
    misses: 0,
    evictions: 0,
    retired: 0
  });
});

test("WebGLTextTextureCache rebuilds texture when visual text style changes", () => {
  const cache = new WebGLTextTextureCache({ createCanvas });
  const material = new BasicMaterial({ fillColor: "#ffffff" });
  const text = new Text2D({ text: "Old", material });

  cache.get(text);
  cache.beginFrame();
  text.setText("New");
  const next = cache.get(text);

  assert.equal(next.key.includes("New"), true);
  assert.deepEqual(cache.getStats(), {
    size: 1,
    hits: 0,
    misses: 1,
    evictions: 0,
    retired: 1
  });
});

test("WebGLTextTextureCache evicts oldest text textures", () => {
  const cache = new WebGLTextTextureCache({ createCanvas, maxEntries: 1 });

  cache.beginFrame();
  cache.get(new Text2D({ text: "A" }));
  cache.get(new Text2D({ text: "B" }));

  assert.deepEqual(cache.getStats(), {
    size: 1,
    hits: 0,
    misses: 2,
    evictions: 1,
    retired: 1
  });
});

function createCanvas(width, height) {
  return {
    width,
    height,
    getContext(type) {
      return type === "2d" ? createFakeContext() : null;
    }
  };
}

function createFakeContext() {
  return {
    font: "",
    textAlign: "start",
    textBaseline: "alphabetic",
    fillStyle: "#ffffff",
    clearRect() {},
    fillText() {},
    measureText(text) {
      const width = text.length * 10;
      return {
        width,
        actualBoundingBoxLeft: 0,
        actualBoundingBoxRight: width,
        actualBoundingBoxAscent: 16,
        actualBoundingBoxDescent: 4
      };
    }
  };
}
