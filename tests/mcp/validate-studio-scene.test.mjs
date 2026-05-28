import assert from "node:assert/strict";
import test from "node:test";

import { createRaw2DMcpManifest, validateRaw2DStudioScene } from "../../packages/mcp/dist/index.js";
import { dispatchRaw2DMcpTool } from "../../packages/mcp/dist/dispatchRaw2DMcpTool.js";

function createStudioScene(overrides = {}) {
  return {
    version: 1,
    name: "Studio Validation",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    assets: [{ id: "asset-1", type: "image", name: "Hero", width: 64, height: 64, objectIds: ["sprite-1"] }],
    objects: [
      { id: "rect-1", type: "rect", name: "Rect", x: 10, y: 20, width: 100, height: 80 },
      { id: "text-1", type: "text2d", name: "Label", x: 16, y: 48, text: "Studio", font: "20px sans-serif" },
      { id: "sprite-1", type: "sprite", name: "Sprite", x: 48, y: 72, width: 64, height: 64, assetSlot: "asset-1" }
    ],
    ...overrides
  };
}

test("validateRaw2DStudioScene accepts valid Studio scene and command JSON", () => {
  const result = validateRaw2DStudioScene({
    document: createStudioScene(),
    commands: [
      { kind: "create-object", object: { id: "rect-2", type: "rect" }, index: 1 },
      { kind: "update-transform", objectId: "rect-1", before: { x: 10 }, after: { x: 20 } },
      { kind: "update-material", objectId: "rect-1", before: {}, after: { fillColor: "#35c2ff" } },
      { kind: "update-text", objectId: "text-1", before: { text: "Studio" }, after: { text: "Raw2D" } },
      { kind: "set-visibility", objectId: "rect-1", before: true, after: false },
      { kind: "reorder-object", objectId: "sprite-1", fromIndex: 2, toIndex: 0 },
      { kind: "update-sprite-asset", objectId: "sprite-1", beforeAssetSlot: "asset-1", afterAssetSlot: "asset-2" },
      { kind: "batch", commands: [{ kind: "update-transform", objectId: "text-1", before: {}, after: { y: 80 } }] }
    ]
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.warnings, []);
});

test("validateRaw2DStudioScene reports root camera object and asset errors", () => {
  const result = validateRaw2DStudioScene({
    document: createStudioScene({
      version: 2,
      rendererMode: "svg",
      camera: { x: 0, y: Number.NaN, zoom: 0 },
      assets: [
        { id: "asset-1", type: "image", name: "Hero", width: 64, height: 64, objectIds: [] },
        { id: "asset-1", type: "video", name: "", width: 0, height: 64, objectIds: [1] }
      ]
    })
  });

  assert.equal(result.valid, false);
  assert.deepEqual(
    result.errors.map((error) => error.path),
    [
      "$.version",
      "$.rendererMode",
      "$.camera.y",
      "$.camera.zoom",
      "$.assets[1].id",
      "$.assets[1].type",
      "$.assets[1].name",
      "$.assets[1].width",
      "$.assets[1].objectIds[0]"
    ]
  );
});

test("validateRaw2DStudioScene reports duplicate ids and invalid geometry", () => {
  const result = validateRaw2DStudioScene({
    document: createStudioScene({
      objects: [
        { id: "rect-1", type: "rect", name: "Rect", x: 0, y: 0, width: 0, height: 10 },
        { id: "rect-1", type: "circle", name: "Dot", x: 0, y: 0, radius: 0 },
        { id: "line-1", type: "line", name: "Line", x: 0, y: 0, startX: 1, startY: 1, endX: 1, endY: 1 }
      ]
    })
  });

  assert.equal(result.valid, false);
  assert.match(result.errors.map((error) => error.path).join("\n"), /\$\.objects\[0\]\.width/);
  assert.match(result.errors.map((error) => error.path).join("\n"), /\$\.objects\[1\]\.id/);
  assert.match(result.errors.map((error) => error.path).join("\n"), /\$\.objects\[1\]\.radius/);
  assert.match(result.errors.map((error) => error.path).join("\n"), /\$\.objects\[2\]/);
});

test("validateRaw2DStudioScene reports Studio asset references as warnings", () => {
  const result = validateRaw2DStudioScene({
    document: createStudioScene({
      assets: [{ id: "asset-1", type: "image", name: "Hero", width: 64, height: 64, objectIds: ["missing-object"] }],
      objects: [{ id: "sprite-1", type: "sprite", name: "Sprite", x: 0, y: 0, width: 64, height: 64, assetSlot: "missing-asset" }]
    })
  });

  assert.equal(result.valid, true);
  assert.deepEqual(
    result.warnings.map((warning) => warning.path),
    ["$.objects[0].assetSlot", "$.assets.asset-1.objectIds"]
  );
});

test("validateRaw2DStudioScene validates malformed command JSON", () => {
  const result = validateRaw2DStudioScene({
    document: createStudioScene(),
    commands: [
      { kind: "unknown" },
      { kind: "update-transform", objectId: "", before: null, after: [] },
      { kind: "reorder-object", objectId: "rect-1", fromIndex: 0, toIndex: -1 },
      { kind: "batch", commands: "bad" }
    ]
  });

  assert.equal(result.valid, false);
  assert.deepEqual(
    result.errors.map((error) => error.path),
    [
      "$.commands[0].kind",
      "$.commands[1].objectId",
      "$.commands[1].before",
      "$.commands[1].after",
      "$.commands[2].toIndex",
      "$.commands[3].commands"
    ]
  );
});

test("validateRaw2DStudioScene emits WebGL renderer warnings", () => {
  const result = validateRaw2DStudioScene({ document: createStudioScene({ rendererMode: "webgl" }) });

  assert.equal(result.valid, true);
  assert.deepEqual(
    result.warnings.map((warning) => warning.path),
    ["$.rendererMode", "$.objects[1]", "$.objects[2]"]
  );
});

test("Studio scene validator dispatch and manifest expose the MCP tool", () => {
  const result = dispatchRaw2DMcpTool("raw2d_validate_studio_scene", { document: createStudioScene() });
  const manifest = createRaw2DMcpManifest();

  assert.equal(result.valid, true);
  assert.ok(manifest.tools.some((tool) => tool.name === "raw2d_validate_studio_scene"));
});
