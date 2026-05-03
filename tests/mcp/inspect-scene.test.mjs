import assert from "node:assert/strict";
import test from "node:test";

import { addRaw2DSceneObject, createRaw2DSceneJson, inspectRaw2DScene } from "../../packages/mcp/dist/index.js";

test("inspectRaw2DScene counts objects by type", () => {
  const withRect = addRaw2DSceneObject({
    document: createRaw2DSceneJson(),
    object: { type: "rect", id: "card", width: 120, height: 80 }
  });
  const withSprite = addRaw2DSceneObject({
    document: withRect,
    object: { type: "sprite", id: "logo", textureId: "logo-texture" }
  });
  const inspection = inspectRaw2DScene({ document: withSprite });

  assert.equal(inspection.objectCount, 2);
  assert.deepEqual(inspection.objectTypes, {
    rect: 1,
    circle: 0,
    line: 0,
    text2d: 0,
    sprite: 1
  });
  assert.equal(inspection.usesTextures, true);
  assert.equal(inspection.usesText, false);
});

test("inspectRaw2DScene returns text and batching hints", () => {
  let scene = createRaw2DSceneJson();

  for (let index = 0; index < 101; index += 1) {
    scene = addRaw2DSceneObject({
      document: scene,
      object: { type: "rect", id: `rect-${index}`, width: 8, height: 8 }
    });
  }

  scene = addRaw2DSceneObject({
    document: scene,
    object: { type: "text2d", id: "label", text: "Raw2D" }
  });

  const inspection = inspectRaw2DScene({ document: scene });

  assert.equal(inspection.usesText, true);
  assert.equal(inspection.rendererHints.length, 2);
});
