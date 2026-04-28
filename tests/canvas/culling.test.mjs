import assert from "node:assert/strict";
import test from "node:test";
import { BasicMaterial, Camera2D, Rect, Scene } from "raw2d-core";
import { Canvas, getVisibleCanvasObjects } from "raw2d-canvas";

test("Canvas render can skip objects outside the camera viewport", () => {
  installWindow();
  const context = createFakeContext();
  const canvas = createFakeCanvas(context);
  const raw2dCanvas = new Canvas({ canvas, width: 200, height: 120, backgroundColor: "#10141c" });
  const scene = new Scene();
  const visibleRect = createRect("#35c2ff", 20);
  const hiddenByCullingRect = createRect("#f45b69", 500);

  scene.add(visibleRect);
  scene.add(hiddenByCullingRect);
  raw2dCanvas.render(scene, new Camera2D(), { culling: true });

  assert.ok(context.calls.includes("fillRect:0,0,40,40:#35c2ff"));
  assert.equal(context.calls.includes("fillRect:0,0,40,40:#f45b69"), false);
});

test("Canvas render keeps old behavior when culling is disabled", () => {
  installWindow();
  const context = createFakeContext();
  const canvas = createFakeCanvas(context);
  const raw2dCanvas = new Canvas({ canvas, width: 200, height: 120, backgroundColor: "#10141c" });
  const scene = new Scene();
  const outsideRect = createRect("#f45b69", 500);

  scene.add(outsideRect);
  raw2dCanvas.render(scene, new Camera2D());

  assert.ok(context.calls.includes("fillRect:0,0,40,40:#f45b69"));
});

test("getVisibleCanvasObjects supports filters", () => {
  const context = createFakeContext();
  const camera = new Camera2D();
  const kept = createRect("#35c2ff", 20, "kept");
  const filtered = createRect("#f45b69", 60, "filtered");
  const visibleObjects = getVisibleCanvasObjects({
    objects: [kept, filtered],
    camera,
    width: 200,
    height: 120,
    context,
    renderOptions: {
      cullingFilter: (object) => object.name === "kept"
    }
  });

  assert.deepEqual(visibleObjects, [kept]);
});

function createRect(color, x, name = "") {
  return new Rect({
    name,
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
