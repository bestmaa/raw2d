import assert from "node:assert/strict";
import test from "node:test";

import {
  createRaw2DMcpManifest,
  createRaw2DMcpSceneEditPlan,
  createRaw2DSceneJson
} from "../../packages/mcp/dist/index.js";
import { dispatchRaw2DMcpTool } from "../../packages/mcp/dist/dispatchRaw2DMcpTool.js";

function createScene() {
  return {
    camera: { x: 0, y: 0, zoom: 1 },
    scene: {
      objects: [
        { type: "rect", id: "card", x: 10, y: 20, width: 100, height: 60, material: { fillColor: "#111111" } },
        { type: "sprite", id: "logo", textureId: "asset-a", frameName: "idle", width: 32, height: 32 },
        { type: "text2d", id: "label", text: "Old", font: "16px sans-serif" }
      ]
    }
  };
}

test("createRaw2DMcpSceneEditPlan creates updates deletes and reorders deterministically", () => {
  const plan = createRaw2DMcpSceneEditPlan({
    document: createScene(),
    operations: [
      { type: "createObject", index: 1, object: { type: "circle", id: "dot", radius: 12 } },
      { type: "updateObject", id: "card", transform: { x: 80, visible: false }, material: { fillColor: "#35c2ff" } },
      { type: "reorderObject", id: "label", index: 0 },
      { type: "deleteObject", id: "dot" }
    ]
  });

  assert.deepEqual(plan.beforeObjectIds, ["card", "logo", "label"]);
  assert.deepEqual(plan.afterObjectIds, ["label", "card", "logo"]);
  assert.deepEqual(plan.affectedObjectIds, ["dot", "card", "label"]);
  assert.deepEqual(
    plan.steps.map((step) => step.id),
    [
      "step-001-createObject-dot",
      "step-002-updateObject-card",
      "step-003-reorderObject-label",
      "step-004-deleteObject-dot"
    ]
  );
  assert.equal(plan.document.scene.objects[1]?.id, "card");
  assert.equal(plan.document.scene.objects[1]?.x, 80);
  assert.equal(plan.document.scene.objects[1]?.visible, false);
  assert.equal(plan.document.scene.objects[1]?.material?.fillColor, "#35c2ff");
});

test("createRaw2DMcpSceneEditPlan updates sprite asset references", () => {
  const plan = createRaw2DMcpSceneEditPlan({
    document: createScene(),
    operations: [
      { type: "setSpriteAsset", id: "logo", textureId: "asset-b", frameName: "hero" },
      { type: "clearSpriteAsset", id: "logo" }
    ]
  });

  const sprite = plan.document.scene.objects.find((object) => object.id === "logo");

  assert.equal(sprite?.type, "sprite");
  assert.equal(sprite?.textureId, "empty");
  assert.equal("frameName" in sprite, false);
  assert.deepEqual(plan.affectedObjectIds, ["logo"]);
});

test("createRaw2DMcpSceneEditPlan rejects unsafe operations", () => {
  assert.throws(
    () =>
      createRaw2DMcpSceneEditPlan({
        document: createScene(),
        operations: [{ type: "createObject", object: { type: "circle", id: "card", radius: 8 } }]
      }),
    /already contains object id/
  );
  assert.throws(
    () =>
      createRaw2DMcpSceneEditPlan({
        document: createScene(),
        operations: [{ type: "reorderObject", id: "missing", index: 0 }]
      }),
    /does not contain object id/
  );
  assert.throws(
    () =>
      createRaw2DMcpSceneEditPlan({
        document: createScene(),
        operations: [{ type: "setSpriteAsset", id: "card", textureId: "asset-b" }]
      }),
    /is not a sprite/
  );
});

test("scene edit plan dispatch and manifest expose the MCP tool", () => {
  const result = dispatchRaw2DMcpTool("raw2d_create_scene_edit_plan", {
    document: createRaw2DSceneJson(),
    operations: [{ type: "createObject", object: { type: "rect", id: "box", width: 10, height: 10 } }]
  });
  const manifest = createRaw2DMcpManifest();

  assert.deepEqual(result.afterObjectIds, ["box"]);
  assert.ok(manifest.tools.some((tool) => tool.name === "raw2d_create_scene_edit_plan"));
});
