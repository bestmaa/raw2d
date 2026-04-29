import assert from "node:assert/strict";
import test from "node:test";
import { Camera2D, Rect, Scene } from "raw2d-core";
import { Canvas } from "raw2d-canvas";

test("Canvas exposes the shared renderer lifecycle surface", () => {
  const context = createFakeContext();
  const renderer = new Canvas({ canvas: createFakeCanvas(context), width: 100, height: 80, pixelRatio: 1 });
  const scene = new Scene();

  scene.add(new Rect({ x: 10, y: 10, width: 20, height: 20 }));
  renderer.setBackgroundColor("#10141c");
  renderer.render(scene, new Camera2D());
  renderer.clear("#ffffff");
  renderer.dispose();

  assert.deepEqual(renderer.getSize(), { width: 100, height: 80, pixelRatio: 1 });
  assert.equal(renderer.getStats().objects, 1);
  assert.equal(renderer.getStats().drawCalls, 1);
  assert.equal(renderer.getSupport().renderer, "canvas");
  assert.equal(renderer.getSupport().objects.Text2D, "supported");
  assert.deepEqual(renderer.getStats().renderList, { total: 1, accepted: 1, hidden: 0, filtered: 0, culled: 0 });
  assert.equal(context.calls.includes("fillRect:0,0,100,80:#10141c"), true);
  assert.equal(context.calls.includes("fillRect:0,0,100,80:#ffffff"), true);
});

function createFakeCanvas(context) {
  return {
    clientWidth: 100,
    clientHeight: 80,
    width: 0,
    height: 0,
    style: {},
    getContext(type) {
      return type === "2d" ? context : null;
    }
  };
}

function createFakeContext() {
  return {
    calls: [],
    fillStyle: "#000000",
    save() {},
    restore() {},
    setTransform() {},
    fillRect(x, y, width, height) {
      this.calls.push(`fillRect:${x},${y},${width},${height}:${this.fillStyle}`);
    },
    scale() {},
    translate() {},
    rotate() {},
    beginPath() {},
    rect() {},
    fill() {},
    stroke() {}
  };
}
