import assert from "node:assert/strict";
import test from "node:test";
import { Camera2D } from "raw2d-core";
import { CameraControls } from "raw2d-interaction";

function createTarget() {
  const listeners = new Map();
  let capturedPointerId = null;

  return {
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    removeEventListener(type, listener) {
      if (listeners.get(type) === listener) {
        listeners.delete(type);
      }
    },
    getBoundingClientRect() {
      return { left: 0, top: 0, width: 400, height: 300 };
    },
    setPointerCapture(pointerId) {
      capturedPointerId = pointerId;
    },
    hasPointerCapture(pointerId) {
      return capturedPointerId === pointerId;
    },
    releasePointerCapture(pointerId) {
      if (capturedPointerId === pointerId) {
        capturedPointerId = null;
      }
    },
    dispatch(type, event) {
      listeners.get(type)?.(event);
    },
    getListener(type) {
      return listeners.get(type) ?? null;
    }
  };
}

test("camera controls zoom around the pointer", () => {
  const target = createTarget();
  const camera = new Camera2D({ x: 0, y: 0, zoom: 1 });
  const controls = new CameraControls({ target, camera, width: 400, height: 300, zoomSpeed: 0.01 });

  controls.enableZoom();
  controls.handleWheel({ clientX: 200, clientY: 150, deltaY: -100 });

  assert.ok(camera.zoom > 1);
  assert.equal(Math.round(200 / camera.zoom + camera.x), 200);
  assert.equal(Math.round(150 / camera.zoom + camera.y), 150);
});

test("camera controls clamp zoom", () => {
  const target = createTarget();
  const camera = new Camera2D({ zoom: 1 });
  const controls = new CameraControls({ target, camera, minZoom: 0.5, maxZoom: 2, zoomSpeed: 1 });

  controls.enableZoom();
  controls.handleWheel({ clientX: 0, clientY: 0, deltaY: -100 });
  assert.equal(camera.zoom, 2);

  controls.handleWheel({ clientX: 0, clientY: 0, deltaY: 100 });
  assert.equal(camera.zoom, 0.5);
});

test("camera controls pan with configured pointer button", () => {
  const target = createTarget();
  const camera = new Camera2D({ x: 10, y: 20, zoom: 2 });
  const controls = new CameraControls({ target, camera, width: 400, height: 300 });

  controls.enablePan(1);
  controls.handlePointerDown({ clientX: 100, clientY: 100, button: 1, pointerId: 7 });
  controls.handlePointerMove({ clientX: 120, clientY: 140, pointerId: 7 });
  controls.handlePointerUp({ clientX: 120, clientY: 140, pointerId: 7 });

  assert.equal(camera.x, 0);
  assert.equal(camera.y, 0);
  assert.equal(controls.getSnapshot().mode, "idle");
});

test("camera controls dispose removes listeners", () => {
  const target = createTarget();
  const camera = new Camera2D();
  const controls = new CameraControls({ target, camera });

  assert.equal(typeof target.getListener("wheel"), "function");
  assert.equal(typeof target.getListener("pointerdown"), "function");

  controls.dispose();

  assert.equal(target.getListener("wheel"), null);
  assert.equal(target.getListener("pointerdown"), null);
});
