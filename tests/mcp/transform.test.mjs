import assert from "node:assert/strict";
import test from "node:test";

import { addRaw2DSceneObject, createRaw2DSceneJson, updateRaw2DObjectTransform } from "../../packages/mcp/dist/index.js";

function createSceneWithRect() {
  return addRaw2DSceneObject({
    document: createRaw2DSceneJson(),
    object: { type: "rect", id: "card", x: 10, y: 20, width: 120, height: 80 }
  });
}

test("updateRaw2DObjectTransform updates transform fields immutably", () => {
  const scene = createSceneWithRect();
  const updated = updateRaw2DObjectTransform({
    document: scene,
    id: "card",
    transform: { x: 40, y: 50, rotation: 0.5, scaleX: 2, visible: false }
  });

  assert.equal(scene.scene.objects[0]?.x, 10);
  assert.equal(updated.scene.objects[0]?.x, 40);
  assert.equal(updated.scene.objects[0]?.y, 50);
  assert.equal(updated.scene.objects[0]?.rotation, 0.5);
  assert.equal(updated.scene.objects[0]?.scaleX, 2);
  assert.equal(updated.scene.objects[0]?.visible, false);
});

test("updateRaw2DObjectTransform keeps non-target objects unchanged", () => {
  const scene = addRaw2DSceneObject({
    document: createSceneWithRect(),
    object: { type: "circle", id: "dot", radius: 16 }
  });
  const updated = updateRaw2DObjectTransform({
    document: scene,
    id: "dot",
    transform: { zIndex: 4, renderMode: "static" }
  });

  assert.equal(updated.scene.objects[0], scene.scene.objects[0]);
  assert.equal(updated.scene.objects[1]?.zIndex, 4);
  assert.equal(updated.scene.objects[1]?.renderMode, "static");
});

test("updateRaw2DObjectTransform rejects unknown ids", () => {
  assert.throws(
    () =>
      updateRaw2DObjectTransform({
        document: createSceneWithRect(),
        id: "missing",
        transform: { x: 1 }
      }),
    /does not contain object id/
  );
});
