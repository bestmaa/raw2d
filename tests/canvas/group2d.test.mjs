import assert from "node:assert/strict";
import test from "node:test";
import { BasicMaterial, Camera2D, Group2D, Rect, Scene } from "raw2d-core";
import { Canvas } from "raw2d-canvas";

test("Canvas renders Group2D children inside the group transform", () => {
  installWindow();
  const context = createFakeContext();
  const canvas = createFakeCanvas(context);
  const raw2dCanvas = new Canvas({ canvas, width: 200, height: 120 });
  const scene = new Scene();
  const group = new Group2D({ x: 40, y: 30 });
  const rect = createRect("#35c2ff", 12, 8);

  group.add(rect);
  scene.add(group);
  raw2dCanvas.render(scene, new Camera2D());

  const groupTranslateIndex = context.calls.indexOf("translate:40,30");
  const childTranslateIndex = context.calls.indexOf("translate:12,8");
  const drawIndex = context.calls.indexOf("fillRect:0,0,30,20:#35c2ff");

  assert.ok(groupTranslateIndex !== -1);
  assert.ok(childTranslateIndex > groupTranslateIndex);
  assert.ok(drawIndex > childTranslateIndex);
});

test("Canvas sorts Group2D children by zIndex", () => {
  installWindow();
  const context = createFakeContext();
  const canvas = createFakeCanvas(context);
  const raw2dCanvas = new Canvas({ canvas, width: 200, height: 120 });
  const scene = new Scene();
  const group = new Group2D();
  const front = createRect("#f45b69", 0, 0, 10);
  const back = createRect("#35c2ff", 0, 0, -10);

  group.add(front);
  group.add(back);
  scene.add(group);
  raw2dCanvas.render(scene, new Camera2D());

  assert.deepEqual(getDrawColors(context), ["#000000", "#35c2ff", "#f45b69"]);
});

function createRect(color, x, y, zIndex = 0) {
  return new Rect({
    x,
    y,
    width: 30,
    height: 20,
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
