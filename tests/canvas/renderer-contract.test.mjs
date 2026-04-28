import assert from "node:assert/strict";
import test from "node:test";
import { Camera2D, Rect, Scene } from "raw2d-core";
import { Canvas } from "raw2d-canvas";

test("Canvas exposes the shared renderer lifecycle surface", () => {
  const renderer = new Canvas({ canvas: createFakeCanvas(), width: 100, height: 80, pixelRatio: 1 });
  const scene = new Scene();

  scene.add(new Rect({ x: 10, y: 10, width: 20, height: 20 }));
  renderer.setBackgroundColor("#10141c");
  renderer.render(scene, new Camera2D());
  renderer.dispose();

  assert.deepEqual(renderer.getSize(), { width: 100, height: 80, pixelRatio: 1 });
  assert.equal(renderer.getStats().objects, 1);
  assert.equal(renderer.getStats().drawCalls, 1);
});

function createFakeCanvas() {
  return {
    clientWidth: 100,
    clientHeight: 80,
    width: 0,
    height: 0,
    style: {},
    getContext(type) {
      return type === "2d" ? createFakeContext() : null;
    }
  };
}

function createFakeContext() {
  return {
    fillStyle: "#000000",
    save() {},
    restore() {},
    setTransform() {},
    fillRect() {},
    scale() {},
    translate() {},
    rotate() {},
    beginPath() {},
    rect() {},
    fill() {},
    stroke() {}
  };
}
