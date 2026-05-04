import assert from "node:assert/strict";
import test from "node:test";

import * as Mcp from "../../packages/mcp/dist/index.js";

const expectedTools = [
  "raw2d_create_scene",
  "raw2d_add_object",
  "raw2d_update_transform",
  "raw2d_update_material",
  "raw2d_update_objects",
  "raw2d_inspect_scene",
  "raw2d_validate_scene",
  "raw2d_generate_canvas_example",
  "raw2d_generate_webgl_example",
  "raw2d_generate_docs_snippet",
  "raw2d_run_visual_check"
];

test("MCP manifest keeps the expected public tool names", () => {
  const manifest = Mcp.createRaw2DMcpManifest();

  assert.deepEqual(
    manifest.tools.map((tool) => tool.name),
    expectedTools
  );
});

test("MCP public surface exposes deterministic helpers", () => {
  for (const name of getExpectedExports()) {
    assert.equal(typeof Mcp[name], "function", name);
  }
});

test("visual check tool returns command plans without executing them", () => {
  const plan = Mcp.createRaw2DVisualCheckPlan({ target: "all" });

  assert.deepEqual(
    plan.commands.map((command) => command.command),
    ["node", "npm"]
  );
});

function getExpectedExports() {
  return [
    "addRaw2DSceneObject",
    "auditRaw2DPackageExports",
    "createRaw2DMcpManifest",
    "createRaw2DSceneJson",
    "createRaw2DVisualCheckPlan",
    "generateRaw2DCanvasExample",
    "generateRaw2DDocsSnippet",
    "generateRaw2DWebGLExample",
    "inspectRaw2DScene",
    "updateRaw2DObjectMaterial",
    "updateRaw2DObjectTransform",
    "updateRaw2DObjects",
    "validateRaw2DScene"
  ];
}
