import assert from "node:assert/strict";
import test from "node:test";
import { Camera2D, Object2D, Rect, Scene, getVisibleObjects } from "raw2d-core";

test("getVisibleObjects returns bounds-capable objects inside camera bounds", () => {
  const scene = new Scene();
  const camera = new Camera2D({ x: 0, y: 0, zoom: 1 });
  const inside = new Rect({ name: "inside", x: 20, y: 20, width: 50, height: 50 });
  const outside = new Rect({ name: "outside", x: 900, y: 20, width: 50, height: 50 });

  scene.add(inside);
  scene.add(outside);

  assert.deepEqual(getVisibleObjects({ scene, camera, width: 800, height: 600 }), [inside]);
});

test("getVisibleObjects applies camera pan and zoom", () => {
  const scene = new Scene();
  const camera = new Camera2D({ x: 400, y: 0, zoom: 2 });
  const visible = new Rect({ name: "visible", x: 700, y: 20, width: 50, height: 50 });
  const hidden = new Rect({ name: "hidden", x: 100, y: 20, width: 50, height: 50 });

  scene.add(visible);
  scene.add(hidden);

  assert.deepEqual(getVisibleObjects({ scene, camera, width: 800, height: 600 }), [visible]);
});

test("getVisibleObjects skips invisible and unsupported objects by default", () => {
  const scene = new Scene();
  const camera = new Camera2D();
  const invisible = new Rect({ x: 20, y: 20, width: 50, height: 50, visible: false });
  const unsupported = new Object2D({ x: 20, y: 20 });

  scene.add(invisible);
  scene.add(unsupported);

  assert.deepEqual(getVisibleObjects({ scene, camera, width: 800, height: 600 }), []);
  assert.deepEqual(getVisibleObjects({ scene, camera, width: 800, height: 600, includeInvisible: true }), [invisible]);
});

test("getVisibleObjects supports filtering", () => {
  const scene = new Scene();
  const camera = new Camera2D();
  const first = new Rect({ name: "first", x: 20, y: 20, width: 50, height: 50 });
  const second = new Rect({ name: "second", x: 120, y: 20, width: 50, height: 50 });

  scene.add(first);
  scene.add(second);

  assert.deepEqual(
    getVisibleObjects({ scene, camera, width: 800, height: 600, filter: (object) => object.name === "second" }),
    [second]
  );
});
