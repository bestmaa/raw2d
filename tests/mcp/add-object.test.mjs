import assert from "node:assert/strict";
import test from "node:test";

import { addRaw2DSceneObject, createRaw2DSceneJson } from "../../packages/mcp/dist/index.js";

test("addRaw2DSceneObject appends a Rect JSON object immutably", () => {
  const emptyScene = createRaw2DSceneJson();
  const scene = addRaw2DSceneObject({
    document: emptyScene,
    object: {
      type: "rect",
      id: "hero-card",
      x: 80,
      y: 64,
      width: 160,
      height: 96,
      material: { fillColor: "#35c2ff" }
    }
  });

  assert.equal(emptyScene.scene.objects.length, 0);
  assert.equal(scene.scene.objects.length, 1);
  assert.equal(scene.scene.objects[0]?.id, "hero-card");
});

test("addRaw2DSceneObject supports line, circle, text, and sprite JSON", () => {
  const first = addRaw2DSceneObject({
    document: createRaw2DSceneJson(),
    object: { type: "circle", id: "dot", radius: 24, material: { fillColor: "#f97316" } }
  });
  const second = addRaw2DSceneObject({
    document: first,
    object: { type: "line", id: "axis", startX: 0, startY: 0, endX: 120, endY: 0 }
  });
  const third = addRaw2DSceneObject({
    document: second,
    object: { type: "text2d", id: "label", text: "Raw2D", font: "20px sans-serif" }
  });
  const fourth = addRaw2DSceneObject({
    document: third,
    object: { type: "sprite", id: "logo", textureId: "logo-texture", width: 64, height: 64 }
  });

  assert.deepEqual(
    fourth.scene.objects.map((object) => object.type),
    ["circle", "line", "text2d", "sprite"]
  );
});

test("addRaw2DSceneObject rejects duplicate ids", () => {
  const scene = addRaw2DSceneObject({
    document: createRaw2DSceneJson(),
    object: { type: "rect", id: "card", width: 120, height: 80 }
  });

  assert.throws(
    () =>
      addRaw2DSceneObject({
        document: scene,
        object: { type: "circle", id: "card", radius: 20 }
      }),
    /already contains object id/
  );
});
