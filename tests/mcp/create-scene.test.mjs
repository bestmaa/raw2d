import assert from "node:assert/strict";
import test from "node:test";

import { createRaw2DSceneJson } from "../../packages/mcp/dist/index.js";

test("createRaw2DSceneJson creates an empty scene with camera defaults", () => {
  const document = createRaw2DSceneJson();

  assert.deepEqual(document, {
    scene: { objects: [] },
    camera: { x: 0, y: 0, zoom: 1 }
  });
});

test("createRaw2DSceneJson accepts finite camera values", () => {
  const document = createRaw2DSceneJson({
    camera: { x: 12, y: -8, zoom: 2 }
  });

  assert.deepEqual(document.camera, { x: 12, y: -8, zoom: 2 });
});

test("createRaw2DSceneJson falls back for invalid camera values", () => {
  const document = createRaw2DSceneJson({
    camera: { x: Number.NaN, y: Number.POSITIVE_INFINITY, zoom: 0 }
  });

  assert.deepEqual(document.camera, { x: 0, y: 0, zoom: 1 });
});
