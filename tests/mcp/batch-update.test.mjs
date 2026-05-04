import assert from "node:assert/strict";
import test from "node:test";

import {
  addRaw2DSceneObject,
  createRaw2DSceneJson,
  updateRaw2DObjects
} from "../../packages/mcp/dist/index.js";

function createScene() {
  const withRect = addRaw2DSceneObject({
    document: createRaw2DSceneJson(),
    object: { type: "rect", id: "card", width: 120, height: 80 }
  });

  return addRaw2DSceneObject({
    document: withRect,
    object: { type: "circle", id: "dot", radius: 20 }
  });
}

test("updateRaw2DObjects applies multiple transform and material updates", () => {
  const scene = createScene();
  const result = updateRaw2DObjects({
    document: scene,
    transforms: [
      { id: "card", transform: { x: 80, y: 40, renderMode: "static" } },
      { id: "dot", transform: { x: 180, y: 60, visible: false } }
    ],
    materials: [{ id: "card", material: { fillColor: "#35c2ff", lineWidth: 2 } }]
  });

  assert.deepEqual(result.updatedIds, ["card", "dot"]);
  assert.equal(scene.scene.objects[0]?.x, undefined);
  assert.equal(result.document.scene.objects[0]?.x, 80);
  assert.equal(result.document.scene.objects[0]?.material?.fillColor, "#35c2ff");
  assert.equal(result.document.scene.objects[1]?.visible, false);
});

test("updateRaw2DObjects rejects unknown ids before returning a partial result", () => {
  assert.throws(
    () =>
      updateRaw2DObjects({
        document: createScene(),
        transforms: [{ id: "missing", transform: { x: 1 } }]
      }),
    /does not contain object id/
  );
});
