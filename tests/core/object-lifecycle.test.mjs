import assert from "node:assert/strict";
import test from "node:test";
import {
  Group2D,
  Rect,
  Scene,
  attachObject2D,
  detachObject2D,
  disposeObject2D,
  getObject2DLifecycleState
} from "raw2d-core";

test("Scene add and remove update Object2D lifecycle state", () => {
  const scene = new Scene({ name: "root" });
  const rect = new Rect({ width: 20, height: 10 });

  scene.add(rect);

  assert.deepEqual(getObject2DLifecycleState(rect), {
    parent: scene,
    disposed: false
  });

  scene.remove(rect);

  assert.deepEqual(getObject2DLifecycleState(rect), {
    parent: null,
    disposed: false
  });
});

test("Group2D add, remove, and clear update child lifecycle state", () => {
  const group = new Group2D({ name: "panel" });
  const first = new Rect({ width: 20, height: 10 });
  const second = new Rect({ width: 20, height: 10 });

  group.add(first);
  group.add(second);
  group.remove(first);

  assert.equal(getObject2DLifecycleState(first).parent, null);
  assert.equal(getObject2DLifecycleState(second).parent, group);

  group.clear();

  assert.equal(getObject2DLifecycleState(second).parent, null);
});

test("Lifecycle helpers support explicit adapter ownership", () => {
  const adapterParent = { id: "react-parent", name: "adapter" };
  const rect = new Rect({ width: 20, height: 10 });
  const startVersion = rect.version;

  attachObject2D({ object: rect, parent: adapterParent });

  assert.equal(getObject2DLifecycleState(rect).parent, adapterParent);
  assert.equal(rect.version, startVersion + 1);

  detachObject2D({ object: rect, parent: { id: "other" } });
  assert.equal(getObject2DLifecycleState(rect).parent, adapterParent);

  detachObject2D({ object: rect, parent: adapterParent });
  assert.equal(getObject2DLifecycleState(rect).parent, null);

  disposeObject2D(rect);
  assert.deepEqual(getObject2DLifecycleState(rect), {
    parent: null,
    disposed: true
  });
});
