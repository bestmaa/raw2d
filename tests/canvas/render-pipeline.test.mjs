import assert from "node:assert/strict";
import test from "node:test";
import { BasicMaterial, Camera2D, Rect, Scene } from "raw2d-core";
import { Canvas } from "raw2d-canvas";

test("Canvas exposes the render list used by the pipeline", () => {
  installWindow();
  const context = createFakeContext();
  const raw2dCanvas = new Canvas({ canvas: createFakeCanvas(context), width: 200, height: 120 });
  const scene = new Scene();
  const visible = createRect("#35c2ff", 20);
  const outside = createRect("#f45b69", 500);

  scene.add(visible);
  scene.add(outside);

  const renderList = raw2dCanvas.createRenderList(scene, new Camera2D(), { culling: true });

  assert.deepEqual(renderList.getObjects(), [visible]);
  assert.equal(renderList.getStats().culled, 1);
});

test("Canvas can render a prebuilt render list", () => {
  installWindow();
  const context = createFakeContext();
  const raw2dCanvas = new Canvas({ canvas: createFakeCanvas(context), width: 200, height: 120 });
  const scene = new Scene();
  const rect = createRect("#35c2ff", 20);
  const renderList = raw2dCanvas.createRenderList(scene, new Camera2D());

  scene.add(rect);
  raw2dCanvas.render(scene, new Camera2D(), { renderList });

  assert.equal(context.calls.includes("fillRect:0,0,40,40:#35c2ff"), false);
});

function createRect(color, x) {
  return new Rect({
    x,
    y: 20,
    width: 40,
    height: 40,
    material: new BasicMaterial({ fillColor: color })
  });
}

function installWindow() {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { devicePixelRatio: 1 }
  });
}

function createFakeCanvas(context) {
  return {
    clientWidth: 200,
    clientHeight: 120,
    width: 0,
    height: 0,
    style: {},
    getContext() {
      return context;
    }
  };
}

function createFakeContext() {
  return {
    calls: [],
    fillStyle: "",
    save() {
      this.calls.push("save");
    },
    restore() {
      this.calls.push("restore");
    },
    setTransform(a, b, c, d, e, f) {
      this.calls.push(`setTransform:${a},${b},${c},${d},${e},${f}`);
    },
    translate(x, y) {
      this.calls.push(`translate:${x},${y}`);
    },
    rotate(rotation) {
      this.calls.push(`rotate:${rotation}`);
    },
    scale(x, y) {
      this.calls.push(`scale:${x},${y}`);
    },
    fillRect(x, y, width, height) {
      this.calls.push(`fillRect:${x},${y},${width},${height}:${this.fillStyle}`);
    }
  };
}

