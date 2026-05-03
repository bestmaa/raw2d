import assert from "node:assert/strict";
import test from "node:test";

import { addRaw2DSceneObject, createRaw2DSceneJson, validateRaw2DScene } from "../../packages/mcp/dist/index.js";

test("validateRaw2DScene accepts a valid scene document", () => {
  const scene = addRaw2DSceneObject({
    document: createRaw2DSceneJson(),
    object: { type: "rect", id: "card", width: 120, height: 80 }
  });
  const result = validateRaw2DScene({ document: scene });

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test("validateRaw2DScene reports invalid camera and object fields", () => {
  const result = validateRaw2DScene({
    document: {
      camera: { x: 0, y: Number.NaN, zoom: 0 },
      scene: {
        objects: [
          { type: "rect", id: "card", width: -1, height: 80 },
          { type: "circle", id: "card", radius: 12 },
          { type: "sprite", id: "logo" },
          { type: "unknown", id: "bad" }
        ]
      }
    }
  });

  assert.equal(result.valid, false);
  assert.deepEqual(
    result.errors.map((error) => error.path),
    ["$.camera.y", "$.camera.zoom", "$.scene.objects[0].width", "$.scene.objects[1].id", "$.scene.objects[2].textureId", "$.scene.objects[3].type"]
  );
});

test("validateRaw2DScene reports malformed root data", () => {
  const result = validateRaw2DScene({ document: null });

  assert.equal(result.valid, false);
  assert.deepEqual(result.errors, [{ path: "$", message: "Scene document must be an object." }]);
});
