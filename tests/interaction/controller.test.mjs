import assert from "node:assert/strict";
import test from "node:test";
import { Camera2D, Circle, Rect, Scene } from "raw2d-core";
import { InteractionController, getInteractionPoint } from "raw2d-interaction";

function createCanvas() {
  const listeners = new Map();
  const captured = new Set();

  return {
    style: { cursor: "" },
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    removeEventListener(type) {
      listeners.delete(type);
    },
    getBoundingClientRect() {
      return { left: 0, top: 0, width: 500, height: 250 };
    },
    setPointerCapture(pointerId) {
      captured.add(pointerId);
    },
    hasPointerCapture(pointerId) {
      return captured.has(pointerId);
    },
    releasePointerCapture(pointerId) {
      captured.delete(pointerId);
    },
    getListener(type) {
      return listeners.get(type);
    }
  };
}

test("interaction point converts client coordinates through camera", () => {
  const canvas = createCanvas();
  const camera = new Camera2D({ x: 100, y: 50, zoom: 2 });
  const point = getInteractionPoint({
    canvas,
    camera,
    event: { clientX: 200, clientY: 100 },
    width: 500,
    height: 250
  });

  assert.equal(point.canvasX, 200);
  assert.equal(point.canvasY, 100);
  assert.equal(point.x, 200);
  assert.equal(point.y, 100);
});

test("interaction controller selects and drags a picked object", () => {
  const canvas = createCanvas();
  const scene = new Scene();
  const rect = new Rect({ name: "card", x: 20, y: 30, width: 80, height: 40 });
  const controller = new InteractionController({ canvas, scene, width: 500, height: 250 });

  scene.add(rect);
  controller.enableSelection();
  controller.enableDrag();
  controller.handlePointerDown({ clientX: 30, clientY: 40, pointerId: 1 });
  controller.handlePointerMove({ clientX: 60, clientY: 75, pointerId: 1 });

  assert.equal(controller.getMode(), "dragging");
  assert.deepEqual(controller.getSelection().getSelected(), [rect]);
  assert.equal(rect.x, 50);
  assert.equal(rect.y, 65);

  controller.handlePointerUp({ clientX: 60, clientY: 75, pointerId: 1 });

  assert.equal(controller.getMode(), "idle");
});

test("interaction controller resizes the selected Rect from a handle", () => {
  const canvas = createCanvas();
  const scene = new Scene();
  const rect = new Rect({ name: "card", x: 10, y: 20, width: 80, height: 40 });
  const controller = new InteractionController({ canvas, scene, width: 500, height: 250, minResizeWidth: 20, minResizeHeight: 20 });

  scene.add(rect);
  controller.enableSelection();
  controller.enableResize();
  controller.getSelection().select(rect);
  controller.handlePointerDown({ clientX: 90, clientY: 60, pointerId: 1 });
  controller.handlePointerMove({ clientX: 120, clientY: 95, pointerId: 1 });

  assert.equal(controller.getMode(), "resizing");
  assert.equal(rect.width, 110);
  assert.equal(rect.height, 75);

  controller.handlePointerUp({ clientX: 120, clientY: 95, pointerId: 1 });

  assert.equal(controller.getMode(), "idle");
});

test("interaction controller clears selection when empty canvas is clicked", () => {
  const canvas = createCanvas();
  const scene = new Scene();
  const rect = new Rect({ x: 10, y: 20, width: 80, height: 40 });
  const controller = new InteractionController({ canvas, scene, width: 500, height: 250 });

  scene.add(rect);
  controller.enableSelection();
  controller.getSelection().select(rect);
  controller.handlePointerDown({ clientX: 300, clientY: 200 });

  assert.deepEqual(controller.getSelection().getSelected(), []);
});

test("interaction controller attach limits interaction to one object", () => {
  const canvas = createCanvas();
  const scene = new Scene();
  const rect = new Rect({ name: "card", x: 20, y: 30, width: 80, height: 40 });
  const circle = new Circle({ name: "badge", x: 200, y: 90, radius: 30 });
  const controller = new InteractionController({ canvas, scene, width: 500, height: 250 });

  scene.add(rect);
  scene.add(circle);
  controller.attach(rect);
  controller.handlePointerDown({ clientX: 200, clientY: 90, pointerId: 1 });
  controller.handlePointerMove({ clientX: 240, clientY: 120, pointerId: 1 });

  assert.deepEqual(controller.getSelection().getSelected(), []);
  assert.equal(circle.x, 200);
  assert.equal(circle.y, 90);

  controller.handlePointerDown({ clientX: 30, clientY: 40, pointerId: 2 });

  assert.deepEqual(controller.getSelection().getSelected(), [rect]);
});

test("interaction controller attach can enable only one feature", () => {
  const canvas = createCanvas();
  const scene = new Scene();
  const rect = new Rect({ x: 20, y: 30, width: 80, height: 40 });
  const controller = new InteractionController({ canvas, scene, width: 500, height: 250 });

  scene.add(rect);
  controller.attach(rect, { drag: true });
  controller.handlePointerDown({ clientX: 30, clientY: 40, pointerId: 1 });
  controller.handlePointerMove({ clientX: 45, clientY: 65, pointerId: 1 });

  assert.deepEqual(controller.getSelection().getSelected(), []);
  assert.equal(rect.x, 35);
  assert.equal(rect.y, 55);
});

test("interaction controller attachSelection scopes behavior to selected objects", () => {
  const canvas = createCanvas();
  const scene = new Scene();
  const first = new Rect({ x: 10, y: 20, width: 60, height: 40 });
  const second = new Rect({ x: 110, y: 20, width: 60, height: 40 });
  const third = new Rect({ x: 210, y: 20, width: 60, height: 40 });
  const controller = new InteractionController({ canvas, scene, width: 500, height: 250 });

  scene.add(first);
  scene.add(second);
  scene.add(third);
  controller.getSelection().select(first);
  controller.getSelection().select(second, { append: true });
  controller.attachSelection({ drag: true });
  controller.handlePointerDown({ clientX: 220, clientY: 30, pointerId: 1 });
  controller.handlePointerMove({ clientX: 260, clientY: 70, pointerId: 1 });

  assert.equal(third.x, 210);
  assert.equal(third.y, 20);

  controller.handlePointerDown({ clientX: 120, clientY: 30, pointerId: 2 });
  controller.handlePointerMove({ clientX: 140, clientY: 55, pointerId: 2 });

  assert.equal(second.x, 130);
  assert.equal(second.y, 45);
});
