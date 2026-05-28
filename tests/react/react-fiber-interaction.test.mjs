import assert from "node:assert/strict";
import test from "node:test";
import { Camera2D, Rect, Scene } from "raw2d";
import {
  attachRaw2DFiberInteractionInstances,
  createRaw2DFiberHostConfig,
  createRaw2DFiberInteractionBridge
} from "raw2d-react-fiber";

test("raw2d-react-fiber interaction bridge attaches host instances", () => {
  const canvas = createCanvasTarget();
  const scene = new Scene();
  const camera = new Camera2D();
  let renderRequests = 0;
  const host = createRaw2DFiberHostConfig();
  const rect = host.createInstance("rawRect", { width: 24, height: 16 });
  const circle = host.createInstance("rawCircle", { radius: 10 });
  const bridge = createRaw2DFiberInteractionBridge({
    canvas,
    camera,
    requestRender: () => {
      renderRequests += 1;
    },
    scene,
    width: 320,
    height: 180
  });

  bridge.enableSelection();
  bridge.enableDrag();
  bridge.enableResize();
  bridge.enableCameraPan();
  bridge.enableCameraZoom();
  bridge.attachInstance(rect, { select: true, drag: true, resize: true });
  attachRaw2DFiberInteractionInstances(bridge, [circle], { select: true });
  bridge.selectInstance(rect);

  assert.deepEqual(bridge.getAttachedObjects(), [rect.object, circle.object]);
  assert.equal(bridge.selection.getPrimary(), rect.object);
  assert.deepEqual(bridge.getSelectedInstances(), [rect]);
  assert.equal(bridge.getSnapshot().camera?.camera.zoom, 1);
  assert.equal(bridge.getSnapshot().selectedInstances[0], rect);
  assert.equal(bridge.getInteractionController(), bridge.interaction);
  assert.equal(bridge.getCameraControls(), bridge.cameraControls);
  assert.ok(renderRequests > 0);

  bridge.detachInstance(rect);

  assert.deepEqual(bridge.getAttachedObjects(), [circle.object]);
  assert.equal(bridge.selection.getPrimary(), null);

  bridge.dispose();

  assert.equal(canvas.listenerCount("pointerdown"), 0);
  assert.equal(canvas.listenerCount("wheel"), 0);
});

test("raw2d-react-fiber interaction bridge supports selection and drag events", () => {
  const canvas = createCanvasTarget();
  const scene = new Scene();
  const host = createRaw2DFiberHostConfig();
  const rect = host.createInstance("rawRect", { width: 40, height: 30, x: 10, y: 10 });
  const bridge = createRaw2DFiberInteractionBridge({ canvas, scene, width: 320, height: 180 });

  host.appendChild(scene, rect);
  bridge.enableSelection();
  bridge.enableDrag();
  bridge.attachInstance(rect, { select: true, drag: true });
  bridge.interaction.handlePointerDown(createPointerEvent({ clientX: 12, clientY: 12 }));
  bridge.interaction.handlePointerMove(createPointerEvent({ clientX: 22, clientY: 18 }));
  bridge.interaction.handlePointerUp(createPointerEvent({ clientX: 22, clientY: 18 }));

  assert.ok(rect.object instanceof Rect);
  assert.equal(bridge.selection.getPrimary(), rect.object);
  assert.equal(rect.object.x, 20);
  assert.equal(rect.object.y, 16);
  assert.equal(bridge.getSnapshot().interaction.mode, "idle");
});

function createPointerEvent(options) {
  return {
    button: 0,
    clientX: options.clientX,
    clientY: options.clientY,
    preventDefault: () => undefined,
    pointerId: 1,
    shiftKey: false
  };
}

function createCanvasTarget() {
  const listeners = new Map();

  return {
    style: { cursor: "" },
    addEventListener(type, listener) {
      listeners.set(type, [...(listeners.get(type) ?? []), listener]);
    },
    removeEventListener(type, listener) {
      listeners.set(type, (listeners.get(type) ?? []).filter((item) => item !== listener));
    },
    getBoundingClientRect() {
      return { height: 180, left: 0, top: 0, width: 320 };
    },
    hasPointerCapture: () => false,
    setPointerCapture: () => undefined,
    releasePointerCapture: () => undefined,
    listenerCount(type) {
      return (listeners.get(type) ?? []).length;
    }
  };
}
