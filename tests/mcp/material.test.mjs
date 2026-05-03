import assert from "node:assert/strict";
import test from "node:test";

import { addRaw2DSceneObject, createRaw2DSceneJson, updateRaw2DObjectMaterial } from "../../packages/mcp/dist/index.js";

function createSceneWithRect() {
  return addRaw2DSceneObject({
    document: createRaw2DSceneJson(),
    object: {
      type: "rect",
      id: "card",
      width: 120,
      height: 80,
      material: { fillColor: "#35c2ff", lineWidth: 1 }
    }
  });
}

test("updateRaw2DObjectMaterial merges material fields immutably", () => {
  const scene = createSceneWithRect();
  const updated = updateRaw2DObjectMaterial({
    document: scene,
    id: "card",
    material: { strokeColor: "#ffffff", lineWidth: 4 }
  });

  assert.equal(scene.scene.objects[0]?.material?.lineWidth, 1);
  assert.deepEqual(updated.scene.objects[0]?.material, {
    fillColor: "#35c2ff",
    strokeColor: "#ffffff",
    lineWidth: 4
  });
});

test("updateRaw2DObjectMaterial can add material to an unstyled object", () => {
  const scene = addRaw2DSceneObject({
    document: createRaw2DSceneJson(),
    object: { type: "circle", id: "dot", radius: 16 }
  });
  const updated = updateRaw2DObjectMaterial({
    document: scene,
    id: "dot",
    material: { fillColor: "#f97316", opacity: 0.8 }
  });

  assert.deepEqual(updated.scene.objects[0]?.material, { fillColor: "#f97316", opacity: 0.8 });
});

test("updateRaw2DObjectMaterial rejects unknown ids", () => {
  assert.throws(
    () =>
      updateRaw2DObjectMaterial({
        document: createSceneWithRect(),
        id: "missing",
        material: { fillColor: "#000000" }
      }),
    /does not contain object id/
  );
});
