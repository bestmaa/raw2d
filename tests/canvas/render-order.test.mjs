import assert from "node:assert/strict";
import test from "node:test";
import { BasicMaterial, Camera2D, Rect, Scene } from "raw2d-core";
import { Canvas } from "raw2d-canvas";

test("Canvas draws lower zIndex first and higher zIndex last", () => {
  installWindow();
  const context = createFakeContext();
  const canvas = createFakeCanvas(context);
  const raw2dCanvas = new Canvas({ canvas, width: 200, height: 120 });
  const scene = new Scene();
  const front = createRect("front", "#f45b69", 10);
  const back = createRect("back", "#35c2ff", -10);

  scene.add(front);
  scene.add(back);
  raw2dCanvas.render(scene, new Camera2D());

  assert.deepEqual(getDrawColors(context), ["#000000", "#35c2ff", "#f45b69"]);
});

function createRect(name, color, zIndex) {
  return new Rect({
    name,
    width: 40,
    height: 40,
    zIndex,
    material: new BasicMaterial({ fillColor: color })
  });
}

function getDrawColors(context) {
  return context.calls.filter((call) => call.startsWith("fillRect")).map((call) => call.split(":").at(-1));
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
